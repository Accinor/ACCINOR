import type { MetadataRoute } from "next"
import { SITE_URL, LOCALES, PUBLIC_ROUTES } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of LOCALES) {
    for (const route of PUBLIC_ROUTES) {
      entries.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "/blog" ? "daily" : "weekly",
        priority: route === "" ? 1 : route.startsWith("/blog") ? 0.8 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${SITE_URL}/${l}${route}`])
          ),
        },
      })
    }
  }

  return entries
}
