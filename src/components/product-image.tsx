"use client";

import { useEffect, useMemo, useState } from "react";

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackSrcs?: string[];
  view?: "Side" | "Top" | "Outsole" | "Alternate" | "Rear";
  onUnavailable?: () => void;
};

function normalizedUrl(src: string, view: ProductImageProps["view"]) {
  if (!/^https?:\/\//i.test(src)) return src;
  const params = new URLSearchParams({ url: src, v: "6" });
  if (view) params.set("view", view);
  return `/api/product-image?${params.toString()}`;
}

export function ProductImage({ src, alt, className = "", fallbackSrcs = [], view, onUnavailable }: ProductImageProps) {
  const candidates = useMemo(
    () => Array.from(new Set([src, ...fallbackSrcs].filter(Boolean))),
    [src, fallbackSrcs],
  );
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [exhausted, setExhausted] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setExhausted(false);
  }, [src, view]);

  const candidate = candidates[candidateIndex];
  const displaySrc = candidate ? normalizedUrl(candidate, view) : "";

  function handleError() {
    const next = candidateIndex + 1;
    if (next < candidates.length) {
      setCandidateIndex(next);
      return;
    }

    if (!exhausted) onUnavailable?.();
    setExhausted(true);
  }

  if (exhausted || !candidate) return null;

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-white">
      <img
        src={displaySrc}
        alt={alt}
        className={`object-contain ${className}`}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={handleError}
      />
    </div>
  );
}
