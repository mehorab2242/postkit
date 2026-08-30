/**
 * THE REGISTRY.
 *
 * Sitemap, homepage grid, nav, related links and JSON-LD all derive from this
 * array. Adding a tool is one entry here plus one component in
 * `components/tools/`. Nothing else should need to change.
 *
 * Slugs are URL paths and are IMMUTABLE after publish.
 */

export type ToolCategory = "image" | "text" | "calculator";

export type Tool = {
  /** = URL path, immutable after publish */
  slug: string;
  name: string;
  h1: string;
  /** ≤60 chars */
  metaTitle: string;
  /** ≤155 chars */
  metaDescription: string;
  category: ToolCategory;
  /** exactly 3 slugs */
  related: string[];
  /** 1–2 sentences, rendered above the tool */
  intro: string;
  /** 400–600 words, rendered below the tool as paragraphs */
  body: string[];
  howTo: { step: string; detail: string }[];
  faq: { q: string; a: string }[];
  /** ISO date */
  published: string;
};

export const SITE_URL = "https://postkit.com";
export const SITE_NAME = "Postkit";

export const tools: Tool[] = [
  {
    slug: "engagement-rate-calculator",
    name: "Engagement Rate Calculator",
    h1: "Engagement Rate Calculator",
    metaTitle: "Engagement Rate Calculator — Free | Postkit",
    metaDescription:
      "Work out your engagement rate from followers, likes and comments, and see how it compares for your follower range. Free, instant, no signup.",
    category: "calculator",
    related: [
      "carousel-splitter",
      "instagram-grid-planner",
      "profile-picture-cropper",
    ],
    intro:
      "Enter your followers and your average likes and comments to get your engagement rate, plus a benchmark for accounts your size.",
    body: [],
    howTo: [
      {
        step: "Enter your follower count",
        detail:
          "Use the number shown on your profile. Commas are fine — they get stripped automatically.",
      },
      {
        step: "Add your average likes and comments",
        detail:
          "Take your last 9 to 12 posts, add up the likes, and divide by the number of posts. Do the same for comments.",
      },
      {
        step: "Read your rate and benchmark",
        detail:
          "The rate updates as you type, alongside the typical range for your follower tier.",
      },
      {
        step: "Copy the line for your media kit",
        detail:
          "One tap copies a pitch-ready line you can paste straight into a brand email.",
      },
    ],
    faq: [],
    published: "2026-08-30",
  },
  {
    slug: "carousel-splitter",
    name: "Carousel Splitter",
    h1: "Split an Image into an Instagram Carousel",
    metaTitle: "Free Carousel Splitter — Split Photos | Postkit",
    metaDescription:
      "Cut a wide image into perfectly aligned carousel panels. Preview the cut lines, then download a numbered zip. Free, and nothing is uploaded.",
    category: "image",
    related: [
      "instagram-grid-planner",
      "profile-picture-cropper",
      "engagement-rate-calculator",
    ],
    intro:
      "Slice one wide photo into seamless carousel panels. Everything runs in your browser — your image never leaves your device.",
    body: [],
    howTo: [
      {
        step: "Add your image",
        detail:
          "JPG, PNG or WebP. Wide photos work best — panoramas, banners, or a design laid out across several screens.",
      },
      {
        step: "Choose how many panels",
        detail:
          "Between 2 and 10. Three is the usual choice, and it keeps each panel large enough to read.",
      },
      {
        step: "Pick the panel shape",
        detail:
          "Square (1080×1080) or portrait (1080×1350). Portrait takes up more of the feed.",
      },
      {
        step: "Check the cut lines",
        detail:
          "The preview draws the cuts over your photo before anything is generated, so you can see where faces and text will land.",
      },
      {
        step: "Download the panels",
        detail:
          "You get a zip of numbered files. Upload them in order — 01 first.",
      },
    ],
    faq: [],
    published: "2026-08-30",
  },
  {
    slug: "instagram-grid-planner",
    name: "Grid Planner",
    h1: "Instagram Grid Planner",
    metaTitle: "Instagram Grid Planner — Free Feed Preview | Postkit",
    metaDescription:
      "Drag your photos into order and see your grid before you post. Works on phones, saves your layout, and nothing is uploaded.",
    category: "image",
    related: [
      "carousel-splitter",
      "profile-picture-cropper",
      "fancy-text-generator",
    ],
    intro:
      "Drop in up to 18 photos, drag them into the order you want, and see the grid the way visitors will.",
    body: [],
    howTo: [
      {
        step: "Add your photos",
        detail: "Up to 18 at once. They load as small previews to stay fast on a phone.",
      },
      {
        step: "Drag to reorder",
        detail:
          "Press and hold a tile for a moment, then drag. The grid fills newest-first, the way a profile does.",
      },
      {
        step: "Switch on the tall crop",
        detail:
          "Feed thumbnails render taller than square, so the 3:4 preview shows what actually gets cropped.",
      },
      {
        step: "Come back later",
        detail:
          "Your layout is saved in this browser, so closing the tab does not lose it.",
      },
    ],
    faq: [],
    published: "2026-08-30",
  },
  {
    slug: "fancy-text-generator",
    name: "Fancy Text Generator",
    h1: "Fancy Text Generator",
    metaTitle: "Fancy Text Generator — Copy and Paste | Postkit",
    metaDescription:
      "Turn your text into bold, italic, script, bubble and dozens of other styles. Tap any row to copy. Free and instant.",
    category: "text",
    related: [
      "instagram-grid-planner",
      "engagement-rate-calculator",
      "carousel-splitter",
    ],
    intro:
      "Type once and get dozens of styled versions for your bio, captions and comments. Tap a row to copy it.",
    body: [],
    howTo: [
      {
        step: "Type or paste your text",
        detail: "Every style updates as you type.",
      },
      {
        step: "Find a style you like",
        detail:
          "Scroll the list — bold, italic, script, fraktur, outline, bubble, square, upside down and more.",
      },
      {
        step: "Tap to copy",
        detail: "One tap copies that row. Paste it wherever you need it.",
      },
    ],
    faq: [],
    published: "2026-08-30",
  },
  {
    slug: "profile-picture-cropper",
    name: "Profile Picture Cropper",
    h1: "Profile Picture Cropper",
    metaTitle: "Profile Picture Cropper — Free Circle Crop | Postkit",
    metaDescription:
      "Position and zoom your photo inside the circle, then download a clean 1080×1080 profile picture. Free, and nothing is uploaded.",
    category: "image",
    related: [
      "carousel-splitter",
      "instagram-grid-planner",
      "fancy-text-generator",
    ],
    intro:
      "Drag and zoom until your face sits right inside the circle, then download a square image sized for every platform.",
    body: [],
    howTo: [
      {
        step: "Add your photo",
        detail: "JPG, PNG or WebP. Photos taken sideways are corrected automatically.",
      },
      {
        step: "Position it in the circle",
        detail:
          "Drag to move, pinch or use the slider to zoom. The circle shows exactly what platforms will keep.",
      },
      {
        step: "Download the square file",
        detail:
          "You get a 1080×1080 image. Platforms apply their own circular mask when you upload it.",
      },
    ],
    faq: [],
    published: "2026-08-30",
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getTools(slugs: string[]): Tool[] {
  return slugs
    .map((slug) => getTool(slug))
    .filter((tool): tool is Tool => Boolean(tool));
}
