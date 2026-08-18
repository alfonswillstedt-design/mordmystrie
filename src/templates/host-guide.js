'use strict';
// Host guide — a multi-page working booklet on a light background, clear
// numbered steps, readable at arm's length while running the party. Not
// decorative. Flowing single column.

const { renderBlocks } = require('./_flow');

function render(model) {
  const blocks = (model.hostGuide || []).slice();
  if (!blocks.length) return '';
  // Feature the leading H1 as the guide's masthead.
  let title = model.meta && model.meta.title ? model.meta.title : '';
  let kicker = 'Host guide';
  if (blocks[0] && blocks[0].type === 'h' && blocks[0].level === 1) {
    const t = blocks.shift().html;
    const parts = t.split(/\s+[—–-]\s+/);
    if (parts.length > 1) { title = parts[0]; kicker = parts.slice(1).join(' — '); }
    else { title = t; }
  }
  return `
  <div class="doc guide">
    <header class="doc-head">
      <div class="doc-kicker">${kicker}</div>
      <h1 class="doc-title">${title}</h1>
      <div class="doc-rule"><i></i></div>
    </header>
    <div class="doc-body">${renderBlocks(blocks)}</div>
  </div>`;
}

module.exports = { render, title: 'Host Guide' };
