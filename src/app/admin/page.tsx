
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";

function AdminLoading() {
  return (
    <main className="min-h-screen bg-[#f5f1f7] flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl p-8 shadow text-center">
        <p className="text-xl font-bold text-[#49345f]">
          Loading Mumbai Million Admin...
        </p>
      </div>
    </main>
  );
}

async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ featured?: string }>;
}) {
  // Wait until the actual request starts.
  await connection();

  const params = await searchParams;

  const supabase = await createClient();

  // Verify logged-in user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
  redirect("/login?next=/admin");
}

  // Verify admin permission
  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

 if (adminError) {
  console.error("ADMIN QUERY ERROR:", {
    message: adminError.message,
    code: adminError.code,
    details: adminError.details,
    hint: adminError.hint,
  });

  redirect("/?admin_error=query");
}

if (!admin) {
  console.error("ADMIN RECORD NOT FOUND");
  redirect("/?admin_error=not_found");
}

  // Fetch dashboard information
  const [profiles, stories, sessions, visits] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("game_sessions")
        .select("id, score, coins"),

      supabase
        .from("visit_events")
        .select("id"),
    ]);

  const players = profiles.data || [];
  const allStories = stories.data || [];
  const pending = allStories.filter(
    (story) => story.status === "pending"
  );

  return (
    <main className="min-h-screen bg-[#f5f1f7] p-5 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Success message */}
        {params.featured === "success" && (
          <p className="rounded-xl bg-green-100 p-4 font-bold text-green-800">
            ⭐ Story of the Day updated successfully!
          </p>
        )}

        {/* Header */}
        <header>
          <h1 className="text-3xl font-black text-[#49345f]">
            🐾 Mumbai Million Admin
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome, {user.email}
          </p>
        </header>

        {/* Dashboard statistics */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">

          {[
            ["Players", players.length],
            ["Game sessions", sessions.data?.length || 0],
            ["Total stories", allStories.length],
            ["Pending stories", pending.length],
            ["Visit events", visits.data?.length || 0],
          ].map(([label, value]) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-5 shadow-sm"
            >
              <p className="text-sm text-gray-500">
                {label}
              </p>

              <p className="text-3xl font-black text-[#49345f]">
                {value}
              </p>
            </div>
          ))}

        </section>

        {/* Registered players */}
        <section className="bg-white rounded-2xl p-5 shadow-sm overflow-x-auto">

          <h2 className="text-xl font-black mb-4">
            Registered Players
          </h2>

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
              {players.map((player) => (
                <tr key={player.id} className="border-b">

                  <td className="p-3">
                    {player.first_name} {player.last_name}
                  </td>

                  <td className="p-3">
                    {player.email}
                  </td>

                  <td className="p-3">
                    {player.mobile}
                  </td>

                  <td className="p-3">
                    {player.country}
                  </td>

                  <td className="p-3">
                    {player.created_at
                      ? new Date(player.created_at).toLocaleDateString()
                      : "-"}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {players.length === 0 && (
            <p className="text-gray-500 py-4">
              No registered players yet.
            </p>
          )}

        </section>

        {/* Story management */}
        <section className="bg-white rounded-2xl p-5 shadow-sm space-y-4">

          <h2 className="text-xl font-black">
            Story Management
          </h2>

          {allStories.map((story) => (

            <article
              key={story.id}
              className="border rounded-xl p-4 space-y-3"
            >

              {/* Story heading */}
              <div className="flex flex-wrap justify-between gap-2">

                <h3 className="font-bold">
                  {story.title}
                </h3>

                <span className="text-sm text-purple-700">
                  {story.status}
                </span>

              </div>

              {/* Story content */}
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {story.story}
              </p>

              <p className="text-xs text-gray-400">
                Related to someone:{" "}
                {story.related_to_someone ? "Yes" : "No"}

                {story.tagged_name
                  ? ` · Tagged: ${story.tagged_name}`
                  : ""}
              </p>

              <p className="text-xs text-gray-400">
                Player ID: {story.user_id}
              </p>

              {/* Approve and reject */}
              {story.status === "pending" && (

                <div className="flex gap-2 flex-wrap">

                  <form
                    action={`/api/admin/stories/${story.id}`}
                    method="POST"
                  >
                    <input
                      type="hidden"
                      name="status"
                      value="approved"
                    />

                    <button
                      type="submit"
                      className="bg-green-600 text-white rounded-lg px-4 py-2 font-semibold"
                    >
                      Approve
                    </button>
                  </form>

                  <form
                    action={`/api/admin/stories/${story.id}`}
                    method="POST"
                  >
                    <input
                      type="hidden"
                      name="status"
                      value="rejected"
                    />

                    <button
                      type="submit"
                      className="bg-red-600 text-white rounded-lg px-4 py-2 font-semibold"
                    >
                      Reject
                    </button>
                  </form>

                </div>
              )}

              {/* Story of the Day */}
              {story.status === "approved" && (

                <form
                  action="/api/admin/story-of-the-day"
                  method="POST"
                  className="mt-4 flex flex-wrap items-end gap-3 border-t pt-4"
                >

                  <input
                    type="hidden"
                    name="story_id"
                    value={story.id}
                  />

                  <div className="space-y-1">

                    <label
                      htmlFor={`featured-${story.id}`}
                      className="block text-sm font-semibold"
                    >
                      Feature this story on:
                    </label>

                    <input
                      id={`featured-${story.id}`}
                      type="date"
                      name="featured_date"
                      required
                      className="rounded-lg border p-2"
                    />

                  </div>

                  <button
                    type="submit"
                    className="rounded-lg bg-[#49345f] px-5 py-2 font-bold text-white"
                  >
                    ⭐ Make Story of the Day
                  </button>

                </form>
              )}

            </article>

          ))}

          {allStories.length === 0 && (
            <p className="text-gray-500">
              No stories submitted yet.
            </p>
          )}

        </section>

      </div>
    </main>
  );
}

export default function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ featured?: string }>;
}) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminDashboard searchParams={searchParams} />
    </Suspense>
  );
}
