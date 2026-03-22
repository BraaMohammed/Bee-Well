<p align="center">
  <img src="https://yydxbfiibfjsxowspgiq.supabase.co/storage/v1/object/public/bee-well/logo.png" alt="Bee-Well Logo" width="150"/>
</p>

# Bee-Well: Personal Productivity & Self-Improvement SaaS

<p align="center">
  <img src="https://yydxbfiibfjsxowspgiq.supabase.co/storage/v1/object/public/bee-well/Screenshot%202025-08-02%20233819.png" alt="Bee-Well application dashboard" width="800"/>
</p>

### A comprehensive tool for personal productivity featuring an advanced habit tracker, a Notion-style block editor, an automated daily journal, and an integrated AI Assistant.

**Live App:** ((https://bee-well.vercel.app/))

---

## 🚀 The Story

I built Bee-Well as my first major solo project to learn full-stack development and solve a personal need: integrating daily planning with deep self-reflection. Developed initially in 2024, it served as the foundation for all my subsequent work and has recently been upgraded into an AI-powered workspace.

This project proves my ability to architect and ship a feature-rich, user-focused application from concept to launch. It was the "training ground" where I made mistakes, learned, and grew into the developer I am today.

Specifically, building Bee-Well taught me the importance of:
* **Scalable State Management:** Adopting tools like Zustand and React Query to manage complex app states efficiently.
* **TypeScript:** Managing a growing codebase with TypeScript for building robust, maintainable applications.
* **AI Integration:** Designing structured systems to bridge LLMs (Google, Groq, Ollama) with application logic using customized tools safely.

---

## ✨ Core Features & Screenshots

* **Advanced AI Assistant:** A customizable, context-aware AI chat client (supporting Google, Ollama, and Groq models) that dynamically aids in task management and incorporates model thinking blocks and tool utilization.
* **Progressive Web App (PWA) Support:** Installable as a native-like app across devices for a seamless experience.
* **Advanced Habit Tracking:** Go beyond simple checkboxes with a system designed for consistency and progress.
* **Custom Analytics Engine:** Visualize your habit data over time to identify patterns and stay motivated.
* **Notion-Style Block Editor:** A flexible, powerful editor for capturing notes, ideas, and journal entries.
* **Automated Daily Journal:** Prompts and templates to encourage consistent self-reflection.

<p align="center">
  <img src="https://yydxbfiibfjsxowspgiq.supabase.co/storage/v1/object/public/bee-well/Screenshot%202025-08-02%20233754.png" alt="Habit tracker screenshot" width="25%"/>
  <img src="https://yydxbfiibfjsxowspgiq.supabase.co/storage/v1/object/public/bee-well/Screenshot%202025-08-02%20233810.png" alt="Notes editor screenshot" width="25%"/>
  <img src="https://yydxbfiibfjsxowspgiq.supabase.co/storage/v1/object/public/bee-well/Screenshot%202025-08-02%20233819.png" alt="Notes editor screenshot" width="25%"/>
  <img src="https://yydxbfiibfjsxowspgiq.supabase.co/storage/v1/object/public/bee-well/Screenshot%202025-08-02%20233830.png" alt="Notes editor screenshot" width="25%"/>

</p>

---

## 🛠️ Tech Stack & Architecture

* **Framework:** Next.js (App Router)
* **AI Interoperability:** Vercel AI SDK, Ollama, Google Gen AI SDK
* **Database:** MongoDB
* **Authentication:** NextAuth.js
* **UI:** Shadcn/UI, Tailwind CSS, Lucide Icons
* **Editor/Markdown:** BlockNote.js, react-markdown, remark-gfm
* **State Management:** Zustand, React Query
* **Deployment:** Vercel (PWA Enabled)

---

## ⚙️ Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/BraaMohammed/Bee-Well/
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
## 🦙 Using Local AI (Ollama) with the Live App

Bee-Well supports 100% private, free AI by connecting the live web app directly to your local Ollama instance. Because modern browsers strictly block public websites from accessing local networks, you must make two quick one-time configurations:

### 1. Allow Cross-Origin Requests in Ollama
You need to tell Ollama it is allowed to accept requests from Bee-Well.
* **Windows:** Open CMD and run `setx OLLAMA_ORIGINS "*"`
* **Mac/Linux:** Run `export OLLAMA_ORIGINS="*"`
* **⚠️ CRITICAL:** You must completely quit the Ollama app from your system tray/menu bar and restart it for the changes to take effect. 

### 2. Bypass Chrome's Local Network Block
By default, Chromium-based browsers (Chrome, Edge, Brave) kill background requests to `localhost`.
1. Paste this exact URL into your browser's address bar: `chrome://flags/#local-network-access-check`
2. Change the highlighted setting to **Disabled**.
3. Click the **Relaunch** button at the bottom of the browser.

Once done, simply select Ollama in the Bee-Well chat settings and it will instantly connect.



---

*This project continues to evolve as my personal workspace and testing ground for new technologies like client-side AI integration.*
