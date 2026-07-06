# Design System

> **Purpose:** The building blocks of the interface — design tokens, color, typography,
> spacing, and components. Bridges the brand (intent) and the code (implementation).

<!--
MAINTENANCE LEGEND
  🖐️ MANUAL · 🤖 CLAUDE (AUTO) · 🔁 SHARED — see PROJECT_CONTEXT.md for definitions.
Tokens/components reflect the code, so those are 🤖 CLAUDE (AUTO); principles are 🖐️ MANUAL.
-->

_Last updated: 2026-07-06_

---

## Table of Contents

1. [Overview](#overview)
2. [Design Principles](#design-principles)
3. [Color Tokens](#color-tokens)
4. [Typography](#typography)
5. [Spacing & Layout](#spacing--layout)
6. [Radii, Shadows & Elevation](#radii-shadows--elevation)
7. [Iconography](#iconography)
8. [Components](#components)
9. [Motion & Animation](#motion--animation)
10. [Accessibility](#accessibility)
11. [RTL / LTR Support](#rtl--ltr-support)

---

## Overview
<!-- 🤖 CLAUDE (AUTO) -->

Tokens are defined as Tailwind v4 `@theme inline` CSS variables at the top of
`src/app/globals.css` and consumed through Tailwind utility classes (`bg-background`,
`text-foreground`, `text-primary`, …). The system is **dark-first** with a single gold accent.

## Design Principles
<!-- 🖐️ MANUAL — team-owned; to be filled. Working intent observed in the product: -->

_Not yet formally defined by the team._ Observed intent: **dark, premium, serious** (no emojis),
a single confident gold accent, generous spacing, and subtle motion that never competes with content.

## Color Tokens
<!-- 🤖 CLAUDE (AUTO) — mirrors globals.css. -->

**Core (dark theme):**

| Token | Hex | Use |
|---|---|---|
| `background` | `#050a30` | Page background (deep navy) |
| `foreground` | `#e8eaf6` | Primary text |
| `card` / `popover` / `section` | `#0a1440` | Surfaces |
| `primary` / `accent` / `ring` | `#ffb81b` | Brand gold — CTAs, highlights, focus |
| `primary-foreground` | `#050a30` | Text on gold |
| `secondary` / `muted` | `#0e1440` | Muted surfaces |
| `muted-foreground` | `#8890b0` | Secondary text |
| `border` / `input` | `#1a2060` | Borders, inputs |
| `destructive` | `#ef4444` | Errors / danger |
| `sidebar-*` | navy + gold | Admin sidebar variants |

**Brand gold ramp:** `#fff9e6 · #fff0c2 · #ffe69e · #ffb81b · #b37b00` (`utility-brand-50…700`).
Full neutral/red/yellow/green/slate/blue/indigo/purple/pink/orange utility ramps (50/100/200/500/700)
are also defined for charts/badges. **Raw gold** is frequently used inline as `#ffb81b` /
`rgba(255,184,27,α)`.

## Typography
<!-- 🤖 CLAUDE (AUTO) -->

- **Sans (default & headings):** Inter → `--font-sans`. `--font-heading` aliases sans.
- **Arabic:** Cairo, applied via `html[lang="ar"]`.
- **Mono:** `ui-monospace, "SF Mono", "Cascadia Code"`.
- **Scale (observed):** section headings `text-3xl md:text-4xl` (hero up to `md:text-5xl`),
  card titles `text-lg`–`text-xl`, body `text-sm`–`text-lg`, all with `font-bold`/`font-semibold`
  for headings.

## Spacing & Layout
<!-- 🤖 CLAUDE (AUTO) -->

- **Container:** `container mx-auto px-4`, content often capped `max-w-2xl…max-w-5xl`.
- **Section rhythm:** vertical padding `py-24` (CTA `py-32`); heading→body `mb-4`, block→grid `mb-16`.
- **Grids:** cards use `grid md:grid-cols-2 lg:grid-cols-3/4 gap-6`.
- ⚠️ Rhythm varies slightly between pages — unifying it is planned (audit M5).

## Radii, Shadows & Elevation
<!-- 🤖 CLAUDE (AUTO) -->

- **Base radius:** `--radius: 0.5rem`. Buttons `rounded-lg`; cards `rounded-2xl` (1rem);
  pills/CTAs `rounded-full`; icon tiles `rounded-xl`.
- **Elevation:** subtle — `shadow-lg shadow-[#ffb81b]/10` glows on hover; skeuomorphic button shadow
  token `--shadow-xs-skeuomorphic`.

## Iconography
<!-- 🤖 CLAUDE (AUTO) -->

- **Set:** `@untitledui/icons`, typically `size={16}` (inline/buttons) or `24` (feature tiles),
  colored `#ffb81b`.
- ⚠️ Some common names are missing (e.g. no `Linkedin` — use `Link03`). Verify a name exists before
  importing.

## Components
<!-- 🤖 CLAUDE (AUTO) -->

- **Primitives (`components/ui`):** button, card, input, textarea, label, select, badge, avatar,
  table, dropdown-menu, separator, sheet, animated-section. Button uses `cva` variants
  (default/outline/secondary/ghost/destructive/link) × sizes (xs/sm/default/lg/icon…).
- **Shared:** `MagicBentoCard` (particle glow + tilt + magnetism hover for boxes), `CustomCursor`
  (glowing dot + comet trail), `EditableText` (in-place admin editing), `SectionSpotlight`,
  `animations.tsx` (Reveal / Stagger / CountUp / MagneticButton / TiltCard).

## Motion & Animation
<!-- 🔁 SHARED -->

- Scroll reveals + staggered entrances via Framer Motion (`Reveal`, `StaggerReveal`).
- Hover: `MagicBentoCard` particles/glow on boxes; `MagneticButton` (subtle magnetic pull, clamped);
  gold glow/scale on CTAs.
- GSAP powers the bento particle system. All motion respects `prefers-reduced-motion`.

## Accessibility
<!-- 🔁 SHARED -->

- Global `:focus-visible` outline (gold, 2px), skip-to-content link, `#main` landmark.
- `prefers-reduced-motion` disables the custom cursor and heavy transitions.
- Native cursor kept visible; icon-only controls need aria labels (ongoing).

## RTL / LTR Support
<!-- 🤖 CLAUDE (AUTO) -->

- Direction is driven by locale (`ar` → RTL) in the `[locale]` layout.
- Directional UI (arrow icons, button icon side) branches on `isRtl`. Prefer logical spacing
  (`ms-*`/`me-*`) over `ml-*`/`mr-*` for new work so both directions stay correct.
