---
name: Worktugal project state
description: Current state of the Worktugal product, stack, and what exists vs what's missing
type: project
---

Worktugal is Van's product for remote professionals navigating Portugal — clarity, tools, sovereignty. 7+ events, 300+ RSVPs, 1K+ community.

**Stack:** React + Vite + TypeScript, Cloudflare Pages hosting, Supabase DB/auth, n8n automation (self-hosted, replacing Make.com), Resend transactional email, Listmonk campaigns (15k contacts), Ghost blog (blog.worktugal.com).

**What exists:** Compliance Risk Diagnostic (915+ completions, 13 questions, 7 trap rules including CRUE), My Account Dashboard, Google OAuth, Ghost blog with Admin API, Telegram channel (@worktugal), content pipeline (Parallel AI research → Gemini draft → Claude review → Ghost publish), B2B Compliance Intelligence landing page (`/compliance`) with Founding Member pricing (€29/mo for life), Portugal Radar landing page (`/radar`) with email capture + Google OAuth signup, Compliance Monitor infrastructure (2 Parallel AI daily monitors → n8n webhook → Qwen summarize → Supabase alerts → weekly Listmonk digest).

**Critical gap as of 2026-04-26:** Zero paying users. B2B compliance intelligence landing page live with Stripe checkout wired (€29/mo Founding Member). Clarity Call (€149) CTAs replaced with Compliance Intelligence CTAs on diagnostic results and dashboard. Login redirect fixed. Awaiting Founding Member outreach validation (3 paid commitments required before building automated pipeline). 15k email list dormant.

**Vault source of truth:** `/home/vandevo/projects/prompt-secret-vault/`

**n8n automation (self-hosted at n8n.worktugal.com):** Version 2.17.8 (updated 2026-04-27). n8n Version Update Checker workflow (ID: 2Rj4ROAXA3AJE4Fs) runs Mondays 9 AM — compares running version against Docker Hub latest, sends Telegram alert via @WorktugalPassBot when update available. Update script at `~/docker/n8n/update-n8n.sh` on van-cloud.

**Why:** Infrastructure is complete (n8n, Resend, Listmonk, Ghost, Telegram). The only missing piece is one paid button and one re-engagement campaign.
