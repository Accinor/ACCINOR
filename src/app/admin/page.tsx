import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { count: requests } = await supabase
    .from("project_submissions")
    .select("*", { count: "exact", head: true })

  const { count: consultations } = await supabase
    .from("consultation_requests")
    .select("*", { count: "exact", head: true })

  const { count: leads } = await supabase
    .from("contacts")
    .select("*", { count: "exact", head: true })

  const { count: posts } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })

  const cards = [
    { label: "Project Requests", value: requests ?? 0 },
    { label: "Consultations", value: consultations ?? 0 },
    { label: "Leads", value: leads ?? 0 },
    { label: "Blog Posts", value: posts ?? 0 },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="text-3xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
