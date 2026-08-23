"use client";

import { useMemo, useState } from "react";
import { ProductImage } from "@/components/product-image";
import type { ShoeImageView } from "@/lib/types";

const viewOrder: Record<ShoeImageView["label"], number> = {
  Side: 0,
  Top: 1,
  Outsole: 2,
  Alternate: 3,
  Rear: 4,
};

export function ProductGallery({ images, brand, model }: { images: ShoeImageView[]; brand: string; model: string }) {
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const ordered = useMemo(
    () => [...images].sort((a, b) => viewOrder[a.label] - viewOrder[b.label]),
    [images],
  );

  if (ordered.length !== 3) return null;

  if (failed.size > 0) {
    return (
      <section className="py-8">
        <div className="border border-black/10 bg-white p-6">
          <p className="eyebrow">Product views</p>
          <p className="mt-2 text-sm text-black/55">Three-view gallery temporarily unavailable while Runned verifies one exact colorway.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="mb-4">
        <p className="eyebrow">Product views</p>
        <h2 className="mt-2 font-display text-3xl tracking-[-0.04em]">See the shoe</h2>
      </div>
      <div className="grid gap-px border border-black/10 bg-black/10 md:grid-cols-3">
        {ordered.map((image) => (
          <figure key={`${image.label}-${image.url}`} className="bg-white">
            <div className="aspect-square overflow-hidden p-6 sm:p-8">
              <ProductImage
                src={image.url}
                view={image.label}
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
