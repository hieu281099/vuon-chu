"""Asset pipeline for Vuon Chu.

Reads the downloaded LPC sources under vendor/ and writes dist/assets/:
  c_<item>.png      one atlas per wardrobe item (all body types and animations stacked)
  world/*.png       terrain, building, prop, crop and animal sheets (copied, unchanged)
  manifest.json     item catalog (layers, z order, frame rects, palette material),
                    palettes, and credits

Run:  python -I tools/build_assets.py   (from the VuonChu folder or anywhere)
"""
import json
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
LPC = ROOT / "vendor" / "lpc"
SS = LPC / "spritesheets"
OGA = ROOT / "vendor" / "oga"
OUT = ROOT / "dist" / "assets"
ANIMS = ["walk", "idle", "thrust", "emote", "sit"]
BODIES = ["male", "female"]

# ---- wardrobe catalog: game id -> (slot, en, vi, price, spritesheet dir per body type) ----
# A dir may hold several parts (bg/fg) which become separate layers.
H = "hair/{}/adult"
ITEMS = {
    # always-on base layers
    "body":   ("base", "body", "cơ thể", 0, {"male": "body/bodies/male", "female": "body/bodies/female"}),
    "head":   ("base", "head", "đầu", 0, {"male": "head/heads/human/male", "female": "head/heads/human/female"}),
    "eyes":   ("base", "eyes", "mắt", 0, {b: "eyes/human/adult/default" for b in BODIES}),
    # hair styles (free, chosen at character creation)
    "h_plain": ("hair", "plain hair", "tóc thường", 0, {b: H.format("plain") for b in BODIES}),
    "h_bob": ("hair", "bob", "tóc bob", 0, {b: H.format("bob") for b in BODIES}),
    "h_pixie": ("hair", "pixie cut", "tóc tém", 0, {b: H.format("pixie") for b in BODIES}),
    "h_messy": ("hair", "messy hair", "tóc rối", 0, {b: H.format("messy1") for b in BODIES}),
    "h_bangs": ("hair", "bangs", "tóc mái", 0, {b: H.format("bangs") for b in BODIES}),
    "h_long": ("hair", "long hair", "tóc dài", 0, {b: H.format("long") for b in BODIES}),
    "h_curly": ("hair", "curly hair", "tóc xoăn", 0, {b: H.format("curly_short") for b in BODIES}),
    "h_buzz": ("hair", "buzz cut", "đầu đinh", 0, {b: H.format("buzzcut") for b in BODIES}),
    "h_bun": ("hair", "bun", "tóc búi", 0, {b: H.format("bangs_bun") for b in BODIES}),
    "h_pigtails": ("hair", "pigtails", "tóc hai bím", 0, {b: H.format("pigtails") for b in BODIES}),
    "h_afro": ("hair", "afro", "tóc xù", 0, {b: H.format("afro") for b in BODIES}),
    "h_idol": ("hair", "idol hair", "tóc idol", 0, {b: H.format("idol") for b in BODIES}),
    "h_page": ("hair", "bowl cut", "tóc nấm", 0, {b: H.format("page") for b in BODIES}),
    "h_parted": ("hair", "side part", "tóc rẽ ngôi", 0, {b: H.format("parted") for b in BODIES}),
    "h_bedhead": ("hair", "bed hair", "tóc ngủ dậy", 0, {b: H.format("bedhead") for b in BODIES}),
    "h_ponytail": ("hair", "ponytail", "tóc đuôi ngựa", 0, {b: "hair/ponytail/adult" for b in BODIES}),
    "h_hiponytail": ("hair", "high ponytail", "đuôi ngựa cao", 0, {b: "hair/high_ponytail/adult" for b in BODIES}),
    # tops
    "t_tshirt": ("top", "T-shirt", "áo phông", 0, {b: f"torso/clothes/shortsleeve/tshirt/{b}" for b in BODIES}),
    "t_vneck": ("top", "V-neck T-shirt", "áo cổ tim", 40, {b: f"torso/clothes/shortsleeve/tshirt_vneck/{b}" for b in BODIES}),
    "t_polo": ("top", "polo shirt", "áo polo", 60, {b: f"torso/clothes/shortsleeve/shortsleeve_polo/{b}" for b in BODIES}),
    "t_long": ("top", "long-sleeved shirt", "áo dài tay", 60, {b: f"torso/clothes/longsleeve/longsleeve/{b}" for b in BODIES}),
    "t_cardigan": ("top", "cardigan", "áo khoác len", 90, {b: f"torso/clothes/longsleeve/longsleeve2_cardigan/{b}" for b in BODIES}),
    "t_tank": ("top", "tank top", "áo ba lỗ", 30, {b: f"torso/clothes/sleeveless/sleeveless1/{b}" for b in BODIES}),
    # over-tops
    "o_overalls": ("over", "overalls", "quần yếm", 120, {b: f"torso/aprons/overalls/{b}" for b in BODIES}),
    # bottoms
    "b_pants": ("bottom", "trousers", "quần dài", 0, {"male": "legs/pants/male", "female": "legs/pants/thin"}),
    "b_shorts": ("bottom", "shorts", "quần đùi", 35, {"male": "legs/shorts/shorts/male", "female": "legs/shorts/shorts/thin"}),
    "b_skirt": ("bottom", "skirt", "chân váy", 50, {"male": "legs/skirts/plain/male", "female": "legs/skirts/plain/thin"}),
    "b_leggings": ("bottom", "leggings", "quần bó", 45, {"male": "legs/leggings/male", "female": "legs/leggings/thin"}),
    # feet
    "f_shoes": ("feet", "shoes", "giày", 0, {"male": "feet/shoes/basic/male", "female": "feet/shoes/basic/thin"}),
    "f_sandals": ("feet", "sandals", "dép quai hậu", 30, {"male": "feet/sandals/male", "female": "feet/sandals/thin"}),
    "f_boots": ("feet", "boots", "ủng", 70, {"male": "feet/boots/basic/male", "female": "feet/boots/basic/thin"}),
    # hats
    "a_bandana": ("hat", "bandana", "khăn bandana", 40, {b: "hat/cloth/bandana/adult" for b in BODIES}),
    "a_cap": ("hat", "farmer hat", "mũ nông dân", 50, {b: "hat/cloth/leather_cap/adult" for b in BODIES}),
    "a_bowler": ("hat", "bowler hat", "mũ quả dưa", 80, {b: "hat/formal/bowler/adult" for b in BODIES}),
    "a_tophat": ("hat", "top hat", "mũ chóp cao", 120, {b: "hat/formal/tophat/adult" for b in BODIES}),
    "a_santa": ("hat", "Christmas hat", "mũ Giáng sinh", 90, {b: "hat/holiday/christmas/adult" for b in BODIES}),
    "a_headband": ("hat", "headband", "băng đô", 25, {b: "hat/headband/tied/adult" for b in BODIES}),
    # glasses
    "g_glasses": ("face", "glasses", "kính cận", 45, {b: "facial/glasses/glasses/adult" for b in BODIES}),
    "g_round": ("face", "round glasses", "kính tròn", 55, {b: "facial/glasses/round/adult" for b in BODIES}),
    "g_sun": ("face", "sunglasses", "kính râm", 80, {b: "facial/glasses/sunglasses/adult" for b in BODIES}),
    # tools (drawn during actions)
    "x_can": ("tool", "watering can", "bình tưới", 0, {b: "tools/watering_can" for b in BODIES}),
    "x_hoe": ("tool", "hoe", "cái cuốc", 0, {b: "tools/hoe" for b in BODIES}),
}

# ---- sheet definitions: map spritesheet dir -> (zPos, material, credits) ----
defs = {}
for f in (LPC / "sheet_definitions").rglob("*.json"):
    try:
        d = json.loads(f.read_text(encoding="utf-8"))
    except Exception:
        continue
    if not isinstance(d, dict):
        continue
    mat = (d.get("recolors") or {}).get("material")
    for k, v in d.items():
        if not k.startswith("layer_") or not isinstance(v, dict):
            continue
        for bt, p in v.items():
            if isinstance(p, str) and "/" in p:
                defs.setdefault(p.rstrip("/"), (v.get("zPos", 50), mat, d.get("credits", []), d.get("name")))

def find_def(dirpath):
    """Longest defined prefix of dirpath."""
    p = dirpath
    while p:
        if p in defs:
            return defs[p]
        p = p.rsplit("/", 1)[0] if "/" in p else ""
    return (50, None, [], None)

def _hex(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def detect_material(im):
    """Return 'cloth' when nearly all opaque pixels are the cloth palette's base ramp."""
    pd = LPC / "palette_definitions" / "cloth"
    base = json.loads((pd / "meta_cloth.json").read_text(encoding="utf-8"))["base"]
    ramp = [_hex(c) for c in json.loads((pd / "cloth_ulpc.json").read_text(encoding="utf-8"))[base]]
    small = im.resize((max(1, im.width // 4), max(1, im.height // 4)), Image.NEAREST)
    px = [p for p in small.get_flattened_data() if p[3] > 200]
    if not px:
        return None
    hit = sum(1 for p in px if min(sum((a - b) ** 2 for a, b in zip(p[:3], c)) for c in ramp) <= 60)
    return "cloth" if hit / len(px) > 0.85 else None

MAT_FALLBACK = {"eyes": "eye", "head": "body", "body": "body"}
OUT.mkdir(parents=True, exist_ok=True)
(OUT / "world").mkdir(exist_ok=True)

catalog, used_credits = {}, {}
for gid, (slot, en, vi, price, dirs) in ITEMS.items():
    sheets = []  # (body, part, anim, Image)
    for bt in BODIES:
        base = SS / dirs[bt]
        parts = [("main", base)]
        if (base / "bg").is_dir() or (base / "fg").is_dir():
            parts = [(pn, base / pn) for pn in ("bg", "fg") if (base / pn).is_dir()]
        for pn, pdir in parts:
            for an in ANIMS:
                f = pdir / f"{an}.png"
                if f.exists():
                    sheets.append((bt, pn, an, Image.open(f).convert("RGBA")))
    if not sheets:
        print("!! no sheets for", gid, dirs)
        continue
    W = max(im.width for *_, im in sheets)
    Ht = sum(im.height for *_, im in sheets)
    atlas = Image.new("RGBA", (W, Ht))
    frames, y = {}, 0
    for bt, pn, an, im in sheets:
        atlas.paste(im, (0, y))
        frames.setdefault(bt, {}).setdefault(pn, {})[an] = [0, y, im.width, im.height]
        y += im.height
    atlas.save(OUT / f"c_{gid}.png", optimize=True)
    zs, mat, credits = {}, None, []
    for bt in BODIES:
        for pn in frames[bt]:
            sub = dirs[bt] + ("" if pn == "main" else "/" + pn)
            z, m, cr, _ = find_def(sub)
            if gid == "eyes":
                z = 105  # same as LPC eye layers, above the head
            if pn == "bg":
                z = min(z, 9)  # behind the body
            zs[pn] = z
            mat = mat or m
            credits += cr
    mat = mat or MAT_FALLBACK.get(gid)
    if slot == "hair":
        mat = "hair"
    if slot == "tool":
        mat = None
    elif mat is None:
        mat = detect_material(atlas)
    catalog[gid] = {"slot": slot, "en": en, "vi": vi, "price": price, "z": zs, "mat": mat, "frames": frames}
    for c in credits:
        key = c.get("file", "")
        used_credits[key] = {"authors": c.get("authors", []), "licenses": c.get("licenses", []), "urls": c.get("urls", [])[:3]}

# fishing rod: single bg/fg sheet pair
for pn in ("bg", "fg"):
    shutil.copy(SS / "tools" / "fishing_rod" / f"{pn}.png", OUT / "world" / f"rod_{pn}.png")

# ---- palettes ----
pals = {}
for mat, fn in [("body", "body/body_ulpc.json"), ("hair", "hair/hair_ulpc.json"), ("cloth", "cloth/cloth_ulpc.json"), ("eye", "eye/eye_ulpc.json")]:
    pd = LPC / "palette_definitions"
    meta = json.loads((pd / mat / f"meta_{mat}.json").read_text(encoding="utf-8"))
    pals[mat] = {"base": meta.get("base"), "colors": json.loads((pd / fn).read_text(encoding="utf-8"))}

# ---- world sheets (copied unchanged) ----
T = OGA / "base" / "x" / "LPC Base Assets" / "tiles"
D = OGA / "daneeklu" / "x" / "submission_daneeklu" / "tilesets"
WORLD = {
    "grass": T / "grass.png", "grassalt": T / "grassalt.png", "dirt": T / "dirt.png", "dirt2": T / "dirt2.png",
    "water": T / "water.png", "treetop": T / "treetop.png", "trunk": T / "trunk.png", "house": T / "house.png",
    "signs": T / "signs.png", "bridges": T / "bridges.png", "barrel": T / "barrel.png", "buckets": T / "buckets.png",
    "rock": T / "rock.png", "cement": T / "cement.png", "inside": T / "inside.png", "country": T / "country.png",
    "soil": D / "plowed_soil.png", "fence": D / "fence.png", "sand": D / "sand.png", "sandwater": D / "sandwater.png",
    "tallgrass": D / "tallgrass.png", "wheat": D / "wheat.png", "reed": D / "reed.png", "market": D / "farming_fishing.png",
    "crops": OGA / "crops" / "x" / "crops-v2" / "crops.png", "barn": OGA / "farm" / "x" / "lpc-farm" / "barn.png",
    "chicken_walk": OGA / "animals" / "chicken_walk.png", "chicken_eat": OGA / "animals" / "chicken_eat.png",
    "cow_walk": OGA / "animals" / "cow_walk.png", "cow_eat": OGA / "animals" / "cow_eat.png",
    "sheep_walk": OGA / "animals" / "sheep_walk.png", "sheep_eat": OGA / "animals" / "sheep_eat.png",
    "pig_walk": OGA / "animals" / "pig_walk.png", "pig_eat": OGA / "animals" / "pig_eat.png",
    "cat": OGA / "pets" / "cat_0.png", "dog": OGA / "pets" / "dog_2.png",
}
for k, p in WORLD.items():
    Image.open(p).convert("RGBA").save(OUT / "world" / f"{k}.png", optimize=True)

pack_credits = [
    {"what": "LPC Base Assets (tiles)", "authors": "Lanea Zimmerman (Sharm), Stephen Challener (Redshrike), Charles Sanchez (CharlesGabriel), Manuel Riecke (MrBeast), Daniel Armstrong (HughSpectrum) and others listed in CREDITS.TXT", "license": "CC-BY-SA 3.0 / GPL 3.0", "url": "https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles"},
    {"what": "[LPC] Farming tilesets, magic animations and UI elements", "authors": "Daniel Eddeland", "license": "CC-BY-SA 3.0 / GPL 3.0", "url": "https://opengameart.org/content/lpc-farming-tilesets-magic-animations-and-ui-elements"},
    {"what": "[LPC] Crops", "authors": "bluecarrot16, Daniel Eddeland, Joshua Taylor, Richard Kettering (Jetrel); commissioned by castelonia", "license": "CC-BY-SA 3.0+ / GPL 3.0+", "url": "https://opengameart.org/content/lpc-crops"},
    {"what": "[LPC] Farm", "authors": "bluecarrot16 (see CREDITS-farm.txt)", "license": "CC-BY 4.0", "url": "https://opengameart.org/content/lpc-farm"},
    {"what": "LPC style farm animals", "authors": "Daniel Eddeland", "license": "CC-BY 3.0 / GPL 2.0", "url": "https://opengameart.org/content/lpc-style-farm-animals"},
    {"what": "[LPC] Cats and Dogs", "authors": "bluecarrot16", "license": "CC-BY 3.0 / CC-BY-SA 3.0 / GPL / OGA-BY 3.0", "url": "https://opengameart.org/content/lpc-cats-and-dogs"},
    {"what": "Universal LPC Spritesheet Character Generator", "authors": "Liberated Pixel Cup contributors (per item below)", "license": "per item", "url": "https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator"},
]
manifest = {"items": catalog, "palettes": pals, "credits": {"packs": pack_credits, "items": used_credits}}
(OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

total = sum(f.stat().st_size for f in OUT.rglob("*") if f.is_file())
print(f"{len(catalog)} items, {len(list(OUT.rglob('*.png')))} png, {total/1024:.0f} KB total")
for gid, it in catalog.items():
    print(f"  {gid:12} {it['slot']:6} mat={it['mat']} z={it['z']} anims={sorted(it['frames']['male'][next(iter(it['frames']['male']))])}")
