"use client";
import { useState, useEffect, useRef } from "react";
import { motion, MotionValue, AnimatePresence } from "framer-motion";

export function ImpactRing({
  progress,
  triggerAt,
}: { progress: MotionValue<number>; triggerAt: number }) {
  const [visible, setVisible] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    const unsub = progress.on("change", (v) => {
      if (v >= triggerAt && !triggered.current) {
        triggered.current = true;
        setVisible(true);
        setTimeout(() => setVisible(false), 600);
      }
      if (v < triggerAt - 0.05) triggered.current = false;
    });
    return unsub;
  }, [progress, triggerAt]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute pointer-events-none z-[25]"
          style={{ left: "43%", top: "48%", transform: "translate(-50%, -50%)" }}
          initial={{ scale: 0, opacity: 0.9 }}
          animate={{ scale: 4, opacity: 0 }}
          exit={{}}
          transition={{ duration: 0.5, ease: [0.0, 0.6, 0.4, 1.0] }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "3px solid rgba(225,29,72,0.8)",
              boxShadow: "0 0 20px rgba(225,29,72,0.6), inset 0 0 20px rgba(225,29,72,0.3)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
