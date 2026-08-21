import sharp from "sharp";

const TRANSPARENT = { r: 255, g: 255, b: 255, alpha: 0 };

export async function ensureProductCanvas(input: Buffer) {
  return sharp(input, { failOn: "none" })
    .resize({
      width: 1200,
      height: 900,
      fit: "contain",
      position: "centre",
      background: TRANSPARENT,
      withoutEnlargement: false,
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
}
