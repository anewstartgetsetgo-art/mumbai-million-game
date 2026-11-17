"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  async function login() {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");

    const callbackUrl = new URL(
      "/auth/callback",
      window.location.origin
    );

    // Only allow the intended admin destination.
    if (next === "/admin") {
      callbackUrl.searchParams.set("next", "/admin");
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
        queryParams: { access_type: "offline" },
      },
    });

    if (error) alert(error.message);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f4bca8] p-5">
      <div className="bg-[#fff9ec] rounded-3xl p-10 text-center shadow-2xl max-w-md w-full">
        <div className="text-5xl mb-4">🐾</div>

        <h1 className="text-4xl font-black text-[#49345f]">
          Mumbai Million
        </h1>

        <p className="my-5 text-gray-600">
          Sign in and start your flying adventure!
        </p>

        <button
          onClick={login}
          className="w-full rounded-xl bg-[#ffcb50] p-4 font-black text-[#49345f]"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}