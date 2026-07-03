"use client"

import { CrmBoard } from "@/components/admin/crm-board"

export default function AdminConsultationsPage() {
  return (
    <CrmBoard
      type="consultations"
      title="Consultations"
      subtitle="Consultation booking requests submitted through the site."
      columns={[
        { key: "full_name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "service_type", label: "Service" },
      ]}
      statuses={["pending", "contacted", "completed", "cancelled"]}
      statusColors={{
        pending: "bg-yellow-500/15 text-yellow-400",
        contacted: "bg-blue-500/15 text-blue-400",
        completed: "bg-green-500/15 text-green-400",
        cancelled: "bg-muted text-muted-foreground",
      }}
    />
  )
}
