# Athar Intelligence | أثر الذكاء

Shared visual system · v1.0 · 2 October 2026

The supplied BrandDesignGuide.md and three official PNG lockups are the source of truth. This package uses the guide's recommended **Manrope + IBM Plex Sans Arabic** pairing. No logo has been recolored, traced, stretched or redesigned. The provided color logos sit on white, including on otherwise dark layouts; a white or monochrome master was not supplied.

| Token | Value | Application |
|---|---|---|
| Primary | `#002050` | Titles, table headers, rules |
| Secondary | `#0060A8` | Subheadings, charts, links |
| Digital accent | `#00B8D9` | Small data accents, editing focus |
| Premium accent | `#E8B84A` | Thin impact rules, section markers |
| Highlight | `#F4D27A` | Optional emphasis |
| Paper | `#FFFFFF` | All formal document backgrounds |
| Surface | `#F5F8FC` | Field panels and alternating rows |
| Text | `#071426` | Body text |
| Border | `#DCE5EF` | Dividers and table rules |

## Type and direction

Manrope, 10 pt body and 25 pt document titles; IBM Plex Sans Arabic, 10 pt body and 25 pt titles. Body line spacing is generous for Arabic marks. English sits left with `lang="en" dir="ltr"`; Arabic sits right with `lang="ar" dir="rtl"`. Financial tables use paired column labels and explicit numeric columns. PowerPoint Arabic paragraphs have RTL properties and explicit Arabic font settings. All Arabic clauses are editable working translations requiring review before legal execution.

## Grid and brand elements

- Official documents: A4 portrait, 18 mm side margins, 15 mm top padding, 20 mm bottom allowance. Header logo width 52 mm, proportional scaling. Minimum full-lockup width 30 mm in print. Logo panels are reserved and separated from neighboring content; maintain the guide's clear-space rule (height of the A) when changing layouts.
- Gold rules and a restrained curved cover accent represent the impact path. No decorative circuit background or watermark behind body text. A watermark, if later required, must use an approved symbol at low opacity without affecting readability.
- Bilingual headings and paragraphs use equal columns with a 9 mm gutter. Tables use navy headers, white text, pale alternating rows and aligned decimals. Keep text at 8 pt or larger on A4 except footers.
- Footers contain editable contact details, document reference, version, issue date and page count. Business cards use a reduced footer; slide footers use presentation references.
- Rounded panels are used in the library. Formal documents retain square, clean field panels. Icons are omitted in official records to keep printing clear; add simple line icons only if necessary.

## Numbers, signatures and QR codes

Reference pattern: `AI-{TYPE}-{YEAR}-{SEQUENCE}`; HR includes subtype, for example `AI-HR-SAL-2026-001`. Dates use ISO `YYYY-MM-DD` for unambiguous bilingual interpretation. Replace sequence numbers at issue, and update footer dates throughout.

Signature blocks reserve ruled lines for signature/date and adjacent editable name/title fields. Dashed stamp areas mark where authorized seals may be placed. The 40 mm circular stamp is a concept, not proof of registration. Physical single-ink production requires an approved monochrome logo master; the original color symbol is preserved here.

The business-card QR automatically encodes the current editable contact fields as a UTF-8 vCard, including Arabic details, with a four-module quiet zone. It regenerates offline on editing, reopening, downloading and printing. Masked sample phone numbers are omitted until a real number is entered. Verify readability on actual-size proofs before issue. `sample-contact.vcf` and `contact-qr.png` remain static sample assets; the editable card uses its own live vector QR. Invoice QR space is explicitly reserved for output from the company’s invoicing system and is never filled with the contact QR.

Financial examples use SAR, a subtotal of 18,000.00, a line discount of 500.00, an illustrative 15% VAT amount of 2,625.00 on 17,500.00, and a total of 20,125.00. Fields do **not** recalculate; recalculate and approve all figures after editing.

## Print and export

Business cards: 85 × 55 mm front/back, finished size with no bleed. If a printer requires bleed or CMYK output, have the print vendor prepare the production file and approve a proof. Color PNGs and PDFs remain RGB; the guide's CMYK navy specification is a production reference, not an assertion that these PDFs are CMYK.

Presentations: 16:9, 13 editable layout examples, including native tables and a native chart. The HTML slide deck has matching intent and print format; the PowerPoint has independently composed native objects.

PDFs include selectable, bilingual text and embedded fonts. Browser printing must use CSS page sizes, zero margins, background graphics and no browser headers/footers. Original editable HTML and PPTX are retained. PDFs are review snapshots, not interactive forms.

## Saudi invoice integration reference

This package provides visual layouts, not a compliant e-invoicing engine. Invoice issuance, mandatory fields, Arabic content, applicable phase, invoice type and system-generated QR must be verified in the company’s actual invoicing solution.

- [ZATCA: Phase 1 steps and compliant electronic systems](https://zatca.gov.sa/en/MediaCenter/News/Pages/Taxpayers-VAT-E-invoicing.aspx)
- [ZATCA: Arabic-language invoice FAQ](https://zatca.gov.sa/en/E-Invoicing/Introduction/FAQ/Pages/default.aspx?page=FAQ_031)
- [ZATCA: E-invoice specifications](https://www.zatca.gov.sa/en/E-Invoicing/SystemsDevelopers/Pages/E-Invoice-specifications.aspx)

Legal and employment wording is a clearly labeled draft for professional legal / HR review. No client relationships, project results, legal registrations or employee facts are asserted by sample content.
