import { NextRequest } from "next/server";
import { GET as runAuditPage } from "../route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: NextRequest, context: { params: Promise<{ page: string }> }) {
  const { page } = await context.params;
  const pageIndex = Math.max(0, Number.parseInt(page, 10) || 0);
  const url = new URL("/api/gallery-runtime-audit", request.nextUrl.origin);
  url.searchParams.set("offset", String(pageIndex * 5));
  url.searchParams.set("limit", "5");
  return runAuditPage(new NextRequest(url));
}
