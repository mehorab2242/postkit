"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { FileDrop } from "@/components/ui/FileDrop";
import { trackCompletion } from "@/lib/analytics";
import { canvasToBlob, downloadZip, type ZipFile } from "@/lib/download";
import { ImageLoadError, loadImage } from "@/lib/loadImage";

type Ratio = "1:1" | "4:5";
type Fit = "crop" | "pad";

const PANEL_SIZE: Record<Ratio, { width: number; height: number }> = {
  "1:1": { width: 1080, height: 1080 },
  "4:5": { width: 1080, height: 1350 },
};

const PAD_COLOURS = [
  { value: "#ffffff", label: "White" },
  { value: "#000000", label: "Black" },
];

type Geometry = {
  /** Source rect the panels are taken from. */
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
  /** Where that rect lands inside the combined panel strip. */
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;
  stripWidth: number;
  stripHeight: number;
};

/**
 * Work out the source rect and its placement across N panels.
 *
 * Crop fills every panel and loses the edges; pad keeps the whole image and
 * adds bars. Boundaries between panels are computed later as floats so rounding
 * cannot accumulate into a visible seam.
 */
function geometry(
  imageWidth: number,
  imageHeight: number,
  panels: number,
  ratio: Ratio,
  fit: Fit,
): Geometry {
  const panel = PANEL_SIZE[ratio];
  const stripWidth = panel.width * panels;
  const stripHeight = panel.height;
  const stripRatio = stripWidth / stripHeight;
  const imageRatio = imageWidth / imageHeight;

  if (fit === "crop") {
    // Centre-crop the source to the strip's aspect ratio.
    let sWidth = imageWidth;
    let sHeight = imageHeight;

    if (imageRatio > stripRatio) {
      sWidth = imageHeight * stripRatio;
    } else {
      sHeight = imageWidth / stripRatio;
    }

    return {
      sx: (imageWidth - sWidth) / 2,
      sy: (imageHeight - sHeight) / 2,
      sWidth,
      sHeight,
      dx: 0,
      dy: 0,
      dWidth: stripWidth,
      dHeight: stripHeight,
      stripWidth,
      stripHeight,
    };
  }

  // Pad: scale the whole image to fit inside the strip, centre the remainder.
  const scale = Math.min(stripWidth / imageWidth, stripHeight / imageHeight);
  const dWidth = imageWidth * scale;
  const dHeight = imageHeight * scale;

  return {
    sx: 0,
    sy: 0,
    sWidth: imageWidth,
    sHeight: imageHeight,
    dx: (stripWidth - dWidth) / 2,
    dy: (stripHeight - dHeight) / 2,
    dWidth,
    dHeight,
    stripWidth,
    stripHeight,
  };
}

/**
 * Panel boundaries as exact integers with no accumulated drift: each edge is
 * rounded from the float position, and the last panel ends on the strip edge.
 */
function panelBounds(stripWidth: number, panels: number) {
  const sliceWidth = stripWidth / panels;

  return Array.from({ length: panels }, (_, index) => {
    const left = Math.round(index * sliceWidth);
    const right =
      index === panels - 1 ? stripWidth : Math.round((index + 1) * sliceWidth);

    return { left, width: right - left };
  });
}

export default function CarouselSplitter() {
  const [image, setImage] = useState<{
    bitmap: ImageBitmap;
    width: number;
    height: number;
  } | null>(null);
  const [panels, setPanels] = useState(3);
  const [ratio, setRatio] = useState<Ratio>("4:5");
  const [fit, setFit] = useState<Fit>("crop");
  const [padColour, setPadColour] = useState(PAD_COLOURS[0].value);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function handleFiles(files: File[]) {
    setError(null);

    try {
      const loaded = await loadImage(files[0]);

      setImage((previous) => {
        previous?.bitmap.close();
        return loaded;
      });
    } catch (cause) {
      setError(
        cause instanceof ImageLoadError
          ? cause.message
          : "That image could not be opened. Try another file.",
      );
    }
  }

  /** Draw the preview: the strip, plus cut lines showing where panels split. */
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !image) {
      return;
    }

    const geo = geometry(image.width, image.height, panels, ratio, fit);
    // Preview at a fraction of export size — a full 10-panel strip is huge.
    const scale = Math.min(1, 1200 / geo.stripWidth);

    canvas.width = Math.round(geo.stripWidth * scale);
    canvas.height = Math.round(geo.stripHeight * scale);

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    if (fit === "pad") {
      context.fillStyle = padColour;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.drawImage(
      image.bitmap,
      geo.sx,
      geo.sy,
      geo.sWidth,
      geo.sHeight,
      geo.dx * scale,
      geo.dy * scale,
      geo.dWidth * scale,
      geo.dHeight * scale,
    );

    context.strokeStyle = "#ff0080";
    context.lineWidth = 2;
    context.setLineDash([10, 8]);

    for (const bound of panelBounds(geo.stripWidth, panels).slice(1)) {
      const x = bound.left * scale;

      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
      context.stroke();
    }
  }, [image, panels, ratio, fit, padColour]);

  async function handleDownload() {
    if (!image) {
      return;
    }

    setWorking(true);
    setError(null);

    try {
      const geo = geometry(image.width, image.height, panels, ratio, fit);
      const size = PANEL_SIZE[ratio];
      const bounds = panelBounds(geo.stripWidth, panels);
      const files: ZipFile[] = [];

      /* Draw the full strip once at export resolution, then slice panels out of
         it. Slicing a rendered strip keeps padding, cropping and panel edges
         consistent, and avoids mapping each panel back into source pixels. */
      const strip = document.createElement("canvas");
      strip.width = geo.stripWidth;
      strip.height = geo.stripHeight;
      const stripContext = strip.getContext("2d");

      const canvas = document.createElement("canvas");
      canvas.width = size.width;
      canvas.height = size.height;
      const context = canvas.getContext("2d");

      if (!stripContext || !context) {
        throw new Error("Your browser could not export these panels.");
      }

      if (fit === "pad") {
        stripContext.fillStyle = padColour;
        stripContext.fillRect(0, 0, strip.width, strip.height);
      }

      stripContext.drawImage(
        image.bitmap,
        geo.sx,
        geo.sy,
        geo.sWidth,
        geo.sHeight,
        geo.dx,
        geo.dy,
        geo.dWidth,
        geo.dHeight,
      );

      for (const [index, bound] of bounds.entries()) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(
          strip,
          bound.left,
          0,
          bound.width,
          geo.stripHeight,
          0,
          0,
          size.width,
          size.height,
        );

        const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);

        // Zero-padded, or the gallery sorts 10 before 2.
        files.push({
          name: `${String(index + 1).padStart(2, "0")}.jpg`,
          blob,
        });
      }

      await downloadZip(files, `carousel-${panels}-panels.zip`);

      trackCompletion("carousel-splitter", {
        panels: String(panels),
        ratio,
        fit,
      });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Something went wrong making the panels.",
      );
    } finally {
      setWorking(false);
    }
  }

  const tooSmall = image
    ? image.width < panels * 200
    : false;

  return (
    <div className="p-4">
      {!image ? (
        <FileDrop onFiles={handleFiles} label="Add a photo to get started" />
      ) : (
        <div className="space-y-5">
          <div>
            <canvas
              ref={canvasRef}
              className="w-full border border-rule"
              role="img"
              aria-label={`Preview of your image split into ${panels} ${ratio} panels`}
            />
            <p className="mt-2 font-mono text-small text-muted">
              {image.width}×{image.height} source · {panels} panels ·{" "}
              {PANEL_SIZE[ratio].width}×{PANEL_SIZE[ratio].height} each
            </p>
          </div>

          <fieldset>
            <legend className="text-small font-bold">Panels</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {Array.from({ length: 9 }, (_, index) => index + 2).map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setPanels(count)}
                  aria-pressed={panels === count}
                  className={`min-h-11 min-w-11 border font-mono ${
                    panels === count
                      ? "border-mark text-mark-ink"
                      : "border-rule text-muted"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-small font-bold">Panel shape</legend>
            <div className="mt-2 flex gap-2">
              {(["4:5", "1:1"] as Ratio[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRatio(option)}
                  aria-pressed={ratio === option}
                  className={`min-h-11 border px-4 ${
                    ratio === option
                      ? "border-mark text-mark-ink"
                      : "border-rule text-muted"
                  }`}
                >
                  {option === "4:5" ? "Portrait 4:5" : "Square 1:1"}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-small font-bold">
              When it doesn&apos;t divide evenly
            </legend>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {(["crop", "pad"] as Fit[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFit(option)}
                  aria-pressed={fit === option}
                  className={`min-h-11 border px-4 ${
                    fit === option
                      ? "border-mark text-mark-ink"
                      : "border-rule text-muted"
                  }`}
                >
                  {option === "crop" ? "Crop the edges" : "Keep it all, add bars"}
                </button>
              ))}
              {fit === "pad" &&
                PAD_COLOURS.map((colour) => (
                  <button
                    key={colour.value}
                    type="button"
                    onClick={() => setPadColour(colour.value)}
                    aria-pressed={padColour === colour.value}
                    className={`min-h-11 border px-3 text-small ${
                      padColour === colour.value
                        ? "border-mark text-mark-ink"
                        : "border-rule text-muted"
                    }`}
                  >
                    {colour.label} bars
                  </button>
                ))}
            </div>
          </fieldset>

          {tooSmall && (
            <p className="text-small text-mark-ink">
              This image is small for {panels} panels — each one will be
              upscaled. Try fewer panels, or a wider image.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t border-rule pt-5">
            <Button onClick={handleDownload} disabled={working}>
              {working ? "Making panels…" : `Download ${panels} panels`}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                image.bitmap.close();
                setImage(null);
              }}
            >
              Use another photo
            </Button>
          </div>
          <p className="text-small text-muted">
            Upload in order — 01 first. On iPhone the zip lands in the Files app.
          </p>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-4 border border-mark p-3 text-small">
          {error}
        </p>
      )}
    </div>
  );
}
