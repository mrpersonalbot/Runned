const gallerySourceOverrides: Record<string, string> = {
  "adidas-hyperboost-edge": "https://www.fleetfeet.com/products/mens-adidas-hyperboost-edge?sku=KI1913&width=D",

  "nike-vomero-17": "https://www.fleetfeet.com/products/mens-nike-vomero-17",
  "nike-zoom-fly-5": "https://www.fleetfeet.com/products/mens-nike-zoom-fly-5?sku=DM8968-301&width=D",
  "nike-streakfly": "https://www.fleetfeet.com/products/nike-zoomx-streakfly?sku=DJ6566-102&width=D",
  "nike-vaporfly-3": "https://www.fleetfeet.com/products/mens-nike-vaporfly-3",

  "asics-trabuco-max-3": "https://www.fleetfeet.com/products/mens-asics-trabuco-max-3",
  "asics-magic-speed-4": "https://www.fleetfeet.com/products/mens-asics-magic-speed-4",

  "hoka-mach-x-2": "https://www.fleetfeet.com/products/mens-hoka-mach-x-2",
  "hoka-rocket-x-2": "https://www.fleetfeet.com/products/hoka-rocket-x-2",

  "puma-velocity-nitro-3": "https://id.puma.com/en/pd/velocity-nitro%E2%84%A2-3-mens-running-shoes/309701.html",
  "puma-velocity-nitro-4": "https://id.puma.com/en/pd/velocity-nitro%E2%84%A2-4-running-shoes-men/312913.html?dwvar_312913_color=01",
  "puma-deviate-nitro-3": "https://id.puma.com/en/pd/deviate-nitro%E2%84%A2-3-running-shoes-men/309707.html?dwvar_309707_color=02",
};

export function gallerySourceFor(slug: string) {
  return gallerySourceOverrides[slug] ?? null;
}

export { gallerySourceOverrides };