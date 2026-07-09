import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, CircleDot } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

type Cat = "All" | "AI" | "Infra" | "Web" | "Research";

const projects: {
  id: string;
  title: string;
  tag: Cat;
  status: "Live" | "Beta" | "R&D";
  desc: string;
  stack: string[];
  featured?: boolean;
  gradient: string;
}[] = [
  { id: "a", title: "NimbusGate", tag: "Infra", status: "Live", desc: "A student-built API gateway with edge caching, rate limits and observability — running on Cloudflare Workers.", stack: ["Rust", "Workers", "OTel"], featured: true, gradient: "linear-gradient(135deg,#4FD1FF,#8B5CF6)" },
  { id: "b", title: "Cirrus AI", tag: "AI", status: "Beta", desc: "Serverless inference orchestrator with cost-aware routing across GPU providers.", stack: ["Python", "Ray", "Redis"], gradient: "linear-gradient(135deg,#6AE3FF,#4FD1FF)" },
  { id: "c", title: "Stratus", tag: "Web", status: "Live", desc: "Beautiful dashboards for your cloud spend — real-time, multi-cloud, opinionated.", stack: ["Next.js", "tRPC", "Postgres"], gradient: "linear-gradient(135deg,#8B5CF6,#4FD1FF)" },
  { id: "d", title: "Alto Mesh", tag: "Infra", status: "R&D", desc: "A lightweight service mesh for university-scale microservices — no sidecar, just eBPF.", stack: ["Go", "eBPF", "K8s"], gradient: "linear-gradient(135deg,#4FD1FF,#6AE3FF)" },
  { id: "e", title: "Vector Vault", tag: "Research", status: "R&D", desc: "Efficient encrypted vector search over multi-tenant workloads.", stack: ["C++", "CUDA"], gradient: "linear-gradient(135deg,#8B5CF6,#6AE3FF)" },
  { id: "f", title: "SkyLab", tag: "Web", status: "Beta", desc: "One-click reproducible cloud labs for the classroom.", stack: ["Docker", "React"], gradient: "linear-gradient(135deg,#6AE3FF,#8B5CF6)" },
];

const cats: Cat[] = ["All", "AI", "Infra", "Web", "Research"];

export function Projects() {
  const [cat, setCat] = useState<Cat>("All");
  const list = cat === "All" ? projects : projects.filter((p) => p.tag === cat);

  return (
    <section id="projects" className="relative py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Projects"
          title={<>Real systems, <span className="gradient-text">shipped in the open.</span></>}
          description="Every project is designed, built and operated by our members — many under active use in production."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`relative rounded-full px-4 py-1.5 text-sm transition-colors ${cat === c ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {cat === c && <motion.span layoutId="proj-pill" className="glass-strong absolute inset-0 -z-10 rounded-full" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-[340px]">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.article
                key={p.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.55, delay: i * 0.05 }}
                whileHover={{ y: -8 }}
                className={`glass gradient-border group relative overflow-hidden rounded-3xl ${p.featured ? "md:col-span-2 md:row-span-1" : ""}`}
              >
                <div className="relative h-40 overflow-hidden" style={{ background: p.gradient }}>
                  <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ background: "radial-gradient(600px 200px at 50% 0%, rgba(255,255,255,0.6), transparent 60%)" }} />
                  <div className="absolute inset-0 grid-bg opacity-30" />
                  <svg className="absolute inset-x-0 bottom-0 h-24 w-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <path d="M0,80 C100,20 300,120 400,40 L400,100 L0,100 Z" fill="rgba(255,255,255,0.08)" />
                  </svg>
                  <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-white backdrop-blur">
                    <CircleDot className="h-3 w-3" />
                    {p.status}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-cyan-brand">
                    <span className="glass rounded-full px-2 py-0.5">{p.tag}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.desc}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {p.stack.map((s) => (
                        <span key={s} className="glass rounded-full px-2 py-0.5 text-[10px] text-muted-foreground">{s}</span>
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      <a href="#" className="glass grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"><Github className="h-3.5 w-3.5" /></a>
                      <a href="#" className="glass grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"><ExternalLink className="h-3.5 w-3.5" /></a>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
