import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, Search } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { TiltCard } from "./TiltCard";

type Role = "Lead" | "Core" | "Mentor" | "Faculty";

const members: {
  name: string;
  role: Role;
  position: string;
  skills: string[];
  hue: number;
}[] = [
  { name: "Aarav Sharma", role: "Lead", position: "Center Lead · Cloud Architect", skills: ["AWS", "Terraform", "K8s"], hue: 200 },
  { name: "Ishita Verma", role: "Core", position: "SRE & Platform", skills: ["GCP", "Go", "Prometheus"], hue: 260 },
  { name: "Rohan Mehta", role: "Core", position: "AI Infrastructure", skills: ["PyTorch", "Ray", "Triton"], hue: 220 },
  { name: "Kavya Iyer", role: "Core", position: "Edge & Serverless", skills: ["Cloudflare", "Rust", "WASM"], hue: 280 },
  { name: "Dev Kapoor", role: "Mentor", position: "Industry Mentor · Ex-AWS", skills: ["Systems", "Design"], hue: 190 },
  { name: "Prof. R. Nair", role: "Faculty", position: "Faculty Advisor · Distributed Systems", skills: ["Research", "Papers"], hue: 250 },
  { name: "Simran Kaur", role: "Core", position: "DevRel & Community", skills: ["Content", "OSS"], hue: 210 },
  { name: "Aditya Rao", role: "Core", position: "Security & Compliance", skills: ["Zero-trust", "IAM"], hue: 240 },
];

const roles: (Role | "All")[] = ["All", "Lead", "Core", "Mentor", "Faculty"];

export function Members() {
  const [role, setRole] = useState<(typeof roles)[number]>("All");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    return members.filter((m) => {
      const roleOk = role === "All" || m.role === role;
      const qOk = !q || (m.name + " " + m.position + " " + m.skills.join(" ")).toLowerCase().includes(q.toLowerCase());
      return roleOk && qOk;
    });
  }, [role, q]);

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

        <motion.ul layout className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((m, i) => (
              <motion.li
                key={m.name}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
              >
                <TiltCard className="glass gradient-border group relative h-full overflow-hidden rounded-3xl p-6">
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(300px 200px at 30% 0%, hsla(${m.hue},100%,70%,0.18), transparent 70%)` }} />
                  <div className="relative" style={{ transform: "translateZ(30px)" }}>
                    <div
                      className="relative grid h-20 w-20 place-items-center rounded-full text-2xl font-semibold"
                      style={{ background: `linear-gradient(135deg, hsl(${m.hue} 90% 65%), hsl(${(m.hue + 60) % 360} 90% 65%))` }}
                    >
                      <span className="text-white/95">{m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</span>
                      <span className="absolute inset-0 rounded-full opacity-50 blur-xl" style={{ background: `hsl(${m.hue} 90% 65%)` }} />
                    </div>
                    <div className="mt-5 flex items-center gap-2">
                      <span className="glass rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest text-cyan-brand">{m.role}</span>
                    </div>
                    <h4 className="mt-2 text-lg font-semibold tracking-tight">{m.name}</h4>
                    <p className="text-xs text-muted-foreground">{m.position}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {m.skills.map((s) => (
                        <span key={s} className="glass rounded-full px-2 py-0.5 text-[10px] text-muted-foreground">{s}</span>
                      ))}
                    </div>
                    <div className="mt-5 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {[Linkedin, Github, Mail].map((Icon, i) => (
                        <a key={i} href="#" className="glass grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white/10">
                          <Icon className="h-3.5 w-3.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
