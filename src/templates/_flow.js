'use strict';
// Shared renderer for flowing prose documents (host guide, solution). Turns the
// parser's block list into HTML, grouping consecutive bullets and numbered
// steps into lists and styling headings, tables and steps. Content-agnostic.

function tableHtml(rows) {
  if (!rows.length) return '';
  const [head, ...body] = rows;
  const th = `<thead><tr>${head.map((c) => `<th>${c}</th>`).join('')}</tr></thead>`;
  const tb = `<tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>`;
  return `<div class="fl-tablewrap"><table class="fl-table">${th}${tb}</table></div>`;
}

function renderBlocks(blocks) {
  const out = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.type === 'bullet') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'bullet') { items.push(`<li>${blocks[i].html}</li>`); i++; }
      out.push(`<ul class="fl-ul">${items.join('')}</ul>`);
      continue;
    }
    if (b.type === 'step') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'step') {
        items.push(`<li class="fl-step"><span class="fl-step-n">${blocks[i].n}</span><span class="fl-step-b">${blocks[i].html}</span></li>`);
        i++;
      }
      out.push(`<ol class="fl-ol">${items.join('')}</ol>`);
      continue;
    }
    if (b.type === 'h') { out.push(`<h${b.level} class="fl-h fl-h${b.level}">${b.html}</h${b.level}>`); i++; continue; }
    if (b.type === 'table') { out.push(tableHtml(b.rows)); i++; continue; }
    out.push(`<p class="fl-p">${b.html}</p>`); i++;
  }
  return out.join('\n');
}

module.exports = { renderBlocks };
