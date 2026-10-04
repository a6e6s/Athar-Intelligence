# Corporate Starter Package / الحزمة المؤسسية

Open **index.html** in a modern browser to browse all 15 systems. The original company website is preserved.

## Included

| No. | System | Deliverables |
|---|---|---|
| 01 | Company profile / الملف التعريفي | 11-page bilingual profile |
| 02 | Business card / بطاقة العمل | 85 × 55 mm front and back + sample vCard QR |
| 03 | Letterhead / المراسلات | A4 reusable letter |
| 04 | Email signature / توقيع البريد | Preview + inline-style copyable HTML |
| 05 | Company stamp / ختم الشركة | 40 mm digital concept and production notes |
| 06 | Quotation / عرض سعر | Items, totals, terms, payment and authorization |
| 07 | Invoice / الفاتورة | Design sample with invoicing-system QR area |
| 08 | Receipt / الإيصال | Payment acknowledgement |
| 09 | Proposal / المقترح | 6-page reusable engagement proposal |
| 10 | Contract / العقد | 4-page working agreement and schedules |
| 11 | NDA / عدم الإفصاح | 3-page mutual NDA |
| 12 | Purchase order / أمر الشراء | Buyer/supplier, delivery, totals and approval |
| 13 | Job offer / العرض الوظيفي | Compensation, terms and acceptance |
| 14 | HR system / الموارد البشرية | All 8 requested variants |
| 15 | Presentation / العرض التقديمي | 13 layouts + editable native PowerPoint |

Each numbered system has editable HTML and a print-ready PDF. `presentation/Athar-Corporate-Template.pptx` contains editable text, shapes, a table and an Excel-backed chart; use it as a reusable slide library. Install bundled fonts on machines that lack them. The HTML templates work offline using local assets and fonts.

## Edit / تحرير

1. Open a numbered HTML template. Click an underlined field and type. Edits autosave in that browser when storage is available.
2. Use **Download edits** to save a durable edited copy **inside the templates folder** so relative asset links continue working. The downloaded file contains the edited markup. Keep another copy of the original before replacing it.
3. Use **Print / PDF** to export the current version. Choose zero margins, background graphics, no browser headers/footers, and the CSS-defined paper size.
4. Fixed bilingual text and page structure can be edited in the HTML source. Add explicit page sections for longer content; don't exceed the fixed print area. Update both languages, references, dates and page numbering.
5. Replace company legal name, CR, VAT number, national address, real domain, mobile numbers, bank/IBAN and authorized signatories. `.example` domains and masked phones are deliberate non-live placeholders.
6. Recalculate financial tables after every change; totals are manual. The business-card QR updates automatically when you edit the name, title, mobile, email, website or address, including Arabic details. The updated QR is included in saved edits and printed PDFs. Masked sample phone numbers are omitted from the contact QR until you enter a real number. Replace approved client/project information only after verifying permission and outcomes.

افتح القالب وانقر الحقول المسطرة للتعديل. احفظ نسخة معدلة داخل مجلد templates للمحافظة على روابط الأصول. استبدل البيانات النموذجية، وحدّث اللغتين والمراجع والتواريخ، وأعد حساب القيم المالية. تُراجع الصياغة القانونية والوظيفية قبل الاستخدام.

## Email and stamp

`templates/email-signature-copy.html` is an inline-style email signature without the document toolbar. Replace sample text and link targets. Use an approved HTTPS logo URL or mail-client embedding, then copy the rendered signature into the client's signature editor. Test in the intended mail clients. Social links are optional and omitted until approved URLs exist.

The stamp concept preserves the supplied color symbol. `assets/stamp-concept.png` is a separate 600 dpi digital concept with a transparent outer background and a white seal interior. Its sample CR text must be replaced before use. For a physical single-color stamp, request an authorized monochrome artwork master and a production proof from the vendor. The template does not confer authority or registration.

`presentation/Athar-Corporate-Template.pdf` is a rendered review copy of the native PowerPoint. The separate `pdf/15-presentation.pdf` is the HTML slide-library snapshot.

## Rebuild

Python dependencies: `python-pptx`, `qrcode`, `Pillow`, `playwright`. A Chromium browser is required for PDF export and verification. Fonts, licenses and untouched official logo copies are in `assets/`.

```sh
python3 scripts/build.py
python3 scripts/export.py
```

`build.py` rewrites the original templates and sample vCard. Save edited versions separately before rebuilding. `export.py` generates PDFs, checks page overflow and writes a verification report. The ZIP contains the whole collection except itself and temporary review screenshots.

The invoice is a design template to be integrated with a compliant invoicing solution; it is not a issued tax invoice. See DESIGN-SYSTEM.md for official ZATCA references. Contract, NDA, offer and formal HR text are marked for professional review.
