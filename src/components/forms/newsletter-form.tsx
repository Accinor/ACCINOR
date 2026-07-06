"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/base/buttons/button"
import { Input } from "@/components/ui/input"

export function NewsletterForm() {
  const t = useTranslations("newsletter")
  const tc = useTranslations("common.cta")
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
    return <p className="text-sm text-accent">{t("success")}</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder={t("placeholder")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="max-w-xs"
      />
      <Button type="submit" size="sm" color="primary">
        {tc("subscribe")}
      </Button>
    </form>
  )
}
