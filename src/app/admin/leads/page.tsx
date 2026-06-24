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

type Contact = {
  id: string
  name: string
  email: string
  phone: string | null
  source: string
  created_at: string
}

export default function AdminLeadsPage() {
  const supabase = createClient()
  const [contacts, setContacts] = useState<Contact[]>([])

  useEffect(() => {
    supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }: { data: Contact[] | null }) => {
        if (data) setContacts(data)
      })
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Leads</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.phone || "-"}</TableCell>
              <TableCell>{c.source}</TableCell>
              <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
