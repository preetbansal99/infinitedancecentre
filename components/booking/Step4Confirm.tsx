"use client";

import { GlassCard } from "@/components/shared/GlassCard";
import { ClayButton } from "@/components/shared/ClayButton";
import { User, Clock, BookOpen, StickyNote } from "lucide-react";
import type { BookingFormData } from "@/types";

interface Step4Props {
  data: BookingFormData;
  loading: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export function Step4Confirm({ data, loading, onSubmit, onBack }: Step4Props) {
  return (
    <div>
      <p className="text-body-sm text-text-secondary mb-4">Review your trial booking:</p>

      <GlassCard radius="md" className="p-4 space-y-3 mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-4 h-4 text-accent-light flex-shrink-0" />
          <div>
            <p className="text-caption text-text-muted">Course</p>
            <p className="text-body-sm font-semibold text-text-primary">{data.courseName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-accent-light flex-shrink-0" />
          <div>
            <p className="text-caption text-text-muted">Batch</p>
            <p className="text-body-sm font-semibold text-text-primary">{data.batchLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-accent-light flex-shrink-0" />
          <div>
            <p className="text-caption text-text-muted">Student</p>
            <p className="text-body-sm font-semibold text-text-primary">
              {data.fullName} ({data.studentType}{data.age ? `, Age ${data.age}` : ""})
            </p>
            <p className="text-caption text-text-secondary font-mono">+91 {data.phone}</p>
          </div>
        </div>

        {data.note && (
          <div className="flex items-start gap-3">
            <StickyNote className="w-4 h-4 text-accent-light flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-caption text-text-muted">Note</p>
              <p className="text-body-sm text-text-secondary">{data.note}</p>
            </div>
          </div>
        )}
      </GlassCard>

      <div className="flex gap-3">
        <ClayButton variant="ghost" onClick={onBack} className="flex-1" disabled={loading}>
          ← Back
        </ClayButton>
        <ClayButton variant="primary" onClick={onSubmit} className="flex-1" loading={loading}>
          Submit Trial Request
        </ClayButton>
      </div>
    </div>
  );
}
