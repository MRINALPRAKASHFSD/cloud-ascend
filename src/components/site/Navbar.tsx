import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Cloud } from "lucide-react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#events", label: "Events" },
  { href: "#projects", label: "Projects" },
  { href: "#members", label: "Members" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("#home");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (y > prev && y > 200) setHidden(true);
    else setHidden(false);
  });

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    links.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
        >
          <nav className="glass-strong flex items-center gap-1 rounded-full px-2 py-2 pl-4 shadow-[0_10px_50px_-10px_rgba(0,0,0,0.6)]">
            <a href="#home" className="mr-2 flex items-center gap-2 pr-3">
              <span
                className="relative grid h-8 w-8 place-items-center rounded-xl"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Cloud className="h-4 w-4 text-white" strokeWidth={2.5} />
                <span className="absolute inset-0 rounded-xl opacity-60 blur-md" style={{ background: "var(--gradient-brand)" }} />
              </span>
              <span className="hidden text-sm font-semibold tracking-tight sm:block">
                CoE <span className="text-muted-foreground font-normal">· Cloud</span>
              </span>
            </a>

            <ul className="relative hidden items-center md:flex">
              {links.map((l) => {
                const isActive = active === l.href;
                return (
                  <li key={l.href} className="relative">
                    <a
                      href={l.href}
                      className="relative z-10 block rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-white/10"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                      <span className={isActive ? "text-foreground" : ""}>{l.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <a
              href="#contact"
              className="ml-2 hidden rounded-full px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_8px_30px_-8px_rgba(79,209,255,0.6)] transition-transform hover:scale-[1.03] active:scale-95 md:inline-block"
              style={{ background: "var(--gradient-brand)" }}
            >
              Join Community
            </a>
          </nav>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
