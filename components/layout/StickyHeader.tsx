"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { InfiniteLogoSVG } from "@/components/logo/InfiniteLogoSVG";
import { useBookingStore } from "@/hooks/useBookingStore";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#courses", label: "Courses" },
  { href: "#gallery", label: "Gallery" },
  { href: "#about", label: "About" },
];

export function StickyHeader() {
  const { openBookingModal, openEnquireModal, setSiteRevealed, setPendingScrollId } = useBookingStore();
  const { scrollY } = useScroll();
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(13,13,18,0)", "rgba(13,13,18,0.6)"]
  );
  const headerBorder = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.1)"]
  );

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4 pointer-events-none">
      <motion.header
        className="pointer-events-auto w-full max-w-6xl rounded-full backdrop-blur-xl transition-all duration-300"
        style={{
          backgroundColor: headerBg,
          border: useTransform(headerBorder, (v) => `1px solid ${v}`),
        }}
      >
        <div className="px-6 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2" 
            aria-label="Home"
            onClick={() => {
              setSiteRevealed(false);
              setMobileOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <InfiniteLogoSVG size="header" showWordmark={false} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  setPendingScrollId(link.href.substring(1));
                  setSiteRevealed(true);
                }}
                className="text-body-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/admin"
              className="text-body-sm text-text-muted hover:text-accent-light transition-colors"
            >
              Admin
            </Link>
            <motion.button
              onClick={() => openEnquireModal()}
              className="bg-surface text-text-primary border border-white/10 text-body-sm font-semibold px-4 py-2.5 rounded-lg hover:border-white/30"
              whileTap={{ scale: 0.97 }}
            >
              Enquire
            </motion.button>
            <motion.button
              onClick={() => openBookingModal()}
              className="bg-cta-magenta text-white text-body-sm font-semibold px-5 py-2.5 rounded-lg shadow-magenta"
              whileTap={{ scale: 0.97 }}
              whileHover={{ boxShadow: "0 0 30px rgba(225,29,72,0.5)" }}
            >
              Book Free Trial
            </motion.button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden touch-target flex items-center justify-center text-text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-bg-site/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 pt-16 pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Explicit Close Button for Mobile Menu */}
          <button 
            onClick={() => setMobileOpen(false)}
            className="absolute top-6 right-6 p-2 text-text-secondary hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-8 h-8" />
          </button>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                setMobileOpen(false);
                setPendingScrollId(link.href.substring(1));
                setSiteRevealed(true);
              }}
              className="text-heading font-semibold text-text-primary hover:text-accent-light transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="text-heading-sm text-text-muted hover:text-accent-light transition-colors"
          >
            Admin Portal
          </Link>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <motion.button
              onClick={() => { openEnquireModal(); setMobileOpen(false); }}
              className="border border-white/20 text-white font-semibold px-8 py-4 rounded-lg text-body-sm w-full"
              whileTap={{ scale: 0.97 }}
            >
              Send Enquiry
            </motion.button>
            <motion.button
              onClick={() => { openBookingModal(); setMobileOpen(false); }}
              className="bg-cta-magenta text-white font-semibold px-8 py-4 rounded-lg shadow-magenta text-body w-full"
              whileTap={{ scale: 0.97 }}
            >
              Book Free Trial
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
