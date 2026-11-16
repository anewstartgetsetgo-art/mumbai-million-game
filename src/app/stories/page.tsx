
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Story = {
  id: string;
  title: string;
  story: string;
  created_at: string;
};

export default function StoriesPage() {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [related, setRelated] = useState(false);
  const [tag, setTag] = useState(false);
  const [tagName, setTagName] = useState("");
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadStories() {
    const { data } = await supabase.from("stories")
      .select("id,title,story,created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    setStories(data || []);
  }

  useEffect(() => { loadStories(); }, []);

  async function submitStory(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("stories").insert({
      user_id: user.id,
      title: title.trim(),
      story: story.trim(),
      related_to_someone: related,
      tagged_name: tag ? tagName.trim() || null : null,
      status: "pending",
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setStory("");
    setRelated(false);
    setTag(false);
    setTagName("");
    alert("Your story was submitted! It will appear after admin approval.");
  }

  return (
    <main className="min-h-screen bg-[#fff4e9] p-5">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-black text-[#49345f]">
          Share Your Story ❤️
        </h1>

        <form onSubmit={submitStory}
          className="bg-white rounded-2xl p-6 shadow space-y-4">
          <input required maxLength={120} value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Story title" className="field"/>
          <textarea required minLength={10} maxLength={5000}
            value={story} onChange={e => setStory(e.target.value)}
            placeholder="Write your story..." rows={6} className="field"/>

          <label className="flex gap-2 items-center">
            <input type="checkbox" checked={related}
              onChange={e => setRelated(e.target.checked)}/>
            Is this story related to someone?
          </label>

          <label className="flex gap-2 items-center">
            <input type="checkbox" checked={tag}
              onChange={e => setTag(e.target.checked)}/>
            Would you like to tag someone?
          </label>

          {tag && (
            <input maxLength={100} value={tagName}
              onChange={e => setTagName(e.target.value)}
              placeholder="Enter person's name" className="field"/>
          )}

          <button disabled={loading}
            className="w-full rounded-xl bg-[#ffcb50] p-4 font-black text-[#49345f]">
            {loading ? "Submitting..." : "Submit Story"}
          </button>
          <p className="text-xs text-gray-500">
            Your story will only become public after approval.
          </p>
        </form>

        <section>
          <h2 className="text-2xl font-black text-[#49345f] mb-4">
            Community Stories
          </h2>
          <div className="space-y-4">
            {stories.map(item => (
              <article key={item.id}
                className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                  {item.story}
                </p>
                <p className="text-xs text-gray-400 mt-3">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </article>
            ))}
            {stories.length === 0 && (
              <p className="text-gray-500">No approved stories yet. Be the first!</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
