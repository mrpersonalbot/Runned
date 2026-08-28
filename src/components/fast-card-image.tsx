"use client";

import { useEffect, useMemo, useState } from "react";

type FastCardImageProps = {
  src: string;
  alt: string;
  className?: string;
};

function proxyUrl(src: string) {
  if (!/^https?:\/\//i.test(src)) return src;
  const params = new URLSearchParams({ url: src, v: "7", view: "Side" });
  return `/api/product-image?${params.toString()}`;
}

export function FastCardImage({ src, alt, className = "" }: FastCardImageProps) {
  const fallback = useMemo(() => proxyUrl(src), [src]);
  const [useFallback, setUseFallback] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    setUseFallback(false);
    setUnavailable(false);
  }, [src]);

  if (!src || unavailable) return null;

  const displaySrc = useFallback ? fallback : src;

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-white">
      <img
        src={displaySrc}
        alt={alt}
        className={`h-full w-full object-contain ${className}`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => {
          if (!useFallback && fallback !== src) {
            setUseFallback(true);
            return;
          }
          setUnavailable(true);
        }}
      />
    </div>
  );
}
