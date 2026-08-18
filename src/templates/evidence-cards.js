'use strict';
// Evidence-cards template. Lays the deck out four-up on sheets with cut marks
// and a round pip in the corner. Content-agnostic: it is handed an array of
// card objects and never inspects their text.

const { ROMAN, ticks } = require('../marks');

function cardCell(card) {
  const pip = ROMAN[card.round] || String(card.round || '');
  // Long cards get a touch more room, so ease the body size down a hair.
  const fontVar = card.long ? '--card-font:3.7mm;' : '';
  return `
  <div class="cut-cell${card.long ? ' long' : ''}" style="${fontVar}">
    ${ticks()}
    <div class="trim"></div>
    <div class="card">
      <div class="band">
        <div class="cardno">${card.number}</div>
        <div class="cardtitle">${card.title}</div>
        <div class="pip" title="round ${card.round}">${pip}</div>
      </div>
      <div class="body">${card.html}</div>
      <div class="finis"><i></i></div>
    </div>
  </div>`;
}

// Pack cards into pages. A page holds 2 rows; a row holds two normal cards or
// one long (full-width) card. Cards stay in number order.
function paginate(cards) {
  const rows = [];
  let row = [];
  const pushRow = () => { if (row.length) { rows.push(row); row = []; } };
  for (const card of cards) {
    if (card.long) { pushRow(); rows.push([card]); continue; }
    row.push(card);
    if (row.length === 2) pushRow();
  }
  pushRow();
  const pages = [];
  for (let i = 0; i < rows.length; i += 2) pages.push(rows.slice(i, i + 2));
  return pages;
}

function render(model) {
  const cards = model.evidenceCards;
  const pages = paginate(cards);
  const sheets = pages
    .map((rows) => {
      const cells = rows.flat().map(cardCell).join('\n');
      return `<div class="sheet"><div class="deck">${cells}</div></div>`;
    })
    .join('\n');
  return sheets;
}

module.exports = { render, title: 'Evidence Cards' };
