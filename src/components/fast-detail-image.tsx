"use client";

import { useEffect, useMemo, useState } from "react";
import type { ShoeImageView } from "@/lib/types";

type FastDetailImageProps = {
  src: string;
  alt: string;
  view: ShoeImageView["label"];
  brand?: string;
  model?: string;
  slug?: string;
  priority?: boolean;
  className?: string;
  onUnavailable?: () => void;
};

function cleanedUrl(src: string, view: ShoeImageView["label"], brand: string, model: string) {
  if (process.env.NEXT_PUBLIC_GITHUB_PAGES === "1") return src;
  const params = new URLSearchParams({ src, view, v: "9" });
  if (brand) params.set("brand", brand);
  if (model) params.set("model", model);
  return `/api/detail-clean-image?${params.toString()}`;
}

export function FastDetailImage({ src, alt, view, brand = "", model = "", slug, priority = false, className = "", onUnavailable }: FastDetailImageProps) {
  const displaySrc = useMemo(() => process.env.NEXT_PUBLIC_GITHUB_PAGES === "1" && slug ? `/Runned/preview-shoes/${slug}-${view.toLowerCase()}.png` : cleanedUrl(src, view, brand, model), [src, view, brand, model, slug]);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    setUnavailable(false);
  }, [src, view, brand, model]);

  if (!src || unavailable || (process.env.NEXT_PUBLIC_GITHUB_PAGES === "1" && src.startsWith("/api/"))) {
    return <div className="flex h-full w-full items-center justify-center bg-[#f4f1eb] px-6 text-center text-xs font-semibold uppercase tracking-[0.12em] text-black/35">Image unavailable</div>;
  }

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
