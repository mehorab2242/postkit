import type { MetadataRoute } from "next";

import { SITE_URL, tools } from "@/lib/tools";

export const dynamic = "force-static";

const staticPages = ["about", "privacy", "terms", "contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...tools.map((tool) => ({
      url: `${SITE_URL}/${tool.slug}/`,
      lastModified: new Date(tool.published),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...staticPages.map((page) => ({
      url: `${SITE_URL}/${page}/`,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
