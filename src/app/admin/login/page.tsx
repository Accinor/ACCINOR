"use client"

import { useEffect } from "react"

// The admin panel no longer has its own login screen — everyone uses the single
// site login at /[locale]/auth. This route just forwards there for any old links.
export default function AdminLoginRedirect() {
  useEffect(() => {
    const m = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/)
    const locale = m?.[1] || "ar"
    window.location.replace(`/${locale}/auth`)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-8 h-8 border-2 border-[#ffb81b]/30 border-t-[#ffb81b] rounded-full animate-spin" />
    </div>
  )
}
