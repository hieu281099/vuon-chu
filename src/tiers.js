/* ===================== UPGRADE TIERS: every item upgrades in its own style (merged into chibi.js) ===================== */
// Only Epic (rar 2) and better items can be upgraded (plus a few special Common/Rare ones).
// Each item belongs to an element style picked from its name and colour (fire, ice, galaxy, ...). The style decides the particles,
// the ring at +3, the glow at +4, the signature effect at +5 and the finale at +6, so two +6 items never look alike.
const CAN_UPGRADE = f => !!f && UPGRADABLE(f.slot) && ((f.rar || 0) >= 2 || SPECIAL_UP.includes(f.id));
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
// only the big statement pieces (wings, held item, hat) get rings, glows and signature effects; small pieces get particles only
const HEAVY_FX = ['back', 'hand', 'hat'];
const r1 = n => Math.round(n * 10) / 10;

/* ---------- the twelve element styles ---------- */
// c: palette (main, second, highlight); m: particle; flow: how particles move; the rest names each tier for the forge
const FX_THEMES = {
  fire:    {vi: 'Hỏa diệm', c: ['#FF5A2E', '#FFC83D', '#FFF3B0'], m: 'flame',   flow: 'rise',  mv: 'đốm lửa',        ring: 'Vòng lửa cháy dưới chân món đồ', glow: 'Lõi lửa đỏ rực', sig: 'Ba lưỡi lửa lớn bốc cao', ult: 'Biển lửa vàng, tàn lửa bay khắp nơi'},
  ice:     {vi: 'Băng giá',  c: ['#7FD8FF', '#FFFFFF', '#4D8BFF'], m: 'snow',    flow: 'fall',  mv: 'bông tuyết',     ring: 'Khung lục giác băng', glow: 'Hơi lạnh xanh nhạt', sig: 'Bông tuyết khổng lồ phía sau', ult: 'Bão tuyết, pha lê băng vây quanh'},
  galaxy:  {vi: 'Ngân hà',   c: ['#9B5CFF', '#4D8BFF', '#FFE48A'], m: 'star',    flow: 'orbit', mv: 'ngôi sao',       ring: 'Quỹ đạo có hành tinh nhỏ', glow: 'Tinh vân tím', sig: 'Dải ngân hà và mưa sao', ult: 'Hai hành tinh, sao chổi bay quanh'},
  dark:    {vi: 'Hắc ám',    c: ['#7B4DFF', '#B05CFF', '#FF3552'], m: 'wisp',    flow: 'orbit', mv: 'làn khói tím',   ring: 'Xoáy khói đen', glow: 'Hào quang đen tím', sig: 'Bóng tối loang như đôi cánh', ult: 'Mắt đỏ rực trong làn khói'},
  holy:    {vi: 'Thánh quang', c: ['#FFE48A', '#FFFFFF', '#FFC83D'], m: 'feather', flow: 'fall', mv: 'lông vũ trắng', ring: 'Vầng hào quang trên đỉnh', glow: 'Ánh sáng thánh', sig: 'Chùm tia sáng toả ra', ult: 'Hai vầng hào quang, lông vũ rơi như mưa'},
  love:    {vi: 'Tình yêu',  c: ['#FF6FB5', '#FF3552', '#FFD1E8'], m: 'heart',   flow: 'rise',  mv: 'trái tim nhỏ',   ring: 'Viền trái tim lớn', glow: 'Sắc hồng ấm', sig: 'Trái tim khổng lồ phía sau', ult: 'Mưa tim, mũi tên thần tình yêu'},
  bloom:   {vi: 'Hoa cỏ',    c: ['#FF8FC7', '#3DDC84', '#FFE48A'], m: 'petal',   flow: 'fall',  mv: 'cánh hoa',       ring: 'Vòng dây leo nở lá', glow: 'Sắc xuân dịu nhẹ', sig: 'Bông hoa lớn nở phía sau', ult: 'Hoa nở kín, bướm vàng bay quanh'},
  ocean:   {vi: 'Đại dương', c: ['#38BDF8', '#2DD4BF', '#FFFFFF'], m: 'bubble',  flow: 'rise',  mv: 'bong bóng',      ring: 'Con sóng cuộn quanh', glow: 'Ánh nước xanh', sig: 'Sóng lớn và chùm bong bóng', ult: 'Ngọc trai, sóng đôi lấp lánh'},
  gold:    {vi: 'Hoàng kim', c: ['#FFC83D', '#FFB020', '#FFFFFF'], m: 'coin',    flow: 'orbit', mv: 'đồng xu vàng',   ring: 'Vòng vàng gắn đá quý', glow: 'Ánh kim lộng lẫy', sig: 'Mặt trời vàng toả tia', ult: 'Vương miện ánh sáng, mưa vàng'},
  crystal: {vi: 'Pha lê',    c: ['#B9E6FF', '#FF8FC7', '#FFFFFF'], m: 'shard',   flow: 'orbit', mv: 'mảnh pha lê',    ring: 'Ba khối pha lê lơ lửng', glow: 'Ánh lăng kính', sig: 'Tia lăng kính bảy màu', ult: 'Kim cương lớn xoay quanh'},
  storm:   {vi: 'Sấm sét',   c: ['#3DF2FF', '#B05CFF', '#FFFFFF'], m: 'bolt',    flow: 'orbit', mv: 'tia điện',       ring: 'Vòng điện răng cưa', glow: 'Điện quang xanh', sig: 'Hai tia sét lớn đánh xuống', ult: 'Lưới điện plasma bao quanh'},
  melody:  {vi: 'Giai điệu', c: ['#FF6FB5', '#4D8BFF', '#FFC83D'], m: 'note',    flow: 'rise',  mv: 'nốt nhạc',       ring: 'Khuông nhạc uốn quanh', glow: 'Sắc sân khấu', sig: 'Sóng âm lan toả', ult: 'Đèn sân khấu, nốt nhạc bay khắp nơi'}
};
// name words decide first (the last word of a variant id is its material: hand_saber_red is fire, not storm); colour decides the rest
const FX_WORDS = [
  ['fire', 'flame', 'phoenix', 'inferno', 'lava', 'kirin', 'ruby', 'crimson', 'sun', 'red', 'dragon', 'torch', 'hell', 'magma'],
  ['ice', 'frost', 'snow', 'frozen', 'winter', 'penguin', 'cold', 'glacier'],
  ['galaxy', 'star', 'moon', 'cosmic', 'space', 'astro', 'planet', 'comet', 'night', 'void', 'witch', 'wizard', 'owl', 'starlight', 'nebula', 'purple'],
  ['dark', 'shadow', 'bat', 'devil', 'obsidian', 'black', 'vampire', 'skull', 'demon', 'ninja', 'rune', 'ghost'],
  ['angel', 'halo', 'light', 'holy', 'white', 'pearl', 'ivory', 'cloud', 'feather', 'heaven', 'grad'],
  ['heart', 'love', 'kiss', 'valentine', 'cupid', 'pink', 'candy', 'lollipop', 'teddy', 'kitty', 'bow'],
  ['flower', 'rose', 'sakura', 'butterfly', 'fairy', 'leaf', 'leaves', 'sunflower', 'bouquet', 'bunny', 'garden', 'tulip', 'daisy', 'bloom', 'green', 'fox'],
  ['ocean', 'sea', 'mermaid', 'trident', 'bubble', 'bubbles', 'wave', 'fish', 'shell', 'aqua', 'whale', 'blue', 'water'],
  ['gold', 'golden', 'crown', 'king', 'queen', 'royal', 'scepter', 'treasure', 'tiara', 'coin', 'luxury', 'medal', 'designer', 'trophy'],
  ['crystal', 'diamond', 'glass', 'gem', 'jewel', 'prism', 'rainbow', 'silver', 'mirror'],
  ['cyber', 'saber', 'laser', 'energy', 'robot', 'jet', 'jetpack', 'thunder', 'lightning', 'tech', 'neon', 'visor', 'goggles', 'rocket', 'electric', 'plasma'],
  ['idol', 'mic', 'guitar', 'music', 'stage', 'dance', 'headphone', 'headphones', 'note', 'disco', 'kpop']
];
const FX_KEYS = Object.keys(FX_THEMES);
const FX_GRAD = {hg_gold: 'gold', hg_galaxy: 'galaxy', rb: 'crystal', hg_fire: 'fire', hg_ocean: 'ocean', hg_silver: 'ice', hg_aurora: 'galaxy'};
function themeByColour(col) {
  if (!col) return 'gold';
  const g = /url\(#([a-z_]+)\)/.exec(col); if (g) return FX_GRAD[g[1]] || 'crystal';
  if (col[0] !== '#' || col.length < 7) return 'gold';
  const n = parseInt(col.slice(1, 7), 16), r = (n >> 16) / 255, gg = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b), l = (mx + mn) / 2, d = mx - mn;
  if (d < 0.12) return l > 0.65 ? 'holy' : l < 0.35 ? 'dark' : 'ice';
  let h = mx === r ? ((gg - b) / d) % 6 : mx === gg ? (b - r) / d + 2 : (r - gg) / d + 4; h = (h * 60 + 360) % 360;
  if (l < 0.25) return 'dark';
  return h < 22 ? 'fire' : h < 40 ? 'fire' : h < 66 ? 'gold' : h < 165 ? 'bloom' : h < 200 ? 'ocean' : h < 228 ? 'storm' : h < 285 ? 'galaxy' : h < 345 ? 'love' : 'fire';
}
const FX_CACHE = {};
function fxTheme(id) {
  if (!id) return FX_THEMES.gold;
  if (FX_CACHE[id]) return FX_CACHE[id];
  const f = FASH[id] || {}, words = [...id.split('_').slice(1).reverse(), ...String(f.en || '').toLowerCase().split(/[^a-z]+/)];
  let k = null;
  for (const w of words) { const i = FX_WORDS.findIndex(list => list.includes(w)); if (i >= 0) { k = FX_KEYS[i]; break; } }
  if (!k) k = themeByColour(f.col);
  return (FX_CACHE[id] = Object.assign({key: k}, FX_THEMES[k]));
}
// forge text for one tier of one item
function tierPerk(id, l) {
  const T = fxTheme(id);
  return ['Bản gốc', `${T.vi}: vài ${T.mv} nhỏ`, `Thêm nhiều ${T.mv} hơn`, T.ring, T.glow, T.sig, 'Tối thượng: ' + T.ult][l];
}
const TIER_PERK = [0, 1, 2, 3, 4, 5, 6].map(l => tierPerk(null, l));

/* ---------- particles ---------- */
function motif(m, x, y, s, col, a = 0) {
  x = r1(x); y = r1(y); s = r1(s);
  switch (m) {
    case 'flame': return `<path d="M${x} ${y - s * 1.5}Q${x + s * 1.1} ${y - s * .2} ${x + s * .7} ${y + s * .55}Q${x} ${y + s * 1.1} ${x - s * .7} ${y + s * .55}Q${x - s * 1.1} ${y - s * .2} ${x} ${y - s * 1.5}Z" fill="${col}"/><path d="M${x} ${y - s * .5}Q${x + s * .5} ${y + s * .2} ${x} ${y + s * .7}Q${x - s * .5} ${y + s * .2} ${x} ${y - s * .5}Z" fill="#FFF3B0"/>`;
    case 'snow': return `<g stroke="${col}" stroke-width="${r1(s * .26)}" stroke-linecap="round">${[0, 60, 120].map(d => { const c = Math.cos((d + a) * Math.PI / 180) * s, n = Math.sin((d + a) * Math.PI / 180) * s; return `<path d="M${r1(x - c)} ${r1(y - n)}L${r1(x + c)} ${r1(y + n)}"/>`; }).join('')}</g><circle cx="${x}" cy="${y}" r="${r1(s * .28)}" fill="#FFFFFF"/>`;
    case 'star': { let p = ''; for (let i = 0; i < 10; i++) { const rr = i % 2 ? s * .45 : s, t = (i * 36 - 90 + a) * Math.PI / 180; p += (i ? 'L' : 'M') + r1(x + Math.cos(t) * rr) + ' ' + r1(y + Math.sin(t) * rr); } return `<path d="${p}Z" fill="${col}"/>`; }
    case 'wisp': return `<path d="M${x - s} ${y + s}Q${x - s * 1.3} ${y - s * .1} ${x} ${y - s * .2}T${x + s} ${y - s * 1.3}" stroke="${col}" stroke-width="${r1(s * .5)}" fill="none" stroke-linecap="round" opacity=".7"/>`;
    case 'feather': return `<g transform="rotate(${r1(a + 30)} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="${r1(s * .45)}" ry="${r1(s * 1.2)}" fill="${col}" stroke="#FFFFFF" stroke-width="${r1(s * .12)}"/><path d="M${x} ${y - s * 1.1}V${y + s * 1.4}" stroke="${shade(col, -0.3)}" stroke-width="${r1(s * .12)}"/></g>`;
    case 'heart': return `<path d="M${x} ${y + s}C${x - s * 1.6} ${y - s * .1} ${x - s * .9} ${y - s * 1.3} ${x} ${y - s * .45}C${x + s * .9} ${y - s * 1.3} ${x + s * 1.6} ${y - s * .1} ${x} ${y + s}Z" fill="${col}"/>`;
    case 'petal': return `<ellipse cx="${x}" cy="${y}" rx="${s}" ry="${r1(s * .5)}" fill="${col}" transform="rotate(${r1(a)} ${x} ${y})"/><ellipse cx="${x}" cy="${y}" rx="${r1(s * .45)}" ry="${r1(s * .2)}" fill="#FFFFFF" opacity=".5" transform="rotate(${r1(a)} ${x} ${y})"/>`;
    case 'bubble': return `<circle cx="${x}" cy="${y}" r="${s}" fill="#FFFFFF" fill-opacity=".18" stroke="${col}" stroke-width="${r1(s * .2)}"/><circle cx="${r1(x - s * .35)}" cy="${r1(y - s * .35)}" r="${r1(s * .25)}" fill="#FFFFFF"/>`;
    case 'coin': return `<ellipse cx="${x}" cy="${y}" rx="${r1(s * (0.55 + 0.45 * Math.abs(Math.cos(a * Math.PI / 180))))}" ry="${s}" fill="${col}" stroke="${shade(col, -0.25)}" stroke-width="${r1(s * .18)}"/><path d="M${x} ${y - s * .5}V${y + s * .5}" stroke="#FFFFFF" stroke-width="${r1(s * .2)}" opacity=".8"/>`;
    case 'shard': return `<path d="M${x} ${y - s * 1.5}L${x + s * .55} ${y}L${x} ${y + s * 1.1}L${x - s * .55} ${y}Z" fill="${col}" opacity=".9" transform="rotate(${r1(a)} ${x} ${y})"/><path d="M${x} ${y - s * 1.5}L${x + s * .55} ${y}L${x} ${y}Z" fill="#FFFFFF" opacity=".7" transform="rotate(${r1(a)} ${x} ${y})"/>`;
    case 'bolt': return `<path d="M${x + s * .3} ${y - s * 1.4}L${x - s * .7} ${y + s * .1}H${x}L${x - s * .3} ${y + s * 1.4}L${x + s * .7} ${y - s * .2}H${x}Z" fill="${col}" stroke="#FFFFFF" stroke-width="${r1(s * .12)}"/>`;
    case 'note': return `<ellipse cx="${x - s * .3}" cy="${y + s * .7}" rx="${r1(s * .5)}" ry="${r1(s * .38)}" fill="${col}" transform="rotate(-20 ${x - s * .3} ${y + s * .7})"/><path d="M${x + s * .15} ${y + s * .65}V${y - s * 1.1}Q${x + s * .9} ${y - s * .7} ${x + s * .8} ${y - s * .1}" stroke="${col}" stroke-width="${r1(s * .22)}" fill="none"/>`;
  }
  return sparkle(x, y, s, col);
}
// particle positions for one item: rising, falling or orbiting depending on the style (moves with the animation phase)
function motifs(T, A, n, sz, ph, cols) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const col = cols[i % cols.length], k = (i / n + ph * 0.12) % 1;
    let x, y, a = i * 47 + ph * 20;
    if (T.flow === 'rise') { x = A.x + Math.sin(i * 2.4 + 1) * A.r * 0.95; y = A.y + A.r * 0.55 - k * A.r * 1.35; }
    else if (T.flow === 'fall') { x = A.x + Math.sin(i * 2.4 + 1) * A.r * 1.0 + Math.sin(k * 6) * 2; y = A.y - A.r * 0.75 + k * A.r * 1.4; }
    else { const t = i / n * Math.PI * 2 + ph * 0.35; const rr = A.r * (i % 2 ? 0.95 : 1.12); x = A.x + Math.cos(t) * rr; y = A.y + Math.sin(t) * rr * 0.72; }
    s += motif(T.m, x, y, sz * (i % 3 === 0 ? 1.25 : 1), col, a);
  }
  return s;
}

/* ---------- +3 rings, +5 signatures: one per style ---------- */
function themeRing(T, A, ph) {
  const [c0, c1, c2] = T.c, R = A.r;
  switch (T.key) {
    case 'fire': return Array.from({length: 7}, (_, i) => { const t = Math.PI * (0.12 + i * 0.127); return motif('flame', A.x + Math.cos(t) * R * 1.0, A.y + Math.sin(t) * R * 0.5 + R * 0.25, R * (0.09 + (i + ph) % 3 * 0.015), i % 2 ? c0 : c1); }).join('');
    case 'ice': { let p = ''; for (let i = 0; i < 6; i++) { const t = (i * 60 + 30) * Math.PI / 180; p += (i ? 'L' : 'M') + r1(A.x + Math.cos(t) * R * 1.05) + ' ' + r1(A.y + Math.sin(t) * R * 0.8); } return `<path d="${p}Z" fill="none" stroke="${c0}" stroke-width="${r1(R * .035)}" stroke-dasharray="${r1(R * .14)} ${r1(R * .06)}" opacity=".85"/>`; }
    case 'galaxy': { const t = ph * 0.9 + 0.5, px = A.x + Math.cos(t) * R * 1.1, py = A.y + Math.sin(t) * R * 0.4; return `<ellipse cx="${A.x}" cy="${A.y}" rx="${r1(R * 1.1)}" ry="${r1(R * .4)}" fill="none" stroke="${c1}" stroke-width="${r1(R * .025)}" opacity=".8" transform="rotate(-14 ${A.x} ${A.y})"/><circle cx="${r1(px)}" cy="${r1(py)}" r="${r1(R * .09)}" fill="${c0}"/><ellipse cx="${r1(px)}" cy="${r1(py)}" rx="${r1(R * .16)}" ry="${r1(R * .04)}" fill="none" stroke="${c2}" stroke-width="${r1(R * .02)}"/>`; }
    case 'dark': return [0, 1].map(j => `<path d="M${A.x - R * 1.05} ${A.y}A${R * 1.05} ${R * .6} 0 0 1 ${A.x + R * 0.2} ${A.y - R * .6}" stroke="${j ? c2 : c0}" stroke-width="${r1(R * .05)}" fill="none" stroke-linecap="round" opacity=".55" transform="rotate(${j * 180 + ph * 15} ${A.x} ${A.y})"/>`).join('');
    case 'holy': return `<ellipse cx="${A.x}" cy="${r1(A.y - R * .95)}" rx="${r1(R * .5)}" ry="${r1(R * .12)}" fill="none" stroke="${c2}" stroke-width="${r1(R * .07)}"/><ellipse cx="${A.x}" cy="${r1(A.y - R * .95)}" rx="${r1(R * .5)}" ry="${r1(R * .12)}" fill="none" stroke="#FFFFFF" stroke-width="${r1(R * .02)}"/>`;
    case 'love': { const s = R * 0.62; return `<path d="M${A.x} ${A.y + s * 1.25}C${A.x - s * 2} ${A.y} ${A.x - s * 1.1} ${A.y - s * 1.6} ${A.x} ${A.y - s * .55}C${A.x + s * 1.1} ${A.y - s * 1.6} ${A.x + s * 2} ${A.y} ${A.x} ${A.y + s * 1.25}Z" fill="none" stroke="${c0}" stroke-width="${r1(R * .035)}" stroke-dasharray="${r1(R * .1)} ${r1(R * .06)}" opacity=".85"/>`; }
    case 'bloom': return `<ellipse cx="${A.x}" cy="${A.y}" rx="${r1(R * 1.05)}" ry="${r1(R * .62)}" fill="none" stroke="${c1}" stroke-width="${r1(R * .03)}" opacity=".85"/>` + Array.from({length: 6}, (_, i) => { const t = i / 6 * Math.PI * 2 + 0.3; return motif('petal', A.x + Math.cos(t) * R * 1.05, A.y + Math.sin(t) * R * .62, R * .08, i % 2 ? c1 : c0, t * 57); }).join('');
    case 'ocean': { let p = `M${r1(A.x - R * 1.1)} ${r1(A.y + R * .55)}`; for (let i = 0; i < 6; i++) p += `q${r1(R * .18)} ${r1((i + ph) % 2 ? -R * .14 : R * .14)} ${r1(R * .37)} 0`; return `<path d="${p}" stroke="${c0}" stroke-width="${r1(R * .05)}" fill="none" stroke-linecap="round" opacity=".85"/><path d="${p}" stroke="#FFFFFF" stroke-width="${r1(R * .015)}" fill="none" opacity=".8"/>`; }
    case 'gold': return `<ellipse cx="${A.x}" cy="${A.y}" rx="${r1(R * 1.08)}" ry="${r1(R * .42)}" fill="none" stroke="${c0}" stroke-width="${r1(R * .035)}" stroke-dasharray="${r1(R * .12)} ${r1(R * .05)}" transform="rotate(-10 ${A.x} ${A.y})"/>` + [0, 1, 2, 3].map(i => { const t = i / 4 * Math.PI * 2 + 0.4 + ph * 0.3; return gem(r1(A.x + Math.cos(t) * R * 1.08), r1(A.y + Math.sin(t) * R * .42), r1(R * .08), ['#FF3552', '#3DDC84', '#4D8BFF', '#B05CFF'][i]); }).join('');
    case 'crystal': return [[-1.05, -0.5], [1.05, -0.4], [0, 0.85]].map(([dx, dy], i) => motif('shard', A.x + dx * R, A.y + dy * R * (1 + (ph % 2) * 0.04), R * .14, i === 2 ? c1 : c0, i * 20 - 10)).join('');
    case 'storm': { let p = ''; for (let i = 0; i <= 16; i++) { const t = i / 16 * Math.PI * 2, rr = R * (i % 2 ? 0.95 : 1.12) * (1 + ((i + ph) % 3) * 0.02); p += (i ? 'L' : 'M') + r1(A.x + Math.cos(t) * rr) + ' ' + r1(A.y + Math.sin(t) * rr * .6); } return `<path d="${p}" fill="none" stroke="${c0}" stroke-width="${r1(R * .03)}" stroke-linejoin="round" opacity=".85"/>`; }
    case 'melody': return [0, 1].map(j => `<path d="M${A.x - R * 1.1} ${A.y + R * (0.35 + j * .1)}Q${A.x} ${A.y - R * (0.5 - j * .1)} ${A.x + R * 1.1} ${A.y + R * (0.35 + j * .1)}" stroke="${c1}" stroke-width="${r1(R * .02)}" fill="none" opacity=".8"/>`).join('') + motif('note', A.x - R * .5, A.y - R * .1, R * .12, c0) + motif('note', A.x + R * .55, A.y - R * .05, R * .1, c2);
  }
  return '';
}
function themeSignature(T, A, lv, ph) {
  const [c0, c1, c2] = T.c, R = A.r * (lv >= 6 ? 1.12 : 1);
  switch (T.key) {
    case 'fire': return [-0.55, 0, 0.55].map((dx, i) => `<g opacity="${i === 1 ? .55 : .4}">${motif('flame', A.x + dx * R, A.y - R * (i === 1 ? .2 : 0) - (ph % 2) * 2, R * (i === 1 ? .42 : .3), i === 1 ? c0 : c1)}</g>`).join('');
    case 'ice': return `<g opacity=".35">${motif('snow', A.x, A.y, R * 1.05, c0, ph * 8)}</g>`;
    case 'galaxy': return `<ellipse cx="${A.x}" cy="${A.y}" rx="${r1(R * 1.15)}" ry="${r1(R * .5)}" fill="${c0}" opacity=".16" transform="rotate(-20 ${A.x} ${A.y})"/><ellipse cx="${A.x}" cy="${A.y}" rx="${r1(R * .8)}" ry="${r1(R * .28)}" fill="${c1}" opacity=".18" transform="rotate(-20 ${A.x} ${A.y})"/>` + Array.from({length: 7}, (_, i) => motif('star', A.x + Math.cos(i * 2.3) * R * 1.2, A.y + Math.sin(i * 1.7) * R * .9, R * (0.04 + (i + ph) % 3 * .015), c2, i * 20)).join('');
    case 'dark': return [-1, 1].map(d => `<path d="M${A.x} ${A.y}Q${A.x + d * R * 1.3} ${A.y - R * 1.1} ${A.x + d * R * 1.4} ${A.y + R * .2}Q${A.x + d * R * .9} ${A.y - R * .1} ${A.x + d * R * .8} ${A.y + R * .5}Q${A.x + d * R * .5} ${A.y + R * .1} ${A.x} ${A.y}Z" fill="${c1}" opacity=".45"/>`).join('');
    case 'holy': return Array.from({length: 10}, (_, i) => { const a = i / 10 * Math.PI * 2 + ph * .05, a1 = a - .06, a2 = a + .06, L = R * 1.5; return `<path d="M${A.x} ${A.y}L${r1(A.x + Math.cos(a1) * L)} ${r1(A.y + Math.sin(a1) * L)}L${r1(A.x + Math.cos(a2) * L)} ${r1(A.y + Math.sin(a2) * L)}Z" fill="${c0}" opacity=".22"/>`; }).join('');
    case 'love': return `<g opacity=".28">${motif('heart', A.x, A.y + R * .1, R * (0.75 + (ph % 2) * .04), c0)}</g>`;
    case 'bloom': return `<g opacity=".4">${Array.from({length: 5}, (_, i) => { const t = i / 5 * Math.PI * 2 + ph * .1; return `<ellipse cx="${r1(A.x + Math.cos(t) * R * .5)}" cy="${r1(A.y + Math.sin(t) * R * .5)}" rx="${r1(R * .42)}" ry="${r1(R * .26)}" fill="${c0}" transform="rotate(${r1(t * 57)} ${r1(A.x + Math.cos(t) * R * .5)} ${r1(A.y + Math.sin(t) * R * .5)})"/>`; }).join('')}<circle cx="${A.x}" cy="${A.y}" r="${r1(R * .2)}" fill="${c2}"/></g>`;
    case 'ocean': return `<path d="M${A.x - R * 1.2} ${A.y + R * .3}Q${A.x - R * .6} ${A.y - R * .9} ${A.x} ${A.y - R * .1}Q${A.x + R * .4} ${A.y - R * .6} ${A.x + R * .2} ${A.y - R * .7}Q${A.x + R * .9} ${A.y - R * .6} ${A.x + R * 1.2} ${A.y + R * .3}Z" fill="${c0}" opacity=".22"/>` + [[-0.9, -0.2], [-0.7, -0.6], [0.8, -0.4], [1, 0], [0.6, -0.8]].map(([dx, dy], i) => motif('bubble', A.x + dx * R, A.y + dy * R - (ph % 2) * 2, R * (0.06 + i % 2 * .03), c1)).join('');
    case 'gold': return Array.from({length: 16}, (_, i) => { const a = i / 16 * Math.PI * 2, L = R * (i % 2 ? 1.25 : 1.55), w = i % 2 ? .035 : .05; return `<path d="M${A.x} ${A.y}L${r1(A.x + Math.cos(a - w) * L)} ${r1(A.y + Math.sin(a - w) * L)}L${r1(A.x + Math.cos(a + w) * L)} ${r1(A.y + Math.sin(a + w) * L)}Z" fill="${i % 2 ? c2 : c0}" opacity=".25"/>`; }).join('');
    case 'crystal': return ['#FF3552', '#FFC83D', '#3DDC84', '#4D8BFF', '#B05CFF'].map((c, i) => { const a = -Math.PI * (0.15 + i * 0.17), L = R * 1.45; return `<path d="M${A.x} ${A.y}L${r1(A.x + Math.cos(a - .05) * L)} ${r1(A.y + Math.sin(a - .05) * L)}L${r1(A.x + Math.cos(a + .05) * L)} ${r1(A.y + Math.sin(a + .05) * L)}Z" fill="${c}" opacity=".28"/>`; }).join('');
    case 'storm': return [-1, 1].map(d => `<path d="M${A.x + d * R * .9} ${A.y - R * 1.3}L${A.x + d * R * .6} ${A.y - R * .5}L${A.x + d * R * .85} ${A.y - R * .45}L${A.x + d * R * .5} ${A.y + R * .4}" stroke="${(ph + (d > 0)) % 2 ? c0 : c2}" stroke-width="${r1(R * .06)}" fill="none" stroke-linejoin="round" opacity=".8"/>`).join('');
    case 'melody': return [0.6, 0.9, 1.2].map((k, i) => `<path d="M${A.x + R * k} ${A.y - R * k * .6}Q${A.x + R * (k + .25)} ${A.y} ${A.x + R * k} ${A.y + R * k * .6}M${A.x - R * k} ${A.y - R * k * .6}Q${A.x - R * (k + .25)} ${A.y} ${A.x - R * k} ${A.y + R * k * .6}" stroke="${[c0, c1, c2][i]}" stroke-width="${r1(R * .035)}" fill="none" stroke-linecap="round" opacity="${((ph + i) % 3) ? .55 : .9}"/>`).join('');
  }
  return '';
}
// +6 finale, in front of the item
function themeFinale(T, A, ph) {
  const [c0, c1, c2] = T.c, R = A.r;
  switch (T.key) {
    case 'galaxy': { const t = ph * 0.8 + 2.5; return `<circle cx="${r1(A.x + Math.cos(t) * R * 1.2)}" cy="${r1(A.y + Math.sin(t) * R * .5)}" r="${r1(R * .07)}" fill="${c1}"/><path d="M${r1(A.x - R * 1.2)} ${r1(A.y - R * .9)}l${r1(R * .35)} ${r1(R * .12)}" stroke="#FFFFFF" stroke-width="${r1(R * .03)}" stroke-linecap="round"/>` + motif('star', A.x - R * .82, A.y - R * .84, R * .06, c2); }
    case 'dark': return `<ellipse cx="${r1(A.x - R * .25)}" cy="${r1(A.y - R * .7)}" rx="${r1(R * .07)}" ry="${r1(R * .035)}" fill="${c2}"/><ellipse cx="${r1(A.x + R * .25)}" cy="${r1(A.y - R * .7)}" rx="${r1(R * .07)}" ry="${r1(R * .035)}" fill="${c2}"/>`;
    case 'holy': return `<ellipse cx="${A.x}" cy="${r1(A.y - R * 1.12)}" rx="${r1(R * .36)}" ry="${r1(R * .08)}" fill="none" stroke="${c0}" stroke-width="${r1(R * .05)}"/>`;
    case 'love': return `<path d="M${r1(A.x - R * 1.1)} ${r1(A.y + R * .5)}L${r1(A.x + R * 1.1)} ${r1(A.y - R * .5)}" stroke="${c2}" stroke-width="${r1(R * .03)}"/>` + motif('heart', A.x + R * 1.1, A.y - R * .52, R * .08, c1);
    case 'bloom': return [[1, -0.7], [-1.05, -0.4]].map(([dx, dy], i) => { const x = A.x + dx * R, y = A.y + dy * R + (ph % 2) * 2, s = R * .08; return `<ellipse cx="${r1(x - s)}" cy="${r1(y)}" rx="${r1(s)}" ry="${r1(s * .7)}" fill="${c2}"/><ellipse cx="${r1(x + s)}" cy="${r1(y)}" rx="${r1(s)}" ry="${r1(s * .7)}" fill="${c2}"/>`; }).join('');
    case 'ocean': return [[-1.1, 0.1], [1.1, -0.2]].map(([dx, dy]) => `<circle cx="${r1(A.x + dx * R)}" cy="${r1(A.y + dy * R)}" r="${r1(R * .06)}" fill="#FFFFFF" stroke="${c0}" stroke-width="${r1(R * .015)}"/>`).join('');
    case 'gold': { const y = A.y - R * 1.15, s = R * .22; return `<path d="M${r1(A.x - s)} ${r1(y + s * .6)}L${r1(A.x - s)} ${r1(y - s * .2)}L${r1(A.x - s * .5)} ${r1(y + s * .15)}L${A.x} ${r1(y - s * .5)}L${r1(A.x + s * .5)} ${r1(y + s * .15)}L${r1(A.x + s)} ${r1(y - s * .2)}L${r1(A.x + s)} ${r1(y + s * .6)}Z" fill="${c0}" stroke="#FFFFFF" stroke-width="${r1(R * .015)}"/>`; }
    case 'crystal': return gem(r1(A.x + Math.cos(ph * .8) * R * 1.15), r1(A.y + Math.sin(ph * .8) * R * .45), r1(R * .14), 'url(#rb)');
    case 'storm': return `<ellipse cx="${A.x}" cy="${A.y}" rx="${r1(R * 1.2)}" ry="${r1(R * .75)}" fill="none" stroke="${c1}" stroke-width="${r1(R * .015)}" stroke-dasharray="2 3" opacity=".9"/>`;
    case 'melody': return [[-1.1, -0.9], [1.1, -0.9]].map(([dx, dy], i) => `<path d="M${r1(A.x + dx * R)} ${r1(A.y + dy * R)}L${r1(A.x + dx * R * .4)} ${r1(A.y + R * .4)}L${r1(A.x + dx * R * .75)} ${r1(A.y + R * .45)}Z" fill="${i ? c0 : c1}" opacity=".2"/>`).join('');
    case 'fire': return Array.from({length: 4}, (_, i) => sparkle(r1(A.x + Math.sin(i * 2.1 + ph) * R), r1(A.y - R * (0.6 + i * .15)), r1(R * .04), c1)).join('');
    case 'ice': return [[-1.1, 0], [1.1, -0.2], [0, -1]].map(([dx, dy], i) => motif('shard', A.x + dx * R, A.y + dy * R * .8, R * .09, i % 2 ? c1 : c0, i * 30)).join('');
  }
  return '';
}

/* ---------- putting it together ---------- */
function tierBehind(slot, lv, id) {
  const A = TIER_ANCHOR[slot]; if (!A || lv < 4 || !HEAVY_FX.includes(slot)) return '';
  const T = fxTheme(id), ph = ANIM_PH;
  let s = `<circle cx="${A.x}" cy="${A.y}" r="${r1(A.r * .95)}" fill="${T.c[0]}" opacity="${slot === 'hand' ? .14 : .08}"/>`;
  if (lv >= 5) s += themeSignature(T, A, lv, ph);
  if (lv >= 6 && slot !== 'hat') s += `<circle cx="${A.x}" cy="${A.y}" r="${r1(A.r * 1.15)}" fill="none" stroke="${T.c[1]}" stroke-width="2" opacity=".55"/>`;
  return s;
}
function tierFront(slot, lv, tw, id) {
  const A = TIER_ANCHOR[slot]; if (!A || !lv) return '';
  const T = fxTheme(id), heavy = HEAVY_FX.includes(slot), ph = ANIM_PH;
  const n = slot === 'hat' ? [0, 1, 2, 3, 3, 4, 5][lv] : heavy ? [0, 2, 4, 5, 6, 7, 9][lv] : [0, 1, 2, 2, 3, 3, 4][lv], sz = Math.max(2.6, A.r * (0.065 + lv * 0.011));
  const cols = lv >= 6 ? [T.c[0], T.c[1], T.c[2]] : lv >= 4 ? [T.c[0], T.c[1]] : [T.c[0]];
  let s = '';
  if (lv >= 3 && heavy) s += themeRing(T, A, ph);
  s += motifs(T, A, n, sz, ph, cols);
  if (lv >= 6 && heavy) s += themeFinale(T, A, ph);
  return s;
}
// wraps an item's SVG with its tier effects (behind + glow + in front)
function tierWrap(slot, lv, svg, tw, id) { if (!svg || !lv) return svg; return tierBehind(slot, lv, id) + glowWrap(lv, svg) + tierFront(slot, lv, tw, id); }
// hats: +5 grows two ornaments in the item's own style, +6 a halo in its colours
function hatAccent(lv, id) {
  if (!lv || lv < 5) return '';
  const T = fxTheme(id), sw = APH([0, 6, 10, 6]);
  let s = `<g transform="rotate(${-sw} 26 40)">${motif(T.m, 22, 34, 8, T.c[0], 20)}</g><g transform="rotate(${sw} 119 40)">${motif(T.m, 123, 34, 8, T.c[0], -20)}</g>`;
  if (lv >= 6) s += `<ellipse cx="72.5" cy="-18" rx="30" ry="7" fill="none" stroke="${T.c[0]}" stroke-width="5"/><ellipse cx="72.5" cy="-18" rx="30" ry="7" fill="none" stroke="${T.c[2]}" stroke-width="1.5" opacity=".9"/>` + motif(T.m, 72.5, -30, 6, T.c[1]);
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
// pets: particles of their style from +2, little style ornaments from +3, a halo from +5
function petTier(lv, hop, id) {
  if (!lv) return {back: '', front: ''};
  const T = fxTheme(id);
  let back = '', front = '';
  if (lv >= 3) back += motif(T.m, 4, 30 + hop, 6, T.c[0], -20) + motif(T.m, 56, 30 + hop, 6, T.c[0], 20);
  if (lv >= 2) front += motif(T.m, 6, 8 + hop, 2.6 + lv * 0.35, T.c[lv >= 5 ? 1 : 0], 10) + motif(T.m, 54, 16 + hop, 2.2 + lv * 0.35, T.c[0], -10);
  if (lv >= 5) front += `<ellipse cx="30" cy="${2 + hop}" rx="14" ry="3.5" fill="none" stroke="${T.c[0]}" stroke-width="2.5"/>` + (lv >= 6 ? `<ellipse cx="30" cy="${2 + hop}" rx="14" ry="3.5" fill="none" stroke="${T.c[2]}" stroke-width="1"/>` : '');
  return {back, front};
}
