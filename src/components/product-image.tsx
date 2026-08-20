"use client";

import { useState } from "react";

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function ProductImage({ src, alt, className = "" }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

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
        src={src}
        alt={alt}
        className={`object-contain mix-blend-multiply ${className}`}
        style={{ width: "84%", height: "68%", objectFit: "contain", mixBlendMode: "multiply" }}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
