"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { AdminPINGate } from "@/components/admin/AdminPINGate";
import { AdminStats } from "@/components/admin/AdminStats";
import { LeadsList } from "@/components/admin/LeadsList";
import { StudentRoster } from "@/components/admin/StudentRoster";
import { BatchManager } from "@/components/admin/BatchManager";

import { useBookingStore } from "@/hooks/useBookingStore";
import { 
  LayoutDashboard, UserPlus, Users, Calendar, 
  ArrowLeft, LogOut, Ticket, Menu, X, 
  CheckSquare, IndianRupee, UserCheck
} from "lucide-react";

const TABS = [
  { id: "dashboard", label: "Dashboard",   icon: LayoutDashboard },
  { id: "leads",     label: "Free Trials", icon: Ticket },
  { id: "students",  label: "Students",    icon: Users },
  { id: "batches",   label: "Batches",     icon: Calendar },
] as const;

type TabId = typeof TABS[number]["id"];

// Quick Actions Component
const QuickActions = ({ setActiveTab }: { setActiveTab: (t: TabId) => void }) => {
  return (
    <div className="mb-12">
      <h2 className="text-xs tracking-widest text-text-muted uppercase font-semibold mb-4 font-sans pl-1">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={() => setActiveTab("students")} className="bg-surface hover:bg-surface-light transition p-5 flex items-center gap-4 text-white text-sm font-medium border border-white/5 rounded-2xl hover:border-white/10 group">
          <div className="w-10 h-10 rounded-full bg-cyan-400/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UserPlus className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-base">Add New Student</span>
        </button>
        <button onClick={() => setActiveTab("batches")} className="bg-surface hover:bg-surface-light transition p-5 flex items-center gap-4 text-white text-sm font-medium border border-white/5 rounded-2xl hover:border-white/10 group">
          <div className="w-10 h-10 rounded-full bg-cyan-400/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-base">Create New Batch</span>
        </button>
      </div>
    </div>
  );
}

// Main Content
function AdminContent() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setAdminAuthenticated } = useBookingStore();

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-surface border-r border-white/10">
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <span className="text-xl font-bold text-white tracking-wide font-sans">Admin</span>
      </div>
      
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-3 text-[10px] tracking-widest text-text-muted uppercase font-bold mb-3 font-sans">Management</p>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-medium transition-all rounded-xl ${
              activeTab === tab.id
                ? "bg-white/10 text-white shadow-[inset_3px_0_0_0_rgba(255,255,255,1)]"
                : "text-text-secondary hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : ''}`} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-white/10 space-y-2">
        <Link href="/" className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-all rounded-lg">
          <ArrowLeft className="w-4 h-4" />
          Back to Site
        </Link>
        <button
          onClick={() => setAdminAuthenticated(false)}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex overflow-hidden font-sans text-white">
      {/* Mobile Header & Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface border-b border-white/10 z-50 flex items-center justify-between px-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white tracking-wide">Admin Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="p-2 text-text-secondary hover:text-white transition-colors flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-text-secondary hover:text-white transition-colors">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-background md:hidden pt-16 shadow-2xl"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen fixed top-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto md:ml-64 pt-20 md:pt-0">
        <div className="p-4 md:p-8 lg:p-10 max-w-6xl mx-auto pb-24">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "dashboard" && (
              <div>
                <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2 font-serif">Dashboard</h1>
                    <p className="text-base text-text-secondary">Welcome back. Here&apos;s the latest at Infinite Dance Centre.</p>
                  </div>
                  <Link href="/" className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-light border border-white/10 text-white rounded-xl text-sm font-medium transition-all shadow-sm w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Site
                  </Link>
                </header>
                
                <AdminStats />
                <QuickActions setActiveTab={setActiveTab} />
                
                <div className="mt-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs tracking-widest text-text-muted uppercase font-semibold">Recent Free Trials</h2>
                    <button onClick={() => setActiveTab('leads')} className="text-cyan-400 text-sm font-medium hover:underline">View All Leads</button>
                  </div>
                  <LeadsList />
                </div>
              </div>
            )}

            {activeTab === "leads" && (
              <div>
                <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2 font-serif">Free Trial Management</h1>
                    <p className="text-base text-text-secondary">Track, contact, and convert your free trial leads.</p>
                  </div>
                  <Link href="/" className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-light border border-white/10 text-white rounded-xl text-sm font-medium transition-all shadow-sm w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Site
                  </Link>
                </header>
                <LeadsList />
              </div>
            )}

            {activeTab === "students" && (
              <div>
                <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2 font-serif">Student Roster</h1>
                    <p className="text-base text-text-secondary">Manage enrollments, update fee statuses, and view details.</p>
                  </div>
                  <Link href="/" className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-light border border-white/10 text-white rounded-xl text-sm font-medium transition-all shadow-sm w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Site
                  </Link>
                </header>
                <StudentRoster />
              </div>
            )}

            {activeTab === "batches" && (
              <div>
                <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2 font-serif">Batch Manager</h1>
                    <p className="text-base text-text-secondary">Create and monitor class schedules and capacities.</p>
                  </div>
                  <Link href="/" className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-light border border-white/10 text-white rounded-xl text-sm font-medium transition-all shadow-sm w-fit">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Site
                  </Link>
                </header>
                <BatchManager />
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminPINGate>
      <AdminContent />
    </AdminPINGate>
  );
}
