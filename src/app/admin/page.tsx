
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) redirect("/");

  const [profiles, stories, sessions, visits] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("stories").select("*").order("created_at", { ascending: false }),
    supabase.from("game_sessions").select("id,score,coins"),
    supabase.from("visit_events").select("id"),
  ]);

  const players = profiles.data || [];
  const allStories = stories.data || [];
  const pending = allStories.filter(s => s.status === "pending");

  return (
    <main className="min-h-screen bg-[#f5f1f7] p-5 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-black text-[#49345f]">
            🐾 Mumbai Million Admin
          </h1>
          <p className="text-gray-500 mt-2">
            Welcome, {user.email}
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["Players", players.length],
            ["Game sessions", sessions.data?.length || 0],
            ["Total stories", allStories.length],
            ["Pending stories", pending.length],
            ["Visit events", visits.data?.length || 0],
          ].map(([label, value]) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-3xl font-black text-[#49345f]">{value}</p>
            </div>
          ))}
        </div>

        <section className="bg-white rounded-2xl p-5 shadow-sm overflow-x-auto">
          <h2 className="text-xl font-black mb-4">Registered players</h2>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">Country</th>
                <th className="p-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {players.map(p => (
                <tr key={p.id} className="border-b">
                  <td className="p-3">{p.first_name} {p.last_name}</td>
                  <td className="p-3">{p.email}</td>
                  <td className="p-3">{p.mobile}</td>
                  <td className="p-3">{p.country}</td>
                  <td className="p-3">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-xl font-black">Story management</h2>
          {allStories.map(s => (
            <article key={s.id} className="border rounded-xl p-4 space-y-2">
              <div className="flex flex-wrap justify-between gap-2">
                <h3 className="font-bold">{s.title}</h3>
                <span className="text-sm text-purple-700">{s.status}</span>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{s.story}</p>
              <p className="text-xs text-gray-400">
                Related to someone: {s.related_to_someone ? "Yes" : "No"}
                {s.tagged_name ? ` · Tagged: ${s.tagged_name}` : ""}
              </p>
              <p className="text-xs text-gray-400">Player ID: {s.user_id}</p>

              {s.status === "pending" && (
                <div className="flex gap-2 flex-wrap">
                  <form action={`/api/admin/stories/${s.id}`} method="POST">
                    <input type="hidden" name="status" value="approved"/>
                    <button className="bg-green-600 text-white rounded-lg px-4 py-2">
                      Approve
                    </button>
                  </form>
                  <form action={`/api/admin/stories/${s.id}`} method="POST">
                    <input type="hidden" name="status" value="rejected"/>
                    <button className="bg-red-600 text-white rounded-lg px-4 py-2">
                      Reject
                    </button>
                  </form>
                </div>
              )}
            </article>
          ))}
          {allStories.length === 0 && <p>No stories submitted yet.</p>}
        </section>
      </div>
    </main>
  );
}
