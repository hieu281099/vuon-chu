from pathlib import Path
R = Path(__file__).resolve().parent.parent / "src"
def sub(f, a, b, count=1):
    p = R / f; t = p.read_text(encoding="utf-8")
    assert t.count(a) == count, (f, t.count(a), a[:90]); p.write_text(t.replace(a, b), encoding="utf-8")

C = "chibi.js"
# 4-phase idle loop with continuous wing flapping; every frame carries its phase
sub(C, "  idle0: {}, idle1: {bob: 1, flap: 6}, blink: {face: 'sleepy'},",
       "  idle0: {flap: 0, ph: 0}, idle1: {bob: 1, flap: 10, ph: 1}, idle2: {bob: 1, flap: 18, ph: 2}, idle3: {flap: 10, ph: 3}, blink: {face: 'sleepy', flap: 8, ph: 1},")
sub(C, "  walk0: {legs: [-4, 0], bob: -2, arms: [14, -14], flap: 12}, walk1: {legs: [0, 0], bob: 0, arms: [0, 0], flap: 0},",
       "  walk0: {legs: [-4, 0], bob: -2, arms: [14, -14], flap: 14, ph: 0}, walk1: {legs: [0, 0], bob: 0, arms: [0, 0], flap: 2, ph: 1},")
sub(C, "  walk2: {legs: [0, -4], bob: -2, arms: [-14, 14], flap: -10}, walk3: {legs: [0, 0], bob: 0, arms: [0, 0], flap: 4},",
       "  walk2: {legs: [0, -4], bob: -2, arms: [-14, 14], flap: -10, ph: 2}, walk3: {legs: [0, 0], bob: 0, arms: [0, 0], flap: 4, ph: 3},")
sub(C, "  const skin = SKIN_TONES[L.skin] || SKIN_TONES[0], lv = L.lv || {}, back = dir === 'u';", "  ANIM_PH = f.ph || 0;\n  const skin = SKIN_TONES[L.skin] || SKIN_TONES[0], lv = L.lv || {}, back = dir === 'u';")
# every equipped item gets its special tier art and animation
sub(C, "tierWrap('back', lv[L.back] || 0, backSVG(L.back, FASH[L.back].col, lv[L.back] || 0, f.flap || 0, back), f.flap)", "tierWrap('back', lv[L.back] || 0, itemFx(L.back, lv[L.back] || 0, backSVG(L.back, FASH[L.back].col, lv[L.back] || 0, f.flap || 0, back)), f.flap)")
sub(C, "tierWrap('hand', lv[L.hand] || 0, handSVG(L.hand, FASH[L.hand].col, lv[L.hand] || 0), f.flap)", "tierWrap('hand', lv[L.hand] || 0, itemFx(L.hand, lv[L.hand] || 0, handSVG(L.hand, FASH[L.hand].col, lv[L.hand] || 0)), f.flap)")
sub(C, "tierWrap(k, lv[L[k]] || 0, fn(L[k], FASH[L[k]].col, lv[L[k]] || 0), f.flap)", "tierWrap(k, lv[L[k]] || 0, itemFx(L[k], lv[L[k]] || 0, fn(L[k], FASH[L[k]].col, lv[L[k]] || 0)), f.flap)")
sub(C, "tierWrap('face', lv[L.face2] || 0, faceItemSVG(L.face2, FASH[L.face2].col, lv[L.face2] || 0), f.flap)", "tierWrap('face', lv[L.face2] || 0, itemFx(L.face2, lv[L.face2] || 0, faceItemSVG(L.face2, FASH[L.face2].col, lv[L.face2] || 0)), f.flap)")
sub(C, "tierWrap('hat', lv[L.hat] || 0, hatSVG(L.hat, FASH[L.hat].col, lv[L.hat] || 0), f.flap)", "tierWrap('hat', lv[L.hat] || 0, itemFx(L.hat, lv[L.hat] || 0, hatSVG(L.hat, FASH[L.hat].col, lv[L.hat] || 0)), f.flap)")
# always face the front (Avatar style): walking up still shows the face
sub(C, "let im = chibiImage(L, frame, dir === 'u' ? 'u' : dir === 'l' ? 'l' : 'd', px);", "let im = chibiImage(L, frame, dir === 'l' ? 'l' : 'd', px);")

T = "tiers.js"
sub(T, "off = (tw || 0) * 0.04;", "off = ANIM_PH * 0.5;")
sub(T, "const CAN_UPGRADE = f => !!f && UPGRADABLE(f.slot) && (f.rar || 0) >= 2;", "const CAN_UPGRADE = f => !!f && UPGRADABLE(f.slot) && ((f.rar || 0) >= 2 || SPECIAL_UP.includes(f.id));")
# little hat wings flap too
sub(T, "  let s = wing(26, -1) + wing(119, 1);", "  let s = `<g transform=\"rotate(${-PH([0, 6, 10, 6])} 26 42)\">${wing(26, -1)}</g><g transform=\"rotate(${PH([0, 6, 10, 6])} 119 42)\">${wing(119, 1)}</g>`;")

# idle animation runs as a 4-frame loop
sub("render.js", "  return (tnow + seed) % 1400 < 700 ? 'idle0' : 'idle1';", "  return 'idle' + (Math.floor((tnow + seed) / 280) % 4);")

# mark the specially upgradable commons in the shop and forge
G = "game.js"
sub(G, "CAN_UPGRADE(f) ? '<span class=\"upg\">Nâng cấp +6</span>' : ''}", "CAN_UPGRADE(f) ? `<span class=\"upg\">${(f.rar || 0) < 2 ? 'Đặc cách +6' : 'Nâng cấp +6'}</span>` : ''}")
sub(G, "Chỉ đồ <b>Sử thi trở lên</b> mới nâng cấp được, mỗi cấp thêm hiệu ứng mới.", "Chỉ đồ <b>Sử thi trở lên</b> và vài món <b>đặc cách</b> mới nâng cấp được, mỗi cấp thêm hiệu ứng mới.")

b = Path(__file__).resolve().parent / "build_html.py"; t = b.read_text(encoding="utf-8")
a = '(SRC / "tiers.js").read_text(encoding="utf-8") + "\\nconst FASH = "'
assert a in t
b.write_text(t.replace(a, '(SRC / "tiers.js").read_text(encoding="utf-8") + "\\n" + (SRC / "anim.js").read_text(encoding="utf-8") + "\\nconst FASH = "'), encoding="utf-8")
print("ok")
