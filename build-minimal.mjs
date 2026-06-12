// Minimal Premium Light: Apple-documentation aesthetic — white, airy, one blue accent.
// Same functional structure as build-lux.mjs (tabs, TOC + scrollspy, mobile fab, footer).
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
<title>สร้างผู้ช่วย AI ส่วนตัวบน Discord — Minimal Edition</title>
<meta name="description" content="คู่มือภาษาไทยฉบับสมบูรณ์ สร้างผู้ช่วย AI บน Discord จากการสร้างจริง — มีทั้งฉบับอ่านง่ายและฉบับลงมือทำ">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --ink: #1d1d1f; --dim: #6e6e73; --faint: #86868b;
  --hairline: #d2d2d7; --hairline-soft: #e8e8ed;
  --accent: #0071e3; --bg-soft: #f5f5f7;
  --shadow-card: 0 2px 12px rgba(0,0,0,.06);
  --shadow-float: 0 8px 28px rgba(0,0,0,.12);
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: 'Anuphan', -apple-system, sans-serif; background: #fff; color: var(--ink);
  line-height: 1.95; -webkit-font-smoothing: antialiased; }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
.wrap { max-width: 1120px; margin: 0 auto; padding: 0 28px; }

/* ── hero ── */
.hero { padding: 130px 0 110px; text-align: center;
  background: linear-gradient(180deg, var(--bg-soft) 0%, #fff 100%); }
.hero .kicker { display: inline-block; font-size: .82rem; font-weight: 500; letter-spacing: .06em;
  color: var(--dim); background: #fff; border: 1px solid var(--hairline); padding: 7px 18px;
  border-radius: 999px; margin-bottom: 36px; }
.hero h1 { font-size: clamp(2.2rem, 5.6vw, 3.9rem); font-weight: 700; letter-spacing: -.02em;
  line-height: 1.28; margin: 0 auto 22px; max-width: 880px; color: var(--ink); }
.hero p.sub { color: var(--dim); font-weight: 400; font-size: clamp(1.02rem, 2.2vw, 1.25rem);
  line-height: 1.85; max-width: 620px; margin: 0 auto 48px; }
.cta { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 80px; }
.btn { font: inherit; font-weight: 600; padding: 13px 32px; border-radius: 999px; cursor: pointer;
  font-size: 1rem; border: 1px solid transparent; transition: opacity .15s, background .15s; }
.btn.primary { background: var(--accent); color: #fff; }
.btn.primary:hover { opacity: .85; }
.btn.ghost { background: #fff; color: var(--accent); border-color: var(--hairline); }
.btn.ghost:hover { border-color: var(--accent); }

/* chat demo — clean white card, light grey bubbles */
.demo { max-width: 460px; margin: 0 auto; text-align: left; background: #fff;
  border: 1px solid var(--hairline-soft); border-radius: 20px; padding: 22px 20px 14px;
  box-shadow: var(--shadow-card); }
.demo .bar { display: flex; gap: 6px; margin-bottom: 14px; }
.demo .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--hairline-soft); }
.msg { opacity: 0; transform: translateY(10px); animation: pop .5s forwards; border-radius: 16px;
  padding: 9px 15px; margin: 8px 0; font-size: .92rem; max-width: 88%; line-height: 1.7; }
.msg.user { background: var(--accent); color: #fff; margin-left: auto; animation-delay: .4s; }
.msg.bot  { background: var(--bg-soft); color: var(--ink); animation-delay: 1.3s; }
.msg.user.m2 { animation-delay: 2.4s; } .msg.bot.m2 { animation-delay: 3.4s; }
@keyframes pop { to { opacity: 1; transform: none; } }

/* feature cards */
.features { padding: 90px 0 30px; }
.features h2 { text-align: center; font-size: clamp(1.6rem, 3.4vw, 2.2rem); font-weight: 700;
  letter-spacing: -.015em; margin: 0 0 52px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 18px; }
.feat { background: #fff; border: 1px solid var(--hairline-soft); border-radius: 18px; padding: 28px 24px;
  box-shadow: var(--shadow-card); transition: transform .15s, box-shadow .15s; }
.feat:hover { transform: translateY(-3px); box-shadow: var(--shadow-float); }
.feat .ic { font-size: 1.8rem; }
.feat .t { font-weight: 600; font-size: 1.02rem; margin: 12px 0 6px; }
.feat .d { color: var(--dim); font-size: .9rem; line-height: 1.75; }

/* ── reading area: sidebar + content ── */
.reader { display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: 56px; padding: 70px 0 110px;
  align-items: start; }
aside.toc { position: sticky; top: 24px; max-height: calc(100vh - 48px); overflow-y: auto;
  padding: 4px 12px 4px 0; border-right: 1px solid var(--hairline-soft); }
.toc .toc-title { font-weight: 600; font-size: .82rem; letter-spacing: .08em; text-transform: uppercase;
  margin: 18px 0 12px; color: var(--faint); }
.toc nav { display: none; }
.toc nav.active { display: block; }
.toc a { display: block; color: var(--dim); font-size: .88rem; padding: 6px 12px; border-radius: 8px;
  line-height: 1.55; border-left: 2px solid transparent; }
.toc a:hover { color: var(--ink); text-decoration: none; background: var(--bg-soft); }
.toc a.on { color: var(--accent); border-left-color: var(--accent); font-weight: 600; border-radius: 0 8px 8px 0; }
.tabs { display: flex; gap: 0; border: 1px solid var(--hairline); border-radius: 999px; padding: 3px; }
.tab { flex: 1; font: inherit; font-size: .85rem; font-weight: 600; padding: 8px 6px; border-radius: 999px;
  cursor: pointer; background: transparent; color: var(--dim); border: none; transition: background .15s, color .15s; }
.tab.active { background: var(--ink); color: #fff; }

article { min-width: 0; }
article h1 { font-size: 1.85rem; font-weight: 700; letter-spacing: -.015em; line-height: 1.4;
  margin: 2.6em 0 .6em; }
article h2 { font-size: 1.5rem; font-weight: 700; letter-spacing: -.01em; line-height: 1.45;
  margin: 2.8em 0 .7em; padding-top: 1.3em; border-top: 1px solid var(--hairline-soft); }
article h3 { font-size: 1.13rem; font-weight: 600; margin: 2em 0 .5em; color: var(--ink); }
article > :first-child { margin-top: 0; }
article p, article li { color: #424245; }
article strong { color: var(--ink); font-weight: 600; }
article table { border-collapse: collapse; width: 100%; margin: 1.4em 0; font-size: .92rem;
  display: block; overflow-x: auto; }
article th { background: var(--bg-soft); color: var(--ink); font-weight: 600; }
article th, article td { border: 1px solid var(--hairline-soft); padding: 10px 14px; text-align: left;
  vertical-align: top; }
article pre { background: var(--bg-soft); border: 1px solid var(--hairline-soft); border-radius: 14px;
  padding: 18px 20px; overflow-x: auto; font-size: .84rem; line-height: 1.7; }
article code { font-family: "SF Mono", Menlo, Consolas, monospace; color: var(--ink); }
article :not(pre) > code { background: var(--bg-soft); padding: 2px 7px; border-radius: 6px;
  font-size: .85em; border: 1px solid var(--hairline-soft); }
article blockquote { margin: 1.4em 0; padding: 14px 22px; background: var(--bg-soft);
  border-left: 3px solid var(--hairline); border-radius: 0 12px 12px 0; }
article blockquote p { margin: .3em 0; color: var(--dim); }
article hr { border: none; border-top: 1px solid var(--hairline-soft); margin: 3em 0; }
article img { max-width: 100%; }

footer { border-top: 1px solid var(--hairline-soft); padding: 44px 28px 70px; text-align: center;
  color: var(--faint); font-size: .87rem; line-height: 2.1; }
footer a { color: var(--accent); }

/* mobile */
.toc-fab { display: none; }
@media (max-width: 900px) {
  .reader { grid-template-columns: 1fr; gap: 0; }
  aside.toc { position: fixed; inset: auto 16px 88px 16px; top: auto; z-index: 50; max-height: 60vh;
    transform: translateY(20px); opacity: 0; pointer-events: none; transition: .2s; background: #fff;
    border: 1px solid var(--hairline-soft); border-right: 1px solid var(--hairline-soft);
    border-radius: 18px; padding: 18px; box-shadow: var(--shadow-float); }
  aside.toc.open { transform: none; opacity: 1; pointer-events: auto; }
  .toc-fab { display: flex; position: fixed; bottom: 22px; right: 20px; z-index: 51; gap: 8px;
    align-items: center; font: inherit; font-weight: 600; background: var(--ink); color: #fff;
    border: none; border-radius: 999px; padding: 13px 24px; cursor: pointer; box-shadow: var(--shadow-float); }
}
</style>
</head>
<body>

<section class="hero">
  <div class="wrap">
    <div class="kicker">🤍 Minimal Edition</div>
    <h1>สร้างผู้ช่วย AI ส่วนตัวบน Discord<br>ฟังเสียง · พูดได้ · สั่งงานได้</h1>
    <p class="sub">เลขา AI ที่อยู่กับคุณ 24 ชม. — พูดสั่งงานได้เหมือนคุยโทรศัพท์ ถอดเสียงไทยในเครื่องตัวเอง พร้อมพิมพ์เขียวให้ AI สร้างให้ทั้งระบบ</p>
    <div class="cta">
      <button class="btn primary" onclick="show('easy');document.getElementById('reader').scrollIntoView({behavior:'smooth'})">เริ่มอ่านฉบับเข้าใจง่าย</button>
      <button class="btn ghost" onclick="show('full');document.getElementById('reader').scrollIntoView({behavior:'smooth'})">ฉบับลงมือทำ</button>
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
    <div class="toc-title">สารบัญ</div>
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

writeFileSync('minimal.html', html)
console.log('built minimal.html — easy TOC:', easyP.toc.length, 'items, full TOC:', fullP.toc.length, 'items')
