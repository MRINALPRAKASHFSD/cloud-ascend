import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search, Home, Sparkles, Users, Calendar, Image as ImageIcon,
  Mail, Sun, Moon, Github, ArrowRight,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";

type Item = {
  id: string;
  label: string;
  hint?: string;
  group: "Navigate" | "Actions" | "Links";
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
};

function scrollTo(hash: string) {
  const el = document.querySelector(hash);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  else window.location.hash = hash;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const items = useMemo<Item[]>(
    () => [
      { id: "home", label: "Home", group: "Navigate", icon: Home, run: () => scrollTo("#home") },
      { id: "about", label: "About the Center", group: "Navigate", icon: Sparkles, run: () => scrollTo("#about") },
      { id: "events", label: "Events & Workshops", group: "Navigate", icon: Calendar, run: () => scrollTo("#events") },
      { id: "projects", label: "Projects", group: "Navigate", icon: Sparkles, run: () => scrollTo("#projects") },
      { id: "members", label: "Members", group: "Navigate", icon: Users, run: () => scrollTo("#members") },
      { id: "gallery", label: "Gallery", group: "Navigate", icon: ImageIcon, run: () => scrollTo("#gallery") },
      { id: "contact", label: "Contact", group: "Navigate", icon: Mail, run: () => scrollTo("#contact") },
      {
        id: "theme",
        label: `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
        group: "Actions",
        icon: theme === "dark" ? Sun : Moon,
        run: () => setTheme(theme === "dark" ? "light" : "dark"),
      },
      { id: "github", label: "Open GitHub", hint: "external", group: "Links", icon: Github, run: () => window.open("https://github.com", "_blank") },
    ],
    [theme, setTheme]
  );

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter((i) => i.label.toLowerCase().includes(t) || i.group.toLowerCase().includes(t));
  }, [q, items]);

  useEffect(() => setActive(0), [q]);

  const grouped = useMemo(() => {
    const g: Record<string, Item[]> = {};
    filtered.forEach((i) => {
      (g[i.group] ??= []).push(i);
    });
    return g;
  }, [filtered]);

  const runAt = (idx: number) => {
    const it = filtered[idx];
    if (!it) return;
    it.run();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            else if (e.key === "Enter") { e.preventDefault(); runAt(active); }
          }}
        >
          <div className="absolute inset-0 bg-background/60 backdrop-blur-md" />
          <motion.div
            role="dialog"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search or jump to…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="glass rounded px-1.5 py-0.5 text-[10px] text-muted-foreground">ESC</kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">No results</div>
              )}
              {Object.entries(grouped).map(([group, arr]) => (
                <div key={group} className="py-1">
                  <div className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{group}</div>
                  {arr.map((it) => {
                    const idx = filtered.indexOf(it);
                    const isActive = idx === active;
                    const Icon = it.icon;
                    return (
                      <button
                        key={it.id}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => runAt(idx)}
                        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          isActive ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="grid h-7 w-7 place-items-center rounded-md bg-white/5">
                          <Icon className="h-3.5 w-3.5 text-cyan-brand" />
                        </span>
                        <span className="flex-1">{it.label}</span>
                        {it.hint && <span className="text-[10px] text-muted-foreground">{it.hint}</span>}
                        <ArrowRight className={`h-3.5 w-3.5 transition-transform ${isActive ? "translate-x-0.5 opacity-100" : "opacity-0"}`} />
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><kbd className="glass rounded px-1.5 py-0.5">↑↓</kbd> Navigate</span>
                <span className="flex items-center gap-1"><kbd className="glass rounded px-1.5 py-0.5">↵</kbd> Select</span>
              </div>
              <span className="flex items-center gap-1"><kbd className="glass rounded px-1.5 py-0.5">⌘K</kbd> Toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
