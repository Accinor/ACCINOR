"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { useEditMode } from "@/contexts/edit-mode"
import { usePathname } from "next/navigation"

interface EditableTextProps {
  children: ReactNode
  page: string
  section: string
  field: string
  className?: string
  as?: "span" | "div" | "h1" | "h2" | "h3" | "h4" | "p"
  locale?: string
}

const OTHER_LOCALES: Record<string, string[]> = {
  en: ["ar", "fr"],
  ar: ["fr", "en"],
  fr: ["en", "ar"],
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
  const pathname = usePathname()

  useEffect(() => {
    fetch(`/api/content?key=${key}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.value) setContent(data.value)
      })
      .catch(() => {})
  }, [key])

  const displayText = content ?? (typeof children === "string" ? children : undefined)

  const handleBlur = async () => {
    const text = ref.current?.textContent?.trim()
    if (!text || text === content) return

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
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {} finally { setSaving(false) }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") ref.current?.blur()
  }

  const otherLocales = OTHER_LOCALES[locale] || []
  const currentPath = pathname.replace(`/${locale}`, "")
  const otherLocaleLinks = otherLocales.map((l) => `/${l}${currentPath}`)

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
          <div className="absolute -top-8 right-0 text-[10px] text-green-400 whitespace-nowrap flex items-center gap-1.5 bg-[#050a30]/90 px-2 py-0.5 rounded-full border border-green-500/20">
            <span>✓ Saved</span>
            {otherLocaleLinks.length > 0 && (
              <>
                <span className="text-gray-500">·</span>
                <span className="text-[#ffb81b]/80">edit</span>
                {otherLocaleLinks.map((href, i) => (
                  <a
                    key={i}
                    href={href}
                    className="text-[#ffb81b] hover:underline font-medium"
                  >
                    {otherLocales[i].toUpperCase()}
                  </a>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    )
  }

  return <Tag className={className}>{displayText ?? children}</Tag>
}
