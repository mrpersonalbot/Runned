"use client";

import { useEffect, useMemo, useState } from "react";
import type { ShoeImageView } from "@/lib/types";

type FastDetailImageProps = {
  src: string;
  alt: string;
  view: ShoeImageView["label"];
  priority?: boolean;
  className?: string;
  onUnavailable?: () => void;
};

function proxyUrl(src: string) {
  if (!/^https?:\/\//i.test(src)) return src;
  const params = new URLSearchParams({ url: src, v: "1" });
  return `/api/detail-image?${params.toString()}`;
}

export function FastDetailImage({ src, alt, priority = false, className = "", onUnavailable }: FastDetailImageProps) {
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
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => {
          if (!useFallback && fallback !== src) {
            setUseFallback(true);
            return;
          }
          setUnavailable(true);
          onUnavailable?.();
        }}
      />
    </div>
  );
}
