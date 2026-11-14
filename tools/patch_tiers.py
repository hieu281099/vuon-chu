from pathlib import Path
R = Path(__file__).resolve().parent.parent / "src"
def sub(f, a, b, count=1):
    p = R / f; t = p.read_text(encoding="utf-8")
    assert t.count(a) == count, (f, t.count(a), a[:90]); p.write_text(t.replace(a, b), encoding="utf-8")

C = "chibi.js"
sub(C, "  const pair = (inner, ax, ay) => `<g transform=\"translate(${ax + 6} ${ay - 6}) rotate(${-flap}) scale(1.3)\">${inner}</g><g transform=\"translate(${145 - ax - 6} ${ay - 6}) scale(-1 1) rotate(${-flap}) scale(1.3)\">${inner}</g>`;",
       "  const pair = (inner, ax, ay) => wingStack(inner, lv, (body, k) => `<g transform=\"translate(${ax + 6} ${ay - 6}) rotate(${-flap}) scale(${k})\">${body}</g><g transform=\"translate(${145 - ax - 6} ${ay - 6}) scale(-1 1) rotate(${-flap}) scale(${k})\">${body}</g>`);")
sub(C, "const backItem = L.back ? glowWrap(lv[L.back], backSVG(L.back, FASH[L.back].col, lv[L.back] || 0, f.flap || 0, back)) : '';",
       "const backItem = L.back ? tierWrap('back', lv[L.back] || 0, backSVG(L.back, FASH[L.back].col, lv[L.back] || 0, f.flap || 0, back), f.flap) : '';")
sub(C, "(L.hand ? glowWrap(lv[L.hand], handSVG(L.hand, FASH[L.hand].col, lv[L.hand] || 0)) : '')",
       "(L.hand ? tierWrap('hand', lv[L.hand] || 0, handSVG(L.hand, FASH[L.hand].col, lv[L.hand] || 0), f.flap) : '')")
sub(C, "const acc = (k, fn) => L[k] && FASH[L[k]] ? glowWrap(lv[L[k]], fn(L[k], FASH[L[k]].col, lv[L[k]] || 0)) : '';",
       "const acc = (k, fn) => L[k] && FASH[L[k]] ? tierWrap(k, lv[L[k]] || 0, fn(L[k], FASH[L[k]].col, lv[L[k]] || 0), f.flap) : '';")
sub(C, "if (L.face2) s += glowWrap(lv[L.face2], faceItemSVG(L.face2, FASH[L.face2].col, lv[L.face2] || 0));",
       "if (L.face2) s += tierWrap('face', lv[L.face2] || 0, faceItemSVG(L.face2, FASH[L.face2].col, lv[L.face2] || 0), f.flap);")
sub(C, "if (L.hat) s += glowWrap(lv[L.hat], hatSVG(L.hat, FASH[L.hat].col, lv[L.hat] || 0));",
       "if (L.hat) s += tierWrap('hat', lv[L.hat] || 0, hatSVG(L.hat, FASH[L.hat].col, lv[L.hat] || 0), f.flap) + hatAccent(lv[L.hat] || 0);")
t = (R / C).read_text(encoding="utf-8")
a = "  s += legSVG(L, 59, f.legs ? f.legs[0] : 0, skin) + legSVG(L, 73, f.legs ? f.legs[1] : 0, skin);"
assert t.count(a) == 1
t = t.replace(a, "  const shoeLv = L.shoes ? (lv[L.shoes] || 0) : 0;\n  s += tierBehind('shoes', shoeLv) + legSVG(L, 59, f.legs ? f.legs[0] : 0, skin) + legSVG(L, 73, f.legs ? f.legs[1] : 0, skin) + tierFront('shoes', shoeLv, f.flap);")
(R / C).write_text(t, encoding="utf-8")
sub(C, "return `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -12 60 72\" width=\"120\" height=\"144\">${RB_DEF}${glow}${body}${lv ? bow : ''}${crown}</svg>`;",
       "const pt = petTier(lv, hop);\n  return `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"-6 -16 72 78\" width=\"132\" height=\"143\">${RB_DEF}${glow}${pt.back}${body}${lv ? bow : ''}${crown}${pt.front}</svg>`;")
# auras: extra ring from +3, light pillars from +5
sub(C, "  g.save(); g.globalAlpha = 0.35 + lv * 0.05; g.fillStyle = col; g.beginPath(); g.ellipse(x, y, r, r * 0.38, 0, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;",
       """  g.save(); g.globalAlpha = 0.35 + lv * 0.05; g.fillStyle = col; g.beginPath(); g.ellipse(x, y, r, r * 0.38, 0, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;
  if (lv >= 3) { g.strokeStyle = col; g.lineWidth = 1.2; g.globalAlpha = 0.7; g.beginPath(); g.ellipse(x, y, r * 1.35, r * 0.52, 0, 0, Math.PI * 2); g.stroke(); g.globalAlpha = 1; }
  if (lv >= 5) { for (let k = 0; k < 3; k++) { const px = x + (k - 1) * r * 0.8, h = 34 + lv * 6, gr = g.createLinearGradient(px, y, px, y - h); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.globalAlpha = 0.35 + 0.15 * Math.sin(t / 300 + k); g.fillStyle = gr; g.fillRect(px - 2.5, y - h, 5, h); } g.globalAlpha = 1; }""")

# forge: only Epic+ items; each tier cell says what it adds; shop cards tag upgradable items
G = "game.js"
sub(G, "const all = FASHION.filter(f => UPGRADABLE(f.slot) && (f.price > 0 || f.chest || own(f.id)));", "const all = FASHION.filter(f => CAN_UPGRADE(f) && (f.price > 0 || f.chest || own(f.id)));")
sub(G, "const slots = SLOTS.filter(([k]) => UPGRADABLE(k));", "const slots = SLOTS.filter(([k]) => all.some(m => m.slot === k));")
sub(G, "<small>${l ? TIER_VI[l] : 'Thường'}</small></div>", "<small>${l ? TIER_VI[l] : 'Thường'}</small><em class=\"perk\">${TIER_PERK[l]}</em></div>")
sub(G, "Bạn có <b>${mine.length}/${all.length}</b> món nâng cấp được.", "Chỉ đồ <b>Sử thi trở lên</b> mới nâng cấp được, mỗi cấp thêm hiệu ứng mới. Bạn có <b>${mine.length}/${all.length}</b> món nâng cấp được.")
sub(G, "  const f = FASH[FORGE.id]; if (!f || !S.owned.includes(f.id)) return; S.look.lv = S.look.lv || {};", "  const f = FASH[FORGE.id]; if (!f || !S.owned.includes(f.id) || !CAN_UPGRADE(f)) return; S.look.lv = S.look.lv || {};")
sub(G, "<span class=\"rar\">${RARITY[f.rar || 0].vi}</span>${lv ? `<span class=\"plus t${lv}\">+${lv}</span>` : ''}", "<span class=\"rar\">${RARITY[f.rar || 0].vi}</span>${lv ? `<span class=\"plus t${lv}\">+${lv}</span>` : CAN_UPGRADE(f) ? '<span class=\"upg\">Nâng cấp +6</span>' : ''}")
sub("main.js", "const list = FASHION.filter(f => f.slot === d.t && UPGRADABLE(f.slot) && (f.price > 0 || f.chest || S.owned.includes(f.id)));", "const list = FASHION.filter(f => f.slot === d.t && CAN_UPGRADE(f) && (f.price > 0 || f.chest || S.owned.includes(f.id)));")
# a forge selection that is no longer upgradable falls back to the first valid one
sub(G, "  if (!FORGE || !FASH[FORGE.id]) { const first", "  if (FORGE && FASH[FORGE.id] && !CAN_UPGRADE(FASH[FORGE.id])) FORGE = null;\n  if (!FORGE || !FASH[FORGE.id]) { const first")

(R / "style.css").write_text((R / "style.css").read_text(encoding="utf-8") + """
.tcell .perk{font-style:normal;font-size:9.5px;line-height:1.25;color:var(--ink);text-align:center;padding:0 3px;min-height:2.5em}
.card .upg{position:absolute;top:8px;right:8px;font-size:9.5px;font-weight:900;color:#fff;background:linear-gradient(90deg,#7c5cff,#ff6fb5);border-radius:99px;padding:1px 6px}
.card .hot + .upg{top:28px}
""", encoding="utf-8")

b = Path(__file__).resolve().parent / "build_html.py"; t = b.read_text(encoding="utf-8")
a = '(SRC / "spa_looks.js").read_text(encoding="utf-8") + "\\nconst FASH = "'
assert a in t
b.write_text(t.replace(a, '(SRC / "spa_looks.js").read_text(encoding="utf-8") + "\\n" + (SRC / "tiers.js").read_text(encoding="utf-8") + "\\nconst FASH = "'), encoding="utf-8")
print("ok")
