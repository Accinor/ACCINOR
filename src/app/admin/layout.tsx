"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
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

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/admin/login")
        return
      }
      setSession(true)

      // Check role in profiles table
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle()

      if (profile?.role === "admin") {
        setIsAdmin(true)
        return
      }

      // Auto-assign admin if email matches (both admins created via seed)
      if (session.user.email === "yassin24624@gmail.com" || session.user.email === "saad.ofqir.1995@gmail.com") {
        await supabase.from("profiles").upsert({
          id: session.user.id,
          email: session.user.email,
          role: "admin",
        }, { onConflict: "id" })
        setIsAdmin(true)
        return
      }

      // Not admin — redirect
      router.push("/admin/login")
    }
    check()
  }, [])

  if (session === null || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
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
