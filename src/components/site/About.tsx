import { motion } from "framer-motion";
import { Target, Compass, Rocket, GraduationCap, Users, Award } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const pillars = [
  { icon: Target, title: "Mission", desc: "Cultivate cloud-native engineers who ship at planet scale, blending research rigor with product craft." },
  { icon: Compass, title: "Vision", desc: "To be South Asia's most respected student center for distributed systems, edge, and AI infrastructure." },
  { icon: Rocket, title: "Objectives", desc: "Launch open-source projects, run hackathons, industry sprints and certification programs every semester." },
];

const timeline = [
  { year: "2022", icon: GraduationCap, title: "Center founded", desc: "Established with an inaugural cohort of 24 students." },
  { year: "2023", icon: Users, title: "First 100 members", desc: "Launched mentor tracks across AWS, GCP and Azure." },
  { year: "2024", icon: Award, title: "Awwwards & Hackwins", desc: "3 national wins. Featured cloud research at IEEE." },
  { year: "2025", icon: Rocket, title: "Open-source lab", desc: "Shipped 12 OSS projects, 2 with 1k+ GitHub stars." },
];

export function About() {
  return (
    <section id="about" className="relative py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="About the Center"
          title={<>An interdisciplinary studio for <span className="gradient-text">cloud-native engineering.</span></>}
          description="We're a Center of Excellence at K.R. Mangalam University — a lab where students design, build and operate real distributed systems alongside faculty and industry mentors."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="glass gradient-border noise group relative overflow-hidden rounded-3xl p-8"
            >
              <div
                className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
                style={{ background: "var(--gradient-brand)" }}
              />
              <div className="relative">
                <div className="glass grid h-12 w-12 place-items-center rounded-2xl">
                  <p.icon className="h-5 w-5 text-cyan-brand" />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <div className="mt-24">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-brand/50 via-white/10 to-transparent md:left-1/2 md:-translate-x-1/2" />
            <ul className="space-y-10">
              {timeline.map((t, i) => (
                <motion.li
                  key={t.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                  className={`relative flex items-start gap-6 md:grid md:grid-cols-2 md:gap-12 ${i % 2 ? "md:[&>*:first-child]:col-start-2" : ""}`}
                >
                  <div className={`md:${i % 2 ? "pl-8" : "text-right md:pr-8"}`}>
                    <div className="glass gradient-border inline-block rounded-2xl p-6">
                      <div className="flex items-center gap-3">
                        <div className="glass grid h-10 w-10 place-items-center rounded-xl">
                          <t.icon className="h-4 w-4 text-cyan-brand" />
                        </div>
                        <div className="text-sm font-mono text-cyan-brand">{t.year}</div>
                      </div>
                      <h4 className="mt-4 text-lg font-semibold">{t.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                    </div>
                  </div>
                  <span className="absolute left-4 top-6 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-brand shadow-[0_0_20px_rgba(79,209,255,0.8)] md:left-1/2" />
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
