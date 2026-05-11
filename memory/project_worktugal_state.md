---
name: Worktugal project state
description: Current state of the Worktugal product, stack, and what exists vs what's missing
type: project
---

**Last updated: 2026-05-11**

Worktugal is Van's product for remote professionals navigating Portugal — clarity, tools, sovereignty. 7+ events, 300+ RSVPs, 1K+ community.

**Stack:** React + Vite + TypeScript, Cloudflare Pages hosting, Supabase DB/auth, n8n automation (self-hosted, replacing Make.com), Resend transactional email, Listmonk campaigns (15k contacts), Ghost blog (blog.worktugal.com).

**What exists:** Compliance Risk Diagnostic (915+ completions, 13 questions, 7 trap rules including CRUE), My Account Dashboard, Google OAuth, Ghost blog with Admin API, Telegram channel (@worktugal), content pipeline (Parallel AI research → Gemini draft → Claude review → Ghost publish), B2B Compliance Intelligence landing page (`/compliance`) with Founding Member pricing (€29/mo for life), Portugal Radar landing page (`/radar`) with email + Google OAuth signup wired to Listmonk (list 3, source attribution), Ghost blog members synced to Listmonk (list 5, ghost-member-webhook), Compliance Monitor infrastructure (2 Parallel AI daily monitors → n8n webhook → Qwen summarize → Supabase alerts → weekly Listmonk digest).

**Fixed 2026-04-30:** RadarLanding.tsx bugs (pricing €12→€5, Listmonk integration, dead imports, bg clipping). auto-subscribe-radar edge function rewritten for Listmonk v6 session-cookie auth (Basic auth deprecated in v6). Resend tracking disabled on both domains (CNAME verification failing — not needed). Ghost members bulk-imported to Listmonk list 5 with source attribution. LISTMONK_RADAR_LIST_ID=3.

**Fixed 2026-05-02:** RadarLanding.tsx copy refresh — hero headline rewritten to Challenger framing ("100+ rule changes a day..."), audience cards rewritten to pain-first copy (D7, freelancer, NHR), new "Cost of Inaction" section added with specific penalty amounts (€150-€500 NISS fines, months of AIMA delays, tax penalties), badge updated to "BETA: FIRST 500 LOCK €5/MO", CTA changed to "Start my free 2 weeks", stronger guarantee added. All em dashes replaced.

**Critical gap as of 2026-04-26:** Zero paying users. B2B compliance intelligence landing page live with Stripe checkout wired (€29/mo Founding Member). Clarity Call (€149) CTAs replaced with Compliance Intelligence CTAs on diagnostic results and dashboard. Login redirect fixed. Awaiting Founding Member outreach validation (3 paid commitments required before building automated pipeline). 15k email list dormant.

**Vault source of truth:** `/home/vandevo/projects/prompt-secret-vault/`

**n8n automation (self-hosted at n8n.worktugal.com):** Version 2.18.7 (updated 2026-05-04, from 2.17.8). n8n Version Update Checker workflow (ID: 2Rj4ROAXA3AJE4Fs) runs Mondays 9 AM — compares running version against Docker Hub latest, sends Telegram alert via @WorktugalPassBot when update available. Update script at `~/docker/n8n/update-n8n.sh` on van-cloud.

**Why:** Infrastructure is complete (n8n, Resend, Listmonk, Ghost, Telegram). The only missing piece is one paid button and one re-engagement campaign.

## Finished
- **2026-05-05**: Radar subscription pipeline live. Stripe test + live webhooks wired (stripe-webhook-test, stripe-webhook-live), Ghost sync on subscription (Admin API), welcome email via Resend. DB schema: stripe_customers → stripe_subscriptions join via customer_id. Pro badge added to nav header (green "Pro" / gray "Free" pill next to theme toggle). Dashboard no longer force-redirects to diagnostic — both free and Pro users see dashboard with diagnostic prompt instead. Radar page and Subscribe page now respect Pro status (show dashboard link instead of re-subscribe CTA).
- **2026-05-09**: Ghost CMS monetization removed. Ghost is now free-only: paid tier removed from portal, Stripe→Ghost membership sync deleted from stripe-webhook-live edge function, Free tier description/benefits rewritten (diagnostic, guide archive, Telegram channel, weekly briefs). Diagnostic results CTA changed from Ghost portal to `/radar`. n8n Weekly Digest Compiler simplified: removed broken Listmonk email send, now posts digest to Worktugal Ops Telegram chat via ops bot. Airtable PAT stored in GCP Secret Manager for API access.
- **2026-05-11**: AI Jobs board launched at `/jobs`. 445 EU-eligible jobs from 4 AI companies (Anthropic, GitLab, Databricks, Mistral). n8n ATS aggregation pipeline active (17 nodes, daily 06:00). Premium JobCards with company logos, D8 Visa badges, seniority badges, skills tags, New badge, salary display. Supabase schema `ai_jobs` + `ai_companies` created. 253 jobs badged as D8 Eligible. LogoKit integrated for company logos.
- **2026-05-11 (afternoon)**: Major pivot execution. Department filter added to ATS pipeline — non-AI roles (Sales, Marketing, HR, Finance) dropped. 704 non-AI jobs deleted from DB. Workflow refactored from 17 parallel nodes to 7 loop-based nodes (SplitInBatches), scalable to 100+ companies. Stripe + Figma added (6 companies total). UI redesigned in Ashby/GH minimalist style (no cards, thin dividers, text-only badges). EUR 49 job posting checkout live (`create-job-posting-checkout` edge function + `/jobs/post` form + webhook handler). Homepage reoriented to jobs-first, compliance secondary. Emerald Zenith theme updated to v1.1 with Job Board Mode. Bottom nav changed from RESULTS to JOBS. Header CTAs cleaned up (Post a job + Sign in). OAuth default redirect changed from `/diagnostic` to `/jobs`.

