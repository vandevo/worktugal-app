# Session Handover: 2026-03-28-ses-credential-rotation-v3.8

---

## 1. Thread Overview

This session was a continuation of the same day (v3.8 content pipeline session). Primary work was an unexpected security incident: AWS SES had paused sending on account 145503175774 due to a credential compromise. The case (ID: 177468550000645) was resolved by AWS mid-session — sending reinstated in us-east-1. Van received the resolution email and AWS Health Event notification in real time.

The session covered diagnosing the impact on Listmonk (confirmed: Listmonk uses SES as its SMTP backend for all campaign delivery), creating new SES SMTP credentials via the correct AWS flow (SES SMTP credentials, not raw IAM access keys), updating Listmonk at mail.worktugal.com with the new credentials, confirming connection works, and saving the new credentials to the local .env. The old compromised key deletion was flagged as a required pending action.

The session also included a brief explanation of what .env files are and why they are used throughout the stack.

---

## 2. Key Decisions Made

**Technical**

Decision: Create new SES SMTP credentials via the SES-specific flow (not raw IAM access keys).
Impact: Listmonk campaign delivery restored. The initial attempt used raw IAM access keys which produce a 535 auth error with SES SMTP — correct flow is AWS Console → SES → SMTP settings → Create SMTP credentials.
Files: .env updated with SES_SMTP_USERNAME and SES_SMTP_PASSWORD

Decision: New IAM user named ses-smtp-listmonk (not the auto-generated ses-smtp-user.20260329 name).
Impact: Clear naming prevents future confusion between SES users. Added to AWSSESSendingGroupDoNotRename group with AmazonSESFullAccess.
IAM user: ses-smtp-listmonk | Access Key ID: AKIASDYFKIRPELYJQ3MJ

Decision: SES SMTP credentials saved to .env with rotation date and context comment.
Impact: Future rotations will have a clear record of when and why the last rotation happened.
File: /home/vandevo/projects/worktugal-app/worktugal-app/.env

**Deferred**

Item: Delete old compromised SES IAM user and access key from AWS IAM.
Blocker: Van needs to identify the old user in IAM console and delete it.
Owner: Van — do this before next session.

Item: Identify root cause of credential compromise — where the old key was exposed.
Blocker: Needs IAM access history audit and repo scan for committed credentials.
Owner: Claude can assist — run on next session.

Item: Send test campaign from Listmonk to confirm end-to-end delivery working.
Blocker: None.
Owner: Van.

---

## 3. Assets Created

**Credentials rotated**

Service: Amazon SES SMTP
Old user: Unknown (compromised — delete from IAM)
New IAM user: ses-smtp-listmonk
New SMTP username: AKIASDYFKIRPELYJQ3MJ
Rotation date: 2026-03-28
Rotation reason: Credential compromise — AWS paused account sending, case 177468550000645
Listmonk config: Updated at mail.worktugal.com/admin/settings — connection test passed

**Files updated**

.env: SES_SMTP_USERNAME + SES_SMTP_PASSWORD added with rotation date comment.
Location: /home/vandevo/projects/worktugal-app/worktugal-app/.env

---

## 4. Pending or Next Steps

**Security — do before anything else**

Action: Delete the old compromised SES IAM user and access key from AWS IAM console.
Owner: Van.
Deadline: Before next send — old key is still active and usable by whoever compromised it.

Action: Audit repos and logs for the exposed credential — find how it leaked.
Owner: Claude (run repo scan on next session).
Dependency: None.

Action: Check .gitignore on all projects to confirm .env is listed.
Owner: Claude.
Dependency: None.

**Email / Campaigns**

Action: Send a test campaign from Listmonk to confirm delivery end-to-end.
Owner: Van.
Success metric: Email received in inbox, not spam.

Action: Check if any scheduled campaigns failed during the SES pause period (check Listmonk campaign logs).
Owner: Van or Claude.

**Carry-forward from v3.8**

Action: Run /new-article for article 4 — B2B employer liability for foreign companies with Portugal remote workers.
Owner: Claude (automated), Van approves two gates.

Action: Remove Deel March 31 urgency line from NISS + EU citizen articles after 2026-03-31.
Owner: Claude (date trigger — 3 days).

Action: Build van-voice.md — needs Van's input: 5-10 sentences from own writing.
Owner: Van provides input, Claude builds.

Action: Delete old compromised SES key from IAM.
Owner: Van.

Action: Send B2B DMs to Natacha Branquinho and Marielle Burti on LinkedIn.
Owner: Van.

---

## 5. Audit Checks

Indexing: No changes this session.
Schema: No changes this session.
Performance: No changes this session.
Links: Listmonk at mail.worktugal.com confirmed reachable (HTTP 200). SMTP connection test passed after new credentials applied.
Seven day metrics: Monitor Listmonk delivery rates after rotation. Watch for any bounce spike or spam folder placement caused by the compromise period.

---

## Operator Notes

The SES compromise was low damage — AWS caught it, paused sending proactively, and reinstated within hours. The real risk is the old key is still active in IAM. Until Van deletes it, whoever compromised it can still attempt to use it. That is the single most important action from this session. The root cause (where the key leaked from) is unknown and needs a repo audit — a committed .env or credentials in a third-party tool are the most likely sources. Claude can run a scan next session.

Listmonk is operational. Campaigns can resume once Van confirms with a test send. The content pipeline built in v3.8 is unaffected.

---

## Operator Take

The SES incident is contained but not closed — the old compromised key is still live in IAM and needs to be deleted today before anything else.

---

Context secured. You may now clear the chat.
To resume: run /daily — or paste this into a new thread:
> Load [./archives/2026-03-28-ses-credential-rotation-v3.8.md] and resume from the Operator Take.
