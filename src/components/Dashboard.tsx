"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { type Bookmark } from "@/types/bookmark";
import BookmarkForm from "./BookmarkForm";
import BookmarkList from "./BookmarkList";

interface DashboardProps {
  userId: string;
  initialBookmarks: Bookmark[];
}

export default function Dashboard({ userId, initialBookmarks }: DashboardProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);

  // Realtime subscription — still useful for cross-tab sync
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newBookmark = payload.new as Bookmark;
          setBookmarks((prev) => {
            if (prev.some((b) => b.id === newBookmark.id)) return prev;
            return [newBookmark, ...prev];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const deletedId = payload.old.id as string;
          setBookmarks((prev) => prev.filter((b) => b.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Optimistic add — called immediately after successful DB insert
  const handleBookmarkAdded = useCallback((bookmark: Bookmark) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === bookmark.id)) return prev;
      return [bookmark, ...prev];
    });
  }, []);

  // Optimistic delete — remove from list immediately
  const handleBookmarkDeleted = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
      {/* Left: Add form (sticky on desktop) */}
      <div className="lg:sticky lg:top-20">
        <BookmarkForm userId={userId} onBookmarkAdded={handleBookmarkAdded} />
      </div>

      {/* Right: Bookmark list */}
      <BookmarkList bookmarks={bookmarks} onBookmarkDeleted={handleBookmarkDeleted} />
    </div>
  );
}
