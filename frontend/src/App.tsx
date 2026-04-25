import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "./components/Button"
import { Card } from "./components/Card"
import { SectionLabel } from "./components/SectionLabel"
import { AuthModal } from "./components/AuthModal"
import { checkHealth } from "./lib/api"
import { useAuth } from "./lib/auth"
import { Shield, Eye, Zap, Activity, Lock, Globe, Mail } from "lucide-react"

function App() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    checkHealth().catch(() => {})
  }, [])

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode)
    setShowAuth(true)
  }

  return (
    <div className="min-h-screen">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-accent" />
            <span className="font-display text-lg">ViolenceDetect</span>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground">About</a>
            {user ? (
              <>
                <Button size="sm" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/profile")}>
                  Profile
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => openAuth("login")}>
                  Login
                </Button>
                <Button size="sm" onClick={() => openAuth("register")}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? (
              <motion.div animate={{ rotate: 90 }}>×</motion.div>
            ) : (
              <span>☰</span>
            )}
          </button>
        </div>

        {showMenu && (
          <div className="md:hidden border-t border-border bg-background px-6 py-4">
            <div className="space-y-4">
              <a href="#features" className="block text-sm">Features</a>
              <a href="#about" className="block text-sm">About</a>
              {user ? (
                <div className="space-y-2">
                  <Button className="w-full" onClick={() => navigate("/dashboard")}>Dashboard</Button>
                  <Button variant="ghost" className="w-full" onClick={() => navigate("/profile")}>Profile</Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full" onClick={() => openAuth("login")}>Login</Button>
                  <Button className="w-full" onClick={() => openAuth("register")}>Sign Up</Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="pt-16">
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 dot-pattern" />
          <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-accent blur-[150px] opacity-10" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent-secondary blur-[150px] opacity-10" />
          
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <SectionLabel pulse>AI-Powered Detection</SectionLabel>
              </motion.div>
              
              <motion.h1
                className="mt-6 font-display text-5xl leading-[1.05] md:text-6xl lg:text-[5.25rem]"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Detect Violence in{" "}
                <span className="gradient-text">Videos</span>
              </motion.h1>
              
              <motion.p
                className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Advanced CNN-LSTM model analyzes video sequences to identify violent 
                content with 97% accuracy. Fast, reliable, and automated detection.
              </motion.p>
              
              <motion.div
                className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                {user ? (
              <Button size="lg" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
                <Zap className="h-5 w-5" />
              </Button>
            ) : (
                  <>
                    <Button size="lg" onClick={() => openAuth("register")}>
                      Get Started Free
                      <Zap className="h-5 w-5" />
                    </Button>
                    <Button variant="secondary" size="lg" onClick={() => openAuth("login")}>
                      Login
                    </Button>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { icon: Eye, title: "Frame Extraction", desc: "Extracts 10 frames from each video to capture temporal dynamics and motion patterns." },
                { icon: Zap, title: "CNN Feature Extraction", desc: "MobileNetV2 extracts high-level visual features from each frame." },
                { icon: Activity, title: "LSTM Classification", desc: "LSTM processes sequences to understand temporal context." },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 * i }}
                >
                  <Card hover className="h-full p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-bg">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-display text-xl mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-foreground py-20 text-background md:py-28">
          <div className="absolute inset-0 dot-pattern opacity-10" />
          
          <div className="relative mx-auto max-w-6xl px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <SectionLabel className="border-accent/30 bg-accent/5">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Statistics
              </SectionLabel>
              <h2 className="mt-6 font-display text-3xl md:text-4xl">System Performance</h2>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-4">
              {[
                { value: "97%", label: "Model Accuracy" },
                { value: "10", label: "Frames Analyzed" },
                { value: "<2s", label: "Processing Time" },
                { value: "24/7", label: "API Availability" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 * i }}
                >
                  <div className="font-display text-4xl gradient-text">{item.value}</div>
                  <p className="mt-2 text-white/70">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <SectionLabel>Security</SectionLabel>
              <h2 className="mt-6 font-display text-3xl md:text-4xl">Your Data is Protected</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                All video uploads are processed securely. We use JWT authentication and encrypted 
                connections to ensure your data remains private.
              </p>
              <div className="mt-8 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-accent" />
                  <span>JWT Auth</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-accent" />
                  <span>Encrypted</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="border-t border-border bg-muted py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-6 w-6 text-accent" />
                  <span className="font-display text-lg">ViolenceDetect</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI-powered violence detection system using CNN-LSTM models.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#features" className="hover:text-accent">Features</a></li>
                  <li><a href="#about" className="hover:text-accent">About</a></li>
                  <li><a href="https://github.com/Theani7" target="_blank" className="hover:text-accent">GitHub</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-4">Authors</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Anil Paneru</li>
                  <li>Rahul Mishra</li>
                  <li>Mahesh Karki</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-4">Connect</h4>
                <div className="flex gap-4">
                  <a href="https://github.com/Theani7" target="_blank" className="text-muted-foreground hover:text-accent">
                    <Globe className="h-5 w-5" />
                  </a>
                  <a href="mailto:anilpaneru@example.com" className="text-muted-foreground hover:text-accent">
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © 2024 Violence Detection System. All rights reserved.
              </p>
              <p className="text-sm text-muted-foreground">
                Built by Anil Paneru, Rahul Mishra, and Mahesh Karki
              </p>
            </div>
          </div>
        </footer>
      </main>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} mode={authMode} />
    </div>
  )
}

export default App