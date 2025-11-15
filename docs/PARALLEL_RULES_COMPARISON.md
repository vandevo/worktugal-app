# Parallel Rules vs Current Implementation - Comparison

**Date:** November 15, 2025
**Purpose:** Review before implementing Compliance Engine v2.0
**Data Source:** 11 real user submissions (Nov 7-13, 2025)

---

## Executive Summary

This document compares your current tax checkup logic (based on Perplexity research) with Parallel.ai's verified rule set. The upgrade will add **5 critical checks** you're currently missing and update **3 threshold values**.

### What's Changing

| Category | Current State | Parallel Upgrade | Impact |
|----------|--------------|------------------|---------|
| **Rule Count** | 8 red flag checks | 11 comprehensive rule clusters | +3 new rules |
| **VAT Threshold** | €15,000 ✅ | €15,000 ✅ | No change |
| **VAT 125% Rule** | ❌ Missing | ✅ Added | Catches immediate exemption loss |
| **15% Expense Rule** | ❌ Missing | ✅ Added | Feb 25 deadline warning |
| **Economic Dependency** | ❌ Missing | ✅ Added | 50%+ client triggers 7-10% surcharge |
| **SS Deadlines** | "10th-20th monthly" | "Quarterly declarations + monthly payments" | More accurate |
| **Crypto Rules** | ❌ Missing | ✅ Added | 0.15 coefficient, 365-day exemption |
| **NHR/IFICI** | Not covered | ✅ Added | Closed 2024, IFICI successor |
| **ATCUD/QR Invoicing** | ❌ Missing | ✅ Added | €3k-€18.7k penalties |
| **Penalty Accuracy** | Generic ranges | Specific amounts with legal references | More actionable |

---

## Current Implementation Analysis (Based on Real Data)

### Your 11 Real User Submissions Show:

**Critical Gaps (would be caught by Parallel rules):**
- **72.7%** (8/11) haven't opened activity → Your current system catches this ✅
- **72.7%** (8/11) missing VAT registration → Caught, but missing 125% immediate loss rule ⚠️
- **27.3%** (3/11) missing NISS → Caught ✅
- **9.1%** (1/11) missing NIF → Caught ✅

**Your Current System Performance:**
- ✅ **Strong:** Catches fundamental missing registrations (NIF, NISS, Activity)
- ⚠️ **Weak:** Misses deadline-specific warnings (Feb 25 expense, quarterly SS)
- ⚠️ **Weak:** Misses threshold nuances (VAT 125% immediate loss)
- ⚠️ **Weak:** No crypto tax guidance (SP-001)
- ⚠️ **Weak:** No economic dependency check (50%+ single client)

---

## Rule-by-Rule Comparison

### ✅ RULE 1: Tax Residency (REG-001)

**Current:**
```typescript
const isTaxResident = data.months_in_portugal >= 6;
// Critical flag: Tax resident without NIF
penalty: 'AT penalties start at €375, residence renewal may be blocked'
```

**Parallel:**
```typescript
threshold_days: 183 (documented as >6 months ✓)
alternative_criteria: ['Habitual abode', 'Utility bills']
penalties: '€200 - €2,500 + interest on unpaid tax'
```

**Verdict:** ✅ Your logic is correct. Parallel adds more detail on penalties.

---

### ✅ RULE 2: Opening Activity (REG-002)

**Current:**
```typescript
if (data.activity_opened === false && income !== 'under_10k') {
  severity: 'critical'
  penalty: 'Fines start at €500'
}
```

**Parallel:**
```typescript
deadline: 'Before issuing first invoice'
penalties: 'Fines start at €500, can be treated as tax evasion'
exemptions: ['12-month SS exemption if filed before starting']
```

**Verdict:** ✅ Your logic is correct. Parallel adds SS exemption detail.

---

### ⚠️ RULE 3: VAT Exemption (IVA-001)

**Current:**
```typescript
if (hasHighIncome && !has_vat_number) {
  message: 'Income over €15,000 requires VAT'
}
```

**Parallel:**
```typescript
threshold_2025: 15000 ✓
immediate_loss_threshold_multiplier: 1.25
// NEW: If exceed €18,750 (€15k × 1.25), lose exemption IMMEDIATELY
quarterly_filing_start_date: '2025-07-01'
non_eu_exclusion_date: '2025-07-01'
```

**Verdict:** ⚠️ You're missing the **125% immediate loss rule**. This is critical!

**What to add:**
```typescript
// NEW CHECK
if (estimatedIncome > 18750 && has_vat_number === false) {
  severity: 'critical',
  message: 'Income exceeds €15k threshold by >25% - exemption lost IMMEDIATELY',
  actionRequired: 'Register for VAT next month, charge VAT on all invoices',
  deadline: 'Next month'
}
```

---

### ⚠️ RULE 4: Income Tax - 15% Expense Rule (IRS-001)

**Current:**
```typescript
// NOT CHECKED
```

**Parallel:**
```typescript
expense_justification_percentage: 15
expense_justification_deadline: 'February 25th of following year'
fixed_deduction: 4104
impact: '20-30% increase in tax bill if shortfall'
```

**Verdict:** ❌ You're missing this entirely.

**What to add:**
```typescript
// NEW CHECK - Only for users with activity opened
if (activity_opened === true && coefficient === 0.75) {
  severity: 'medium',
  message: '15% of gross income must be justified with documented expenses',
  actionRequired: 'Request NIF on all professional purchases, classify on e-fatura',
  deadline: 'February 25, 2026'
}
```

---

### ✅ RULE 5: Social Security (SS-001)

**Current:**
```typescript
if (isTaxResident && !has_niss) {
  message: 'Register at Segurança Social within 30 days'
  deadline: '30 days from first invoice'
}
```

**Parallel:**
```typescript
standard_rate: 21.4%
quarterly_declaration_deadlines: ['Apr 30', 'Jul 31', 'Oct 31', 'Jan 31']
payment_window: { start_day: 10, end_day: 20 }
first_year_exemption_months: 12
```

**Verdict:** ✅ Your core check is correct. But you say "monthly payment" when it's actually:
- **Quarterly declarations** (last day of Apr/Jul/Oct/Jan)
- **Monthly payments** (10th-20th of following month)

**Clarification needed:**
```typescript
// UPDATE YOUR TEXT
message: 'Declare income quarterly (Apr/Jul/Oct/Jan), pay monthly (10th-20th)'
```

---

### ❌ RULE 6: Economic Dependency (SS-001 extension)

**Current:**
```typescript
// NOT CHECKED
```

**Parallel:**
```typescript
economic_dependency_thresholds: {
  threshold_50_80: { client_contribution: 7% },
  threshold_over_80: { client_contribution: 10% }
}
```

**Verdict:** ❌ You're missing this entirely. **Many freelancers don't know this rule.**

**What to add:**
```typescript
// NEW CHECK
// This requires asking a new question: "What % of income from single largest client?"
if (single_client_percentage > 50) {
  severity: 'high',
  message: 'Economic dependency: >50% income from one client triggers surcharge',
  actionRequired: 'Client must pay extra 7-10% SS contribution on your behalf',
  deadline: 'Declared on annual Annex SS'
}
```

⚠️ **Decision needed:** Do you want to add a new form question about single-client percentage?

---

### ❌ RULE 7: Invoicing Requirements (INV-001)

**Current:**
```typescript
// NOT CHECKED
```

**Parallel:**
```typescript
certified_software_threshold: 50000
mandatory_elements: ['QR Code', 'ATCUD', 'VAT phrase']
atcud_required_since: '2023-01-01'
penalties: '€3,000 - €18,750'
```

**Verdict:** ❌ You're missing this.

**What to add:**
```typescript
// NEW CHECK - Only if high income
if (estimatedIncome > 50000 && activity_opened === true) {
  severity: 'medium',
  message: 'Turnover >€50k requires AT-certified invoicing software',
  actionRequired: 'Switch to certified software (Moloni, Vendus, InvoiceXpress)',
  penalty: '€3,000 - €18,750 for non-compliance'
}
```

---

### ✅ RULE 8: Annual IRS Filing (FILE-001)

**Current:**
```typescript
// You mention "tax filing" generically
```

**Parallel:**
```typescript
form_name: 'Modelo 3'
deadline: 'April 1 - June 30'
penalties: '€200 - €2,500 late filing, 10% to 2x tax owed (cap €55k)'
```

**Verdict:** ✅ You have the concept. Parallel adds specific form name and deadline window.

---

### ❌ RULE 9: Crypto Taxation (SP-001)

**Current:**
```typescript
// NOT COVERED
```

**Parallel:**
```typescript
effective_date: '2023-01-01'
business_income_coefficient: 0.15 (only 15% taxable)
short_term_capital_gains_rate: 28% (if held <365 days)
long_term_exemption_days: 365 (tax-free if held >1 year)
```

**Verdict:** ❌ You're missing this entirely.

**What to add:**
```typescript
// NEW CHECK - Add optional question: "Do you earn crypto income?"
if (has_crypto_income === true) {
  severity: 'medium',
  message: 'Crypto taxable since 2023: 15% taxed as business income or 28% capital gains',
  actionRequired: 'Track all transactions with acquisition/disposal dates',
  exemption: 'Held >365 days = tax-exempt'
}
```

⚠️ **Decision needed:** Do you want to add crypto income question?

---

### ℹ️ RULE 10: NHR Closure (SP-002)

**Current:**
```typescript
// NOT COVERED
```

**Parallel:**
```typescript
regime_name: 'NHR'
status: 'closed'
closure_date: '2024-01-01'
successor: 'IFICI (much more restrictive)'
```

**Verdict:** ℹ️ This is informational. Only relevant for users who ask "Can I get NHR?"

**What to add:**
```typescript
// INFORMATIONAL - Show in results if residency = 'nhr'
if (residency_status === 'nhr') {
  message: 'NHR closed Jan 1, 2024. Existing holders keep benefits for 10 years.'
  alternative: 'New arrivals: Check IFICI eligibility (STEM/research only)'
}
```

---

## Updated User Insights (11 Submissions)

Your `USER_INSIGHTS` object needs updating:

**Current (outdated):**
```typescript
totalSubmissions: 3
missingNIF: 66.7%
missingNISS: 66.7%
noActivityOpened: 100%
```

**New (from real data):**
```typescript
export const USER_INSIGHTS = {
  lastAnalyzed: '2025-11-15',
  totalSubmissions: 11,

  patterns: {
    avgMonthsInPortugal: 9.5,  // Most are tax residents
    missingNIF: 9.1,            // Much better than expected!
    missingNISS: 27.3,          // Still significant
    noActivityOpened: 72.7,     // CRITICAL - most common gap
    noVATRegistration: 72.7,
  },

  workTypes: {
    other: 54.5,
    consultant: 27.3,
    developer: 18.2,
  },

  income: {
    '10k_25k': 54.5,    // Majority in this band
    'under_10k': 27.3,
    '25k_50k': 9.1,
    'over_50k': 9.1,
  },

  residency: {
    citizen: 36.4,
    other: 27.3,
    resident: 18.2,
    digital_nomad_visa: 9.1,
    tourist: 9.1
  }
};
```

---

## Summary: What to Implement

### Phase 1: Critical Additions (Must Have)

1. ✅ **VAT 125% Immediate Loss Rule**
   - Warn if income >€18,750 (€15k × 1.25)
   - "Lose exemption IMMEDIATELY"

2. ✅ **15% Expense Justification Rule**
   - Warn about Feb 25 deadline
   - "20-30% tax increase if shortfall"

3. ✅ **Clarify SS Deadlines**
   - Change from "monthly" to "quarterly declarations + monthly payments"
   - Specific dates: Apr 30, Jul 31, Oct 31, Jan 31

4. ✅ **Update USER_INSIGHTS**
   - 11 submissions, not 3
   - Accurate percentages

### Phase 2: Valuable Additions (Should Have)

5. ⚠️ **Certified Software Check**
   - If income >€50k, require AT-certified software
   - Penalty: €3k-€18.7k

6. ⚠️ **ATCUD/QR Invoicing**
   - Remind about series registration before year start
   - Required since Jan 1, 2023

### Phase 3: New Features (Could Have - Requires New Questions)

7. ❓ **Economic Dependency Check**
   - NEW QUESTION: "What % of income from single largest client?"
   - If >50%, warn about 7-10% client surcharge

8. ❓ **Crypto Income Check**
   - NEW QUESTION: "Do you earn crypto income?"
   - Explain 0.15 coefficient / 28% capital gains / 365-day exemption

9. ℹ️ **NHR/IFICI Info**
   - Show if user selects 'nhr' residency
   - "NHR closed 2024, check IFICI"

---

## Recommendation

**Start with Phase 1 only.** These are critical gaps that don't require new form questions:

1. Add VAT 125% rule check
2. Add 15% expense deadline warning
3. Clarify SS quarterly vs monthly
4. Update USER_INSIGHTS with real data

**Phase 2 and 3** can wait until you have more submissions and user feedback.

---

## Next Steps

1. ✅ **Review this comparison** (you're here)
2. ⏳ **Approve Phase 1 changes**
3. ⏳ **I update `taxCheckupEnhancements.ts`** to use Parallel rules
4. ⏳ **Test against 11 real submissions**
5. ⏳ **Deploy to production**

**Estimated time:** 45 minutes to implement Phase 1.

---

## Questions for You

1. **Phase 1 only, or also Phase 2?**
2. **Do you want to add new questions for economic dependency and crypto?** (Phase 3)
3. **Should I also update the results page text with more specific guidance?**

Let me know and I'll proceed with the implementation.
