"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, MessageCircle, Copy } from "lucide-react";
import { useBookingStore } from "@/hooks/useBookingStore";
import { Logo } from "@/components/logo/Logo";
import { ClayButton } from "@/components/shared/ClayButton";
import { buildEnquiryWhatsAppURL, copyEnquiryMessageToClipboard } from "@/lib/whatsapp";
import { AnimatedCheckmark } from "@/components/shared/AnimatedCheckmark";
import type { Lead } from "@/types";

import { MOCK_COURSES } from "@/data/mockData";

const COURSES = MOCK_COURSES.map(c => c.name);

export function EnquireSheet() {
  const { isEnquireOpen, closeEnquireModal, addLead, showToast } = useBookingStore();
  
  const [formData, setFormData] = useState({ fullName: "", phone: "", courseName: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleWhatsApp = () => {
    window.open(buildEnquiryWhatsAppURL({
      fullName: formData.fullName,
      phone: formData.phone,
      courseName: formData.courseName
    }), "_blank");
  };

  const handleCopy = async () => {
    const ok = await copyEnquiryMessageToClipboard({
      fullName: formData.fullName,
      phone: formData.phone,
      courseName: formData.courseName
    });
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Lock body scroll
  useEffect(() => {
    if (isEnquireOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isEnquireOpen]);

  const resetForm = useCallback(() => {
    setFormData({ fullName: "", phone: "", courseName: "" });
    setErrors({});
    setSubmitting(false);
    setSuccess(false);
  }, []);

  const handleClose = useCallback(() => {
    closeEnquireModal();
    setTimeout(resetForm, 300);
  }, [closeEnquireModal, resetForm]);

  // Escape key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName || !/^[a-zA-Z\s'-]{3,60}$/.test(formData.fullName)) {
      newErrors.fullName = "Please enter a valid full name";
    }
    if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    }
    if (!formData.courseName) {
      newErrors.courseName = "Please select a course";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    // Build lead
    const newLead: Lead = {
      id: `LEAD-${Date.now()}`,
      fullName: formData.fullName,
      phone: `+91 ${formData.phone}`,
      course: formData.courseName,
      batch: "TBD", // Not selected yet
      type: "Self", // Default assumption
      note: "Enquiry from website",
      status: "New",
      submittedAt: new Date().toISOString(),
    };

    addLead(newLead);
    showToast({ message: "Enquiry submitted successfully!", type: "success" });

    setSubmitting(false);
    setSuccess(true);
  };

  return (
    <AnimatePresence>
      {isEnquireOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex bg-bg/95 backdrop-blur-xl md:p-6 items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-[400px] bg-surface rounded-none md:rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 h-full md:h-auto flex flex-col relative"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/5 relative z-10">
              <Logo size="sm" />
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto">
              {!success ? (
                <>
                  <h2 className="text-2xl font-display font-bold text-text-primary mb-1">
                    Send Enquiry
                  </h2>
                  <p className="text-sm text-text-secondary mb-4">
                    Leave your details and we&apos;ll get back to you shortly with batch timings and fee details.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="text-xs text-text-secondary mb-1 block">
                        Full Name <span className="text-cta-magenta">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                        placeholder="Enter full name"
                      />
                      {errors.fullName && <p className="text-[10px] text-error mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="text-xs text-text-secondary mb-1 block">
                        Phone Number <span className="text-cta-magenta">*</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-text-muted bg-surface border border-white/10 rounded-lg px-2.5 py-2">+91</span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                          className="flex-1 bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                          placeholder="98765 43210"
                        />
                      </div>
                      {errors.phone && <p className="text-[10px] text-error mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="text-xs text-text-secondary mb-1 block">
                        Course Interested In <span className="text-cta-magenta">*</span>
                      </label>
                      <select
                        value={formData.courseName}
                        onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                        className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent-purple/50 focus:outline-none appearance-none"
                      >
                        <option value="" disabled>Select a course</option>
                        {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.courseName && <p className="text-[10px] text-error mt-1">{errors.courseName}</p>}
                    </div>

                    <div className="pt-2">
                      <ClayButton type="submit" variant="primary" fullWidth loading={submitting}>
                        Send Enquiry
                      </ClayButton>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center text-center py-4">
                  <AnimatedCheckmark size={60} />

                  <h3 className="text-xl font-bold text-text-primary mt-4 mb-2">
                    Enquiry Registered! 🎉
                  </h3>
                  <p className="text-sm text-text-secondary max-w-xs mb-6">
                    One last step — send your details to the studio via WhatsApp for an instant response.
                  </p>

                  <ClayButton
                    variant="whatsapp"
                    size="md"
                    fullWidth
                    onClick={handleWhatsApp}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Open WhatsApp & Send
                  </ClayButton>

                  <button
                    onClick={handleCopy}
                    className="mt-4 text-xs text-text-muted hover:text-text-secondary flex items-center gap-1.5 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? "Copied!" : "Copy message instead"}
                  </button>

                  <button
                    onClick={handleClose}
                    className="mt-6 text-xs text-text-muted underline underline-offset-4 hover:text-text-secondary transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
