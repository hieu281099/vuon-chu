from pathlib import Path
R = Path(__file__).resolve().parent.parent / "src"
def sub(f, a, b, count=1):
    p = R / f; t = p.read_text(encoding="utf-8")
    assert t.count(a) == count, (f, t.count(a), a[:90]); p.write_text(t.replace(a, b), encoding="utf-8")

# NPCs: Ông Sáu moves to the fish shop and sells bait; Chú Bảy runs the post office
(R / "post_bait.js").write_text((R / "post_bait.js").read_text(encoding="utf-8") + """
{ const sau = NPC_DEFS.find(d => d.id === 'sau'); sau.role = 'bait'; sau.home = [26, 10]; sau.greet = ['Fresh worms!', 'Good fishing today!']; sau.line = () => ({en: `Hello ${S.name}! Need some bait for fishing?`, vi: `Chào ${S.name}! Cần mồi câu không cháu?`}); }
NPC_DEFS.push({id:'bay', name:'Chú Bảy', map:'village', home:[27, 22], role:'post', look:L_({skin:3, hairF:'regular', hairC:'#1F1B24', beard:'short', top:'top_jacket', topC:'#FFB547', bottom:'bot_pants', bottomC:'#545AF2', hat:'hat_cap'}),
  greet:['You have mail!', 'Letters for you!'], line:() => ({en:`Hi ${S.name}! There is a letter for you today.`, vi:`Chào ${S.name}! Hôm nay có thư cho cháu đây.`})});
""", encoding="utf-8")
sub("npc_gear.js", "  tam:  {", "  bay:  {hat: 'hat_cap', face2: 'face_aviator', back: 'back_bag', hand: 'hand_book', neck: 'neck_scarf', bag: 'bag_cross', shoes: 'shoes_sneaker', pet: 'pet_chick', _lv: 4},\n  tam:  {")

W = "world.js"
sub(W, "house(r, 'house2', 22, 4, 5, 5, {sign: 'FISH SHOP'});", "house(r, 'house2', 22, 4, 5, 5, {sign: 'FISH SHOP', role: 'bait'});")
sub(W, "house(v, 'post', 23, 18, 5, 4, {sign: 'POST'});", "house(v, 'post', 23, 18, 5, 4, {sign: 'POST', role: 'post'});")
# no trees standing in the river or on the sand: the edge stays blocked, it just looks like open water
sub(W, "  r.spawn = [2, 9];", "  r.objs = r.objs.filter(o => !(o.t === 'tree' && ['w', 's', 'D'].includes(T_(r, o.x, o.y))));\n  prop(r, 'reeds', 1, 12, false); prop(r, 'rock', 32, 12);\n  r.spawn = [2, 9];")

G = "game.js"
sub(G, "  if (role === 'lottery') return lottoHTML();", "  if (role === 'lottery') return lottoHTML();\n  if (role === 'bait') return baitHTML();\n  if (role === 'post') return postHTML();")
sub(G, "function startFishing(wx, wy) {\n", "function startFishing(wx, wy) {\n  if (!((S.bait || 0) > 0)) return noBait();\n  S.bait--; markDirty();\n")
sub(G, "toast('Đã thả câu. Chờ cá cắn nhé.');", "toast(`Đã thả câu (còn ${S.bait} mồi). Chờ cá cắn nhé.`);")
sub(G, "cefr: 'A1', hair: [], spa: [], lvAns: 0,", "cefr: 'A1', hair: [], spa: [], lvAns: 0, bait: 5,")
sub(G, "<h2 class=\"ptitle\">Túi đồ</h2>", "<h2 class=\"ptitle\">Túi đồ</h2><p class=\"note\">Mồi câu: <b>${S.bait || 0}</b> · Chìa khoá rương: <b>${S.keys || 0}</b></p>")

M = "main.js"
sub(M, "    case 'lotto-buy': return lottoBuy();", "    case 'lotto-buy': return lottoBuy();\n    case 'bait-buy': return baitBuy(+d.n);\n    case 'bait-go': return baitGo();\n    case 'post-pick': return postPick(+d.q, +d.v);\n    case 'post-submit': return postSubmit();")
sub(M, "  s.hair = Array.isArray(s.hair) ? s.hair : [];", "  if (typeof s.bait !== 'number') s.bait = 5;   // every account gets 5 free baits once\n  s.hair = Array.isArray(s.hair) ? s.hair : [];")
sub(M, "Cô Tám bán vé số trước POST", "Cô Tám bán vé số, Chú Bảy ở POST có thư tiếng Anh mỗi ngày")
sub(M, "h = 'Chạm vào mặt nước để thả câu. Ông Sáu ở cầu tàu cũng thích nói chuyện.';", "h = `Chạm vào mặt nước để thả câu (còn ${S.bait || 0} mồi). Mua mồi ở FISH SHOP, gặp Ông Sáu.`;")
sub("minimap.js", "home: 'Nhà', lottery: 'Vé số'};", "home: 'Nhà', lottery: 'Vé số', bait: 'Mồi câu', post: 'Bưu điện'};")
sub("minimap.js", "lottery: '#FF3552'};", "lottery: '#FF3552', bait: '#36A8AE', post: '#F29A1F'};")

# English levels get harder: more words to master, more practice, longer test, higher pass mark
L = "level.js"
sub(L, "const READY_ANS = 30;", "// rules for leaving each level (index = current level): share of its words at 3 stars, answers needed, test length, pass mark\nconst LV_RULES = [{words: 0.6, ans: 30, n: 15, pass: 11}, {words: 0.7, ans: 60, n: 18, pass: 13}, {words: 0.75, ans: 100, n: 20, pass: 15}, {words: 0.85, ans: 160, n: 22, pass: 17}];\nconst lvRule = () => LV_RULES[Math.min(LV_RULES.length - 1, lvIdx())];\nconst READY_ANS = 30;")
sub(L, "target = Math.max(4, Math.ceil(ws.length * 0.6));", "target = Math.max(4, Math.ceil(ws.length * lvRule().words)), need = lvRule().ans;")
sub(L, "ans = Math.min(READY_ANS, S.lvAns || 0);", "ans = Math.min(need, S.lvAns || 0);")
sub(L, "(ans / READY_ANS) * 0.3;", "(ans / need) * 0.3;")
sub(L, "return {pct: Math.min(1, pct), known: Math.min(known, target), target, ans, next: LEVELS[i + 1]};", "return {pct: Math.min(1, pct), known: Math.min(known, target), target, ans, need, next: LEVELS[i + 1]};")
sub(L, "<em>${r.ans}/${READY_ANS}</em>", "<em>${r.ans}/${r.need}</em>")
sub(L, "${r.ans >= READY_ANS ? 'ok' : ''}", "${r.ans >= r.need ? 'ok' : ''}")
t = (R / L).read_text(encoding="utf-8")
a = "  pool.slice(0, 10).forEach(w => qs.push(vocabQ(w, next)));"
assert a in t
t = t.replace(a, "  const rule = lvRule(), nv = rule.n - 5, prev = shuf(levelWords(cur, S.study.track));\n  pool.slice(0, nv).forEach(w => qs.push(vocabQ(w, next)));\n  if (pool.length < nv) prev.slice(0, nv - pool.length).forEach(w => qs.push(vocabQ(w, next)));")
t = t.replace("return {id: 'levelup', kind: 'levelup', title: `Bài test lên trình độ ${next}`, target: next,", "return {id: 'levelup', kind: 'levelup', title: `Bài test lên trình độ ${next}`, target: next, pass: rule.pass,")
t = t.replace("note: `15 câu ở trình độ ${next}. Đúng từ 11/15 câu (70%) là lên ${next}", "note: `${qs.length} câu ở trình độ ${next}. Đúng từ ${rule.pass}/${qs.length} câu là lên ${next}")
t = t.replace("Bài test có 15 câu ở trình độ ${r.next}, đúng từ 11 câu là lên cấp.", "Bài test có ${lvRule().n} câu ở trình độ ${r.next}, đúng từ ${lvRule().pass} câu là lên cấp. Trình độ càng cao càng cần thuộc nhiều từ, luyện nhiều câu hơn và bài test khó hơn.")
(R / L).write_text(t, encoding="utf-8")
T = "tests.js"
sub(T, "R.passed = R.raw >= 11;", "R.passed = R.raw >= (EX.test.pass || 11);")
sub(T, "${R.raw >= 11 ? 'pass' : 'fail'}\"><small>Bài test lên", "${R.raw >= (EX.test.pass || 11) ? 'pass' : 'fail'}\"><small>Bài test lên")
sub(T, "if (R.kind === 'levelup') tail = R.raw >= 11 ?", "if (R.kind === 'levelup') tail = R.raw >= (EX.test.pass || 11) ?")
t = (R / T).read_text(encoding="utf-8")
t = t.replace("cần 11/15 câu</span>", "cần ${EX.test.pass || 11}/${R.total} câu</span>")
(R / T).write_text(t, encoding="utf-8")

(R / "style.css").write_text((R / "style.css").read_text(encoding="utf-8") + """
/* ---------- post office letter ---------- */
.letter{background:#fffaf0;border:1.5px dashed #f2c27a;border-radius:16px;padding:12px 14px;margin:8px 0 12px;font-size:14.5px;line-height:1.55}
.letter .lhead{display:flex;flex-wrap:wrap;gap:4px 12px;align-items:center;margin-bottom:6px;font-size:13px;color:var(--muted)}
.letter .lhead b{color:var(--ink)}
.letter p{margin:0}
""", encoding="utf-8")
b = Path(__file__).resolve().parent / "build_html.py"; t = b.read_text(encoding="utf-8")
b.write_text(t.replace('"lottery.js", "npc_gear.js"', '"lottery.js", "post_bait.js", "npc_gear.js"'), encoding="utf-8")
print("ok")
