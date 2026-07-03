"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Subtle premium cursor: a small accent ring that trails the pointer with a soft lag.
 * - Keeps the native cursor visible (accessibility-safe).
 * - Only runs on fine pointers (mouse) and when reduced-motion is not requested.
 * - Lightweight rAF loop (no WebGL) — replaces the previous full-screen fluid sim.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fine || reduce) return
    setEnabled(true)

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let raf = 0

    const onMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY }
    const onDown = () => ringRef.current?.classList.add("cursor-ring--active")
    const onUp = () => ringRef.current?.classList.remove("cursor-ring--active")
    const onEnterInteractive = () => ringRef.current?.classList.add("cursor-ring--hover")
    const onLeaveInteractive = () => ringRef.current?.classList.remove("cursor-ring--hover")

    const loop = () => {
      ringX += (mouseX - ringX) * 0.2
      ringY += (mouseY - ringY) * 0.2
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)

    // Grow the ring over interactive elements for a tactile, premium feel.
    const interactive = document.querySelectorAll("a, button, input, textarea, select, [role='button']")
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", onEnterInteractive)
      el.addEventListener("mouseleave", onLeaveInteractive)
    })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      interactive.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive)
        el.removeEventListener("mouseleave", onLeaveInteractive)
      })
    }
  }, [])

  if (!enabled) return null
  return <div ref={ringRef} aria-hidden="true" className="cursor-ring" />
}
