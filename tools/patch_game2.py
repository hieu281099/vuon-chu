"""Small targeted edits to src/game.js for gems, forge routing and rewards."""
from pathlib import Path
P = Path(__file__).resolve().parent.parent / "src" / "game.js"
s = P.read_text(encoding="utf-8")
def sub(old, new, count=1):
    global s
    assert old in s, "missing: " + old[:70]
    s = s.replace(old, new, count)

sub("const coinIcon = '<i class=\"ico coin\" aria-hidden=\"true\"></i>';",
    "const coinIcon = '<i class=\"ico coin\" aria-hidden=\"true\"></i>';\nconst gemIcon = k => `<i class=\"ico ${k}\" aria-hidden=\"true\"></i>`;")
sub("  if (role === 'seeds') return seedsHTML();", "  if (role === 'seeds') return seedsHTML();\n  if (role === 'forge') return forgeHTML();")
sub("wide: D.role === 'shop',", "wide: D.role === 'shop' || D.role === 'forge',")
sub("if (S.streak % 5 === 0) { S.coins += 10; setTimeout(() => toast(`<b>Chuỗi ${S.streak} câu đúng!</b> Thưởng 10 xu.`), 200); }",
    "if (S.streak % 5 === 0) { S.coins += 10; giveGems(1, S.streak % 20 === 0 ? 1 : 0, `chuỗi ${S.streak} câu đúng`); }")
sub("    queueFx({kind: 'spark', who: 'player'}); saveNow(true);",
    "    queueFx({kind: 'spark', who: 'player'}); giveGems(3, S.lvl % 5 === 0 ? 1 : 0, 'lên cấp ' + S.lvl); saveNow(true);")
sub("  S.coins += o.coins; addXP(o.xp); sfx('coin');", "  S.coins += o.coins; addXP(o.xp); sfx('coin'); if (Math.random() < 0.35) giveGems(1, 0, 'quà của khách');")
sub("      if (pass) { S.study.level = lv; S.coins += 50; addXP(40); sfx('level'); }",
    "      if (pass) { S.study.level = lv; S.coins += 50; addXP(40); sfx('level'); giveGems(5, 1, 'thi đậu ' + lv); }")
sub("    } else openModal(`<h2 class=\"ptitle\">Xong bài học</h2>",
    "    } else { if (L.ok >= 4) giveGems(2, 0, 'học tốt'); } if (!L.test) openModal(`<h2 class=\"ptitle\">Xong bài học</h2>")
sub("S.inv[id] = (S.inv[id] || 0) + 1; S.caught = true; S.stats.fish++; addXP(4);",
    "S.inv[id] = (S.inv[id] || 0) + 1; S.caught = true; S.stats.fish++; addXP(4); if (id === 'bigfish') giveGems(0, 1, 'cá ngừ quý');")
P.write_text(s, encoding="utf-8")
print("ok")
