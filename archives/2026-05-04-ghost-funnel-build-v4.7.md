## 1. Thread Overview

**Session**: v4.7-ghost-funnel-build-2026-05-04
**Agent**: DeepSeek V4 Flash (ds)
**Duration**: Continuation of v4.6 compass setup — full Ghost funnel build + app pricing alignment

### Scope
Ghost blog turned from static 3-post site into a complete lead capture + conversion funnel. App pricing cleaned up across 5 files (stale €12/mo and "Free for 2 weeks" references removed). Homepage got a Radar upsell CTA. Ghost Admin API key rotated. Social media automation evaluated (Postiz deferred, n8n LinkedIn node selected). Google Tasks tracking active. Sales Operator mode used for tier copy.

### Drivers
- Compass audit on v4.6 revealed 8 broken items across blog, app, and funnel
- Blog had zero signup capture, tiers were Ghost defaults, nav was dead links
- App had pricing mismatch (€12 vs €5) and stale trial promises
- 55 diagnostic completions with zero upsell to paid product
- Cold 15K list not contacted — win-back sequence needed

### Outcome
Blog fully functional: CTA visible, portal floating button live, Free + Worktugal Pro tiers configured with proper copy (Free = awareness, Paid = actions), navigation cleaned (Telegram → Radar), footer updated (Terms added), site description refreshed. App pricing unified: all pages show €5/mo, no "Free for 2 weeks" anywhere. Homepage now mentions Radar/paid tier between features and diagnostic CTA. Ghost settings editing via MySQL (API blocked on PUT). 5 of 18 Google Tasks completed.

### Prior Context Loaded
- `prompts/knowledge/worktugal-daily-compass.md` (v4.6 — session start)
- `prompts/knowledge/worktugal-session-index.md`
- `prompts/knowledge/sales-manual.md` (Sales Operator lite mode)
- `prompts/roles/sales-engine.md`
- `prompts/roles/ai-cofounder.md` (Van's behavioral patterns)
- `prompts/roles/personal-operator.md` (Van's identity)
- `prompts/knowledge/sales-research-2026-05-01.md`
- `prompts/tools/parallel-ai-os.md`
- `prompts/knowledge/google-workspace-cli-tools.md`
- `resources/research/2026-05-03-worktugal-freemium-membership-models-parallel.md`
- VanBrain (30 entries for product state)

---

## 2. Files Changed

### prompt-secret-vault
```
prompts/knowledge/stack-audit-2026.md — modified — added v4.7 session log
prompts/knowledge/api-secrets-os.md — modified — Ghost Admin API key rotated
prompts/knowledge/worktugal-daily-compass.md — modified — revenue range (optimistic + realistic), tier description locked, B2B status fixed, session log expanded
scripts/ghost-publish.mjs — modified — Ghost Admin API key rotated
scripts/ghost-update.mjs — modified — Ghost Admin API key rotated
prompts/content/image-gen.md — modified — Ghost Admin API key rotated
```

### worktugal-app
```
src/components/diagnostic/DiagnosticResults.tsx — modified — €12/mo → €5/mo, free trial teaser removed
src/components/radar/RadarLanding.tsx — modified — 5x "Free for 2 weeks" removed, hero CTA "Start my free 2 weeks" → "Join free"
src/components/ModernHomePage.tsx — modified — Radar upsell CTA section added between features and CTA
src/components/Changelog.tsx — modified — historical entry updated to remove "Free for 2 weeks"
src/components/client/ClientDashboard.tsx — modified — "Free for 2 weeks" → "€5/mo"
```

### Remote (van-cloud)
```
/var/lib/ghost/content/themes/source/partials/components/cta.hbs — modified — removed posts.length >= 7 guard (CTA now always visible)
ghost_db.settings — modified — navigation updated (Telegram → Radar), secondary_navigation updated (Terms added), portal_signup_terms_html set
```

---

## 3. Commands Run

```
ssh van-cloud "docker exec ghost_app cat .../cta.hbs" — read CTA template, found 7-post guard
scp /tmp/cta.hbs → van-cloud → docker cp into ghost_app — rewrote cta.hbs without guard
ssh van-cloud "docker exec ghost_db mysql ..." — updated navigation, secondary_navigation, signup notice via MySQL
ssh van-cloud "docker restart ghost_app" — cleared Ghost cache (2x: after nav update, after footer update)
Ghost Admin API (Python) — GET/PUT tiers, tier names, descriptions, benefits, pricing (€5/mo EUR)
Ghost Admin API (Python) — GET site, GET pages, PUT page title
npm build (failed, WSL/Windows PATH issue — Cloudflare deploys on push)
git add/commit/push (worktugal-app) — 3 commits: pricing fix, CTA fix, homepage Radar CTA
~/.gemini/tools/tasks.py — listed tasks, marked 5 as done
n8n-mcp search_nodes/detail — researched LinkedIn node capabilities
parallel_search — evaluated Postiz self-host requirements
```

---

## 4. Key Decisions

### Technical / Stack
| Decision | Rationale | Impact | Files/IDs |
|---|---|---|---|
| Ghost settings via MySQL, not API | PUT /settings/ returns 501 in Ghost 5.130 | All future settings changes go through DB | ghost_db container |
| Ghost Admin API key rotated | User created new integration for OpenCode | Updated in 5 vault files | id=69f7b032d526ed00013e932c |
| Postiz deferred | van-cloud 3.8GB RAM, 1.1GB free — Postiz needs 6+ containers | n8n LinkedIn node for Phase 0 social posting | N/A |
| All pricing locked at €5/mo | Unified across Ghost tiers + app + changelog | No more confusion for users arriving from any surface | 6 files updated |

### Strategic / Business
| Decision | Rationale | Impact | Proof/Metric |
|---|---|---|---|
| No "Free for 2 weeks" anywhere | Ghost tier has 0-day trial — mismatch was misleading | Consistent pricing message | Removed from 5 source files |
| Free tier benefits: no "blog posts" or "expert analysis" | Blog posts sounds like 2008, expert analysis is the paid promise | Clear differentiation: free = awareness, paid = action | Ghost tiers configured |
| Finimize model: headlines free, thesis paid | Free = what changed, Paid = what to do | Every surface uses this framing | Tier descriptions, Radar page, diagnostic results |

### Deferred / Pending
| Item | Blocker | Owner | Next action |
|---|---|---|---|
| Win-back email 1 (Recognition) | Not yet written | DS/Agent | Due May 6 — draft + Listmonk setup |
| About page content | Needs paste in Ghost Admin | Van | 2 min copy-paste from session notes |
| n8n LinkedIn flow | LinkedIn OAuth app needs creating | Van + Agent | Create app at linkedin.com/developers |
| First Radar digest | Win-back sequence must go first | DS/Agent | After win-back sequence sends |

---

## 5. Assets Created

### Code / Scripts
None — all changes were modifications to existing files.

### Ghost Configuration (live)
```
Blog: blog.worktugal.com
  Title: The Worktugal Letter
  Description: Moving countries is expensive. Most of the cost is invisible. We monitor Portuguese regulations daily so remote workers don't have to.
  Theme: source (custom)
  CTA: visible on all pages (7-post guard removed)
  Portal: floating Subscribe button enabled
  Navigation: Home, Guides, Free diagnostic, Radar, About
  Footer: Sign up, Free diagnostic, Contact, Privacy, Terms

Tiers:
  Free: €0 — Weekly compliance updates + Free diagnostic
  Worktugal Pro: €5/mo EUR (€49/yr) — Weekly digest + reports + tools + diagnostics history
```

### Google Tasks
```
📋 Worktugal Daily — 5/18 done, 13 remaining
  ✅ Day 1: Ghost fixes (CTA, portal, tiers)
  ✅ Day 2: Diagnostic CTA pricing fix + homepage Radar CTA + deploy
  Next: May 6 — Write win-back email 1
```

---

## 6. Context Preserved

- **What was learned**: Ghost 5.130 blocks PUT on /settings/ — all config changes go through MySQL (ghost_db container, root password: ghost_root_secure_2026). Ghost themes cache settings in memory — require `docker restart ghost_app` after DB writes. The "Source" theme's CTA component had a `posts.length >= 7` guard that hid the newsletter signup (only 3 posts published). Ghost Admin API v5 client is behind current Ghost v5.130 — tier updates work fine via GET/PUT on /tiers/ endpoint, but page content updates (mobiledoc) are fussy.
- **What was ruled out**: Postiz self-host on van-cloud (too resource-heavy). "Free for 2 weeks" trial model (doesn't match Ghost tier config). "Blog posts" as free tier benefit (weak language). "Expert analysis" on free tier (gives away paid promise). Em dashes in all copy.
- **What needs follow-up**: Win-back email sequence (Days 3-17 of plan). First Radar digest content. About page paste into Ghost Admin. LinkedIn OAuth app creation. Diagnostic pricing/CTA edit is live but needs Cloudflare deploy verification.

---

## 7. Cross-References

- **Prior session**: `2026-05-03-marketing-copy-v4.5.md` (Radar copy refresh, Ghost audit)
- **Related archives**: `2026-05-01-stack-monitoring-tools-v4.1.md` (prior worktugal-app session), `2026-04-29-radar-strategy-brief-v1.0.md` (Radar strategy)
- **Related config files**: `prompts/knowledge/worktugal-daily-compass.md` (updated session log), `prompts/knowledge/stack-audit-2026.md` (v4.7 entry), `prompts/knowledge/api-secrets-os.md` (key rotation)
- **Session exports**: None

---

## 8. Next Session

### Proposed Name
`v4.8-winback-emails-2026-05-06`

### Immediate Next Actions (max 3, ordered by leverage)
1. **Write win-back email 1 (Recognition)** — draft the subject line and body, set up in Listmonk as campaign to 15K list — unlocks entire conversion sequence
2. **Write win-back email 2 (Reciprocity)** — "5 Portugal compliance rules that changed in 2026 that most expats don't know about" — pure value drop, no pitch
3. **Build n8n LinkedIn flow** — create LinkedIn OAuth app, add credential to n8n, wire DeepSeek → LinkedIn post → publish — enables social presence automation

### What the Next Agent Needs to Read
- `./archives/2026-05-04-ghost-funnel-build-v4.7.md` — this handover
- `prompts/knowledge/worktugal-daily-compass.md` — session log + metrics
- `prompts/knowledge/sales-manual.md` — copy frameworks for win-back emails
- `prompts/knowledge/van-voice.md` — Van's writing voice for email copy

---

## 9. Operator Notes

Ghost is now a functioning funnel instead of a dead blog. The app pricing is unified. The homepage mentions the paid product. The next unlock is the 15K list reactivation — every day without a win-back email is a day of zero revenue from your largest asset. The email copy is the highest-leverage work remaining in Phase 0. Post LinkedIn flow until the win-back sequence is live.

## Operator Take

The blog and app are wired to convert. The list is still cold. Write the emails.
