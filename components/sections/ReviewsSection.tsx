"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import { MOCK_REVIEWS } from "@/data/mockData";
import { Star, Quote } from "lucide-react";

export function ReviewsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="reviews" className="py-12 md:py-20 px-6 overflow-hidden" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-caption tracking-[0.3em] text-accent-light uppercase font-semibold mb-3">
            STUDENT LOVE
          </p>
          <h2 className="text-display-md font-bold text-text-primary mb-3">What They Say</h2>
          <div className="flex items-center justify-center gap-2 text-body-sm text-text-secondary">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span>4.9 average from 50+ reviews</span>
          </div>
        </motion.div>

        <div className="flex overflow-x-auto gap-5 pb-6 snap-x snap-mandatory custom-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
          {MOCK_REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="w-[85vw] md:w-[350px] flex-shrink-0 snap-start"
            >
              <GlassCard radius="lg" className="p-5 h-full flex flex-col relative group hover:border-accent-light/30 transition-colors">
                <Quote className="w-5 h-5 text-accent-purple/40 mb-3" />
                <p className="text-body-sm text-text-secondary flex-1 italic leading-relaxed mb-4">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full bg-accent-purple/20 flex items-center justify-center text-caption font-bold text-accent-light">
                    {review.initials}
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-text-primary">{review.name}</p>
                    <p className="text-caption text-text-muted">{review.course}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: review.stars }, (_, s) => (
                      <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
