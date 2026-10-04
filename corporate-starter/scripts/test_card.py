"""Regression checks for live QR updates, legacy saved cards and downloads."""
from pathlib import Path
from tempfile import TemporaryDirectory
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
with sync_playwright() as p, TemporaryDirectory(prefix='athar-card-test-') as temp:
    browser = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True, args=['--no-sandbox'])
    context = browser.new_context(accept_downloads=True, offline=True)
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto((ROOT/'templates'/'02-business-card.html').as_uri())
    image = page.locator('.card-sheet[data-page="2"] img.qr')
    original = image.get_attribute('src')
    assert original.startswith('data:image/svg+xml')
    assert 'TEL;' not in image.get_attribute('data-vcard')
    changes = {
        'name': 'Sara Al-Salem', 'title': 'AI Consultant',
        'name-ar': 'سارة السالم', 'title-ar': 'مستشارة ذكاء اصطناعي',
        'phone': '+966 50 123 4567', 'email': 'sara@example.com',
        'website': 'example.com/sara', 'address': '123 Example Street, Riyadh',
        'address-ar': 'شارع المثال، الرياض',
    }
    for key, value in changes.items():
        previous = image.get_attribute('src')
        page.locator(f'[data-contact="{key}"]').fill(value)
        assert image.get_attribute('src') != previous, key
    contact = image.get_attribute('data-vcard')
    for expected in ['FN:Sara Al-Salem', 'TITLE:AI Consultant',
                     'TEL;TYPE=CELL:+966 50 123 4567', 'EMAIL;TYPE=INTERNET:sara@example.com',
                     'URL:https://example.com/sara', '123 Example Street\\, Riyadh',
                     'سارة السالم', 'مستشارة ذكاء اصطناعي', 'شارع المثال']:
        assert expected in contact, expected
    source = image.get_attribute('src')
    page.reload()
    assert image.get_attribute('src') == source
    assert page.locator('[data-contact="name"]').inner_text() == changes['name']

    # Simulate a locally saved card created before the fix; keep user edits.
    page.evaluate('''() => {
      document.querySelectorAll('[data-contact]').forEach(f => f.removeAttribute('data-contact'));
      document.querySelector('img.qr').src='../assets/contact-qr.png';
      localStorage.setItem('athar-template:'+location.pathname, document.querySelector('main').innerHTML);
    }''')
    page.reload()
    assert image.get_attribute('src') == source
    assert image.get_attribute('data-vcard') == contact
    with page.expect_download() as result:
        page.get_by_role('button', name='Download edits / تنزيل').click()
    saved = Path(temp)/'02-business-card.html'
    result.value.save_as(saved)
    downloaded = context.new_page()
    downloaded.goto(saved.as_uri())
    assert downloaded.locator('img.qr').get_attribute('data-vcard') == contact
    downloaded.locator('[data-contact="email"]').fill('updated@example.com')
    assert 'EMAIL;TYPE=INTERNET:updated@example.com' in downloaded.locator('img.qr').get_attribute('data-vcard')
    downloaded.evaluate("window.dispatchEvent(new Event('beforeprint'))")
    assert downloaded.locator('img.qr').get_attribute('src').startswith('data:image/svg+xml')
    page.on('dialog', lambda dialog: dialog.accept())
    page.get_by_role('button', name='Reset / إعادة').click()
    page.wait_for_load_state()
    assert page.locator('[data-contact="name"]').inner_text() == 'Omar Al-Qahtani'
    assert image.get_attribute('src') == original
    assert not errors, errors
    browser.close()
    print('PASS: offline QR updates for all nine fields, Arabic, reload, legacy migration, download, print and reset.')
