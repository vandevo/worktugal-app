# README Update Helper Prompt

**Quick Reference for Updating Project Documentation**

---

## For Quick Updates (Use This First)

Simply paste this to Claude:

```
Update README.md with recent changes. Follow these steps:

1. Scan supabase/migrations/ folder for any migrations from the last 30 days
2. Check project_changelog table in Supabase for logged changes
3. Analyze recent changes to src/ components and features
4. Update the "Last Updated" date to today (YYYY-MM-DD format)
5. Add new entries to "Recent Updates" section in chronological order
6. Add any new features to "Key Features" section if major additions
7. Update database schema section if tables were added/modified
8. Preserve all existing content and structure

Today's date: [INSERT TODAY'S DATE]
```

---

## For Complete README Regeneration

If you need to rebuild the entire README from scratch (rare), use the full monster prompt from `.bolt/prompt` or docs folder.

---

## Changelog System

### Option 1: Log Changes as You Work (Recommended)
1. Go to `/admin/changelog` in the app
2. Click "Log Change"
3. Fill out the form:
   - **Date**: When the change was made
   - **Category**: feature, fix, database, ui, integration, security, performance, content, docs
   - **Title**: One-line description
   - **Details**: Technical explanation
   - **Affected Files**: List of changed files (one per line)
   - **Migration Files**: Database migration names if applicable
4. Save

### Option 2: Use the README Generator Script
Run this command:
```bash
npm run generate-readme
```

This will:
- Scan recent migrations (last 30 days)
- Pull changelog entries from database (last 90 days)
- Generate README_UPDATES.md file with formatted changes
- Prompt you to review and merge into README.md

### Option 3: Just Prompt Claude
```
I made these changes:
- [describe your changes]

Update the README please.
```

---

## What Gets Updated in README

### Always Update:
- **Last Updated** date at top
- **Recent Updates** section (chronological, most recent first)
- **Key Features** section (if major new features)

### Sometimes Update:
- **Database Schema** section (if tables/fields changed)
- **Tech Stack** section (if dependencies changed)
- **Project Structure** section (if major reorganization)
- **Webhook Integrations** section (if new webhooks added)

### Rarely Update:
- Project Overview (unless mission/audience changes)
- Development Setup (unless setup process changes)
- Governance & Safety (unless policies change)

---

## README Format Rules

- Use **absolute dates** (2025-11-06) not relative dates ("last week")
- Use **chronological order** (newest first) in Recent Updates
- Use **bullet points** for lists
- Include **file paths** for code references
- Use **YYYY-MM-DD** format for all dates
- Keep **technical specifics** (table names, field names, migration files)
- **No emojis** in formal documentation
- **No corporate jargon** without plain-language explanation

---

## Quick Changelog Categories

- **feature**: New user-facing functionality
- **fix**: Bug fixes and corrections
- **database**: Schema changes, migrations, RLS updates
- **ui**: Design changes, styling, UX improvements
- **integration**: Webhooks, APIs, third-party services
- **security**: Security fixes, RLS hardening, vulnerability patches
- **performance**: Speed improvements, query optimization
- **content**: Documentation, copy changes, messaging updates
- **docs**: Documentation file changes

---

## Example Update Entry Format

```markdown
**2025-11-06: Title of Change**
- Brief description of what changed
- Technical details (table names, file paths, etc.)
- Why the change was made (optional but helpful)
- Any breaking changes or migration notes
```

---

## Backup Your README

Before major updates, save a copy:
```bash
cp README.md README.backup.md
```

Or commit to git first (changes are auto-committed in this environment).

---

## Need Help?

**Simple prompt:** "Update README with recent changes"

**Detailed prompt:** "I added [feature X] which required [technical details]. Update README sections: Key Features, Recent Updates, and Database Schema."

**Emergency:** "README is outdated. Scan migrations and changelog table, regenerate Recent Updates section."

---

**Last Updated:** 2025-11-06
