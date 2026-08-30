"use client";

import { CropFrame } from "@/components/ui/CropMark";
import { toolComponents } from "@/components/tools";

/**
 * The one client boundary on a tool page. Everything around it — heading,
 * intro, how-to, body, FAQ — is server-rendered HTML.
 */
export function ToolIsland({ slug }: { slug: string }) {
  const Tool = toolComponents[slug];

  if (!Tool) {
    return null;
  }

  return (
    <div className="my-6">
      <CropFrame>
        <Tool />
      </CropFrame>
    </div>
  );
}
