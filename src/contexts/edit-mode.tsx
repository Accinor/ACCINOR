"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"

interface EditModeContextType {
  editMode: boolean
  toggleEditMode: () => void
  isAdmin: boolean
  checking: boolean
}

const EditModeContext = createContext<EditModeContextType>({
  editMode: false,
  toggleEditMode: () => {},
  isAdmin: false,
  checking: true,
})

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function checkAdmin() {
      try {
        const supabase = createClient()
        if (!supabase) {
          setChecking(false)
          return
        }
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.id) {
          setChecking(false)
          setIsAdmin(false)
          return
        }
        const res = await fetch("/api/auth/profile")
        if (res.ok) {
          const profile = await res.json()
          setIsAdmin(profile?.role === "admin")
          if (profile?.role !== "admin") {
            setEditMode(false)
          }
        } else {
          setIsAdmin(false)
          setEditMode(false)
        }
      } catch (err) {
        setIsAdmin(false)
        setEditMode(false)
      } finally {
        setChecking(false)
      }
    }
    checkAdmin()
  }, [])

  useEffect(() => {
    if (!isAdmin) setEditMode(false)
  }, [isAdmin])

  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => !prev)
  }, [])

  return (
    <EditModeContext.Provider value={{ editMode, toggleEditMode, isAdmin, checking }}>
      {children}
    </EditModeContext.Provider>
  )
}

export function useEditMode() {
  return useContext(EditModeContext)
}
