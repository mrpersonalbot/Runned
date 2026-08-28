"use client";

import { useEffect, useMemo, useState } from "react";

type FastCardImageProps = {
  src: string;
  alt: string;
  className?: string;
};

function cleanedUrl(src: string) {
  if (!/^https?:\/\//i.test(src)) return src;
  const params = new URLSearchParams({ url: src, v: "8", view: "Side" });
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
