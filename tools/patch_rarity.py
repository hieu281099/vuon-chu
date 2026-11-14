from pathlib import Path
R = Path(__file__).resolve().parent.parent / "src"
def sub(f, a, b, count=1):
    p = R / f; t = p.read_text(encoding="utf-8")
    assert t.count(a) == count, (f, t.count(a), a[:80]); p.write_text(t.replace(a, b), encoding="utf-8")
def fallback(f, fn, call):
    p = R / f; t = p.read_text(encoding="utf-8"); i = t.index(f"function {fn}("); j = t.index("\n  return '';\n}", i)
    p.write_text(t[:j] + f"\n  return {call};\n}}" + t[j + len("\n  return '';\n}"):], encoding="utf-8")

sub("chibi.js", "const head = shaped ? SHAPE_EARS(skin) + FACE_SHAPES[L.shape](skin.b)", "const head = shaped ? (FACE_EARS[L.shape] || SHAPE_EARS)(skin) + FACE_SHAPES[L.shape](skin.b)")
sub("chibi.js", "function skirtSVG(L) { if (DRESSES.includes(L.top)) return ''; const k = L.bottomC;", "function skirtSVG(L) { if (DRESSES.includes(L.top)) return ''; if (BOTTOM_ART[L.bottom]) return BOTTOM_ART[L.bottom](L); const k = L.bottomC;")
sub("spa_looks.js", "    if (fs.includes('lashes')) s +=", "    s += FEAT_EXTRA(fs, skin);\n    if (fs.includes('lashes')) s +=")
fallback("fashion_extra2.js", "extraFace2", "extraFace3(id, c, lv)")
fallback("fashion_extra2.js", "extraHand2", "extraHand3(id, c, lv)")
for fn, call in [("mouthSVG", "mouth3(id, c, lv)"), ("decoSVG", "deco3(id, c, lv)"), ("earSVG", "ear3(id, c, lv)"), ("neckSVG", "neck3(id, c, lv)"), ("shoeSVG", "shoe3(id, c, lv, x, y)"), ("bagSVG", "bag3(id, c, lv)")]:
    fallback("fashion_extra3.js", fn, call)
b = Path(__file__).resolve().parent / "build_html.py"; t = b.read_text(encoding="utf-8")
a = '(SRC / "fashion_extra3.js").read_text(encoding="utf-8") + "\\n" + (SRC / "spa_looks.js")'
assert a in t
b.write_text(t.replace(a, '(SRC / "fashion_extra3.js").read_text(encoding="utf-8") + "\\n" + (SRC / "fashion_extra4.js").read_text(encoding="utf-8") + "\\n" + (SRC / "spa_looks.js")'), encoding="utf-8")
print("ok")
