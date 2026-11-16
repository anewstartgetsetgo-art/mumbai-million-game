
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
        <Link href={user ? "/game" : "/login"}
          className="block rounded-xl bg-[#ffcb50] p-4 font-black text-[#49345f]">
          Start your adventure →
        </Link>
        <Link href="/stories" className="block mt-5 underline text-[#745e86]">
          Read player stories
        </Link>
      </div>
    </main>
  );
}
