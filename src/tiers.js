/* ===================== UPGRADE TIERS: every level adds something you can see (merged into chibi.js) ===================== */
// Only Epic (rar 2) and better items can be upgraded.
const CAN_UPGRADE = f => !!f && UPGRADABLE(f.slot) && ((f.rar || 0) >= 2 || SPECIAL_UP.includes(f.id));
const TIER_PERK = [
  'Bản gốc',
  'Viền bạc, lấp lánh nhẹ',
  'Gắn ngọc lục bảo quanh món đồ',
  'Vòng quỹ đạo, đá quý bay quanh, cánh thêm lớp',
  'Phát sáng tím huyền bí',
  'Tia sáng vàng, cánh to hơn, mũ mọc cánh',
  'Cầu vồng tối thượng, sao lớn, vầng hào quang'
];
const tierCol = lv => TIER[lv] === 'rainbow' ? 'url(#rb)' : TIER[lv];
const tierSolid = lv => TIER[lv] === 'rainbow' ? '#FFE48A' : TIER[lv];
// where the effects gather for each slot: centre and radius in chibi units (hand: in the held item's own coordinates)
const TIER_ANCHOR = {
  hat: {x: 72.5, y: 22, r: 44}, face: {x: 72.5, y: 82, r: 40}, mouth: {x: 84, y: 100, r: 26}, deco: {x: 72.5, y: 99, r: 38},
  ear: {x: 72.5, y: 108, r: 62}, neck: {x: 72.5, y: 122, r: 30}, shoes: {x: 72.5, y: 154, r: 30}, bag: {x: 72.5, y: 138, r: 36},
  back: {x: 72.5, y: 96, r: 78}, hand: {x: 16, y: -26, r: 34}
};
const sparkle = (x, y, r, col) => `<path d="M${x} ${y - r}Q${x + r * .18} ${y - r * .18} ${x + r} ${y}Q${x + r * .18} ${y + r * .18} ${x} ${y + r}Q${x - r * .18} ${y + r * .18} ${x - r} ${y}Q${x - r * .18} ${y - r * .18} ${x} ${y - r}Z" fill="${col}"/>`;
const gem = (x, y, s, col) => `<path d="M${x} ${y - s}L${x + s * .8} ${y}L${x} ${y + s}L${x - s * .8} ${y}Z" fill="${col}" stroke="#FFFFFF" stroke-width="${s * .25}"/>`;
function tierBehind(slot, lv) {
  const A = TIER_ANCHOR[slot]; if (!A || lv < 4) return '';
  // items worn on the face must not haze over it: no glow disc or rays there, and hat rays only fan upwards
  const onFace = ['face', 'mouth', 'deco', 'ear'].includes(slot);
  let s = onFace ? '' : `<circle cx="${A.x}" cy="${A.y}" r="${A.r * 1.05}" fill="${tierSolid(lv)}" opacity="${slot === 'hat' ? .1 : .16}"/><circle cx="${A.x}" cy="${A.y}" r="${A.r * .7}" fill="${tierSolid(lv)}" opacity="${slot === 'hat' ? .08 : .14}"/>`;
  if (lv >= 5 && !onFace) s += Array.from({length: 12}, (_, i) => { const a = i / 12 * Math.PI * 2, a1 = a - 0.07, a2 = a + 0.07, R = A.r * 1.45;
    if (slot === 'hat' && Math.sin(a) > -0.2) return '';
    return `<path d="M${A.x} ${A.y}L${A.x + Math.cos(a1) * R} ${A.y + Math.sin(a1) * R}L${A.x + Math.cos(a2) * R} ${A.y + Math.sin(a2) * R}Z" fill="#FFE48A" opacity=".35"/>`; }).join('');
  if (lv >= 6) s += `<circle cx="${A.x}" cy="${A.y}" r="${A.r * 1.22}" fill="none" stroke="url(#rb)" stroke-width="${Math.max(2, A.r * .07)}" opacity=".85"/>`;
  return s;
}
function tierFront(slot, lv, tw) {
  const A = TIER_ANCHOR[slot]; if (!A || !lv) return '';
  const col = tierSolid(lv), n = [0, 2, 4, 6, 8, 10, 12][lv], sz = Math.max(2.8, A.r * (0.07 + lv * 0.012)), off = ANIM_PH * 0.5;
  let s = '';
  if (lv >= 3) s += `<ellipse cx="${A.x}" cy="${A.y}" rx="${A.r * 1.08}" ry="${A.r * .42}" fill="none" stroke="${col}" stroke-width="${Math.max(1, A.r * .03)}" stroke-dasharray="${A.r * .12} ${A.r * .08}" opacity=".8" transform="rotate(-14 ${A.x} ${A.y})"/>`;
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + off + lv; const rr = A.r * (i % 2 ? 0.95 : 1.12);
    s += sparkle(A.x + Math.cos(a) * rr, A.y + Math.sin(a) * rr * 0.75, sz * (i % 3 === 0 ? 1.4 : 1), i % 2 && lv >= 6 ? '#FFFFFF' : col); }
  if (lv >= 2) for (let i = 0; i < lv - 1; i++) { const a = i / (lv - 1) * Math.PI * 2 + 0.6 - off; const g = [null, null, '#3DDC84', '#4D8BFF', '#B05CFF', '#FFC83D', ['#FF3552', '#FFC83D', '#3DDC84', '#4D8BFF', '#B05CFF'][i % 5]][lv];
    s += gem(A.x + Math.cos(a) * A.r * 1.05, A.y + Math.sin(a) * A.r * 0.45, A.r * 0.085, g); }
  if (lv >= 6) s += [[-0.9, -0.85], [0.95, -0.7], [-0.6, 0.9]].map(([dx, dy]) => sparkle(A.x + dx * A.r, A.y + dy * A.r, A.r * 0.2, '#FFFFFF') + sparkle(A.x + dx * A.r, A.y + dy * A.r, A.r * 0.11, 'url(#rb)')).join('');
  return s;
}
// wraps an item's SVG with its tier effects (behind + glow + in front)
function tierWrap(slot, lv, svg, tw) { if (!svg || !lv) return svg; return tierBehind(slot, lv) + glowWrap(lv, svg) + tierFront(slot, lv, tw); }
// hats grow little wings at +5 and a halo at +6
function hatAccent(lv) {
  if (!lv || lv < 5) return '';
  const wing = (x, d) => `<path d="M${x} 40Q${x + d * 26} 10 ${x + d * 34} 22Q${x + d * 22} 26 ${x + d * 28} 36Q${x + d * 16} 36 ${x + d * 20} 46Q${x + d * 8} 44 ${x} 46Z" fill="#FFFFFF" stroke="${tierSolid(lv)}" stroke-width="2"/>`;
  let s = `<g transform="rotate(${-APH([0, 6, 10, 6])} 26 42)">${wing(26, -1)}</g><g transform="rotate(${APH([0, 6, 10, 6])} 119 42)">${wing(119, 1)}</g>`;
  if (lv >= 6) s += `<ellipse cx="72.5" cy="-18" rx="30" ry="7" fill="none" stroke="url(#rb)" stroke-width="5"/><ellipse cx="72.5" cy="-18" rx="30" ry="7" fill="none" stroke="#FFFFFF" stroke-width="1.5" opacity=".8"/>`;
  return s;
}
// wings: each tier makes them bigger; +3 adds a second layer, +5 a third
function wingStack(inner, lv, place) {
  const k = 1.3 * (1 + 0.05 * (lv || 0));
  let s = '';
  if (lv >= 5) s += place(`<g opacity=".5" transform="rotate(-22) scale(.62)">${inner}</g>`, k);
  if (lv >= 3) s += place(`<g opacity=".7" transform="rotate(20) scale(.78)">${inner}</g>`, k);
  return s + place(inner, k);
}
// pets: sparkles from +2, little wings from +3, halo from +5
function petTier(lv, hop) {
  if (!lv) return {back: '', front: ''};
  let back = '', front = '';
  if (lv >= 3) { const c = tierSolid(lv); back += `<path d="M14 ${32 + hop}Q-2 ${18 + hop} 2 ${36 + hop}Q8 ${40 + hop} 14 ${38 + hop}Z" fill="#FFFFFF" stroke="${c}" stroke-width="1.5"/><path d="M46 ${32 + hop}Q62 ${18 + hop} 58 ${36 + hop}Q52 ${40 + hop} 46 ${38 + hop}Z" fill="#FFFFFF" stroke="${c}" stroke-width="1.5"/>`; }
  if (lv >= 2) front += sparkle(6, 10 + hop, 3 + lv * 0.4, tierSolid(lv)) + sparkle(54, 18 + hop, 2.5 + lv * 0.4, tierSolid(lv));
  if (lv >= 5) front += `<ellipse cx="30" cy="${2 + hop}" rx="14" ry="3.5" fill="none" stroke="${lv >= 6 ? 'url(#rb)' : '#FFE48A'}" stroke-width="2.5"/>`;
  return {back, front};
}
