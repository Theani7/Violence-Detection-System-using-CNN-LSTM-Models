import { motion } from "framer-motion"
import { Card } from "./Card"
import { Button } from "./Button"
import { SectionLabel } from "./SectionLabel"
import { MailIcon, ArrowRightIcon, CodeIcon, BrainIcon, ShieldIcon, ClockIcon, ZapIcon, LinkIcon, GlobeIcon } from "lucide-react"

export function AuthorPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 dot-pattern" />
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-accent blur-[150px] opacity-10" />
        
        <div className="relative mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <SectionLabel pulse>About the Developer</SectionLabel>
          </motion.div>

          <motion.div
            className="mt-12 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative mb-8">
              <div className="h-32 w-32 rounded-full gradient-bg p-[3px]">
                <div className="h-full w-full rounded-full bg-card flex items-center justify-center">
                  <span className="font-display text-4xl">AP</span>
                </div>
              </div>
              <motion.div
                className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full gradient-bg flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <LinkIcon className="h-5 w-5 text-white" />
              </motion.div>
            </div>

            <h1 className="font-display text-4xl md:text-5xl">Anil Paneru</h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl">
              Full Stack Developer specializing in AI/ML solutions, computer vision, and building intelligent systems.
            </p>

            <div className="mt-8 flex gap-4">
              <Button>
                <a href="https://github.com/Theani7" target="_blank" rel="noopener noreferrer">
                  <GlobeIcon className="h-5 w-5" />
                  GitHub
                </a>
              </Button>
              <Button variant="secondary">
                <a href="https://github.com/Theani7" target="_blank" rel="noopener noreferrer">
                  <LinkIcon className="h-5 w-5" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <SectionLabel>Skills & Expertise</SectionLabel>
            <h2 className="mt-6 font-display text-3xl md:text-4xl">What I Work With</h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BrainIcon, title: "AI/ML", desc: "Deep Learning, CNN, LSTM, Computer Vision" },
              { icon: CodeIcon, title: "Full Stack", desc: "React, FastAPI, Node.js, Python" },
              { icon: ShieldIcon, title: "Security", desc: "JWT Auth, CVE, Best Practices" },
              { icon: ZapIcon, title: "Performance", desc: "Optimization, Caching, Scaling" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 * i }}
              >
                <Card hover className="text-center p-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-bg">
                    <item.icon className="h-7 w-7 text-white" />
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
              Project Details
            </SectionLabel>
            <h2 className="mt-6 font-display text-3xl md:text-4xl">About This Project</h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <Card className="h-full border-accent/20 bg-transparent text-background">
                <h3 className="font-display text-xl mb-4">SafeVision</h3>
                <p className="text-white/70 mb-4">
                  An advanced AI-powered system designed to detect violent content in videos using deep learning.
                  The model uses a hybrid CNN-LSTM architecture combining MobileNetV2 for feature extraction with
                  LSTM networks for temporal sequence analysis.
                </p>
                <ul className="text-sm text-white/70 space-y-2">
                  <li className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-accent" />
                    Real-time video analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <BrainIcon className="h-4 w-4 text-accent" />
                    97% detection accuracy
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldIcon className="h-4 w-4 text-accent" />
                    Binary classification
                  </li>
                </ul>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Card className="h-full border-accent/20 bg-transparent text-background">
                <h3 className="font-display text-xl mb-4">Tech Stack</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-accent mb-2">Backend</h4>
                    <p className="text-sm text-white/70">FastAPI, TensorFlow, Keras, OpenCV</p>
                  </div>
                  <div>
                    <h4 className="text-accent mb-2">Frontend</h4>
                    <p className="text-sm text-white/70">React, Vite, Tailwind, Framer Motion</p>
                  </div>
                  <div>
                    <h4 className="text-accent mb-2">Authentication</h4>
                    <p className="text-sm text-white/70">JWT Tokens, bcrypt password hashing</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-3xl md:text-4xl">Get In Touch</h2>
            <p className="mt-4 text-muted-foreground">
              Interested in collaboration or have questions about this project?
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button>
                <a href="https://github.com/Theani7" target="_blank">
                  <GlobeIcon className="h-5 w-5" />
                  View GitHub
                  <ArrowRightIcon className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="secondary">
                <a href="mailto:theanilpaneru@gmail.com">
                  <MailIcon className="h-5 w-5" />
                  Contact Me
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}