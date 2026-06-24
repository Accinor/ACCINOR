"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, MessageCircle } from "lucide-react"

export function CtaSection() {
  const t = useTranslations("home.cta")
  const cta = useTranslations("common.cta")
  const params = useParams()
  const locale = params.locale as string
  const isRtl = locale === "ar"

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[var(--gradient-cta)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,oklch(1_0_0/0.1),transparent_60%)]" />
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-10">
            {t("subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={`/${locale}/consultation`}>
              <Button
                size="lg"
                className="bg-white text-[var(--brand-navy)] hover:bg-white/90 shadow-lg shadow-black/10 hover:shadow-xl transition-all duration-300"
              >
                {cta("consultation")}
                {!isRtl && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </Link>
            <Link href={`/${locale}/contact`}>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                {cta("learn_more")}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  )
}
