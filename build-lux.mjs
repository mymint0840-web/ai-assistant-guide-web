// Flagship design: hero + chat demo + feature cards + sticky TOC sidebar with scrollspy.
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
<title>สร้างผู้ช่วย AI ส่วนตัวบน Discord — ฟังเสียง พูดได้ สั่งงานได้</title>
<meta name="description" content="คู่มือภาษาไทยฉบับสมบูรณ์ สร้างผู้ช่วย AI บน Discord จากการสร้างจริง — มีทั้งฉบับอ่านง่ายและฉบับลงมือทำ">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Anuphan:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #0a0c14; --bg2: #0e1120; --card: rgba(255,255,255,.045); --line: rgba(255,255,255,.09);
  --txt: #e6e9f2; --dim: #9aa3b8; --blue: #6c9eff; --purple: #a78bfa; --gold: #f7c66b;
  --grad: linear-gradient(92deg, #6c9eff, #a78bfa 55%, #f7c66b);
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: 'Anuphan', sans-serif; background: var(--bg); color: var(--txt); line-height: 1.9; }
a { color: var(--blue); text-decoration: none; }
.wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px; }

/* ── hero ── */
.hero { position: relative; overflow: hidden; padding: 90px 0 70px; text-align: center;
  background: radial-gradient(900px 480px at 15% -10%, rgba(108,158,255,.22), transparent 60%),
              radial-gradient(800px 480px at 85% 0%, rgba(167,139,250,.20), transparent 60%),
              radial-gradient(700px 500px at 50% 110%, rgba(247,198,107,.10), transparent 60%), var(--bg2); }
.hero .kicker { display: inline-block; font-size: .85rem; letter-spacing: .04em; color: var(--gold);
  border: 1px solid rgba(247,198,107,.35); background: rgba(247,198,107,.08); padding: 6px 16px; border-radius: 999px; margin-bottom: 22px; }
.hero h1 { font-size: clamp(1.9rem, 5vw, 3.3rem); font-weight: 800; line-height: 1.35; margin: 0 auto 14px; max-width: 850px;
  background: var(--grad); -webkit-background-clip: text; background-clip: text; color: transparent; }
.hero p.sub { color: var(--dim); font-size: clamp(1rem, 2.2vw, 1.2rem); max-width: 640px; margin: 0 auto 34px; }
.cta { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 50px; }
.btn { font: inherit; font-weight: 700; padding: 13px 30px; border-radius: 14px; cursor: pointer; border: none; font-size: 1.02rem; }
.btn.primary { background: var(--grad); color: #14121f; box-shadow: 0 8px 30px rgba(124,140,255,.35); }
.btn.ghost { background: var(--card); color: var(--txt); border: 1px solid var(--line); }
.btn:hover { filter: brightness(1.1); }

/* chat demo */
.demo { max-width: 460px; margin: 0 auto; text-align: left; background: rgba(10,12,22,.75);
  border: 1px solid var(--line); border-radius: 22px; padding: 22px 20px 14px; backdrop-filter: blur(8px); }
.demo .bar { display: flex; gap: 6px; margin-bottom: 14px; }
.demo .dot { width: 10px; height: 10px; border-radius: 50%; background: #3a4157; }
.demo .dot:nth-child(1) { background: #ff5f57; } .demo .dot:nth-child(2) { background: #febc2e; } .demo .dot:nth-child(3) { background: #28c840; }
.msg { opacity: 0; transform: translateY(10px); animation: pop .5s forwards; border-radius: 14px; padding: 9px 14px;
  margin: 8px 0; font-size: .92rem; max-width: 88%; }
.msg.user { background: #233052; margin-left: auto; animation-delay: .4s; }
.msg.bot  { background: #1a1f33; border: 1px solid var(--line); animation-delay: 1.3s; }
.msg.user.m2 { animation-delay: 2.4s; } .msg.bot.m2 { animation-delay: 3.4s; }
@keyframes pop { to { opacity: 1; transform: none; } }

/* feature cards */
.features { padding: 64px 0 10px; }
.features h2 { text-align: center; font-size: 1.7rem; margin: 0 0 34px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px; }
.feat { background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 22px;
  transition: transform .15s, border-color .15s; }
.feat:hover { transform: translateY(-3px); border-color: rgba(124,140,255,.4); }
.feat .ic { font-size: 1.9rem; }
.feat .t { font-weight: 700; margin: 8px 0 4px; }
.feat .d { color: var(--dim); font-size: .9rem; line-height: 1.7; }

/* ── reading area: sidebar + content ── */
.reader { display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: 36px; padding: 50px 0 80px; align-items: start; }
aside.toc { position: sticky; top: 16px; max-height: calc(100vh - 32px); overflow-y: auto;
  background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 18px 8px 18px 18px; }
.toc .toc-title { font-weight: 800; font-size: .95rem; margin-bottom: 10px; color: var(--gold); }
.toc nav { display: none; }
.toc nav.active { display: block; }
.toc a { display: block; color: var(--dim); font-size: .88rem; padding: 6px 10px; border-radius: 9px; line-height: 1.5;
  border-left: 2px solid transparent; }
.toc a:hover { color: var(--txt); background: rgba(255,255,255,.05); }
.toc a.on { color: var(--blue); border-left-color: var(--blue); background: rgba(108,158,255,.08); font-weight: 600; }
.tabs { display: flex; gap: 8px; margin-bottom: 14px; }
.tab { flex: 1; font: inherit; font-size: .88rem; font-weight: 700; padding: 9px 6px; border-radius: 10px; cursor: pointer;
  background: rgba(255,255,255,.06); color: var(--dim); border: 1px solid var(--line); }
.tab.active { background: var(--grad); color: #14121f; border-color: transparent; }

article { min-width: 0; }
article h1 { font-size: 1.65rem; line-height: 1.45; margin: 2.4em 0 .6em; }
article h2 { font-size: 1.4rem; line-height: 1.45; margin: 2.4em 0 .6em; padding-top: .5em;
  border-top: 1px solid var(--line); }
article h2::before { content: ""; display: inline-block; width: 10px; height: 10px; border-radius: 3px;
  background: var(--grad); margin-right: 10px; }
article h3 { font-size: 1.12rem; margin: 1.8em 0 .5em; color: var(--gold); }
article > :first-child { margin-top: 0; }
article p, article li { color: #cfd6e4; }
article strong { color: #fff; }
article table { border-collapse: collapse; width: 100%; margin: 1.2em 0; font-size: .92rem; display: block; overflow-x: auto; }
article th { background: rgba(255,255,255,.07); color: #fff; }
article th, article td { border: 1px solid var(--line); padding: 9px 13px; text-align: left; vertical-align: top; }
article pre { background: #0d1019; border: 1px solid var(--line); border-radius: 14px; padding: 38px 18px 16px;
  overflow-x: auto; font-size: .84rem; line-height: 1.65; position: relative; }
article pre::before { content: "● ● ●"; position: absolute; top: 10px; left: 14px; font-size: .6rem; letter-spacing: 3px; color: #4a5168; }
article code { font-family: "SF Mono", Menlo, Consolas, monospace; color: #9ecbff; }
article :not(pre) > code { background: rgba(108,158,255,.12); padding: 2px 7px; border-radius: 6px; font-size: .85em; }
article blockquote { margin: 1.2em 0; padding: 13px 18px; background: rgba(247,198,107,.07);
  border-left: 3px solid var(--gold); border-radius: 0 12px 12px 0; }
article blockquote p { margin: .3em 0; color: #e8dcc0; }
article hr { border: none; border-top: 1px dashed var(--line); margin: 2.5em 0; }

footer { border-top: 1px solid var(--line); padding: 34px 24px 60px; text-align: center; color: var(--dim); font-size: .87rem; }
footer a { color: var(--blue); }

/* mobile */
.toc-fab { display: none; }
@media (max-width: 900px) {
  .reader { grid-template-columns: 1fr; }
  aside.toc { position: fixed; inset: auto 14px 84px 14px; top: auto; z-index: 50; max-height: 60vh;
    transform: translateY(20px); opacity: 0; pointer-events: none; transition: .2s; background: #11142a; }
  aside.toc.open { transform: none; opacity: 1; pointer-events: auto; }
  .toc-fab { display: flex; position: fixed; bottom: 20px; right: 18px; z-index: 51; gap: 8px; align-items: center;
    font: inherit; font-weight: 800; background: var(--grad); color: #14121f; border: none; border-radius: 999px;
    padding: 13px 22px; cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,.5); }
}
</style>
</head>
<body>

<section class="hero">
  <div class="wrap">
    <div class="kicker">คู่มือภาษาไทย · จากการสร้างจริงใน 1 คืน · แจกฟรี CC BY 4.0</div>
    <h1>สร้างผู้ช่วย AI ส่วนตัวบน Discord<br>ฟังเสียง · พูดได้ · สั่งงานได้</h1>
    <p class="sub">เลขา AI ที่อยู่กับคุณ 24 ชม. — พูดสั่งงานได้เหมือนคุยโทรศัพท์ ถอดเสียงไทยในเครื่องตัวเอง พร้อมพิมพ์เขียวให้ AI สร้างให้ทั้งระบบ</p>
    <div class="cta">
      <button class="btn primary" onclick="show('easy');document.getElementById('reader').scrollIntoView({behavior:'smooth'})">📖 เริ่มอ่านฉบับเข้าใจง่าย</button>
      <button class="btn ghost" onclick="show('full');document.getElementById('reader').scrollIntoView({behavior:'smooth'})">🔧 ฉบับลงมือทำ</button>
    </div>
    <div class="demo">
      <div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
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
  <p>ดีไซน์อื่น: <a href="docs.html">📄 Docs</a> · <a href="night.html">🌙 Night</a> · <a href="story.html">📖 Story</a> · ต้นฉบับ: <a href="${GIST}" target="_blank">GitHub Gist</a></p>
  <p>🤖 เขียนโดย <strong>regulus</strong> (AI Commander) จาก Golf → regulus-oracle · CC BY 4.0 แจกจ่าย-ดัดแปลงได้เสรี</p>
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

writeFileSync('index.html', html)
console.log('built flagship index.html — easy TOC:', easyP.toc.length, 'items, full TOC:', fullP.toc.length, 'items')
