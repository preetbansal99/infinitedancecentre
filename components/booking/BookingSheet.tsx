"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { Step1CourseSelect } from "@/components/booking/Step1CourseSelect";
import { Step2BatchSelect } from "@/components/booking/Step2BatchSelect";
import { Step3StudentForm } from "@/components/booking/Step3StudentForm";
import { Step4Confirm } from "@/components/booking/Step4Confirm";
import { Step5WhatsApp } from "@/components/booking/Step5WhatsApp";
import { useBookingStore } from "@/hooks/useBookingStore";
import { InfiniteLogoSVG } from "@/components/logo/InfiniteLogoSVG";
import type { BookingFormData, Lead } from "@/types";

const STEP_LABELS = ["Course", "Batch", "Details", "Confirm", "Done"];

const initialFormData: BookingFormData = {
  courseId: "",
  courseName: "",
  batchId: "",
  batchLabel: "",
  studentType: "Self",
  age: "",
  fullName: "",
  phone: "",
  note: "",
};

export function BookingSheet() {
  const { isBookingOpen, preSelectedCourse, closeBookingModal, addLead, showToast } = useBookingStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  // Apply pre-selected course on open
  useEffect(() => {
    if (isBookingOpen && preSelectedCourse) {
      const courseNames: Record<string, string> = {
        zumba: "Zumba Fitness",
        gymnastics: "Kids Gymnastics & Freestyle",
        hiphop: "Hip-Hop",
        kathak: "Kathak",
      };
      setFormData((prev) => ({
        ...prev,
        courseId: preSelectedCourse,
        courseName: courseNames[preSelectedCourse] || preSelectedCourse,
      }));
      setStep(2);
    }
  }, [isBookingOpen, preSelectedCourse]);

  // Lock body scroll
  useEffect(() => {
    if (isBookingOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isBookingOpen]);

  const resetForm = useCallback(() => {
    setStep(1);
    setFormData(initialFormData);
    setSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    closeBookingModal();
    setTimeout(resetForm, 300);
  }, [closeBookingModal, resetForm]);

  // Escape key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  const handleSubmit = async () => {
    setSubmitting(true);

    // Simulate 800ms network delay
    await new Promise((r) => setTimeout(r, 800));

    // Build lead and add to store
    const newLead: Lead = {
      id: `LEAD-${Date.now()}`,
      fullName: formData.fullName,
      phone: `+91 ${formData.phone}`,
      course: formData.courseName,
      batch: formData.batchLabel,
      type: formData.studentType,
      age: formData.age ? parseInt(formData.age) : undefined,
      note: formData.note || undefined,
      status: "New",
      submittedAt: new Date().toISOString(),
    };

    addLead(newLead);
    showToast({ message: `Trial booked for ${formData.fullName}!`, type: "success" });

    setSubmitting(false);
    setStep(5);
  };

  return (
    <AnimatePresence>
      {isBookingOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex bg-bg/95 backdrop-blur-3xl md:p-6"
        >
          <motion.div
            initial={{ scale: 0.98, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full flex flex-col md:flex-row bg-surface rounded-none md:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
          >
            {/* Left Panel (Desktop only) */}
            <div className="hidden md:flex flex-col relative w-1/2 p-12 bg-gradient-to-br from-accent-purple/20 via-accent-pink/10 to-transparent">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" />
              
              <div className="relative z-10">
                <InfiniteLogoSVG size="md" />
              </div>
              
              <div className="relative z-10 mt-auto">
                <h2 className="text-display-md font-bold text-text-primary leading-tight mb-4">
                  Your Journey<br />Starts Here.
                </h2>
                <p className="text-body text-text-secondary max-w-sm">
                  Join the most vibrant dance community in Yamuna Vihar. Book your free trial today and experience the difference.
                </p>
              </div>
            </div>

            {/* Right Panel (Form) */}
            <div className="flex-1 flex flex-col relative bg-surface md:bg-transparent min-h-0">
              <div className="flex items-center justify-between p-4 md:p-8 border-b border-white/5 md:border-none">
                <div className="md:hidden">
                  <InfiniteLogoSVG size="sm" showWordmark={false} />
                </div>
                <h2 className="text-heading-sm font-semibold text-text-primary md:hidden">Book Free Trial</h2>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-colors ml-auto"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar">
                <div className="px-4 py-6 md:px-12 md:py-8 min-h-full flex flex-col max-w-md w-full mx-auto">
                  {step < 5 && (
                    <div className="mb-8">
                      <h3 className="text-heading-md font-bold text-text-primary mb-6 hidden md:block">
                        Book your Free Trial
                      </h3>
                      <StepIndicator currentStep={step} totalSteps={5} labels={STEP_LABELS} />
                    </div>
                  )}

                  <div className="flex-1 relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                      >
                        {step === 1 && (
                          <Step1CourseSelect
                            selected={formData.courseId}
                            onSelect={(id, name) => setFormData((p) => ({ ...p, courseId: id, courseName: name }))}
                            onNext={() => setStep(2)}
                          />
                        )}

                        {step === 2 && (
                          <Step2BatchSelect
                            courseId={formData.courseId}
                            selected={formData.batchId}
                            onSelect={(id, label) => setFormData((p) => ({ ...p, batchId: id, batchLabel: label }))}
                            onNext={() => setStep(3)}
                            onBack={() => setStep(1)}
                          />
                        )}

                        {step === 3 && (
                          <Step3StudentForm
                            data={formData}
                            onChange={(updates) => setFormData((p) => ({ ...p, ...updates }))}
                            onNext={() => setStep(4)}
                            onBack={() => setStep(2)}
                          />
                        )}

                        {step === 4 && (
                          <Step4Confirm
                            data={formData}
                            loading={submitting}
                            onSubmit={handleSubmit}
                            onBack={() => setStep(3)}
                          />
                        )}

                        {step === 5 && (
                          <Step5WhatsApp data={formData} onClose={handleClose} />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
