'use strict';
// Character-booklets template. One booklet per character, each starting on a
// fresh page so they can be separated and handed out. Section headings are
// visually distinct; round-instruction sections get a loud tab so a player can
// find "what do I do this round" mid-game in low light. Content-agnostic: it is
// handed character objects and never inspects their prose.

const ROMAN = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI' };

function section(sec) {
  if (sec.round != null) {
    const numeral = ROMAN[sec.round] || String(sec.round);
    return `
      <section class="bk-sec bk-sec--round" data-round="${sec.round}">
        <div class="bk-round-tab">
          <span class="bk-round-word">Round</span>
          <span class="bk-round-num">${numeral}</span>
        </div>
        <div class="bk-round-body">${sec.html}</div>
      </section>`;
  }
  return `
    <section class="bk-sec">
      <h2 class="bk-h">${sec.title}</h2>
      <div class="bk-body">${sec.html}</div>
    </section>`;
}

function booklet(ch) {
  return `
  <article class="booklet">
    <header class="bk-head">
      <div class="bk-kicker">Thornmere Hall · in confidence</div>
      <h1 class="bk-name">${ch.name}</h1>
      <div class="bk-rule"><i></i></div>
    </header>
    <div class="bk-sections">
      ${ch.sections.map(section).join('\n')}
    </div>
    <footer class="bk-foot">Tell no one what is written here. Follow the round instructions exactly.</footer>
  </article>`;
}

function render(model) {
  const players = (model.meta && model.meta.players) || 8;
  // 6-player game: the optional cast is present in the house but not played,
  // so their booklets are not printed. Evidence is unchanged (see host guide).
  const cast = model.characters.filter((c) => players >= 8 || !c.optional);
  if (!cast.length) return '';
  return cast.map(booklet).join('\n');
}

module.exports = { render, title: 'Character Booklets' };
