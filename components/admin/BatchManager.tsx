import { useState } from "react";
import { useBookingStore } from "@/hooks/useBookingStore";
import { StatusPill } from "@/components/shared/StatusPill";
import { DetailDrawer } from "@/components/shared/DetailDrawer";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatTime } from "@/lib/formatters";
import { Clock, Users, Edit, Search, Calendar } from "lucide-react";
import type { Batch } from "@/types";

export function BatchManager() {
  const { batches, updateBatch, addBatch, deleteBatch, showToast } = useBookingStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [editForm, setEditForm] = useState<Partial<Batch>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Batch>>({
    name: "", course: "Zumba", status: "Active", startTime: "18:00", endTime: "19:00", capacity: 20, enrolled: 0, days: ["Mon", "Wed", "Fri"]
  });

  const statuses = ["All", "Active", "Filling", "Full", "Inactive"];

  const filtered = batches.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.course.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setEditForm(batch);
  };

  const handleSave = () => {
    if (editingBatch) {
      updateBatch(editingBatch.id, editForm);
      showToast({ message: "Batch updated successfully", type: "success" });
      setEditingBatch(null);
    }
  };

  const handleDelete = () => {
    if (editingBatch && window.confirm("Are you sure you want to delete this batch?")) {
      deleteBatch(editingBatch.id);
      showToast({ message: "Batch deleted successfully", type: "success" });
      setEditingBatch(null);
    }
  };

  const handleAdd = () => {
    const newBatch: Batch = {
      id: `B${String(batches.length + 1).padStart(2, "0")}`,
      name: addForm.name || "New Batch",
      course: addForm.course || "Zumba",
      status: addForm.status as Batch["status"] || "Active",
      startTime: addForm.startTime || "18:00",
      endTime: addForm.endTime || "19:00",
      capacity: addForm.capacity || 20,
      enrolled: addForm.enrolled || 0,
      days: addForm.days || ["Mon", "Wed", "Fri"]
    };
    addBatch(newBatch);
    showToast({ message: "Batch added successfully", type: "success" });
    setIsAdding(false);
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
                placeholder="Search batches..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-full pl-11 pr-4 py-2.5 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors placeholder:text-text-muted outline-none"
              />
            </div>
            <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 border border-cyan-400 rounded-full text-white text-sm font-bold transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Add Batch</span>
            </button>
          </div>
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
                  {batches.filter((b) => b.status === s).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Calendar} title="No batches found" description="Adjust your search or filter" />
      ) : (
        <div className="space-y-4">
          {filtered.map((batch) => {
            const fillPercent = Math.round((batch.enrolled / batch.capacity) * 100);

          return (
            <div key={batch.id} className="bg-surface border border-white/10 rounded-2xl p-5 hover:bg-surface-light transition-all shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-sm font-bold text-white tracking-wide">{batch.name}</p>
                    <StatusPill status={batch.status} />
                  </div>
                  <p className="text-xs text-text-secondary">{batch.course}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-text-muted font-mono bg-white/5 px-2 py-1 rounded-md">{batch.id}</span>
                  <button onClick={() => handleEdit(batch)} className="text-text-muted hover:text-white transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-xs font-mono text-text-secondary mb-4">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {formatTime(batch.startTime)} — {formatTime(batch.endTime)}
                </span>
                <span className="bg-white/5 px-2 py-0.5 rounded text-text-muted">{batch.days.join(", ")}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${fillPercent}%`,
                      background: fillPercent >= 90 ? "#ef4444" : fillPercent >= 70 ? "#f59e0b" : "#22c55e",
                    }}
                  />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white">
                  <Users className="w-3.5 h-3.5 text-text-muted" />
                  <span className="font-mono font-medium">{batch.enrolled}/{batch.capacity}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      <DetailDrawer
        open={!!editingBatch}
        onClose={() => setEditingBatch(null)}
        title="Edit Batch"
      >
        {editingBatch && (
          <div className="space-y-4 font-mono text-sm">
            <div>
              <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Batch Name</label>
              <input 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                value={editForm.name || ""}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Course</label>
              <input 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                value={editForm.course || ""}
                onChange={(e) => setEditForm({...editForm, course: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Status</label>
              <select 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors appearance-none"
                value={editForm.status || "Active"}
                onChange={(e) => setEditForm({...editForm, status: e.target.value as Batch["status"]})}
              >
                <option value="Active" className="bg-surface">Active</option>
                <option value="Filling" className="bg-surface">Filling</option>
                <option value="Full" className="bg-surface">Full</option>
                <option value="Inactive" className="bg-surface">Inactive</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Start Time</label>
                <input 
                  type="time"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                  value={editForm.startTime || ""}
                  onChange={(e) => setEditForm({...editForm, startTime: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">End Time</label>
                <input 
                  type="time"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                  value={editForm.endTime || ""}
                  onChange={(e) => setEditForm({...editForm, endTime: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Capacity</label>
                <input 
                  type="number"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                  value={editForm.capacity || 0}
                  onChange={(e) => setEditForm({...editForm, capacity: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Enrolled</label>
                <input 
                  type="number"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                  value={editForm.enrolled || 0}
                  onChange={(e) => setEditForm({...editForm, enrolled: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="pt-4 flex gap-3">
              <button onClick={handleSave} className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-sm font-bold tracking-wide transition-colors shadow-lg">
                Save Changes
              </button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-bold tracking-wide hover:bg-red-500 hover:text-white transition-colors">
                Delete
              </button>
            </div>
          </div>
        )}
      </DetailDrawer>

      <DetailDrawer
        open={isAdding}
        onClose={() => setIsAdding(false)}
        title="Add New Batch"
      >
        <div className="space-y-4 font-mono text-sm">
          <div>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Batch Name</label>
            <input 
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
              value={addForm.name || ""}
              onChange={(e) => setAddForm({...addForm, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Course</label>
            <input 
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
              value={addForm.course || ""}
              onChange={(e) => setAddForm({...addForm, course: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Status</label>
            <select 
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors appearance-none"
              value={addForm.status || "Active"}
              onChange={(e) => setAddForm({...addForm, status: e.target.value as Batch["status"]})}
            >
              <option value="Active" className="bg-surface">Active</option>
              <option value="Filling" className="bg-surface">Filling</option>
              <option value="Full" className="bg-surface">Full</option>
              <option value="Inactive" className="bg-surface">Inactive</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Start Time</label>
              <input 
                type="time"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                value={addForm.startTime || ""}
                onChange={(e) => setAddForm({...addForm, startTime: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">End Time</label>
              <input 
                type="time"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                value={addForm.endTime || ""}
                onChange={(e) => setAddForm({...addForm, endTime: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Capacity</label>
              <input 
                type="number"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                value={addForm.capacity || 20}
                onChange={(e) => setAddForm({...addForm, capacity: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-text-muted mb-1 font-bold font-sans">Enrolled</label>
              <input 
                type="number"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                value={addForm.enrolled || 0}
                onChange={(e) => setAddForm({...addForm, enrolled: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <div className="pt-4 font-sans">
            <button onClick={handleAdd} className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-sm font-bold tracking-wide transition-colors shadow-lg">
              Add Batch
            </button>
          </div>
        </div>
      </DetailDrawer>
    </>
  );
}
