// Siam Warm Premium: elegant Thai-book aesthetic — cream paper, deep brown, gold double-line borders.
// Same functional structure as build-lux.mjs: hero + chat demo + feature cards + tabs + sticky TOC scrollspy + mobile fab.
import { readFileSync, writeFileSync } from 'node:fs'

const GIST = 'https://gist.github.com/mymint0840-web/26285feaee428de0f12c0482127a73ff'

// inject ids into h2s and collect TOC entries
function prepare(html, prefix) {
  const toc = []
  let i = 0
  const out = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner) => {
    i += 1
    const id = `${prefix}-${i}`
    const label = inner.replace(/<[^>]+>/g, '').trim()
    toc.push({ id, label })
    return `<h2 id="${id}">${inner}</h2>`
  })
  return { out, toc }
}

const easyP = prepare(readFileSync('easy-body.html', 'utf8'), 'e')
const fullP = prepare(readFileSync('full-body.html', 'utf8'), 'f')

const tocList = (toc) => toc.map((t) => `<a href="#${t.id}" data-target="${t.id}">${t.label}</a>`).join('\n')

const html = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>สร้างผู้ช่วย AI ส่วนตัวบน Discord — Siam Edition</title>
<meta name="description" content="คู่มือภาษาไทยฉบับสมบูรณ์ สร้างผู้ช่วย AI บน Discord จากการสร้างจริง — มีทั้งฉบับอ่านง่ายและฉบับลงมือทำ (Siam Edition)">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Pridi:wght@400;500;600;700&family=Sarabun:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --paper: #faf3e7; --paper2: #f4e9d4; --card: #fffaf0;
  --ink: #3e2f23; --ink-soft: #6b5742; --dim: #8a7458;
  --gold: #b8860b; --gold2: #d4a017; --gold-soft: rgba(184,134,11,.28);
  --maroon: #7a3b2e;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: 'Sarabun', sans-serif; background: var(--paper); color: var(--ink); line-height: 1.95; }
h1, h2, h3, .pridi { font-family: 'Pridi', serif; }
a { color: var(--gold); text-decoration: none; }
a:hover { color: var(--maroon); }
.wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px; }

/* gold double-line border helper — thin outer line + thin inner line */
.dline { border: 1px solid var(--gold-soft); box-shadow: inset 0 0 0 3px var(--card), inset 0 0 0 4px var(--gold-soft); }

/* ── hero: Thai book cover ── */
.hero { position: relative; overflow: hidden; padding: 84px 0 64px; text-align: center;
  color: var(--ink); border-bottom: 1px solid var(--gold-soft);
  /* subtle Thai-pattern-inspired lattice: diagonal kanok-like diamonds + woven lines, CSS gradients only */
  background:
    repeating-linear-gradient(45deg, rgba(184,134,11,.05) 0 2px, transparent 2px 26px),
    repeating-linear-gradient(-45deg, rgba(184,134,11,.05) 0 2px, transparent 2px 26px),
    radial-gradient(circle at 50% 0%, rgba(212,160,23,.14), transparent 55%),
    linear-gradient(180deg, var(--paper2), var(--paper));
}
.hero::after { content: ""; position: absolute; inset: 12px; pointer-events: none;
  border: 1px solid var(--gold-soft); box-shadow: inset 0 0 0 4px transparent, inset 0 0 0 5px rgba(184,134,11,.18); }
.hero .kicker { display: inline-block; font-size: .85rem; letter-spacing: .08em; color: var(--maroon);
  border: 1px solid var(--gold-soft); background: rgba(212,160,23,.10); padding: 6px 18px; border-radius: 999px; margin-bottom: 20px; }
.orna { color: var(--gold); letter-spacing: .25em; font-size: .95rem; margin: 14px 0; user-select: none; }
.hero h1 { font-size: clamp(1.9rem, 5vw, 3.1rem); font-weight: 700; line-height: 1.4; margin: 0 auto 6px; max-width: 860px; color: var(--ink); }
.hero h1 .gold { color: var(--gold); }
.hero p.sub { color: var(--ink-soft); font-size: clamp(1rem, 2.2vw, 1.15rem); max-width: 640px; margin: 10px auto 32px; }
.cta { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 46px; position: relative; z-index: 1; }
.btn { font: inherit; font-family: 'Sarabun', sans-serif; font-weight: 700; padding: 12px 30px; border-radius: 4px; cursor: pointer; font-size: 1rem; }
.btn.primary { background: linear-gradient(180deg, var(--gold2), var(--gold)); color: #fffaf0; border: 1px solid #9a700a;
  box-shadow: 0 4px 16px rgba(184,134,11,.35); }
.btn.ghost { background: var(--card); color: var(--ink); border: 1px solid var(--gold-soft);
  box-shadow: inset 0 0 0 2px var(--card), inset 0 0 0 3px var(--gold-soft); }
.btn:hover { filter: brightness(1.06); }

/* chat demo — warm paper note cards */
.demo { max-width: 470px; margin: 0 auto; text-align: left; background: var(--card);
  border: 1px solid var(--gold-soft); border-radius: 6px; padding: 24px 22px 16px; position: relative; z-index: 1;
  box-shadow: inset 0 0 0 3px var(--card), inset 0 0 0 4px var(--gold-soft), 0 10px 28px rgba(62,47,35,.12); }
.demo .bar { text-align: center; color: var(--gold); letter-spacing: .3em; font-size: .75rem; margin-bottom: 14px; }
.msg { opacity: 0; transform: translateY(10px); animation: pop .5s forwards; border-radius: 4px; padding: 10px 15px;
  margin: 9px 0; font-size: .92rem; max-width: 88%; box-shadow: 0 2px 6px rgba(62,47,35,.08); }
.msg.user { background: #f0e2c8; border: 1px solid rgba(184,134,11,.22); margin-left: auto; animation-delay: .4s; }
.msg.bot  { background: #fdf7ea; border: 1px solid rgba(184,134,11,.18); border-left: 3px solid var(--gold2); animation-delay: 1.3s; }
.msg.user.m2 { animation-delay: 2.4s; } .msg.bot.m2 { animation-delay: 3.4s; }
@keyframes pop { to { opacity: 1; transform: none; } }

/* feature cards */
.features { padding: 60px 0 10px; }
.features h2 { text-align: center; font-size: 1.7rem; font-weight: 600; margin: 0 0 8px; color: var(--ink); }
.features .orna { text-align: center; margin-bottom: 30px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 18px; }
.feat { background: var(--card); border: 1px solid var(--gold-soft); border-radius: 6px; padding: 24px;
  box-shadow: inset 0 0 0 3px var(--card), inset 0 0 0 4px var(--gold-soft);
  transition: transform .15s, box-shadow .15s; }
.feat:hover { transform: translateY(-3px);
  box-shadow: inset 0 0 0 3px var(--card), inset 0 0 0 4px var(--gold2), 0 8px 20px rgba(62,47,35,.12); }
.feat .ic { font-size: 1.9rem; }
.feat .t { font-family: 'Pridi', serif; font-weight: 600; margin: 8px 0 4px; color: var(--maroon); }
.feat .d { color: var(--ink-soft); font-size: .9rem; line-height: 1.75; }

/* ── reading area: sidebar + content ── */
.reader { display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: 36px; padding: 50px 0 80px; align-items: start; }
aside.toc { position: sticky; top: 16px; max-height: calc(100vh - 32px); overflow-y: auto;
  background: var(--card); border: 1px solid var(--gold-soft); border-radius: 6px; padding: 18px 10px 18px 18px;
  box-shadow: inset 0 0 0 3px var(--card), inset 0 0 0 4px var(--gold-soft); }
.toc .toc-title { font-family: 'Pridi', serif; font-weight: 600; font-size: .95rem; margin-bottom: 10px; color: var(--maroon); }
.toc nav { display: none; }
.toc nav.active { display: block; }
.toc a { display: block; color: var(--dim); font-size: .88rem; padding: 6px 10px; border-radius: 3px; line-height: 1.55;
  border-left: 2px solid transparent; }
.toc a:hover { color: var(--ink); background: rgba(184,134,11,.07); }
.toc a.on { color: var(--maroon); border-left-color: var(--gold2); background: rgba(212,160,23,.10); font-weight: 600; }
.tabs { display: flex; gap: 8px; margin-bottom: 14px; }
.tab { flex: 1; font: inherit; font-family: 'Sarabun', sans-serif; font-size: .88rem; font-weight: 700; padding: 9px 6px; border-radius: 4px; cursor: pointer;
  background: var(--paper2); color: var(--ink-soft); border: 1px solid var(--gold-soft); }
.tab.active { background: linear-gradient(180deg, var(--gold2), var(--gold)); color: #fffaf0; border-color: #9a700a; }

article { min-width: 0; }
article h1 { font-size: 1.65rem; line-height: 1.5; margin: 2.4em 0 .6em; font-weight: 600; color: var(--ink); }
article h2 { font-size: 1.4rem; line-height: 1.5; margin: 2.4em 0 .6em; padding-top: .8em; font-weight: 600; color: var(--ink);
  border-top: 1px solid var(--gold-soft); }
article h2::before { content: "✦"; color: var(--gold2); margin-right: 10px; font-size: .85em; }
article h3 { font-size: 1.12rem; margin: 1.8em 0 .5em; color: var(--maroon); font-weight: 600; }
article > :first-child { margin-top: 0; }
article p, article li { color: #4d3c2c; }
article strong { color: var(--maroon); }
article table { border-collapse: collapse; width: 100%; margin: 1.2em 0; font-size: .92rem; display: block; overflow-x: auto;
  background: var(--card); }
article th { background: rgba(212,160,23,.14); color: var(--ink); font-family: 'Pridi', serif; font-weight: 600; }
article th, article td { border: 1px solid var(--gold-soft); padding: 9px 13px; text-align: left; vertical-align: top; }
article pre { background: #352a1e; color: #f1e6cf; border: 1px solid var(--gold-soft); border-radius: 6px; padding: 38px 18px 16px;
  overflow-x: auto; font-size: .84rem; line-height: 1.65; position: relative;
  box-shadow: inset 0 0 0 3px #352a1e, inset 0 0 0 4px rgba(212,160,23,.25); }
article pre::before { content: "✦ ✦ ✦"; position: absolute; top: 10px; left: 16px; font-size: .6rem; letter-spacing: 4px; color: var(--gold2); }
article code { font-family: "SF Mono", Menlo, Consolas, monospace; color: #ffd98a; }
article :not(pre) > code { background: rgba(184,134,11,.12); color: var(--maroon); padding: 2px 7px; border-radius: 3px; font-size: .85em; }
article blockquote { margin: 1.2em 0; padding: 13px 18px; background: rgba(212,160,23,.08);
  border-left: 3px solid var(--gold2); border-radius: 0 4px 4px 0; }
article blockquote p { margin: .3em 0; color: #5d4a35; }
article hr { border: none; border-top: 1px dashed var(--gold-soft); margin: 2.5em 0; }

footer { border-top: 1px solid var(--gold-soft); padding: 34px 24px 60px; text-align: center; color: var(--dim); font-size: .87rem;
  background: var(--paper2); }
footer a { color: var(--gold); font-weight: 600; }
footer .orna { margin-top: 0; }

/* mobile */
.toc-fab { display: none; }
@media (max-width: 900px) {
  .reader { grid-template-columns: 1fr; }
  aside.toc { position: fixed; inset: auto 14px 84px 14px; top: auto; z-index: 50; max-height: 60vh;
    transform: translateY(20px); opacity: 0; pointer-events: none; transition: .2s; background: var(--card); }
  aside.toc.open { transform: none; opacity: 1; pointer-events: auto; }
  .toc-fab { display: flex; position: fixed; bottom: 20px; right: 18px; z-index: 51; gap: 8px; align-items: center;
    font: inherit; font-family: 'Sarabun', sans-serif; font-weight: 700; background: linear-gradient(180deg, var(--gold2), var(--gold));
    color: #fffaf0; border: 1px solid #9a700a; border-radius: 999px;
    padding: 13px 22px; cursor: pointer; box-shadow: 0 10px 30px rgba(62,47,35,.35); }
}
</style>
</head>
<body>

<section class="hero">
  <div class="wrap">
    <div class="kicker">🏮 Siam Edition</div>
    <div class="orna">✦ ─────── ✦ ─────── ✦</div>
    <h1>สร้างผู้ช่วย AI ส่วนตัวบน Discord<br><span class="gold">ฟังเสียง · พูดได้ · สั่งงานได้</span></h1>
    <div class="orna">✦ ─────── ✦ ─────── ✦</div>
    <p class="sub">เลขา AI ที่อยู่กับคุณ 24 ชม. — พูดสั่งงานได้เหมือนคุยโทรศัพท์ ถอดเสียงไทยในเครื่องตัวเอง พร้อมพิมพ์เขียวให้ AI สร้างให้ทั้งระบบ</p>
    <div class="cta">
      <button class="btn primary" onclick="show('easy');document.getElementById('reader').scrollIntoView({behavior:'smooth'})">📖 เริ่มอ่านฉบับเข้าใจง่าย</button>
      <button class="btn ghost" onclick="show('full');document.getElementById('reader').scrollIntoView({behavior:'smooth'})">🔧 ฉบับลงมือทำ</button>
    </div>
    <div class="demo">
      <div class="bar">✦ ✦ ✦</div>
      <div class="msg user">🎙️ "ช่วยจดประชุมหน่อย แล้วสรุปให้ด้วย"</div>
      <div class="msg bot">👑 รับครับ เริ่มจดแล้ว — จบประชุมผมสรุปประเด็น + งานค้างให้เลยครับ</div>
      <div class="msg user m2">⌨️ "ทำรูปโปรโมทร้านให้หน่อย โทนอุ่น ๆ"</div>
      <div class="msg bot m2">👑 ได้ครับ กำลังส่งให้ทีมเจนรูป เดี๋ยวรูปเด้งเข้าห้องนี้ครับ 🎨</div>
    </div>
  </div>
</section>

<section class="features">
  <div class="wrap">
    <h2>มันทำอะไรได้บ้าง</h2>
    <div class="orna">✦ ─── ✦ ─── ✦</div>
    <div class="grid">
      <div class="feat"><div class="ic">🎙️</div><div class="t">ฟังเสียงไทยรู้เรื่อง</div><div class="d">พูดสั่งในห้องเสียง ถอดเป็นข้อความในเครื่องคุณเอง — เสียงไม่ออกไปไหน</div></div>
      <div class="feat"><div class="ic">🗣️</div><div class="t">พูดตอบกลับ</div><div class="d">เสียง AI ไทยธรรมชาติ เลือกชาย/หญิง คุยโต้ตอบได้จริง</div></div>
      <div class="feat"><div class="ic">⚡</div><div class="t">ตอบไวใน ~10 วิ</div><div class="d">สมองเร็วตอบทันที งานใหญ่ส่งต่อสมองหลักไปทำจริง</div></div>
      <div class="feat"><div class="ic">🧠</div><div class="t">จำได้ข้ามวัน</div><div class="d">สรุปบทสนทนาเก็บเป็นความจำ เดือนหน้าถามต่อได้</div></div>
      <div class="feat"><div class="ic">🎨</div><div class="t">สั่งทำรูป/งานจริง</div><div class="d">เจนรูป จดประชุม เตือนงาน ทำงานตามเวลา</div></div>
      <div class="feat"><div class="ic">💸</div><div class="t">ทำฟรีได้จริง</div><div class="d">ทุกชิ้นมีทางเลือกฟรี — เครื่องเก่าที่บ้านหรือ VPS ก็รันได้</div></div>
    </div>
  </div>
</section>

<div class="wrap reader" id="reader">
  <aside class="toc" id="toc">
    <div class="tabs">
      <button class="tab active" data-t="easy" onclick="show('easy')">📖 อ่านง่าย</button>
      <button class="tab" data-t="full" onclick="show('full')">🔧 ฉบับเต็ม</button>
    </div>
    <div class="toc-title">สารบัญ — กดข้ามได้เลย</div>
    <nav id="toc-easy" class="active">${tocList(easyP.toc)}</nav>
    <nav id="toc-full">${tocList(fullP.toc)}</nav>
  </aside>
  <div>
    <article id="easy">${easyP.out}</article>
    <article id="full" style="display:none">${fullP.out}</article>
  </div>
</div>

<button class="toc-fab" onclick="document.getElementById('toc').classList.toggle('open')">📑 สารบัญ</button>

<footer>
  <div class="orna">✦ ─────── ✦ ─────── ✦</div>
  <p>📚 เล่มที่ 1 ของซีรีส์: <a href="https://mymint0840-web.github.io/oracle-guide-web/">Oracle — AI ที่มีตัวตน มีความจำ และโตไปกับคุณ</a></p>
  <p>🙏 เครดิตผู้สร้างทาง: <a href="https://www.facebook.com/nat.wrw" target="_blank">Nat Weerawan</a> ผู้ให้กำเนิดแนวคิด Oracle · <a href="https://www.facebook.com/profile.php?id=61563658892025" target="_blank">ARRA Oracle Community &amp; Conference</a> และพี่ ๆ ในคอมมูนิตี้ทุกท่าน</p>
  <p>🤖 เขียนโดย <strong>regulus</strong> (AI Commander) จาก Golf → regulus-oracle</p>
</footer>

<script>
function show(which) {
  document.getElementById('easy').style.display = which === 'easy' ? 'block' : 'none'
  document.getElementById('full').style.display = which === 'full' ? 'block' : 'none'
  document.getElementById('toc-easy').classList.toggle('active', which === 'easy')
  document.getElementById('toc-full').classList.toggle('active', which === 'full')
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.t === which))
  armSpy()
}
// scrollspy — ไฮไลต์หัวข้อที่กำลังอ่านในสารบัญ
let spy = null
function armSpy() {
  if (spy) spy.disconnect()
  const activeArticle = document.getElementById('easy').style.display !== 'none' ? 'easy' : 'full'
  const links = [...document.querySelectorAll('.toc nav.active a')]
  spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach(l => l.classList.toggle('on', l.dataset.target === en.target.id))
      }
    })
  }, { rootMargin: '0px 0px -75% 0px' })
  document.querySelectorAll('#' + activeArticle + ' h2[id]').forEach(h => spy.observe(h))
}
armSpy()
// ปิดสารบัญมือถือเมื่อกดลิงก์
document.querySelectorAll('.toc a').forEach(a => a.addEventListener('click', () => {
  document.getElementById('toc').classList.remove('open')
}))
</script>
</body>
</html>`

writeFileSync('siam.html', html)
console.log('built siam.html (Siam Warm Premium) — easy TOC:', easyP.toc.length, 'items, full TOC:', fullP.toc.length, 'items')
