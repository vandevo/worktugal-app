# Worktugal

**Last Updated:** 2026-02-14 (v1.3.4)

---

## Project Overview

### Purpose

Worktugal is a **compliance readiness layer** for foreign freelancers and remote professionals in Portugal. The platform identifies compliance gaps before they become expensive problems and prepares users for professional engagement.

### Mission

Stop unverified decisions from entering systems that punish mistakes later. We exist upstream of accountants, lawyers, and tax software, ensuring people are **ready to proceed** before professional engagement begins.

### Identity

Worktugal is a **Gatekeeper**, not a marketplace. We do not explain endlessly. We do not do the work ourselves. We decide when work is allowed to start.

Internal doctrine: *"If it does not enforce readiness or transfer responsibility cleanly, we do not build it."*

### Audience

- **Primary**: Foreign freelancers and remote workers in Portugal with compliance anxiety
- **Secondary**: Accountants serving international clients who need standardized intake
- **Tertiary**: Expats relocating to Portugal facing bureaucratic complexity

---

## Current Product State

### Active Products

| Product | Status | Revenue Model | Description |
|---------|--------|---------------|-------------|
| **Tax Checkup Tool** | Live | Lead generation (free) | 5-step diagnostic quiz producing compliance score (red/yellow/green flags) |
| **Detailed Compliance Review** | Live | €49 one-time | AI-assisted research + human-verified compliance readiness report |
| **Accountant Application Portal** | Live | Partnership funnel | Intake system for accountant partners |

### Planned Products

| Product | Status | Revenue Model | Description |
|---------|--------|---------------|-------------|
| **ReadyFile v1** | Research complete | €39-149 per file | Timestamped readiness verification artifact that professionals accept |

### Legacy Products (Not in Active Development)

| Product | Status | Notes |
|---------|--------|-------|
| Partner Directory | Maintenance only | Searchable catalog of Portuguese service providers |
| Perks System | Maintenance only | Members-only discounts from partner businesses |
| Subscription Marketplace | Deprecated | Original €29/month membership model |
| Accounting Desk Consultation | On hold | Cal.com booking integration, waiting for accountant partner |

---

## Current Metrics (as of 2026-02-14)

| Metric | Count | Notes |
|--------|-------|-------|
| **Tax Checkup Leads** | 130 | Unique, deduplicated by email |
| **High Risk Leads** (red >= 2) | 32 | Based on 24% avg pattern |
| **Interested in Accounting** | 50 | Based on 38% avg pattern |
| **HOT Leads** (high risk + interested) | 12 | Critical outreach targets |
| **Email Marketing Consent** | 70 | Active marketing pool |
| **Accountant Applications** | 7 | Pending review |
| **Paid Compliance Reviews** | 8 | 4 test + 1 validation + 3 recent conversions |
| **Revenue from Customers** | €147 | Estimated from 3 new €49 reviews |

---

## Tech Stack

### Frontend
- **React 18.3.1**: UI library with hooks and functional components
- **TypeScript 5.5.3**: Type-safe JavaScript superset
- **Vite 5.4.2**: Build tool and dev server
- **React Router DOM 7.7.0**: Client-side routing
- **React Hook Form 7.60.0**: Form state management
- **Zod 4.0.5**: Runtime type validation

### Styling & UI/UX
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **Framer Motion 12.23.6**: Animation library
- **Lucide React 0.562.0**: Icon library
- **Obsidian Design System v1.3**: Authoritative dark theme with serif typography
- **Sentence Case Protocol**: Global UI editorial standard for professional tone

### Backend & Database
- **Supabase 2.90.1**: PostgreSQL database, authentication, storage, Edge Functions
- **PostgreSQL 17**: Relational database with Row Level Security (RLS)
- **Performance Optimized**: Missing FK indexes added and RLS query evaluation optimized
- **17 Edge Functions**: Serverless functions for Stripe, Make.com, form submissions, AI research

### Payment Processing
- **Stripe**: One-time payments (€49 Detailed Compliance Review)
- **Pipeline Validated**: End-to-end €1.00 internal test successful (Feb 11)
- **Stripe Products**: `Compliance Readiness Review` configured in live mode

### Deployment
- **Cloudflare Pages**: CDN, continuous deployment from GitHub `main` branch
- **Public Submodules**: Submodule dependency (`prompts`) transition to public for CI/CD reliability
- **Supabase Cloud**: Managed PostgreSQL, Auth, Storage, Edge Functions

### Automation
- **Make.com**: Webhook orchestration for email notifications, Airtable logging, and AI research delivery
- **Supabase Webhooks**: Database triggers for lead processing

---

## Database Schema (Active Tables)

### Core Lead Tables

#### `tax_checkup_leads` (92 rows)

Primary lead generation table from Tax Checkup Tool.

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Primary key |
| `email` | text | Lead email |
| `name` | text | Lead name |
| `work_type` | text | developer, consultant, designer, etc. |
| `estimated_annual_income` | text | under_10k, 10k_25k, 25k_50k, over_50k |
| `months_in_portugal` | integer | Months per year in Portugal |
| `compliance_score_red` | integer | Critical issues (0-5) |
| `compliance_score_yellow` | integer | Warning issues (0-7) |
| `compliance_score_green` | integer | Compliant areas (0-5) |
| `compliance_report` | text | Generated report text |
| `interested_in_accounting_services` | boolean | Expressed interest in help |
| `email_marketing_consent` | boolean | GDPR consent |
| `is_latest_submission` | boolean | Deduplication flag |
| `submission_sequence` | integer | Engagement counter |
| `created_at` | timestamptz | Submission timestamp |

#### `paid_compliance_reviews` (6 rows)

Paid €49 product purchases with AI research enrichment.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `stripe_session_id` | text | Stripe checkout session |
| `customer_email` | text | Buyer email |
| `customer_name` | text | Buyer name |
| `access_token` | text | Unique access token for form |
| `status` | text | form_pending, submitted, in_review, completed |
| `form_data` | jsonb | Detailed intake form responses (26 fields) |
| `escalation_flags` | jsonb | Auto-calculated flags for professional review |
| `ambiguity_score` | integer | Count of "Not sure" answers |
| `ai_research_results` | jsonb | Raw high-precision research results with citations |
| `ai_draft_report` | text | Formatted AI draft report for owner review |
| `ai_research_status` | text | pending, completed, failed |
| `ai_researched_at` | timestamptz | When research completed |
| `created_at` | timestamptz | Purchase timestamp |

#### `accountant_applications` (7 rows)

Accountant partner applications.

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Primary key |
| `full_name` | text | Applicant name |
| `email` | text | Contact email |
| `experience_years` | integer | Years of experience |
| `specializations` | text[] | Areas of expertise |
| `english_fluency` | text | fluent, advanced, intermediate, basic |
| `has_occ` | boolean | OCC certification status |
| `occ_number` | text | Certification number |
| `accepts_triage_role` | text | Willingness to partner |
| `status` | text | pending, reviewing, accepted, rejected |

### Legacy Tables (Maintained, Not Active)

- `partners`: Service provider directory (seeded data)
- `partner_submissions`: Partner onboarding applications
- `stripe_customers`, `stripe_subscriptions`, `stripe_orders`: Subscription infrastructure
- `user_profiles`: User accounts (49 rows)
- `accountant_profiles`, `appointments`, `payouts`, `disputes`: Accounting Desk infrastructure

---

## Edge Functions

### Active Functions

| Function | Purpose |
|----------|---------|
| `submit-tax-checkup` | Process Tax Checkup submissions, calculate scores, trigger Make.com |
| `paid-review-checkout` | Create Stripe checkout for €49 review |
| `paid-review-webhook` | Handle Stripe payment confirmation |
| `submit-paid-review` | Process detailed intake form submissions, trigger AI research |
| `verify-paid-review` | Validate access tokens for paid review forms |
| `research-compliance` | High-precision regulatory research per paid review |
| `submit-contact-request` | Process contact form submissions |
| `submit-accountant-application` | Process accountant partner applications |
| `send-lead-to-makecom` | Trigger Make.com automation for new leads |

### Legacy Functions (Maintained)

| Function | Purpose |
|----------|---------|
| `stripe-checkout` | Create subscription checkout sessions |
| `stripe-webhook`, `stripe-webhook-live`, `stripe-webhook-test` | Handle subscription webhooks |
| `calcom-webhook` | Process Cal.com booking events |
| `notify-signup` | Send signup notifications |
| `verify-session` | Validate Stripe sessions |
| `submit-lead` | Legacy lead submission |

---

## Development Setup

### Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Supabase Account**: Project ID `jbmfneyofhqlwnnfuqbd`
- **Stripe Account**: Live mode configured
- **Cursor IDE**: Recommended for MCP integration

### Local Development

```bash
# Clone to local drive (NOT cloud-synced folder)
git clone https://github.com/vandevo/worktugal-app.git
cd worktugal-app

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Environment Variables

Required in `.env`:

```bash
VITE_SUPABASE_URL=https://jbmfneyofhqlwnnfuqbd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...
```

### Deployment

- **Production Branch**: `main`
- **Auto-deploy**: GitHub push triggers Cloudflare Pages build
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Live URL**: `https://app.worktugal.com`

---

## Current Roadmap

### Immediate (This Week)

1. **Email HOT leads** - 7 people with high risk + interest
2. **Email warm leads** - 28 additional interested leads
3. **WhatsApp accountant applicants** - 7 pending applications
4. **First paid customer** - Target: 1-2 sales at €49

### Short-term (30 Days)

1. **Validate €49 review demand** before building more
2. **Sign first accountant partner** matching Operator Zero criteria
3. **Collect objection patterns** from outreach responses
4. **Iterate on offer** based on conversion data

### Medium-term (ReadyFile v1)

1. **Define ReadyFile v1 schema** - Single gate (VAT readiness)
2. **Rename free checkup output** to "file readiness"
3. **Insert paid unlock** - €39-49 one-time
4. **Generate ReadyFile artifact** - Timestamped PDF or dashboard
5. **Accountant routing** - "Send me your ReadyFile first"

### Not Building (Explicitly Deferred)

- Mobile app
- Content hub
- Community features
- Multi-country expansion
- Subscription model revival
- Partner marketplace features

---

## Key Files

### Components

| File | Purpose |
|------|---------|
| `src/components/TaxCheckup/` | Tax Checkup wizard and results display |
| `src/components/PaidReview/` | €49 review intake forms |
| `src/components/AccountantApplication/` | Partner application form |
| `src/components/Admin/` | Admin dashboard for lead management |
| `src/components/ComplianceDisclaimer.tsx` | Shared disclaimer component (footer/inline/banner variants) |

### Configuration

| File | Purpose |
|------|---------|
| `vite.config.ts` | Build configuration with manual chunking |
| `tailwind.config.js` | Tailwind CSS configuration |
| `public/_redirects` | Cloudflare Pages SPA routing |

### Edge Functions

| Path | Purpose |
|------|---------|
| `supabase/functions/submit-tax-checkup/index.ts` | Core lead processing |
| `supabase/functions/paid-review-checkout/index.ts` | Stripe payment initiation |
| `supabase/functions/paid-review-webhook/index.ts` | Payment confirmation |
| `supabase/functions/research-compliance/index.ts` | AI regulatory research via Parallel.ai |

---

## Strategic Context

### The Problem We Solve

Foreign freelancers in Portugal fail compliance not because of ignorance, but because of:

1. **Fragmented intake** - Immigration, tax, social security operate independently
2. **Unclear responsibility** - No one owns the onboarding moment
3. **Language barriers** - Rules published in Portuguese only
4. **Weak professional enforcement** - Accountants gatekeep manually, inconsistently

### Our Position

We sit **upstream** of accountants, lawyers, and tax software. We decide:

- Is this person ready?
- Is this case safe?
- Is this complete?
- Should this escalate?

Professionals then execute.

### Competitive Advantage

| Competitor Type | What They Sell | What We Do Different |
|-----------------|----------------|---------------------|
| GetNIF, Fresh | Single tasks | We verify readiness before any task |
| Traditional accountants | Expertise + time | We standardize intake they receive |
| Rauva, TOConline | Post-onboarding automation | We ensure upstream correctness |

We sell **permission to proceed**, not advice, execution, or software.

---

## Recent Updates

### 2026-02-14: Authority Patch & Regulatory Pulse — v1.3.4
- **Authority Bug Fix**: Resolved critical issue where hardcoded 2025 deadlines were displayed in 2026, causing trust erosion.
- **Dynamic Deadline Engine**: Refactored `taxCheckupEnhancements.ts` to automatically generate year-aware deadlines (e.g., February 25, 2026 for 2025 expenses).
- **Regulatory Pulse Badge**: Added a live "Regulatory Pulse" and "Verified against official sources" badge to landing pages and reports, linked to a monthly verification date.
- **Legal Source Citations**: Upgraded the intelligence layer to include direct legal citations (e.g., Artigo 53.º do CIVA) and official links for red flag findings.
- **Metrics Growth**: Captured jump from 92 to 130 leads and first organic customer revenue (~€147) following today's campaign.

### 2026-02-11: Pipeline Validation & UX Refinement — v1.3.3
- **Stripe Pipeline Validation**: Successfully executed a full end-to-end €1.00 internal test, verifying Stripe -> Edge Function -> Make.com automation path (including Airtable and Telegram alerts).
- **Editorial Standardization**: Implemented the **"Sentence Case Enforcement Protocol"** across all core landing pages and intake forms to ensure a high-fidelity, professional tone.
- **Performance Optimization**: Added missing foreign key indexes and optimized Row Level Security (RLS) policies in Supabase for better query performance.
- **Mobile UX/UI**: Refactored the compliance review success page and timeline for better mobile responsiveness, removing visual artifacts and improving accessibility.
- **Submodule Resilience**: Resolved Cloudflare deployment issues by transitioning the `prompts` submodule to a public repository, ensuring stable CI/CD.

### 2026-02-09: Security Hardening & Ops Automation — v1.3.2
- **Database Self-Healing**: Integrated **Supabase Cron (`pg_cron`)** with an automated health check (`check_stalled_ai_research`) to identify and resolve stalled intelligence tasks.
- **Security Audit & Fixes**: Resolved Supabase security linter warnings by securing function search paths and tightening RLS policies across all primary lead tables.
- **Proprietary Branding**: "Scrubbed" specific AI vendor names from all user-facing documentation and codebases to establish a proprietary **"Worktugal Intelligence"** brand identity.
- **Infrastructure Stability**: Resolved Cloudflare build failures by de-coupling private submodule dependencies, ensuring 100% uptime for the deployment pipeline.

### 2026-02-09: Outreach & Transparency Push — v1.3.1
- **Product Updates Page**: Launched `/changelog`, a consumer-facing portal for tracking platform evolution, new features, and tool releases.
- **Theme Consistency**: Applied **Obsidian v1.2** design system to `PrivacyPolicy` and `TermsAndConditions` pages, ensuring full visual synchronization across the legal layer.
- **Outreach Prep**: Created `docs/outreach/` with personalized scripts for 7 HOT leads and accountant partners.
- **Objection Tracking**: Established `docs/OBJECTIONS.md` to capture market feedback and refine the €49 review value prop.

### 2026-02-09: Obsidian Design System & Theme Standardization — v1.3.0
- **Major UI/UX Overhaul**: Implemented the **Obsidian v1.2** design system across all core products.
  - **Visual Identity**: Adopted "Absolute Black" (`#050505`) and "Obsidian Surface" (`#121212`) palettes with `font-serif` (Playfair Display) for authoritative typography.
  - **Component Standardization**: Ported `ModernHero`, `ModernFeatures`, `PaidReviewLanding`, `ContactPage`, and all accounting modules to the new minimalist specification.
  - **Button System**: Unified all interactive elements with a monochrome high-contrast system (Solid White primary, Ghostly Outline secondary).
- **Theme Guardrails & Automation**:
  - Established `.cursor/rules/obsidian-theme.mdc` as a persistent Cursor rule to enforce theme consistency in all future development.
  - Created `prompts/prompts/knowledge/obsidian-theme.md` as the definitive design source of truth.
- **Content Restoration & "Powerful" Messaging**:
  - Reinstated high-conversion, risk-focused copy for the landing page and `/compliance-review` product.
  - Created new `ModernComplianceReviewCTA` and `ModernTestimonials` components to drive social proof and conversion.
  - Aligned terminology with "Foreign Freelancers" and "Remote Professionals" (removed generic expat/nomad phrasing).
- **Integrity & Verification**: 
  - Updated Hero features to **"Compliance Readiness Layer"** to accurately represent current project capabilities.
  - Reverted "Remote Worker Visa" terminology back to **"Digital Nomad Visa"** per specific user preference.
- **Infrastructure & Polish**:
  - Integrated **Google Stitch** and **Cal.com** MCPs for enhanced AI-driven design and scheduling workflows.
  - Built dynamic environment switcher in `stripe-config.ts` for automated Test/Live mode toggling.
  - Fixed JSX syntax errors and status timeline transparency issues in results pages.

### 2026-02-07: AI Drafting Enhancement — v1.2.1
- **Dual-Engine Architecture**: "Best of Both Worlds" approach implemented
  - **Precision Layer**: Focused on institutional accuracy and verifying official tax/law sources.
  - **Clarity Layer**: Focused on drafting clear, human-readable reports and communications.
- Updated `research-compliance` Edge Function to pipe data between processing layers
- Configured secure credentials in Supabase secrets
- Fallback logic: If advanced drafting is unavailable, reverts to standard template

### 2026-02-06: Pre-Launch Page Refresh — v1.2
- Replaced disabled "Coming Soon" buttons on checkup results with active CTA to paid compliance review (49 EUR)
- Added persistent sticky CTA banner on results page when issues are found
- Refreshed PaidReviewLanding headline to risk-prevention framing: "Know Where You Stand Before Portugal Fines You"
- Updated all copy to reflect AI-assisted research + human-verified report workflow
- Added "What you avoid" section with specific penalty examples on landing page
- Updated CheckupHero with dual CTA: free checkup + paid detailed review
- Refreshed all homepage sub-components from "2024" to "2025"
- Updated PaidReviewSuccess with visual status timeline (Submitted → Researching → Under Review → Delivered)
- Created shared `ComplianceDisclaimer` component with 3 variants (footer/inline/banner), added to all user-facing pages
- Seeded "compliance readiness" language across all new copy (no URL/product rename)
- Removed "first version" language from feedback section
- Added new FAQ entry for AI-assisted research process on landing page

### 2026-02-06: Intelligence Integration (Phase 1) — v1.1
- Integrated advanced regulatory research system for automated deep-dives on paid compliance reviews.
- New Edge Function `research-compliance` runs 2-6 targeted searches per review based on user form data
- Added 4 columns to `paid_compliance_reviews`: `ai_research_results`, `ai_draft_report`, `ai_research_status`, `ai_researched_at`
- Modified `submit-paid-review` to async-trigger research after form submission (non-blocking)
- New Make.com webhook `MAKECOM_WEBHOOK_AI_RESEARCH_COMPLETE` sends draft to owner
- Covers: tax residency, VAT, NISS, NHR/IFICI, cross-border exposure, cryptocurrency
- Safety: AI drafts only, human review mandatory, fails silently to manual mode if research engine is unavailable
- Legal positioning: all outputs include disclaimers ("not legal or tax advice")

### 2026-02-03: README Overhaul
- Complete rewrite to reflect current product state
- Removed outdated perks marketplace documentation
- Added current metrics and roadmap
- Aligned with ReadyFile strategic direction

### 2025-02-01: Infrastructure Migration
- Migrated hosting from Netlify to Cloudflare Pages
- Established local development environment in Cursor IDE
- Configured MCP servers for Supabase and Cloudflare API access
- Updated AI Development Guardrail Prompt for new environment

### 2026-01-22: Paid Compliance Review Launch
- Deployed €49 Detailed Compliance Risk Review product
- Stripe checkout integration via `paid-review-checkout` Edge Function
- Multi-step intake form with access token verification
- Admin review workflow in dashboard

### 2025-12-xx: Tax Checkup Enhancements
- Added `interested_in_accounting_services` field
- Implemented email-based deduplication with `is_latest_submission` flag
- Enhanced compliance scoring algorithm
- Make.com webhook integration for lead notifications

### 2025-11-xx: Tax Checkup Tool Launch
- Created `tax_checkup_leads` table with compliance scoring
- Built 5-step diagnostic wizard
- Implemented red/yellow/green flag system
- Added checkup feedback collection

### 2025-10-xx: Accounting Desk Infrastructure
- Created accountant profiles, applications, appointments tables
- Built Cal.com webhook integration
- Implemented payout and dispute tracking
- Prepared infrastructure for accountant marketplace (not launched)

---

## Guardrails

### Build Rules

- **No new features** until first paying customer
- **No subscriptions** until one-time payments validated
- **No dashboards** until core enforcement works
- **No AI features** that bypass human review in compliance context (AI assists, human approves)
- **No content expansion** until monetization proven

### Outreach Rules

- **Email leads personally** before automating
- **Collect objections** before iterating product
- **One message, one offer** per outreach
- **Direct response** over broadcast marketing

### Identity Rules

- We are a **checkpoint**, not a guide
- We enforce **readiness**, not advice
- We transfer **responsibility**, not information
- We produce **finality**, not engagement

---

## Contact

- **App URL**: https://app.worktugal.com
- **GitHub**: https://github.com/vandevo/worktugal-app
- **Supabase Project**: `jbmfneyofhqlwnnfuqbd`

---

**End of README**
