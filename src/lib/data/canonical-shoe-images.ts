import type { ShoeImageView } from "@/lib/types";

type CanonicalGallery = {
  colorway: string;
  images: ShoeImageView[];
};

// Canonical galleries replace mixed-model/mixed-colour demo imagery with one
// consistent launch/default colourway per shoe. Every URL in a gallery refers
// to the same model/SKU and colourway.
export const canonicalShoeGalleries: Record<string, CanonicalGallery> = {
  "adidas-adizero-evo-sl": {
    colorway: "Cloud White / Core Black / Cloud White (JH6206)",
    images: [
      { label: "Side", url: "https://dvshopcebu.com/cdn/shop/files/adidas-adizero-evo-sl-white-black-jh6206-side.jpg?v=1756701763&width=1946" },
      { label: "Top", url: "https://dvshopcebu.com/cdn/shop/files/adidas-adizero-evo-sl-white-black-jh6206-top.jpg?v=1756701866&width=1946" },
      { label: "Outsole", url: "https://dvshopcebu.com/cdn/shop/files/adidas-adizero-evo-sl-white-black-jh6206-outsole.jpg?v=1756702031&width=1946" },
    ],
  },
  "adidas-adizero-boston-13": {
    colorway: "Cloud White / Core Black / Dash Grey (JS4939)",
    images: [
      { label: "Side", url: "https://cdn.blazimg.com/1800/product/a/d/adidas_js4939_1_footwear_photography_side_lateral_center_view_white-nw091725.webp" },
      { label: "Alternate", url: "https://cdn.shopify.com/s/files/1/0603/3031/1875/files/2026-01-2811_13_39_3840x.jpg?v=1769570221" },
      { label: "Outsole", url: "https://www.paceathletic.com/cdn/shop/files/Mens-Adidas-Adizero-Boston-13-CloudWhite_CoreBlack_DashGrey-JS4939-4.jpg?v=1752708450&width=1701" },
    ],
  },
  "nike-pegasus-42": {
    colorway: "Volt Tint / Sapphire / Lime Blast / Black Spruce (IB1873-702)",
    images: [
      { label: "Side", url: "https://sportsclick.my/cdn/shop/files/AURORA_IB1873-702_PHSRH000-3144.jpg?v=1775813095&width=3840" },
      { label: "Top", url: "https://sportsclick.my/cdn/shop/files/AURORA_IB1873-702_PHCTH001-3144.jpg?v=1775813095&width=3840" },
      { label: "Alternate", url: "https://sportsclick.my/cdn/shop/files/AURORA_IB1873-702_PHSLH001-3144.jpg?v=1775813095&width=3840" },
    ],
  },
  "nike-vomero-18": {
    colorway: "Summit White / Coconut Milk / Black (HM6803-101)",
    images: [
      { label: "Side", url: "https://www.kickgame.com/cdn/shop/files/HM6803-101.png?v=1741696370" },
      { label: "Top", url: "https://www.nike.com.kw/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dwc572c03c/nk/7b1/6/9/b/a/c/7b169bac_5f6d_44d9_aa6b_118d76495c4e.png?q=100&sh=700&sm=fit&strip=false&sw=700" },
      { label: "Outsole", url: "https://www.paceathletic.com/cdn/shop/files/Mens-Nike-Vomero-18-SummitWhite_CoconutMilk_CoconutMilk_Black-HM6803-101-5.jpg?v=1749183233&width=1701" },
    ],
  },
  "asics-superblast-3": {
    colorway: "White / Black (1013A177-100)",
    images: [
      { label: "Side", url: "https://www.paceathletic.com/cdn/shop/files/Unisex-ASICS-Superblast-3-White_Black-1013A177-100.jpg?v=1769048730&width=1701" },
      { label: "Top", url: "https://www.paceathletic.com/cdn/shop/files/Unisex-ASICS-Superblast-3-White_Black-1013A177-100-2.jpg?v=1769048772&width=1701" },
      { label: "Outsole", url: "https://img.pchome.com.tw/cs/items/DXAX7VA900JSP13/l000004_1773026439.jpg" },
    ],
  },
  "new-balance-rebel-v5": {
    colorway: "Urgent Red / Black / Silver Metallic (MFCXLA5)",
    images: [
      { label: "Side", url: "https://nb.scene7.com/is/image/NB/mfcxla5_nb_02_i?fmt=webp&wid=1200" },
      { label: "Alternate", url: "https://nb.scene7.com/is/image/NB/mfcxla5_nb_03_i?fmt=webp&wid=1200" },
      { label: "Alternate", url: "https://nb.scene7.com/is/image/NB/mfcxla5_nb_04_i?fmt=webp&wid=1200" },
    ],
  },
  "new-balance-1080-v14": {
    colorway: "Black / Magnet / Linen (M1080B14)",
    images: [
      { label: "Side", url: "https://nb.scene7.com/is/image/NB/m1080b14_nb_02_i?fmt=webp&wid=1200" },
      { label: "Alternate", url: "https://nb.scene7.com/is/image/NB/m1080b14_nb_03_i?fmt=webp&wid=1200" },
      { label: "Alternate", url: "https://nb.scene7.com/is/image/NB/m1080b14_nb_04_i?fmt=webp&wid=1200" },
    ],
  },
  "puma-velocity-nitro-5": {
    colorway: "PUMA White / Ultra Red (312944-05)",
    images: [
      { label: "Side", url: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/312944/05/sv01/fnd/PNA/fmt/png/Velocity-NITRO%E2%84%A2-5-Running-Shoes-Men" },
      { label: "Alternate", url: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/312944/05/sv02/fnd/PNA/fmt/png/Velocity-NITRO%E2%84%A2-5-Running-Shoes-Men" },
      { label: "Alternate", url: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/312944/05/sv03/fnd/PNA/fmt/png/Velocity-NITRO%E2%84%A2-5-Running-Shoes-Men" },
    ],
  },
  "saucony-ride-19": {
    colorway: "White / Crimson (S21055-172)",
    images: [
      { label: "Side", url: "https://www.run4it.com/cdn/shop/files/S21055-172-M-Saucony-Ride19-lateral-view.jpg?v=1767005818" },
      { label: "Top", url: "https://www.sportsohn.de/out/pictures/master/product/5/saucony_ride_19_white_crimson_wei_mit_s21055_172_5303.jpg" },
      { label: "Outsole", url: "https://cdn.media.amplience.net/i/sportinglife/25930506_CARBON-BLACK_4/Mens-Ride-19-Running-Shoe-CARBON-BLACK?$default$=&fmt=auto&h=540&w=540" },
    ],
  },
  "saucony-endorphin-speed-5": {
    colorway: "White / Gum (S21007-10)",
    images: [
      { label: "Side", url: "https://prrunandwalk.com/cdn/shop/files/S21007-10_3_1080x.jpg?v=1754600714" },
      { label: "Top", url: "https://kream-phinf.pstatic.net/MjAyNTA3MTBfMzgg/MDAxNzUyMTMyMjQ2ODU2.dLfpRJDaat2UQ-sRK1a6zzHyj2_JrG2seo0f8M-evIEg.qu50T8c-yCwrM2mXpD9RpGxlemOnvqYgjMlYmQ1xN6Yg.PNG/a_5a8557b20c58415197e2ad7c9d785f9b.png" },
      { label: "Outsole", url: "https://www.achillesheel.co.uk/cdn/shop/files/Untitled-1638833.jpg?v=1750512271&width=1600" },
    ],
  },
  "brooks-ghost-18": {
    colorway: "Coconut / Pearl / Tigerlily (110493-292)",
    images: [
      { label: "Side", url: "https://runpacers.com/cdn/shop/files/Mens-Brooks-Ghost-18-Coconut-Pearl-Tigerlily.jpg?v=1773327773&width=1200" },
      { label: "Top", url: "https://www.stevescomfortshoes.com/cdn/shop/files/110493_292_O_Ghost_18.jpg?v=1777037369" },
      { label: "Outsole", url: "https://www.holabirdsports.com/cdn/shop/files/044660_4.jpg?v=1776442292&width=2048" },
    ],
  },
  "on-cloudmonster-3": {
    colorway: "White / White (3MG10051200)",
    images: [
      { label: "Side", url: "https://images.ctfassets.net/hnk2vsx53n6l/5vdVazC77nwIlpSt1r12I1/7dd33e14c524c6c9f1454d2eb9eac659/b03f5cb336658aaa11c0d344860740d3faee2eb5.png?fm=webp" },
      { label: "Top", url: "https://images.ctfassets.net/hnk2vsx53n6l/7f5qv89Yf1ahdJeuNYG1Vz/97533290ef5877e202404ed248f469a7/c89dba1d194e152583b2e94a6e893decef95e2d1.png?fm=webp" },
      { label: "Outsole", url: "https://images.ctfassets.net/hnk2vsx53n6l/14Q8XzEEziWDkz6F55bGmG/61487d1aa586590c66dd0a2d8f36b72f/22ac7bed09beff6eb6b8ba02b81fdf1d819c9434.png?fm=webp" },
    ],
  },
  "on-cloudsurfer-2": {
    colorway: "Ivory / Ivory (3MF10123334)",
    images: [
      { label: "Side", url: "https://media.sivasdescalzo.com/media/catalog/product/3/M/3MF10123334_sivasdescalzo-On-CLOUDSURFER_2-1741965831-1.jpg" },
      { label: "Top", url: "https://img.alpen-group.jp/Contents/ProductSubImages/0/4304171215-0001_sub03_LL.jpg" },
      { label: "Outsole", url: "https://www.sneakinpeace.com/cdn/shop/files/on-running-cloudsurfer-2-ivory-ivory-running-shoes-3_16e781ac-a189-49e7-8619-fe6d50d50f13_1600x2000.jpg?v=1739693308" },
    ],
  },
  "mizuno-wave-rider-29": {
    colorway: "White / Silver / Harbor Mist (J1GC250504)",
    images: [
      { label: "Side", url: "https://emea.mizuno.com/dw/image/v2/BDBS_PRD/on/demandware.static/-/Sites-masterCatalog_Mizuno/default/dwefcb2e77/AW25/Footwear/SH_J1GC250504_03.png-1000x1000-s_i-c_t_White-f_png.png?sh=950&sw=950" },
      { label: "Top", url: "https://emea.mizuno.com/dw/image/v2/BDBS_PRD/on/demandware.static/-/Sites-masterCatalog_Mizuno/default/dw87de48c1/AW25/Footwear/SH_J1GC250504_04.png-1000x1000-s_i-c_t_White-f_png.png?sh=950&sw=950" },
      { label: "Outsole", url: "https://emea.mizuno.com/dw/image/v2/BDBS_PRD/on/demandware.static/-/Sites-masterCatalog_Mizuno/default/dw601cf34a/AW25/Footwear/SH_J1GC250504_02.png-1000x1000-s_i-c_t_White-f_png.png?sh=950&sw=950" },
    ],
  },
  "skechers-aero-razor": {
    colorway: "White / Black / Orange (246240-WBO)",
    images: [
      { label: "Side", url: "https://images.skechers.com/image%3Bwidth%3D1200%2Cformat%3Dauto/246240_WBO_HERO_LG" },
      { label: "Top", url: "https://images.skechers.com/image%3Bwidth%3D1200%2Cformat%3Dauto/246240_WBO_INSOLE" },
      { label: "Outsole", url: "https://images.skechers.com/image%3Bwidth%3D1200%2Cformat%3Dauto/246240_WBO_OUTSOLE" },
    ],
  },
  "skechers-aero-burst": {
    colorway: "White / Silver (246215-WSL)",
    images: [
      { label: "Side", url: "https://images.skechers.com/image%3Bwidth%3D1200%2Cformat%3Dauto/246215_WSL_HERO_LG" },
      { label: "Top", url: "https://images.skechers.com/image%3Bwidth%3D1200%2Cformat%3Dauto/246215_WSL_INSOLE" },
      { label: "Outsole", url: "https://images.skechers.com/image%3Bwidth%3D1200%2Cformat%3Dauto/246215_WSL_OUTSOLE" },
    ],
  },
  "910-haze-tempo-2": {
    colorway: "Black / Grey / Purple",
    images: [
      { label: "Side", url: "https://910.id/cdn/shop/files/01_ab6805c8-485b-458a-a4fd-8af4a181c662.jpg?v=1782789353&width=1946" },
      { label: "Alternate", url: "https://910.id/cdn/shop/files/02_ffae1141-080f-48d5-9c2b-16f4123fe260.jpg?v=1782789353&width=1946" },
      { label: "Alternate", url: "https://910.id/cdn/shop/files/03_483b61b6-b46e-4c21-a334-6a7974065233.jpg?v=1782789353&width=1946" },
    ],
  },
  "910-geist-ekiden-hyperpulse": {
    colorway: "White / Navy / Teal",
    images: [
      { label: "Side", url: "https://910.id/cdn/shop/files/GEIST_EKIDEN_HYPERPULSE-PUTIH-BIRU_NAVY-HIJAU_TEAL_1.png?v=1759203705&width=1946" },
      { label: "Alternate", url: "https://910.id/cdn/shop/files/GEIST_EKIDEN_HYPERPULSE-PUTIH-BIRU_NAVY-HIJAU_TEAL_2.png?v=1759203705&width=1946" },
      { label: "Alternate", url: "https://910.id/cdn/shop/files/GEIST_EKIDEN_HYPERPULSE-PUTIH-BIRU_NAVY-HIJAU_TEAL_3.png?v=1759203705&width=1946" },
    ],
  },
  "ortuseight-hypersonic-2": {
    colorway: "White / Ortrange",
    images: [
      { label: "Side", url: "https://cdn.store-assets.com/s/1267934/i/85569030.jpeg?format=webp&width=1024" },
      { label: "Alternate", url: "https://cdn.store-assets.com/s/1267934/i/85569031.jpeg?format=webp&width=1024" },
      { label: "Outsole", url: "https://cdn.store-assets.com/s/1267934/i/85569033.jpeg?format=webp&width=1024" },
    ],
  },
  "ortuseight-hyperglide-3-1": {
    colorway: "White / Cyan (11040134)",
    images: [
      { label: "Side", url: "https://img.ncrsport.com/img/storage/large/11040134-1.jpg" },
      { label: "Top", url: "https://img.ncrsport.com/img/storage/large/11040134-2.jpg" },
      { label: "Outsole", url: "https://img.ncrsport.com/img/storage/large/11040134-3.jpg" },
    ],
  },
  "specs-novaspeed-subsx": {
    colorway: "White / Black / Dazzling Blue (SPE1040161)",
    images: [
      { label: "Side", url: "https://down-id.img.susercontent.com/file/id-11134211-822wo-mpal28gxfg25f7" },
      { label: "Alternate", url: "https://down-id.img.susercontent.com/file/id-11134211-822wl-moz7owk784jx50" },
      { label: "Alternate", url: "https://down-id.img.susercontent.com/file/sg-11134201-820nr-mo3h6x9d4ydkd2" },
    ],
  },
};

export function canonicalImagesFor(slug: string, fallback: ShoeImageView[]) {
  return canonicalShoeGalleries[slug]?.images ?? fallback;
}

export function canonicalColorwayFor(slug: string) {
  return canonicalShoeGalleries[slug]?.colorway ?? null;
}
