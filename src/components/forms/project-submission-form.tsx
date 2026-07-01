"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export function ProjectSubmissionForm() {
  const t = useTranslations("project_submission.form")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    const form = new FormData(e.currentTarget)

    const res = await fetch("/api/project-submission", {
      method: "POST",
      body: JSON.stringify({
        full_name: form.get("full_name"),
        email: form.get("email"),
        phone: form.get("phone"),
        project_name: form.get("project_name"),
        project_description: form.get("project_description"),
        project_stage: form.get("project_stage"),
        city: form.get("city"),
        funding_needed: form.get("funding_needed"),
      }),
    })

    if (res.ok) {
      setSubmitted(true)
    } else {
      const data = await res.json()
      setError(data.error || "Something went wrong")
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          {t("success")}
        </CardContent>
      </Card>
    )
  }

  const cities = [
    { value: "Oujda", key: "oujda" },
    { value: "Nador", key: "nador" },
    { value: "Berkane", key: "berkane" },
    { value: "Taourirt", key: "taourirt" },
    { value: "Jerada", key: "jerada" },
    { value: "Figuig", key: "figuig" },
    { value: "Driouch", key: "driouch" },
    { value: "Guercif", key: "guercif" },
  ]

  const stages = ["idea", "planning", "development", "launch"] as const

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">{t("name")}</Label>
        <Input id="full_name" name="full_name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">{t("phone")}</Label>
        <Input id="phone" name="phone" type="tel" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="project_name">{t("project_name")}</Label>
        <Input id="project_name" name="project_name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="project_description">{t("description")}</Label>
        <Textarea id="project_description" name="project_description" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="project_stage">{t("stage")}</Label>
        <Select name="project_stage" required>
          <SelectTrigger>
            <SelectValue placeholder={t("select_stage")} />
          </SelectTrigger>
          <SelectContent>
            {stages.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {t(`stages.${stage}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">{t("city")}</Label>
        <Select name="city" required>
          <SelectTrigger>
            <SelectValue placeholder={t("select_city")} />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.value} value={city.value}>
                {t(`cities.${city.key}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="funding_needed">{t("funding")}</Label>
        <Input id="funding_needed" name="funding_needed" />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit">{t("button")}</Button>
    </form>
  )
}
