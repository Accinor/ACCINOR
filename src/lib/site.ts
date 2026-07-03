// Central site constants — single source of truth for URLs, locales, and org data.
// Keeps SEO metadata, sitemap, robots, and structured data in sync.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://accinor.vercel.app"

export const SITE_NAME = "ACCINOR"

export const LOCALES = ["ar", "fr", "en"] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = "ar"

// Public routes included in the sitemap (per locale).
export const PUBLIC_ROUTES = [
  "",
  "/about",
  "/about/team",
  "/services",
  "/programs-training",
  "/funding-support",
  "/blog",
  "/contact",
  "/consultation",
  "/project-submission",
] as const

// Organization data for JSON-LD structured data.
export const ORGANIZATION = {
  name: SITE_NAME,
  legalName: "ACCINOR",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  description:
    "Entrepreneurship support, innovation and professional coaching platform in the Oriental region of Morocco.",
  areaServed: "Oriental Region, Morocco",
  sameAs: [] as string[], // add social profiles as they go live
}
