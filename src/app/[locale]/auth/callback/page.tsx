"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AuthCallbackPage() {
  const params = useParams()
  const locale = params.locale as string
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Ensure a profile exists for this user (use upsert to create if missing)
      // Only yassin24624@gmail.com and saad.ofqir.1995@gmail.com are admins
      const isAdmin = session.user.email === "yassin24624@gmail.com" || session.user.email === "saad.ofqir.1995@gmail.com"

      await supabase.from("profiles").upsert({
        id: session.user.id,
        email: session.user.email,
        full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
        role: isAdmin ? "admin" : "user",
      }, { onConflict: "id" })

      router.push(`/${locale}`)
      router.refresh()
    }

    handleAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string) => {
      if (event === "SIGNED_IN") {
        handleAuth()
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#ffb81b] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Processing authentication...</p>
      </div>
    </div>
  )
}
