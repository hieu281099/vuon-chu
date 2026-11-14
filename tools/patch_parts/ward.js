let WARD = null;
function openWardrobe() {
  WARD = WARD || 'top';
  const L = fullLook(S.look);
  const items = FASHION.filter(f => f.slot === WARD && S.owned.includes(f.id));
  const colorKey = {top: 'topC', bottom: 'bottomC'}[WARD];
  const optional = !['top', 'bottom'].includes(WARD), cur = WARD === 'face' ? L.face2 : L[WARD];
  openModal(`<h2 class="ptitle">Tủ đồ</h2><div class="ward"><div class="ward-prev"><div class="stagebox"><img class="pv hero" src="${portraitSVG(L, {full: true, hand: true})}" alt="Nhân vật của bạn">${L.pet ? `<img class="petmini" src="${svgURL(petSVG(L.pet, (L.lv || {})[L.pet] || 0, 0))}" alt="">` : ''}</div><button class="btn ghost sm" data-act="creator">Sửa ngoại hình</button></div><div class="ward-main">
    <div class="seg">${SLOTS.map(([k, l]) => `<button class="segb" data-act="ward-slot" data-t="${k}" aria-pressed="${WARD === k}">${l}</button>`).join('')}</div>
    <div class="cards">${optional ? `<button class="card ${!cur ? 'on' : ''}" data-act="wear" data-id=""><span class="pv none">Trống</span><b>Bỏ ra</b><small>không dùng</small></button>` : ''}${items.map(f => itemCard(f, L, 'wear', cur === f.id ? 'aria-pressed="true"' : '')).join('') || '<p class="empty">Chưa có món nào. Mua ở CLOTHES SHOP trong Làng.</p>'}</div>
    ${colorKey ? `<h3 class="ph3">Đổi màu</h3><div class="swatches">${CLOTH_COLS.map(c => `<button class="sw" style="background:${c}" data-act="dye" data-c="${c}" aria-pressed="${L[colorKey] === c}" aria-label="${c}"></button>`).join('')}</div>` : ''}
    ${WARD === 'bottom' ? `<h3 class="ph3">Màu giày</h3><div class="swatches">${CLOTH_COLS.map(c => `<button class="sw" style="background:${c}" data-act="dye-shoe" data-c="${c}" aria-pressed="${L.shoeC === c}" aria-label="${c}"></button>`).join('')}</div>` : ''}
  </div></div>`, {label: 'Tủ đồ', wide: true});
}
