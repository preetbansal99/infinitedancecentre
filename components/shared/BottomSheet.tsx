"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: string;
}

export function BottomSheet({ open, onClose, title, children, height = "85dvh" }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      sheetRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-modal bg-black/60 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={title ?? "Sheet dialog"}
            tabIndex={-1}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-modal glass-strong rounded-t-2xl flex flex-col",
              "md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-full md:max-w-lg md:rounded-xl md:bottom-auto md:top-1/2 md:-translate-y-1/2"
            )}
            style={{ maxHeight: height }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 32,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80) onClose();
            }}
          >
            <div className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing md:hidden" aria-hidden="true">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>
            {title && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                <h2 className="text-heading-sm font-semibold text-text-primary">{title}</h2>
                <button
                  onClick={onClose}
                  className="touch-target flex items-center justify-center text-text-muted hover:text-text-primary transition-colors rounded-full"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar px-5 py-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
