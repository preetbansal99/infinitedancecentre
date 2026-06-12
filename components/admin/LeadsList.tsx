"use client";

import { useState } from "react";
import { useBookingStore } from "@/hooks/useBookingStore";
import { StatusPill } from "@/components/shared/StatusPill";
import { DetailDrawer } from "@/components/shared/DetailDrawer";
import { EmptyState } from "@/components/shared/EmptyState";
import { ClayButton } from "@/components/shared/ClayButton";
import { relativeTime } from "@/lib/formatters";
import { Search, UserPlus, MessageCircle, Phone, StickyNote, ChevronRight, Download } from "lucide-react";
import type { Lead } from "@/types";

export function LeadsList() {
  const { leads, updateLeadStatus, updateLeadNote, showToast } = useBookingStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [note, setNote] = useState("");

  const statuses = ["All", "New", "Contacted", "Joined", "Declined"];

  const filtered = leads.filter((l) => {
    const matchesSearch = l.fullName.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      l.course.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || l.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, status: Lead["status"]) => {
    updateLeadStatus(id, status);
    showToast({ message: `Lead status updated to ${status}`, type: "success" });
  };

  const handleSaveNote = () => {
    if (selectedLead) {
      updateLeadNote(selectedLead.id, note);
      showToast({ message: "Note saved", type: "success" });
    }
  };

  const handleWhatsApp = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${cleaned}`, "_blank");
  };

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Course", "Batch", "Submitted Date", "Status", "Phone", "Type", "Note"];
    const rows = filtered.map(l => [
      l.id, `"${l.fullName}"`, `"${l.course}"`, `"${l.batch}"`,
      l.submittedAt, l.status, `"${l.phone}"`, l.type, `"${(l.note || "").replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="search"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-el border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
            />
          </div>
          <ClayButton variant="outline" onClick={exportToCSV}>
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </ClayButton>
        </div>

        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-full text-caption font-semibold transition-all ${
                filterStatus === s
                  ? "bg-white text-bg"
                  : "bg-surface-el border border-white/5 text-text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              {s}
              {s !== "All" && (
                <span className="ml-1 text-caption opacity-60">
                  ({leads.filter((l) => l.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={UserPlus} title="No leads found" description="Adjust your search or filter" />
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <div
              key={lead.id}
              className={`bg-surface-el border rounded-xl p-4 cursor-pointer hover:bg-white/[0.02] transition-colors ${
                lead.status === "New" ? "border-cta-magenta/30 shadow-[0_0_15px_rgba(225,29,72,0.1)]" : "border-white/5"
              }`}
              onClick={() => {
                setSelectedLead(lead);
                setNote(lead.ownerNote || "");
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="text-body-sm font-semibold text-text-primary">{lead.fullName}</p>
                  <StatusPill status={lead.status} />
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted" />
              </div>
              <div className="flex flex-wrap gap-3 text-caption text-text-muted">
                <span>{lead.course}</span>
                <span>•</span>
                <span>{lead.type}{lead.age ? `, ${lead.age}yrs` : ""}</span>
                <span>•</span>
                <span>{relativeTime(lead.submittedAt)}</span>
              </div>
              {lead.note && (
                <p className="text-caption text-text-secondary mt-2 truncate">
                  📝 {lead.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lead Detail Drawer */}
      <DetailDrawer
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title="Lead Details"
      >
        {selectedLead && (
          <div className="space-y-5">
            <div>
              <p className="text-heading font-bold text-text-primary">{selectedLead.fullName}</p>
              <div className="mt-2">
                <StatusPill status={selectedLead.status} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-body-sm text-text-secondary">
                <Phone className="w-4 h-4 text-accent-blue" />
                <span>{selectedLead.phone}</span>
              </div>
              <p className="text-body-sm text-text-secondary">
                <strong className="text-text-primary">Course:</strong> {selectedLead.course}
              </p>
              <p className="text-body-sm text-text-secondary">
                <strong className="text-text-primary">Batch:</strong> {selectedLead.batch}
              </p>
              <p className="text-body-sm text-text-secondary">
                <strong className="text-text-primary">Type:</strong> {selectedLead.type}
                {selectedLead.age ? ` — Age ${selectedLead.age}` : ""}
              </p>
              {selectedLead.note && (
                <p className="text-body-sm text-text-secondary">
                  <strong className="text-text-primary">Student Note:</strong> {selectedLead.note}
                </p>
              )}
              <p className="text-caption text-text-muted">
                Submitted: {relativeTime(selectedLead.submittedAt)}
              </p>
            </div>

            {/* Status Actions */}
            <div>
              <p className="text-caption text-text-muted mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {(["New", "Contacted", "Joined", "Declined"] as Lead["status"][]).map((s) => (
                  <ClayButton
                    key={s}
                    variant={selectedLead.status === s ? "primary" : "outline"}
                    size="sm"
                    onClick={() => {
                      handleStatusChange(selectedLead.id, s);
                      setSelectedLead({ ...selectedLead, status: s });
                    }}
                  >
                    {s}
                  </ClayButton>
                ))}
              </div>
            </div>

            {/* Owner Note */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <StickyNote className="w-4 h-4 text-accent-light" />
                <p className="text-caption text-text-muted">Owner Note</p>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none resize-none"
                placeholder="Add a private note..."
              />
              <ClayButton variant="outline" size="sm" onClick={handleSaveNote} className="mt-2">
                Save Note
              </ClayButton>
            </div>

            {/* WhatsApp */}
            <ClayButton
              variant="whatsapp"
              fullWidth
              onClick={() => handleWhatsApp(selectedLead.phone)}
            >
              <MessageCircle className="w-5 h-5" />
              Message on WhatsApp
            </ClayButton>
          </div>
        )}
      </DetailDrawer>
    </>
  );
}
