import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * slug → tool component.
 *
 * Every entry is dynamically imported with `ssr: false`: these are canvas and
 * file APIs with nothing to server-render, and skipping SSR keeps their
 * JavaScript off the page until it is needed. `ssr: false` only works inside a
 * Client Component, which is why this map is consumed by ToolIsland.
 */
export const toolComponents: Record<string, ComponentType> = {
  "engagement-rate-calculator": dynamic(
    () => import("./EngagementRateCalculator"),
    { ssr: false },
  ),
  "carousel-splitter": dynamic(() => import("./CarouselSplitter"), {
    ssr: false,
  }),
  "instagram-grid-planner": dynamic(() => import("./GridPlanner"), {
    ssr: false,
  }),
  "fancy-text-generator": dynamic(() => import("./FancyTextGenerator"), {
    ssr: false,
  }),
  "profile-picture-cropper": dynamic(() => import("./ProfilePictureCropper"), {
    ssr: false,
  }),
};
