import { Cloud, Github, Linkedin, Twitter, ArrowUp } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { usePublicFooterLinks, type PublicFooterLink } from "@/lib/usePublicCms";

const fallback: PublicFooterLink[] = [
  { id: "e1", section: "Explore", label: "About", url: "#about", external: false, sort_order: 0 },
  { id: "e2", section: "Explore", label: "Events", url: "#events", external: false, sort_order: 1 },
  { id: "e3", section: "Explore", label: "Projects", url: "#projects", external: false, sort_order: 2 },
  { id: "e4", section: "Explore", label: "Members", url: "#members", external: false, sort_order: 3 },
  { id: "r1", section: "Resources", label: "Gallery", url: "#gallery", external: false, sort_order: 0 },
  { id: "r2", section: "Resources", label: "Contact", url: "#contact", external: false, sort_order: 1 },
  { id: "r3", section: "Resources", label: "GitHub", url: "#", external: true, sort_order: 2 },
  { id: "r4", section: "Resources", label: "Handbook", url: "#", external: true, sort_order: 3 },
];

export function Footer() {
  const { data: links } = usePublicFooterLinks(fallback);
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [top, setTop] = useState(false);
  useEffect(() => {
    const on = () => setTop(window.scrollY > 600);
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, PublicFooterLink[]>();
    for (const l of links) {
      const arr = map.get(l.section) ?? [];
      arr.push(l);
      map.set(l.section, arr);
    }
    return Array.from(map.entries());
  }, [links]);

  return (
    <footer className="relative border-t border-white/5 py-16">
      <motion.div style={{ width }} className="fixed left-0 top-0 z-[70] h-[2px]" >
        <div className="h-full w-full" style={{ background: "var(--gradient-brand)" }} />
      </motion.div>

      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
                <Cloud className="h-4 w-4 text-white" strokeWidth={2.5} />
              </span>
              <span className="font-semibold tracking-tight">CoE Cloud Computing</span>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              A Center of Excellence at K.R. Mangalam University, engineering the future of
              cloud-native systems.
            </p>
            <div className="mt-6 flex gap-2">
              {[Github, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="glass grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-white/10">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {grouped.slice(0, 2).map(([section, items]) => (
            <div key={section}>
              <h5 className="text-sm font-semibold">{section}</h5>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {items.map((l) => (
                  <li key={l.id}>
                    <a
                      href={l.url}
                      target={l.external ? "_blank" : undefined}
                      rel={l.external ? "noreferrer" : undefined}
                      className="transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs text-muted-foreground sm:flex-row">
          <div>© {new Date().getFullYear()} Center of Excellence — Cloud Computing · K.R. Mangalam University</div>
          <div>Crafted with care by the CoE Cloud team.</div>
        </div>
      </div>

      {top && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="glass-strong fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full shadow-[0_10px_40px_-10px_rgba(79,209,255,0.6)] transition-transform hover:scale-105"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </footer>
  );
}
