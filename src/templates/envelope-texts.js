'use strict';
// Envelope texts — the passages read aloud at the start of each round, one per
// page, set large for reading in a dim room. In full colour each sits on a dark
// inset panel (dark backgrounds are allowed here); ink-saver uses a framed light
// panel so it reads as deliberate, not stripped.

function page(env) {
  return `
  <div class="sheet">
    <div class="env">
      <div class="env-inner">
        <div class="env-kicker">${env.title}</div>
        <div class="env-rule"><i></i></div>
        <div class="env-body">${env.html}</div>
      </div>
    </div>
  </div>`;
}

function render(model) {
  const texts = model.envelopeTexts || [];
  if (!texts.length) return '';
  return texts.map(page).join('\n');
}

module.exports = { render, title: 'Envelope Texts' };
