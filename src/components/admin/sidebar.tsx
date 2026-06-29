"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

type Props = {
  onLogout: () => void
}

export function AdminSidebar({ onLogout }: Props) {
  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/profile", label: "Profile" },
    { href: "/admin/requests", label: "Requests" },
    { href: "/admin/leads", label: "Leads" },
    { href: "/admin/clients", label: "Clients" },
    { href: "/admin/blog", label: "Blog Posts" },
    { href: "/admin/consultations", label: "Consultations" },
    { href: "/admin/users", label: "Users" },
  ]

  return (
    <aside className="w-64 border-r bg-card p-4 flex flex-col">
      <div className="font-bold text-lg mb-8 px-2">ACCINOR Admin</div>
      <nav className="flex-1 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block px-2 py-2 rounded-md text-sm hover:bg-muted transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Button variant="outline" onClick={onLogout} className="mt-4">
        Logout
      </Button>
    </aside>
  )
}
