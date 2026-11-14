/* ===================== VƯỜN CHỮ ACCOUNTS (Supabase): sign up, log in, cloud save shared by web and app ===================== */
// The publishable key is meant to ship inside the app; row-level security on the server keeps each save private.
const SB = {url: 'https://rjleieedikzijqxzdwuj.supabase.co', key: 'sb_publishable_iG63pgXVafEUmVCNnYAcgw_y4KDlV4L', sess: null, device: ''};
const SB_SESS = 'vc-sb-session', SB_DEV = 'vc-device';
const userEmail = u => `${u}@players.vuonchu.app`;
const acctKey = () => `vuon-chu-acct-${Store.uid}`;
const inClaude = () => !!(window.claude && window.claude.use);
function sbInit() {
  try { SB.sess = JSON.parse(localStorage.getItem(SB_SESS) || 'null'); } catch (e) { SB.sess = null; }
  try { SB.device = localStorage.getItem(SB_DEV) || ''; if (!SB.device) { SB.device = (inClaude() ? 'claude-' : /VuonChuApp|; wv\)/.test(navigator.userAgent) ? 'app-' : 'web-') + Math.random().toString(36).slice(2, 10); localStorage.setItem(SB_DEV, SB.device); } } catch (e) { SB.device = 'dev-' + Math.random().toString(36).slice(2, 8); }
}
function sbSetSess(s) { SB.sess = s; try { s ? localStorage.setItem(SB_SESS, JSON.stringify(s)) : localStorage.removeItem(SB_SESS); } catch (e) {} }
async function sbRaw(path, opts = {}, token) {
  const h = Object.assign({apikey: SB.key, 'Content-Type': 'application/json'}, opts.headers || {});
  if (token) h.Authorization = 'Bearer ' + token;
  let r; try { r = await fetch(SB.url + path, Object.assign({}, opts, {headers: h})); } catch (e) { throw {status: 0, code: 'network', msg: String(e && e.message || e)}; }
  const txt = await r.text(); let j = null; try { j = txt ? JSON.parse(txt) : null; } catch (e) {}
  if (!r.ok) throw {status: r.status, code: j && (j.error_code || j.code || j.error), msg: (j && (j.msg || j.message || j.error_description)) || txt};
  return j;
}
const sessFrom = (j, username) => ({access_token: j.access_token, refresh_token: j.refresh_token, expires_at: j.expires_at || Math.floor(Date.now() / 1000) + (j.expires_in || 3600), uid: j.user.id, username: username || (j.user.user_metadata && j.user.user_metadata.username) || j.user.email.split('@')[0]});
async function sbToken() {
  const s = SB.sess; if (!s) throw {status: 401, code: 'no_session'};
  if (s.expires_at - 90 > Date.now() / 1000) return s.access_token;
  const j = await sbRaw('/auth/v1/token?grant_type=refresh_token', {method: 'POST', body: JSON.stringify({refresh_token: s.refresh_token})});
  sbSetSess(sessFrom(j, s.username)); return SB.sess.access_token;
}
const sbApi = async (path, opts = {}) => sbRaw(path, opts, await sbToken());

async function sbSignUp(username, password) {
  const j = await sbRaw('/auth/v1/signup', {method: 'POST', body: JSON.stringify({email: userEmail(username), password, data: {username}})});
  if (!j || !j.access_token) throw {code: 'confirm_required'};
  sbSetSess(sessFrom(j, username));
  await sbApi('/rest/v1/profiles?on_conflict=user_id', {method: 'POST', headers: {Prefer: 'resolution=merge-duplicates,return=minimal'}, body: JSON.stringify({user_id: SB.sess.uid, username, name: username})});
}
async function sbSignIn(username, password) {
  const j = await sbRaw('/auth/v1/token?grant_type=password', {method: 'POST', body: JSON.stringify({email: userEmail(username), password})});
  sbSetSess(sessFrom(j, username));
}
async function sbLogout() { try { await sbApi('/auth/v1/logout', {method: 'POST'}); } catch (e) {} sbSetSess(null); }
async function sbFetchSave() {
  const rows = await sbApi(`/rest/v1/saves?user_id=eq.${SB.sess.uid}&select=state,saved_at,device`);
  return rows && rows[0] ? rows[0] : null;
}
function authErr(e) {
  const c = (e && (e.code || '')) + ' ' + (e && e.msg || '');
  if (e && e.status === 0) return 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.';
  if (/already|exists|registered/i.test(c)) return 'Tên đăng nhập này đã có người dùng.';
  if (/invalid_credentials|Invalid login/i.test(c)) return 'Sai tên đăng nhập hoặc mật khẩu.';
  if (/weak_password|Password should/i.test(c)) return 'Mật khẩu quá yếu, cần ít nhất 6 ký tự.';
  if (/confirm_required|not confirmed/i.test(c)) return 'Máy chủ đang bật xác nhận email. Chủ game cần tắt "Confirm email" trong Supabase.';
  if (e && e.status === 429) return 'Thử quá nhiều lần, đợi một lát rồi thử lại.';
  return 'Có lỗi: ' + (e && e.msg ? String(e.msg).slice(0, 120) : 'không rõ');
}

/* ---------- load / save ---------- */
// returns the state to play with, choosing whichever is newer: the server copy or an unsent copy on this device
async function sbLoadState() {
  Store.uid = SB.sess.uid; Store.mode = 'supa';
  let local = null; try { local = JSON.parse(localStorage.getItem(acctKey()) || 'null'); } catch (e) {}
  try {
    const row = await sbFetchSave(); Store.offline = false;
    const srvAt = row ? new Date(row.saved_at).getTime() : 0;
    if (local && local.pending && local.at > srvAt) { Store.syncAt = srvAt; Store.dirty = true; return local.state; }
    Store.syncAt = srvAt;
    return row ? row.state : (local ? local.state : null);
  } catch (e) {
    if (e.status === 401 || e.status === 400) throw e;      // session no longer valid
    Store.offline = true; return local ? local.state : null; // offline: keep playing, sync later
  }
}
// true when another device saved after our last sync
const newerElsewhere = row => !!row && row.device !== SB.device && new Date(row.saved_at).getTime() > (Store.syncAt || 0) + 1000;
function applyServer(row) {
  const at = new Date(row.saved_at).getTime();
  Store.syncAt = at; Store.dirty = false; S = normalize(row.state); startWorld(); resize(); closeModal();
  try { localStorage.setItem(acctKey(), JSON.stringify({state: S, at, pending: false})); } catch (e) {}
  toast('Đã tải tiến độ mới nhất từ thiết bị khác.');
}
async function sbSave(force) {
  // never overwrite newer progress made on another device: take it instead
  const meta = await sbApi(`/rest/v1/saves?user_id=eq.${Store.uid}&select=saved_at,device`);
  if (meta && meta[0] && newerElsewhere(meta[0])) { const row = await sbFetchSave(); if (row && newerElsewhere(row)) return applyServer(row); }
  const at = Date.now();
  try { localStorage.setItem(acctKey(), JSON.stringify({state: S, at, pending: true})); } catch (e) {}
  const iso = new Date(at).toISOString();
  await sbApi('/rest/v1/saves?on_conflict=user_id', {method: 'POST', headers: {Prefer: 'resolution=merge-duplicates,return=minimal'}, body: JSON.stringify({user_id: Store.uid, state: S, device: SB.device, saved_at: iso})});
  Store.syncAt = at; Store.offline = false;
  try { localStorage.setItem(acctKey(), JSON.stringify({state: S, at, pending: false})); } catch (e) {}
  if (Date.now() - Store.lastPublic > 60000 || force) await sbProfile();
}
async function sbProfile() {
  if (!S.created) return; Store.lastPublic = Date.now();
  try { await sbApi('/rest/v1/profiles?on_conflict=user_id', {method: 'POST', headers: {Prefer: 'resolution=merge-duplicates,return=minimal'}, body: JSON.stringify({user_id: Store.uid, username: SB.sess.username, name: (S.name || SB.sess.username).slice(0, 16), lvl: S.lvl, xp: S.xp, words: Object.values(S.m).filter(r => r.m >= 4).length, look: S.look, track: S.study.track, level: S.study.level, updated_at: new Date().toISOString()})}); } catch (e) { console.warn('profile', e); }
}
async function sbBoard() {
  const rows = await sbRaw('/rest/v1/profiles?select=user_id,username,name,lvl,xp,words,look,track,level&order=lvl.desc,xp.desc&limit=30');
  return (rows || []).map(r => Object.assign({id: r.user_id}, r));
}
// another device saved since we last synced: pull its progress in
async function sbPull(quiet) {
  if (Store.mode !== 'supa' || Store.saving || (typeof EX !== 'undefined' && EX && !EX.done)) return;
  try {
    const row = await sbFetchSave(); if (!row) return;
    const at = new Date(row.saved_at).getTime();
    if (newerElsewhere(row)) applyServer(row);
    else if (!quiet) toast('Tiến độ đã khớp với tài khoản.');
  } catch (e) { if (!quiet) toast('Chưa đồng bộ được, kiểm tra mạng.'); }
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) sbPull(true); });
setInterval(() => { if (!document.hidden) sbPull(true); }, 90000);

/* ---------- login screen ---------- */
let AUTH = {tab: 'login', resolve: null, inGame: false};
function authHTML(msg) {
  const reg = AUTH.tab === 'register';
  return `<div class="authcard"><div class="logo">Vườn <span>Chữ</span></div>
    <div class="seg auth-seg"><button class="segb" data-auth="tab" data-t="login" aria-pressed="${!reg}">Đăng nhập</button><button class="segb" data-auth="tab" data-t="register" aria-pressed="${reg}">Tạo tài khoản</button></div>
    <form id="authform" autocomplete="on">
      <label>Tên đăng nhập<input class="field" id="au-user" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="20" placeholder="vd: hieu_2k" required></label>
      <label>Mật khẩu<input class="field" id="au-pass" name="password" type="password" autocomplete="${reg ? 'new-password' : 'current-password'}" minlength="6" required></label>
      ${reg ? '<label>Nhập lại mật khẩu<input class="field" id="au-pass2" type="password" autocomplete="new-password" minlength="6" required></label><p class="note">Tên đăng nhập gồm 3–20 ký tự: chữ thường không dấu, số, dấu gạch dưới. Không cần email.</p>' : ''}
      <p class="autherr" id="au-msg" role="alert">${msg ? esc(msg) : ''}</p>
      <button class="btn big" type="submit" id="au-go">${reg ? 'Tạo tài khoản' : 'Đăng nhập'}</button>
    </form>
    <p class="note">Một tài khoản dùng chung cho bản web và app Android: nhân vật, đồ, nông trại, điểm thi đều đồng bộ.</p>
    ${AUTH.inGame ? '<button class="linkbtn" data-auth="cancel">Để sau</button>' : '<button class="linkbtn" data-auth="guest">Chơi thử không cần tài khoản (chỉ lưu trên máy này)</button>'}</div>`;
}
function showAuth(msg) {
  let box = $('#authbox');
  if (!box) { box = document.createElement('div'); box.id = 'authbox'; box.className = 'authbox'; document.body.appendChild(box); }
  box.hidden = false; box.innerHTML = authHTML(msg);
  const u = $('#au-user'); if (u) u.focus();
}
function hideAuth() { const b = $('#authbox'); if (b) { b.hidden = true; b.innerHTML = ''; } }
const authGate = () => new Promise(res => { AUTH.resolve = res; AUTH.inGame = false; showAuth(); });
function openAuthInGame(tab) { AUTH.inGame = true; AUTH.tab = tab || 'login'; AUTH.resolve = null; closeModal(); showAuth(); }
document.addEventListener('click', e => {
  const t = e.target.closest('[data-auth]'); if (!t) return;
  if (t.dataset.auth === 'tab') { AUTH.tab = t.dataset.t; return showAuth(); }
  if (t.dataset.auth === 'guest') { hideAuth(); if (AUTH.resolve) AUTH.resolve('guest'); return; }
  if (t.dataset.auth === 'cancel') return hideAuth();
});
document.addEventListener('submit', async e => {
  if (e.target.id !== 'authform') return; e.preventDefault();
  const user = $('#au-user').value.trim().toLowerCase(), pass = $('#au-pass').value, msg = $('#au-msg'), go = $('#au-go');
  if (!/^[a-z0-9_]{3,20}$/.test(user)) { msg.textContent = 'Tên đăng nhập 3–20 ký tự: chữ thường không dấu, số hoặc dấu gạch dưới.'; return; }
  if (pass.length < 6) { msg.textContent = 'Mật khẩu cần ít nhất 6 ký tự.'; return; }
  if (AUTH.tab === 'register' && pass !== $('#au-pass2').value) { msg.textContent = 'Hai mật khẩu chưa khớp.'; return; }
  go.disabled = true; go.textContent = 'Đang xử lý…'; msg.textContent = '';
  try {
    if (AUTH.tab === 'register') await sbSignUp(user, pass); else await sbSignIn(user, pass);
    hideAuth();
    if (AUTH.resolve) { const r = AUTH.resolve; AUTH.resolve = null; r('supa'); return; }
    await switchToAccount(AUTH.tab === 'register');
  } catch (err) { console.warn(err); showAuth(authErr(err)); $('#au-user').value = user; }
});
// logging in from inside the game: bring the current progress along when the account is new or empty
async function switchToAccount(isNew) {
  const cur = S;
  try {
    const st = await sbLoadState();
    if (st && !isNew) { S = normalize(st); startWorld(); resize(); toast(`Đã đăng nhập <b>${esc(SB.sess.username)}</b>. Tiến độ đã tải từ tài khoản.`); }
    else { S = cur; await saveNow(true); toast(`Đã ${isNew ? 'tạo tài khoản' : 'đăng nhập'} <b>${esc(SB.sess.username)}</b>. Tiến độ hiện tại đã lưu vào tài khoản.`); }
    if (!S.created) openCreator(true);
    renderHUD();
  } catch (e) { toast('Chưa tải được tài khoản: ' + authErr(e)); }
}
function acctHTML() {
  if (Store.mode === 'supa') return `<div class="acct"><b>Tài khoản: ${esc(SB.sess.username)}</b><p class="note">Tiến độ tự đồng bộ giữa web và app Android. ${Store.offline ? '<b>Đang ngoại tuyến</b>, sẽ gửi lên khi có mạng.' : ''}</p><p class="note" id="savebadge" data-state="ok"></p><div class="row-btns"><button class="btn ghost sm" data-act="sync">Đồng bộ ngay</button><button class="btn ghost sm danger" data-act="logout">Đăng xuất</button></div></div>`;
  const where = Store.mode === 'cloud' ? 'Bạn đang lưu bằng tài khoản Claude (chỉ có trên link Claude).' : 'Bạn đang chơi thử, tiến độ chỉ lưu trên máy này.';
  return `<div class="acct"><b>Tài khoản</b><p class="note">${where} Đăng nhập tài khoản Vườn Chữ để chơi chung tiến độ trên web và app.</p><p class="note" id="savebadge" data-state="ok"></p><div class="row-btns"><button class="btn sm" data-act="login">Đăng nhập</button><button class="btn ghost sm" data-act="register">Tạo tài khoản</button></div></div>`;
}
