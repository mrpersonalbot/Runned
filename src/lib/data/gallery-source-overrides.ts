export const gallerySourceOverrides: Record<string, string> = {
  "nike-alphafly-3": "https://www.nike.com/id/t/alphafly-3-road-racing-shoes-d6x9mh/FD8311-101",
  "nike-vaporfly-4": "https://www.nike.com/id/t/vaporfly-4-road-racing-shoes-PTwDtp/HF6414-112",
  "nike-streakfly-2": "https://www.nike.ae/en/streakfly-2-proto-mens-road-racing-shoes/NKHF6417-100.html",
  "hoka-speedgoat-6": "https://au.hoka.com/products/m-speedgoat-6-1147791-bblc-bblc",
  "puma-velocity-nitro-5": "https://id.puma.com/en/pd/velocity-nitro%E2%84%A2-5-running-shoes-men/312944.html?dwvar_312944_color=05&dwvar_312944_size=0220",
  "on-cloudflow-5": "https://www.on.com/en-jp/products/cloudflow-5-m-3mf1011/mens/arctic-stone-shoes-3MF10113306",
  "brooks-glycerin-22": "https://www.fleetfeet.com/products/mens-brooks-glycerin-22?sku=110445-1D-090",
  "saucony-kinvara-16": "https://www.holabirdsports.com/products/saucony-kinvara-16-mens-black-white",
  "saucony-ride-19": "https://www.saucony.com/RO/en_RO/ride-19/60823M.html?dwvar_60823M_color=S21055-172",
  "skechers-aero-razor": "https://www.skechers.id/en/products/skechers-skx-aero-razor-mens-running-shoes-white",
  "skechers-aero-burst": "https://www.skechers.com/skechers-slip-ins-aero-burst/246215_WSL.html",
  "hoka-cielo-x1-2": "https://www.fleetfeet.com/products/hoka-cielo-x1-2-0?sku=1162053-FLCK&width=D",
  "hoka-skyward-x": "https://runpacers.com/products/mens-hoka-one-one-skyward-x-blanc-de-blanc-virtual-blue",
  "hoka-mafate-x": "https://www.fleetfeet.com/products/mens-hoka-mafate-x?sku=1161990-BCMN",
  "hoka-challenger-8": "https://www.fleetfeet.com/products/mens-hoka-challenger-8?sku=1168716-JDT",
  "asics-gt-2000-14": "https://www.asics.com.tr/en/gt-2000-14-756",

  "ortuseight-hyperglide-3-1": "https://www.projeksportsampang.com/products/ortuseight-hyperglide-3-1-white-cyan",
  "ortuseight-hyperblast-3": "https://startinglane.co.id/product/11040200",
  "ortuseight-hyperglide-4": "https://ranksports.id/products/sepatu-running-ortuseight-hyperglide-4-0-white-cyan-pink",
  "specs-cloudblazer": "https://sportaways.com/produk/sepatu-running-specs-cloudblazer-green-geckotofu-GV2X",
  "specs-coanda-sv-subs1": "https://sportaways.com/produk/specs-coanda-sv-subs1-blackturbulancelily-white-BLW5",
  "specs-novaspeed-subsx": "https://sportaways.com/index.php/produk/specs-novaspeed-subsx-whiteblackdazzling-blue-MWSI",
  "specs-airglide": "https://sportaways.com/produk/specs-airglide-blackquiet-shadewhite-UCAF",
  "910-haze-tempo-2": "https://910.id/products/haze-tempo-2-0-hitam-abu-ungu",
  "910-kishi-run-2": "https://910.id/products/kishi-run-2-0-black-sulphur-spring-egret-charcoal",
};

export function gallerySourceOverrideFor(slug: string) {
  return gallerySourceOverrides[slug] ?? null;
}
