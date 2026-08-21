import type { ShoeImageView } from "@/lib/types";

// High-confidence overrides for galleries that previously used watermarked,
// boxed, blocked, or mixed-color imagery. All angles within an override use
// one consistent model/colorway.
export const galleryFixes: Record<string, ShoeImageView[]> = {
  "ortuseight-hyperglide-3-1": [
    { label: "Side", url: "https://sportaways.com/storage/products/6185/sepatu-running-ortuseight-hyperglide-31-whitecyan-skmz-1.webp" },
    { label: "Top", url: "https://img.ncrsport.com/img/storage/large/11040134-2.jpg" },
    { label: "Outsole", url: "https://cdn.store-assets.com/s/1267934/i/84877825.jpeg" },
  ],
  "nike-alphafly-3": [
    { label: "Side", url: "https://cms-cdn.thesolesupplier.co.uk/2023/10/nike-alphafly-3-prototype-fd8356-100-side.jpg" },
    { label: "Top", url: "https://cms-cdn.thesolesupplier.co.uk/2023/10/nike-alphafly-3-prototype-fd8356-100-top.jpg" },
    { label: "Outsole", url: "https://www.therunningcompany.com.au/wp-content/uploads/2023/12/AURORA_FD8356-100_PHSUH000-2000.png" },
  ],
  "nike-vaporfly-4": [
    { label: "Side", url: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto%2Cu_9ddf04c7-2a9a-4d76-add1-d15af8f0263d%2Cc_scale%2Cfl_relative%2Cw_1.0%2Ch_1.0%2Cfl_layer_apply/e37ccaf1-223b-4da9-982d-20f3f63af0e1/ZOOMX%2BVAPORFLY%2BNEXT%25%2B4.png" },
    { label: "Top", url: "https://cdn.shopify.com/s/files/1/0603/3031/1875/files/3_89314b83-4487-41dd-90d8-4219cf9c88fd_1080x.jpg?=75&v=1773726502" },
    { label: "Outsole", url: "https://media.rundna.com.au/e360a5a7-4858-4c25-80eb-6931288750b3.jpg" },
  ],
  "nike-streakfly-2": [
    { label: "Side", url: "https://www.nike.qa/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dwcb3c4d90/nk/3d6/3/5/0/7/5/3d635075_e355_4037_8583_b934cee6087b.png?q=100&sh=700&sm=fit&strip=false&sw=700" },
    { label: "Top", url: "https://media.rundna.com.au/1a191d60-91b5-414f-ad5e-68c22566a125.jpg" },
    { label: "Outsole", url: "https://img.alpen-group.jp/Contents/ProductSubImages/0/4301563416-0001_sub05_LL.jpg" },
  ],
  "hoka-speedgoat-6": [
    { label: "Side", url: "https://cdn.fleetfeet.com/f%3Acontain-t%3A1-tt%3A10-h%3A1200-w%3A1200/products/1147811-WNG_1-copy.jpg?s=846459b1" },
    { label: "Top", url: "https://images.bike24.com/i/mb/c3/77/9a/hoka-speedgoat-6-running-shoes-men-white---neon-tangerine-1-1874250.jpg" },
    { label: "Outsole", url: "https://www.holabirdsports.com/cdn/shop/files/043331_4.jpg?v=1751386075&width=2048" },
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
