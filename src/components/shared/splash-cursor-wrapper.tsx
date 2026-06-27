"use client"

import { usePathname } from "next/navigation"
import { SplashCursor } from "./splash-cursor"

export function SplashCursorWrapper() {
  const pathname = usePathname()
  if (pathname?.startsWith("/ar/auth") || pathname?.startsWith("/fr/auth") || pathname?.startsWith("/en/auth")) {
    return null
  }
  return <SplashCursor />
}
