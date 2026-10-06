// Offline, native Office Open XML export. ZIP entries use the stored method.
async function exportWord(button) {
  const status = document.getElementById('status');
  if (button) button.disabled = true;
  try {
    if (window.updateContactQr) window.updateContactQr();
    const xml = s => String(s).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
    const files = {}, relations = [];
    let imageId = 0;
    const paragraph = (text, el) => {
      const rtl = el?.closest('[dir]')?.dir === 'rtl';
      const size = el && /^H[123]$/.test(el.tagName) ? {H1:36,H2:28,H3:24}[el.tagName] : 20;
      return `<w:p><w:pPr>${rtl ? '<w:bidi/><w:jc w:val="right"/>' : ''}<w:spacing w:after="100"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Manrope" w:hAnsi="Manrope" w:cs="IBM Plex Sans Arabic"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/>${rtl ? '<w:rtl/>' : ''}${size > 20 ? '<w:b/><w:color w:val="002050"/>' : ''}</w:rPr>${text.split('\n').map(t => `<w:t xml:space="preserve">${xml(t)}</w:t>`).join('<w:br/>')}</w:r></w:p>`;
    };
    async function image(el) {
      let source = el;
      if (!el.src.startsWith('data:') && window.atharWordImages?.[el.getAttribute('src')]) {
        source = new Image(); source.src = window.atharWordImages[el.getAttribute('src')];
      }
      await source.decode();
      const canvas = document.createElement('canvas');
      const bounds = el.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(bounds.width * 3)); canvas.height = Math.max(1, Math.round(bounds.height * 3));
      canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
      const bytes = Uint8Array.from(atob(canvas.toDataURL('image/png').split(',')[1]), c => c.charCodeAt(0));
      const id = ++imageId, name = `media/image${id}.png`;
      files[`word/${name}`] = bytes;
      relations.push(`<Relationship Id="rId${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${name}"/>`);
      const cx = Math.round(bounds.width * 9525), cy = Math.round(bounds.height * 9525);
      return `<w:p><w:r><w:drawing><wp:inline><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${id}" name="Image ${id}" descr="${xml(el.alt)}"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${id}" name="Image ${id}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rId${id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`;
    }
    async function table(rows) {
      let out = '<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders><w:bottom w:val="single" w:sz="4" w:color="DCE5EF"/><w:insideH w:val="single" w:sz="4" w:color="DCE5EF"/></w:tblBorders></w:tblPr>';
      for (const row of rows) {
        out += '<w:tr>';
        for (const cell of row) out += `<w:tc><w:tcPr><w:tcW w:w="${Math.floor(5000/row.length)}" w:type="pct"/>${cell.tagName === 'TH' ? '<w:shd w:fill="F5F8FC"/>' : ''}</w:tcPr>${await walk(cell)}<w:p/></w:tc>`;
        out += '</w:tr>';
      }
      return out + '</w:tbl><w:p/>';
    }
    async function walk(el) {
      if (el.nodeType === Node.TEXT_NODE) return el.textContent.trim() ? paragraph(el.textContent, el.parentElement) : '';
      if (el.nodeType !== Node.ELEMENT_NODE || ['SCRIPT','STYLE'].includes(el.tagName)) return '';
      if (el.tagName === 'IMG') return image(el);
      if (el.tagName === 'TABLE') return table(Array.from(el.rows, r => Array.from(r.cells)));
      if (el.matches('.pair, .grid, .chips, .timeline') && el.children.length) {
        const children = Array.from(el.children), rows = [];
        for (let i=0; i<children.length; i+=2) rows.push(children.slice(i,i+2));
        return table(rows);
      }
      if (!el.querySelector('img, table, div, p, h1, h2, h3, header, footer, section')) return paragraph(el.innerText, el);
      let out = '';
      for (const child of el.childNodes) out += await walk(child);
      return out;
    }
    const pages = Array.from(document.querySelectorAll('main > .sheet'));
    let body = '';
    for (let i=0; i<pages.length; i++) {
      if (i) body += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
      body += await walk(pages[i]);
    }
    const first = pages[0], card = first.classList.contains('card-sheet'), slide = first.classList.contains('slide-sheet');
    const width = card ? 4819 : slide ? 19200 : 11906, height = card ? 3118 : slide ? 10800 : 16838, margin = card ? 283 : 850;
    const declaration = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    files['word/document.xml'] = declaration + `<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>${body}<w:sectPr><w:pgSz w:w="${width}" w:h="${height}"/><w:pgMar w:top="${margin}" w:right="${margin}" w:bottom="${margin}" w:left="${margin}" w:header="0" w:footer="0" w:gutter="0"/></w:sectPr></w:body></w:document>`;
    files['[Content_Types].xml'] = declaration + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
    files['_rels/.rels'] = declaration + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
    files['word/_rels/document.xml.rels'] = declaration + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${relations.join('')}</Relationships>`;
    const encoder = new TextEncoder(), chunks = [], central = []; let offset = 0;
    const header = (size, values) => {const b = new Uint8Array(size), v = new DataView(b.buffer); for (const [at,value,bits] of values) bits === 16 ? v.setUint16(at,value,true) : v.setUint32(at,value,true); return b;};
    for (const [name,value] of Object.entries(files)) {
      const filename = encoder.encode(name), data = typeof value === 'string' ? encoder.encode(value) : value;
      let crc = 0xffffffff;
      for (const byte of data) {crc ^= byte; for (let j=0;j<8;j++) crc = (crc>>>1)^((crc&1)?0xedb88320:0);}
      crc = (crc^0xffffffff)>>>0;
      const local = header(30,[[0,0x04034b50],[4,20,16],[14,crc],[18,data.length],[22,data.length],[26,filename.length,16]]);
      central.push(header(46,[[0,0x02014b50],[4,20,16],[6,20,16],[16,crc],[20,data.length],[24,data.length],[28,filename.length,16],[42,offset]]),filename);
      chunks.push(local,filename,data); offset += 30+filename.length+data.length;
    }
    const centralSize = central.reduce((n,b)=>n+b.length,0), count = Object.keys(files).length;
    const end = header(22,[[0,0x06054b50],[8,count,16],[10,count,16],[12,centralSize],[16,offset]]);
    const url = URL.createObjectURL(new Blob([...chunks,...central,end],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}));
    const link = document.createElement('a'); link.href=url; link.download=location.pathname.split('/').pop().replace(/\.html?$/i,'')+'.docx'; link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    status.textContent='Word downloaded / تم تنزيل ملف Word';
  } catch (error) {
    console.error(error); status.textContent='Word export failed. Check that template images are loaded and try again. / تعذر تصدير Word';
  } finally {if (button) button.disabled=false;}
}
