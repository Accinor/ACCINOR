"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"

export interface Profile {
  id: string
  email: string
  full_name?: string
  first_name?: string
  last_name?: string
  phone?: string
  region?: string
  city?: string
  avatar_url?: string
  role?: string
  profile_type?: string
  bio?: string
  website?: string
  title?: string
  linkedin_url?: string
  position?: string
  notifications?: Record<string, boolean>
  has_project?: boolean
  project_description?: string
  project_stage?: string
}

interface AuthContextType {
  user: { id: string; email: string } | null
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        if (!supabase) { setLoading(false); return }
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.id) { setLoading(false); return }
        setUser({ id: session.user.id, email: session.user.email! })
        const res = await fetch("/api/auth/profile")
        if (res.ok) {
          const p = await res.json()
          setProfile(p)
        }
      } catch {} finally { setLoading(false) }
    }
    load()
  }, [])

  const signOut = useCallback(async () => {
    const supabase = createClient()
    if (supabase) await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }, [])

  const isAdmin = profile?.role === "admin"

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
