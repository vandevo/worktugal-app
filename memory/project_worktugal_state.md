---
name: Worktugal project state
description: Current state of the Worktugal product, stack, and what exists vs what's missing
type: project
---

Worktugal is Van's product for remote professionals navigating Portugal — clarity, tools, sovereignty. 7+ events, 300+ RSVPs, 1K+ community.

**Stack:** React + Vite + TypeScript, Cloudflare Pages hosting, Supabase DB/auth, n8n automation (self-hosted, replacing Make.com), Resend transactional email, Listmonk campaigns (15k contacts), Ghost blog (blog.worktugal.com).

**What exists:** Compliance Risk Diagnostic (915+ completions, 13 questions, 7 trap rules including CRUE), My Account Dashboard, Google OAuth, Ghost blog with Admin API, Telegram channel (@worktugal), content pipeline (Parallel AI research → Gemini draft → Claude review → Ghost publish), B2B Compliance Intelligence landing page (`/compliance`) with Founding Member pricing (€29/mo for life).

**Critical gap as of 2026-04-25:** Zero paying users. B2B compliance intelligence landing page live with Stripe checkout wired (€29/mo Founding Member). Login flow fixed: closing modal returns to `/compliance`. Awaiting Founding Member outreach validation (3 paid commitments required before building automated pipeline). 15k email list dormant.

**Vault source of truth:** `/home/vandevo/projects/prompt-secret-vault/`

**Why:** Infrastructure is complete (n8n, Resend, Listmonk, Ghost, Telegram). The only missing piece is one paid button and one re-engagement campaign.
