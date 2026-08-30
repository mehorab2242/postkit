"use client";

import { useState } from "react";

import { copyText } from "@/lib/copy";

type CopyButtonProps = {
  text: string;
  label?: string;
  className?: string;
};

export function CopyButton({
  text,
  label = "Copy",
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  function handleClick() {
    // Called synchronously from the gesture — Safari requires it.
    copyText(text).then((success) => {
      if (!success) {
        return;
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex min-h-11 items-center justify-center px-3 text-small font-bold ${className}`}
    >
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
