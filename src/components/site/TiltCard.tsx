import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function TiltCard({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pending = useRef<{ px: number; py: number } | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (touch || reduced) setEnabled(false);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const flush = () => {
    rafRef.current = null;
    const el = ref.current;
    const p = pending.current;
    if (!el || !p) return;
    const rect = el.getBoundingClientRect();
    x.set((p.px - rect.left) / rect.width - 0.5);
    y.set((p.py - rect.top) / rect.height - 0.5);
  };

  const handle = (e: React.MouseEvent) => {
    if (!enabled) return;
    pending.current = { px: e.clientX, py: e.clientY };
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(flush);
  };
  const reset = () => {
    if (!enabled) return;
    x.set(0);
    y.set(0);
  };

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handle}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", willChange: "transform" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
