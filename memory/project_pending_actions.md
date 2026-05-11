---
name: Pending actions from vault handovers
description: Outstanding items from session handovers. Updated for AI Jobs board direction.
type: project
---

Ordered by leverage (updated 2026-05-11):

**Strategy pivot (2026-05-11):** AI Jobs board is now primary revenue engine. Compliance is secondary content authority. See `worktugal-direction-2026-05-10.md` in vault.

1. **Write first company spotlight article** — Anthropic. Use company-spotlight-os.md template. Parallel AI refresh → DeepSeek draft → edit → SEO audit → publish on Ghost. Drive traffic to /jobs.

2. **Add 5 more ATS feeds** — OpenAI, Cohere, ElevenLabs, DeepL, Helsing. Discover correct Greenhouse board tokens. Add to Company List array in new v2 workflow.

3. **Enrich remote_policy from ATS data** — Greenhouse/Lever feeds have location type data. Update normalize code to detect remote vs on-site.

4. **Add salary enrichment from ATS content** — HTML-encoded salary data in job descriptions. Currently regex fails on encoded characters.

**Why:** Jobs board is live and functional. Revenue pipeline (Stripe checkout), traffic engine (company spotlights), and supply (more ATS feeds) are the three bottlenecks.

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
