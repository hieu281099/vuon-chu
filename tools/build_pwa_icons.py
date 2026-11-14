"""Home-screen icons for the installable web app (iOS / Android). Run once with PIL: python tools/build_pwa_icons.py"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"; DOCS.mkdir(exist_ok=True)

def icon(n, rounded):
    im = Image.new("RGBA", (n, n), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    grad = Image.new("RGBA", (n, n))
    for y in range(n):
        t = y / n; grad.paste((int(124 + 131 * t), int(92 + 19 * t), int(255 - 74 * t), 255), (0, y, n, y + 1))
    mask = Image.new("L", (n, n), 0)
    if rounded: ImageDraw.Draw(mask).rounded_rectangle((0, 0, n - 1, n - 1), radius=n // 4, fill=255)
    else: mask.paste(255, (0, 0, n, n))   # iOS masks the corners itself
    im.paste(grad, (0, 0), mask)
    s = n / 192
    d.ellipse((46 * s, 128 * s, 146 * s, 156 * s), fill=(122, 74, 40, 255))
    d.line((96 * s, 140 * s, 96 * s, 84 * s), fill=(61, 190, 108, 255), width=max(2, int(10 * s)))
    d.ellipse((44 * s, 58 * s, 98 * s, 96 * s), fill=(61, 220, 132, 255))
    d.ellipse((94 * s, 44 * s, 152 * s, 86 * s), fill=(61, 220, 132, 255))
    d.ellipse((60 * s, 66 * s, 78 * s, 76 * s), fill=(180, 255, 210, 255))
    return im

icon(180, False).save(DOCS / "icon-180.png")
icon(192, True).save(DOCS / "icon-192.png")
icon(512, True).save(DOCS / "icon-512.png")
print("icons written to docs/")
