import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({ children, className = "", strength = 0.35 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      setPos({ x: x * strength, y: y * strength });
    };
    const onLeave = () => setPos({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return (
    <motion.div
      ref={ref}
      animate={pos}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
