export const gallerySourceOverrides: Record<string, string> = {
  "nike-vaporfly-4": "https://www.nike.com/id/t/vaporfly-4-road-racing-shoes-PTwDtp/HF6414-112",
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
};

export function gallerySourceOverrideFor(slug: string) {
  return gallerySourceOverrides[slug] ?? null;
}
