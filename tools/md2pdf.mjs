/**
 * Markdown to PDF converter for Growth Content Essays
 * Uses Inter font, generous whitespace, clean formatting
 *
 * Usage: node tools/md2pdf.mjs <input.md> <output.pdf>
 */

import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, extname } from 'path';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = resolve(__dirname, '..', 'fonts');

// --- COLORS ---
const DARK = rgb(0.10, 0.10, 0.18);
const HEADING_COLOR = rgb(0.08, 0.12, 0.32);  // dark blue for subsection headers
const MUTED = rgb(0.35, 0.35, 0.48);
const LINK = rgb(0, 0.40, 0.80);
const RULE_COLOR = rgb(0.82, 0.82, 0.88);
const BULLET_COLOR = rgb(0.08, 0.12, 0.32);   // match heading color for bullets

// --- LAYOUT ---
const PAGE_W = 612;
const PAGE_H = 792;
const ML = 76;   // left margin
const MR = 76;   // right margin
const MT = 64;   // top margin
const MB = 60;   // bottom margin
const CW = PAGE_W - ML - MR; // content width

// --- TYPOGRAPHY ---
const BODY_SIZE = 9.6;
const BODY_LEADING = 17.5;    // generous line spacing within paragraphs
const H1_SIZE = 15;
const H2_SIZE = 11.2;
const META_SIZE = 9;
const QUOTE_SIZE = 9.5;
const SOURCE_SIZE = 9;
const SOURCE_URL_SIZE = 8.5;
const SOURCE_DESC_SIZE = 8.5;

// --- SPACING ---
const PARA_GAP = 16;           // generous gap between paragraphs
const H1_BEFORE = 36;          // big space before section header
const H1_AFTER = 18;           // breathing room after section header
const H2_BEFORE = 32;          // big space before subsection header
const H2_AFTER = 18;           // generous breathing room after subsection header
const RULE_BEFORE = 20;        // space before horizontal rule
const RULE_AFTER = 22;         // space after horizontal rule
const BULLET_INDENT = 24;
const NUMBERED_INDENT = 22;

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node md2pdf.mjs <input.md> <output.pdf>');
    process.exit(1);
  }

  const mdPath = resolve(args[0]);
  const outPath = resolve(args[1]);
  const md = readFileSync(mdPath, 'utf-8');

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const regular = await pdfDoc.embedFont(readFileSync(resolve(FONTS_DIR, 'Inter-Regular.ttf')));
  const bold = await pdfDoc.embedFont(readFileSync(resolve(FONTS_DIR, 'Inter-Bold.ttf')));
  const italic = await pdfDoc.embedFont(readFileSync(resolve(FONTS_DIR, 'Inter-Italic.ttf')));
  const boldItalic = await pdfDoc.embedFont(readFileSync(resolve(FONTS_DIR, 'Inter-BoldItalic.ttf')));
  const displayBold = await pdfDoc.embedFont(readFileSync(resolve(FONTS_DIR, 'InterDisplay-Bold.ttf')));
  const displaySemiBold = await pdfDoc.embedFont(readFileSync(resolve(FONTS_DIR, 'InterDisplay-SemiBold.ttf')));

  // State
  let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MT;
  let isFirstElement = true;

  function ensureSpace(needed) {
    if (y - needed < MB) {
      page = pdfDoc.addPage([PAGE_W, PAGE_H]);
      y = PAGE_H - MT;
    }
  }

  // Parse **bold** and *italic* into segments
  function parseFormatting(text) {
    const segs = [];
    const re = /\*\*(.+?)\*\*|\*(.+?)\*/g;
    let last = 0, m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) segs.push({ text: text.slice(last, m.index), b: false, i: false });
      if (m[1] !== undefined) segs.push({ text: m[1], b: true, i: false });
      else if (m[2] !== undefined) segs.push({ text: m[2], b: false, i: true });
      last = re.lastIndex;
    }
    if (last < text.length) segs.push({ text: text.slice(last), b: false, i: false });
    return segs;
  }

  function fontFor(seg, defaultFont) {
    if (seg.b && seg.i) return boldItalic;
    if (seg.b) return bold;
    if (seg.i) return italic;
    return defaultFont;
  }

  // Word-wrap with inline formatting, returns array of lines (each line = array of {text, font, color})
  function layoutParagraph(text, { fontSize = BODY_SIZE, baseFont = regular, color = DARK, maxWidth = CW } = {}) {
    const segments = parseFormatting(text);
    // Build word tokens
    const tokens = [];
    for (const seg of segments) {
      const f = fontFor(seg, baseFont);
      const words = seg.text.split(/(\s+)/);
      for (const w of words) {
        if (w.length === 0) continue;
        tokens.push({ text: w, font: f, color: seg.color || color });
      }
    }

    const spaceW = baseFont.widthOfTextAtSize(' ', fontSize);
    const lines = [];
    let curLine = [];
    let curWidth = 0;

    for (const tok of tokens) {
      if (/^\s+$/.test(tok.text)) {
        // space token
        if (curLine.length > 0) curWidth += spaceW;
        continue;
      }
      const tokW = tok.font.widthOfTextAtSize(tok.text, fontSize);
      const needed = curLine.length > 0 ? spaceW + tokW : tokW;
      if (curWidth + needed > maxWidth && curLine.length > 0) {
        lines.push(curLine);
        curLine = [{ ...tok, w: tokW }];
        curWidth = tokW;
      } else {
        if (curLine.length > 0) curWidth += spaceW;
        curLine.push({ ...tok, w: tokW });
        curWidth += tokW;
      }
    }
    if (curLine.length > 0) lines.push(curLine);
    return lines;
  }

  function drawLines(lines, { fontSize = BODY_SIZE, leading = BODY_LEADING, x = ML, color = DARK } = {}) {
    const spaceW = regular.widthOfTextAtSize(' ', fontSize);
    for (const line of lines) {
      ensureSpace(leading);
      let dx = x;
      for (let i = 0; i < line.length; i++) {
        const tok = line[i];
        page.drawText(tok.text, { x: dx, y, size: fontSize, font: tok.font, color: tok.color || color });
        dx += tok.w + spaceW;
      }
      y -= leading;
    }
  }

  function drawParagraph(text, opts = {}) {
    const fontSize = opts.fontSize || BODY_SIZE;
    const leading = opts.leading || BODY_LEADING;
    const indent = opts.indent || 0;
    const maxWidth = CW - indent;
    const baseFont = opts.baseFont || regular;
    const color = opts.color || DARK;
    const lines = layoutParagraph(text, { fontSize, baseFont, color, maxWidth });
    drawLines(lines, { fontSize, leading, x: ML + indent, color });
  }

  function drawHRule() {
    y -= RULE_BEFORE;
    ensureSpace(2);
    page.drawLine({ start: { x: ML, y }, end: { x: PAGE_W - MR, y }, thickness: 0.5, color: RULE_COLOR });
    y -= RULE_AFTER;
  }

  function drawH1(text) {
    if (!isFirstElement) y -= H1_BEFORE;
    ensureSpace(H1_SIZE + H1_AFTER);
    const lines = layoutParagraph(text, { fontSize: H1_SIZE, baseFont: displayBold, color: HEADING_COLOR, maxWidth: CW });
    drawLines(lines, { fontSize: H1_SIZE, leading: H1_SIZE + 6, x: ML, color: HEADING_COLOR });
    y -= H1_AFTER;
    isFirstElement = false;
  }

  function drawH2(text) {
    y -= H2_BEFORE;
    ensureSpace(H2_SIZE + H2_AFTER);
    const lines = layoutParagraph(text, { fontSize: H2_SIZE, baseFont: displaySemiBold, color: HEADING_COLOR, maxWidth: CW });
    drawLines(lines, { fontSize: H2_SIZE, leading: H2_SIZE + 5, x: ML, color: HEADING_COLOR });
    y -= H2_AFTER;
    isFirstElement = false;
  }

  function drawMeta(label, value) {
    ensureSpace(META_SIZE + 6);
    const labelW = bold.widthOfTextAtSize(label + ' ', META_SIZE);
    page.drawText(label, { x: ML, y, size: META_SIZE, font: bold, color: MUTED });
    // Wrap value after label
    const valLines = layoutParagraph(value, { fontSize: META_SIZE, baseFont: regular, color: DARK, maxWidth: CW - labelW });
    if (valLines.length > 0) {
      // First line starts after label
      const spaceW = regular.widthOfTextAtSize(' ', META_SIZE);
      let dx = ML + labelW;
      for (const tok of valLines[0]) {
        page.drawText(tok.text, { x: dx, y, size: META_SIZE, font: tok.font, color: tok.color || DARK });
        dx += tok.w + spaceW;
      }
      y -= META_SIZE + 5;
      // Remaining lines
      for (let i = 1; i < valLines.length; i++) {
        ensureSpace(META_SIZE + 5);
        let dx2 = ML + labelW;
        for (const tok of valLines[i]) {
          page.drawText(tok.text, { x: dx2, y, size: META_SIZE, font: tok.font, color: tok.color || DARK });
          dx2 += tok.w + spaceW;
        }
        y -= META_SIZE + 5;
      }
    } else {
      y -= META_SIZE + 5;
    }
  }

  function drawBullet(text, opts = {}) {
    ensureSpace(BODY_LEADING);
    const bulletX = ML + 8;
    page.drawText('\u2022', { x: bulletX, y, size: BODY_SIZE, font: regular, color: BULLET_COLOR });
    drawParagraph(text, { indent: BULLET_INDENT, ...opts });
    y -= 6;
  }

  async function drawImage(imgPath, caption) {
    const absPath = resolve(imgPath);
    if (!existsSync(absPath)) return;
    const imgBytes = readFileSync(absPath);
    const ext = extname(absPath).toLowerCase();
    let img;
    if (ext === '.png') img = await pdfDoc.embedPng(imgBytes);
    else if (ext === '.jpg' || ext === '.jpeg') img = await pdfDoc.embedJpg(imgBytes);
    else return;

    // Scale to fit content width, max height 400pt
    const scale = Math.min(CW / img.width, 400 / img.height, 1);
    const w = img.width * scale;
    const h = img.height * scale;

    y -= 12; // space before image
    ensureSpace(h + 30);
    const imgX = ML + (CW - w) / 2; // center horizontally
    page.drawImage(img, { x: imgX, y: y - h, width: w, height: h });
    y -= h + 8;

    // Draw caption if provided
    if (caption && caption.trim()) {
      ensureSpace(META_SIZE + 8);
      const capLines = layoutParagraph(caption, { fontSize: META_SIZE, baseFont: italic, color: MUTED, maxWidth: CW - 40 });
      drawLines(capLines, { fontSize: META_SIZE, leading: META_SIZE + 4, x: ML + 20, color: MUTED });
    }
    y -= 12; // space after image
  }

  // --- PARSE MARKDOWN ---
  const rawLines = md.split('\n');
  let i = 0;

  // Title (first # heading)
  while (i < rawLines.length) {
    const line = rawLines[i].trim();
    if (line.startsWith('# ')) {
      const titleText = line.replace(/^# /, '');
      ensureSpace(50);
      const titleLines = layoutParagraph(titleText, { fontSize: 20, baseFont: displayBold, color: HEADING_COLOR, maxWidth: CW });
      drawLines(titleLines, { fontSize: 20, leading: 26, x: ML, color: DARK });
      y -= 8;
      isFirstElement = false;
      i++;
      break;
    }
    i++;
  }

  // Process remaining lines
  let paraBuffer = '';

  function flushPara() {
    if (paraBuffer.trim()) {
      ensureSpace(BODY_LEADING);
      drawParagraph(paraBuffer.trim());
      y -= PARA_GAP;
      paraBuffer = '';
    }
  }

  while (i < rawLines.length) {
    const raw = rawLines[i];
    const line = raw.trim();

    // Horizontal rule
    if (/^---+$/.test(line)) {
      flushPara();
      drawHRule();
      i++;
      continue;
    }

    // Section header (## )
    if (line.startsWith('## ') && !line.startsWith('### ')) {
      flushPara();
      const text = line.replace(/^## /, '');
      drawH1(text);
      i++;
      continue;
    }

    // Subsection header (### )
    if (line.startsWith('### ')) {
      flushPara();
      const text = line.replace(/^### /, '');
      drawH2(text);
      i++;
      continue;
    }

    // Meta line (- **Label:** value)
    const metaMatch = line.match(/^- \*\*(.+?):\*\*\s*(.+)$/);
    if (metaMatch) {
      flushPara();
      drawMeta(metaMatch[1] + ':', metaMatch[2]);
      i++;
      continue;
    }

    // Bullet line (- text) but not meta
    if (line.startsWith('- ') && !metaMatch) {
      flushPara();
      const text = line.replace(/^- /, '');
      drawBullet(text);
      i++;
      continue;
    }

    // Numbered line
    const numMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (numMatch) {
      flushPara();
      ensureSpace(BODY_LEADING);
      page.drawText(numMatch[1] + '.', { x: ML + 4, y, size: BODY_SIZE, font: bold, color: BULLET_COLOR });
      drawParagraph(numMatch[2], { indent: NUMBERED_INDENT });
      y -= 6;
      i++;
      continue;
    }

    // Image: ![caption](path)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      flushPara();
      await drawImage(imgMatch[2], imgMatch[1]);
      i++;
      continue;
    }

    // Empty line = paragraph break
    if (line === '') {
      flushPara();
      i++;
      continue;
    }

    // Regular text: accumulate into paragraph
    if (paraBuffer) paraBuffer += ' ';
    paraBuffer += line;
    i++;
  }
  flushPara();

  // Set metadata
  pdfDoc.setTitle('Growth Content Essay');
  pdfDoc.setAuthor('Growth Content Essay System');

  const pdfBytes = await pdfDoc.save();
  writeFileSync(outPath, pdfBytes);
  console.log(`PDF saved: ${outPath} (${pdfDoc.getPageCount()} pages)`);
}

main().catch(err => { console.error(err); process.exit(1); });
