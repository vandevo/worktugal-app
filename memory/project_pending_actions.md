---
name: Pending actions from vault handovers
description: Outstanding items from v2.0–v2.2 session handovers that haven't been completed
type: project
---

Ordered by leverage (updated 2026-04-25):

1. **B2B Founding Member outreach** — `/compliance` landing page live. Send validation emails to 30 immigration lawyers + 20 relocation firms. 3 paid commitments (€29/mo) = build Phase 1 automated pipeline.

2. **Wire Stripe paid diagnostic (€29)** — 15k email list, 915+ completions. Create Stripe product, payment link, add CTA to results page + email follow-up.

3. **Re-engagement campaign via Listmonk** — 15k contacts dormant since EmailOctopus migration. Send monthly compliance update with diagnostic CTA. Template exists in portugal-calendar-os.md.

4. **Publish one article per week** — Ghost blog live at blog.worktugal.com. Content pipeline automated (Parallel AI research → Gemini draft → Claude review → pre-publish-check → Ghost publish). Nationality law change (April 1, 2026) is current event journalism window.

5. **Growbot cancellation** — ~€7.80/mo. User requested cancellation. Draft email ready.

**Completed:**
- ~~Make.com RSS scenario~~ → Replaced by n8n workflows + 5 Parallel AI regulatory monitors (weekly).
- ~~Monthly compliance email in EmailOctopus~~ → Migrated to Listmonk (mail.worktugal.com). Template ready, not yet sent.
- ~~Laptop MCP servers~~ → All 11 commands consolidated into vault, symlinked to ~/.config/opencode/commands/.
- ~~Publish one article~~ → Ghost blog live, 2+ articles published (NISS guide, AIMA card delay).
- ~~Create Stripe Fix Session product~~ → Superseded by paid diagnostic (€29) as priority.
- ~~Run TPP Add-on 03~~ → Superseded by B2B compliance intelligence strategy.
- ~~B2B compliance intelligence pitch~~ → `/compliance` landing page built (2026-04-25). Awaiting Founding Member outreach validation.
- ~~Wire Stripe Founding Member checkout~~ → €29/mo subscription wired to `/compliance` CTAs. Product `prod_UOwhQ5fH1TTV2g`, price `price_1TQ8nsBm1NepJXMzm0n8hlNf` (live). `/login` route added for auth redirect. Login modal close fixed to return to `/compliance` instead of home. Ready for validation outreach.
- ~~Replace Clarity Call CTAs with Compliance Intelligence~~ → Diagnostic results page and dashboard banner both now show forest green hero block CTA pointing to `/compliance` (€29/mo). Clarity Call (€149) dead product references removed. Responsive: full-width button on mobile, auto-width on desktop. Emerald Zenith theme tokens applied.
- ~~OpenCode MCP timeout fixes~~ → Cloudflare + GitHub MCPs switched to wrapper scripts (env var bypass). Context7 switched to remote HTTP (WSL stdio hang). `.claude/` added to `.gitignore`. Archive reorganized under `archives/2026-04/`.
- ~~n8n version checker workflow~~ → Workflow "n8n Version Update Checker" (ID: 2Rj4ROAXA3AJE4Fs) live, runs Mondays 9 AM. Telegram alerts via @WorktugalPassBot. n8n updated from 2.16.1 → 2.17.8. Update script at `~/docker/n8n/update-n8n.sh` on van-cloud. n8n workflow creation checklist saved to `resources/tmp/n8n-workflow-checklist.md`.

**Why:** Infrastructure is complete. Revenue actions remain the bottleneck. Every session should move one step closer to a paid button.
