"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import { MOCK_COURSES } from "@/data/mockData";
import { Music, Dumbbell, Mic2, Sparkles } from "lucide-react";
import { ClayButton } from "@/components/shared/ClayButton";

const COURSE_ICONS: Record<string, React.ElementType> = {
  zumba: Music,
  gymnastics: Dumbbell,
  hiphop: Mic2,
  kathak: Sparkles,
};

interface Step1Props {
  selected: string;
  onSelect: (courseId: string, courseName: string) => void;
  onNext: () => void;
}

export function Step1CourseSelect({ selected, onSelect, onNext }: Step1Props) {
  return (
    <div>
      <p className="text-body-sm text-text-secondary mb-4">Choose a course to try:</p>
      <div className="grid grid-cols-2 gap-3">
        {MOCK_COURSES.map((course) => {
          const Icon = COURSE_ICONS[course.id] || Music;
          const isSelected = selected === course.id;
          return (
            <motion.div
              key={course.id}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              <GlassCard
                radius="md"
                className={`p-4 cursor-pointer transition-all relative overflow-hidden ${
                  isSelected
                    ? "border-[2px] border-cta-magenta bg-cta-magenta/10 shadow-[0_0_15px_rgba(225,29,72,0.4)]"
                    : "hover:border-white/15 bg-black/20 opacity-80 hover:opacity-100"
                }`}
                onClick={() => onSelect(course.id, course.name)}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-cta-magenta rounded-full flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
                <div
                  className="w-[72px] h-[72px] rounded-lg flex items-center justify-center mb-3 mx-auto"
                  style={{ backgroundColor: course.colorHex + "20" }}
                >
                  <Icon className="w-8 h-8" style={{ color: course.colorHex }} />
                </div>
                <p className="text-body-sm font-semibold text-text-primary text-center">{course.name}</p>
                <p className="text-caption text-text-muted text-center mt-1">{course.audience}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-8 sticky bottom-0 py-4 bg-surface md:bg-transparent z-10 md:static border-t border-white/5 md:border-none">
        <ClayButton
          variant="primary"
          fullWidth
          disabled={!selected}
          onClick={onNext}
          className="py-4 text-lg font-bold shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.5)] md:shadow-lg"
        >
          Continue →
        </ClayButton>
      </div>
    </div>
  );
}
