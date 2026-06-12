"use client";
import { useEffect, useRef } from "react";
import { MotionValue } from "framer-motion";

const BURST_PARTICLES = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2;
  const speed = 60 + (i % 4) * 25;
  return {
    id: i,
    tx: `${Math.cos(angle) * speed}px`,
    ty: `${Math.sin(angle) * speed}px`,
    color: ["#E11D48","#F0ABFC","#FFFFFF","#8B5CF6","#3B82F6"][i % 5],
    size: [4, 3, 5, 3, 4, 6, 3, 4, 5, 3, 4, 3, 5, 4, 3, 6, 4, 3][i],
    duration: `${0.4 + (i % 3) * 0.15}s`,
  };
});

interface ParticleBurstProps {
  progress: MotionValue<number>;
  triggerAt: number;
}

export function ParticleBurst({ progress, triggerAt }: ParticleBurstProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const unsub = progress.on("change", (v) => {
      if (v >= triggerAt && !triggered.current) {
        triggered.current = true;
        fireBurst();
      }
      if (v < triggerAt - 0.05) triggered.current = false;
    });
    return unsub;
  }, [progress, triggerAt]);

  const fireBurst = () => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";

    BURST_PARTICLES.forEach((p) => {
      const el = document.createElement("div");
      el.style.cssText = `
        position: absolute;
        left: calc(45% - ${p.size / 2}px);
        top: calc(50% - ${p.size / 2}px);
        width: ${p.size}px;
        height: ${p.size}px;
        border-radius: 50%;
        background: ${p.color};
        box-shadow: 0 0 ${p.size * 2}px ${p.color};
        --tx: ${p.tx};
        --ty: ${p.ty};
        animation: particleFloat ${p.duration} cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      `;
      container.appendChild(el);
      setTimeout(() => el.remove(), 600);
    });
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-[25] overflow-hidden"
      aria-hidden="true"
    />
  );
}
