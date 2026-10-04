/* Keep the business card's offline vCard QR in sync with its editable fields. */
(function () {
  const card = document.querySelector('.card-sheet[data-page="2"]');
  if (!card) return;
  // Older locally saved cards do not have data-contact attributes yet.
  const keys = ['name', 'title', 'name-ar', 'title-ar', 'phone', 'email', 'website', 'address', 'address-ar'];
  card.querySelectorAll('.page-content .field').forEach((field, index) => {
    if (!field.dataset.contact && keys[index]) field.dataset.contact = keys[index];
  });
  const image = card.querySelector('img.qr');
  const status = document.getElementById('status');
  const value = key => card.querySelector(`[data-contact="${key}"]`)?.innerText.trim() || '';
  const escape = value => value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
  let previous = null;

  window.updateContactQr = function () {
    const name = value('name') || value('name-ar');
    const lines = ['BEGIN:VCARD', 'VERSION:3.0', `N:;${escape(name)};;;`, `FN:${escape(name)}`, 'ORG:Athar Intelligence'];
    const title = value('title') || value('title-ar');
    if (title) lines.push(`TITLE:${escape(title)}`);
    const phone = value('phone');
    if (phone && /^[+\d\s().-]+$/.test(phone)) lines.push(`TEL;TYPE=CELL:${escape(phone)}`);
    if (value('email')) lines.push(`EMAIL;TYPE=INTERNET:${escape(value('email'))}`);
    let website = value('website');
    if (website && !/^https?:\/\//i.test(website)) website = 'https://' + website;
    if (website) lines.push(`URL:${escape(website)}`);
    const address = value('address') || value('address-ar');
    if (address) lines.push(`ADR;TYPE=WORK:;;${escape(address)};;;;`);
    const arabic = [value('name-ar'), value('title-ar'), value('address-ar')].filter(Boolean);
    if (arabic.length) lines.push(`NOTE:${escape(arabic.join(' · '))}`);
    lines.push('END:VCARD');
    const contact = lines.join('\r\n');
    if (contact === previous) return;
    try {
      qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
      const qr = qrcode(0, 'M');
      qr.addData(contact, 'Byte');
      qr.make();
      // Vector output and four-module quiet zone stay crisp in printed PDFs.
      image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(qr.createSvgTag(4, 16));
      image.alt = 'Contact QR / رمز معلومات الاتصال';
      image.dataset.vcard = contact;
      image.style.visibility = 'visible';
      previous = contact;
    } catch (error) {
      // Never leave a stale contact code visible when generation fails.
      image.removeAttribute('src');
      image.removeAttribute('data-vcard');
      image.style.visibility = 'hidden';
      status.textContent = 'Contact details are too long for a QR code. Shorten them. / اختصر بيانات الاتصال لتوليد الرمز.';
      throw error;
    }
  };
  window.addEventListener('beforeprint', window.updateContactQr);
  window.updateContactQr();
})();
