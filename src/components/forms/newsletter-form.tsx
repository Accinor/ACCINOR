"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/newsletter", {
      method: "POST",
      body: JSON.stringify({ email, name: email.split("@")[0] }),
    })
    if (res.ok) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return <p className="text-sm text-accent">Subscribed successfully!</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="max-w-xs"
      />
      <Button type="submit" size="sm">
        Subscribe
      </Button>
    </form>
  )
}
