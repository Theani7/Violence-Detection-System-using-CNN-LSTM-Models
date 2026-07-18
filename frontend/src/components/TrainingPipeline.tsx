import { motion } from "framer-motion"
import { Cpu, Network, Layers, Gauge } from "lucide-react"

const PHASES = [
  { key: "Frames", label: "Frame Sampling", icon: Layers },
  { key: "CNN", label: "MobileNetV2", icon: Network },
  { key: "LSTM", label: "Temporal LSTM", icon: Cpu },
  { key: "Score", label: "Violence Head", icon: Gauge },
]

function FrameGrid() {
  // 10 sampled frames; the sweep line animates over them
  return (
    <div className="relative grid w-full grid-cols-5 gap-1.5 overflow-hidden rounded-[20px] border border-ash bg-parchment p-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="relative aspect-[4/3] overflow-hidden rounded-[8px] border border-ash bg-parchment"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(${120 + i * 18}deg, rgba(43,89,209,0.22), transparent 70%)`,
            }}
          />
          <div className="shimmer absolute inset-0" />
        </div>
      ))}
      <div className="scan-sweep pointer-events-none absolute inset-x-3 top-3 h-[2px] bg-lake-blue/70" />
    </div>
  )
}

function LossCurve() {
  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Training loss decreasing over epochs">
      <line x1="0" y1="110" x2="320" y2="110" className="stroke-ash" strokeWidth="1" />
      <line x1="0" y1="10" x2="0" y2="110" className="stroke-ash" strokeWidth="1" />
      {/* loss curve: high -> low, with a couple of steps like real training */}
      <path
        className="draw-line"
        d="M4,18 C40,22 60,40 90,52 C120,62 140,58 170,70 C200,80 225,86 250,92 C280,98 300,100 316,102"
        fill="none"
        stroke="#2b59d1"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* accuracy curve climbing */}
      <path
        className="draw-line"
        style={{ animationDelay: "0.6s" }}
        d="M4,100 C40,96 60,80 90,70 C120,62 140,66 170,55 C200,45 225,38 250,30 C280,22 300,20 316,18"
        fill="none"
        stroke="#a7fccd"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <g className="font-mono" fill="#797776" fontSize="9">
        <text x="2" y="105">epoch 0</text>
        <text x="250" y="105">120</text>
        <text x="6" y="14">loss / acc</text>
      </g>
    </svg>
  )
}

function FlowDiagram() {
  return (
    <div className="flex flex-col items-stretch gap-0 sm:flex-row sm:items-start sm:justify-between">
      {PHASES.map((phase, i) => {
        const Icon = phase.icon
        const isLast = i === PHASES.length - 1
        return (
          <div key={phase.key} className="flex flex-1 flex-col items-center sm:flex-row sm:items-start">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative flex h-20 w-20 items-center justify-center rounded-full border border-ash bg-parchment"
              >
                <span className="absolute h-3 w-3 rounded-full bg-lake-blue node-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
                <Icon className="h-7 w-7 text-off-black" />
                <span className="absolute -bottom-2 font-mono text-[10px] uppercase tracking-tight text-smoke">
                  {phase.key}
                </span>
              </motion.div>
              <span className="mt-5 font-mono text-[12px] uppercase tracking-tight text-graphite">{phase.label}</span>
            </div>

            {!isLast && (
              <svg className="my-4 h-8 w-full sm:my-10 sm:h-0.5 sm:w-auto sm:flex-1" viewBox="0 0 40 32" preserveAspectRatio="none">
                <line x1="20" y1="2" x2="20" y2="30" className="stroke-ash sm:hidden" strokeWidth="1.5" />
                <line x1="20" y1="2" x2="20" y2="30" className="flow-line stroke-lake-blue sm:hidden" strokeWidth="1.5" />
                <line x1="0" y1="1" x2="40" y2="1" className="hidden stroke-ash sm:block" strokeWidth="1.5" />
                <line x1="0" y1="1" x2="40" y2="1" className="hidden flow-line stroke-lake-blue sm:block" strokeWidth="1.5" />
              </svg>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function TrainingPipeline() {
  return (
    <section className="relative z-10 border-y border-ash bg-parchment px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-[1432px]">
        <div className="text-center">
          <span className="inline-flex items-center gap-3 rounded-full border border-ash bg-parchment px-5 py-2">
            <span className="h-2 w-2 rounded-full bg-lake-blue" />
            <span className="eyebrow text-off-black">How it learns</span>
          </span>
          <h2 className="mx-auto mt-5 max-w-2xl font-display text-[32px] tracking-[-0.02em] text-off-black sm:text-[40px] md:text-[48px]">
            Trained like a reader, not a classifier.
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-mono text-[18px] leading-[1.35] text-graphite">
            Each clip becomes ten frames. The CNN reads them; the LSTM reads their order. The loss tells us when to stop.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[40px] border border-ash bg-parchment p-8">
            <span className="eyebrow text-smoke">Inference · live</span>
            <h3 className="mt-3 font-display text-[24px] tracking-[-0.02em] text-off-black">Frame sampling & scan</h3>
            <div className="mt-6">
              <FrameGrid />
            </div>
            <p className="mt-5 font-mono text-[14px] leading-[1.35] text-graphite">
              Ten frames are pulled uniformly, passed through the encoder, and swept by the detector in real time.
            </p>
          </div>

          <div className="rounded-[40px] border border-ash bg-parchment p-8">
            <span className="eyebrow text-smoke">Training · epochs</span>
            <h3 className="mt-3 font-display text-[24px] tracking-[-0.02em] text-off-black">Loss & accuracy</h3>
            <div className="mt-6 rounded-[20px] border border-ash bg-parchment p-4">
              <LossCurve />
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12px] uppercase tracking-tight text-smoke">
              <span className="inline-flex items-center gap-2"><span className="h-2 w-4 rounded-full bg-lake-blue" /> loss ↓</span>
              <span className="inline-flex items-center gap-2"><span className="h-2 w-4 rounded-full bg-mint" /> accuracy ↑</span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[40px] border border-ash bg-periwinkle-mist p-10">
          <span className="eyebrow text-smoke">Architecture flow</span>
          <div className="mt-10">
            <FlowDiagram />
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrainingPipeline
