import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { useAuth } from "../lib/auth"
import { Shield, User, Mail, Save, LogOut, AlertTriangle, Eye, EyeOff, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../lib/config"

export function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(user?.email || "")
  const [fullName, setFullName] = useState(user?.full_name || "")
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false })

  const handleSave = async () => {
    setMessage("")
    setError("")
    
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/users/me`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: user?.username, email, full_name: fullName })
      })

      if (response.ok) {
        setMessage("Profile updated successfully!")
        localStorage.setItem("user", JSON.stringify({ username: user?.username, email, full_name: fullName }))
      } else {
        const err = await response.json()
        setError(err.detail || "Failed to update profile")
      }
    } catch (e) {
      setError("An error occurred")
    }
  }

  const handleChangePassword = async () => {
    setMessage("")
    setError("")
    
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }
    
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/change-password`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
      })

      if (response.ok) {
        setMessage("Password changed successfully!")
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setShowPasswordForm(false)
      } else {
        const err = await response.json()
        setError(err.detail || "Failed to change password")
      }
    } catch (e) {
      setError("An error occurred")
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  if (!user) {
    navigate("/")
    return null
  }

  return (
    <div className="min-h-screen">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-accent" />
            <span className="font-display text-lg">ViolenceDetect</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </nav>

      <main className="pt-24 pb-12">
        <div className="mx-auto max-w-2xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-bg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-display text-2xl">Profile Settings</h2>
                  <p className="text-sm text-muted-foreground">Manage your account</p>
                </div>
              </div>

              {message && (
                <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-500 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {message}
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    value={user?.username || ""}
                    className="w-full h-12 px-4 rounded-xl border border-border bg-muted cursor-not-allowed"
                    disabled
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Username cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-transparent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-transparent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button className="flex-1" onClick={handleSave}>
                  <Save className="h-5 w-5" />
                  Save Changes
                </Button>
              </div>
            </Card>

            <Card className="mt-6 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-bg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl">Change Password</h2>
                    <p className="text-sm text-muted-foreground">Update your password</p>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                >
                  {showPasswordForm ? "Cancel" : "Change"}
                </Button>
              </div>

              {showPasswordForm && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.old ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full h-12 px-4 pr-12 rounded-xl border border-border bg-transparent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(p => ({ ...p, old: !p.old }))}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        {showPasswords.old ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full h-12 px-4 pr-12 rounded-xl border border-border bg-transparent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        {showPasswords.new ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-12 px-4 pr-12 rounded-xl border border-border bg-transparent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        {showPasswords.confirm ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                      </button>
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleChangePassword}>
                    Update Password
                  </Button>
                </div>
              )}
            </Card>

            <Card className="mt-6 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="font-display text-xl">Danger Zone</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Once you logout, you'll need to login again to access the video analysis features.
              </p>
              <Button variant="secondary" onClick={() => setShowLogoutConfirm(true)}>
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </Card>
          </motion.div>
        </div>
      </main>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setShowLogoutConfirm(false)} />
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="relative z-10 w-full max-w-md mx-4"
          >
            <Card className="p-6">
              <h3 className="font-display text-xl text-center">Confirm Logout</h3>
              <p className="mt-2 text-center text-muted-foreground">
                Are you sure you want to logout?
              </p>
              <div className="mt-6 flex gap-4">
                <Button variant="secondary" className="flex-1" onClick={() => setShowLogoutConfirm(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  )
}