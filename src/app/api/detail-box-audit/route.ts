import { NextRequest } from "next/server";
import sharp from "sharp";
import { demoShoes } from "@/lib/data/catalog";
import { GET as cleanDetailImage } from "@/app/api/detail-clean-image/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const PAGE_SIZE = 8;

type ImageResult = {
  slug: string;
  label: string;
  ok: boolean;
  status?: number;
  rectangularCanvas?: boolean;
  edgeCoverage?: number[];
  bbox?: number[] | null;
  error?: string;
};

function detailImages(shoe: (typeof demoShoes)[number]) {
  const images = shoe.detailImages?.length ? shoe.detailImages : shoe.images;
  return images.filter((image) => image.url);
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

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * channels + alphaIndex];
      if (alpha <= 24) continue;
      visible += 1;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (!visible || maxX < minX || maxY < minY) {
    return { rectangularCanvas: false, edgeCoverage: [0, 0, 0, 0], bbox: null as number[] | null };
  }

  const bboxWidth = maxX - minX + 1;
  const bboxHeight = maxY - minY + 1;
  const bboxAreaRatio = (bboxWidth * bboxHeight) / (width * height);
  const band = Math.max(2, Math.min(5, Math.floor(Math.min(bboxWidth, bboxHeight) * 0.008)));

  const alphaAt = (x: number, y: number) => data[(y * width + x) * channels + alphaIndex] > 24;

  let topOpaque = 0;
  let topTotal = 0;
  let bottomOpaque = 0;
  let bottomTotal = 0;
  for (let y = minY; y < Math.min(maxY + 1, minY + band); y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      topTotal += 1;
      if (alphaAt(x, y)) topOpaque += 1;
    }
  }
  for (let y = Math.max(minY, maxY - band + 1); y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      bottomTotal += 1;
      if (alphaAt(x, y)) bottomOpaque += 1;
    }
  }

  let leftOpaque = 0;
  let leftTotal = 0;
  let rightOpaque = 0;
  let rightTotal = 0;
  for (let x = minX; x < Math.min(maxX + 1, minX + band); x += 1) {
    for (let y = minY; y <= maxY; y += 1) {
      leftTotal += 1;
      if (alphaAt(x, y)) leftOpaque += 1;
    }
  }
  for (let x = Math.max(minX, maxX - band + 1); x <= maxX; x += 1) {
    for (let y = minY; y <= maxY; y += 1) {
      rightTotal += 1;
      if (alphaAt(x, y)) rightOpaque += 1;
    }
  }

  const edgeCoverage = [
    topTotal ? topOpaque / topTotal : 0,
    rightTotal ? rightOpaque / rightTotal : 0,
    bottomTotal ? bottomOpaque / bottomTotal : 0,
    leftTotal ? leftOpaque / leftTotal : 0,
  ];

  const strongEdges = edgeCoverage.filter((value) => value >= 0.78).length;
  const moderateEdges = edgeCoverage.filter((value) => value >= 0.58).length;
  const rectangularCanvas = bboxAreaRatio >= 0.12 && (strongEdges >= 3 || moderateEdges === 4);

  return {
    rectangularCanvas,
    edgeCoverage: edgeCoverage.map((value) => Number(value.toFixed(3))),
    bbox: [minX, minY, maxX, maxY],
  };
}

async function inspectOne(request: NextRequest, shoe: (typeof demoShoes)[number], image: ReturnType<typeof detailImages>[number]): Promise<ImageResult> {
  const url = new URL("/api/detail-clean-image", request.nextUrl.origin);
  url.searchParams.set("src", image.url);
  url.searchParams.set("view", image.label);
  url.searchParams.set("brand", shoe.brand);
  url.searchParams.set("model", shoe.model);
  url.searchParams.set("v", "6");

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

  return Response.json({
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
  }, {
    headers: { "cache-control": "no-store" },
  });
}
