import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

type Ripple = { id: number; x: number; y: number };

export function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 220, damping: 28 });
  const sy = useSpring(y, { stiffness: 220, damping: 28 });
  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rafRef = useRef<number | null>(null);
  const pending = useRef<{ px: number; py: number; inter: boolean } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduced) return;
    setVisible(true);

    let lastInter = false;

    const flush = () => {
      rafRef.current = null;
      const p = pending.current;
      if (!p) return;
      x.set(p.px);
      y.set(p.py);
      if (p.inter !== lastInter) {
        lastInter = p.inter;
        setInteractive(p.inter);
      }
    };

    const move = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      const inter = !!el?.closest?.("a,button,[role='button'],input,textarea,summary,label");
      pending.current = { px: e.clientX, py: e.clientY, inter };
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(flush);
    };
    const click = (e: MouseEvent) => {
      const id = Date.now() + Math.random();
      setRipples((r) => [...r, { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => setRipples((r) => r.filter((rr) => rr.id !== id)), 700);
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", click);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", click);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [x, y]);

  if (!visible) return null;
  return (
    <>
      <motion.div
        aria-hidden
        style={{ x: sx, y: sy, willChange: "transform" }}
        className="pointer-events-none fixed left-0 top-0 z-[60] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{ scale: interactive ? 1.35 : 1, opacity: interactive ? 0.5 : 0.3 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="h-[520px] w-[520px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--cyan-brand) 40%, transparent), color-mix(in oklab, var(--blue-brand) 12%, transparent) 40%, transparent 70%)",
            willChange: "transform, opacity",
          }}
        />
      </motion.div>

      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            aria-hidden
            initial={{ opacity: 0.5, scale: 0 }}
            animate={{ opacity: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ left: r.x, top: r.y, willChange: "transform, opacity" }}
            className="pointer-events-none fixed z-[60] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-brand/50"
          />
        ))}
      </AnimatePresence>
    </>
  );
}
