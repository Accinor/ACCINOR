"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { Globe01, Link03, MarkerPin01 } from "@untitledui/icons"
import { Reveal, StaggerReveal, StaggerItem } from "@/components/shared/animations"
import { MagicBentoCard } from "@/components/shared/magic-bento-card"
import { useRef } from "react"
import { SectionSpotlight } from "@/components/shared/section-spotlight"

type Member = {
  id: string
  name: string
  position: string
  bio: string
  avatar: string | null
  website: string | null
  linkedin: string | null
  city: string | null
}

function initialsOf(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "A"
}

export function TeamSection() {
  const t = useTranslations("home")
  const sectionRef = useRef<HTMLElement>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((d) => setMembers(Array.isArray(d.members) ? d.members : []))
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden min-h-screen flex items-center">
      <SectionSpotlight sectionRef={sectionRef} glowColor="255, 184, 27" spotlightRadius={300} />
      <div className="absolute inset-0 bg-gradient-to-br from-[#050a30] via-[#0a1035] to-[#050a30]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,184,27,0.06),transparent_70%)]" />

      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.1, 0.04] }}
          transition={{ duration: 5 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
          className="absolute rounded-full bg-[#ffb81b] blur-[100px]"
          style={{ width: `${200 + i * 100}px`, height: `${200 + i * 100}px`, top: `${20 + i * 25}%`, left: `${10 + i * 30}%` }}
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

        {loaded && members.length === 0 ? (
          <p className="text-center text-white/50">{t("team.subtitle")}</p>
        ) : (
          <StaggerReveal staggerDelay={0.12}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {members.map((member) => (
                <StaggerItem key={member.id}>
                  <MagicBentoCard>
                    <div className="relative p-6 rounded-2xl text-center">
                      <div className="relative mx-auto mb-6 w-32 h-32 md:w-36 md:h-36">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#ffb81b] to-[#ffb81b]/50 blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#ffb81b]/30 group-hover:border-[#ffb81b]/60 transition-colors duration-300 flex items-center justify-center bg-[#0a1440]">
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl font-bold text-[#ffb81b]">{initialsOf(member.name)}</span>
                          )}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                      {member.position && (
                        <p className="text-sm text-[#ffb81b]/80 mb-2">{member.position}</p>
                      )}
                      {member.city && (
                        <p className="text-xs text-white/40 mb-3 flex items-center justify-center gap-1">
                          <MarkerPin01 size={12} /> {member.city}
                        </p>
                      )}
                      {member.bio && (
                        <p className="text-sm text-white/60 mb-4 line-clamp-3">{member.bio}</p>
                      )}
                      <div className="flex justify-center gap-3">
                        {member.website && (
                          <a href={member.website} target="_blank" rel="noopener noreferrer"
                            className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#ffb81b]/20 border border-white/10 hover:border-[#ffb81b]/30 flex items-center justify-center transition-all duration-300">
                            <Globe01 size={16} color="rgba(255,255,255,0.6)" />
                          </a>
                        )}
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                            className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#ffb81b]/20 border border-white/10 hover:border-[#ffb81b]/30 flex items-center justify-center transition-all duration-300">
                            <Link03 size={16} color="rgba(255,255,255,0.6)" />
                          </a>
                        )}
                      </div>
                    </div>
                  </MagicBentoCard>
                </StaggerItem>
              ))}
            </div>
          </StaggerReveal>
        )}
      </div>

      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none" />
    </section>
  )
}
