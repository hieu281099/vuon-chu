/* ===================== CHARACTER CREATOR ===================== */
let CC = null;
function openCreator(first) {
  CC = {name: S.name || '', look: fullLook(S.look), level: S.study.level, track: S.study.track, first, tab: 'body'};
  renderCreator();
}
function renderCreator() {
  const L = CC.look, tabs = [['body', 'Dáng người'], ['hair', 'Tóc'], ['face', 'Khuôn mặt'], ['study', 'Học tập']].filter(t => CC.first || t[0] !== 'study');
  const sw = (k, list) => `<div class="swatches">${list.map(c => `<button class="sw" style="background:${c}" data-act="cc" data-k="${k}" data-v="${c}" aria-pressed="${L[k] === c}" aria-label="${c}"></button>`).join('')}</div>`;
  const chips = (k, list, vi) => `<div class="chips">${list.map(v => `<button class="chip" data-act="cc" data-k="${k}" data-v="${v}" aria-pressed="${String(L[k]) === String(v)}">${esc(vi(v))}</button>`).join('')}</div>`;
  let body = '';
  if (CC.tab === 'body') body = `<span class="lbl">Màu da</span><div class="swatches">${SKIN_TONES.map((t, i) => `<button class="sw" style="background:${t.b}" data-act="cc" data-k="skin" data-v="${i}" aria-pressed="${L.skin === i}" aria-label="Màu da ${i + 1}"></button>`).join('')}</div>
    <span class="lbl">Kiểu áo</span>${chips('top', ['top_tee', 'top_dress'], v => FASH[v].vi)}<span class="lbl">Màu áo</span>${sw('topC', CLOTH_COLS)}<span class="lbl">Màu quần</span>${sw('bottomC', CLOTH_COLS)}`;
  if (CC.tab === 'hair') body = `<span class="lbl">Tóc phía trước</span>${chips('hairF', HAIR_F, v => HAIR_F_VI[v])}<span class="lbl">Tóc phía sau</span>${chips('hairB', HAIR_B, v => HAIR_B_VI[v])}<span class="lbl">Màu tóc</span>${sw('hairC', HAIR_COLS)}`;
  if (CC.tab === 'face') body = `<span class="lbl">Biểu cảm</span>${chips('face', FACES, v => FACE_VI[v])}<span class="lbl">Râu</span>${chips('beard', [null, 'short', 'middle', 'long'], v => ({null: 'Không', short: 'Ria mép', middle: 'Râu quai nón', long: 'Râu dài'})[v])}`;
  if (CC.tab === 'study') body = `<span class="lbl">Trình độ tiếng Anh hiện tại</span><div class="chips">${['A1','A2','B1','B2'].map(lv => `<button class="chip" data-act="cc-lv" data-v="${lv}" aria-pressed="${CC.level === lv}">${lv} · ${LEVEL_VI[lv]}</button>`).join('')}</div>
    <span class="lbl">Chuyên ngành muốn học</span><div class="chips">${Object.entries(TRACKS).map(([id, t]) => `<button class="chip" data-act="cc-tr" data-v="${id}" aria-pressed="${CC.track === id}">${esc(t.vi)}</button>`).join('')}</div>`;
  const html = `<h2 class="ptitle">${CC.first ? 'Tạo nhân vật' : 'Sửa ngoại hình'}</h2>${CC.first ? '<p class="psub">Chọn tên, ngoại hình và trình độ tiếng Anh trước khi vào làng.</p>' : ''}
    <div class="ward"><div class="ward-prev"><div class="stagebox"><img class="pv hero" id="cc-prev" src="${portraitSVG(L, {full: true})}" alt="Xem trước nhân vật"></div></div><div class="ward-main">
      <label class="lbl" for="cc-name">Tên nhân vật</label><input id="cc-name" class="field" maxlength="14" placeholder="Ví dụ: Hiếu" value="${esc(CC.name)}">
      <div class="seg">${tabs.map(([k, l]) => `<button class="segb" data-act="cc-tab" data-t="${k}" aria-pressed="${CC.tab === k}">${l}</button>`).join('')}</div>${body}
    </div></div><div class="row-btns end"><button class="btn big" data-act="cc-done">${CC.first ? 'Vào làng' : 'Lưu'}</button></div>`;
  const keep = $('#modal .panel') ? $('#modal .panel').scrollTop : 0;
  openModal(html, {label: 'Nhân vật', noClose: CC.first, wide: true});
  $('#modal .panel').scrollTop = keep;
}
function ccDone() {
  const nm = ($('#cc-name').value || '').trim().slice(0, 14);
  if (!nm) { toast('Hãy đặt tên cho nhân vật.'); $('#cc-name').focus(); return; }
  S.name = nm; S.look = Object.assign({}, CC.look, {lv: S.look.lv || {}});
  const first = CC.first; S.created = true;
  if (CC.look.top === 'top_dress' && !S.owned.includes('top_dress')) S.owned.push('top_dress');
  if (first) { S.study.level = CC.level; S.study.track = CC.track; S.study.unlocked = LEVELS.slice(0, LEVELS.indexOf(CC.level) + 1); S.orders = [genOrder(['carrot']), genOrder(['radish', 'carrot']), genOrder(['egg'])]; }
  CC = null; closeModal(); saveNow(true);
  if (first) { speak(`Hello, ${S.name}! Welcome to the farm.`, true); toast(`Chào <b>${esc(S.name)}</b>! Cây cà rốt có ngôi sao đã chín, chạm vào để thu hoạch.`, 4500); }
}
