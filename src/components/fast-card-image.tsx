"use client";

import { useEffect, useMemo, useState } from "react";

type FastCardImageProps = {
  src: string;
  alt: string;
  brand?: string;
  model?: string;
  className?: string;
};

function detailCleanUrl(src: string, brand?: string, model?: string) {
  const params = new URLSearchParams({ src, view: "Side", v: "9" });
  if (brand) params.set("brand", brand);
  if (model) params.set("model", model);
  return `/api/detail-clean-image?${params.toString()}`;
}

function cleanedUrl(src: string, brand?: string, model?: string) {
  if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "1") return src;
  if (src.startsWith("/api/legacy-shoe-image?") || src.startsWith("/api/legacy-fast-image?")) {
    return detailCleanUrl(src, brand, model);
  }
  if (!/^https?:\/\//i.test(src)) return src;

  // HOKA's media.au.hoka.com CDN intermittently fails in the lightweight
  // product-image fetcher. The detail cleaner already normalizes f=auto to a
  // decoder-safe WebP request and provides the same clean white-card output.
  if (/media\.(?:au|nz)\.hoka\.com/i.test(src)) {
    return detailCleanUrl(src, brand, model);
  }

  const params = new URLSearchParams({ url: src, v: "8", view: "Side" });
  return `/api/product-image?${params.toString()}`;
}

export function FastCardImage({ src, alt, brand, model, className = "" }: FastCardImageProps) {
  const displaySrc = useMemo(() => cleanedUrl(src, brand, model), [src, brand, model]);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    setUnavailable(false);
  }, [src]);

  if (!src || unavailable || (process.env.NEXT_PUBLIC_GITHUB_PAGES === "1" && src.startsWith("/api/"))) {
    return <div className="flex h-full w-full items-center justify-center bg-[#f4f1eb] px-6 text-center text-xs font-semibold uppercase tracking-[0.12em] text-black/35">{brand} · image unavailable</div>;
  }

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-white">
      <img
        src={displaySrc}
        alt={alt}
        className={`h-full w-full object-contain ${className}`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setUnavailable(true)}
      />
    </div>
  );
}
