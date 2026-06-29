import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { SplashCursorWrapper } from "@/components/shared/splash-cursor-wrapper"
import { EditModeProvider } from "@/contexts/edit-mode"
import { EditModeToggle } from "@/components/shared/edit-mode-toggle"
import { Inter, Cairo } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"

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

  return {
    title: {
      default: `${t("site_name")} | ${t("tagline")}`,
      template: `%s | ${t("site_name")}`,
    },
    description: t("footer.description"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: "/ar",
        fr: "/fr",
        en: "/en",
      },
    },
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
        <NextIntlClientProvider messages={messages}>
          <SplashCursorWrapper />
          <EditModeProvider>
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
            <EditModeToggle />
          </EditModeProvider>
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
