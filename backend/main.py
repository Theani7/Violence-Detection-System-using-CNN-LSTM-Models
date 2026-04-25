import os
import sqlite3
import numpy as np
import cv2
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import tempfile
import shutil

app = FastAPI()

# Environment variables with defaults
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,https://*.vercel.app,https://violence-detection-system-using-cnn.vercel.app").split(",")
SECRET_KEY = os.getenv("SECRET_KEY", "violence-detection-secret-key-change-in-production-2024-v2")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("TOKEN_EXPIRE_MINUTES", "10080"))  # 7 days default
# Use /tmp for SQLite on Render (ephemeral filesystem)
DB_PATH = os.getenv("DB_PATH") or os.path.join(os.path.dirname(__file__), os.getenv("DB_NAME", "users.db"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRAME_SEQUENCE_LENGTH = 10
FRAME_HEIGHT = 160
FRAME_WIDTH = 160

model = None
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL,
        email TEXT,
        full_name TEXT,
        disabled INTEGER DEFAULT 0
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        filename TEXT,
        is_violence INTEGER,
        confidence REAL,
        timestamp TEXT
    )''')
    conn.commit()
    conn.close()

def get_db_user(username: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = c.fetchone()
    conn.close()
    return user

def create_db_user(username: str, password: str, email: str = None, full_name: str = None):
    hashed = get_password_hash(password)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO users (username, password, email, full_name) VALUES (?, ?, ?, ?)",
              (username, hashed, email, full_name))
    conn.commit()
    conn.close()

def verify_db_password(username: str, password: str) -> bool:
    user = get_db_user(username)
    if not user:
        return False
    return verify_password(password, user["password"])

def save_history(username: str, filename: str, is_violence: bool, confidence: float):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO history (username, filename, is_violence, confidence, timestamp) VALUES (?, ?, ?, ?, ?)",
              (username, filename, 1 if is_violence else 0, confidence, datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()

def get_user_history(username: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM history WHERE username = ? ORDER BY id DESC", (username,))
    results = c.fetchall()
    conn.close()
    return results

class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserCreate(BaseModel):
    username: str
    password: str
    email: Optional[str] = None
    full_name: Optional[str] = None

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": int(expire.timestamp())})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        
        exp = payload.get("exp")
        if exp:
            exp_timestamp = int(exp) if isinstance(exp, (int, float)) else int(datetime.fromisoformat(exp).timestamp())
            if exp_timestamp < int(datetime.utcnow().timestamp()):
                raise credentials_exception
        
        token_data = TokenData(username=username)
    except JWTError as e:
        print(f"JWT Error: {e}")
        raise credentials_exception
    
    user = get_db_user(token_data.username)
    if user is None:
        raise credentials_exception
    return User(username=user["username"], email=user["email"], full_name=user["full_name"], disabled=bool(user["disabled"]))

def load_detection_model():
    global model
    try:
        from tensorflow import keras
        # Use absolute path or environment variable for model
        model_base_path = os.getenv("MODEL_PATH") or os.path.join(os.path.dirname(__file__), "..", "Alert")
        model_file = os.getenv("MODEL_FILE", "best_lstm_model_v3.keras")
        MODEL_PATH = os.path.join(model_base_path, model_file)
        model = keras.models.load_model(MODEL_PATH, compile=False)
        print(f"Model loaded successfully from {MODEL_PATH}")
    except Exception as e:
        print(f"Error loading model: {e}")

def preprocess_video(video_path, target_frames=FRAME_SEQUENCE_LENGTH):
    cap = cv2.VideoCapture(video_path)
    frames = []
    
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total_frames == 0:
        cap.release()
        raise ValueError("Empty video file")
    
    frame_indices = np.linspace(0, total_frames - 1, target_frames, dtype=int)
    
    for idx in frame_indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if ret:
            frame = cv2.resize(frame, (FRAME_WIDTH, FRAME_HEIGHT))
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame = frame / 255.0
            frames.append(frame)
    
    cap.release()
    
    if len(frames) < target_frames:
        while len(frames) < target_frames:
            frames.append(frames[-1] if frames else np.zeros((FRAME_WIDTH, FRAME_HEIGHT, 3)))
    
    return np.array(frames)

def predict_video(video_path):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    preprocessed_frames = preprocess_video(video_path)
    preprocessed_frames = np.expand_dims(preprocessed_frames, axis=0)
    
    prediction = model.predict(preprocessed_frames, verbose=0)[0][0]
    
    return float(prediction)

@app.on_event("startup")
async def startup_event():
    init_db()
    load_detection_model()

@app.get("/")
async def root():
    return {"message": "Violence Detection API", "version": "1.0", "auth_enabled": True}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/register", status_code=201)
async def register(user: UserCreate):
    existing = get_db_user(user.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    create_db_user(user.username, user.password, user.email, user.full_name or user.username)
    return {"message": "User created successfully", "username": user.username}

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_db_user(form_data.username)
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name
    }

@app.post("/detect")
async def detect_violence(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    if not file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a video file.")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp_file:
        shutil.copyfileobj(file.file, tmp_file)
        tmp_path = tmp_file.name
    
    try:
        prediction = predict_video(tmp_path)
        
        is_violence = prediction > 0.5
        confidence = prediction if is_violence else (1 - prediction)
        
        save_history(current_user.username, file.filename, is_violence, round(confidence * 100, 2))
        
        result = {
            "is_violence": bool(is_violence),
            "confidence": round(confidence * 100, 2),
            "prediction": round(prediction * 100, 2),
            "user": current_user.username
        }
        
        return JSONResponse(content=result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")
    
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@app.get("/history")
async def get_history(current_user: User = Depends(get_current_user)):
    history = get_user_history(current_user.username)
    return {
        "history": [
            {
                "id": h["id"],
                "filename": h["filename"],
                "is_violence": bool(h["is_violence"]),
                "confidence": h["confidence"],
                "timestamp": h["timestamp"]
            }
            for h in history
        ],
        "total": len(history)
    }

@app.get("/stats")
async def get_stats(current_user: User = Depends(get_current_user)):
    history = get_user_history(current_user.username)
    total = len(history)
    violence_count = sum(1 for h in history if h["is_violence"])
    non_violence_count = total - violence_count
    
    return {
        "total": total,
        "violence_detected": violence_count,
        "non_violence": non_violence_count,
        "violence_percentage": round(violence_count / total * 100, 2) if total > 0 else 0
    }

@app.post("/change-password")
async def change_password(
    old_password: str,
    new_password: str,
    current_user: User = Depends(get_current_user)
):
    user = get_db_user(current_user.username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not verify_password(old_password, user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect old password")
    
    hashed = get_password_hash(new_password)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("UPDATE users SET password = ? WHERE username = ?", (hashed, current_user.username))
    conn.commit()
    conn.close()
    
    return {"message": "Password changed successfully"}

@app.post("/share/{history_id}")
async def share_result(
    history_id: int,
    current_user: User = Depends(get_current_user)
):
    history = get_user_history(current_user.username)
    item = next((h for h in history if h["id"] == history_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="History not found")
    
    share_token = f"vd_{history_id}_{datetime.utcnow().timestamp()}"
    
    return {
        "share_id": share_token,
        "filename": item["filename"],
        "is_violence": bool(item["is_violence"]),
        "confidence": item["confidence"],
        "timestamp": item["timestamp"],
        "shared_by": current_user.username
    }

@app.get("/export")
async def export_history(
    format: str = "json",
    current_user: User = Depends(get_current_user)
):
    history = get_user_history(current_user.username)
    
    if format == "csv":
        import csv
        import io
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["ID", "Filename", "Is Violence", "Confidence", "Timestamp"])
        for h in history:
            writer.writerow([
                h["id"],
                h["filename"],
                "Yes" if h["is_violence"] else "No",
                h["confidence"],
                h["timestamp"]
            ])
        
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=violence_detection_history.csv"}
        )
    
    return {
        "history": [
            {
                "id": h["id"],
                "filename": h["filename"],
                "is_violence": bool(h["is_violence"]),
                "confidence": h["confidence"],
                "timestamp": h["timestamp"]
            }
            for h in history
        ],
        "total": len(history)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)