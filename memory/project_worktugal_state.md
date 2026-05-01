---
name: Worktugal project state
description: Current state of the Worktugal product, stack, and what exists vs what's missing
type: project
---

**Last updated: 2026-04-30**

Worktugal is Van's product for remote professionals navigating Portugal — clarity, tools, sovereignty. 7+ events, 300+ RSVPs, 1K+ community.

**Stack:** React + Vite + TypeScript, Cloudflare Pages hosting, Supabase DB/auth, n8n automation (self-hosted, replacing Make.com), Resend transactional email, Listmonk campaigns (15k contacts), Ghost blog (blog.worktugal.com).

**What exists:** Compliance Risk Diagnostic (915+ completions, 13 questions, 7 trap rules including CRUE), My Account Dashboard, Google OAuth, Ghost blog with Admin API, Telegram channel (@worktugal), content pipeline (Parallel AI research → Gemini draft → Claude review → Ghost publish), B2B Compliance Intelligence landing page (`/compliance`) with Founding Member pricing (€29/mo for life), Portugal Radar landing page (`/radar`) with email + Google OAuth signup wired to Listmonk (list 3, source attribution), Ghost blog members synced to Listmonk (list 5, ghost-member-webhook), Compliance Monitor infrastructure (2 Parallel AI daily monitors → n8n webhook → Qwen summarize → Supabase alerts → weekly Listmonk digest).

**Fixed 2026-04-30:** RadarLanding.tsx bugs (pricing €12→€5, Listmonk integration, dead imports, bg clipping). auto-subscribe-radar edge function rewritten for Listmonk v6 session-cookie auth (Basic auth deprecated in v6). Resend tracking disabled on both domains (CNAME verification failing — not needed). Ghost members bulk-imported to Listmonk list 5 with source attribution. LISTMONK_RADAR_LIST_ID=3.

**Fixed 2026-05-02:** RadarLanding.tsx copy refresh — hero headline rewritten to Challenger framing ("100+ rule changes a day..."), audience cards rewritten to pain-first copy (D7, freelancer, NHR), new "Cost of Inaction" section added with specific penalty amounts (€150-€500 NISS fines, months of AIMA delays, tax penalties), badge updated to "BETA: FIRST 500 LOCK €5/MO", CTA changed to "Start my free 2 weeks", stronger guarantee added. All em dashes replaced.

**Critical gap as of 2026-04-26:** Zero paying users. B2B compliance intelligence landing page live with Stripe checkout wired (€29/mo Founding Member). Clarity Call (€149) CTAs replaced with Compliance Intelligence CTAs on diagnostic results and dashboard. Login redirect fixed. Awaiting Founding Member outreach validation (3 paid commitments required before building automated pipeline). 15k email list dormant.

**Vault source of truth:** `/home/vandevo/projects/prompt-secret-vault/`

**n8n automation (self-hosted at n8n.worktugal.com):** Version 2.17.8 (updated 2026-04-27). n8n Version Update Checker workflow (ID: 2Rj4ROAXA3AJE4Fs) runs Mondays 9 AM — compares running version against Docker Hub latest, sends Telegram alert via @WorktugalPassBot when update available. Update script at `~/docker/n8n/update-n8n.sh` on van-cloud.

**Why:** Infrastructure is complete (n8n, Resend, Listmonk, Ghost, Telegram). The only missing piece is one paid button and one re-engagement campaign.
