import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal — Infinite Dance Centre",
  description: "Manage students, leads, batches, and fees for Infinite Dance Centre.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
