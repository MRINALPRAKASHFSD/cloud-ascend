import { memo, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, Search, Users } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { TiltCard } from "./TiltCard";
import { usePublicMembers, type PublicMember } from "@/lib/usePublicCms";
import { EmptyState } from "./Events";

const fallbackMembers: PublicMember[] = [
  { id: "1", name: "Aarav Sharma", role_label: "Lead", position: "Center Lead · Cloud Architect", skills: ["AWS", "Terraform", "K8s"], hue: 200, linkedin_url: null, github_url: null, email: null, avatar_url: null },
  { id: "2", name: "Ishita Verma", role_label: "Core", position: "SRE & Platform", skills: ["GCP", "Go", "Prometheus"], hue: 215, linkedin_url: null, github_url: null, email: null, avatar_url: null },
  { id: "3", name: "Rohan Mehta", role_label: "Core", position: "AI Infrastructure", skills: ["PyTorch", "Ray", "Triton"], hue: 220, linkedin_url: null, github_url: null, email: null, avatar_url: null },
  { id: "4", name: "Kavya Iyer", role_label: "Core", position: "Edge & Serverless", skills: ["Cloudflare", "Rust", "WASM"], hue: 225, linkedin_url: null, github_url: null, email: null, avatar_url: null },
  { id: "5", name: "Dev Kapoor", role_label: "Mentor", position: "Industry Mentor · Ex-AWS", skills: ["Systems", "Design"], hue: 190, linkedin_url: null, github_url: null, email: null, avatar_url: null },
  { id: "6", name: "Prof. R. Nair", role_label: "Faculty", position: "Faculty Advisor · Distributed Systems", skills: ["Research", "Papers"], hue: 220, linkedin_url: null, github_url: null, email: null, avatar_url: null },
  { id: "7", name: "Simran Kaur", role_label: "Core", position: "DevRel & Community", skills: ["Content", "OSS"], hue: 210, linkedin_url: null, github_url: null, email: null, avatar_url: null },
  { id: "8", name: "Aditya Rao", role_label: "Core", position: "Security & Compliance", skills: ["Zero-trust", "IAM"], hue: 240, linkedin_url: null, github_url: null, email: null, avatar_url: null },
];

export function Members() {
  const { data: members, isLoading } = usePublicMembers(fallbackMembers);
  const [role, setRole] = useState<string>("All");
  const [q, setQ] = useState("");

  const roles = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => set.add(m.role_label));
    return ["All", ...Array.from(set)];
  }, [members]);

  const list = useMemo(() => {
    return members.filter((m) => {
      const roleOk = role === "All" || m.role_label === role;
      const qOk = !q || (m.name + " " + (m.position ?? "") + " " + m.skills.join(" ")).toLowerCase().includes(q.toLowerCase());
      return roleOk && qOk;
    });
  }, [members, role, q]);

  return (
    <section id="members" className="relative py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Members"
          title={<>The people <span className="gradient-text">behind the cloud.</span></>}
          description="Students, mentors and faculty building the Center — one commit, one deploy, one whiteboard at a time."
        />

        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-4 sm:flex-row">
          <div className="glass flex w-full items-center gap-2 rounded-full px-4 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search members, skills, roles…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-1">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`relative rounded-full px-3 py-1.5 text-xs transition-colors ${
                  role === r ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {role === r && <motion.span layoutId="member-pill" className="glass-strong absolute inset-0 -z-10 rounded-full" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                {r}
              </button>
            ))}
          </div>
        </div>

        {isLoading && members.length === 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass gradient-border rounded-3xl p-6 animate-pulse">
                <div className="h-20 w-20 rounded-full bg-white/10" />
                <div className="mt-5 h-3 w-16 rounded-full bg-white/10" />
                <div className="mt-3 h-5 w-32 rounded bg-white/10" />
                <div className="mt-2 h-3 w-24 rounded bg-white/5" />
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <EmptyState icon={Users} label={q || role !== "All" ? "No members match your filters" : "No members yet"} hint={q || role !== "All" ? "Try clearing filters." : "The roster is being finalized — come back soon."} />
        ) : (
          <motion.ul layout className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {list.map((m, i) => (
                <MemberCard key={m.id} m={m} i={i} />
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </section>
  );
}

const MemberCard = memo(function MemberCard({ m, i }: { m: PublicMember; i: number }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.04 }}
      style={{ willChange: "transform" }}
    >
      <TiltCard className="glass gradient-border group relative h-full overflow-hidden rounded-3xl p-6">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(300px 200px at 30% 0%, hsla(${m.hue}, 80%, 65%, 0.14), transparent 70%)` }} />
        <div className="relative" style={{ transform: "translateZ(30px)" }}>
          <div
            className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-full text-2xl font-semibold"
            style={{ background: `linear-gradient(135deg, hsl(${m.hue} 70% 62%), hsl(${(m.hue + 25) % 360} 70% 55%))` }}
          >
            {m.avatar_url ? (
              <img src={m.avatar_url} alt={m.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
            ) : (
              <span className="text-white/95">{m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</span>
            )}
            <span className="absolute inset-0 rounded-full opacity-50 blur-xl" style={{ background: `hsl(${m.hue} 70% 62%)` }} />
          </div>
          <div className="mt-5 flex items-center gap-2">
            <span className="glass rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest text-cyan-brand">{m.role_label}</span>
          </div>
          <h4 className="mt-2 text-lg font-semibold tracking-tight">{m.name}</h4>
          {m.position && <p className="text-xs text-muted-foreground">{m.position}</p>}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {m.skills.map((s) => (
              <span key={s} className="glass rounded-full px-2 py-0.5 text-[10px] text-muted-foreground">{s}</span>
            ))}
          </div>
          <div className="mt-5 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {m.linkedin_url && <a href={m.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="glass grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white/10"><Linkedin className="h-3.5 w-3.5" /></a>}
            {m.github_url && <a href={m.github_url} target="_blank" rel="noreferrer" aria-label="GitHub" className="glass grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white/10"><Github className="h-3.5 w-3.5" /></a>}
            {m.email && <a href={`mailto:${m.email}`} aria-label="Email" className="glass grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white/10"><Mail className="h-3.5 w-3.5" /></a>}
          </div>
        </div>
      </TiltCard>
    </motion.li>
  );
});

