"""Patch src/main.js for the vector world: plot/animal/house input, new actions, 9 pens, map travel."""
from pathlib import Path
R = Path(__file__).resolve().parent
P = R.parent / "src" / "main.js"
s = P.read_text(encoding="utf-8")
def sub(old, new, cnt=1):
    global s
    assert old in s, "missing: " + old[:90]
    s = s.replace(old, new, cnt)
def between(a, b, new):
    global s
    i = s.index(a); j = s.index(b, i)
    s = s[:i] + new + s[j:]

between("  if (m.id === 'farm') {\n    for (let i = 0; i < ANIMS.length; i++)", "  if (T_(m, tx, ty) === 'w')", r'''  if (m.id === 'farm') {
    for (let i = 0; i < ANIMS.length; i++) { const a = ANIMS[i]; if (!a) continue; const [aw, ah] = ANI_SIZE[a.t]; if (Math.abs(wx - a.x) < aw / 2 && wy > a.y - ah && wy < a.y + 6) { const [ax, ay] = tileOf(a.x, a.y); return approach(ax, ay, 99, () => onAnimal(i)); } }
    const pi = m.plots.findIndex(([px, py]) => px === tx && (py === ty || (py === ty + 1 && wy > py * TS - 16)));
    if (pi >= 0 && (S.plots[pi].u || nextLocked() === pi)) { const [px, py] = m.plots[pi]; return approach(px, py, 3.2, () => onPlot(pi)); }
  }
  for (const o of m.objs) {
    if (o.t === 'house' && tx >= o.x && tx < o.x + o.tw && ty >= o.y && ty < o.y + o.th) {
      if (o.role === 'home') return approach(o.door[0], o.door[1], 1.6, () => { speak('home', true); openWardrobe(); });
      const n = o.role && NPCS.find(q => q.def.role === o.role);
      if (n) { const [nx, ny] = tileOf(n.x, n.y); return approach(nx, ny, 1.6, () => talk(n), true); }
      if (o.sign) { speak(o.sign.toLowerCase(), true); toast(`<b>${esc(o.sign)}</b>`); }
      return approach(o.door[0], o.door[1], 99, null);
    }
    if ((o.t === 'sign' || (o.t === 'prop' && /^stall/.test(o.kind))) && Math.abs(tx - o.x) <= 1 && Math.abs(ty - o.y) <= 1) { const n = NPCS.find(q => q.def.role === 'market'); if (n) { const [nx, ny] = tileOf(n.x, n.y); return approach(nx, ny, 1.6, () => talk(n), true); } }
    if (o.t === 'prop' && o.kind === 'board' && Math.abs(tx - o.x) <= 1 && ty >= o.y - 1 && ty <= o.y) {
      if (m.id === 'park') { const n = NPCS.find(q => q.def.role === 'ielts'); if (n) { const [nx, ny] = tileOf(n.x, n.y); return approach(nx, ny, 1.6, () => talk(n), true); } }
      return approach(o.x, o.y + 1, 1.6, () => openBoard());
    }
  }
''')
sub("    case 'q-next': if (LESSON) { LESSON.advancing = true; closeModal(); LESSON.advancing = false; lessonNext(); } else closeModal(); return;",
    "    case 'q-next': if (LESSON) { LESSON.advancing = true; closeModal(); LESSON.advancing = false; lessonNext(); } else if (Q && Q.opt.onNext) { const nx = Q.opt.onNext; closeModal(); nx(); } else closeModal(); return;\n    case 'fert-q': closeModal(); return fertilize(+d.p, false);\n    case 'fert-m': return fertilize(+d.p, true);\n    case 'forge-shoe': FORGE.shoe = !FORGE.shoe; return refreshNpc();\n    case 'ielts-band': S.ieltsBand = d.t; markDirty(); return refreshNpc();\n    case 'ielts-go': return startIelts();\n    case 'map': return openMap();\n    case 'travel': return travel(d.t);")
sub("    case 'level': if (S.study.unlocked.includes(d.t)) { S.study.level = d.t; markDirty(); renderHUD(); openStudy(); } return;",
    "    case 'level': S.study.level = d.t; if (!S.study.unlocked.includes(d.t)) S.study.unlocked.push(d.t); markDirty(); renderHUD(); return openStudy();")
sub("  while (s.animals.length < 6) s.animals.push(null);", "  while (s.animals.length < 9) s.animals.push(null);\n  for (const a of s.animals) if (a && !ANIMAL[a.t]) a.t = 'chicken';")
sub("  $('#hud-study').textContent = `${TRACKS[S.study.track].vi} · ${S.study.level}`;",
    "  $('#hud-study').textContent = `${TRACKS[S.study.track].vi} · ${S.study.track === 'ielts' ? IELTS_BAND[S.study.level] : S.study.level}`;")
P.write_text(s, encoding="utf-8")
print("ok")
