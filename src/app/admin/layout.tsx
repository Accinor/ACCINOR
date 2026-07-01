import { Inter } from "next/font/google"
import { AdminShell } from "@/components/admin/admin-shell"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.variable} font-sans min-h-screen bg-background text-foreground`}>
      <AdminShell>{children}</AdminShell>
    </div>
  )
}
