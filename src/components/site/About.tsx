import { motion } from "framer-motion";
import { Target, Compass, Rocket, GraduationCap, Users, Award } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const pillars = [
  { 
    icon: Target, 
    title: "Mission", 
    desc: "To bridge academia and industry through hands-on cloud training and certifications, drive research and innovation in cloud and AI technologies, and foster startups and real-world solutions through strong industry partnerships." 
  },
  { 
    icon: Compass, 
    title: "Vision", 
    desc: "To be a leading centre for cloud computing research, training, and innovation — empowering students and professionals with industry-ready skills for a secure, scalable digital future." 
  },
  { 
    icon: Rocket, 
    title: "Objectives", 
    items: [
      { label: "Skill Development & Training", text: "Provide hands-on training, certifications, and workshops to develop cloud computing expertise." },
      { label: "Research & Innovation", text: "Foster advanced research in cloud technologies, AI, and big data to develop innovative solutions for emerging needs." },
      { label: "Industry Collaboration", text: "Partner with tech firms and enterprises to bridge the gap between academia and industry." },
      { label: "Entrepreneurship & Startups", text: "Support cloud-based startups and incubate innovative projects for real-world impact." },
      { label: "Smart & Scalable Solutions", text: "Develop AI-driven, cloud-enabled smart solutions to enhance efficiency across industries." },
      { label: "Sustainable Digital Transformation", text: "Promote cost-effective, scalable, and secure cloud adoption for businesses and society." },
      { label: "Faculty & Student Empowerment", text: "Equip educators and learners with state-of-the-art cloud computing knowledge and tools." },
    ] 
  },
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

        <div className="mt-16 grid gap-6 md:grid-cols-3 items-start">
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
                
                {/* Paragraph description for Mission & Vision */}
                {p.desc && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                )}

                {/* Structured list for Objectives */}
                {p.items && (
                  <ul className="mt-4 space-y-3">
                    {p.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-brand shadow-[0_0_8px_rgba(79,209,255,0.8)]" />
                        <span>
                          <strong className="font-medium text-foreground">{item.label}</strong> — {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
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