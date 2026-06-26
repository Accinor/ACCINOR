"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import { motion } from "framer-motion"
import { Link03, Share07, Globe01 } from "@untitledui/icons"
import { Reveal, StaggerReveal, StaggerItem } from "@/components/shared/animations"
import { MagicBentoCard } from "@/components/shared/magic-bento-card"
import { useRef } from "react"
import { SectionSpotlight } from "@/components/shared/section-spotlight"

const teamMembers = [
  { name: "Naima Lamrani", role: "team.roles.director", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face" },
  { name: "Youssef Benali", role: "team.roles.coach", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" },
  { name: "Fatima El Ouali", role: "team.roles.finance", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face" },
  { name: "Omar Chafik", role: "team.roles.digital", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
]

export function TeamSection() {
  const t = useTranslations("home")
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden min-h-screen flex items-center">
      <SectionSpotlight sectionRef={sectionRef} glowColor="255, 184, 27" spotlightRadius={300} />
      <div className="absolute inset-0 bg-gradient-to-br from-[#050a30] via-[#0a1035] to-[#050a30]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,184,27,0.06),transparent_70%)]" />

      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.04, 0.1, 0.04],
          }}
          transition={{
            duration: 5 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
          className="absolute rounded-full bg-[#ffb81b] blur-[100px]"
          style={{
            width: `${200 + i * 100}px`,
            height: `${200 + i * 100}px`,
            top: `${20 + i * 25}%`,
            left: `${10 + i * 30}%`,
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
            {t("team.title")}
          </h2>
          <p className="text-lg text-white/70 mb-16 text-center max-w-2xl mx-auto">
            {t("team.subtitle")}
          </p>
        </Reveal>

        <StaggerReveal staggerDelay={0.12}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, i) => (
              <StaggerItem key={member.name}>
                <MagicBentoCard>
                  <div className="relative p-6 rounded-2xl text-center">
                    <div className="relative mx-auto mb-6 w-32 h-32 md:w-40 md:h-40">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#ffb81b] to-[#ffb81b]/50 blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#ffb81b]/30 group-hover:border-[#ffb81b]/60 transition-colors duration-300">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-[#ffb81b]/80 mb-4">
                      {t(member.role)}
                    </p>
                    <div className="flex justify-center gap-3">
                      {[Link03, Share07, Globe01].map((Icon, j) => (
                        <motion.button
                          key={j}
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.4 }}
                          className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#ffb81b]/20 border border-white/10 hover:border-[#ffb81b]/30 flex items-center justify-center transition-all duration-300"
                        >
                          <Icon size={16} color="rgba(255,255,255,0.5)" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </MagicBentoCard>
              </StaggerItem>
            ))}
          </div>
        </StaggerReveal>
      </div>

      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none" />
    </section>
  )
}
