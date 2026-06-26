"use client"

import { usePathname } from "next/navigation"
import { SplashCursor } from "./splash-cursor"

export function SplashCursorWrapper() {
  const pathname = usePathname()
  if (pathname?.includes("/auth/")) return null
  return <SplashCursor />
}
