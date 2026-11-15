/* ===================== MINIMAP: where you are and where the NPCs are; tap to open a larger map with a list ===================== */
const MM_TER = {g: '#8FD16A', d: '#EBD3A0', c: '#F3E7D2', w: '#5AB7F0', s: '#F3E2A8', D: '#B98A5C'};
const ROLE_VI = {shop: 'Quần áo', market: 'Chợ', seeds: 'Hạt giống', forge: 'Lò rèn', teacher: 'Trường học', ielts: 'IELTS', salon: 'Tiệm tóc', spa: 'Spa', chat: 'Trò chuyện', home: 'Nhà', lottery: 'Vé số', bait: 'Mồi câu', post: 'Bưu điện'};
const ROLE_COL = {shop: '#FF6FB5', market: '#FF8A3D', seeds: '#3DBE6C', forge: '#9B5CFF', teacher: '#4D8BFF', ielts: '#FFB020', salon: '#E25BD8', spa: '#2DD4BF', chat: '#8E8AA8', lottery: '#FF3552', bait: '#36A8AE', post: '#F29A1F'};
const MM_CACHE = {};
let MM_OPEN = false; try { MM_OPEN = localStorage.getItem('vc-mm') === '1'; } catch (e) {}
// static layer of a map (terrain, buildings, trees, exits), drawn once per map at `k` px per tile
function mmBase(m, k) {
  const key = m.id + '|' + k; if (MM_CACHE[key]) return MM_CACHE[key];
  const c = document.createElement('canvas'); c.width = m.w * k; c.height = m.h * k; const g = c.getContext('2d');
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) { g.fillStyle = MM_TER[m.ter[y * m.w + x]] || MM_TER.g; g.fillRect(x * k, y * k, k + 0.5, k + 0.5); }
  for (const o of m.objs) {
    if (o.t === 'tree') { g.fillStyle = '#3E8E4A'; g.beginPath(); g.arc((o.x + 0.5) * k, (o.y + 0.5) * k, k * 0.55, 0, Math.PI * 2); g.fill(); }
    if (o.t === 'house') { const st = BSTYLE[o.style] || {}; g.fillStyle = st.roof || '#C77DFF'; g.fillRect(o.x * k, o.y * k, o.tw * k, o.th * k); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(o.x * k, o.y * k, o.tw * k, o.th * k * 0.3); }
    if (o.t === 'fence') { g.strokeStyle = '#FFFFFF'; g.lineWidth = Math.max(1, k * 0.25); g.strokeRect(o.x * k + k / 2, o.y * k + k / 2, (o.w - 1) * k, (o.h - 1) * k); }
  }
  for (const p of m.plots || []) { g.fillStyle = '#9A6A44'; g.fillRect(p[0] * k, p[1] * k, k, k); }
  for (const e of m.exits) { g.fillStyle = '#FFE48A'; g.fillRect(e.x * k, e.y * k, Math.max(1, e.w) * k, Math.max(1, e.h) * k); }
  return (MM_CACHE[key] = c);
}
function mmDraw(cv, k, big) {
  const m = MAPS && S && MAPS[S.map]; if (!m || !cv || !P) return;
  const base = mmBase(m, k), dpr = Math.min(2, window.devicePixelRatio || 1);
  if (cv.width !== base.width * dpr) { cv.width = base.width * dpr; cv.height = base.height * dpr; cv.style.aspectRatio = `${base.width} / ${base.height}`; }
  const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.drawImage(base, 0, 0);
  const at = (px, py) => [px / TS * k, py / TS * k];
  // shops and other buildings get a role colour dot on their door
  for (const o of m.objs) if (o.t === 'house' && o.role && ROLE_COL[o.role]) { const [x, y] = [(o.door[0] + 0.5) * k, (o.door[1] - 0.2) * k]; g.fillStyle = ROLE_COL[o.role]; g.beginPath(); g.arc(x, y, Math.max(2, k * 0.35), 0, Math.PI * 2); g.fill(); }
  for (const n of NPCS) { const [x, y] = at(n.x, n.y), r = Math.max(2.6, k * (big ? 0.6 : 0.55));
    g.fillStyle = ROLE_COL[n.def.role] || '#8E8AA8'; g.strokeStyle = '#FFFFFF'; g.lineWidth = big ? 2 : 1.2; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); g.stroke();
    if (big) { g.font = `800 ${Math.round(k * 1.1)}px Nunito, sans-serif`; g.textAlign = 'center'; g.lineWidth = 3; g.strokeStyle = 'rgba(30,27,58,.85)'; g.strokeText(n.def.name, x, y - r - 4); g.fillStyle = '#FFFFFF'; g.fillText(n.def.name, x, y - r - 4); } }
  for (const o of Object.values(MP.others)) { const [x, y] = at(o.x, o.y), r = Math.max(2.8, k * 0.6); g.fillStyle = '#3B82F6'; g.strokeStyle = '#FFFFFF'; g.lineWidth = big ? 2 : 1.2; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); g.stroke();
    if (big) { g.font = `800 ${Math.round(k * 1.1)}px Nunito, sans-serif`; g.textAlign = 'center'; g.lineWidth = 3; g.strokeStyle = 'rgba(30,27,58,.85)'; g.strokeText(o.name, x, y - r - 4); g.fillStyle = '#BFDBFE'; g.fillText(o.name, x, y - r - 4); } }
  const [px, py] = at(P.x, P.y), pulse = 1 + 0.25 * Math.sin(performance.now() / 220), pr = Math.max(3.2, k * 0.7) * pulse;
  g.fillStyle = 'rgba(255,111,181,.35)'; g.beginPath(); g.arc(px, py, pr * 1.9, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#FF3D8E'; g.strokeStyle = '#FFFFFF'; g.lineWidth = big ? 2.5 : 1.6; g.beginPath(); g.arc(px, py, pr, 0, Math.PI * 2); g.fill(); g.stroke();
  if (big) { g.font = `900 ${Math.round(k * 1.15)}px Nunito, sans-serif`; g.textAlign = 'center'; g.lineWidth = 3; g.strokeStyle = 'rgba(30,27,58,.85)'; g.strokeText('Bạn', px, py - pr - 5); g.fillStyle = '#FFE48A'; g.fillText('Bạn', px, py - pr - 5); }
}
function mmTick() {
  const cv = $('#minimap'); if (!cv || !S || !MAPS) return;
  const m = MAPS[S.map], wrap = $('#mmwrap'); if (!m || !wrap) return;
  $('#mapbtns').hidden = $('#app').hidden; wrap.hidden = !MM_OPEN; $('#mmbtn').classList.toggle('on', MM_OPEN); $('#toolbtn').hidden = S.map !== 'farm'; { const n = Object.keys(MP.others).length; $('#mmname').textContent = m.vi + (MP_MAPS.includes(S.map) && mpOn() ? ` · ${n + 1} người` : ''); }
  if (MM_OPEN) mmDraw(cv, window.innerWidth < 600 ? 3 : 4, false);
  const bigCv = $('#mmbig'); if (bigCv) mmDraw(bigCv, Math.max(8, Math.floor(Math.min(window.innerWidth - 60, 720) / m.w)), true);
}
setInterval(mmTick, 200);
function openMinimap() {
  const m = MAPS[S.map];
  const list = NPCS.map(n => `<button class="row-item" data-act="mm-go" data-id="${n.def.id}"><span class="mmdot" style="background:${ROLE_COL[n.def.role] || '#8E8AA8'}"></span><span class="ri-main"><b>${esc(n.def.name)}</b><small>${esc(ROLE_VI[n.def.role] || 'Trò chuyện')}</small></span><span class="ri-side">Đi tới</span></button>`).join('');
  const places = m.objs.filter(o => o.t === 'house' && o.sign).map(o => `<span class="chip">${esc(o.sign)}</span>`).join('');
  openModal(`<h2 class="ptitle">Bản đồ ${esc(m.vi)}</h2><p class="psub">Chấm hồng là bạn, chấm màu là người trong làng. Ô vàng là lối sang khu khác.</p>
    <div class="mmbigwrap"><canvas id="mmbig"></canvas></div>${places ? `<div class="chips">${places}</div>` : ''}
    ${Object.keys(MP.others).length ? `<h3 class="ph3">Người chơi đang ở đây</h3><div class="list">${Object.values(MP.others).map(o => `<button class="row-item" data-act="mp-card" data-id="${o.uid}"><span class="mmdot" style="background:#3B82F6"></span><span class="ri-main"><b>${esc(o.name)}</b><small>Trình độ ${esc(o.cefr)}</small></span><span class="ri-side">Xem</span></button>`).join('')}</div>` : (MP_MAPS.includes(S.map) ? (mpOn() ? '<p class="note">Chưa có người chơi nào khác ở khu này.</p>' : '<p class="note">Đăng nhập tài khoản Vườn Chữ để gặp người chơi khác ở Làng, Công viên, Bờ sông.</p>') : '')}<h3 class="ph3">Mọi người ở khu này</h3>${list ? `<div class="list">${list}</div>` : '<p class="empty">Khu này không có ai.</p>'}
    <div class="row-btns"><button class="btn ghost" data-act="map">Chuyển khu</button></div>`, {label: 'Bản đồ khu vực', wide: true});
  mmTick();
}
function mmGo(id) {
  const n = NPCS.find(q => q.def.id === id); if (!n) return; closeModal();
  const [tx, ty] = tileOf(n.x, n.y); approach(tx, ty, 1.6, () => talk(n), true);
}
