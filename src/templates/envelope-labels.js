'use strict';
// Envelope labels — four on one sheet, sized to fix to standard letter
// envelopes. Each carries the numeral and the opening instruction. Cut marks.

const { ticks, WORD } = require('../marks');

function cell(label, i) {
  const numeral = (label.title || WORD[i + 1] || String(i + 1)).toString();
  const lines = (label.lines || []).map((l) => `<div class="el-line">${l}</div>`).join('');
  return `
  <div class="cut-cell el-cell">
    ${ticks()}
    <div class="trim"></div>
    <div class="el">
      <div class="el-num">${numeral}</div>
      <div class="el-body">${lines}</div>
    </div>
  </div>`;
}

function render(model) {
  const labels = model.envelopeLabels || [];
  if (!labels.length) return '';
  const cells = labels.map(cell).join('\n');
  return `<div class="sheet"><div class="label-stack">${cells}</div></div>`;
}

module.exports = { render, title: 'Envelope Labels' };
