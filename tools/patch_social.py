from pathlib import Path
R = Path(__file__).resolve().parent.parent / "src"
def sub(f, a, b, count=1):
    p = R / f; t = p.read_text(encoding="utf-8")
    assert t.count(a) == count, (f, t.count(a), a[:90]); p.write_text(t.replace(a, b), encoding="utf-8")

# new animation frames for interactions
sub("chibi.js", "  cheer: {arms: [150, -150], legs: [-2, -2], bob: -6, face: 'laughs', flap: 16}, wave: {arms: [0, -150], face: 'willing'}",
    "  cheer: {arms: [150, -150], legs: [-2, -2], bob: -6, face: 'laughs', flap: 16}, wave: {arms: [0, -150], face: 'willing'},\n"
    "  hug: {arms: [70, -70], bob: -1, face: 'cute', flap: 10, ph: 1}, kiss: {arms: [20, -40], bob: -2, face: 'love', flap: 8, ph: 2},\n"
    "  punch1: {arms: [10, -110], legs: [-3, 0], bob: -1, face: 'tempered', flap: 14, ph: 0}, punch2: {arms: [-40, -20], legs: [0, -3], face: 'tempered', flap: -6, ph: 2},\n"
    "  dizzy: {arms: [30, -30], legs: [-2, 2], bob: 2, face: 'sleepy', flap: 0, ph: 3}")

M = "mp.js"
sub(M, "cefr: S.cefr || 'A1', track: S.study.track,", "cefr: S.cefr || 'A1', track: S.study.track, gender: S.gender || null,")
sub(M, "Object.assign(o, {name: cleanText(m.name) || 'Người chơi', user: m.user, cefr: m.cefr || 'A1', track: m.track,", "Object.assign(o, {name: cleanText(m.name) || 'Người chơi', user: m.user, cefr: m.cefr || 'A1', track: m.track, gender: m.gender || null,")
sub(M, "  if ((ev === 'wave' || ev === 'like') && d.to === Store.uid) {", "  if (['req', 'res', 'act', 'gift', 'gift_ok'].includes(ev)) return mpSocial(ev, d, o);\n  if ((ev === 'wave' || ev === 'like') && d.to === Store.uid) {")
sub(M, "    <p class=\"note\">Nói chuyện bằng ô", "    ${socialButtons(o)}\n    <p class=\"note\">Nói chuyện bằng ô")
sub(M, "JSON.stringify(S.look) + S.name + S.cefr !== MP.lookKey", "JSON.stringify(S.look) + S.name + S.cefr + S.gender !== MP.lookKey")
sub(M, "MP.lookKey = JSON.stringify(S.look) + S.name + S.cefr;", "MP.lookKey = JSON.stringify(S.look) + S.name + S.cefr + S.gender;")

RD = "render.js"
sub(RD, "drawChibi(ctx, ol, chibiFrame(o.moving, o.phase, tnow, null, o.emote, 'p-' + o.uid),", "drawChibi(ctx, ol, pairFrame(o, tnow) || chibiFrame(o.moving, o.phase, tnow, null, o.emote, 'p-' + o.uid),")
sub(RD, "drawChibi(ctx, L, chibiFrame(P.moving, P.phase, tnow, P.act, P.emote, 'me'),", "drawChibi(ctx, L, pairFrame(P, tnow) || chibiFrame(P.moving, P.phase, tnow, P.act, P.emote, 'me'),")
sub(RD, "  nameTag(sx(P.x), sy(P.y - 68), S.name || 'Bạn', '#7c5cff');", "  nameTag(sx(P.x), sy(P.y - 68), S.name || 'Bạn', '#7c5cff');\n  drawPairFx(sx, sy, s, tnow);")

MN = "main.js"
sub(MN, "    case 'mp-wave': return mpWave(d.id);", """    case 'mp-wave': return mpWave(d.id);
    case 'soc-req': return socRequest(d.k, d.id);
    case 'soc-yes': return socAnswer(true);
    case 'soc-no': return socAnswer(false);
    case 'soc-gift': return openGift(d.id);
    case 'soc-give': return sendGift(d.k, d.v);
    case 'soc-gender': return askGender();
    case 'soc-setg': S.gender = d.v; markDirty(); saveNow(); closeModal(); toast(`Đã chọn giới tính: <b>${GENDER_VI[d.v]}</b>.`); return;
    case 'cc-g': CC.name = $('#cc-name').value; CC.gender = d.v; return renderCreator();""")

G = "game.js"
sub(G, "  CC = {name: S.name || '', look: fullLook(S.look), level: S.study.level, track: S.study.track, first, tab: 'body'};", "  CC = {name: S.name || '', look: fullLook(S.look), level: S.study.level, track: S.study.track, gender: S.gender || null, first, tab: 'body'};")
t = (R / G).read_text(encoding="utf-8")
a = "<span class=\"lbl\">Kiểu áo</span>"
assert t.count(a) == 1
t = t.replace(a, "<span class=\"lbl\">Giới tính</span><div class=\"chips\">${[['m', 'Nam'], ['f', 'Nữ']].map(([v, l]) => `<button class=\"chip\" data-act=\"cc-g\" data-v=\"${v}\" aria-pressed=\"${CC.gender === v}\">${l}</button>`).join('')}</div>" + a)
a = "  S.name = nm; S.look = Object.assign({}, CC.look, {lv: S.look.lv || {}});"
assert t.count(a) == 1
t = t.replace(a, a + " if (CC.gender) S.gender = CC.gender;")
(R / G).write_text(t, encoding="utf-8")
# settings: gender can be changed any time
sub("cloud.js", "function acctHTML() {", "function genderHTML() { return `<div class=\"acct\"><b>Giới tính</b><div class=\"chips\">${[['m', 'Nam'], ['f', 'Nữ']].map(([v, l]) => `<button class=\"chip\" data-act=\"soc-setg\" data-v=\"${v}\" aria-pressed=\"${S.gender === v}\">${l}</button>`).join('')}</div><p class=\"note\">Dùng cho tương tác giữa người chơi (hôn má chỉ giữa nam và nữ).</p></div>`; }\nfunction acctHTML() {")
sub(G, "    ${acctHTML()}\n", "    ${acctHTML()}${genderHTML()}\n")

(R / "style.css").write_text((R / "style.css").read_text(encoding="utf-8") + """
/* ---------- interaction invites and gifts ---------- */
.invite{position:fixed;left:50%;top:calc(70px + env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:80;display:flex;gap:10px;align-items:center;background:#fff;border-radius:18px;padding:10px 14px;box-shadow:0 14px 40px rgba(30,20,80,.35);max-width:min(420px,calc(100% - 20px));font-size:14px;border:2px solid var(--pink)}
.invite[hidden]{display:none}
.invite img{width:48px;height:48px;border-radius:14px;background:linear-gradient(160deg,#dbeafe,#fce7f3);flex:none}
.invite .row-btns{margin-top:6px}
.gifts{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:6px;max-height:260px;overflow:auto}
@media (max-height:480px) and (orientation:landscape){.invite{top:calc(48px + env(safe-area-inset-top,0px))}.gifts{max-height:150px}}
""", encoding="utf-8")
b = Path(__file__).resolve().parent / "build_html.py"; t = b.read_text(encoding="utf-8")
b.write_text(t.replace('"cloud.js", "mp.js",', '"cloud.js", "mp.js", "mp_social.js",'), encoding="utf-8")
print("ok")
