
import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";

function getIndiaDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export default async function StoryOfTheDay() {
  await connection();

  const supabase = await createClient();
  const today = getIndiaDate();

  // First check whether the admin manually selected a story.
  const { data: featured } = await supabase
    .from("story_of_the_day")
    .select("story_id")
    .eq("featured_date", today)
    .maybeSingle();

  let story = null;

  if (featured?.story_id) {
    const { data } = await supabase
      .from("stories")
      .select("id, title, story, created_at")
      .eq("id", featured.story_id)
      .eq("status", "approved")
      .maybeSingle();

    story = data;
  }

  // Otherwise automatically select a story for today.
  if (!story) {
    const { data: stories } = await supabase
      .from("stories")
      .select("id, title, story, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: true });

    if (stories && stories.length > 0) {
      // Stable selection for the entire Indian calendar day.
      const dateNumber = Number(today.replaceAll("-", ""));
      const index = dateNumber % stories.length;
      story = stories[index];
    }
  }

  if (!story) {
    return (
      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="rounded-3xl bg-[#fff9ec] p-10 text-center shadow-lg">
          <div className="mb-4 text-5xl">📖</div>
          <h2 className="text-3xl font-black text-[#49345f]">
            Story of the Day
          </h2>
          <p className="mt-3 text-gray-600">
            An inspiring story is coming soon. Stay tuned!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-5 py-12">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#fff9ec] to-[#f8d9d0] shadow-xl">

        <div className="bg-[#49345f] px-6 py-4 text-center text-white">
          <p className="text-sm font-bold uppercase tracking-[0.2em]">
            ✨ Mumbai Million Presents ✨
          </p>
          <h2 className="mt-2 text-3xl font-black">
            Story of the Day
          </h2>
        </div>

        <div className="p-7 md:p-12">
          <div className="mb-5 text-5xl">📖</div>

          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#a36d37]">
            Today's featured story
          </p>

          <h3 className="mb-6 text-3xl font-black text-[#49345f] md:text-4xl">
            {story.title}
          </h3>

          <div className="whitespace-pre-wrap text-base leading-8 text-gray-700">
            {story.story}
          </div>

          <div className="mt-8 border-t border-[#49345f]/20 pt-5">
            <p className="text-sm font-semibold text-[#49345f]">
              ❤️ Shared by the Mumbai Million community
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Featured on {today}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
