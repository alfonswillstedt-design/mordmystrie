'use strict';
// Solution — its own separate file, never merged into any other document. Page
// one is a warning cover so the file can be printed, folded and sealed without
// a line of the answer showing in a print preview or thumbnail. The reveal and
// walkthrough follow. The renderer writes this to a separate folder, away from
// the play materials.

const { renderBlocks } = require('./_flow');

function render(model) {
  const blocks = (model.solution || []).slice();
  if (!blocks.length) return '';
  const title = model.meta && model.meta.title ? model.meta.title : 'The mystery';

  // Drop the leading H1 and the printed "do not open" line — the cover states
  // it far more emphatically.
  if (blocks[0] && blocks[0].type === 'h' && blocks[0].level === 1) blocks.shift();
  while (blocks[0] && blocks[0].type === 'p' && /do not open this until/i.test(blocks[0].html)) blocks.shift();

  const cover = `
  <div class="sol-cover">
    <div class="sol-cover-inner">
      <div class="sol-cover-word">Solution</div>
      <h1 class="sol-cover-title">${title}</h1>
      <div class="sol-cover-rule"></div>
      <p class="sol-cover-warn">Do not read this.</p>
      <p class="sol-cover-note">Nobody at the table knows the answer, including the host. Print this without reading it, fold it, and seal it inside envelope four. Everything needed to run the evening is in the host guide.</p>
      <div class="sol-cover-seal">Open only when every verdict card is complete</div>
    </div>
  </div>`;

  const content = `
  <div class="doc solution">
    <div class="doc-body">${renderBlocks(blocks)}</div>
  </div>`;

  return cover + content;
}

module.exports = { render, title: 'Solution', separate: true };
