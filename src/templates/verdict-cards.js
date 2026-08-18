'use strict';
// Verdict cards — one per player. Four per sheet with cut marks. Writing lines
// are real ruled lines with enough height to actually write on, not printed
// rows of dots.

const { ticks } = require('../marks');

function field(f) {
  const lines = Math.max(1, f.lines || 1);
  const rows = Array.from({ length: lines }, () => '<div class="vc-writeline"></div>').join('');
  return `
    <div class="vc-field">
      <div class="vc-label">${f.label}</div>
      <div class="vc-lines">${rows}</div>
    </div>`;
}

function cell(vc, title) {
  return `
  <div class="cut-cell vc-cell">
    ${ticks()}
    <div class="trim"></div>
    <div class="vc">
      <div class="vc-head">${title}</div>
      <div class="vc-fields">${vc.fields.map(field).join('\n')}</div>
    </div>
  </div>`;
}

function render(model) {
  const vc = model.verdictCard;
  if (!vc) return '';
  const players = (model.meta && model.meta.players) || 8;
  const title = vc.title || 'Verdict';
  const cells = [];
  for (let i = 0; i < players; i++) cells.push(cell(vc, title));
  const sheets = [];
  for (let i = 0; i < cells.length; i += 4) {
    sheets.push(`<div class="sheet"><div class="grid-2x2">${cells.slice(i, i + 4).join('\n')}</div></div>`);
  }
  return sheets.join('\n');
}

module.exports = { render, title: 'Verdict Cards' };
