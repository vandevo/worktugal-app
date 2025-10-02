# Worktugal Design System
## Dark Glass Morphism Theme

**Last Updated:** Oct 1, 2025
**Stack:** React 18 + TypeScript + Tailwind CSS + Framer Motion + Supabase

---

## 🎨 Design Philosophy

We use a **dark glass morphism** aesthetic inspired by iOS translucent surfaces. All interfaces feel premium, fast, and obvious. Forms and actions are clear. Copy is concise. Loading states are instant.

**Core Principles:**
1. **Dark First** - All screens use dark backgrounds with translucent white surfaces
2. **Glass Layers** - Frosted blur + subtle borders + soft shadows create depth
3. **Blue Accent** - Single accent color family (blue 400-600 range) for CTAs and focus
4. **High Contrast** - White text on dark ensures readability at arm's length
5. **Smooth Motion** - Micro-interactions use scale + opacity (100-300ms)
6. **Mobile First** - Design for 375px, scale up to 1920px+

---

## 🎭 Color System

### Background Layers
```
Dark Canvas:
- bg-gray-900          // Page background
- bg-gray-800          // Secondary surfaces
- from-gray-900 via-gray-800 to-blue-900  // Hero gradients

Glass Surfaces:
- bg-white/[0.02]      // Subtle base
- bg-white/[0.03]      // Default cards, forms
- bg-white/[0.04]      // Elevated surfaces
- bg-white/[0.06]      // Hover state
- bg-white/[0.08]      // Active/focus state
```

### Text Hierarchy
```
Primary Text:
- text-white           // Headings, primary labels
- text-gray-200        // Body text on dark

Secondary Text:
- text-gray-300        // Form labels, supporting text
- text-gray-400        // Placeholders, hints, disabled
- text-gray-500        // Muted captions
```

### Accent Colors
```
Blue (Primary Action):
- blue-400             // Links, focus rings
- blue-500             // Primary buttons (default)
- blue-600             // Primary buttons (active)
- from-blue-400 to-blue-300  // Gradient text

Semantic Colors:
- green-400/500        // Success
- red-400/500          // Errors, destructive
- yellow-400/500       // Warnings
- purple-400           // Special highlights
```

### Borders & Dividers
```
Glass Borders:
- border-white/[0.08]  // Subtle cards
- border-white/[0.10]  // Default glass
- border-white/[0.12]  // Inputs default
- border-white/[0.16]  // Inputs hover
- border-white/[0.20]  // Strong dividers

Accent Borders:
- border-blue-400/30   // Primary buttons
- border-blue-400/60   // Input focus
```

---

## 📦 Component Tokens

### Glass Surface Presets

**Subtle Card** (use for backgrounds, secondary containers):
```tsx
className="bg-white/[0.02] backdrop-blur-2xl rounded-3xl border border-white/[0.08] shadow-2xl shadow-black/25"
```

**Default Card** (use for main content cards):
```tsx
className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 ring-1 ring-white/[0.05]"
```

**Elevated Card** (use for modals, popovers):
```tsx
className="bg-white/[0.04] backdrop-blur-2xl rounded-2xl border border-white/[0.12] shadow-xl shadow-black/40 ring-1 ring-white/[0.03]"
```

---

## 🧩 Core Components

### Input Field

**States:**
- Default: `bg-white/[0.03] border-white/[0.12]`
- Hover: `bg-white/[0.06] border-white/[0.16]`
- Focus: `bg-white/[0.08] border-blue-400/60 ring-2 ring-blue-400/80`
- Error: `border-red-400/60 ring-red-400/60`
- Disabled: `bg-gray-700 cursor-not-allowed`

**Complete Class String:**
```tsx
className="w-full px-4 py-3 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.12] rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/80 focus:border-blue-400/60 focus:bg-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.06] transition-all duration-300 shadow-2xl shadow-black/40"
```

**Label Pattern:**
```tsx
<label className="block text-sm font-semibold text-gray-300 mb-2">
  Full Name *
</label>
```

**Hint/Error Pattern:**
```tsx
<p className="text-xs text-gray-400 mt-2">Helper text goes here</p>
<p className="text-xs text-red-400 mt-2">Error message goes here</p>
```

---

### Textarea

```tsx
className="w-full px-4 py-3 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.12] rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/80 focus:border-blue-400/60 focus:bg-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.06] transition-all duration-300 shadow-2xl shadow-black/40 resize-none"
```

---

### Buttons

**Primary** (use for main CTAs):
```tsx
className="bg-gradient-to-br from-blue-500/90 to-blue-600/90 hover:from-blue-400/90 hover:to-blue-500/90 text-white font-semibold shadow-2xl shadow-blue-500/40 hover:shadow-3xl hover:shadow-blue-500/50 backdrop-blur-2xl border border-blue-400/30 px-6 py-3 rounded-xl"
```

**Secondary** (use for alternative actions):
```tsx
className="bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-2xl text-white font-medium shadow-xl shadow-black/20 hover:shadow-2xl border border-white/[0.12] hover:border-white/[0.16] px-6 py-3 rounded-xl"
```

**Outline** (use for cancel, back):
```tsx
className="border border-white/[0.15] hover:border-white/[0.25] text-gray-300 hover:text-white hover:bg-white/[0.06] backdrop-blur-2xl shadow-lg shadow-black/10 hover:shadow-xl px-6 py-3 rounded-xl"
```

**Ghost** (use for nav links, subtle actions):
```tsx
className="text-gray-400 hover:text-white hover:bg-white/[0.04] backdrop-blur-xl px-4 py-2 rounded-lg"
```

---

### Cards

Use the `<Card>` component with variants:

```tsx
// Subtle background card
<Card variant="default">content</Card>

// Main content card (recommended default)
<Card variant="glass">content</Card>

// Elevated card (modals, important CTAs)
<Card variant="frosted">content</Card>
```

---

## 📐 Spacing & Layout

### Base Unit: 8px

```
Spacing Scale (use Tailwind defaults):
- 1 = 4px   (tight inline gaps)
- 2 = 8px   (default inline spacing)
- 3 = 12px
- 4 = 16px  (default vertical spacing between form fields)
- 6 = 24px  (section spacing)
- 8 = 32px  (large section gaps)
- 12 = 48px (hero padding)
- 16 = 64px
- 20 = 80px (section padding top/bottom)
```

### Container Widths
```
Forms, modals:     max-w-2xl  (672px)
Content sections:  max-w-4xl  (896px)
Full layout:       max-w-7xl  (1280px)
```

### Border Radius
```
Small:   rounded-lg   (8px)  - badges, chips
Medium:  rounded-xl   (12px) - buttons
Large:   rounded-2xl  (16px) - inputs, small cards
XLarge:  rounded-3xl  (24px) - large cards, modals
```

---

## 🎬 Motion & Interaction

### Hover States
```tsx
// Scale up slightly
whileHover={{ scale: 1.02 }}

// Lift card
whileHover={{ scale: 1.02, y: -4 }}
```

### Tap/Click States
```tsx
whileTap={{ scale: 0.98 }}
```

### Page Transitions
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
```

### Duration Guidelines
```
Fast:     duration-200  (hover, focus)
Default:  duration-300  (most transitions)
Slow:     duration-500  (page enters, complex transitions)
```

---

## ♿ Accessibility

### Required Patterns

**All Inputs:**
- Must have associated `<label>` with matching `htmlFor`
- Use `aria-label` if visual label is hidden
- Error messages use `aria-describedby`

**Focus Indicators:**
- All interactive elements have visible focus ring: `focus:ring-2 focus:ring-blue-400/80`
- Never use `focus:outline-none` without custom focus state

**Color Independence:**
- Never use color alone to convey state
- Errors show both red color AND icon/text message
- Required fields marked with asterisk (*) AND "required" attribute

**Contrast Requirements:**
- White text on dark backgrounds: WCAG AA (4.5:1+)
- Gray-300 or lighter for all body text
- Gray-400 minimum for hints/placeholders

---

## 📱 Responsive Breakpoints

```
Mobile:       default (375px+)
Tablet:       md: (768px+)
Laptop:       lg: (1024px+)
Desktop:      xl: (1280px+)
Wide:         2xl: (1536px+)
```

### Responsive Patterns

**Padding:**
```
Mobile:  px-4 py-8
Tablet:  md:px-6 md:py-12
Desktop: lg:px-8 lg:py-20
```

**Grid Layouts:**
```
Mobile:  grid-cols-1
Tablet:  md:grid-cols-2
Desktop: lg:grid-cols-3 xl:grid-cols-4
```

---

## ✅ Component Checklist

When building any new component, ensure:

- [ ] Uses dark glass theme (no white backgrounds)
- [ ] Text is white/gray-300 minimum (never dark gray on glass)
- [ ] Glass surface has: backdrop-blur + bg-white/[0.0X] + border-white/[0.XX]
- [ ] Inputs use the standard Input component from ui/
- [ ] Buttons use Button component with correct variant
- [ ] Labels are text-gray-300, font-semibold
- [ ] Hints/errors are text-gray-400 / text-red-400
- [ ] All interactive elements have hover + focus states
- [ ] Motion uses framer-motion with subtle scale/opacity
- [ ] Mobile-first responsive (test at 375px)
- [ ] Keyboard navigation works
- [ ] No layout shift on load

---

## 🚫 Anti-Patterns (DO NOT DO)

❌ **Light theme on accounting pages** - breaks visual consistency
❌ **Solid white backgrounds** - use translucent glass instead
❌ **Dark text on light surfaces** - inverts the theme
❌ **Hard borders** (border-gray-300) - use translucent borders
❌ **No blur/transparency** - loses glass effect
❌ **Inconsistent input styling** - always use Input component
❌ **Naked form fields** - wrap in proper Card or container
❌ **Missing hover states** - all interactive items need feedback
❌ **Purple/indigo unless requested** - stick to blue accent

---

## 🎯 Quick Reference: Form Pattern

```tsx
<div className="bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.10] shadow-2xl shadow-black/30 ring-1 ring-white/[0.05] p-8">
  <h2 className="text-3xl font-bold text-white mb-2">Form Title</h2>
  <p className="text-gray-300 mb-8">Supporting description text</p>

  <form className="space-y-6">
    <div>
      <label htmlFor="field" className="block text-sm font-semibold text-gray-300 mb-2">
        Field Label *
      </label>
      <Input
        id="field"
        name="field"
        type="text"
        required
        placeholder="Placeholder text"
      />
      <p className="text-xs text-gray-400 mt-2">Helper text</p>
    </div>

    <div className="flex gap-4">
      <Button variant="outline" className="flex-1">Cancel</Button>
      <Button variant="primary" className="flex-1">Submit</Button>
    </div>
  </form>
</div>
```

---

## 🔄 Migration from Light to Dark

If you find a component using light theme (like the screenshot), apply this transform:

| Light Theme | Dark Glass Theme |
|-------------|------------------|
| `bg-white` | `bg-white/[0.03] backdrop-blur-3xl border border-white/[0.10]` |
| `text-gray-900` | `text-white` |
| `text-gray-700` | `text-gray-300` |
| `text-gray-600` | `text-gray-400` |
| `border-gray-300` | `border-white/[0.12]` |
| `bg-gray-50` (info boxes) | `bg-white/[0.02] backdrop-blur-xl border border-white/[0.08]` |

---

**This is the source of truth for all UI development.**
When in doubt, reference existing components in `src/components/ui/`
