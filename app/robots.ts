import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Build-time only: the source for the generated share card.
      disallow: "/og-preview",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
