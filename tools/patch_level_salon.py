from pathlib import Path
import re
R = Path(__file__).resolve().parent.parent / "src"
def sub(f, a, b, count=1):
    p = R / f; t = p.read_text(encoding="utf-8")
    assert t.count(a) == count, (f, t.count(a), a[:80]); p.write_text(t.replace(a, b), encoding="utf-8")

# ---------- chibi: hair dye gradients live with the rainbow def; batch-2 renderers ----------
salon = (R / "salon.js").read_text(encoding="utf-8")
grad = salon[salon.index("const HAIR_GRAD = `") + len("const HAIR_GRAD = `"):]
grad = grad[:grad.index("`;")]
(R / "salon.js").write_text(salon.replace(salon[salon.index("// hair dye gradients"):salon.index("`;", salon.index("const HAIR_GRAD")) + 2], "// hair dye gradients (hg_*) are defined in RB_DEF in chibi.js"), encoding="utf-8")
sub("chibi.js", "</filter></defs>`;", "</filter>" + grad.replace("\n", "") + "</defs>`;")
sub("chibi.js", "    case 'pet_dragon': body = `", "    default: body = petBody2(id, c, hop, eyes); break;\n    case 'pet_dragon': body = `")
sub("chibi.js", "const base = FASH[id].col, col = id === 'aura_galaxy' ?", "const base = FASH[id].col, col = id === 'aura_dragon' ? `hsl(${10 + (t / 20) % 40} 100% 60%)` : id === 'aura_galaxy' || id === 'aura_rainbow' ?")
sub("chibi.js", "g.fillStyle = id === 'aura_sparkle' || id === 'aura_leaves' || id === 'aura_galaxy' ? col : base;", "g.fillStyle = ['aura_sparkle', 'aura_leaves', 'aura_galaxy', 'aura_rainbow', 'aura_dragon'].includes(id) ? col : base;")
sub("chibi.js", "    else if (id === 'aura_flame') {", "    else if (id === 'aura_flame' || id === 'aura_dragon') {")
sub("chibi.js", "    else if (id === 'aura_snow') {", "    else if (id === 'aura_bubbles') { g.strokeStyle = base; g.lineWidth = 1.2; g.beginPath(); g.arc(px, py, s * 1.4, 0, Math.PI * 2); g.stroke(); }\n    else if (id === 'aura_snow') {")
sub("chibi.js", "    else if (id === 'aura_leaves' || id === 'aura_sakura') {", "    else if (id === 'aura_leaves' || id === 'aura_sakura' || id === 'aura_butterfly') {")
X = "fashion_extra.js"
for fn, call in [("extraTop", "extraTop2(s, c, b, d, tee, waist)"), ("extraHat", "extraHat2(id, c, lv, t, d)"), ("extraFace", "extraFace2(id, c, lv)"), ("extraBack", "extraBack2(id, c, lv, front, pair)"), ("extraHand", "extraHand2(id, c, lv)")]:
    t = (R / X).read_text(encoding="utf-8"); i = t.index(f"function {fn}("); j = t.index("\n  return '';\n}", i)
    t = t[:j] + f"\n  return {call};\n}}" + t[j + len("\n  return '';\n}"):]
    (R / X).write_text(t, encoding="utf-8")

# ---------- game.js ----------
G = "game.js"
t = (R / G).read_text(encoding="utf-8")
i = t.index("  while (S.xp >= need(S.lvl)) {"); j = t.index("\n  }\n}", i)
t = t[:i] + "  // the character has no XP level any more: the English level (S.cefr) is its level" + t[j + 4:]
(R / G).write_text(t, encoding="utf-8")
sub(G, "  else { r.m = Math.max(0, r.m - 1); r.w = 1; S.streak = 0; }\n}", "  else { r.m = Math.max(0, r.m - 1); r.w = 1; S.streak = 0; }\n  lvNoteAnswer();\n}")
t = (R / G).read_text(encoding="utf-8")
for v in ["A.lvl", "c.lvl", "f.lvl"]:
    t = t.replace("`Cấp ${" + v + "}`", "needTag(" + v + ")")
t = t.replace("Cấp ${r.lvl}", "${LEVELS[Math.min(4, Math.max(0, (r.lvl || 1) - 1))]}")
t = t.replace("lvl: S.lvl, xp: S.xp, words:", "lvl: lvIdx() + 1, xp: S.xp, words:")
(R / G).write_text(t, encoding="utf-8")
assert "Cấp ${" not in (R / G).read_text(encoding="utf-8")
sub(G, "seeds: {carrot: 6, radish: 4}, inv: {}", "cefr: 'A1', hair: [], lvAns: 0, seeds: {carrot: 6, radish: 4}, inv: {}")
sub(G, "    coins: 80, em: 4, di: 1, daily: '', xp: 0, lvl: 1,", "    coins: 80, em: 4, di: 1, daily: '', xp: 0, lvl: 3,")
sub(G, "  BUY.done = true; BUY.pick = i; BUY.ok = BUY.opts[i] === f.en; S.stats.all++;", "  BUY.done = true; BUY.pick = i; BUY.ok = BUY.opts[i] === f.en; S.stats.all++; lvNoteAnswer();")
sub(G, "  if (role === 'ielts') return ieltsHTML();", "  if (role === 'ielts') return ieltsHTML();\n  if (role === 'salon') return salonHTML();")
sub(G, """    greet:['Morning run!','Nice weather today.'], line:() => ({en:`Hey ${S.name}! Do you jog in the park too?`, vi:`Chào ${S.name}! Bạn cũng chạy bộ trong công viên à?`})}
);""", """    greet:['Morning run!','Nice weather today.'], line:() => ({en:`Hey ${S.name}! Do you jog in the park too?`, vi:`Chào ${S.name}! Bạn cũng chạy bộ trong công viên à?`})},
  {id:'ngan', name:'Chị Ngân', map:'village', home:[8, 23], role:'salon', look:L_({skin:1, hairF:'elegant', hairB:'long', hairC:'#FF8FC7', top:'top_cardigan', topC:'#B05CFF', bottom:'bot_pleated', bottomC:'#1F1B24', face2:'face_star', hand:'hand_fan'}),
    greet:['New hairstyles!','Try a new look!'], line:() => ({en:`Hi ${S.name}! Which hairstyle would you like today?`, vi:`Chào ${S.name}! Hôm nay em muốn làm kiểu tóc nào?`})}
);""")
sub(G, 'data-act="creator">Sửa ngoại hình</button>', 'data-act="creator">Sửa ngoại hình</button><button class="btn sm" data-act="salon">Tiệm tóc</button>')
# creator: only free or bought hairstyles and dyes
sub(G, "${chips('hairF', HAIR_F, v => HAIR_F_VI[v])}", "${chips('hairF', Object.keys(NEMO.hairF).filter(v => v !== 'none').concat('none').filter(ownsHairF), v => HAIR_F_VI[v] || (HAIR_ITEMS.find(h => h.f === v) || {}).vi || v)}")
sub(G, "${chips('hairB', HAIR_B, v => HAIR_B_VI[v])}", "${chips('hairB', [null, ...Object.keys(NEMO.hairB)].filter(ownsHairB), v => HAIR_B_VI[v] || (HAIR_ITEMS.find(h => h.b === v) || {}).vi || v)}")
t = (R / G).read_text(encoding="utf-8")
i = t.index("<span class=\"lbl\">Màu tóc</span>${sw('hairC', HAIR")
j = t.index("}", t.index("sw('hairC'", i)) + 1
t = t[:i] + "<span class=\"lbl\">Màu tóc</span>${sw('hairC', [...HAIR_COLS, ...ownedDyes()])}<p class=\"note\">Kiểu tóc và màu nhuộm đẹp, hiếm có ở <b>Tiệm tóc</b> trong Làng. <button class=\"linkbtn\" data-act=\"salon\">Đến tiệm tóc</button></p>" + t[j:]
(R / G).write_text(t, encoding="utf-8")
sub(G, "  CC = null; closeModal(); saveNow(true);", "  const picked = CC.level; CC = null; closeModal(); saveNow(true);\n  if (first && picked !== 'A1') setTimeout(() => openModal(`<h2 class=\"ptitle\">Được công nhận ${picked}?</h2><p class=\"psub\">Cấp độ của nhân vật chính là trình độ tiếng Anh. Bạn bắt đầu ở <b>A1</b>. Làm bài kiểm tra xếp lớp 24 câu để được công nhận ngay ${picked} và mở khoá đồ, cây trồng, vật nuôi theo trình độ.</p><div class=\"row-btns\"><button class=\"btn gold\" data-act=\"t-place\">Làm bài xếp lớp</button><button class=\"btn ghost\" data-act=\"close\">Để sau</button></div>`, {label: 'Xếp lớp'}), 4800);")
sub(G, "<h3 class=\"ph3\">Trình độ</h3>", "<div class=\"lvline\" data-act=\"lvinfo\" role=\"button\"><span class=\"lvbig sm\">${S.cefr}</span><span>Trình độ được công nhận (cấp độ nhân vật). Muốn lên cấp phải qua bài test. <b>Xem tiến độ</b></span></div><h3 class=\"ph3\">Trình độ đang học (chọn tự do để luyện)</h3>")

# ---------- farm_extra: needTag, hair in the chest ----------
F = "farm_extra.js"
t = (R / F).read_text(encoding="utf-8")
for v in ["c.lvl", "A.lvl"]:
    t = t.replace("`Cấp ${" + v + "}`", "needTag(" + v + ")").replace("Cấp ${" + v + "}", "${needTag(" + v + ")}")
t = t.replace("<span>Cấp ${c.lvl}</span>", "<span>${needTag(c.lvl)}</span>")
t = t.replace("<span class=\"note\">Cần cấp ${nx.lvl}</span>", "<span class=\"note\">${needTag(nx.lvl)}</span>")
(R / F).write_text(t, encoding="utf-8")
assert "Cấp ${" not in t and "Cần cấp" not in t, [m for m in re.findall(r"C.n? ?c.p \$\{[^}]*\}", t)]
sub(F, "  const myth = notOwned(FASHION.filter(f => f.chest)), rare = notOwned(FASHION.filter(f => f.rar >= 2 && f.rar <= 3 && f.price > 0));",
    "  const myth = [...notOwned(FASHION.filter(f => f.chest)).map(item => ({item})), ...HAIR_ITEMS.filter(h => h.chest && !(S.hair || []).includes(h.id)).map(hairItem => ({hairItem}))];\n  const rare = [...notOwned(FASHION.filter(f => f.rar >= 2 && f.rar <= 3 && f.price > 0)).map(item => ({item})), ...HAIR_ITEMS.filter(h => h.rar >= 2 && h.rar <= 3 && !(S.hair || []).includes(h.id)).map(hairItem => ({hairItem}))];")
sub(F, "if (myth.length && (r < 0.015 || S.pity >= PITY)) { S.pity = 0; return {item: rand(myth)}; }", "if (myth.length && (r < 0.015 || S.pity >= PITY)) { S.pity = 0; return rand(myth); }")
sub(F, "if (rare.length && r < 0.095) return {item: rand(rare)};", "if (rare.length && r < 0.095) return rand(rare);")
sub(F, "  if (g.item) { const f = g.item; S.owned.push(f.id);", "  if (g.hairItem) { const h = g.hairItem; S.hair = S.hair || []; S.hair.push(h.id); cls = 'r' + h.rar; title = `<b>${esc(h.vi)}</b> (${esc(h.en)}) · ${RARITY[h.rar].vi} · tóc`; img = hairPreview(h); if (h.rar >= 4) sfx('level'); }\n  else if (g.item) { const f = g.item; S.owned.push(f.id);")
sub(F, "${g.item ? `<button class=\"btn\" data-act=\"wear-now\" data-id=\"${g.item.id}\">Mặc luôn</button>` : ''}", "${g.item ? `<button class=\"btn\" data-act=\"wear-now\" data-id=\"${g.item.id}\">Mặc luôn</button>` : ''}${g.hairItem ? `<button class=\"btn\" data-act=\"hair-now\" data-id=\"${g.hairItem.id}\">Dùng luôn</button>` : ''}")
sub(F, "${g.item && g.item.rar >= 4 ? 'THẦN THOẠI!' : 'Mở rương!'}", "${(g.item || g.hairItem) && (g.item || g.hairItem).rar >= 4 ? 'THẦN THOẠI!' : 'Mở rương!'}")
sub(F, "${g.item ? '<p class=\"note\">Đồ đã vào Tủ đồ. Có thể nâng cấp ở lò rèn.</p>' : ''}", "${g.item ? '<p class=\"note\">Đồ đã vào Tủ đồ. Có thể nâng cấp ở lò rèn.</p>' : g.hairItem ? '<p class=\"note\">Kiểu tóc đã vào bộ sưu tập, đổi ở Tủ đồ → Sửa ngoại hình hoặc Tiệm tóc.</p>' : ''}")
sub(F, "const myth = FASHION.filter(f => f.chest), have = myth.filter(f => S.owned.includes(f.id)).length;", "const myth = FASHION.filter(f => f.chest), have = myth.filter(f => S.owned.includes(f.id)).length + HAIR_ITEMS.filter(h => h.chest && (S.hair || []).includes(h.id)).length, total = myth.length + HAIR_ITEMS.filter(h => h.chest).length;")
sub(F, "Bộ sưu tập Thần thoại: ${have}/${myth.length}.", "Bộ sưu tập Thần thoại: ${have}/${total} (gồm cả kiểu tóc).")

# ---------- cloud profile ----------
sub("cloud.js", "lvl: S.lvl, xp: S.xp,", "lvl: lvIdx() + 1, xp: S.xp,")

# ---------- tests.js: level-up exam, promotions go through promoteTo ----------
T = "tests.js"
sub(T, "if (R.kind === 'placement' || R.kind === 'auto') { const s = secs.reduce", "if (R.kind === 'placement' || R.kind === 'auto' || R.kind === 'levelup') { const s = secs.reduce")
sub(T, "const cefr = bandToCEFR(R.overall); if (LEVELS.indexOf(cefr) > LEVELS.indexOf(S.study.level)) { S.study.level = cefr; if (!S.study.unlocked.includes(cefr)) S.study.unlocked.push(cefr); R.promoted = cefr; }", "const cefr = bandToCEFR(R.overall); if (promoteTo(cefr, 'bài thi IELTS tháng')) R.promoted = cefr;")
sub(T, "if (LEVELS.indexOf(R.level) > LEVELS.indexOf(S.study.level)) { S.study.level = R.level; if (!S.study.unlocked.includes(R.level)) S.study.unlocked.push(R.level); R.promoted = R.level; }", "if (promoteTo(R.level, 'kiểm tra xếp lớp')) R.promoted = R.level;")
sub(T, "  if (R.kind === 'auto' && R.pct >= 70) {", "  if (R.kind === 'levelup') { R.passed = R.raw >= 11; if (R.passed) { promoteTo(EX.test.target, `lên trình độ ${EX.test.target}`); R.promoted = EX.test.target; } else S.lvFailAt = Date.now(); }\n  if (R.kind === 'auto' && R.pct >= 70) {")
sub(T, "  if (R.kind === 'auto') head = ", "  if (R.kind === 'levelup') head = `<div class=\"score big ${R.raw >= 11 ? 'pass' : 'fail'}\"><small>Bài test lên ${esc(EX.test.target)}</small><b>${R.raw}/${R.total}</b><span class=\"note\">${R.pct}% · cần 11/15 câu</span></div>`;\n  if (R.kind === 'auto') head = ")
sub(T, "  if (R.kind === 'auto') tail = ", "  if (R.kind === 'levelup') tail = R.raw >= 11 ? `<div class=\"fb good\"><strong>Chúc mừng, bạn đã lên ${esc(EX.test.target)}!</strong> Nhân vật đã lên cấp. Đồ, kiểu tóc, cây trồng và vật nuôi của trình độ mới đã mở khoá.</div>` : `<div class=\"fb miss\"><strong>Chưa đạt.</strong> Ôn lại từ vựng ${esc(EX.test.target)} trong mục Học tập, sau 20 phút có thể thi lại.</div>`;\n  if (R.kind === 'auto') tail = ")
sub(T, "h.kind === 'placement' ? h.level + ' · ' + h.pct + '%' : h.pct + '%'", "h.kind === 'placement' ? h.level + ' · ' + h.pct + '%' : h.kind === 'levelup' ? 'Lên cấp · ' + h.pct + '%' : h.pct + '%'")

# ---------- main.js ----------
M = "main.js"
sub(M, "  $('#hud-lvl').textContent = S.lvl;\n  const pct = Math.min(100, S.xp / need(S.lvl) * 100);", "  $('#hud-lvl').textContent = S.cefr || 'A1';\n  const rd = readiness(), pct = Math.round(rd.pct * 100); $('#hud-ring').classList.toggle('ready', !rd.max && rd.pct >= 1);")
sub(M, "    case 'study': return openStudy();", """    case 'study': return openStudy();
    case 'lvinfo': return openLevel();
    case 'lv-test': return startLevelUp();
    case 'salon': return openSalon();
    case 'sal-tab': SAL.tab = d.t; SAL.buy = null; return salonRefresh();
    case 'sal-back': SAL.buy = null; return salonRefresh();
    case 'hair-pick': return hairPick(d.id);
    case 'hair-wear': return hairWear(d.id);
    case 'hair-ans': return hairAnswer(+d.i);
    case 'hair-now': { const h = HAIR[d.id]; if (h && (S.hair || []).includes(h.id)) { Object.assign(S.look, hairPatch(h)); markDirty(); renderHUD(); } return closeModal(); }""")
sub(M, "  if (typeof s.last !== 'number') s.last = Date.now();", """  if (typeof s.last !== 'number') s.last = Date.now();
  // English level replaces the XP level; hairstyles become salon items (keep whatever the player already wears)
  if (!s.cefr) { const t = s.created ? tierOf(s.lvl || 1) : 0, st = Math.max(0, LEVELS.indexOf(s.study.level)); s.cefr = LEVELS[Math.min(t, st)]; }
  s.hair = Array.isArray(s.hair) ? s.hair : [];
  for (const h of HAIR_ITEMS) if (((h.f && s.look.hairF === h.f) || (h.b && s.look.hairB === h.b) || (h.c && s.look.hairC === h.c)) && !s.hair.includes(h.id)) s.hair.push(h.id);
  s.lvl = TIER_MAX[Math.max(0, LEVELS.indexOf(s.cefr))];""")

# ---------- index.html: the level ring opens the English-level panel ----------
sub("index.html", '<div class="ring" id="hud-ring">', '<div class="ring" id="hud-ring" data-act="lvinfo" role="button" tabindex="0" title="Trình độ tiếng Anh">')

# ---------- world + scene: salon building in the village ----------
sub("world.js", "  house(v, 'post', 23, 18, 5, 4, {sign: 'POST'});", "  house(v, 'post', 23, 18, 5, 4, {sign: 'POST'});\n  house(v, 'salon', 2, 18, 6, 4, {sign: 'HAIR SALON', role: 'salon'});")
sub("world.js", "[5, 21, 'fruit']", "[9, 25, 'fruit']")
sub("world.js", "[3, 16, 'blossom']", "[3, 15, 'blossom']")
sub("scene.js", "  coop:   {wall:'#FFD36B',", "  salon:  {wall:'#FFF0FB', roof:'#C77DFF', roof2:'#A75BE8', trim:'#F2D4FF', door:'#FF6FB5', awning:['#FF8FC7','#FFFFFF']},\n  coop:   {wall:'#FFD36B',")

# ---------- styles ----------
(R / "style.css").write_text((R / "style.css").read_text(encoding="utf-8") + """
/* ---------- English level, salon ---------- */
.ring{cursor:pointer}
.ring .lvbadge{font-size:12px;min-width:26px}
.ring.ready{animation:lvready 1.4s ease-in-out infinite}
@keyframes lvready{50%{box-shadow:0 0 0 5px rgba(255,209,102,.55)}}
.lvhero{display:flex;gap:14px;align-items:center;background:var(--grad);color:#fff;border-radius:22px;padding:14px 16px;margin:8px 0}
.lvhero b{font-family:var(--display);font-size:20px;display:block}.lvhero small{opacity:.9;font-weight:700}
.lvbig{font-family:var(--display);font-weight:800;font-size:40px;line-height:1;background:rgba(255,255,255,.2);border-radius:18px;padding:8px 14px}
.lvbig.sm{font-size:18px;padding:4px 10px;background:var(--grad);color:#fff;border-radius:12px}
.lvline{display:flex;gap:10px;align-items:center;background:var(--surface-2);border-radius:16px;padding:8px 12px;margin:10px 0 4px;cursor:pointer;font-size:13.5px}
.lvpath{list-style:none;padding:0;margin:10px 0;display:grid;grid-template-columns:repeat(5,1fr);gap:6px}
.lvpath li{text-align:center;background:var(--surface-2);border-radius:14px;padding:8px 4px}
.lvpath li b{font-family:var(--display);font-size:18px;display:block}.lvpath li small{font-size:10.5px;color:var(--muted);font-weight:700}
.lvpath li.done{background:var(--mint-lt)}.lvpath li.cur{background:var(--violet);color:#fff}.lvpath li.cur small{color:#e8e2ff}
.lvprog{position:relative;height:16px;border-radius:99px;background:var(--surface-3);overflow:hidden}
.lvprog i{position:absolute;inset:0;width:var(--w);background:var(--grad);border-radius:99px}
.lvprog span{position:relative;display:block;text-align:center;font-size:11px;font-weight:900;line-height:16px;color:var(--ink)}
.card .hot{position:absolute;top:8px;right:8px;font-size:9.5px;font-weight:900;color:#fff;background:#ff3552;border-radius:99px;padding:1px 6px}
@media (max-width:600px){.lvpath small{display:none}.lvbig{font-size:30px}}
""", encoding="utf-8")
print("ok")
