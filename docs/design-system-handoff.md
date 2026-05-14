# Worktugal Design System Handoff — Dark Mode Intelligence Brief

## For: DeepSeek V4 Flash (or any agent)
## Created by: Kimi K2.6
## Date: 2026-05-12

---

## The Decision

**Light-mode first, dark-mode enhanced.** Theme toggle is active. Users choose. Follows Emerald Zenith theme.

**Aesthetic:** "Intelligence Brief" — Bloomberg terminal meets Monocle magazine. Glassmorphism used on landing page hero cards and key CTAs. Solid surfaces with borders on form-intensive pages.

---

## Core Tokens

### Colors (DARK MODE ONLY)

| Token | Hex | Use |
|---|---|---|
| Background | `#0E0E10` | Page background |
| Surface | `#161618` | Cards, panels |
| Surface-2 | `#1E1E22` | Nested elements, inputs |
| Surface-3 | `#26262C` | Elevated elements |
| Primary | `#0F3D2E` | Forest green — buttons, nav |
| Primary-hover | `#1A5C44` | Button hover |
| Accent | `#10B981` | Emerald — CTAs, badges, focus states |
| Accent-hover | `#059669` | CTA hover |
| Text-primary | `#F5F5F5` | Headlines |
| Text-secondary | `#9CA3AF` | Body, descriptions |
| Text-tertiary | `#6B7280` | Metadata, timestamps |
| Border | `#2D2D35` | Default borders |
| Border-hover | `#3D3D48` | Hovered borders |

### Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Display headlines | Plus Jakarta Sans | 800 | 48px |
| Section headlines | Plus Jakarta Sans | 700 | 32px |
| Card titles | Plus Jakarta Sans | 600 | 18px |
| Body | Inter | 400 | 14-16px |
| Labels/badges | Inter | 600 | 11-12px uppercase |

**Font loading:** Already in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

**Tailwind utility:** `font-jakarta` (already added to tailwind.config.js)

---

## Component Patterns

### Inputs (Glassmorphism Dark)
```tsx
<input className="w-full px-4 py-3.5 bg-[#050505] border border-white/20 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-emerald transition-colors" />
```

### Primary Button (Gradient Emerald)
```tsx
<button className="bg-gradient-to-r from-forest to-emerald text-white py-4 rounded-xl text-base font-bold hover:brightness-110 transition-all shadow-lg shadow-emerald/20">
```

### Ghost Button (Outline)
```tsx
<button className="border border-white/20 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-white/5 transition-all">
```

### Card (Glass Panel)
```tsx
<div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
```

### Badge (Emerald Pill)
```tsx
<span className="bg-emerald/20 text-emerald px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-widest border border-emerald/30">
```

### Trust Badge Row
```tsx
<div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] backdrop-blur-sm rounded-full border border-white/5">
  <Icon className="w-3.5 h-3.5 text-emerald" />
  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Label</span>
</div>
```

---

## Layout Rules

### Navigation
- Sticky top, `bg-ink/60 backdrop-blur-xl border-b border-white/5`
- Height: 64px (`h-16`)
- Logo left, links center, CTA right
- NO theme toggle button

### Page Structure
- Background: `bg-ink` (`#0E0E10`)
- Max-width: `max-w-7xl mx-auto`
- Padding: `px-6 lg:px-12`
- Section spacing: `py-12 lg:py-20`

### Background Effects
- Emerald glow blob: `absolute bg-emerald/[0.07] blur-[120px] rounded-full`
- Forest glow blob: `absolute bg-forest/[0.08] blur-[140px] rounded-full`
- Positioned absolute, pointer-events-none

---

## Pages to Migrate

### Priority 1 (Do First)
1. **Layout.tsx** — Nav + footer dark mode lock
2. **ModernHomePage.tsx** — Hero redesign
3. **JobsPage.tsx** — Already dark, tighten styling
4. **JobPostPage.tsx** — DONE (reference implementation)

### Priority 2 (Next)
5. **DiagnosticForm.tsx** — Dark inputs, emerald accents
6. **DiagnosticResults.tsx** — Dark cards, risk colors
7. **Dashboard.tsx** — Already dark, polish
8. **LoginPage.tsx** — Dark auth form

### Priority 3 (Later)
9. **RadarLanding.tsx** — Email capture page
10. **SubscribePage.tsx** — Checkout page
11. **Changelog.tsx** — List page
12. **Footer** — Dark footer

---

## Anti-Patterns (DON'T DO)

- NO light mode classes (`bg-white`, `text-slate-900` without dark variants)
- NO `dark:` prefix needed — everything IS dark
- NO theme toggle anywhere
- NO Inter for headlines — use Plus Jakarta Sans
- NO generic shadows — use emerald-tinted glows
- NO solid white backgrounds on cards — use glassmorphism

---

## Reference Files

| File | What It Is |
|---|---|
| `src/pages/JobPostPage.tsx` | DONE — Full implementation reference |
| `design/stitch-gen-mcp/stitch_worktugal_landing_redesign-kimi-job-page.zip` | Stitch generated design |
| `prompts/knowledge/emerald-zenith-theme.md` | Original design system (v1.1) |
| `tailwind.config.js` | Updated with `font-jakarta` |
| `index.html` | Plus Jakarta Sans font loaded |

---

## How to Use This With DeepSeek

1. **Load this file** at session start
2. **Load the Stitch zip** (extracted HTML shows exact visual output)
3. **Reference JobPostPage.tsx** as the implementation pattern
4. **Work page by page** — don't try to do everything at once
5. **Build first, polish later** — get it working, then refine

---

## Key Insight

The site already supports dark mode. You're not rewriting everything. You're:
1. Removing the light mode option
2. Updating the nav/footer wrapper
3. Redesigning the homepage hero
4. Polishing existing dark pages to match the new aesthetic

**Estimated time per page:** 30-60 minutes
**Total scope:** 6-8 hours across all pages

---

*Generated by Kimi K2.6 for DeepSeek V4 Flash handoff*
