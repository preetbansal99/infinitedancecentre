import { useState } from "react";
import { useBookingStore } from "@/hooks/useBookingStore";
import { StatusPill } from "@/components/shared/StatusPill";
import { ClayButton } from "@/components/shared/ClayButton";
import { DetailDrawer } from "@/components/shared/DetailDrawer";
import { formatTime } from "@/lib/formatters";
import { Clock, Users, Edit } from "lucide-react";
import type { Batch } from "@/types";

export function BatchManager() {
  const { batches, updateBatch, addBatch, deleteBatch, showToast } = useBookingStore();
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [editForm, setEditForm] = useState<Partial<Batch>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Batch>>({
    name: "", course: "Zumba", status: "Active", startTime: "18:00", endTime: "19:00", capacity: 20, enrolled: 0, days: ["Mon", "Wed", "Fri"]
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
      <div className="mb-4 flex justify-end">
        <ClayButton variant="primary" onClick={() => setIsAdding(true)}>
          <span className="hidden sm:inline">Add Batch</span>
        </ClayButton>
      </div>
      <div className="space-y-4">
        {batches.map((batch) => {
          const fillPercent = Math.round((batch.enrolled / batch.capacity) * 100);

          return (
            <div key={batch.id} className="bg-surface-el border border-white/5 rounded-xl p-5 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-body-sm font-semibold text-text-primary">{batch.name}</p>
                    <StatusPill status={batch.status} />
                  </div>
                  <p className="text-caption text-text-secondary">{batch.course}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-caption text-text-muted font-mono">{batch.id}</span>
                  <button onClick={() => handleEdit(batch)} className="text-text-muted hover:text-accent-light transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-caption text-text-muted mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(batch.startTime)} — {formatTime(batch.endTime)}
                </span>
                <span>{batch.days.join(", ")}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${fillPercent}%`,
                      background: fillPercent >= 90 ? "#EF4444" : fillPercent >= 70 ? "#F59E0B" : "#22C55E",
                    }}
                  />
                </div>
                <div className="flex items-center gap-1 text-caption text-text-secondary">
                  <Users className="w-3.5 h-3.5" />
                  <span className="font-mono">{batch.enrolled}/{batch.capacity}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <DetailDrawer
        open={!!editingBatch}
        onClose={() => setEditingBatch(null)}
        title="Edit Batch"
      >
        {editingBatch && (
          <div className="space-y-4">
            <div>
              <label className="block text-caption text-text-muted mb-1">Batch Name</label>
              <input 
                className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                value={editForm.name || ""}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-caption text-text-muted mb-1">Course</label>
              <input 
                className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                value={editForm.course || ""}
                onChange={(e) => setEditForm({...editForm, course: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-caption text-text-muted mb-1">Status</label>
              <select 
                className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                value={editForm.status || "Active"}
                onChange={(e) => setEditForm({...editForm, status: e.target.value as Batch["status"]})}
              >
                <option value="Active">Active</option>
                <option value="Filling">Filling</option>
                <option value="Full">Full</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-caption text-text-muted mb-1">Start Time</label>
                <input 
                  type="time"
                  className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                  value={editForm.startTime || ""}
                  onChange={(e) => setEditForm({...editForm, startTime: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-caption text-text-muted mb-1">End Time</label>
                <input 
                  type="time"
                  className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                  value={editForm.endTime || ""}
                  onChange={(e) => setEditForm({...editForm, endTime: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-caption text-text-muted mb-1">Capacity</label>
                <input 
                  type="number"
                  className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                  value={editForm.capacity || 0}
                  onChange={(e) => setEditForm({...editForm, capacity: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-caption text-text-muted mb-1">Enrolled</label>
                <input 
                  type="number"
                  className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                  value={editForm.enrolled || 0}
                  onChange={(e) => setEditForm({...editForm, enrolled: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="pt-4 flex gap-2">
              <ClayButton fullWidth onClick={handleSave} variant="primary">
                Save
              </ClayButton>
              <button onClick={handleDelete} className="w-full py-2 bg-error/10 text-error rounded-xl font-medium">
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
        <div className="space-y-4">
          <div>
            <label className="block text-caption text-text-muted mb-1">Batch Name</label>
            <input 
              className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
              value={addForm.name || ""}
              onChange={(e) => setAddForm({...addForm, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-caption text-text-muted mb-1">Course</label>
            <input 
              className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
              value={addForm.course || ""}
              onChange={(e) => setAddForm({...addForm, course: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-caption text-text-muted mb-1">Status</label>
            <select 
              className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
              value={addForm.status || "Active"}
              onChange={(e) => setAddForm({...addForm, status: e.target.value as Batch["status"]})}
            >
              <option value="Active">Active</option>
              <option value="Filling">Filling</option>
              <option value="Full">Full</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-caption text-text-muted mb-1">Start Time</label>
              <input 
                type="time"
                className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                value={addForm.startTime || ""}
                onChange={(e) => setAddForm({...addForm, startTime: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-caption text-text-muted mb-1">End Time</label>
              <input 
                type="time"
                className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                value={addForm.endTime || ""}
                onChange={(e) => setAddForm({...addForm, endTime: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-caption text-text-muted mb-1">Capacity</label>
              <input 
                type="number"
                className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                value={addForm.capacity || 20}
                onChange={(e) => setAddForm({...addForm, capacity: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-caption text-text-muted mb-1">Enrolled</label>
              <input 
                type="number"
                className="w-full bg-surface-el border border-white/10 rounded-lg px-3 py-2 text-body-sm text-text-primary focus:border-accent-purple/50 focus:outline-none"
                value={addForm.enrolled || 0}
                onChange={(e) => setAddForm({...addForm, enrolled: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <div className="pt-4">
            <ClayButton fullWidth onClick={handleAdd} variant="primary">
              Add Batch
            </ClayButton>
          </div>
        </div>
      </DetailDrawer>
    </>
  );
}
