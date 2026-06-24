"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type Submission = {
  id: string
  full_name: string
  email: string
  project_name: string
  city: string
  status: string
  created_at: string
}

export default function AdminRequestsPage() {
  const supabase = createClient()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [type, setType] = useState<"projects" | "contacts">("projects")

  useEffect(() => {
    if (type === "projects") {
      supabase
        .from("project_submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (data) setSubmissions(data as unknown as Submission[])
        })
    }
  }, [type])

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    reviewing: "bg-blue-100 text-blue-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Requests</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.full_name}</TableCell>
              <TableCell>{s.email}</TableCell>
              <TableCell>{s.project_name}</TableCell>
              <TableCell>{s.city}</TableCell>
              <TableCell>
                <Badge className={statusColors[s.status] || ""}>
                  {s.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(s.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
