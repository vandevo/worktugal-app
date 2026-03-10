---
name: DiagnosticForm UX Fix
overview: "Three targeted fixes to DiagnosticForm.tsx: one question per page (from 4), question text styled as a large readable heading instead of a tiny uppercase label, and the email gate preview list updated to reflect v2.6 full free results."
todos:
  - id: one-per-page
    content: Change QUESTIONS_PER_PAGE from 4 to 1.
    status: completed
  - id: question-heading
    content: Restyle question label from tiny uppercase label to large serif heading (text-xl sm:text-2xl font-serif text-white).
    status: completed
  - id: email-gate-copy
    content: Update the 4 bullet items in the email gate preview list to reflect v2.6 full free results (add legal citations and penalty ranges, remove stale copy).
    status: completed
  - id: commit-push
    content: Commit and push to origin/main.
    status: in_progress
isProject: false
---

# DiagnosticForm UX Fix

## File changing

`[src/components/diagnostic/DiagnosticForm.tsx](src/components/diagnostic/DiagnosticForm.tsx)` only.

## Three changes

### 1. One question per page

Change `QUESTIONS_PER_PAGE = 4` to `QUESTIONS_PER_PAGE = 1`.

No logic changes needed. The existing pagination, progress bar calculation, `isPageComplete`, `handleNextPage`, and `handlePreviousPage` all work correctly with any value of `QUESTIONS_PER_PAGE`. Setting it to 1 means each screen shows one question, one set of answer buttons, and one Next button. The user taps an answer and immediately sees the Next button activate -- no scrolling, instant feedback.

The progress bar already calculates based on answered questions out of total, not pages, so it will still show smooth progress.

### 2. Question text as a readable heading

Change:

```tsx
<label className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-2">
  {question.text}
</label>
```

To:

```tsx
<h3 className="text-xl sm:text-2xl font-serif text-white mb-3 leading-snug">
  {question.text}
</h3>
```

The question is the most important thing on the screen. It should read like a sentence, not a form field label. Font size matches the conversational tone of the form. `font-serif` matches the design system used across the app (results page headings, homepage headings).

The description line below it stays as-is (`text-[11px] text-gray-600`) -- that is the right treatment for supplementary context.

### 3. Email gate preview list updated for v2.6

Replace the 4 bullet items in the email gate "Your free results include" box:

Current (stale, undersells):

- Setup Score and Exposure Index
- Top compliance risks identified
- Risk severity classification
- Personalized action steps

New (accurate, matches v2.6 reality):

- Setup Score and Exposure Index
- All compliance risks detected, including severity
- Legal basis and penalty ranges for each risk
- Official source citations you can verify yourself

No structural changes to the email gate section. Only the list content changes.

## What is NOT changing

- `QUESTIONS_PER_PAGE` logic, pagination state, progress bar calculation
- `AnimatePresence` transitions
- Navigation buttons (Back / Next / Get My Results)
- Email field, name/phone fields, checkboxes
- The analyzing screen
- The `renderQuestionInput` function (option buttons stay identical)
- Overall card layout and Tailwind classes

