"use client"

import { useEffect, useRef } from "react"

export function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let mouseX = 0.5
    let mouseY = 0.5
    let currentX = 0.5
    let currentY = 0.5

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth
      mouseY = e.clientY / window.innerHeight
    }

    const animate = () => {
      currentX += (mouseX - currentX) * 0.02
      currentY += (mouseY - currentY) * 0.02

      const x = currentX * 100
      const y = currentY * 100

      el.style.setProperty("--mouse-x", `${x}%`)
      el.style.setProperty("--mouse-y", `${y}%`)
      requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", onMouseMove)
    animate()

    return () => window.removeEventListener("mousemove", onMouseMove)
  }, [])

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none -z-10">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0 transition-[background] duration-[3000ms] ease-linear"
        style={{
          background: `
            radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 184, 27, 0.06), transparent 60%),
            radial-gradient(400px circle at calc(100% - var(--mouse-x, 50%)) calc(100% - var(--mouse-y, 50%)), rgba(255, 184, 27, 0.04), transparent 50%),
            radial-gradient(300px ellipse at 20% 80%, rgba(255, 184, 27, 0.03), transparent 50%),
            radial-gradient(300px ellipse at 80% 20%, rgba(255, 184, 27, 0.03), transparent 50%)
          `,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255, 255, 255, 0.03) 60px, rgba(255, 255, 255, 0.03) 61px),
            repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255, 255, 255, 0.03) 60px, rgba(255, 255, 255, 0.03) 61px)
          `,
        }}
      />

      <div
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-[slow-spin_120s_linear_infinite] opacity-[0.02]"
        style={{
          background: "conic-gradient(from 0deg, transparent, rgba(255, 184, 27, 0.3), transparent, rgba(255, 184, 27, 0.3), transparent)",
        }}
      />
    </div>
  )
}
