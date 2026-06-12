"use client";

import { create } from "zustand";
import type { Lead, Student, Batch } from "@/types";
import { MOCK_LEADS, MOCK_STUDENTS, MOCK_BATCHES } from "@/data/mockData";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface BookingStore {
  // ── Booking modal ──────────────────────────────────────
  isBookingOpen: boolean;
  preSelectedCourse: string | null;
  openBookingModal: (courseId?: string) => void;
  closeBookingModal: () => void;

  // ── Enquire modal ──────────────────────────────────────
  isEnquireOpen: boolean;
  openEnquireModal: () => void;
  closeEnquireModal: () => void;

  // ── Leads (shared public → admin) ─────────────────────
  leads: Lead[];
  addLead: (lead: Lead) => void;
  updateLeadStatus: (id: string, status: Lead["status"]) => void;
  updateLeadNote: (id: string, note: string) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;

  // ── Students ───────────────────────────────────────────
  students: Student[];
  addStudent: (student: Student) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  updateStudentFeeStatus: (id: string, status: Student["feeStatus"]) => void;

  // ── Batches ────────────────────────────────────────────
  batches: Batch[];
  addBatch: (batch: Batch) => void;
  updateBatch: (id: string, updates: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;

  // ── Toast notifications ─────────────────────────────────
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;

  // ── Admin PIN ──────────────────────────────────────────
  adminAuthenticated: boolean;
  setAdminAuthenticated: (val: boolean) => void;

  // ── Global Site State ─────────────────────────────────
  isSiteRevealed: boolean;
  setSiteRevealed: (val: boolean) => void;
  pendingScrollId: string | null;
  setPendingScrollId: (id: string | null) => void;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  // Modal
  isBookingOpen: false,
  preSelectedCourse: null,
  openBookingModal: (courseId) => set({ isBookingOpen: true, preSelectedCourse: courseId ?? null }),
  closeBookingModal: () => set({ isBookingOpen: false, preSelectedCourse: null }),

  isEnquireOpen: false,
  openEnquireModal: () => set({ isEnquireOpen: true }),
  closeEnquireModal: () => set({ isEnquireOpen: false }),

  // Leads — initialized from mockData, new leads prepended
  leads: MOCK_LEADS,
  addLead: (lead) =>
    set((state) => ({ leads: [lead, ...state.leads] })),
  updateLeadStatus: (id, status) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, status } : l)),
    })),
  updateLeadNote: (id, note) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, ownerNote: note } : l)),
    })),
  updateLead: (id, updates) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    })),

  // Students — initialized from mockData
  students: MOCK_STUDENTS,
  addStudent: (student) =>
    set((state) => ({ students: [student, ...state.students] })),
  updateStudent: (id, updates) =>
    set((state) => ({
      students: state.students.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),
  deleteStudent: (id) =>
    set((state) => ({ students: state.students.filter((s) => s.id !== id) })),
  updateStudentFeeStatus: (id, status) =>
    set((state) => ({
      students: state.students.map((s) => (s.id === id ? { ...s, feeStatus: status } : s)),
    })),

  // Batches
  batches: MOCK_BATCHES,
  addBatch: (batch) =>
    set((state) => ({ batches: [...state.batches, batch] })),
  updateBatch: (id, updates) =>
    set((state) => ({
      batches: state.batches.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    })),
  deleteBatch: (id) =>
    set((state) => ({ batches: state.batches.filter((b) => b.id !== id) })),

  // Toasts
  toasts: [],
  showToast: (toast) =>
    set((state) => {
      const id = Date.now().toString();
      setTimeout(() => get().dismissToast(id), 4000);
      return { toasts: [...state.toasts, { ...toast, id }] };
    }),
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  // Admin
  adminAuthenticated: false,
  setAdminAuthenticated: (val) => set({ adminAuthenticated: val }),

  // Global Site State
  isSiteRevealed: false,
  setSiteRevealed: (val) => set({ isSiteRevealed: val }),
  pendingScrollId: null,
  setPendingScrollId: (id) => set({ pendingScrollId: id }),
}));

export function ZustandProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
