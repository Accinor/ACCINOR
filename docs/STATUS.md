# ACCINOR — Project Status & Handoff

> **Purpose:** The single "where are we / what's left" file. Read this first when resuming work
> on ACCINOR — including from a different computer or a fresh chat. It is kept current as work ships.

<!-- 🤖 CLAUDE (AUTO) — update this file at the end of every work session: move shipped items out of
     "What's Left", refresh "Current State", and bump the date. -->

_Last updated: 2026-07-03_

---

## How to Resume (read in this order)

1. **This file** — current state + what's left.
2. [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) — vision, mission, audience, business intent. **Read this fully before design/content work.**
3. [AUDIT.md](./AUDIT.md) — the full categorized audit (Critical/High/Medium/Low) and the phased plan. The Implementation Log at the bottom is the detailed changelog per batch.

> **To pick up work, just say:** _"What's left on ACCINOR?"_ — the assistant should read this file and continue from the next unchecked item. Local machine memory does **not** travel between computers or chats; this committed file is the source of truth.

---

## Current State (what's DONE)

- **Batch 1 — Foundations** ✅ (commit `8b7fb12`)
  - SEO: `sitemap.xml`, `robots.txt`, per-locale hreflang, Open Graph + Twitter, canonical, JSON-LD Organization schema.
  - Cursor: replaced heavy WebGL fluid sim with a lightweight accent-ring cursor; respects reduced-motion; never covers content.
  - Accessibility: focus-visible styles, skip-to-content link, `#main` landmark.
  - Homepage: "Build Up Your Startup" slogan; renamed weak Arabic section title.
  - Users page fixed (was showing only the logged-in account); Migration module hidden from sidebar.

- **Batch 2 — Admin & Trust** ✅ (commit `2957aab`)
  - CRM model: clear pipeline — **Leads** (`contacts`) / **Consultations** / **Project Requests** / **Clients** (new table). Status workflows + notes across all; reusable `CrmBoard` with search + status chips.
  - APIs: `/api/admin/crm` (status updates), `/api/admin/clients` (CRUD) — service-role, admin-gated.
  - Dashboard: real metrics + recent activity feed + quick actions.
  - Blog CMS: cover image + live preview, category, tags, SEO fields, featured flag, auto-slug, Markdown write/preview toggle, reading-time.
  - Trust sections on homepage: "Why ACCINOR" + "How We Work" methodology — trilingual, editable, **no fake clients/testimonials/metrics**.
  - DB migration: `supabase/migrations/00005_crm_and_blog.sql`.

---

## ⚠️ Owner Action Items (blocking / important)

- [ ] **Run the Batch 2 migration.** In the Supabase SQL Editor, run `supabase/migrations/00005_crm_and_blog.sql`. Until then: the Clients page shows a "run the migration" notice, CRM status changes and new blog fields won't persist. Everything else works.
- [ ] **Rotate the two admin passwords** in Supabase. Old passwords are still in git history (= compromised) even though they're removed from the code. Do this before the site goes public.

---

## What's Left (not done yet)

- [ ] **Read through [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)** in full before the next design/content pass — align all remaining work to the stated vision, audience, and tone.

- [ ] **Batch 3 — Architecture** (~20–35 min; higher risk, test navigation thoroughly)
  - Move `/admin` and `[locale]` into route groups with proper root layouts to permanently fix the cross-tree navigation seam (root cause of the "this page couldn't load" / black-page issues; currently worked around with hard `window.location.href` navigation for admin destinations).
  - Consolidate duplicated components (avatar/initials logic, profile forms, card styles) into shared components (audit item M1 — partly addressed by `CrmBoard`).

- [ ] **Batch 4 — Mobile & Polish** (~25–40 min; lower risk, high visible value)
  - Per-page responsive audit at mobile widths (audit item H9).
  - Unified spacing + typography rhythm across pages (M5).
  - Extend the edit button (`EditableText`) to cover **all** remaining page copy, so "edit everything" is literally true (M3).
  - Full user management: create + deactivate (currently only role toggle exists).
  - Motion/perf tuning; consolidate Framer Motion + GSAP; lazy-load below-the-fold animation (M4).
  - Establish an OG image asset + consistent `next/image` usage (M6).
  - **Optional:** add Moroccan Darija (`ary`) as a 4th locale (M2) — architecture supports it, but it's a full 4th translation set; confirm with owner first.

- [ ] **Low-priority cleanup** (audit L1–L3): remove dead assets/unused imports; site-wide copy polish.

---

## Key Environment Notes (for whoever resumes)

- **Windows + PowerShell.** For Vercel/npx use `npx.cmd vercel` (`npx.ps1` is blocked by execution policy).
- **Deploy:** every push to `main` auto-deploys to Vercel (project `accinor`, team `accinor-ma`, repo `Accinor/ACCINOR`). Production URL: https://accinor.vercel.app
- **Verify icon names before use** — `@untitledui/icons` is missing some common ones (e.g. no `Linkedin`; use `Link03`). Check with a quick `node -e` before importing.
- **Content editing** is per-locale, keyed `${locale}:${page}:${section}:${field}` in the `page_content` table via `/api/content` (admin-gated by `profiles.role === "admin"`).
- **Do not invent trust content:** no fake testimonials, clients, or case studies — ACCINOR has not launched.
- **Tone:** serious, professional, no emojis.
