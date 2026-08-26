import { NextRequest } from "next/server";
import { GET as resolveStrictImage } from "@/app/api/strict-shoe-image/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type View = "Side" | "Top" | "Outsole";
const VIEWS: View[] = ["Side", "Top", "Outsole"];

type VerifiedResult = {
  view: View;
  response: Response;
  family: string;
  candidate: string;
};

async function resolveOne(request: NextRequest, view: View): Promise<VerifiedResult | null> {
  const url = new URL("/api/strict-shoe-image", request.nextUrl.origin);
  for (const [key, value] of request.nextUrl.searchParams) {
    if (key !== "view") url.searchParams.set(key, value);
  }
  url.searchParams.set("view", view);

  const response = await resolveStrictImage(new NextRequest(url));
  if (!response.ok) return null;

  const contentType = response.headers.get("content-type") ?? "";
  const evidence = Number(response.headers.get("x-runned-angle-evidence") ?? "0");
  const method = response.headers.get("x-runned-verification-method");
  const verifiedView = response.headers.get("x-runned-image-view");
  const family = response.headers.get("x-runned-image-family") ?? "";
  const candidate = response.headers.get("x-runned-image-candidate") ?? "";

  if (
    !contentType.startsWith("image/png") ||
    evidence < 30 ||
    method !== "metadata" ||
    verifiedView !== view ||
    !family ||
    !candidate
  ) return null;

  return { view, response, family, candidate };
}

export async function GET(request: NextRequest) {
  const requestedView = request.nextUrl.searchParams.get("view") as View | null;
  if (!requestedView || !VIEWS.includes(requestedView)) {
    return new Response("Invalid verified shoe image request", { status: 400 });
  }

  const results = await Promise.all(VIEWS.map((view) => resolveOne(request, view)));
  if (results.some((result) => !result)) {
    return new Response("Complete gallery did not pass angle verification", {
      status: 422,
      headers: { "cache-control": "public, max-age=900, s-maxage=900" },
    });
  }

  const verified = results as VerifiedResult[];
  if (new Set(verified.map((result) => result.family)).size !== 1) {
    return new Response("Gallery image family mismatch", { status: 422 });
  }
  if (new Set(verified.map((result) => result.candidate)).size !== 3) {
    return new Response("Gallery views are not unique", { status: 422 });
  }

  const selected = verified.find((result) => result.view === requestedView)!;
  const body = await selected.response.arrayBuffer();
  const headers = new Headers(selected.response.headers);
  headers.set("x-runned-gallery-verified", "true");
  headers.set("x-runned-gallery-verification", "metadata-all-three");
  headers.set("cache-control", "public, max-age=604800, s-maxage=2592000, stale-while-revalidate=604800");
  return new Response(body, { status: 200, headers });
}
