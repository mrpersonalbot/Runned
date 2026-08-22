import type { ShoeImageView } from "@/lib/types";

// High-confidence overrides for galleries that previously used watermarked,
// boxed, blocked, or mixed-color imagery. Three-view overrides are authoritative;
// single-view overrides provide a clean card image while the exact product page
// supplies the remaining gallery angles.
export const galleryFixes: Record<string, ShoeImageView[]> = {
  "ortuseight-hyperglide-3-1": [
    { label: "Side", url: "https://img.ncrsport.com/img/storage/large/11040134-1.jpg" },
    { label: "Top", url: "https://img.ncrsport.com/img/storage/large/11040134-2.jpg" },
    { label: "Outsole", url: "https://img.ncrsport.com/img/storage/large/11040134-3.jpg" },
  ],
  "nike-alphafly-3": [
    { label: "Side", url: "https://www.obliqueshop.com/data/item/40876/thumb-5Li75Zumain_600x600.png" },
    { label: "Top", url: "https://2app.kicksonfire.com/kofapp/upload/events_images/ipad_nike-alphafly-3-prototype-2.jpeg" },
    { label: "Outsole", url: "https://cdn.shopify.com/s/files/1/0603/3031/1875/files/2_397aeb31-3d05-4519-b775-de3221cbd555.jpg?v=1737442255" },
  ],
  "nike-vaporfly-4": [
    { label: "Side", url: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto%2Cu_9ddf04c7-2a9a-4d76-add1-d15af8f0263d%2Cc_scale%2Cfl_relative%2Cw_1.0%2Ch_1.0%2Cfl_layer_apply/e37ccaf1-223b-4da9-982d-20f3f63af0e1/ZOOMX%2BVAPORFLY%2BNEXT%25%2B4.png" },
    { label: "Top", url: "https://cdn.shopify.com/s/files/1/0603/3031/1875/files/3_89314b83-4487-41dd-90d8-4219cf9c88fd_1080x.jpg?=75&v=1773726502" },
    { label: "Outsole", url: "https://media.rundna.com.au/e360a5a7-4858-4c25-80eb-6931288750b3.jpg" },
  ],
  "nike-streakfly-2": [
    { label: "Side", url: "https://cdn.sneakers123.com/release/15889202/nike-zoomx-streakfly-2-proto-sail-total-hf6417-100.jpg" },
  ],
  "hoka-speedgoat-6": [
    { label: "Side", url: "https://item-shopping.c.yimg.jp/i/n/snb-shop_hoka-121_1_d_20250108100534" },
  ],
  "on-cloudflow-5": [
    { label: "Side", url: "https://www.holabirdsports.com/cdn/shop/files/042528_3.jpg?v=1749157957&width=2048" },
    { label: "Top", url: "https://runninglab.my/cdn/shop/files/cLvaQXmk67ef53cd9d3de_1743737805.png?v=1754456095&width=1500" },
    { label: "Outsole", url: "https://www.holabirdsports.com/cdn/shop/files/042528_4.jpg?v=1749157957&width=2048" },
  ],
  "skechers-aero-razor": [
    { label: "Side", url: "https://www.skechers.com.au/media/catalog/product/2/4/246240_wbo_02.jpg?auto=webp&fit=cover&format=pjpg&quality=85&width=1200" },
    { label: "Top", url: "https://www.sportsdirect.com/images/imgzoom/12/12124501_xxl_a3.jpg" },
    { label: "Outsole", url: "https://cdn.shopify.com/s/files/1/0603/3031/1875/files/246240_WBO_OUTSOLE_converted_1080x.jpg?=75&v=1771836404" },
  ],
  "skechers-aero-burst": [
    { label: "Side", url: "https://cdn.idealo.com/folder/Product/207854/0/207854090/s2_produktbild_max_2/skechers-aero-burst-246210-black-white.jpg" },
    { label: "Top", url: "https://cdn.idealo.com/folder/Product/207854/0/207854090/s11_produktbild_max_3/skechers-aero-burst-246210-black-white.jpg" },
    { label: "Outsole", url: "https://www.skechers.com.my/cdn/shop/files/246210_BKW_C_ee45fdb9-aa06-4aa8-8f3a-f6e17cf553ee.jpg?v=1755793034&width=1445" },
  ],
};
