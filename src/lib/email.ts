import { Resend } from "resend"
import { logger } from "@/logger"

// Sender must be a verified domain in Resend for external delivery. Until a
// domain is verified, set EMAIL_FROM to a verified address; the default only
// delivers to the Resend account owner (test mode).
const FROM = process.env.EMAIL_FROM || "ACCINOR <onboarding@resend.dev>"
const ADMIN = process.env.CONTACT_EMAIL

type Locale = "ar" | "fr" | "en"
const norm = (l?: string): Locale => (l === "ar" || l === "fr" ? l : "en")

// Best-effort send: never throws, never blocks the caller's success path.
async function send(to: string | undefined, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY
  if (!key || !to) return
  try {
    const resend = new Resend(key)
    const { error } = await resend.emails.send({ from: FROM, to, subject, html })
    if (error) logger.error("Email send failed", { error: String(error), to })
  } catch (err) {
    logger.error("Email send threw", { error: String(err) })
  }
}

function shell(dir: "rtl" | "ltr", title: string, body: string) {
  return `<div dir="${dir}" style="font-family:Inter,Arial,sans-serif;background:#050a30;color:#e8eaf6;padding:32px;border-radius:16px;max-width:560px;margin:0 auto">
    <div style="font-size:22px;font-weight:800;color:#ffb81b;letter-spacing:1px;margin-bottom:20px">ACCINOR</div>
    <h1 style="font-size:20px;margin:0 0 14px;color:#ffffff">${title}</h1>
    <div style="font-size:15px;line-height:1.75;color:#c9cde6">${body}</div>
    <div style="margin-top:28px;padding-top:16px;border-top:1px solid #1a2060;font-size:12px;color:#8890b0">ACCINOR — From Idea to Project</div>
  </div>`
}

const CONSULT: Record<Locale, { subject: string; title: (n: string) => string; body: string }> = {
  en: {
    subject: "Your free consultation with ACCINOR — request received",
    title: (n) => `Thank you, ${n}!`,
    body: "We've received your consultation request. <b style='color:#ffb81b'>Your first consultation is completely free.</b> Our team will contact you directly, very soon, to schedule it. We're looking forward to helping you move your project forward.",
  },
  fr: {
    subject: "Votre consultation gratuite avec ACCINOR — demande reçue",
    title: (n) => `Merci, ${n} !`,
    body: "Nous avons bien reçu votre demande de consultation. <b style='color:#ffb81b'>Votre première consultation est entièrement gratuite.</b> Notre équipe vous contactera directement, très bientôt, pour la planifier. Nous avons hâte de vous aider à faire avancer votre projet.",
  },
  ar: {
    subject: "استشارتك المجانية مع ACCINOR — تم استلام طلبك",
    title: (n) => `شكراً لك، ${n}!`,
    body: "لقد استلمنا طلب الاستشارة الخاص بك. <b style='color:#ffb81b'>استشارتك الأولى مجانية بالكامل.</b> سيتواصل معك فريقنا مباشرةً، قريباً جداً، لتحديد موعدها. نتطلع إلى مساعدتك في المضي قدماً بمشروعك.",
  },
}

const PROJECT: Record<Locale, { subject: string; title: (n: string) => string; body: string }> = {
  en: {
    subject: "We received your project — ACCINOR",
    title: (n) => `Thank you, ${n}!`,
    body: "We've received your project and our team is reviewing it. <b style='color:#ffb81b'>Your project details are safe with us</b>, and you'll get a <b style='color:#ffb81b'>free consultation</b> as a next step. We'll contact you directly, very soon, to discuss how we can help you build it up.",
  },
  fr: {
    subject: "Nous avons bien reçu votre projet — ACCINOR",
    title: (n) => `Merci, ${n} !`,
    body: "Nous avons bien reçu votre projet et notre équipe l'examine. <b style='color:#ffb81b'>Les détails de votre projet sont en sécurité chez nous</b>, et vous bénéficierez d'une <b style='color:#ffb81b'>consultation gratuite</b> comme prochaine étape. Nous vous contacterons directement, très bientôt.",
  },
  ar: {
    subject: "لقد استلمنا مشروعك — ACCINOR",
    title: (n) => `شكراً لك، ${n}!`,
    body: "لقد استلمنا مشروعك ويقوم فريقنا بمراجعته. <b style='color:#ffb81b'>تفاصيل مشروعك في أمان معنا</b>، وستحصل على <b style='color:#ffb81b'>استشارة مجانية</b> كخطوة تالية. سنتواصل معك مباشرةً، قريباً جداً، لمناقشة كيف يمكننا مساعدتك.",
  },
}

export async function sendConsultationEmails(d: {
  name: string; email: string; phone?: string; serviceType?: string; message?: string; locale?: string
}) {
  const l = norm(d.locale)
  const dir = l === "ar" ? "rtl" : "ltr"
  const c = CONSULT[l]
  await send(d.email, c.subject, shell(dir, c.title(d.name), c.body))
  await send(
    ADMIN,
    `New consultation request — ${d.name}`,
    shell("ltr", "New consultation request",
      `<b>${d.name}</b> (${d.email}, ${d.phone || "—"})<br/>Service: ${d.serviceType || "—"}<br/>Message: ${d.message || "—"}`)
  )
}

export async function sendProjectEmails(d: {
  name: string; email: string; phone?: string; projectName?: string; description?: string;
  stage?: string; city?: string; funding?: string; locale?: string
}) {
  const l = norm(d.locale)
  const dir = l === "ar" ? "rtl" : "ltr"
  const p = PROJECT[l]
  await send(d.email, p.subject, shell(dir, p.title(d.name), p.body))
  await send(
    ADMIN,
    `New project submission — ${d.projectName || d.name}`,
    shell("ltr", "New project submission",
      `<b>${d.name}</b> (${d.email}, ${d.phone || "—"})<br/>Project: ${d.projectName || "—"}<br/>Stage: ${d.stage || "—"} · City: ${d.city || "—"} · Funding: ${d.funding || "—"}<br/>Description: ${d.description || "—"}`)
  )
}
