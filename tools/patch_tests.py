from pathlib import Path
R = Path(__file__).resolve().parent.parent / "src"
def sub(f, a, b, n=1):
    p = R / f; t = p.read_text(encoding="utf-8")
    assert t.count(a) >= 1, (f, a[:60]); t = t.replace(a, b, n); p.write_text(t, encoding="utf-8")

# graduation cap (roadmap reward, not sold)
sub("chibi.js", "  {id:'hat_crown',", "  {id:'hat_grad', slot:'hat', en:'graduation cap', vi:'Mũ tốt nghiệp', price:0, rar:3, col:'#1E1B3A'},\n  {id:'hat_crown',")
sub("chibi.js", "    case 'hat_crown':", "    case 'hat_grad': return `<path d=\"M40 40 Q72.5 30 105 40 L105 56 Q72.5 48 40 56Z\" fill=\"${shade(c, -0.1)}\"/><path d=\"M10 34 L72.5 12 L135 34 L72.5 56Z\" fill=\"${c}\"/><path d=\"M72.5 34 L120 40 L120 66\" stroke=\"${lv ? t : '#FFC83D'}\" stroke-width=\"3\" fill=\"none\"/><circle cx=\"120\" cy=\"70\" r=\"6\" fill=\"${lv ? t : '#FFC83D'}\"/><circle cx=\"72.5\" cy=\"34\" r=\"4\" fill=\"${lv ? t : '#FFC83D'}\"/>`;\n    case 'hat_crown':")

# IELTS daily challenge counter for the roadmap
sub("game.js", "if (!rewarded && ok >= 4) { S.ieltsDay = today;", "if (ok >= 4) S.ieltsCount = (S.ieltsCount || 0) + 1;\n      if (!rewarded && ok >= 4) { S.ieltsDay = today;")
sub("game.js", "<p class=\"note\">Câu hỏi khi tưới cây, cho ăn, câu cá đều lấy từ chuyên ngành và trình độ bạn chọn. Bạn đổi trình độ bất cứ lúc nào.",
    "<div class=\"row-btns\"><button class=\"btn sm\" data-act=\"tests\">Trung tâm thi</button><button class=\"btn ghost sm\" data-act=\"t-place\">Kiểm tra trình độ</button>${track === 'ielts' ? '<button class=\"btn ghost sm\" data-act=\"roadmap\">Lộ trình IELTS</button>' : ''}</div><p class=\"note\">Câu hỏi khi tưới cây, cho ăn, câu cá đều lấy từ chuyên ngành và trình độ bạn chọn. Bạn đổi trình độ bất cứ lúc nào. Bài kiểm tra tổng thể mỗi tuần sẽ tự nâng trình độ khi bạn tiến bộ.")

# HUD: clickable study card + auto farm pill
sub("index.html", '<div class="hud-card">', '<div class="hud-card" data-act="study" role="button" tabindex="0" title="Đổi trình độ, chuyên ngành">')
sub("index.html", '<span class="pill streak"', '<span class="pill auto" id="hud-auto" data-act="tests" role="button" title="Auto Farm" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="3.5" fill="currentColor"/></svg><b id="hud-auto-t">AUTO</b></span>\n      <span class="pill streak"')
sub("index.html", '<button class="dk" data-act="settings"', '<button class="dk" data-act="tests" aria-label="Thi"><svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 12l2 2 4-4"/><path d="M9 17h6"/></svg><span>Thi</span></button>\n      <button class="dk" data-act="settings"')

sub("main.js", "  $('#hud-streak').textContent = S.streak;", "  $('#hud-streak').textContent = S.streak;\n  const au = autoActive(); $('#hud-auto').hidden = !au; if (au) $('#hud-auto-t').textContent = 'AUTO ' + Math.ceil((S.auto.until - Date.now()) / 3600e3) + 'h';")
sub("main.js", "    case 'study': return openStudy();", """    case 'study': return openStudy();
    case 'tests': return openTests();
    case 'roadmap': return openRoadmap();
    case 'road-claim': return claimRoad(+d.v);
    case 't-place': return openExam(buildPlacement());
    case 't-auto': return openExam(buildAutoTest());
    case 't-ielts': return openExam(buildMock(IELTS_MOCK, d.v.split(',')));
    case 't-toeic': return openExam(buildMock(TOEIC_MOCK, d.v.split(',')));
    case 't-ai': return aiTest(d.v);""")
# auto farm in tick (runs before normal growth; also covers offline time)
sub("main.js", "  const now = Date.now(), dt = now - S.last;", "  const now = Date.now(); if (autoTick(now)) { renderHUD(); markDirty(); }\n  const dt = now - S.last;")
sub("main.js", "  if (typeof s.last !== 'number') s.last = Date.now();", "  if (typeof s.last !== 'number') s.last = Date.now();\n  s.tests = Array.isArray(s.tests) ? s.tests : []; s.bestBand = s.bestBand || {}; s.road = s.road || {claimed: []}; s.ieltsCount = s.ieltsCount || 0;\n  if (s.auto && !s.auto.log) s.auto.log = {};")
# offline summary on return
sub("main.js", "    if (!S.created) openCreator(true);", "    initCaps().then(() => {});\n    const autoWas = S.auto && S.auto.until > S.last; tick(); if (autoWas && autoSummary()) setTimeout(() => toast(`Auto Farm vẫn chạy khi bạn vắng mặt. Lượt này đã làm: ${autoSummary()}.`, 7000), 1500);\n    if (!S.created) openCreator(true);")
print("ok")
