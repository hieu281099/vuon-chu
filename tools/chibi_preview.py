"""Write dist/chibi_preview.html: a gallery of chibi looks, frames and pets for visual checks."""
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
js = (ROOT / "src" / "gen_nemo.js").read_text(encoding="utf-8") + (ROOT / "src" / "chibi.js").read_text(encoding="utf-8")
page = """<!doctype html><meta charset="utf-8"><body style="margin:0;background:#7ec46a;font:12px sans-serif">
<div id="g" style="display:flex;flex-wrap:wrap;gap:4px;padding:6px"></div>
<script>""" + js + """
const looks = [
 Object.assign({}, DEFAULT_LOOK),
 Object.assign({}, DEFAULT_LOOK, {skin:3, hairF:'chupchik', hairB:'long', hairC:'#FFE994', top:'top_dress', topC:'#3DDC84', hat:'hat_flower', back:'back_angel', hand:'hand_balloon', lv:{back_angel:0}}),
 Object.assign({}, DEFAULT_LOOK, {skin:5, hairF:'curly', hairB:'curly', hairC:'#FF6B35', top:'top_hoodie', topC:'#9B5CFF', bottom:'bot_shorts', bottomC:'#1F1B24', hat:'hat_cat', back:'back_devil', face2:'face_heart', lv:{back_devil:4, face_heart:2}}),
 Object.assign({}, DEFAULT_LOOK, {skin:1, hairF:'elegant', hairC:'#1F1B24', top:'top_aodai', topC:'#FFFFFF', hat:'hat_nonla', back:'back_butterfly', hand:'hand_sunflower', lv:{back_butterfly:6, hat_nonla:3}}),
 Object.assign({}, DEFAULT_LOOK, {skin:2, hairF:'straight', hairB:'short', hairC:'#5B3423', top:'top_jacket', topC:'#FF6B35', bottom:'bot_pants', bottomC:'#1F1B24', hat:'hat_headphones', back:'back_bag', hand:'hand_wand', lv:{hand_wand:5}}),
 Object.assign({}, DEFAULT_LOOK, {skin:0, hairF:'regular', hairB:'long', hairC:'#FF8FC7', top:'top_sailor', topC:'#545AF2', bottom:'bot_skirt', bottomC:'#545AF2', hat:'hat_bunny', back:'back_fairy', hand:'hand_umbrella', lv:{back_fairy:6, hat_bunny:4}}),
 Object.assign({}, DEFAULT_LOOK, {skin:4, hairF:'chupchik', hairC:'#1F1B24', beard:'short', top:'top_overalls', topC:'#FFFFFF', bottomC:'#4D8BFF', hat:'hat_crown', back:'back_cape', face2:'face_round', lv:{hat_crown:6, back_cape:3}}),
 Object.assign({}, DEFAULT_LOOK, {skin:0, hairF:'curly', hairC:'#4D8BFF', top:'top_long', topC:'#2DD4BF', hat:'hat_witch', back:'back_angel', lv:{back_angel:6, hat_witch:4}})
];
const g = document.getElementById('g');
const add = (svg, label, w) => { const d = document.createElement('div'); d.style.cssText = 'background:#fff3;border-radius:8px;text-align:center'; d.innerHTML = '<img width="' + (w||150) + '" src="' + svgURL(svg) + '"><br>' + label; g.appendChild(d); };
looks.forEach((L, i) => add(chibiSVG(L, FRAMES.idle0, 'd'), 'look ' + i));
['walk0','walk2','water','hoe','cheer','wave'].forEach(f => add(chibiSVG(looks[2], FRAMES[f], 'd'), f));
add(chibiSVG(looks[1], FRAMES.walk0, 'l'), 'left'); add(chibiSVG(looks[1], FRAMES.idle0, 'u'), 'up'); add(chibiSVG(looks[5], FRAMES.idle0, 'u'), 'up2');
['pet_chick','pet_kitty','pet_puppy','pet_bunny','pet_dragon'].forEach((p, i) => add(petSVG(p, i + 2, 0), p, 70));
</script>"""
(ROOT / "dist" / "chibi_preview.html").write_text(page, encoding="utf-8")
print("ok")
