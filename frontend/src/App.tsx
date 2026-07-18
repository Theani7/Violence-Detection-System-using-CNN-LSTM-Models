import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./components/Button"
import { SectionLabel } from "./components/SectionLabel"
import { TrainingPipeline } from "./components/TrainingPipeline"
import { AuthModal } from "./components/AuthModal"
import { checkHealth } from "./lib/api"
import { useAuth } from "./lib/auth"
import { Zap, Lock, FileVideo, BarChart3, Layers, ArrowRight, Check, Cpu, Network, Gauge, Menu, X } from "lucide-react"
import { useInView } from "framer-motion"

function CountUp({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const num = parseFloat(value)
  const decimals = (value.split(".")[1] || "").length
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf = 0
    const start = performance.now()
    const dur = 1200
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(num * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, num])

  return (
    <span ref={ref}>
      {decimals > 0 ? display.toFixed(decimals) : Math.round(display)}
      {suffix}
    </span>
  )
}

function App() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [showMenu, setShowMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    checkHealth().catch(() => {})
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode)
    setShowAuth(true)
  }

  const features = [
    { icon: Network, title: "CNN-LSTM Core", desc: "MobileNetV2 pulls spatial features from each frame; an LSTM reads the order they arrive in. Not a stock classifier.", tag: "ARCHITECTURE" },
    { icon: Zap, title: "Sub-2s Inference", desc: "Ten frames sampled, run through an optimized TensorFlow graph. A clip is scored before you can blink twice.", tag: "SPEED" },
    { icon: Lock, title: "No Data Hoarding", desc: "JWT auth, hashed credentials, files processed in-memory and dropped. Footage never reaches cold storage.", tag: "PRIVACY" },
    { icon: FileVideo, title: "Real Formats", desc: "MP4, AVI, MOV, WebM up to 100MB. Validation happens before a byte reaches the model.", tag: "INPUT" },
    { icon: BarChart3, title: "Audit Trail", desc: "Every scan logged with a confidence score you can filter, search, and export to CSV.", tag: "HISTORY" },
    { icon: Layers, title: "Batch Queue", desc: "Stack a folder of clips; they run front-to-back while you watch the progress bar move.", tag: "THROUGHPUT" },
  ]

  const stats = [
    { value: "97.3%", label: "Validation accuracy", icon: Gauge },
    { value: "1.8s", label: "Median scan", icon: Zap },
    { value: "10", label: "Frames per clip", icon: Layers },
    { value: "0", label: "Frames retained", icon: Lock },
  ]

  const pipeline = [
    { step: "01", title: "Sample", desc: "Uniformly pull 10 frames from the clip." },
    { step: "02", title: "Encode", desc: "MobileNetV2 maps each frame to a feature vector." },
    { step: "03", title: "Sequence", desc: "An LSTM reads the vectors as one ordered signal." },
    { step: "04", title: "Score", desc: "A dense head emits a violence probability, threshold 0.5." },
  ]

  return (
    <div className="min-h-screen bg-parchment relative overflow-x-hidden">
      {/* atmospheric wash — decorative only */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="drift absolute -top-32 -right-24 h-[460px] w-[460px] rounded-full bg-coral wash" />
        <div className="absolute top-1/3 -left-32 h-[420px] w-[420px] rounded-full bg-sky-blue wash" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-0 right-1/4 h-[380px] w-[380px] rounded-full bg-mint wash" style={{ animationDelay: "4s" }} />
      </div>

      {/* Navigation */}
      <nav className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-ash bg-parchment/85 backdrop-blur-xl" : "border-b border-transparent"}`}>
        <div className="mx-auto flex h-20 max-w-[1432px] items-center justify-between px-5 sm:px-8">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-ash">
              <span className="h-3 w-3 rounded-full bg-lake-blue" />
            </div>
            <span className="font-display text-2xl tracking-tight">SafeVision</span>
          </motion.div>

          <div className="hidden items-center gap-9 md:flex">
            <a href="#features" className="font-mono text-[14px] uppercase tracking-tight text-off-black transition-opacity hover:opacity-60">Features</a>
            <a href="#pipeline" className="font-mono text-[14px] uppercase tracking-tight text-off-black transition-opacity hover:opacity-60">Pipeline</a>
            <a href="#numbers" className="font-mono text-[14px] uppercase tracking-tight text-off-black transition-opacity hover:opacity-60">Numbers</a>
            <button onClick={() => openAuth("login")} className="font-mono text-[14px] uppercase tracking-tight text-off-black transition-opacity hover:opacity-60">Sign in</button>
            <Button size="sm" onClick={() => openAuth("register")}>Get access</Button>
          </div>

          <button className="p-2 md:hidden" onClick={() => setShowMenu(!showMenu)}>
            {showMenu ? <X className="h-6 w-6 text-off-black" /> : <Menu className="h-6 w-6 text-off-black" />}
          </button>
        </div>

        <AnimatePresence>
          {showMenu && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-ash bg-parchment md:hidden">
              <div className="space-y-1 px-5 py-5">
                <a href="#features" onClick={() => setShowMenu(false)} className="block py-2 font-mono text-[14px] uppercase">Features</a>
                <a href="#pipeline" onClick={() => setShowMenu(false)} className="block py-2 font-mono text-[14px] uppercase">Pipeline</a>
                <a href="#numbers" onClick={() => setShowMenu(false)} className="block py-2 font-mono text-[14px] uppercase">Numbers</a>
                <div className="mt-4 flex flex-col gap-3">
                  <Button variant="ghost" className="w-full" onClick={() => { setShowMenu(false); openAuth("login") }}>Sign in</Button>
                  <Button className="w-full" onClick={() => { setShowMenu(false); openAuth("register") }}>Get access</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero — typographic, centered */}
      <section className="relative z-10 px-5 pt-40 sm:px-8 md:pt-52">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="eyebrow text-off-black">
            CNN · LSTM · COMPUTER VISION
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mx-auto mt-6 max-w-3xl font-display text-[44px] leading-[1.05] tracking-[-0.02em] text-off-black sm:text-[64px] md:text-[80px]"
          >
            Know what's in a video before it spreads.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-8 max-w-xl font-mono text-[18px] leading-[1.35] text-graphite"
          >
            A CNN-LSTM model reads ten frames of a clip and decides, in under two seconds, whether violence is present — with a confidence score you can defend.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <Button size="lg" onClick={() => navigate("/dashboard")}>Go to dashboard <ArrowRight className="h-4 w-4" /></Button>
            ) : (
              <Button size="lg" onClick={() => openAuth("register")}>Start scanning <ArrowRight className="h-4 w-4" /></Button>
            )}
            <a href="#pipeline" className="font-mono text-[14px] uppercase tracking-tight text-off-black underline-offset-4 transition-opacity hover:opacity-60 hover:underline">
              See how it works
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.4 }} className="mt-12 flex flex-wrap justify-center gap-x-7 gap-y-3 font-mono text-[12px] uppercase tracking-tight text-smoke">
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-lake-blue" /> No card required</span>
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-lake-blue" /> Trained on real footage</span>
            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-lake-blue" /> Clips never stored</span>
          </motion.div>
        </div>
      </section>

      {/* Marquee strip */}
      <div className="relative z-10 mt-24 border-y border-ash bg-parchment">
        <div className="mx-auto flex max-w-[1432px] items-center gap-10 overflow-hidden px-5 py-5 sm:px-8">
          <span className="eyebrow shrink-0 text-smoke">Built with</span>
          <div className="flex items-center gap-8 whitespace-nowrap font-mono text-[14px] uppercase tracking-tight text-smoke">
            <span>TensorFlow / Keras</span>
            <span className="text-ash">/</span>
            <span>MobileNetV2</span>
            <span className="text-ash">/</span>
            <span>LSTM</span>
            <span className="text-ash">/</span>
            <span>FastAPI</span>
            <span className="text-ash">/</span>
            <span>OpenCV</span>
            <span className="text-ash">/</span>
            <span>React + Vite</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="relative z-10 px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto max-w-[1432px]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel pulse>What it does</SectionLabel>
              <h2 className="mt-5 max-w-2xl font-display text-[32px] tracking-[-0.02em] text-off-black sm:text-[40px] md:text-[48px]">
                Not a black box. A pipeline you can point at.
              </h2>
            </div>
            <p className="max-w-sm font-mono text-[16px] leading-[1.35] text-graphite">
              Every feature exists because the model needs it — sampling, scoring, logging. Nothing here is decoration.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="group rounded-[40px] border border-ash bg-parchment p-10 transition-colors hover:bg-periwinkle-mist"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-ash bg-parchment text-off-black">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <span className="eyebrow text-smoke">{feature.tag}</span>
                </div>
                <h3 className="mt-6 font-display text-[24px] tracking-[-0.02em] text-off-black">{feature.title}</h3>
                <p className="mt-3 font-mono text-[16px] leading-[1.35] text-graphite">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section id="pipeline" className="relative z-10 border-y border-ash bg-periwinkle-mist px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto max-w-[1432px]">
          <div className="text-center">
            <SectionLabel>The pipeline</SectionLabel>
            <h2 className="mx-auto mt-5 max-w-2xl font-display text-[32px] tracking-[-0.02em] text-off-black sm:text-[40px] md:text-[48px]">
              From a raw clip to a verdict in four moves.
            </h2>
          </div>

          <div className="mt-16 hidden gap-px overflow-hidden rounded-[40px] border border-ash bg-ash md:grid md:grid-cols-4">
            {pipeline.map((item) => (
              <div key={item.step} className="bg-parchment p-10">
                <span className="font-mono text-[14px] uppercase tracking-tight text-lake-blue">{item.step}</span>
                <h3 className="mt-3 font-display text-[28px] tracking-[-0.02em] text-off-black">{item.title}</h3>
                <p className="mt-2 font-mono text-[16px] leading-[1.35] text-graphite">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {pipeline.map((item) => (
              <div key={item.step} className="rounded-[24px] border border-ash bg-parchment p-7">
                <span className="font-mono text-[14px] uppercase tracking-tight text-lake-blue">{item.step}</span>
                <h3 className="mt-2 font-display text-[24px] text-off-black">{item.title}</h3>
                <p className="mt-1 font-mono text-[16px] text-graphite">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* schematic: pill nodes, curved ash lines implied by layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 flex flex-col items-center justify-center gap-4 rounded-[40px] border border-ash bg-parchment p-10 sm:flex-row sm:gap-0"
          >
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((f) => (
                <div key={f} className="h-12 w-9 rounded-[12px] border border-ash bg-parchment" style={{ backgroundImage: `linear-gradient(${135 + f * 20}deg, rgba(43,89,209,0.18), transparent)` }} />
              ))}
            </div>
            <ArrowRight className="h-5 w-5 rotate-90 text-smoke sm:rotate-0" />
            <div className="flex items-center gap-2 rounded-full border border-ash bg-parchment px-6 py-4">
              <span className="font-display text-[20px] text-off-black">CNN</span>
              <span className="eyebrow text-smoke">feature</span>
            </div>
            <ArrowRight className="h-5 w-5 rotate-90 text-smoke sm:rotate-0" />
            <div className="flex items-center gap-2 rounded-full border border-ash bg-parchment px-6 py-4">
              <Cpu className="h-4 w-4 text-lake-blue" />
              <span className="font-display text-[20px] text-off-black">LSTM</span>
            </div>
            <ArrowRight className="h-5 w-5 rotate-90 text-smoke sm:rotate-0" />
            <div className="flex items-center gap-2 rounded-full border border-lake-blue bg-lake-blue/10 px-6 py-4">
              <span className="font-display text-[20px] text-lake-blue">0.973</span>
              <span className="eyebrow text-lake-blue">score</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Training pipeline — animated */}
      <TrainingPipeline />

      {/* Numbers */}
      <section id="numbers" className="relative z-10 px-5 py-24 sm:px-8 md:py-32">
        <div className="mx-auto max-w-[1432px]">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-[40px] border border-ash bg-parchment p-10"
              >
                <stat.icon className="h-6 w-6 text-lake-blue" />
                <div className="mt-5 font-display text-[40px] tracking-[-0.02em] text-off-black sm:text-[48px]">
                  <CountUp value={stat.value.replace(/[^0-9.]/g, "")} suffix={stat.value.replace(/[0-9.]/g, "")} />
                </div>
                <div className="mt-2 font-mono text-[16px] text-graphite">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-5 pb-28 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-[40px] border border-ash bg-parchment p-12 text-center md:p-20"
        >
          <h2 className="relative font-display text-[32px] tracking-[-0.02em] text-off-black sm:text-[40px] md:text-[48px]">
            Put a clip through it.
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg font-mono text-[18px] leading-[1.35] text-graphite">
            Create an account, drop a video, read the verdict. Free to start, no footage retained.
          </p>
          <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" onClick={() => openAuth("register")}>Create account <ArrowRight className="h-4 w-4" /></Button>
            <Button variant="ghost" size="lg" onClick={() => openAuth("login")}>Sign in</Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-ash bg-parchment px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-[1432px]">
          <div className="flex flex-col justify-between gap-10 md:flex-row">
            <div className="max-w-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-ash">
                  <span className="h-3 w-3 rounded-full bg-lake-blue" />
                </div>
                <span className="font-display text-2xl tracking-tight text-off-black">SafeVision</span>
              </div>
              <p className="mt-4 font-mono text-[16px] leading-[1.35] text-graphite">
                Violence detection for video, built on a CNN-LSTM core. For moderators, researchers, and anyone who'd rather a model watch the footage first.
              </p>
            </div>
            <div className="flex gap-16">
              <div>
                <h4 className="eyebrow text-smoke">Product</h4>
                <ul className="mt-4 space-y-3 font-mono text-[14px] uppercase tracking-tight text-off-black">
                  <li><a href="#features" className="transition-opacity hover:opacity-60">Features</a></li>
                  <li><a href="#pipeline" className="transition-opacity hover:opacity-60">Pipeline</a></li>
                  <li><a href="#numbers" className="transition-opacity hover:opacity-60">Numbers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="eyebrow text-smoke">Source</h4>
                <ul className="mt-4 space-y-3 font-mono text-[14px] uppercase tracking-tight text-off-black">
                  <li><a href="https://github.com/Theani7" target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-60">GitHub</a></li>
                  <li><a href="mailto:theanilpaneru@gmail.com" className="transition-opacity hover:opacity-60">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-2 border-t border-ash pt-6 font-mono text-[12px] uppercase tracking-tight text-smoke sm:flex-row sm:items-center sm:justify-between">
            <p>© 2024 SafeVision</p>
            <p>Anil Paneru · Rahul Mishra · Mahesh Karki</p>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} mode={authMode} />
    </div>
  )
}

export default App
