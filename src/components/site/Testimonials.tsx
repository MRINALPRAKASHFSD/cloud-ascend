import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const reviews = [
  { name: "Ananya Gupta", role: "Alumna · SDE at AWS", body: "The Center gave me production-grade experience before my first job. The rigor here is unmatched." },
  { name: "Dr. S. Menon", role: "Faculty · CS Dept.", body: "I've watched students go from curious freshers to shipping distributed systems in two semesters." },
  { name: "Kabir Sethi", role: "Core Member", body: "Nothing compares to shipping something real, in production, with 200 concurrent users watching." },
  { name: "Nikita Roy", role: "Alumna · Cloud Engineer", body: "The mentorship model is what made me fall in love with infrastructure." },
  { name: "Aryan Bhatia", role: "Member", body: "Weekends here feel like a startup. The energy, the whiteboards, the deploys." },
  { name: "Prof. R. Nair", role: "Advisor", body: "A center that treats students as engineers first, learners second — and it shows." },
];

export function Testimonials() {
  const row = [...reviews, ...reviews];
  return (
    <section className="relative overflow-hidden py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Testimonials"
          title={<>What our community <span className="gradient-text">is saying.</span></>}
        />
      </div>

      <div className="relative mt-14">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-background to-transparent" />
        <motion.ul className="flex w-max gap-6 animate-marquee">
          {row.map((r, i) => (
            <li key={i} className="glass gradient-border w-[380px] shrink-0 rounded-3xl p-6">
              <Quote className="h-6 w-6 text-cyan-brand/70" />
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">"{r.body}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-full"
                  style={{ background: `linear-gradient(135deg, hsl(${(i * 40) % 360} 90% 65%), hsl(${(i * 40 + 60) % 360} 90% 65%))` }}
                />
                <div>
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.role}</div>
                </div>
              </div>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
