"""Switch src/render.js from LPC character frames to chibi SVG characters, pets and auras."""
from pathlib import Path
P = Path(__file__).resolve().parent.parent / "src" / "render.js"
s = P.read_text(encoding="utf-8")
def sub(old, new):
    global s
    assert old in s, "missing: " + old[:80]
    s = s.replace(old, new, 1)

# NPC drawing
a = s.index("  for (const n of NPCS) ents.push({y: n.y, d: () => drawCharFrame(")
b = s.index("  ents.sort(", a)
s = s[:a] + r'''  const pxs = view.s * view.dpr;
  for (const n of NPCS) {
    const moving = n.path.length && !n.talking;
    if (n.look.pet) { n.pet = n.pet || {x: n.x - 20, y: n.y}; n.pet.x += (n.x - 22 - n.pet.x) * 0.08; n.pet.y += (n.y + 2 - n.pet.y) * 0.08; ents.push({y: n.pet.y, d: () => drawPet(n.look.pet, 0, n.pet.x, n.pet.y, tnow, moving)}); }
    ents.push({y: n.y, d: () => { shadow(n.x, n.y); drawChibi(ctx, n.look, chibiFrame(moving, n.phase, tnow, null, 0, n.def.id), n.dir, n.x, n.y, pxs, 'npc-' + n.def.id); }});
  }
  const L = fullLook(S.look);
  if (L.pet) { const tx = P.x + (P.dir === 'l' ? 24 : -24), ty = P.y + 2; P.pet = P.pet || {x: tx, y: ty}; P.pet.x += (tx - P.pet.x) * 0.07; P.pet.y += (ty - P.pet.y) * 0.07; ents.push({y: P.pet.y, d: () => drawPet(L.pet, (L.lv || {})[L.pet] || 0, P.pet.x, P.pet.y, tnow, P.moving)}); }
  ents.push({y: P.y + 0.1, d: () => {
    if (L.aura) drawAura(ctx, L.aura, (L.lv || {})[L.aura] || 0, P.x, P.y, tnow);
    shadow(P.x, P.y);
    drawChibi(ctx, L, chibiFrame(P.moving, P.phase, tnow, P.act, P.emote, 'me'), P.dir, P.x, P.y, pxs, 'me');
    const a = P.act;
    if (a && a.kind === 'fish') { const dip = a.bit ? Math.sin(tnow / 60) * 2 + 2 : Math.sin(tnow / 400); const hx = P.x + (P.dir === 'l' ? -24 : 24), hy = P.y - 52; ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo((hx + a.bx) / 2, Math.max(hy, a.by) + 6, a.bx, a.by); ctx.stroke(); ctx.fillStyle = '#ff4757'; ctx.beginPath(); ctx.arc(a.bx, a.by + dip - 2, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(a.bx, a.by + dip - 4, 1.6, 0, Math.PI * 2); ctx.fill(); }
    if (Object.values(L.lv || {}).some(v => v >= 6)) { ctx.fillStyle = `hsl(${(tnow / 6) % 360} 95% 70%)`; for (let i = 0; i < 4; i++) { const ang = tnow / 700 + i * 1.57; ctx.fillRect(P.x + Math.cos(ang) * 20 - 1, P.y - 30 + Math.sin(ang * 1.3) * 18 - 1, 2, 2); } }
  }});
''' + s[b:]

# remove the old player block which started with "const L = fullLook(S.look);\n  ents.push({y: P.y + 0.1, d: () => {"

# name tags higher for chibi heads
sub("nameTag(sx(n.x), sy(n.y - 58), n.def.name, '#2c6527'); if (n.bubble) bubble(sx(n.x), sy(n.y - 66), n.bubble.text);",
    "nameTag(sx(n.x), sy(n.y - 66), n.def.name, '#10b981'); if (n.bubble) bubble(sx(n.x), sy(n.y - 76), n.bubble.text);")
sub("nameTag(sx(P.x), sy(P.y - 58), S.name || 'Bạn', '#3a2a1a');", "nameTag(sx(P.x), sy(P.y - 66), S.name || 'Bạn', '#7c5cff');")
sub("if (P.say && tnow - P.say.t < 4000) bubble(sx(P.x), sy(P.y - 66), P.say.text);", "if (P.say && tnow - P.say.t < 4000) bubble(sx(P.x), sy(P.y - 76), P.say.text);")

s += r'''
function shadow(x, y) { ctx.fillStyle = 'rgba(30,20,60,.2)'; ctx.beginPath(); ctx.ellipse(x, y, 11, 3.6, 0, 0, Math.PI * 2); ctx.fill(); }
function chibiFrame(moving, phase, tnow, act, emote, id) {
  if (act && act.t0) {
    const k = tnow - act.t0;
    if (act.kind === 'water') return k % 400 < 200 ? 'water' : 'water2';
    if (act.kind === 'hoe') return k % 360 < 180 ? 'hoe' : 'hoe2';
    if (act.kind === 'harvest') return 'cheer';
  }
  if (act && act.kind === 'fish') return 'fish';
  if (emote && tnow - emote < 1400) return Math.floor((tnow - emote) / 350) % 2 ? 'wave' : 'cheer';
  if (moving) return 'walk' + (Math.floor(phase / 2.4) % 4);
  const seed = id === 'me' ? 0 : id.length * 397;
  if ((tnow + seed) % 3600 < 140) return 'blink';
  return (tnow + seed) % 1400 < 700 ? 'idle0' : 'idle1';
}
function drawPet(id, lv, x, y, tnow, moving) {
  const frame = moving ? Math.floor(tnow / 180) % 2 : Math.floor(tnow / 600) % 2;
  const im = petImage(id, lv, frame); if (!im) return;
  ctx.fillStyle = 'rgba(30,20,60,.18)'; ctx.beginPath(); ctx.ellipse(x, y, 8, 2.6, 0, 0, Math.PI * 2); ctx.fill();
  const sm = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = true;
  const float = id === 'pet_dragon' ? Math.sin(tnow / 300) * 3 - 6 : 0;
  ctx.drawImage(im, x - 13, y - 30 + float, 26, 31); ctx.imageSmoothingEnabled = sm;
}
'''
P.write_text(s, encoding="utf-8")
print("ok")
