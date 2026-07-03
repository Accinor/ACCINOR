"use client"

import { CrmBoard } from "@/components/admin/crm-board"

export default function AdminRequestsPage() {
  return (
    <CrmBoard
      type="requests"
      title="Project Requests"
      subtitle="Projects submitted for support, review, and potential incubation."
      columns={[
        { key: "full_name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "project_name", label: "Project" },
        { key: "project_stage", label: "Stage" },
        { key: "city", label: "City" },
      ]}
      statuses={["pending", "reviewing", "accepted", "rejected"]}
      statusColors={{
        pending: "bg-yellow-500/15 text-yellow-400",
        reviewing: "bg-blue-500/15 text-blue-400",
        accepted: "bg-green-500/15 text-green-400",
        rejected: "bg-red-500/15 text-red-400",
      }}
    />
  )
}
