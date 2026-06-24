"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react"

export function CtaSection() {
  const t = useTranslations("home.cta")
  const cta = useTranslations("common.cta")
  const params = useParams()
  const locale = params.locale as string
  const isRtl = locale === "ar"

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.1),transparent_60%)]" />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/10 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.06, 0.12, 0.06],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/10 blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6"
          >
            <MessageCircle className="w-8 h-8 text-white" />
          </motion.div>

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
                className="bg-white text-amber-700 hover:bg-white/90 hover:scale-105 shadow-lg shadow-black/10 hover:shadow-xl transition-all duration-300"
              >
                <Sparkles className="mr-2 w-4 h-4" />
                {cta("consultation")}
                {!isRtl && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </Link>
            <Link href={`/${locale}/contact`}>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 hover:scale-105 transition-all duration-300"
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
