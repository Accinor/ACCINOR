"use client"

import { useParams } from "next/navigation"
import { redirect } from "next/navigation"

export default function CreateAccountPage() {
  const params = useParams()
  const locale = params.locale as string
  redirect(`/${locale}/auth/sign-in?mode=register`)
}
