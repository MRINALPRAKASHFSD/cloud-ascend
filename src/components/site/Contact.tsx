import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Github, Linkedin, Twitter, CheckCircle2, type LucideIcon } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { usePublicContactInfo, type PublicContactInfo } from "@/lib/usePublicCms";

const fallback: PublicContactInfo = {
  email: "coe.cloud@krmangalam.edu.in",
  phone: "+91 124 XXX XXXX",
  address: "Sohna Road, Gurugram, HR",
  map_url: "https://www.openstreetmap.org/export/embed.html?bbox=77.075%2C28.35%2C77.15%2C28.42&layer=mapnik&marker=28.39%2C77.11",
  hours: null,
  socials: {},
};

const SOCIAL_ICONS: Record<string, LucideIcon> = { github: Github, linkedin: Linkedin, twitter: Twitter };

export function Contact() {
  const { data: info } = usePublicContactInfo(fallback);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const socialEntries = Object.entries(info.socials ?? {}).filter(([, url]) => !!url);

  return (
    <section id="contact" className="relative py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Contact"
          title={<>Let's build <span className="gradient-text">something remarkable.</span></>}
          description="Want to join the Center, host a workshop, or partner on a project? Say hello."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="glass gradient-border noise relative overflow-hidden rounded-[32px] p-8">
            <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-brand)" }} />
            <h3 className="text-2xl font-semibold tracking-tight">Reach the Center</h3>
            <p className="mt-2 text-sm text-muted-foreground">Center of Excellence — Cloud Computing<br />K.R. Mangalam University, Sohna, Gurugram.</p>
            <ul className="mt-8 space-y-4 text-sm">
              {info.email && <li className="flex items-center gap-3"><span className="glass grid h-9 w-9 place-items-center rounded-xl"><Mail className="h-4 w-4 text-cyan-brand" /></span> <a href={`mailto:${info.email}`} className="hover:text-cyan-brand transition-colors">{info.email}</a></li>}
              {info.phone && <li className="flex items-center gap-3"><span className="glass grid h-9 w-9 place-items-center rounded-xl"><Phone className="h-4 w-4 text-cyan-brand" /></span> {info.phone}</li>}
              {info.address && <li className="flex items-center gap-3"><span className="glass grid h-9 w-9 place-items-center rounded-xl"><MapPin className="h-4 w-4 text-cyan-brand" /></span> {info.address}</li>}
            </ul>

            {info.map_url && (
              <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-white/5">
                <iframe
                  title="KRMU Map"
                  src={info.map_url}
                  className="h-full w-full grayscale-[0.4] contrast-125"
                  loading="lazy"
                />
              </div>
            )}

            {(socialEntries.length > 0 || true) && (
              <div className="mt-6 flex gap-2">
                {socialEntries.length > 0 ? (
                  socialEntries.map(([key, url]) => {
                    const Icon = SOCIAL_ICONS[key.toLowerCase()] ?? Github;
                    return (
                      <a key={key} href={url} target="_blank" rel="noreferrer" className="glass grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-white/10">
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })
                ) : (
                  [Github, Linkedin, Twitter].map((Icon, i) => (
                    <a key={i} href="#" className="glass grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-white/10">
                      <Icon className="h-4 w-4" />
                    </a>
                  ))
                )}
              </div>
            )}
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              await new Promise((r) => setTimeout(r, 1200));
              setLoading(false);
              setSent(true);
            }}
            className="glass gradient-border relative overflow-hidden rounded-[32px] p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" required />
              <Field label="Email" name="email" type="email" required />
            </div>
            <Field label="Subject" name="subject" className="mt-4" />
            <div className="mt-4">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
              <textarea
                required
                rows={5}
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm outline-none transition-colors focus:border-cyan-brand/40 focus:bg-white/[0.05]"
                placeholder="Tell us what you'd like to build together…"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              disabled={loading || sent}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_rgba(79,209,255,0.7)] transition disabled:opacity-70"
              style={{ background: "var(--gradient-brand)" }}
              type="submit"
            >
              {sent ? (
                <><CheckCircle2 className="h-4 w-4" /> Message sent</>
              ) : loading ? (
                <>Sending…</>
              ) : (
                <>Send message <Send className="h-4 w-4" /></>
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", required, className = "" }: any) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none transition-colors focus:border-cyan-brand/40 focus:bg-white/[0.05]"
        placeholder={label}
      />
    </label>
  );
}
