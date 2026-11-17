import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");

  const supabase = await createClient();

  if (code) {
    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Admin login: return to the admin dashboard.
        if (next === "/admin") {
          return NextResponse.redirect(
            new URL("/admin", url.origin)
          );
        }

        // Normal player login: preserve existing behaviour.
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        return NextResponse.redirect(
          new URL(profile ? "/game" : "/profile", url.origin)
        );
      }
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=auth", url.origin)
  );
}