"""App icons for Hello Làng from tools/icon.svg: web/PWA (docs/), iOS touch icon, Android launcher mipmaps.
Renders the SVG with headless Chrome at 1024 px, then scales down with PIL.   python -I tools/build_icons.py
"""
import subprocess, tempfile
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SVG = (ROOT / "tools" / "icon.svg").read_text(encoding="utf-8")
CHROME = next(p for p in [Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"), Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe")] if p.exists())

def render(radius, out):
    """radius in icon units (512 wide); 0 = square corners (iOS rounds them itself)"""
    with tempfile.TemporaryDirectory() as tmp:
        page = Path(tmp) / "icon.html"
        svg = SVG.replace("{R}", str(radius)).replace('width="512" height="512"', 'width="1024" height="1024"', 1)
        page.write_text(f'<!doctype html><html><body style="margin:0;background:transparent">{svg}</body></html>', encoding="utf-8")
        shot = Path(tmp) / "shot.png"
        subprocess.run([str(CHROME), "--headless=new", "--disable-gpu", "--hide-scrollbars", "--default-background-color=00000000",
                        "--window-size=1024,1024", f"--screenshot={shot}", page.as_uri()], check=True, capture_output=True, timeout=60)
        im = Image.open(shot).convert("RGBA").crop((0, 0, 1024, 1024)); im.load()
    im.save(out); return im

big_round = render(112, ROOT / "tools" / "icon-1024.png")
big_square = render(0, ROOT / "tools" / "icon-1024-square.png")
DOCS = ROOT / "docs"; DOCS.mkdir(exist_ok=True)
fit = lambda im, n: im.resize((n, n), Image.LANCZOS)
fit(big_square, 180).save(DOCS / "icon-180.png")
fit(big_round, 192).save(DOCS / "icon-192.png")
fit(big_round, 512).save(DOCS / "icon-512.png")
for d, n in {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}.items():
    fit(big_round, n).save(ROOT / "android" / "res" / f"mipmap-{d}" / "ic_launcher.png")
print("icons written: docs/icon-180/192/512, android mipmaps, tools/icon-1024*.png")
