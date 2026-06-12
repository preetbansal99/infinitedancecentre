"use client";
import { motion, MotionValue } from "framer-motion";

interface GlassWallProps {
  crackOpacity: MotionValue<number>;
}

export function GlassWall({ crackOpacity }: GlassWallProps) {
  return (
    <div className="relative h-full w-full">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(139,92,246,0.04) 50%, rgba(59,130,246,0.04) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderLeft: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "inset 1px 0 0 rgba(255,255,255,0.08), -8px 0 40px rgba(139,92,246,0.15)",
        }}
      />
      <motion.svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 800"
        fill="none"
        style={{ opacity: crackOpacity }}
      >
        <path d="M80 400 L 40 320 L 20 280" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M80 400 L 55 430 L 30 480 L 10 520" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M80 400 L 120 380 L 160 360" stroke="rgba(255,255,255,0.35)" strokeWidth="1.0" strokeLinecap="round" />
        <path d="M80 400 L 100 440 L 150 460" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M80 400 L 60 395 L 50 388" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
        <path d="M80 400 L 75 410 L 65 425" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
        <circle cx="80" cy="400" r="12" fill="rgba(225,29,72,0.15)" stroke="rgba(225,29,72,0.4)" strokeWidth="1" />
      </motion.svg>
      <div
        className="absolute left-0 top-0 w-px h-full"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(139,92,246,0.8), rgba(59,130,246,0.8), transparent)",
        }}
      />
    </div>
  );
}
