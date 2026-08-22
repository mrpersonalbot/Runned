import { canonicalColorwayFor } from "@/lib/data/canonical-shoe-images";
import { galleryFixes } from "@/lib/data/gallery-fixes";
import { gallerySourceOverrideFor } from "@/lib/data/gallery-source-overrides";
import type { DemoShoe, ShoeImageView } from "@/lib/types";

type Candidate = ShoeImageView & { score: number };

const BAD_TOKENS = [
  "logo", "icon", "sprite", "payment", "badge", "avatar", "banner", "placeholder",
  "loader", "rating", "star", "flag", "favicon", "tracking", "pixel", "qr-code",
  "size-chart", "sizechart", "shipping", "store-logo", "merchant", "watermark",
  "official-store", "official_store", "pasti-dikirim", "pasti_dikirim",
];

// Runned should never render marketplace-hosted product photography. These
// hosts frequently bake store badges, shipping stickers or promotional art into
// the source image. Price links may still point to marketplaces; image sources may not.
const BLOCKED_IMAGE_HOSTS = [
  "susercontent.com",
  "static-src.com",
  "shopee.co.id",
  "shopee.com",
  "tokopedia.net",
  "tokopedia.com",
  "lazada.co.id",
  "lazcdn.com",
  "item-shopping.c.yimg.jp",
];

const IMAGE_HOSTS = [
  "static.nike.com", "assets.nike.com", "assets.adidas.com", "images.asics.com",
  "images.puma.com", "images.ctfassets.net", "cdn.shopify.com", "cdn.shopifycdn.net",
  "scene7.com", "bigcommerce.com", "paceathletic.com", "startinglane.co.id",
  "ncrsport.com", "store-assets.com", "hoka.com", "brooksrunning.com", "saucony.com",
  "holabirdsports.com", "bike24.com", "prodirectsport.com", "run4it.com",
  "fleetfeet.com", "fit2run.com", "sportinglife.ca", "sportsshoes.com",
  "therunnersshop.com.au", "runpacers.com", "sportaways.com", "ranksports.id",
  "skechers.com.au", "skechers.com.my", "sportsdirect.com", "idealo.com",
  "rundna.com.au", "therunnersshop.com.au", "runners.ae", "tradeinn.com",
];

const PREFERRED_IMAGE_HOSTS = [
  "static.nike.com", "assets.nike.com", "assets.adidas.com", "images.asics.com",
  "images.puma.com", "images.ctfassets.net", "scene7.com", "hoka.com",
  "brooksrunning.com", "saucony.com", "910.id", "mills.co.id",
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

function hostMatches(url: string, hosts: string[]) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return hosts.some((known) => host === known || host.endsWith(`.${known}`));
  } catch {
    return false;
  }
}

export function isBlockedProductImageUrl(url: string) {
  const lower = url.toLowerCase();
  if (BAD_TOKENS.some((token) => lower.includes(token))) return true;
  return hostMatches(url, BLOCKED_IMAGE_HOSTS);
}

function looksLikeImage(url: string) {
  if (isBlockedProductImageUrl(url)) return false;
  const lower = url.toLowerCase();
  if (/(product-variation|product-getselectablevariations|wishlist-|addtocart|add-to-cart|cart-|checkout|recommendation)/i.test(lower)) return false;
  if (/\.(?:png|jpe?g|webp|avif)(?:[?#]|$)/i.test(url)) return true;
  if (!hostMatches(url, IMAGE_HOSTS)) return false;

  // Some official image CDNs use extensionless URLs. Only allow those when the
  // path itself clearly represents an image transform or product-media asset.
  return /(?:\/a\/images\/|\/images?\/|\/media\/|\/cdn\/|\/img\/|is\/image|dw\/image|image\/upload|ctfassets|scene7|productimages|gallery|photography|phsrh|phcth|phsuh|phslh|sv0\d|sr[_-]?rt|sb[_-]?(?:tp|bt))/i.test(lower);
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
  for (const token of modelTokens(shoe)) if (text.includes(token)) score += 2;
  for (const token of skuTokens(shoe)) if (text.includes(token)) score += 8;
  if (angleFrom(text) !== "Alternate") score += 5;
  if (/product|pdp|gallery|footwear|shoe|running/.test(text)) score += 2;
  if (/thumbnail|thumb|small|swatch/.test(text)) score -= 3;
  if (/1200|1445|1600|1800|2000|2400|3000|3840/.test(text)) score += 1;
  if (hostMatches(url, PREFERRED_IMAGE_HOSTS)) score += 5;
  try {
    const source = gallerySourceOverrideFor(shoe.slug) ?? shoe.currentPrice?.sourceUrl ?? shoe.sourceUrl;
    if (source && new URL(source).hostname === new URL(url).hostname) score += 3;
  } catch {}
  return score;
}

function addCandidate(map: Map<string, Candidate>, url: string | null, context: string, shoe: DemoShoe) {
  if (!url || !looksLikeImage(url)) return;
  const lowerContext = context.toLowerCase();
  if (BAD_TOKENS.some((token) => lowerContext.includes(token))) return;
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
      for (const item of srcset.split(",")) addCandidate(map, absoluteUrl(item.trim().split(/\s+/)[0], pageUrl), alt, shoe);
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
    if (!image.url || seen.has(image.url) || !looksLikeImage(image.url)) continue;
    seen.add(image.url);
    combined.push({ ...image, score: 100 });
  }
  for (const image of extracted) {
    if (seen.has(image.url) || !looksLikeImage(image.url)) continue;
    seen.add(image.url);
    combined.push(image);
  }

  const picked: ShoeImageView[] = [];
  const pick = (labels: ShoeImageView["label"][]) => {
    const candidate = combined.find((item) => labels.includes(item.label) && !picked.some((p) => p.url === item.url));
    if (candidate) picked.push({ label: candidate.label, url: candidate.url });
  };
  pick(["Side"]);
  pick(["Top"]);
  pick(["Outsole"]);
  while (picked.length < 3) {
    const candidate = combined.find((item) => !picked.some((p) => p.url === item.url));
    if (!candidate) break;
    picked.push({ label: candidate.label, url: candidate.url });
  }
  if (picked.length > 0 && picked[0].label !== "Side") picked[0] = { ...picked[0], label: "Side" };
  return picked.slice(0, 3);
}

async function resolve(shoe: DemoShoe) {
  const fixedImages = galleryFixes[shoe.slug]?.filter((image) => looksLikeImage(image.url));
  const staticImages = fixedImages?.length ? fixedImages : shoe.images.filter((image) => looksLikeImage(image.url));
  const overridePage = gallerySourceOverrideFor(shoe.slug);
  const curated = Boolean(canonicalColorwayFor(shoe.slug));

  // A manually reviewed three-angle gallery is authoritative only when none of
  // its URLs come from marketplace image hosts.
  if (fixedImages?.length && fixedImages.length >= 3) return selectThree(fixedImages, []);
  if (!overridePage && curated && staticImages.length >= 3) return selectThree(staticImages, []);

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
    const extracted = extractFromHtml(await response.text(), pageUrl, shoe);

    if (overridePage) {
      const fromOverride = selectThree([], extracted);
      if (fromOverride.length >= 1) return fromOverride;
    }

    const fromPage = selectThree([], extracted);
    if (fromPage.length >= 1) return selectThree(fromPage, staticImages.map((image) => ({ ...image, score: 10 })));
    return selectThree(staticImages, extracted);
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
