"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserCircle2, MessageCircle, Copy } from "lucide-react";
import { useBookingStore } from "@/hooks/useBookingStore";
import { buildEnquiryWhatsAppURL, copyEnquiryMessageToClipboard } from "@/lib/whatsapp";
import { AnimatedCheckmark } from "@/components/shared/AnimatedCheckmark";
import type { Lead } from "@/types";

const COURSES = [
  "Dance Classes",
  "Women's Fitness Dance",
  "Zumba",
  "Kids Dance Classes",
  "Weight Loss Training",
  "Wedding Choreography",
  "Hip hop",
  "Lyrical/contemporary dance",
  "Beginner's classes",
  "Intermediate classes",
  "Advanced classes",
  "Event Choreography",
  "Private lessons"
];

export function BookingSheet() {
  const { isBookingOpen, preSelectedCourse, closeBookingModal, addLead, showToast } = useBookingStore();
  
  const [formData, setFormData] = useState({ fullName: "", phone: "", email: "", courseName: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Apply pre-selected course on open
  useEffect(() => {
    if (isBookingOpen && preSelectedCourse) {
      const courseNames: Record<string, string> = {
        zumba: "Zumba",
        gymnastics: "Kids Dance Classes",
        hiphop: "Hip hop",
        kathak: "Dance Classes",
      };
      setFormData((prev) => ({
        ...prev,
        courseName: courseNames[preSelectedCourse] || "Dance Classes",
      }));
    }
  }, [isBookingOpen, preSelectedCourse]);

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
    if (isBookingOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isBookingOpen]);

  const resetForm = useCallback(() => {
    setFormData({ fullName: "", phone: "", email: "", courseName: "", message: "" });
    setErrors({});
    setSubmitting(false);
    setSuccess(false);
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName || !/^[a-zA-Z\s'-]{3,60}$/.test(formData.fullName)) {
      newErrors.fullName = "Required";
    }
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Required";
    }
    if (!formData.courseName) {
      newErrors.courseName = "Required";
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
      batch: "TBD",
      type: "Self",
      note: formData.message || "Trial Booking from Website",
      status: "New",
      submittedAt: new Date().toISOString(),
    };

    addLead(newLead);
    showToast({ message: "Trial Request submitted successfully!", type: "success" });

    setSubmitting(false);
    setSuccess(true);
  };

  return (
    <AnimatePresence>
      {isBookingOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex bg-black/60 backdrop-blur-sm p-4 items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-[520px] bg-[#242938] rounded-[24px] overflow-hidden shadow-2xl relative border border-white/5"
          >
            <div className="absolute top-6 right-6 z-10">
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-[#9CA3AF] hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              {!success ? (
                <>
                  <h2 className="text-[32px] font-bold text-white leading-tight mb-1">
                    Book a Free Trial
                  </h2>
                  <p className="text-[#9CA3AF] text-[16px] mb-8">
                    We&apos;ll get back to you within 24 hours
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="text-[15px] text-[#D1D5DB] mb-2 block font-medium">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className={`w-full bg-[#1A1F2D] border ${errors.fullName ? "border-red-500" : "border-[#303645]"} rounded-xl px-4 py-3.5 text-[16px] text-white placeholder:text-[#6B7280] focus:border-[#4B5A7D] focus:outline-none transition-colors shadow-inner`}
                          placeholder="Your full name"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4B5A7D]">
                          <UserCircle2 className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[15px] text-[#D1D5DB] mb-2 block font-medium">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          maxLength={10}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                          className={`w-full bg-[#1A1F2D] border ${errors.phone ? "border-red-500" : "border-[#303645]"} rounded-xl px-4 py-3.5 text-[16px] text-white placeholder:text-[#6B7280] focus:border-[#4B5A7D] focus:outline-none transition-colors shadow-inner`}
                          placeholder="+91 98XXX XXXXX"
                        />
                      </div>
                      <div>
                        <label className="text-[15px] text-[#D1D5DB] mb-2 block font-medium">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-[#1A1F2D] border border-[#303645] rounded-xl px-4 py-3.5 text-[16px] text-white placeholder:text-[#6B7280] focus:border-[#4B5A7D] focus:outline-none transition-colors shadow-inner"
                          placeholder="you@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[15px] text-[#D1D5DB] mb-2 block font-medium">
                        Interested Class
                      </label>
                      <select
                        value={formData.courseName}
                        onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                        className={`w-full bg-[#1A1F2D] border ${errors.courseName ? "border-red-500" : "border-[#303645]"} rounded-xl px-4 py-3.5 text-[16px] text-white focus:border-[#4B5A7D] focus:outline-none appearance-none transition-colors shadow-inner`}
                      >
                        <option value="" disabled className="text-[#6B7280]">Select a class</option>
                        {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-[15px] text-[#D1D5DB] mb-2 block font-medium">
                        Message (Optional)
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={3}
                        className="w-full bg-[#1A1F2D] border border-[#303645] rounded-xl px-4 py-3.5 text-[16px] text-white placeholder:text-[#6B7280] focus:border-[#4B5A7D] focus:outline-none transition-colors shadow-inner resize-none"
                        placeholder="Any specific questions or preferred timing?"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#EF5350] hover:bg-[#E53935] text-white font-semibold text-[17px] py-4 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                      >
                        {submitting ? "Submitting..." : "Submit Booking Request"}
                      </button>
                      <p className="text-center text-[#9CA3AF] text-[14px] mt-5">
                        We respect your time. No pressure, just a conversation.
                      </p>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center text-center py-8">
                  <AnimatedCheckmark size={80} />

                  <h3 className="text-[28px] font-bold text-white mt-6 mb-2">
                    Request Received! 🎉
                  </h3>
                  <p className="text-[#9CA3AF] text-[16px] max-w-sm mb-8">
                    One last step — send your details to the studio via WhatsApp for an instant response.
                  </p>

                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold text-[17px] py-4 rounded-xl transition-colors shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Open WhatsApp & Send
                  </button>

                  <button
                    onClick={handleCopy}
                    className="mt-6 text-[#9CA3AF] hover:text-white flex items-center gap-1.5 transition-colors text-[15px]"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy message instead"}
                  </button>

                  <button
                    onClick={handleClose}
                    className="mt-8 text-[#6B7280] underline hover:text-[#9CA3AF] transition-colors text-[15px]"
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
