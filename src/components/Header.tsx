"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Bookmarks
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-zinc-200 dark:border-zinc-700">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-zinc-800"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 max-w-[140px] truncate">
              {user.user_metadata?.full_name || user.email}
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="text-sm text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors cursor-pointer ml-1"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
