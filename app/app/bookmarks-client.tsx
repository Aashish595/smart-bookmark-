"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
  user_id: string;
};

export default function BookmarksClient({
  initialBookmarks,
  userId,
}: {
  initialBookmarks: Bookmark[];
  userId: string;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  // ✅ REALTIME (filtered + safe)
useEffect(() => {
  if (!userId) {
    console.log("Realtime: no userId yet, skipping subscribe");
    return;
  }

  console.log("Realtime effect mounted ✅", { userId });
  console.log("Supabase URL (client):", process.env.NEXT_PUBLIC_SUPABASE_URL);

  const channel = supabase
    .channel(`bookmarks:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookmarks",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log("Realtime payload ✅", payload);

        if (payload.eventType === "INSERT") {
          const row = payload.new as Bookmark;
          setBookmarks((prev) => {
            if (prev.some((b) => b.id === row.id)) return prev;
            return [row, ...prev];
          });
        }

        if (payload.eventType === "UPDATE") {
          const row = payload.new as Bookmark;
          setBookmarks((prev) => prev.map((b) => (b.id === row.id ? row : b)));
        }

        if (payload.eventType === "DELETE") {
          const oldRow = payload.old as { id: string };
          setBookmarks((prev) => prev.filter((b) => b.id !== oldRow.id));
        }
      }
    )
    .subscribe((status) => {
      console.log("Realtime status ✅", status);
      // Expected: "SUBSCRIBED"
      // If you see: "TIMED_OUT" or "CLOSED" => websocket not connecting
    });

  return () => {
    console.log("Realtime effect cleanup ❌", { userId });
    supabase.removeChannel(channel);
  };
}, [supabase, userId]);


  // IMPORTANT RULE:
  // Do NOT manually update state after DB write.
  // Let realtime be the single source of truth across tabs.
  async function addBookmark() {
    if (!title.trim() || !url.trim()) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .insert({ title: title.trim(), url: url.trim(), user_id: userId })
      .select("*")
      .single();

    if (error || !data) return;

    // ✅ instant UI update (tab A)
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === data.id)) return prev;
      return [data as Bookmark, ...prev];
    });

    setTitle("");
    setUrl("");
  }

  async function deleteBookmark(id: string) {
    // ✅ instant UI update
    setBookmarks((prev) => prev.filter((b) => b.id !== id));

    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (error) {
      // optional: refetch or revert if you want
    }
  }

  async function saveEdit(id: string) {
    const { data, error } = await supabase
      .from("bookmarks")
      .update({ title: editTitle.trim(), url: editUrl.trim() })
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) return;

    // ✅ instant UI update
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? (data as Bookmark) : b)),
    );
    setEditingId(null);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Bookmarks</h1>

      {/* Add Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Bookmark</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={addBookmark} className="w-full">
            Add Bookmark
          </Button>
        </CardContent>
      </Card>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookmarks.map((b) => (
          <Card key={b.id}>
            <CardContent className="p-6 space-y-3">
              {editingId === b.id ? (
                <>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <Input
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                  />
                  <Button onClick={() => saveEdit(b.id)} className="w-full">
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{b.title}</h2>
                  <p className="text-gray-600 break-all">{b.url}</p>

                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <a href={b.url} target="_blank" rel="noreferrer">
                        Visit
                      </a>
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditingId(b.id);
                        setEditTitle(b.title);
                        setEditUrl(b.url);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => deleteBookmark(b.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
