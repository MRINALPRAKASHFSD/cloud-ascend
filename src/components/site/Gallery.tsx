import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

// Procedurally-generated abstract "photos" for the gallery
const items = [
  { h: 220, g: "linear-gradient(135deg,#4FD1FF,#8B5CF6)", label: "CloudCon '25 Keynote" },
  { h: 320, g: "linear-gradient(135deg,#6AE3FF,#4FD1FF)", label: "Serverless Workshop" },
  { h: 260, g: "linear-gradient(135deg,#8B5CF6,#4FD1FF)", label: "Hackathon Finals" },
  { h: 300, g: "linear-gradient(135deg,#4FD1FF,#6AE3FF)", label: "Mentor Meetup" },
  { h: 240, g: "linear-gradient(135deg,#8B5CF6,#6AE3FF)", label: "AWS Deep Dive" },
  { h: 340, g: "linear-gradient(135deg,#6AE3FF,#8B5CF6)", label: "Team Retreat" },
  { h: 260, g: "linear-gradient(135deg,#4FD1FF,#8B5CF6)", label: "Certification Day" },
  { h: 280, g: "linear-gradient(135deg,#8B5CF6,#4FD1FF)", label: "K8s Bootcamp" },
  { h: 320, g: "linear-gradient(135deg,#4FD1FF,#6AE3FF)", label: "Edge Compute Seminar" },
];

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="gallery" className="relative py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Gallery"
          title={<>Moments from <span className="gradient-text">the Center.</span></>}
          description="Workshops, launches, whiteboards and late-night deploys."
        />

        <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
          {items.map((it, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{ duration: 0.6, delay: (i % 6) * 0.05 }}
              onClick={() => setActive(i)}
              className="group relative block w-full overflow-hidden rounded-3xl"
              style={{ height: it.h }}
            >
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" style={{ background: it.g }} />
              <div className="absolute inset-0 grid-bg opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 translate-y-4 p-5 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="glass inline-flex rounded-full px-3 py-1 text-xs">{it.label}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-6 backdrop-blur-lg"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="glass-strong relative aspect-[4/3] w-full max-w-4xl overflow-hidden rounded-[32px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0" style={{ background: items[active].g }} />
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <div className="glass inline-flex rounded-full px-3 py-1 text-xs">{items[active].label}</div>
              </div>
              <button onClick={() => setActive(null)} className="glass absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
