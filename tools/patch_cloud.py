from pathlib import Path
R = Path(__file__).resolve().parent.parent / "src"
def sub(f, a, b):
    p = R / f; t = p.read_text(encoding="utf-8")
    assert t.count(a) == 1, (f, t.count(a), a[:70]); p.write_text(t.replace(a, b), encoding="utf-8")

G = "game.js"
sub(G, """async function initStore() {
  try {
    const c = window.claude;""", """async function initStore() {
  sbInit();
  // 1. a Vườn Chữ account session (web, app, or the Claude page after logging in)
  if (SB.sess) { try { return await sbLoadState(); } catch (e) { console.warn(e); sbSetSess(null); Store.mode = 'local'; } }
  // 2. on the web / in the app: ask to log in or create an account first
  if (!inClaude()) {
    if ((await authGate()) === 'supa') { try { const st = await sbLoadState(); if (st) return st; Store.dirty = true; } catch (e) { console.warn(e); Store.mode = 'local'; } }
    try { const raw = localStorage.getItem(LOCAL_KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  try {
    const c = window.claude;""")
sub(G, """  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(S)); } catch (e) {}
  if (Store.mode !== 'cloud' || Store.saving) { if (Store.saving) Store.dirty = true; return; }""", """  if (Store.mode === 'supa') {
    if (Store.saving) { Store.dirty = true; return; }
    Store.saving = true;
    try { await sbSave(force); setSaveBadge('ok'); } catch (e) { console.warn(e); Store.offline = true; Store.dirty = true; setSaveBadge('err'); if (e && e.status === 401) { sbSetSess(null); Store.mode = 'local'; toast('Phiên đăng nhập đã hết, hãy đăng nhập lại trong Cài đặt.'); } }
    finally { Store.saving = false; }
    return;
  }
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(S)); } catch (e) {}
  if (Store.mode !== 'cloud' || Store.saving) { if (Store.saving) Store.dirty = true; return; }""")
sub(G, "  b.textContent = Store.mode === 'cloud' ?", "  b.textContent = Store.mode === 'supa' ? (s === 'err' ? 'Chưa gửi được lên máy chủ, sẽ tự thử lại' : 'Đã đồng bộ với tài khoản') : Store.mode === 'cloud' ?")
sub(G, """  if (Store.mode === 'cloud') {
    try { const snap = await Store.db.collection('players')""", """  if (Store.mode === 'supa' || !inClaude()) { try { rows = await sbBoard(); } catch (e) { console.warn(e); } }
  else if (Store.mode === 'cloud') {
    try { const snap = await Store.db.collection('players')""")
sub(G, "Mỗi người là một tài khoản Claude đã vào chơi game này.", "Bảng xếp hạng chung của mọi người chơi trên web và app.")
t = (R / G).read_text(encoding="utf-8")
i = t.index('    <div class="acct"><b>Tài khoản</b>'); j = t.index("</div>\n", i) + len("</div>\n")
t = t[:i] + "    ${acctHTML()}\n" + t[j:]
(R / G).write_text(t, encoding="utf-8")

M = "main.js"
sub(M, "    case 'farmshop': return openFarmShop(d.t);", """    case 'farmshop': return openFarmShop(d.t);
    case 'login': return openAuthInGame('login');
    case 'register': return openAuthInGame('register');
    case 'logout': if (t.dataset.armed) { saveNow(true).finally(() => sbLogout().then(() => location.reload())); } else { t.dataset.armed = 1; t.textContent = 'Bấm lần nữa để đăng xuất'; } return;
    case 'sync': saveNow(true).then(() => sbPull(false)); return;""")

C = "style.css"
sub(C, ".loadbar{height:10px;background:var(--surface-3);border-radius:99px;overflow:hidden;margin:14px 0}\n.loadbar i{", ".panel .loadbar{height:10px;background:var(--surface-3);border-radius:99px;overflow:hidden;margin:14px 0}\n.panel .loadbar i{")
(R / C).write_text((R / C).read_text(encoding="utf-8") + """
/* ---------- account screen ---------- */
.authbox{position:fixed;inset:0;z-index:60;display:grid;place-items:center;padding:16px;background:radial-gradient(circle at 30% 20%,#3a2b8a,#1b1640 60%);overflow:auto}
.authbox[hidden]{display:none}
.authcard{width:min(400px,100%);background:var(--surface);border-radius:28px;padding:24px 22px;box-shadow:var(--shadow);text-align:center}
.authcard .logo{color:var(--ink);margin-bottom:12px}
.auth-seg{justify-content:center;margin-bottom:12px}
#authform{display:flex;flex-direction:column;gap:10px;text-align:left}
#authform label{font-weight:800;font-size:13.5px;display:flex;flex-direction:column;gap:4px}
#authform .btn{width:100%}
.autherr{color:var(--bad);font-weight:700;font-size:13.5px;min-height:1em;margin:0}
.authcard .note{margin:10px 0 6px}
.authcard .linkbtn{margin-top:4px;font-size:13.5px}
""", encoding="utf-8")
print("ok")
