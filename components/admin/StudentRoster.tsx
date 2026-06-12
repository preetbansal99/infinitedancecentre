"use client";

import { useState } from "react";
import { useBookingStore } from "@/hooks/useBookingStore";
import { StatusPill } from "@/components/shared/StatusPill";
import { DetailDrawer } from "@/components/shared/DetailDrawer";
import { EmptyState } from "@/components/shared/EmptyState";
import { Search, Users, Phone, MapPin, MessageCircle, ChevronRight, Download } from "lucide-react";
import type { Student } from "@/types";

export function StudentRoster() {
  const { students, updateStudentFeeStatus, updateStudent, addStudent, deleteStudent, showToast } = useBookingStore();
  const [search, setSearch] = useState("");
  const [filterFee, setFilterFee] = useState<string>("All");
  const [sortOption, setSortOption] = useState<string>("Name");
  const [selected, setSelected] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Student>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Student>>({});

  const feeStatuses = ["All", "Paid", "Pending", "Overdue"];
  const sortOptions = ["Name", "Batch", "Fee Status", "Enrolled Date"];

  const filtered = students.filter((s) => {
    const matchesSearch = s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase());
    const matchesFee = filterFee === "All" || s.feeStatus === filterFee;
    return matchesSearch && matchesFee;
  });

  const sortedAndFiltered = [...filtered].sort((a, b) => {
    switch (sortOption) {
      case "Name":
        return a.fullName.localeCompare(b.fullName);
      case "Batch":
        return a.timings.localeCompare(b.timings);
      case "Fee Status":
        return a.feeStatus.localeCompare(b.feeStatus);
      case "Enrolled Date":
        return new Date(b.enrolledDate).getTime() - new Date(a.enrolledDate).getTime();
      default:
        return 0;
    }
  });

  const handleFeeChange = (id: string, status: Student["feeStatus"]) => {
    updateStudentFeeStatus(id, status);
    showToast({ message: `Fee status updated to ${status}`, type: "success" });
    if (selected) setSelected({ ...selected, feeStatus: status });
  };

  const handleFeeReminder = (student: Student) => {
    const amount = window.prompt("Enter the fee amount to be paid:");
    if (!amount) return;
    const msg = `Hello ${student.fullName}, this is a gentle reminder from Infinite Dance Centre to clear your pending fee of ₹${amount} for your ${student.course} class. Thank you!`;
    const cleaned = student.contact.mobile.replace(/\D/g, "");
    window.open(`https://wa.me/${cleaned}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleWhatsApp = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${cleaned}`, "_blank");
  };

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Course", "Batch", "Enrolled Date", "Fee Status", "Phone", "Type"];
    const rows = sortedAndFiltered.map(s => [
      s.id, `"${s.fullName}"`, `"${s.course}"`, `"${s.timings}"`,
      s.enrolledDate, s.feeStatus, `"${s.contact.mobile}"`, s.type
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      if (selected) {
        updateStudent(selected.id, editForm);
        showToast({ message: "Student updated successfully", type: "success" });
        setSelected({ ...selected, ...editForm } as Student);
      }
      setIsEditing(false);
    } else {
      if (selected) {
        setEditForm(selected);
        setIsEditing(true);
      }
    }
  };

  const handleDelete = () => {
    if (selected && window.confirm("Are you sure you want to delete this student?")) {
      deleteStudent(selected.id);
      showToast({ message: "Student deleted successfully", type: "success" });
      setSelected(null);
      setIsEditing(false);
    }
  };

  const handleAdd = () => {
    if (!addForm.fullName || !addForm.contact?.mobile) {
      showToast({ message: "Name and Mobile are required", type: "error" });
      return;
    }
    const newStudent: Student = {
      id: `STU${String(students.length + 1).padStart(3, "0")}`,
      fullName: addForm.fullName,
      course: addForm.course || "General",
      timings: addForm.timings || "Morning",
      feeStatus: "Pending",
      enrolledDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      contact: { mobile: addForm.contact.mobile },
      address: addForm.address || "",
      age: addForm.age || 0,
      monthlyFee: addForm.monthlyFee || 1500, // Default to 1500 if not specified
      type: "Regular",
      ...addForm
    } as Student;
    addStudent(newStudent);
    showToast({ message: "Student added successfully", type: "success" });
    setIsAdding(false);
    setAddForm({});
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
          <div className="flex gap-2 flex-1 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="search"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-full pl-11 pr-4 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors placeholder:text-text-muted outline-none"
            />
          </div>
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 border border-cyan-400 rounded-full text-white text-sm font-bold transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Add Student</span>
          </button>
          <button onClick={exportToCSV} className="flex items-center gap-2 px-5 py-2.5 bg-surface hover:bg-surface-light border border-white/10 rounded-full text-white text-sm font-medium transition-colors shadow-lg">
            <Download className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {feeStatuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilterFee(s)}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all border rounded-full ${
                  filterFee === s
                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
                    : "bg-surface border-white/10 text-text-secondary hover:text-white hover:bg-white/5"
                }`}
              >
                {s}
                {s !== "All" && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-black/30 text-[10px] opacity-80">
                    {students.filter((st) => st.feeStatus === s).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 appearance-none min-w-[120px]"
          >
            {sortOptions.map(opt => (
              <option key={opt} value={opt} className="bg-surface">Sort: {opt}</option>
            ))}
          </select>
        </div>
      </div>

      {sortedAndFiltered.length === 0 ? (
        <EmptyState icon={Users} title="No students found" description="Adjust your search or filter" />
      ) : (
        <div className="space-y-3">
          {sortedAndFiltered.map((student) => (
            <div
              key={student.id}
              className={`bg-surface border p-5 cursor-pointer hover:bg-surface-light transition-all rounded-2xl shadow-sm ${
                student.feeStatus === "Overdue" ? "border-red-500/30" : "border-white/10"
              }`}
              onClick={() => setSelected(student)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-white tracking-wide">{student.fullName}</p>
                  <StatusPill status={student.feeStatus} />
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted" />
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-text-secondary mt-1 font-mono">
                <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md text-white/90">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  {student.contact.mobile}
                </span>
                <span className="bg-white/5 px-2 py-1 rounded-md">{student.course}</span>
                <span className="bg-white/5 px-2 py-1 rounded-md">{student.timings}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <DetailDrawer
        open={!!selected}
        onClose={() => { setSelected(null); setIsEditing(false); }}
        title={isEditing ? "Edit Student" : "Student Profile"}
      >
        {selected && (
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
                    <p className="text-2xl font-bold text-white tracking-wide">{selected.fullName}</p>
                    <p className="text-xs text-text-muted font-mono mt-1 bg-white/5 px-2 py-0.5 rounded-md inline-block">{selected.id}</p>
                  </>
                )}
                {!isEditing && (
                  <div className="mt-3">
                    <StatusPill status={selected.feeStatus} />
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                {isEditing && (
                  <button 
                    onClick={handleDelete}
                    className="px-4 py-2 border border-red-500/30 rounded-xl text-xs font-bold tracking-wide transition-colors text-red-400 hover:bg-red-500 hover:text-white shadow-sm"
                  >
                    Delete
                  </button>
                )}
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
              <div className="space-y-4 font-mono text-sm">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Mobile</label>
                  <input 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                    value={editForm.contact?.mobile || ""}
                    onChange={e => setEditForm({...editForm, contact: { ...editForm.contact!, mobile: e.target.value }})}
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
                  <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Monthly Fee (₹)</label>
                  <input 
                    type="number"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                    value={editForm.monthlyFee || ""}
                    onChange={e => setEditForm({...editForm, monthlyFee: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Batch</label>
                  <input 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                    value={editForm.timings || ""}
                    onChange={e => setEditForm({...editForm, timings: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Address</label>
                  <input 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                    value={editForm.address || ""}
                    onChange={e => setEditForm({...editForm, address: e.target.value})}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 font-mono text-sm border-t border-b border-white/10 py-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Course</p>
                    <p className="text-white font-medium">{selected.course}</p>
                  </div>
                  <div className="bg-surface p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Batch</p>
                    <p className="text-white font-medium">{selected.timings}</p>
                  </div>
                  <div className="bg-surface p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Enrolled</p>
                    <p className="text-white font-medium">{selected.enrolledDate}</p>
                  </div>
                  <div className="bg-surface p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Fee</p>
                    <p className="text-white font-medium">₹{selected.monthlyFee || 1500}/mo</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-white bg-white/5 p-3 rounded-xl border border-white/10 mt-2">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="font-semibold tracking-wider">{selected.contact.mobile}</span>
                </div>
                
                {selected.contact.email && (
                  <p className="text-text-secondary pl-2">
                    <strong className="text-white font-sans mr-2">Email:</strong> {selected.contact.email}
                  </p>
                )}
                {selected.contact.instagram && (
                  <p className="text-text-secondary pl-2">
                    <strong className="text-white font-sans mr-2">Instagram:</strong> {selected.contact.instagram}
                  </p>
                )}
                <div className="flex items-start gap-2 text-text-secondary pl-2 pt-2">
                  <MapPin className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                  <span>{selected.address}</span>
                </div>

                {selected.guardianInfo && (
                  <div className="bg-surface border border-white/10 rounded-xl p-4 mt-4">
                    <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-bold font-sans">Guardian Information</p>
                    <p className="text-sm font-bold text-white mb-1">{selected.guardianInfo.name}</p>
                    <p className="text-xs text-text-secondary mb-2">{selected.guardianInfo.relation}</p>
                    {selected.guardianInfo.mobile && (
                      <p className="text-xs text-white font-mono bg-black/30 px-2 py-1 rounded inline-block">{selected.guardianInfo.mobile}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Fee Status Actions */}
            {!isEditing && (
              <>
                <div>
                  <p className="text-xs uppercase tracking-widest text-text-muted mb-3 font-bold font-sans">Update Fee Status</p>
                  <div className="flex gap-2 flex-wrap">
                    {(["Paid", "Pending", "Overdue"] as Student["feeStatus"][]).map((s) => (
                      <button
                        key={s}
                        className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                          selected.feeStatus === s
                            ? s === "Paid" ? "bg-green-500 text-white border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                              : s === "Pending" ? "bg-amber-500 text-white border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                              : "bg-red-500 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                            : "bg-surface border-white/10 text-text-secondary hover:text-white hover:border-white/30"
                        }`}
                        onClick={() => handleFeeChange(selected.id, s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => handleWhatsApp(selected.contact.mobile)}
                    className="flex-1 py-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-sm font-bold tracking-wide rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,211,102,0.1)]"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => handleFeeReminder(selected)}
                    className="flex-1 py-4 bg-surface hover:bg-surface-light text-white text-sm font-bold tracking-wide border border-white/10 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    Send Reminder
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </DetailDrawer>

      {/* Add Student Drawer */}
      <DetailDrawer
        open={isAdding}
        onClose={() => setIsAdding(false)}
        title="Add New Student"
      >
        <div className="space-y-5 font-mono text-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Full Name</label>
              <input 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                value={addForm.fullName || ""}
                onChange={e => setAddForm({...addForm, fullName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Mobile</label>
              <input 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                value={addForm.contact?.mobile || ""}
                onChange={e => setAddForm({...addForm, contact: { ...addForm.contact!, mobile: e.target.value }})}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Course</label>
              <input 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                value={addForm.course || ""}
                onChange={e => setAddForm({...addForm, course: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Monthly Fee (₹)</label>
              <input 
                type="number"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                value={addForm.monthlyFee || ""}
                onChange={e => setAddForm({...addForm, monthlyFee: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Batch</label>
              <input 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                value={addForm.timings || ""}
                onChange={e => setAddForm({...addForm, timings: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Address</label>
              <input 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                value={addForm.address || ""}
                onChange={e => setAddForm({...addForm, address: e.target.value})}
              />
            </div>
          </div>
          
          <div className="pt-4 font-sans">
            <button onClick={handleAdd} className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-sm font-bold tracking-wide transition-colors shadow-lg">
              Add Student
            </button>
          </div>
        </div>
      </DetailDrawer>
    </>
  );
}
