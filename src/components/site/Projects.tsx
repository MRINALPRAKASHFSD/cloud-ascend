import { memo, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, CircleDot, FolderGit2, User } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { usePublicProjects, type PublicProject } from "@/lib/usePublicCms";
import { EmptyState } from "./Events";

// Extended interface with image, author, and roll number support
export interface ExtendedPublicProject extends PublicProject {
  image?: string;
  author?: string;
  rollNo?: string;
}

const fallbackProjects: ExtendedPublicProject[] = [
  {
    id: "paradigm-shift",
    title: "Paradigm Shift",
    category: "Productivity",
    lifecycle: "Live",
    description:
      "A progressive web application engineered to transform workflows, reduce cognitive overload, and optimize task structuring through visual mapping.",
    image: "/projects/paradigm.png",
    stack: ["React", "Vercel", "Serverless", "Workflow Engine"],
    featured: true,
    gradient: "linear-gradient(135deg,#06B6D4,#3B82F6)",
    github_url: "https://github.com/MRINALPRAKASHFSD/PARADIGM_SHIFT",
    website_url: "https://mini-project-paradigm-shift-5y6i.vercel.app/",
    author: "Mrinal Prakash",
    rollNo: "2401010182",
  },
  {
    id: "mindspace",
    title: "MindSpace",
    category: "AI & Analytics",
    lifecycle: "Live",
    description:
      "An analytical platform evaluating student burnout and cognitive wellness using Python NLP algorithms and Flask backend intelligence.",
    image: "/projects/mindspace.png",
    stack: ["Python", "Flask", "NLP", "Vercel"],
    featured: false,
    gradient: "linear-gradient(135deg,#8B5CF6,#EC4899)",
    github_url: "https://github.com/Inkesk-Dozing/MindSpace",
    website_url: "https://mindspace-sepia.vercel.app/",
    author: "Harsh Dev Jha",
    rollNo: "2501010168",
  },
  {
    id: "airis-security",
    title: "AIRIS Security",
    category: "Security",
    lifecycle: "Live",
    description:
      "AI-powered vulnerability assessment running 4 security scanners in parallel with hybrid ML risk scoring and automated PDF report generation.",
    image: "/projects/airis.png",
    stack: ["Python", "Machine Learning", "Security", "Vercel"],
    featured: false,
    gradient: "linear-gradient(135deg,#0EA5E9,#6366F1)",
    github_url: "https://github.com/Kush05Bhardwaj/AIris-Security_AI-Powered-Vulnerability-Scanner",
    website_url: "https://airis-security1.vercel.app/",
    author: "Kushagra Bhardwaj",
    rollNo: "2401010029",
  },
  {
    id: "ecl-parcel",
    title: "ECL Parcel",
    category: "Logistics",
    lifecycle: "Live",
    description:
      "Enterprise consignment tracking and courier dispatch platform tailored for end-to-end supply chain transparency and milestone tracking.",
    image: "/projects/ecl.png",
    stack: ["Web", "Custom Domain", "REST API", "Database"],
    featured: false,
    gradient: "linear-gradient(135deg,#2563EB,#06B6D4)",
    github_url: "https://github.com/Kush05Bhardwaj/ECL",
    website_url: "https://www.eclparcel.in",
    author: "Kushagra Bhardwaj",
    rollNo: "2401010029",
  },
  {
    id: "origo",
    title: "Origo",
    category: "Travel Tech",
    lifecycle: "Live",
    description:
      "A smart city explorer adapting dynamic itinerary recommendations and local attraction highlights in real-time based on live meteorological data.",
    image: "/projects/origo.png",
    stack: ["JavaScript", "Weather API", "Netlify", "Open Source"],
    featured: false,
    gradient: "linear-gradient(135deg,#10B981,#059669)",
    github_url: "https://github.com/obscure-01/origo",
    website_url: "https://origo-explore.netlify.app/",
    author: "Aman Chapadiya",
    rollNo: "2401010267",
  },
];

export function Projects() {
  const { data: projects, isLoading } = usePublicProjects(fallbackProjects as PublicProject[]);
  const [cat, setCat] = useState<string>("All");

  const projectList = (
    projects && projects.length > 0 ? projects : fallbackProjects
  ) as ExtendedPublicProject[];

  const cats = useMemo(() => {
    const set = new Set<string>();
    projectList.forEach((p) => set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [projectList]);

  const list = cat === "All" ? projectList : projectList.filter((p) => p.category === cat);

  return (
    <section id="projects" className="relative py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Projects"
          title={
            <>
              Real systems, <span className="gradient-text">shipped in the open.</span>
            </>
          }
          description="Every project is designed, built and operated by our members — many under active use in production."
        />

        {cats.length > 2 && (
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`relative rounded-full px-4 py-1.5 text-sm transition-colors ${
                  cat === c
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === c && (
                  <motion.span
                    layoutId="proj-pill"
                    className="glass-strong absolute inset-0 -z-10 rounded-full border border-cyan-brand/30 shadow-[0_0_12px_rgba(79,209,255,0.2)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {c}
              </button>
            ))}
          </div>
        )}

        {isLoading && projectList.length === 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="glass gradient-border rounded-3xl overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-muted/40" />
                <div className="p-6">
                  <div className="h-5 w-1/2 rounded bg-muted/60" />
                  <div className="mt-3 h-3 w-full rounded bg-muted/40" />
                  <div className="mt-2 h-3 w-2/3 rounded bg-muted/40" />
                </div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <EmptyState
            icon={FolderGit2}
            label="No projects to show yet"
            hint="We're pushing new work every semester — stay tuned."
          />
        ) : (
          <motion.div
            layout
            className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr"
          >
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

const ProjectCard = memo(function ProjectCard({ p, i }: { p: ExtendedPublicProject; i: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.55, delay: Math.min(i, 6) * 0.05 }}
      whileHover={{ y: -8 }}
      style={{ willChange: "transform" }}
      className={`glass gradient-border group relative flex flex-col justify-between overflow-hidden rounded-3xl ${
        p.featured ? "md:col-span-2" : ""
      }`}
    >
      <div>
        {/* Visual Banner with Image & Fallback */}
        <div
          className="relative h-48 overflow-hidden bg-muted/20"
          style={{ background: p.gradient ?? "linear-gradient(135deg,#7DD3FC,#3B6FE0)" }}
        >
          {p.image ? (
            <>
              <img
                src={p.image}
                alt={p.title}
                className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
              />
              {/* Subtle top-to-bottom vignette overlay for badge clarity */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50" />
            </>
          ) : (
            <>
              <div
                className="absolute inset-0 opacity-40 mix-blend-overlay"
                style={{
                  background:
                    "radial-gradient(600px 200px at 50% 0%, rgba(255,255,255,0.6), transparent 60%)",
                }}
              />
              <div className="absolute inset-0 grid-bg opacity-30" />
              <svg
                className="absolute inset-x-0 bottom-0 h-24 w-full"
                viewBox="0 0 400 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,80 C100,20 300,120 400,40 L400,100 L0,100 Z"
                  fill="rgba(255,255,255,0.08)"
                />
              </svg>
            </>
          )}

          {/* Lifecycle Pill */}
          <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-white backdrop-blur border border-white/15 shadow-sm">
            <CircleDot className="h-3 w-3 text-emerald-400" />
            {p.lifecycle}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <div className="flex items-center justify-between gap-2">
            <span className="glass rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-cyan-brand border border-cyan-brand/20 font-mono">
              {p.category}
            </span>
            {p.author && (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                <User className="h-3 w-3 text-cyan-brand/80" />
                {p.author}
              </span>
            )}
          </div>

          <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground group-hover:text-cyan-brand transition-colors">
            {p.title}
          </h3>
          {p.description && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {p.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer / Stack & Links */}
      <div className="p-6 pt-0 mt-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <span
                key={s}
                className="glass rounded-full px-2 py-0.5 text-[10px] text-muted-foreground border border-border/50"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            {p.github_url && (
              <a
                href={p.github_url}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Repository"
                className="glass grid h-8 w-8 place-items-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border/60"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
            )}
            {p.website_url && (
              <a
                href={p.website_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Live Website"
                className="glass grid h-8 w-8 place-items-center rounded-full hover:bg-muted text-cyan-brand hover:text-cyan-brand/80 transition-colors border border-cyan-brand/30"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
});
