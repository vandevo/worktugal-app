# Worktugal

**Last Updated:** 2026-03-08 (v2.5)

---

## Project Overview

### Purpose

Worktugal is a **compliance risk detection platform** for remote professionals, freelancers, and expats in Portugal. The diagnostic engine identifies hidden compliance traps -- dual tax residency, VAT misclassification, unfiled IRS, permit expiry, Schengen overstay, social security misalignment -- before they become expensive penalties.

### Mission

Surface the compliance mistakes that cost expats thousands before they happen. We sit between the moment someone realizes they might be exposed and the moment they hire professional help.

### Audience

- **Primary**: US remote workers, freelancers, and expats in Portugal with cross-border tax complexity (PFIC, FATCA, FBAR, worldwide taxation)
- **Secondary**: Gulf entrepreneurs and D7/D8 visa holders diversifying residency to Portugal
- **Tertiary**: Relocation firms and accountants who need structured risk data before first consultation

---

## Current Product State

### Active Products

| Product | Status | Revenue Model | Description |
| :--- | :--- | :--- | :--- |
| **Compliance Risk Diagnostic** | Live at `/diagnostic` | Lead generation (free) | 13-question diagnostic producing Setup Score, Exposure Index, 4-segment classification, and triggered trap rules |
| **Portugal Clarity Call** | Live via Cal.com | 149 EUR one-time | 30-minute video call reviewing diagnostic results with prioritized action plan |

### Deferred Products

| Product | Status | Trigger |
| :--- | :--- | :--- |
| **Paid Risk Scan (29 EUR)** | Stripe not yet wired | After 5+ clarity calls booked |
| **B2B Engine License** | Month 3+ | After 200 completions + 10 clarity calls |

### Legacy Products (Retired/Archived)

| Product | Status | Notes |
| :--- | :--- | :--- |
| Tax Checkup Tool | Retired | 865 completions, zero contact data. Replaced by compliance diagnostic v2. Route `/checkup` redirects to `/diagnostic`. |
| Detailed Compliance Review (49 EUR) | Retired | Zero organic conversions. Route `/compliance-review` redirects to `/diagnostic`. |
| Accountant Application Portal | Archived | 7 applications, no active partners |
| Subscription Marketplace | Deprecated | Original 29 EUR/month membership model |
| Partner Directory | Maintenance only | Searchable catalog of Portuguese service providers |

---

## Diagnostic Engine Architecture

### How it Works

1. User answers 13 questions at `/diagnostic` (12 setup + 1 exposure)
2. Engine calculates **Setup Score** (0-100, structural compliance completeness) and **Exposure Index** (0-100, trap rule accumulation)
3. Engine classifies user into one of 4 segments (high/low setup x high/low exposure)
4. **Email gate** captures contact before results are shown
5. Results page shows dual scores, top triggered traps (free tier: 2 visible, rest locked), and clarity call CTA
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

### Key Files

| File | Purpose |
| :--- | :--- |
| `src/lib/diagnostic/engine.ts` | Scoring engine, trap evaluator, segment classifier |
| `src/lib/diagnostic/questions.ts` | 13 diagnostic questions with weights and skip logic |
| `src/lib/diagnostic/rules/portugal.ts` | 6 Portugal trap rules (declarative config) |
| `src/lib/diagnostic/submit.ts` | Supabase insert + Make.com webhook |
| `src/lib/diagnostic/types.ts` | TypeScript interfaces |
| `src/components/diagnostic/DiagnosticForm.tsx` | Paginated form with email gate |
| `src/components/diagnostic/DiagnosticResults.tsx` | Results page with dual scores, traps, clarity call CTA |

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

- **React 18** + **TypeScript 5** + **Vite 5**
- **Tailwind CSS 3** + **Framer Motion** + **Lucide React**
- **Obsidian Design System**: Dark theme, serif typography, minimalist UI

### Backend & Database

- **Supabase**: PostgreSQL, Auth, Edge Functions
- **Key table**: `compliance_diagnostics` (uuid PK, email, scores, segment, raw_answers jsonb, trap_flags jsonb, UTMs, payment_status, versioning)

### Automation & Distribution

- **Make.com**: Webhook orchestration (SES lead email, SES internal alert, Telegram notification, EmailOctopus)
- **Cal.com**: Clarity call booking + Stripe payment
- **Luma**: Event management (1,253 subscribers)

### AI & Research

- **Claude Opus 4.6** (Cursor): Primary development model
- **Parallel.ai**: Regulatory research, data enrichment
- **Perplexity Pro**: Fact-checking, market scans

### Deployment

- **Cloudflare Pages**: Auto-deploy from `main` branch
- **Live URL**: https://app.worktugal.com
- **Dev Environment**: WSL Ubuntu, Node.js 20+

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
npm install
npm run dev
```

- **Production Branch**: `main`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## Recent Updates

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
- **UI shipped**: DiagnosticForm (paginated, email gate, contact fields), DiagnosticResults (dual scores, trap cards, locked traps teaser).
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

---

## Contact

- **App URL**: https://app.worktugal.com
- **GitHub**: https://github.com/vandevo/worktugal-app
- **Clarity Call**: https://cal.com/worktugal/clarity-call
- **Community**: https://t.me/worktugal

---

**End of README**
