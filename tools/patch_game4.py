"""Patch src/game.js: park NPCs, IELTS daily challenge, world map travel, credits without LPC."""
from pathlib import Path
R = Path(__file__).resolve().parent
P = R.parent / "src" / "game.js"
s = P.read_text(encoding="utf-8")
def sub(old, new, cnt=1):
    global s
    assert old in s, "missing: " + old[:90]
    s = s.replace(old, new, cnt)
def between(a, b, new):
    global s
    i = s.index(a); j = s.index(b, i)
    s = s[:i] + new + s[j:]

# NPC homes for the new village layout + park NPCs
sub("home:[6, 9], role:'shop'", "home:[6, 8], role:'shop'")
sub("home:[32, 23], role:'forge'", "home:[33, 21], role:'forge'")
sub("home:[17, 25], role:'teacher'", "home:[16, 25], role:'teacher'")
sub("home:[25, 9], role:'chat', wander:true", "home:[24, 9], role:'chat', wander:true")
sub("const fullLook = L =>", """NPC_DEFS.push(
  {id:'ha', name:'Chị Hà', map:'park', home:[18, 16], role:'ielts', look:L_({skin:0, hairF:'elegant', hairB:'long', hairC:'#5B3423', top:'top_jacket', topC:'#545AF2', bottom:'bot_pants', bottomC:'#1F1B24', face2:'face_round', hand:'hand_lollipop'}),
    greet:['IELTS challenge today!','Band 7, here we come!'], line:() => ({en:`Hi ${S.name}! Ready for today's IELTS challenge?`, vi:`Chào ${S.name}! Sẵn sàng làm thử thách IELTS hôm nay chưa?`})},
  {id:'bao', name:'Anh Bảo', map:'park', home:[10, 11], role:'chat', wander:true, look:L_({skin:3, hairF:'straight', hairC:'#1F1B24', top:'top_hoodie', topC:'#FF6B35', bottom:'bot_shorts', bottomC:'#1F1B24', hat:'hat_cap', pet:'pet_puppy'}),
    greet:['Morning run!','Nice weather today.'], line:() => ({en:`Hey ${S.name}! Do you jog in the park too?`, vi:`Chào ${S.name}! Bạn cũng chạy bộ trong công viên à?`})}
);
const fullLook = L =>""")
sub("  if (role === 'teacher') return teacherHTML();", """  if (role === 'teacher') return teacherHTML();
  if (role === 'ielts') return ieltsHTML();""")
sub("function teacherHTML() {", r'''function ieltsHTML() {
  const today = new Date().toISOString().slice(0, 10), done = S.ieltsDay === today;
  return `<p class="note">Thử thách IELTS hằng ngày: 5 câu từ vựng học thuật và paraphrase theo band bạn chọn. Đúng từ 4 câu được <b>1 kim cương</b> và <b>3 ngọc lục bảo</b> (mỗi ngày một lần).</p>
    <div class="chips">${['B1', 'B2', 'C1'].map(lv => `<button class="chip" data-act="ielts-band" data-t="${lv}" aria-pressed="${(S.ieltsBand || 'B1') === lv}">${IELTS_BAND[lv]}</button>`).join('')}</div>
    <div class="row-btns"><button class="btn gold" data-act="ielts-go">${done ? 'Luyện thêm (không thưởng)' : 'Bắt đầu thử thách hôm nay'}</button><button class="btn ghost" data-act="chat">Nói chuyện</button></div>`;
}
function startIelts() {
  const band = S.ieltsBand || 'B1', words = shuffle(TRACK_WORDS.ielts[band]).slice(0, 5), today = new Date().toISOString().slice(0, 10), rewarded = S.ieltsDay === today;
  let n = 0, ok = 0;
  const next = () => {
    if (n >= words.length) {
      if (!rewarded && ok >= 4) { S.ieltsDay = today; giveGems(3, 1, 'thử thách IELTS'); }
      openModal(`<h2 class="ptitle">${ok >= 4 ? 'Xuất sắc!' : 'Cố lên!'}</h2><p class="psub">Bạn đúng ${ok}/5 câu ${IELTS_BAND[band]}.${!rewarded && ok >= 4 ? ' Đã nhận thưởng hôm nay.' : rewarded ? ' Hôm nay bạn đã nhận thưởng rồi.' : ' Cần 4 câu để nhận thưởng.'}</p><div class="row-btns"><button class="btn" data-act="close">Xong</button></div>`, {label: 'Kết quả IELTS'}); markDirty(); return;
    }
    const w = words[n++];
    startQuiz({tag: `IELTS ${IELTS_BAND[band]} · câu ${n}/5`, word: w, type: rand(['syn', 'syn', 'fill', 'en2vi']), next: true, onResult: r => { if (r) ok++; return ''; }, onNext: next});
  };
  next();
}
function teacherHTML() {''')
# allow quizzes to chain through opt.onNext
sub("<div class=\"row-btns\"><button class=\"btn\" data-act=\"${Q.opt.next ? 'q-next' : 'close'}\" id=\"q-next\">",
    "<div class=\"row-btns\"><button class=\"btn\" data-act=\"${Q.opt.next ? 'q-next' : 'close'}\" id=\"q-next\">")
# credits: nemo + own vector art
between("function openCredits() {", "function openHelp() {", r'''function openCredits() {
  openModal(`<h2 class="ptitle">Ghi công hình ảnh</h2><p class="psub">Nhân vật chibi dựa trên bộ hình CC0 của nemo. Đồ thời trang, cảnh vật, cây trồng, con vật và biểu tượng được vẽ riêng cho Vườn Chữ theo cùng phong cách.</p>
    <ul class="credits"><li><b>Character Creation Asset Pack</b><br>nemo (nonemo.itch.io)<br><small>CC0 · <a href="https://nonemo.itch.io/character-creation-asset-pack" target="_blank" rel="noopener">nonemo.itch.io/character-creation-asset-pack</a></small></li>
    <li><b>Phông chữ</b><br>Nunito, Baloo 2 (Google Fonts)<br><small>SIL Open Font License</small></li></ul>`, {label: 'Ghi công', wide: true});
}
/* ---------- world map travel ---------- */
const ZONES = [
  {id:'farm', vi:'Nông trại', desc:'Ruộng, chuồng trại, ao cá nhỏ', at:[10, 10], grad:'linear-gradient(135deg,#8ED66B,#3FAE5A)'},
  {id:'village', vi:'Làng', desc:'Chợ, cửa hàng, trường học, lò nâng cấp', at:[17, 13], grad:'linear-gradient(135deg,#FFB547,#FF7AB6)'},
  {id:'park', vi:'Công viên', desc:'Đài phun nước, thử thách IELTS', at:[15, 18], grad:'linear-gradient(135deg,#F7A8CB,#9B6CFF)'},
  {id:'river', vi:'Bờ sông', desc:'Câu cá, cầu tàu, bãi cát', at:[14, 11], grad:'linear-gradient(135deg,#6CC8F4,#5B8DEF)'}
];
function openMap() {
  openModal(`<h2 class="ptitle">Bản đồ</h2><p class="psub">Chọn nơi muốn đến. Bạn cũng có thể đi bộ qua các biển chỉ đường ở mép bản đồ.</p>
    <div class="zones">${ZONES.map(z => `<button class="zone ${S.map === z.id ? 'here' : ''}" data-act="travel" data-t="${z.id}" style="background:${z.grad}"><b>${MAPS[z.id].en}</b><span>${z.vi}</span><small>${z.desc}</small>${S.map === z.id ? '<i>Bạn đang ở đây</i>' : ''}</button>`).join('')}</div>`, {label: 'Bản đồ', wide: true});
}
function travel(id) {
  const z = ZONES.find(q => q.id === id); if (!z) return;
  closeModal(); const f = $('#fade'); f.innerHTML = `<b>${MAPS[id].en}</b><span>${z.vi}</span>`; f.classList.add('on');
  setTimeout(() => { changeMap(id, z.at[0], z.at[1]); setTimeout(() => f.classList.remove('on'), 120); }, 380);
}
''')
P.write_text(s, encoding="utf-8")
print("ok")
