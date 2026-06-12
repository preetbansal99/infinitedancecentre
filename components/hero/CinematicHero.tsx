"use client";

import { useRef, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useAnimation,
  MotionValue,
} from "framer-motion";
import { InfiniteLogoSVG } from "@/components/logo/InfiniteLogoSVG";
import { DancerSVG } from "@/components/hero/DancerSVG";
import { GlassWall } from "@/components/hero/GlassWall";
import { ParticleBurst } from "@/components/hero/ParticleBurst";
import { ImpactRing } from "@/components/hero/ImpactRing";
import { ScrollProgressBar } from "@/components/hero/ScrollProgressBar";
import { useBookingStore } from "@/hooks/useBookingStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ClayButton } from "@/components/shared/ClayButton";
import { ChevronDown, MapPin, Star, Users } from "lucide-react";

// ── Ambient Particles (internal sub-component) ──────────────────────────────────
const PARTICLE_CONFIGS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: [-40, -22, 0, 22, 40, -30, 15, 30, -15, 35][i] + "%",
  y: [-35, 15, -40, -20, 25, 30, -30, 10, 40, -10][i] + "%",
  size: [3, 2, 4, 2, 3, 2, 3, 4, 2, 3][i],
  color: ["#D4A853", "#E8C88A", "#F0B429", "#FFFFFF", "#D4A853"][i % 5],
  delay: i * 0.3,
  duration: 5 + (i % 3) * 1.2,
}));

function AmbientParticles({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.14, 0.20, 0.58, 0.65], [0, 1, 1, 0]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {PARTICLE_CONFIGS.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            left: `calc(50% + ${p.x})`,
            top:  `calc(50% + ${p.y})`,
            opacity,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            willChange: "transform, opacity",
          }}
          animate={{
            y: [0, -12, 0, 8, 0],
            x: [0, 4, -4, 2, 0],
            opacity: [0.4, 0.9, 0.5, 0.8, 0.4],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ── Main CinematicHero ──────────────────────────────────────────────────
interface CinematicHeroProps {
  onExplore?: () => void;
}

export function CinematicHero({ onExplore }: CinematicHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const impactControls = useAnimation();
  const impactTriggered = useRef(false);
  const prefersReduced = useReducedMotion();
  const { openBookingModal } = useBookingStore();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  // ── PHASE 1 transforms (0.00 → 0.15)
  const logoScale = useTransform(smoothProgress, [0, 0.12, 0.15], [1.0, 1.0, 0.28]);
  const logoOpacity = useTransform(smoothProgress, [0, 0.12, 0.15], [1, 1, 0]);
  const logoX = useTransform(smoothProgress, [0.12, 0.15], [0, -160]);
  const logoY = useTransform(smoothProgress, [0.12, 0.15], [0, -360]);
  const taglineOpacity = useTransform(smoothProgress, [0, 0.13, 0.15], [1, 1, 0]);

  // ── PHASE 2 transforms (0.15 → 0.60)
  const dancerOpacity = useTransform(smoothProgress, [0.13, 0.20, 0.65, 0.72], [0, 1, 1, 0]);
  // Replaced the 720deg spin with a subtle tilt so the 2D rigged character remains visible
  const dancerRotation = useTransform(smoothProgress, [0.15, 0.60], [0, 15]);
  const dancerScale = useTransform(smoothProgress, [0.15, 0.45, 0.60], [1.0, 1.15, 1.2]);
  const dancerY = useTransform(smoothProgress, [0.15, 0.60], [0, -24]);

  const bgR = useTransform(smoothProgress, [0, 0.30, 0.60], [10, 13, 22]);
  const bgG = useTransform(smoothProgress, [0, 0.30, 0.60], [10, 13, 22]);
  const bgB = useTransform(smoothProgress, [0, 0.30, 0.60], [15, 18, 42]);

  // ── PHASE 3 transforms (0.60 → 0.70)
  const wallX = useTransform(smoothProgress, [0.58, 0.65], [120, 0]);
  const wallOpacity = useTransform(smoothProgress, [0.58, 0.65, 0.68, 0.72], [0, 1, 1, 0]);
  const wallCrackOpacity = useTransform(smoothProgress, [0.65, 0.70], [0, 1]);

  // ── PHASE 4 transforms (0.70 → 0.85)
  const ctaContentOpacity = useTransform(smoothProgress, [0.72, 0.80], [0, 1]);
  const ctaContentY = useTransform(smoothProgress, [0.72, 0.80], [24, 0]);
  const socialProofOpacity = useTransform(smoothProgress, [0.78, 0.84], [0, 1]);

  // ── PHASE 5 transforms (removed to prevent fade-out)
  // const fadeToSite = useTransform(smoothProgress, [0.88, 1.0], [0, 1]);

  // ── Computed style values (must be called before early return) ──────
  const bgColor = useTransform(
    [bgR, bgG, bgB] as any,
    ([r, g, b]: number[]) => `rgb(${r}, ${g}, ${b})`
  );
  const wallXPercent = useTransform(wallX, (v: number) => `${v}%`);

  // ── Impact trigger at scrollYProgress = 0.62
  const triggerImpact = useCallback(async () => {
    await impactControls.start({
      scale: [1.2, 0.9, 1.0],
      x: [0, -16, 0],
      transition: { type: "spring", stiffness: 400, damping: 10, duration: 0.4 },
    });
  }, [impactControls]);

  useEffect(() => {
    if (prefersReduced) return;
    const unsubscribe = scrollYProgress.on("change", (v) => {
      if (v >= 0.62 && !impactTriggered.current) {
        impactTriggered.current = true;
        triggerImpact();
      }
      if (v < 0.58) {
        impactTriggered.current = false;
      }
    });
    return unsubscribe;
  }, [scrollYProgress, prefersReduced, triggerImpact]);

  // ── Reduced motion fallback
  if (prefersReduced) {
    return (
      <section className="relative min-h-screen bg-bg flex flex-col items-center justify-center px-6 py-24">
        <InfiniteLogoSVG size="lg" className="mb-8" />
        <p className="text-text-secondary text-body text-center mb-10 max-w-xs">
          Dance. Express. Be Infinite.
        </p>
        <p className="text-display-md font-bold text-center text-text-primary max-w-sm mb-4">
          Move With Confidence. Train With the Best.
        </p>
        <ClayButton variant="primary" size="lg" onClick={() => openBookingModal()}>
          Book Free Trial
        </ClayButton>
      </section>
    );
  }

  return (
    <>
      <ScrollProgressBar progress={smoothProgress} />

      <div ref={containerRef} className="relative" style={{ height: "250vh" }}>
        <motion.div
          ref={sceneRef}
          className="sticky top-0 h-screen w-full overflow-hidden"
          style={{
            backgroundColor: bgColor,
          }}
        >
          {/* Ambient dark noise texture overlay */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.08) 0%, transparent 50%),
                                radial-gradient(ellipse at 80% 50%, rgba(139,92,246,0.08) 0%, transparent 50%)`,
            }}
          />

          {/* PHASE 1: Hero Logo */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
            style={{ opacity: logoOpacity, scale: logoScale, x: logoX, y: logoY }}
          >
            <InfiniteLogoSVG size="hero" className="filter-neon-combo animate-neon-pulse" />
            <motion.p
              className="mt-6 text-body-sm tracking-[0.25em] text-text-secondary uppercase font-medium"
              style={{ opacity: taglineOpacity }}
            >
              Dance. Express. Be Infinite.
            </motion.p>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center z-10 pointer-events-none"
            style={{ opacity: logoOpacity }}
          >
            <p className="text-caption tracking-[0.2em] text-text-muted uppercase mb-2">Scroll to explore</p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5 text-text-muted" />
            </motion.div>
          </motion.div>

          {/* PHASE 2: Particles */}
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ opacity: dancerOpacity }}
          >
            <AmbientParticles progress={smoothProgress} />
          </motion.div>

          {/* PHASE 2: Dancer / 3D Core */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            style={{ opacity: dancerOpacity, perspective: 1200 }}
          >
            <motion.div
              animate={impactControls}
              style={{
                rotateY: dancerRotation,
                scale: dancerScale,
                y: dancerY,
                transformOrigin: "center center",
                transformStyle: "preserve-3d",
              }}
            >
              <DancerSVG />
            </motion.div>
          </motion.div>

          {/* PHASE 3: Glass Wall + Impact Effects */}
          <motion.div
            className="absolute right-0 top-0 h-full z-20 w-full"
            style={{ x: wallXPercent, opacity: wallOpacity }}
          >
            <GlassWall crackOpacity={wallCrackOpacity} />
          </motion.div>

          <ParticleBurst progress={smoothProgress} triggerAt={0.62} />
          <ImpactRing progress={smoothProgress} triggerAt={0.62} />

          {/* PHASE 4: CTA Panel Content */}
          <motion.div
            className="absolute right-0 top-0 h-full w-full z-30 flex flex-col items-center justify-center px-8 md:px-12"
            style={{ opacity: ctaContentOpacity, y: ctaContentY }}
          >
            <p className="text-xs tracking-[0.3em] text-accent-light uppercase font-semibold mb-3">
              INFINITE DANCE CENTRE
            </p>
            <h1 className="text-display-md md:text-display-lg font-extrabold text-text-primary leading-tight mb-3 text-center">
              Move With
              <br />
              Confidence.
            </h1>
            <p className="text-heading-sm font-semibold text-text-secondary mb-8 text-center">
              Train With the Best.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <motion.button
                onClick={() => openBookingModal()}
                className="flex-1 bg-cta-magenta text-white font-semibold py-4 px-6 rounded-lg shadow-magenta hover:shadow-magenta-lg transition-shadow text-body-sm tracking-wide"
                whileTap={{ scale: 0.97 }}
                whileHover={{ boxShadow: "0 0 40px rgba(225,29,72,0.60)" }}
                aria-label="Book a free trial class"
              >
                Book Free Trial
              </motion.button>
              <motion.a
                href="#courses"
                onClick={(e) => {
                  e.preventDefault();
                  useBookingStore.getState().setPendingScrollId("courses");
                  if (onExplore) onExplore();
                }}
                className="flex-1 border border-white/30 text-white font-semibold py-4 px-6 rounded-lg text-body-sm tracking-wide text-center"
                whileTap={{ scale: 0.97 }}
                whileHover={{ borderColor: "rgba(255,255,255,0.60)" }}
                aria-label="Explore our dance courses"
              >
                Explore Courses
              </motion.a>
            </div>

            <motion.div
              className="mt-8 flex flex-col items-center justify-center gap-3 text-caption text-text-muted"
              style={{ opacity: socialProofOpacity }}
            >
              <div className="flex flex-wrap justify-center gap-4">
                <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 4.9 Google Reviews</span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> 200+ Students</span>
              </div>
              <a 
                href="https://www.google.com/maps/search/Infinite+Dance+Centre+Yamuna+Vihar+Delhi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-accent-light bg-accent-light/10 px-4 py-1.5 rounded-full border border-accent-light/20 shadow-[0_0_10px_rgba(139,92,246,0.2)] hover:bg-accent-light/20 hover:scale-105 transition-all cursor-pointer"
                aria-label="Open location in Google Maps"
              >
                <MapPin className="w-4 h-4" />
                <span className="font-medium tracking-wide hover:underline underline-offset-2">C-3/161, 162, Block C, Yamuna Vihar, Delhi</span>
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
