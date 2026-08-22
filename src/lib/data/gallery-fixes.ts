import type { ShoeImageView } from "@/lib/types";

// Manually reviewed product photography. Entries here are authoritative: the
// gallery resolver must never scrape a merchant/product page to replace or fill
// these images. It is better to show fewer correct angles than an unrelated
// image, marketplace badge, editorial photograph, or mixed colourway.
export const galleryFixes: Record<string, ShoeImageView[]> = {
  "hoka-mach-x-3": [
    { label: "Side", url: "https://media.au.hoka.com/cdn-cgi/image/fit%3Dscale-down%2Cf%3Dauto%2Cw%3D1280/products/4f6ed6b5-0262-407d-abb0-735426cc5fbb/db85786a/1168720-wbs_wbs_01.jpg" },
    { label: "Top", url: "https://media.au.hoka.com/cdn-cgi/image/fit%3Dscale-down%2Cf%3Dauto%2Cw%3D1280/products/4f6ed6b5-0262-407d-abb0-735426cc5fbb/51535343/1168720-wbs_wbs_02.jpg" },
    { label: "Alternate", url: "https://media.au.hoka.com/cdn-cgi/image/fit%3Dscale-down%2Cf%3Dauto%2Cw%3D1280/products/4f6ed6b5-0262-407d-abb0-735426cc5fbb/e1dbbd7b/1168720-wbs_wbs_03.jpg" },
  ],
  "new-balance-sc-elite-v5": [
    { label: "Side", url: "https://nb.scene7.com/is/image/NB/mrcellr5_nb_02_i?fmt=webp&wid=1200" },
    { label: "Alternate", url: "https://nb.scene7.com/is/image/NB/mrcellr5_nb_03_i?fmt=webp&wid=1200" },
    { label: "Alternate", url: "https://nb.scene7.com/is/image/NB/mrcellr5_nb_04_i?fmt=webp&wid=1200" },
  ],
  "saucony-endorphin-pro-5": [
    { label: "Side", url: "https://www.paceathletic.com/cdn/shop/files/Mens-Saucony-Endorphin-Pro-5-White_Black-S21064-101.jpg?v=1769557991&width=1701" },
    { label: "Top", url: "https://www.paceathletic.com/cdn/shop/files/Mens-Saucony-Endorphin-Pro-5-White_Black-S21064-101-2.jpg?v=1769558018&width=1701" },
    { label: "Outsole", url: "https://www.paceathletic.com/cdn/shop/files/Mens-Saucony-Endorphin-Pro-5-White_Black-S21064-101-5.jpg?v=1769558077&width=1701" },
  ],
  "ortuseight-hyperblast-2-1": [
    { label: "Side", url: "https://sportaways.com/storage/products/7814/sepatu-running-ortuseight-hyperblast-21-sacramentolime-s4rv-1.webp" },
    { label: "Outsole", url: "https://cdn.store-assets.com/s/986841/i/86692851.jpeg?width=1024" },
  ],
  "ortuseight-hyperglide-3-1": [
    { label: "Side", url: "https://cdn.store-assets.com/s/1267934/i/84877827.jpeg" },
    { label: "Top", url: "https://img.ncrsport.com/img/storage/large/11040134-2.jpg" },
    { label: "Outsole", url: "https://img.ncrsport.com/img/storage/large/11040134-3.jpg" },
  ],
  "ortuseight-hyperblast-3": [
    { label: "Side", url: "https://cdn.store-assets.com/s/1370801/i/103796581.png" },
  ],
  "ortuseight-hyperglide-4": [
    { label: "Side", url: "https://store-assets.jubelio.com/webstore-v2/images/jstorev2/thzw4gbglakdx/1769508526454_50505d25-5cd8-4f13-9523-203f23d0d9a5.png" },
  ],
  "specs-cloudblazer": [
    { label: "Side", url: "https://sportaways.com/storage/products/5640/sepatu-running-specs-cloudblazer-green-geckotofu-gv2x-1.webp" },
    { label: "Top", url: "https://sportaways.com/storage/products/5640/sepatu-running-specs-cloudblazer-green-geckotofu-gv2x-4.webp" },
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