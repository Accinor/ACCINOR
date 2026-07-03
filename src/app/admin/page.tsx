import Link from "next/link"
import { getAdminClient } from "@/lib/supabase/admin"
import {
  Users01, MessageChatCircle, FileCheck02, Briefcase01, Edit05, UserPlus01, ArrowRight,
} from "@untitledui/icons"

export const dynamic = "force-dynamic"

async function count(admin: ReturnType<typeof getAdminClient>, table: string, filter?: (q: any) => any) {
  try {
    let q = admin.from(table).select("*", { count: "exact", head: true })
    if (filter) q = filter(q)
    const { count } = await q
    return count ?? 0
  } catch {
    return 0
  }
}

type Activity = { kind: string; label: string; name: string; when: string; href: string }

async function recent(admin: ReturnType<typeof getAdminClient>): Promise<Activity[]> {
  const out: Activity[] = []
  const pulls: Array<[string, string, string, string]> = [
    // table, name column, label, admin href
    ["contacts", "name", "Lead", "/admin/leads"],
    ["consultation_requests", "full_name", "Consultation", "/admin/consultations"],
    ["project_submissions", "full_name", "Project request", "/admin/requests"],
  ]
  for (const [table, nameCol, label, href] of pulls) {
    try {
      const { data } = await admin
        .from(table)
        .select(`${nameCol}, created_at`)
        .order("created_at", { ascending: false })
        .limit(5)
      for (const row of (data ?? []) as any[]) {
        out.push({ kind: table, label, name: row[nameCol] ?? "—", when: row.created_at, href })
      }
    } catch { /* table may not exist */ }
  }
  return out
    .filter((a) => a.when)
    .sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime())
    .slice(0, 8)
}

export default async function AdminDashboard() {
  const admin = getAdminClient()

  const [leads, consultations, requests, clients, postsTotal, postsPublished, users, activity] =
    await Promise.all([
      count(admin, "contacts"),
      count(admin, "consultation_requests"),
      count(admin, "project_submissions"),
      count(admin, "clients"),
      count(admin, "blog_posts"),
      count(admin, "blog_posts", (q) => q.eq("published", true)),
      count(admin, "profiles"),
      recent(admin),
    ])

  const metrics = [
    { label: "Leads", value: leads, Icon: Users01, href: "/admin/leads", hint: "Newsletter + inquiries" },
    { label: "Consultations", value: consultations, Icon: MessageChatCircle, href: "/admin/consultations", hint: "Booking requests" },
    { label: "Project Requests", value: requests, Icon: FileCheck02, href: "/admin/requests", hint: "Submitted projects" },
    { label: "Clients", value: clients, Icon: Briefcase01, href: "/admin/clients", hint: "Active engagements" },
    { label: "Blog Posts", value: `${postsPublished}/${postsTotal}`, Icon: Edit05, href: "/admin/blog", hint: "Published / total" },
    { label: "Users", value: users, Icon: UserPlus01, href: "/admin/users", hint: "Registered accounts" },
  ]

  const actions = [
    { label: "New blog post", href: "/admin/blog", Icon: Edit05 },
    { label: "Add client", href: "/admin/clients", Icon: UserPlus01 },
    { label: "Review requests", href: "/admin/requests", Icon: FileCheck02 },
    { label: "Work leads", href: "/admin/leads", Icon: Users01 },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of activity across the platform.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {metrics.map(({ label, value, Icon, href, hint }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-xl border border-border bg-card p-5 hover:border-[#ffb81b]/40 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-3xl font-bold mt-1">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{hint}</p>
              </div>
              <span className="w-10 h-10 rounded-lg bg-[#ffb81b]/15 text-[#ffb81b] flex items-center justify-center shrink-0">
                <Icon size={20} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold">Recent activity</h2>
          </div>
          {activity.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {activity.map((a, i) => (
                <li key={i}>
                  <Link href={a.href} className="flex items-center justify-between px-5 py-3 hover:bg-muted/40 transition-colors">
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-[#ffb81b]">{a.label}</span>
                      <p className="text-sm font-medium truncate">{a.name}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 ml-3">
                      {new Date(a.when).toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold">Quick actions</h2>
          </div>
          <div className="p-3 space-y-1">
            {actions.map(({ label, href, Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors group"
              >
                <span className="w-8 h-8 rounded-lg bg-[#ffb81b]/15 text-[#ffb81b] flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </span>
                <span className="flex-1">{label}</span>
                <ArrowRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
