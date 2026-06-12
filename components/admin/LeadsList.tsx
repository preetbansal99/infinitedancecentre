"use client";

import { useState } from "react";
import { useBookingStore } from "@/hooks/useBookingStore";
import { StatusPill } from "@/components/shared/StatusPill";
import { DetailDrawer } from "@/components/shared/DetailDrawer";
import { EmptyState } from "@/components/shared/EmptyState";
import { relativeTime } from "@/lib/formatters";
import { Search, UserPlus, MessageCircle, Phone, StickyNote, ChevronRight, Download } from "lucide-react";
import type { Lead } from "@/types";

export function LeadsList() {
  const { leads, updateLeadStatus, updateLeadNote, updateLead, showToast } = useBookingStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});
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

  const handleEditToggle = () => {
    if (isEditing) {
      if (selectedLead) {
        updateLead(selectedLead.id, editForm);
        showToast({ message: "Lead updated successfully", type: "success" });
        setSelectedLead({ ...selectedLead, ...editForm } as Lead);
      }
      setIsEditing(false);
    } else {
      if (selectedLead) {
        setEditForm(selectedLead);
        setIsEditing(true);
      }
    }
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="search"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-full pl-11 pr-4 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors placeholder:text-text-muted outline-none"
            />
          </div>
          <button onClick={exportToCSV} className="flex items-center gap-2 px-5 py-2.5 bg-surface hover:bg-surface-light border border-white/10 rounded-full text-white text-sm font-medium transition-colors shadow-lg">
            <Download className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all border rounded-full ${
                filterStatus === s
                  ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                  : "bg-surface border-white/10 text-text-secondary hover:text-white hover:bg-white/5"
              }`}
            >
              {s}
              {s !== "All" && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-black/30 text-[10px] opacity-80">
                  {leads.filter((l) => l.status === s).length}
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
              className={`bg-surface border p-5 cursor-pointer hover:bg-surface-light transition-all rounded-2xl shadow-sm ${
                lead.status === "New" ? "border-cyan-500/30" : "border-white/10"
              }`}
              onClick={() => {
                setSelectedLead(lead);
                setNote(lead.ownerNote || "");
                setIsEditing(false);
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-white tracking-wide">{lead.fullName}</p>
                  <StatusPill status={lead.status} />
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted" />
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-text-secondary mt-1 font-mono">
                <span className="bg-white/5 px-2 py-1 rounded-md">{lead.course}</span>
                <span className="bg-white/5 px-2 py-1 rounded-md">{lead.type}{lead.age ? `, ${lead.age}yrs` : ""}</span>
                <span className="px-2 py-1">{relativeTime(lead.submittedAt)}</span>
              </div>
              {lead.note && (
                <p className="text-sm text-text-muted mt-3 border-l-2 border-cyan-500/50 pl-3">
                  {lead.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lead Detail Drawer */}
      <DetailDrawer
        open={!!selectedLead}
        onClose={() => { setSelectedLead(null); setIsEditing(false); }}
        title={isEditing ? "Edit Lead" : "Lead Details"}
      >
        {selectedLead && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {isEditing ? (
                  <input 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xl font-bold text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 mb-3"
                    value={editForm.fullName || ""}
                    onChange={e => setEditForm({...editForm, fullName: e.target.value})}
                  />
                ) : (
                  <>
                    <p className="text-2xl font-bold text-white tracking-wide">{selectedLead.fullName}</p>
                    <div className="mt-3">
                      <StatusPill status={selectedLead.status} />
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button 
                  onClick={handleEditToggle} 
                  className={`px-4 py-2 border rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm ${
                    isEditing ? "bg-cyan-500 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]" : "bg-surface border-white/10 text-text-secondary hover:text-white hover:border-white/30"
                  }`}
                >
                  {isEditing ? "Save" : "Edit"}
                </button>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4 font-mono text-sm border-t border-b border-white/10 py-5">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Mobile</label>
                  <input 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                    value={editForm.phone || ""}
                    onChange={e => setEditForm({...editForm, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Course</label>
                  <input 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                    value={editForm.course || ""}
                    onChange={e => setEditForm({...editForm, course: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Batch/Time</label>
                  <input 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                    value={editForm.batch || ""}
                    onChange={e => setEditForm({...editForm, batch: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Type</label>
                    <select 
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors appearance-none"
                      value={editForm.type || "Self"}
                      onChange={e => setEditForm({...editForm, type: e.target.value as "Self" | "Child"})}
                    >
                      <option value="Self">Self</option>
                      <option value="Child">Child</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Age (optional)</label>
                    <input 
                      type="number"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                      value={editForm.age || ""}
                      onChange={e => setEditForm({...editForm, age: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 font-mono text-sm border-t border-b border-white/10 py-5">
                <div className="flex items-center gap-3 text-white bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="font-semibold tracking-wider">{selectedLead.phone}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Course</p>
                    <p className="text-white font-medium">{selectedLead.course}</p>
                  </div>
                  <div className="bg-surface p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Batch</p>
                    <p className="text-white font-medium">{selectedLead.batch}</p>
                  </div>
                  <div className="bg-surface p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Type</p>
                    <p className="text-white font-medium">{selectedLead.type}</p>
                  </div>
                  {selectedLead.age && (
                    <div className="bg-surface p-3 rounded-xl border border-white/5">
                      <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Age</p>
                      <p className="text-white font-medium">{selectedLead.age} yrs</p>
                    </div>
                  )}
                </div>

                {selectedLead.note && (
                  <div className="bg-surface p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2">Student Note</p>
                    <p className="text-text-secondary leading-relaxed font-sans">{selectedLead.note}</p>
                  </div>
                )}
                
                <p className="text-xs text-text-muted text-center pt-2">
                  Submitted: {relativeTime(selectedLead.submittedAt)}
                </p>
              </div>
            )}

            {!isEditing && (
              <>
                <div>
                  <p className="text-xs uppercase tracking-widest text-text-muted mb-3 font-bold">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {(["New", "Contacted", "Joined", "Declined"] as Lead["status"][]).map((s) => (
                      <button
                        key={s}
                        className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                          selectedLead.status === s
                            ? "bg-cyan-500 text-white border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                            : "bg-surface border-white/10 text-text-secondary hover:text-white hover:border-white/30"
                        }`}
                        onClick={() => {
                          handleStatusChange(selectedLead.id, s);
                          setSelectedLead({ ...selectedLead, status: s });
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-text-muted mb-3 font-bold">Internal Note</p>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 min-h-[100px] resize-none mb-3"
                    placeholder="Add private notes about this lead..."
                  />
                  <button
                    onClick={handleSaveNote}
                    className="w-full py-3 bg-surface hover:bg-surface-light text-white text-sm font-medium border border-white/10 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <StickyNote className="w-4 h-4" />
                    Save Note
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleWhatsApp(selectedLead.phone)}
                    className="w-full py-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-sm font-bold tracking-wide rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,211,102,0.1)]"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Message on WhatsApp
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </DetailDrawer>
    </>
  );
}
