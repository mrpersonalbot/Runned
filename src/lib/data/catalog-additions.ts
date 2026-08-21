import type { DemoShoe, PriceSnapshot, ShoeCategory } from "@/lib/types";
import type { ShoeImageView } from "@/lib/data/shoe-images";

const observedAt = "2026-08-20";

type ProductSpecs = Pick<DemoShoe, "weightG" | "dropMm" | "heelStackMm" | "forefootStackMm" | "midsole" | "plate">;
export type CatalogEntry = [string, string, string, ShoeCategory, boolean?];

export const extraPrices: Record<string, PriceSnapshot> = {
  "adidas-adizero-adios-pro-4": { priceIdr: 4000000, sourceLabel: "adidas Indonesia", sourceUrl: "https://www.adidas.co.id/id/sepatu-adizero-adios-pro-4/JQ9702.html", sourceType: "official-brand", observedAt },
  "nike-alphafly-3": { priceIdr: 3271200, listPriceIdr: 4089000, sourceLabel: "Nike Indonesia", sourceUrl: "https://www.nike.com/id/t/alphafly-3-road-racing-shoes-d6x9mh/FD8311-101", sourceType: "official-brand", observedAt },
  "asics-metaspeed-sky-tokyo": { priceIdr: 4299000, sourceLabel: "ASICS Indonesia", sourceUrl: "https://asics.co.id/running/speed-shoes/metaspeed", sourceType: "official-brand", observedAt, inStock: true },
  "hoka-mach-x-3": { priceIdr: 3399000, listPriceIdr: 3499000, sourceLabel: "HOKA ID Official Store", sourceUrl: "https://shopee.co.id/Hoka-Mach-X-3-Men%27s-Running-White-Alabaster-i.1507521183.51352865291", sourceType: "official-marketplace", observedAt, inStock: true },
  "new-balance-sc-elite-v5": { priceIdr: 3679200, listPriceIdr: 4599000, sourceLabel: "New Balance Indonesia", sourceUrl: "https://www.newbalance.co.id/", sourceType: "official-brand", observedAt },
  "puma-fast-r-nitro-elite-3": { priceIdr: 4299000, sourceLabel: "PUMA Indonesia", sourceUrl: "https://id.puma.com/en/", sourceType: "official-brand", observedAt },
  "saucony-endorphin-pro-5": { priceIdr: 3599000, sourceLabel: "Saucony Official Store", sourceUrl: "https://shopee.co.id/Sepatu-Lari-Pria-SAUCONY-Shoes-Endorphin-Pro-5-Men-i.1046842842.56406763977", sourceType: "official-marketplace", observedAt, inStock: true },
  "brooks-hyperion-elite-5": { priceIdr: 3999000, listPriceIdr: 4999000, sourceLabel: "Brooks Flagship Store", sourceUrl: "https://www.blibli.com/p/brooks-unisex-running-shoes-hyperion-elite-5-sepatu-lari-unisex-1000491d681/ps--BRO-70066-00323", sourceType: "official-marketplace", observedAt, inStock: true },
  "on-cloudboom-strike-2": { priceIdr: 4300000, sourceLabel: "On Indonesia", sourceUrl: "https://www.on.com/en-id/products/cloudboom-strike-2-u-3ug3005", sourceType: "official-brand", observedAt },
  "910-haze-strike-pro": { priceIdr: 579900, sourceLabel: "910 Indonesia", sourceUrl: "https://910.id/products/haze-strike-pro-putih-gading-hijau-tosca-hitam", sourceType: "official-brand", observedAt },
  "ortuseight-hyperblast-2-1": { priceIdr: 524300, listPriceIdr: 749000, sourceLabel: "Starting Lane Indonesia", sourceUrl: "https://startinglane.co.id/product/11040154/sepatu-lari-mens-ortuseight-hyperblast-21", sourceType: "retailer", observedAt },
  "mills-hypercharge-r26": { priceIdr: 2499000, sourceLabel: "MILLS Official", sourceUrl: "https://mills.co.id/collections/running-footwear", sourceType: "official-brand", observedAt },
};

export const extraRetailPrices: Record<string, number | null> = {
  "adidas-adizero-adios-pro-4": 4000000,
  "nike-alphafly-3": 4089000,
  "asics-metaspeed-sky-tokyo": 4299000,
  "hoka-mach-x-3": 3499000,
  "new-balance-sc-elite-v5": 4599000,
  "puma-fast-r-nitro-elite-3": 4299000,
  "saucony-endorphin-pro-5": 3599000,
  "brooks-hyperion-elite-5": 4999000,
  "on-cloudboom-strike-2": 4300000,
  "910-haze-strike-pro": 579900,
  "ortuseight-hyperblast-2-1": 749000,
  "mills-hypercharge-r26": 2499000,
};

export const extraProductSpecs: Record<string, ProductSpecs> = {
  "adidas-adizero-adios-pro-4": { weightG: 200, dropMm: 6, heelStackMm: 39, forefootStackMm: 33, midsole: "Lightstrike Pro", plate: "Carbon EnergyRods 2.0" },
  "nike-alphafly-3": { weightG: 218, dropMm: 8, heelStackMm: 40, forefootStackMm: 32, midsole: "ZoomX + dual Air Zoom", plate: "Full-length carbon Flyplate" },
  "asics-metaspeed-sky-tokyo": { weightG: null, dropMm: 5, heelStackMm: 39.5, forefootStackMm: 34.5, midsole: "FF LEAP + FF TURBO PLUS", plate: "Carbon plate" },
  "hoka-mach-x-3": { weightG: 288, dropMm: 5, heelStackMm: null, forefootStackMm: null, midsole: "Dual-density foam with PEBA top layer", plate: "Pebax plate" },
  "new-balance-sc-elite-v5": { weightG: 215, dropMm: 8, heelStackMm: null, forefootStackMm: null, midsole: "FuelCell PEBA", plate: "Carbon fiber Energy Arc plate" },
  "puma-fast-r-nitro-elite-3": { weightG: 170, dropMm: 8, heelStackMm: null, forefootStackMm: null, midsole: "NITROFOAM Elite", plate: "Carbon PWRPLATE" },
  "saucony-endorphin-pro-5": { weightG: 206, dropMm: 8, heelStackMm: 39.5, forefootStackMm: 31.5, midsole: "PWRRUN PB + PWRRUN HG", plate: "Slotted carbon plate" },
  "brooks-hyperion-elite-5": { weightG: 196, dropMm: 8, heelStackMm: null, forefootStackMm: null, midsole: "DNA GOLD PEBA", plate: "Arris carbon SpeedVault+ plate" },
  "on-cloudboom-strike-2": { weightG: 191, dropMm: 5, heelStackMm: null, forefootStackMm: null, midsole: "Helion HF + CloudTec Sphere", plate: "Carbon Speedboard" },
  "910-haze-strike-pro": { weightG: 210, dropMm: 7, heelStackMm: 27, forefootStackMm: 20, midsole: null, plate: "None" },
  "ortuseight-hyperblast-2-1": { weightG: null, dropMm: null, heelStackMm: null, forefootStackMm: null, midsole: null, plate: null },
  "mills-hypercharge-r26": { weightG: 150, dropMm: null, heelStackMm: null, forefootStackMm: null, midsole: "PBX Turbo+", plate: null },
};

export const extraCatalog: CatalogEntry[] = [
  ["adidas-adizero-adios-pro-4", "adidas", "Adizero Adios Pro 4", "race"],
  ["nike-alphafly-3", "Nike", "Alphafly 3", "race"],
  ["asics-metaspeed-sky-tokyo", "ASICS", "METASPEED SKY TOKYO", "race"],
  ["hoka-mach-x-3", "HOKA", "Mach X 3", "tempo"],
  ["new-balance-sc-elite-v5", "New Balance", "FuelCell SuperComp Elite v5", "race"],
  ["puma-fast-r-nitro-elite-3", "Puma", "FAST-R NITRO Elite 3", "race"],
  ["saucony-endorphin-pro-5", "Saucony", "Endorphin Pro 5", "race"],
  ["brooks-hyperion-elite-5", "Brooks", "Hyperion Elite 5", "race"],
  ["on-cloudboom-strike-2", "On", "Cloudboom Strike 2", "race"],
  ["910-haze-strike-pro", "910 Nineten", "Haze Strike Pro", "tempo", true],
  ["ortuseight-hyperblast-2-1", "Ortuseight", "Hyperblast 2.1", "daily", true],
  ["mills-hypercharge-r26", "MILLS", "Hypercharge R26", "race", true],
];

export const extraShoeImages: Record<string, ShoeImageView[]> = {
  "adidas-adizero-adios-pro-4": [{ label: "Side", url: "https://www.tradeinn.com/f/14219/142195780/adidas-adizero-adios-pro-4-running-shoes.webp" }],
  "nike-alphafly-3": [{ label: "Side", url: "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto%2Cu_9ddf04c7-2a9a-4d76-add1-d15af8f0263d%2Cc_scale%2Cfl_relative%2Cw_1.0%2Ch_1.0%2Cfl_layer_apply/0654e00d-6e45-4766-8714-d55a0ddbe3da/AIR%2BZOOM%2BALPHAFLY%2BNEXT%25%2B3.png" }],
  "asics-metaspeed-sky-tokyo": [{ label: "Side", url: "https://runners.ae/cdn/shop/files/ASICS-METASPEED-SKY-TOKYO-SHOES-FOR-MEN-WHITE-BLUE-1013A162-101_6.jpg?v=1767957587" }],
  "hoka-mach-x-3": [{ label: "Side", url: "https://cdn11.bigcommerce.com/s-21x65e8kfn/images/stencil/original/products/85174/469998/HOK3305_1000_3__22105.1767885702.jpg" }],
  "new-balance-sc-elite-v5": [{ label: "Side", url: "https://cdna.lystit.com/1040/1300/n/photos/endclothing/540f1d3d/new-balance-Linen-New-Balance-Sc-Elite-V5-Sneaker.jpeg" }],
  "puma-fast-r-nitro-elite-3": [{ label: "Side", url: "https://images.puma.com/image/upload/f_auto%2Cq_auto%2Cb_rgb%3Afafafa%2Cw_2000%2Ch_2000/global/312060/14/sv01/fnd/PNA/fmt/png/FAST-R-NITRO%E2%84%A2-Elite-3-Men%27s-Road-Running-Shoes" }],
  "saucony-endorphin-pro-5": [{ label: "Side", url: "https://cdn.etrias.nl/media/cache/product_thumb_md/s/a/saucony_men_endorphin_pro_5_blacksilver_6.jpg" }],
  "brooks-hyperion-elite-5": [{ label: "Side", url: "https://media.eventyrsport.dk/2c3ba6d5-437c-4abe-b19d-985432a9aa75/6c66774e-5e3e-4e41-a21a-1dd8eeeee834/arODHrWmUiWLxLxnxRoZcqdae/Ga3XGxNqUsrduOsitpKgClUiy.webp?f=webp&w=1536" }],
  "on-cloudboom-strike-2": [{ label: "Side", url: "https://thetribeconcept.com/cdn/shop/files/on-cloudboom-strike-blackwhite_b8834d40-f63d-4d66-9a95-6e3dbe36e643.jpg?crop=center&height=800&v=1770799836&width=800" }],
  "910-haze-strike-pro": [{ label: "Side", url: "https://d2kchovjbwl1tk.cloudfront.net/vendor/11465/product/1_1753699698826.jpg" }],
  "ortuseight-hyperblast-2-1": [{ label: "Side", url: "https://sportaways.com/storage/products/7637/sepatu-running-ortuseight-hyperblast-21-mint-greenwhite-ofno-1.webp" }],
  "mills-hypercharge-r26": [{ label: "Side", url: "https://mills.co.id/cdn/shop/files/1783496656592-white_java_cyan_fresh_orange.png?v=1783496754&width=1445" }],
};
