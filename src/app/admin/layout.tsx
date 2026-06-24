"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminSidebar } from "@/components/admin/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [session, setSession] = useState<boolean | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: unknown } | null }) => {
      if (!data?.session) {
        router.push("/admin/login")
      } else {
        setSession(true)
      }
    })
  }, [])

  if (session === null) {
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
