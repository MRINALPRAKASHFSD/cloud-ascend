import { motion } from "framer-motion";
import { Trophy, Award, Medal, Star, Sparkles, type LucideIcon } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { usePublicAchievements, type PublicAchievement } from "@/lib/usePublicCms";
import { EmptyState } from "./Events";

const ICONS: Record<string, LucideIcon> = { Trophy, Award, Medal, Star, Sparkles };

const fallback: PublicAchievement[] = [
  { id: "1", title: "Smart India Hackathon — Winners", awarded_on: "2024-01-01", description: "Cloud-native disaster response platform.", icon: "Trophy", metric_value: null, metric_label: null },
  { id: "2", title: "AWS DeepRacer League — Top 5 India", awarded_on: "2024-01-01", description: "Reinforcement learning on the edge.", icon: "Award", metric_value: null, metric_label: null },
  { id: "3", title: "IEEE CloudCom — Best Student Paper", awarded_on: "2024-01-01", description: "On cost-aware serverless scheduling.", icon: "Medal", metric_value: null, metric_label: null },
  { id: "4", title: "Google Cloud Champions Program", awarded_on: "2025-01-01", description: "6 members inducted nationally.", icon: "Star", metric_value: null, metric_label: null },
  { id: "5", title: "1k+ GitHub Stars", awarded_on: "2025-01-01", description: "For our open-source projects Cirrus & Stratus.", icon: "Sparkles", metric_value: null, metric_label: null },
];

export function Achievements() {
  const { data: items, isLoading } = usePublicAchievements(fallback);

  return (
    <section id="achievements" className="relative py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Achievements"
          title={<>Milestones that <span className="gradient-text">move us forward.</span></>}
        />
        {isLoading && items.length === 0 ? (
          <div className="mt-16 grid gap-6 md:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="glass gradient-border rounded-3xl p-6 h-56 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState icon={Trophy} label="Achievements coming soon" hint="Recent wins and honors will show up here." />
        ) : (
          <div className="relative mt-16">
            <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />
            <ul className="grid gap-6 md:grid-cols-5">
              {items.map((it, i) => {
                const Icon = ICONS[it.icon ?? ""] ?? Trophy;
                const year = it.awarded_on ? new Date(it.awarded_on).getFullYear() : "";
                return (
                  <motion.li
                    key={it.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{ duration: 0.7, delay: i * 0.08 }}
                    whileHover={{ y: -6 }}
                    className="glass gradient-border group relative overflow-hidden rounded-3xl p-6"
                  >
                    <div className="glass mb-6 grid h-12 w-12 place-items-center rounded-2xl">
                      <Icon className="h-5 w-5 text-cyan-brand" />
                    </div>
                    {year && <div className="text-xs font-mono text-cyan-brand">{year}</div>}
                    <h4 className="mt-2 text-base font-semibold leading-snug">{it.title}</h4>
                    {it.description && <p className="mt-2 text-xs text-muted-foreground">{it.description}</p>}
                    <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-50" style={{ background: "var(--gradient-brand)" }} />
                  </motion.li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
