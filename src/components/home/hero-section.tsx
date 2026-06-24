"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  const t = useTranslations("home.hero")
  const cta = useTranslations("common.cta")
  const params = useParams()
  const locale = params.locale as string
  const isRtl = locale === "ar"

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-16">
      <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.7_0.15_75/0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.5_0.1_265/0.2),transparent_60%)]" />
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            {t("subtitle")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-tight"
          >
            {t("title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            {t("description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link href={`/${locale}/consultation`}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
              >
                {cta("consultation")}
                {!isRtl && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </Link>
            <Link href={`/${locale}/project-submission`}>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
              >
                {cta("submit_project")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
    </section>
  )
}
