'use strict';
// Shared print marks used by every card-style template. Kept in one place so
// cut geometry is identical across documents.

const ROMAN = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI' };
const WORD = { 1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven', 8: 'Eight' };

// Four corner crop ticks (two thin spans each) giving scissors a target even
// where two cells share a lane. `cls` is an optional extra class (e.g. 'fold').
function ticks(cls = '') {
  return ['tl', 'tr', 'bl', 'br']
    .map((c) => `<span class="tickmark h tk-${c}-h ${cls}"></span><span class="tickmark v tk-${c}-v ${cls}"></span>`)
    .join('');
}

module.exports = { ROMAN, WORD, ticks };
