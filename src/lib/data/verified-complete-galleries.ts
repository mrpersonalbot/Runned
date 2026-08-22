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
  // ASICS official product photography follows one stable image family per SKU.
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

  // HOKA: each gallery is kept to one exact style/color code.
  "hoka-mach-x-3": {
    colorway: "White / Alabaster (1168720-WBS)",
    images: [
      { label: "Side", url: "https://media.nz.hoka.com/cdn-cgi/image/fit=scale-down,f=auto,w=1280/products/6481e35d-648f-4093-be98-d8c2049306d2/60a74fa0/1168720-wbs_wbs_01.jpg" },
      { label: "Top", url: "https://www.misterrunning.com/images/2025-media-12/1168720-wbs-G.jpg" },
      { label: "Outsole", url: "https://cdn11.bigcommerce.com/s-eeul26hjka/images/stencil/608x608/products/6093/163193/media__50249.1767635510.jpg?c=1" },
    ],
  },
  "hoka-rocket-x-3": {
    colorway: "White / Black (1168724-WBLC)",
    images: [
      { label: "Side", url: "https://www.solereview.com/wp-content/uploads/2025/07/Hoka_Rocket_3_side-1170x878.jpg" },
      { label: "Top", url: "https://i1.t4s.cz/products/1168724-wblc/hoka-rocket-x-3-955926-1168724-wbld.png" },
      { label: "Outsole", url: "https://cdn.sportshop.com/catalog/product/1500/1500/2/1/212445_4.jpg?v=802cbc5367279828" },
    ],
  },
  "hoka-speedgoat-6": {
    colorway: "White / Neon Tangerine (1147811-WNG)",
    images: [
      { label: "Side", url: "https://d1nymbkeomeoqg.cloudfront.net/photos/30/28/424343_32325_XL.jpg" },
      { label: "Top", url: "https://img01.ztat.net/article/spp-media-p1/d588dc269e0f4158807f89cf91c79acb/d62cda036b4d466b9a9730acf9137d43.jpg?imwidth=762" },
      { label: "Outsole", url: "https://vn.hoka.com/cdn/shop/files/1147791-WNG-7.jpg?v=1772417039&width=1920" },
    ],
  },
};

export function verifiedImagesFor(slug: string, fallback: ShoeImageView[]) {
  return verifiedCompleteGalleries[slug]?.images ?? fallback;
}

export function verifiedColorwayFor(slug: string) {
  return verifiedCompleteGalleries[slug]?.colorway ?? null;
}
