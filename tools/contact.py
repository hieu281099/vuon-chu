"""Make a labelled contact sheet of PNGs for quick visual inspection.

python -I contact.py out.png scale file1 file2 ...
"""
import sys
from PIL import Image, ImageDraw

out, scale, paths = sys.argv[1], float(sys.argv[2]), sys.argv[3:]
ims = []
for p in paths:
    im = Image.open(p).convert("RGBA")
    if scale != 1:
        im = im.resize((int(im.width * scale), int(im.height * scale)), Image.NEAREST)
    ims.append((p.replace("\\", "/").split("/")[-1], im))
W = max(1400, max(i.width for _, i in ims) + 20)
rows, x, y, rowh = [], 10, 10, 0
for name, im in ims:
    if x + im.width + 10 > W:
        x, y = 10, y + rowh + 26
        rowh = 0
    rows.append((name, im, x, y))
    x += im.width + 14
    rowh = max(rowh, im.height)
H = y + rowh + 30
sheet = Image.new("RGBA", (W, H), (60, 70, 60, 255))
d = ImageDraw.Draw(sheet)
for name, im, x, y in rows:
    sheet.alpha_composite(im, (x, y + 14))
    d.text((x, y), name, fill=(255, 255, 0, 255))
    # 32px grid ticks along top edge
    for gx in range(0, im.width, int(32 * scale)):
        d.line([(x + gx, y + 12), (x + gx, y + 14)], fill=(255, 80, 80, 255))
sheet.save(out)
print(out, sheet.size)
