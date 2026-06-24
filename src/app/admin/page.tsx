"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function AdminDashboard() {
  const supabase = createClient()
  const [stats, setStats] = useState({
    consultations: 0,
    projects: 0,
    contacts: 0,
    posts: 0,
  })

  useEffect(() => {
    Promise.all([
      supabase.from("consultation_requests").select("*", { count: "exact", head: true }),
      supabase.from("project_submissions").select("*", { count: "exact", head: true }),
      supabase.from("contacts").select("*", { count: "exact", head: true }),
      supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    ]).then(([consultations, projects, contacts, posts]) => {
      setStats({
        consultations: consultations.count ?? 0,
        projects: projects.count ?? 0,
        contacts: contacts.count ?? 0,
        posts: posts.count ?? 0,
      })
    })
  }, [])

  const cards = [
    { label: "Consultations", value: stats.consultations },
    { label: "Project Submissions", value: stats.projects },
    { label: "Contacts", value: stats.contacts },
    { label: "Blog Posts", value: stats.posts },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border p-6">
            <div className="text-3xl font-bold text-primary">{card.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
