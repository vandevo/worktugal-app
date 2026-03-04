Name: worktugal-diagnostic-engine-v2-spec.md

Title
Worktugal Compliance Diagnostic Engine v2

Purpose

The Worktugal Compliance Diagnostic Engine evaluates whether expatriates in Portugal are properly set up and whether they face hidden regulatory exposure.

The system produces two outputs.

Setup Score
Measures structural compliance based on registrations and legal setup.

Exposure Index
Measures hidden regulatory risk that may exist even when the setup appears correct.

The goal is to detect legal, tax, immigration, and compliance traps commonly faced by expatriates living in Portugal.

Version History

v1
Checklist based compliance diagnostic.
Single Setup Score.
Implemented in quizQuestions logic.

v2
Dual scoring system.
Setup Score retained.
Exposure Index added to detect hidden regulatory traps.

Existing Quiz Logic

The existing quizQuestions structure remains the foundation of the system.

Fields currently captured

visa_status
tax_residence
nif
business_structure
social_security
banking
time_in_portugal
aima_appointment
time_lived_in_portugal
health_insurance
monthly_income
overstay_risk

These questions produce the Setup Score using the calculateScore function.

The Setup Score measures completeness of compliance setup but does not measure hidden exposure risk.

Diagnostic Engine v2 adds a second layer called the Exposure Index.

Exposure Index Concept

Exposure Index detects risk patterns that occur even when basic compliance appears correct.

Examples

User is tax resident in Portugal but has not deregistered tax residency abroad.

User is freelancer invoicing EU clients but has not registered VAT.

User is living in Portugal more than 183 days but has not filed Portuguese IRS.

User has AIMA appointment but does not track permit expiration.

Each triggered condition increases Exposure Index.

ExposureIndex ranges from 0 to 100.

New Questions for v2

The following additional questions should be added to detect exposure traps.

foreign_tax_deregistration

Question
Have you formally deregistered tax residency in your previous country?

Options
yes
no
unsure

eu_clients

Question
Do you invoice clients located in the EU?

Options
yes
no
not_applicable

permit_expiry_tracking

Question
Do you know your residence permit expiration date?

Options
yes
no
unsure

accountant_status

Question
Do you currently work with a Portuguese accountant?

Options
yes
no
planning_to

first_irs_filing

Question
Have you filed Portuguese IRS at least once?

Options
yes
no
not_required_yet

schengen_day_tracking

Question
Do you track your Schengen stay using a calculator or official tracker?

Options
yes
no
unsure

Trap to Field Matrix

Trap
Dual Tax Residency

Trigger
tax_residence = yes
AND foreign_tax_deregistration = no OR unsure

ExposureScore
15

Fix
Tax residency alignment review

Trap
VAT Misclassification

Trigger
business_structure = freelancer OR unipessoal
AND eu_clients = yes
AND monthly_income above threshold

ExposureScore
20

Fix
VAT registration and invoicing compliance review

Trap
Unfiled IRS

Trigger
tax_residence = yes
AND first_irs_filing = no

ExposureScore
20

Fix
IRS filing correction

Trap
Residence Permit Expiry Risk

Trigger
aima_appointment = yes
AND permit_expiry_tracking = no OR unsure

ExposureScore
15

Fix
Permit monitoring and renewal preparation

Trap
Schengen Overstay Miscalculation

Trigger
time_lived_in_portugal less than 183 days
AND schengen_day_tracking = no OR unsure

ExposureScore
10

Fix
Schengen stay tracking setup

Trap
Social Security Misalignment

Trigger
business_structure = freelancer
AND social_security = no

ExposureScore
15

Fix
NISS registration and contribution review

Scoring System

Setup Score

Existing calculateScore function.

Measures completeness of legal setup.

Exposure Index

ExposureIndex = sum of triggered trap scores

ExposureIndex capped at 100.

Final Result Segments

Segment 1
Low Setup
Low Exposure

Segment 2
Low Setup
High Exposure

Segment 3
High Setup
High Exposure

Segment 4
High Setup
Low Exposure

Segment 3 is the highest monetization opportunity.

Database Schema

Table
diagnostics

Columns

id uuid
email text
visa_status text
tax_residence text
nif boolean
business_structure text
social_security boolean
banking boolean
time_in_portugal text
aima_appointment text
time_lived_in_portugal text
health_insurance text
monthly_income text
overstay_risk text

foreign_tax_deregistration text
eu_clients text
permit_expiry_tracking text
accountant_status text
first_irs_filing text
schengen_day_tracking text

setup_score integer
exposure_index integer
trap_flags jsonb

created_at timestamp

Result Messaging

Low Setup Low Exposure
You still need to complete several legal steps but currently face limited regulatory risk.

Low Setup High Exposure
You have both missing setup and potential regulatory risks that require immediate attention.

High Setup High Exposure
Your setup appears complete but hidden compliance risks were detected.

High Setup Low Exposure
Your compliance setup appears strong and your exposure risk is low.

Monetization Path

Free Diagnostic
User receives Setup Score and Exposure Index.

Paid Compliance Risk Audit
Full trap breakdown
Corrective actions
Document checklist
Optional clarity call.

Strategic Positioning

Worktugal operates as a compliance intelligence layer for expatriates navigating Portuguese regulatory systems.

The diagnostic focuses on identifying hidden risks that traditional relocation services and accountants often fail to detect.