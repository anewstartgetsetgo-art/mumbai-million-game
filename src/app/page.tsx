
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
      </div>
    </main>
  );
}

async function HomeContent() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#ffe4b7] to-[#a777a8] p-5">
      <div className="max-w-xl mx-auto space-y-6">

        {/* Welcome section */}
        <section
  id="top"
  className="bg-[#fff9ec] rounded-[32px] p-8 sm:p-10 text-center shadow-2xl"
>

          <div className="text-7xl mb-4">🐶</div>

          <h1 className="text-4xl sm:text-5xl font-black text-[#49345f]">
            Mumbai Million!
          </h1>

          <p className="my-5 text-gray-600 leading-7">
            Fly past the rooftops, collect shiny coins
            and share your story.
          </p>

          <Link
            href={user ? "/game" : "/login"}
            className="block rounded-xl bg-[#ffcb50] p-4 font-black text-[#49345f] hover:bg-[#f7bd38] transition"
          >
            Start your adventure →
          </Link>

          <a
            href="#about"
            className="inline-block mt-6 text-[#745e86] font-bold underline underline-offset-4"
          >
            Continue reading ↓
          </a>

        </section>

        {/* SEO and game information */}
        <section
          id="about"
          className="bg-[#fff9ec] rounded-[32px] p-8 sm:p-10 shadow-xl text-[#49345f] scroll-mt-6"
        >

          <h2 className="text-2xl font-black mb-4">
            Welcome to Mumbai Million!
          </h2>

          <p className="text-gray-600 leading-7">
            Mumbai Million is a fun casual flying dog game.
            Take your dog on an adventure, fly past rooftops
            and collect shiny coins as you play.
          </p>

          <h2 className="text-xl font-bold mt-7 mb-3">
            Play, Collect and Explore
          </h2>

          <p className="text-gray-600 leading-7">
            Start your adventure in Mumbai Million and
            enjoy a playful flying experience. Explore
            the game and collect coins along the way.
          </p>

          <h2 className="text-xl font-bold mt-7 mb-3">
            Discover Player Stories
          </h2>

          <p className="text-gray-600 leading-7">
            Explore stories shared by players and discover
            more of the Mumbai Million community.
          </p>

          <Link
            href="/stories"
            className="inline-block mt-5 font-bold text-[#745e86] underline underline-offset-4"
          >
            Read player stories →
          </Link>

          <a
            href="#top"
            className="block mt-8 text-center font-bold text-[#745e86] underline underline-offset-4"
          >
            Back to top ↑
          </a>

        </section>

        {/* Story of the Day */}
        <section
          id="daily-story"
          className="bg-[#fff9ec] rounded-[32px] p-8 shadow-xl"
        >
          <Suspense
            fallback={
              <p className="text-center text-gray-600">
                Loading Story of the Day...
              </p>
            }
          >
            <StoryOfTheDay />
          </Suspense>
        </section>

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
