
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function GamePage() {
  const router = useRouter();
  const supabase = createClient();
  const [score, setScore] = useState<number | null>(null);
  const [coins, setCoins] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function checkProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      const { data } = await supabase.from("profiles")
        .select("id").eq("id", user.id).maybeSingle();

      if (!data) router.replace("/profile");
    }

    checkProfile();
  }, []);

  useEffect(() => {
    async function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "GAME_OVER") return;
      if (score !== null) return;

      const finalScore = Math.max(0, Math.floor(event.data.score || 0));
      const finalCoins = Math.max(0, Math.floor(event.data.coins || 0));

      setScore(finalScore);
      setCoins(finalCoins);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("game_sessions").insert({
        user_id: user.id,
        score: finalScore,
        coins: finalCoins,
      });

      if (!error) setSaved(true);
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [score]);

  return (
    <main className="min-h-screen bg-[#f4bca8] p-3 md:p-6">
      <div className="max-w-5xl mx-auto bg-[#fff9ec] rounded-3xl overflow-hidden shadow-xl">
        <header className="p-5 flex justify-between items-center">
          <h1 className="font-black text-2xl text-[#49345f]">🐾 Mumbai Million</h1>
          <button onClick={() => router.push("/stories")}
            className="text-[#745e86] font-bold">Stories</button>
        </header>

        <iframe
          src="/game.html"
          title="Mumbai Million flying dog game"
          className="w-full border-0 block"
          style={{ height: "min(75vh, 650px)", minHeight: "480px" }}
        />

        {score !== null && (
          <div className="p-8 text-center">
            <h2 className="text-3xl font-black text-[#49345f]">
              What a flight! 🐾
            </h2>
            <p className="text-4xl font-black text-[#e47c69] mt-3">
              {score.toLocaleString()} points
            </p>
            <p className="text-gray-600 mt-2">Coins collected: {coins}</p>
            <p className="text-sm text-gray-500 mt-2">
              {saved ? "Your game has been recorded." : "Saving your game..."}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <button onClick={() => window.location.reload()}
                className="rounded-xl bg-[#ffcb50] px-6 py-3 font-black">
                ↻ Restart
              </button>
              <button onClick={() => router.push("/stories")}
                className="rounded-xl bg-[#573c85] text-white px-6 py-3 font-black">
                Share Your Story ✨
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
