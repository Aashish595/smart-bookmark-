"use client";

import BookmarkItem from "./BookmarkItem";

export default function BookmarkList({
  bookmarks,
  onDelete,
}: {
  bookmarks: { id: string; title: string; url: string }[];
  onDelete: (id: string) => Promise<void>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookmarks.map((b) => (
        <BookmarkItem key={b.id} bookmark={b} onDelete={onDelete} />
      ))}
    </div>
  );
}
