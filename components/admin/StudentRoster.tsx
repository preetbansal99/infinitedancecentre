"use client";

import { useState } from "react";
import { useBookingStore } from "@/hooks/useBookingStore";
import { GlassCard } from "@/components/shared/GlassCard";
import { StatusPill } from "@/components/shared/StatusPill";
import { DetailDrawer } from "@/components/shared/DetailDrawer";
import { EmptyState } from "@/components/shared/EmptyState";
import { ClayButton } from "@/components/shared/ClayButton";
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="search"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-el border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
              />
            </div>
            <ClayButton variant="primary" onClick={() => setIsAdding(true)}>
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Add Student</span>
            </ClayButton>
            <ClayButton variant="outline" onClick={exportToCSV}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </ClayButton>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {feeStatuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilterFee(s)}
                className={`px-3 py-1.5 rounded-full text-caption font-medium transition-all ${
                  filterFee === s
                    ? "bg-accent-purple/20 text-accent-light border border-accent-purple/40"
                    : "glass text-text-muted hover:text-text-secondary"
                }`}
              >
                {s}
                {s !== "All" && (
                  <span className="ml-1 text-caption opacity-60">
                    ({students.filter((st) => st.feeStatus === s).length})
                  </span>
                )}
              </button>
            ))}
          </div>
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-surface-el border border-white/10 rounded-lg px-3 py-1.5 text-caption text-text-primary focus:border-accent-purple/50 focus:outline-none"
          >
            {sortOptions.map(opt => (
              <option key={opt} value={opt}>Sort: {opt}</option>
            ))}
          </select>
        </div>
      </div>

      {sortedAndFiltered.length === 0 ? (
        <EmptyState icon={Users} title="No students found" description="Adjust your search or filter" />
      ) : (
        <div className="space-y-3">
          {sortedAndFiltered.map((student) => (
            <GlassCard
              key={student.id}
              radius="md"
              danger={student.feeStatus === "Overdue"}
              className="p-4 cursor-pointer hover:border-white/15 transition-colors"
              onClick={() => setSelected(student)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="text-body-sm font-semibold text-text-primary">{student.fullName}</p>
                  <StatusPill status={student.feeStatus} />
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted" />
              </div>
              <div className="flex flex-wrap gap-3 text-caption text-text-muted">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {student.contact.mobile}
                </span>
                <span>•</span>
                <span>{student.course}</span>
                <span>•</span>
                <span>{student.timings}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <DetailDrawer
        open={!!selected}
        onClose={() => { setSelected(null); setIsEditing(false); }}
        title={isEditing ? "Edit Student" : "Student Profile"}
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {isEditing ? (
                  <input 
                    className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-heading-sm font-bold text-text-primary focus:border-accent-purple/50 focus:outline-none mb-2"
                    value={editForm.fullName || ""}
                    onChange={e => setEditForm({...editForm, fullName: e.target.value})}
                  />
                ) : (
                  <>
                    <p className="text-heading font-bold text-text-primary">{selected.fullName}</p>
                    <p className="text-caption text-text-muted font-mono mt-1">{selected.id}</p>
                  </>
                )}
                {!isEditing && (
                  <div className="mt-2">
                    <StatusPill status={selected.feeStatus} />
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                {isEditing && (
                  <button 
                    onClick={handleDelete}
                    className="px-3 py-1.5 rounded-lg text-body-sm font-medium transition-colors bg-error/10 text-error hover:bg-error/20"
                  >
                    Delete
                  </button>
                )}
                <button 
                  onClick={handleEditToggle} 
                  className={`px-3 py-1.5 rounded-lg text-body-sm font-medium transition-colors ${
                    isEditing ? "bg-accent-purple/20 text-accent-light" : "bg-white/5 text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {isEditing ? "Save" : "Edit"}
                </button>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-caption text-text-muted mb-1">Mobile</label>
                  <input 
                    className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                    value={editForm.contact?.mobile || ""}
                    onChange={e => setEditForm({...editForm, contact: { ...editForm.contact!, mobile: e.target.value }})}
                  />
                </div>
                <div>
                  <label className="block text-caption text-text-muted mb-1">Course</label>
                  <input 
                    className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                    value={editForm.course || ""}
                    onChange={e => setEditForm({...editForm, course: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-caption text-text-muted mb-1">Batch</label>
                  <input 
                    className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                    value={editForm.timings || ""}
                    onChange={e => setEditForm({...editForm, timings: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-caption text-text-muted mb-1">Address</label>
                  <input 
                    className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                    value={editForm.address || ""}
                    onChange={e => setEditForm({...editForm, address: e.target.value})}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-body-sm text-text-secondary">
                  <strong className="text-text-primary">Course:</strong> {selected.course}
                </p>
                <p className="text-body-sm text-text-secondary">
                  <strong className="text-text-primary">Batch:</strong> {selected.timings}
                </p>
                <p className="text-body-sm text-text-secondary">
                  <strong className="text-text-primary">Enrolled:</strong> {selected.enrolledDate}
                </p>
                <p className="text-body-sm text-text-secondary">
                  <strong className="text-text-primary">Type:</strong> {selected.type} — Age {selected.age}
                </p>

                <div className="flex items-center gap-2 text-body-sm text-text-secondary">
                  <Phone className="w-4 h-4 text-accent-blue" />
                  <span>{selected.contact.mobile}</span>
                </div>
                {selected.contact.email && (
                  <p className="text-body-sm text-text-secondary">
                    <strong className="text-text-primary">Email:</strong> {selected.contact.email}
                  </p>
                )}
                {selected.contact.instagram && (
                  <p className="text-body-sm text-text-secondary">
                    <strong className="text-text-primary">Instagram:</strong> {selected.contact.instagram}
                  </p>
                )}
                <div className="flex items-start gap-2 text-body-sm text-text-secondary">
                  <MapPin className="w-4 h-4 text-accent-light flex-shrink-0 mt-0.5" />
                  <span>{selected.address}</span>
                </div>

                {selected.guardianInfo && (
                  <GlassCard radius="sm" className="p-3 mt-3">
                    <p className="text-caption text-text-muted mb-1">Guardian Information</p>
                    <p className="text-body-sm text-text-primary">{selected.guardianInfo.name}</p>
                    <p className="text-caption text-text-secondary">{selected.guardianInfo.relation}</p>
                    {selected.guardianInfo.mobile && (
                      <p className="text-caption text-text-muted font-mono">{selected.guardianInfo.mobile}</p>
                    )}
                  </GlassCard>
                )}
              </div>
            )}

            {/* Fee Status Actions */}
            {!isEditing && (
              <>
                <div>
                  <p className="text-caption text-text-muted mb-2">Update Fee Status</p>
                  <div className="flex gap-2 flex-wrap">
                    {(["Paid", "Pending", "Overdue"] as Student["feeStatus"][]).map((s) => (
                      <ClayButton
                        key={s}
                        variant={selected.feeStatus === s ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handleFeeChange(selected.id, s)}
                      >
                        {s}
                      </ClayButton>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <ClayButton
                    variant="whatsapp"
                    fullWidth
                    onClick={() => handleWhatsApp(selected.contact.mobile)}
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </ClayButton>
                  <ClayButton
                    variant="outline"
                    fullWidth
                    onClick={() => handleFeeReminder(selected)}
                  >
                    Send Reminder
                  </ClayButton>
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
        <div className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-caption text-text-muted mb-1">Full Name</label>
              <input 
                className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                value={addForm.fullName || ""}
                onChange={e => setAddForm({...addForm, fullName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-caption text-text-muted mb-1">Mobile</label>
              <input 
                className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                value={addForm.contact?.mobile || ""}
                onChange={e => setAddForm({...addForm, contact: { ...addForm.contact!, mobile: e.target.value }})}
              />
            </div>
            <div>
              <label className="block text-caption text-text-muted mb-1">Course</label>
              <input 
                className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                value={addForm.course || ""}
                onChange={e => setAddForm({...addForm, course: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-caption text-text-muted mb-1">Batch</label>
              <input 
                className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                value={addForm.timings || ""}
                onChange={e => setAddForm({...addForm, timings: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-caption text-text-muted mb-1">Address</label>
              <input 
                className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                value={addForm.address || ""}
                onChange={e => setAddForm({...addForm, address: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <ClayButton variant="primary" fullWidth onClick={handleAdd}>
              Add Student
            </ClayButton>
          </div>
        </div>
      </DetailDrawer>
    </>
  );
}
