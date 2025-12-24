# Rentr. - Contractor & Agent Management Module

**Live Demo:** [https://rentr.vercel.app](https://rentr.vercel.app)  
**Tech Stack:** React, Vite, Tailwind CSS, MSW (Mock Service Worker), HTML2PDF

---

## 👋 Project Overview

**Rentr** is a specialized workflow module designed to bridge the gap between **Real Estate Agents** and **Maintenance Contractors**.

In the real world, property maintenance is often a mess of emails, phone calls, and lost PDF invoices. This application streamlines that chaos into a single, unified dashboard where:

1. **Agents** can post jobs and hire pros instantly.
2. **Contractors** can find work, submit bids, and get paid.
3. **Invoices** are generated automatically, replacing manual paperwork.

---

## 🚀 Key Features

### 1. Dual-Role System

The app features a simulated login system that completely changes the interface based on who you are:

* **Agent View:** Focuses on *management*—posting jobs, reviewing applicants, and paying invoices.
* **Contractor View:** Focuses on *execution*—finding jobs, bidding, and tracking work status.

### 2. The "Smart" Job Lifecycle

I designed a strict state machine for jobs to prevent human error. A job moves through these stages programmatically:

`Open` → `Assigned` → `In Progress` → `Completed` → `Invoiced` → `Paid`

* *Constraint:* An agent cannot pay a job until it is invoiced. A contractor cannot invoice a job until they mark it complete.

### 3. Real-Time Interactions (Mocked)

Since this is a frontend-only demo, I used **MSW (Mock Service Worker)** to simulate a real backend.

* **No Hardcoded "Dummy" Data:** When you create a job or apply for one, it actually "saves" to the browser's local storage.
* **Persistent State:** If you refresh the page, your new job listings and applications are still there, just like a real app.

### 4. Professional Invoicing & PDF Generation

Instead of just showing "Payment Sent," the app generates a **branded, professional invoice** on the fly.

* **Dynamic Data:** The invoice pulls the specific job title, contractor name, and bid amount.
* **PDF Export:** Users can download this invoice as a real PDF file using `html2pdf.js`, essential for tax/accounting records.

---

## 🛠️ Technical Implementation & Design Decisions

### **1. Why Mock Service Worker (MSW)?**

I chose MSW over simple JSON files because I wanted to prove I can handle **async network requests**.

* The app uses real `fetch()` calls (e.g., `fetch('/api/jobs')`).
* MSW intercepts these network requests and returns responses from a simulated database in Local Storage.
* *Benefit:* If we connect a real Node.js backend tomorrow, I wouldn't need to change a single line of frontend code.

### **2. State Management Strategy**

* **Context API (`AuthContext`):** Used for global user state (Role, Name, ID) to avoid "prop drilling" user details through every component.
* **Local Component State:** Used for modals and forms to keep the app performant and snappy.

### **3. UX/UI & Branding**

I strictly adhered to a provided brand palette to ensure the app looks production-ready.

* **Colors:** Deep Teal (`#0F2C32`) for authority and Gold (`#A87F59`) for primary actions.
* **Feedback Loops:** Every major action (hiring, paying, applying) uses a custom **Confirmation Modal** instead of browser alerts, providing a smoother user experience.

---

## 📂 Project Structure
```bash
src/
├── components/          # Reusable UI blocks
│   ├── ApplicationModal.jsx   # Contractor bidding form
│   ├── InvoiceViewModal.jsx   # The printable invoice template
│   └── ...
├── context/
│   └── AuthContext.jsx  # Handles Login/Logout logic
├── mocks/
│   ├── handlers.js      # The "Brain" of the fake backend (API logic)
│   └── browser.js       # MSW setup
├── pages/
│   ├── JobManagement.jsx # Advanced filtering/sorting view for Agents
│   ├── Profile.jsx       # Dynamic contractor profile page
│   └── ...
└── App.jsx              # Main routing and dashboard layout logic
```

---

## 🏃‍♂️ How to Run Locally

### Clone the repository
```bash
git clone https://github.com/mirdanish6594/Rentr.git
cd rentr-module
```

### Install Dependencies
```bash
npm install
```

### Start the Development Server
```bash
npm run dev
```

### Explore!

* Login as **Agent** to post jobs.
* Open an **Incognito window** and login as **Contractor** to apply for them.

---

## 🔮 Future Improvements

If I had more time, I would add:

* **Real Backend:** Connect to Supabase or Firebase for real-time multi-user syncing.
* **Notifications:** A toast notification system for "New Application Received."
* **Chat System:** Allow agents and contractors to message directly within the job card.

---

**Built by Danish Mir.** Designed to solve real workflow problems.
