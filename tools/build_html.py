"""Bundle src/ into dist/index.html (artifact page body) and dist/test.html (standalone, for local testing).

python -I tools/build_html.py
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC, DIST = ROOT / "src", ROOT / "dist"
ORDER = ["gen_nemo.js", "data.js", "chibi.js", "scene.js", "engine.js", "world.js", "game.js", "farm_extra.js", "lottery.js", "post_bait.js", "npc_gear.js", "level.js", "salon.js", "spa.js", "cloud.js", "mp.js", "mp_social.js", "tests_data.js", "tests.js", "render.js", "minimap.js", "main.js"]
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
# installable on iPhone / Android home screens: manifest, Apple meta tags, offline service worker
PWA_HEAD = ('<title>Vườn Chữ</title><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">'
            '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Vườn Chữ">'
            '<meta name="theme-color" content="#1b1640"><link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icon-180.png">')
PWA_SW = "<script>if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(function(){});</script>"
docs = (DIST / "test.html").read_text(encoding="utf-8").replace("</head>", PWA_HEAD + "</head>", 1).replace("</body>", PWA_SW + "</body>", 1)
(ROOT / "docs" / "index.html").write_text(docs, encoding="utf-8")
import json, hashlib
(ROOT / "docs" / "manifest.webmanifest").write_text(json.dumps({
    "name": "Vườn Chữ", "short_name": "Vườn Chữ", "description": "Game nông trại học tiếng Anh",
    "start_url": "./", "scope": "./", "display": "fullscreen", "orientation": "landscape",
    "background_color": "#1b1640", "theme_color": "#1b1640", "lang": "vi",
    "icons": [{"src": "icon-192.png", "sizes": "192x192", "type": "image/png"}, {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}]
}, ensure_ascii=False, indent=1), encoding="utf-8")
ver = hashlib.md5(docs.encode("utf-8")).hexdigest()[:8]
(ROOT / "docs" / "sw.js").write_text(f"""// offline cache for the game page; network first so updates arrive, cache when offline
const C = 'vuonchu-{ver}', FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {{ e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); self.skipWaiting(); }});
self.addEventListener('activate', e => {{ e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))); self.clients.claim(); }});
self.addEventListener('fetch', e => {{
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // Supabase, fonts: straight to the network
  e.respondWith(fetch(e.request).then(r => {{ const copy = r.clone(); caches.open(C).then(c => c.put(e.request, copy)); return r; }}).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
}});
""", encoding="utf-8")
(ROOT / "docs" / ".nojekyll").write_text("", encoding="utf-8")
