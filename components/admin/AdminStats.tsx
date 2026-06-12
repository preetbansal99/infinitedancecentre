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
    { label: "Total Students",    value: totalStudents, icon: Users,         color: "text-cyan-400",  bg: "bg-cyan-400/10" },
    { label: "Overdue Fees",      value: overdueCount,  icon: AlertTriangle, color: "text-red-400",  bg: "bg-red-400/10" },
    { label: "New Leads",         value: newLeadsCount,  icon: UserCheck,     color: "text-fuchsia-400",  bg: "bg-fuchsia-400/10" },
    { label: "Avg. Occupancy",    value: `${avgOccupancy}%`, icon: TrendingUp, color: "text-green-400", bg: "bg-green-400/10" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-surface border border-white/5 rounded-2xl p-6 transition-all hover:bg-surface-light group relative overflow-hidden">
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-xs text-text-secondary uppercase tracking-widest font-sans font-medium">{stat.label}</p>
          </div>
          <p className="text-3xl font-bold text-white tracking-tight font-sans pl-1 relative z-10">{stat.value}</p>
          
          <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.bg} opacity-5 rounded-full blur-2xl group-hover:opacity-20 transition-opacity pointer-events-none`} />
        </div>
      ))}
    </div>
  );
}
