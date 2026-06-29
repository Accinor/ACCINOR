"use client"

import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Mail01, Lock01, User01, EyeOff, Eye, Phone, MarkerPin01, Building01, Lightbulb05 } from "@untitledui/icons"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const MOROCCAN_REGIONS = [
  "Tanger-Tétouan-Al Hoceïma",
  "Oriental",
  "Fès-Meknès",
  "Rabat-Salé-Kénitra",
  "Béni Mellal-Khénifra",
  "Casablanca-Settat",
  "Marrakech-Safi",
  "Drâa-Tafilalet",
  "Souss-Massa",
  "Guelmim-Oued Noun",
  "Laâyoune-Sakia El Hamra",
  "Dakhla-Oued Ed-Dahab",
]

type AuthMode = "sign-in" | "register"

export default function AuthPage() {
  const t = useTranslations("auth")
  const common = useTranslations("common")
  const params = useParams()
  const locale = params.locale as string
  const router = useRouter()
  const isRtl = locale === "ar"
  const supabase = createClient()

  const [mode, setMode] = useState<AuthMode>("sign-in")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Sign in fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Register fields
  const [fullName, setFullName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [region, setRegion] = useState("")
  const [city, setCity] = useState("")
  const [hasProject, setHasProject] = useState(false)
  const [projectDescription, setProjectDescription] = useState("")
  const [projectStage, setProjectStage] = useState<"idea" | "working" | "">("")

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push(`/${locale}`)
    router.refresh()
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Create profile via API
    const profileRes = await fetch("/api/auth/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: fullName,
        phone,
        region,
        city,
        has_project: hasProject,
        project_description: hasProject ? projectDescription : null,
        project_stage: hasProject ? projectStage : null,
      }),
    })

    if (!profileRes.ok) {
      console.error("Profile creation failed, may need confirmation first")
    }

    setSuccess(t("create_account.success"))
    setLoading(false)
    setTimeout(() => setMode("sign-in"), 3000)
  }

  async function handleGoogleAuth() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/${locale}/auth/callback`,
      },
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-24">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Link href={`/${locale}`} className="mb-6">
            <img
              src="/images/logo.png"
              alt={common("site_name")}
              className="h-14 w-auto"
            />
          </Link>

          <div className="w-full rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            {/* Mode Toggle */}
            <div className="flex rounded-lg bg-muted p-1 mb-5">
              <button
                onClick={() => { setMode("sign-in"); setError(""); setSuccess("") }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  mode === "sign-in" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("sign_in.title")}
              </button>
              <button
                onClick={() => { setMode("register"); setError(""); setSuccess("") }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  mode === "register" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("create_account.title")}
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-lg bg-accent/10 p-3 text-sm text-accent">
                {success}
              </div>
            )}

            {mode === "sign-in" ? (
              /* ──── SIGN IN FORM ──── */
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label htmlFor="si-email" className="block text-sm font-medium text-foreground mb-1">
                    {t("sign_in.email")}
                  </label>
                  <div className="relative">
                    <Mail01 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      id="si-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="si-password" className="block text-sm font-medium text-foreground mb-1">
                    {t("sign_in.password")}
                  </label>
                  <div className="relative">
                    <Lock01 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      id="si-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-[#ffb81b] hover:bg-[#e5a318] text-[#050a30] font-bold">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#050a30]/30 border-t-[#050a30] rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : t("sign_in.button")}
                </Button>
              </form>
            ) : (
              /* ──── REGISTER FORM ──── */
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-name" className="block text-sm font-medium text-foreground mb-1">
                      {t("create_account.name")}
                    </label>
                    <div className="relative">
                      <User01 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <input
                        id="reg-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reg-email" className="block text-sm font-medium text-foreground mb-1">
                      {t("create_account.email")}
                    </label>
                    <div className="relative">
<Mail01 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <input
                        id="reg-email"
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                    <label htmlFor="reg-password" className="block text-sm font-medium text-foreground mb-1">
                      {t("create_account.password")}
                    </label>
                    <div className="relative">
                      <Lock01 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-phone" className="block text-sm font-medium text-foreground mb-1">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <input
                        id="reg-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
                        placeholder="+212 6XX XX XX XX"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reg-region" className="block text-sm font-medium text-foreground mb-1">
                      Region
                    </label>
                    <div className="relative">
                      <MarkerPin01 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <select
                        id="reg-region"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition appearance-none"
                        required
                      >
                        <option value="">Select a region</option>
                        {MOROCCAN_REGIONS.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-city" className="block text-sm font-medium text-foreground mb-1">
                    City
                  </label>
                  <div className="relative">
                    <Building01 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      id="reg-city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
                      placeholder="Oujda"
                      required
                    />
                  </div>
                </div>

                {/* Project section */}
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={hasProject}
                      onChange={(e) => setHasProject(e.target.checked)}
                      className="rounded border-border accent-[#ffb81b]"
                    />
                    <Lightbulb05 size={16} className="text-[#ffb81b]" />
                    Do you have a project?
                  </label>

                  {hasProject && (
                    <div className="space-y-3 mt-3 pl-2 border-l-2 border-[#ffb81b]/30 pl-3">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Describe your project in <strong>one word</strong>
                        </label>
                        <input
                          type="text"
                          value={projectDescription}
                          onChange={(e) => setProjectDescription(e.target.value)}
                          className="w-full rounded-lg border border-input bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#ffb81b] focus:border-transparent transition"
                          placeholder="e.g. Agritech"
                          maxLength={50}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Project stage
                        </label>
                        <div className="flex gap-3">
                          <label className="flex items-center gap-1.5 text-sm text-foreground cursor-pointer">
                            <input
                              type="radio"
                              name="project_stage"
                              value="idea"
                              checked={projectStage === "idea"}
                              onChange={() => setProjectStage("idea")}
                              className="accent-[#ffb81b]"
                            />
                            Just an idea
                          </label>
                          <label className="flex items-center gap-1.5 text-sm text-foreground cursor-pointer">
                            <input
                              type="radio"
                              name="project_stage"
                              value="working"
                              checked={projectStage === "working"}
                              onChange={() => setProjectStage("working")}
                              className="accent-[#ffb81b]"
                            />
                            Already working on it
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded border-border accent-[#ffb81b]" required />
                  <span>{t("create_account.terms")}</span>
                </label>

                <Button type="submit" disabled={loading} className="w-full bg-[#ffb81b] hover:bg-[#e5a318] text-[#050a30] font-bold">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#050a30]/30 border-t-[#050a30] rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : t("create_account.button")}
                </Button>
              </form>
            )}

            {/* Social Auth — Google only */}
            <div className="mt-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground uppercase">{t("sign_in.or")}</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition disabled:opacity-50"
            >
              <svg className="size-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {mode === "sign-in" ? t("sign_in.title") : t("create_account.title")} with Google
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
