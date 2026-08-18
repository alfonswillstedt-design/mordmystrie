'use strict';
// Place cards — tent-fold. Each card folds along a centre line so the name
// reads from both sides of the table: the top half is set upside-down, so when
// the card is folded over it stands as a tent with the name the right way up on
// each face. Four per sheet, cut marks plus a dashed fold line.

const { ticks } = require('../marks');

function face(card) {
  const sub = card.subtitle ? `<div class="pc-sub">${card.subtitle}</div>` : '';
  return `<div class="pc-face"><div class="pc-name">${card.name}</div>${sub}</div>`;
}

function cell(card) {
  return `
  <div class="cut-cell pc-cell">
    ${ticks()}
    <div class="trim"></div>
    <div class="pc">
      <div class="pc-half pc-top">${face(card)}</div>
      <div class="pc-foldline"><span>fold</span></div>
      <div class="pc-half pc-bottom">${face(card)}</div>
    </div>
  </div>`;
}

function render(model) {
  const cards = model.placeCards || [];
  if (!cards.length) return '';
  // Four per sheet (2×2).
  const sheets = [];
  for (let i = 0; i < cards.length; i += 4) {
    const cells = cards.slice(i, i + 4).map(cell).join('\n');
    sheets.push(`<div class="sheet"><div class="grid-2x2 place-grid">${cells}</div></div>`);
  }
  return sheets.join('\n');
}

module.exports = { render, title: 'Place Cards' };
