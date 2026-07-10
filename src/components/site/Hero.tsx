import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Cloud, Server, Database, Cpu, Zap } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { AnimatedCounter } from "./AnimatedCounter";
import { usePublicHeroStats, type PublicHeroStat } from "@/lib/usePublicCms";


const fallbackMetrics: PublicHeroStat[] = [
  { id: "1", label: "Active Members", value: 120, suffix: "+", sort_order: 0 },
  { id: "2", label: "Projects Shipped", value: 42, suffix: "", sort_order: 1 },
  { id: "3", label: "Events Hosted", value: 28, suffix: "", sort_order: 2 },
  { id: "4", label: "Certifications", value: 340, suffix: "+", sort_order: 3 },
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

type NodeDef = {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  x: number; // 0-100
  y: number; // 0-100
  d: number;
  desc: string;
  tags: string[];
};

const NODES: NodeDef[] = [
  { icon: Server, label: "Compute", x: 14, y: 20, d: 0, desc: "Autoscaling containers on Kubernetes and Nomad clusters.", tags: ["K8s", "Nomad", "eBPF"] },
  { icon: Database, label: "Storage", x: 82, y: 22, d: 0.2, desc: "Object, block and vector stores tuned for AI workloads.", tags: ["S3", "pgvector", "R2"] },
  { icon: Cpu, label: "AI", x: 84, y: 72, d: 0.4, desc: "Serverless inference with cost-aware GPU routing.", tags: ["Ray", "Triton", "vLLM"] },
  { icon: Zap, label: "Edge", x: 12, y: 74, d: 0.6, desc: "Sub-30ms delivery across 300+ points of presence.", tags: ["Workers", "WASM", "CDN"] },
];

function CloudVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [10, -10]), { stiffness: 120, damping: 20 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-12, 12]), { stiffness: 120, damping: 20 });
  const [hover, setHover] = useState<string | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => { mx.set(0); my.set(0); setHover(null); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1200 }}
      className="relative mx-auto aspect-square w-full max-w-[520px]"
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
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

        {/* Connecting lines + data packets */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="line" x1="0" x2="1">
              <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3B6FE0" stopOpacity="0.6" />
            </linearGradient>
            <radialGradient id="packet">
              <stop offset="0%" stopColor="#E0F2FE" stopOpacity="1" />
              <stop offset="60%" stopColor="#7DD3FC" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0" />
            </radialGradient>
          </defs>
          {NODES.map((n, i) => {
            const active = hover === n.label;
            return (
              <g key={n.label}>
                <line
                  x1="50" y1="50" x2={n.x} y2={n.y}
                  stroke="url(#line)"
                  strokeWidth={active ? 0.6 : 0.3}
                  strokeDasharray="1 1.2"
                  style={{ transition: "stroke-width 300ms" }}
                >
                  <animate attributeName="stroke-dashoffset" from="0" to="10" dur="4s" repeatCount="indefinite" />
                </line>
                {/* animated data packet */}
                <circle r={active ? 1.4 : 1} fill="url(#packet)">
                  <animateMotion
                    dur={`${3 + i * 0.6}s`}
                    repeatCount="indefinite"
                    path={`M 50 50 L ${n.x} ${n.y}`}
                    keyPoints="0;1" keyTimes="0;1"
                  />
                  <animate attributeName="opacity" values="0;1;1;0" dur={`${3 + i * 0.6}s`} repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {NODES.map((n) => {
          const active = hover === n.label;
          const Icon = n.icon;
          return (
            <motion.div
              key={n.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${n.x}%`, top: `${n.y}%`, zIndex: active ? 20 : 10 }}
              animate={{ y: active ? -4 : [0, -12, 0] }}
              transition={{ duration: 5 + n.d * 2, delay: n.d, repeat: active ? 0 : Infinity, ease: "easeInOut" }}
              onMouseEnter={() => setHover(n.label)}
              onFocus={() => setHover(n.label)}
              tabIndex={0}
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 340, damping: 28 }}
                className="glass-strong flex flex-col rounded-2xl px-3 py-2 shadow-[0_10px_30px_-10px_rgba(79,209,255,0.5)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-cyan-brand" />
                  <span className="text-xs font-medium">{n.label}</span>
                  <span className="ml-1 h-1.5 w-1.5 rounded-full bg-cyan-brand animate-pulse" />
                </div>
                {active && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-2 max-w-[180px] overflow-hidden"
                  >
                    <p className="text-[10px] leading-relaxed text-muted-foreground">{n.desc}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {n.tags.map((t) => (
                        <span key={t} className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] text-foreground/80">{t}</span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

