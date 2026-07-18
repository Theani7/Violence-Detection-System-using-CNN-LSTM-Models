import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../lib/auth"
import { Button } from "./Button"
import { motion } from "framer-motion"
import { LogIn, UserPlus, AlertCircle, X } from "lucide-react"

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

  // Sync mode + reset form whenever the modal opens or the requested mode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setUsername("")
      setPassword("")
      setEmail("")
      setFullName("")
      setError("")
    }
  }, [isOpen, initialMode])

  const validateForm = (): string | null => {
    if (username.trim().length < 3) {
      return "Username must be at least 3 characters long"
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long"
    }
    if (mode === "register") {
      if (!email.trim()) return "Email is required"
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) return "Please enter a valid email address"
    }
    if (fullName.trim() && fullName.trim().length < 2) {
      return "Full name must be at least 2 characters long if provided"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
      navigate("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="relative rounded-[40px] border border-ash bg-parchment p-8 shadow-md">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 p-2 text-smoke transition-colors hover:text-off-black"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-ash bg-periwinkle-mist">
              {mode === "login" ? (
                <LogIn className="h-7 w-7 text-lake-blue" />
              ) : (
                <UserPlus className="h-7 w-7 text-lake-blue" />
              )}
            </div>
            <h2 className="font-display text-[32px] tracking-[-0.02em] text-off-black">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="mt-2 font-mono text-[14px] text-graphite">
              {mode === "login"
                ? "Sign in to keep analyzing videos"
                : "Sign up to start detecting violence"}
            </p>
          </div>

          <div className="mb-6 flex gap-1 rounded-full border border-ash bg-parchment p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 rounded-full py-2.5 font-mono text-[14px] uppercase tracking-tight transition-all ${
                mode === "login" ? "bg-off-black text-white" : "text-smoke hover:text-off-black"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 rounded-full py-2.5 font-mono text-[14px] uppercase tracking-tight transition-all ${
                mode === "register" ? "bg-off-black text-white" : "text-smoke hover:text-off-black"
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-[16px] border border-coral/40 bg-coral/10 p-3 font-mono text-[13px] text-off-black">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-crimson" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block font-mono text-[12px] uppercase tracking-tight text-smoke">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                className="h-12 w-full rounded-[16px] border border-ash bg-parchment px-4 font-mono text-[14px] text-off-black outline-none transition-all focus:border-lake-blue focus:ring-2 focus:ring-lake-blue/30"
                required
              />
            </div>

            {mode === "register" && (
              <>
                <div>
                  <label className="mb-2 block font-mono text-[12px] uppercase tracking-tight text-smoke">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full rounded-[16px] border border-ash bg-parchment px-4 font-mono text-[14px] text-off-black outline-none transition-all focus:border-lake-blue focus:ring-2 focus:ring-lake-blue/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[12px] uppercase tracking-tight text-smoke">Full name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 w-full rounded-[16px] border border-ash bg-parchment px-4 font-mono text-[14px] text-off-black outline-none transition-all focus:border-lake-blue focus:ring-2 focus:ring-lake-blue/30"
                  />
                </div>
              </>
            )}

            <div>
              <label className="mb-2 block font-mono text-[12px] uppercase tracking-tight text-smoke">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-[16px] border border-ash bg-parchment px-4 font-mono text-[14px] text-off-black outline-none transition-all focus:border-lake-blue focus:ring-2 focus:ring-lake-blue/30"
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting
                ? "Please wait..."
                : mode === "login"
                ? "Sign in"
                : "Create account"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default AuthModal
