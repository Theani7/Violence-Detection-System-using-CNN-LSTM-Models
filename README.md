# Violence Detection System using CNN & LSTM Models

![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Framework](https://img.shields.io/badge/Framework-TensorFlow%20%7C%20Keras-orange)
![Status](https://img.shields.io/badge/Status-Active-success)

## Project Description
This project is a deep learning-based system designed to detect violence in videos. It utilizes a combination of **MobileNetV2** for feature extraction and **LSTM (Long Short-Term Memory)** networks for capturing temporal dependencies in video sequences. The system achieves high accuracy and is capable of real-time processing.

## Features
- **Real-time Violence Detection**: Processes video streams to detect violent activities.
- **Telegram Alerts**: Sends real-time alerts to a Telegram group/chat including:
    - Text notifications with probability scores.
    - Snapshots of the detected violence.
    - Short video clips of the incident.
- **CSV Logging**: Logs all detection events with timestamps and details to a CSV file (`violence_log.csv`).
- **Image Enhancement**: Optional enhancement of captured frames for better visibility.

## Model Architecture
The model architecture consists of:
1.  **MobileNetV2**: Pre-trained on ImageNet, used as a feature extractor for each frame.
2.  **TimeDistributed Layer**: Applies MobileNetV2 to every frame in the input sequence.
3.  **LSTM Layers**: Two LSTM layers to learn temporal patterns from the sequence of features.
4.  **Dense Layers**: Fully connected layers for final classification (Violence vs. Non-Violence).

## Performance
- **Accuracy**: The model achieves an accuracy of approximately **97%** on the test set.
- **Efficiency**: Designed for real-time inference using the lightweight MobileNetV2 architecture.

## Detailed Methodology
The system follows a robust pipeline for detecting violence:
1.  **Preprocessing**:
    -   Videos are processed to extract a sequence of **10 frames** uniformly distributed across the video duration.
    -   Frames are resized to **160x160** pixels and normalized.
    -   Data augmentation (rotation, zooming, horizontal flips) is applied during training to increase dataset diversity.
2.  **Feature Extraction (MobileNetV2)**:
    -   Each frame in the sequence is passed through a **MobileNetV2** network (pre-trained on ImageNet).
    -   This step converts raw pixel data into high-level feature vectors, capturing essential visual information.
3.  **Temporal Analysis (LSTM)**:
    -   The sequence of feature vectors is fed into **LSTM layers**.
    -   The LSTM network analyzes the change in features over time to detect motion patterns characteristic of violence (e.g., rapid movements, fighting).
4.  **Classification**:
    -   The output of the LSTM layers is passed through fully connected (Dense) layers.
    -   A final **Sigmoid** activation function outputs a probability score between 0 and 1 (0 = Non-Violence, 1 = Violence).

## Dataset
The model is trained on the **[Real Life Violence Situations Dataset](https://www.kaggle.com/datasets/mohamedmustafa/real-life-violence-situations-dataset)**, containing:
-   **1000 Violence videos**: Real-world footage of fights, assaults, etc.
-   **1000 Non-Violence videos**: Normal daily activities, sports, etc.

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Theani7/Violence-Detection-System-using-CNN-LSTM-Models.git
    cd Violence-Detection-System-using-CNN-LSTM-Models
    ```

2.  Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Usage

### 1. Training the Model
To train the model from scratch or fine-tune it:
1.  Open the notebook `Violence Detection model traning/mobilenetv2-with-lstm-with-97-accuracy.ipynb`.
2.  Update the dataset paths if necessary.
3.  Run the cells to train the model.
4.  The best model will be saved as `best_lstm_model_final.keras`.

### 2. Running the Alert System
To run the violence detection system on a video file:
1.  Ensure you have the trained model `best_lstm_model_final.keras` in the project directory.
2.  Open the notebook `Alert/Alert.ipynb` or convert it to a Python script.
3.  Configure the settings in the `print_results` function call:
    - `video_path`: Path to the input video.
    - `telegram_token`: Your Telegram Bot API token.
    - `telegram_chat_id`: Your Telegram Chat ID.
4.  Run the script.

**Example Code Snippet:**
```python
results = print_results(
    video_path="path/to/video.mp4",
    model_path="best_lstm_model_final.keras",
    telegram_token="YOUR_TOKEN",
    telegram_chat_id="YOUR_CHAT_ID"
)
```

## Requirements
See `requirements.txt` for the full list of dependencies.
