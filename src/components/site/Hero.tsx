import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Cloud, Server, Database, Cpu, Zap } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { AnimatedCounter } from "./AnimatedCounter";

const metrics = [
  { label: "Active Members", value: 120, suffix: "+" },
  { label: "Projects Shipped", value: 42, suffix: "" },
  { label: "Events Hosted", value: 28, suffix: "" },
  { label: "Certifications", value: 340, suffix: "+" },
];

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-32 pb-24">
      <div className="container relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-cyan-brand opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-brand" />
              </span>
              Center of Excellence · K.R. Mangalam University
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-balance mt-6 text-[clamp(2.5rem,6.2vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.04em]"
            >
              Building the future{" "}
              <span className="gradient-text">with cloud computing.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="text-balance mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              A student-led lab engineering distributed systems, serverless architectures and
              AI-native infrastructure — where curiosity meets planet-scale technology.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <MagneticButton>
                <a
                  href="#about"
                  className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_rgba(79,209,255,0.7)] transition-transform active:scale-95"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Explore the Center
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </MagneticButton>
              <MagneticButton>
                <a
                  href="#projects"
                  className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/[0.08]"
                >
                  <Sparkles className="h-4 w-4 text-cyan-brand" />
                  View Projects
                </a>
              </MagneticButton>
            </motion.div>

            {/* Metrics */}
            <div className="mt-16 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
              {metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 + i * 0.08 }}
                  className="glass rounded-2xl p-4"
                >
                  <div className="text-2xl font-semibold tracking-tight">
                    <AnimatedCounter to={m.value} />
                    {m.suffix}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{m.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <CloudVisual />
        </div>
      </div>
    </section>
  );
}

function CloudVisual() {
  const nodes = [
    { icon: Server, label: "Compute", x: "12%", y: "18%", d: 0 },
    { icon: Database, label: "Storage", x: "78%", y: "22%", d: 0.2 },
    { icon: Cpu, label: "AI", x: "82%", y: "70%", d: 0.4 },
    { icon: Zap, label: "Edge", x: "10%", y: "72%", d: 0.6 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto aspect-square w-full max-w-[520px]"
    >
      {/* Rotating rings */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="absolute h-full w-full rounded-full border border-white/5 animate-spin-slow" />
        <div className="absolute h-[80%] w-[80%] rounded-full border border-white/8" style={{ animation: "spin-slow 60s linear infinite reverse" }} />
        <div className="absolute h-[55%] w-[55%] rounded-full border border-cyan-brand/20 animate-spin-slow" style={{ animationDuration: "30s" }} />
      </div>

      {/* Glow core */}
      <div className="absolute inset-0 grid place-items-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative grid h-40 w-40 place-items-center rounded-full"
          style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-glow)" }}
        >
          <div className="absolute inset-0 rounded-full opacity-70 blur-2xl" style={{ background: "var(--gradient-brand)" }} />
          <Cloud className="relative h-14 w-14 text-white" strokeWidth={1.5} />
        </motion.div>
      </div>

      {/* Connecting lines */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="line" x1="0" x2="1">
            <stop offset="0%" stopColor="#4FD1FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {[[18, 24], [78, 26], [80, 72], [16, 72]].map(([x, y], i) => (
          <line key={i} x1="50" y1="50" x2={x} y2={y} stroke="url(#line)" strokeWidth="0.3" strokeDasharray="1 1.2">
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="4s" repeatCount="indefinite" />
          </line>
        ))}
      </svg>

      {/* Nodes */}
      {nodes.map((n) => (
        <motion.div
          key={n.label}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: n.x, top: n.y }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5 + n.d * 2, delay: n.d, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="glass-strong flex items-center gap-2 rounded-2xl px-3 py-2 shadow-[0_10px_30px_-10px_rgba(79,209,255,0.5)]">
            <n.icon className="h-4 w-4 text-cyan-brand" />
            <span className="text-xs font-medium">{n.label}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
