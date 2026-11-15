from pathlib import Path
R = Path(__file__).resolve().parent.parent / "src"
def sub(f, a, b, count=1):
    p = R / f; t = p.read_text(encoding="utf-8")
    assert t.count(a) == count, (f, t.count(a), a[:90]); p.write_text(t.replace(a, b), encoding="utf-8")

T = "tests.js"
sub(T, "if (R.kind === 'placement' || R.kind === 'auto' || R.kind === 'levelup') {", "if (R.kind === 'placement' || R.kind === 'auto' || R.kind === 'levelup' || R.kind === 'tool') {")
sub(T, "  if (R.kind === 'auto' && R.pct >= 70) {", "  if (R.kind === 'tool') { R.passed = R.raw >= (EX.test.pass || 4); R.toolMsg = R.passed ? runTool(EX.test.tool) : ''; }\n  if (R.kind === 'auto' && R.pct >= 70) {")
sub(T, "  if (R.kind === 'auto') head = ", "  if (R.kind === 'tool') head = `<div class=\"score big ${R.raw >= (EX.test.pass || 4) ? 'pass' : 'fail'}\"><small>${esc(TOOLS[EX.test.tool].vi)}</small><b>${R.raw}/${R.total}</b><span class=\"note\">cần ${EX.test.pass}/${R.total} câu</span></div>`;\n  if (R.kind === 'auto') head = ")
sub(T, "  if (R.kind === 'auto') tail = ", "  if (R.kind === 'tool') tail = R.passed ? `<div class=\"fb good\"><strong>${esc(TOOLS[EX.test.tool].vi)} xong!</strong> ${R.toolMsg}</div><div class=\"row-btns\"><button class=\"btn\" data-act=\"farmtools\">Tiện ích khác</button></div>` : `<div class=\"fb miss\"><strong>Chưa đạt.</strong> Cần đúng ${EX.test.pass}/${R.total} câu. Thử lại ngay, không giới hạn số lần.</div><div class=\"row-btns\"><button class=\"btn\" data-act=\"farmtools\">Thử lại</button></div>`;\n  if (R.kind === 'auto') tail = ")
t = (R / T).read_text(encoding="utf-8")
i = t.index("      <div class=\"tcard\"><b>Bài test mở Auto Farm</b>"); j = t.index("</div>\n", i) + len("</div>\n")
t = t[:i] + "      <div class=\"tcard\"><b>Tiện ích nông trại</b><p>Auto Farm theo lượt, gieo hạt nhanh, mua giống và vật nuôi nhanh. Mỗi lần dùng làm một bài test ngắn, không giới hạn số lượt.</p><button class=\"btn gold\" data-act=\"farmtools\">Mở tiện ích</button></div>\n" + t[j:]
(R / T).write_text(t, encoding="utf-8")
sub(T, "h.kind === 'levelup' ? 'Lên cấp · ' + h.pct + '%' : h.pct + '%'", "h.kind === 'levelup' ? 'Lên cấp · ' + h.pct + '%' : h.kind === 'tool' ? 'Tiện ích · ' + h.pct + '%' : h.pct + '%'")

M = "main.js"
sub(M, "  const now = Date.now(); if (autoTick(now)) { renderHUD(); markDirty(); }", "  const now = Date.now();   // Auto Farm runs per turn now (farm tools), not on a timer")
sub(M, "  s.tests = Array.isArray(s.tests) ? s.tests : [];", "  s.auto = null;   // old hour-based Auto Farm passes are retired\n  s.tests = Array.isArray(s.tests) ? s.tests : [];")
sub(M, "    case 't-auto': return openExam(buildAutoTest());", "    case 't-auto': case 'farmtools': return openFarmTools();\n    case 'tool-go': return startTool(d.k);\n    case 'mm-toggle': MM_OPEN = !MM_OPEN; try { localStorage.setItem('vc-mm', MM_OPEN ? '1' : ''); } catch (e) {} mmTick(); return;")

sub("index.html", '    <button class="mm" id="mmwrap" data-act="minimap" aria-label="Bản đồ khu vực" hidden><canvas id="minimap"></canvas><span id="mmname"></span></button>',
    '    <div class="mapbtns" id="mapbtns" hidden>\n      <div class="mbrow"><button class="roundbtn" id="toolbtn" data-act="farmtools" aria-label="Tiện ích nông trại" hidden><svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/></svg><span>Tiện ích</span></button>'
    '<button class="roundbtn" id="mmbtn" data-act="mm-toggle" aria-label="Bật tắt bản đồ nhỏ"><svg viewBox="0 0 24 24"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></svg><span>Bản đồ</span></button></div>\n'
    '      <button class="mm" id="mmwrap" data-act="minimap" aria-label="Bản đồ khu vực" hidden><canvas id="minimap"></canvas><span id="mmname"></span></button>\n    </div>')

MM = "minimap.js"
sub(MM, "  wrap.hidden = $('#app').hidden;", "  $('#mapbtns').hidden = $('#app').hidden; wrap.hidden = !MM_OPEN; $('#mmbtn').classList.toggle('on', MM_OPEN); $('#toolbtn').hidden = S.map !== 'farm';")
sub(MM, "const MM_CACHE = {};", "const MM_CACHE = {};\nlet MM_OPEN = false; try { MM_OPEN = localStorage.getItem('vc-mm') === '1'; } catch (e) {}")
sub(MM, "  mmDraw(cv, window.innerWidth < 600 ? 3 : 4, false);", "  if (MM_OPEN) mmDraw(cv, window.innerWidth < 600 ? 3 : 4, false);")

(R / "style.css").write_text((R / "style.css").read_text(encoding="utf-8") + """
/* ---------- map/tools buttons (minimap folds away) ---------- */
.mapbtns{position:absolute;top:calc(64px + env(safe-area-inset-top,0px));right:max(10px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;align-items:flex-end;gap:6px;z-index:2}
.mapbtns[hidden]{display:none}
.mapbtns .mm{position:static;top:auto;right:auto}
.mbrow{display:flex;gap:6px}
.roundbtn{display:flex;align-items:center;gap:5px;border:1px solid rgba(255,255,255,.25);background:var(--glass);backdrop-filter:blur(10px);color:#fff;border-radius:99px;padding:5px 11px 5px 8px;font:inherit;font-weight:800;font-size:12px;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.18)}
.roundbtn[hidden]{display:none}
.roundbtn svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.roundbtn.on{background:var(--violet);border-color:var(--violet)}
#toolbtn{background:linear-gradient(135deg,#ffb020,#ff6fb5);border-color:transparent}
.todo{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px}.todo span{background:var(--surface-2);border-radius:99px;padding:4px 10px;font-size:12.5px}.todo b{color:var(--violet-dk)}
.tools{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}
.tool{background:var(--surface-2);border:1px solid var(--line);border-radius:18px;padding:12px;display:flex;flex-direction:column;gap:6px}
.tool>b{font-family:var(--display);font-size:16px}.tool p{margin:0;font-size:13px}.tool small{color:var(--muted);font-size:11.5px}.tool .btn{margin-top:auto;align-self:flex-start}.tool select{font-size:13px;padding:6px 8px}
@media (max-width:600px){.mapbtns{top:calc(86px + env(safe-area-inset-top,0px));right:8px}.roundbtn{font-size:11px;padding:4px 9px 4px 6px}.tools{grid-template-columns:1fr}}
@media (max-height:480px) and (orientation:landscape){.mapbtns{top:calc(48px + env(safe-area-inset-top,0px))}.roundbtn{font-size:11px;padding:3px 9px 3px 6px}.roundbtn svg{width:15px;height:15px}.tools{grid-template-columns:repeat(2,1fr)}}
""", encoding="utf-8")
b = Path(__file__).resolve().parent / "build_html.py"; t = b.read_text(encoding="utf-8")
b.write_text(t.replace('"tests.js", "render.js"', '"tests.js", "farm_tools.js", "render.js"'), encoding="utf-8")
print("ok")
