
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState("India");
  const [loading, setLoading] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      first_name: first.trim(),
      last_name: last.trim(),
      mobile: mobile.trim(),
      country: country.trim(),
      email: user.email,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/game");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f4bca8] p-5">
      <form onSubmit={saveProfile}
        className="bg-[#fff9ec] rounded-3xl p-8 w-full max-w-lg shadow-xl space-y-4">
        <h1 className="text-3xl font-black text-[#49345f]">
          Complete your profile 🐾
        </h1>
        <input required maxLength={60} placeholder="First name"
          value={first} onChange={e => setFirst(e.target.value)}
          className="field"/>
        <input required maxLength={60} placeholder="Last name"
          value={last} onChange={e => setLast(e.target.value)}
          className="field"/>
        <input required maxLength={20} placeholder="Mobile number"
          value={mobile} onChange={e => setMobile(e.target.value)}
          className="field"/>
        <input required maxLength={80} placeholder="Country"
          value={country} onChange={e => setCountry(e.target.value)}
          className="field"/>
        <button disabled={loading}
          className="w-full rounded-xl bg-[#ffcb50] p-4 font-black text-[#49345f]">
          {loading ? "Saving..." : "Save profile and continue →"}
        </button>
      </form>
    </main>
  );
}
