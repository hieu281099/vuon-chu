"""Patch src/data.js: long crop times, 9 animals, IELTS track with synonyms, all levels open."""
from pathlib import Path
R = Path(__file__).resolve().parent
P = R.parent / "src" / "data.js"
s = P.read_text(encoding="utf-8")
farm = (R / "patch_parts" / "farmdata.js").read_text(encoding="utf-8")
ielts = (R / "patch_parts" / "ielts.js").read_text(encoding="utf-8")
a = s.index("const CROPS = ["); b = s.index("const NAMES = ")
s = s[:a] + farm + s[b:]
a = s.index("  it: {vi: 'Công nghệ thông tin'")
s = s[:a] + ielts + s[a:]
s = s.replace("TRACK_WORDS[tid][lv] = list.map(([en, vi, ex]) => {\n      const w = {key: tid + ':' + en, en, vi, ex, track: tid, level: lv};",
              "TRACK_WORDS[tid][lv] = list.map(([en, vi, ex, syn]) => {\n      const w = {key: tid + ':' + en, en, vi, ex, syn, track: tid, level: lv};")
assert "syn, track" in s
s = s.replace("const LEVEL_GATE = {A1: 1, A2: 3, B1: 6, B2: 10, C1: 15};",
              "const LEVEL_GATE = {A1: 1, A2: 1, B1: 1, B2: 1, C1: 1};\nconst IELTS_BAND = {A1: 'Nền tảng', A2: 'Band 4.0–4.5', B1: 'Band 5.0–5.5', B2: 'Band 6.0–6.5', C1: 'Band 7.0+'};")
P.write_text(s, encoding="utf-8")
print("ok")
