#!/usr/bin/env node
'use strict';
/* Mordmyst print system — single-command build.
 *
 *   node render.js [content-dir]
 *
 * Reads the markdown source + mystery.toml in the content directory and writes
 * print-ready PDFs into ./out, organised by paper size and ink mode. The
 * layout engine is entirely separate from the content: nothing here, and
 * nothing under src/, references any particular mystery.
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');
const { parseDocuments, parseCharacters, parseFlow } = require('./src/parse');

const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const ROOT = __dirname;

// ---- tiny TOML reader (flat keys + [section] tables; enough for mystery.toml)
function readToml(file) {
  const out = {};
  let tbl = out;
  for (const raw of fs.readFileSync(file, 'utf8').split('\n')) {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) continue;
    const sec = line.match(/^\[(.+?)\]$/);
    if (sec) { tbl = out[sec[1]] = {}; continue; }
    const kv = line.match(/^([\w-]+)\s*=\s*(.+)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (/^".*"$/.test(v)) v = v.slice(1, -1);
    else if (/^\d+$/.test(v)) v = parseInt(v, 10);
    tbl[kv[1]] = v;
  }
  return out;
}

const PAPERS = ['letter', 'a4'];
const INKS = { colour: 'full-colour', saver: 'ink-saver' };

// Templates registered by document type. Each declares its page margin, since
// cards trim to the sheet edge (0) while flowing documents need real margins.
// More are added as they are built.
const TEMPLATES = [
  { file: 'evidence-cards',     mod: require('./src/templates/evidence-cards'),     margin: '0' },
  { file: 'character-booklets', mod: require('./src/templates/character-booklets'), margin: '15mm 16mm' },
];

const PAGE_SIZE = { a4: 'A4', letter: 'letter' };

// Inline every url('*.woff2') in a stylesheet as a base64 data URI, resolving
// paths relative to the stylesheet's own directory. Guarantees the fonts are
// embedded in the PDF and that the build needs no web server or base URL.
function inlineFonts(css, cssDir) {
  return css.replace(/url\(\s*['"]?([^'")]+\.woff2)['"]?\s*\)/g, (m, rel) => {
    const p = path.resolve(cssDir, rel);
    const b64 = fs.readFileSync(p).toString('base64');
    return `url(data:font/woff2;base64,${b64}) format('woff2')`;
  });
}

function htmlDoc({ baseCss, themeCss, bodyHtml, paper, ink, margin }) {
  return `<!doctype html>
<html data-paper="${paper}" data-ink="${ink}">
<head><meta charset="utf-8">
<style>@page { size: ${PAGE_SIZE[paper]}; margin: ${margin}; }</style>
<style>${baseCss}</style>
<style>${themeCss}</style>
</head>
<body>${bodyHtml}</body>
</html>`;
}

async function main() {
  const contentDir = path.resolve(process.argv[2] || 'content/thornmere-hall');
  const cfg = readToml(path.join(contentDir, 'mystery.toml'));
  const src = cfg.source || {};
  const read = (f) => fs.readFileSync(path.join(contentDir, f), 'utf8');

  const report = { recognised: [], ignored: [] };
  const model = parseDocuments(read(src.documents), report);
  model.characters = parseCharacters(read(src.characters), report);
  model.hostGuide = parseFlow(read(src.host_guide), report, 'host guide');
  model.solution = parseFlow(read(src.solution), report, 'solution');
  model.meta = { title: cfg.title, players: cfg.players, theme: cfg.theme };

  // Build report — what the engine understood, and what it set aside.
  console.log(`\n${cfg.title}  ·  theme: ${cfg.theme}  ·  ${cfg.players} players`);
  console.log('─'.repeat(52));
  report.recognised.forEach((r) => console.log('  ✓ ' + r));
  report.ignored.forEach((r) => console.log('  · ignored ' + r));
  console.log('');

  const baseCss = fs.readFileSync(path.join(ROOT, 'src', 'base.css'), 'utf8');
  const themePath = path.join(ROOT, 'src', 'themes', `${cfg.theme}.css`);
  if (!fs.existsSync(themePath)) throw new Error(`Unknown theme "${cfg.theme}" (no ${themePath})`);
  const themeCss = inlineFonts(fs.readFileSync(themePath, 'utf8'), path.dirname(themePath));

  const outRoot = path.join(ROOT, 'out', cfg.slug || 'mystery');
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--font-render-hinting=none'] });
  const page = await browser.newPage();

  const dims = (paper) => ({ width: paper === 'a4' ? '210mm' : '216mm', height: paper === 'a4' ? '297mm' : '279mm' });

  // Render one HTML body to a PDF buffer, returning the buffer and its page count.
  async function toPdf(bodyHtml, { paper, ink, margin, outPath }) {
    const html = htmlDoc({ baseCss, themeCss, bodyHtml, paper, ink, margin });
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const buf = await page.pdf({ ...dims(paper), printBackground: true, preferCSSPageSize: true });
    if (outPath) fs.writeFileSync(outPath, buf);
    const pages = (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    return { pages };
  }

  // Booklets must occupy whole sheets so they can be handed out individually.
  // Measure each booklet's page count (once per paper — ink doesn't change flow)
  // and mark those that come out odd, so the template pads them to even.
  async function padSetFor(paper) {
    const cast = t_booklets.mod.getCast(model);
    const padAfter = new Set();
    for (let i = 0; i < cast.length; i++) {
      const { pages } = await toPdf(t_booklets.mod.renderOne(cast[i]), { paper, ink: 'colour', margin: t_booklets.margin });
      if (pages % 2 === 1) padAfter.add(i);
    }
    return padAfter;
  }
  const t_booklets = TEMPLATES.find((t) => t.file === 'character-booklets');

  let count = 0;
  for (const paper of PAPERS) {
    const bookletPad = t_booklets ? await padSetFor(paper) : new Set();
    for (const [ink, inkDir] of Object.entries(INKS)) {
      const dir = path.join(outRoot, paper, inkDir);
      fs.mkdirSync(dir, { recursive: true });
      for (const t of TEMPLATES) {
        const opts = t === t_booklets ? { padAfter: bookletPad } : {};
        const bodyHtml = t.mod.render(model, opts);
        if (!bodyHtml.trim()) continue;
        await toPdf(bodyHtml, { paper, ink, margin: t.margin, outPath: path.join(dir, `${t.file}.pdf`) });
        count++;
      }
    }
  }
  await browser.close();
  console.log(`Wrote ${count} PDF(s) under ${path.relative(ROOT, outRoot)}/{letter,a4}/{full-colour,ink-saver}/\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
