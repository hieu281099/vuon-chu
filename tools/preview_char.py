"""Compose test characters from dist/assets the same way the game does, for visual checks.

python -I tools/preview_char.py out.png
"""
import json
import sys
from pathlib import Path

from PIL import Image

A = Path(__file__).resolve().parent.parent / "dist" / "assets"
M = json.loads((A / "manifest.json").read_text(encoding="utf-8"))

def hexrgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def recolor(im, mat, variant):
    if not mat or not variant:
        return im
    pal = M["palettes"][mat]
    src = [hexrgb(c) for c in pal["colors"][pal["base"]]]
    dst = [hexrgb(c) for c in pal["colors"][variant]]
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if not a:
                continue
            best, bd = None, 1e9
            for s, d in zip(src, dst):
                dist = (r - s[0]) ** 2 + (g - s[1]) ** 2 + (b - s[2]) ** 2
                if dist < bd:
                    best, bd = d, dist
            if bd <= 400:
                px[x, y] = (*best, a)
    return im

def compose(body, look, anim="walk", row=2, col=0):
    """look: list of (item, colorVariant)."""
    layers = []
    for gid, var in look:
        it = M["items"][gid]
        for part, z in it["z"].items():
            fr = it["frames"][body].get(part, {}).get(anim)
            if fr:
                layers.append((z, gid, part, var, fr))
    layers.sort()
    out = Image.new("RGBA", (64, 64))
    for z, gid, part, var, (x, y, w, h) in layers:
        sheet = Image.open(A / f"c_{gid}.png").convert("RGBA")
        cell = sheet.crop((x + col * 64, y + row * 64, x + col * 64 + 64, y + row * 64 + 64))
        out.alpha_composite(recolor(cell, M["items"][gid]["mat"], var))
    return out

tests = [
    ("male", [("body", "light"), ("head", "light"), ("eyes", "brown"), ("f_shoes", "brown"), ("b_pants", "navy"), ("t_tshirt", "red"), ("h_plain", "black")]),
    ("female", [("body", "amber"), ("head", "amber"), ("eyes", "brown"), ("f_sandals", "tan"), ("b_skirt", "pink"), ("t_polo", "white"), ("h_ponytail", "dark_brown"), ("a_headband", "red")]),
    ("male", [("body", "bronze"), ("head", "bronze"), ("eyes", "gray"), ("f_boots", "black"), ("b_pants", "brown"), ("t_long", "green"), ("o_overalls", "navy"), ("h_messy", "chestnut"), ("a_cap", None)]),
    ("female", [("body", "light"), ("head", "light"), ("eyes", "blue"), ("f_shoes", "white"), ("b_leggings", "black"), ("t_cardigan", "yellow"), ("h_bob", "black"), ("g_round", None)]),
]
cols = []
for body, look in tests:
    for row, col, anim in [(2, 0, "walk"), (3, 2, "walk"), (1, 3, "walk"), (0, 0, "walk"), (2, 4, "thrust")]:
        lk = look + ([("x_can", None)] if anim == "thrust" else [])
        cols.append(compose(body, lk, anim, row, col))
sheet = Image.new("RGBA", (64 * 5, 64 * len(tests)), (120, 160, 90, 255))
for i, im in enumerate(cols):
    sheet.alpha_composite(im, ((i % 5) * 64, (i // 5) * 64))
sheet = sheet.resize((sheet.width * 3, sheet.height * 3), Image.NEAREST)
sheet.save(sys.argv[1])
print(sys.argv[1], sheet.size)
