"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { Button } from "@/components/base/buttons/button"
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

export function ConsultationForm() {
  const t = useTranslations("consultation.form")
  const params = useParams()
  const locale = params.locale as string
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        body: JSON.stringify({
          full_name: form.get("full_name"),
          email: form.get("email"),
          phone: form.get("phone"),
          service_type: form.get("service_type"),
          message: form.get("message"),
          locale,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json()
        setError(data.error || "Something went wrong")
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#ffb81b]/15 flex items-center justify-center text-2xl text-[#ffb81b]">
            ✓
          </div>
          <h3 className="text-xl font-semibold text-foreground">{t("success_title")}</h3>
          <p className="text-muted-foreground leading-relaxed">{t("success")}</p>
        </CardContent>
      </Card>
    )
  }

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
        <Label htmlFor="service_type">{t("service")}</Label>
        <Select name="service_type" required>
          <SelectTrigger>
            <SelectValue placeholder={t("select_service")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="consulting">{t("services.consulting")}</SelectItem>
            <SelectItem value="coaching">{t("services.coaching")}</SelectItem>
            <SelectItem value="business_plan">{t("services.business_plan")}</SelectItem>
            <SelectItem value="funding">{t("services.funding")}</SelectItem>
            <SelectItem value="training">{t("services.training")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{t("message")}</Label>
        <Textarea id="message" name="message" />
      </div>
      <p className="text-sm text-[#ffb81b]/90 bg-[#ffb81b]/10 border border-[#ffb81b]/20 rounded-lg px-4 py-3">
        {t("incentive")}
      </p>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" color="primary" size="lg" isLoading={loading} showTextWhileLoading className="w-full">
        {t("button")}
      </Button>
    </form>
  )
}
