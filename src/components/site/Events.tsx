import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, Star, CalendarX } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { usePublicEvents, type PublicEvent } from "@/lib/usePublicCms";

const fallbackEvents: PublicEvent[] = [
  { id: "1", title: "CloudCon '26 — India's Student Cloud Summit", tag: "Hackathon", location: "KRMU Main Campus", starts_at: "2026-03-14T09:00:00Z", ends_at: "2026-03-16T09:00:00Z", summary: "48-hour build sprint on serverless, edge and agentic infra. ₹5L in prizes. Mentors from AWS, GCP, Vercel.", sort_order: 0 },
  { id: "2", title: "Serverless Deep Dive with AWS", tag: "Workshop", location: "Lab 3B", starts_at: "2026-02-08T14:00:00Z", ends_at: "2026-02-08T17:00:00Z", summary: "Hands-on with Lambda, EventBridge, Step Functions.", sort_order: 1 },
  { id: "3", title: "Kubernetes Bootcamp", tag: "Bootcamp", location: "Online", starts_at: "2026-02-20T10:00:00Z", ends_at: "2026-02-25T10:00:00Z", summary: "Zero to production K8s in a week.", sort_order: 2 },
  { id: "4", title: "The Future of Edge Compute", tag: "Seminar", location: "Auditorium", starts_at: "2026-02-27T16:00:00Z", ends_at: "2026-02-27T17:30:00Z", summary: "Keynote by industry leaders on edge architectures.", sort_order: 3 },
  { id: "5", title: "AWS Cloud Practitioner Prep", tag: "Certification", location: "Lab 4A", starts_at: "2026-03-05T10:00:00Z", ends_at: "2026-03-19T10:00:00Z", summary: "Full exam prep + free voucher for top participants.", sort_order: 4 },
];

function Countdown({ iso }: { iso: string | null }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!iso) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [iso]);
  const target = iso ? new Date(iso).getTime() : now;
  const diff = Math.max(0, target - now);
  const cd = {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
  return (
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
  );
}


function formatDate(iso: string | null) {
  if (!iso) return "TBA";
  try { return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" }); }
  catch { return "TBA"; }
}

function formatDuration(start: string | null, end: string | null) {
  if (!start || !end) return "";
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (ms <= 0) return "";
  const hours = ms / 3600000;
  if (hours < 24) return `${Math.round(hours)} hrs`;
  const days = Math.round(hours / 24);
  return days === 1 ? "1 day" : `${days} days`;
}

export function Events() {
  const { data: events, isLoading, isError } = usePublicEvents(fallbackEvents);
  const [filter, setFilter] = useState<string>("All");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => e.tag && set.add(e.tag));
    return ["All", ...Array.from(set)];
  }, [events]);

  const featured = events[0];
  const list = filter === "All" ? events : events.filter((e) => e.tag === filter);
  

  if (!featured) {
    return (
      <section id="events" className="relative py-32">
        <div className="container mx-auto max-w-7xl px-6">
          <SectionHeader
            eyebrow="Upcoming Events"
            title={<>Learn. Build. <span className="gradient-text">Ship together.</span></>}
          />
          <EmptyState icon={CalendarX} label={isError ? "Couldn't load events" : "No events scheduled yet"} hint="Check back soon — new sessions are added weekly." />
        </div>
      </section>
    );
  }

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
              {featured.summary && <p className="mt-4 max-w-xl text-muted-foreground">{featured.summary}</p>}
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4 text-cyan-brand" />{formatDate(featured.starts_at)}</span>
                {featured.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-cyan-brand" />{featured.location}</span>}
                {formatDuration(featured.starts_at, featured.ends_at) && (
                  <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-cyan-brand" />{formatDuration(featured.starts_at, featured.ends_at)}</span>
                )}
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
        {allTags.length > 2 && (
          <div className="mt-16 flex flex-wrap justify-center gap-2">
            {allTags.map((f) => (
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
        )}

        {/* Grid */}
        {isLoading ? (
          <SkeletonGrid />
        ) : (
          <motion.ul layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.filter((e) => e.id !== featured.id).map((e, i) => (
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
                  {e.tag && <span className="glass inline-flex rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-cyan-brand">{e.tag}</span>}
                  <h4 className="mt-4 text-lg font-semibold leading-tight">{e.title}</h4>
                  {e.summary && <p className="mt-2 text-sm text-muted-foreground">{e.summary}</p>}
                  <div className="mt-5 space-y-1.5 text-xs text-muted-foreground">
                    <div className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formatDate(e.starts_at)}</div>
                    {e.location && <div className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{e.location}</div>}
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
        )}
      </div>
    </section>
  );
}

function SkeletonGrid() {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="glass gradient-border rounded-3xl p-6 animate-pulse">
          <div className="h-4 w-20 rounded-full bg-white/10" />
          <div className="mt-4 h-5 w-3/4 rounded bg-white/10" />
          <div className="mt-3 h-3 w-full rounded bg-white/5" />
          <div className="mt-2 h-3 w-2/3 rounded bg-white/5" />
          <div className="mt-6 h-3 w-1/2 rounded bg-white/5" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon, label, hint }: { icon: React.ComponentType<{ className?: string }>; label: string; hint?: string }) {
  return (
    <div className="mt-14 grid place-items-center">
      <div className="glass gradient-border relative flex max-w-md flex-col items-center rounded-[32px] p-10 text-center">
        <div className="glass grid h-16 w-16 place-items-center rounded-2xl">
          <Icon className="h-7 w-7 text-cyan-brand" />
        </div>
        <div className="mt-5 text-lg font-semibold">{label}</div>
        {hint && <p className="mt-2 text-sm text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}
