"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { type Bookmark } from "@/types/bookmark";

interface BookmarkItemProps {
  bookmark: Bookmark;
}

export default function BookmarkItem({ bookmark }: BookmarkItemProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", bookmark.id);

    if (error) {
      console.error("Delete error:", error);
      setDeleting(false);
    }
    // No need to update state — Realtime will handle removal
  };

  const hostname = (() => {
    try {
      return new URL(bookmark.url).hostname.replace("www.", "");
    } catch {
      return bookmark.url;
    }
  })();

  const timeAgo = (() => {
    const diff = Date.now() - new Date(bookmark.created_at).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(bookmark.created_at).toLocaleDateString();
  })();

  return (
    <div className={`group relative flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md hover:shadow-zinc-200/60 dark:hover:shadow-black/20 transition-all ${deleting ? "opacity-50 scale-[0.98]" : ""}`}>
      {/* Favicon */}
      <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
        <img
          src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
          alt=""
          className="w-5 h-5 rounded"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors block truncate"
        >
          {bookmark.title}
        </a>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-sm text-zinc-400 dark:text-zinc-500 truncate">{hostname}</p>
          <span className="text-zinc-300 dark:text-zinc-700">·</span>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 whitespace-nowrap">{timeAgo}</p>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="opacity-0 group-hover:opacity-100 text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-all p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 flex-shrink-0 cursor-pointer"
        title="Delete bookmark"
      >
        {deleting ? (
          <svg className="w-4.5 h-4.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        )}
      </button>
    </div>
  );
}
