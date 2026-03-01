# Worktugal

**Last Updated:** 2026-03-01 (v1.5.0)

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
| :--- | :--- | :--- | :--- |
| **Tax Checkup Tool** | Live | Lead generation (free) | 5-step diagnostic quiz producing compliance score (red/yellow/green flags) |
| **Detailed Compliance Review** | Live | €49 one-time | AI-assisted research + human-verified compliance readiness report |
| **Accountant Application Portal** | Live | Partnership funnel | Intake system for accountant partners |

### Planned Products

| Product | Status | Revenue Model | Description |
| :--- | :--- | :--- | :--- |
| **ReadyFile v1** | Research complete | €39-149 per file | Timestamped readiness verification artifact that professionals accept |

### Legacy Products (Not in Active Development)

| Product | Status | Notes |
| :--- | :--- | :--- |
| Partner Directory | Maintenance only | Searchable catalog of Portuguese service providers |
| Perks System | Maintenance only | Members-only discounts from partner businesses |
| Subscription Marketplace | Deprecated | Original €29/month membership model |
| Accounting Desk Consultation | On hold | Cal.com booking integration, waiting for accountant partner |

---

## Current Metrics (as of 2026-03-01)

| Metric | Count | Notes |
| :--- | :--- | :--- |
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
- **React Router DOM 7.12.0**: Client-side routing
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

### AI & Automation

- **Parallel.ai**: Real-time regulatory research engine for automated deep-dives
- **Perplexity (Sonar)**: Drafting layer for human-readable reports and emails
- **Make.com**: Webhook orchestration for email notifications and lead processing

### Development Infrastructure

- **Node.js**: 20.x+ (Recommended for stable build performance)
- **Docker Desktop**: Required for local Supabase development
- **WSL (Windows Subsystem for Linux)**: Recommended for consistent shell operations
- **Supabase CLI**: Local environment management and migration tool

### Payment Processing

- **Stripe**: One-time payments (€49 Detailed Compliance Review)
- **Pipeline Validated**: End-to-end €1.00 internal test successful (Feb 11)
- **Stripe Products**: `Compliance Readiness Review` configured in live mode

### Deployment

- **Cloudflare Pages**: CDN, continuous deployment from GitHub `main` branch
- **Public Submodules**: Submodule dependency (`prompts`) transition to public for CI/CD reliability
- **Supabase Cloud**: Managed PostgreSQL, Auth, Storage, Edge Functions

---

## Database Schema (Active Tables)

### Core Lead Tables

#### `tax_checkup_leads`

Primary lead generation table from Tax Checkup Tool.

| Column | Type | Description |
| :--- | :--- | :--- |
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

#### `paid_compliance_reviews`

Paid €49 product purchases with AI research enrichment.

| Column | Type | Description |
| :--- | :--- | :--- |
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

#### `accountant_applications`

Accountant partner applications.

| Column | Type | Description |
| :--- | :--- | :--- |
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

#### `regulatory_rules` (Phase 2 - Upcoming)

Dynamic database for Portuguese tax thresholds and deadlines.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Primary key |
| `rule_category` | text | vat, nif, niss, nhr, etc. |
| `rule_id` | text | Unique identifier for logic mapping |
| `threshold_value` | numeric | Numerical trigger value |
| `source_url` | text | Official documentation link |

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
| :--- | :--- |
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
| :--- | :--- |
| `stripe-checkout` | Create subscription checkout sessions |
| `stripe-webhook` | Handle subscription webhooks |
| `calcom-webhook` | Process Cal.com booking events |
| `notify-signup` | Send signup notifications |
| `verify-session` | Validate Stripe sessions |
| `submit-lead` | Legacy lead submission |

---

## Development Setup

### Prerequisites

- **Node.js**: 20.x or higher
- **npm**: 10.x or higher
- **Docker Desktop**: Running for local database services
- **WSL2**: Recommended for Windows users
- **Supabase CLI**: `npm install supabase --save-dev`

### Local Development

```bash
# Clone the repository
git clone https://github.com/vandevo/worktugal-app.git
cd worktugal-app

# Install dependencies
npm install

# Start local Supabase (requires Docker)
npx supabase start

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
- **Live URL**: <https://app.worktugal.com>

---

## Roadmap

### Immediate (Mar 2026)

1. **Phase 2: Regulatory Rules DB**: Migrate hardcoded thresholds from `taxCheckupEnhancements.ts` to `regulatory_rules` table.
2. **Parallel.ai Stability**: Hardening Edge Functions using `EdgeRuntime.waitUntil` to prevent connection failures.
3. **Outreach**: Engage with the 12 HOT leads identified in the February campaign.
4. **Authority Engine**: Implement "Legal Watchdog" automation via Parallel.ai for proactive rule monitoring.

---

## Key Files

### Components

| File | Purpose |
| :--- | :--- |
| `src/components/TaxCheckup/` | Tax Checkup wizard and results display |
| `src/components/PaidReview/` | €49 review intake forms |
| `src/components/AccountantApplication/` | Partner application form |
| `src/components/Admin/` | Admin dashboard for lead management |
| `src/components/ComplianceDisclaimer.tsx` | Shared disclaimer component (footer/inline/banner variants) |

### Configuration

| File | Purpose |
| :--- | :--- |
| `vite.config.ts` | Build configuration with manual chunking |
| `tailwind.config.js` | Tailwind CSS configuration |
| `public/_redirects` | Cloudflare Pages SPA routing |

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
| :--- | :--- | :--- |
| GetNIF, Fresh | Single tasks | We verify readiness before any task |
| Traditional accountants | Expertise + time | We standardize intake they receive |
| Rauva, TOConline | Post-onboarding automation | We ensure upstream correctness |

We sell **permission to proceed**, not advice, execution, or software.

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

## Recent Updates

### 2026-03-01: Infrastructure Hardening & AI Connectivity — v1.5.0

- **Connection Stability Fix**: Resolved "connection failed" errors in AI research triggers by implementing `EdgeRuntime.waitUntil` in `submit-paid-review` and `notify-signup` Edge Functions.
- **Node.js & Docker Upgrade**: Standardized development environment with Node.js 20+, Docker Desktop, and Supabase CLI for local verification.
- **Phase 2 Prep**: Drafted `regulatory_rules` schema to transition from static to dynamic authority logic.
- **README v3.0**: Complete overhaul of documentation to reflect the shift to the "Authority Engine" and modern tech stack while preserving strategic legacy.

### 2026-02-14: Authority Patch & Regulatory Pulse — v1.3.4

- **Authority Bug Fix**: Resolved critical issue where hardcoded 2025 deadlines were displayed in 2026, causing trust erosion.
- **Dynamic Deadline Engine**: Refactored `taxCheckupEnhancements.ts` to automatically generate year-aware deadlines.
- **Regulatory Pulse Badge**: Added live "Verified against official sources" badge to landing pages and reports.
- **Metrics Growth**: Captured jump to 130 leads and first organic customer revenue (~€147).

### 2026-02-11: Pipeline Validation & UX Refinement — v1.3.3

- **Stripe Pipeline Validation**: Successfully executed end-to-end €1.00 internal test.
- **Editorial Standardization**: Implemented "Sentence Case Enforcement Protocol" across UI.
- **Performance Optimization**: Added missing FK indexes and optimized RLS.

### 2026-02-09: Security Hardening & Ops Automation — v1.3.2

- **Database Self-Healing**: Integrated `pg_cron` for health checks on AI tasks.
- **Security Audit**: Secured function search paths and tightened RLS policies.

### 2026-02-09: Obsidian Design System & Theme Standardization — v1.3.0

- **Major UI/UX Overhaul**: Implemented Obsidian v1.2 dark theme with serif typography.
- **Theme Guardrails**: Established `.cursor/rules/obsidian-theme.mdc`.

### 2026-02-07: AI Drafting Enhancement — v1.2.1

- **Dual-Engine Architecture**: Integrated Perplexity (Sonar) for clear drafting and Parallel.ai for precision.

---

## Contact

- **App URL**: <https://app.worktugal.com>
- **GitHub**: <https://github.com/vandevo/worktugal-app>
- **Supabase Project**: `jbmfneyofhqlwnnfuqbd`

---

**End of README**
