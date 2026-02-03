# Accounting Desk Content Backup - Live Booking Version
**Version:** 1.0 - Live Booking (Pre-Launch)
**Created:** October 3, 2025
**Purpose:** Reference document to restore "live booking" content when launching to paid clients

---

## Overview
This document preserves all original content designed for LIVE BOOKING mode (when `EARLY_BIRDS_MODE = false`). Use this as a reference when transitioning from waitlist to full launch.

---

## 1. ACCOUNTING HERO (`AccountingHero.tsx`)

### Hero Headline
```
Worktugal Accounting Desk
```

### Subheadline
```
We don't sell NIF. We get you tax ready.
```

### Description
```
Prepaid consults. Clear outcomes. No surprises.
Join the waitlist and get priority booking access.
```

### Three Value Props Cards

**Card 1 - Book This Week**
- Icon: Calendar
- Title: "Book This Week"
- Description: "Get a slot with a real OCC-certified accountant within 7 days"

**Card 2 - Written Outcomes**
- Icon: FileCheck
- Title: "Written Outcomes"
- Description: "Every consult includes a written note with next steps"

**Card 3 - Fixed Prices**
- Icon: Shield
- Title: "Fixed Prices"
- Description: "Clear pricing upfront, no hidden fees or surprises"

### CTA Button
```
Join Early Access
```
**Action:** Scrolls to `#early-access-form`

**LAUNCH VERSION:** Change to "Book Your Consult" and scroll to `#pricing` section

---

## 2. WHAT TO EXPECT (`WhatToExpect.tsx`)

### Section Title
```
What to Expect
```

### Section Description
```
From booking to delivery, here's exactly what happens
```

### Timeline Steps

**Step 1: Book & Pay**
- Time: "Today"
- Description: "Choose your service and pay upfront. Clear pricing, no hidden fees."

**Step 2: Confirmation Email**
- Time: "Within minutes"
- Description: "Receive booking confirmation with next steps and preparation tips."

**Step 3: Schedule Your Time**
- Time: "Within 7 days"
- Description: "Use your Cal.com link to book a specific appointment slot that works for you."

**Step 4: Your Consult**
- Time: "Scheduled time"
- Description: "Video or phone call with your OCC-certified accountant. Bring your questions."

**Step 5: Written Outcome**
- Time: "Within 48 hours"
- Description: "Detailed note with your situation, recommendations, and action checklist."

**Step 6: Follow-up Support**
- Time: "As needed"
- Description: "Reach out with quick questions. Need ongoing help? We'll connect you with the right accountant."

### Important Notes Box

**Title:** Important Notes

**Points:**
- You can reschedule your appointment up to 24 hours before the scheduled time via Cal.com
- Missed appointments without 24h notice cannot be refunded or rescheduled
- The €149 credit for Annual Return Consult applies automatically if you book filing services through us
- Email support times vary by service tier (see pricing for details)

**LAUNCH VERSION NOTES:**
- Keep all timeline steps as-is
- Important Notes box: Keep all points (pricing will be visible)
- Remove any "waitlist" references

---

## 3. HOW IT WORKS (`HowItWorks.tsx`)

### Section Title
```
How It Works
```

### Section Description
```
Simple, transparent process from booking to delivery
```

### 4 Steps

**Step 1: Book Your Slot**
- Description: "Choose your service and preferred time. Pay upfront with clear pricing."

**Step 2: Talk to Your Accountant**
- Description: "Video or phone call with an OCC-certified accountant who speaks English."

**Step 3: Get Written Outcomes**
- Description: "Receive a detailed outcome note within 48 hours with clear next steps."

**Step 4: Stay Tax Ready**
- Description: "Follow your checklist and reach out anytime with questions."

**LAUNCH VERSION:** Keep as-is (already accurate for live booking)

---

## 4. FAQ (`ConsultFAQ.tsx`)

### Section Title
```
Frequently Asked Questions
```

### Section Description
```
Everything you need to know about our accounting desk
```

### FAQ Items (Keep All)

**Q1: How does the booking process work?**
```
Choose your service, pay upfront, and you'll receive a confirmation email with a Cal.com booking link. You'll select your specific appointment time (available within 7 days). After your consult, receive your written outcome within 48 hours.
```

**Q2: Do you help me get a NIF?**
```
We provide guidance on the NIF process, but we focus on getting you tax ready, not just obtaining a number. Our consults help you understand activity codes, VAT requirements, and ongoing compliance.
```

**Q3: What is the VAT threshold in Portugal?**
```
For services, the threshold is €13,500 per year. For goods, it is €10,000. Once you exceed these amounts, you must charge and remit VAT. Our Start Pack helps you understand which applies to you.
```

**Q4: Can I reschedule or get a refund?**
```
You can reschedule up to 24 hours before your appointment via Cal.com. Missed appointments without 24-hour notice cannot be refunded or rescheduled. All sales are final once the consult is completed.
```

**Q5: Can I transfer my fiscal representative?**
```
Yes, but you must complete the transfer within 15 days of terminating with your old representative. We can guide you through this process during a consult.
```

**Q6: What changed with AIMA in April 2025?**
```
AIMA now requires complete documentation submission. Partial applications are no longer accepted. This affects residence permit applications and renewals.
```

**Q7: What are NIF ranges and why do they matter?**
```
Portuguese NIF numbers start with different digits based on entity type. Individual NIF starts with 1, 2, or 3. Company NIF starts with 5. This affects how you are identified in the tax system.
```

**Q8: Will I get a written outcome?**
```
Yes, every consult includes a written outcome note delivered within 48 hours. This includes your specific situation, recommendations, and a clear next steps checklist.
```

**Q9: Are your accountants certified?**
```
Yes, all our accountants are certified by the Ordem dos Contabilistas Certificados (OCC) and fluent in English. You'll be matched with the right specialist based on your needs.
```

**Q10: What if I need ongoing accounting help?**
```
Our consults are designed to get you started. If you need ongoing services like quarterly VAT filing or annual returns, we'll connect you directly with an accountant from our network who can provide continuous support.
```

**Q11: How does the €149 Annual Return credit work?**
```
Book the Annual Return Consult for €149. If you decide to hire us for your full annual filing, that €149 is automatically credited toward the filing fee. No special code or request needed.
```

**Compliance Disclaimer:**
```
The information provided during consults is for educational purposes only and does not constitute legal or financial advice. Tax laws change frequently. Always verify current requirements with official Portuguese tax authorities (Autoridade Tributária e Aduaneira) or seek formal legal counsel for your specific situation.
```

**LAUNCH VERSION:** Keep all FAQs as-is

---

## 5. MEET ACCOUNTANTS (`MeetAccountants.tsx`)

### Section Title
```
Meet Our Accountants
```

### Section Description
```
OCC-certified professionals who understand expat taxation in Portugal
```

### Accountant Profiles

**Accountant 1: Ana Silva**
- Title: Senior Tax Consultant
- OCC Cert: #12847
- Specialties: Freelancer taxation, VAT compliance, Activity opening
- Languages: Portuguese, English

**Accountant 2: Miguel Santos**
- Title: Certified Public Accountant
- OCC Cert: #15293
- Specialties: Annual returns, NHR regime, Cross-border taxation
- Languages: Portuguese, English, Spanish

### Footer Note
```
All consults are conducted by OCC-certified accountants from our network. You'll be matched with the right specialist based on your needs and availability.
```

**LAUNCH VERSION:** Keep as-is (profiles are accurate)

---

## 6. ACCOUNTANT RECRUITMENT BANNER (`AccountantRecruitmentBanner.tsx`)

### Headline
```
Are You an OCC-Certified Accountant?
```

### Subheadline
```
Join our network and help expats navigate Portuguese taxation.
```

### Description
```
We connect you with pre-qualified clients. You set your availability. We handle payments.
```

### CTA Button
```
Apply to Join
```
**Link:** `/join-accountants`

**LAUNCH VERSION:** Keep as-is

---

## 7. EARLY ACCESS FORM (`EarlyAccessForm.tsx`)

**LAUNCH VERSION ACTION:**
- Change `EARLY_BIRDS_MODE` to `false` in `AccountingDeskLanding.tsx` (line 19)
- This will HIDE the `EarlyAccessForm` and SHOW the `ConsultPricingSection`
- Hero CTA should change from "Join Early Access" to "Book Your Consult" and scroll to `#pricing`

---

## Launch Checklist

When ready to go live with paid bookings:

1. **Update `AccountingDeskLanding.tsx`:**
   - [ ] Change `EARLY_BIRDS_MODE = false` (line 19)

2. **Update `AccountingHero.tsx`:**
   - [ ] Change hero description from "Join the waitlist and get priority booking access" to "Book your consult today and get started."
   - [ ] Change CTA button text from "Join Early Access" to "Book Your Consult"
   - [ ] Update `onBookNow` to scroll to `#pricing` instead of `#early-access-form`

3. **Verify Components:**
   - [ ] ConsultPricingSection displays correctly
   - [ ] Early Access Form is hidden
   - [ ] All links and buttons work
   - [ ] Pricing references in FAQ make sense

4. **Test Booking Flow:**
   - [ ] User can select service
   - [ ] Booking form appears
   - [ ] Checkout process works
   - [ ] Confirmation emails send

---

## File Structure Reference

Components that contain this content:
- `/src/components/accounting/AccountingHero.tsx`
- `/src/components/accounting/WhatToExpect.tsx`
- `/src/components/accounting/HowItWorks.tsx`
- `/src/components/accounting/ConsultFAQ.tsx`
- `/src/components/accounting/MeetAccountants.tsx`
- `/src/components/accounting/AccountantRecruitmentBanner.tsx`
- `/src/components/accounting/EarlyAccessForm.tsx`
- `/src/components/accounting/AccountingDeskLanding.tsx`

---

**End of Backup Document**
