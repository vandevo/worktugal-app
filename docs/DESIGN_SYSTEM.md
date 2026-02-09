# Worktugal Design System
## Obsidian v1.2 (Latest)

**Last Updated:** Feb 9, 2025
**Theme Version:** v1.2 "Obsidian"
**Stack:** React 18 + TypeScript + Tailwind CSS + Framer Motion + Supabase

---

## 🎨 Design Philosophy

Obsidian is a high-fidelity, minimalist dark theme designed for **Remote Professionals** and **Foreign Freelancers** in Portugal. It projects authority, security, and precision through deepest blacks, institutional serif typography, and ghostly minimalist layers.

**Core Principles:**
1. **Absolute Canvas** - Deepest black `#050505` provides maximum contrast and premium feel.
2. **Serif Authority** - Playfair Display headers signal institutional trust and reliability.
3. **Ghostly Surfaces** - UI elements float on ghostly glass layers (`bg-white/[0.01]`) with razor-thin borders.
4. **Monochrome Actions** - High-impact Solid White primary buttons for unmistakable clarity.
5. **Contextual Whispers** - Accents (blue, emerald, purple) are muted at `50%` opacity, used only for icons and micro-indicators.

---

## 🎭 Color System

### Background Layers
```
Obsidian Canvas:
- bg-[#050505]          // Main page background
- bg-[#0F0F0F]          // Secondary section backgrounds
- bg-[#161616]          // Modals and elevated overlays

Glass Surfaces:
- bg-white/[0.01]       // Default card base
- bg-[#121212]          // Main card surfaces
- bg-white/[0.02]       // Hover state for cards
```

### Text Hierarchy
```
Primary Text:
- font-serif text-white // Primary headings (H1, H2)
- font-serif text-gray-200 // Subheadings

Institutional Text (Labels):
- text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600

Secondary Text:
- font-light text-gray-500 // Body text, leading-relaxed
- font-light text-gray-600 // Muted captions, hints
```

### Accent Colors (50% Opacity Only)
```
- blue-500/50           // Informational icons, small badges
- emerald-500/50        // Success icons, verified states
- yellow-500/50         // Warnings, medium risk
- red-500/50            // Errors, high risk
```

---

## 📦 Component Tokens

### Buttons (The "High Contrast" Standard)

**Primary CTA:**
```tsx
className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-xl shadow-black/20"
```

**Secondary / Outline:**
```tsx
className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs uppercase tracking-widest font-bold transition-all"
```

### Card Preset
```tsx
className="bg-[#121212] backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl shadow-black/30 p-8 hover:border-white/10 transition-all duration-300"
```

### Input Field Preset
```tsx
className="w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/[0.06] hover:bg-white/[0.04] transition-all duration-200 font-light text-sm shadow-lg shadow-black/20"
```

---

## 📐 Layout & Interaction

### Spacing Guidelines
- **Section Padding**: `py-24`
- **Container**: `max-w-7xl` (Layout), `max-w-4xl` (Content), `max-w-2xl` (Forms)
- **Grid Gaps**: `gap-8` or `gap-12` for breathing room

### Motion Specs
- **Entrance**: `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`
- **Hover**: `whileHover={{ scale: 1.02 }}`
- **Cards**: Add `hover:-translate-y-1` for a subtle lift effect

---

## 🚫 Anti-Patterns

❌ **NO blue gradients** for buttons or backgrounds (legacy v1.1).
❌ **NO solid gray borders** (e.g., border-gray-700); use `border-white/5`.
❌ **NO "Expats/Nomads" terminology** in UI; use "Remote Professionals".
❌ **NO heavy font weights** for long body text; use `font-light`.

---

**This documentation is the source of truth for the Worktugal Obsidian v1.2 Theme.**
Refer to `.cursor/rules/obsidian-theme.mdc` for AI enforcement.
