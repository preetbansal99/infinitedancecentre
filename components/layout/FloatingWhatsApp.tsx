"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export function FloatingWhatsApp() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <motion.a
      href="https://wa.me/919971231552"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-fab w-14 h-14 bg-whatsapp rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" fill="white" />
    </motion.a>
  );
}
