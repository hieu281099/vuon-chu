from pathlib import Path
R = Path(__file__).resolve().parent.parent / "src"
def sub(f, a, b, count=1):
    p = R / f; t = p.read_text(encoding="utf-8")
    assert t.count(a) == count, (f, t.count(a), a[:80]); p.write_text(t.replace(a, b), encoding="utf-8")

C = "chibi.js"
sub(C, "const SLOTS = [['top','Áo'], ['bottom','Quần váy'], ['hat','Mũ'], ['face','Kính'], ['back','Lưng'], ['hand','Cầm tay'], ['aura','Hào quang'], ['pet','Thú cưng']];",
       "const SLOTS = [['top','Áo'], ['bottom','Quần váy'], ['shoes','Giày'], ['hat','Mũ'], ['face','Kính'], ['mouth','Miệng'], ['deco','Hình dán'], ['ear','Hoa tai'], ['neck','Vòng cổ'], ['back','Lưng'], ['bag','Túi'], ['hand','Cầm tay'], ['aura','Hào quang'], ['pet','Thú cưng']];")
sub(C, "const UPGRADABLE = s => ['hat','face','back','hand','aura','pet'].includes(s);", "const UPGRADABLE = s => ['hat','face','back','hand','aura','pet','mouth','deco','ear','neck','shoes','bag'].includes(s);")
sub(C, "  hat:null, face2:null, back:null, hand:null, aura:null, pet:null, lv:{}};", "  hat:null, face2:null, back:null, hand:null, aura:null, pet:null, mouth:null, deco:null, ear:null, neck:null, shoes:null, bag:null, lv:{}};")
# shoes replace the default shoe
t = (R / C).read_text(encoding="utf-8")
i = t.index("  s += `<rect x=\"${x}\" y=\"${y + 15}\" width=\"13\" height=\"3\" fill=\"#FFFFFF\"/>")
t = t[:i] + "  const sh2 = L.shoes && FASH[L.shoes]; if (sh2) { const lv2 = (L.lv || {})[L.shoes] || 0; return s + glowWrap(lv2, shoeSVG(L.shoes, sh2.col, lv2, x, y)); }\n" + t[i:]
(R / C).write_text(t, encoding="utf-8")
sub(C, "  s += `<path d=\"M55 113H90V132C90 135.3 87.3 138 84 138H61C57.7 138 55 135.3 55 132V113Z\" fill=\"${skin.b}\"/>` + topSVG(L, f) + skirtSVG(L);",
       """  s += `<path d="M55 113H90V132C90 135.3 87.3 138 84 138H61C57.7 138 55 135.3 55 132V113Z" fill="${skin.b}"/>` + topSVG(L, f) + skirtSVG(L);
  const acc = (k, fn) => L[k] && FASH[L[k]] ? glowWrap(lv[L[k]], fn(L[k], FASH[L[k]].col, lv[L[k]] || 0)) : '';
  if (!back) {
    s += acc('neck', neckSVG);
    if (L.bag && !HANDBAGS.includes(L.bag)) s += acc('bag', bagSVG);
    else if (L.bag) s += `<g transform="rotate(${f.arms ? f.arms[0] : 0} 50 116)">${acc('bag', bagSVG)}</g>`;
  }""")
sub(C, "    s += NEMO.faces[face] || NEMO.faces.smile;", "    s += NEMO.faces[face] || NEMO.faces.smile;\n    s += acc('deco', decoSVG);")
sub(C, "    if (L.face2) s += glowWrap(lv[L.face2], faceItemSVG(L.face2, FASH[L.face2].col, lv[L.face2] || 0));", "    if (L.face2) s += glowWrap(lv[L.face2], faceItemSVG(L.face2, FASH[L.face2].col, lv[L.face2] || 0));\n    s += acc('mouth', mouthSVG);")
sub(C, "  if (L.hairF && L.hairF !== 'none') s += tpl(NEMO.hairF[L.hairF], L.hairC);", "  if (L.hairF && L.hairF !== 'none') s += tpl(NEMO.hairF[L.hairF], L.hairC);\n  if (!back) s += acc('ear', earSVG);")

for f in ["game.js", "farm_extra.js"]:
    p = R / f; t = p.read_text(encoding="utf-8")
    n = t.count("['back', 'hand'].includes(f.slot)"); assert n >= 1, f
    p.write_text(t.replace("['back', 'hand'].includes(f.slot)", "['back', 'hand', 'shoes', 'bag', 'neck'].includes(f.slot)"), encoding="utf-8")

b = Path(__file__).resolve().parent / "build_html.py"; t = b.read_text(encoding="utf-8")
a = '(SRC / "fashion_extra2.js").read_text(encoding="utf-8") + "\\nconst FASH = "'
assert a in t; b.write_text(t.replace(a, '(SRC / "fashion_extra2.js").read_text(encoding="utf-8") + "\\n" + (SRC / "fashion_extra3.js").read_text(encoding="utf-8") + "\\nconst FASH = "'), encoding="utf-8")
print("ok")
