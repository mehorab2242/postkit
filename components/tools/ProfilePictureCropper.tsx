"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { FileDrop } from "@/components/ui/FileDrop";
import { trackCompletion } from "@/lib/analytics";
import { canvasToBlob, downloadBlob } from "@/lib/download";
import { ImageLoadError, loadImage } from "@/lib/loadImage";

const EXPORT_SIZE = 1080;
const MAX_SCALE = 4;

type Transform = { scale: number; offsetX: number; offsetY: number };

export default function ProfilePictureCropper() {
  const [image, setImage] = useState<{
    bitmap: ImageBitmap;
    width: number;
    height: number;
  } | null>(null);
  const [transform, setTransform] = useState<Transform>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null);

  /**
   * Clamp so the image can never be dragged off the crop area and leave a gap.
   * Offsets are in crop-square units, where 1 = the full square.
   */
  const clamp = useCallback(
    (next: Transform): Transform => {
      if (!image) {
        return next;
      }

      const scale = Math.min(Math.max(next.scale, 1), MAX_SCALE);
      // The image covers the square at scale 1; slack is what is left over.
      const ratio = image.width / image.height;
      const coverWidth = (ratio > 1 ? ratio : 1) * scale;
      const coverHeight = (ratio > 1 ? 1 : 1 / ratio) * scale;
      const slackX = Math.max(0, (coverWidth - 1) / 2);
      const slackY = Math.max(0, (coverHeight - 1) / 2);

      return {
        scale,
        offsetX: Math.min(Math.max(next.offsetX, -slackX), slackX),
        offsetY: Math.min(Math.max(next.offsetY, -slackY), slackY),
      };
    },
    [image],
  );

  async function handleFiles(files: File[]) {
    setError(null);

    try {
      const loaded = await loadImage(files[0]);

      setImage((previous) => {
        previous?.bitmap.close();
        return loaded;
      });
      setTransform({ scale: 1, offsetX: 0, offsetY: 0 });
    } catch (cause) {
      setError(
        cause instanceof ImageLoadError
          ? cause.message
          : "That image could not be opened. Try another file.",
      );
    }
  }

  /** Draw the image under a dark scrim with a transparent circle cut out. */
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !image) {
      return;
    }

    const size = canvas.width;
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.clearRect(0, 0, size, size);

    const ratio = image.width / image.height;
    const drawWidth = (ratio > 1 ? ratio : 1) * size * transform.scale;
    const drawHeight = (ratio > 1 ? 1 : 1 / ratio) * size * transform.scale;

    context.drawImage(
      image.bitmap,
      (size - drawWidth) / 2 + transform.offsetX * size,
      (size - drawHeight) / 2 + transform.offsetY * size,
      drawWidth,
      drawHeight,
    );

    context.save();
    context.fillStyle = "rgba(22, 22, 26, 0.55)";
    context.beginPath();
    context.rect(0, 0, size, size);
    context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
    context.fill("evenodd");
    context.restore();
  }, [image, transform]);

  function distanceBetweenPointers() {
    const [first, second] = [...pointers.current.values()];

    return Math.hypot(first.x - second.x, first.y - second.y);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (pointers.current.size === 2) {
      pinchStart.current = {
        distance: distanceBetweenPointers(),
        scale: transform.scale,
      };
    }
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    const previous = pointers.current.get(event.pointerId);

    if (!previous) {
      return;
    }

    // Stop the browser zooming the page instead of the image.
    event.preventDefault();

    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (pointers.current.size >= 2 && pinchStart.current) {
      const factor = distanceBetweenPointers() / pinchStart.current.distance;

      setTransform((current) =>
        clamp({ ...current, scale: pinchStart.current!.scale * factor }),
      );

      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    setTransform((current) =>
      clamp({
        ...current,
        offsetX: current.offsetX + (event.clientX - previous.x) / rect.width,
        offsetY: current.offsetY + (event.clientY - previous.y) / rect.height,
      }),
    );
  }

  function handlePointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
    pointers.current.delete(event.pointerId);

    if (pointers.current.size < 2) {
      pinchStart.current = null;
    }
  }

  async function handleDownload() {
    if (!image) {
      return;
    }

    setError(null);

    try {
      /* Export square, not circular: platforms apply their own circular mask,
         and transparent corners show as edges wherever the image is composited
         onto a background. */
      const canvas = document.createElement("canvas");
      canvas.width = EXPORT_SIZE;
      canvas.height = EXPORT_SIZE;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Your browser could not export this image.");
      }

      const ratio = image.width / image.height;
      const drawWidth = (ratio > 1 ? ratio : 1) * EXPORT_SIZE * transform.scale;
      const drawHeight =
        (ratio > 1 ? 1 : 1 / ratio) * EXPORT_SIZE * transform.scale;

      context.drawImage(
        image.bitmap,
        (EXPORT_SIZE - drawWidth) / 2 + transform.offsetX * EXPORT_SIZE,
        (EXPORT_SIZE - drawHeight) / 2 + transform.offsetY * EXPORT_SIZE,
        drawWidth,
        drawHeight,
      );

      const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);

      downloadBlob(blob, "profile-picture.jpg");

      trackCompletion("profile-picture-cropper");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Something went wrong saving your picture.",
      );
    }
  }

  return (
    <div className="p-4">
      {!image ? (
        <FileDrop onFiles={handleFiles} label="Add a photo to get started" />
      ) : (
        <div className="space-y-5">
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full max-w-sm cursor-grab touch-none border border-rule"
            role="img"
            aria-label={`Your photo positioned in the circle at ${Math.round(
              transform.scale * 100,
            )} percent zoom`}
          />

          <div>
            <label htmlFor="zoom" className="block text-small font-bold">
              Zoom
            </label>
            <input
              id="zoom"
              type="range"
              min={100}
              max={MAX_SCALE * 100}
              value={Math.round(transform.scale * 100)}
              onChange={(event) =>
                setTransform((current) =>
                  clamp({ ...current, scale: Number(event.target.value) / 100 }),
                )
              }
              className="mt-2 h-11 w-full max-w-sm accent-mark"
            />
            <p className="font-mono text-small text-muted">
              {Math.round(transform.scale * 100)}% · exports at {EXPORT_SIZE}×
              {EXPORT_SIZE}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-rule pt-5">
            <Button onClick={handleDownload}>Download picture</Button>
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
            Drag to move, pinch or use the slider to zoom. The file is square —
            each platform rounds it off when you upload.
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
