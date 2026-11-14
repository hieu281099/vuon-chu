from pathlib import Path
R = Path(__file__).resolve().parent.parent / "src"
def sub(f, a, b, count=1):
    p = R / f; t = p.read_text(encoding="utf-8")
    assert t.count(a) == count, (f, t.count(a), a[:80]); p.write_text(t.replace(a, b), encoding="utf-8")

# 1. Cô Lan stands beside the school door, clear of the border trees
sub("game.js", "{id:'lan', name:'Cô Lan', map:'village', home:[16, 25],", "{id:'lan', name:'Cô Lan', map:'village', home:[18, 24],")

# 2. forge: full catalogue of upgradable items, owned ones marked, any item can be inspected tier by tier
G = "game.js"
t = (R / G).read_text(encoding="utf-8")
i = t.index("function forgeHTML() {"); j = t.index("\nfunction forgeGo() {")
NEW = r"""function forgeHTML() {
  if (FORGE && FORGE.ex) return exchangeHTML();
  const L = fullLook(S.look), own = id => S.owned.includes(id);
  const all = FASHION.filter(f => UPGRADABLE(f.slot) && (f.price > 0 || f.chest || own(f.id)));
  const slots = SLOTS.filter(([k]) => UPGRADABLE(k));
  if (!FORGE || !FASH[FORGE.id]) { const first = all.find(f => own(f.id)) || all[0]; FORGE = {id: first.id, tab: first.slot, quiz: null, res: null}; }
  if (!FORGE.tab) FORGE.tab = FASH[FORGE.id].slot;
  const list = all.filter(f => f.slot === FORGE.tab), mine = all.filter(f => own(f.id));
  const f = FASH[FORGE.id], have = own(f.id), lv = have ? ((S.look.lv || {})[f.id] || 0) : 0, nx = lv + 1, cost = UP_COST[nx];
  const look = (m, l) => { const x = Object.assign({}, L, slotPatch(m), {lv: Object.assign({}, L.lv, {[m.id]: l})}); if (FACE_SLOTS.includes(m.slot)) Object.assign(x, {back: null, hand: null}); return x; };
  const img = (m, l, cls) => m.slot === 'pet' ? `<img class="pv ${cls} pet" src="${svgURL(petSVG(m.id, l, 0))}" alt="">` : m.slot === 'aura' ? `<span class="pv ${cls} aura" style="--c:${l ? (TIER[l] === 'rainbow' ? '#FFB020' : TIER[l]) : m.col}"></span>` : `<img class="pv ${cls}" src="${portraitSVG(look(m, l), {full: ['back', 'hand', 'shoes', 'bag', 'neck'].includes(m.slot), hand: true})}" alt="">`;
  const card = m => { const o = own(m.id), l = (S.look.lv || {})[m.id] || 0;
    return `<button class="fcard r${m.rar || 0} ${o ? 'own' : ''} ${m.id === f.id ? 'sel' : ''}" data-act="forge-pick" data-id="${m.id}" aria-pressed="${m.id === f.id}">${img(m, o ? l : 0, 'sm')}<b>${esc(m.vi)}</b><span class="fstate">${o ? (l ? `<i class="tier t${l}">+${l}</i>` : 'Đã có') : 'Chưa có'}</span></button>`; };
  const bonus = (FORGE.quiz === true ? 15 : 0) + (FORGE.shoe ? 10 : 0), chance = cost ? Math.min(100, cost.ch + bonus) : 0, enough = cost && S.em >= cost.em && S.di >= cost.di;
  const howGet = f.chest ? 'Món này chỉ rơi ra từ <b>Rương may mắn</b>.' : `Mua ở cửa hàng của <b>Cô Mai</b> trong Làng (${priceTag(f)}${(f.lvl || 1) > S.lvl ? ', ' + needTag(f.lvl) : ''}).`;
  return `<div class="forge">
    <p class="note">Bạn có <b>${mine.length}/${all.length}</b> món nâng cấp được. Món <b class="ownmark">viền xanh, ghi “Đã có”</b> là của bạn, món mờ là chưa có. Bấm vào bất kỳ món nào để xem các cấp +1 đến +6.</p>
    <div class="seg">${slots.map(([k, l]) => { const n = all.filter(m => m.slot === k), o = n.filter(m => own(m.id)).length; return `<button class="segb" data-act="forge-tab" data-t="${k}" aria-pressed="${FORGE.tab === k}">${l} <small>${o}/${n.length}</small></button>`; }).join('')}</div>
    <div class="fgrid">${list.map(card).join('')}</div>
    <h3 class="ph3">${esc(f.vi)} <small>(${esc(f.en)}) · ${RARITY[f.rar || 0].vi}</small></h3>
    <div class="tierstrip">${[0, 1, 2, 3, 4, 5, 6].map(l => `<div class="tcell ${have && l === lv ? 'cur' : ''} ${have && l < lv ? 'done' : ''}"><span class="tier t${l}">${l ? '+' + l : 'Gốc'}</span>${img(f, l, 'sm')}<small>${l ? TIER_VI[l] : 'Thường'}</small></div>`).join('')}</div>
    ${!have ? `<div class="fb miss"><strong>Bạn chưa có món này.</strong> ${howGet}</div>` : `
    <div class="forge-stage"><div class="fs-item"><span class="tier t${lv}">${lv ? '+' + lv + ' ' + TIER_VI[lv] : 'Chưa nâng'}</span>${img(f, lv, 'big')}</div>
      ${nx <= 6 ? `<div class="fs-arrow" aria-hidden="true">→</div><div class="fs-item next"><span class="tier t${nx}">+${nx} ${TIER_VI[nx]}</span>${img(f, nx, 'big')}</div>` : ''}</div>
    ${nx <= 6 ? `<div class="forge-info"><span>Cần ${gemIcon('em')}<b>${cost.em}</b>${cost.di ? ` ${gemIcon('di')}<b>${cost.di}</b>` : ''}</span><span>Tỉ lệ thành công <b class="${chance >= 70 ? 'ok' : chance >= 45 ? 'mid' : 'low'}">${chance}%</b>${bonus ? ` (đã cộng ${bonus}%)` : ''}</span>${nx >= 4 ? '<span class="warn">Thất bại có thể tụt 1 cấp</span>' : ''}</div>
      <div class="row-btns">${FORGE.quiz === null ? `<button class="btn ghost" data-act="forge-quiz">Trả lời 1 câu khó để +15%</button>` : ''}${S.inv.horseshoe > 0 ? `<button class="btn ghost" data-act="forge-shoe" aria-pressed="${!!FORGE.shoe}">${FORGE.shoe ? 'Đã dùng' : 'Dùng'} móng ngựa may mắn (+10%) · còn ${S.inv.horseshoe}</button>` : ''}<button class="btn gold" data-act="forge-go" ${enough ? '' : 'disabled'}>Nâng lên +${nx}</button><button class="btn ghost sm" data-act="exchange">Đổi xu lấy ngọc</button></div>
      ${enough ? '' : `<p class="note">Chưa đủ ngọc. Ngọc lục bảo có được khi trả lời đúng 5 câu liên tiếp, lên trình độ, giao đơn, học bài. Kim cương có được khi thi đậu và khi câu được cá ngừ.</p>`}` : `<div class="fb good"><strong>Tối đa!</strong> Món này đã đạt +6 Cầu vồng.</div>`}`}
    ${FORGE.res ? `<div class="fb ${FORGE.res.ok ? 'good' : 'miss'}"><strong>${FORGE.res.ok ? 'Thành công!' : 'Thất bại'}</strong> ${FORGE.res.msg}</div>` : ''}
  </div>`;
}"""
t = t[:i] + NEW + t[j:]
(R / G).write_text(t, encoding="utf-8")
sub(G, "  const f = FASH[FORGE.id]; if (!f) return; S.look.lv = S.look.lv || {};", "  const f = FASH[FORGE.id]; if (!f || !S.owned.includes(f.id)) return; S.look.lv = S.look.lv || {};")

M = "main.js"
sub(M, "    case 'forge-pick': FORGE = {id: d.id, quiz: null, res: null}; return refreshNpc();", """    case 'forge-pick': FORGE = {id: d.id, tab: FASH[d.id].slot, quiz: null, res: null}; refreshNpc(); { const s = document.querySelector('#modal .tierstrip'); if (s) s.scrollIntoView({block: 'nearest', behavior: 'smooth'}); } return;
    case 'forge-tab': { const list = FASHION.filter(f => f.slot === d.t && UPGRADABLE(f.slot) && (f.price > 0 || f.chest || S.owned.includes(f.id))); const pick = list.find(f => S.owned.includes(f.id)) || list[0]; FORGE = {id: pick.id, tab: d.t, quiz: null, res: null}; return refreshNpc(); }""")

# 3. hints show for 5 seconds whenever they change, then fade out
sub(M, "  if (h !== hintKey) { hintKey = h; $('#hint').innerHTML = h; }", "  if (h !== hintKey) { hintKey = h; const el = $('#hint'); el.innerHTML = h; el.classList.remove('gone'); clearTimeout(hintTimer); hintTimer = setTimeout(() => el.classList.add('gone'), 5000); }")
sub(M, "function renderHint() {", "let hintTimer = 0;\nfunction renderHint() {")

(R / "style.css").write_text((R / "style.css").read_text(encoding="utf-8") + """
/* ---------- hints fade after 5 s ---------- */
.hint{transition:opacity .5s,transform .5s}
.hint.gone{opacity:0;pointer-events:none}
/* ---------- forge catalogue ---------- */
.fgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px;max-height:300px;overflow:auto;padding:2px}
.fcard{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;border:2px solid transparent;background:var(--surface-2);border-radius:16px;padding:6px 4px;cursor:pointer;opacity:.5;filter:grayscale(.6)}
.fcard.own{opacity:1;filter:none;border-color:var(--mint);background:#f0fdf8}
.fcard.sel{border-color:var(--violet);box-shadow:0 0 0 3px rgba(124,92,255,.25);opacity:1}
.fcard b{font-size:11.5px;line-height:1.2;text-align:center}
.fcard .fstate{font-size:10.5px;font-weight:800;color:var(--muted)}.fcard.own .fstate{color:#047857}
.fcard .tier{font-style:normal;font-size:10.5px;padding:0 6px}
.pv.sm{width:64px;height:64px;border-radius:12px}
.ownmark{color:#047857}
.segb small{font-weight:700;opacity:.7;font-size:11px}
.tierstrip{display:grid;grid-template-columns:repeat(7,minmax(70px,1fr));gap:6px;overflow-x:auto;padding:2px 0 6px}
.tcell{display:flex;flex-direction:column;align-items:center;gap:3px;background:var(--surface-2);border-radius:14px;padding:6px 2px;border:2px solid transparent}
.tcell small{font-size:10px;font-weight:800;color:var(--muted)}
.tcell.cur{border-color:var(--violet);background:#f3efff}.tcell.done{background:#f0fdf8}
.forge-info .warn{color:var(--bad);font-weight:800}
@media (max-width:600px){.fgrid{grid-template-columns:repeat(auto-fill,minmax(76px,1fr));max-height:240px}.pv.sm{width:54px;height:54px}.tierstrip{grid-template-columns:repeat(7,64px)}}
""", encoding="utf-8")
print("ok")
