"""One-off patch: replace shop / wardrobe / creator sections of src/game.js and add the forge."""
from pathlib import Path
P = Path(__file__).resolve().parent.parent / "src" / "game.js"
s = P.read_text(encoding="utf-8")
NEW = (Path(__file__).resolve().parent / "patch_parts").glob("*.js")
parts = {p.stem: p.read_text(encoding="utf-8") for p in NEW}

def repl(start, end, new):
    global s
    a = s.index(start); b = s.index(end, a)
    s = s[:a] + new + s[b:]

repl("function shopHTML() {", "function teacherHTML() {", parts["shop"])
repl("let WARD = null;", "async function openBoard()", parts["ward"])
a = s.index("/* ===================== CHARACTER CREATOR")
s = s[:a] + parts["creator"]
P.write_text(s, encoding="utf-8")
print("patched")
