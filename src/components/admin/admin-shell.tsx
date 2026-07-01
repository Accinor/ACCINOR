"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { isAdminEmail } from "@/lib/admin"
import { AdminSidebar } from "@/components/admin/sidebar"

function localeFromCookie(): string {
  if (typeof document === "undefined") return "ar"
  const m = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/)
  return m?.[1] || "ar"
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [session, setSession] = useState<boolean | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()

  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (isLoginPage) {
      setSession(false)
      return
    }

    let cancelled = false
    async function check() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        // Not signed in — send to the single, unified login on the main site,
        // and come back to this admin page once authenticated.
        const next = encodeURIComponent(pathname || "/admin")
        window.location.href = `/${localeFromCookie()}/auth?next=${next}`
        return
      }
      setSession(true)

      try {
        const res = await fetch("/api/auth/sync-profile", { method: "POST" })
        if (res.ok && !cancelled) {
          const { role } = await res.json()
          if (role === "admin") { setIsAdmin(true); return }
        }
      } catch {}

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle()

      if (!cancelled && profile?.role === "admin") { setIsAdmin(true); return }

      if (isAdminEmail(session.user.email!)) {
        await supabase.from("profiles").upsert({
          id: session.user.id,
          email: session.user.email,
          role: "admin",
        }, { onConflict: "id" })
        if (!cancelled) setIsAdmin(true)
        return
      }

      // Signed in but not an admin — return to the website, not a login wall.
      if (!cancelled) window.location.href = `/${localeFromCookie()}`
    }
    check()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoginPage])

  if (isLoginPage) {
    return <>{children}</>
  }

  if (session === null || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#ffb81b]/30 border-t-[#ffb81b] rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar onLogout={handleLogout} />
      <div className="flex-1 p-6 sm:p-8 max-w-full overflow-x-hidden">{children}</div>
    </div>
  )
}
