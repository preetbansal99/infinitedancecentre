"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { AdminPINGate } from "@/components/admin/AdminPINGate";
import { AdminStats } from "@/components/admin/AdminStats";
import { LeadsList } from "@/components/admin/LeadsList";
import { StudentRoster } from "@/components/admin/StudentRoster";
import { BatchManager } from "@/components/admin/BatchManager";
import { InfiniteLogoSVG } from "@/components/logo/InfiniteLogoSVG";
import { useBookingStore } from "@/hooks/useBookingStore";
import { 
  LayoutDashboard, UserPlus, Users, Calendar, 
  ArrowLeft, LogOut, Ticket, Menu, X, 
  CheckSquare, IndianRupee, UserCheck
} from "lucide-react";

// TABS DEFINITION
const TABS = [
  { id: "dashboard", label: "Dashboard",   icon: LayoutDashboard, disabled: false },
  { id: "leads",     label: "Free Trials", icon: Ticket, disabled: false },
  { id: "students",  label: "Students",    icon: Users, disabled: false },
  { id: "batches",   label: "Batches",     icon: Calendar, disabled: false },
  { id: "attendance",label: "Attendance",  icon: CheckSquare, disabled: true },
  { id: "expenses",  label: "Expenses",    icon: IndianRupee, disabled: true },
  { id: "staff",     label: "Staff",       icon: UserCheck, disabled: true },
] as const;

type TabId = typeof TABS[number]["id"];

// Quick Actions Component
const QuickActions = ({ setActiveTab }: { setActiveTab: (t: TabId) => void }) => {
  return (
    <div className="mb-8">
      <h2 className="text-body-sm tracking-[0.2em] text-text-muted uppercase font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <button onClick={() => setActiveTab("students")} className="bg-surface-el hover:bg-white/5 transition p-4 rounded-xl flex flex-col items-center justify-center gap-3 text-text-primary text-body-sm font-medium border border-white/5">
          <UserPlus className="w-6 h-6 text-accent-blue" />
          <span>Add Student</span>
        </button>
        <button onClick={() => setActiveTab("batches")} className="bg-surface-el hover:bg-white/5 transition p-4 rounded-xl flex flex-col items-center justify-center gap-3 text-text-primary text-body-sm font-medium border border-white/5">
          <Calendar className="w-6 h-6 text-accent-light" />
          <span>New Batch</span>
        </button>
        <button disabled className="bg-surface-el transition p-4 rounded-xl flex flex-col items-center justify-center gap-3 text-text-muted text-body-sm font-medium border border-white/5 opacity-50 cursor-not-allowed">
          <CheckSquare className="w-6 h-6" />
          <span>Mark Attendance</span>
        </button>
        <button disabled className="bg-surface-el transition p-4 rounded-xl flex flex-col items-center justify-center gap-3 text-text-muted text-body-sm font-medium border border-white/5 opacity-50 cursor-not-allowed">
          <IndianRupee className="w-6 h-6" />
          <span>Log Expense</span>
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

  const handleTabChange = (tabId: TabId, disabled: boolean) => {
    if (disabled) return;
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <InfiniteLogoSVG size="header" showWordmark={false} />
        <span className="text-heading-sm font-bold text-text-primary tracking-wide">Admin</span>
      </div>
      
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-3 text-[10px] tracking-widest text-text-muted uppercase font-bold mb-3">Management</p>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id, tab.disabled)}
            disabled={tab.disabled}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-body-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-accent-purple/15 text-accent-light shadow-[inset_2px_0_0_0_rgba(167,139,250,1)]"
                : tab.disabled 
                  ? "opacity-40 cursor-not-allowed text-text-muted" 
                  : "text-text-muted hover:text-text-secondary hover:bg-white/5"
            }`}
          >
            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-accent-light' : ''}`} />
            {tab.label}
            {tab.disabled && <span className="ml-auto text-[9px] font-bold bg-white/10 px-1.5 py-0.5 rounded text-text-muted">SOON</span>}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 space-y-2">
        <Link href="/" className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-body-sm font-medium text-text-muted hover:text-text-secondary hover:bg-white/5 transition-all">
          <ArrowLeft className="w-5 h-5" />
          Back to Site
        </Link>
        <button
          onClick={() => setAdminAuthenticated(false)}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-body-sm font-medium text-text-muted hover:text-error hover:bg-error/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg flex overflow-hidden">
      {/* Mobile Header & Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface border-b border-white/5 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <InfiniteLogoSVG size="header" showWordmark={false} />
          <span className="font-bold text-text-primary tracking-wide">Admin Portal</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-text-muted hover:text-white transition-colors">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-bg md:hidden pt-16 shadow-2xl"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen fixed top-0 left-0 bg-surface border-r border-white/5 z-40">
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
                <header className="mb-8">
                  <h1 className="text-display-md font-bold text-text-primary mb-2">Dashboard</h1>
                  <p className="text-body text-text-secondary">Welcome back. Here&apos;s the latest at Infinite Dance Centre.</p>
                </header>
                
                <AdminStats />
                <QuickActions setActiveTab={setActiveTab} />
                
                <div className="mt-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-body-sm tracking-[0.2em] text-text-muted uppercase font-semibold">Recent Free Trials</h2>
                    <button onClick={() => setActiveTab('leads')} className="text-accent-light text-body-sm font-medium hover:underline">View All Leads</button>
                  </div>
                  <LeadsList />
                </div>
              </div>
            )}

            {activeTab === "leads" && (
              <div>
                <header className="mb-8">
                  <h1 className="text-display-md font-bold text-text-primary mb-2">Free Trial Management</h1>
                  <p className="text-body text-text-secondary">Track, contact, and convert your free trial leads.</p>
                </header>
                <LeadsList />
              </div>
            )}

            {activeTab === "students" && (
              <div>
                <header className="mb-8">
                  <h1 className="text-display-md font-bold text-text-primary mb-2">Student Roster</h1>
                  <p className="text-body text-text-secondary">Manage enrollments, update fee statuses, and view details.</p>
                </header>
                <StudentRoster />
              </div>
            )}

            {activeTab === "batches" && (
              <div>
                <header className="mb-8">
                  <h1 className="text-display-md font-bold text-text-primary mb-2">Batch Manager</h1>
                  <p className="text-body text-text-secondary">Create and monitor class schedules and capacities.</p>
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
