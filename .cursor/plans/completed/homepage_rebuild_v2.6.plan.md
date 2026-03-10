---
name: Homepage Rebuild v2.6
overview: "Rebuild the homepage for mobile-first doom-scroller UX: remove the fake search bar, collapse from 6 sections to 5, replace testimonials with a live stats bar, rewrite all copy to lead with penalty numbers, fix the stale 29 EUR FAQ answer, and tighten every section to be readable in under 5 seconds on a phone."
todos:
  - id: hero-simplify
    content: "ModernHero.tsx: remove fake search bar and isFocused state. Keep badges, headline, subline. Update CTA button text. Add 3 inline trust signals below CTA."
    status: completed
  - id: features-rewrite
    content: "ModernFeatures.tsx: rename section title, rewrite 4 cards to lead with penalty number first. Remove legal article citations from card body."
    status: completed
  - id: testimonials-stats
    content: "ModernTestimonials.tsx: full replacement with 4-stat horizontal bar (865 diagnostics, 6 traps, 3,750 EUR max exposure, 3 min). Add section heading."
    status: completed
  - id: faq-cut
    content: "CheckupFAQ.tsx: cut from 11 to 6 questions. Fix stale 29 EUR answer in question 1 to reflect full free results."
    status: completed
  - id: homepage-remove-partners
    content: "ModernHomePage.tsx: remove ModernPartners import and JSX. Keep section order: Hero, Features, ComplianceCTA, Testimonials/Stats, FAQ."
    status: completed
  - id: push-deploy
    content: git push origin main to deploy both v2.6 changes and homepage rebuild to Cloudflare Pages production.
    status: in_progress
isProject: false
---

# Homepage Rebuild v2.6: Mobile-First, Trust-First

## Files changing

- `[src/components/accounting/ModernHero.tsx](src/components/accounting/ModernHero.tsx)` -- remove fake search bar, simplify to headline + subline + single CTA + trust signals
- `[src/components/accounting/ModernFeatures.tsx](src/components/accounting/ModernFeatures.tsx)` -- lead each card with the penalty number, broaden "freelancers" to "remote workers, freelancers, and expats"
- `[src/components/accounting/ModernTestimonials.tsx](src/components/accounting/ModernTestimonials.tsx)` -- full replacement with a stats bar component
- `[src/components/accounting/CheckupFAQ.tsx](src/components/accounting/CheckupFAQ.tsx)` -- cut to 6 questions, fix stale 29 EUR answer, update to reflect full free results
- `[src/components/ModernHomePage.tsx](src/components/ModernHomePage.tsx)` -- remove ModernPartners import and usage

## Section-by-section changes

### 1. ModernHero.tsx -- simplify to pure CTA

Remove:

- The fake search bar (the `div` with "Find my hidden compliance risks...", paperclip, mic, and arrow button -- lines 76-131)
- The `isFocused` state and `handleSearchClick` (no longer needed)
- The `useState` import (if no other usage)

Keep exactly:

- The two badge lines ("Updated for 2026 Regulations" + verified date)
- The headline: "You might look compliant. But are you exposed?"
- The subline: "Discover hidden compliance risks that cost remote workers and freelancers 150 to 3,750 EUR in penalties. Free diagnostic in 3 minutes."
- The single CTA button: "Check My Risk Free (3 min)"

Add below the CTA button -- three inline trust signals as simple text, no cards:

- "No credit card. No signup." / "Legal citations included." / "865 diagnostics completed."

Result: the entire hero fits on one phone screen. One button. One job.

### 2. ModernFeatures.tsx -- lead with the number

Rename section title from "Hidden Risks Most Freelancers Miss" to "The risks that cost people the most."

Change each card to lead with a large penalty number, then the trap name, then one line of plain-language explanation. Remove the legal article citations from the card body -- they belong in the results page, not the landing page.

New card structure:

- **Up to €3,750** -- Unfiled IRS returns. If you lived in Portugal over 183 days and never filed Modelo 3, this is your exposure.
- **Backdated VAT** -- VAT misclassification. Crossed the income threshold and never registered for IVA? Penalties apply retroactively.
- **Double taxation** -- Dual tax residency. Deregistered from your home country? If not, you may owe taxes in two countries simultaneously.
- **Arrears + suspended benefits** -- Social security gaps. Freelancers must pay NISS contributions monthly. Missing payments compound.

Keep the "Every risk is source-cited" info banner at the bottom.

### 3. ModernTestimonials.tsx -- replace with stats bar

Full rewrite. The testimonials section becomes a single horizontal stats bar with 3-4 numbers. Mobile: stacked. Desktop: horizontal row.

Stats to display:

- `865` -- Diagnostics completed
- `6` -- Compliance traps checked
- `€3,750` -- Max penalty exposure caught
- `3 min` -- Average completion time

Layout: dark card, no borders on individual stats, clean separator lines between them. No quotes, no avatars, no names.

Section heading above the bar: "Built on real data, verified against official sources."

### 4. CheckupFAQ.tsx -- cut and fix

Cut from 11 to 6 questions. Keep only:

1. "Is the diagnostic really free?" -- Fix the answer: remove the "29 EUR paid upgrade" sentence, replace with "All results, including legal citations and penalty ranges, are shown for free."
2. "How does the scoring work?" -- keep as is
3. "What are compliance traps?" -- keep as is
4. "What happens to my data?" -- keep as is
5. "What if my situation is complicated?" -- keep as is
6. "Will I be spammed with emails?" -- keep as is

Remove: NIF question, quarterly VAT return question, first-year tax reduction question, accountant question, retake question. These are product-level FAQs that belong on the diagnostic or results page, not the landing page.

### 5. ModernHomePage.tsx -- remove Partners

Remove the `ModernPartners` import and its JSX usage. Section order becomes:

```
ModernHero
ModernFeatures
ModernComplianceReviewCTA
ModernTestimonials (now: stats bar)
CheckupFAQ
```

## Copy decisions

- "freelancers" broadened to "remote workers, freelancers, and expats" throughout
- Penalty numbers lead every risk card (number first, name second)
- CTA button text: "Check My Risk Free (3 min)" -- more personal than "Start Free Diagnostic"
- No legal article references on the landing page -- those are for the results page
- The badges (Updated for 2026 / Verified against official sources) stay exactly as they are

## What is NOT changing

- The `ModernComplianceReviewCTA` ("How it works") section -- it is clean and works
- The badge + verified date logic in ModernHero
- The headline and subline copy in ModernHero
- All animations and Tailwind styling patterns -- no design system changes
- The `ModernPartners` component file -- only removed from the page composer, not deleted

