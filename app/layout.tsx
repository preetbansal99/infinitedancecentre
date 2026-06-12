import type { Metadata, Viewport } from "next";
import "./globals.css";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { ZustandProvider } from "@/hooks/useBookingStore";
import { ToastContainer } from "@/components/shared/Toast";

export const metadata: Metadata = {
  title: "Infinite Dance Centre — Zumba, Hip-Hop, Kathak & Gymnastics in Yamuna Vihar",
  description:
    "Book a free trial for professional dance and fitness classes in Yamuna Vihar, Delhi. Zumba, Hip-Hop, Kathak, and Kids Gymnastics for all ages.",
  keywords:
    "dance classes yamuna vihar, zumba classes delhi, hip hop dance classes, kathak classes, kids gymnastics delhi",
  openGraph: {
    title: "Infinite Dance Centre",
    description: "Dance. Express. Be Infinite. — Professional dance training in Yamuna Vihar, Delhi.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#1A1512",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg-site text-text-primary antialiased">
        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:bg-cta-magenta focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>

        <ZustandProvider>
          <main id="main-content">{children}</main>
          <FloatingWhatsApp />
          <ToastContainer />
        </ZustandProvider>
      </body>
    </html>
  );
}
