export const gallerySourceOverrides: Record<string, string> = {
  "nike-vaporfly-4": "https://www.nike.com/id/t/vaporfly-4-road-racing-shoes-PTwDtp/HF6414-112",
  "on-cloudflow-5": "https://www.on.com/en-jp/products/cloudflow-5-m-3mf1011/mens/arctic-stone-shoes-3MF10113306",
  "brooks-glycerin-22": "https://www.fleetfeet.com/products/mens-brooks-glycerin-22?sku=110445-1D-090",
  "saucony-kinvara-16": "https://www.holabirdsports.com/products/saucony-kinvara-16-mens-black-white",
};

export function gallerySourceOverrideFor(slug: string) {
  return gallerySourceOverrides[slug] ?? null;
}
