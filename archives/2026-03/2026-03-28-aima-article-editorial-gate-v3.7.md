# Session Handover: 2026-03-28-aima-article-editorial-gate-v3.7

---

## 1. Thread Overview

This session continued from the v3.6 archive (2026-03-27 landing and B2B signals). Primary work: completing and publishing the AIMA residence card delay article, running a full SEO audit, building an automated editorial gate script, fixing content quality issues (em dashes, title case), distributing the article across Telegram and creating LinkedIn posts, and correcting the Reddit OS to allow links in the body on r/PortugalExpats.

The session also covered a series of strategic and personal conversations: Van's identity as a non-native English speaker using AI, the r/RemotePortugal dormant sub (120 members organic), how to handle gburgwardt's "LLM spam" accusation, the information asymmetry business model vs scammers, and a framework for improving Van's content and AI skills.

The editorial gate (pre-publish-check.mjs) is the most durable system asset from this session. It permanently blocks em dashes, title case, AI openers, and banned words before any article reaches Ghost. This solves the recurring quality problem without requiring Van to catch issues manually.

---

## 2. Key Decisions Made

**Technical**

Decision: Build pre-publish-check.mjs as a hard gate before ghost-update.mjs.
Impact: Em dashes, title case, AI openers, and banned words now blocked at publish time. Violations must be fixed or explicitly forced. Eliminates the manual audit step that was failing.
Files: `prompt-secret-vault/scripts/pre-publish-check.mjs`, `prompts/content/blog-engine.md` (updated to wire gate as step 1)

Decision: Fix Reddit OS — links ARE allowed in body on r/PortugalExpats. Markdown hyperlink format only (no bare URLs).
Impact: All future Reddit posts include body link as `[text](url)`. Bare URLs flagged as spammy. r/iwantout distinction documented.
Files: `prompts/content/reddit-portugal-expats-os.md`

Decision: LinkedIn posts always split into personal + company files, each with first comment containing bare URL.
Impact: Consistent format across all articles. First comment pattern matches NISS and EU citizen posts.
Files: Standard: `linkedin-personal.txt` + `linkedin-company.txt` per post folder.

**Strategic**

Decision: r/RemotePortugal (120 members, dormant) is worth reviving — same articles, zero extra work, no Rule 3, no moderation friction.
Impact: Additional distribution channel for every article. Potential 500-1000 members in 60 days of consistent posting.
Proof: 120 organic members without a single post in months.

Decision: Van voice file to be built — a prompt document that gives Claude his actual voice, not just guardrails.
Impact: Reduces formality drift in articles. Prevents the gburgwardt "LLM spam" pattern at source.
Status: Not built yet — deferred to next session.

**Deferred**

Item: Van voice file (van-voice.md)
Blocker: Needs Van's input — phrases, rhythms, example sentences from his own writing
Owner: Van + Claude next session

Item: Fix Make.com "Parallel AI Regulatory Monitor" scenario (crashed Mar 19, dead 9 days)
Blocker: Unknown — needs scenario diagnosis
Owner: Claude

Item: Reply to gburgwardt comment on AIMA Reddit post
Blocker: Van's call on whether to reply
Owner: Van

---

## 3. Assets Created

**Scripts**

Filename: `pre-publish-check.mjs`
Stack: Node.js ESM, no dependencies
Location: `prompt-secret-vault/scripts/pre-publish-check.mjs`
Function: Hard blocks em dashes, title case, AI openers, banned words. Warnings on long sentences, missing FAQ, missing schema, missing CTA. Exit code 1 on failure, 0 on pass. --force flag available for intentional overrides.

**Content**

Article: AIMA approved you. The card never arrived.
Slug: aima-residence-card-delay-portugal
Ghost post ID: 69c7148557a13100019c0c67
Status: Published at https://blog.worktugal.com/aima-residence-card-delay-portugal/
Features: 10 FAQ Q&As in body, JSON-LD (Article + FAQPage + BreadcrumbList), 14 named entities, feature image uploaded

Files in `content/posts/aima-card-delay-2026-03-27/`:
- article.html (clean, no em dashes, sentence case title, FAQ + schema embedded)
- linkedin-personal.txt (Van's voice, first person, "Link in first comment")
- linkedin-company.txt (Worktugal brand, stats-forward, "Full breakdown in first comment")
- distribution.txt (Reddit post with hyperlinked body link + Telegram post)
- featured-image-blog.png (cream background, editorial illustration)
- featured-image-social.png (dark green, white headline)

**Prompt Updates**

blog-engine.md: Pre-publish gate added as mandatory step 1 in publish workflow. Four-step sequence documented.
reddit-portugal-expats-os.md: Links in body rule corrected. Markdown hyperlink format enforced. r/iwantout distinction added.
content-distribution-stack.md: (Referenced, not modified this session)

**Memory**

reference_telegram.md: Two-bot architecture documented. WORKTUGAL_BOT_TOKEN location and @worktugal channel ID stored. Prevents future search for credentials.

**Research**

research/outputs/aima-card-delay-2026-03-27.md: Parallel AI pro-fast output (6m30s). Key facts used: 4-12 week wait, €28.50 CTT fee, IRN handles majority of renewals, airlines deny boarding.

**Changelog**

Supabase project_changelog: v3.7 entry inserted (category: content).

---

## 4. Pending or Next Steps

**Growth / Content**

Action: Post AIMA article to r/PortugalExpats using Reddit post from distribution.txt
Channel: r/PortugalExpats (u/iamvandevo)
CTA: Hyperlinked body link to blog article
Distribution path: Reddit post body

Action: Post AIMA article to LinkedIn — personal + company
Channel: Van's personal profile + Worktugal page
CTA: First comment with article URL
Distribution path: linkedin-personal.txt + linkedin-company.txt

Action: Post AIMA article to r/RemotePortugal
Channel: r/RemotePortugal (owned sub, 120 members)
CTA: Direct link, no Rule 3 friction
Distribution path: Same content as r/PortugalExpats post

Action: Reply to gburgwardt comment on AIMA post
Channel: r/PortugalExpats
CTA: "The April 15 2026 extension and the 28.50 EUR CTT collection fee (Portaria 307/2023) are both current. What's out of date?"
Decision: Van's call on whether to engage

Action: Build van-voice.md
Channel: prompt-secret-vault/prompts/knowledge/van-voice.md
CTA: Van provides 5-10 sentences from his own writing + phrases he uses + things that sound wrong
Distribution path: Loaded at start of every writing session

Action: D7 renewal documents article (article 3 in content queue)
Channel: Blog + Reddit + LinkedIn
Research needed: parallel-cli TPP prompt required
Status: Not started

**Ops / System**

Action: Fix Make.com Parallel AI Regulatory Monitor scenario (crashed Mar 19)
Dependency: Scenario diagnosis — check Make.com scenario 8891111 status
Owner: Claude

Action: Review GitHub Dependabot vulnerabilities (2 high, 4 moderate)
Dependency: gh security list or GitHub UI
Owner: Claude

Action: Remove Deel March 31 urgency line from NISS article and EU citizen article after 2026-03-31
Dependency: Date trigger
Owner: Claude (auto on next session after Mar 31)

**B2B**

Action: Send DM to Natacha Branquinho (Orien Law Firm)
Draft: Ready in eu-citizen-checklist-2026-03-26/linkedin-replies.txt
Owner: Van

Action: Send DM to Marielle Burti (IMMIGRANT INVEST)
Draft: Ready in eu-citizen-checklist-2026-03-26/linkedin-replies.txt
Owner: Van

Action: Reply to Susan Carlo on LinkedIn NISS post
Draft: Ready in niss-2026-03-25/linkedin-replies.txt
Owner: Van

---

## 5. Audit Checks

Indexing: Crawler Hints (IndexNow) active — AIMA article auto-submitted on publish. GSC sitemaps live.
Schema: Article + FAQPage + BreadcrumbList JSON-LD embedded in article HTML. Not yet verified via Google Rich Results test.
Performance: No performance work this session.
Links: Blog article link confirmed live. Telegram message ID 11 confirmed delivered.
Seven day metrics: Track AIMA article Reddit views, upvotes, blog clicks from Reddit, and Telegram opens vs NISS benchmarks (9.9K Reddit views, 44 Telegram subscribers).

---

## Operator Notes

The pre-publish gate is the highest-leverage system output from this session. It converts a recurring manual failure into a permanent automated check. Every future article benefits without additional effort. The Reddit OS correction (links allowed in body, hyperlink format) and LinkedIn format standardization (personal + company + first comment) mean distribution is now consistent and replicable across all articles.

The van-voice.md project is the most important deferred item. It is the difference between content that passes the editorial gate and content that feels distinctly Van. The gburgwardt incident was a presentation problem, not a substance problem. Voice file solves it at source.

r/RemotePortugal at 120 organic members is an underused asset. One post per article, zero friction, owned channel. Activate immediately.

The B2B DMs to Natacha and Marielle are sitting unsent. Both connected organically. Both represent direct referral pipeline access. The longer those sit, the colder they get.

---

## Operator Take

The editorial gate and content system are now production-grade — the infrastructure is no longer the bottleneck, execution velocity and Van's voice consistency are.

---

Context secured. You may now clear the chat.
To resume: run /daily — or paste this into a new thread:
> Load [./archives/2026-03-28-aima-article-editorial-gate-v3.7.md] and resume from the Operator Take.
