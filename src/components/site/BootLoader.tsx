import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cloud } from "lucide-react";

const steps = [
  "Connecting to cloud fabric",
  "Initializing edge nodes",
  "Deploying serverless runtime",
  "Loading resources",
  "Ready",
];

export function BootLoader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    // Skip if reduced motion or already shown this session
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || sessionStorage.getItem("coe-booted") === "1") {
      setVisible(false);
      return;
    }
    const start = performance.now();
    const total = 1600;
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / total);
      setProgress(t);
      setStepIdx(Math.min(steps.length - 1, Math.floor(t * steps.length)));
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        sessionStorage.setItem("coe-booted", "1");
        setTimeout(() => setVisible(false), 320);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] grid place-items-center bg-background"
        >
          {/* radial glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(60vmax 60vmax at 50% 40%, color-mix(in oklab, var(--cyan-brand) 18%, transparent), transparent 70%)",
            }}
          />
          <div className="relative flex w-[min(440px,90vw)] flex-col items-center px-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid h-20 w-20 place-items-center rounded-3xl"
              style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-glow)" }}
            >
              <Cloud className="h-8 w-8 text-white" strokeWidth={1.8} />
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-3xl"
                animate={{ scale: [1, 1.35], opacity: [0.35, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                style={{ background: "var(--gradient-brand)" }}
              />
            </motion.div>

            <div className="mt-8 w-full">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-muted-foreground">
                <span>Center of Excellence</span>
                <span>{Math.round(progress * 100).toString().padStart(2, "0")}%</span>
              </div>
              <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ width: `${progress * 100}%`, background: "var(--gradient-brand)" }}
                />
              </div>
              <div className="mt-4 h-5 overflow-hidden text-sm text-foreground/85">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stepIdx}
                    initial={{ y: 12, opacity: 0, filter: "blur(6px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -12, opacity: 0, filter: "blur(6px)" }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="text-muted-foreground">›</span>{" "}
                    <span>{steps[stepIdx]}</span>
                    {stepIdx < steps.length - 1 && (
                      <span className="ml-1 text-cyan-brand">…</span>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
