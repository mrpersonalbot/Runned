const gallerySourceOverrides: Record<string, string> = {
  "puma-velocity-nitro-3": "https://id.puma.com/en/pd/velocity-nitro%E2%84%A2-3-mens-running-shoes/309701.html",
  "puma-velocity-nitro-4": "https://id.puma.com/en/pd/velocity-nitro%E2%84%A2-4-running-shoes-men/312913.html?dwvar_312913_color=01",
  "puma-deviate-nitro-3": "https://id.puma.com/en/pd/deviate-nitro%E2%84%A2-3-running-shoes-men/309707.html?dwvar_309707_color=02",
};

export function gallerySourceFor(slug: string) {
  return gallerySourceOverrides[slug] ?? null;
}

export { gallerySourceOverrides };
