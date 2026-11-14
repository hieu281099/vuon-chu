"""Patch src/game.js: vector icons, plot menu with fertilizer, 9 animals, synonyms, open levels, world map, IELTS daily."""
from pathlib import Path
R = Path(__file__).resolve().parent
P = R.parent / "src" / "game.js"
s = P.read_text(encoding="utf-8")
def sub(old, new, cnt=1):
    global s
    assert old in s, "missing: " + old[:90]
    s = s.replace(old, new, cnt)
def between(a, b, new):
    global s
    i = s.index(a); j = s.index(b, i)
    s = s[:i] + new + s[j:]

sub("const fmt = s => { s = Math.max(0, Math.ceil(s)); if (s < 60) return s + ' giây'; const m = Math.floor(s / 60), r = s % 60; return r ? `${m} phút ${r} giây` : `${m} phút`; };",
    "const fmt = s => { s = Math.max(0, Math.ceil(s)); if (s < 60) return s + ' giây'; if (s < 3600) { const m = Math.floor(s / 60), r = s % 60; return r && m < 10 ? `${m} phút ${r} giây` : `${m} phút`; } const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return m ? `${h} giờ ${m} phút` : `${h} giờ`; };")
between("/* item icons drawn from LPC sheets", "const itemImg = ",
        "/* item icons (flat vector) */\nfunction iconURL(id) { return produceSVG(id); }\n")
sub("animals: [{t: 'chicken', st: 'hungry', r: 0}, null, null, null, null, null],",
    "animals: [{t: 'chicken', st: 'hungry', r: 0}, null, null, null, null, null, null, null, null],")
# animals list: vector picture, 9 slots
sub("if (free < 0) return `<p class=\"note\">Chuồng đã đủ 6 con.</p>`;", "if (free < 0) return `<p class=\"note\">Chuồng đã đủ 9 con.</p>`;")
s = s.replace('<span class="ri-ani" style="background-image:url(assets/world/${A.id}_walk.png)"></span>', '<img class="ii" src="${svgURL(animalDef(A.id, 0).svg)}" alt="">')
# spawn animals in the bigger pen
between("function spawnAnimals() {", "function queueFx(", """function spawnAnimals() {
  const pen = MAPS.farm.pen;
  ANIMS = S.animals.map((a, i) => a ? (ANIMS[i] && ANIMS[i].t === a.t ? ANIMS[i] : {t: a.t, x: pen.x0 + 30 + (i % 5) * 80, y: pen.y0 + 20 + Math.floor(i / 5) * 70, tx: 0, ty: 0, wait: Math.random() * 3, dir: i % 2 ? 'l' : 'r', phase: 0}) : null);
}
""")
# growing plot -> plot menu
sub("  const growLeft = (1 - p.p) * c.time, wetLeft = (p.w - now) / 1000; speak(c.en, true);",
    "  speak(c.en, true); return openPlotMenu(i);\n  const growLeft = (1 - p.p) * c.time, wetLeft = (p.w - now) / 1000;")
sub("function openPlant(i) {", r'''function openPlotMenu(i) {
  const p = S.plots[i], c = CROP[p.c], now = Date.now(), left = (1 - p.p) * c.time, wet = Math.max(0, (p.w - now) / 1000);
  const fert = p.f || 0, man = S.inv.manure || 0;
  openModal(`<div class="plotcard"><img class="pv" src="${produceSVG(c.id)}" alt=""><div><h2 class="ptitle">${esc(c.en)} <small>${esc(c.vi)}</small></h2>
    <div class="growbar"><i style="width:${Math.round(p.p * 100)}%"></i></div><p class="note">Còn khoảng <b>${fmt(left)}</b> nữa là chín. ${wet > 0 ? `Đất còn ẩm ${fmt(wet)}.` : '<b>Đất đang khô</b>, cây ngừng lớn.'}</p></div></div>
    <div class="row-btns"><button class="btn" data-act="fert-q" data-p="${i}" ${fert >= 3 ? 'disabled' : ''}>Bón phân bằng 1 câu hỏi (-25% thời gian) · còn ${3 - fert} lượt</button>
    <button class="btn gold" data-act="fert-m" data-p="${i}" ${man ? '' : 'disabled'}>Dùng phân trâu (-50%) · có ${man}</button></div>
    <p class="note">Phân trâu lấy từ con trâu trong chuồng. Cây trồng lâu như ngoài đời, quay lại sau vài giờ là có thu hoạch.</p>`, {label: 'Ô ruộng'});
}
function fertilize(i, useManure) {
  const p = S.plots[i]; if (!p || !p.c || p.p >= 1) return;
  if (useManure) { if (!(S.inv.manure > 0)) return; S.inv.manure--; p.p = Math.min(1, p.p + (1 - p.p) * 0.5); closeModal(); sfx('water'); queueFx({kind: 'spark', ...plotCenter(i)}); toast('Đã bón phân trâu, cây lớn nhanh gấp đôi.'); markDirty(); return; }
  if ((p.f || 0) >= 3) return;
  startQuiz({tag: 'Bón phân', onResult: ok => { if (!ok) return 'Chưa bón được. Thử câu khác nhé.'; p.f = (p.f || 0) + 1; p.p = Math.min(1, p.p + (1 - p.p) * 0.25); queueFx({act: 'hoe'}); queueFx({kind: 'spark', ...plotCenter(i)}); return 'Đã bón phân, thời gian chờ giảm 25%.'; }});
}
function openPlant(i) {''')
sub("Object.assign(p, {c: null, p: 0, w: 0, weed: false, hw: false});\n    queueFx({act: 'harvest'});", "Object.assign(p, {c: null, p: 0, w: 0, weed: false, hw: false, f: 0});\n    queueFx({act: 'harvest'});")
# synonym questions
sub("  if (m >= 2) { t.push('spell', 'fill'); if (voiceOK()) t.push('listen'); }\n  return rand(t);",
    "  if (m >= 2) { t.push('spell', 'fill'); if (voiceOK()) t.push('listen'); }\n  if (w.syn) t.push('syn', 'syn');\n  return rand(t);")
sub("    const key = type === 'en2vi' ? 'vi' : 'en';\n    q.options = shuffle([w, ...distractors(w, 3)]).map(x => x[key]); q.correct = w[key];",
    "    if (type === 'syn') { const others = shuffle(Object.values(WORDS).filter(x => x.syn && x.syn !== w.syn && x.en !== w.syn)).slice(0, 3).map(x => x.syn); q.options = shuffle([w.syn, ...others]); q.correct = w.syn; }\n    else { const key = type === 'en2vi' ? 'vi' : 'en'; q.options = shuffle([w, ...distractors(w, 3)]).map(x => x[key]); q.correct = w[key]; }")
sub("  if (type === 'en2vi') p = `<p class=\"q-ask\">Từ này nghĩa là gì?</p>",
    "  if (type === 'syn') p = `<p class=\"q-ask\">Paraphrase: chọn từ đồng nghĩa gần nhất (dạng hay gặp trong IELTS)</p><div class=\"q-word\">${esc(w.en)} ${sayBtn(w.en)}</div><div class=\"q-sent\">${esc(w.ex)}</div>`;\n  if (type === 'en2vi') p = `<p class=\"q-ask\">Từ này nghĩa là gì?</p>")
# forge: horseshoe luck
sub("const bonus = FORGE.quiz === true ? 15 : 0, chance", "const bonus = (FORGE.quiz === true ? 15 : 0) + (FORGE.shoe ? 10 : 0), chance")
sub("const chance = Math.min(100, cost.ch + (FORGE.quiz === true ? 15 : 0)), ok", "const shoe = FORGE.shoe && S.inv.horseshoe > 0; if (shoe) S.inv.horseshoe--; const chance = Math.min(100, cost.ch + (FORGE.quiz === true ? 15 : 0) + (shoe ? 10 : 0)), ok")
sub("FORGE.quiz = null; refreshNpc(); renderHUD(); markDirty(); saveNow(true);", "FORGE.quiz = null; FORGE.shoe = false; refreshNpc(); renderHUD(); markDirty(); saveNow(true);")
sub("<button class=\"btn gold\" data-act=\"forge-go\"", "${S.inv.horseshoe > 0 ? `<button class=\"btn ghost\" data-act=\"forge-shoe\" aria-pressed=\"${!!FORGE.shoe}\">${FORGE.shoe ? 'Đã dùng' : 'Dùng'} móng ngựa may mắn (+10%) · có ${S.inv.horseshoe}</button>` : ''}<button class=\"btn gold\" data-act=\"forge-go\"")
# study: all levels open, IELTS band names
sub("const open = unlocked.includes(lv); return `<button class=\"chip\" data-act=\"level\" data-t=\"${lv}\" aria-pressed=\"${level === lv}\" ${open ? '' : 'disabled'}>${lv} · ${LEVEL_VI[lv]}${open ? '' : ' (thi để mở)'}</button>`;",
    "return `<button class=\"chip\" data-act=\"level\" data-t=\"${lv}\" aria-pressed=\"${level === lv}\">${lv} · ${track === 'ielts' ? IELTS_BAND[lv] : LEVEL_VI[lv]}</button>`;")
P.write_text(s, encoding="utf-8")
print("ok")
