import type { ShoeImageView } from "@/lib/types";

type CompleteGallery = {
  colorway: string;
  images: ShoeImageView[];
};

function asicsGallery(style: string): ShoeImageView[] {
  const normalized = style.replace("-", "_");
  const base = `https://images.asics.com/is/image/asics/${normalized}`;
  return [
    { label: "Side", url: `${base}_SR_RT_GLB?fmt=webp&wid=1200` },
    { label: "Top", url: `${base}_SB_TP_GLB?fmt=webp&wid=1200` },
    { label: "Outsole", url: `${base}_SB_BT_GLB?fmt=webp&wid=1200` },
  ];
}

export const verifiedCompleteGalleries: Record<string, CompleteGallery> = {
  "asics-metaspeed-sky-tokyo": {
    colorway: "White / Cobalt Burst (1013A162-101)",
    images: asicsGallery("1013A162-101"),
  },
  "asics-gel-nimbus-27": {
    colorway: "White / Glacier Grey (1011B958-100)",
    images: asicsGallery("1011B958-100"),
  },
  "asics-trabuco-max-4": {
    colorway: "Cream / Khaki (1011B976-101)",
    images: asicsGallery("1011B976-101"),
  },
  "asics-megablast": {
    colorway: "Vital Green / Black (1013A170-300)",
    images: asicsGallery("1013A170-300"),
  },
  "asics-sonicblast": {
    colorway: "Blue / White (1011C083-400)",
    images: asicsGallery("1011C083-400"),
  },
  "asics-magic-speed-5": {
    colorway: "White / Black (1013A183-100)",
    images: asicsGallery("1013A183-100"),
  },
  "hoka-clifton-10": {
    colorway: "Persimmon / Persimmon (1162030-PRSM)",
    images: [
      { label: "Side", url: "https://media.au.hoka.com/cdn-cgi/image/fit=scale-down,f=auto,w=1280/products/0196555d-0e20-47a3-85a7-8e4899a19946/e5426476/1162030-prsm_prsm_01.jpg" },
      { label: "Top", url: "https://media.au.hoka.com/cdn-cgi/image/fit=scale-down,f=auto,w=1280/products/0196555d-0e20-47a3-85a7-8e4899a19946/df0e00b8/1162030-prsm_prsm_02.jpg" },
      { label: "Outsole", url: "https://media.au.hoka.com/cdn-cgi/image/fit=scale-down,f=auto,w=1280/products/0196555d-0e20-47a3-85a7-8e4899a19946/05e59587/1162030-prsm_prsm_05.jpg" },
    ],
  },
  "hoka-bondi-9": {
    colorway: "White / White (1162011-WWH)",
    images: [
      { label: "Side", url: "https://media.au.hoka.com/cdn-cgi/image/fit=scale-down,f=auto,w=1280/products/f0f48b77-8333-46dd-ae58-8f1e316a7b4c/3f118df7/1162011-wwh_wwh_01.jpg" },
      { label: "Top", url: "https://media.au.hoka.com/cdn-cgi/image/fit=scale-down,f=auto,w=1280/products/f0f48b77-8333-46dd-ae58-8f1e316a7b4c/5ea15bbd/1162011-wwh_wwh_02.jpg" },
      { label: "Outsole", url: "https://media.au.hoka.com/cdn-cgi/image/fit=scale-down,f=auto,w=1280/products/f0f48b77-8333-46dd-ae58-8f1e316a7b4c/e77d91d4/1162011-wwh_wwh_05.jpg" },
    ],
  },
  "hoka-mach-x-3": {
    colorway: "White / Alabaster (1168720-WBS)",
    images: [
      { label: "Side", url: "https://media.au.hoka.com/cdn-cgi/image/fit=scale-down,f=auto,w=1280/products/4f6ed6b5-0262-407d-abb0-735426cc5fbb/db85786a/1168720-wbs_wbs_01.jpg" },
      { label: "Top", url: "https://media.au.hoka.com/cdn-cgi/image/fit=scale-down,f=auto,w=1280/products/4f6ed6b5-0262-407d-abb0-735426cc5fbb/51535343/1168720-wbs_wbs_02.jpg" },
      { label: "Outsole", url: "https://media.au.hoka.com/cdn-cgi/image/fit=scale-down,f=auto,w=1280/products/4f6ed6b5-0262-407d-abb0-735426cc5fbb/f65a74b0/1168720-wbs_wbs_05.jpg" },
    ],
  },
  "hoka-rocket-x-3": {
    colorway: "White / Black (1168724-WBLC)",
    images: [
      { label: "Side", url: "https://media.au.hoka.com/cdn-cgi/image/fit=scale-down,f=auto,w=1280/products/7d76cf02-5bb3-4160-9f3e-eed61921a97d/130f82d4/1168724-wblc_wblc_01.jpg" },
      { label: "Top", url: "https://media.au.hoka.com/cdn-cgi/image/fit=scale-down,f=auto,w=1280/products/7d76cf02-5bb3-4160-9f3e-eed61921a97d/38e8a3c3/1168724-wblc_wblc_02.jpg" },
      { label: "Outsole", url: "https://media.au.hoka.com/cdn-cgi/image/fit=scale-down,f=auto,w=1280/products/7d76cf02-5bb3-4160-9f3e-eed61921a97d/35a83adb/1168724-wblc_wblc_05.jpg" },
    ],
  },
  "hoka-speedgoat-6": {
    colorway: "Black / Neon Rose (1147791-BNRS)",
    images: [
      { label: "Side", url: "https://media.au.hoka.com/cdn-cgi/image/fit=scale-down,f=auto,w=1280/products/25bee869-ef3a-4b0b-b856-39cb892af7dc/92975fa0/1147791-bnrs_bnrs_01.jpg" },
      { label: "Top", url: "https://media.au.hoka.com/cdn-cgi/image/fit=scale-down,f=auto,w=1280/products/25bee869-ef3a-4b0b-b856-39cb892af7dc/e71c4e13/1147791-bnrs_bnrs_02.jpg" },
      { label: "Outsole", url: "https://media.au.hoka.com/cdn-cgi/image/fit=scale-down,f=auto,w=1280/products/25bee869-ef3a-4b0b-b856-39cb892af7dc/2053fbe5/1147791-bnrs_bnrs_05.jpg" },
    ],
  },
};

export function verifiedImagesFor(slug: string, fallback: ShoeImageView[]) {
  return verifiedCompleteGalleries[slug]?.images ?? fallback;
}

export function verifiedColorwayFor(slug: string) {
  return verifiedCompleteGalleries[slug]?.colorway ?? null;
}

export function hasVerifiedCompleteGallery(slug: string) {
  return Boolean(verifiedCompleteGalleries[slug]);
}
