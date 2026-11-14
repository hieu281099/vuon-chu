"""Assemble nemo PNG@2x parts with guessed offsets to calibrate the paper doll."""
from pathlib import Path
from PIL import Image

N = Path(__file__).resolve().parent.parent / "vendor" / "nemo" / "x" / "PNG@2x"
K = 2
def part(p): return Image.open(N / p).convert("RGBA")
def build(hair_f, hair_b, shirt, sleeve, pants, tint="tint_1", face="smile"):
    W, H = 145 * K, 175 * K
    out = Image.new("RGBA", (W, H), (70, 60, 80, 255))
    def put(im, x, y): out.alpha_composite(im, (int(x * K), int(y * K)))
    if hair_b: put(part(f"hairs/back/{hair_b}"), 0, 0)
    # legs
    for lx in (59, 73):
        put(part(f"skin/{tint}/leg.png"), lx, 131)
        put(part(f"pants/{pants}"), lx, 131)
    # arms
    put(part(f"skin/{tint}/arm.png"), 44, 113); put(part(f"skin/{tint}/arm.png"), 89, 113)
    put(part(f"sleeves/{sleeve}"), 44, 113); put(part(f"sleeves/{sleeve}"), 89, 113)
    # body / shirt
    put(part(f"skin/{tint}/body.png"), 55, 113)
    if shirt.startswith("dress"): put(part(f"shirts/{shirt}"), 52, 113)
    else: put(part(f"shirts/{shirt}"), 55, 113)
    put(part(f"skin/{tint}/head.cheeks.png"), 0, 0)
    put(part(f"faces/{face}.png"), 0, 0)
    put(part(f"hairs/front/{hair_f}"), 0, 0)
    return out
row = [build("chupchik.blond.png", "long.blond.png", "dress.green.png", "green.short.png", "naked.png"),
       build("regular.black.png", None, "trousers.white.png", "white.short.png", "naked.png", "tint_3"),
       build("curly.orange.png", "curly.orange.png", "trousers.violet.png", "purple.long.png", "pants.png")]
sheet = Image.new("RGBA", (sum(r.width for r in row), row[0].height))
x = 0
for r in row: sheet.alpha_composite(r, (x, 0)); x += r.width
sheet.save(Path(__file__).resolve().parent.parent / "scratch" / "nemo_test.png")
print(sheet.size)
