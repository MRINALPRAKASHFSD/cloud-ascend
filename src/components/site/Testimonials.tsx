import { motion } from "framer-motion";
import { Quote, MessageSquareQuote } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { usePublicTestimonials, type PublicTestimonial } from "@/lib/usePublicCms";
import { EmptyState } from "./Events";

const fallback: PublicTestimonial[] = [
  { id: "1", name: "Ananya Gupta", role: "Alumna · SDE at AWS", quote: "The Center gave me production-grade experience before my first job. The rigor here is unmatched.", avatar_url: null },
  { id: "2", name: "Dr. S. Menon", role: "Faculty · CS Dept.", quote: "I've watched students go from curious freshers to shipping distributed systems in two semesters.", avatar_url: null },
  { id: "3", name: "Kabir Sethi", role: "Core Member", quote: "Nothing compares to shipping something real, in production, with 200 concurrent users watching.", avatar_url: null },
  { id: "4", name: "Nikita Roy", role: "Alumna · Cloud Engineer", quote: "The mentorship model is what made me fall in love with infrastructure.", avatar_url: null },
  { id: "5", name: "Aryan Bhatia", role: "Member", quote: "Weekends here feel like a startup. The energy, the whiteboards, the deploys.", avatar_url: null },
  { id: "6", name: "Prof. R. Nair", role: "Advisor", quote: "A center that treats students as engineers first, learners second — and it shows.", avatar_url: null },
];

export function Testimonials() {
  const { data: reviews } = usePublicTestimonials(fallback);

  if (reviews.length === 0) {
    return (
      <section className="relative overflow-hidden py-32">
        <div className="container mx-auto max-w-7xl px-6">
          <SectionHeader eyebrow="Testimonials" title={<>What our community <span className="gradient-text">is saying.</span></>} />
          <EmptyState icon={MessageSquareQuote} label="No testimonials yet" hint="Alumni and members will share their stories here." />
        </div>
      </section>
    );
  }

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
            <li key={`${r.id}-${i}`} className="glass gradient-border w-[380px] shrink-0 rounded-3xl p-6">
              <Quote className="h-6 w-6 text-cyan-brand/70" />
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">"{r.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                {r.avatar_url ? (
                  <img src={r.avatar_url} alt={r.name} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <div
                    className="h-9 w-9 rounded-full"
                    style={{ background: `linear-gradient(135deg, hsl(${195 + (i * 8) % 40} 65% 60%), hsl(${215 + (i * 8) % 30} 65% 50%))` }}
                  />
                )}
                <div>
                  <div className="text-sm font-medium">{r.name}</div>
                  {r.role && <div className="text-xs text-muted-foreground">{r.role}</div>}
                </div>
              </div>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
