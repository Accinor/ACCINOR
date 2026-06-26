"use client"

import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Stars02 } from "@untitledui/icons"
import Image from "next/image"
import { MagneticButton } from "@/components/shared/animations"
import { EditableText } from "@/components/shared/editable-text"

export function HeroSection() {
  const t = useTranslations("home.hero")
  const cta = useTranslations("common.cta")
  const params = useParams()
  const locale = params.locale as string
  const isRtl = locale === "ar"

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050a30] via-[#070e4a] to-[#0a1260]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,184,27,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,184,27,0.08),transparent_60%)]" />

      <div className="absolute inset-0 bg-[image:repeating-linear-gradient(0deg,transparent,transparent_40px,rgba(255,255,255,0.015)_40px,rgba(255,255,255,0.015)_41px),repeating-linear-gradient(90deg,transparent,transparent_40px,rgba(255,255,255,0.015)_40px,rgba(255,255,255,0.015)_41px)]" />

      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.2, 0.08],
            x: [0, 30 * (i % 2 === 0 ? 1 : -1), 0],
            y: [0, -20 * (i % 2 === 0 ? 1 : -1), 0],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
          className="absolute rounded-full bg-[#ffb81b] blur-3xl"
          style={{
            width: `${100 + i * 80}px`,
            height: `${100 + i * 80}px`,
            top: `${15 + i * 18}%`,
            left: `${10 + i * 15}%`,
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <Image
              src="/images/logo.png"
              alt="ACCINOR"
              width={320}
              height={100}
              className="h-24 w-auto brightness-0 invert opacity-95"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ffb81b]/30 bg-[#ffb81b]/10 text-[#ffb81b] text-sm font-medium mb-8 shadow-xs-skeuomorphic">
              <Stars02 size={16} />
              {t("subtitle")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-tight"
          >
            <EditableText page="home" section="hero" field="title" as="span" locale={locale}>
              {t("title")}
            </EditableText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            <EditableText page="home" section="hero" field="description" as="span" locale={locale}>
              {t("description")}
            </EditableText>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link href={`/${locale}/consultation`}>
              <MagneticButton>
                <Button
                  size="lg"
                  className="bg-[#ffb81b] hover:bg-[#e5a318] text-[#050a30] font-bold shadow-lg shadow-[#ffb81b]/25 hover:shadow-xl hover:shadow-[#ffb81b]/30 hover:scale-105 transition-all duration-300 rounded-full"
                >
                  {cta("consultation")}
                  {!isRtl && <ArrowRight size={16} className="ml-2" />}
                </Button>
              </MagneticButton>
            </Link>
            <Link href={`/${locale}/project-submission`}>
              <MagneticButton>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 hover:scale-105 transition-all duration-300"
                >
                  {cta("submit_project")}
                </Button>
              </MagneticButton>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-white/30"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 13l5 5 5-5" />
                <path d="M7 6l5 5 5-5" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
