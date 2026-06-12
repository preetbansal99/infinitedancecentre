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
import { Logo } from "@/components/logo/Logo";
import { DancerSVG } from "@/components/hero/DancerSVG";
import { GlassWall } from "@/components/hero/GlassWall";
import { ParticleBurst } from "@/components/hero/ParticleBurst";
import { ImpactRing } from "@/components/hero/ImpactRing";
import { ScrollProgressBar } from "@/components/hero/ScrollProgressBar";
import { useBookingStore } from "@/hooks/useBookingStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ClayButton } from "@/components/shared/ClayButton";
import { ChevronDown, MapPin, Star, Users } from "lucide-react";

// ── Ambient Particles (internal sub-component) ──────────────────────────
const PARTICLE_CONFIGS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: [-40, -22, 0, 22, 40, -30, 15, 30, -15, 35][i] + "%",
  y: [-35, 15, -40, -20, 25, 30, -30, 10, 40, -10][i] + "%",
  size: [3, 2, 4, 2, 3, 2, 3, 4, 2, 3][i],
  color: ["#3B82F6", "#8B5CF6", "#C084FC", "#F0ABFC", "#FFFFFF"][i % 5],
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
  const { openBookingModal, openEnquireModal } = useBookingStore();

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
  
  // Only allow clicks when the panel is fully visible
  const ctaPointerEvents = useTransform(smoothProgress, [0.79, 0.80], ["none", "auto"]);

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
        <Logo size="lg" className="mb-8" />
        <p className="text-text-secondary text-body text-center mb-10 max-w-xs">
          Dance. Express. Be Infinite.
        </p>
        <p className="text-display-md font-bold text-center text-text-primary max-w-sm mb-4">
          Move With Confidence. Train With the Best.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
          <ClayButton variant="outline" size="sm" onClick={() => openEnquireModal()}>
            Send Enquiry
          </ClayButton>
          <ClayButton variant="primary" size="sm" onClick={() => openBookingModal()}>
            Book Free Trial
          </ClayButton>
        </div>
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
            <div className="pointer-events-none">
              <Logo size="hero" className="filter-neon-combo animate-neon-pulse" />
            </div>
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
            style={{ opacity: ctaContentOpacity, y: ctaContentY, pointerEvents: ctaPointerEvents as any }}
          >
            {/* Glowing Orbs for Visual Energy */}
            <div className="absolute top-[10%] left-[15%] w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-[20%] right-[15%] w-96 h-96 bg-fuchsia-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="flex flex-col items-center justify-center flex-1 max-w-3xl">
              <p className="text-sm tracking-[0.3em] text-cyan-400 uppercase font-semibold mb-4 drop-shadow-md">
                INFINITE DANCE CENTRE
              </p>
              <h1 className="text-display-md md:text-display-lg font-extrabold text-white leading-tight mb-4 text-center drop-shadow-lg">
                Move With
                <br />
                Confidence.
              </h1>
              <p className="text-heading font-semibold text-gray-200 mb-12 text-center drop-shadow-md">
                Train With the Best.
              </p>

              {/* ── SECONDARY CTAS: ENQUIRE & BOOK ── */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center mb-8 sm:mb-10 max-w-[280px] sm:max-w-none mx-auto">
                <motion.button
                  onClick={() => openEnquireModal()}
                  className="w-full sm:w-48 border border-white/20 text-gray-200 hover:text-white font-semibold py-3 px-4 sm:py-4 sm:px-6 rounded-xl text-sm sm:text-base tracking-wide text-center bg-white/10 hover:bg-white/15 transition-all shadow-lg"
                  whileTap={{ scale: 0.97 }}
                  aria-label="Send an enquiry about courses"
                >
                  Send Enquiry
                </motion.button>
                <motion.button
                  onClick={() => openBookingModal()}
                  className="w-full sm:w-64 bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-400 hover:to-fuchsia-400 text-white font-bold py-3 px-4 sm:py-4 sm:px-8 rounded-xl text-sm sm:text-base tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
                  whileTap={{ scale: 0.97 }}
                  aria-label="Book a free trial class"
                >
                  Book Free Trial
                </motion.button>
              </div>

              {/* ── SOCIAL PROOF ── */}
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex flex-wrap justify-center gap-6">
                  <span className="flex items-center gap-2 text-body font-medium text-white drop-shadow-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    4.9 Google Reviews
                  </span>
                  <span className="hidden sm:inline text-white/40">|</span>
                  <span className="flex items-center gap-2 text-body font-medium text-white drop-shadow-sm">
                    <Users className="w-4 h-4 text-cyan-400" />
                    200+ Students
                  </span>
                </div>
                <a 
                  href="https://www.google.com/maps/search/Infinite+Dance+Centre+Yamuna+Vihar+Delhi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-cyan-300 bg-cyan-900/30 px-5 py-2.5 rounded-full border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:bg-cyan-900/50 hover:scale-105 transition-all cursor-pointer mt-2"
                  aria-label="Open location in Google Maps"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="font-semibold tracking-wide hover:underline underline-offset-2">C-3/161, 162, Block C, Yamuna Vihar, Delhi</span>
                </a>
              </div>
            </div>

            {/* ── DEMOTED CTA: EXPLORE WEBSITE (Bottom anchored) ── */}
            <motion.button
              onClick={() => {
                useBookingStore.getState().setPendingScrollId("courses");
                if (onExplore) onExplore();
              }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 group flex items-center gap-3 text-white transition-all bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-full px-8 py-3.5 backdrop-blur-md shadow-lg"
              aria-label="Explore the rest of the website"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm font-semibold tracking-[0.2em] uppercase">
                Explore IDC
              </span>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="w-4 h-4 text-cyan-400" />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
