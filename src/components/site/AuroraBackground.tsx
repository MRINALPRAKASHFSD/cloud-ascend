import { motion } from "framer-motion";
import { useMemo } from "react";

export function AuroraBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 10,
      })),
    []
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient wash */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-aurora)" }} />

      {/* Floating blobs */}
      <motion.div
        className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full opacity-40 blur-3xl animate-aurora"
        style={{ background: "radial-gradient(circle, #4FD1FF, transparent 60%)" }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 h-[700px] w-[700px] rounded-full opacity-30 blur-3xl animate-aurora"
        style={{ background: "radial-gradient(circle, #8B5CF6, transparent 60%)", animationDelay: "-6s" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full opacity-25 blur-3xl animate-aurora"
        style={{ background: "radial-gradient(circle, #6AE3FF, transparent 60%)", animationDelay: "-12s" }}
      />

      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Light rays */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-screen"
        style={{
          background:
            "conic-gradient(from 210deg at 50% -10%, transparent 0deg, rgba(79,209,255,0.6) 30deg, transparent 60deg, rgba(139,92,246,0.5) 120deg, transparent 160deg)",
        }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white/70"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -40, 0], opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Noise */}
      <div className="absolute inset-0 noise" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(6, 8, 20, 0.6) 100%)" }}
      />
    </div>
  );
}
