import { NextRequest, NextResponse } from "next/server";
import { demoShoes } from "@/lib/data/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function decodeHtml(value: string) {
  return value
    .replaceAll("\\u002F", "/")
    .replaceAll("\\/", "/")
    .replaceAll("&amp;", "&")
    .replaceAll("&#38;", "&")
    .replaceAll("&quot;", '"');
}

function candidateUrls(html: string, baseUrl: string) {
  const decoded = decodeHtml(html);
  const absolute = decoded.match(/https?:\/\/[^\s"'<>]+/g) ?? [];
  const quoted = Array.from(decoded.matchAll(/(?:src|srcset|data-src|data-zoom-image|content)=["']([^"']+)["']/gi)).map((match) => match[1]);
  const all = [...absolute, ...quoted.flatMap((value) => value.split(/\s*,\s*/).map((part) => part.trim().split(/\s+/)[0]))];
  const urls: string[] = [];
  for (const raw of all) {
    if (!raw || raw.startsWith("data:")) continue;
    try {
      const url = new URL(raw, baseUrl).toString();
      if (!/\.(?:png|jpe?g|webp|avif)(?:\?|$)/i.test(url) && !/(?:image|cdn|media|scene7|cloudinary|akamai|contentful|static)/i.test(url)) continue;
      urls.push(url);
    } catch {
      // Ignore malformed candidate URLs.
    }
  }
  return Array.from(new Set(urls));
}

function relevance(url: string, shoe: (typeof demoShoes)[number]) {
  const hay = decodeURIComponent(url).toLowerCase();
  let score = 0;
  const slugParts = shoe.slug.split("-").filter((part) => part.length > 2);
  for (const part of slugParts) if (hay.includes(part)) score += 3;
  const sourceTokens = shoe.sourceUrl?.match(/[A-Z]{1,4}\d{3,}[A-Z0-9-]*/gi) ?? [];
  for (const token of sourceTokens) if (hay.includes(token.toLowerCase())) score += 8;
  if (/product|gallery|footwear|shoe|running/i.test(hay)) score += 2;
  if (/logo|icon|banner|sprite|payment|flag|avatar|review|video/i.test(hay)) score -= 10;
  return score;
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  const shoe = demoShoes.find((item) => item.slug === slug);
  if (!shoe || !shoe.sourceUrl) return NextResponse.json({ error: "Unknown shoe or missing source URL" }, { status: 404 });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    const response = await fetch(shoe.sourceUrl, {
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36",
        accept: "text/html,application/xhtml+xml",
      },
      cache: "no-store",
    });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`Source returned ${response.status}`);
    const html = await response.text();
    const candidates = candidateUrls(html, shoe.sourceUrl)
      .map((url) => ({ url, score: relevance(url, shoe) }))
      .filter((item) => item.score > -5)
      .sort((a, b) => b.score - a.score)
      .slice(0, 80);

    return NextResponse.json({
      slug: shoe.slug,
      model: shoe.model,
      sourceUrl: shoe.sourceUrl,
      candidates,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Discovery failed" }, { status: 502 });
  }
}
