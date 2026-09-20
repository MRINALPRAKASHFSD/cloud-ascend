import { memo, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, Search, Users } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { TiltCard } from "./TiltCard";
import { usePublicMembers, type PublicMember } from "@/lib/usePublicCms";
import { EmptyState } from "./Events";

// Helper to generate image path if avatar_url is not explicitly provided
function getMemberImagePath(name: string, explicitAvatarUrl: string | null | undefined): string {
  if (explicitAvatarUrl) return explicitAvatarUrl;

  // Normalizes name: "Dr. Yogita Yashveer Raghav" -> "yogita-yashveer-raghav"
  const cleanSlug = name
    .toLowerCase()
    .replace(/^(dr\.|mr\.|ms\.|prof\.)\s+/i, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-");

  return `/members/${cleanSlug}.png`;
}

const fallbackMembers: PublicMember[] = [
  {
    id: "0",
    name: "Dr. Yogita Yashveer Raghav",
    role_label: "Chairperson",
    position: "Assistant Professor, SOET",
    skills: [],
    hue: 10,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/yogita_mam.jpg",
  },
  {
    id: "1",
    name: "Aarav Sharma",
    role_label: "Lead",
    position: "Center Lead · Cloud Architect",
    skills: ["AWS", "Terraform", "K8s"],
    hue: 200,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/aarav-sharma.png",
  },
  {
    id: "2",
    name: "Ishita Verma",
    role_label: "Core",
    position: "SRE & Platform",
    skills: ["GCP", "Go", "Prometheus"],
    hue: 215,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/ishita-verma.png",
  },
  {
    id: "3",
    name: "Rohan Mehta",
    role_label: "Core",
    position: "AI Infrastructure",
    skills: ["PyTorch", "Ray", "Triton"],
    hue: 220,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/rohan-mehta.png",
  },
  {
    id: "4",
    name: "Kavya Iyer",
    role_label: "Core",
    position: "Edge & Serverless",
    skills: ["Cloudflare", "Rust", "WASM"],
    hue: 225,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/kavya-iyer.png",
  },
  {
    id: "5",
    name: "Dev Kapoor",
    role_label: "Mentor",
    position: "Industry Mentor · Ex-AWS",
    skills: ["Systems", "Design"],
    hue: 190,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/dev-kapoor.png",
  },
  {
    id: "6",
    name: "Prof. R. Nair",
    role_label: "Faculty",
    position: "Faculty Advisor · Distributed Systems",
    skills: ["Research", "Papers"],
    hue: 220,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/r-nair.png",
  },
  {
    id: "7",
    name: "Simran Kaur",
    role_label: "Core",
    position: "DevRel & Community",
    skills: ["Content", "OSS"],
    hue: 210,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/simran-kaur.png",
  },
  {
    id: "8",
    name: "Aditya Rao",
    role_label: "Core",
    position: "Security & Compliance",
    skills: ["Zero-trust", "IAM"],
    hue: 240,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/aditya-rao.png",
  },
  {
    id: "9",
    name: "Mrinal Prakash",
    role_label: "Student Secretariat",
    position: "President",
    skills: [],
    hue: 220,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/mrinal-prakash.png",
  },
  {
    id: "10",
    name: "Harsh Dev Jha",
    role_label: "Student Secretariat",
    position: "Vice President",
    skills: [],
    hue: 215,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/harsh-dev-jha.png",
  },
  {
    id: "11",
    name: "Aman Chapadiya",
    role_label: "Student Secretariat",
    position: "Secretary",
    skills: [],
    hue: 210,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/aman-chapadiya.png",
  },
  {
    id: "12",
    name: "Manas Bhasker",
    role_label: "Student Secretariat",
    position: "Logistic Lead",
    skills: [],
    hue: 225,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/manas-bhasker.png",
  },
  {
    id: "13",
    name: "Shourya Pratap Singh",
    role_label: "Student Secretariat",
    position: "Tech Lead",
    skills: [],
    hue: 240,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/shourya-pratap.png",
  },
  {
    id: "14",
    name: "Aditya Bhatia",
    role_label: "Student Secretariat",
    position: "Social Media Head",
    skills: [],
    hue: 35,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/aditya-bhatia.png",
  },
  {
    id: "15",
    name: "Ishan Rawat",
    role_label: "Student Secretariat",
    position: "Logistic Head",
    skills: [],
    hue: 20,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/ishan-rawat.png",
  },
  {
    id: "16",
    name: "Ritik",
    role_label: "Student Secretariat",
    position: "Social Media Head",
    skills: [],
    hue: 10,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/ritik.jpg",
  },
  {
    id: "17",
    name: "Dr. Saneh Lata Yadav",
    role_label: "Faculty",
    position: "Assistant Professor, SOET",
    skills: [],
    hue: 220,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/saneh-lata-yadav.png",
  },
  {
    id: "18",
    name: "Ms. Megha Sharma",
    role_label: "Faculty",
    position: "Assistant Professor, SOET",
    skills: [],
    hue: 220,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/megha-sharma.png",
  },
  {
    id: "19",
    name: "Dr. Preeti Rathi",
    role_label: "Faculty",
    position: "Assistant Professor, SOET",
    skills: [],
    hue: 220,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/preeti-rathi.png",
  },
  {
    id: "20",
    name: "Ms. Jyoti Kataria",
    role_label: "Faculty",
    position: "Assistant Professor, SOET",
    skills: [],
    hue: 220,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/jyoti-kataria.png",
  },
  {
    id: "21",
    name: "Ms. Lucky Verma",
    role_label: "Faculty",
    position: "Assistant Professor, SOET",
    skills: [],
    hue: 220,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/lucky-verma.png",
  },
  {
    id: "22",
    name: "Dr. Ruby Jindal",
    role_label: "Faculty",
    position: "Associate Professor, SBAS",
    skills: [],
    hue: 220,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/ruby-jindal.png",
  },
  {
    id: "23",
    name: "Dr. Seema Raj",
    role_label: "Faculty",
    position: "Professor, SBAS & Associate Dean - RDC",
    skills: [],
    hue: 220,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/seema-raj.png",
  },
  {
    id: "24",
    name: "Dr. Sunil Kumar",
    role_label: "Faculty",
    position: "Assistant Professor (Senior Scale), SMAS",
    skills: [],
    hue: 220,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/sunil-kumar.png",
  },
  {
    id: "25",
    name: "Dr. Deepak Kumar",
    role_label: "Faculty",
    position: "Assistant Professor, SOAS",
    skills: [],
    hue: 220,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/deepak-kumar.png",
  },
  {
    id: "26",
    name: "Dr. Anumeha Mathur",
    role_label: "Faculty",
    position: "SOMC",
    skills: [],
    hue: 220,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/anumeha-mathur.png",
  },
  {
    id: "27",
    name: "Dr. Mina Kumari",
    role_label: "Faculty",
    position: "Assistant Professor (Selection Grade), SBAS",
    skills: [],
    hue: 220,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/mina-kumari.png",
  },
  {
    id: "28",
    name: "Dr. Sarina",
    role_label: "Faculty",
    position: "Assistant Professor (Senior Scale), SEMCE",
    skills: [],
    hue: 220,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/sarina.png",
  },
  {
    id: "29",
    name: "Ms. Poonam Yadav",
    role_label: "Faculty",
    position: "Assistant Professor (Senior Scale), SEMCE",
    skills: [],
    hue: 220,
    linkedin_url: null,
    github_url: null,
    email: null,
    avatar_url: "/members/poonam-yadav.png",
  },
];

export function Members() {
  const { data: members, isLoading } = usePublicMembers(fallbackMembers);
  const [role, setRole] = useState<string>("All");
  const [q, setQ] = useState("");

  const memberList = members && members.length > 0 ? members : fallbackMembers;

  const roles = useMemo(() => {
    const set = new Set<string>();
    memberList.forEach((m) => set.add(m.role_label));
    return ["All", ...Array.from(set)];
  }, [memberList]);

  const list = useMemo(() => {
    return memberList.filter((m) => {
      const roleOk = role === "All" || m.role_label === role;
      const qOk =
        !q ||
        (m.name + " " + (m.position ?? "") + " " + m.skills.join(" "))
          .toLowerCase()
          .includes(q.toLowerCase());
      return roleOk && qOk;
    });
  }, [memberList, role, q]);

  return (
    <section id="members" className="relative py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Members"
          title={
            <>
              The people <span className="gradient-text">behind the cloud.</span>
            </>
          }
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
                  role === r
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {role === r && (
                  <motion.span
                    layoutId="member-pill"
                    className="glass-strong absolute inset-0 -z-10 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {r}
              </button>
            ))}
          </div>
        </div>

        {isLoading && memberList.length === 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass gradient-border rounded-3xl p-6 animate-pulse">
                <div className="h-20 w-20 rounded-full bg-muted/40" />
                <div className="mt-5 h-3 w-16 rounded-full bg-muted/40" />
                <div className="mt-3 h-5 w-32 rounded bg-muted/40" />
                <div className="mt-2 h-3 w-24 rounded bg-muted/20" />
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <EmptyState
            icon={Users}
            label={q || role !== "All" ? "No members match your filters" : "No members yet"}
            hint={
              q || role !== "All"
                ? "Try clearing filters."
                : "The roster is being finalized — come back soon."
            }
          />
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
  const [imgError, setImgError] = useState(false);
  const imageSrc = getMemberImagePath(m.name, m.avatar_url);

  // Compute initials for the fallback avatar
  const initials = m.name
    .replace(/^(dr\.|mr\.|ms\.|prof\.)\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(300px 200px at 30% 0%, hsla(${m.hue}, 80%, 65%, 0.14), transparent 70%)`,
          }}
        />
        <div className="relative" style={{ transform: "translateZ(30px)" }}>
          <div
            className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-2xl border border-white/10 shadow-lg text-lg font-semibold"
            style={{
              background: `linear-gradient(135deg, hsl(${m.hue} 70% 62%), hsl(${(m.hue + 25) % 360} 70% 55%))`,
            }}
          >
            {!imgError ? (
              <img
                src={imageSrc}
                alt={m.name}
                onError={() => setImgError(true)}
                className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span className="text-white/95 font-mono select-none">{initials}</span>
            )}
            <span
              className="absolute inset-0 rounded-2xl opacity-40 blur-xl pointer-events-none"
              style={{ background: `hsl(${m.hue} 70% 62%)` }}
            />
          </div>

          <div className="mt-5 flex items-center gap-2">
            <span className="glass rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-cyan-brand border border-cyan-brand/20 font-mono">
              {m.role_label}
            </span>
          </div>

          <h4 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-cyan-brand transition-colors">
            {m.name}
          </h4>
          {m.position && <p className="text-xs text-muted-foreground mt-0.5">{m.position}</p>}

          <div className="mt-4 flex flex-wrap gap-1.5 min-h-[22px]">
            {m.skills.map((s) => (
              <span
                key={s}
                className="glass rounded-full px-2 py-0.5 text-[10px] text-muted-foreground border border-border/40"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-5 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {m.linkedin_url && (
              <a
                href={m.linkedin_url}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="glass grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            )}
            {m.github_url && (
              <a
                href={m.github_url}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="glass grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
            )}
            {m.email && (
              <a
                href={`mailto:${m.email}`}
                aria-label="Email"
                className="glass grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
              >
                <Mail className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </TiltCard>
    </motion.li>
  );
});
