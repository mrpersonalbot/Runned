import { galleryFixes } from "@/lib/data/gallery-fixes";
import type { DemoShoe, ShoeImageView } from "@/lib/types";

const BAD_TOKENS = [
  "logo", "icon", "sprite", "payment", "badge", "avatar", "banner", "placeholder",
  "loader", "rating", "star", "flag", "favicon", "tracking", "pixel", "qr-code",
  "size-chart", "sizechart", "shipping", "store-logo", "merchant", "watermark",
  "official-store", "official_store", "pasti-dikirim", "pasti_dikirim",
];

// Marketplace media frequently includes store badges, shipping stickers,
// placeholder graphics, or unrelated promotional images. Price links may still
// point to marketplaces, but Runned does not use those hosts for shoe imagery.
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

const cache = new Map<string, Promise<ShoeImageView[]>>();

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

function isUsableCuratedImage(image: ShoeImageView) {
  return Boolean(image?.url) && /^https?:\/\//i.test(image.url) && !isBlockedProductImageUrl(image.url);
}

function selectCuratedImages(images: ShoeImageView[]) {
  const seen = new Set<string>();
  const clean = images.filter((image) => {
    if (!isUsableCuratedImage(image) || seen.has(image.url)) return false;
    seen.add(image.url);
    return true;
  });

  // Keep manually assigned labels. Never relabel an alternate/top/outsole photo
  // as a side view just to make a three-column gallery look complete.
  const ordered: ShoeImageView[] = [];
  for (const label of ["Side", "Top", "Outsole", "Alternate", "Rear"] as const) {
    for (const image of clean) {
      if (image.label === label && !ordered.some((item) => item.url === image.url)) {
        ordered.push(image);
      }
    }
  }
  return ordered.slice(0, 3);
}

async function resolve(shoe: DemoShoe) {
  // Manually reviewed fixes are authoritative. Otherwise use only the curated
  // images already attached to the catalog item. Do not scrape product pages to
  // invent missing angles: fewer correct photos are better than unrelated media.
  const fixed = galleryFixes[shoe.slug];
  if (fixed?.length) return selectCuratedImages(fixed);
  return selectCuratedImages(shoe.images);
}

export function resolveShoeGallery(shoe: DemoShoe) {
  const existing = cache.get(shoe.slug);
  if (existing) return existing;
  const pending = resolve(shoe);
  cache.set(shoe.slug, pending);
  return pending;
}
