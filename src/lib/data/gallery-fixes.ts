import type { ShoeImageView } from "@/lib/types";

// Manually reviewed product photography. Entries here are authoritative: the
// gallery resolver must never scrape a merchant/product page to replace or fill
// these images. It is better to show fewer correct angles than an unrelated
// image, marketplace badge, editorial photograph, or mixed colourway.
export const galleryFixes: Record<string, ShoeImageView[]> = {
  "nike-alphafly-3": [
    { label: "Side", url: "https://img.ncrsport.com/img/storage/large/Fd8311-101-1.jpg" },
    { label: "Top", url: "https://pufferreds.com/cdn/shop/files/FD8311-101_4.png?v=1763422519&width=2000" },
    { label: "Outsole", url: "https://www.prodirectsport.us/cdn/shop/files/1026491_gallery_3.jpg?v=1774009869&width=2000" },
  ],
  "nike-streakfly-2": [
    { label: "Side", url: "https://www.nike.qa/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dwcb3c4d90/nk/3d6/3/5/0/7/5/3d635075_e355_4037_8583_b934cee6087b.png?q=100&sh=700&sm=fit&strip=false&sw=700" },
    { label: "Top", url: "https://www.nike.ae/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dwb156b185/nk/7b0/3/1/0/1/1/7b031011_bc1c_4602_9ada_6441a6f67031.png?sh=2000&sm=fit&sw=2000" },
    { label: "Outsole", url: "https://media.rundna.com.au/9efe9df0-68dd-468e-86b7-c9fdfe41a909.jpg" },
  ],
  "nike-vaporfly-4": [
    { label: "Side", url: "https://0990b9.a-cdn.akinoncloud.com/products/2025/08/13/7607922/bf0421c2-b1a4-4314-a0eb-57b54f1402e1_size3840x3840_cropCenter.jpg" },
  ],
  "hoka-speedgoat-6": [
    { label: "Side", url: "https://cdn11.bigcommerce.com/s-eeul26hjka/images/stencil/1280x1280/products/4330/137524/media__49340.1736331696.jpg?c=1&imbypass=on" },
    { label: "Top", url: "https://www.paceathletic.com/cdn/shop/files/Mens-HOKA-Speedgoat-6-Black_Stardust-1147791-BKSTR-2.jpg?v=1749108874&width=1701" },
    { label: "Outsole", url: "https://solemotive.com/cdn/shop/files/Hoka-Speedgoat-6-Wide-Mens-FOOTWEAR-Mens-Trail-4_1200x.jpg?v=1721367612" },
  ],
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
  "puma-deviate-pure-nitro": [
    { label: "Side", url: "https://media.rundna.com.au/bf655262-ce2a-4d68-9f81-e0e2c74b9e3d__L.jpg" },
    { label: "Top", url: "https://cdn.shopify.com/s/files/1/0603/3031/1875/files/7_8727761d-32ad-465f-807d-7f7f3272ccc0_1080x.jpg?=75&v=1780626407" },
  ],
  "saucony-endorphin-pro-5": [
    { label: "Side", url: "https://www.paceathletic.com/cdn/shop/files/Mens-Saucony-Endorphin-Pro-5-White_Black-S21064-101.jpg?v=1769557991&width=1701" },
    { label: "Top", url: "https://www.paceathletic.com/cdn/shop/files/Mens-Saucony-Endorphin-Pro-5-White_Black-S21064-101-2.jpg?v=1769558018&width=1701" },
    { label: "Outsole", url: "https://www.paceathletic.com/cdn/shop/files/Mens-Saucony-Endorphin-Pro-5-White_Black-S21064-101-5.jpg?v=1769558077&width=1701" },
  ],
  "saucony-kinvara-16": [
    { label: "Side", url: "https://cdn.blazimg.com/1800/product/s/a/saucony_s21020-200_2-nw091825.webp" },
  ],
  "brooks-glycerin-22": [
    { label: "Side", url: "https://runninglabstore.com/cdn/shop/files/110445_020_L_Glycerin_22_1200x1200.png?v=1737410573" },
  ],
  "on-cloudsurfer-2": [
    { label: "Side", url: "https://media.sivasdescalzo.com/media/catalog/product/3/M/3MF10123334_sivasdescalzo-On-CLOUDSURFER_2-1741965831-1.jpg" },
    { label: "Top", url: "https://noirfonce.eu/cdn/shop/files/On_Cloudsurfer_2_Ivory_Ivory_3MF10123334_4.jpg?crop=center&height=1500&v=1739915198&width=1000" },
    { label: "Outsole", url: "https://www.sneakinpeace.com/cdn/shop/files/on-running-cloudsurfer-2-ivory-ivory-running-shoes-3_16e781ac-a189-49e7-8619-fe6d50d50f13_1600x2000.jpg?v=1739693308" },
  ],
  "on-cloudflow-5": [
    { label: "Side", url: "https://imagedelivery.net/2DfovxNet9Syc-4xYpcsGg/88c263cd-46d2-468d-9f8a-884cfaa07800/public" },
    { label: "Top", url: "https://bananarun.com/media/catalog/product/cache/aa5b17117e43c0b36f21fad92985fb3e/3/m/3mf10113306-cloudflow_5-fw25-arctic_stone-m-1x1-g2.png" },
    { label: "Outsole", url: "https://images.prodirectsport.com/productimages/Gallery_3/1021860_Gallery_3_2016845.jpg" },
  ],
  "skechers-aero-razor": [
    { label: "Side", url: "https://cdn.shopify.com/s/files/1/0603/3031/1875/files/246240_WBO_HERO_LG_converted_3840x.jpg?=75&v=1771836404" },
    { label: "Top", url: "https://cdn.shopify.com/s/files/1/0603/3031/1875/files/246240_WBO_INSOLE_converted_3840x.jpg?=75&v=1771836404" },
    { label: "Outsole", url: "https://cdn.shopify.com/s/files/1/0603/3031/1875/files/246240_WBO_OUTSOLE_converted_3840x.jpg?=75&v=1771836404" },
  ],
  "skechers-aero-burst": [
    { label: "Side", url: "https://cdn.idealo.com/folder/Product/207854/0/207854090/s2_produktbild_max_2/skechers-aero-burst-246210-black-white.jpg" },
    { label: "Top", url: "https://cdn.idealo.com/folder/Product/207854/0/207854090/s11_produktbild_max_3/skechers-aero-burst-246210-black-white.jpg" },
    { label: "Outsole", url: "https://www.skechers.com.my/cdn/shop/files/246210_BKW_C_ee45fdb9-aa06-4aa8-8f3a-f6e17cf553ee.jpg?v=1755793034&width=1445" },
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
};
