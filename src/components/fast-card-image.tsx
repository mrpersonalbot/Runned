"use client";

import { useEffect, useMemo, useState } from "react";

type FastCardImageProps = {
  src: string;
  alt: string;
  className?: string;
};

function historicalFastUrl(src: string) {
  if (!src.startsWith("/api/legacy-shoe-image?")) return src;
  const query = src.slice(src.indexOf("?") + 1);
  const params = new URLSearchParams(query);
  params.set("view", "Side");
  params.set("v", "2");
  return `/api/legacy-fast-image?${params.toString()}`;
}

function cleanedUrl(src: string) {
  const historical = historicalFastUrl(src);
  if (!/^https?:\/\//i.test(historical)) return historical;
  const params = new URLSearchParams({ url: historical, v: "8", view: "Side" });
  return `/api/product-image?${params.toString()}`;
}

export function FastCardImage({ src, alt, className = "" }: FastCardImageProps) {
  const displaySrc = useMemo(() => cleanedUrl(src), [src]);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    setUnavailable(false);
  }, [src]);

  if (!src || unavailable) return null;

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
