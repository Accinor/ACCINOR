"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

type Props = {
  onLogout: () => void
}

export function AdminSidebar({ onLogout }: Props) {
  const pathname = usePathname()
  const supabase = createClient()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string; avatar: string | null } | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (session?.user) {
        const email = session.user.email || ""
        const metaName = session.user.user_metadata?.full_name || session.user.user_metadata?.name
        const knownNames: Record<string, string> = {
          "yassin24624@gmail.com": "Yassine Benali",
          "saad.ofqir.1995@gmail.com": "Saad Ofqir",
        }
        setUser({
          email,
          name: knownNames[email] || metaName || email.split("@")[0],
          avatar: session.user.user_metadata?.avatar_url || null,
        })
      }
    })
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/profile", label: "Profile" },
    { href: "/admin/requests", label: "Requests" },
    { href: "/admin/leads", label: "Leads" },
    { href: "/admin/clients", label: "Clients" },
    { href: "/admin/blog", label: "Blog Posts" },
    { href: "/admin/consultations", label: "Consultations" },
    { href: "/admin/migrate", label: "Migration" },
    { href: "/admin/users", label: "Users" },
  ]

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD"

  return (
    <aside className="w-64 border-r bg-card p-4 flex flex-col">
      {/* Brand logo — backdoor to main site */}
      <Link href="/" className="flex items-center gap-2 px-2 py-2 mb-4 border-b border-border">
        <span className="text-lg font-bold text-[#ffb81b]">ACCINOR</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Admin</span>
      </Link>

      {/* Profile section with dropdown */}
      <div className="relative mb-6" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-[#7d988a] flex items-center justify-center text-white text-sm font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-sm font-medium truncate">{user?.name || "Admin"}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email || ""}</div>
          </div>
          <svg className={`w-4 h-4 text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-xl shadow-lg py-1.5 z-50">
            <Link href="/admin/profile" onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              View Profile
            </Link>
            <Link href="/admin/profile" onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
            <hr className="my-1 border-border" />
            <button onClick={() => { setDropdownOpen(false); onLogout() }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-2 py-2 rounded-md text-sm transition-colors ${
                isActive ? "bg-[#7d988a]/10 text-[#4d5d54] dark:text-[#7d988a] font-medium" : "hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>

      <Button variant="outline" onClick={onLogout} className="mt-4">
        Logout
      </Button>
    </aside>
  )
}
