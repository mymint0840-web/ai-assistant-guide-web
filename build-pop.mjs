// Pop / Neo-brutalist design: cream bg, chunky black borders, offset shadows, sticker badges.
// Same functional structure as build-lux.mjs — tabs, TOC + scrollspy, mobile fab, footer.
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
<title>สร้างผู้ช่วย AI ส่วนตัวบน Discord — ฟังเสียง พูดได้ สั่งงานได้ — Pop Edition</title>
<meta name="description" content="คู่มือภาษาไทยฉบับสมบูรณ์ สร้างผู้ช่วย AI บน Discord จากการสร้างจริง — มีทั้งฉบับอ่านง่ายและฉบับลงมือทำ (Pop Edition)">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Mitr:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --cream: #fff8e7; --ink: #000; --paper: #fff;
  --yellow: #ffd43b; --pink: #ff8fab; --mint: #8ce99a; --sky: #74c0fc;
  --bd: 3px solid var(--ink);
  --pop: 6px 6px 0 var(--ink);
  --pop-sm: 4px 4px 0 var(--ink);
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: 'Mitr', sans-serif; background: var(--cream); color: var(--ink); line-height: 1.9; font-weight: 400;
  background-image: radial-gradient(rgba(0,0,0,.08) 1.5px, transparent 1.5px); background-size: 26px 26px; }
a { color: var(--ink); text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px; }
a:hover { background: var(--yellow); }
.wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px; }

/* ── hero ── */
.hero { padding: 70px 0 60px; text-align: center; border-bottom: var(--bd);
  background: repeating-linear-gradient(-45deg, var(--cream), var(--cream) 28px, #ffeec2 28px, #ffeec2 56px); }
.hero .kicker { display: inline-block; font-size: .9rem; font-weight: 600; background: var(--pink);
  border: var(--bd); box-shadow: var(--pop-sm); padding: 6px 18px; margin-bottom: 26px;
  transform: rotate(-2deg); border-radius: 4px; }
.hero .headline-card { display: inline-block; background: var(--yellow); border: var(--bd); box-shadow: var(--pop);
  padding: 26px 34px 20px; margin: 0 auto 18px; transform: rotate(-1deg); border-radius: 8px; max-width: 860px; }
.hero h1 { font-size: clamp(1.8rem, 5vw, 3.1rem); font-weight: 700; line-height: 1.35; margin: 0; color: var(--ink); }
.hero p.sub { font-size: clamp(1rem, 2.2vw, 1.15rem); max-width: 640px; margin: 14px auto 36px; font-weight: 400; }
.cta { display: flex; gap: 18px; justify-content: center; flex-wrap: wrap; margin-bottom: 54px; }
.btn { font: inherit; font-weight: 600; padding: 13px 28px; cursor: pointer; border: var(--bd);
  box-shadow: var(--pop); font-size: 1.05rem; border-radius: 8px; transition: transform .1s, box-shadow .1s; }
.btn.primary { background: var(--mint); }
.btn.ghost { background: var(--sky); }
.btn:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--ink); }
.btn:active { transform: translate(6px, 6px); box-shadow: 0 0 0 var(--ink); }

/* chat demo — comic speech bubbles */
.demo { max-width: 480px; margin: 0 auto; text-align: left; background: var(--paper);
  border: var(--bd); box-shadow: var(--pop); padding: 22px 20px 16px; border-radius: 12px; transform: rotate(.6deg); }
.demo .bar { display: flex; gap: 7px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 3px dashed var(--ink); }
.demo .dot { width: 13px; height: 13px; border-radius: 50%; border: 2px solid var(--ink); }
.demo .dot:nth-child(1) { background: var(--pink); } .demo .dot:nth-child(2) { background: var(--yellow); } .demo .dot:nth-child(3) { background: var(--mint); }
.msg { opacity: 0; transform: translateY(10px); animation: popIn .45s forwards; position: relative;
  border: 2.5px solid var(--ink); padding: 9px 15px; margin: 14px 0; font-size: .92rem; max-width: 86%; border-radius: 14px; }
.msg::after { content: ""; position: absolute; bottom: -11px; width: 0; height: 0;
  border-left: 9px solid transparent; border-right: 9px solid transparent; }
.msg.user { background: var(--sky); margin-left: auto; animation-delay: .4s; box-shadow: 3px 3px 0 var(--ink); }
.msg.user::after { right: 16px; border-top: 11px solid var(--ink); }
.msg.bot  { background: var(--yellow); animation-delay: 1.3s; box-shadow: -3px 3px 0 var(--ink); }
.msg.bot::after { left: 16px; border-top: 11px solid var(--ink); }
.msg.user.m2 { animation-delay: 2.4s; } .msg.bot.m2 { animation-delay: 3.4s; }
@keyframes popIn { to { opacity: 1; transform: none; } }

/* feature cards */
.features { padding: 64px 0 14px; }
.features h2 { text-align: center; font-size: 1.8rem; font-weight: 700; margin: 0 0 38px; }
.features h2 span { background: var(--pink); border: var(--bd); box-shadow: var(--pop-sm); padding: 4px 22px;
  display: inline-block; transform: rotate(-1.2deg); border-radius: 6px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 22px; }
.feat { border: var(--bd); box-shadow: var(--pop); padding: 20px 22px; border-radius: 10px; background: var(--paper);
  transition: transform .12s, box-shadow .12s; }
.feat:nth-child(6n+1) { background: var(--yellow); transform: rotate(-.5deg); }
.feat:nth-child(6n+2) { background: var(--mint); transform: rotate(.5deg); }
.feat:nth-child(6n+3) { background: var(--sky); transform: rotate(-.4deg); }
.feat:nth-child(6n+4) { background: var(--pink); transform: rotate(.6deg); }
.feat:nth-child(6n+5) { background: var(--sky); transform: rotate(-.6deg); }
.feat:nth-child(6n+6) { background: var(--yellow); transform: rotate(.4deg); }
.feat:hover { transform: rotate(0) translate(-2px, -2px); box-shadow: 8px 8px 0 var(--ink); }
.feat .ic { font-size: 2rem; }
.feat .t { font-weight: 600; font-size: 1.05rem; margin: 6px 0 4px; }
.feat .d { font-size: .9rem; line-height: 1.7; }

/* ── reading area: sidebar + content ── */
.reader { display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: 36px; padding: 50px 0 80px; align-items: start; }
aside.toc { position: sticky; top: 16px; max-height: calc(100vh - 32px); overflow-y: auto;
  background: var(--paper); border: var(--bd); box-shadow: var(--pop); border-radius: 10px; padding: 18px 12px 18px 18px; }
.toc .toc-title { font-weight: 700; font-size: .95rem; margin-bottom: 10px; display: inline-block;
  background: var(--yellow); border: 2px solid var(--ink); padding: 2px 12px; transform: rotate(-1deg); border-radius: 4px; }
.toc nav { display: none; }
.toc nav.active { display: block; }
.toc a { display: block; font-size: .88rem; padding: 6px 10px; line-height: 1.5; text-decoration: none;
  border: 2px solid transparent; border-radius: 6px; margin: 2px 0; }
.toc a:hover { background: var(--cream); border-color: var(--ink); }
.toc a.on { background: var(--mint); border-color: var(--ink); box-shadow: 3px 3px 0 var(--ink); font-weight: 600; }
.tabs { display: flex; gap: 10px; margin-bottom: 16px; }
.tab { flex: 1; font: inherit; font-size: .88rem; font-weight: 600; padding: 9px 6px; cursor: pointer;
  background: var(--paper); border: 2.5px solid var(--ink); border-radius: 8px; box-shadow: var(--pop-sm); transition: transform .1s, box-shadow .1s; }
.tab:hover { transform: translate(1px, 1px); box-shadow: 3px 3px 0 var(--ink); }
.tab.active { background: var(--yellow); transform: translate(4px, 4px); box-shadow: 0 0 0 var(--ink); }

/* article body — high-contrast black-on-white card for long reads */
article { min-width: 0; background: var(--paper); border: var(--bd); box-shadow: var(--pop);
  border-radius: 10px; padding: 34px clamp(20px, 4vw, 44px) 46px; }
article h1 { font-size: 1.65rem; font-weight: 700; line-height: 1.45; margin: 2.4em 0 .6em; }
article h2 { font-size: 1.4rem; font-weight: 700; line-height: 1.45; margin: 2.6em 0 .7em; padding-top: .7em;
  border-top: 3px dashed var(--ink); }
article h2::before { content: ""; display: inline-block; width: 14px; height: 14px; border: 2.5px solid var(--ink);
  background: var(--pink); margin-right: 12px; border-radius: 3px; transform: rotate(8deg); }
article h3 { font-size: 1.12rem; font-weight: 600; margin: 1.8em 0 .5em; }
article h3::before { content: "▸ "; }
article > :first-child { margin-top: 0; }
article p, article li { color: #1a1a1a; }
article strong { background: var(--yellow); padding: 0 4px; border-radius: 3px; }
article table { border-collapse: collapse; width: 100%; margin: 1.2em 0; font-size: .92rem; display: block; overflow-x: auto; }
article th { background: var(--sky); font-weight: 600; }
article th, article td { border: 2px solid var(--ink); padding: 9px 13px; text-align: left; vertical-align: top; }
article pre { background: #16181d; color: #f1f3f5; border: var(--bd); box-shadow: var(--pop-sm); border-radius: 10px;
  padding: 38px 18px 16px; overflow-x: auto; font-size: .84rem; line-height: 1.65; position: relative; }
article pre::before { content: "● ● ●"; position: absolute; top: 10px; left: 14px; font-size: .6rem; letter-spacing: 3px; color: #ffd43b; }
article code { font-family: "SF Mono", Menlo, Consolas, monospace; }
article pre code { color: #c3e6ff; }
article :not(pre) > code { background: var(--mint); border: 1.5px solid var(--ink); padding: 1px 7px; border-radius: 5px; font-size: .85em; }
article blockquote { margin: 1.2em 0; padding: 13px 18px; background: var(--cream);
  border: 2.5px solid var(--ink); border-left-width: 10px; border-radius: 6px; box-shadow: var(--pop-sm); }
article blockquote p { margin: .3em 0; }
article hr { border: none; border-top: 3px dashed var(--ink); margin: 2.5em 0; }
article img { max-width: 100%; border: var(--bd); border-radius: 8px; }

footer { border-top: var(--bd); padding: 34px 24px 60px; text-align: center; font-size: .9rem; background: var(--yellow); }
footer p { margin: .5em 0; }

/* mobile */
.toc-fab { display: none; }
@media (max-width: 900px) {
  .reader { grid-template-columns: 1fr; }
  aside.toc { position: fixed; inset: auto 14px 84px 14px; top: auto; z-index: 50; max-height: 60vh;
    transform: translateY(20px); opacity: 0; pointer-events: none; transition: .2s; }
  aside.toc.open { transform: none; opacity: 1; pointer-events: auto; }
  .toc-fab { display: flex; position: fixed; bottom: 20px; right: 18px; z-index: 51; gap: 8px; align-items: center;
    font: inherit; font-weight: 700; background: var(--pink); color: var(--ink); border: var(--bd); border-radius: 999px;
    padding: 13px 22px; cursor: pointer; box-shadow: var(--pop); }
  .toc-fab:active { transform: translate(4px, 4px); box-shadow: 0 0 0 var(--ink); }
}
</style>
</head>
<body>

<section class="hero">
  <div class="wrap">
    <div class="kicker">🎨 Pop Edition</div>
    <div class="headline-card">
      <h1>สร้างผู้ช่วย AI ส่วนตัวบน Discord<br>ฟังเสียง · พูดได้ · สั่งงานได้</h1>
    </div>
    <p class="sub">เลขา AI ที่อยู่กับคุณ 24 ชม. — พูดสั่งงานได้เหมือนคุยโทรศัพท์ ถอดเสียงไทยในเครื่องตัวเอง พร้อมพิมพ์เขียวให้ AI สร้างให้ทั้งระบบ · คู่มือภาษาไทย จากการสร้างจริงใน 1 คืน · แจกฟรี CC BY 4.0</p>
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
    <h2><span>มันทำอะไรได้บ้าง</span></h2>
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
  <p><a href="index.html">🏠 กลับหน้าหลัก</a> · <a href="styles.html">🎨 ดีไซน์ทั้งหมด</a> · ต้นฉบับ: <a href="${GIST}" target="_blank">GitHub Gist</a></p>
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

writeFileSync('pop.html', html)
console.log('built pop.html (Pop Edition) — easy TOC:', easyP.toc.length, 'items, full TOC:', fullP.toc.length, 'items')
