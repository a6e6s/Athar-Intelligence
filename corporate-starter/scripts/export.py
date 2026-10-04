"""Export and validate the entire collection using a local Chromium browser."""
from pathlib import Path
import json, zipfile
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
def main():
    docs=json.loads((ROOT/'manifest.json').read_text())
    report=[]
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1440,'height':1100})
        for d in docs:
            errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.goto((ROOT/'templates'/f'{d["slug"]}.html').as_uri())
            page.evaluate('document.fonts.ready')
            checks=page.evaluate('''() => [...document.querySelectorAll('.sheet')].map(s=>{
              const c=s.querySelector('.page-content'), f=s.querySelector('footer');
              return {page:+s.dataset.page, contentBottom:c.getBoundingClientRect().bottom-s.getBoundingClientRect().top,
                footerTop:f.getBoundingClientRect().top-s.getBoundingClientRect().top,
                collision:c.getBoundingClientRect().bottom>f.getBoundingClientRect().top-5,
                horizontalOverflow:c.scrollWidth>c.clientWidth+1};})''')
            assert not errors,(d['slug'],errors)
            bad=[x for x in checks if x['collision'] or x['horizontalOverflow']]
            page.pdf(path=str(ROOT/'pdf'/f'{d["slug"]}.pdf'),prefer_css_page_size=True,print_background=True,display_header_footer=False)
            report.append({'document':d['slug'],'pages':d['pages'],'layout':checks,'issues':bad})
            print(d['slug'], 'OK' if not bad else f'OVERFLOW {bad}')
        page.goto((ROOT/'index.html').as_uri());page.evaluate('document.fonts.ready')
        page.screenshot(path=str(ROOT/'library-preview.png'),full_page=True)
        assert page.locator('article').count()==15
        page.fill('#search','Invoice');assert page.locator('article:visible').count()==1
        page.fill('#search','فاتورة');assert page.locator('article:visible').count()==1
        page.goto((ROOT/'templates'/'03-letterhead.html').as_uri());f=page.locator('.field').first
        original=f.inner_text();f.fill('EDIT CHECK');page.reload();assert page.locator('.field').first.inner_text()=='EDIT CHECK'
        page.evaluate('localStorage.clear()');page.reload();assert page.locator('.field').first.inner_text()==original
        # Standalone digital stamp concept with clear background and high resolution.
        stamp_page=browser.new_page(device_scale_factor=6.25)
        stamp_page.goto((ROOT/'templates'/'05-company-stamp.html').as_uri())
        stamp_page.evaluate('document.fonts.ready')
        stamp_page.add_style_tag(content='body,.sheet{background:transparent}.seal{background:white}.seal .field{border:0}')
        stamp_page.locator('.seal').screenshot(path=str(ROOT/'assets'/'stamp-concept.png'),omit_background=True)
        from PIL import Image
        with Image.open(ROOT/'assets'/'stamp-concept.png') as im:
            im.save(ROOT/'assets'/'stamp-concept.png',dpi=(600,600))
        browser.close()
    (ROOT/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    bad=[r['document'] for r in report if r['issues']]
    if bad: raise RuntimeError(f'Fix layout issues before packaging: {bad}')
    with zipfile.ZipFile(ROOT/'Athar-Corporate-Starter.zip','w',zipfile.ZIP_DEFLATED) as z:
        for f in ROOT.rglob('*'):
            if f.is_file() and f.suffix not in ['.zip','.pyc'] and '__pycache__' not in f.parts and f.name!='library-preview.png':
                target=Path('Athar-Corporate-Starter')/f.relative_to(ROOT)
                if f==ROOT/'index.html':
                    # The archive cannot contain itself. Keep its extracted library self-contained.
                    content=f.read_text().replace('href="Athar-Corporate-Starter.zip">Download package / تنزيل الحزمة ↓','href="README.md">Get started / ابدأ هنا ↗')
                    z.writestr(str(target),content)
                else:z.write(f,target)
    print('Verified 15 systems; packaged ZIP.')

if __name__=='__main__':main()
