"use client";

import { useState } from "react";
import { ProductImage } from "@/components/product-image";
import type { ShoeImageView } from "@/lib/types";

export function ProductGallery({ images, brand, model }: { images: ShoeImageView[]; brand: string; model: string }) {
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const visible = images.filter((image) => !failed.has(image.url));

  if (visible.length === 0) return null;

  return (
    <section className="py-8">
      <div className="mb-4">
        <p className="eyebrow">Product views</p>
        <h2 className="mt-2 font-display text-3xl tracking-[-0.04em]">See the shoe</h2>
      </div>
      <div className={`grid gap-px border border-black/10 bg-black/10 ${visible.length >= 3 ? "md:grid-cols-3" : visible.length === 2 ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
        {visible.map((image) => (
          <figure key={`${image.label}-${image.url}`} className="bg-white">
            <div className="aspect-square overflow-hidden p-6 sm:p-8">
              <ProductImage
                src={image.url}
                view={image.label}
                className={image.label === "Top" ? "scale-[1.28]" : ""}
                alt={`${brand} ${model}, ${image.label.toLowerCase()} view`}
                onUnavailable={() => setFailed((current) => {
                  const next = new Set(current);
                  next.add(image.url);
                  return next;
                })}
              />
            </div>
            <figcaption className="border-t border-black/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-black/50">{image.label} view</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
