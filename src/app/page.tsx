
import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import StoryOfTheDay from "./components/StoryOfTheDay";
import { createClient } from "@/lib/supabase/server";

function HomeLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#ffe4b7] to-[#a777a8] flex items-center justify-center p-5">
      <div className="bg-[#fff9ec] rounded-[32px] p-10 text-center max-w-xl w-full shadow-2xl">
        <div className="text-5xl mb-4">🐶</div>
        <h1 className="text-3xl font-black text-[#49345f]">
          Mumbai Million!
        </h1>
        <p className="mt-4 text-gray-600">
          Loading your adventure...
        </p>
        <p className="my-5 text-gray-600">
  Fly past the rooftops, collect shiny coins and share your story.
</p>
        
<section className="mt-8 text-left text-[#49345f]">
  <h2 className="text-2xl font-black mb-3">
    Welcome to Mumbai Million!
  </h2>

  <p className="text-gray-600 leading-7">
    Mumbai Million is a fun casual flying dog game.
    Take your dog on an adventure, fly past rooftops,
    collect shiny coins and enjoy the experience.
  </p>

  <h2 className="text-xl font-bold mt-6 mb-2">
    Play, Collect and Share
  </h2>

  <p className="text-gray-600 leading-7">
    Start your adventure in Mumbai Million, collect
    coins as you play and share your stories with
    other players.
  </p>

  <h2 className="text-xl font-bold mt-6 mb-2">
    Discover Player Stories
  </h2>

  <p className="text-gray-600 leading-7">
    Explore the stories shared by players and discover
    more of the Mumbai Million community.
  </p>
</section>

      </div>
    </main>
  );
}

async function HomeContent() {
  // Wait for an actual request before accessing dynamic data.
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#ffe4b7] to-[#a777a8] flex items-center justify-center p-5">
      <div className="bg-[#fff9ec] rounded-[32px] p-10 text-center max-w-xl w-full shadow-2xl">

        <div className="text-7xl mb-4">🐶</div>

        <h1 className="text-5xl font-black text-[#49345f]">
          Mumbai Million!
        </h1>

        <p className="my-5 text-gray-600">
          Fly past the rooftops, collect shiny coins and share your story.
        </p>

        <Link
          href={user ? "/game" : "/login"}
          className="block rounded-xl bg-[#ffcb50] p-4 font-black text-[#49345f]"
        >
          Start your adventure →
        </Link>

        <div className="mt-6">
          <Suspense fallback={<p>Loading Story of the Day...</p>}>
            <StoryOfTheDay />
          </Suspense>
        </div>

        <Link
          href="/stories"
          className="block mt-5 underline text-[#745e86]"
        >
          Read player stories
        </Link>

      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}
