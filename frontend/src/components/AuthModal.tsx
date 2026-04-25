import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../lib/auth"
import { Card } from "./Card"
import { Button } from "./Button"
import { motion } from "framer-motion"
import { LogIn, UserPlus, AlertCircle } from "lucide-react"

export function AuthModal({ isOpen, onClose, mode: initialMode = "login" }: { isOpen: boolean; onClose: () => void; mode?: "login" | "register" }) {
  const [mode, setMode] = useState<"login" | "register">(initialMode)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const { login, register } = useAuth()

  // Reset form when switching modes
  useEffect(() => {
    setUsername("")
    setPassword("")
    setEmail("")
    setFullName("")
    setError("")
  }, [mode])

  const validateForm = (): string | null => {
    // Username validation
    if (username.trim().length < 3) {
      return "Username must be at least 3 characters long"
    }
    
    // Password validation
    if (password.length < 6) {
      return "Password must be at least 6 characters long"
    }
    
    // Email validation (only in register mode)
    if (mode === "register") {
      if (!email.trim()) {
        return "Email is required"
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return "Please enter a valid email address"
      }
    }
    
    // Full name validation (optional but if provided)
    if (fullName.trim() && fullName.trim().length < 2) {
      return "Full name must be at least 2 characters long if provided"
    }
    
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form first
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }
    
    setError("")
    setIsSubmitting(true)

    try {
      if (mode === "login") {
        await login(username, password)
      } else {
        await register(username, password, email, fullName)
      }
      onClose()
      setUsername("")
      setPassword("")
      setEmail("")
      setFullName("")
      navigate("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <Card className="p-8">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full gradient-bg">
              {mode === "login" ? (
                <LogIn className="h-8 w-8 text-white" />
              ) : (
                <UserPlus className="h-8 w-8 text-white" />
              )}
            </div>
            <h2 className="font-display text-2xl">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-muted-foreground mt-2">
              {mode === "login"
                ? "Sign in to continue analyzing videos"
                : "Sign up to start detecting violence"}
            </p>
          </div>

          <div className="flex gap-2 mb-6 p-1 bg-muted rounded-xl">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                mode === "login"
                  ? "gradient-bg text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                mode === "register"
                  ? "gradient-bg text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-border bg-transparent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background outline-none transition-all"
                required
              />
            </div>

            {mode === "register" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-transparent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-transparent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background outline-none transition-all"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-border bg-transparent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background outline-none transition-all"
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}