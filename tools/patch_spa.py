from pathlib import Path
R = Path(__file__).resolve().parent.parent / "src"
def sub(f, a, b, count=1):
    p = R / f; t = p.read_text(encoding="utf-8")
    assert t.count(a) == count, (f, t.count(a), a[:80]); p.write_text(t.replace(a, b), encoding="utf-8")

C = "chibi.js"
sub(C, '<rect x="25" y="34" width="95" height="83" rx="30" fill="${skin.b}"/>`;\n  if (back)', '${L.shape && FACE_SHAPES[L.shape] ? FACE_SHAPES[L.shape](skin.b) : `<rect x="25" y="34" width="95" height="83" rx="30" fill="${skin.b}"/>`}`;\n  if (back)')
sub(C, "    s += NEMO.faces[face] || NEMO.faces.smile;\n", "    s += (!f.face && eyesSVG(L, face)) || NEMO.faces[face] || NEMO.faces.smile;\n    s += featsSVG(L, skin, 'face');\n")
sub(C, "  if (!back) s += acc('ear', earSVG);", "  if (!back) s += acc('ear', earSVG) + featsSVG(L, skin, 'hair');")
sub(C, "mouth:null, deco:null, ear:null, neck:null, shoes:null, bag:null, lv:{}};", "mouth:null, deco:null, ear:null, neck:null, shoes:null, bag:null, shape:null, eyes:null, feats:[], lv:{}};")

G = "game.js"
sub(G, "cefr: 'A1', hair: [], lvAns: 0,", "cefr: 'A1', hair: [], spa: [], lvAns: 0,")
sub(G, "  if (role === 'salon') return salonHTML();", "  if (role === 'salon') return salonHTML();\n  if (role === 'spa') return spaHTML();")
sub(G, """    greet:['New hairstyles!','Try a new look!'],""", """    greet:['New hairstyles!','Try a new look!'],""")
t = (R / G).read_text(encoding="utf-8")
i = t.index("  {id:'ngan', name:'Chị Ngân'"); j = t.index("\n);", i)
t = t[:j] + """,
  {id:'thu', name:'Chị Thu', map:'park', home:[9, 19], role:'spa', look:L_({skin:6, hairF:'elegant', hairB:'long', hairC:'#5B3423', top:'top_dress', topC:'#FFFFFF', bottomC:'#FF8FC7', face2:null, hat:'hat_flower'}),
    greet:['Relax and glow!','Spa time!'], line:() => ({en:`Welcome to the spa, ${S.name}! What would you like today?`, vi:`Chào mừng ${S.name} đến spa! Hôm nay em muốn làm gì nào?`})}""" + t[j:]
(R / G).write_text(t, encoding="utf-8")
sub(G, "${SKIN_TONES.map((t, i) => `<button class=\"sw\" style=\"background:${t.b}\" data-act=\"cc\" data-k=\"skin\"", "${SKIN_TONES.map((t, i) => (i < BASE_SKINS || spaOwned('sk_' + t.id)) ? `<button class=\"sw\" style=\"background:${t.b}\" data-act=\"cc\" data-k=\"skin\"")
t = (R / G).read_text(encoding="utf-8")
i = t.index("${SKIN_TONES.map((t, i) => (i < BASE_SKINS"); j = t.index("</button>`).join('')", i)
t = t[:j] + "</button>` : '').join('')" + t[j + len("</button>`).join('')"):]
(R / G).write_text(t, encoding="utf-8")
sub(G, '<button class="btn sm" data-act="salon">Tiệm tóc</button>', '<button class="btn sm" data-act="salon">Tiệm tóc</button><button class="btn sm" data-act="spa">Spa</button>')

F = "farm_extra.js"
sub(F, "...HAIR_ITEMS.filter(h => h.chest && !(S.hair || []).includes(h.id)).map(hairItem => ({hairItem}))];", "...HAIR_ITEMS.filter(h => h.chest && !(S.hair || []).includes(h.id)).map(hairItem => ({hairItem})), ...SPA_ITEMS.filter(x => x.chest && !spaOwned(x.id)).map(spaItem => ({spaItem}))];")
sub(F, "  if (g.hairItem) {", "  if (g.spaItem) { const x = g.spaItem; S.spa = S.spa || []; S.spa.push(x.id); cls = 'r' + x.rar; title = `<b>${esc(x.vi)}</b> (${esc(x.en)}) · ${RARITY[x.rar].vi} · spa`; img = spaPreview(x); if (x.rar >= 4) sfx('level'); }\n  else if (g.hairItem) {")
sub(F, "${(g.item || g.hairItem) && (g.item || g.hairItem).rar >= 4 ? 'THẦN THOẠI!' : 'Mở rương!'}", "${(g.item || g.hairItem || g.spaItem) && (g.item || g.hairItem || g.spaItem).rar >= 4 ? 'THẦN THOẠI!' : 'Mở rương!'}")
sub(F, "${g.hairItem ? `<button class=\"btn\" data-act=\"hair-now\" data-id=\"${g.hairItem.id}\">Dùng luôn</button>` : ''}", "${g.hairItem ? `<button class=\"btn\" data-act=\"hair-now\" data-id=\"${g.hairItem.id}\">Dùng luôn</button>` : ''}${g.spaItem ? `<button class=\"btn\" data-act=\"spa-now\" data-id=\"${g.spaItem.id}\">Dùng luôn</button>` : ''}")
sub(F, "+ HAIR_ITEMS.filter(h => h.chest && (S.hair || []).includes(h.id)).length, total = myth.length + HAIR_ITEMS.filter(h => h.chest).length;", "+ HAIR_ITEMS.filter(h => h.chest && (S.hair || []).includes(h.id)).length + SPA_ITEMS.filter(x => x.chest && spaOwned(x.id)).length, total = myth.length + HAIR_ITEMS.filter(h => h.chest).length + SPA_ITEMS.filter(x => x.chest).length;")
sub(F, "(gồm cả kiểu tóc)", "(gồm cả kiểu tóc và spa)")

M = "main.js"
sub(M, "    case 'salon': return openSalon();", """    case 'salon': return openSalon();
    case 'spa': return openSpa();
    case 'spa-tab': SPAS.tab = d.t; SPAS.buy = null; return spaRefresh();
    case 'spa-back': SPAS.buy = null; return spaRefresh();
    case 'spa-pick': return spaPick(d.id);
    case 'spa-use': return spaUse(d.id);
    case 'spa-ans': return spaAnswer(+d.i);
    case 'spa-reset': return spaReset(d.k);
    case 'spa-now': { const x = SPA[d.id]; if (x && spaOwned(x.id)) { Object.assign(S.look, spaPatch(x, S.look)); markDirty(); renderHUD(); } return closeModal(); }""")
sub(M, "  s.hair = Array.isArray(s.hair) ? s.hair : [];", "  s.hair = Array.isArray(s.hair) ? s.hair : []; s.spa = Array.isArray(s.spa) ? s.spa : [];")
sub(M, "h = 'Gặp Chị Hà ở bảng IELTS CHALLENGE để làm thử thách IELTS hằng ngày, nhận kim cương.';", "h = 'Gặp Chị Hà ở bảng IELTS CHALLENGE để làm thử thách IELTS hằng ngày. Chị Thu ở BEAUTY SPA đổi dáng mặt, đôi mắt, nét duyên.';")

W = "world.js"
sub(W, "for (const [x, y] of [[6, 7], [25, 7], [7, 15], [24, 15], [3, 12], [28, 12]]) prop(p, 'flowers', x, y, false);", "for (const [x, y] of [[6, 7], [25, 7], [11, 17], [24, 15], [3, 12], [28, 12]]) prop(p, 'flowers', x, y, false);\n  house(p, 'spa', 3, 14, 6, 4, {sign: 'BEAUTY SPA', role: 'spa'});")
sub(W, "[[4, 4], [27, 4], [5, 17], [26, 18], [9, 20], [22, 20], [13, 3], [19, 3]]", "[[4, 4], [27, 4], [3, 20], [26, 18], [11, 21], [22, 20], [13, 3], [19, 3]]")
sub("scene.js", "  salon:  {wall:'#FFF0FB',", "  spa:    {wall:'#F0FFF8', roof:'#2DD4BF', roof2:'#1FB5A3', trim:'#C9F2E8', door:'#FF8FC7', awning:['#7EF0C4','#FFFFFF']},\n  salon:  {wall:'#FFF0FB',")

b = Path(__file__).resolve().parent / "build_html.py"; t = b.read_text(encoding="utf-8")
a = '(SRC / "fashion_extra3.js").read_text(encoding="utf-8") + "\\nconst FASH = "'
assert a in t
t = t.replace(a, '(SRC / "fashion_extra3.js").read_text(encoding="utf-8") + "\\n" + (SRC / "spa_looks.js").read_text(encoding="utf-8") + "\\nconst FASH = "')
t = t.replace('"salon.js", "cloud.js"', '"salon.js", "spa.js", "cloud.js"')
b.write_text(t, encoding="utf-8")
print("ok")
