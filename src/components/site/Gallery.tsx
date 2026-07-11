import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { usePublicGallery, type PublicGalleryItem } from "@/lib/usePublicCms";
import { EmptyState } from "./Events";

const fallbackItems: PublicGalleryItem[] = [
  { id: "1", title: "CloudCon '25 Keynote", height: 220, gradient: "linear-gradient(135deg,#7DD3FC,#3B6FE0)", image_url: null },
  { id: "2", title: "Serverless Workshop", height: 320, gradient: "linear-gradient(135deg,#38BDF8,#7DD3FC)", image_url: null },
  { id: "3", title: "Hackathon Finals", height: 260, gradient: "linear-gradient(135deg,#3B6FE0,#7DD3FC)", image_url: null },
  { id: "4", title: "Mentor Meetup", height: 300, gradient: "linear-gradient(135deg,#7DD3FC,#38BDF8)", image_url: null },
  { id: "5", title: "AWS Deep Dive", height: 240, gradient: "linear-gradient(135deg,#3B6FE0,#38BDF8)", image_url: null },
  { id: "6", title: "Team Retreat", height: 340, gradient: "linear-gradient(135deg,#38BDF8,#3B6FE0)", image_url: null },
  { id: "7", title: "Certification Day", height: 260, gradient: "linear-gradient(135deg,#7DD3FC,#3B6FE0)", image_url: null },
  { id: "8", title: "K8s Bootcamp", height: 280, gradient: "linear-gradient(135deg,#3B6FE0,#7DD3FC)", image_url: null },
  { id: "9", title: "Edge Compute Seminar", height: 320, gradient: "linear-gradient(135deg,#7DD3FC,#38BDF8)", image_url: null },
];

export function Gallery() {
  const { data: items, isLoading } = usePublicGallery(fallbackItems);
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="gallery" className="relative py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Gallery"
          title={<>Moments from <span className="gradient-text">the Center.</span></>}
          description="Workshops, launches, whiteboards and late-night deploys."
        />

        {isLoading && items.length === 0 ? (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass gradient-border rounded-3xl animate-pulse" style={{ height: 240 + (i % 3) * 40 }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState icon={ImageIcon} label="Gallery is warming up" hint="Photos from our sessions land here after each event." />
        ) : (
          <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
            {items.map((it, i) => (
              <motion.button
                key={it.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.6, delay: (i % 6) * 0.05 }}
                onClick={() => setActive(i)}
                className="group relative block w-full overflow-hidden rounded-3xl"
                style={{ height: it.height }}
              >
                {it.image_url ? (
                  <img src={it.image_url} alt={it.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" style={{ background: it.gradient ?? "linear-gradient(135deg,#7DD3FC,#3B6FE0)" }} />
                )}
                <div className="absolute inset-0 grid-bg opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-4 p-5 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="glass inline-flex rounded-full px-3 py-1 text-xs">{it.title}</div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {active !== null && items[active] && (
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
              {items[active].image_url ? (
                <img src={items[active].image_url!} alt={items[active].title} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0" style={{ background: items[active].gradient ?? "linear-gradient(135deg,#7DD3FC,#3B6FE0)" }} />
              )}
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <div className="glass inline-flex rounded-full px-3 py-1 text-xs">{items[active].title}</div>
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
