import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://javinchutani.vercel.app";

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
