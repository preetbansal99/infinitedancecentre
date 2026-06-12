"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useBookingStore } from "@/hooks/useBookingStore";
import { ClayButton } from "@/components/shared/ClayButton";
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
    <div className="min-h-screen bg-background relative flex items-center justify-center px-6 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="p-8 w-full bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 font-serif tracking-wide">Admin Portal</h1>
            <p className="text-sm text-text-secondary">Enter the 4-digit PIN to access</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative mb-6">
              <input
                type={showPin ? "text" : "password"}
                maxLength={4}
                inputMode="numeric"
                pattern="\d{4}"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className={`w-full bg-black/50 border px-4 py-4 text-center text-3xl tracking-[0.5em] font-mono text-white rounded-xl focus:outline-none transition-all shadow-inner ${
                  error ? "border-red-500/50 focus:ring-1 focus:ring-red-500" : "border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                }`}
                placeholder="••••"
                autoFocus
                aria-label="Admin PIN"
                aria-invalid={error}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                aria-label={showPin ? "Hide PIN" : "Show PIN"}
              >
                {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 text-center mb-4 font-medium" role="alert">
                Incorrect PIN. Try again.
              </p>
            )}

            <button
              type="submit"
              disabled={pin.length < 4}
              className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-400 hover:to-fuchsia-400 text-white py-3.5 rounded-xl text-sm font-bold tracking-wide disabled:opacity-50 transition-all shadow-lg"
            >
              Unlock Dashboard
            </button>
          </form>

          <p className="text-xs text-text-muted text-center mt-6">
            Default PIN: <span className="font-mono text-white/70">1234</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
