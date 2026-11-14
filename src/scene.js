/* ===================== SCENE: modern flat-vector scenery, crops, animals, item icons ===================== */
const PAL = {
  grass: '#8ED66B', grass2: '#82CC60', grassDot: '#A9E486', grassEdge: '#6DBB4E',
  path: '#F4DFAE', pathEdge: '#E3C68A', plaza: '#F2EADF', plazaEdge: '#DCCDB9', plazaLine: '#E6DACB',
  sand: '#FBE6AE', sandEdge: '#EDCF85', water: '#6CC8F4', waterEdge: '#4FB2E8', foam: '#E9F8FF',
  soil: '#B5835E', soilDk: '#9C6B48', soilWet: '#8C5C3E', soilLine: '#A2714F',
  leaf: '#3FAE5A', leafMd: '#55C46E', leafLt: '#86DF8E', trunk: '#9A6845', trunkDk: '#7E5236',
  wood: '#E3B37A', woodDk: '#C9925A', white: '#FFF8EE', shadow: 'rgba(40,60,30,.18)'
};
const SV = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;
const SPRITE_CACHE = new Map();
// def: {w, h, ax, ay, svg} in world units. Returns a rasterised image at the current scale (or null while loading).
function spriteImg(key, def, pxs) {
  const k = key + '|' + pxs; let e = SPRITE_CACHE.get(k);
  if (!e) {
    const im = new Image(); e = {im, ok: false}; SPRITE_CACHE.set(k, e);
    im.onload = () => { e.ok = true; };
    im.src = svgURL(def.svg.replace(/width="[\d.]+" height="[\d.]+"/, `width="${Math.ceil(def.w * pxs)}" height="${Math.ceil(def.h * pxs)}"`));
  }
  return e.ok ? e.im : null;
}
const SPRITES = {};
function sprite(key, make) { return SPRITES[key] || (SPRITES[key] = make()); }
function drawSprite(g, key, make, x, y, pxs, flip) {
  const def = sprite(key, make), im = spriteImg(key, def, Math.min(6, pxs)); if (!im) return;
  const sm = g.imageSmoothingEnabled; g.imageSmoothingEnabled = true;
  if (flip) { g.save(); g.translate(x, y); g.scale(-1, 1); g.drawImage(im, -def.ax, -def.ay, def.w, def.h); g.restore(); }
  else g.drawImage(im, x - def.ax, y - def.ay, def.w, def.h);
  g.imageSmoothingEnabled = sm;
}

/* ---------- trees and plants ---------- */
function treeDef(kind) {
  const sh = `<ellipse cx="40" cy="104" rx="26" ry="7" fill="${PAL.shadow}"/>`;
  const trunk = `<rect x="34" y="66" width="12" height="38" rx="5" fill="${PAL.trunk}"/><rect x="40" y="66" width="6" height="38" rx="3" fill="${PAL.trunkDk}"/>`;
  if (kind === 'pine') return {w: 80, h: 112, ax: 40, ay: 104, svg: SV(80, 112, sh + `<rect x="35" y="80" width="10" height="24" rx="4" fill="${PAL.trunk}"/>
    <path d="M40 4 Q46 4 50 12 L70 52 Q72 58 64 58 L16 58 Q8 58 10 52 L30 12 Q34 4 40 4Z" fill="#2E9E6A"/>
    <path d="M40 26 Q46 26 50 34 L74 80 Q76 86 68 86 L12 86 Q4 86 6 80 L30 34 Q34 26 40 26Z" fill="#34B074"/>
    <path d="M40 26 L30 34 L14 66 Q24 60 30 48Z" fill="#5CCB8F"/><path d="M40 4 L30 12 L20 34 Q30 26 34 18Z" fill="#5CCB8F"/>`)};
  if (kind === 'palm') return {w: 90, h: 120, ax: 40, ay: 112, svg: SV(90, 120, `<ellipse cx="40" cy="112" rx="22" ry="6" fill="${PAL.shadow}"/><path d="M36 112 Q30 70 46 34 L54 36 Q40 72 46 112Z" fill="${PAL.trunk}"/>
    ${[[-40, '#3FAE5A'], [-10, '#55C46E'], [20, '#3FAE5A'], [160, '#55C46E'], [200, '#3FAE5A']].map(([a, c]) => `<path d="M50 34 q22 -14 40 4 q-22 -6 -40 -4z" fill="${c}" transform="rotate(${a} 50 34)"/>`).join('')}<circle cx="48" cy="38" r="5" fill="#8B5A3C"/>`)};
  const canopy = kind === 'blossom' ? ['#F28DB8', '#F7A8CB', '#FFD1E6'] : kind === 'fruit' ? [PAL.leaf, PAL.leafMd, PAL.leafLt] : [PAL.leaf, PAL.leafMd, PAL.leafLt];
  const fruit = kind === 'fruit' ? `<circle cx="22" cy="52" r="5" fill="#FF5A4E"/><circle cx="54" cy="40" r="5" fill="#FF5A4E"/><circle cx="40" cy="60" r="5" fill="#FF5A4E"/><circle cx="58" cy="60" r="4" fill="#FF5A4E"/>` : kind === 'blossom' ? `<circle cx="24" cy="44" r="3" fill="#fff"/><circle cx="52" cy="34" r="3" fill="#fff"/><circle cx="46" cy="58" r="3" fill="#fff"/>` : '';
  return {w: 80, h: 112, ax: 40, ay: 104, svg: SV(80, 112, sh + trunk + `<circle cx="22" cy="54" r="20" fill="${canopy[0]}"/><circle cx="58" cy="54" r="20" fill="${canopy[0]}"/><circle cx="40" cy="34" r="28" fill="${canopy[0]}"/>
    <circle cx="24" cy="50" r="15" fill="${canopy[1]}"/><circle cx="54" cy="48" r="15" fill="${canopy[1]}"/><circle cx="38" cy="30" r="21" fill="${canopy[1]}"/><ellipse cx="30" cy="22" rx="10" ry="7" fill="${canopy[2]}"/>${fruit}`)};
}
const bushDef = (c) => ({w: 44, h: 34, ax: 22, ay: 30, svg: SV(44, 34, `<ellipse cx="22" cy="30" rx="18" ry="4" fill="${PAL.shadow}"/><circle cx="12" cy="20" r="10" fill="${PAL.leaf}"/><circle cx="32" cy="20" r="10" fill="${PAL.leaf}"/><circle cx="22" cy="13" r="12" fill="${PAL.leafMd}"/><circle cx="17" cy="10" r="4" fill="${PAL.leafLt}"/>${c ? `<circle cx="12" cy="16" r="2.6" fill="${c}"/><circle cx="28" cy="10" r="2.6" fill="${c}"/><circle cx="31" cy="22" r="2.6" fill="${c}"/><circle cx="19" cy="22" r="2.6" fill="${c}"/>` : ''}`)});

/* ---------- buildings ---------- */
const BSTYLE = {
  home:   {wall:'#FFF3E2', roof:'#FF8A65', roof2:'#F06A47', trim:'#E9D3B6', door:'#B9774A'},
  shop:   {wall:'#FFF0F6', roof:'#FF7AB6', roof2:'#EE5A9C', trim:'#F5CFE0', door:'#8E5BD6', awning:['#FF7AB6','#FFFFFF']},
  seeds:  {wall:'#F3FFE9', roof:'#5CC46E', roof2:'#3FAE5A', trim:'#D6EBC4', door:'#8B5A3C', awning:['#5CC46E','#FFFFFF']},
  school: {wall:'#EEF5FF', roof:'#5B8DEF', roof2:'#3F6FD6', trim:'#CFDDF5', door:'#3F6FD6'},
  forge:  {wall:'#F5EEFF', roof:'#9B6CFF', roof2:'#7C4FE6', trim:'#DCCDF7', door:'#5B3FB0', awning:['#9B6CFF','#FFE48A']},
  post:   {wall:'#FFF8E6', roof:'#FFB547', roof2:'#F29A1F', trim:'#EEDDB6', door:'#C4703A'},
  house2: {wall:'#E8F7FF', roof:'#4FC3C9', roof2:'#36A8AE', trim:'#CBE7EE', door:'#2F8A8F'},
  barn:   {wall:'#E8584B', roof:'#B9483D', roof2:'#9E3B32', trim:'#FFFFFF', door:'#FFFFFF'},
  salon:  {wall:'#FFF0FB', roof:'#C77DFF', roof2:'#A75BE8', trim:'#F2D4FF', door:'#FF6FB5', awning:['#FF8FC7','#FFFFFF']},
  coop:   {wall:'#FFD36B', roof:'#E8584B', roof2:'#C9473C', trim:'#FFF3D0', door:'#8B5A3C'}
};
function houseDef(style, tw, th) {
  const S2 = BSTYLE[style], W = tw * 32, H = th * 32, wy = Math.round(H * 0.44), roofTop = 4;
  const win = (x, y) => `<rect x="${x}" y="${y}" width="18" height="16" rx="4" fill="#BFE8FF" stroke="${S2.trim}" stroke-width="3"/><path d="M${x + 9} ${y} V${y + 16} M${x} ${y + 8} H${x + 18}" stroke="${S2.trim}" stroke-width="2"/><rect x="${x + 2}" y="${y + 2}" width="5" height="5" rx="1.5" fill="#fff" opacity=".7"/>`;
  const dw = 22, dx = W / 2 - dw / 2;
  let body = `<ellipse cx="${W / 2}" cy="${H - 3}" rx="${W / 2 - 2}" ry="7" fill="${PAL.shadow}"/>`;
  body += `<rect x="6" y="${wy}" width="${W - 12}" height="${H - wy - 6}" rx="8" fill="${S2.wall}"/><rect x="6" y="${H - 16}" width="${W - 12}" height="10" rx="4" fill="${S2.trim}"/>`;
  if (style === 'barn') body += `<path d="M${dx - 6} ${H - 6} V${H - 46} Q${W / 2} ${H - 62} ${dx + dw + 6} ${H - 46} V${H - 6}Z" fill="#B9483D"/><path d="M${dx - 4} ${H - 46} L${dx + dw + 4} ${H - 8} M${dx + dw + 4} ${H - 46} L${dx - 4} ${H - 8}" stroke="#fff" stroke-width="4"/>`;
  else body += `<path d="M${dx} ${H - 6} V${H - 34} Q${dx} ${H - 44} ${W / 2} ${H - 44} Q${dx + dw} ${H - 44} ${dx + dw} ${H - 34} V${H - 6}Z" fill="${S2.door}"/><circle cx="${dx + dw - 6}" cy="${H - 22}" r="2" fill="#FFE48A"/>`;
  for (let i = 0; i < Math.max(1, Math.floor((tw - 1) / 2)); i++) { const x1 = 16 + i * 40; if (x1 + 18 < dx - 4) body += win(x1, wy + 12); const x2 = W - 34 - i * 40; if (x2 > dx + dw + 4) body += win(x2, wy + 12); }
  body += `<path d="M0 ${wy + 6} L${W / 2 - 8} ${roofTop + 4} Q${W / 2} ${roofTop - 2} ${W / 2 + 8} ${roofTop + 4} L${W} ${wy + 6} Q${W} ${wy + 14} ${W - 8} ${wy + 14} L8 ${wy + 14} Q0 ${wy + 14} 0 ${wy + 6}Z" fill="${S2.roof}"/>`;
  body += `<path d="M${W / 2} ${roofTop + 2} L${W / 2 + 8} ${roofTop + 4} L${W} ${wy + 6} Q${W} ${wy + 14} ${W - 8} ${wy + 14} L${W / 2 + 10} ${wy + 14}Z" fill="${S2.roof2}"/>`;
  for (let k = 1; k < 4; k++) { const y = roofTop + (wy + 8 - roofTop) * k / 4, half = (W / 2) * k / 4 + 4; body += `<path d="M${W / 2 - half} ${y} H${W / 2 + half}" stroke="#fff" stroke-width="2" opacity=".25"/>`; }
  if (style !== 'barn' && style !== 'coop') body += `<rect x="${W * 0.72}" y="${roofTop + 6}" width="12" height="22" rx="3" fill="${S2.roof2}"/><rect x="${W * 0.72 - 2}" y="${roofTop + 4}" width="16" height="6" rx="3" fill="${S2.trim}"/>`;
  if (S2.awning) { const n = Math.max(4, tw * 2), aw = (W - 12) / n; body += `<rect x="6" y="${wy + 2}" width="${W - 12}" height="8" fill="${S2.awning[0]}"/>${Array.from({length: n}, (_, i) => `<path d="M${6 + i * aw} ${wy + 10} h${aw} v4 a${aw / 2} ${aw / 2} 0 0 1 -${aw} 0z" fill="${S2.awning[i % 2]}"/>`).join('')}`; }
  if (style === 'school') body += `<rect x="${W - 14}" y="-14" width="3" height="${wy}" fill="#8E8AA8"/><path d="M${W - 11} -14 h18 l-4 6 l4 6 h-18z" fill="#FF4B5C"/><circle cx="${W / 2}" cy="${wy - 14}" r="7" fill="#FFE48A" stroke="${S2.trim}" stroke-width="3"/>`;
  if (style === 'forge') body += `<path d="M${W / 2 - 7} ${wy - 20} l7 -9 l7 9 l-7 10z" fill="#4BE0B0" stroke="#fff" stroke-width="2"/>`;
  return {w: W, h: H + 18, ax: 0, ay: H, svg: SV(W, H + 18, `<g transform="translate(0 0)">${body}</g>`)};
}
function stallDef(c1, c2) {
  return {w: 96, h: 92, ax: 48, ay: 86, svg: SV(96, 92, `<ellipse cx="48" cy="86" rx="44" ry="6" fill="${PAL.shadow}"/><rect x="10" y="22" width="5" height="60" rx="2" fill="${PAL.woodDk}"/><rect x="81" y="22" width="5" height="60" rx="2" fill="${PAL.woodDk}"/>
    <rect x="6" y="52" width="84" height="30" rx="6" fill="${PAL.wood}"/><rect x="6" y="52" width="84" height="7" rx="3" fill="${PAL.woodDk}"/>
    ${[18, 34, 50, 66, 78].map((x, i) => `<circle cx="${x}" cy="${50 - (i % 2) * 2}" r="7" fill="${[c1, '#FFD54A', '#7CCB5B', c2, '#FF8A2A'][i]}"/>`).join('')}
    <path d="M2 14 Q48 2 94 14 V26 H2Z" fill="${c1}"/>${Array.from({length: 8}, (_, i) => `<path d="M${2 + i * 11.5} 26 h11.5 v4 a5.75 5.75 0 0 1 -11.5 0z" fill="${i % 2 ? '#FFFFFF' : c1}"/>`).join('')}<path d="M2 14 Q48 2 94 14" stroke="#fff" stroke-width="3" opacity=".5" fill="none"/>`)};
}

/* ---------- props ---------- */
const PROPS = {
  well: () => ({w: 48, h: 64, ax: 24, ay: 58, svg: SV(48, 64, `<ellipse cx="24" cy="58" rx="20" ry="5" fill="${PAL.shadow}"/><rect x="6" y="34" width="36" height="22" rx="8" fill="#C9C3D8"/><rect x="6" y="34" width="36" height="8" rx="4" fill="#B3ABC7"/><ellipse cx="24" cy="36" rx="14" ry="4" fill="#4FB2E8"/><rect x="8" y="8" width="4" height="30" fill="${PAL.woodDk}"/><rect x="36" y="8" width="4" height="30" fill="${PAL.woodDk}"/><path d="M2 12 L24 0 L46 12 Z" fill="#FF8A65"/>`)}),
  bench: () => ({w: 56, h: 34, ax: 28, ay: 30, svg: SV(56, 34, `<ellipse cx="28" cy="30" rx="24" ry="4" fill="${PAL.shadow}"/><rect x="6" y="16" width="4" height="14" fill="#6B6890"/><rect x="46" y="16" width="4" height="14" fill="#6B6890"/><rect x="2" y="12" width="52" height="8" rx="3" fill="${PAL.wood}"/><rect x="2" y="2" width="52" height="7" rx="3" fill="${PAL.woodDk}"/>`)}),
  lamp: () => ({w: 24, h: 76, ax: 12, ay: 72, svg: SV(24, 76, `<ellipse cx="12" cy="72" rx="9" ry="3" fill="${PAL.shadow}"/><rect x="10" y="16" width="4" height="56" rx="2" fill="#4B4870"/><rect x="6" y="66" width="12" height="6" rx="2" fill="#4B4870"/><circle cx="12" cy="12" r="10" fill="#FFE48A" opacity=".45"/><rect x="5" y="4" width="14" height="14" rx="5" fill="#FFF1B8" stroke="#4B4870" stroke-width="2.5"/>`)}),
  crate: () => ({w: 34, h: 34, ax: 17, ay: 30, svg: SV(34, 34, `<ellipse cx="17" cy="30" rx="15" ry="4" fill="${PAL.shadow}"/><rect x="3" y="6" width="28" height="24" rx="4" fill="${PAL.wood}"/><path d="M3 12 H31 M3 24 H31" stroke="${PAL.woodDk}" stroke-width="3"/><circle cx="11" cy="6" r="5" fill="#FF5A4E"/><circle cx="21" cy="5" r="5" fill="#FFD54A"/>`)}),
  hay: () => ({w: 40, h: 32, ax: 20, ay: 28, svg: SV(40, 32, `<ellipse cx="20" cy="28" rx="18" ry="4" fill="${PAL.shadow}"/><rect x="3" y="6" width="34" height="22" rx="10" fill="#F6C94C"/><path d="M8 12 H32 M8 20 H32" stroke="#E0AE2E" stroke-width="2"/><ellipse cx="12" cy="16" rx="6" ry="9" fill="#FFE27A" opacity=".5"/>`)}),
  sacks: () => ({w: 40, h: 34, ax: 20, ay: 30, svg: SV(40, 34, `<ellipse cx="20" cy="30" rx="18" ry="4" fill="${PAL.shadow}"/><path d="M4 30 Q2 12 10 8 Q16 6 20 10 Q22 30 4 30Z" fill="#E8D3A8"/><path d="M18 30 Q16 10 26 6 Q34 6 36 12 Q40 30 18 30Z" fill="#DCC292"/><path d="M8 8 l4 -4 l4 4 M24 6 l4 -4 l4 4" stroke="#B89A66" stroke-width="2" fill="none"/>`)}),
  mailbox: () => ({w: 24, h: 44, ax: 12, ay: 40, svg: SV(24, 44, `<ellipse cx="12" cy="40" rx="8" ry="3" fill="${PAL.shadow}"/><rect x="10" y="18" width="4" height="22" fill="${PAL.woodDk}"/><rect x="2" y="4" width="20" height="16" rx="7" fill="#5B8DEF"/><rect x="18" y="2" width="3" height="10" fill="#FF4B5C"/>`)}),
  board: () => ({w: 72, h: 60, ax: 36, ay: 56, svg: SV(72, 60, `<ellipse cx="36" cy="56" rx="30" ry="4" fill="${PAL.shadow}"/><rect x="12" y="30" width="5" height="26" fill="${PAL.woodDk}"/><rect x="55" y="30" width="5" height="26" fill="${PAL.woodDk}"/><rect x="2" y="2" width="68" height="36" rx="8" fill="${PAL.wood}"/><rect x="7" y="7" width="58" height="26" rx="5" fill="#FFF8EE"/><rect x="11" y="11" width="16" height="12" rx="2" fill="#FF8FC7"/><rect x="31" y="11" width="14" height="16" rx="2" fill="#8EE7FF"/><rect x="49" y="11" width="12" height="10" rx="2" fill="#FFE48A"/>`)}),
  boat: () => ({w: 96, h: 44, ax: 48, ay: 30, svg: SV(96, 44, `<ellipse cx="48" cy="34" rx="44" ry="8" fill="rgba(20,80,120,.25)"/><path d="M4 18 Q48 2 92 18 Q84 36 48 38 Q12 36 4 18Z" fill="#E8584B"/><path d="M12 18 Q48 8 84 18 Q78 30 48 31 Q18 30 12 18Z" fill="#FFF3E2"/><rect x="34" y="16" width="28" height="5" rx="2" fill="${PAL.woodDk}"/>`)}),
  reeds: () => ({w: 32, h: 40, ax: 16, ay: 36, svg: SV(32, 40, `${[[6, -10], [12, -4], [18, 6], [24, 12]].map(([x, a]) => `<path d="M${x} 36 Q${x + a / 3} 18 ${x + a / 2} 4" stroke="#3FAE5A" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')}<ellipse cx="14" cy="10" rx="3" ry="7" fill="#8B5A3C"/>`)}),
  rock: () => ({w: 36, h: 26, ax: 18, ay: 22, svg: SV(36, 26, `<ellipse cx="18" cy="22" rx="16" ry="4" fill="${PAL.shadow}"/><path d="M4 20 Q2 8 14 5 Q28 2 32 14 Q34 22 4 20Z" fill="#B9B4CC"/><path d="M10 9 Q16 6 22 8" stroke="#fff" stroke-width="2.5" opacity=".6" fill="none"/>`)}),
  fountain: () => ({w: 112, h: 104, ax: 56, ay: 88, svg: SV(112, 104, `<ellipse cx="56" cy="88" rx="52" ry="12" fill="${PAL.shadow}"/><ellipse cx="56" cy="74" rx="52" ry="22" fill="#D8D1EA"/><ellipse cx="56" cy="70" rx="44" ry="17" fill="#6CC8F4"/><ellipse cx="44" cy="66" rx="14" ry="4" fill="#fff" opacity=".5"/><rect x="48" y="30" width="16" height="40" rx="6" fill="#D8D1EA"/><ellipse cx="56" cy="32" rx="22" ry="8" fill="#C5BCDD"/><ellipse cx="56" cy="30" rx="16" ry="5" fill="#6CC8F4"/><path d="M56 26 Q50 8 40 22 M56 26 Q62 8 72 22 M56 26 V4" stroke="#BFEAFF" stroke-width="4" fill="none" stroke-linecap="round"/>`)}),
  flowers: () => ({w: 40, h: 26, ax: 20, ay: 22, svg: SV(40, 26, `<ellipse cx="20" cy="22" rx="18" ry="4" fill="${PAL.shadow}"/>${[[8, 14, '#FF7AB6'], [18, 10, '#FFD54A'], [28, 15, '#FFFFFF'], [14, 18, '#9B6CFF'], [24, 20, '#FF8A65']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="3" fill="${c}"/><circle cx="${x}" cy="${y}" r="1.2" fill="#FFB020"/>`).join('')}<path d="M6 22 Q20 16 34 22" stroke="${PAL.leaf}" stroke-width="3" fill="none"/>`)})
};

/* ---------- terrain (canvas, rounded blobs) ---------- */
const TCOL = {d: [PAL.path, PAL.pathEdge], s: [PAL.sand, PAL.sandEdge], c: [PAL.plaza, PAL.plazaEdge], w: [PAL.water, PAL.waterEdge], f: [PAL.soilDk, '#86593A']};
function paintTerrain(m, res) {
  const cvs = document.createElement('canvas'); cvs.width = Math.ceil(m.w * TS * res); cvs.height = Math.ceil(m.h * TS * res);
  const g = cvs.getContext('2d'); g.scale(res, res);
  g.fillStyle = PAL.grass; g.fillRect(0, 0, m.w * TS, m.h * TS);
  // soft grass texture
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) {
    const h = hash2(x, y, 4);
    if (h % 5 === 0) { g.fillStyle = PAL.grass2; g.beginPath(); g.ellipse(x * TS + 8 + h % 16, y * TS + 8 + (h >> 4) % 16, 9, 5, 0, 0, Math.PI * 2); g.fill(); }
    if (h % 3 === 0) { g.strokeStyle = PAL.grassEdge; g.lineWidth = 1.6; g.lineCap = 'round'; const bx = x * TS + (h >> 3) % 26 + 3, by = y * TS + (h >> 7) % 22 + 8; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx - 2, by - 5); g.moveTo(bx + 3, by); g.lineTo(bx + 4, by - 5); g.stroke(); }
    if (h % 23 === 0) { g.fillStyle = ['#FFFFFF', '#FFD54A', '#FF8FC7'][h % 3]; g.beginPath(); g.arc(x * TS + (h >> 5) % 28 + 2, y * TS + (h >> 9) % 28 + 2, 2, 0, Math.PI * 2); g.fill(); }
  }
  const R = 11;
  for (const t of ['s', 'd', 'c', 'w', 'f']) {
    const same = (x, y) => { const n = T_(m, x, y); return n === null || n === t || (t === 'w' && n === 'D'); };
    const tiles = []; for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) { const h = T_(m, x, y); if (h === t || (t === 'w' && h === 'D')) tiles.push([x, y]); }
    if (!tiles.length) continue;
    const radii = (x, y) => [!same(x - 1, y) && !same(x, y - 1) ? R : 0, !same(x + 1, y) && !same(x, y - 1) ? R : 0, !same(x + 1, y) && !same(x, y + 1) ? R : 0, !same(x - 1, y) && !same(x, y + 1) ? R : 0];
    const rr = (x, y, grow) => { const r = radii(x, y); g.beginPath(); const X = x * TS - (same(x - 1, y) ? 0.5 : grow), Y = y * TS - (same(x, y - 1) ? 0.5 : grow), W = TS + 1 + (same(x - 1, y) ? 0 : grow - 0.5) + (same(x + 1, y) ? 0 : grow - 0.5), H = TS + 1 + (same(x, y - 1) ? 0 : grow - 0.5) + (same(x, y + 1) ? 0 : grow - 0.5); if (g.roundRect) g.roundRect(X, Y, W, H, r.map(v => v ? v + grow : 0)); else g.rect(X, Y, W, H); g.fill(); };
    g.fillStyle = TCOL[t][1]; for (const [x, y] of tiles) rr(x, y, 3);
    g.fillStyle = TCOL[t][0]; for (const [x, y] of tiles) rr(x, y, 0);
    if (t === 'c') { g.strokeStyle = PAL.plazaLine; g.lineWidth = 1.5; for (const [x, y] of tiles) { g.strokeRect(x * TS + 2, y * TS + 2, TS - 4, TS - 4); } }
    if (t === 'd') { g.fillStyle = PAL.pathEdge; for (const [x, y] of tiles) { const h = hash2(x, y, 7); if (h % 3 === 0) { g.beginPath(); g.ellipse(x * TS + 6 + h % 20, y * TS + 6 + (h >> 5) % 20, 3, 2, 0, 0, Math.PI * 2); g.fill(); } } }
    if (t === 'w') { g.strokeStyle = PAL.foam; g.lineWidth = 2.5; g.globalAlpha = .7; for (const [x, y] of tiles) { if (!same(x, y - 1)) { g.beginPath(); g.moveTo(x * TS + 2, y * TS + 5); g.lineTo(x * TS + TS - 2, y * TS + 5); g.stroke(); } } g.globalAlpha = 1; }
  }
  // dock planks
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) if (T_(m, x, y) === 'D') {
    g.fillStyle = PAL.woodDk; g.fillRect(x * TS, y * TS, TS, TS); g.fillStyle = PAL.wood;
    for (let k = 0; k < 4; k++) { g.beginPath(); if (g.roundRect) g.roundRect(x * TS + 1, y * TS + k * 8 + 1, TS - 2, 6, 2); else g.rect(x * TS + 1, y * TS + k * 8 + 1, TS - 2, 6); g.fill(); }
  }
  return cvs;
}

/* ---------- crops (canvas) ---------- */
const CROP_ART = {
  carrot:{s:'root', c:'#FF8A2A'}, radish:{s:'root', c:'#FF4F79'}, lettuce:{s:'rosette', c:'#A6E36B'}, potato:{s:'tuber', c:'#C99A5E'},
  onion:{s:'bulb', c:'#F4E3C6'}, cabbage:{s:'rosette', c:'#7CCB5B'}, tomato:{s:'vine', c:'#FF4B3E'}, cucumber:{s:'long', c:'#3EA34B'},
  chili:{s:'long', c:'#FF3030'}, strawberry:{s:'berry', c:'#FF3B5C'}, eggplant:{s:'long', c:'#7A3FA0'}, corn:{s:'corn', c:'#FFD54A'},
  pepper:{s:'vine', c:'#FF6A2A'}, cauliflower:{s:'rosette', c:'#FFF6E6'}, pumpkin:{s:'gourd', c:'#FF9A2E'}, watermelon:{s:'melon', c:'#3DA65A'},
  garlic:{s:'bulb', c:'#FBF4E6'}, spinach:{s:'rosette', c:'#4FA84A'}, sweetpotato:{s:'tuber', c:'#B04C78'}, peanut:{s:'tuber', c:'#D9A86C'},
  beans:{s:'long', c:'#6CC24A'}, sunflower:{s:'flower', c:'#FFC83D'}, blueberry:{s:'vine', c:'#4F6BD8'}, rose:{s:'flower', c:'#FF3B5C'},
  grape:{s:'vine', c:'#8A3FB0'}, pineapple:{s:'pine', c:'#F2B830'}, dragonfruit:{s:'gourd', c:'#FF3E8E'}, lotus:{s:'flower', c:'#FF8FC7'},
  goldmelon:{s:'melon', c:'#F2C94C'}, ginseng:{s:'root', c:'#F2D7A0'}
};
function leafPair(g, x, y, s, col) { g.fillStyle = col; g.beginPath(); g.ellipse(x - 5 * s, y, 6 * s, 3 * s, -0.5, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(x + 5 * s, y, 6 * s, 3 * s, 0.5, 0, Math.PI * 2); g.fill(); }
function drawCrop(g, id, stage, X, Y, t) {
  const A = CROP_ART[id] || {s: 'vine', c: '#FF4B3E'}, cx = X + 16, by = Y + 24, sway = Math.sin(t / 600 + X) * 0.6;
  g.save(); g.lineCap = 'round';
  if (stage === 0) { g.fillStyle = '#5E3A22'; for (const [dx, dy] of [[-6, 0], [0, -3], [6, 1]]) { g.beginPath(); g.ellipse(cx + dx, by + dy - 6, 2.2, 1.6, 0, 0, Math.PI * 2); g.fill(); } g.restore(); return; }
  if (stage === 1) { g.strokeStyle = PAL.leaf; g.lineWidth = 2.2; g.beginPath(); g.moveTo(cx, by - 4); g.lineTo(cx + sway, by - 12); g.stroke(); leafPair(g, cx + sway, by - 13, 0.8, PAL.leafMd); g.restore(); return; }
  const big = stage === 3;
  if (stage === 2) { g.strokeStyle = PAL.leaf; g.lineWidth = 2.6; g.beginPath(); g.moveTo(cx, by - 2); g.lineTo(cx + sway, by - 20); g.stroke(); leafPair(g, cx + sway, by - 10, 1, PAL.leaf); leafPair(g, cx + sway, by - 18, 0.9, PAL.leafMd); g.fillStyle = A.c; g.beginPath(); g.arc(cx + sway, by - 23, 3, 0, Math.PI * 2); g.fill(); g.restore(); return; }
  const c = A.c, dk = shade(c, -0.22);
  switch (A.s) {
    case 'root': for (const dx of [-7, 7]) { leafPair(g, cx + dx, by - 18, 0.8, PAL.leaf); g.fillStyle = c; g.beginPath(); g.moveTo(cx + dx - 6, by - 12); g.quadraticCurveTo(cx + dx, by - 16, cx + dx + 6, by - 12); g.lineTo(cx + dx, by + 2); g.closePath(); g.fill(); } break;
    case 'rosette': g.fillStyle = PAL.leaf; g.beginPath(); g.arc(cx, by - 8, 13, 0, Math.PI * 2); g.fill(); g.fillStyle = c; g.beginPath(); g.arc(cx, by - 9, 9, 0, Math.PI * 2); g.fill(); g.fillStyle = shade(c, 0.35); g.beginPath(); g.arc(cx - 2, by - 11, 4, 0, Math.PI * 2); g.fill(); break;
    case 'tuber': leafPair(g, cx, by - 20, 1.1, PAL.leaf); leafPair(g, cx, by - 14, 1, PAL.leafMd); g.fillStyle = c; for (const [dx, r] of [[-7, 6], [7, 7]]) { g.beginPath(); g.ellipse(cx + dx, by - 2, r, r * 0.75, 0, 0, Math.PI * 2); g.fill(); } break;
    case 'bulb': for (const dx of [-7, 7]) { g.strokeStyle = PAL.leafMd; g.lineWidth = 2.4; g.beginPath(); g.moveTo(cx + dx, by - 6); g.lineTo(cx + dx + sway, by - 24); g.stroke(); g.fillStyle = c; g.beginPath(); g.arc(cx + dx, by - 4, 6.5, 0, Math.PI * 2); g.fill(); } break;
    case 'vine': case 'berry': case 'long': {
      g.strokeStyle = PAL.leaf; g.lineWidth = 2.6; g.beginPath(); g.moveTo(cx, by); g.lineTo(cx + sway, by - 26); g.stroke();
      leafPair(g, cx + sway, by - 22, 1.1, PAL.leaf); leafPair(g, cx, by - 12, 1.1, PAL.leafMd);
      const pts = [[-7, -16], [7, -18], [0, -6]]; g.fillStyle = c;
      for (const [dx, dy] of pts) { g.beginPath(); if (A.s === 'long') g.ellipse(cx + dx, by + dy, 3, 7, dx * 0.04, 0, Math.PI * 2); else if (A.s === 'berry') { const x = cx + dx, y = by + dy; g.moveTo(x - 5, y - 3); g.quadraticCurveTo(x, y - 6, x + 5, y - 3); g.quadraticCurveTo(x + 3, y + 5, x, y + 7); g.quadraticCurveTo(x - 3, y + 5, x - 5, y - 3); } else g.arc(cx + dx, by + dy, 5, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = 'rgba(255,255,255,.55)'; for (const [dx, dy] of pts) { g.beginPath(); g.arc(cx + dx - 1.5, by + dy - 2, 1.4, 0, Math.PI * 2); g.fill(); } break; }
    case 'flower': { g.strokeStyle = PAL.leaf; g.lineWidth = 2.6; g.beginPath(); g.moveTo(cx, by); g.lineTo(cx + sway, by - 26); g.stroke(); leafPair(g, cx, by - 10, 1.2, PAL.leaf);
      const fx = cx + sway, fy = by - 28; g.fillStyle = c; for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; g.beginPath(); g.ellipse(fx + Math.cos(a) * 6, fy + Math.sin(a) * 6, 4.5, 2.6, a, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = id === 'sunflower' ? '#8B5A3C' : '#FFE27A'; g.beginPath(); g.arc(fx, fy, 3.6, 0, Math.PI * 2); g.fill(); break; }
    case 'pine': { g.fillStyle = PAL.leaf; for (const [dx, a] of [[-6, -0.5], [0, 0], [6, 0.5]]) { g.beginPath(); g.ellipse(cx + dx * 0.6, by - 22, 2.6, 9, a, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = c; g.beginPath(); g.ellipse(cx, by - 6, 8, 10, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = dk; g.lineWidth = 1.2;
      for (const d of [-6, 0, 6]) { g.beginPath(); g.moveTo(cx - 7, by - 6 + d); g.lineTo(cx + 7, by - 6 + d + 4); g.moveTo(cx + 7, by - 6 + d); g.lineTo(cx - 7, by - 6 + d + 4); g.stroke(); } break; }
    case 'corn': g.strokeStyle = PAL.leaf; g.lineWidth = 3; g.beginPath(); g.moveTo(cx, by); g.lineTo(cx + sway, by - 34); g.stroke(); leafPair(g, cx, by - 10, 1.3, PAL.leaf); leafPair(g, cx, by - 22, 1.1, PAL.leafMd); g.fillStyle = c; g.beginPath(); g.ellipse(cx + 6, by - 20, 4, 9, 0.25, 0, Math.PI * 2); g.fill(); g.fillStyle = PAL.leafMd; g.beginPath(); g.ellipse(cx + 3, by - 16, 3, 8, 0.6, 0, Math.PI * 2); g.fill(); break;
    case 'gourd': case 'melon': g.strokeStyle = PAL.leaf; g.lineWidth = 2.4; g.beginPath(); g.moveTo(cx - 12, by - 4); g.quadraticCurveTo(cx - 4, by - 18, cx + 12, by - 12); g.stroke(); leafPair(g, cx - 6, by - 16, 1, PAL.leafMd);
      g.fillStyle = c; g.beginPath(); g.ellipse(cx + 2, by - 5, 11, 8.5, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = dk; g.lineWidth = A.s === 'melon' ? 2.4 : 1.6; for (const dx of [-5, 2, 8]) { g.beginPath(); g.moveTo(cx + dx, by - 12); g.quadraticCurveTo(cx + dx + (A.s === 'melon' ? 2 : 0), by - 5, cx + dx, by + 2); g.stroke(); } g.fillStyle = 'rgba(255,255,255,.45)'; g.beginPath(); g.ellipse(cx - 3, by - 9, 3, 2, -0.4, 0, Math.PI * 2); g.fill(); break;
  }
  g.restore();
}

/* ---------- farm animals (SVG, facing right) ---------- */
const ANI_ART = {
  chicken: (f) => `<ellipse cx="24" cy="44" rx="14" ry="3.5" fill="${PAL.shadow}"/><path d="M18 ${40 - f} v5 M28 ${40 - f} v5" stroke="#FF9A2E" stroke-width="2.4" stroke-linecap="round"/><path d="M8 ${26 - f} q-6 -8 2 -12 q2 6 6 8z" fill="#EDE7F6"/><ellipse cx="22" cy="${30 - f}" rx="14" ry="12" fill="#FFFFFF"/><circle cx="32" cy="${18 - f}" r="8" fill="#FFFFFF"/><path d="M28 ${11 - f} q2 -6 5 -2 q2 -5 5 1 q-4 2 -10 1z" fill="#FF4B5C"/><path d="M39 ${18 - f} l6 2 l-6 3z" fill="#FFB020"/><circle cx="35" cy="${16 - f}" r="1.8" fill="#1F1B24"/><ellipse cx="38" cy="${25 - f}" rx="2" ry="3" fill="#FF4B5C"/><path d="M14 ${30 - f} q8 -6 14 2 q-8 6 -14 -2z" fill="#EDE7F6"/>`,
  duck: (f) => `<ellipse cx="24" cy="44" rx="14" ry="3.5" fill="${PAL.shadow}"/><path d="M18 ${40 - f} v5 M28 ${40 - f} v5" stroke="#FF9A2E" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="22" cy="${31 - f}" rx="15" ry="11" fill="#FFE27A"/><circle cx="33" cy="${18 - f}" r="8" fill="#FFE27A"/><path d="M39 ${17 - f} q8 -1 9 3 q-4 3 -9 1z" fill="#FF9A2E"/><circle cx="35" cy="${16 - f}" r="1.8" fill="#1F1B24"/><path d="M12 ${30 - f} q8 -6 14 2 q-8 6 -14 -2z" fill="#F6CF4F"/>`,
  pig: (f) => `<ellipse cx="30" cy="46" rx="20" ry="4" fill="${PAL.shadow}"/><g fill="#F2A0AE">${[14, 22, 36, 44].map((x, i) => `<rect x="${x}" y="${36 - (i % 2 ? f : 0)}" width="6" height="10" rx="3"/>`).join('')}</g><ellipse cx="29" cy="${30 - f}" rx="21" ry="14" fill="#FFB8C4"/><circle cx="48" cy="${24 - f}" r="11" fill="#FFB8C4"/><ellipse cx="56" cy="${27 - f}" rx="5" ry="4" fill="#F28D9E"/><circle cx="55" cy="${26 - f}" r="1" fill="#B44B5E"/><circle cx="57.5" cy="${27 - f}" r="1" fill="#B44B5E"/><circle cx="49" cy="${21 - f}" r="1.8" fill="#1F1B24"/><path d="M42 ${14 - f} l3 -6 l4 6z" fill="#F28D9E"/><path d="M8 ${26 - f} q-6 -2 -3 -7" stroke="#F28D9E" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
  cow: (f) => `<ellipse cx="34" cy="52" rx="26" ry="4" fill="${PAL.shadow}"/><g fill="#EDE7F6">${[14, 22, 44, 52].map((x, i) => `<rect x="${x}" y="${40 - (i % 2 ? f : 0)}" width="7" height="12" rx="3"/>`).join('')}</g><rect x="8" y="${18 - f}" width="52" height="28" rx="13" fill="#FFFFFF"/><path d="M18 ${22 - f} q10 -4 12 6 q-2 9 -12 6 q-6 -6 0 -12z" fill="#2B2838"/><ellipse cx="44" cy="${36 - f}" rx="7" ry="5" fill="#2B2838"/><ellipse cx="62" cy="${22 - f}" rx="11" ry="12" fill="#FFFFFF"/><ellipse cx="65" cy="${30 - f}" rx="8" ry="5.5" fill="#FFC3C9"/><circle cx="62" cy="${18 - f}" r="1.8" fill="#1F1B24"/><path d="M55 ${10 - f} q-3 -5 1 -7 M69 ${10 - f} q3 -5 -1 -7" stroke="#E8C58A" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M8 ${24 - f} q-6 6 -3 14" stroke="#2B2838" stroke-width="2" fill="none"/>`,
  sheep: (f) => `<ellipse cx="30" cy="48" rx="22" ry="4" fill="${PAL.shadow}"/><g fill="#4B4870">${[16, 24, 36, 44].map((x, i) => `<rect x="${x}" y="${36 - (i % 2 ? f : 0)}" width="5" height="12" rx="2.5"/>`).join('')}</g><g fill="#FFFFFF" stroke="#E5E0F2" stroke-width="1.5">${[[14, 26, 10], [26, 20, 11], [38, 22, 11], [44, 32, 9], [30, 34, 11], [18, 34, 9]].map(([x, y, r]) => `<circle cx="${x}" cy="${y - f}" r="${r}"/>`).join('')}</g><ellipse cx="52" cy="${24 - f}" rx="8" ry="10" fill="#4B4870"/><ellipse cx="46" cy="${18 - f}" rx="5" ry="2.5" fill="#4B4870" transform="rotate(-25 46 ${18 - f})"/><circle cx="55" cy="${22 - f}" r="1.6" fill="#fff"/>`,
  goat: (f) => `<ellipse cx="30" cy="48" rx="20" ry="4" fill="${PAL.shadow}"/><g fill="#B98B5E">${[14, 22, 36, 44].map((x, i) => `<rect x="${x}" y="${34 - (i % 2 ? f : 0)}" width="5" height="14" rx="2.5"/>`).join('')}</g><rect x="10" y="${18 - f}" width="40" height="22" rx="11" fill="#E8C9A0"/><ellipse cx="52" cy="${18 - f}" rx="8" ry="10" fill="#E8C9A0"/><path d="M48 ${9 - f} q-2 -8 -8 -8 M54 ${9 - f} q2 -8 8 -6" stroke="#8B6A4A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M54 ${27 - f} l-1 7 l-3 -6z" fill="#FFFFFF"/><circle cx="55" cy="${16 - f}" r="1.6" fill="#1F1B24"/><path d="M10 ${22 - f} l-5 -4" stroke="#E8C9A0" stroke-width="4" stroke-linecap="round"/>`,
  rabbit: (f) => `<ellipse cx="22" cy="40" rx="13" ry="3.5" fill="${PAL.shadow}"/><ellipse cx="20" cy="${30 - f}" rx="13" ry="10" fill="#E9E5F2"/><circle cx="31" cy="${22 - f}" r="8" fill="#E9E5F2"/><ellipse cx="28" cy="${8 - f}" rx="3.2" ry="9" fill="#E9E5F2" transform="rotate(-10 28 ${8 - f})"/><ellipse cx="34" cy="${9 - f}" rx="3.2" ry="9" fill="#E9E5F2" transform="rotate(12 34 ${9 - f})"/><ellipse cx="34" cy="${9 - f}" rx="1.4" ry="6" fill="#FFB3D1" transform="rotate(12 34 ${9 - f})"/><circle cx="34" cy="${21 - f}" r="1.6" fill="#1F1B24"/><circle cx="38" cy="${24 - f}" r="1.3" fill="#FF8FA3"/><circle cx="8" cy="${28 - f}" r="4" fill="#FFFFFF"/>`,
  buffalo: (f) => `<ellipse cx="34" cy="52" rx="26" ry="4" fill="${PAL.shadow}"/><g fill="#4F4B66">${[14, 22, 44, 52].map((x, i) => `<rect x="${x}" y="${40 - (i % 2 ? f : 0)}" width="7" height="12" rx="3"/>`).join('')}</g><rect x="8" y="${18 - f}" width="52" height="28" rx="13" fill="#6B6788"/><ellipse cx="62" cy="${24 - f}" rx="11" ry="11" fill="#6B6788"/><ellipse cx="66" cy="${31 - f}" rx="7" ry="5" fill="#8E8AA8"/><circle cx="62" cy="${20 - f}" r="1.8" fill="#1F1B24"/><path d="M52 ${14 - f} q-10 -8 -2 -14 M70 ${14 - f} q10 -6 4 -14" stroke="#EDE4CF" stroke-width="4" stroke-linecap="round" fill="none"/>`,
  horse: (f) => `<ellipse cx="34" cy="56" rx="26" ry="4" fill="${PAL.shadow}"/><g fill="#8B5A3C">${[14, 22, 44, 52].map((x, i) => `<rect x="${x}" y="${38 - (i % 2 ? f : 0)}" width="6" height="18" rx="3"/>`).join('')}</g><rect x="8" y="${18 - f}" width="52" height="24" rx="12" fill="#B9774A"/><path d="M52 ${22 - f} q4 -18 16 -16 q6 2 4 10 l-6 12 q-8 2 -14 -6z" fill="#B9774A"/><path d="M54 ${8 - f} q6 -6 12 0 q-6 0 -8 14 q-4 -6 -4 -14z" fill="#5B3423"/><circle cx="66" cy="${10 - f}" r="1.8" fill="#1F1B24"/><path d="M8 ${24 - f} q-8 4 -6 16" stroke="#5B3423" stroke-width="4" fill="none" stroke-linecap="round"/>`
};
const ANI_SIZE = {chicken:[48,48], duck:[50,48], pig:[64,50], cow:[76,56], sheep:[62,52], goat:[64,52], rabbit:[44,44], buffalo:[78,56], horse:[78,60]};
function animalDef(t, f) { const [w, h] = ANI_SIZE[t]; return {w, h, ax: w / 2, ay: h - 4, svg: SV(w, h, ANI_ART[t](f))}; }

/* ---------- item icons (SVG data URLs) ---------- */
function produceSVG(id) {
  const A = CROP_ART[id]; let b = '';
  if (A) { const c = A.c, dk = shade(c, -0.25);
    switch (A.s) {
      case 'root': b = `<path d="M18 9 l-3 -7 M20 9 l2 -7 M19 9 l0 -8" stroke="#3FAE5A" stroke-width="3" stroke-linecap="round"/><path d="M10 10 Q20 6 30 10 L21 37 Q20 39 19 37Z" fill="${c}"/><path d="M14 16 h6 M17 24 h6" stroke="${dk}" stroke-width="2" stroke-linecap="round"/>`; break;
      case 'rosette': b = `<circle cx="20" cy="22" r="15" fill="#3FAE5A"/><circle cx="20" cy="21" r="11" fill="${c}"/><circle cx="16" cy="17" r="4" fill="#fff" opacity=".4"/>`; break;
      case 'tuber': b = `<ellipse cx="20" cy="22" rx="14" ry="11" fill="${c}"/><circle cx="14" cy="20" r="1.5" fill="${dk}"/><circle cx="24" cy="25" r="1.5" fill="${dk}"/><circle cx="22" cy="17" r="1.5" fill="${dk}"/>`; break;
      case 'bulb': b = `<path d="M20 4 v8" stroke="#3FAE5A" stroke-width="3"/><path d="M20 10 Q34 18 30 30 Q20 38 10 30 Q6 18 20 10Z" fill="${c}"/><path d="M20 12 v22" stroke="${dk}" stroke-width="1.5"/>`; break;
      case 'long': b = `<path d="M12 6 Q30 4 32 30 Q28 36 24 30 Q24 14 12 10Z" fill="${c}"/><path d="M10 4 l6 4" stroke="#3FAE5A" stroke-width="3" stroke-linecap="round"/>`; break;
      case 'berry': b = `<path d="M8 14 Q20 8 32 14 Q30 30 20 36 Q10 30 8 14Z" fill="${c}"/><path d="M14 9 l6 4 l6 -4" stroke="#3FAE5A" stroke-width="3" fill="none" stroke-linecap="round"/><g fill="#FFE27A"><circle cx="15" cy="20" r="1.2"/><circle cx="24" cy="21" r="1.2"/><circle cx="19" cy="28" r="1.2"/></g>`; break;
      case 'flower': b = `<path d="M20 38 V20" stroke="#3FAE5A" stroke-width="3"/><path d="M20 30 q-8 -2 -10 -8 q8 0 10 6z" fill="#3FAE5A"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<ellipse cx="${20 + Math.cos(a * Math.PI / 180) * 8}" cy="${15 + Math.sin(a * Math.PI / 180) * 8}" rx="6" ry="3.6" fill="${c}" transform="rotate(${a} ${20 + Math.cos(a * Math.PI / 180) * 8} ${15 + Math.sin(a * Math.PI / 180) * 8})"/>`).join('')}<circle cx="20" cy="15" r="5" fill="${id === 'sunflower' ? '#8B5A3C' : '#FFE27A'}"/>`; break;
      case 'pine': b = `<path d="M20 12 L12 0 L18 8 L20 -2 L22 8 L28 0Z" fill="#3FAE5A"/><ellipse cx="20" cy="25" rx="11" ry="13" fill="${c}"/><path d="M11 18 L29 32 M29 18 L11 32 M10 25 L22 37 M30 25 L18 37" stroke="${dk}" stroke-width="1.5"/>`; break;
      case 'corn': b = `<ellipse cx="20" cy="20" rx="8" ry="15" fill="${c}"/><path d="M14 30 Q8 20 12 6 Q16 20 20 34Z M26 30 Q32 20 28 6 Q24 20 20 34Z" fill="#7CCB5B"/>`; break;
      case 'gourd': b = `<ellipse cx="20" cy="23" rx="16" ry="12" fill="${c}"/><path d="M12 13 Q8 23 12 34 M28 13 Q32 23 28 34 M20 11 v24" stroke="${dk}" stroke-width="1.8" fill="none"/><rect x="18" y="6" width="4" height="7" rx="2" fill="#8B5A3C"/>`; break;
      case 'melon': b = `<ellipse cx="20" cy="22" rx="16" ry="12" fill="${c}"/><path d="M10 14 Q8 22 10 32 M18 11 Q16 22 18 34 M26 11 Q28 22 26 34 M33 16 Q35 22 33 30" stroke="${dk}" stroke-width="2.4" fill="none"/>`; break;
      default: b = `<circle cx="20" cy="22" r="13" fill="${c}"/><path d="M14 10 l6 4 l6 -4" stroke="#3FAE5A" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="15" cy="17" r="3.5" fill="#fff" opacity=".45"/>`;
    }
  } else switch (id) {
    case 'egg': b = `<ellipse cx="20" cy="22" rx="11" ry="14" fill="#FFF3DC"/><ellipse cx="16" cy="16" rx="3" ry="5" fill="#fff"/>`; break;
    case 'duckegg': b = `<ellipse cx="20" cy="22" rx="11" ry="14" fill="#DDF1F6"/><ellipse cx="16" cy="16" rx="3" ry="5" fill="#fff"/>`; break;
    case 'truffle': b = `<path d="M6 20 Q20 2 34 20Z" fill="#B9774A"/><rect x="15" y="20" width="10" height="14" rx="4" fill="#FFF3E2"/><circle cx="14" cy="14" r="2.5" fill="#fff" opacity=".7"/><circle cx="24" cy="12" r="2" fill="#fff" opacity=".7"/>`; break;
    case 'milk': b = `<path d="M14 4h12v6l4 6v18a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3V16l4-6z" fill="#FFFFFF" stroke="#D9E6F5" stroke-width="2"/><rect x="13" y="2" width="14" height="5" rx="2" fill="#5B8DEF"/><rect x="10" y="20" width="20" height="8" fill="#CFE2F5"/>`; break;
    case 'wool': b = `<circle cx="20" cy="22" r="14" fill="#F4EEFF"/><path d="M8 18 Q20 26 32 16 M7 25 Q20 33 33 24 M12 32 Q22 24 30 33" stroke="#D7CCEF" stroke-width="2" fill="none"/>`; break;
    case 'cheese': b = `<path d="M6 30 L34 30 L34 16 L10 10 Z" fill="#FFD54A"/><path d="M6 30 L10 10 L34 16" fill="#FFE27A"/><circle cx="16" cy="22" r="2.5" fill="#F2B92E"/><circle cx="26" cy="25" r="2" fill="#F2B92E"/>`; break;
    case 'fur': b = `<path d="M8 28 Q4 14 16 10 Q22 4 28 10 Q38 14 32 28 Q20 34 8 28Z" fill="#E9E5F2"/><path d="M14 18 q3 -3 6 0 M22 22 q3 -3 6 0" stroke="#C9C3DD" stroke-width="2" fill="none"/>`; break;
    case 'manure': b = `<path d="M8 12 h24 l-2 22 h-20z" fill="#C9925A"/><path d="M8 12 Q20 6 32 12" fill="#E3B37A"/><path d="M14 20 h12" stroke="#8B5A3C" stroke-width="2"/><path d="M16 26 l4 -4 l4 4" stroke="#3FAE5A" stroke-width="2.4" fill="none"/>`; break;
    case 'horseshoe': b = `<path d="M10 8 Q8 32 20 34 Q32 32 30 8" stroke="#B9B4CC" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="12" cy="18" r="1.4" fill="#4B4870"/><circle cx="28" cy="18" r="1.4" fill="#4B4870"/><circle cx="14" cy="27" r="1.4" fill="#4B4870"/><circle cx="26" cy="27" r="1.4" fill="#4B4870"/>`; break;
    case 'fish': b = `<path d="M6 20 Q18 8 30 20 Q18 32 6 20Z" fill="#6CC8F4"/><path d="M29 20 L38 13 L37 27Z" fill="#4FB2E8"/><circle cx="12" cy="18" r="1.8" fill="#1F1B24"/>`; break;
    case 'bigfish': b = `<path d="M3 20 Q18 4 32 20 Q18 36 3 20Z" fill="#5B8DEF"/><path d="M31 20 L39 11 L39 29Z" fill="#3F6FD6"/><path d="M8 22 Q18 30 28 22" fill="#DCE8FF"/><circle cx="9" cy="18" r="1.8" fill="#1F1B24"/>`; break;
  }
  return svgURL(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">${b}</svg>`);
}
