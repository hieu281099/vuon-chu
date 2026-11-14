from pathlib import Path
R = Path(__file__).resolve().parent.parent / "src"
def sub(f, a, b):
    p = R / f; t = p.read_text(encoding="utf-8")
    assert t.count(a) == 1, (f, t.count(a), a[:70]); p.write_text(t.replace(a, b), encoding="utf-8")

G = "game.js"
sub(G, "...CROPS.filter(c => c.lvl === S.lvl).map(", "...CROPS.filter(c => c.lvl === S.lvl && !c.rare).map(")
sub(G, "giveGems(3, S.lvl % 5 === 0 ? 1 : 0, 'lên cấp ' + S.lvl); saveNow(true);", "giveGems(3, S.lvl % 5 === 0 ? 1 : 0, 'lên cấp ' + S.lvl); if (S.lvl % 5 === 0) giveKey(1, 'lên cấp ' + S.lvl); saveNow(true);")
sub(G, "const unlockedCrops = () => CROPS.filter(c => c.lvl <= S.lvl);", "const unlockedCrops = () => CROPS.filter(c => c.lvl <= S.lvl && !c.rare);")
sub(G, "<div class=\"list\">${CROPS.map(c => { const lock = c.lvl > S.lvl, price = c.cost * 5", "<div class=\"list\">${CROPS.filter(c => !c.rare).map(c => { const lock = c.lvl > S.lvl, price = c.cost * 5")
sub(G, "  const free = S.animals.findIndex(a => !a);\n  if (free < 0) return `<p class=\"note\">Chuồng đã đủ 9 con.</p>`;",
       "  const free = freeSlot();\n  if (free < 0) return `<p class=\"note\">Chuồng đã đầy (${barnCount()}/${barnCap()} con). Nâng cấp chuồng ở cửa hàng nông trại để nuôi thêm.</p><div class=\"row-btns\"><button class=\"btn\" data-act=\"farmshop\" data-t=\"barn\">Nâng cấp chuồng</button></div>`;")
sub(G, "if (id === 'bigfish') giveGems(0, 1, 'cá ngừ quý');", "if (id === 'bigfish') { giveGems(0, 1, 'cá ngừ quý'); if (Math.random() < 0.25) giveKey(1, 'cá ngừ quý'); }")
sub(G, "animals: [{t: 'chicken', st: 'hungry', r: 0}, null, null, null, null, null, null, null, null],", "animals: [{t: 'chicken', st: 'hungry', r: 0}, ...Array(17).fill(null)], barnLv: 0, keys: 1, pity: 0,")
sub(G, "x: pen.x0 + 30 + (i % 5) * 80, y: pen.y0 + 20 + Math.floor(i / 5) * 70,", "x: pen.x0 + 30 + (i % 6) * 78, y: pen.y0 + 20 + Math.floor(i / 6) * 66,")
sub(G, "<p class=\"note\">Giao đơn và bán đồ ở chợ (MARKET), gặp Chú Ba.</p>", "<p class=\"note\">Giao đơn và bán đồ ở chợ (MARKET), gặp Chú Ba.</p><div class=\"row-btns\"><button class=\"btn\" data-act=\"farmshop\" data-t=\"seeds\">Cửa hàng nông trại</button><button class=\"btn gold\" data-act=\"farmshop\" data-t=\"chest\">Rương may mắn (${S.keys || 0} chìa)</button></div>")
# out of seeds -> buy right here
t = (R / G).read_text(encoding="utf-8")
i = t.index("  if (!have.length) { openModal(`<h2 class=\"ptitle\">Hết hạt giống</h2>")
j = t.index("\n", i)
t = t[:i] + "  if (!have.length) return openFarmShop('seeds');" + t[j:]
(R / G).write_text(t, encoding="utf-8")
sub(G, "  const rows = have.map(c => `<button class=\"row-item\" data-act=\"plant\"", "  const rows = `<button class=\"row-item\" data-act=\"farmshop\" data-t=\"seeds\"><span class=\"ii plus\">+</span><span class=\"ri-main\"><b>Mua thêm hạt giống</b><small>Mở cửa hàng nông trại</small></span></button>` + have.map(c => `<button class=\"row-item\" data-act=\"plant\"")
# fashion shop: show chest-only items, with their source
sub(G, "list = FASHION.filter(f => f.slot === SHOPTAB && f.price > 0);", "list = FASHION.filter(f => f.slot === SHOPTAB && (f.price > 0 || f.chest));")
sub(G, "const priceTag = f => f.price === 0 ?", "const priceTag = f => f.chest ? 'Chỉ có trong rương' : f.price === 0 ?")
sub(G, "const canAfford = f => f.cur === 'gem'", "const canAfford = f => f.chest ? false : f.cur === 'gem'")
sub(G, "Đồ có biểu tượng kim cương thì trả bằng kim cương.</p>", "Đồ có biểu tượng kim cương thì trả bằng kim cương. Đồ <b>Thần thoại</b> cực hiếm: có món giá hàng trăm kim cương, có món chỉ rơi ra từ Rương may mắn.</p><div class=\"row-btns\"><button class=\"btn gold sm\" data-act=\"farmshop\" data-t=\"chest\">Rương may mắn</button></div>")

M = "main.js"
sub(M, "  while (s.animals.length < 9) s.animals.push(null);", "  if (typeof s.barnLv !== 'number') { const last = s.animals.reduce((m, a, i) => a ? i + 1 : m, 0); s.barnLv = d && d.created ? Math.max(2, BARN_CAP.findIndex(c => c >= last)) : 0; }\n  while (s.animals.length < 18) s.animals.push(null);\n  if (typeof s.keys !== 'number') s.keys = 1; s.pity = s.pity || 0;")
sub(M, "    case 'buyanimal': return buyAnimal(+d.s, d.a);", """    case 'buyanimal': return buyAnimal(+d.s, d.a);
    case 'farmshop': return openFarmShop(d.t);
    case 'fs-tab': return openFarmShop(d.t);
    case 'fs-seed': return buySeedPack(d.crop, +d.n);
    case 'fs-animal': return farmBuyAnimal(d.a);
    case 'fs-barn': upgradeBarn(); return openFarmShop();
    case 'chest-open': LASTCHEST = d.k; return openChest(d.k);
    case 'chest-again': if (LASTCHEST === 'key' ? (S.keys || 0) > 0 : S.di >= CHEST_PRICE) return openChest(LASTCHEST); return openFarmShop('chest');
    case 'wear-now': { const f = FASH[d.id]; if (f && S.owned.includes(f.id)) { Object.assign(S.look, slotPatch(f)); markDirty(); renderHUD(); toast(`Đã mặc <b>${esc(f.vi)}</b>.`); } return closeModal(); }""")
sub(M, "    if ((o.t === 'sign' || (o.t === 'prop' && /^stall/.test(o.kind))) &&", "    if ((o.role === 'farmshop' || o.kind === 'stall_farm') && Math.abs(tx - o.x) <= 1 && Math.abs(ty - o.y) <= 1) { const st = m.objs.find(q => q.kind === 'stall_farm'); return approach(st.x, st.y + 1, 1.6, () => { speak('farm shop', true); openFarmShop(); }); }\n    if ((o.t === 'sign' || (o.t === 'prop' && /^stall/.test(o.kind))) &&")

sub("world.js", "  prop(f, 'hay', 11, 5); prop(f, 'crate', 11, 7);", "  prop(f, 'hay', 11, 5); prop(f, 'crate', 11, 7);\n  prop(f, 'stall_farm', 23, 10); m_sign(f, 23, 9, 'FARM SHOP', 'farmshop');")
sub("render.js", "      if (o.kind === 'stall_a' || o.kind === 'stall_b') ", "      if (o.kind === 'stall_farm') ents.push({y: o.y * TS + 26, d: () => drawSprite(ctx, o.kind, () => stallDef('#FFC83D', '#3FAE5A'), o.x * TS + 16, o.y * TS + 30, pxs)});\n      if (o.kind === 'stall_a' || o.kind === 'stall_b') ")

T = "tests.js"
sub(T, "giveGems(3, 1, 'kiểm tra tuần');", "giveGems(3, 1, 'kiểm tra tuần'); giveKey(1, 'kiểm tra tuần');")
sub(T, "S.road.claimed.push(i); giveGems(st.reward.em, st.reward.di, `hoàn thành chặng ${st.name}`);", "S.road.claimed.push(i); giveGems(st.reward.em, st.reward.di, `hoàn thành chặng ${st.name}`); giveKey(1, 'lộ trình IELTS');")
print("ok")
