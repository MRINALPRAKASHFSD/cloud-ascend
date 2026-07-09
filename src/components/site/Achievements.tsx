import { motion } from "framer-motion";
import { Trophy, Award, Medal, Star, Sparkles } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const items = [
  { icon: Trophy, title: "Smart India Hackathon — Winners", year: "2024", desc: "Cloud-native disaster response platform." },
  { icon: Award, title: "AWS DeepRacer League — Top 5 India", year: "2024", desc: "Reinforcement learning on the edge." },
  { icon: Medal, title: "IEEE CloudCom — Best Student Paper", year: "2024", desc: "On cost-aware serverless scheduling." },
  { icon: Star, title: "Google Cloud Champions Program", year: "2025", desc: "6 members inducted nationally." },
  { icon: Sparkles, title: "1k+ GitHub Stars", year: "2025", desc: "For our open-source projects Cirrus & Stratus." },
];

export function Achievements() {
  return (
    <section id="achievements" className="relative py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Achievements"
          title={<>Milestones that <span className="gradient-text">move us forward.</span></>}
        />
        <div className="relative mt-16">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />
          <ul className="grid gap-6 md:grid-cols-5">
            {items.map((it, i) => (
              <motion.li
                key={it.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="glass gradient-border group relative overflow-hidden rounded-3xl p-6"
              >
                <div className="glass mb-6 grid h-12 w-12 place-items-center rounded-2xl">
                  <it.icon className="h-5 w-5 text-cyan-brand" />
                </div>
                <div className="text-xs font-mono text-cyan-brand">{it.year}</div>
                <h4 className="mt-2 text-base font-semibold leading-snug">{it.title}</h4>
                <p className="mt-2 text-xs text-muted-foreground">{it.desc}</p>
                <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-50" style={{ background: "var(--gradient-brand)" }} />
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
