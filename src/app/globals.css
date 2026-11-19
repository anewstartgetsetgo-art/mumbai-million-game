
import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import StoryOfTheDay from "./components/StoryOfTheDay";
import { createClient } from "@/lib/supabase/server";

function HomeLoading() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-5">
      <div className="bg-[#fff9ec] rounded-3xl p-10 text-center max-w-xl w-full">
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

function Header({ loggedIn }: { loggedIn: boolean }) {
  return (
    <header className="w-full bg-white">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between min-h-[125px]">

        {/* Logo */}
        <Link
          href="/"
          className="bg-[#fff9ec] w-[145px] h-[125px] flex items-center justify-center shrink-0"
        >
          {/* Replace /logo.png with your actual logo filename */}
          <img
            src="/logo.png"
            alt="Mumbai Million"
            className="w-[85px] h-[85px] object-contain"
          />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center justify-end flex-wrap gap-x-7 gap-y-3 px-5 text-sm text-[#272345]">

          <Link href={loggedIn ? "/profile" : "/login"} className="hover:text-[#745e86]">
            {loggedIn ? "My Account" : "login"}
          </Link>

          <Link href="/stories" className="hover:text-[#745e86]">
            Stories
          </Link>

          <Link href={loggedIn ? "/game" : "/login"} className="hover:text-[#745e86]">
            Play Game
          </Link>

          <Link href="#daily-story" className="hover:text-[#745e86]">
            Story of the day
          </Link>

          <Link href="#about" className="hover:text-[#745e86]">
            About us
          </Link>

        </nav>
      </div>
    </header>
  );
}

async function HomeContent() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const gameStructuredData = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Mumbai Million",
    url: "https://mumbai-million-game.vercel.app/",
    description:
      "Mumbai Million is a casual flying dog game where players fly past rooftops, collect coins and share stories.",
    genre: "Casual",
    gamePlatform: "Web browser",
    inLanguage: "en",
  };

  return (
    <main id="top" className="min-h-screen bg-white">

      {/* SEO structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(gameStructuredData),
        }}
      />

      {/* Header */}
      <Header loggedIn={!!user} />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pb-20">

        {/* Hero Section */}
        <section className="mt-0 sm:mt-0 bg-[#fff9ec] rounded-none sm:rounded-b-[20px] p-7 sm:p-10 md:p-12 text-center shadow-sm">

          {/* Existing dog logo */}
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"
              alt="Mumbai Million dog"
              className="w-[85px] h-[85px] object-contain"
            />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-[54px] font-black text-[#49345f] leading-tight">
            Mumbai Million!
          </h1>

          <p className="mt-5 mb-7 text-base sm:text-lg text-[#52647b]">
            Fly past the rooftops, collect shiny coins and share your story.
          </p>

          <Link
            href={user ? "/game" : "/login"}
            className="block w-full max-w-[600px] mx-auto rounded-xl bg-[#ffcb50] p-4 sm:p-5 font-black text-lg text-[#49345f] hover:bg-[#f7bd38] transition"
          >
            Start your adventure →
          </Link>

          <div className="flex flex-wrap justify-center gap-7 mt-7 text-[#745e86] font-bold">

            <a
              href="#about"
              className="underline underline-offset-4"
            >
              Continue reading ↓
            </a>

            <Link
              href="/stories"
              className="underline underline-offset-4"
            >
              Read player stories →
            </Link>

          </div>

        </section>

        {/* Story of the Day */}
        <section
          id="daily-story"
          className="scroll-mt-8 mt-2 sm:mt-2 py-10 sm:py-12 flex justify-center"
        >

          <div className="w-full max-w-[480px] bg-[#fff9ec] p-5 sm:p-10">

            <Suspense
              fallback={
                <p className="text-center text-gray-600 py-10">
                  Loading Story of the Day...
                </p>
              }
            >
              <StoryOfTheDay />
            </Suspense>

          </div>

        </section>

        {/* Player Stories */}
        <section className="py-5 text-center">
          <Link
            href="/stories"
            className="text-[#745e86] text-lg font-bold underline underline-offset-4"
          >
            Read more player stories →
          </Link>
        </section>

        {/* About and SEO content */}
        <section
          id="about"
          className="max-w-3xl mx-auto mt-12 mb-10 bg-[#fff9ec] rounded-2xl p-7 sm:p-10 text-[#49345f] scroll-mt-8"
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
            Start your adventure in Mumbai Million and enjoy
            a playful flying experience. Explore the game
            and collect coins along the way.
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
