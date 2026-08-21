import { gallerySourceOverrideFor } from "@/lib/data/gallery-source-overrides";
import type { DemoShoe, ShoeImageView } from "@/lib/types";

type Candidate = ShoeImageView & { score: number };

const BAD_TOKENS = [
  "logo", "icon", "sprite", "payment", "badge", "avatar", "banner", "placeholder",
  "loader", "rating", "star", "flag", "favicon", "tracking", "pixel", "qr-code",
  "size-chart", "sizechart", "shipping", "store-logo", "merchant",
];

const IMAGE_HOSTS = [
  "static.nike.com", "assets.nike.com", "assets.adidas.com", "images.asics.com",
  "images.puma.com", "images.ctfassets.net", "cdn.shopify.com", "cdn.shopifycdn.net",
  "scene7.com", "bigcommerce.com", "paceathletic.com", "startinglane.co.id",
  "ncrsport.com", "blibli.com", "susercontent.com", "store-assets.com", "hoka.com",
  "brooksrunning.com", "saucony.com", "holabirdsports.com", "bike24.com",
  "prodirectsport.com", "run4it.com", "fleetfeet.com", "fit2run.com",
  "sportinglife.ca", "sportsshoes.com", "therunnersshop.com.au", "runpacers.com",
];

const cache = new Map<string, Promise<ShoeImageView[]>>();

function decodeHtml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x2F;", "/")
    .replaceAll("&#47;", "/")
    .replaceAll("\\u002F", "/")
    .replaceAll("\\u0026", "&")
    .replaceAll("\\/", "/");
}

function absoluteUrl(value: string, base: string) {
  const cleaned = decodeHtml(value.trim()).replace(/^['\"]|['\"]$/g, "");
  if (!cleaned || cleaned.startsWith("data:")) return null;
  try {
    return new URL(cleaned, base).toString();
  } catch {
    return null;
  }
}

function looksLikeImage(url: string) {
  const lower = url.toLowerCase();
  if (BAD_TOKENS.some((token) => lower.includes(token))) return false;
  if (/\.(?:png|jpe?g|webp|avif)(?:[?#]|$)/i.test(url)) return true;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return IMAGE_HOSTS.some((known) => host === known || host.endsWith(`.${known}`));
  } catch {
    return false;
  }
}

function angleFrom(text: string): ShoeImageView["label"] {
  const lower = text.toLowerCase();
  if (/(outsole|sole view|bottom view|sb[_-]?bt|phsuh|phsul|_sole|bottom)/.test(lower)) return "Outsole";
  if (/(top view|overhead|sb[_-]?tp|phcth|top[_-]|_top)/.test(lower)) return "Top";
  if (/(rear|heel view|back view|phcbh|_rear|_heel)/.test(lower)) return "Rear";
  if (/(side|lateral|sr[_-]?rt|phsrh|sv01|hero|lateral view)/.test(lower)) return "Side";
  return "Alternate";
}

function modelTokens(shoe: DemoShoe) {
  return `${shoe.brand} ${shoe.model}`
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 3 && !["the", "men", "women", "shoe", "shoes", "running"].includes(token));
}

function skuTokens(shoe: DemoShoe) {
  const urls = [gallerySourceOverrideFor(shoe.slug), shoe.currentPrice?.sourceUrl, shoe.sourceUrl].filter(Boolean) as string[];
  const tokens = new Set<string>();
  for (const value of urls) {
    for (const match of value.matchAll(/[A-Z]{1,5}\d{3,}[A-Z0-9-]*/gi)) tokens.add(match[0].toLowerCase());
  }
  return [...tokens];
}

function scoreCandidate(url: string, context: string, shoe: DemoShoe) {
  const text = `${url} ${context}`.toLowerCase();
  let score = 0;
  const tokens = modelTokens(shoe);
  const sku = skuTokens(shoe);

  for (const token of tokens) if (text.includes(token)) score += 2;
  for (const token of sku) if (text.includes(token)) score += 8;
  if (angleFrom(text) !== "Alternate") score += 5;
  if (/product|pdp|gallery|footwear|shoe|running/.test(text)) score += 2;
  if (/thumbnail|thumb|small|swatch/.test(text)) score -= 2;
  if (/1200|1600|1800|2000|2400|3000|3840/.test(text)) score += 1;

  try {
    const source = gallerySourceOverrideFor(shoe.slug) ?? shoe.currentPrice?.sourceUrl ?? shoe.sourceUrl;
    if (source && new URL(source).hostname === new URL(url).hostname) score += 2;
  } catch {}

  return score;
}

function addCandidate(map: Map<string, Candidate>, url: string | null, context: string, shoe: DemoShoe) {
  if (!url || !looksLikeImage(url)) return;
  const score = scoreCandidate(url, context, shoe);
  if (score < 1) return;
  const label = angleFrom(`${context} ${url}`);
  const current = map.get(url);
  if (!current || score > current.score) map.set(url, { label, url, score });
}

function extractFromHtml(html: string, pageUrl: string, shoe: DemoShoe) {
  const map = new Map<string, Candidate>();

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const alt = tag.match(/(?:alt|title)=["']([^"']*)["']/i)?.[1] ?? "";
    for (const attribute of ["src", "data-src", "data-original", "data-zoom-image", "data-image"]) {
      const value = tag.match(new RegExp(`${attribute}=["']([^"']+)["']`, "i"))?.[1];
      if (value) addCandidate(map, absoluteUrl(value, pageUrl), alt, shoe);
    }
    const srcset = tag.match(/(?:srcset|data-srcset)=["']([^"']+)["']/i)?.[1];
    if (srcset) {
      for (const item of srcset.split(",")) {
        const value = item.trim().split(/\s+/)[0];
        addCandidate(map, absoluteUrl(value, pageUrl), alt, shoe);
      }
    }
  }

  const decoded = decodeHtml(html);
  for (const match of decoded.matchAll(/https?:\/\/[^\s"'<>\\]+/gi)) {
    addCandidate(map, absoluteUrl(match[0], pageUrl), "embedded product gallery", shoe);
  }

  return [...map.values()].sort((a, b) => b.score - a.score);
}

function selectThree(staticImages: ShoeImageView[], extracted: Candidate[]) {
  const combined: Candidate[] = [];
  const seen = new Set<string>();
  for (const image of staticImages) {
    if (!image.url || seen.has(image.url)) continue;
    seen.add(image.url);
    combined.push({ ...image, score: 100 });
  }
  for (const image of extracted) {
    if (seen.has(image.url)) continue;
    seen.add(image.url);
    combined.push(image);
  }

  const picked: ShoeImageView[] = [];
  const pick = (labels: ShoeImageView["label"][]) => {
    const candidate = combined.find((item) => labels.includes(item.label) && !picked.some((pickedItem) => pickedItem.url === item.url));
    if (candidate) picked.push({ label: candidate.label, url: candidate.url });
  };

  pick(["Side"]);
  pick(["Top"]);
  pick(["Outsole"]);
  while (picked.length < 3) {
    const candidate = combined.find((item) => !picked.some((pickedItem) => pickedItem.url === item.url));
    if (!candidate) break;
    picked.push({ label: candidate.label, url: candidate.url });
  }

  if (picked.length > 0 && picked[0].label !== "Side") picked[0] = { ...picked[0], label: "Side" };
  return picked.slice(0, 3);
}

async function resolve(shoe: DemoShoe) {
  const overridePage = gallerySourceOverrideFor(shoe.slug);
  const staticImages = overridePage ? [] : shoe.images;
  if (!overridePage && shoe.images.length >= 3) return selectThree(shoe.images, []);

  const pageUrl = overridePage ?? shoe.currentPrice?.sourceUrl ?? shoe.sourceUrl;
  if (!pageUrl || !/^https?:\/\//i.test(pageUrl)) return selectThree(staticImages, []);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const response = await fetch(pageUrl, {
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; Runned/1.0; +https://runned.app)",
        accept: "text/html,application/xhtml+xml",
      },
      next: { revalidate: 86400 },
    });
    clearTimeout(timeout);
    if (!response.ok) return selectThree(staticImages, []);
    const html = await response.text();
    return selectThree(staticImages, extractFromHtml(html, pageUrl, shoe));
  } catch {
    return selectThree(staticImages, []);
  }
}

export function resolveShoeGallery(shoe: DemoShoe) {
  const existing = cache.get(shoe.slug);
  if (existing) return existing;
  const pending = resolve(shoe);
  cache.set(shoe.slug, pending);
  return pending;
}
