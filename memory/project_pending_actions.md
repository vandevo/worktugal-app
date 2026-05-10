---
name: Pending actions from vault handovers
description: Outstanding items from session handovers. Updated for AI Jobs board direction.
type: project
---

Ordered by leverage (updated 2026-05-11):

**Strategy pivot (2026-05-11):** AI Jobs board is now primary revenue engine. Compliance is secondary content authority. See `worktugal-direction-2026-05-10.md` in vault.

1. **Build Stripe EUR 49 checkout** — /jobs page is live with 445 jobs. No way for employers to pay yet. Copy stripe-checkout edge function pattern. Create Stripe product "AI Job Posting" at EUR 49. Phase 0.3 per MVP plan.

2. **Write first company spotlight article** — Anthropic. Use company-spotlight-os.md template. Parallel AI refresh → DeepSeek draft → edit → SEO audit → publish on Ghost. Drive traffic to /jobs.

3. **Add 5 more ATS feeds** — Stripe, ElevenLabs, DeepL, Hugging Face, Cohere. Discover correct Greenhouse board tokens. Add to n8n aggregation pipeline.

4. **Add more companies to LogoKit** — Register company domains in the `COMPANY_DOMAIN` mapping in JobCard.tsx for new ATS feeds.

5. **Enrich remote_policy from ATS data** — Greenhouse/Lever feeds have location type data. Update normalize code to detect remote vs on-site.

**Why:** Jobs board is live and functional. Revenue pipeline (Stripe checkout), traffic engine (company spotlights), and supply (more ATS feeds) are the three bottlenecks.

**Completed (new direction):**
- ~~Supabase schema: ai_jobs + ai_companies tables~~ — Created with indexes, RLS, unique constraints, EU eligibility columns
- ~~n8n ATS aggregation pipeline~~ — 17-node workflow active, fetches 4 companies daily at 06:00
- ~~/jobs page~~ — Live at app.worktugal.com/jobs with 445 EU-eligible jobs, premium JobCards, search + filters + pagination
- ~~Data enrichment: seniority + D8 badges~~ — 253 jobs badged D8 Eligible, seniority classified for all 445
- ~~Company logos~~ — LogoKit integrated with fallback monogram initials
- ~~n8n Weekly Digest fixed~~ — Listmonk removed, Telegram ops bot sending

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
