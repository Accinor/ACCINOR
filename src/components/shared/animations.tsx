"use client"

import { motion, type Variants } from "framer-motion"
import { type ReactNode, useEffect, useState, useRef, type RefObject } from "react"

export function Reveal({
  children,
  delay = 0,
  duration = 0.5,
  y = 24,
  className = "",
}: {
  children: ReactNode
  delay?: number
  duration?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerReveal({
  children,
  className = "",
  staggerDelay = 0.08,
  y = 20,
}: {
  children: ReactNode
  className?: string
  staggerDelay?: number
  y?: number
}) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children }: { children: ReactNode }) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
  }
  return <motion.div variants={itemVariants}>{children}</motion.div>
}

export function CountUp({
  end,
  duration = 2,
  suffix = "",
  className = "",
}: {
  end: number
  duration?: number
  suffix?: string
  className?: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    let start = 0
    const increment = end / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [inView, end, duration])

  return (
    <div ref={ref} className={className}>
      {count}
      {suffix}
    </div>
  )
}

export function useParallax(ref: RefObject<HTMLElement | null>, speed = 0.2) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const scrolled = window.innerHeight - rect.top
      setOffset(scrolled * speed)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [ref, speed])

  return offset
}

export function MagneticButton({
  children,
  className = "",
  as = "button",
}: {
  children: ReactNode
  className?: string
  as?: string
}) {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
    }

    const onMouseLeave = () => {
      el.style.transform = "translate(0, 0)"
    }

    el.addEventListener("mousemove", onMouseMove)
    el.addEventListener("mouseleave", onMouseLeave)

    return () => {
      el.removeEventListener("mousemove", onMouseMove)
      el.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [])

  const Tag = as as any
  return (
    <Tag ref={ref} className={`transition-transform duration-200 ease-out ${className}`}>
      {children}
    </Tag>
  )
}

export function TiltCard({
  children,
  className = "",
  tiltDegree = 8,
}: {
  children: ReactNode
  className?: string
  tiltDegree?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      el.style.transform = `perspective(800px) rotateY(${x * tiltDegree}deg) rotateX(${-y * tiltDegree}deg)`
    }

    const onMouseLeave = () => {
      el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)"
    }

    el.addEventListener("mousemove", onMouseMove)
    el.addEventListener("mouseleave", onMouseLeave)

    return () => {
      el.removeEventListener("mousemove", onMouseMove)
      el.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [tiltDegree])

  return (
    <div ref={ref} className={`transition-transform duration-200 ease-out ${className}`}>
      {children}
    </div>
  )
}
