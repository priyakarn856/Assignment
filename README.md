# Smart Bookmark App

A real-time bookmark manager built with **Next.js 15 (App Router)**, **Supabase** (Auth, Database, Realtime), and **Tailwind CSS**. Sign in with Google and manage your bookmarks with real-time sync across all open tabs.

## Live Demo

🔗 **Vercel URL:** _https://astrabit-two.vercel.app_

---

## Features

- **Google OAuth Login** — Sign in securely with your Google account (no email/password)
- **Add Bookmarks** — Save any URL with a title
- **Private Per User** — Each user only sees their own bookmarks (enforced via Row Level Security)
- **Real-Time Sync** — Add or delete a bookmark in one tab and it instantly appears/disappears in every other open tab (powered by Supabase Realtime)
- **Optimistic Updates** — Bookmarks appear/disappear instantly on the same page without waiting for real-time events, ensuring reliable UX even on serverless platforms like Vercel
- **Delete Bookmarks** — Remove any bookmark you no longer need
- **Dark / Light Theme** — Toggle between dark and light mode (persisted, with system preference detection)
- **Responsive Design** — Side-by-side layout on desktop, stacked on mobile

---

## Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Framework      | Next.js 15 (App Router)             |
| Styling        | Tailwind CSS v4                      |
| Auth           | Supabase Auth (Google OAuth)         |
| Database       | Supabase (PostgreSQL)                |
| Real-time      | Supabase Realtime (Postgres Changes) |
| Theming        | next-themes                          |
| Hosting        | Vercel                               |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A Google OAuth client (configured in the Supabase dashboard)

### 1. Clone the repo

```bash
git clone https://github.com/psc856/AstraBit-Challenge.git
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of [`supabase/migration.sql`](supabase/migration.sql) to create the `bookmarks` table, enable RLS policies, and turn on Realtime.
3. Go to **Authentication → Providers → Google** and enable it:
   - Add your Google Client ID and Client Secret (from [Google Cloud Console](https://console.cloud.google.com/apis/credentials))
   - Set the redirect URL to: `https://<your-supabase-ref>.supabase.co/auth/v1/callback`
4. Copy your **Project URL** and **Anon Key** from **Settings → API and Data API**.

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Deploy to Vercel

1. Push your repo to GitHub
2. Import the repo into [Vercel](https://vercel.com/new)
3. Add the two environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings
4. In the Supabase dashboard, go to **Authentication → URL Configuration** and add your Vercel URL (`https://your-app.vercel.app`) to the **Redirect URLs** list: `https://your-app.vercel.app/auth/callback`
5. Deploy!

---

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── callback/route.ts    # OAuth callback handler
│   │   └── auth-code-error/     # Error page for failed auth
│   ├── globals.css              # Tailwind CSS imports + dark mode config
│   ├── layout.tsx               # Root layout with ThemeProvider
│   └── page.tsx                 # Main page (landing + dashboard)
├── components/
│   ├── BookmarkForm.tsx         # Form to add new bookmarks (with optimistic callback)
│   ├── BookmarkItem.tsx         # Single bookmark card with delete
│   ├── BookmarkList.tsx         # Bookmark list display (receives props)
│   ├── Dashboard.tsx            # Dashboard wrapper — owns state, Realtime & optimistic updates
│   ├── Header.tsx               # App header with user info, theme toggle & sign out
│   ├── LoginButton.tsx          # Google sign-in button
│   ├── ThemeProvider.tsx        # next-themes provider wrapper
│   └── ThemeToggle.tsx          # Dark / light mode toggle button
├── lib/
│   └── supabase/
│       ├── client.ts            # Browser Supabase client
│       ├── middleware.ts        # Middleware Supabase client
│       └── server.ts            # Server Supabase client (RSC)
├── types/
│   └── bookmark.ts              # TypeScript type definitions
└── middleware.ts                # Next.js middleware (session refresh)
```

---

## Problems I Ran Into & How I Solved Them

### 1. Supabase Auth cookies not syncing between Server & Client Components

**Problem:** After signing in via Google OAuth, the session was sometimes `null` when accessed in Server Components, even though the browser had cookies. This happened because the auth token wasn't being refreshed in the middleware.

**Solution:** Implemented the official Supabase SSR pattern using `@supabase/ssr`. Created three separate Supabase client factories — one for the browser (`createBrowserClient`), one for Server Components (`createServerClient` with cookie helpers), and one for middleware. The middleware runs on every request and calls `supabase.auth.getUser()` to refresh the session, ensuring Server Components always have a valid token.

### 2. Real-time events not arriving for filtered subscriptions

**Problem:** Supabase Realtime `postgres_changes` with a `filter` (e.g., `user_id=eq.xxx`) requires the table to have `REPLICA IDENTITY FULL` set. Without it, DELETE events don't include the `old` record data, so the filter can't match and events silently get dropped.

**Solution:** Added `ALTER TABLE public.bookmarks REPLICA IDENTITY FULL;` to the migration SQL. This tells PostgreSQL to include the full old row in the WAL (Write-Ahead Log), allowing Supabase Realtime to correctly filter DELETE events by `user_id`.

### 3. Duplicate bookmarks appearing in the list after INSERT

**Problem:** When adding a bookmark, the optimistic/local insert from the form AND the Realtime subscription both added the same bookmark, resulting in duplicates.

**Solution:** In the Realtime `INSERT` handler inside `Dashboard`, I check if the bookmark already exists in state before adding it:
```ts
setBookmarks((prev) => {
  if (prev.some((b) => b.id === newBookmark.id)) return prev;
  return [newBookmark, ...prev];
});
```

### 4. OAuth callback redirect failing on Vercel (production)

**Problem:** In production, the OAuth callback redirect was going to `localhost:3000` instead of the Vercel domain because `origin` was derived from the request URL.

**Solution:** The callback route checks for `x-forwarded-host` header (set by Vercel's reverse proxy) and uses it for the redirect URL in production, while falling back to `origin` for local development.

### 5. Row Level Security blocking Realtime subscriptions

**Problem:** Even after enabling RLS, Realtime subscriptions weren't receiving events because the Supabase client in the browser wasn't authenticated — the anon key alone doesn't pass RLS policies.

**Solution:** Ensured the browser Supabase client is created with `createBrowserClient` from `@supabase/ssr`, which automatically picks up the auth session from cookies. This means all Realtime subscriptions run with the user's JWT, passing RLS checks correctly.

### 6. Bookmarks not updating on Vercel without page reload

**Problem:** On localhost, bookmarks appeared/disappeared instantly via Supabase Realtime WebSocket. On Vercel's serverless infrastructure, WebSocket connections were unreliable — bookmarks only showed after a full page reload.

**Solution:** Implemented **optimistic updates** by lifting bookmark state into a `Dashboard` component. `BookmarkForm` now uses `.insert().select().single()` to get the inserted row back and immediately calls an `onBookmarkAdded` callback. `BookmarkItem` calls `onDeleted` after a successful delete. The UI updates instantly without depending on WebSocket, while Realtime still runs in the background for cross-tab sync.

### 7. Dark mode not working with Tailwind CSS v4

**Problem:** After adding `next-themes` with `attribute="class"`, the `dark:` variants in Tailwind CSS had no effect. Tailwind v4 no longer uses a `tailwind.config.js` file, so the old `darkMode: "class"` setting doesn't exist.

**Solution:** Added the Tailwind v4 custom variant directive directly in `globals.css`:
```css
@custom-variant dark (&:where(.dark, .dark *));
```
This tells Tailwind v4 to activate `dark:` utilities whenever the `dark` class is present on an ancestor element, which is exactly what `next-themes` sets on `<html>`.

---

## License

MIT
