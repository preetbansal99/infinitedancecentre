"use client";
import { motion } from "framer-motion";

interface AnimatedCheckmarkProps {
  size?: number;
  color?: string;
}

export function AnimatedCheckmark({ size = 80, color = "#22C55E" }: AnimatedCheckmarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <motion.circle
        cx="40" cy="40" r="36"
        stroke={color}
        strokeWidth="3"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.path
        d="M 22 40 L 34 52 L 58 28"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
      />
    </svg>
  );
}
