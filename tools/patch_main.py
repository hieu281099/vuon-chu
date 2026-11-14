"""Update src/main.js for chibi looks, gems, forge and the modern HUD."""
from pathlib import Path
P = Path(__file__).resolve().parent.parent / "src" / "main.js"
s = P.read_text(encoding="utf-8")
def sub(old, new):
    global s
    assert old in s, "missing: " + old[:80]
    s = s.replace(old, new, 1)

sub("""  $('#hud-xp').style.width = Math.min(100, S.xp / need(S.lvl) * 100) + '%';""",
    """  const pct = Math.min(100, S.xp / need(S.lvl) * 100); $('#hud-xp').style.width = pct + '%'; $('#hud-ring').style.setProperty('--p', pct);
  $('#hud-em').textContent = S.em; $('#hud-di').textContent = S.di;""")
sub("""  const L = fullLook(S.look), url = portraitURL(L);
  if (url) $('#hud-face').src = url; else whenSheet(L, 'walk').then(() => { $('#hud-face').src = portraitURL(L); });""",
    """  const face = portraitSVG(fullLook(S.look)); if ($('#hud-face').getAttribute('src') !== face) $('#hud-face').src = face;""")
sub("""    case 'wear': { const slot = WARD; S.look[slot] = d.id || (['over', 'hat', 'face'].includes(slot) ? null : S.look[slot]); markDirty(); renderHUD(); openWardrobe(); return; }""",
    """    case 'wear': { const key = WARD === 'face' ? 'face2' : WARD; S.look[key] = d.id || (['top', 'bottom'].includes(WARD) ? S.look[key] : null); markDirty(); renderHUD(); return openWardrobe(); }
    case 'dye-shoe': S.look.shoeC = d.c; markDirty(); renderHUD(); return openWardrobe();
    case 'shop-tab': SHOPTAB = d.t; BUY = null; return refreshNpc();
    case 'forge-pick': FORGE = {id: d.id, quiz: null, res: null}; return refreshNpc();
    case 'forge-quiz': return forgeQuiz();
    case 'forge-go': return forgeGo();
    case 'exchange': FORGE = Object.assign(FORGE || {}, {ex: true}); return refreshNpc();
    case 'forge-back': if (FORGE) FORGE.ex = false; return refreshNpc();
    case 'ex': { const n = +d.n; if (S.coins >= n * 100) { S.coins -= n * 100; S.em += n; sfx('coin'); renderHUD(); markDirty(); } return refreshNpc(); }
    case 'cc-tab': CC.name = $('#cc-name').value; CC.tab = d.t; return renderCreator();""")
sub("""    case 'dye': { const k = {hair: 'hairC', top: 'topC', over: 'overC', bottom: 'bottomC', feet: 'feetC', hat: 'hatC'}[WARD]; if (k) { S.look[k] = d.c; markDirty(); renderHUD(); whenSheet(fullLook(S.look), 'walk').then(openWardrobe); } return; }""",
    """    case 'dye': { const k = {top: 'topC', bottom: 'bottomC'}[WARD]; if (k) { S.look[k] = d.c; markDirty(); renderHUD(); openWardrobe(); } return; }""")
sub("""    case 'cc': CC.name = $('#cc-name') ? $('#cc-name').value : CC.name; CC.look[d.k] = d.v; return renderCreator();""",
    """    case 'cc': CC.name = $('#cc-name') ? $('#cc-name').value : CC.name; CC.look[d.k] = d.k === 'skin' ? +d.v : (d.v === 'null' ? null : d.v); return renderCreator();""")
# migration + daily gift
sub("""  s.look = Object.assign({}, DEFAULT_LOOK, s.look || {});""",
    """  if (!s.look || s.look.body || typeof s.look.skin !== 'number') { s.look = fullLook(DEFAULT_LOOK); s.owned = [...FREE_ITEMS]; }
  s.look = fullLook(s.look); s.owned = (s.owned || []).filter(id => FASH[id]); for (const id of FREE_ITEMS) if (!s.owned.includes(id)) s.owned.push(id);
  if (typeof s.em !== 'number') s.em = 4; if (typeof s.di !== 'number') s.di = 1; s.v = 4;""")
sub("""    await whenSheet(fullLook(S.look), 'walk');
    await Promise.all(NPC_DEFS.map(d => whenSheet(fullLook(d.look), 'walk')));""",
    """    const today = new Date().toISOString().slice(0, 10);""")
sub("""    else { showBanner(MAPNOW().en, MAPNOW().vi);""",
    """    else { if (S.daily !== today) { S.daily = today; giveGems(2, 0, 'quà đăng nhập hôm nay'); markDirty(); } showBanner(MAPNOW().en, MAPNOW().vi);""")
P.write_text(s, encoding="utf-8")
print("ok")
