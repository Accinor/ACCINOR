"use client"

import { useEffect, useRef, useState } from "react"

const TRAIL = 6

/**
 * Premium, lightweight cursor: a bright glowing dot that tracks the pointer, a
 * comet-like trail behind it, and a larger ring that lags for depth. Grows over
 * interactive elements and pulses on click.
 * - Keeps the native cursor visible (accessibility-safe).
 * - Only runs on fine pointers (mouse) and when reduced-motion is not requested.
 * - Pure rAF loop (no WebGL, no per-frame allocations) — cheap on CPU/battery.
 * - Event delegation, so it reacts to dynamically-added links/buttons too.
 */
export function CustomCursor() {
  const layerRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<Array<HTMLDivElement | null>>([])
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
    const tx = new Array(TRAIL).fill(mouseX)
    const ty = new Array(TRAIL).fill(mouseY)
    let raf = 0
    let shown = false

    const layer = layerRef.current
    const dot = dotRef.current
    const ring = ringRef.current
    const trail = trailRefs.current
    const INTERACTIVE = "a, button, input, textarea, select, label, [role='button'], [data-cursor]"

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY
      if (!shown) { shown = true; layer?.classList.add("is-visible") }
    }
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
    const onLeaveWindow = () => { shown = false; layer?.classList.remove("is-visible") }

    const loop = () => {
      dotX += (mouseX - dotX) * 0.4
      dotY += (mouseY - dotY) * 0.4
      ringX += (mouseX - ringX) * 0.16
      ringY += (mouseY - ringY) * 0.16
      if (dot) dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`
      if (ring) ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`

      // Comet tail: each trail node chases the one ahead of it.
      let px = mouseX, py = mouseY
      for (let i = 0; i < TRAIL; i++) {
        tx[i] += (px - tx[i]) * 0.35
        ty[i] += (py - ty[i]) * 0.35
        const el = trail[i]
        if (el) el.style.transform = `translate3d(${tx[i]}px, ${ty[i]}px, 0) translate(-50%, -50%)`
        px = tx[i]; py = ty[i]
      }
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
    <div ref={layerRef} className="cursor-layer" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring" />
      {Array.from({ length: TRAIL }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el }}
          className="cursor-trail"
          style={{
            opacity: (1 - i / TRAIL) * 0.55,
            width: `${7 - (i / TRAIL) * 4}px`,
            height: `${7 - (i / TRAIL) * 4}px`,
          }}
        />
      ))}
      <div ref={dotRef} className="cursor-dot" />
    </div>
  )
}
