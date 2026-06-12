"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useBookingStore } from "@/hooks/useBookingStore";
import { ClayButton } from "@/components/shared/ClayButton";
import { GlassCard } from "@/components/shared/GlassCard";
import { Lock, Eye, EyeOff } from "lucide-react";

const ADMIN_PIN = "1234";

export function AdminPINGate({ children }: { children: React.ReactNode }) {
  const { adminAuthenticated, setAdminAuthenticated } = useBookingStore();
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState(false);

  if (adminAuthenticated) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setAdminAuthenticated(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
      setPin("");
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <GlassCard radius="xl" className="p-8 w-full max-w-sm">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-accent-purple/10 flex items-center justify-center mb-4">
              <Lock className="w-7 h-7 text-accent-light" />
            </div>
            <h1 className="text-heading font-bold text-text-primary mb-1">Admin Portal</h1>
            <p className="text-body-sm text-text-secondary">Enter the 4-digit PIN to access</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <input
                type={showPin ? "text" : "password"}
                maxLength={4}
                inputMode="numeric"
                pattern="\d{4}"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className={`w-full bg-surface-el border rounded-lg px-4 py-3 text-center text-heading tracking-[0.5em] font-mono text-text-primary focus:outline-none transition-colors ${
                  error ? "border-error animate-[screenShake_0.35s_ease]" : "border-white/10 focus:border-accent-purple/50"
                }`}
                placeholder="• • • •"
                autoFocus
                aria-label="Admin PIN"
                aria-invalid={error}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                aria-label={showPin ? "Hide PIN" : "Show PIN"}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-caption text-error text-center mb-3" role="alert">
                Incorrect PIN. Try again.
              </p>
            )}

            <ClayButton variant="primary" fullWidth type="submit" disabled={pin.length < 4}>
              Unlock
            </ClayButton>
          </form>

          <p className="text-caption text-text-muted text-center mt-4">
            Default PIN: <span className="font-mono text-text-secondary">1234</span>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
