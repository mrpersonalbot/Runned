import type { ShoeImageView } from "@/lib/types";

// High-priority replacements for product assets that were watermarked, boxed,
// blocked by their CDN, or missing useful views. Each multi-view set stays on
// one model/SKU and one colourway.
export const qualityImageOverrides: Record<string, ShoeImageView[]> = {
  "on-cloudflow-4": [
    { label: "Side", url: "https://images.ctfassets.net/hnk2vsx53n6l/2BMCKepAfn6CKplHmi5oZQ/2f2d7ca28c2bf3bb2fa05e736b397fb1/aqwbygsuv2s0bvtdlwcp.png?w=1600&h=1600&fm=webp&f=center&fit=fill&q=80" },
  ],
  "910-kishi-run": [
    { label: "Side", url: "https://910.id/cdn/shop/files/15_d780c74f-1ba8-438f-b967-d52c8b001309.png?v=1735109693" },
  ],
  "new-balance-1080-v15": [
    { label: "Side", url: "https://nb.scene7.com/is/image/NB/m10802hr_nb_05_i?fmt=webp&wid=1200" },
  ],
  "puma-scend-pro-2": [
    { label: "Side", url: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/310779/01/sv01/fnd/EEA/fmt/png/Scend-Pro-2-Running-Shoes" },
  ],
  "ortuseight-hyperglide-3-1": [
    { label: "Side", url: "https://sportaways.com/storage/products/7370/sepatu-running-ortuseight-hyperglide-31-whitemintgreenblue-fzpa-3.webp" },
    { label: "Top", url: "https://img.ncrsport.com/img/storage/large/11040134-2.jpg" },
    { label: "Outsole", url: "https://img.ncrsport.com/img/storage/large/11040134-3.jpg" },
  ],
  "nike-alphafly-3": [
    { label: "Side", url: "https://thelooprunning.com/cdn/shop/files/IMG_3084.png?v=1766562800" },
    { label: "Top", url: "https://2app.kicksonfire.com/kofapp/upload/events_images/ipad_nike-alphafly-3-prototype-2.jpeg" },
    { label: "Outsole", url: "https://www.bfgcdn.com/1500_1500_90/023-2094/nike-air-zoom-alphafly-next-3-fp-chaussures-de-running-detail-2.jpg" },
  ],
  "nike-streakfly-2": [
    { label: "Side", url: "https://tcrunningco.com/cdn/shop/files/AURORA_HF6416-300_PHCFH001-2000.jpg?v=1774019091&width=800" },
    { label: "Top", url: "https://img.alpen-group.jp/Contents/ProductSubImages/0/4301563416-0001_sub03_LL.jpg" },
    { label: "Outsole", url: "https://img.alpen-group.jp/Contents/ProductSubImages/0/4301563416-0001_sub05_LL.jpg" },
  ],
  "hoka-speedgoat-6": [
    { label: "Side", url: "https://cdn.fleetfeet.com/f%3Acontain-t%3A1-tt%3A10-h%3A1200-w%3A1200/products/1147811-WNG_1-copy.jpg?s=846459b1" },
  ],
  "skechers-aero-razor": [
    { label: "Side", url: "https://www.skechers.com.au/media/catalog/product/2/4/246240_wbo_02.jpg?auto=webp&fit=cover&format=pjpg&quality=85&width=1200" },
    { label: "Top", url: "https://www.sportsdirect.com/images/imgzoom/12/12124501_xxl_a3.jpg" },
    { label: "Outsole", url: "https://cdn.shopify.com/s/files/1/0603/3031/1875/files/246240_WBO_OUTSOLE_converted_1080x.jpg?v=1771836404" },
  ],
  "skechers-aero-burst": [
    { label: "Side", url: "https://cdn.idealo.com/folder/Product/207854/0/207854096/s1_produktbild_max/skechers-aero-burst-246215-bkw-schwarz-weiss.jpg" },
    { label: "Top", url: "https://cdn.idealo.com/folder/Product/207854/0/207854090/s11_produktbild_max_3/skechers-aero-burst-246210-black-white.jpg" },
    { label: "Outsole", url: "https://www.skechers.com.my/cdn/shop/files/246210_BKW_C_ee45fdb9-aa06-4aa8-8f3a-f6e17cf553ee.jpg?v=1755793034&width=1445" },
  ],
};

export function qualityImagesFor(slug: string, fallback: ShoeImageView[]) {
  return qualityImageOverrides[slug] ?? fallback;
}
