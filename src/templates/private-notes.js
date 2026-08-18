'use strict';
// Private notes — small cards sized to fit a small envelope, handed to named
// players in round two. Two per sheet with cut marks. Each is headed with the
// recipient's name so the host can put it in the right envelope without reading
// the note.

const { ticks } = require('../marks');

function cell(note) {
  return `
  <div class="cut-cell pn-cell">
    ${ticks()}
    <div class="trim"></div>
    <div class="pn">
      <div class="pn-head">
        <span class="pn-for">For</span>
        <span class="pn-name">${note.recipient}</span>
      </div>
      <div class="pn-body">${note.html}</div>
      <div class="pn-finis"><i></i></div>
    </div>
  </div>`;
}

function render(model) {
  const notes = model.privateNotes || [];
  if (!notes.length) return '';
  const cells = notes.map(cell).join('\n');
  return `<div class="sheet"><div class="grid-notes">${cells}</div></div>`;
}

module.exports = { render, title: 'Private Notes' };
