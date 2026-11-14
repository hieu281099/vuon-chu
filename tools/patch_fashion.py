from pathlib import Path
R = Path(__file__).resolve().parent.parent / "src"
def sub(f, a, b):
    p = R / f; t = p.read_text(encoding="utf-8")
    assert t.count(a) == 1, (f, t.count(a), a[:70]); p.write_text(t.replace(a, b), encoding="utf-8")

C = "chibi.js"
sub(C, "{vi:'Huyền thoại', c:'#FFB020'}];", "{vi:'Huyền thoại', c:'#FFB020'}, {vi:'Thần thoại', c:'#FF3552'}];")
sub(C, "\n  return '';\n}\nfunction faceItemSVG", "\n  return extraHat(id, c, lv, t, d);\n}\nfunction faceItemSVG")
sub(C, "  return '';\n}\n// wing / back item", "  return extraFace(id, c, lv);\n}\n// wing / back item")
sub(C, "  return '';\n}\nfunction backStraps", "  return extraBack(id, c, lv, front, pair);\n}\nfunction backStraps")
sub(C, "  return '';\n}\nfunction topSVG", "  return extraHand(id, c, lv);\n}\nfunction topSVG")
sub(C, "    default: return tee + waist(b);", "    default: return extraTop(s, c, b, d, tee, waist) || tee + waist(b);")
sub(C, "const pants = L.top === 'top_dress' || L.top === 'top_aodai' ? (L.top === 'top_aodai' ? 'aodai' : 'bare') : (L.bottom === 'bot_shorts' ? 'shorts' : L.bottom === 'bot_skirt' ? 'bare' : 'pants');",
       "const pants = DRESSES.includes(L.top) ? (L.top === 'top_aodai' ? 'aodai' : 'bare') : (L.bottom === 'bot_shorts' ? 'shorts' : SKIRTS.includes(L.bottom) ? 'bare' : 'pants');")
sub(C, "V${y + 15}H${x}Z\" fill=\"${L.bottomC}\"/>`;\n",
       "V${y + 15}H${x}Z\" fill=\"${L.bottomC}\"/>`;\n  if (pants === 'pants' && L.bottom === 'bot_jeans') s += `<rect x=\"${x + 3}\" y=\"${y + 7}\" width=\"7\" height=\"2.5\" rx=\"1.2\" fill=\"${skin.b}\"/><path d=\"M${x + 6.5} ${y}V${y + 15}\" stroke=\"${shade(L.bottomC, -0.25)}\" stroke-width=\"1\"/>`;\n  if (pants === 'pants' && L.bottom === 'bot_cargo') s += `<rect x=\"${x + 2}\" y=\"${y + 5}\" width=\"9\" height=\"7\" rx=\"1.5\" fill=\"${shade(L.bottomC, -0.18)}\"/>`;\n")
sub(C, "function skirtSVG(L) { return L.bottom === 'bot_skirt' && !['top_dress','top_aodai'].includes(L.top) ?",
       "function skirtSVG(L) { if (DRESSES.includes(L.top)) return ''; const k = L.bottomC;\n  if (L.bottom === 'bot_pleated') return `<path d=\"M55 126H90L96 143H49Z\" fill=\"${k}\"/><path d=\"M60 127L57 143M66 127L65 143M72.5 127V143M79 127L80 143M85 127L88 143\" stroke=\"${shade(k, -0.25)}\" stroke-width=\"1.3\"/>`;\n  if (L.bottom === 'bot_tutu') return `<path d=\"M55 126H90Q108 134 100 140Q96 146 88 141Q80 147 72.5 142Q65 147 57 141Q49 146 45 140Q37 134 55 126Z\" fill=\"${k}\"/><path d=\"M52 132Q72.5 138 93 132\" stroke=\"#FFFFFF\" stroke-width=\"2\" opacity=\".6\" fill=\"none\"/>`;\n  return L.bottom === 'bot_skirt' ?")
sub(C, "const long = ['top_long','top_hoodie','top_jacket','top_aodai','top_sailor'].includes(L.top);", "const long = LONG_SLEEVES.includes(L.top);")
# pets
sub(C, "    case 'pet_chick': body = `", "    case 'pet_chick': case 'pet_phoenix': body = (id === 'pet_phoenix' ? `<path d=\"M14 ${44 + hop}Q-4 34 4 14Q10 30 20 34Z\" fill=\"#FFC83D\"/><path d=\"M46 ${44 + hop}Q64 34 56 14Q50 30 40 34Z\" fill=\"#FFC83D\"/><path d=\"M24 ${28 + hop}Q20 6 30 0Q34 12 37 28Z\" fill=\"#FFC83D\"/>` : '') + `")
sub(C, "    case 'pet_kitty': case 'pet_puppy': case 'pet_bunny': {", "    case 'pet_kitty': case 'pet_puppy': case 'pet_bunny': case 'pet_fox': case 'pet_panda': case 'pet_unicorn': {")
sub(C, "const ears = id === 'pet_kitty' ?", "const ears = id === 'pet_fox' ? `<path d=\"M12 ${24 + hop}L14 ${2 + hop}L30 ${16 + hop}Z M48 ${24 + hop}L46 ${2 + hop}L30 ${16 + hop}Z\" fill=\"${c}\"/><path d=\"M16 ${18 + hop}L17 ${8 + hop}L24 ${15 + hop}Z M44 ${18 + hop}L43 ${8 + hop}L36 ${15 + hop}Z\" fill=\"#1F1B24\"/>` : id === 'pet_panda' ? `<circle cx=\"15\" cy=\"${16 + hop}\" r=\"7\" fill=\"#1F1B24\"/><circle cx=\"45\" cy=\"${16 + hop}\" r=\"7\" fill=\"#1F1B24\"/>` : id === 'pet_unicorn' ? `<path d=\"M16 ${20 + hop}L18 ${8 + hop}L26 ${16 + hop}Z M44 ${20 + hop}L42 ${8 + hop}L34 ${16 + hop}Z\" fill=\"${c}\"/><path d=\"M26 ${16 + hop}L30 ${-10 + hop}L34 ${16 + hop}Z\" fill=\"url(#rb)\"/>` : id === 'pet_kitty' ?")
sub(C, "<rect x=\"11\" y=\"${14 + hop}\" width=\"38\" height=\"32\" rx=\"15\" fill=\"${c}\"/>${eyes(23, 37, 29 + hop)}",
       "<rect x=\"11\" y=\"${14 + hop}\" width=\"38\" height=\"32\" rx=\"15\" fill=\"${c}\"/>${id === 'pet_panda' ? `<ellipse cx=\"22\" cy=\"${29 + hop}\" rx=\"6\" ry=\"7\" fill=\"#1F1B24\"/><ellipse cx=\"38\" cy=\"${29 + hop}\" rx=\"6\" ry=\"7\" fill=\"#1F1B24\"/>` : id === 'pet_fox' ? `<path d=\"M14 ${34 + hop}Q30 ${50 + hop} 46 ${34 + hop}Q30 ${42 + hop} 14 ${34 + hop}Z\" fill=\"#FFFFFF\"/>` : id === 'pet_unicorn' ? `<path d=\"M40 ${14 + hop}Q54 ${22 + hop} 50 ${40 + hop}Q46 ${28 + hop} 38 ${22 + hop}Z\" fill=\"#FF8FC7\"/><path d=\"M44 ${16 + hop}Q56 ${26 + hop} 52 ${36 + hop}\" stroke=\"#8EE7FF\" stroke-width=\"3\" fill=\"none\"/>` : ''}${id === 'pet_panda' ? `<circle cx=\"23\" cy=\"${29 + hop}\" r=\"2.6\" fill=\"#FFFFFF\"/><circle cx=\"37\" cy=\"${29 + hop}\" r=\"2.6\" fill=\"#FFFFFF\"/>` : ''}${eyes(23, 37, 29 + hop)}")
sub(C, "${id === 'pet_kitty' ? `<path d=\"M43 52", "${id === 'pet_kitty' || id === 'pet_fox' ? `<path d=\"M43 52")
# auras
sub(C, "const base = FASH[id].col, col = lv ?", "const base = FASH[id].col, col = id === 'aura_galaxy' ? `hsl(${(t / 6) % 360} 90% 70%)` : lv ?")
sub(C, "    else if (id === 'aura_leaves') {", "    else if (id === 'aura_snow') { g.beginPath(); g.arc(px, py, s * 1.1, 0, Math.PI * 2); g.fill(); }\n    else if (id === 'aura_leaves' || id === 'aura_sakura') {")
print("ok")
