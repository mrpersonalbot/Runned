"use client";

import { useEffect, useMemo, useState } from "react";

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackSrcs?: string[];
  onUnavailable?: () => void;
  priority?: boolean;
};

function normalizedUrl(src: string) {
  if (!/^https?:\/\//i.test(src)) return src;
  return `/api/product-image?url=${encodeURIComponent(src)}&v=8`;
}

export function ProductImage({ src, alt, className = "", fallbackSrcs = [], onUnavailable, priority = false }: ProductImageProps) {
  const candidates = useMemo(
    () => Array.from(new Set([src, ...fallbackSrcs].filter(Boolean))),
    [src, fallbackSrcs],
  );
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [exhausted, setExhausted] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setExhausted(false);
  }, [src]);

  const candidate = candidates[candidateIndex];
  const displaySrc = candidate ? normalizedUrl(candidate) : "";

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
        width={1200}
        height={900}
        className={`object-contain ${className}`}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={handleError}
      />
    </div>
  );
}
