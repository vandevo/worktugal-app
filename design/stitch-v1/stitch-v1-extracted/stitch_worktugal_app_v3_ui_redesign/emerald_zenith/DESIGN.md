# Emerald Zenith Design System

### 1. Overview & Creative North Star
**Creative North Star: The Sovereign Compliance Curator**

Emerald Zenith is a high-end editorial design system built for professional security and tax compliance. It rejects the "utility-first" clutter of traditional fintech for a "Curated Wisdom" aesthetic. By utilizing a deep forest primary palette paired with high-frequency accent colors (Emerald, Amber, Crimson), the system creates an environment of authority and urgent clarity. 

The design breaks from standard templates through **intentional typographic rhythm**—juxtaposing microscopic uppercase labels with massive, bolded numerical scores—and **asymmetrical card accents** (like the thick left-border risk indicators).

### 2. Colors
Emerald Zenith uses a deep, "Midnight Forest" green (#0F3E2E) as its grounding force, providing a sense of establishment and trust.

- **The "No-Line" Rule:** Direct sectioning with 1px borders is strictly prohibited. Use background shifts (e.g., `#FAFAF9` to `#FFFFFF`) or functional color accents (like the 4px vertical risk bars) to define boundaries.
- **Surface Hierarchy & Nesting:** Depth is achieved by placing `surface_container_lowest` (Pure White) cards atop a `surface` (Off-white/Stone) background. Nested elements within cards should use `surface_container_low` (Slate-50) to create secondary interactive areas.
- **Signature Textures:** Utilize high-opacity primary backgrounds for Call-to-Action sections to create a "void" that draws the eye, contrasted with `primary_container` (Emerald) for the interactive layer.

### 3. Typography
The system relies exclusively on **Inter** for its modern, neutral, yet authoritative characteristics. It employs a "staccato" hierarchy.

- **Display & Headline:** Uses `1.25rem` (20px) and `1.875rem` (30px) for high-impact scores and titles. Tracking is tight (-0.025em) to maintain a dense, editorial feel.
- **Micro-Labels:** A signature of the system is the use of `10px` and `11px` uppercase labels with expanded tracking (`0.15em`). This provides an "architectural blueprint" feel to the metadata.
- **Body:** Standardized at `0.875rem` (14px) with a `1.5` line-height for maximum readability of complex legal/compliance text.

### 4. Elevation & Depth
Elevation in Emerald Zenith is characterized by "Soft Density."

- **The Layering Principle:** Use `surface` as the base, `surface_container` for the primary card, and `surface_container_low` for internal groupings.
- **Ambient Shadows:** The system uses a specific `shadow-sm` profile: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`. For hero elements, a custom "Editorial Shadow" is used: `0 8px 30px rgb(0,0,0,0.04)`.
- **Glassmorphism:** Navigation and Headers must use a `backdrop-blur-md` with an 80% opacity fill to maintain context of the scroll while providing a clear interactive plane.

### 5. Components
- **Actionable Cards:** Must feature a 4px left-aligned border when used for status-driven content (High/Medium/Low risk).
- **Pill Badges:** High-contrast, low-saturation backgrounds (e.g., `Amber-500/10`) with bolded text for status communication.
- **Hero Buttons:** Full-width, heavy weight (`font-bold`), with a `0.5rem` (8px) radius. Transition speed should be a snappy 200ms.
- **Bottom Navigation:** Icons should utilize the "Fill" state only when active, paired with `10px` bold labels to mirror the architectural metadata elsewhere in the app.

### 6. Do's and Don'ts
- **Do:** Use uppercase letter-spacing for any text smaller than 12px.
- **Do:** Use background color shifts to indicate grouping before resorting to shadows.
- **Don't:** Use primary green for text unless it is a heading or a high-level branding element.
- **Don't:** Mix roundedness. If a card is `1rem`, nested elements should be `0.5rem` or `full`.
- **Don't:** Use traditional "Success" green for primary buttons; use the specific `emerald-custom` (#10B981) to ensure the palette remains vibrant and modern.