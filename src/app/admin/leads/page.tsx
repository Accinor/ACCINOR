"use client"

import { CrmBoard } from "@/components/admin/crm-board"

export default function AdminLeadsPage() {
  return (
    <CrmBoard
      type="leads"
      title="Leads"
      subtitle="Newsletter subscribers and general inquiries. Work each lead from first touch to conversion."
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "source", label: "Source" },
      ]}
      statuses={["new", "contacted", "qualified", "converted", "archived"]}
      statusColors={{
        new: "bg-blue-500/15 text-blue-400",
        contacted: "bg-yellow-500/15 text-yellow-400",
        qualified: "bg-purple-500/15 text-purple-400",
        converted: "bg-green-500/15 text-green-400",
        archived: "bg-muted text-muted-foreground",
      }}
    />
  )
}
