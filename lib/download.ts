/** Browser downloads. JSZip is imported inside the function, never at module top. */

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export type ZipFile = { name: string; blob: Blob };

/**
 * JSZip is ~100kb, so it loads on the download click rather than on page load.
 */
export async function downloadZip(
  files: ZipFile[],
  filename: string,
): Promise<void> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.name, file.blob);
  }

  const blob = await zip.generateAsync({ type: "blob" });

  downloadBlob(blob, filename);
}

/** Canvas → Blob, promisified. */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = "image/jpeg",
  quality = 0.92,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Could not export the image.")),
      type,
      quality,
    );
  });
}
