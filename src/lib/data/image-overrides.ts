import type { ShoeImageView } from "@/lib/types";

const imageOverrides: Record<string, ShoeImageView[]> = {
  "nike-alphafly-3": [
    { label: "Side", url: "https://cms-cdn.thesolesupplier.co.uk/2023/10/nike-alphafly-3-prototype-fd8356-100-side.jpg" },
    { label: "Top", url: "https://cms-cdn.thesolesupplier.co.uk/2023/10/nike-alphafly-3-prototype-fd8356-100-top.jpg" },
    { label: "Outsole", url: "https://www.bfgcdn.com/1500_1500_90/023-2094/nike-air-zoom-alphafly-next-3-fp-chaussures-de-running-detail-2.jpg" },
  ],
  "nike-streakfly-2": [
    { label: "Side", url: "https://www.nike.ae/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dw4c384742/nk/396/f/a/9/c/5/396fa9c5_a172_400c_89b1_45e860619b26.png?sh=2000&sm=fit&sw=2000" },
  ],
  "hoka-speedgoat-6": [
    { label: "Side", url: "https://therunningoutlet.co.uk/cdn/shop/files/Hoka-Mens-Speedgoat-6-AQL-side_5c932dd9-b41d-4587-88f7-d4acbae8b7fb.jpg?v=1755615453&width=1214" },
    { label: "Outsole", url: "https://cdn11.bigcommerce.com/s-21x65e8kfn/images/stencil/original/products/69886/345157/HOK2570_1000_2__26300.1719827970.jpg" },
  ],
  "ortuseight-hyperglide-3-1": [
    { label: "Side", url: "https://down-id.img.susercontent.com/file/sg-11134201-7rblm-m5wkjwu168lz01" },
    { label: "Top", url: "https://img.ncrsport.com/img/storage/large/11040134-2.jpg" },
    { label: "Outsole", url: "https://img.ncrsport.com/img/storage/large/11040134-3.jpg" },
  ],
  "skechers-aero-razor": [
    { label: "Side", url: "https://www.skechers.com.au/media/catalog/product/2/4/246240_wbo_02.jpg?auto=webp&fit=cover&format=pjpg&quality=85&width=1200" },
  ],
  "skechers-aero-burst": [
    { label: "Side", url: "https://skechers.se/cdn/shop/files/335318_246215WSL_2_1445x.jpg?v=1747387256" },
  ],
};

export function overrideImagesFor(slug: string, fallback: ShoeImageView[]) {
  return imageOverrides[slug] ?? fallback;
}
