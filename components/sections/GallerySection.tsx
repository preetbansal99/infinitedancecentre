"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { MOCK_GALLERY_ITEMS } from "@/data/mockData";
import type { GalleryItem } from "@/types";
import { X, Play } from "lucide-react";

const CATEGORIES = ["All", "Studio", "Performances", "Kids"] as const;

export function GallerySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState<typeof CATEGORIES[number]>("All");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const filtered = active === "All"
    ? MOCK_GALLERY_ITEMS
    : MOCK_GALLERY_ITEMS.filter((item) => item.category === active);

  return (
    <section id="gallery" className="py-12 md:py-20 px-6 bg-surface/40" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <p className="text-caption tracking-[0.3em] text-accent-light uppercase font-semibold mb-3">
            OUR SPACE
          </p>
          <h2 className="text-display-md font-bold text-text-primary mb-3">Gallery</h2>
          <p className="text-body text-text-secondary max-w-lg mx-auto">
            A glimpse into our studio, performances, and training sessions.
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full text-body-sm font-medium transition-all ${
                active === cat
                  ? "bg-accent-purple/20 text-accent-light border border-accent-purple/40"
                  : "glass text-text-muted hover:text-text-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div layout className="columns-2 md:columns-3 gap-4 space-y-4">
          {filtered.map((item, i) => (
            <GalleryCard key={item.id} item={item} index={i} inView={inView} onPlay={() => {
              if (item.playable && item.src) setSelectedVideo(item.src);
            }} />
          ))}
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl"
            onClick={() => setSelectedVideo(null)}
          >
            <button
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white transition-colors"
              onClick={() => setSelectedVideo(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={selectedVideo}
                controls
                autoPlay
                playsInline
                className="w-full max-h-[80vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function GalleryCard({ item, index, inView, onPlay }: { item: GalleryItem; index: number; inView: boolean; onPlay: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      layout
      className="break-inside-avoid relative group overflow-hidden rounded-lg cursor-pointer"
      style={{ aspectRatio: item.aspect }}
    >
      {item.type === "video" && item.src ? (
        <video
          src={item.src}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : null}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${item.gradient} flex items-center justify-center ${
          item.type === "video" ? "opacity-40" : "opacity-100"
        }`}
      >
        <div className="text-center px-4 pointer-events-none">
          <p className="text-body-sm font-semibold text-white/90 mb-1">{item.label}</p>
          <p className="text-caption text-white/50">{item.category}</p>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center" onClick={onPlay}>
        {item.playable && (
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100">
            <Play className="w-5 h-5 text-white ml-1" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
