"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import { ClayButton } from "@/components/shared/ClayButton";
import { MOCK_COURSES } from "@/data/mockData";
import { useBookingStore } from "@/hooks/useBookingStore";
import { Music, Dumbbell, Mic2, Sparkles, Users, ChevronRight, Clock, IndianRupee } from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  zumba: Music,
  gymnastics: Dumbbell,
  hiphop: Mic2,
  kathak: Sparkles,
};

export function CoursesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { openBookingModal } = useBookingStore();

  return (
    <section id="courses" className="py-12 md:py-20 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-caption tracking-[0.3em] text-accent-light uppercase font-semibold mb-3">
            WHAT WE TEACH
          </p>
          <h2 className="text-display-md font-bold text-text-primary mb-3">
            Our Courses
          </h2>
          <p className="text-body text-text-secondary max-w-lg mx-auto">
            From high-energy fitness to classical grace — find your rhythm with us.
          </p>
        </motion.div>

        {/* Courses Container */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-8 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {MOCK_COURSES.map((course, i) => {
            const Icon = ICONS[course.id] || Music;
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="w-[85vw] max-w-[320px] flex-shrink-0 snap-center md:w-auto md:max-w-none"
              >
                <GlassCard radius="lg" className="p-5 md:p-6 group hover:border-white/15 transition-colors h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: course.colorHex + "18" }}
                    >
                      <Icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: course.colorHex }} />
                    </div>
                    <div>
                      <h3 className="text-heading-sm font-bold text-text-primary mb-1">
                        {course.name}
                      </h3>
                      <p className="text-caption text-accent-light font-medium">
                        {course.tagline}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-body-sm text-text-secondary leading-relaxed mb-4 flex-1">
                    {course.description}
                  </p>
                  
                  <div className="flex flex-col gap-3 mt-auto">
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1.5 text-caption text-text-muted bg-white/5 w-fit px-2.5 py-1 rounded-full">
                        <Users className="w-3.5 h-3.5" />
                        {course.audience}
                      </span>
                      {course.timings && (
                        <span className="flex items-center gap-1.5 text-caption text-text-muted bg-white/5 w-fit px-2.5 py-1 rounded-full">
                          <Clock className="w-3.5 h-3.5" />
                          {course.timings}
                        </span>
                      )}
                      {course.monthlyFee && (
                        <span className="flex items-center gap-1.5 text-caption text-text-muted bg-white/5 w-fit px-2.5 py-1 rounded-full text-accent-light">
                          <IndianRupee className="w-3.5 h-3.5" />
                          ₹{course.monthlyFee}/mo
                        </span>
                      )}
                    </div>
                    <ClayButton
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => openBookingModal(course.id)}
                    >
                      Book Trial <ChevronRight className="w-4 h-4 ml-1" />
                    </ClayButton>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
