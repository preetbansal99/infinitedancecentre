"use client";

import { cn } from "@/lib/cn";
import { motion } from "framer-motion";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6" role="navigation" aria-label="Booking progress">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <motion.div
                className={cn(
                  "rounded-full transition-all duration-200",
                  isActive && "w-2 h-2 bg-accent-purple shadow-neon-purple",
                  isCompleted && "w-2 h-2 bg-success",
                  !isActive && !isCompleted && "w-1.5 h-1.5 bg-white/20"
                )}
                animate={isActive ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                aria-current={isActive ? "step" : undefined}
                aria-label={`${labels[i]}: ${isCompleted ? "completed" : isActive ? "current" : "upcoming"}`}
              />
              <span className={cn(
                "text-[10px] mt-1 whitespace-nowrap",
                isActive ? "text-accent-light font-medium" : "text-text-muted"
              )}>
                {labels[i]}
              </span>
            </div>
            {i < totalSteps - 1 && (
              <div className={cn(
                "w-8 h-px mb-4",
                isCompleted ? "bg-success" : "bg-white/10"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
