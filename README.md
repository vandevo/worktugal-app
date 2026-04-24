# Worktugal

**Last Updated:** 2026-04-23 (v3.4)

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
| **Compliance Risk Diagnostic** | Live at `/diagnostic` | Lead generation (free) → Paid upgrade planned (€29) | 13-question diagnostic producing Setup Score, Exposure Index, 4-segment classification, and triggered trap rules. 915+ total completions (865 legacy v1 + 50 v2). |
| **My Account Dashboard** | Live at `/dashboard` | Retention / upsell surface | Signed-in users see compliance history, scores, quick actions, and account settings |
| **Google Sign-In** | Live | Auth / retention | One-click account creation via Google OAuth (Supabase). Also available mid-diagnostic. |

### Deferred Products

| Product | Status | Trigger |
|---|---|---|
| **Paid Diagnostic Upgrade (€29)** | Priority — Stripe payment flow needed | First revenue move. Email list of ~15k. |
| **Portugal Clarity Call (149 EUR)** | Paused — no active CTA | Reactivate once Cal.com integration is re-wired to new UI |
| **B2B Engine License** | Month 3+ | After 200 completions + 10 clarity calls |
| **AI-Native Blog / CMS** | Live | Ghost self-hosted at blog.worktugal.com. Admin API wired. |

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
6. Supabase insert → edge functions fire Resend (transactional email) + n8n (automation bus). Make.com scenarios still active for legacy flows — gradual migration in progress.

### Trap Rules (Portugal)

7 declarative rules with source citations, evaluated by condition engine (6 Portugal + 1 CRUE for EU citizens):

| Trap | Severity | Conditions |
| :--- | :--- | :--- |
| Dual tax residency | High | Tax resident in PT + not deregistered from previous country |
| VAT misclassification | High | Freelancer/company + income above threshold |
| Unfiled IRS | High | Tax resident + lived 183+ days |
| Social security misalignment | High | Freelancer + not registered NISS |
| Permit expiry risk | Medium | AIMA appointment booked + non-EU visa holder |
| Schengen overstay | Medium | Short-term stay + overstay risk flagged |
| EU CRUE registration gap | Medium | EU citizen + registered in Portugal + missing CRUE certificate |

### AI Research & Monitoring (Parallel.ai)

The diagnostic engine is powered by **Parallel.ai** for real-time compliance research and automated regulatory monitoring.

- **Real-time Research**: Search official Portuguese government sources before updating trap rules or penalty ranges.
- **Regulatory Monitoring**: 5 active monitors (weekly cadence) watch official sources. Alerts now route through n8n (self-hosted at n8n.worktugal.com). Legacy Make.com scenario still active — migration in progress.
- **Local Building & Research**: Use `parallel-cli` for deep research during development.

**5 Active Monitors (weekly, all sources official):**

| Monitor ID | Topic | Rules Covered | Sources |
|---|---|---|---|
| `monitor_4b8a99...` | IRS Tax Rates & NHR | `dual_tax_residency`, `unfiled_irs` | portaldasfinancas.gov.pt, dre.pt |
| `monitor_ce6196...` | VAT & Freelancer Classification | `vat_misclassification` | portaldasfinancas.gov.pt, dre.pt |
| `monitor_9ad9a6...` | Social Security & NISS | `social_security_misalignment` | seg-social.pt, dre.pt |
| `monitor_709aab...` | Residence Permits & AIMA | `permit_expiry_risk`, `permit_no_aima` | aima.gov.pt, dre.pt |
| `monitor_6f68a4...` | Schengen & Border Control | `schengen_overstay` | dre.pt, EU sources |

**Pipeline:** Parallel.ai detects change → fires webhook → n8n workflow → Telegram alert to Van with rule name, source URL, and summary.

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
| `src/lib/diagnostic/submit.ts` | Supabase insert + edge functions (Resend + n8n) |
| `src/lib/diagnostic/types.ts` | TypeScript interfaces |
| `src/components/diagnostic/DiagnosticForm.tsx` | Paginated form with email gate |
| `src/components/diagnostic/DiagnosticResults.tsx` | Results page with dual scores, traps, save/share action bar, community CTA |

---

## Monetization Ladder

```
Layer 1 (NOW):       Free Diagnostic → Paid upgrade (€29) via Stripe
Layer 2 (deferred):  B2B Compliance Intelligence (€499-999/mo) for relocation firms
Layer 3 (Month 3+):  Consumer Pro (€199-299/yr) — advanced tools, alerts, community
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

- **n8n**: Self-hosted at n8n.worktugal.com (Docker on van-cloud). Primary automation bus. MCP-enabled — workflows callable as native tools by AI agents.
- **Make.com**: Legacy scenarios still active — gradual migration to n8n in progress.
- **Resend**: Transactional email (welcome flows, diagnostic results, password reset). worktugal.com + oyala.app verified. Pro plan.
- **Listmonk**: Campaign email at mail.worktugal.com (Docker on van-cloud). 3 lists: main (~15k), diagnostic users, blog subscribers. SES SMTP backend.
- **Amazon SES**: SMTP delivery for Listmonk high-volume campaigns.
- **Ghost CMS**: Blog at blog.worktugal.com (Docker on van-cloud). Admin API wired. Emerald Zenith CSS injected.
- **Cal.com**: Clarity call booking + Stripe payment (paused, not wired to UI).

### AI & Development

- **Claude Code CLI** (Claude Sonnet 4.6): Primary development agent. All coding, architecture, MCP ops, and strategy.
- **Qwen3.6 Plus** (via OpenCode): All-rounder agent — 80% of day-to-day coding, writing, strategy. 9 MCPs (Cloudflare, Supabase, GitHub, n8n, Parallel, Context7, Gemini Tools, GCP Secrets).
- **MiniMax M2.5**: Ultra-cheap coding overflow ($0.118/M tokens).
- **DeepSeek V3.2**: Reasoning-heavy tasks, second opinions.
- **Gemini 3.1 Pro/Flash**: Long-form content, image generation, free-tier tasks.
- **Parallel.ai**: Regulatory research, data enrichment, 5 active compliance monitors.
- **Context7**: Live library docs for any framework/API — eliminates config hallucination.

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
RESEND_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
GHOST_ADMIN_API_KEY=
GHOST_ADMIN_API_URL=
```

Edge functions also require: `RESEND_WEBHOOK_SECRET`, `WORKTUGAL_BOT_TOKEN` (for Telegram channel posting).

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

### 2026-04-23: Stack audit + README sync — v3.4

- **README updated**: Reflects current stack (n8n, Resend, Listmonk, Ghost), correct completion counts (915+ total), updated monetization priorities.
- **Diagnostic count corrected**: 50 v2 completions in Supabase + 865 legacy v1 = 915+ total.
- **Business opportunities mapped**: 5 opportunities logged, paid diagnostic (€29) identified as fastest revenue path.

### 2026-03-28: Content pipeline + distribution automation — v3.2

- **Ghost blog live**: Self-hosted at blog.worktugal.com. Admin API wired for programmatic publishing.
- **Telegram channel posting**: `post-to-channel` edge function deployed. Auto-posts changelog entries to @worktugal public channel.
- **Changelog Telegram trigger**: Postgres trigger auto-fires Telegram post on new changelog with `post_to_telegram=true`.
- **Article pipeline**: `/new-article` command + `gemini-draft.mjs` + `parallel-research.mjs` + `telegram-post.mjs` for end-to-end content workflow.
- **Pre-publish check**: `pre-publish-check.mjs` blocks em dashes, AI openers, banned words before Ghost publish.
- **Reddit OS corrected**: Links in body allowed on r/PortugalExpats. Markdown hyperlink format enforced.
- **r/RemotePortugal**: 120 organic members identified as owned distribution channel.
- **AWS SES credential rotation**: Compromised key replaced. New `ses-smtp-listmonk` IAM user created.

### 2026-03-27: Indexing + B2B strategy + CRUE — v3.0

- **Cloudflare Crawler Hints**: IndexNow enabled — automatic search indexing on every publish.
- **Google Search Console**: Sitemaps submitted for blog.worktugal.com + worktugal.com.
- **B2B referral monetisation**: Expert referral CTA on diagnostic results, white-label diagnostic for relocation firms.
- **CRUE question added**: EU citizens now asked about CRUE registration. `eu_crue_missing` trap fixed.
- **Landing page accuracy**: Lead count 900+, question count 14, badge updated to "NO CREDIT CARD".

### 2026-03-25: Email stack migration + welcome flow — v2.9

- **Make.com retired from transactional email**: Resend is now the single transactional layer (worktugal.com + oyala.app verified, Pro plan).
- **Listmonk replaces EmailOctopus**: Self-hosted at mail.worktugal.com. List 4 (Diagnostic Users) captures every completer with rich attributes. List 5 (Blog Subscribers) created via Ghost webhook.
- **Welcome flow updated**: New signups trigger Resend email + Telegram ping + Listmonk subscription with source/provider/date attribs.
- **Ghost member webhook**: Ghost member.added → Listmonk list 5 (Blog Subscribers).
- **Changelog split**: `is_public` flag in `project_changelog` table. Public `/changelog` shows consumer-facing entries only.
- **Mobile nav fixed**: Hamburger button unhidden. Mobile users can now reach Blog, Changelog, Community.

### 2026-03-24: Telegram ops + dashboard — v2.8

- **Two-bot Telegram architecture**: @WorktugalPassBot (ops alerts to Van) + @worktugal_bot (public @worktugal channel posts).
- **ClientDashboard**: Compliance Guides card added (blog.worktugal.com). First-time redirect (0 diagnostics → /diagnostic).
- **ModernHomePage**: Badge updated to NO SIGNUP REQUIRED, account benefits hint added.

### 2026-03-23: Email observability — v2.4

- **Resend webhook deployed**: Svix signature verification, `resend_email_events` table logs all 6 event types.
- **Telegram bounce alerts**: email.bounced + email.complained fire Telegram alerts automatically.
- **Email OS documented**: Three-file structure (email-os / resend-email-system / email-engine).

### 2026-03-22: Prompt vault + MCPs — v2.2

- **Prompt vault rewritten**: Claude Code-native OS (v4.0). 19 routes in core-router.
- **GitHub MCP connected**: Classic PAT with repo scope.
- **Context7 MCP connected**: Live library docs for any framework/API.
- **RESEND_API_KEY added**: Was missing from Supabase secrets, causing silent email skips.

### 2026-03-21: Email infrastructure — v2.1

- **Make.com retired from transactional email**: Resend is now the single transactional layer.
- **Listmonk live**: Self-hosted at mail.worktugal.com. Diagnostic Users list captures every completer.
- **5 edge functions migrated**: All email flows now use Resend directly.

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
- **Homepage rebuilt (mobile-first)**: Fake search bar removed. Subheadline broadened to remote workers, freelancers, and expats. Primary CTA updated to `"Check My Risk — Free (3 min)"`. Trust signals simplified to inline text spans (no credit card, legal citations, 915+ completions count).
- **Features section**: Section title changed to `"The risks that cost people the most"`. Penalty amounts lead each card (e.g. "Up to €3,750"). Language broadened beyond freelancers.
- **Testimonials → Stats bar**: Section replaced with four concrete metrics: 915+ diagnostics completed, 7 compliance traps checked, €3,750 max penalty caught, 3 min avg completion.
- **FAQ tightened**: Reduced from 11 to 6 questions. "Is the diagnostic really free?" answer updated to explicitly state nothing is locked.
- **ModernPartners section removed** from homepage composer.
- **DiagnosticForm UX**: Switched from 4 questions per page to 1 question per page (reduced cognitive load on mobile). Question label restyled as `<h3>` serif heading. Email gate copy updated to reflect full free results.
- **Partner form hidden**: "For Accountants" footer link removed. `AccountantRecruitmentBanner` removed from AccountingDeskLanding. Route and component preserved for month 2.
- **Plan management**: Completed plans moved to `.cursor/plans/completed/`. `phase_2.5_launch_readiness` archived.

### 2026-03-08: Strategic Pivot + Clarity Call Integration -- v2.5

- **Monetization resequenced**: Paid diagnostic (€29) is now Layer 1 revenue. Clarity call (149 EUR) deferred.
- **Dead trap rule fixed**: Added `foreign_tax_deregistration` question (Q13) so `dual_tax_residency` trap can fire.
- **Results page rebuilt**: Replaced disabled 29 EUR "Coming Soon" button with live 149 EUR clarity call CTA linking to Cal.com. Sticky bottom bar updated.
- **Plans updated**: Both active plans revised to reflect resequenced monetization, distribution strategy (Luma, Reddit, monthly IRL events), and deferred items.

### 2026-03-06: Make.com Automation Rewire -- v2.4

- **Webhook pipeline rewired**: Fire-and-forget POST from `submitDiagnostic()` with 20-field v2 payload.
- **Make.com scenario updated**: Renamed to v3.0, Airtable route deleted, all 4 modules (SES lead, SES internal, Telegram, EmailOctopus) updated with v2 fields and 29 EUR CTA copy.
- **Cloudflare env var**: `VITE_MAKE_DIAGNOSTIC_WEBHOOK_URL` added to Pages production.
- **Note**: Make.com scenarios still active but being gradually migrated to n8n (self-hosted at n8n.worktugal.com).

### 2026-03-05: Diagnostic Engine v2 -- v2.0-v2.3

- **Engine built**: Dual scoring (Setup Score + Exposure Index), 4-segment classification, trap rule evaluator.
- **6 Portugal trap rules** (+ 1 CRUE rule for EU citizens): Declarative config with source citations, legal basis, penalty ranges.
- **UI shipped**: DiagnosticForm (paginated, email gate, contact fields), DiagnosticResults (dual scores, trap cards).
- **Homepage repositioned**: Risk-detection narrative. 49 EUR product archived. Routes consolidated to `/diagnostic`.
- **Supabase schema**: `compliance_diagnostics` table live in production.
- **Governance layer**: `.cursor/rules/` auto-loading for multi-model consistency.

---

## Strategic Context

### The Problem

Expats in Portugal assume they're compliant but rarely verify until something breaks. The biggest financial traps are sequencing mistakes (open bank account, choose visa, trigger tax residency, choose investment structure -- wrong order costs tens of thousands). Immigration lawyers, tax advisors, and wealth managers operate in silos. Nobody connects the full compliance picture.

### Our Position

Worktugal owns the **discovery moment** -- the instant someone realizes they might be exposed. The diagnostic engine surfaces risks. The platform compounds with every completion, every article, every alert subscriber. Whoever owns the discovery moment controls the market.

### Why Now

- Nationality law changed April 1, 2026 -- event journalism window open
- 60% of small publishers losing search traffic to AI -- build direct relationships
- 15k email list + 19.7k Facebook + diagnostic data = moat no competitor has
- AI answer engines need authoritative sources -- Worktugal positioned to be cited

### Distribution Strategy

| Channel | Reach | Purpose |
|---|---|---|
| Email (Listmonk) | ~15k contacts | Campaign sends, re-engagement, paid diagnostic launch |
| Email (Ghost) | Blog subscribers | Editorial newsletter, event-driven updates |
| Facebook | 19.7k members | Community trust, organic reach |
| Reddit | r/PortugalExpats, r/digitalnomad, r/RemotePortugal | Article distribution, diagnostic CTA in comments |
| Telegram | @worktugal channel | Instant alerts, changelog posts, real-time trust |
| LinkedIn | Van's personal brand | Founder authority, B2B reach, data posts |
| n8n automation | Per-event | Welcome flows, email observability, Telegram alerts |
| Gulf corridor (emerging) | Middle East expats | Geopolitical tailwind — EU residency seekers |

### Partner Network (Month 2+)

The professional referral layer (immigration lawyers, tax advisors, relocation specialists) is **deferred until diagnostic volume and paid conversions are proven**. The `/accountants/apply` route is kept alive but unpromoted. Once 3+ clients need a referral, direct outreach to 2-3 Lisbon-based professionals begins — broadened beyond accountants to include lawyers and relocation specialists.

**B2B target**: Relocation firms and HR teams managing mobile workforces. Compliance intelligence product (€499-999/mo) built on n8n automation + AI synthesis + proprietary diagnostic data.

---

## Contact

- **App URL**: https://app.worktugal.com
- **Blog**: https://blog.worktugal.com
- **GitHub**: https://github.com/vandevo/worktugal-app
- **Community**: https://t.me/worktugal

---

**End of README**
