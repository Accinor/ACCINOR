"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { useEditMode } from "@/contexts/edit-mode"

interface EditableTextProps {
  children: ReactNode
  page: string
  section: string
  field: string
  className?: string
  as?: "span" | "div" | "h1" | "h2" | "h3" | "h4" | "p"
  locale?: string
}

export function EditableText({
  children,
  page,
  section,
  field,
  className = "",
  as: Tag = "span",
  locale = "en",
}: EditableTextProps) {
  const { editMode, isAdmin } = useEditMode()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [content, setContent] = useState<string | null>(null)
  const ref = useRef<HTMLElement>(null)
  const key = `${page}:${section}:${field}`

  useEffect(() => {
    if (!editMode || !isAdmin) return

    fetch(`/api/content?key=${key}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.value) setContent(data.value)
      })
      .catch(() => {})
  }, [editMode, isAdmin, key])

  const displayText = content ?? (typeof children === "string" ? children : undefined)

  const handleBlur = async () => {
    const text = ref.current?.textContent?.trim()
    if (!text || text === (typeof children === "string" ? children : "")) return

    setSaving(true)
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: text }),
      })
      if (res.ok) {
        setContent(text)
        setSaved(true)
        setTimeout(() => setSaved(false), 1500)
      }
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      ref.current?.blur()
    }
  }

  if (editMode && isAdmin) {
    return (
      <div className="relative group">
        <Tag
          ref={ref as any}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`outline-none ${
            editMode
              ? "ring-1 ring-[#ffb81b]/30 hover:ring-[#ffb81b]/60 focus:ring-2 focus:ring-[#ffb81b] rounded px-1 -mx-1 transition-shadow cursor-text"
              : ""
          } ${className}`}
          data-editable-key={key}
        >
          {displayText}
        </Tag>
        {saving && (
          <span className="absolute -top-3 right-0 text-[10px] text-[#ffb81b]/60">saving...</span>
        )}
        {saved && (
          <span className="absolute -top-3 right-0 text-[10px] text-green-400">saved</span>
        )}
      </div>
    )
  }

  return <Tag className={className}>{children}</Tag>
}
