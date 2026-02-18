import { createClient } from "@/lib/supabase/server";
import LoginButton from "@/components/LoginButton";
import Header from "@/components/Header";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import ThemeToggle from "@/components/ThemeToggle";
import { type Bookmark } from "@/types/bookmark";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- Not logged in: show landing page ---
  if (!user) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-zinc-950 px-4 transition-colors">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-blue-100 dark:bg-blue-950/40 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-violet-100 dark:bg-violet-950/30 blur-3xl" />
          <div className="absolute top-1/3 right-1/4 h-[300px] w-[300px] rounded-full bg-sky-50 dark:bg-sky-950/20 blur-3xl" />
        </div>

        {/* Theme toggle — top right */}
        <div className="absolute top-5 right-5 z-20">
          <ThemeToggle />
        </div>

        <div className="relative z-10 text-center max-w-xl">
          {/* Logo */}
          <div className="relative mx-auto mb-8 w-20 h-20">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 blur-2xl opacity-30 dark:opacity-20" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/25 dark:shadow-blue-500/15">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4">
            <span className="text-zinc-900 dark:text-white">Smart </span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
              Bookmarks
            </span>
          </h1>

          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed max-w-md mx-auto">
            Save, organize, and access your favourite links from anywhere.
            Real-time sync across all your tabs.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-10">
            {["Real-time sync", "Google OAuth", "Private & secure"].map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {f}
              </span>
            ))}
          </div>

          <LoginButton />

          <p className="mt-8 text-xs text-zinc-400 dark:text-zinc-500">
            Sign in with your Google account to get started — it&apos;s free.
          </p>
        </div>
      </div>
    );
  }

  // --- Logged in: fetch bookmarks and show dashboard ---
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Header user={user} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
          {/* Left: Add form (sticky on desktop) */}
          <div className="lg:sticky lg:top-20">
            <BookmarkForm userId={user.id} />
          </div>

          {/* Right: Bookmark list */}
          <BookmarkList
            userId={user.id}
            initialBookmarks={(bookmarks as Bookmark[]) ?? []}
          />
        </div>
      </main>
    </div>
  );
}
