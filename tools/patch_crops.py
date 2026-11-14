from pathlib import Path
R = Path(__file__).resolve().parent.parent / "src"
def sub(f, a, b):
    p = R / f; t = p.read_text(encoding="utf-8")
    assert t.count(a) == 1, (f, t.count(a), a[:70]); p.write_text(t.replace(a, b), encoding="utf-8")

sub("data.js", "];\nconst CROP = Object.fromEntries", """,
  {id:'garlic',    en:'garlic',    vi:'tỏi',        lvl:2,  cost:7,  time:2400,  sell:21,  xp:10, one:'a head of garlic', pl:'heads of garlic'},
  {id:'spinach',   en:'spinach',   vi:'rau chân vịt',lvl:3, cost:9,  time:4500,  sell:28,  xp:12, one:'a bunch of spinach', pl:'bunches of spinach'},
  {id:'sweetpotato',en:'sweet potato',vi:'khoai lang',lvl:4, cost:11, time:6300,  sell:36,  xp:14, one:'a sweet potato', pl:'sweet potatoes'},
  {id:'peanut',    en:'peanut',    vi:'lạc',        lvl:5,  cost:13, time:9000,  sell:46,  xp:17, one:'a peanut plant', pl:'peanuts'},
  {id:'beans',     en:'green beans',vi:'đậu cô ve', lvl:6,  cost:15, time:12600, sell:58,  xp:20, one:'a handful of green beans', pl:'green beans'},
  {id:'sunflower', en:'sunflower', vi:'hoa hướng dương',lvl:7,cost:17,time:16200, sell:72,  xp:23, one:'a sunflower', pl:'sunflowers'},
  {id:'blueberry', en:'blueberry', vi:'việt quất',  lvl:9,  cost:23, time:25200, sell:105, xp:30, one:'a cup of blueberries', pl:'blueberries'},
  {id:'rose',      en:'rose',      vi:'hoa hồng',   lvl:10, cost:25, time:30600, sell:122, xp:33, one:'a rose', pl:'roses'},
  {id:'grape',     en:'grape',     vi:'nho',        lvl:12, cost:30, time:39600, sell:155, xp:39, one:'a bunch of grapes', pl:'bunches of grapes'},
  {id:'pineapple', en:'pineapple', vi:'dứa',        lvl:13, cost:34, time:46800, sell:178, xp:43, one:'a pineapple', pl:'pineapples'},
  {id:'dragonfruit',en:'dragon fruit',vi:'thanh long',lvl:14,cost:38,time:57600, sell:212, xp:48, one:'a dragon fruit', pl:'dragon fruits'},
  {id:'lotus',     en:'lotus',     vi:'hoa sen',    lvl:16, cost:46, time:72000, sell:280, xp:56, one:'a lotus flower', pl:'lotus flowers'},
  {id:'goldmelon', en:'golden melon',vi:'dưa lưới vàng',lvl:20,cost:70,time:129600,sell:520,xp:85, one:'a golden melon', pl:'golden melons'},
  {id:'ginseng',   en:'ginseng',   vi:'nhân sâm',   lvl:18, cost:0,  time:172800, sell:1200, xp:150, rare:1, one:'a ginseng root', pl:'ginseng roots'}
];
CROPS.sort((a, b) => a.lvl - b.lvl || a.time - b.time);
const CROP = Object.fromEntries""")

sub("scene.js", "pumpkin:{s:'gourd', c:'#FF9A2E'}, watermelon:{s:'melon', c:'#3DA65A'}", """pumpkin:{s:'gourd', c:'#FF9A2E'}, watermelon:{s:'melon', c:'#3DA65A'},
  garlic:{s:'bulb', c:'#FBF4E6'}, spinach:{s:'rosette', c:'#4FA84A'}, sweetpotato:{s:'tuber', c:'#B04C78'}, peanut:{s:'tuber', c:'#D9A86C'},
  beans:{s:'long', c:'#6CC24A'}, sunflower:{s:'flower', c:'#FFC83D'}, blueberry:{s:'vine', c:'#4F6BD8'}, rose:{s:'flower', c:'#FF3B5C'},
  grape:{s:'vine', c:'#8A3FB0'}, pineapple:{s:'pine', c:'#F2B830'}, dragonfruit:{s:'gourd', c:'#FF3E8E'}, lotus:{s:'flower', c:'#FF8FC7'},
  goldmelon:{s:'melon', c:'#F2C94C'}, ginseng:{s:'root', c:'#F2D7A0'}""")
# field drawing for the two new shapes
sub("scene.js", "    case 'corn': g.strokeStyle = PAL.leaf;", """    case 'flower': { g.strokeStyle = PAL.leaf; g.lineWidth = 2.6; g.beginPath(); g.moveTo(cx, by); g.lineTo(cx + sway, by - 26); g.stroke(); leafPair(g, cx, by - 10, 1.2, PAL.leaf);
      const fx = cx + sway, fy = by - 28; g.fillStyle = c; for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; g.beginPath(); g.ellipse(fx + Math.cos(a) * 6, fy + Math.sin(a) * 6, 4.5, 2.6, a, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = id === 'sunflower' ? '#8B5A3C' : '#FFE27A'; g.beginPath(); g.arc(fx, fy, 3.6, 0, Math.PI * 2); g.fill(); break; }
    case 'pine': { g.fillStyle = PAL.leaf; for (const [dx, a] of [[-6, -0.5], [0, 0], [6, 0.5]]) { g.beginPath(); g.ellipse(cx + dx * 0.6, by - 22, 2.6, 9, a, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = c; g.beginPath(); g.ellipse(cx, by - 6, 8, 10, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = dk; g.lineWidth = 1.2;
      for (const d of [-6, 0, 6]) { g.beginPath(); g.moveTo(cx - 7, by - 6 + d); g.lineTo(cx + 7, by - 6 + d + 4); g.moveTo(cx + 7, by - 6 + d); g.lineTo(cx - 7, by - 6 + d + 4); g.stroke(); } break; }
    case 'corn': g.strokeStyle = PAL.leaf;""")
# inventory icons
sub("scene.js", "      case 'corn': b = `", """      case 'flower': b = `<path d="M20 38 V20" stroke="#3FAE5A" stroke-width="3"/><path d="M20 30 q-8 -2 -10 -8 q8 0 10 6z" fill="#3FAE5A"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<ellipse cx="${20 + Math.cos(a * Math.PI / 180) * 8}" cy="${15 + Math.sin(a * Math.PI / 180) * 8}" rx="6" ry="3.6" fill="${c}" transform="rotate(${a} ${20 + Math.cos(a * Math.PI / 180) * 8} ${15 + Math.sin(a * Math.PI / 180) * 8})"/>`).join('')}<circle cx="20" cy="15" r="5" fill="${id === 'sunflower' ? '#8B5A3C' : '#FFE27A'}"/>`; break;
      case 'pine': b = `<path d="M20 12 L12 0 L18 8 L20 -2 L22 8 L28 0Z" fill="#3FAE5A"/><ellipse cx="20" cy="25" rx="11" ry="13" fill="${c}"/><path d="M11 18 L29 32 M29 18 L11 32 M10 25 L22 37 M30 25 L18 37" stroke="${dk}" stroke-width="1.5"/>`; break;
      case 'corn': b = `""")
print("ok")
