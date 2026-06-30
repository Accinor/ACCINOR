"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useAuth } from "@/contexts/auth"

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
  const { isAdmin, loading } = useAuth()

  useEffect(() => {
    if (!isAdmin) setEditMode(false)
  }, [isAdmin])

  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => !prev)
  }, [])

  return (
    <EditModeContext.Provider value={{ editMode, toggleEditMode, isAdmin, checking: loading }}>
      {children}
    </EditModeContext.Provider>
  )
}

export function useEditMode() {
  return useContext(EditModeContext)
}
