/* ===================== LOTTERY SELLER: English scratch cards outside the post office ===================== */
NPC_DEFS.push({id:'tam', name:'Cô Tám', map:'village', home:[24, 23], role:'lottery', look:L_({skin:2, hairF:'curly', hairB:'short', hairC:'#5B3423', top:'top_polo', topC:'#FFC83D', bottom:'bot_skirt', bottomC:'#FF3552', hat:'hat_beret', face2:'face_round', bag:'bag_cross', neck:'neck_bowtie', pet:'pet_chick'}),
  greet:['Lucky tickets!','Try your luck!'], line:() => ({en:`Hello ${S.name}! Would you like a lucky ticket today?`, vi:`Chào ${S.name}! Mua vé số may mắn không cháu?`})});

const LOTTO_PRICE = 30, LOTTO_DAY = 10;
// symbol, English word, Vietnamese, prize text, chance of winning it (the rest of the time the card loses)
const LOTTO = [
  {k: 'coin', en: 'coin', vi: 'đồng xu', win: '50 xu', p: 0.2, give: () => { S.coins += 50; }},
  {k: 'clover', en: 'four-leaf clover', vi: 'cỏ bốn lá', win: '150 xu', p: 0.12, give: () => { S.coins += 150; }},
  {k: 'emerald', en: 'emerald', vi: 'ngọc lục bảo', win: '3 ngọc lục bảo', p: 0.07, give: () => { S.em += 3; }},
  {k: 'diamond', en: 'diamond', vi: 'kim cương', win: '2 kim cương', p: 0.035, give: () => { S.di += 2; }},
  {k: 'key', en: 'key', vi: 'chìa khoá', win: '1 chìa khoá rương', p: 0.02, give: () => { S.keys = (S.keys || 0) + 1; }},
  {k: 'star', en: 'shooting star', vi: 'sao băng', win: 'ĐỘC ĐẮC: 1000 xu + 5 kim cương', p: 0.005, give: () => { S.coins += 1000; S.di += 5; }}
];
const LOTTO_ICON = {
  coin: '<circle cx="20" cy="20" r="14" fill="#FFC83D" stroke="#C98A1A" stroke-width="3"/><path d="M20 12v16M15 16h8a3 3 0 0 1 0 6h-6a3 3 0 0 0 0 6h8" stroke="#C98A1A" stroke-width="2.4" fill="none"/>',
  clover: '<g fill="#3DBE6C"><circle cx="14" cy="14" r="7"/><circle cx="26" cy="14" r="7"/><circle cx="14" cy="26" r="7"/><circle cx="26" cy="26" r="7"/></g><path d="M20 20Q24 30 30 36" stroke="#2E8B47" stroke-width="2.4" fill="none"/>',
  emerald: '<path d="M20 4L34 16L20 36L6 16Z" fill="#3DDC84" stroke="#1E9E5A" stroke-width="2"/><path d="M6 16H34M20 4L14 16L20 36L26 16Z" stroke="#FFFFFF" stroke-width="1.2" fill="none" opacity=".7"/>',
  diamond: '<path d="M8 14L14 6H26L32 14L20 34Z" fill="#8EC9FF" stroke="#4D8BFF" stroke-width="2"/><path d="M8 14H32M14 6L18 14L20 34L22 14L26 6" stroke="#FFFFFF" stroke-width="1.2" fill="none" opacity=".8"/>',
  key: '<circle cx="13" cy="14" r="8" fill="none" stroke="#FFB020" stroke-width="4"/><path d="M19 19L33 33M27 27L31 23M30 30L34 26" stroke="#FFB020" stroke-width="4" stroke-linecap="round"/>',
  star: '<path d="M20 3L25 15L38 15L27 23L31 36L20 28L9 36L13 23L2 15L15 15Z" fill="url(#lgold)" stroke="#FF6FB5" stroke-width="1.5"/>'
};
const lottoImg = k => svgURL(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="lgold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF3B0"/><stop offset="1" stop-color="#FFB020"/></linearGradient></defs>${LOTTO_ICON[k]}</svg>`);
let LOTTO_CARD = null;
function lottoLeft() { const d = new Date().toISOString().slice(0, 10); if (!S.lotto || S.lotto.day !== d) S.lotto = {day: d, n: 0}; return LOTTO_DAY - S.lotto.n; }
// decide the result first, then lay out six symbols that show it (a win has exactly three of one symbol)
function lottoDeal() {
  let r = Math.random(), prize = null;
  for (const x of [...LOTTO].reverse()) { if (r < x.p) { prize = x; break; } r -= x.p; }
  const syms = [];
  if (prize) { syms.push(prize.k, prize.k, prize.k); const others = shuffle(LOTTO.filter(x => x !== prize)); syms.push(others[0].k, others[0].k, others[1].k); }
  else { const pick = shuffle(LOTTO); syms.push(pick[0].k, pick[0].k, pick[1].k, pick[1].k, pick[2].k, pick[3].k); }
  return {cells: shuffle(syms), open: [false, false, false, false, false, false], prize, done: false};
}
function lottoBuy() {
  if (lottoLeft() <= 0 || S.coins < LOTTO_PRICE || (LOTTO_CARD && !LOTTO_CARD.done)) return;
  S.coins -= LOTTO_PRICE; S.lotto.n++; LOTTO_CARD = lottoDeal(); sfx('coin'); speak('Good luck!', true); renderHUD(); markDirty(); refreshNpc();
}
function lottoScratch(i) {
  const c = LOTTO_CARD; if (!c || c.done || c.open[i]) return;
  c.open[i] = true; speak(LOTTO.find(x => x.k === c.cells[i]).en, true);
  if (c.open.every(Boolean)) lottoFinish(); else refreshNpc();
}
function lottoAll() { const c = LOTTO_CARD; if (!c || c.done) return; c.open = c.open.map(() => true); lottoFinish(); }
function lottoFinish() {
  const c = LOTTO_CARD; c.done = true;
  if (c.prize) { c.prize.give(); sfx('level'); queueFx({kind: 'spark', who: 'player'}); speak(c.prize.k === 'star' ? 'Jackpot!' : 'You win!', true); }
  else sfx('bad');
  renderHUD(); markDirty(); saveNow(); refreshNpc();
}
function lottoHTML() {
  const left = lottoLeft(), c = LOTTO_CARD;
  const card = c ? `<div class="lotto">${c.cells.map((k, i) => { const x = LOTTO.find(y => y.k === k); return c.open[i]
      ? `<div class="lcell open ${c.done && c.prize && k === c.prize.k ? 'win' : ''}"><img src="${lottoImg(k)}" alt=""><b>${esc(x.en)}</b><small>${esc(x.vi)}</small></div>`
      : `<button class="lcell" data-act="lotto-scratch" data-i="${i}" aria-label="Cào ô ${i + 1}"><span>CÀO</span></button>`; }).join('')}</div>
    ${c.done ? (c.prize ? `<div class="fb good"><strong>${c.prize.k === 'star' ? 'ĐỘC ĐẮC!' : 'Trúng thưởng!'}</strong> Ba ô “${esc(c.prize.en)}” (${esc(c.prize.vi)}): bạn nhận <b>${c.prize.win}</b>.</div>` : `<div class="fb miss"><strong>Chưa trúng.</strong> Không có ba ô nào giống nhau. Thử vé khác nhé!</div>`)
      : `<div class="row-btns"><button class="btn ghost sm" data-act="lotto-all">Cào hết</button></div>`}` : '';
  return `<p class="note">Vé số cào tiếng Anh: chạm vào từng ô để cào, mỗi ô hiện một hình kèm tên tiếng Anh. Ba ô giống nhau là trúng. Hôm nay còn <b>${left}/${LOTTO_DAY}</b> vé.</p>
    <div class="ltable">${LOTTO.map(x => `<span><img src="${lottoImg(x.k)}" alt=""> ×3 <b>${esc(x.en)}</b>: ${x.win}</span>`).join('')}</div>
    ${card}
    <div class="row-btns"><button class="btn gold" data-act="lotto-buy" ${left <= 0 || S.coins < LOTTO_PRICE || (c && !c.done) ? 'disabled' : ''}>${c && !c.done ? 'Cào xong vé này trước' : left <= 0 ? 'Hết vé hôm nay' : `Mua vé · ${coinIcon}${LOTTO_PRICE}`}</button></div>`;
}
