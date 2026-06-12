export interface Student {
  id: string;
  fullName: string;
  enrolledDate: string;
  feeStatus: "Paid" | "Pending" | "Overdue";
  monthlyFee?: number;
  course: string;
  batchId: string;
  timings: string;
  contact: {
    mobile: string;
    email?: string | null;
    instagram?: string | null;
  };
  address: string;
  guardianInfo?: {
    name: string;
    relation: string;
    mobile?: string;
  } | null;
  age: number;
  type: "Self" | "Child";
}

export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  course: string;
  batch: string;
  type: "Self" | "Child";
  age?: number;
  note?: string;
  status: "New" | "Contacted" | "Joined" | "Declined";
  submittedAt: string;
  ownerNote?: string;
}

export interface Batch {
  id: string;
  name: string;
  course: string;
  startTime: string;
  endTime: string;
  days: string[];
  capacity: number;
  enrolled: number;
  status: "Active" | "Filling" | "Full" | "Inactive";
}

export interface Course {
  id: string;
  name: string;
  tagline: string;
  description: string;
  audience: string;
  minAge: number;
  maxAge?: number;
  colorHex: string;
  batchIds: string[];
  monthlyFee?: number;
  timings?: string;
}

export interface Review {
  id: number;
  name: string;
  stars: 1 | 2 | 3 | 4 | 5;
  course: string;
  text: string;
  initials: string;
}

export interface GalleryItem {
  id: number;
  category: "Studio" | "Performances" | "Kids";
  label: string;
  aspect: string;
  gradient: string;
  src?: string;
  type?: "video" | "image";
  playable?: boolean;
}

export interface BookingFormData {
  courseId: string;
  courseName: string;
  batchId: string;
  batchLabel: string;
  studentType: "Self" | "Child";
  age: string;
  fullName: string;
  phone: string;
  note: string;
}
