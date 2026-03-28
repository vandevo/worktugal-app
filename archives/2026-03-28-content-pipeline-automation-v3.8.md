# Session Handover: 2026-03-28-content-pipeline-automation-v3.8

---

## 1. Thread Overview

This session resumed from the v3.7 archive (AIMA article + editorial gate). Primary work: confirming AIMA article distribution status, posting batch 1 Reddit replies, patching the article (v1.1) with dutchyardeen's distribution route correction, and pushing the fix live to Ghost. The session then shifted to building the automated content pipeline: three new scripts (gemini-draft.mjs, parallel-research.mjs, telegram-post.mjs), a new /new-article slash command, and blog-engine.md v3.2 with the full workflow sequence and naturalness pass rules.

The Gemini model was confirmed as 3.1 Pro (not 2.5 Pro as previously assumed) via Context7 and the DeepMind product page. The Parallel AI CLI was confirmed as always run by Claude — a recurring assumption failure now fixed in memory. The Telegram bot credentials were confirmed in .env and tested successfully (message ID 12 posted to @worktugal).

The content pipeline is now fully automated from /new-article command to Ghost publish and Telegram post, with two approval gates only: BRIEF.md and article.html. Reddit and LinkedIn remain manual.

---

## 2. Key Decisions Made

**Technical**

Decision: Build three automation scripts to close the content pipeline loop.
Impact: /new-article [topic] → research → Gemini draft → Claude review → gate → Ghost push → Telegram post. Van approves BRIEF.md and article.html only. Zero other input required.
Files: scripts/gemini-draft.mjs, scripts/parallel-research.mjs, scripts/telegram-post.mjs

Decision: blog-engine.md updated v3.1 → v3.2 with mandatory workflow sequence and naturalness pass.
Impact: Article production order is now locked: Parallel AI research finishes first, Gemini 3.1 Pro drafts, Claude reviews, naturalness pass, gate, push. The naturalness pass catches register issues the formatting gate misses.
Files: prompts/content/blog-engine.md

Decision: AIMA article patched v1.0 → v1.1 with dutchyardeen's card distribution route correction.
Impact: Article now correctly documents INCM → AIMA district office → CTT flow. If CTT returns card, it sits at the district AIMA office, not a CTT branch. Pushed to Ghost.
Files: content/posts/aima-card-delay-2026-03-27/article.html

Decision: /new-article slash command built at ~/.claude/commands/new-article.md.
Impact: Single command kicks off full article setup: folder creation, BRIEF.md, Parallel AI research prompt, all placeholder files, INDEX.md queue update. Replaces all manual coordination.
Files: ~/.claude/commands/new-article.md

Decision: Parallel AI CLI confirmed as always run by Claude — saved to memory permanently.
Impact: Will no longer be described as a manual step. reference_parallel_ai.md added to memory index.
Files: memory/reference_parallel_ai.md, memory/MEMORY.md

**Strategic**

Decision: B2B employer liability article is article 4 (not 3 as previously noted in queue).
Impact: INDEX.md corrected. NISS (1), EU citizen checklist (2), AIMA card delay (3), B2B employer liability (4).
Proof: Index updated and committed.

Decision: Gemini 3.1 Pro is the confirmed current model (not 2.5 Pro).
Impact: blog-engine.md model_draft set to gemini-3.1-pro-preview. 1M context, 64k output, knowledge cutoff Jan 2025. "Genuine insight over cliche and flattery" — directly relevant to the AI-sounding writing problem.
Proof: Context7 docs + DeepMind product page confirmed.

**Deferred**

Item: van-voice.md — Van's actual voice file for writing sessions.
Blocker: Needs Van's input: 5-10 sentences from his own writing, phrases he uses, things that sound wrong.
Owner: Van provides input, Claude builds from it.

Item: Article 4 — B2B employer liability for foreign companies with Portugal remote workers.
Blocker: Ready to start. Run /new-article to kick off.
Owner: Claude (autonomous), Van approves two gates.

Item: EoR referral CTA on NISS article.
Blocker: No blocker. Next revenue surface logged in product signals.
Owner: Claude on next article session.

Item: Remove Deel March 31 urgency line from NISS + EU citizen articles.
Blocker: Date trigger — remove after 2026-03-31.
Owner: Claude (auto on next session after Mar 31).

Item: Make.com Parallel AI Regulatory Monitor scenario 8891111 (crashed Mar 19).
Blocker: Needs diagnosis.
Owner: Claude.

Item: Reply to gburgwardt on Reddit — no new response from gburgwardt after Van's factual challenge.
Blocker: Van's call on whether to re-engage.
Owner: Van.

---

## 3. Assets Created

**Scripts**

Filename: gemini-draft.mjs
Stack: Node.js ESM, @google/genai SDK
Location: prompt-secret-vault/scripts/gemini-draft.mjs
Function: Reads BRIEF.md + research/output.md + blog-engine.md. Calls gemini-3.1-pro-preview with full system prompt and user brief. Saves raw output to article-draft.md. maxOutputTokens: 64000, temperature: 0.7.

Filename: parallel-research.mjs
Stack: Node.js ESM, spawns parallel-cli subprocess
Location: prompt-secret-vault/scripts/parallel-research.mjs
Function: Runs parallel-cli research run -f <prompt-file> --processor ultra --timeout 900. Saves output to specified output file with timestamp header.

Filename: telegram-post.mjs
Stack: Node.js ESM, native fetch, Telegram Bot API
Location: prompt-secret-vault/scripts/telegram-post.mjs
Function: Reads distribution.txt or telegram.txt, extracts TELEGRAM POST section, posts to @worktugal via WORKTUGAL_BOT_TOKEN. Tested: message ID 12 confirmed delivered.

**Commands**

Filename: new-article.md
Location: ~/.claude/commands/new-article.md
Function: Full article setup command. Creates post folder, BRIEF.md, research/parallel-ai-prompt.md, all placeholder files, CHANGELOG.md. Updates INDEX.md queue. Runs full pipeline after approval gates: parallel-research → gemini-draft → Claude review → naturalness pass → gate → ghost-update → telegram-post.

**Prompt updates**

blog-engine.md v3.2: Workflow sequence section added (mandatory order: research → Gemini draft → Claude review → naturalness pass → gate → push). Naturalness pass section with specific rewrite rules. model_draft: gemini-3.1-pro-preview, model_review: claude-sonnet-4-6.

content.md (BLOG mode): Simplified to point to /new-article command. Mid-article flow documented separately.

**Content**

Article patch: AIMA card delay v1.1 — distribution route corrected, dateModified updated, version stamp added. Live at https://blog.worktugal.com/aima-residence-card-delay-portugal/

Reddit replies: posts/aima-card-delay-2026-03-27/reddit-replies.txt — Batch 1, 6 replies (dutchyardeen, Bright-Heart-8861, findingniko_, smella99, Equal-Reception2704, Wandering_dreamer000). All posted 2026-03-28.

**Memory**

reference_parallel_ai.md: Parallel AI CLI documented as Claude-run tool. Never manual. Commands, processor tiers, key location all documented.

---

## 4. Pending or Next Steps

**Cashflow**

Action: Add EoR referral CTA to NISS article.
Owner: Claude.
Dependency: None.
Success metric: Click-through from NISS article to Deel affiliate link within 7 days.

Action: Send B2B DMs to Natacha Branquinho (Orien Law Firm) and Marielle Burti (IMMIGRANT INVEST) on LinkedIn.
Owner: Van.
Deadline: Today — cold lead window closing.
Success metric: Reply or connection accepted within 72 hours.

**Ops / System**

Action: Run /new-article for article 4 — B2B employer liability.
Owner: Claude (automated), Van approves BRIEF.md + article.html.
Dependency: None — pipeline fully operational.

Action: Fix Make.com scenario 8891111 (Parallel AI Regulatory Monitor, crashed Mar 19).
Owner: Claude.
Dependency: Scenario diagnosis first.

Action: Remove Deel March 31 urgency line from NISS + EU citizen articles after 2026-03-31.
Owner: Claude (date trigger).
Deadline: 2026-04-01.

**Growth / Content**

Action: Post AIMA article to r/RemotePortugal (owned sub, 120 members, no Rule 3).
Owner: Van.
CTA: Same content as r/PortugalExpats post.
Distribution: distribution.txt Reddit section.

Action: Pull 24h stats for AIMA article from Reddit (posted late night 2026-03-27).
Owner: Van.
Distribution: Update INDEX.md stats row.

Action: Build van-voice.md.
Owner: Van provides 5-10 sentences from own writing + phrases + things that sound wrong. Claude builds from that.
Dependency: Van's input.

**Strategy**

Action: Decide whether B2B article implies a product offer (compliance check, diagnostics for HR teams).
Hypothesis: Foreign companies with Portugal remote workers are exposed to backdated Segurança Social contributions. The article creates inbound. The question is what it sends them to.
Proof to collect: LinkedIn engagement on employer-liability framing before deciding on offer.

---

## 5. Audit Checks

Indexing: Crawler Hints (IndexNow) active — AIMA article auto-submitted on publish. AIMA v1.1 update pushed to Ghost — dateModified updated to 2026-03-28, will trigger recrawl.
Schema: Article + FAQPage + BreadcrumbList JSON-LD confirmed in AIMA article. dateModified patched to 2026-03-28.
Performance: No performance work this session.
Links: AIMA article v1.1 live at https://blog.worktugal.com/aima-residence-card-delay-portugal/. Telegram message ID 12 confirmed delivered.
Seven day metrics: Track AIMA article Reddit views, upvotes, blog clicks. Benchmark: NISS (18K views), EU citizen (47K views). AIMA is at 9.3K after 20 hours — lower ratio (58.1%) due to LLM accusations as top comments.

---

## Operator Notes

The content pipeline is now a system, not a workflow. Three new scripts close the last automation gaps: Parallel AI runs autonomously, Gemini drafts from research output, Telegram posts immediately after Ghost push. Van's two gates — BRIEF.md approval and article.html approval — are the only manual touchpoints in the entire process. The /new-article command is the single entry point.

The Parallel AI assumption failure (repeatedly describing it as manual when Claude installed and runs it) is now corrected in memory. This was the third time it surfaced. Memory entry is durable across sessions.

The AIMA article is underperforming relative to NISS and EU citizen — 9.3K views vs 47K at comparable age. The 58.1% upvote ratio is being dragged by LLM accusations at the top of the thread. Batch 1 replies are posted and include direct factual challenges. The dutchyardeen correction converted a public critique into a documented article update — the right response. The ratio issue is a presentation problem that van-voice.md will address structurally across all future articles.

B2B article 4 is ready to start. The signal is clear (Humble_Ostrich_4610, backdated employer contributions) but the product question is open: what does the article send HR teams to? That decision gates how the CTA is written. Start the article now, decide the offer before Gate 2.

---

## Operator Take

The pipeline is built and tested — every article from here ships faster, sounds better, and reaches @worktugal automatically. The bottleneck moved from infrastructure to Van's two approval decisions.

---

Context secured. You may now clear the chat.
To resume: run /daily — or paste this into a new thread:
> Load [./archives/2026-03-28-content-pipeline-automation-v3.8.md] and resume from the Operator Take.
