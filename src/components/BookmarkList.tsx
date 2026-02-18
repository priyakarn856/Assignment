"use client";

import { type Bookmark } from "@/types/bookmark";
import BookmarkItem from "./BookmarkItem";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onBookmarkDeleted?: (id: string) => void;
}

export default function BookmarkList({ bookmarks, onBookmarkDeleted }: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-1">No bookmarks yet</h3>
        <p className="text-zinc-400 dark:text-zinc-500 text-sm">
          Add your first bookmark to get started!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Your Bookmarks
        </h2>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
          {bookmarks.length}
        </span>
      </div>
      <div className="space-y-3">
        {bookmarks.map((bookmark) => (
          <BookmarkItem key={bookmark.id} bookmark={bookmark} onDeleted={onBookmarkDeleted} />
        ))}
      </div>
    </div>
  );
}
