/* ===================== RENDER & LOOP ===================== */
const CROP_STAGE = p => p < 0.02 ? 0 : p < 0.33 ? 1 : p < 1 ? 2 : 3;
const nextLocked = () => S.plots.findIndex(q => !q.u);
function drawPlot(g, i, now, tnow) {
  const [tx, ty] = MAPS.farm.plots[i], X = tx * TS, Y = ty * TS, p = S.plots[i], st = plotState(p, now);
  if (st === 'L') {
    if (nextLocked() !== i) return;
    g.save(); g.setLineDash([4, 4]); g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 2; g.beginPath(); if (g.roundRect) g.roundRect(X + 3, Y + 3, TS - 6, TS - 6, 7); else g.rect(X + 3, Y + 3, TS - 6, TS - 6); g.stroke(); g.restore();
    g.fillStyle = 'rgba(255,255,255,.9)'; g.fillRect(X + 14, Y + 9, 4, 14); g.fillRect(X + 9, Y + 14, 14, 4); return;
  }
  const n = (dx, dy) => { const j = MAPS.farm.plots.findIndex(q => q[0] === tx + dx && q[1] === ty + dy); return j >= 0 && S.plots[j].u; };
  const r = [!n(-1, 0) && !n(0, -1) ? 7 : 0, !n(1, 0) && !n(0, -1) ? 7 : 0, !n(1, 0) && !n(0, 1) ? 7 : 0, !n(-1, 0) && !n(0, 1) ? 7 : 0];
  g.fillStyle = '#86593A'; g.beginPath(); if (g.roundRect) g.roundRect(X - 1, Y - 1, TS + 2, TS + 3, r); else g.rect(X - 1, Y - 1, TS + 2, TS + 3); g.fill();
  g.fillStyle = st === 'G' ? PAL.soilWet : PAL.soil; g.beginPath(); if (g.roundRect) g.roundRect(X, Y, TS, TS, r); else g.rect(X, Y, TS, TS); g.fill();
  g.strokeStyle = st === 'G' ? '#7B4F34' : PAL.soilLine; g.lineWidth = 2; g.lineCap = 'round';
  for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(X + 5, Y + 8 + k * 9); g.lineTo(X + TS - 5, Y + 8 + k * 9); g.stroke(); }
  if (st === 'G') { g.fillStyle = 'rgba(120,200,255,.25)'; g.fillRect(X + 2, Y + 2, TS - 4, TS - 4); }
  if (p.c) drawCrop(g, p.c, CROP_STAGE(p.p), X, Y, tnow);
  if (st === 'W') { g.fillStyle = '#5E8A2E'; for (const [a, b] of [[6, 22], [24, 20], [15, 28]]) { g.beginPath(); g.moveTo(X + a - 4, Y + b + 4); g.lineTo(X + a - 1, Y + b - 8); g.lineTo(X + a + 1, Y + b + 4); g.lineTo(X + a + 4, Y + b - 6); g.lineTo(X + a + 5, Y + b + 4); g.fill(); } }
}
function drawFence(g, o) {
  const post = (x, y) => { g.fillStyle = '#EADFCB'; g.beginPath(); if (g.roundRect) g.roundRect(x - 3, y - 16, 6, 18, 3); else g.rect(x - 3, y - 16, 6, 18); g.fill(); g.fillStyle = '#FFF8EE'; g.fillRect(x - 3, y - 16, 3, 16); };
  const rail = (x1, y1, x2, y2) => { g.strokeStyle = '#FFF8EE'; g.lineWidth = 3; g.beginPath(); g.moveTo(x1, y1 - 11); g.lineTo(x2, y2 - 11); g.moveTo(x1, y1 - 5); g.lineTo(x2, y2 - 5); g.stroke(); };
  return {post, rail};
}
function fenceEnts(o, ents) {
  const F = drawFence(ctx, o), x0 = o.x * TS + 16, x1 = (o.x + o.w - 1) * TS + 16, yt = o.y * TS + 26, yb = (o.y + o.h - 1) * TS + 26;
  const gate = o.gate ? [o.gate[0] * TS, (o.gate[0] + o.gate[1]) * TS] : null;
  ents.push({y: yt, d: () => { ctx.save(); if (gate) { F.rail(x0, yt, gate[0], yt); F.rail(gate[1], yt, x1, yt); } else F.rail(x0, yt, x1, yt); for (let i = 0; i < o.w; i++) { const x = (o.x + i) * TS + 16; if (!gate || x < gate[0] || x > gate[1]) F.post(x, yt); } ctx.restore(); }});
  ents.push({y: yb, d: () => { F.rail(x0, yb, x1, yb); for (let i = 0; i < o.w; i++) F.post((o.x + i) * TS + 16, yb); }});
  for (let j = 1; j < o.h - 1; j++) { const y = (o.y + j) * TS + 26; ents.push({y, d: () => { F.rail(x0, y - TS, x0, y); F.rail(x1, y - TS, x1, y); F.post(x0, y); F.post(x1, y); }}); }
}
function drawAnimal(g, a, tnow, pxs) {
  const f = a.tx ? Math.floor(a.phase) % 2 * 2 : (Math.floor(tnow / 700 + a.x) % 2);
  drawSprite(g, 'ani-' + a.t + f, () => animalDef(a.t, f), a.x, a.y, pxs, a.dir === 'l');
}

/* ---------- camera / sizing ---------- */
function resize() {
  const st = $('#stage'), w = st.clientWidth || 800, h = st.clientHeight || 500;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const s = Math.round(clamp(Math.min(w / (13 * TS), h / (8.5 * TS)), 1.5, 3) * 2) / 2;
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  view = Object.assign(view, {cssW: w, cssH: h, s, dpr});
}
let lastFrame = performance.now(), bubbleClock = 4;
function frame(tnow) {
  const dt = Math.min(0.05, (tnow - lastFrame) / 1000); lastFrame = tnow;
  if (S && P) { update(dt, tnow); draw(tnow); }
  requestAnimationFrame(frame);
}
function update(dt, tnow) {
  const m = MAPNOW();
  if (P.path.length && !modalOpen()) {
    const t = P.path[0], dx = t.x - P.x, dy = t.y - P.y, d = Math.hypot(dx, dy), step = 110 * dt;
    if (d > 0.01) P.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'r' : 'l') : (dy > 0 ? 'd' : 'u');
    if (d <= step) { P.x = t.x; P.y = t.y; P.path.shift(); if (!P.path.length) { P.moving = false; arrive(); } } else { P.x += dx / d * step; P.y += dy / d * step; }
    P.moving = P.path.length > 0; P.phase += dt * 11;
  } else P.moving = false;
  if (P.act && P.act.kind === 'fish' && !P.act.bit && tnow >= P.act.biteAt && !modalOpen()) { P.act.bit = true; onBite(); }
  if (P.act && P.act.kind !== 'fish' && P.act.t0 && tnow - P.act.t0 > P.act.dur) P.act = null;
  for (const n of NPCS) {
    if (n.talking) continue;
    if (n.path.length) {
      const t = n.path[0], dx = t.x - n.x, dy = t.y - n.y, d = Math.hypot(dx, dy), step = 40 * dt;
      if (d > 0.01) n.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'r' : 'l') : (dy > 0 ? 'd' : 'u');
      if (d <= step) { n.x = t.x; n.y = t.y; n.path.shift(); } else { n.x += dx / d * step; n.y += dy / d * step; }
      n.phase += dt * 9;
    } else if (n.def.wander) {
      n.wait -= dt;
      if (n.wait <= 0) { n.wait = 2 + Math.random() * 4; const [sx, sy] = tileOf(n.x, n.y), {dist, prev} = bfs(m, sx, sy), opts = [];
        for (let i = 0; i < dist.length; i++) if (dist[i] > 0 && dist[i] <= 4 && Math.hypot(i % m.w - n.def.home[0], ((i / m.w) | 0) - n.def.home[1]) <= 3) opts.push(i);
        if (opts.length) n.path = pathTo(m, prev, rand(opts)); }
    }
    if (n.bubble && tnow - n.bubble.t > 2800) n.bubble = null;
  }
  bubbleClock -= dt;
  if (bubbleClock <= 0 && NPCS.length) { bubbleClock = 5 + Math.random() * 5; const n = rand(NPCS); if (!n.talking) n.bubble = {text: rand(n.def.greet), t: tnow}; }
  if (S.map === 'farm') { const pen = m.pen; for (const a of ANIMS) { if (!a) continue;
    if (a.tx) { const dx = a.tx - a.x, dy = a.ty - a.y, d = Math.hypot(dx, dy), step = 14 * dt; if (d <= step) { a.tx = 0; a.wait = 2 + Math.random() * 4; } else { a.x += dx / d * step; a.y += dy / d * step; a.dir = dx < 0 ? 'l' : 'r'; a.phase += dt * 6; } }
    else { a.wait -= dt; if (a.wait <= 0) { a.tx = pen.x0 + Math.random() * (pen.x1 - pen.x0); a.ty = pen.y0 + Math.random() * (pen.y1 - pen.y0); } } } }
  FX = FX.filter(f => tnow - f.t0 < 1300);
}
function draw(tnow) {
  const m = MAPNOW(), {cssW, cssH, s, dpr} = view, now = Date.now(), pxs = s * dpr;
  const vw = cssW / s, vh = cssH / s;
  view.camX = clamp(P.x - vw / 2, 0, Math.max(0, m.w * TS - vw));
  view.camY = clamp(P.y - 20 - vh / 2, 0, Math.max(0, m.h * TS - vh));
  if (m.w * TS < vw) view.camX = (m.w * TS - vw) / 2;
  if (m.h * TS < vh) view.camY = (m.h * TS - vh) / 2;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#5FB34A'; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.setTransform(pxs, 0, 0, pxs, -view.camX * pxs, -view.camY * pxs); ctx.imageSmoothingEnabled = true;
  const res = Math.min(2.5, pxs), tk = m.id + '|' + res;
  if (!TERRAIN[tk]) { for (const k in TERRAIN) if (k.startsWith(m.id + '|')) delete TERRAIN[k]; TERRAIN[tk] = paintTerrain(m, res); }
  ctx.drawImage(TERRAIN[tk], 0, 0, m.w * TS, m.h * TS);
  if (m.water) { ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round'; for (let i = 0; i < 26; i++) { const W = m.w * TS, wx = ((hash2(i, 3) % W) + tnow / 40 * (i % 2 ? 1 : -1)) % W, x = wx < 0 ? wx + W : wx, wy = hash2(i, 7) % (m.h * TS), [tx, ty] = tileOf(x, wy); if (T_(m, tx, ty) === 'w' && T_(m, tx + 1, ty) === 'w') { ctx.beginPath(); ctx.moveTo(x, wy); ctx.quadraticCurveTo(x + 4, wy - 2, x + 8, wy); ctx.stroke(); } } }
  const ents = [];
  for (const o of m.objs) {
    if (o.t === 'tree') ents.push({y: o.y * TS + 28, d: () => drawSprite(ctx, 'tree-' + o.kind, () => treeDef(o.kind), o.x * TS + 16, o.y * TS + 30, pxs)});
    else if (o.t === 'house') ents.push({y: (o.y + o.th) * TS - 2, d: () => drawSprite(ctx, `house-${o.style}-${o.tw}x${o.th}`, () => houseDef(o.style, o.tw, o.th), o.x * TS, (o.y + o.th) * TS, pxs)});
    else if (o.t === 'fence') fenceEnts(o, ents);
    else if (o.t === 'prop') {
      if (o.kind === 'stall_farm') ents.push({y: o.y * TS + 26, d: () => drawSprite(ctx, o.kind, () => stallDef('#FFC83D', '#3FAE5A'), o.x * TS + 16, o.y * TS + 30, pxs)});
      if (o.kind === 'stall_a' || o.kind === 'stall_b') ents.push({y: o.y * TS + 26, d: () => drawSprite(ctx, o.kind, () => o.kind === 'stall_a' ? stallDef('#FF5A4E', '#9B6CFF') : stallDef('#3FAE5A', '#FF8A2A'), o.x * TS + 16, o.y * TS + 30, pxs)});
      else if (PROPS[o.kind]) ents.push({y: o.y * TS + 24, d: () => drawSprite(ctx, 'prop-' + o.kind, PROPS[o.kind], o.x * TS + 16, o.y * TS + 28, pxs)});
    }
  }
  if (m.id === 'farm') {
    m.plots.forEach((pp, i) => ents.push({y: pp[1] * TS + 2, d: () => drawPlot(ctx, i, now, tnow)}));
    ANIMS.forEach(a => { if (a) ents.push({y: a.y, d: () => drawAnimal(ctx, a, tnow, pxs)}); });
  }
  for (const n of NPCS) {
    const moving = n.path.length && !n.talking;
    if (n.look.pet) { n.pet = n.pet || {x: n.x - 20, y: n.y}; n.pet.x += (n.x - 22 - n.pet.x) * 0.08; n.pet.y += (n.y + 2 - n.pet.y) * 0.08; ents.push({y: n.pet.y, d: () => drawPet(n.look.pet, 0, n.pet.x, n.pet.y, tnow, moving)}); }
    ents.push({y: n.y, d: () => { shadow(n.x, n.y); drawChibi(ctx, n.look, chibiFrame(moving, n.phase, tnow, null, 0, n.def.id), n.dir, n.x, n.y, pxs, 'npc-' + n.def.id); }});
  }
  const L = fullLook(S.look);
  if (L.pet) { const tx = P.x + (P.dir === 'l' ? 24 : -24), ty = P.y + 2; P.pet = P.pet || {x: tx, y: ty}; P.pet.x += (tx - P.pet.x) * 0.07; P.pet.y += (ty - P.pet.y) * 0.07; ents.push({y: P.pet.y, d: () => drawPet(L.pet, (L.lv || {})[L.pet] || 0, P.pet.x, P.pet.y, tnow, P.moving)}); }
  ents.push({y: P.y + 0.1, d: () => {
    if (L.aura) drawAura(ctx, L.aura, (L.lv || {})[L.aura] || 0, P.x, P.y, tnow);
    shadow(P.x, P.y);
    drawChibi(ctx, L, chibiFrame(P.moving, P.phase, tnow, P.act, P.emote, 'me'), P.dir, P.x, P.y, pxs, 'me');
    const a = P.act;
    if (a && a.kind === 'fish') { const dip = a.bit ? Math.sin(tnow / 60) * 2 + 2 : Math.sin(tnow / 400); const hx = P.x + (P.dir === 'l' ? -24 : 24), hy = P.y - 52; ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo((hx + a.bx) / 2, Math.max(hy, a.by) + 6, a.bx, a.by); ctx.stroke(); ctx.fillStyle = '#ff4757'; ctx.beginPath(); ctx.arc(a.bx, a.by + dip - 2, 2.6, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(a.bx, a.by + dip - 4.5, 1.7, 0, Math.PI * 2); ctx.fill(); }
    if (Object.values(L.lv || {}).some(v => v >= 6)) { ctx.fillStyle = `hsl(${(tnow / 6) % 360} 95% 70%)`; for (let i = 0; i < 4; i++) { const ang = tnow / 700 + i * 1.57; ctx.beginPath(); ctx.arc(P.x + Math.cos(ang) * 20, P.y - 30 + Math.sin(ang * 1.3) * 18, 1.4, 0, Math.PI * 2); ctx.fill(); } }
  }});
  ents.sort((p1, p2) => p1.y - p2.y).forEach(e => e.d());

  /* ---- screen-space overlays ---- */
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const sx = x => (x - view.camX) * s, sy = y => (y - view.camY) * s;
  for (const o of m.objs) {
    if (o.t === 'house' && o.sign) signPill(sx((o.x + o.tw / 2) * TS), sy((o.y + o.th) * TS - Math.round(o.th * 32 * 0.56) - 4), o.sign, o.role);
    if (o.t === 'sign') signPill(sx(o.x * TS + 16), sy(o.y * TS + 10), o.sign, o.role);
    if (o.t === 'prop' && o.kind === 'board') signPill(sx(o.x * TS + 16), sy(o.y * TS - 26), m.id === 'park' ? 'IELTS CHALLENGE' : 'RANKING', 'board');
  }
  for (const e of m.exits) { const name = MAPS[e.to].en.toUpperCase(), label = e.x === 0 ? `← ${name}` : e.x >= m.w - 1 ? `${name} →` : e.y === 0 ? `↑ ${name}` : `↓ ${name}`; signPill(sx(clamp(e.x * TS + 16 * e.w, 70, m.w * TS - 70)), sy(clamp(e.y * TS + (e.y === 0 ? 46 : -8), 30, m.h * TS - 30)), label, 'exit'); }
  if (m.id === 'farm') m.plots.forEach((pp, i) => { const b = plotBadge(i, now); if (!b) return; badge(sx(pp[0] * TS + 16), sy(pp[1] * TS - 14) + Math.sin(tnow / 300 + i) * 2, b); });
  if (m.id === 'farm') ANIMS.forEach((a, i) => { const st = S.animals[i]; if (!a || !st) return; const y = sy(a.y - ANI_SIZE[a.t][1]) + Math.sin(tnow / 300 + i) * 2; if (st.st === 'ready') badge(sx(a.x), y, 'gift'); else if (st.st === 'hungry') bubble(sx(a.x), y + 8, 'Hungry!'); else { const k = clamp(1 - (st.r - now) / (ANIMAL[a.t].time * 1000), 0, 1); progress(sx(a.x), sy(a.y) + 8, k); } });
  for (const n of NPCS) { nameTag(sx(n.x), sy(n.y - 68), n.def.name, '#10b981'); if (n.bubble) bubble(sx(n.x), sy(n.y - 78), n.bubble.text); }
  nameTag(sx(P.x), sy(P.y - 68), S.name || 'Bạn', '#7c5cff');
  if (P.say && tnow - P.say.t < 4000) bubble(sx(P.x), sy(P.y - 78), P.say.text);
  if (P.act && P.act.kind === 'fish' && P.act.bit) bubble(sx(P.act.bx), sy(P.act.by - 6), '!');
  for (const f of FX) {
    const k2 = (tnow - f.t0) / 1300, x = sx(f.who ? P.x : f.x), y = sy(f.who ? P.y - 44 : f.y);
    ctx.globalAlpha = 1 - k2;
    if (f.kind === 'text') { ctx.font = `900 ${Math.round(8 * s)}px Nunito, system-ui`; ctx.textAlign = 'center'; ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(30,20,60,.75)'; ctx.strokeText(f.text, x, y - k2 * 26 * s); ctx.fillStyle = f.color; ctx.fillText(f.text, x, y - k2 * 26 * s); }
    if (f.kind === 'drops') { ctx.fillStyle = '#7fd0ff'; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.ellipse(x - 12 * s + i * 4 * s, y + ((k2 * 30 + i * 7) % 24) * s, 1.4 * s, 2.2 * s, 0, 0, Math.PI * 2); ctx.fill(); } }
    if (f.kind === 'spark') { for (let i = 0; i < 10; i++) { const a = i * 0.628 + k2 * 2; ctx.fillStyle = ['#ffd166', '#ff6fb5', '#7c5cff', '#10b981'][i % 4]; ctx.beginPath(); ctx.arc(x + Math.cos(a) * (10 + k2 * 26) * s, y - 8 * s + Math.sin(a) * (10 + k2 * 26) * s, 1.8 * s, 0, Math.PI * 2); ctx.fill(); } }
    ctx.globalAlpha = 1;
  }
  if (tapMark && tnow - tapMark.t < 500) { const k3 = (tnow - tapMark.t) / 500; ctx.strokeStyle = `rgba(255,255,255,${1 - k3})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(sx(tapMark.x), sy(tapMark.y), (6 + k3 * 6) * s, (3 + k3 * 3) * s, 0, 0, Math.PI * 2); ctx.stroke(); }
}
function plotBadge(i, now) {
  const p = S.plots[i], st = plotState(p, now);
  if (st === 'L') return null;
  return st === 'D' ? 'drop' : st === 'W' ? 'weed' : st === 'R' ? 'ripe' : null;
}
const SIGN_COL = {home: '#FF8A65', shop: '#FF7AB6', seeds: '#3FAE5A', teacher: '#5B8DEF', forge: '#9B6CFF', market: '#FF5A4E', board: '#FFB020', exit: 'rgba(30,27,58,.82)', ielts: '#FFB020'};
function roundRectPath(x, y, w, h, r) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }
function signPill(x, y, text, role) {
  ctx.font = `900 12px Nunito, system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(text).width + 18, h = 22;
  ctx.fillStyle = 'rgba(30,20,60,.18)'; roundRectPath(x - w / 2, y - h / 2 + 3, w, h, 11); ctx.fill();
  ctx.fillStyle = SIGN_COL[role] || '#7C5CFF'; roundRectPath(x - w / 2, y - h / 2, w, h, 11); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.fillText(text, x, y + 1);
}
function nameTag(x, y, text, bg) {
  ctx.font = `800 12px Nunito, system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(text).width + 14;
  ctx.fillStyle = bg; ctx.globalAlpha = 0.9; roundRectPath(x - w / 2, y - 9, w, 18, 9); ctx.fill(); ctx.globalAlpha = 1;
  ctx.fillStyle = '#fff'; ctx.fillText(text, x, y + 1);
}
function bubble(x, y, text) {
  ctx.font = `800 12.5px Nunito, system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = Math.min(240, ctx.measureText(text).width + 18), X = x - w / 2, Y = y - 26;
  ctx.fillStyle = 'rgba(30,20,60,.15)'; roundRectPath(X, Y + 2, w, 22, 11); ctx.fill();
  ctx.fillStyle = '#fff'; roundRectPath(X, Y, w, 22, 11); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 5, Y + 21); ctx.lineTo(x, Y + 27); ctx.lineTo(x + 5, Y + 21); ctx.fill();
  ctx.fillStyle = '#1e1b3a'; ctx.fillText(text, x, Y + 11.5, w - 12);
}
function progress(x, y, k) { ctx.fillStyle = 'rgba(30,20,60,.35)'; roundRectPath(x - 16, y, 32, 6, 3); ctx.fill(); ctx.fillStyle = '#4ade80'; roundRectPath(x - 16, y, 32 * k, 6, 3); ctx.fill(); }
function badge(x, y, kind) {
  const r = 11, bg = {drop: '#38bdf8', weed: '#f59e0b', ripe: '#ffb020', gift: '#ff6fb5'}[kind];
  ctx.fillStyle = 'rgba(30,20,60,.2)'; ctx.beginPath(); ctx.arc(x, y + 2, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(x, y, r - 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#fff';
  if (kind === 'drop') { ctx.beginPath(); ctx.moveTo(x, y - 5); ctx.quadraticCurveTo(x + 5, y + 1, x, y + 4); ctx.quadraticCurveTo(x - 5, y + 1, x, y - 5); ctx.fill(); }
  else if (kind === 'weed') { ctx.font = '900 13px Nunito, system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('!', x, y + 1); }
  else { ctx.beginPath(); for (let k = 0; k < 10; k++) { const a = k * Math.PI / 5 - Math.PI / 2, rr = k % 2 ? 2.4 : 5.5; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); }
}
function shadow(x, y) { ctx.fillStyle = 'rgba(30,40,20,.2)'; ctx.beginPath(); ctx.ellipse(x, y, 11, 3.6, 0, 0, Math.PI * 2); ctx.fill(); }
function chibiFrame(moving, phase, tnow, act, emote, id) {
  if (act && act.t0) {
    const k = tnow - act.t0;
    if (act.kind === 'water') return k % 400 < 200 ? 'water' : 'water2';
    if (act.kind === 'hoe') return k % 360 < 180 ? 'hoe' : 'hoe2';
    if (act.kind === 'harvest') return 'cheer';
  }
  if (act && act.kind === 'fish') return 'fish';
  if (emote && tnow - emote < 1400) return Math.floor((tnow - emote) / 350) % 2 ? 'wave' : 'cheer';
  if (moving) return 'walk' + (Math.floor(phase / 2.4) % 4);
  const seed = id === 'me' ? 0 : id.length * 397;
  if ((tnow + seed) % 3600 < 140) return 'blink';
  return (tnow + seed) % 1400 < 700 ? 'idle0' : 'idle1';
}
function drawPet(id, lv, x, y, tnow, moving) {
  const frame = moving ? Math.floor(tnow / 180) % 2 : Math.floor(tnow / 600) % 2;
  const im = petImage(id, lv, frame); if (!im) return;
  ctx.fillStyle = 'rgba(30,40,20,.18)'; ctx.beginPath(); ctx.ellipse(x, y, 8, 2.6, 0, 0, Math.PI * 2); ctx.fill();
  const float = id === 'pet_dragon' ? Math.sin(tnow / 300) * 3 - 6 : 0;
  ctx.drawImage(im, x - 13, y - 30 + float, 26, 31);
}
