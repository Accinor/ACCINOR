"use client"

import { useEditMode } from "@/contexts/edit-mode"

export function EditModeToggle() {
  const { editMode, toggleEditMode, isAdmin, checking } = useEditMode()

  if (checking || !isAdmin) return null

  return (
    <button
      onClick={toggleEditMode}
      className={`fixed bottom-6 right-6 z-[60] flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium shadow-lg transition-all duration-300 ${
        editMode
          ? "bg-[#ffb81b] text-[#050a30] shadow-[#ffb81b]/40 scale-110"
          : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
      }`}
    >
      {editMode ? (
        <>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Editing
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
          Edit Page
        </>
      )}
    </button>
  )
}
