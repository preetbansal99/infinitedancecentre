"use client";
import { motion, MotionValue, useTransform } from "framer-motion";

export function ScrollProgressBar({ progress }: { progress: MotionValue<number> }) {
  const barHeight = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div
      className="fixed right-0 top-0 h-screen w-[3px] z-[80] bg-white/5"
      aria-hidden="true"
    >
      <motion.div
        className="absolute top-0 left-0 w-full rounded-full"
        style={{
          height: barHeight,
          background: "linear-gradient(to bottom, #3B82F6, #8B5CF6, #E11D48)",
          boxShadow: "0 0 8px rgba(225,29,72,0.5)",
        }}
      />
    </div>
  );
}
