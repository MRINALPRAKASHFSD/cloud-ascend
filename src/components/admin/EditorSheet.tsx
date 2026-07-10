import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function EditorSheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            className="glass-strong absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col border-l border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-white/10 p-6">
              <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
              <button onClick={onClose} className="glass grid h-8 w-8 place-items-center rounded-full hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="flex-1 space-y-4 overflow-y-auto p-6">{children}</div>
            {footer && <footer className="border-t border-white/10 p-4">{footer}</footer>}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
