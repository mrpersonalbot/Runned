"use client";

import { useEffect, useMemo, useState } from "react";

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackSrcs?: string[];
  onUnavailable?: () => void;
};

function normalizedUrl(src: string) {
  if (!/^https?:\/\//i.test(src)) return src;
  return `/api/product-image?url=${encodeURIComponent(src)}&v=4`;
}

export function ProductImage({ src, alt, className = "", fallbackSrcs = [], onUnavailable }: ProductImageProps) {
  const candidates = useMemo(
    () => Array.from(new Set([src, ...fallbackSrcs].filter(Boolean))),
    [src, fallbackSrcs],
  );
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [useOriginal, setUseOriginal] = useState(false);
  const [exhausted, setExhausted] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setUseOriginal(false);
    setExhausted(false);
  }, [src]);

  const candidate = candidates[candidateIndex];
  const processed = candidate ? normalizedUrl(candidate) : "";
  const displaySrc = useOriginal ? candidate : processed;

  function handleError() {
    if (!candidate) {
      if (!exhausted) onUnavailable?.();
      setExhausted(true);
      return;
    }

    if (!useOriginal && processed !== candidate) {
      setUseOriginal(true);
      return;
    }

    const next = candidateIndex + 1;
    if (next < candidates.length) {
      setCandidateIndex(next);
      setUseOriginal(false);
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
        className={`object-contain ${useOriginal ? "mix-blend-multiply" : ""} ${className}`}
        style={useOriginal
          ? { width: "84%", height: "68%", objectFit: "contain", mixBlendMode: "multiply" }
          : { width: "100%", height: "100%", objectFit: "contain" }}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={handleError}
      />
    </div>
  );
}
