"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { isAdminEmail } from "@/lib/admin"
import { AdminSidebar } from "@/components/admin/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
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
        router.push("/admin/login")
        return
      }
      setSession(true)

      try {
        const res = await fetch("/api/auth/sync-profile", { method: "POST" })
        if (res.ok && !cancelled) {
          const { role } = await res.json()
          if (role === "admin") {
            setIsAdmin(true)
            return
          }
        }
      } catch {}

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle()

      if (!cancelled && profile?.role === "admin") {
        setIsAdmin(true)
        return
      }

      if (isAdminEmail(session.user.email!)) {
        await supabase.from("profiles").upsert({
          id: session.user.id,
          email: session.user.email,
          role: "admin",
        }, { onConflict: "id" })
        if (!cancelled) setIsAdmin(true)
        return
      }

      if (!cancelled) router.push("/admin/login")
    }
    check()
    return () => { cancelled = true }
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

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        onLogout={async () => {
          await supabase.auth.signOut()
          router.push("/admin/login")
        }}
      />
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}
