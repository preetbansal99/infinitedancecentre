"use client";

import { useBookingStore } from "@/hooks/useBookingStore";
import { Users, UserCheck, AlertTriangle, TrendingUp } from "lucide-react";

export function AdminStats() {
  const { students, leads, batches } = useBookingStore();

  const totalStudents = students.length;
  const overdueCount = students.filter((s) => s.feeStatus === "Overdue").length;
  const newLeadsCount = leads.filter((l) => l.status === "New").length;
  const avgOccupancy = batches.length > 0
    ? Math.round(batches.reduce((acc, b) => acc + (b.enrolled / b.capacity) * 100, 0) / batches.length)
    : 0;

  const stats = [
    { label: "Total Students",    value: totalStudents, icon: Users,         color: "text-accent-blue",  bg: "bg-accent-blue/10" },
    { label: "Overdue Fees",      value: overdueCount,  icon: AlertTriangle, color: "text-error",        bg: "bg-error/10" },
    { label: "New Leads",         value: newLeadsCount,  icon: UserCheck,     color: "text-cta-magenta",  bg: "bg-cta-magenta/10" },
    { label: "Avg. Occupancy",    value: `${avgOccupancy}%`, icon: TrendingUp, color: "text-success",     bg: "bg-success/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-surface-el border border-white/5 rounded-2xl p-5 text-center transition-all hover:bg-white/[0.02]">
          <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center mx-auto mb-3`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <p className="text-heading font-bold text-text-primary tracking-tight">{stat.value}</p>
          <p className="text-caption text-text-muted mt-1 uppercase tracking-wider">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
