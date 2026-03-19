# Worktugal

**Last Updated:** 2026-03-19 (v3.1)

---

## Project Overview

### Purpose

Worktugal is a **compliance risk detection platform** for remote professionals, freelancers, and expats in Portugal. The diagnostic engine identifies hidden compliance traps -- dual tax residency, VAT misclassification, unfiled IRS, permit expiry, Schengen overstay, social security misalignment -- before they become expensive penalties.

### Mission

Surface the compliance mistakes that cost expats thousands before they happen. We sit between the moment someone realizes they might be exposed and the moment they hire professional help.

### Audience

- **Primary**: US remote workers, freelancers, and expats in Portugal with cross-border tax complexity (PFIC, FATCA, FBAR, worldwide taxation)
- **Secondary**: Gulf entrepreneurs, high-net-worth individuals, and D7/D8 visa holders diversifying residency to Portugal — accelerated by ongoing geopolitical instability in the Middle East region
- **Tertiary**: Relocation firms and vetted professionals (tax advisors, immigration lawyers) who need structured risk data before first consultation

---

## Current Product State

### Active Products

| Product | Status | Revenue Model | Description |
| :--- | :--- | :--- | :--- |
| **Compliance Risk Diagnostic** | Live at `/diagnostic` | Lead generation (free) | 13-question diagnostic producing Setup Score, Exposure Index, 4-segment classification, and triggered trap rules |
| **My Account Dashboard** | Live at `/dashboard` | Retention / upsell surface | Signed-in users see compliance history, scores, quick actions, and account settings |
| **Google Sign-In** | Live | Auth / retention | One-click account creation via Google OAuth (Supabase). Also available mid-diagnostic. |

### Deferred Products

| Product | Status | Trigger |
| :--- | :--- | :--- |
| **Portugal Clarity Call (149 EUR)** | Paused — no active CTA | Reactivate once Cal.com integration is re-wired to new UI |
| **Paid Risk Scan (29 EUR)** | Stripe not yet wired | After 5+ clarity calls booked |
| **B2B Engine License** | Month 3+ | After 200 completions + 10 clarity calls |
| **AI-Native Blog / CMS** | Planned | Content flywheel — blog at `/blog` shows coming soon page |

### Legacy Products (Retired/Archived)

| Product | Status | Notes |
| :--- | :--- | :--- |
| Tax Checkup Tool | Retired | 865 completions, zero contact data. Replaced by compliance diagnostic v2. Route `/checkup` redirects to `/diagnostic`. |
| Detailed Compliance Review (49 EUR) | Retired | Zero organic conversions. Route `/compliance-review` redirects to `/diagnostic`. |
| Accountant Application Portal | Hidden (route alive) | Public entry points removed. Form at `/accountants/apply` preserved for month 2 partner recruitment once referral demand is proven. |
| Subscription Marketplace | Deprecated | Original 29 EUR/month membership model |
| Partner Directory | Maintenance only | Searchable catalog of Portuguese service providers |

---

## Diagnostic Engine Architecture

### How it Works

1. User answers 13 questions at `/diagnostic` (12 setup + 1 exposure)
2. Engine calculates **Setup Score** (0-100, structural compliance completeness) and **Exposure Index** (0-100, trap rule accumulation)
3. Engine classifies user into one of 4 segments (high/low setup x high/low exposure)
4. **Email gate** captures contact before results are shown
5. Results page shows dual scores, **all triggered traps with full legal basis, penalty ranges, and source citations** (free, no paywall), and clarity call CTA
6. Make.com webhook fires on every submission (SES emails, Telegram alert, EmailOctopus)

### Trap Rules (Portugal)

6 declarative rules with source citations, evaluated by condition engine:

| Trap | Severity | Conditions |
| :--- | :--- | :--- |
| Dual tax residency | High | Tax resident in PT + not deregistered from previous country |
| VAT misclassification | High | Freelancer/company + income above threshold |
| Unfiled IRS | High | Tax resident + lived 183+ days |
| Social security misalignment | High | Freelancer + not registered NISS |
| Permit expiry risk | Medium | AIMA appointment booked + non-EU visa holder |
| Schengen overstay | Medium | Short-term stay + overstay risk flagged |

### AI Research & Monitoring (Parallel.ai)

The diagnostic engine is powered by **Parallel.ai** for real-time compliance research and automated regulatory monitoring.

- **Real-time Research**: Search official Portuguese government sources before updating trap rules or penalty ranges.
- **Regulatory Monitoring**: 5 active monitors (weekly cadence) watch official sources and fire a webhook to Make.com on any detected change. Make.com routes the alert to Telegram.
- **Local Building & Research**: Use `parallel-cli` for deep research during development.

**5 Active Monitors (weekly, all sources official):**

| Monitor ID | Topic | Rules Covered | Sources |
| :--- | :--- | :--- | :--- |
| `monitor_4b8a99...` | IRS Tax Rates & NHR | `dual_tax_residency`, `unfiled_irs` | portaldasfinancas.gov.pt, dre.pt |
| `monitor_ce6196...` | VAT & Freelancer Classification | `vat_misclassification` | portaldasfinancas.gov.pt, dre.pt |
| `monitor_9ad9a6...` | Social Security & NISS | `social_security_misalignment` | seg-social.pt, dre.pt |
| `monitor_709aab...` | Residence Permits & AIMA | `permit_expiry_risk`, `permit_no_aima` | aima.gov.pt, dre.pt |
| `monitor_6f68a4...` | Schengen & Border Control | `schengen_overstay` | dre.pt, EU sources |

**Pipeline:** Parallel.ai detects change → fires `https://hook.eu2.make.com/5ejuzx6ghj85eqv3u7aksqi5j8nism5d` → Make.com scenario `8891111` → Telegram alert to Van with rule name, source URL, and summary.

**CLI Usage:**
```bash
./bin/parallel-cli/parallel-cli search "Portugal NHR 2026 update"
./bin/parallel-cli/parallel-cli monitor list
```

### Key Files

| File | Purpose |
| :--- | :--- |
| `src/lib/diagnostic/engine.ts` | Scoring engine, trap evaluator, segment classifier |
| `src/lib/diagnostic/questions.ts` | 13 diagnostic questions with weights and skip logic |
| `src/lib/diagnostic/rules/portugal.ts` | 6 Portugal trap rules (declarative config) |
| `src/lib/diagnostic/submit.ts` | Supabase insert + Make.com webhook |
| `src/lib/diagnostic/types.ts` | TypeScript interfaces |
| `src/components/diagnostic/DiagnosticForm.tsx` | Paginated form with email gate |
| `src/components/diagnostic/DiagnosticResults.tsx` | Results page with dual scores, traps, save/share action bar, community CTA |

---

## Monetization Ladder

```
Layer 1 (NOW):     Free Diagnostic --> 149 EUR Clarity Call via Cal.com
Layer 2 (deferred): 29 EUR Paid Risk Scan via Stripe
Layer 3 (Month 3+): B2B Engine License for relocation firms
```

---

## Tech Stack

### Frontend

- **React 18** + **TypeScript 5** + **Vite 6**
- **Tailwind CSS 3** + **Framer Motion** + **Lucide React**
- **Emerald Zenith Design System** (v3.0, active): Light-mode first, Inter font, forest green `#0F3D2E` + emerald `#10B981` palette, `#FAFAF9` light bg / `#0E0E10` dark bg. Full light/dark mode support.
- ~~Obsidian Design System~~ — **retired**. Dark-only, Playfair Display serif. Replaced by Emerald Zenith in v3.0 (2026-03-19).

### Backend & Database

- **Supabase**: PostgreSQL, Auth, Edge Functions
- **Key table**: `compliance_diagnostics` (uuid PK, email, scores, segment, raw_answers jsonb, trap_flags jsonb, UTMs, payment_status, versioning)

### Automation & Distribution

- **Make.com**: Webhook orchestration (SES lead email, SES internal alert, Telegram notification, EmailOctopus)
- **Cal.com**: Clarity call booking + Stripe payment
- **Luma**: Event management (1,253 subscribers)

### AI & Research

- **Claude Code CLI** (Claude Sonnet 4.6): Primary development agent. All coding, architecture, MCP ops, and strategy run here. Cursor agent retired.
- **Parallel.ai**: Regulatory research, data enrichment
- **Perplexity Pro**: Fact-checking, market scans

### Deployment

- **Cloudflare Pages**: Auto-deploy from `main` branch
- **Live URL**: https://app.worktugal.com
- **Dev Environment**: WSL Ubuntu, Node.js 24, pnpm 10

---

## Environment Variables

Required in `.env`:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_MAKE_DIAGNOSTIC_WEBHOOK_URL=
VITE_CLARITY_CALL_URL=
```

---

## Development

```bash
git clone https://github.com/vandevo/worktugal-app.git
cd worktugal-app
pnpm install
pnpm dev
```

- **Production Branch**: `main`
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`

---

## Recent Updates

### 2026-03-19: UX cleanup, blog, changelog — v3.1 (continued)

- **Results page UX**: Removed duplicate ShareCard preview (score data was shown twice). Save + share actions collapsed into one compact action bar below the score hero.
- **Blog**: Replaced broken placeholder posts with honest coming soon page — upcoming titles, Telegram CTA, diagnostic nudge.
- **Changelog split**: Added `is_public` boolean to `project_changelog` table. Public `/changelog` only shows consumer-facing entries in plain language. Internal/technical entries (security, infra, AI indexing) stay in Supabase only.
- **Em dash cleanup**: Removed `—` from all visible sentence copy across FAQ, CTA buttons, blog, and results page. Standard title separator (`Page — Site`) kept.

### 2026-03-19: Emerald Zenith — v3.0 → v3.1

- **Emerald Zenith Design System launched**: Full light/dark mode rebuild. `#0F3D2E` forest green + `#10B981` emerald palette. Inter font replaces Playfair Display. Obsidian dark-only theme retired.
- **My Account dashboard**: Personal compliance hub for all signed-in users. Shows latest score, diagnostic history, account settings, quick actions, official resource links.
- **Google Sign-In**: Available at sign-in, mid-diagnostic (contact step), and on results page for unauthenticated users.
- **Diagnostic sessionStorage**: Answers, step, and page persisted to sessionStorage so OAuth redirect doesn't lose progress.
- **Inline profile editing**: Display name editable directly in My Account. ProfileModal removed.
- **Footer, legal pages, FAQ, cookie banner**: All rebuilt in Emerald Zenith. Forest green footer, clean prose Privacy Policy and Terms, accordion FAQ, compact bottom-right cookie card.
- **ComplianceDisclaimer**: New reusable component with inline / banner / footer variants.
- **My Account nav link**: Available to all authenticated users (not admin-only).

### 2026-03-13: Security + share card — v2.8

- **Security headers**: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy added via Cloudflare Pages `_headers`.
- **RLS hardening**: Supabase Row Level Security tightened on `compliance_diagnostics` with email regex and score bounds.
- **Shareable result card**: Download branded PNG or copy pre-formatted text for Reddit, LinkedIn, Telegram. Built with html2canvas.
- **llms.txt**: Added for AI search engine indexing (Perplexity, ChatGPT, Gemini).

### 2026-03-10: Trust-First Results + Homepage Rebuild + UX Fixes -- v2.6

- **Paywall removed (trust-first)**: All diagnostic results now shown for free — full trap breakdown, legal basis (CIRS/CIVA articles), penalty ranges, and official source citations. Nothing locked. Clarity call repositioned as a personalized action plan, not a content unlock.
- **Homepage rebuilt (mobile-first)**: Fake search bar removed. Subheadline broadened to remote workers, freelancers, and expats. Primary CTA updated to `"Check My Risk — Free (3 min)"`. Trust signals simplified to inline text spans (no credit card, legal citations, 865 completions count).
- **Features section**: Section title changed to `"The risks that cost people the most"`. Penalty amounts lead each card (e.g. "Up to €3,750"). Language broadened beyond freelancers.
- **Testimonials → Stats bar**: Section replaced with four concrete metrics: 865 diagnostics completed, 6 compliance traps checked, €3,750 max penalty caught, 3 min avg completion.
- **FAQ tightened**: Reduced from 11 to 6 questions. "Is the diagnostic really free?" answer updated to explicitly state nothing is locked.
- **ModernPartners section removed** from homepage composer.
- **DiagnosticForm UX**: Switched from 4 questions per page to 1 question per page (reduced cognitive load on mobile). Question label restyled as `<h3>` serif heading. Email gate copy updated to reflect full free results.
- **Partner form hidden**: "For Accountants" footer link removed. `AccountantRecruitmentBanner` removed from AccountingDeskLanding. Route and component preserved for month 2.
- **Plan management**: Completed plans moved to `.cursor/plans/completed/`. `phase_2.5_launch_readiness` archived.

### 2026-03-08: Strategic Pivot + Clarity Call Integration -- v2.5

- **Monetization resequenced**: Clarity call (149 EUR) is now Layer 1 revenue. Stripe 29 EUR deferred.
- **Dead trap rule fixed**: Added `foreign_tax_deregistration` question (Q13) so `dual_tax_residency` trap can fire.
- **Results page rebuilt**: Replaced disabled 29 EUR "Coming Soon" button with live 149 EUR clarity call CTA linking to Cal.com. Sticky bottom bar updated.
- **Plans updated**: Both active plans revised to reflect resequenced monetization, distribution strategy (Luma, Reddit, monthly IRL events), and deferred items.

### 2026-03-06: Make.com Automation Rewire -- v2.4

- **Webhook pipeline rewired**: Fire-and-forget POST from `submitDiagnostic()` with 20-field v2 payload.
- **Make.com scenario updated**: Renamed to v3.0, Airtable route deleted, all 4 modules (SES lead, SES internal, Telegram, EmailOctopus) updated with v2 fields and 29 EUR CTA copy.
- **Cloudflare env var**: `VITE_MAKE_DIAGNOSTIC_WEBHOOK_URL` added to Pages production.

### 2026-03-05: Diagnostic Engine v2 -- v2.0-v2.3

- **Engine built**: Dual scoring (Setup Score + Exposure Index), 4-segment classification, trap rule evaluator.
- **6 Portugal trap rules**: Declarative config with source citations, legal basis, penalty ranges.
- **UI shipped**: DiagnosticForm (paginated, email gate, contact fields), DiagnosticResults (dual scores, trap cards).
- **Homepage repositioned**: Risk-detection narrative. 49 EUR product archived. Routes consolidated to `/diagnostic`.
- **Supabase schema**: `compliance_diagnostics` table live in production.
- **Governance layer**: `.cursor/rules/` auto-loading for multi-model consistency.

---

## Strategic Context

### The Problem

Expats in Portugal assume they're compliant but rarely verify until something breaks. The biggest financial traps are sequencing mistakes (open bank account, choose visa, trigger tax residency, choose investment structure -- wrong order costs tens of thousands). Immigration lawyers, tax advisors, and wealth managers operate in silos. Nobody connects the full compliance picture.

### Our Position

Worktugal owns the **discovery moment** -- the instant someone realizes they might be exposed. The diagnostic engine surfaces risks. The clarity call explains them. The referral connects them to the right professional. Whoever owns the discovery moment controls the market.

### Distribution Strategy

| Channel | Reach | Purpose |
| :--- | :--- | :--- |
| Luma community | 1,253 subscribers | Announce diagnostic, monthly events |
| Monthly IRL event | 30-50 attendees | Trust building, live diagnostic demos |
| Reddit | r/PortugalExpats, r/digitalnomad, r/USExpatTaxes | Target US expats with compliance trap content |
| Make.com automation | Per-submission | Telegram alerts, email follow-up for high-risk profiles |
| Gulf corridor (emerging) | Middle East expats fleeing instability | Geopolitical tailwind — wealthy individuals relocating from UAE, Qatar, Saudi Arabia seeking EU residency, wealth preservation, and banking access |

### Partner Network (Month 2)

The professional referral layer (immigration lawyers, tax advisors, relocation specialists) is **deferred until clarity call volume is proven**. The `/accountants/apply` route is kept alive but unpromoted. Once 3+ clarity call clients need a referral, direct outreach to 2-3 Lisbon-based professionals begins — broadened beyond accountants to include lawyers and relocation specialists.

---

## Contact

- **App URL**: https://app.worktugal.com
- **GitHub**: https://github.com/vandevo/worktugal-app
- **Clarity Call**: https://cal.com/worktugal/clarity-call
- **Community**: https://t.me/worktugal

---

**End of README**
