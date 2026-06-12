"use client";

import { InfiniteLogoSVG } from "@/components/logo/InfiniteLogoSVG";
import { MapPin, Phone, Clock, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer role="contentinfo" className="bg-bg border-t border-white/5 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand Column */}
          <div className="flex flex-col items-center md:items-start">
            <InfiniteLogoSVG size="sm" className="mb-4" />
            <p className="text-caption text-text-muted text-center md:text-left max-w-xs">
              Professional dance and fitness training in the heart of Yamuna Vihar, Delhi.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <p className="text-body-sm font-semibold text-text-primary mb-1">Quick Links</p>
            <a href="#courses" className="text-caption text-text-secondary hover:text-accent-light transition-colors">Courses</a>
            <a href="#gallery" className="text-caption text-text-secondary hover:text-accent-light transition-colors">Gallery</a>
            <a href="#about" className="text-caption text-text-secondary hover:text-accent-light transition-colors">About Us</a>
            <a href="#location" className="text-caption text-text-secondary hover:text-accent-light transition-colors">Location</a>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <p className="text-body-sm font-semibold text-text-primary mb-1">Contact</p>
            <div className="flex items-center gap-2 text-caption text-text-secondary">
              <MapPin className="w-3.5 h-3.5 text-accent-light flex-shrink-0" />
              <span>C-3/161, 162, Yamuna Vihar, Delhi — 110053</span>
            </div>
            <div className="flex items-center gap-2 text-caption text-text-secondary">
              <Phone className="w-3.5 h-3.5 text-accent-light flex-shrink-0" />
              <a href="tel:+919971231552" className="hover:text-text-primary transition-colors">+91 99712 31552</a>
            </div>
            <div className="flex items-center gap-2 text-caption text-text-secondary">
              <Clock className="w-3.5 h-3.5 text-accent-light flex-shrink-0" />
              <span>Mon–Sat: 6 AM – 10 PM</span>
            </div>
            <div className="flex items-center gap-2 text-caption text-text-secondary">
              <Instagram className="w-3.5 h-3.5 text-accent-light flex-shrink-0" />
              <span>@infinitedancecentre</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-caption text-text-muted">
            © {new Date().getFullYear()} Infinite Dance Centre. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
