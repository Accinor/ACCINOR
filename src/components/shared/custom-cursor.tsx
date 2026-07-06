"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Premium, lightweight cursor: a glowing accent dot that tracks the pointer
 * closely, plus a larger ring that trails behind it with a soft lag. Grows over
 * interactive elements and pulses on click.
 * - Keeps the native cursor visible (accessibility-safe).
 * - Only runs on fine pointers (mouse) and when reduced-motion is not requested.
 * - Pure rAF loop (no WebGL, no per-frame allocations) — cheap on CPU/battery.
 * - Uses event delegation so it reacts to dynamically-added links/buttons too.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fine || reduce) return
    setEnabled(true)

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let dotX = mouseX, dotY = mouseY
    let ringX = mouseX, ringY = mouseY
    let raf = 0
    let shown = false

    const dot = dotRef.current
    const ring = ringRef.current
    const INTERACTIVE = "a, button, input, textarea, select, label, [role='button'], [data-cursor]"

    const reveal = () => {
      if (shown) return
      shown = true
      dot?.classList.add("is-visible")
      ring?.classList.add("is-visible")
    }
    const onMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; reveal() }
    const onDown = () => { dot?.classList.add("cursor--active"); ring?.classList.add("cursor--active") }
    const onUp = () => { dot?.classList.remove("cursor--active"); ring?.classList.remove("cursor--active") }
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(INTERACTIVE)) {
        dot?.classList.add("cursor--hover"); ring?.classList.add("cursor--hover")
      }
    }
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(INTERACTIVE)) {
        dot?.classList.remove("cursor--hover"); ring?.classList.remove("cursor--hover")
      }
    }
    const onLeaveWindow = () => {
      shown = false
      dot?.classList.remove("is-visible")
      ring?.classList.remove("is-visible")
    }

    const loop = () => {
      // Dot tracks tightly; ring trails with a softer lag for depth.
      dotX += (mouseX - dotX) * 0.35
      dotY += (mouseY - dotY) * 0.35
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      if (dot) dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`
      if (ring) ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)
    document.addEventListener("mouseover", onOver, { passive: true })
    document.addEventListener("mouseout", onOut, { passive: true })
    document.documentElement.addEventListener("mouseleave", onLeaveWindow)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      document.removeEventListener("mouseover", onOver)
      document.removeEventListener("mouseout", onOut)
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow)
    }
  }, [])

  if (!enabled) return null
  return (
    <>
      <div ref={ringRef} aria-hidden="true" className="cursor-ring" />
      <div ref={dotRef} aria-hidden="true" className="cursor-dot" />
    </>
  )
}
