import type { DemoShoe, PriceSnapshot, ShoeCategory, Terrain } from "@/lib/types";
import type { ShoeImageView } from "@/lib/data/shoe-images";

const observedAt = "2026-08-20";
type ProductSpecs = Pick<DemoShoe, "weightG" | "dropMm" | "heelStackMm" | "forefootStackMm" | "midsole" | "plate">;
export type CatalogEntryV3 = [string, string, string, ShoeCategory, Terrain, boolean?];

export const localExpansionPrices: Record<string, PriceSnapshot> = {
  "skechers-aero-spark": {
    priceIdr: 2499000,
    sourceLabel: "Skechers Indonesia",
    sourceUrl: "https://www.skechers.id/en/products/skechers-slip-ins-skx-aero-spark-mens-running-shoes-blue",
    sourceType: "official-brand",
    observedAt,
    inStock: true,
  },
  "skechers-go-run-trail-altitude-2": {
    priceIdr: 1599000,
    sourceLabel: "Skechers Indonesia",
    sourceUrl: "https://www.skechers.id/collections/men-running",
    sourceType: "official-brand",
    observedAt,
    inStock: true,
  },
  "910-kishi-run-2": {
    priceIdr: 679900,
    sourceLabel: "910 Indonesia",
    sourceUrl: "https://910.id/collections/all-products?page=8",
    sourceType: "official-brand",
    observedAt,
    inStock: true,
  },
  "910-takashi-run-elite": {
    priceIdr: 679900,
    sourceLabel: "910 Indonesia",
    sourceUrl: "https://910.id/collections/speed-run?page=3",
    sourceType: "official-brand",
    observedAt,
    inStock: true,
  },
  "ortuseight-hyperblast-3": {
    priceIdr: 749000,
    sourceLabel: "Ortuseight Official Shop",
    sourceUrl: "https://shopee.co.id/ortuseightofficialshop",
    sourceType: "official-marketplace",
    observedAt,
    inStock: true,
  },
  "ortuseight-hyperglide-4": {
    priceIdr: 749000,
    sourceLabel: "Ortuseight Official Shop",
    sourceUrl: "https://shopee.co.id/ortuseightofficialshop",
    sourceType: "official-marketplace",
    observedAt,
    inStock: true,
  },
  "mills-enercharge-m2": {
    priceIdr: 1799000,
    sourceLabel: "MILLS Official",
    sourceUrl: "https://mills.co.id/products/mills-sepatu-lari-running-shoes-enercharge-m2-white-java-cyan-fresh-orange-9106601",
    sourceType: "official-brand",
    observedAt,
    inStock: true,
  },
  "mills-enerstrike-r26": {
    priceIdr: 749000,
    sourceLabel: "MILLS Official",
    sourceUrl: "https://mills.co.id/collections/running-footwear?page=1",
    sourceType: "official-brand",
    observedAt,
    inStock: true,
  },
  "specs-cloudblazer": {
    priceIdr: 467330,
    listPriceIdr: 549800,
    sourceLabel: "Specs Indonesia Flagship Store / Blibli",
    sourceUrl: "https://www.blibli.com/p/specs-sepatu-running-cloudblazer-white-spe1040247/ps--SPS-70137-00013",
    sourceType: "official-marketplace",
    observedAt,
    inStock: true,
  },
  "specs-coanda-sv-subs1": {
    priceIdr: 742302,
    listPriceIdr: 749800,
    sourceLabel: "Specs Indonesia Flagship Store / Blibli",
    sourceUrl: "https://www.blibli.com/jual/specs-coanda-sv-subs1",
    sourceType: "official-marketplace",
    observedAt,
    inStock: true,
  },
};

export const localExpansionRetailPrices: Record<string, number> = {
  "skechers-aero-spark": 2499000,
  "skechers-go-run-trail-altitude-2": 1599000,
  "910-kishi-run-2": 679900,
  "910-takashi-run-elite": 679900,
  "ortuseight-hyperblast-3": 749000,
  "ortuseight-hyperglide-4": 749000,
  "mills-enercharge-m2": 1799000,
  "mills-enerstrike-r26": 749000,
  "specs-cloudblazer": 549800,
  "specs-coanda-sv-subs1": 749800,
};

export const localExpansionProductSpecs: Record<string, ProductSpecs> = {
  "skechers-aero-spark": {
    weightG: 275,
    dropMm: 6,
    heelStackMm: 36,
    forefootStackMm: 30,
    midsole: "HYPER BURST ICE",
    plate: "Carbon-infused H-plate",
  },
  "skechers-go-run-trail-altitude-2": {
    weightG: null,
    dropMm: null,
    heelStackMm: null,
    forefootStackMm: null,
    midsole: "Lightweight cushioned midsole",
    plate: null,
  },
  "910-kishi-run-2": {
    weightG: null,
    dropMm: null,
    heelStackMm: null,
    forefootStackMm: null,
    midsole: null,
    plate: null,
  },
  "910-takashi-run-elite": {
    weightG: null,
    dropMm: null,
    heelStackMm: null,
    forefootStackMm: null,
    midsole: null,
    plate: null,
  },
  "ortuseight-hyperblast-3": {
    weightG: 271,
    dropMm: 4,
    heelStackMm: null,
    forefootStackMm: null,
    midsole: "CumulusFoam",
    plate: null,
  },
  "ortuseight-hyperglide-4": {
    weightG: null,
    dropMm: null,
    heelStackMm: null,
    forefootStackMm: null,
    midsole: null,
    plate: "TPU plate",
  },
  "mills-enercharge-m2": {
    weightG: null,
    dropMm: null,
    heelStackMm: null,
    forefootStackMm: null,
    midsole: "MILLS PBX Foam",
    plate: "MILLS Carbon ASX",
  },
  "mills-enerstrike-r26": {
    weightG: null,
    dropMm: null,
    heelStackMm: null,
    forefootStackMm: null,
    midsole: "OP Foam",
    plate: null,
  },
  "specs-cloudblazer": {
    weightG: 225,
    dropMm: null,
    heelStackMm: null,
    forefootStackMm: null,
    midsole: "Substance cushioning",
    plate: null,
  },
  "specs-coanda-sv-subs1": {
    weightG: null,
    dropMm: null,
    heelStackMm: null,
    forefootStackMm: null,
    midsole: null,
    plate: null,
  },
};

export const localExpansionCatalog: CatalogEntryV3[] = [
  ["skechers-aero-spark", "Skechers", "SKX Aero Spark", "daily", "road"],
  ["skechers-go-run-trail-altitude-2", "Skechers", "GO RUN Trail Altitude 2.0", "trail", "trail"],
  ["910-kishi-run-2", "910 Nineten", "Kishi Run 2.0", "daily", "road", true],
  ["910-takashi-run-elite", "910 Nineten", "Takashi Run Elite", "daily", "road", true],
  ["ortuseight-hyperblast-3", "Ortuseight", "Hyperblast 3.0", "daily", "road", true],
  ["ortuseight-hyperglide-4", "Ortuseight", "Hyperglide 4.0", "tempo", "road", true],
  ["mills-enercharge-m2", "MILLS", "Enercharge M2", "race", "road", true],
  ["mills-enerstrike-r26", "MILLS", "Enerstrike R26", "daily", "road", true],
  ["specs-cloudblazer", "Specs", "Cloudblazer", "daily", "road", true],
  ["specs-coanda-sv-subs1", "Specs", "Coanda SV SUBS1", "daily", "road", true],
];

export const localExpansionShoeImages: Record<string, ShoeImageView[]> = {
  "skechers-aero-spark": [
    { label: "Side", url: "https://www.skechers.com.my/cdn/shop/files/246200_BKW_1x_f2d2e433-8451-4feb-b992-1b70b5dbd125.jpg?v=1755792788&width=1445" },
  ],
  "skechers-go-run-trail-altitude-2": [
    { label: "Side", url: "https://images.tcdn.com.br/img/img_prod/585092/tenis_skechers_go_run_trail_altitute_2_0_preto_e_amarelo_masculino_15371_1_bb003b25531420ad13fe45800d9130f7.jpg" },
  ],
  "910-kishi-run-2": [
    { label: "Side", url: "https://910.id/cdn/shop/files/Artboard1_38491041-0491-4c35-83f0-3717a135186a.png?v=1736850491" },
  ],
  "910-takashi-run-elite": [
    { label: "Side", url: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/108/MTA-179124867/brd-120784_910-nineten-takashi-run-elite-sepatu-lari-unisex-turquoise-navy-lime_full02-76e27f4a.jpg" },
  ],
  "ortuseight-hyperblast-3": [
    { label: "Side", url: "https://down-id.img.susercontent.com/file/sg-11134201-822x0-moew8kktf2mkd3" },
  ],
  "ortuseight-hyperglide-4": [
    { label: "Side", url: "https://down-id.img.susercontent.com/file/sg-11134201-81zte-mmvgbao1lzidec" },
  ],
  "mills-enercharge-m2": [
    { label: "Side", url: "https://mills.co.id/cdn/shop/files/9106601_-_white___java_cyan___fresh_orange-1.png?v=1775809721&width=1445" },
  ],
  "mills-enerstrike-r26": [
    { label: "Side", url: "https://mills.co.id/cdn/shop/files/1783496656592-white_java_cyan_fresh_orange.png?v=1783496754&width=1445" },
  ],
  "specs-cloudblazer": [
    { label: "Side", url: "https://down-id.img.susercontent.com/file/id-11134207-8224s-mi4grs0daby9fc" },
  ],
  "specs-coanda-sv-subs1": [
    { label: "Side", url: "https://down-id.img.susercontent.com/file/id-11134207-8224y-mhhd0260nytiba" },
  ],
};
