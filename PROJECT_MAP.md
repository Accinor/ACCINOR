# ACCINOR — Project Map

> Last updated: 2026-06-24
> Status: In Development — M1-M6 Complete, M7-M9 Pending

---

## [PROJECT_VISION]

ACCINOR is a specialized platform for entrepreneurship support, innovation, and professional coaching in the Oriental region of Morocco. It helps individuals transition from an idea to a successful, fundable project.

**Core mission**: Reduce youth unemployment, provide post-training support, facilitate access to funding, and build a strong entrepreneurial ecosystem in the Oriental region.

---

## [BUSINESS_GOALS]

1. **Acquire leads** — Convert visitors into consultation/project submissions
2. **Convert leads to clients** — Follow up and convert leads into paying clients
3. **Generate revenue** — Through consulting, training, and support services
4. **Build authority** — Through blog content and success stories
5. **Expand reach** — Start with 8 cities in Oriental region, scale nationally

---

## [TARGET_AUDIENCE]

| Segment | Primary Need |
|---|---|
| Students | Career guidance, training |
| Youth (job seekers) | Economic opportunities, coaching |
| Project holders | Business plan preparation, funding |
| Self-entrepreneurs | Administrative support |
| Startups | Acceleration, funding access |
| Associations | Capacity building |
| Support institutions | Partnership and referral |

---

## [SERVICES]

- Individual consulting
- Personal coaching
- Business plan preparation
- Funding file preparation
- Training & formation
- Career guidance
- Support program orientation
- Entrepreneurial content publishing

---

## [TECH_STACK]

### Runtime & Language

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.2.9 | Full-stack React framework (App Router) |
| **TypeScript** | 6.0.3 | Type safety |
| **Node.js** | 22 LTS | Runtime |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **Tailwind CSS** | 4.3.1 | Utility-first CSS |
| **shadcn/ui** | 4.11.0 | Accessible component system |
| **next-intl** | 4.13.0 | i18n (AR/FR/EN) with RTL |

### Backend & Database

| Technology | Version | Purpose |
|---|---|---|
| **Supabase** | 2.108.2 | BaaS (PostgreSQL, Auth, Storage) |
| **PostgreSQL** | 17 (Supabase managed) | Primary database |
| **Supabase Auth** | — | Authentication (admin only MVP) |

### Infrastructure

| Technology | Purpose |
|---|---|
| **Vercel** | Hosting & deployment |
| **Resend** | 6.14.0 | Transactional emails |
| **Supabase Storage** | File uploads (blog images, project files) |

### Development & Quality

| Technology | Purpose |
|---|---|
| **ESLint** | Static analysis |
| **Prettier** | Code formatting |
| **Husky + lint-staged** | Pre-commit hooks |

---

## [SYSTEM_FLOW]

```
Visitor
  │
  ▼
┌──────────────────────────────┐
│       PUBLIC WEBSITE         │
│  Home │ About │ Services     │
│  Programs │ Funding │ Blog   │
│  Contact                      │
└──────────┬───────────────────┘
           │
           ├── Contact Form ──────► Lead in Supabase
           ├── Consultation ──────► Lead + Email notification
           ├── Project Submission ─► Lead + Email notification
           ├── Newsletter ────────► Contact in Supabase
           │
           ▼
┌──────────────────────────────┐
│      ADMIN DASHBOARD         │
│  Requests │ Leads │ Clients  │
│  Blog Posts │ Consultations  │
└──────────────────────────────┘
           │
           ▼
      Follow-up & Conversion
           │
           ▼
      Success Story
```

---

## [DATABASE_SCHEMA]

### Entity Relationship (MVP)

```
┌─────────────────┐       ┌─────────────────────┐
│    contacts     │       │ consultation_requests│
├─────────────────┤       ├─────────────────────┤
│ id (uuid PK)    │       │ id (uuid PK)        │
│ name            │       │ full_name           │
│ email           │       │ email               │
│ phone (nullable)│       │ phone               │
│ source          │       │ service_type        │
│ subscribed_at   │       │ message             │
│ metadata (jsonb)│       │ status              │
│ created_at      │       │ created_at          │
└─────────────────┘       │ updated_at          │
                           └─────────────────────┘
┌─────────────────────┐       ┌─────────────────┐
│ project_submissions │       │   blog_posts    │
├─────────────────────┤       ├─────────────────┤
│ id (uuid PK)        │       │ id (uuid PK)    │
│ full_name           │       │ title           │
│ email               │       │ slug (unique)   │
│ phone               │       │ excerpt         │
│ project_name        │       │ content         │
│ project_description │       │ cover_image     │
│ project_stage       │       │ author_name     │
│ city                │       │ published       │
│ funding_needed      │       │ published_at    │
│ status              │       │ locale          │
│ created_at          │       │ created_at      │
│ updated_at          │       │ updated_at      │
└─────────────────────┘       └─────────────────┘
```

### Key Design Decisions

1. **No RLS for MVP** — Admin-only access; use Supabase Service Role key server-side
2. **Status enums** as TEXT columns with CHECK constraints (simpler than custom types)
3. **`locale` column** on `blog_posts` to support multilingual content
4. **`metadata (jsonb)`** on `contacts` for flexible future fields
5. **Timestamps** always `created_at` / `updated_at` with `now()` defaults
6. **Soft delete** not needed in MVP — hard delete is sufficient

---

## [ARCHITECTURE]

### Folder Structure

```
accinor/
├── .github/
│   └── workflows/          # CI/CD (lint, typecheck)
├── messages/               # next-intl translation files
│   ├── ar.json
│   ├── fr.json
│   └── en.json
├── public/
│   ├── images/
│   │   ├── hero/
│   │   ├── services/
│   │   └── blog/
│   ├── fonts/              # Arabic-compatible fonts
│   ├── robots.txt
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── [locale]/       # next-intl dynamic routing
│   │   │   ├── page.tsx              # Home
│   │   │   ├── about/page.tsx
│   │   │   ├── services/page.tsx
│   │   │   ├── programs-training/page.tsx
│   │   │   ├── funding-support/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx          # Blog list
│   │   │   │   └── [slug]/page.tsx   # Blog detail
│   │   │   ├── contact/page.tsx
│   │   │   ├── consultation/page.tsx
│   │   │   └── project-submission/page.tsx
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   ├── layout.tsx            # Admin layout (auth guard)
│   │   │   ├── page.tsx              # Dashboard
│   │   │   ├── requests/page.tsx
│   │   │   ├── leads/page.tsx
│   │   │   ├── clients/page.tsx
│   │   │   ├── blog/page.tsx
│   │   │   └── consultations/page.tsx
│   │   ├── api/
│   │   │   ├── contact/route.ts
│   │   │   ├── consultation/route.ts
│   │   │   ├── project-submission/route.ts
│   │   │   ├── newsletter/route.ts
│   │   │   └── revalidate/route.ts
│   │   ├── layout.tsx                # Root layout
│   │   ├── not-found.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   └── language-switcher.tsx
│   │   ├── home/
│   │   │   ├── hero-section.tsx
│   │   │   ├── services-section.tsx
│   │   │   ├── stats-section.tsx
│   │   │   ├── target-audience-section.tsx
│   │   │   └── cta-section.tsx
│   │   ├── forms/
│   │   │   ├── contact-form.tsx
│   │   │   ├── consultation-form.tsx
│   │   │   ├── project-submission-form.tsx
│   │   │   └── newsletter-form.tsx
│   │   ├── blog/
│   │   │   ├── blog-card.tsx
│   │   │   └── blog-content.tsx
│   │   └── admin/
│   │       ├── sidebar.tsx
│   │       ├── data-table.tsx
│   │       └── stats-cards.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts            # Browser client
│   │   │   └── server.ts            # Server client (admin)
│   │   ├── resend.ts                 # Email helper
│   │   └── utils.ts                  # cn() and helpers
│   ├── hooks/
│   │   └── use-language-dir.ts      # RTL/LTR detection
│   ├── logger.ts                     # Simple logging system
│   ├── middleware.ts                  # next-intl routing
│   └── i18n/
│       ├── request.ts
│       └── routing.ts
├── supabase/
│   └── migrations/                   # DB schema migrations
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### Architecture Principles

- **Server Components by default** — Minimize client components
- **Server Actions for forms** — No separate API routes for mutations (simpler)
- **API routes only** for external integrations (Resend webhooks, revalidation)
- **Admin is a route group** under `/admin` with layout-level auth check
- **No ORM** — Use Supabase JS client directly (avoid Prisma/Drizzle complexity)
- **Incremental Static Regeneration (ISR)** for public pages, SSR for admin

## [LOGGING]

Simple logger (`src/logger.ts`):

```typescript
type Level = 'INFO' | 'WARN' | 'ERROR'

const log = (level: Level, message: string, meta?: Record<string, unknown>) => {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [${level}] [ACCINOR]`
  if (level === 'ERROR') {
    console.error(prefix, message, meta ?? '')
  } else if (level === 'WARN') {
    console.warn(prefix, message, meta ?? '')
  } else {
    console.log(prefix, message, meta ?? '')
  }
}

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => log('INFO', msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log('WARN', msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log('ERROR', msg, meta),
}
```

---

## [MILESTONES]

| # | Milestone | Status | Effort |
|---|---|---|---|
| M1 | **Project Scaffold** | ✅ Complete | 1 day |
| M2 | **i18n Setup** | ✅ Complete | 2 days |
| M3 | **Public Pages** | ✅ Complete | 5 days |
| M4 | **Blog System** | ✅ Complete | 3 days |
| M5 | **Lead Forms** | ✅ Complete | 3 days |
| M6 | **Admin Dashboard** | ✅ Complete | 4 days |
| M7 | **SEO & Performance** | ⏳ Pending | 2 days |
| M8 | **Deployment** | ⏳ Pending | 1 day |
| M9 | **Testing & Polish** | ⏳ Pending | 2 days |
| **Total** | | | **23 days** |

---

## [ORPHANS_AND_PENDING]

### Completed ✅
- ✔ **Supabase region** → EU West (Ireland) — *resolved*
- ✔ **Admin email** → yassin24624@gmail.com — *resolved*
- ✔ **Brand assets** → Logo received (public/images/logo.png)
- ✔ **GitHub** → Private repo at https://github.com/Accinor/ACCINOR
- ✔ **Supabase project** → Created + anon key + schema migrated
- ✔ **M1 Scaffold** → Next.js + Tailwind + shadcn + Supabase + Resend configured
- ✔ **M2 i18n** → AR/FR/EN with RTL, language switcher, middleware
- ✔ **M3 Public Pages** → Home, About, Services, Programs, Funding, Blog, Contact — fully functional
- ✔ **M4 Blog System** → List + detail from DB, admin CRUD
- ✔ **M5 Lead Forms** → Contact, consultation, project, newsletter — all wired to Supabase
- ✔ **M6 Admin Dashboard** → Auth, sidebar, stats, tables, blog management

### Still Pending / Blocked
1. ⏳ **Custom domain** — User will provide later
2. ⏳ **Resend domain** — User will provide later (using onboarding@resend.dev temporarily)
3. ⏳ **Brand colors & fonts** — Navy+Gold scheme applied, user can share exact brand fonts later
4. ⏳ **M7 SEO** — Basic metadata done, needs sitemap.xml, robots.txt, structured data, OG images
5. ⏳ **M8 Deployment** — Needs Vercel account linked
6. ⏳ **M9 Testing & Polish** — Cross-browser, mobile, Lighthouse ≥ 90

### Explicitly Excluded (per MVP rules)
- ❌ Mobile App
- ❌ LMS Platform
- ❌ Community Platform
- ❌ Entrepreneur Dashboard
- ❌ Online Marketplace
- ❌ Chat System
- ❌ AI Assistant
- ❌ Online Payments
- ❌ Mentor Matching
- ❌ Certificates System
- ❌ Mobile Application

---

## [REQUIREMENTS ANALYSIS]

### Assumptions

1. **Admin access is single-role** — No distinction between super-admin, editor, etc. in MVP
2. **Email is sufficient** for lead notifications — No dashboard real-time notifications
3. **Supabase Auth** handles admin authentication — Password-based with email
4. **Static pages for Services/Programs/Funding** — Content managed via code, not CMS (no headless CMS complexity in MVP)
5. **Blog is the only dynamic content** — Managed through admin panel
6. **No file uploads beyond blog images** — Project submissions are text-only in MVP
7. **Visitor analytics via Vercel Analytics** — No third-party analytics tool
8. **One admin can manage all** — No role-based access control in MVP

### Open Questions

1. Should **Services** be managed via Supabase (dynamic) or hardcoded in components? _(Recommendation: hardcoded in MVP, move to DB later)_
2. Do you need **reCAPTCHA** on public forms to prevent spam? _(Recommendation: yes, use v3 invisible)_
3. Should **blog images** use Supabase Storage or external service (Cloudinary)? _(Recommendation: Supabase Storage for simplicity)_
4. What is the preferred **contact email** for lead notifications?
5. Should we implement a **static "Success Stories" section** on the home page as social proof?

---

## [USER JOURNEY — PROTOCOL 2]

```
1. VISITOR lands on Home
   │
2. DISCOVERS ACCINOR via hero section (< 5s)
   │
3. UNDERSTANDS SERVICES via services section (< 10s)
   │
4. CHOOSES to act:
   ├── "I need consulting"  → Consultation Form
   ├── "I have a project"   → Project Submission Form
   ├── "Tell me more"       → About / Services pages
   └── "I want to learn"    → Blog
   │
5. SUBMITS form → Becomes LEAD in database
   │
6. Admin notified via email → Reviews lead in dashboard
   │
7. Admin follows up → Lead becomes CLIENT
   │
8. Client receives services → Becomes SUCCESS STORY
```

### Home Page 10-Second Rule

Sequence within viewport (no scroll required):
- **0-3s**: Hero — "ACCINOR: من الفكرة إلى المشروع" + subtitle
- **3-6s**: Quick value props — 3-4 cards (Consulting, Training, Funding Support, Coaching)
- **6-10s**: CTA buttons — "احجز استشارة" / "قدم مشروعك"

---

## [PAGE MAP — MVP]

| # | Page | Route | Type | Purpose |
|---|---|---|---|---|
| 1 | Home | `/` | Public | Hero, services preview, stats, target audience, CTA |
| 2 | About | `/about` | Public | Mission, team, region focus |
| 3 | Services | `/services` | Public | Detailed service listings |
| 4 | Programs & Training | `/programs-training` | Public | Training catalog |
| 5 | Funding Support | `/funding-support` | Public | Funding resources & guidance |
| 6 | Blog | `/blog` | Public | Article list |
| 7 | Blog Post | `/blog/[slug]` | Public | Single article |
| 8 | Contact | `/contact` | Public | Contact form + info |
| 9 | Consultation | `/consultation` | Public | Booking form |
| 10 | Project Submission | `/project-submission` | Public | Project form |
| 11 | Admin Login | `/admin/login` | Auth | Admin authentication |
| 12 | Admin Dashboard | `/admin` | Protected | Stats overview |
| 13 | Admin Requests | `/admin/requests` | Protected | All form submissions |
| 14 | Admin Leads | `/admin/leads` | Protected | Lead management |
| 15 | Admin Clients | `/admin/clients` | Protected | Client tracking |
| 16 | Admin Blog | `/admin/blog` | Protected | Blog CRUD |
| 17 | Admin Consultations | `/admin/consultations` | Protected | Consultation list |

---

## [NEXT STEPS]

1. ✅ Review this plan
2. ✅ Answer open questions (7 items in [ORPHANS_AND_PENDING])
3. ✅ Provide brand assets (logo, colors)
4. ✅ Approve → Begin implementation

---

*This document follows the ACCINOR Advanced Planning Protocol (V1.0).*
