"use client";

import { useId, useRef, useState } from "react";

import { ACCEPT_ATTRIBUTE } from "@/lib/loadImage";

type FileDropProps = {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  label?: string;
  hint?: string;
};

/**
 * File input that also accepts a drag-and-drop on desktop. The visible control
 * is a real `<label>` bound to the input, so keyboard and screen reader users
 * get the native behaviour for free.
 */
export function FileDrop({
  onFiles,
  multiple = false,
  label = "Add a photo to get started",
  hint,
}: FileDropProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragging(false);

    const files = [...event.dataTransfer.files].filter((file) =>
      file.type.startsWith("image/"),
    );

    if (files.length > 0) {
      onFiles(multiple ? files : files.slice(0, 1));
    }
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`border border-dashed p-8 text-center ${
        dragging ? "border-mark" : "border-rule"
      }`}
    >
      <label
        htmlFor={id}
        className="inline-flex min-h-11 cursor-pointer items-center bg-mark px-4 font-bold text-white"
      >
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        multiple={multiple}
        className="sr-only"
        onChange={(event) => {
          const files = [...(event.target.files ?? [])];

          if (files.length > 0) {
            onFiles(files);
          }

          // Reset so picking the same file twice still fires a change.
          event.target.value = "";
        }}
      />
      <p className="mt-3 text-small text-muted">
        {hint ?? "JPG, PNG or WebP. Nothing is uploaded — it stays on your device."}
      </p>
    </div>
  );
}
