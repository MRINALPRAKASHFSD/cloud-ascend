import { memo, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, CircleDot, FolderGit2 } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { usePublicProjects, type PublicProject } from "@/lib/usePublicCms";
import { EmptyState } from "./Events";

const fallbackProjects: PublicProject[] = [
  { id: "a", title: "NimbusGate", category: "Infra", lifecycle: "Live", description: "A student-built API gateway with edge caching, rate limits and observability — running on Cloudflare Workers.", stack: ["Rust", "Workers", "OTel"], featured: true, gradient: "linear-gradient(135deg,#7DD3FC,#3B6FE0)", github_url: null, website_url: null },
  { id: "b", title: "Cirrus AI", category: "AI", lifecycle: "Beta", description: "Serverless inference orchestrator with cost-aware routing across GPU providers.", stack: ["Python", "Ray", "Redis"], featured: false, gradient: "linear-gradient(135deg,#38BDF8,#7DD3FC)", github_url: null, website_url: null },
  { id: "c", title: "Stratus", category: "Web", lifecycle: "Live", description: "Beautiful dashboards for your cloud spend — real-time, multi-cloud, opinionated.", stack: ["Next.js", "tRPC", "Postgres"], featured: false, gradient: "linear-gradient(135deg,#3B6FE0,#7DD3FC)", github_url: null, website_url: null },
  { id: "d", title: "Alto Mesh", category: "Infra", lifecycle: "R&D", description: "A lightweight service mesh for university-scale microservices — no sidecar, just eBPF.", stack: ["Go", "eBPF", "K8s"], featured: false, gradient: "linear-gradient(135deg,#7DD3FC,#38BDF8)", github_url: null, website_url: null },
  { id: "e", title: "Vector Vault", category: "Research", lifecycle: "R&D", description: "Efficient encrypted vector search over multi-tenant workloads.", stack: ["C++", "CUDA"], featured: false, gradient: "linear-gradient(135deg,#3B6FE0,#38BDF8)", github_url: null, website_url: null },
  { id: "f", title: "SkyLab", category: "Web", lifecycle: "Beta", description: "One-click reproducible cloud labs for the classroom.", stack: ["Docker", "React"], featured: false, gradient: "linear-gradient(135deg,#38BDF8,#3B6FE0)", github_url: null, website_url: null },
];

export function Projects() {
  const { data: projects, isLoading } = usePublicProjects(fallbackProjects);
  const [cat, setCat] = useState<string>("All");

  const cats = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [projects]);

  const list = cat === "All" ? projects : projects.filter((p) => p.category === cat);

  return (
    <section id="projects" className="relative py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Projects"
          title={<>Real systems, <span className="gradient-text">shipped in the open.</span></>}
          description="Every project is designed, built and operated by our members — many under active use in production."
        />

        {cats.length > 2 && (
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
        )}

        {isLoading && projects.length === 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass gradient-border rounded-3xl overflow-hidden animate-pulse">
                <div className="h-40 bg-white/5" />
                <div className="p-6">
                  <div className="h-5 w-1/2 rounded bg-white/10" />
                  <div className="mt-3 h-3 w-full rounded bg-white/5" />
                  <div className="mt-2 h-3 w-2/3 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <EmptyState icon={FolderGit2} label="No projects to show yet" hint="We're pushing new work every semester — stay tuned." />
        ) : (
          <motion.div layout className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-[340px]">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <ProjectCard key={p.id} p={p} i={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}

const ProjectCard = memo(function ProjectCard({ p, i }: { p: PublicProject; i: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.55, delay: Math.min(i, 6) * 0.05 }}
      whileHover={{ y: -8 }}
      style={{ willChange: "transform" }}
      className={`glass gradient-border group relative overflow-hidden rounded-3xl ${p.featured ? "md:col-span-2 md:row-span-1" : ""}`}
    >
      <div className="relative h-40 overflow-hidden" style={{ background: p.gradient ?? "linear-gradient(135deg,#7DD3FC,#3B6FE0)" }}>
        <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ background: "radial-gradient(600px 200px at 50% 0%, rgba(255,255,255,0.6), transparent 60%)" }} />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <svg className="absolute inset-x-0 bottom-0 h-24 w-full" viewBox="0 0 400 100" preserveAspectRatio="none">
          <path d="M0,80 C100,20 300,120 400,40 L400,100 L0,100 Z" fill="rgba(255,255,255,0.08)" />
        </svg>
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-white backdrop-blur">
          <CircleDot className="h-3 w-3" />
          {p.lifecycle}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-cyan-brand">
          <span className="glass rounded-full px-2 py-0.5">{p.category}</span>
        </div>
        <h3 className="mt-3 text-xl font-semibold tracking-tight">{p.title}</h3>
        {p.description && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <span key={s} className="glass rounded-full px-2 py-0.5 text-[10px] text-muted-foreground">{s}</span>
            ))}
          </div>
          <div className="flex gap-1.5">
            {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" aria-label="GitHub" className="glass grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"><Github className="h-3.5 w-3.5" /></a>}
            {p.website_url && <a href={p.website_url} target="_blank" rel="noreferrer" aria-label="Website" className="glass grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"><ExternalLink className="h-3.5 w-3.5" /></a>}
          </div>
        </div>
      </div>
    </motion.article>
  );
});

