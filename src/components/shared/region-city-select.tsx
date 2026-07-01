"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown } from "@untitledui/icons"
import {
  MOROCCO_REGIONS,
  MOROCCO_REGION_NAMES,
  ALL_MOROCCO_CITIES,
  CITY_TO_REGION,
} from "@/lib/morocco"

const inputClass =
  "w-full rounded-lg border border-input bg-background py-2.5 pl-3 pr-8 text-sm outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"

/** A single searchable combobox: type to filter, click to select. */
function Combobox({
  value,
  options,
  placeholder,
  disabled,
  onSelect,
}: {
  value: string
  options: string[]
  placeholder?: string
  disabled?: boolean
  onSelect: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value || "")
  const ref = useRef<HTMLDivElement>(null)

  // Keep the visible text in sync when the value changes from outside.
  useEffect(() => { setQuery(value || "") }, [value])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery(value || "") // revert typing that wasn't committed
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [value])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.toLowerCase().includes(q))
  }, [query, options])

  return (
    <div className="relative" ref={ref}>
      <input
        type="text"
        value={query}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
      />
      <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      {open && !disabled && filtered.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-lg border border-border bg-popover text-popover-foreground shadow-xl z-[60] py-1">
          {filtered.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => { onSelect(o); setQuery(o); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${
                o === value ? "text-[#ffb81b] font-medium" : ""
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Dependent Region + City selector for Morocco.
 * - Pick a region -> the city list narrows to that region.
 * - Pick a city -> the region auto-fills (vice versa).
 * - Both are type-to-search.
 */
export function RegionCitySelect({
  region,
  city,
  onRegionChange,
  onCityChange,
  regionLabel = "Region",
  cityLabel = "City",
}: {
  region: string
  city: string
  onRegionChange: (v: string) => void
  onCityChange: (v: string) => void
  regionLabel?: string
  cityLabel?: string
}) {
  const cityOptions = useMemo(() => {
    if (region && MOROCCO_REGIONS[region]) return MOROCCO_REGIONS[region]
    return ALL_MOROCCO_CITIES
  }, [region])

  const handleRegion = (r: string) => {
    onRegionChange(r)
    // If the current city doesn't belong to the new region, clear it.
    if (city && MOROCCO_REGIONS[r] && !MOROCCO_REGIONS[r].includes(city)) {
      onCityChange("")
    }
  }

  const handleCity = (c: string) => {
    onCityChange(c)
    const r = CITY_TO_REGION[c]
    if (r && r !== region) onRegionChange(r)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Combobox
        value={region}
        options={MOROCCO_REGION_NAMES}
        placeholder={regionLabel}
        onSelect={handleRegion}
      />
      <Combobox
        value={city}
        options={cityOptions}
        placeholder={cityLabel}
        onSelect={handleCity}
      />
    </div>
  )
}
