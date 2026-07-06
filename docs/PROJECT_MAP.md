# Project Map

> **Purpose:** The technical map of the codebase — stack, architecture, folder structure,
> data model, and key flows. This is the engineering reference for how the system is built.

<!--
MAINTENANCE LEGEND
  🖐️ MANUAL · 🤖 CLAUDE (AUTO) · 🔁 SHARED — see PROJECT_CONTEXT.md for definitions.
This file skews toward 🤖 CLAUDE (AUTO): it should track the real state of the code.
-->

_Last updated: 2026-07-06_

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Folder Structure](#folder-structure)
5. [Routing & Pages](#routing--pages)
6. [Data Model](#data-model)
7. [APIs & Server Actions](#apis--server-actions)
8. [Authentication & Authorization](#authentication--authorization)
9. [Internationalization (i18n)](#internationalization-i18n)
10. [Infrastructure & Deployment](#infrastructure--deployment)
11. [Environment Variables](#environment-variables)
12. [Known Constraints & Tech Debt](#known-constraints--tech-debt)

---

## Overview
<!-- 🤖 CLAUDE (AUTO) -->

ACCINOR is a trilingual (Arabic / French / English), RTL-aware marketing + CRM platform for a
pre-launch entrepreneurship-support organization in the Oriental region of Morocco. It has two
surfaces: a **public marketing site** (home, services, programs, funding, blog, contact, and lead
forms) and an **admin panel** (dashboard, CRM pipeline, blog CMS, users, profile). Content is
trilingual and partly editable in place by admins.

## Tech Stack
<!-- 🤖 CLAUDE (AUTO) -->

- **Framework:** Next.js 16.2 (App Router) + React 19, TypeScript 5.
- **Styling:** Tailwind CSS v4 (`@theme inline` tokens in `globals.css`), `tw-animate-css`.
- **UI primitives:** `@base-ui/react`, `react-aria-components`, local components in `src/components/ui`.
- **Icons:** `@untitledui/icons` (note: some common icons are missing — verify names before importing).
- **Animation:** Framer Motion **and** GSAP (both present — consolidation is planned tech debt).
- **i18n:** `next-intl` v4.
- **Backend:** Supabase (Postgres + Auth + Storage) via `@supabase/supabase-js` and `@supabase/ssr`.
- **Email:** Resend.
- **Analytics:** `@vercel/speed-insights`.
- **Hosting:** Vercel.

## Architecture
<!-- 🤖 CLAUDE (AUTO) -->

- **Rendering:** App Router with a mix of server and client components. Most interactive sections
  are `"use client"` (forms, animated sections, admin tables).
- **Middleware:** `src/proxy.ts` (Next 16 renamed `middleware.ts` → `proxy.ts`) runs next-intl locale
  routing and refreshes the Supabase session cookie. It redirects `/` → `/{locale}` (default `ar`)
  and forwards OAuth `?code`/`?token` on `/` to `/{locale}/auth/callback`.
- **Supabase clients:** three factories — browser (`lib/supabase/client.ts`), server/SSR cookies
  (`lib/supabase/server.ts`), and a service-role admin client (`lib/supabase/admin.ts`) used only in
  server routes.
- **Content editing:** `EditableText` + `edit-mode` context let admins edit copy in place; values are
  stored per-locale via `/api/content`, keyed `${locale}:${page}:${section}:${field}`.

## Folder Structure
<!-- 🤖 CLAUDE (AUTO) -->

```
src/
  app/
    [locale]/            # Public, localized site (ar | fr | en)
      page.tsx           # Home
      about/, about/team/
      services/, programs-training/, funding-support/
      blog/, blog/[slug]/
      contact/, consultation/, project-submission/
      auth/, auth/callback/, profile/
      layout.tsx         # Locale layout: html/body, fonts, RTL dir, JSON-LD, CustomCursor
    admin/               # Admin panel (OUTSIDE [locale] — see tech debt)
      page.tsx (dashboard), leads/, consultations/, requests/, clients/,
      blog/, users/, profile/, migrate/, login/, layout.tsx, error.tsx
    api/                 # Route handlers (see APIs section)
    layout.tsx           # Root pass-through layout
    globals.css          # Tailwind theme tokens + global styles
    robots.ts, sitemap.ts
  components/
    home/                # Home sections (hero, services, stats, why, methodology, cta, ...)
    admin/               # admin-shell, sidebar, crm-board
    forms/               # contact, consultation, newsletter, project-submission
    layout/              # navbar, footer, mobile-nav, language-switcher
    shared/              # custom-cursor, editable-text, magic-bento-card, animations, ...
    ui/                  # button, card, input, select, table, dropdown-menu, ...
    blog/, foundations/
  contexts/              # auth.tsx, edit-mode.tsx
  i18n/                  # routing.ts, request.ts
  lib/                   # supabase/, admin.ts, auth-guard.ts, morocco.ts, site.ts, utils.ts
  proxy.ts               # Middleware
messages/                # ar.json, fr.json, en.json (all UI copy)
supabase/migrations/     # 00001–00005 SQL
docs/                    # This documentation set
```

## Routing & Pages
<!-- 🤖 CLAUDE (AUTO) -->

**Public (`/[locale]/…`, locale ∈ {ar, fr, en}):**
Home · About (+ Team) · Services · Training Programs · Funding Support · Blog (+ post) ·
Contact · Consultation · Project Submission · Auth (+ OAuth callback) · Profile.

**Admin (`/admin/…`, not localized):**
Dashboard · Leads · Consultations · Requests · Clients · Blog (posts CMS) · Users · Profile ·
Migrate (developer tool, hidden from sidebar) · Login.

## Data Model
<!-- 🤖 CLAUDE (AUTO) — from supabase/migrations. -->

- **contacts** — leads + newsletter. `name, email, phone, source, metadata, status (new|contacted|
  qualified|converted|archived), notes, created_at`.
- **consultation_requests** — `full_name, email, phone, service_type, message, status (pending|
  contacted|completed|cancelled), notes, created_at, updated_at`.
- **project_submissions** — `full_name, email, phone, project_name, project_description,
  project_stage, city, funding_needed, status (pending|reviewing|accepted|rejected), notes, …`.
- **clients** — converted/ongoing engagements. `full_name, email, phone, company, city, region,
  engagement, stage (onboarding|active|on_hold|completed|churned), notes, source_type, source_id`.
- **blog_posts** — `title, slug, excerpt, content, cover_image, author_name, published,
  published_at, locale (ar|fr|en), category, tags[], seo_title, seo_description, featured,
  reading_minutes`. Unique `(slug, locale)`.
- **profiles** — extends `auth.users`. `email, full_name (+ first_name/last_name), phone, region,
  city, role (user|admin), profile_type (user|admin|coach|facilitator|presenter|partner), avatar_url,
  bio, title, position, website, linkedin_url, notifications (jsonb)`. RLS enabled.
- **page_content** — inline-editable copy, keyed by locale/page/section/field (via `/api/content`).
- **Storage:** `avatars` bucket (public), per-user folder RLS.

CRM pipeline: **Leads** (`contacts`) → **Consultations** / **Project Requests** → **Clients**.

## APIs & Server Actions
<!-- 🤖 CLAUDE (AUTO) -->

- **Public forms:** `/api/contact`, `/api/consultation`, `/api/newsletter`, `/api/project-submission`.
- **Content:** `/api/content` (GET/POST inline-editable copy), `/api/team` (public team members).
- **Auth:** `/api/auth/profile`, `/change-password`, `/upload-avatar`, `/delete-avatar`,
  `/sync-profile`.
- **Admin (service-role, `requireAdmin`-gated):** `/api/admin/users`, `/crm`, `/clients`, `/blog`,
  `/seed`, `/setup`, `/migrate`.

## Authentication & Authorization
<!-- 🤖 CLAUDE (AUTO) -->

- **Auth:** Supabase Auth — email/password + Google OAuth (handled via the root `?code` redirect to
  `/{locale}/auth/callback`).
- **Roles:** `profiles.role` (`user` | `admin`). Admin gate = `requireAdmin()` (`lib/auth-guard.ts`),
  which checks `profiles.role === 'admin'`, falling back to the `ADMIN_EMAILS` allowlist
  (`lib/admin.ts`).
- **RLS:** enabled on all tables. Admin API routes use the service-role client (bypasses RLS).
  ⚠️ The `profiles` admin SELECT/UPDATE policies are self-referential (recursion risk) — see tech debt.

## Internationalization (i18n)
<!-- 🤖 CLAUDE (AUTO) -->

- **Locales:** `ar` (default, **RTL**), `fr`, `en`. Configured in `src/i18n/routing.ts`; wired by
  `proxy.ts` + `next-intl`.
- **Copy:** all UI strings live in `messages/{ar,fr,en}.json`. No mixed languages per page.
- **Fonts:** Inter (Latin) globally; Cairo for Arabic (`html[lang="ar"]`).
- **Editable content** overlays the JSON copy per-locale via `page_content` + `EditableText`.

## Infrastructure & Deployment
<!-- 🔁 SHARED -->

- **Host:** Vercel — project `accinor` (team `accinor-ma`), repo `Accinor/ACCINOR`.
- **CI/CD:** every push to `main` auto-deploys. Production: https://accinor.vercel.app
- **Branches:** `main` is the live/working branch. `master` is an older lineage; a `vercel/…` branch
  holds an earlier parallel line.
- **Windows note:** use `npx.cmd` (not `npx.ps1`) locally due to execution policy.

## Environment Variables
<!-- 🔁 SHARED — names/purpose only, never values. -->

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — client Supabase access.
- `SUPABASE_SERVICE_ROLE_KEY` — server-only admin DB access.
- `SUPABASE_MANAGEMENT_ACCESS_TOKEN` — runs SQL/migrations via the Supabase Management API.
- `RESEND_API_KEY`, `CONTACT_EMAIL` — transactional email + inbox.
- `ADMIN_EMAILS` — comma-separated admin allowlist (fallback for the role gate).
- `ADMIN_SEED_PASSWORDS` — used by the seed/reset endpoint; never in source.
- `VERCEL_OIDC_TOKEN` — Vercel-managed.

## Known Constraints & Tech Debt
<!-- 🤖 CLAUDE (AUTO) -->

- **Route seam:** `/admin` lives outside `[locale]`; navigation between the trees needs hard
  `window.location.href` workarounds (audit C4 / Batch 3 — route groups planned).
- **RLS recursion:** `profiles` admin policies reference `profiles` within their own USING clause →
  can throw "infinite recursion" for authenticated (non-service-role) reads. Fix with a
  `SECURITY DEFINER is_admin()` helper.
- **Animation:** Framer Motion + GSAP both bundled; consolidate + lazy-load below-the-fold (M4).
- **Editable coverage:** `EditableText` covers only some copy; extend to all page text (M3).
- **Mobile:** no full per-page responsive pass yet (H9 / Batch 4).
- **Build cache:** stale `.next/types` may reference removed auth routes; `rm -rf .next` clears them.
