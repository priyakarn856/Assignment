# Smart Bookmark App

A real-time bookmark manager built with **Next.js 15 (App Router)**, **Supabase** (Auth, Database, Realtime), and **Tailwind CSS**.  
Sign in with Google and manage your bookmarks with real-time sync across all open tabs.

---

## 🚀 Live Demo

🔗 **Vercel URL:** https://astrabit-two.vercel.app

---

## ✨ Features

- **Google OAuth Login** — Secure sign-in with Google (no email/password)
- **Add Bookmarks** — Save any URL with a title
- **Private Per User** — Data protected via Row Level Security (RLS)
- **Real-Time Sync** — Changes reflect instantly across all tabs
- **Optimistic Updates** — Instant UI updates without waiting for server
- **Delete Bookmarks** — Remove bookmarks anytime
- **Dark / Light Theme** — Persistent theme with system detection
- **Responsive Design** — Works on mobile and desktop

---

## 🛠 Tech Stack

| Layer     | Technology                     |
|----------|-------------------------------|
| Framework | Next.js 15 (App Router)      |
| Styling   | Tailwind CSS v4              |
| Auth      | Supabase Auth (Google OAuth) |
| Database  | Supabase (PostgreSQL)        |
| Realtime  | Supabase Realtime            |
| Theming   | next-themes                  |
| Hosting   | Vercel                       |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- Supabase project
- Google OAuth credentials

---

### 1. Clone the repo

```bash
git clone https://github.com/psc856/AstraBit-Challenge.git
cd AstraBit-Challenge
npm install
