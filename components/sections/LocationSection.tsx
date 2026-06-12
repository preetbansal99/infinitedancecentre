"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import { ClayButton } from "@/components/shared/ClayButton";
import { MapPin, Phone, Clock, Navigation, Instagram } from "lucide-react";

const GOOGLE_MAPS_LINK = "https://www.google.com/maps/search/Infinite+Dance+Centre+Yamuna+Vihar+Delhi";

export function LocationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="location" className="py-12 md:py-20 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-caption tracking-[0.3em] text-accent-light uppercase font-semibold mb-3">
            FIND US
          </p>
          <h2 className="text-display-md font-bold text-text-primary mb-3">Location</h2>
          <p className="text-body text-text-secondary max-w-lg mx-auto">
            Visit our professional studio in the heart of Yamuna Vihar, Delhi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Map Embed */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard radius="lg" className="overflow-hidden h-80 md:h-full relative">
              <iframe
                src="https://maps.google.com/maps?q=Infinite+Dance+Centre,+Yamuna+Vihar,+Delhi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.95) contrast(0.9)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Infinite Dance Centre location on Google Maps"
                className="absolute inset-0"
              />
              <div className="absolute bottom-4 left-4 right-4">
                <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer">
                  <ClayButton variant="primary" size="sm">
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </ClayButton>
                </a>
              </div>
            </GlassCard>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <GlassCard radius="lg" className="p-6">
              <h3 className="text-heading-sm font-bold text-text-primary mb-4">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-purple/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-accent-light" />
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-text-primary">Address</p>
                    <p className="text-body-sm text-text-secondary">C-3/161, 162, Block C, Yamuna Vihar</p>
                    <p className="text-body-sm text-text-secondary">Delhi — 110053</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-accent-blue" />
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-text-primary">Phone</p>
                    <a href="tel:+919971231552" className="text-body-sm text-accent-blue hover:text-accent-light transition-colors">
                      +91 99712 31552
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-text-primary">Hours</p>
                    <p className="text-body-sm text-text-secondary">Mon – Sat: 6:00 AM – 10:00 PM</p>
                    <p className="text-body-sm text-text-secondary">Sunday: Closed</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cta-magenta/10 flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-5 h-5 text-cta-magenta" />
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-text-primary">Instagram</p>
                    <p className="text-body-sm text-accent-light">@infinitedancecentre</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer" className="block">
              <ClayButton variant="primary" fullWidth size="lg">
                <Navigation className="w-5 h-5" />
                Open in Google Maps
              </ClayButton>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
