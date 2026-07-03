import type { Metadata } from "next"
import "./globals.css"
import { SITE_URL, SITE_NAME } from "@/lib/site"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ACCINOR | من الفكرة إلى المشروع",
    template: "%s | ACCINOR",
  },
  description:
    "منصة متخصصة في دعم ريادة الأعمال والابتكار والمواكبة المهنية بجهة الشرق بالمغرب",
  applicationName: SITE_NAME,
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "ACCINOR | من الفكرة إلى المشروع",
    description:
      "منصة متخصصة في دعم ريادة الأعمال والابتكار والمواكبة المهنية بجهة الشرق بالمغرب",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ar_MA",
    type: "website",
    images: [{ url: "/images/logo.png", width: 191, height: 191, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ACCINOR | من الفكرة إلى المشروع",
    description:
      "منصة متخصصة في دعم ريادة الأعمال والابتكار والمواكبة المهنية بجهة الشرق بالمغرب",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
}

export function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "fr" }, { locale: "en" }]
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
