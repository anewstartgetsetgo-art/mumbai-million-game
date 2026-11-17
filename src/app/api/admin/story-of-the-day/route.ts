
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  // Verify logged-in user.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Please log in." },
      { status: 401 }
    );
  }

  // Verify administrator.
  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    return NextResponse.json(
      { error: "Administrator access required." },
      { status: 403 }
    );
  }

  const formData = await request.formData();

  const storyId = String(formData.get("story_id") || "");
  const featuredDate = String(
    formData.get("featured_date") || ""
  );

  // Validate inputs.
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(storyId) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(featuredDate)
  ) {
    return NextResponse.json(
      { error: "Invalid story or date." },
      { status: 400 }
    );
  }

  const parsedDate = new Date(`${featuredDate}T00:00:00Z`);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== featuredDate
  ) {
    return NextResponse.json(
      { error: "Invalid calendar date." },
      { status: 400 }
    );
  }

  // Confirm that the story is approved.
  const { data: story, error: storyError } = await supabase
    .from("stories")
    .select("id")
    .eq("id", storyId)
    .eq("status", "approved")
    .maybeSingle();

  if (storyError || !story) {
    return NextResponse.json(
      { error: "Only approved stories can be featured." },
      { status: 400 }
    );
  }

  // Save or replace the selected story for this date.
  const { error } = await supabase
    .from("story_of_the_day")
    .upsert(
      {
        featured_date: featuredDate,
        story_id: storyId,
      },
      {
        onConflict: "featured_date",
      }
    );

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.redirect(
    new URL("/admin?featured=success", request.url),
    303
  );
}
