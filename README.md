<p align="center">
  <img src="https://yydxbfiibfjsxowspgiq.supabase.co/storage/v1/object/public/bee-well/logo.png" alt="Bee-Well Logo" width="150"/>
</p>

# Bee-Well: Personal Productivity & Self-Improvement SaaS

<p align="center">
  <img src="https://yydxbfiibfjsxowspgiq.supabase.co/storage/v1/object/public/bee-well/Screenshot%202025-08-02%20233742.png" alt="Bee-Well application dashboard" width="800"/>
</p>

### A comprehensive tool for personal productivity featuring an advanced habit tracker, a Notion-style block editor, and an automated daily journal.

**Live App:** [https://YOUR_LIVE_BEEWELL_URL](https://YOUR_LIVE_BEEWELL_URL)

---

## 🚀 The Story

I built Bee-Well as my first major solo project to learn full-stack development and solve a personal need: integrating daily planning with deep self-reflection. It was developed between March and August 2024 and served as the foundation for all my subsequent work.

While the code isn't perfect (I was learning!), this project proves my ability to architect and ship a feature-rich, user-focused application from concept to launch. It was the "training ground" where I made mistakes, learned, and grew into the developer I am today.

Specifically, building Bee-Well taught me the importance of:
* **Scalable State Management:** The prop-drilling in this app directly inspired me to adopt tools like Zustand and React Query in my later projects.
* **TypeScript:** Managing a growing JavaScript codebase here convinced me of the necessity of TypeScript for building robust, maintainable applications.
* **Backend Architecture:** I learned a great deal about data modeling and API design, which I later refined in my microservices-based projects.

---

## ✨ Core Features & Screenshots

* **Advanced Habit Tracking:** Go beyond simple checkboxes with a system designed for consistency and progress.
* **Custom Analytics Engine:** Visualize your habit data over time to identify patterns and stay motivated.
* **Notion-Style Block Editor:** A flexible, powerful editor for capturing notes, ideas, and journal entries.
* **Automated Daily Journal:** Prompts and templates to encourage consistent self-reflection.

<p align="center">
  <img src="https://yydxbfiibfjsxowspgiq.supabase.co/storage/v1/object/public/bee-well/Screenshot%202025-08-02%20233754.png" alt="Habit tracker screenshot" width="48%"/>
  <img src="https://yydxbfiibfjsxowspgiq.supabase.co/storage/v1/object/public/bee-well/Screenshot%202025-08-02%20233810.png" alt="Notes editor screenshot" width="48%"/>
</p>

---

## 🛠️ Tech Stack & Architecture

* **Framework:** Next.js (App Router)
* **Database:** MongoDB
* **Authentication:** NextAuth.js
* **UI:** Shadcn/UI, Tailwind CSS
* **Editor:** BlockNote.js (for the Notion-style editor)
* **Deployment:** Vercel

---

## ⚙️ Running Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/beewell-repo](https://github.com/YOUR_USERNAME/beewell-repo)
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env.local` file and add the necessary environment variables (e.g., MongoDB connection string, NextAuth secret).
    ```env
    MONGODB_URI=...
    NEXTAUTH_SECRET=...
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

*This project is for portfolio purposes. I am currently building a new, AI-powered version that addresses the architectural lessons learned here.*
