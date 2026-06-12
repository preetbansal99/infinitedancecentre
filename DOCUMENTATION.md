# Infinite Dance Centre - Detailed Documentation & Use Cases

This document serves as a comprehensive guide to all features, interactions, and use cases built into the Infinite Dance Centre web platform.

---

## 👥 Target Personas & Use Cases

1. **Prospective Student / Parent:** A user visiting the site to learn about dance styles, view the studio atmosphere, check class timings, and seamlessly book a free trial class.
2. **Studio Admin / Manager:** The business owner or manager who reviews new leads, manages class schedules (batches), tracks student numbers, and updates courses.

---

## 🎨 Frontend Features & Landing Page

### 1. Cinematic Hero Section
- **Use Case:** Capturing user attention immediately upon page load with a highly premium, modern feel.
- **Features:** 
  - A scroll-linked, 3D holographic spinning dancer built purely with SVG layers and `framer-motion`.
  - Ambient hardware-accelerated floating particles.
  - Interactive "Glass Wall" that cracks and fades out as the user scrolls down.
  - Dynamic neon lighting gradients that shift based on scroll progress.

### 2. Courses & Classes Grid
- **Use Case:** Users browsing available dance styles (Hip Hop, Contemporary, Bollywood, etc.).
- **Features:**
  - Glassmorphic card design with hover-lift effects.
  - Clicking a course opens a highly detailed slide-over drawer (or bottom sheet on mobile) explaining the curriculum, difficulty level, and prerequisites.
  - "Book Trial" buttons directly embedded into course details.

### 3. Interactive Gallery
- **Use Case:** Showcasing the studio environment and student performances to build trust.
- **Features:**
  - Auto-playing, muted, looping video cards showcasing different aspects of the studio (Kids classes, professional performances, studio space).
  - Hovering over a video card expands it slightly with a neon shadow effect.

### 4. Reviews & Testimonials Carousel
- **Use Case:** Providing social proof.
- **Features:**
  - Horizontal, touch-friendly snap-scrolling carousel to save vertical screen space on mobile.
  - Verified Google Review formatting with star ratings and reviewer names.

### 5. Location & Footer
- **Use Case:** Helping users physically find the studio.
- **Features:**
  - Interactive Map Pins linking directly to the Google Maps application for precise routing to the Yamuna Vihar, Delhi location.
  - Standardized social links and contact information.

---

## 📅 The Booking Flow (Conversion Funnel)

The core conversion engine of the site is the interactive booking modal. It replaces standard boring web forms with an engaging, app-like multi-step process.

### Use Case: A user wants to book a free trial class.
- **Step 1: Course Selection:** Users select their preferred dance style via large, tappable visual cards with active checkmark indicators.
- **Step 2: Batch & Timing:** Users select a convenient time slot from dynamically generated mock batches.
- **Step 3: Student Details:** A clean form to capture the student's Name, Age, and Phone Number.
- **Step 4: Review & Confirm:** A summary screen ensuring all details are correct.
- **Step 5: WhatsApp Handoff:** Instead of relying on email, the site automatically formats all the user's choices into a professional text string and redirects the user to their native WhatsApp app to message the studio manager directly. This guarantees a near 100% open and response rate for the business.

### Technical Implementation:
- **Zustand State Management:** Keeps track of the user's progress across steps without refreshing the page.
- **Mobile Bottom Sheet:** On mobile phones, the booking form acts as a native bottom sheet (like iOS) rather than a clunky popup modal.

---

## 🔒 Admin & Management Dashboard

A hidden (`/admin`) route exists for the studio manager to organize their business.

### 1. PIN-Gated Security
- **Use Case:** Protecting sensitive student data.
- **Features:** The entire dashboard is protected by a sleek, numerical PIN-pad lock screen preventing unauthorized access.

### 2. Dashboard Analytics (Stats)
- **Use Case:** High-level overview of studio health.
- **Features:** Displays metrics like Total Active Students, New Trial Leads, Revenue/Conversion rates, and weekly growth charts.

### 3. Leads Manager
- **Use Case:** Managing prospective students who haven't paid yet.
- **Features:** A Kanban-style or list view of incoming inquiries where admins can mark leads as "Contacted", "Trial Booked", or "Converted".

### 4. Batch Manager
- **Use Case:** Organizing the physical studio schedule.
- **Features:** 
  - View all active batches (e.g., "Kids Hip Hop - Mon/Wed 5PM").
  - See capacity limits and currently enrolled student counts per batch.
  - Assign specific instructors to specific time slots.

### 5. Student Roster
- **Use Case:** Managing actively paying students.
- **Features:** A searchable database of all enrolled students, their emergency contact info, and their active class assignments.

---

## ⚙️ Technical Highlights

- **Next.js 14 App Router:** Server-side rendered pages for blazing-fast initial loads and top-tier SEO (Search Engine Optimization).
- **Hardware-Accelerated Animations:** Strategic use of `will-change: transform` and CSS-driven opacities to ensure smooth 60fps animations, even on older mobile devices.
- **Vercel Edge Network:** The site is deployed globally via Vercel, ensuring near-instant load times regardless of the user's network connection.
- **Tailwind CSS:** Used exclusively for styling, utilizing custom configured brand colors (magentas, purples, deep blues) to maintain the cohesive "Infinite" neon aesthetic.
