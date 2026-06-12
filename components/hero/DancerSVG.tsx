"use client";

import { motion } from "framer-motion";

// The animated, rigged dancer silhouette using the original logo paths
const AnimatedDancerPaths = () => {
  const dur = 4; // Slowed down significantly for a graceful, breathing effect
  const ease = "easeInOut";

  return (
    <motion.g
      animate={{ y: [-2, 2, -2] }}
      transition={{ duration: dur, ease, repeat: Infinity }}
      style={{ transformOrigin: "250px 100px" }}
    >
      {/* Head & Hair */}
      <motion.g
        animate={{ rotate: [0, -3, 2, 0] }}
        transition={{ duration: dur, repeat: Infinity, ease }}
        style={{ transformOrigin: "260px 60px" }}
      >
        <ellipse cx="262" cy="48" rx="12" ry="13" />
        {/* Hair Ponytail */}
        <motion.path
          d="M 268 40 Q 290 30 295 42 Q 284 37 274 40 Z"
          opacity="0.9"
          animate={{ rotate: [0, 5, -2, 0] }}
          transition={{ duration: dur, repeat: Infinity, ease }}
          style={{ transformOrigin: "268px 40px" }}
        />
      </motion.g>

      {/* Torso & Neck & Pelvis */}
      <rect x="258" y="60" width="8" height="10" rx="4" />
      <path d="M 244 68 Q 256 64 270 68 Q 274 82 268 94 Q 260 96 250 94 Q 240 82 244 68 Z" />
      <path d="M 246 94 Q 256 92 268 94 Q 270 102 266 108 Q 258 110 250 108 Q 242 102 246 94 Z" />

      {/* Right Arm (Raised) */}
      <motion.g
        animate={{ rotate: [0, 5, -2, 0] }}
        transition={{ duration: dur, repeat: Infinity, ease }}
        style={{ transformOrigin: "270px 72px" }}
      >
        <path d="M 270 72 Q 300 54 330 34 Q 326 36 318 44 Q 298 62 268 82 Z" strokeWidth="0" />
        <ellipse cx="334" cy="31" rx="5" ry="4" />
      </motion.g>

      {/* Left Arm */}
      <motion.g
        animate={{ rotate: [0, -5, 3, 0] }}
        transition={{ duration: dur, repeat: Infinity, ease }}
        style={{ transformOrigin: "246px 74px" }}
      >
        <path d="M 246 74 Q 226 70 208 76 Q 212 74 218 75 Q 232 75 246 80 Z" />
      </motion.g>

      {/* Right Leg */}
      <motion.g
        animate={{ rotate: [0, 3, -3, 0] }}
        transition={{ duration: dur, repeat: Infinity, ease }}
        style={{ transformOrigin: "264px 108px" }}
      >
        <path d="M 264 108 Q 276 120 278 136 Q 272 138 268 134 Q 262 120 258 110 Z" />
        <path d="M 278 136 Q 282 152 278 164 Q 274 166 270 162 Q 268 150 266 136 Z" />
        <path d="M 278 164 Q 286 174 282 178 Q 276 176 272 168 Z" />
      </motion.g>

      {/* Left Leg */}
      <motion.g
        animate={{ rotate: [0, -4, 2, 0] }}
        transition={{ duration: dur, repeat: Infinity, ease }}
        style={{ transformOrigin: "250px 108px" }}
      >
        <path d="M 250 108 Q 232 116 214 126 Q 198 134 184 148 Q 190 152 196 146 Q 214 134 234 122 Q 248 114 256 110 Z" />
        <path d="M 184 148 Q 172 158 168 164 Q 176 162 184 152 Z" />
      </motion.g>
    </motion.g>
  );
};

export function DancerSVG({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 ${className}`}>
      {/* Dynamic heartbeat aura - hardware accelerated */}
      <motion.div
        className="absolute inset-0 bg-accent-purple/30 blur-[60px] rounded-full mix-blend-screen will-change-transform"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
      />

      <motion.div
        className="w-full h-full relative z-10 will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: .6, ease: "linear", repeat: Infinity }}
      >
        {/* Back Layer (Depth) */}
        <svg
          viewBox="160 20 190 170"
          className="absolute inset-0 w-full h-full overflow-visible"
          style={{ transform: "translateZ(-8px)", opacity: 0.7 }}
        >
          <g fill="#A78BFA">
            <AnimatedDancerPaths />
          </g>
        </svg>

        {/* Middle Main Layer */}
        <svg
          viewBox="160 20 190 170"
          className="absolute inset-0 w-full h-full overflow-visible"
          style={{ transform: "translateZ(0px)" }}
        >
          <defs>
            <linearGradient id="heroDancerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0E7FF" />
              <stop offset="50%" stopColor="#C4B5FD" />
              <stop offset="100%" stopColor="#FBCFE8" />
            </linearGradient>
          </defs>
          <g fill="url(#heroDancerGrad)">
            <AnimatedDancerPaths />
          </g>
        </svg>

        {/* Front Layer (Depth) */}
        <svg
          viewBox="160 20 190 170"
          className="absolute inset-0 w-full h-full overflow-visible"
          style={{ transform: "translateZ(8px)", opacity: 0.5 }}
        >
          <g fill="#FBCFE8">
            <AnimatedDancerPaths />
          </g>
        </svg>
      </motion.div>

      {/* 3D Gyroscope Rotating Rings - Slowed down for elegance */}
      <motion.div
        className="absolute w-[115%] h-[115%] rounded-[40%] border-[2px] border-accent-light/20 will-change-transform"
        animate={{ rotateZ: [0, 360], rotateX: [0, 360], rotateY: [0, 180] }}
        transition={{ duration: 12, ease: "linear", repeat: Infinity }}
        style={{ transformStyle: "preserve-3d" }}
      />
      <motion.div
        className="absolute w-[125%] h-[125%] rounded-[45%] border-[1px] border-accent-purple/30 will-change-transform"
        animate={{ rotateZ: [0, -360], rotateY: [0, -360], rotateX: [0, -180] }}
        transition={{ duration: 15, ease: "linear", repeat: Infinity }}
        style={{ transformStyle: "preserve-3d" }}
      />
    </div>
  );
}
