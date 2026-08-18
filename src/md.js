'use strict';
// Minimal, dependency-free markdown helpers tuned to the source conventions.
// We deliberately do NOT use a full markdown library: the source format is a
// small, fixed set of conventions (see docs), and a tiny purpose-built parser
// is easier to reason about and keeps layout independent of content.

// Escape text for safe HTML insertion.
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Inline formatting: **bold**, *italic*, and a couple of typographic niceties.
// Applied to already-escaped text.
function inline(raw) {
  let s = esc(raw);
  // bold then italic (order matters so ** is consumed before *)
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return s;
}

// Split a markdown string into an array of "sections" delimited by a doubled
// horizontal rule (--- immediately followed by ---). This is the top-level
// record separator used across every source file.
function splitDoubleRule(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const sections = [];
  let cur = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---' && i + 1 < lines.length && lines[i + 1].trim() === '---') {
      sections.push(cur.join('\n'));
      cur = [];
      i++; // skip the second rule
      continue;
    }
    cur.push(lines[i]);
  }
  sections.push(cur.join('\n'));
  return sections.map((s) => s.replace(/^\n+|\n+$/g, ''));
}

// Split on a single horizontal rule (--- on its own line) that is NOT part of a
// doubled rule. Used inside a section (e.g. between evidence cards).
function splitSingleRule(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const parts = [];
  let cur = [];
  for (let i = 0; i < lines.length; i++) {
    const isRule = lines[i].trim() === '---';
    const prevRule = i > 0 && lines[i - 1].trim() === '---';
    const nextRule = i + 1 < lines.length && lines[i + 1].trim() === '---';
    if (isRule && !prevRule && !nextRule) {
      parts.push(cur.join('\n'));
      cur = [];
      continue;
    }
    if (isRule && (prevRule || nextRule)) continue; // skip doubled-rule members
    cur.push(lines[i]);
  }
  parts.push(cur.join('\n'));
  return parts.map((s) => s.replace(/^\n+|\n+$/g, '')).filter((s) => s.length);
}

// Turn a block of body markdown into HTML paragraphs. Blank line = new
// paragraph. Lines that are only an italic scene-direction (*...*) get a
// dedicated class so themes can style them.
function bodyToHtml(md) {
  const paras = md.replace(/\r\n/g, '\n').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return paras
    .map((p) => {
      const oneLine = p.replace(/\n/g, ' ').trim();
      const direction = /^\*[^*].*\*$/.test(oneLine) && !oneLine.includes('**');
      const cls = direction ? ' class="direction"' : '';
      return `<p${cls}>${inline(oneLine)}</p>`;
    })
    .join('\n');
}

module.exports = { esc, inline, splitDoubleRule, splitSingleRule, bodyToHtml };
