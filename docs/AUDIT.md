# ACCINOR — Product & Engineering Audit

> **Purpose:** Senior-level audit of the ACCINOR platform across architecture, UX, performance,
> accessibility, SEO, mobile, and the admin/CRM. Findings are categorized by severity, followed
> by a phased implementation plan. This is a living document — status is updated as work ships.

<!-- 🤖 CLAUDE (AUTO) — keep the Status column and Implementation Log current as batches ship. -->

_Last updated: 2026-07-03_

---

## 1. Executive Summary

ACCINOR is a well-featured Next.js 16 + Supabase platform with a strong dark/gold identity, full
tri-lingual (AR/FR/EN) public site, working lead forms, and an admin panel. The foundations are
solid. The gaps that matter for a **premium, pre-launch, conversion-focused** platform are:

- **No SEO infrastructure** (no sitemap, robots, structured data, canonical, OG/Twitter) — critical
  for a site whose #1 goal is discovery and lead generation.
- **Broken user management** (Users page shows only the current account).
- **Performance cost of a full-screen WebGL cursor sim** plus heavy per-section animation.
- **CRM data-model redundancy** (contacts / consultations / project_submissions overlap; no true
  "clients" pipeline) — a scaling risk as ACCINOR grows into an ecosystem.
- **Thin dashboard** and a **blog missing CMS depth** (no categories/tags/featured image/SEO/preview).
- **Architectural seam**: `/admin` lives outside the `[locale]` tree with a pass-through root layout,
  which is the root cause of the "couldn't load" navigation failures and constrains scaling.

Nothing here is a rewrite. The recommended path is a **modular, phased** upgrade that preserves the
visual identity while raising the product to firm-grade quality.

---

## 2. Findings by Severity

### 🔴 Critical

| # | Area | Finding | Status |
|---|------|---------|--------|
| C1 | SEO | No `sitemap.xml`, `robots.txt`, structured data, canonical URLs, or OG/Twitter metadata. | ✅ Shipped (batch 1) |
| C2 | Admin / Users | Users page queries `profiles` from the browser; RLS returns only the current user, so management is impossible. | ✅ Shipped (batch 1) |
| C3 | Security | Admin passwords are removed from code but remain in git history; must be rotated in Supabase. | ⏳ Owner action |
| C4 | Architecture | `/admin` sits outside `[locale]`; root layout is a pass-through, so html/body live in the locale layout. This causes cross-tree navigation failures and limits scalability. | 📋 Planned (batch 3) |

### 🟠 High

| # | Area | Finding | Status |
|---|------|---------|--------|
| H1 | Performance | Full-screen WebGL fluid cursor runs a continuous render loop; heavy on mobile/battery and layered at `z-50` over content. | ✅ Shipped (batch 1) |
| H2 | UX / Readability | Cursor effect renders above cards, competing with content. | ✅ Shipped (batch 1) |
| H3 | Conversion | Homepage lacks a crisp slogan and consistent CTAs guiding users to contact. | ✅ Shipped (batch 1) |
| H4 | Accessibility | Missing global focus-visible styles, skip-to-content link, and aria labels on icon-only controls; no reduced-motion handling. | ✅ Shipped (batch 1) |
| H5 | Admin | Migration module is exposed to administrators (developer-only tool). | ✅ Shipped (batch 1) |
| H6 | CRM | `contacts` mixes leads + newsletter; `consultations` and `project_submissions` overlap; no `clients` pipeline/status flow. | 📋 Planned (batch 2) |
| H7 | Dashboard | Only raw counts; "Clients" is a stub; no recent activity or quick actions. | 📋 Planned (batch 2) |
| H8 | Blog | No categories, tags, featured image, rich text, SEO fields, or preview. | 📋 Planned (batch 2) |
| H9 | Mobile | No per-page responsive pass; several sections are desktop-first and only scale down. | 📋 Planned (batch 4) |
| H10 | Trust | Pre-launch credibility sections (Methodology, Why ACCINOR, Expertise, Commitment) are missing. | 📋 Planned (batch 2) |

### 🟡 Medium

| # | Area | Finding |
|---|------|---------|
| M1 | Design System | Duplicated patterns (avatar/initials logic, profile forms, card styles) should be extracted into shared components. |
| M2 | i18n | Investigate Moroccan Darija as a 4th locale; architecture supports it (add `ary`), but content authoring cost is real. |
| M3 | Content editing | `EditableText` coverage is partial; extend to all page copy so the edit button truly edits "everything." |
| M4 | Performance | Framer Motion + GSAP both included; consolidate and lazy-load below-the-fold animation. |
| M5 | Spacing/Type | Section spacing and heading scale vary between pages; needs a unified rhythm. |
| M6 | Images | `next/image` used inconsistently; establish sizes/priority and an OG image asset. |

### 🟢 Low

| # | Area | Finding |
|---|------|---------|
| L1 | Users badge | Conflicting Tailwind classes on the role badge. |
| L2 | Dead assets | `public/images/hero/placeholder.svg` and unused imports. |
| L3 | Copy polish | Arabic section title "الاسم وراء الرسالة" is weak; refine wording site-wide. |

---

## 3. Implementation Plan (Phased)

- **Batch 1 — Foundations (this pass):** SEO infrastructure, cursor redesign + move behind content,
  accessibility foundation, homepage slogan/title/CTAs, Users page fix, hide Migration.
- **Batch 2 — Admin & Trust:** CRM model redesign (leads/consultations/requests/clients), real
  dashboard (metrics + recent activity + quick actions), blog CMS depth, pre-launch trust sections.
- **Batch 3 — Architecture:** move `/admin` and `[locale]` into route groups with proper root layouts
  (removes the cross-tree navigation seam); component-system consolidation.
- **Batch 4 — Mobile & Polish:** per-page responsive audit, motion/perf tuning, spacing/type rhythm,
  Darija locale (if approved), extend editable content coverage.

---

## 4. Implementation Log
<!-- 🤖 CLAUDE (AUTO) — append what shipped, newest first. -->

### Batch 1 — Foundations (2026-07-03)
- **SEO (C1):** added `src/lib/site.ts`, `app/robots.ts`, `app/sitemap.ts` (per-locale + hreflang
  alternates), `metadataBase`, Open Graph + Twitter cards, per-locale canonical/OG, and JSON-LD
  Organization structured data in the locale layout.
- **Users (C2):** Users page now loads via the admin API (`/api/admin/users`) so all users show;
  role toggle uses the API PATCH; fixed conflicting role-badge classes.
- **Cursor (H1/H2):** replaced the full-screen WebGL fluid sim with a lightweight, subtle accent
  cursor ring (`custom-cursor.tsx`) — rAF-only, hidden on touch, respects reduced-motion, never
  covers content.
- **Accessibility (H4):** global `:focus-visible` styles, skip-to-content link, `#main` landmark,
  and a `prefers-reduced-motion` block in `globals.css`.
- **Homepage (H3):** added the "Build Up Your Startup" slogan to the hero; renamed the weak
  "الاسم وراء الرسالة" section title to "ماذا يعني ACCINOR" (and FR/EN equivalents).
- **Admin (H5):** hid the developer-only Migration module from the sidebar (route still reachable).
