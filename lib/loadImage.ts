/**
 * File → a clean, orientation-corrected, safely-sized bitmap.
 *
 * Every image tool goes through here so the awkward parts — EXIF rotation, the
 * iOS canvas ceiling, HEIC — are solved once.
 */

export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ACCEPT_ATTRIBUTE = "image/jpeg,image/png,image/webp,image/heic";

/**
 * iOS Safari caps total canvas area at roughly 16.7M pixels and returns a blank
 * canvas past it — silently, with no error. Stay well under on the long edge.
 */
const MAX_EDGE = 4000;

export const HEIC_MESSAGE =
  "iPhone HEIC photos aren't supported yet. In Settings → Camera → Formats, choose Most Compatible, or share the photo to convert it to JPG.";

export class ImageLoadError extends Error {}

export type LoadedImage = {
  bitmap: ImageBitmap;
  width: number;
  height: number;
};

/**
 * Detect HEIC from the file's magic bytes rather than trusting the extension:
 * the first 12 bytes carry `ftyp` followed by a brand of `heic`/`heix`/`mif1`.
 */
export async function isHeic(file: File): Promise<boolean> {
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  if (header.length < 12) {
    return false;
  }

  const boxType = String.fromCharCode(...header.slice(4, 8));

  if (boxType !== "ftyp") {
    return false;
  }

  const brand = String.fromCharCode(...header.slice(8, 12));

  return ["heic", "heix", "hevc", "hevx", "mif1", "msf1"].includes(brand);
}

/** Draw a bitmap down to fit within maxEdge, returning a fresh bitmap. */
async function downscale(
  bitmap: ImageBitmap,
  maxEdge: number,
): Promise<ImageBitmap> {
  const scale = maxEdge / Math.max(bitmap.width, bitmap.height);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new ImageLoadError("Your browser could not process this image.");
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return createImageBitmap(canvas);
}

export async function loadImage(
  file: File,
  { maxEdge = MAX_EDGE }: { maxEdge?: number } = {},
): Promise<LoadedImage> {
  if (await isHeic(file)) {
    throw new ImageLoadError(HEIC_MESSAGE);
  }

  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new ImageLoadError(
      "That file type isn't supported. Use a JPG, PNG or WebP image.",
    );
  }

  let bitmap: ImageBitmap;

  try {
    // `from-image` applies EXIF orientation natively — no manual parsing.
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new ImageLoadError(
      "This image could not be opened. It may be damaged — try another file.",
    );
  }

  if (Math.max(bitmap.width, bitmap.height) > maxEdge) {
    bitmap = await downscale(bitmap, maxEdge);
  }

  return { bitmap, width: bitmap.width, height: bitmap.height };
}

/** A small preview bitmap, for grids that hold many images at once. */
export async function thumbnail(file: File, edge = 300): Promise<string> {
  const { bitmap } = await loadImage(file, { maxEdge: edge });

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", 0.8);
}
