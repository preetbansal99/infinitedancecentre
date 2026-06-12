"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import { Target, Heart } from "lucide-react";

const STATS = [
  { value: "200+", label: "Students" },
  { value: "4.9★", label: "Rating" },
  { value: "10+", label: "Yrs Exp" },
  { value: "4", label: "Dance Styles" },
];

const ABOUT_CARDS = [
  {
    icon: Target,
    title: "Our Mission",
    text: "To make professional dance training accessible and fun for every age group in Yamuna Vihar and beyond.",
  },
  {
    icon: Heart,
    title: "Community First",
    text: "A supportive, judgment-free space where every student feels welcome and encouraged to express themselves.",
  },
];

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-12 md:py-20 px-6 bg-surface/40" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-caption tracking-[0.3em] text-accent-light uppercase font-semibold mb-3">
            WHO WE ARE
          </p>
          <h2 className="text-display-md font-display font-bold text-text-primary mb-3">About Us</h2>
          <p className="text-body text-text-secondary max-w-lg mx-auto">
            Infinite Dance Centre is Yamuna Vihar&apos;s premier destination for dance and fitness training,
            founded with a simple belief — everyone deserves to feel the joy of movement.
          </p>
        </motion.div>

        {/* Full-width stat strip — breaks the AI 2×2 grid pattern */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-5"
        >
          <div className="glass-premium rounded-xl p-5 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-display-md font-display font-bold text-accent-light">{stat.value}</p>
                  <p className="text-caption text-text-muted uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Two detail cards instead of uniform 2×2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ABOUT_CARDS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            >
              <GlassCard radius="lg" className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-accent-light" />
                  </div>
                  <div>
                    <h3 className="text-heading-sm font-display font-bold text-text-primary mb-1">{item.title}</h3>
                    <p className="text-body-sm text-text-secondary leading-relaxed">{item.text}</p>
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
