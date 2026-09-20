import { useState } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  Award,
  ExternalLink,
  Search,
  BookOpen,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Layers,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const activeCourses = [
  { title: "Academy Cloud Foundations", category: "Foundations", badge: "Core", icon: Cloud },
  {
    title: "Academy Cloud Architecting",
    category: "Architecture",
    badge: "Advanced",
    icon: Layers,
  },
  { title: "Academy Cloud Operations", category: "SysOps", badge: "Advanced", icon: Cpu },
  { title: "Academy Cloud Developing", category: "Development", badge: "Advanced", icon: Layers },
  {
    title: "Academy Generative AI Foundations",
    category: "AI & ML",
    badge: "New & Trending",
    icon: Sparkles,
  },
  {
    title: "Academy Machine Learning Foundations",
    category: "AI & ML",
    badge: "Specialty",
    icon: Sparkles,
  },
  {
    title: "Academy Machine Learning for NLP",
    category: "AI & ML",
    badge: "Specialty",
    icon: Sparkles,
  },
  {
    title: "Academy Cloud Security Foundations",
    category: "Security",
    badge: "Specialty",
    icon: ShieldCheck,
  },
  { title: "Academy Data Engineering", category: "Data", badge: "Specialty", icon: Layers },
  { title: "Academy Learner Lab", category: "Hands-on Labs", badge: "Sandbox", icon: Cpu },
  {
    title: "Academy Engineering Operations Tech",
    category: "Operations",
    badge: "Core",
    icon: Cpu,
  },
  {
    title: "Academy Data Center Technician",
    category: "Infrastructure",
    badge: "Core",
    icon: Layers,
  },
  {
    title: "Lab: Cloud Data Pipeline Builder",
    category: "Projects",
    badge: "Hands-on",
    icon: BookOpen,
  },
  {
    title: "Lab: Cloud Web Application Builder",
    category: "Projects",
    badge: "Hands-on",
    icon: BookOpen,
  },
  {
    title: "Lab: Microservices & CI/CD Pipeline",
    category: "Projects",
    badge: "Hands-on",
    icon: BookOpen,
  },
  {
    title: "Lab: Cloud Security Builder",
    category: "Projects",
    badge: "Hands-on",
    icon: ShieldCheck,
  },
];

const partnershipHighlights = [
  "Official AWS Academy curriculum integrated into university coursework and labs",
  "Complimentary hands-on AWS Cloud Learner Labs with free cloud credits",
  "Up to 50% discount vouchers for official AWS Certification exams",
  "Industry-recognized digital badges and certifications verified via Credly",
];

const certifiedStudents = [
  {
    id: "1",
    name: "Aryan Sharma",
    rollNo: "2401010005",
    program: "B.Tech CSE Core",
    semester: "5th",
    track: "AWS Academy Graduate - Cloud Foundations",
    date: "June 30 2026",
    badgeUrl: "https://www.credly.com/go/Cu5KHJSj",
    socialUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7481628584244039680/",
    contact: "aryansharma081506@gmail.com",
    phone: "9958833192",
  },
  {
    id: "2",
    name: "Bhanu Asati",
    rollNo: "2501560014",
    program: "MCA Core",
    semester: "3rd",
    track: "AWS Academy Graduate - Cloud Foundations",
    date: "July 11 2026",
    badgeUrl: "https://www.credly.com/badges/75ab6cb3-b0ce-4e20-b77c-89e731173b19/public_url",
    socialUrl:
      "https://www.linkedin.com/posts/bhanu-asati-155493253_aws-awsacademy-cloudcomputing-activity-7481593341789491200-HTQh",
    contact: "bhanu.asati.dev@gmail.com",
    phone: "7354336191",
  },
  {
    id: "3",
    name: "Vanshika Dixit",
    rollNo: "2401010010",
    program: "B.Tech CSE Core",
    semester: "5th",
    track: "AWS Academy Graduate - Cloud Foundations",
    date: "July 2 2026",
    badgeUrl: "https://www.credly.com/go/OAn4DYDShQwfaQLr5JwHbQ",
    socialUrl:
      "https://www.linkedin.com/posts/vanshikadixit16_aws-awsacademy-cloudcomputing-share-7481586887489478656-uCEx",
    contact: "vanshikadixit.808@gmail.com",
    phone: "8506017366",
  },
  {
    id: "4",
    name: "Diya Goel",
    rollNo: "2401010179",
    program: "B.Tech CSE Core",
    semester: "5th",
    track: "AWS Academy Graduate - Cloud Foundations",
    date: "June 27 2026",
    badgeUrl: "https://www.credly.com/go/Amc0UVw1",
    socialUrl:
      "https://www.linkedin.com/posts/diyagoel08_aws-awsacademy-cloudcomputing-ugcPost-7481910344504987648-AiVg",
    contact: "diyagoel8218@gmail.com",
    phone: "8218436515",
  },
  {
    id: "5",
    name: "Tashmeet Kaur",
    rollNo: "2501560019",
    program: "MCA",
    semester: "3rd",
    track: "AWS Academy Graduate - Cloud Foundations",
    date: "July 12 2026",
    badgeUrl: "https://www.credly.com/badges/39412bff-6810-4ee2-97ad-9bed3ae51982/whatsapp",
    socialUrl: "",
    contact: "tashmeetkaurr@gmail.com",
    phone: "9267950107",
  },
  {
    id: "6",
    name: "Nandini Kale",
    rollNo: "2401010201",
    program: "B.Tech CSE Core",
    semester: "5th",
    track: "AWS Academy Graduate - Cloud Foundations",
    date: "July 11 2026",
    badgeUrl: "https://www.credly.com/badges/04887f98-d60a-4aaf-9e02-3c9eb0d89552/print",
    socialUrl:
      "https://www.linkedin.com/posts/nandinikale210323_aws-awsacademy-cloudcomputing-ugcPost-7482294739506053120-k3ot",
    contact: "nandini.21323@gmail.com",
    phone: "7799775040",
  },
  {
    id: "7",
    name: "Utsav Ratan",
    rollNo: "2401010046",
    program: "B.Tech CSE Core",
    semester: "4th",
    track: "AWS Academy Graduate - Cloud Foundations",
    date: "July 11 2026",
    badgeUrl: "https://www.credly.com/badges/57a3a2d9-3d2f-4eef-8921-292ed87b85c4/public_url",
    socialUrl:
      "https://www.linkedin.com/posts/misterutsav_aws-awsacademy-cloudcomputing-ugcPost-7482704791467540480-XZFG",
    contact: "misterutsav@gmail.com",
    phone: "9871831555",
  },
];

export function Collaboration() {
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Foundations", "Architecture", "AI & ML", "Security", "Projects"];

  const filteredCourses = activeCourses.filter((course) => {
    const matchesCategory =
      selectedCategory === "All" ||
      course.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = course.title.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="collaboration" className="relative py-32 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Industry Alliances"
          title={
            <>
              Institutional Partnership with <span className="gradient-text">AWS Academy</span>
            </>
          }
          description="Bridging higher education and industry demand. Our Center of Excellence empowers students with AWS-authorized curriculum, real cloud sandboxes, and globally accredited certifications."
        />

        {/* Hero Collaboration Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7 }}
          className="glass gradient-border noise relative mt-16 overflow-hidden rounded-3xl p-8 md:p-12"
        >
          <div
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: "var(--gradient-brand)" }}
          />

          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            <div className="space-y-6 md:col-span-7">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl bg-amber-500/10 px-3.5 py-1.5 border border-amber-500/20 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <Cloud className="h-4 w-4" />
                  Official AWS Academy Member Institution
                </div>
                <Badge variant="outline" className="border-cyan-brand/40 text-cyan-brand">
                  Active Member
                </Badge>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Empowering Cloud Engineers at K.R. Mangalam University
              </h3>

              <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                Through our collaboration with Amazon Web Services (AWS) Academy, our students
                access cloud computing courses developed by AWS experts. The curriculum is directly
                aligned with AWS Certifications, ensuring graduates enter the workforce
                industry-ready.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {partnershipHighlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-muted-foreground leading-snug"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-brand" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                {/* Certified Students Roster Modal */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="glass border-cyan-brand/40 bg-cyan-brand/10 text-cyan-brand hover:bg-cyan-brand/20 transition-all shadow-[0_0_15px_rgba(79,209,255,0.15)]">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      View Certified Students Roster
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass gradient-border max-w-4xl border-border bg-background/95 text-foreground backdrop-blur-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
                        <Award className="h-5 w-5 text-cyan-brand" />
                        AWS Academy Certified Students Directory
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground text-xs">
                        Verified student credentials, Credly digital badge verification, and
                        certification achievements.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 max-h-[65vh] overflow-y-auto overflow-x-auto rounded-2xl border border-border glass bg-card/60">
                      <Table className="w-full min-w-[700px]">
                        <TableHeader className="sticky top-0 z-10 bg-card/90 backdrop-blur-md">
                          <TableRow className="border-b border-border hover:bg-transparent">
                            <TableHead className="py-3 text-xs font-mono text-cyan-brand">
                              Student & Roll No
                            </TableHead>
                            <TableHead className="py-3 text-xs font-mono text-cyan-brand">
                              Academic Info
                            </TableHead>
                            <TableHead className="py-3 text-xs font-mono text-cyan-brand">
                              Certification Track
                            </TableHead>
                            <TableHead className="py-3 text-xs font-mono text-cyan-brand">
                              Contact Details
                            </TableHead>
                            <TableHead className="py-3 text-xs font-mono text-cyan-brand">
                              Issued
                            </TableHead>
                            <TableHead className="py-3 text-right text-xs font-mono text-cyan-brand">
                              Verification
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {certifiedStudents.map((student) => (
                            <TableRow
                              key={student.id}
                              className="border-b border-border/50 transition-colors hover:bg-muted/50"
                            >
                              {/* Student Name & Roll No */}
                              <TableCell className="py-3.5 align-top">
                                <div className="font-medium text-foreground text-sm tracking-tight">
                                  {student.name}
                                </div>
                                <div className="font-mono text-[11px] text-muted-foreground mt-0.5">
                                  {student.rollNo}
                                </div>
                              </TableCell>

                              {/* Program & Semester */}
                              <TableCell className="py-3.5 align-top">
                                <div className="text-xs text-foreground">{student.program}</div>
                                <div className="text-[11px] text-muted-foreground mt-0.5">
                                  Sem {student.semester}
                                </div>
                              </TableCell>

                              {/* Track Badge */}
                              <TableCell className="py-3.5 align-top">
                                <span className="inline-flex items-center rounded-md bg-cyan-brand/10 px-2 py-0.5 text-xs text-cyan-brand border border-cyan-brand/20 leading-snug">
                                  {student.track}
                                </span>
                              </TableCell>

                              {/* Email & Phone */}
                              <TableCell className="py-3.5 align-top">
                                <div className="text-xs text-muted-foreground">{student.contact}</div>
                                {student.phone && (
                                  <div className="font-mono text-[11px] text-muted-foreground/70 mt-0.5">
                                    +91 {student.phone}
                                  </div>
                                )}
                              </TableCell>

                              {/* Date */}
                              <TableCell className="py-3.5 align-top font-mono text-xs text-muted-foreground whitespace-nowrap">
                                {student.date}
                              </TableCell>

                              {/* Action Links */}
                              <TableCell className="py-3.5 align-top text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-2 text-xs">
                                  {student.badgeUrl && student.badgeUrl !== "#" && (
                                    <a
                                      href={student.badgeUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-cyan-brand hover:underline"
                                    >
                                      Badge <ExternalLink className="h-3 w-3" />
                                    </a>
                                  )}
                                  {student.badgeUrl && student.socialUrl && (
                                    <span className="text-border">|</span>
                                  )}
                                  {student.socialUrl ? (
                                    <a
                                      href={student.socialUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      Post <ExternalLink className="h-3 w-3" />
                                    </a>
                                  ) : (
                                    <span className="text-[11px] text-muted-foreground/40">—</span>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </DialogContent>
                </Dialog>

                <a
                  href="https://aws.amazon.com/training/academy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-cyan-brand transition-colors"
                >
                  AWS Academy Portal <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* AWS Academy Official Logo Container */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative flex flex-col items-center justify-center p-8 rounded-2xl glass gradient-border bg-card/40 w-full max-w-sm text-center">
                {/* Logo Frame */}
                <div className="relative flex items-center justify-center rounded-2xl bg-white p-5 shadow-[0_0_35px_rgba(255,153,0,0.2)] border border-border">
                  <img
                    src="https://degreeplus.in/wp-content/uploads/2021/10/aws-academy-logo-1.png"
                    alt="AWS Academy Logo"
                    className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <h4 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                  AWS Academy Curriculum
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Certified Educator Guided Labs & Certifications
                </p>

                <div className="mt-6 flex w-full justify-around border-t border-border pt-4 text-center">
                  <div>
                    <div className="text-xl font-bold font-mono text-cyan-brand">16+</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Courses
                    </div>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <div className="text-xl font-bold font-mono text-cyan-brand">100%</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Lab Access
                    </div>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <div className="text-xl font-bold font-mono text-cyan-brand">50%</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Vouchers
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Active Courses & Labs Grid Section */}
        <div className="mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="text-xs font-mono text-cyan-brand uppercase tracking-widest">
                Active Offerings
              </div>
              <h3 className="mt-1 text-2xl font-bold text-foreground">Authorized Courses & Applied Labs</h3>
              <p className="text-xs text-muted-foreground mt-1">
                All curricula currently active and taught under K.R. Mangalam University's AWS
                Academy program.
              </p>
            </div>

            {/* Filter and Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search course or lab..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="glass h-9 w-full sm:w-56 pl-9 text-xs border-border bg-card/60 focus:border-cyan-brand/50 text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-cyan-brand text-black font-semibold shadow-[0_0_10px_rgba(79,209,255,0.4)]"
                        : "glass text-muted-foreground hover:text-foreground border-border"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredCourses.map((course, idx) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
                whileHover={{ y: -4 }}
                className="glass gradient-border noise group relative flex flex-col justify-between rounded-2xl p-5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="glass grid h-8 w-8 place-items-center rounded-lg">
                      <course.icon className="h-4 w-4 text-cyan-brand" />
                    </div>
                    <Badge
                      variant="outline"
                      className="border-border bg-muted/40 text-[10px] text-muted-foreground"
                    >
                      {course.badge}
                    </Badge>
                  </div>
                  <h4 className="mt-4 text-sm font-semibold leading-snug tracking-tight text-foreground group-hover:text-cyan-brand transition-colors">
                    {course.title}
                  </h4>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
                  <span>{course.category}</span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                    Active
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}