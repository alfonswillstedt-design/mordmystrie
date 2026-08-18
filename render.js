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

// Templates registered by document type. More are added as they are built.
const TEMPLATES = [
  { file: 'evidence-cards', mod: require('./src/templates/evidence-cards') },
];

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

function htmlDoc({ baseCss, themeCss, bodyHtml, paper, ink }) {
  return `<!doctype html>
<html data-paper="${paper}" data-ink="${ink}">
<head><meta charset="utf-8">
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

  let count = 0;
  for (const paper of PAPERS) {
    for (const [ink, inkDir] of Object.entries(INKS)) {
      const dir = path.join(outRoot, paper, inkDir);
      fs.mkdirSync(dir, { recursive: true });
      for (const t of TEMPLATES) {
        const bodyHtml = t.mod.render(model);
        if (!bodyHtml.trim()) continue;
        const html = htmlDoc({ baseCss, themeCss, bodyHtml, paper, ink });
        // Load from the src dir so the relative font URLs in the theme resolve.
        await page.setContent(html, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        const pdf = path.join(dir, `${t.file}.pdf`);
        await page.pdf({
          path: pdf,
          width: paper === 'a4' ? '210mm' : '216mm',
          height: paper === 'a4' ? '297mm' : '279mm',
          printBackground: true,
          preferCSSPageSize: true,
        });
        count++;
      }
    }
  }
  await browser.close();
  console.log(`Wrote ${count} PDF(s) under ${path.relative(ROOT, outRoot)}/{letter,a4}/{full-colour,ink-saver}/\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
