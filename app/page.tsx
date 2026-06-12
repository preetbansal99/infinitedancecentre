"use client";

import { CinematicHero } from "@/components/hero/CinematicHero";
import { CoursesSection } from "@/components/sections/CoursesSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { BookingSheet } from "@/components/booking/BookingSheet";
import { Footer } from "@/components/layout/Footer";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { useBookingStore } from "@/hooks/useBookingStore";
import { useEffect } from "react";

export default function HomePage() {
  const { isSiteRevealed, setSiteRevealed, pendingScrollId, setPendingScrollId } = useBookingStore();

  useEffect(() => {
    if (isSiteRevealed) {
      // Force scroll to top instantly to handle the massive height reduction safely
      window.scrollTo(0, 0);

      if (pendingScrollId) {
        // Wait for DOM to paint the new sections
        setTimeout(() => {
          const el = document.getElementById(pendingScrollId);
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 80; // 80px offset for the sticky header
            window.scrollTo({ top: y, behavior: "smooth" });
          }
          setPendingScrollId(null);
        }, 150);
      }
    }
  }, [isSiteRevealed, pendingScrollId, setPendingScrollId]);

  return (
    <>
      <StickyHeader />
      
      {/* Phase 1–5: Cinematic Scroll Hero */}
      {!isSiteRevealed && (
        <CinematicHero onExplore={() => setSiteRevealed(true)} />
      )}

      {/* Public Sections */}
      {isSiteRevealed && (
        <main className="pt-24 min-h-screen">
          <CoursesSection />
          <GallerySection />
          <ReviewsSection />
          <AboutSection />
          <LocationSection />

          {/* Footer */}
          <Footer />
        </main>
      )}

      {/* Global Booking Sheet (triggered from anywhere) */}
      <BookingSheet />
    </>
  );
}
