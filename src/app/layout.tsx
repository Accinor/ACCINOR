import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "ACCINOR | من الفكرة إلى المشروع",
    template: "%s | ACCINOR",
  },
  description:
    "منصة متخصصة في دعم ريادة الأعمال والابتكار والمواكبة المهنية بجهة الشرق بالمغرب",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "ACCINOR | من الفكرة إلى المشروع",
    description:
      "منصة متخصصة في دعم ريادة الأعمال والابتكار والمواكبة المهنية بجهة الشرق بالمغرب",
    url: "https://accinor.ma",
    siteName: "ACCINOR",
    locale: "ar_MA",
    type: "website",
    images: [
      {
        url: "/images/logo.png",
        width: 191,
        height: 191,
        alt: "ACCINOR",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
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
