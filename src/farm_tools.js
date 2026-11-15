/* ===================== FARM TOOLS: run-based Auto Farm, quick plant, quick buy (each run unlocked by a short English test) ===================== */
// No timers: open the tools on the farm, pick a tool, pass its test, and the tool does the whole job once. Unlimited runs.
const TOOLS = {
  auto:   {vi: 'Auto Farm', desc: 'Làm hết việc trong trại một lượt: nhổ cỏ, thu hoạch, gieo lại, tưới cây trồng; lấy sản phẩm và cho vật nuôi ăn.', n: 10, pass: 7},
  plant:  {vi: 'Gieo hạt nhanh', desc: 'Gieo một loại hạt vào tất cả ô đất trống cùng lúc.', n: 5, pass: 4},
  seeds:  {vi: 'Mua giống nhanh', desc: 'Mua đủ hạt cho mọi ô đất đang trống (hoặc số lượng bạn chọn).', n: 5, pass: 4},
  animal: {vi: 'Mua vật nuôi nhanh', desc: 'Mua một loại vật nuôi cho tất cả chỗ trống trong chuồng.', n: 5, pass: 4}
};
let TOOL = {kind: null, pick: null, qty: 0};
const emptyPlots = () => S.plots.filter(p => p.u && !p.c).length;
function farmTodo() {
  const now = Date.now(), st = S.plots.map(p => plotState(p, now));
  return {weed: st.filter(x => x === 'W').length, ripe: st.filter(x => x === 'R').length, dry: st.filter(x => x === 'D').length, empty: st.filter(x => x === 'E').length,
    hungry: S.animals.filter(a => a && a.st === 'hungry').length, ready: S.animals.filter(a => a && (a.st === 'ready' || (a.st === 'producing' && now >= a.r))).length};
}
function openFarmTools() {
  const t = farmTodo(), seedsOwned = CROPS.filter(c => (S.seeds[c.id] || 0) > 0);
  const todo = [['Cỏ dại', t.weed], ['Cây chín', t.ripe], ['Ruộng khô', t.dry], ['Ô trống', t.empty], ['Vật nuôi đói', t.hungry], ['Sản phẩm chờ lấy', t.ready]].filter(x => x[1]);
  openModal(`<h2 class="ptitle">Tiện ích nông trại</h2><p class="psub">${PLAY() ? 'Bấm là chạy ngay, không giới hạn số lượt.' : 'Mỗi lần dùng cần qua một bài test tiếng Anh ngắn. Không giới hạn số lượt.'}</p>
    <div class="todo">${todo.length ? todo.map(([l, n]) => `<span><b>${n}</b> ${l}</span>`).join('') : '<span>Nông trại đang ổn, chưa có việc gì cần làm.</span>'}</div>
    <div class="tools">
      <div class="tool"><b>${TOOLS.auto.vi}</b><p>${TOOLS.auto.desc}</p>${PLAY() ? '' : `<small>Bài test ${TOOLS.auto.n} câu, đúng từ ${TOOLS.auto.pass}.</small>`}<button class="btn gold" data-act="tool-go" data-k="auto">Chạy 1 lượt</button></div>
      <div class="tool"><b>${TOOLS.plant.vi}</b><p>${TOOLS.plant.desc} Đang có ${t.empty} ô trống.</p>
        ${seedsOwned.length ? `<select class="field" id="tool-seed">${seedsOwned.map(c => `<option value="${c.id}">${esc(c.en)} · ${esc(c.vi)} (có ${S.seeds[c.id]} hạt)</option>`).join('')}</select>` : '<small>Chưa có hạt giống nào.</small>'}
        ${PLAY() ? '' : `<small>Bài test ${TOOLS.plant.n} câu, đúng từ ${TOOLS.plant.pass}.</small>`}<button class="btn" data-act="tool-go" data-k="plant" ${seedsOwned.length && t.empty ? '' : 'disabled'}>Gieo hết ô trống</button></div>
      <div class="tool"><b>${TOOLS.seeds.vi}</b><p>${TOOLS.seeds.desc}</p>
        <select class="field" id="tool-crop">${CROPS.filter(c => !c.rare && c.lvl <= S.lvl).map(c => `<option value="${c.id}">${esc(c.en)} · ${esc(c.vi)} · ${c.cost} xu/hạt</option>`).join('')}</select>
        <select class="field" id="tool-qty"><option value="0">Đủ cho ${Math.max(1, t.empty)} ô trống</option><option value="20">20 hạt</option><option value="50">50 hạt</option><option value="100">100 hạt</option></select>
        ${PLAY() ? '' : `<small>Bài test ${TOOLS.seeds.n} câu, đúng từ ${TOOLS.seeds.pass}.</small>`}<button class="btn" data-act="tool-go" data-k="seeds">Mua hạt</button></div>
      <div class="tool"><b>${TOOLS.animal.vi}</b><p>${TOOLS.animal.desc} Chuồng còn ${barnCap() - barnCount()} chỗ trống.</p>
        <select class="field" id="tool-animal">${ANIMALS.filter(A => A.lvl <= S.lvl).map(A => `<option value="${A.id}">${esc(A.en)} · ${esc(A.vi)} · ${A.cost} xu</option>`).join('')}</select>
        ${PLAY() ? '' : `<small>Bài test ${TOOLS.animal.n} câu, đúng từ ${TOOLS.animal.pass}.</small>`}<button class="btn" data-act="tool-go" data-k="animal" ${barnCap() - barnCount() > 0 ? '' : 'disabled'}>Mua cho đủ chuồng</button></div>
    </div>`, {label: 'Tiện ích nông trại', wide: true});
}
function buildToolTest(kind) {
  const T = TOOLS[kind], lv = S.study.level, li = LEVELS.indexOf(lv), qs = [];
  const nv = Math.max(3, T.n - 2);
  shuf(levelWords(lv, S.study.track)).slice(0, nv).forEach(w => qs.push(vocabQ(w, lv)));
  shuf([...GRAMMAR[lv], ...(li ? GRAMMAR[LEVELS[li - 1]] : [])]).slice(0, T.n - qs.length).forEach(([q, o, a]) => qs.push(mcqFrom(q, o, a, {lv})));
  return {id: 'tool-' + kind, kind: 'tool', tool: kind, pass: T.pass, title: `${T.vi} · bài test ${lv}`, sections: [{id: 'V', skill: 'grammar', title: 'Từ vựng & Ngữ pháp', minutes: 5,
    note: `${qs.length} câu ở trình độ ${lv}. Đúng từ ${T.pass}/${qs.length} câu là ${T.vi.toLowerCase()} chạy ngay.`, parts: [{title: 'Chọn đáp án đúng', questions: shuf(qs)}]}]};
}
function startTool(kind) {
  const v = id => { const el = $('#' + id); return el ? el.value : null; };
  TOOL = {kind, pick: kind === 'plant' ? v('tool-seed') : kind === 'seeds' ? v('tool-crop') : kind === 'animal' ? v('tool-animal') : null, qty: kind === 'seeds' ? +v('tool-qty') : 0};
  if (kind === 'seeds') { const c = CROP[TOOL.pick], n = TOOL.qty || Math.max(1, emptyPlots()); if (S.coins < c.cost * n) { toast(`Cần ${c.cost * n} xu để mua ${n} hạt ${esc(c.en)}.`); return; } }
  if (kind === 'animal') { const A = ANIMAL[TOOL.pick]; if (S.coins < A.cost) { toast(`Cần ít nhất ${A.cost} xu để mua ${esc(A.en)}.`); return; } }
  if (PLAY()) { const m = runTool(kind); addXP(10); closeModal(); toast(`<b>${esc(TOOLS[kind].vi)}</b>: ${m}`, 4000); renderHUD(); markDirty(); return; }
  openExam(buildToolTest(kind));
}
// what each tool does once the test is passed; returns a short summary for the result screen
function runTool(kind) {
  const now = Date.now();
  if (kind === 'auto') {
    const before = farmTodo(); S.auto = {log: {}}; autoStep(now);
    // fill remaining empty plots with whatever seeds there are, best crops first
    const L = S.auto.log, pool = CROPS.filter(c => (S.seeds[c.id] || 0) > 0).sort((a, b) => b.sell - a.sell);
    for (const p of S.plots) { if (!p.u || p.c) continue; const c = pool.find(x => S.seeds[x.id] > 0); if (!c) break; S.seeds[c.id]--; Object.assign(p, {c: c.id, p: 0, w: now + c.time * 550, weed: false, hw: false}); L.plant = (L.plant || 0) + 1; L.water = (L.water || 0) + 1; }
    const sm = autoSummary(); S.auto = null; spawnAnimals();
    return sm ? `Đã làm: ${sm}.` : 'Nông trại không có việc gì cần làm lúc này.';
  }
  if (kind === 'plant') {
    const c = CROP[TOOL.pick]; let n = 0;
    for (const p of S.plots) { if (!p.u || p.c || !(S.seeds[c.id] > 0)) continue; S.seeds[c.id]--; Object.assign(p, {c: c.id, p: 0, w: now + c.time * 550, weed: false, hw: false}); n++; }
    return n ? `Đã gieo và tưới ${n} ô ${esc(c.en)}.` : 'Không còn ô trống hoặc hết hạt.';
  }
  if (kind === 'seeds') {
    const c = CROP[TOOL.pick], want = TOOL.qty || Math.max(1, emptyPlots()), n = Math.min(want, Math.floor(S.coins / c.cost));
    if (!n) return 'Không đủ xu để mua hạt.';
    S.coins -= n * c.cost; S.seeds[c.id] = (S.seeds[c.id] || 0) + n;
    return `Đã mua ${n} hạt ${esc(c.en)} (${n * c.cost} xu).`;
  }
  if (kind === 'animal') {
    const A = ANIMAL[TOOL.pick]; let n = 0;
    while (S.coins >= A.cost) { const i = freeSlot(); if (i < 0) break; S.coins -= A.cost; S.animals[i] = {t: A.id, st: 'hungry', r: 0}; n++; }
    spawnAnimals();
    return n ? `Đã mua ${n} con ${esc(A.en)} (${n * A.cost} xu).` : 'Chuồng đã đầy hoặc không đủ xu.';
  }
  return '';
}
