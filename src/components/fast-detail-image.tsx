"use client";

import { useEffect, useMemo, useState } from "react";
import type { ShoeImageView } from "@/lib/types";

type FastDetailImageProps = {
  src: string;
  alt: string;
  view: ShoeImageView["label"];
  brand?: string;
  model?: string;
  priority?: boolean;
  className?: string;
  onUnavailable?: () => void;
};

function cleanedUrl(src: string, view: ShoeImageView["label"], brand: string, model: string) {
  const params = new URLSearchParams({ src, view, v: "6" });
  if (brand) params.set("brand", brand);
  if (model) params.set("model", model);
  return `/api/detail-clean-image?${params.toString()}`;
}

export function FastDetailImage({ src, alt, view, brand = "", model = "", priority = false, className = "", onUnavailable }: FastDetailImageProps) {
  const displaySrc = useMemo(() => cleanedUrl(src, view, brand, model), [src, view, brand, model]);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    setUnavailable(false);
  }, [src, view, brand, model]);

  if (!src || unavailable) return null;

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
          setUnavailable(true);
          onUnavailable?.();
        }}
      />
    </div>
  );
}
