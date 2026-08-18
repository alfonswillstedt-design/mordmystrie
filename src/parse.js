'use strict';
// Content-agnostic parser: markdown source -> structured document model.
// Nothing here knows anything about Thornmere Hall, its characters, or its
// cards. It reads the shared conventions only. A build report records what was
// recognised and what was ignored, so a future mystery that drifts in format
// is caught immediately rather than silently mislaid.

const { splitDoubleRule, splitSingleRule, bodyToHtml, inline, esc } = require('./md');

// Roman/word round names -> integer, so "## ROUND ONE" and "## ROUND 1" both work.
const WORD_NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
function roundToInt(word) {
  const w = String(word).trim().toLowerCase();
  if (WORD_NUM[w] != null) return WORD_NUM[w];
  const n = parseInt(w, 10);
  return Number.isFinite(n) ? n : null;
}

// A card is judged "long" (needs a double-width cell) when its body clearly
// overruns a normal card. Threshold is content-measured, never card-specific:
// cards a little over the norm auto-fit to a smaller size; only a genuine
// overrun earns the double cell.
const LONG_CARD_WORDS = 130;

function firstHeading(section) {
  const m = section.match(/^#\s+(.+?)\s*$/m);
  return m ? m[1].trim() : null;
}

// Parse the "documents" file into every physical object it defines.
// Returns { envelopeTexts, evidenceCards, privateNotes, envelopeLabels,
//           placeCards, verdictCard, invitation } plus report notes.
function parseDocuments(md, report) {
  const model = {
    envelopeTexts: [], evidenceCards: [], privateNotes: [],
    envelopeLabels: [], placeCards: [], verdictCard: null, invitation: null,
  };
  const sections = splitDoubleRule(md);

  for (const section of sections) {
    const h1 = firstHeading(section);
    if (!h1) continue;
    const key = h1.toUpperCase();
    const body = section.replace(/^#\s+.+?\n/, '');

    if (/ENVELOPE TEXTS/.test(key)) {
      parseEnvelopeTexts(body, model, report);
    } else if (/EVIDENCE CARDS/.test(key)) {
      parseEvidenceCards(body, model, report);
    } else if (/ENVELOPE LABELS/.test(key)) {
      parseEnvelopeLabels(body, model, report);
    } else if (/PLACE CARDS/.test(key)) {
      parsePlaceCards(body, model, report);
    } else if (/VERDICT/.test(key)) {
      parseVerdictCard(body, model, report);
    } else if (/INVITATION/.test(key)) {
      parseInvitation(body, model, report);
    } else if (/WHAT REMAINS|FOR LAYOUT/.test(key)) {
      report.ignored.push(`documents: "${h1}" (layout planning table, not printed)`);
    } else if (/^THORNMERE|—\s*PRINT DOCUMENTS|PRINT DOCUMENTS/.test(key)) {
      // File title / intro section — skip silently.
    } else {
      report.ignored.push(`documents: "${h1}" (unrecognised section)`);
    }
  }
  return model;
}

function parseEnvelopeTexts(body, model, report) {
  const parts = splitSingleRule(body);
  for (const part of parts) {
    const m = part.match(/^##\s+(.+)/m);
    if (!m) continue;
    const title = m[1].trim();
    const rest = part.replace(/^##\s+.+\n?/, '');
    model.envelopeTexts.push({
      title,
      order: model.envelopeTexts.length + 1,
      html: bodyToHtml(rest),
    });
  }
  report.recognised.push(`envelope texts: ${model.envelopeTexts.length}`);
}

function parseEvidenceCards(body, model, report) {
  // Body is a sequence of "## ROUND X" groups, each holding "**N — TITLE**"
  // cards and possibly "### PRIVATE NOTE — NAME" blocks, separated by single rules.
  const blocks = splitSingleRule(body);
  let round = null;
  const roundCounts = {};

  for (let block of blocks) {
    const roundHeader = block.match(/^##\s+ROUND\s+(\w+)/im);
    if (roundHeader) {
      round = roundToInt(roundHeader[1]);
      block = block.replace(/^##\s+ROUND\s+\w+\s*/im, '').trim();
      if (!block) continue;
    }

    const noteHeader = block.match(/^###\s+PRIVATE NOTE\s*[—–-]\s*(.+)/im);
    if (noteHeader) {
      const recipient = noteHeader[1].trim();
      const rest = block.replace(/^###\s+PRIVATE NOTE.*\n?/im, '');
      model.privateNotes.push({
        recipient,
        recipientKey: recipient.split(/\s+/)[0].toLowerCase(),
        round,
        html: bodyToHtml(rest),
      });
      continue;
    }

    const cardHeader = block.match(/^\*\*(\d+)\s*[—–-]\s*(.+?)\*\*/m);
    if (cardHeader) {
      const number = parseInt(cardHeader[1], 10);
      const title = cardHeader[2].trim();
      const rest = block.replace(/^\*\*\d+\s*[—–-].+?\*\*\s*/m, '');
      const words = rest.split(/\s+/).filter(Boolean).length;
      model.evidenceCards.push({
        number, round, title,
        html: bodyToHtml(rest),
        words,
        long: words >= LONG_CARD_WORDS,
      });
      roundCounts[round] = (roundCounts[round] || 0) + 1;
      continue;
    }
    // Text before the first round header is the section's own intro
    // ("Cut apart. Keep sorted…") — skip it silently, it is not a card.
    if (round === null) continue;
    // Anything else inside a round that is not a card is unexpected.
    if (block.trim()) report.ignored.push(`evidence block ignored: "${block.slice(0, 40).replace(/\n/g, ' ')}…"`);
  }

  model.evidenceCards.sort((a, b) => a.number - b.number);
  const perRound = Object.keys(roundCounts).sort().map((r) => `R${r}:${roundCounts[r]}`).join(' ');
  report.recognised.push(`evidence cards: ${model.evidenceCards.length} (${perRound})`);
  report.recognised.push(`private notes: ${model.privateNotes.length} (${model.privateNotes.map((n) => n.recipient).join(', ')})`);
}

function parseEnvelopeLabels(body, model, report) {
  const parts = splitSingleRule(body);
  for (const part of parts) {
    const m = part.match(/^\*\*(.+?)\*\*/);
    if (!m) continue;
    const title = m[1].trim();
    const lines = part.split('\n').slice(1).map((l) => l.trim()).filter(Boolean);
    model.envelopeLabels.push({ title, order: model.envelopeLabels.length + 1, lines });
  }
  report.recognised.push(`envelope labels: ${model.envelopeLabels.length}`);
}

function parsePlaceCards(body, model, report) {
  const re = /^\*\*(.+?)\*\*\s*(?:[—–-]\s*(.+))?$/gm;
  let m;
  while ((m = re.exec(body)) !== null) {
    model.placeCards.push({ name: m[1].trim(), subtitle: (m[2] || '').trim() });
  }
  report.recognised.push(`place cards: ${model.placeCards.length}`);
}

function parseVerdictCard(body, model, report) {
  // Structure: a bold title line, then a series of fields. A field is a prompt
  // (bold **?**, plain "Label ....", or italic *Label*) plus one or more write
  // lines (runs of dots). A dot run may sit inline after a label, or on its own
  // line beneath a bold prompt.
  const hasDots = (s) => (s.match(/[.·]/g) || []).length >= 6;
  const stripDots = (s) => s.replace(/[.\s·]{6,}.*$/, '').trim();
  const lines = body.split('\n').map((l) => l.trim());

  const fields = [];
  let title = '';
  let pending = null;
  const flush = () => { if (pending) { fields.push(pending); pending = null; } };

  for (const t of lines) {
    if (!t) continue;
    if (/^\*[^*].*[^*]\*$/.test(t) && !hasDots(t) && !/\*\*/.test(t)) continue; // pure scene-direction *...*
    const pureDots = /^[.\s·]+$/.test(t) && hasDots(t);
    if (pureDots) { if (!pending) pending = { label: '', lines: 0 }; pending.lines += 1; continue; }

    const bold = t.match(/^\*\*(.+?)\*\*\s*(.*)$/);
    if (bold) {
      const label = bold[1].trim();
      const trailing = bold[2].trim();
      // The first standalone bold line with no following dots is the title.
      if (!title && !hasDots(t)) { title = label; continue; }
      flush();
      pending = { label: inline(label), lines: hasDots(trailing) ? 1 : 0 };
      continue;
    }
    // "Your name ........." or "*Signed* ........." — label then inline dots.
    if (hasDots(t)) {
      flush();
      const label = stripDots(t).replace(/^\*|\*$/g, '').trim();
      pending = { label: inline(label), lines: 1 };
      continue;
    }
  }
  flush();
  model.verdictCard = { title: title || 'Verdict', fields };
  report.recognised.push(`verdict card: ${fields.length} fields`);
}

function parseInvitation(body, model, report) {
  // Strip a leading scene-direction, keep bracketed fields as fill-in slots.
  const fields = (body.match(/\[[^\]]+\]/g) || []).map((s) => s.replace(/[\[\]]/g, ''));
  model.invitation = { html: bodyToHtml(body), fields: [...new Set(fields)] };
  report.recognised.push(`invitation: ${model.invitation.fields.length} fill-in fields (${model.invitation.fields.join(', ')})`);
}

// Parse the characters file into booklets. Each doubled-rule section that has
// an H1 is a character; an optional "### ..." right under the H1 is a tag.
function parseCharacters(md, report) {
  const characters = [];
  const sections = splitDoubleRule(md);
  for (const section of sections) {
    const h1 = firstHeading(section);
    if (!h1) continue;
    // The intro section has an H1-less lead; skip file-title sections.
    if (/CHARACTER BOOKLETS/i.test(h1)) continue;
    const tagM = section.match(/^#\s+.+\n+###\s+(.+)/m);
    const tag = tagM ? tagM[1].trim() : null;
    let bodyMd = section.replace(/^#\s+.+?\n/, '');
    if (tag) bodyMd = bodyMd.replace(/^\s*###\s+.+?\n/, '');
    const sections2 = [];
    const re = /^##\s+(.+)$/gm;
    let m; const heads = [];
    while ((m = re.exec(bodyMd)) !== null) heads.push({ title: m[1].trim(), idx: m.index, end: re.lastIndex });
    for (let i = 0; i < heads.length; i++) {
      const start = heads[i].end;
      const stop = i + 1 < heads.length ? heads[i + 1].idx : bodyMd.length;
      const content = bodyMd.slice(start, stop).trim();
      const roundM = heads[i].title.match(/^Round\s+(\w+)/i);
      sections2.push({
        title: heads[i].title,
        round: roundM ? roundToInt(roundM[1]) : null,
        html: bodyToHtml(content),
      });
    }
    characters.push({ name: h1.trim(), tag, optional: !!tag && /optional/i.test(tag), sections: sections2 });
  }
  report.recognised.push(`characters: ${characters.length} (${characters.filter((c) => c.optional).length} optional)`);
  return characters;
}

// Parse a flowing document (host guide / solution) into an ordered list of
// blocks the templates can render: headings (levels), paragraphs, tables,
// ordered steps. Kept generic so any prose document works.
function parseFlow(md, report, label) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let para = [];
  let table = null;
  const flushPara = () => {
    if (para.length) { blocks.push({ type: 'p', html: inline(para.join(' ')) }); para = []; }
  };
  const flushTable = () => {
    if (table) { blocks.push({ type: 'table', rows: table }); table = null; }
  };
  for (const line of lines) {
    const t = line.trim();
    if (!t) { flushPara(); flushTable(); continue; }
    const h = t.match(/^(#{1,4})\s+(.+)/);
    if (h) { flushPara(); flushTable(); blocks.push({ type: 'h', level: h[1].length, html: inline(h[2].trim()) }); continue; }
    if (/^\|/.test(t)) {
      if (/^\|[\s|:-]+\|?$/.test(t)) continue; // separator row
      flushPara();
      const cells = t.replace(/^\||\|$/g, '').split('|').map((c) => inline(c.trim()));
      (table = table || []).push(cells);
      continue;
    }
    flushTable();
    const li = t.match(/^\*\*(\d+)\.\*\*\s*(.+)/) || t.match(/^(\d+)\.\s+(.+)/);
    if (li) { flushPara(); blocks.push({ type: 'step', n: parseInt(li[1], 10), html: inline(li[2].trim()) }); continue; }
    const bullet = t.match(/^[-*]\s+(.+)/);
    if (bullet) { flushPara(); blocks.push({ type: 'bullet', html: inline(bullet[1].trim()) }); continue; }
    para.push(t);
  }
  flushPara(); flushTable();
  if (report && label) report.recognised.push(`${label}: ${blocks.length} blocks`);
  return blocks;
}

module.exports = { parseDocuments, parseCharacters, parseFlow };
