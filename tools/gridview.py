"""Crop part of a sheet and overlay a labelled 32px grid (coordinates in source pixels).

python -I gridview.py src.png out.png x0 y0 x1 y1 [zoom]
"""
import sys
from PIL import Image, ImageDraw

src, out = sys.argv[1], sys.argv[2]
x0, y0, x1, y1 = map(int, sys.argv[3:7])
z = int(sys.argv[7]) if len(sys.argv) > 7 else 1
im = Image.open(src).convert("RGBA").crop((x0, y0, x1, y1))
im = im.resize((im.width * z, im.height * z), Image.NEAREST)
pad = 28
bg = Image.new("RGBA", (im.width + pad, im.height + pad), (50, 58, 50, 255))
bg.alpha_composite(im, (pad, pad))
d = ImageDraw.Draw(bg)
for gx in range((x0 // 32) * 32, x1 + 1, 32):
    if gx < x0:
        continue
    X = pad + (gx - x0) * z
    d.line([(X, pad), (X, bg.height)], fill=(255, 60, 60, 90))
    d.text((X + 1, 2), str(gx), fill=(255, 255, 0, 255))
for gy in range((y0 // 32) * 32, y1 + 1, 32):
    if gy < y0:
        continue
    Y = pad + (gy - y0) * z
    d.line([(pad, Y), (bg.width, Y)], fill=(255, 60, 60, 90))
    d.text((1, Y + 1), str(gy), fill=(255, 255, 0, 255))
bg.save(out)
print(out, bg.size)
