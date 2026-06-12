"use client";

import { ClayButton } from "@/components/shared/ClayButton";
import { AnimatedCheckmark } from "@/components/shared/AnimatedCheckmark";
import { MessageCircle, Copy } from "lucide-react";
import type { BookingFormData } from "@/types";
import { buildWhatsAppURL, copyMessageToClipboard } from "@/lib/whatsapp";
import { useState } from "react";

interface Step5Props {
  data: BookingFormData;
  onClose: () => void;
}

export function Step5WhatsApp({ data, onClose }: Step5Props) {
  const [copied, setCopied] = useState(false);

  const handleWhatsApp = () => {
    window.open(buildWhatsAppURL(data), "_blank");
  };

  const handleCopy = async () => {
    const ok = await copyMessageToClipboard(data);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center text-center py-4">
      <AnimatedCheckmark size={80} />

      <h3 className="text-heading font-bold text-text-primary mt-5 mb-2">
        Trial Registered! 🎉
      </h3>
      <p className="text-body-sm text-text-secondary max-w-xs mb-8">
        One last step — send your booking details to the studio via WhatsApp for instant confirmation.
      </p>

      <ClayButton
        variant="whatsapp"
        size="lg"
        fullWidth
        onClick={handleWhatsApp}
      >
        <MessageCircle className="w-5 h-5" />
        Open WhatsApp & Confirm
      </ClayButton>

      <button
        onClick={handleCopy}
        className="mt-3 text-body-sm text-text-muted hover:text-text-secondary flex items-center gap-1 transition-colors"
      >
        <Copy className="w-4 h-4" />
        {copied ? "Copied!" : "Copy message instead"}
      </button>

      <button
        onClick={onClose}
        className="mt-6 text-caption text-text-muted underline underline-offset-4 hover:text-text-secondary transition-colors"
      >
        Close
      </button>
    </div>
  );
}
