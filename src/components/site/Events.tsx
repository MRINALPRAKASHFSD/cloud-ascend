import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, Star } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

type Kind = "Workshop" | "Hackathon" | "Bootcamp" | "Seminar" | "Certification";

const events: {
  id: string;
  title: string;
  kind: Kind;
  date: string;
  location: string;
  duration: string;
  featured?: boolean;
  countdown: string; // ISO
  blurb: string;
}[] = [
  {
    id: "1",
    title: "CloudCon '26 — India's Student Cloud Summit",
    kind: "Hackathon",
    date: "Mar 14, 2026",
    location: "KRMU Main Campus",
    duration: "48 hours",
    featured: true,
    countdown: "2026-03-14T09:00:00",
    blurb: "48-hour build sprint on serverless, edge and agentic infra. ₹5L in prizes. Mentors from AWS, GCP, Vercel.",
  },
  { id: "2", title: "Serverless Deep Dive with AWS", kind: "Workshop", date: "Feb 08, 2026", location: "Lab 3B", duration: "3 hrs", countdown: "2026-02-08T14:00:00", blurb: "Hands-on with Lambda, EventBridge, Step Functions." },
  { id: "3", title: "Kubernetes Bootcamp", kind: "Bootcamp", date: "Feb 20, 2026", location: "Online", duration: "5 days", countdown: "2026-02-20T10:00:00", blurb: "Zero to production K8s in a week." },
  { id: "4", title: "The Future of Edge Compute", kind: "Seminar", date: "Feb 27, 2026", location: "Auditorium", duration: "90 min", countdown: "2026-02-27T16:00:00", blurb: "Keynote by industry leaders on edge architectures." },
  { id: "5", title: "AWS Cloud Practitioner Prep", kind: "Certification", date: "Mar 05, 2026", location: "Lab 4A", duration: "2 weeks", countdown: "2026-03-05T10:00:00", blurb: "Full exam prep + free voucher for top participants." },
];

const filters: (Kind | "All")[] = ["All", "Workshop", "Hackathon", "Bootcamp", "Seminar", "Certification"];

function useCountdown(iso: string) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(iso).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
}

export function Events() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const list = filter === "All" ? events : events.filter((e) => e.kind === filter);
  const featured = events.find((e) => e.featured)!;
  const cd = useCountdown(featured.countdown);

  return (
    <section id="events" className="relative py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Upcoming Events"
          title={<>Learn. Build. <span className="gradient-text">Ship together.</span></>}
          description="Workshops, hackathons and bootcamps designed to move you from curious to production-ready."
        />

        {/* Featured */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9 }}
          className="glass gradient-border noise relative mt-14 overflow-hidden rounded-[32px] p-8 md:p-12"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full opacity-30 blur-3xl"
            style={{ background: "var(--gradient-brand)" }}
          />
          <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-cyan-brand">
                <Star className="h-3 w-3" /> Featured
              </span>
              <h3 className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                {featured.title}
              </h3>
              <p className="mt-4 max-w-xl text-muted-foreground">{featured.blurb}</p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4 text-cyan-brand" />{featured.date}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-cyan-brand" />{featured.location}</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-cyan-brand" />{featured.duration}</span>
              </div>
              <a
                href="#contact"
                className="mt-8 inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_rgba(79,209,255,0.7)] transition-transform hover:scale-[1.03]"
                style={{ background: "var(--gradient-brand)" }}
              >
                Register now
              </a>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[{ l: "Days", v: cd.d }, { l: "Hrs", v: cd.h }, { l: "Min", v: cd.m }, { l: "Sec", v: cd.s }].map((c) => (
                <div key={c.l} className="glass rounded-2xl p-4 text-center">
                  <div className="font-mono text-3xl font-semibold tracking-tight tabular-nums md:text-4xl">
                    {String(c.v).padStart(2, "0")}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{c.l}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="mt-16 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                filter === f ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter === f && (
                <motion.span layoutId="event-filter" className="glass-strong absolute inset-0 -z-10 rounded-full" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.ul layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.filter((e) => !e.featured).map((e, i) => (
              <motion.li
                key={e.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className="glass gradient-border group relative overflow-hidden rounded-3xl p-6"
              >
                <span className="glass inline-flex rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-cyan-brand">{e.kind}</span>
                <h4 className="mt-4 text-lg font-semibold leading-tight">{e.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{e.blurb}</p>
                <div className="mt-5 space-y-1.5 text-xs text-muted-foreground">
                  <div className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{e.date}</div>
                  <div className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{e.location}</div>
                </div>
                <a
                  href="#contact"
                  className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-cyan-brand transition-transform group-hover:translate-x-1"
                >
                  Register →
                </a>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
