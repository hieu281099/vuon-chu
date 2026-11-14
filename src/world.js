/* ===================== WORLD: maps and blocking ===================== */
function newMap(id, en, vi, w, h) {
  return {id, en, vi, w, h, ter: new Array(w * h).fill('g'), block: new Uint8Array(w * h), objs: [], exits: [], spawn: [2, 2], plots: [], pen: null, water: false};
}
const T_ = (m, x, y) => (x < 0 || y < 0 || x >= m.w || y >= m.h) ? null : m.ter[y * m.w + x];
function fill(m, t, x, y, w, h) { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (i >= 0 && j >= 0 && i < m.w && j < m.h) m.ter[j * m.w + i] = t; }
function blockRect(m, x, y, w, h, v = 1) { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (i >= 0 && j >= 0 && i < m.w && j < m.h) m.block[j * m.w + i] = v; }
function tree(m, x, y, kind = 'round') { m.objs.push({t: 'tree', x, y, kind}); blockRect(m, x, y, 1, 1); }
function border(m, gaps, kinds = ['round', 'pine']) {
  const gap = (x, y) => gaps.some(g => x >= g[0] && x < g[0] + g[2] && y >= g[1] && y < g[1] + g[3]);
  for (let x = 0; x < m.w; x += 2) { if (!gap(x, 0)) tree(m, x, 0, kinds[(x / 2) % kinds.length]); if (!gap(x, m.h - 1)) tree(m, x, m.h - 1, kinds[(x / 2 + 1) % kinds.length]); }
  for (let y = 2; y < m.h - 1; y += 2) { if (!gap(0, y)) tree(m, 0, y, kinds[(y / 2) % kinds.length]); if (!gap(m.w - 1, y)) tree(m, m.w - 1, y, kinds[(y / 2 + 1) % kinds.length]); }
  for (let x = 0; x < m.w; x++) { if (!gap(x, 0)) m.block[x] = 1; if (!gap(x, m.h - 1)) m.block[(m.h - 1) * m.w + x] = 1; }
  for (let y = 0; y < m.h; y++) { if (!gap(0, y)) m.block[y * m.w] = 1; if (!gap(m.w - 1, y)) m.block[y * m.w + m.w - 1] = 1; }
}
function house(m, style, x, y, tw, th, extra = {}) {
  const o = Object.assign({t: 'house', style, x, y, tw, th}, extra); m.objs.push(o);
  blockRect(m, x, y + Math.max(1, th - 2), tw, Math.min(2, th - 1));
  o.door = [x + Math.floor(tw / 2), y + th]; return o;
}
function prop(m, kind, x, y, solid = true) { const o = {t: 'prop', kind, x, y}; m.objs.push(o); if (solid) blockRect(m, x, y, 1, 1); return o; }
function fence(m, x, y, w, h, gate) {
  m.objs.push({t: 'fence', x, y, w, h, gate});
  for (let i = x; i < x + w; i++) { if (!(gate && i >= gate[0] && i < gate[0] + gate[1])) m.block[y * m.w + i] = 1; m.block[(y + h - 1) * m.w + i] = 1; }
  for (let j = y; j < y + h; j++) { m.block[j * m.w + x] = 1; m.block[j * m.w + x + w - 1] = 1; }
}

function buildMaps() {
  const M = {};
  /* ---------- FARM ---------- */
  const f = newMap('farm', 'Farm', 'Nông trại', 36, 27);
  border(f, [[35, 12, 1, 2]], ['round', 'pine', 'fruit']);
  fill(f, 'd', 6, 7, 2, 6); fill(f, 'd', 6, 12, 30, 2); fill(f, 'd', 20, 3, 2, 9);
  house(f, 'home', 4, 2, 5, 5, {sign: 'HOME', role: 'home'});
  prop(f, 'mailbox', 9, 6); prop(f, 'well', 2, 9);
  // tight 6 x 4 field (plots touch each other)
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) f.plots.push([13 + c, 4 + r]);
  for (const [x, y] of f.plots) f.block[y * f.w + x] = 1;
  prop(f, 'hay', 11, 5); prop(f, 'crate', 11, 7);
  prop(f, 'stall_farm', 23, 10); m_sign(f, 23, 9, 'FARM SHOP', 'farmshop'); prop(f, 'sacks', 19, 9, true);
  // big pen with barn and coop
  fence(f, 2, 15, 18, 11, [10, 2]);
  house(f, 'barn', 3, 15, 5, 4, {sign: 'BARN'});
  house(f, 'coop', 15, 15, 4, 3, {sign: 'COOP'});
  prop(f, 'hay', 9, 17); prop(f, 'hay', 13, 23); prop(f, 'crate', 3, 23);
  f.pen = {x0: 3 * TS + 10, y0: 19 * TS + 4, x1: 19 * TS - 10, y1: 25 * TS - 6};
  fill(f, 'w', 25, 17, 7, 5); blockRect(f, 25, 17, 7, 5); f.water = true;
  prop(f, 'reeds', 24, 17, false); prop(f, 'reeds', 32, 21, false); prop(f, 'rock', 24, 22);
  for (const [x, y, k] of [[26, 4, 'fruit'], [30, 6, 'round'], [28, 9, 'pine'], [24, 24, 'round'], [32, 3, 'fruit'], [11, 3, 'round']]) tree(f, x, y, k);
  prop(f, 'flowers', 3, 8, false); prop(f, 'flowers', 9, 9, false);
  f.exits.push({x: 35, y: 12, w: 1, h: 2, to: 'village', tx: 1, ty: 12});
  f.spawn = [10, 10];
  M.farm = f;

  /* ---------- VILLAGE ---------- */
  const v = newMap('village', 'Village', 'Làng', 36, 27);
  border(v, [[0, 12, 1, 2], [35, 12, 1, 2], [17, 0, 2, 1]]);
  fill(v, 'c', 10, 9, 16, 9);
  fill(v, 'd', 0, 12, 10, 2); fill(v, 'd', 26, 12, 10, 2); fill(v, 'd', 17, 0, 2, 9); fill(v, 'd', 17, 18, 2, 1);
  fill(v, 'd', 5, 7, 2, 5); fill(v, 'd', 27, 7, 2, 5); fill(v, 'd', 32, 14, 2, 6); fill(v, 'd', 26, 21, 2, 2);
  house(v, 'shop', 2, 2, 7, 5, {sign: 'CLOTHES SHOP', role: 'shop'});
  house(v, 'seeds', 25, 2, 6, 5, {sign: 'SEEDS', role: 'seeds'});
  prop(v, 'stall_a', 12, 7); prop(v, 'stall_b', 22, 7); m_sign(v, 17, 6, 'MARKET', 'market');
  house(v, 'school', 11, 19, 9, 5, {sign: 'SCHOOL', role: 'teacher'});
  house(v, 'forge', 30, 15, 5, 5, {sign: 'UPGRADE', role: 'forge'});
  house(v, 'post', 23, 18, 5, 4, {sign: 'POST'});
  prop(v, 'board', 12, 11); prop(v, 'well', 23, 14);
  for (const [x, y] of [[10, 9], [25, 9], [10, 17], [25, 17]]) prop(v, 'lamp', x, y);
  prop(v, 'bench', 14, 16); prop(v, 'bench', 21, 16); prop(v, 'crate', 15, 7); prop(v, 'sacks', 20, 7);
  for (const [x, y, k] of [[8, 16, 'round'], [5, 21, 'fruit'], [30, 24, 'pine'], [33, 9, 'round'], [3, 16, 'blossom']]) tree(v, x, y, k);
  prop(v, 'flowers', 9, 11, false); prop(v, 'flowers', 26, 11, false);
  v.exits.push({x: 0, y: 12, w: 1, h: 2, to: 'farm', tx: 34, ty: 12});
  v.exits.push({x: 35, y: 12, w: 1, h: 2, to: 'river', tx: 1, ty: 9});
  v.exits.push({x: 17, y: 0, w: 2, h: 1, to: 'park', tx: 15, ty: 21});
  v.spawn = [3, 12];
  M.village = v;

  /* ---------- PARK ---------- */
  const p = newMap('park', 'Park', 'Công viên', 32, 24);
  border(p, [[15, 23, 2, 1]], ['blossom', 'round', 'pine']);
  fill(p, 'd', 15, 13, 2, 11); fill(p, 'd', 4, 10, 24, 2); fill(p, 'c', 11, 6, 10, 8);
  prop(p, 'fountain', 16, 10); blockRect(p, 14, 8, 4, 3);
  for (const [x, y] of [[11, 6], [20, 6], [11, 13], [20, 13]]) prop(p, 'lamp', x, y);
  for (const [x, y] of [[8, 9], [23, 9], [8, 12], [23, 12]]) prop(p, 'bench', x, y);
  for (const [x, y] of [[4, 4], [27, 4], [5, 17], [26, 18], [9, 20], [22, 20], [13, 3], [19, 3]]) tree(p, x, y, (x + y) % 3 ? 'blossom' : 'round');
  for (const [x, y] of [[6, 7], [25, 7], [7, 15], [24, 15], [3, 12], [28, 12]]) prop(p, 'flowers', x, y, false);
  prop(p, 'board', 18, 15);
  p.exits.push({x: 15, y: 23, w: 2, h: 1, to: 'village', tx: 17, ty: 2});
  p.spawn = [15, 21];
  M.park = p;

  /* ---------- RIVER ---------- */
  const r = newMap('river', 'River', 'Bờ sông', 34, 24);
  border(r, [[0, 9, 1, 2]], ['palm', 'round']);
  fill(r, 's', 1, 11, 32, 3);
  fill(r, 'w', 0, 13, 34, 11); blockRect(r, 0, 13, 34, 11); r.water = true;
  fill(r, 'd', 0, 9, 15, 2); fill(r, 'd', 14, 9, 2, 3);
  for (let y = 13; y < 21; y++) for (let x = 14; x < 16; x++) { r.ter[y * r.w + x] = 'D'; r.block[y * r.w + x] = 0; }
  prop(r, 'boat', 19, 16, false); prop(r, 'boat', 9, 18, false);
  house(r, 'house2', 22, 4, 5, 5, {sign: 'FISH SHOP'});
  for (const [x, y, k] of [[4, 4, 'palm'], [8, 6, 'round'], [29, 4, 'palm'], [31, 8, 'palm'], [12, 3, 'round'], [18, 4, 'palm']]) tree(r, x, y, k);
  prop(r, 'reeds', 3, 12, false); prop(r, 'reeds', 26, 12, false); prop(r, 'reeds', 30, 12, false); prop(r, 'rock', 7, 12);
  r.exits.push({x: 0, y: 9, w: 1, h: 2, to: 'village', tx: 34, ty: 12});
  r.spawn = [2, 9];
  M.river = r;
  return M;
}
function m_sign(m, x, y, sign, role) { m.objs.push({t: 'sign', x, y, sign, role, door: [x, y + 1]}); }
