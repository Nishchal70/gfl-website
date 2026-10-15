# GFL Website — Design System

Single source of truth for the visual design of the Global Farming League website.
Use this document whenever creating new pages, components, or AI-generated designs
(e.g. Google Stitch prompts) so everything stays on-brand.

---

## 1. Brand Identity

| Property | Value |
|---|---|
| Name | Global Farming League (GFL) |
| Domain | Clash of Clans farming-war league community (135+ clans, payouts every 48h) |
| Vibe | Aggressive esports / gaming — bold, high-contrast, energetic, competitive |
| Logo | `/assets/gfl-logo.png` (1536×1024, also used as favicon + OG image) |
| Tone of copy | Direct, hype-driven, action-first ("Join the league", "Get paid to farm") |

---

## 2. Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--gfl-red` | `#e5160d` | PRIMARY brand color: CTAs, accents, active states, borders, glows |
| `--gfl-ink` | `#1b1718` | Display headings, dark text, footer background (`bg-stone-950` family) |
| `--gfl-soft` | `#f7f5f4` | Light section backgrounds (stone-50 family) |
| Body text | zinc-700 / stone-600 | Paragraph text on light cards |
| Muted text | stone-500 | Hints, captions, secondary info |
| White | `#ffffff` | Card surfaces, button label text |

Rules:
- Red is the ONLY accent color. Never introduce blue, green, purple, etc.
- Dark sections use stone-950/ink tones (never pure black #000).
- Light sections use gfl-soft / stone-50/100 (never pure white walls).

---

## 3. Typography

| Role | Stack | Notes |
|---|---|---|
| Display / Headings | `"GFL Display", Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif` | Class: `.brand-font` / `.display` — condensed, uppercase, ALL-CAPS headings. **BRAND-LOCKED: never change this stack.** |
| Body | Inter (next/font, variable) | Everything else: paragraphs, buttons, nav, forms |
| H1 hero | `.display` ~5rem+ desktop | Tight leading, white or red highlight spans |
| H2 sections | `.display` ~2.5rem | Uppercase |
| Body | 1rem–1.125rem, leading-relaxed | |

---

## 4. Signature Components (CSS classes in `globals.css`)

| Class | Description |
|---|---|
| `.gfl-btn` | Primary button: red background, white bold label, rounded-xl, ::after diagonal shine sweep on hover, slight lift + darker red on hover, pressed state on :active |
| `.gfl-card` | Surface card: white bg, stone-200 border, rounded-2xl, soft shadow, hover = lift + stronger shadow |
| `.gfl-tile` | Sidebar nav tile: white, left border transparent; hover/active = red left border + tint |
| `.grid-bg` | Hero/backdrop texture: subtle grid lines on dark ink background |
| `.gfl-footer` | Stone-950 footer, white brand wordmark, red hover on links |

---

## 5. Page Structure (hash-based SPA views on `/`)

| View | Route | Content |
|---|---|---|
| Home | `#home` | Hero (eyebrow + huge display title + copy + 2 CTAs), 3-col stats strip, About, Chat CTA |
| Overview | `#overview` | League structure explanation cards |
| How to Join | `#how-to-join` | Entry/Community BAND buttons, requirements, steps, security card |
| Battle Style | `#battle-style` | Mechanics + scoring/points cards |
| Assistance | `#assistance` | 2-col support item cards |
| Base Layouts | `#base-layouts` | Placeholder title + preview media (GIF) |
| Opponents | `#opponents` | "Matched with GFL" letter page + WhatsApp/Discord contact icon links |
| Staff | `#staff` | Login card → CMS dashboard (10 tabs, Start Here hub, editors) |

Common patterns:
- Every view has ONE `<main>` landmark.
- Section header pattern: small red eyebrow label → big `.display` uppercase heading → muted lede paragraph.
- Cards live in responsive grids: `grid md:grid-cols-2` / `md:grid-cols-3`, gap-5.
- Content container: `max-w-5xl mx-auto px-5`.
- Section padding: `py-20 md:py-24`.

---

## 6. Responsive Rules

- Mobile-first; hamburger menu below md breakpoint.
- Stats strip: 3 columns stays but tightens on mobile.
- Tab bars (dashboard): always `flex-wrap` — labels must NEVER be cut off or hidden behind horizontal scroll.
- Base font ≥16px on mobile inputs (no iOS zoom).
- Zero horizontal overflow at 390px — verify every new page.

---

## 7. Hard "Do NOT" Rules

1. **Never** change the `.brand-font`/`.display` Impact font stack (brand identity).
2. **Never** introduce non-red accent colors.
3. **Never** make buttons square or thin-bordered — buttons are solid red, rounded-xl, bold.
4. **Never** use light gray-on-dark low-contrast text below WCAG AA.
5. Keep CMS-editable text structure intact (staff edits copy via dashboard, not code).

---

## 8. Ready-to-Paste Google Stitch Prompt

> Dark esports gaming website for "Global Farming League", a Clash of Clans
> farming-war league (135+ clans, loot payouts every 48 hours).
>
> THEME: very dark charcoal (#1b1718) hero with a subtle thin grid-line texture,
> light warm off-white (#f7f5f4) content sections below, pure brand red (#e5160d)
> as the ONLY accent color. No blues, greens, or purples anywhere.
>
> TYPE: huge condensed Impact-style ALL-CAPS display headings (white with one
> red highlighted word); clean modern sans-serif (Inter) for body text.
>
> COMPONENTS: solid red rounded-xl buttons with bold white labels and a subtle
> diagonal shine hover effect; white cards with light gray borders, rounded-2xl,
> soft shadows and lift-on-hover; small red uppercase eyebrow labels above
> section titles; 2–3 column card grids on desktop stacking to 1 column mobile.
>
> PAGE (home): hero section (eyebrow text, giant title "GLOBAL FARMING LEAGUE",
> one-sentence pitch, two buttons "Join the League" + "See How It Works"),
> a 3-stat strip (135+ clans / 48h payouts / guaranteed loot), an About section,
> and a chat-community CTA band. Desktop and mobile versions.
