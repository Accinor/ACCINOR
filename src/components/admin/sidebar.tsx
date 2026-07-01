"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Grid01, User01, FileCheck02, Users01, Briefcase01, Edit05,
  MessageChatCircle, Database01, ArrowLeft, LogOut01,
} from "@untitledui/icons"

type Props = {
  onLogout: () => void
}

type SidebarUser = { email: string; name: string; avatar: string | null }

const links = [
  { href: "/admin", label: "Dashboard", Icon: Grid01 },
  { href: "/admin/profile", label: "My Profile", Icon: User01 },
  { href: "/admin/requests", label: "Requests", Icon: FileCheck02 },
  { href: "/admin/leads", label: "Leads", Icon: Users01 },
  { href: "/admin/clients", label: "Clients", Icon: Briefcase01 },
  { href: "/admin/consultations", label: "Consultations", Icon: MessageChatCircle },
  { href: "/admin/blog", label: "Blog Posts", Icon: Edit05 },
  { href: "/admin/users", label: "Users", Icon: Users01 },
  { href: "/admin/migrate", label: "Migration", Icon: Database01 },
]

export function AdminSidebar({ onLogout }: Props) {
  const pathname = usePathname()
  const [user, setUser] = useState<SidebarUser | null>(null)

  useEffect(() => {
    fetch("/api/auth/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => {
        if (!p || p.error) return
        const name = [p.first_name, p.last_name].filter(Boolean).join(" ") || p.full_name || (p.email?.split("@")[0] ?? "Admin")
        setUser({ email: p.email ?? "", name, avatar: p.avatar_url ?? null })
      })
      .catch(() => {})
  }, [])

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD"

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
      {/* Brand — full navigation back to the website */}
      <a href="/" className="flex items-center gap-2.5 px-4 h-16 border-b border-border hover:bg-muted/40 transition-colors">
        <img src="/images/logo.png" alt="ACCINOR" className="h-8 w-auto" />
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-[#ffb81b]">ACCINOR</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Admin Panel</span>
        </span>
      </a>

      {/* Back to website */}
      <a
        href="/"
        className="flex items-center gap-2 mx-3 mt-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <ArrowLeft size={16} />
        Back to website
      </a>

      {/* Profile summary — links straight to the profile page */}
      <Link
        href="/admin/profile"
        className="flex items-center gap-3 mx-3 mt-3 mb-4 px-2 py-2 rounded-lg hover:bg-muted transition-colors"
      >
        {user?.avatar ? (
          <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[#ffb81b]/20 text-[#ffb81b] flex items-center justify-center text-sm font-bold shrink-0">
            {initials}
          </div>
        )}
        <div className="flex-1 text-left min-w-0">
          <div className="text-sm font-medium truncate">{user?.name || "Admin"}</div>
          <div className="text-xs text-muted-foreground truncate">{user?.email || ""}</div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {links.map(({ href, label, Icon }) => {
          const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-[#ffb81b]/15 text-[#ffb81b] font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <LogOut01 size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
