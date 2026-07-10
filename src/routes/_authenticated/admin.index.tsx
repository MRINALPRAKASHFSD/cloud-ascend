import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarDays, Users, Boxes, Images, Trophy, Megaphone, ArrowUpRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

const cards = [
  { key: "events", label: "Events", icon: CalendarDays, to: "/admin/events" },
  { key: "members", label: "Members", icon: Users, to: "/admin/members" },
  { key: "projects", label: "Projects", icon: Boxes, to: "/admin/projects" },
  { key: "gallery_items", label: "Gallery", icon: Images, to: "/admin/gallery" },
  { key: "achievements", label: "Achievements", icon: Trophy, to: "/admin/achievements" },
  { key: "announcements", label: "Announcements", icon: Megaphone, to: "/admin/announcements" },
] as const;

function Dashboard() {
  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const results = await Promise.all(
        cards.map(async (c) => {
          const { count } = await supabase.from(c.key as never).select("*", { count: "exact", head: true });
          const { count: published } = await supabase
            .from(c.key as never)
            .select("*", { count: "exact", head: true })
            .eq("status", "published");
          return { key: c.key, total: count ?? 0, published: published ?? 0 };
        }),
      );
      return results.reduce<Record<string, { total: number; published: number }>>((acc, r) => {
        acc[r.key] = { total: r.total, published: r.published };
        return acc;
      }, {});
    },
  });

  const recent = useQuery({
    queryKey: ["admin-recent"],
    queryFn: async () => {
      const { data } = await supabase
        .from("events")
        .select("id, title, status, updated_at")
        .order("updated_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-cyan-brand ring-1 ring-white/10">
            <Sparkles className="h-3 w-3" />
            Overview
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Welcome back.</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage every part of the public website from here.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => {
          const Icon = c.icon;
          const s = stats.data?.[c.key];
          return (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <Link to={c.to} className="glass gradient-border group relative block overflow-hidden rounded-3xl p-6 transition-transform hover:-translate-y-0.5">
                <div className="flex items-start justify-between">
                  <div className="glass grid h-10 w-10 place-items-center rounded-xl">
                    <Icon className="h-4 w-4" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="mt-6 text-3xl font-semibold tracking-tight tabular-nums">
                  {s?.total ?? "—"}
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{c.label}</span>
                  <span className="text-emerald-300">{s?.published ?? 0} live</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-3xl p-6 lg:col-span-2">
          <h2 className="text-sm font-medium tracking-widest text-muted-foreground">RECENT ACTIVITY</h2>
          <ul className="mt-4 space-y-2">
            {(recent.data ?? []).map((r) => (
              <li key={r.id} className="glass flex items-center justify-between rounded-2xl p-3 text-sm">
                <span className="truncate">{r.title}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(r.updated_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </li>
            ))}
            {(!recent.data || recent.data.length === 0) && (
              <li className="text-sm text-muted-foreground">No activity yet. Create your first event to get started.</li>
            )}
          </ul>
        </div>
        <div className="glass rounded-3xl p-6">
          <h2 className="text-sm font-medium tracking-widest text-muted-foreground">QUICK START</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/admin/hero-stats" className="text-cyan-brand hover:underline">→ Set hero statistics</Link></li>
            <li><Link to="/admin/contact" className="text-cyan-brand hover:underline">→ Update contact info</Link></li>
            <li><Link to="/admin/announcements" className="text-cyan-brand hover:underline">→ Post an announcement</Link></li>
            <li><Link to="/admin/footer" className="text-cyan-brand hover:underline">→ Edit footer links</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
