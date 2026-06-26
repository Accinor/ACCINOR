"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"

interface SectionSpotlightProps {
  sectionRef: React.RefObject<HTMLElement | null>
  glowColor?: string
  spotlightRadius?: number
  disabled?: boolean
}

export function SectionSpotlight({
  sectionRef,
  glowColor = "255, 184, 27",
  spotlightRadius = 300,
  disabled = false,
}: SectionSpotlightProps) {
  const spotlightRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (disabled || !sectionRef.current) return

    const spotlight = document.createElement("div")
    spotlight.className = "section-spotlight"
    spotlight.style.cssText = `
      position: fixed;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.12) 0%,
        rgba(${glowColor}, 0.06) 20%,
        rgba(${glowColor}, 0.03) 40%,
        transparent 65%
      );
      z-index: 1;
      opacity: 0;
      transform: translate(-50%, -50%);
    `
    document.body.appendChild(spotlight)
    spotlightRef.current = spotlight

    const section = sectionRef.current!

    const updateSpotlight = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom

      if (!inside) {
        gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: "power2.out" })
        const cards = section.querySelectorAll<HTMLElement>(".magic-bento-card")
        cards.forEach((card) => card.style.setProperty("--glow-intensity", "0"))
        return
      }

      gsap.to(spotlight, { left: e.clientX, top: e.clientY, duration: 0.15, ease: "power2.out" })

      const cards = section.querySelectorAll<HTMLElement>(".magic-bento-card")
      let minDistance = Infinity

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect()
        const cx = cardRect.left + cardRect.width / 2
        const cy = cardRect.top + cardRect.height / 2
        const dist = Math.max(0, Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(cardRect.width, cardRect.height) / 2)
        minDistance = Math.min(minDistance, dist)

        const proximity = spotlightRadius * 0.5
        const fadeDist = spotlightRadius * 0.75
        let intensity = 0
        if (dist <= proximity) intensity = 1
        else if (dist <= fadeDist) intensity = (fadeDist - dist) / (fadeDist - proximity)

        card.style.setProperty("--glow-x", `${((e.clientX - cardRect.left) / cardRect.width) * 100}%`)
        card.style.setProperty("--glow-y", `${((e.clientY - cardRect.top) / cardRect.height) * 100}%`)
        card.style.setProperty("--glow-intensity", intensity.toString())
        card.style.setProperty("--glow-radius", `${spotlightRadius}px`)
      })

      const targetOpacity = minDistance <= spotlightRadius * 0.5 ? 0.6 : minDistance <= spotlightRadius * 0.75 ? 0.3 : 0
      gsap.to(spotlight, { opacity: targetOpacity, duration: 0.2, ease: "power2.out" })
    }

    const handleMouseLeave = () => {
      gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: "power2.out" })
      section.querySelectorAll<HTMLElement>(".magic-bento-card").forEach((card) => {
        card.style.setProperty("--glow-intensity", "0")
      })
    }

    document.addEventListener("mousemove", updateSpotlight)
    section.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", updateSpotlight)
      section.removeEventListener("mouseleave", handleMouseLeave)
      spotlight.parentNode?.removeChild(spotlight)
    }
  }, [sectionRef, glowColor, spotlightRadius, disabled])

  return null
}
