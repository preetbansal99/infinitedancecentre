"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useBookingStore } from "@/hooks/useBookingStore";

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const COLORS = {
  success: "border-success/30 bg-success/10",
  error: "border-error/30 bg-error/10",
  info: "border-accent-blue/30 bg-accent-blue/10",
};

const ICON_COLORS = {
  success: "text-success",
  error: "text-error",
  info: "text-accent-blue",
};

export function ToastContainer() {
  const { toasts, dismissToast } = useBookingStore();

  return (
    <div className="fixed top-4 right-4 z-toast flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type];
          return (
            <motion.div
              key={toast.id}
              className={`pointer-events-auto glass-strong rounded-lg px-4 py-3 flex items-center gap-3 border ${COLORS[toast.type]}`}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${ICON_COLORS[toast.type]}`} />
              <p className="text-body-sm text-text-primary flex-1">{toast.message}</p>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-text-muted hover:text-text-primary"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
