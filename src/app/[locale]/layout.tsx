import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

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

  const messages = await getMessages()

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
