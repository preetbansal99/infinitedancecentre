"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ClayButton } from "@/components/shared/ClayButton";

interface FormData {
  studentType: "Self" | "Child";
  age: string;
  fullName: string;
  phone: string;
  note: string;
}

interface Step3Props {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const shakeVariants = {
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.35 },
  },
};

export function Step3StudentForm({ data, onChange, onNext, onBack }: Step3Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shaking, setShaking] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.fullName || !/^[a-zA-Z\s'-]{3,60}$/.test(data.fullName)) {
      newErrors.fullName = "Please enter a valid full name (3–60 characters)";
    }
    if (!data.phone || !/^[6-9]\d{9}$/.test(data.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    }
    if (data.studentType === "Child" && data.age) {
      const ageNum = parseInt(data.age);
      if (isNaN(ageNum) || ageNum < 5 || ageNum > 16) {
        newErrors.age = "Age must be between 5 and 16";
      }
    }
    if (data.note && data.note.length > 150) {
      newErrors.note = "Note must be under 150 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onNext();
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    }
  };

  return (
    <motion.div
      variants={shakeVariants}
      animate={shaking ? "shake" : undefined}
    >
      <p className="text-body-sm text-text-secondary mb-4">Enter your details:</p>

      {/* Student Type */}
      <div className="mb-4">
        <label className="text-caption text-text-secondary mb-2 block">Who is this trial for?</label>
        <div className="flex gap-3">
          {(["Self", "Child"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange({ studentType: type })}
              className={`flex-1 py-3 rounded-lg text-body-sm font-semibold transition-all ${
                data.studentType === type
                  ? "bg-accent-purple/20 border border-accent-purple/50 text-accent-light"
                  : "glass text-text-secondary hover:text-text-primary"
              }`}
            >
              {type === "Self" ? "🧑 Self" : "👶 Child"}
            </button>
          ))}
        </div>
      </div>

      {/* Age (conditional) */}
      {data.studentType === "Child" && (
        <div className="mb-4">
          <label htmlFor="age" className="text-caption text-text-secondary mb-1.5 block">
            Child&apos;s Age
          </label>
          <input
            id="age"
            type="number"
            inputMode="numeric"
            min={5}
            max={16}
            value={data.age}
            onChange={(e) => onChange({ age: e.target.value })}
            className="w-full bg-surface-el border border-white/10 rounded-lg px-4 py-3 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none transition-colors"
            placeholder="e.g. 8"
            aria-invalid={!!errors.age}
            aria-describedby={errors.age ? "age-error" : undefined}
          />
          {errors.age && (
            <p id="age-error" role="alert" className="text-caption text-error mt-1">{errors.age}</p>
          )}
        </div>
      )}

      {/* Full Name */}
      <div className="mb-4">
        <label htmlFor="fullName" className="text-caption text-text-secondary mb-1.5 block">
          Full Name <span className="text-cta-magenta">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          value={data.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          className="w-full bg-surface-el border border-white/10 rounded-lg px-4 py-3 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none transition-colors"
          placeholder="Enter full name"
          aria-required="true"
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? "name-error" : undefined}
        />
        {errors.fullName && (
          <p id="name-error" role="alert" className="text-caption text-error mt-1">{errors.fullName}</p>
        )}
      </div>

      {/* Phone */}
      <div className="mb-4">
        <label htmlFor="phone" className="text-caption text-text-secondary mb-1.5 block">
          Phone Number <span className="text-cta-magenta">*</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-body-sm text-text-muted bg-surface border border-white/10 rounded-lg px-3 py-3">+91</span>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
            className="flex-1 bg-surface-el border border-white/10 rounded-lg px-4 py-3 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none transition-colors"
            placeholder="98765 43210"
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
          />
        </div>
        {errors.phone && (
          <p id="phone-error" role="alert" className="text-caption text-error mt-1">{errors.phone}</p>
        )}
        <p id="phone-hint" className="text-caption text-text-muted mt-1">Enter without country code</p>
      </div>

      {/* Note */}
      <div className="mb-6">
        <label htmlFor="note" className="text-caption text-text-secondary mb-1.5 block">
          Note (optional)
        </label>
        <textarea
          id="note"
          value={data.note}
          onChange={(e) => onChange({ note: e.target.value })}
          maxLength={150}
          rows={2}
          className="w-full bg-surface-el border border-white/10 rounded-lg px-4 py-3 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none resize-none transition-colors"
          placeholder="Any specific requirements or questions"
          aria-describedby={errors.note ? "note-error" : undefined}
        />
        <div className="flex justify-between mt-1">
          {errors.note ? (
            <p id="note-error" role="alert" className="text-caption text-error">{errors.note}</p>
          ) : <span />}
          <span className={`text-caption ${data.note.length > 140 ? "text-warning" : "text-text-muted"}`}>
            {data.note.length}/150
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <ClayButton variant="ghost" onClick={onBack} className="flex-1">
          ← Back
        </ClayButton>
        <ClayButton variant="primary" onClick={handleSubmit} className="flex-1">
          Continue →
        </ClayButton>
      </div>
    </motion.div>
  );
}
