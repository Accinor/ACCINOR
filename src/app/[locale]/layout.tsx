import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { CustomCursor } from "@/components/shared/custom-cursor"
import { AuthProvider } from "@/contexts/auth"
import { SITE_URL, SITE_NAME, ORGANIZATION } from "@/lib/site"
import { EditModeProvider } from "@/contexts/edit-mode"
import { EditModeToggle } from "@/components/shared/edit-mode-toggle"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter, Cairo } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "common" })

  const title = `${t("site_name")} | ${t("tagline")}`
  const description = t("footer.description")
  const ogLocale = locale === "ar" ? "ar_MA" : locale === "fr" ? "fr_FR" : "en_US"

  return {
    title: { default: title, template: `%s | ${t("site_name")}` },
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: { ar: `${SITE_URL}/ar`, fr: `${SITE_URL}/fr`, en: `${SITE_URL}/en` },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}`,
      siteName: SITE_NAME,
      locale: ogLocale,
      type: "website",
      images: [{ url: "/images/logo.png", width: 191, height: 191, alt: SITE_NAME }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/images/logo.png"] },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as "ar" | "fr" | "en")) {
    notFound()
  }

  const messages = await getMessages({ locale })

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`scroll-smooth ${inter.variable} ${cairo.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          // Organization structured data for search engines.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: ORGANIZATION.name,
              legalName: ORGANIZATION.legalName,
              url: ORGANIZATION.url,
              logo: ORGANIZATION.logo,
              description: ORGANIZATION.description,
              areaServed: ORGANIZATION.areaServed,
              sameAs: ORGANIZATION.sameAs,
            }),
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <a href="#main" className="skip-link">
            {locale === "ar" ? "تخطَّ إلى المحتوى" : locale === "fr" ? "Aller au contenu" : "Skip to content"}
          </a>
          <CustomCursor />
          <AuthProvider>
            <EditModeProvider>
              <Navbar />
              <main id="main" className="flex-1 pt-16">{children}</main>
              <Footer />
              <EditModeToggle />
            </EditModeProvider>
          </AuthProvider>
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
