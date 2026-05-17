---
name: Pending actions from vault handovers
description: Outstanding items from session handovers. Updated for AI Jobs board direction.
type: project
---

Ordered by leverage (updated 2026-05-17):

**Infrastructure shift (2026-05-13):** AI Jobs pipeline migrated from n8n → Cloudflare Worker ($0, 22 companies, 927 jobs). n8n now only used for compliance monitors + Telegram notifications. Cloudflare OS doc created — all CF services documented for future use. Firecrawl integrated for scraping non-ATS companies.

1. **Launch Browser Rendering for non-ATS companies** — Use Cloudflare Browser Rendering or Firecrawl to scrape companies without Greenhouse/Lever/Ashby APIs (Snyk/Workday, Retool). Add to Worker as a fallback step.

2. **Add Workers AI job summarization** — Use Cloudflare Workers AI (free Llama) to auto-summarize job descriptions on ingest. Run as a post-process step.

3. **Write first company spotlight article** — Anthropic. Use company-spotlight-os.md template. Parallel AI refresh → DeepSeek draft → edit → SEO audit → publish on Ghost.

4. **Enrich remote_policy from ATS data** — Greenhouse/Lever/Ashby feeds have workplaceType/remote data. Update normalize code to detect remote vs on-site.

5. **Add salary enrichment from ATS content** — HTML-encoded salary data in job descriptions. Currently regex fails on encoded characters.

**Why:** Jobs board is live with 927 daily jobs. Supply is solved. Now: more non-ATS companies (Browser Rendering), richer job data (AI summarization, remote/salary), and traffic (company spotlights).

**Completed (new direction):**
- ~~Supabase schema: ai_jobs + ai_companies tables~~ — Created with indexes, RLS, unique constraints, EU eligibility columns
- ~~n8n ATS aggregation pipeline~~ — v2 loop-based workflow active, 6 companies daily at 06:00
- ~~/jobs page~~ — Live at app.worktugal.com/jobs with 545 curated AI roles, Ashby-style filters
- ~~Department filter~~ — Sales/Marketing/HR/Finance/Support/Business dropped from pipeline
- ~~Workflow refactor~~ — 17 nodes → 7, SplitInBatches loop, scalable to 100+ companies
- ~~Job posting checkout~~ — EUR 49 self-serve with Google sign-in, Stripe, ai_jobs insert via webhook
- ~~UI redesign~~ — Job Board Mode: minimal list, no cards, text badges, Ashby-style filters
- ~~Homepage reorientation~~ — Jobs-first messaging, compliance secondary, new nav/header/bottom
- ~~Telegram bot hack recovery~~ — Both bots restored, tokens rotated everywhere
- ~~Security hardening~~ — mcp-gemini.sh → GCP runtime, /ship → git add -u, VanBrain → GCP
- ~~n8n security patch~~ — Upgraded 2.17.8 → 2.20.7-exp.0 (7 CVEs patched)
- ~~n8n → Worker migration~~ — ai-jobs-pipeline Worker replaces n8n for job aggregation. 22 companies, 927 EU jobs/day, $0
- ~~Ashby ATS support~~ — OpenAI, Notion, Linear, Cursor, Replit, Vanta, Cohere added
- ~~Cloudflare OS knowledge doc~~ — Full capability map in vault
- ~~Knowledge INDEX.md~~ — 40 docs mapped by use case
- ~~Firecrawl integration~~ — CLI installed, MCP server wired in opencode.json
- ~~Newsletter signup system~~ — subscribe-newsletter edge function, NewsletterPopup (15s delay), HeroNewsletterInline component, Resend welcome email + Telegram alert

**Completed (previous direction):**
- ~~RadarLanding.tsx copy refresh~~ → Sales copy rewrite: hero Challenger framing, audience pain cards, cost of inaction section, urgency badge, stronger guarantee.
- ~~Make.com RSS scenario~~ → Replaced by n8n workflows + 5 Parallel AI regulatory monitors (weekly).
- ~~Monthly compliance email in EmailOctopus~~ → Migrated to Listmonk (mail.worktugal.com). Template ready, not yet sent.
- ~~Laptop MCP servers~~ → All 11 commands consolidated into vault, symlinked to ~/.config/opencode/commands/.
- ~~Publish one article~~ → Ghost blog live, 2+ articles published (NISS guide, AIMA card delay).
- ~~Portugal Radar landing page~~ → `/radar` built with email capture + Google OAuth signup.
- ~~Wire Stripe Founding Member checkout~~ → €29/mo subscription wired to `/compliance` CTAs.
- ~~Replace Clarity Call CTAs with Compliance Intelligence~~ → Diagnostic and dashboard banners updated.
- ~~OpenCode MCP timeout fixes~~ → Cloudflare + GitHub MCPs switched to wrapper scripts.
- ~~n8n version checker workflow~~ → Version checker active, n8n updated to 2.17.8.
- ~~RadarLanding.tsx bugs + Listmonk integration~~ → All bugs fixed, Listmonk v6 auth working.
- ~~Ghost blog fixes~~ → CTA guard removed, portal enabled, SEO set, nav configured.

**Why:** Revenue actions remain the bottleneck. Jobs board infrastructure is built. Now ship the checkout and content engine.
