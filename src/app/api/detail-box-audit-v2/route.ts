import { NextRequest } from "next/server";
import sharp from "sharp";
import { demoShoes } from "@/lib/data/catalog";
import { GET as cleanDetailImage } from "@/app/api/detail-clean-image/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const PAGE_SIZE = 8;

type RGB = { r: number; g: number; b: number };
type ImageResult = {
  slug: string;
  label: string;
  ok: boolean;
  status?: number;
  rectangularCanvas?: boolean;
  alphaRectangularCanvas?: boolean;
  lightFlatCanvas?: boolean;
  edgeCoverage?: number[];
  colorEdgeCoverage?: number[];
  bbox?: number[] | null;
  backgroundColor?: RGB | null;
  error?: string;
};

function detailImages(shoe: (typeof demoShoes)[number]) {
  const images = shoe.detailImages?.length ? shoe.detailImages : shoe.images;
  return images.filter((image) => image.url);
}

function distance(a: RGB, b: RGB) {
  return Math.max(Math.abs(a.r - b.r), Math.abs(a.g - b.g), Math.abs(a.b - b.b));
}

function isLightNeutral(color: RGB) {
  const max = Math.max(color.r, color.g, color.b);
  const min = Math.min(color.r, color.g, color.b);
  const luma = color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722;
  return luma >= 188 && max - min <= 42;
}

async function detectRectangularCanvas(buffer: Buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const alphaIndex = channels - 1;

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  let visible = 0;

  const alphaAt = (x: number, y: number) => data[(y * width + x) * channels + alphaIndex];
  const rgbAt = (x: number, y: number): RGB => {
    const offset = (y * width + x) * channels;
    return { r: data[offset], g: data[offset + 1], b: data[offset + 2] };
  };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (alphaAt(x, y) <= 24) continue;
      visible += 1;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (!visible || maxX < minX || maxY < minY) {
    return {
      rectangularCanvas: false,
      alphaRectangularCanvas: false,
      lightFlatCanvas: false,
      edgeCoverage: [0, 0, 0, 0],
      colorEdgeCoverage: [0, 0, 0, 0],
      bbox: null as number[] | null,
      backgroundColor: null as RGB | null,
    };
  }

  const bboxWidth = maxX - minX + 1;
  const bboxHeight = maxY - minY + 1;
  const bboxAreaRatio = (bboxWidth * bboxHeight) / (width * height);
  const band = Math.max(3, Math.min(8, Math.floor(Math.min(bboxWidth, bboxHeight) * 0.012)));

  const alphaCoverageFor = (points: Array<[number, number]>) => {
    if (!points.length) return 0;
    let opaque = 0;
    for (const [x, y] of points) if (alphaAt(x, y) > 24) opaque += 1;
    return opaque / points.length;
  };

  const top: Array<[number, number]> = [];
  const right: Array<[number, number]> = [];
  const bottom: Array<[number, number]> = [];
  const left: Array<[number, number]> = [];

  for (let y = minY; y < Math.min(maxY + 1, minY + band); y += 1) {
    for (let x = minX; x <= maxX; x += 1) top.push([x, y]);
  }
  for (let x = Math.max(minX, maxX - band + 1); x <= maxX; x += 1) {
    for (let y = minY; y <= maxY; y += 1) right.push([x, y]);
  }
  for (let y = Math.max(minY, maxY - band + 1); y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) bottom.push([x, y]);
  }
  for (let x = minX; x < Math.min(maxX + 1, minX + band); x += 1) {
    for (let y = minY; y <= maxY; y += 1) left.push([x, y]);
  }

  const edges = [top, right, bottom, left];
  const edgeCoverage = edges.map(alphaCoverageFor);
  const strongEdges = edgeCoverage.filter((value) => value >= 0.78).length;
  const moderateEdges = edgeCoverage.filter((value) => value >= 0.58).length;
  const alphaRectangularCanvas = bboxAreaRatio >= 0.10 && (strongEdges >= 3 || moderateEdges === 4);

  const patchW = Math.max(5, Math.min(32, Math.floor(bboxWidth * 0.06)));
  const patchH = Math.max(5, Math.min(32, Math.floor(bboxHeight * 0.06)));
  const cornerOrigins: Array<[number, number]> = [
    [minX, minY],
    [Math.max(minX, maxX - patchW + 1), minY],
    [minX, Math.max(minY, maxY - patchH + 1)],
    [Math.max(minX, maxX - patchW + 1), Math.max(minY, maxY - patchH + 1)],
  ];

  const cornerColors = cornerOrigins.map(([sx, sy]) => {
    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;
    for (let y = sy; y <= Math.min(maxY, sy + patchH - 1); y += 1) {
      for (let x = sx; x <= Math.min(maxX, sx + patchW - 1); x += 1) {
        if (alphaAt(x, y) <= 80) continue;
        const color = rgbAt(x, y);
        r += color.r;
        g += color.g;
        b += color.b;
        count += 1;
      }
    }
    return count ? { r: Math.round(r / count), g: Math.round(g / count), b: Math.round(b / count) } : null;
  });

  let backgroundColor: RGB | null = null;
  let bestCluster: RGB[] = [];
  for (const candidate of cornerColors) {
    if (!candidate || !isLightNeutral(candidate)) continue;
    const cluster = cornerColors.filter((color): color is RGB => Boolean(color && distance(candidate, color) <= 24));
    if (cluster.length > bestCluster.length) {
      bestCluster = cluster;
      backgroundColor = {
        r: Math.round(cluster.reduce((sum, color) => sum + color.r, 0) / cluster.length),
        g: Math.round(cluster.reduce((sum, color) => sum + color.g, 0) / cluster.length),
        b: Math.round(cluster.reduce((sum, color) => sum + color.b, 0) / cluster.length),
      };
    }
  }

  const colorEdgeCoverage = backgroundColor
    ? edges.map((points) => {
        let matches = 0;
        let opaque = 0;
        for (const [x, y] of points) {
          if (alphaAt(x, y) <= 24) continue;
          opaque += 1;
          if (distance(rgbAt(x, y), backgroundColor as RGB) <= 30) matches += 1;
        }
        return opaque ? matches / opaque : 0;
      })
    : [0, 0, 0, 0];

  const lightEdges = colorEdgeCoverage.filter((value) => value >= 0.52).length;
  const lightFlatCanvas = Boolean(
    backgroundColor &&
      bestCluster.length >= 3 &&
      bboxAreaRatio >= 0.08 &&
      lightEdges >= 3,
  );

  return {
    rectangularCanvas: alphaRectangularCanvas || lightFlatCanvas,
    alphaRectangularCanvas,
    lightFlatCanvas,
    edgeCoverage: edgeCoverage.map((value) => Number(value.toFixed(3))),
    colorEdgeCoverage: colorEdgeCoverage.map((value) => Number(value.toFixed(3))),
    bbox: [minX, minY, maxX, maxY],
    backgroundColor,
  };
}

async function inspectOne(
  request: NextRequest,
  shoe: (typeof demoShoes)[number],
  image: ReturnType<typeof detailImages>[number],
): Promise<ImageResult> {
  const url = new URL("/api/detail-clean-image", request.nextUrl.origin);
  url.searchParams.set("src", image.url);
  url.searchParams.set("view", image.label);
  url.searchParams.set("brand", shoe.brand);
  url.searchParams.set("model", shoe.model);
  url.searchParams.set("v", "8");

  try {
    const response = await cleanDetailImage(new NextRequest(url));
    if (!response.ok) {
      return { slug: shoe.slug, label: image.label, ok: false, status: response.status, error: "cleanup-failed" };
    }
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      return { slug: shoe.slug, label: image.label, ok: false, status: response.status, error: "not-image" };
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const detection = await detectRectangularCanvas(buffer);
    return {
      slug: shoe.slug,
      label: image.label,
      ok: !detection.rectangularCanvas,
      status: response.status,
      ...detection,
    };
  } catch (error) {
    return {
      slug: shoe.slug,
      label: image.label,
      ok: false,
      error: error instanceof Error ? error.message : "audit-error",
    };
  }
}

async function mapWithConcurrency<T, R>(items: T[], concurrency: number, fn: (item: T) => Promise<R>) {
  const output: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      output[index] = await fn(items[index]);
    }
  });
  await Promise.all(workers);
  return output;
}

export async function GET(request: NextRequest) {
  const pageParam = Number(request.nextUrl.searchParams.get("page") ?? "0");
  const page = Number.isFinite(pageParam) && pageParam >= 0 ? Math.floor(pageParam) : 0;
  const start = page * PAGE_SIZE;
  const shoes = demoShoes.slice(start, start + PAGE_SIZE);
  const work = shoes.flatMap((shoe) => detailImages(shoe).map((image) => ({ shoe, image })));
  const results = await mapWithConcurrency(work, 6, ({ shoe, image }) => inspectOne(request, shoe, image));
  const failures = results.filter((result) => !result.ok);
  const boxes = failures.filter((result) => result.rectangularCanvas);

  return Response.json(
    {
      audit: "rgb-and-alpha-v2",
      page,
      pageSize: PAGE_SIZE,
      start,
      end: start + shoes.length,
      totalShoes: demoShoes.length,
      totalPages: Math.ceil(demoShoes.length / PAGE_SIZE),
      shoes: shoes.map((shoe) => shoe.slug),
      checkedImages: results.length,
      passedImages: results.length - failures.length,
      failedImages: failures.length,
      rectangularCanvasImages: boxes.length,
      failures,
      done: start + shoes.length >= demoShoes.length,
    },
    { headers: { "cache-control": "no-store" } },
  );
}
