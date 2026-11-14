"""Bundle src/ into dist/index.html (artifact page body) and dist/test.html (standalone, for local testing).

python -I tools/build_html.py
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC, DIST = ROOT / "src", ROOT / "dist"
ORDER = ["gen_nemo.js", "data.js", "chibi.js", "scene.js", "engine.js", "world.js", "game.js", "farm_extra.js", "npc_gear.js", "level.js", "salon.js", "spa.js", "cloud.js", "tests_data.js", "tests.js", "render.js", "minimap.js", "main.js"]
def src(f):
    t = (SRC / f).read_text(encoding="utf-8")
    if f == "data.js":  # merge the expanded vocabulary before the word index is built
        t = t.replace("const WORDS = {};", (SRC / "vocab_extra.js").read_text(encoding="utf-8") + "\nconst WORDS = {};", 1)
    if f == "chibi.js":  # hot items, hairstyles and mythic gear, added before the FASH index is built
        t = t.replace("const FASH = ", (SRC / "fashion_extra.js").read_text(encoding="utf-8") + "\n" + (SRC / "fashion_extra2.js").read_text(encoding="utf-8") + "\n" + (SRC / "fashion_extra3.js").read_text(encoding="utf-8") + "\n" + (SRC / "fashion_extra4.js").read_text(encoding="utf-8") + "\n" + (SRC / "spa_looks.js").read_text(encoding="utf-8") + "\n" + (SRC / "tiers.js").read_text(encoding="utf-8") + "\n" + (SRC / "anim.js").read_text(encoding="utf-8") + "\nconst FASH = ", 1)
    return t
js = "(() => {\n'use strict';\n" + "\n".join(src(f) for f in ORDER) + "\n})();"
css = (SRC / "style.css").read_text(encoding="utf-8")
page = (SRC / "index.html").read_text(encoding="utf-8").replace("{{CSS}}", css).replace("{{JS}}", js)
DIST.mkdir(exist_ok=True)
(DIST / "index.html").write_text(page, encoding="utf-8")
(DIST / "test.html").write_text('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>' + page + "</body></html>", encoding="utf-8")
print("dist/index.html", len(page) // 1024, "KB")
# GitHub Pages copy of the web version (served from /docs on main)
(ROOT / "docs").mkdir(exist_ok=True)
(ROOT / "docs" / "index.html").write_text((DIST / "test.html").read_text(encoding="utf-8"), encoding="utf-8")
(ROOT / "docs" / ".nojekyll").write_text("", encoding="utf-8")
