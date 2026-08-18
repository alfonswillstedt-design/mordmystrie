'use strict';
// Invitation — a single decorative page, the buyer's first impression of the
// product. Bracketed fields become write-lines with a faint label, so the host
// fills them in by hand (a handwritten guest name suits Ambrose's letter). The
// most ornamented document in the set, but kept light so a buyer isn't asked to
// flood a page with ink.

// Turn "[Guest name]" into an underline to write on, labelled faintly beneath.
function fills(html) {
  return html.replace(/\[([^\]]+)\]/g, (m, label) =>
    `<span class="inv-fill"><span class="inv-fill-line"></span><span class="inv-fill-label">${label}</span></span>`);
}

// The source separates the letter body from a trailing footer block with a
// single rule; the parser has already flattened that to paragraphs, so we keep
// the whole thing as one flowing letter and let the fields fall where they are.
function render(model) {
  const inv = model.invitation;
  if (!inv) return '';
  let html = inv.html;
  // Feature a leading standalone bold line as the invitation's display title.
  let title = '';
  html = html.replace(/^\s*<p><strong>(.+?)<\/strong><\/p>\s*/, (m, t) => { title = t; return ''; });
  const titleHtml = title ? `<h1 class="inv-title">${title}</h1>` : '';
  const body = fills(html);
  return `
  <div class="sheet">
    <div class="inv">
      <div class="inv-frame">
        <div class="inv-orn inv-orn-top">✦</div>
        ${titleHtml}
        <div class="inv-body">${body}</div>
        <div class="inv-orn inv-orn-bot">✦</div>
      </div>
    </div>
  </div>`;
}

module.exports = { render, title: 'Invitation' };
