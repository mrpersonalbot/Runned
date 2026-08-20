"use client";

import { useMemo, useState } from "react";

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function ProductImage({ src, alt, className = "" }: ProductImageProps) {
  const [fallbackToSource, setFallbackToSource] = useState(false);
  const [failed, setFailed] = useState(false);

  const normalizedSrc = useMemo(() => {
    if (!/^https?:\/\//i.test(src)) return src;
    return `/api/product-image?url=${encodeURIComponent(src)}`;
  }, [src]);

  const displaySrc = fallbackToSource ? src : normalizedSrc;

  if (failed) {
    return (
      <div role="img" aria-label={alt} className="grid h-full w-full place-items-center bg-white text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-black/35">
        Photo unavailable
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-white">
      <img
        src={displaySrc}
        alt={alt}
        className={`object-contain ${fallbackToSource ? "mix-blend-multiply" : ""} ${className}`}
        style={fallbackToSource
          ? { width: "84%", height: "68%", objectFit: "contain", mixBlendMode: "multiply" }
          : { width: "100%", height: "100%", objectFit: "contain" }}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => {
          if (!fallbackToSource && normalizedSrc !== src) {
            setFallbackToSource(true);
            return;
          }
          setFailed(true);
        }}
      />
    </div>
  );
}
