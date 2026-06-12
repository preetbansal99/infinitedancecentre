"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import { ClayButton } from "@/components/shared/ClayButton";
import { Clock, AlertTriangle } from "lucide-react";

const batchOptions: Record<string, { id: string; label: string; days: string; urgency?: string }[]> = {
  zumba: [
    { id: "B-001", label: "Morning Batch — 7:00 AM to 8:00 AM",  days: "Mon – Fri", urgency: "3 spots left" },
    { id: "B-002", label: "Evening Batch — 6:00 PM to 7:00 PM",  days: "Mon – Fri" },
  ],
  gymnastics: [
    { id: "B-003", label: "Evening Batch — 5:00 PM to 6:00 PM",  days: "Mon / Wed / Fri", urgency: "Filling fast" },
  ],
  hiphop: [
    { id: "B-004", label: "Weekend Batch — 5:00 PM to 6:30 PM",  days: "Sat / Sun", urgency: "Filling fast" },
  ],
  kathak: [
    { id: "B-005", label: "Evening Batch — 7:00 PM to 8:00 PM",  days: "Tue / Thu / Sat" },
  ],
};

interface Step2Props {
  courseId: string;
  selected: string;
  onSelect: (batchId: string, batchLabel: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const defaultBatches = [
  { id: "B-MORNING", label: "Morning Batch — 7:00 AM to 8:00 AM", days: "Mon / Wed / Fri", urgency: "2 spots left" },
  { id: "B-EVENING1", label: "Evening Batch — 5:00 PM to 6:00 PM", days: "Tue / Thu / Sat", urgency: "Filling fast" },
  { id: "B-EVENING2", label: "Evening Batch — 7:00 PM to 8:00 PM", days: "Mon – Fri" },
  { id: "B-WEEKEND", label: "Weekend Batch — 4:00 PM to 6:00 PM", days: "Sat / Sun", urgency: "Popular" },
];

export function Step2BatchSelect({ courseId, selected, onSelect, onNext, onBack }: Step2Props) {
  const batches = batchOptions[courseId] && batchOptions[courseId].length > 0 
    ? batchOptions[courseId] 
    : defaultBatches;

  return (
    <div>
      <p className="text-body-sm text-text-secondary mb-4">Select your preferred timing:</p>
      <div className="flex flex-col gap-3">
        {batches.map((batch) => {
          const isSelected = selected === batch.id;
          return (
            <motion.div key={batch.id} whileTap={{ scale: 0.98 }}>
              <GlassCard
                radius="md"
                className={`p-4 cursor-pointer transition-all ${
                  isSelected
                    ? "border-[1.5px] border-cta-magenta/60 shadow-[0_0_12px_rgba(225,29,72,0.3)]"
                    : "hover:border-white/15"
                }`}
                onClick={() => onSelect(batch.id, batch.label)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-accent-light" />
                      <p className="text-body-sm font-semibold text-text-primary">{batch.label}</p>
                    </div>
                    <p className="text-caption text-text-muted ml-6">{batch.days}</p>
                  </div>
                  {batch.urgency && (
                    <span className="bg-warning/10 text-warning text-caption rounded-full px-2 py-0.5 flex items-center gap-1 flex-shrink-0">
                      <AlertTriangle className="w-3 h-3" />
                      {batch.urgency}
                    </span>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-6">
        <ClayButton variant="ghost" onClick={onBack} className="flex-1">
          ← Back
        </ClayButton>
        <ClayButton variant="primary" onClick={onNext} disabled={!selected} className="flex-1">
          Continue →
        </ClayButton>
      </div>
    </div>
  );
}
