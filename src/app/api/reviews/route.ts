import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ratingFields = ["softness", "energy_return", "stability", "fit_width", "toe_box", "heel_lockdown", "grip", "durability", "breathability", "value"] as const;

function unavailable(message = "Reviews are unavailable in this preview.", status = 503) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("shoe");
  if (!slug) return unavailable("Missing shoe slug.", 400);

  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    const { data: shoe } = await supabase.from("shoes").select("id").eq("slug", slug).maybeSingle();

    if (!shoe) {
      return NextResponse.json({ authenticated: Boolean(auth.user), configured: true, catalogSynced: false, reviews: [] });
    }

    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("id,rating_overall,would_buy_again,summary,body,created_at")
      .eq("shoe_id", shoe.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) return unavailable(error.message, 500);
    return NextResponse.json({ authenticated: Boolean(auth.user), configured: true, catalogSynced: true, reviews: reviews ?? [] });
  } catch {
    return NextResponse.json({ authenticated: false, configured: false, catalogSynced: false, reviews: [] });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth.user) return unavailable("Sign in to add a review.", 401);

    const input = await request.json();
    const slug = String(input.shoe ?? "");
    if (!slug) return unavailable("Missing shoe slug.", 400);

    const { data: shoe } = await supabase.from("shoes").select("id").eq("slug", slug).maybeSingle();
    if (!shoe) return unavailable("This shoe is not synced to the review database yet.", 409);

    const overall = Number(input.rating_overall);
    if (!Number.isFinite(overall) || overall < 1 || overall > 5) return unavailable("Overall rating must be between 1 and 5.", 400);

    const structured: Record<string, number> = {};
    for (const field of ratingFields) {
      const value = Number(input[field]);
      if (!Number.isInteger(value) || value < 1 || value > 5) return unavailable(`${field.replaceAll("_", " ")} must be between 1 and 5.`, 400);
      structured[field] = value;
    }

    const payload = {
      shoe_id: shoe.id,
      user_id: auth.user.id,
      rating_overall: overall,
      ...structured,
      would_buy_again: Boolean(input.would_buy_again),
      summary: String(input.summary ?? "").trim().slice(0, 160) || null,
      body: String(input.body ?? "").trim().slice(0, 4000) || null,
    };

    const { error } = await supabase.from("reviews").upsert(payload, { onConflict: "shoe_id,user_id" });
    if (error) return unavailable(error.message, 500);
    return NextResponse.json({ ok: true });
  } catch {
    return unavailable();
  }
}
