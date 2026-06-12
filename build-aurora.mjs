// Aurora Glass design: animated aurora gradient + glassmorphism — hero glass panel,
// floating chat bubbles, feature cards, tab switcher, sticky TOC sidebar with scrollspy.
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
<title>สร้างผู้ช่วย AI ส่วนตัวบน Discord — ฟังเสียง พูดได้ สั่งงานได้ — Aurora Edition</title>
<meta name="description" content="คู่มือภาษาไทยฉบับสมบูรณ์ สร้างผู้ช่วย AI บน Discord จากการสร้างจริง — Aurora Glass Edition มีทั้งฉบับอ่านง่ายและฉบับลงมือทำ">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --deep: #03101f; --mint: #6ef2c9; --cyan: #58e0ff; --pink: #ff8ad8; --violet: #9d8cff;
  --txt: #eafdfb; --dim: #9fc4cf;
  --glass: rgba(255,255,255,.07);
  --glass-strong: rgba(255,255,255,.10);
  --edge: rgba(255,255,255,.22);
  --edge-soft: rgba(255,255,255,.14);
  --r2xl: 1.5rem;
  --aurora-grad: linear-gradient(95deg, var(--mint), var(--cyan) 45%, var(--pink));
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0; font-family: 'Bai Jamjuree', sans-serif; color: var(--txt); line-height: 1.95;
  background: linear-gradient(165deg, #02091a 0%, #04203a 38%, #054d56 78%, #03313f 100%);
  background-attachment: fixed; min-height: 100vh; overflow-x: hidden;
}
/* ── animated aurora sky ── */
.sky { position: fixed; inset: -35%; z-index: -2; pointer-events: none; filter: blur(46px) saturate(1.25);
  background:
    radial-gradient(38% 46% at 22% 26%, rgba(110,242,201,.34), transparent 64%),
    radial-gradient(42% 50% at 78% 18%, rgba(88,224,255,.30), transparent 62%),
    radial-gradient(46% 54% at 64% 78%, rgba(255,138,216,.22), transparent 64%),
    radial-gradient(40% 48% at 18% 86%, rgba(157,140,255,.26), transparent 62%),
    linear-gradient(200deg, rgba(8,46,72,.55), rgba(4,64,66,.45));
  animation: auroraDrift 26s ease-in-out infinite alternate;
}
.sky2 { position: fixed; inset: -45%; z-index: -1; pointer-events: none; opacity: .5; mix-blend-mode: screen;
  background:
    radial-gradient(30% 60% at 50% 30%, rgba(110,242,201,.18), transparent 70%),
    radial-gradient(55% 32% at 30% 60%, rgba(255,138,216,.13), transparent 70%);
  filter: blur(60px);
  animation: auroraDrift2 34s ease-in-out infinite alternate;
}
@keyframes auroraDrift {
  0%   { transform: translate(0, 0) rotate(0deg) scale(1); }
  50%  { transform: translate(4%, -3%) rotate(7deg) scale(1.1); }
  100% { transform: translate(-5%, 4%) rotate(-6deg) scale(1.05); }
}
@keyframes auroraDrift2 {
  0%   { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(-6%, 6%) rotate(10deg); }
}
a { color: var(--cyan); text-decoration: none; }
a:hover { text-shadow: 0 0 14px rgba(88,224,255,.55); }
.wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px; }

/* shared glass surface */
.glass { background: var(--glass); border: 1px solid var(--edge-soft); border-radius: var(--r2xl);
  backdrop-filter: blur(18px) saturate(1.3); -webkit-backdrop-filter: blur(18px) saturate(1.3);
  box-shadow: 0 18px 50px rgba(2,10,24,.45), inset 0 1px 0 rgba(255,255,255,.14); }

/* ── hero: big glass panel ── */
.hero { padding: 72px 0 56px; }
.hero-panel { text-align: center; padding: clamp(36px, 6vw, 64px) clamp(20px, 5vw, 56px);
  background: var(--glass-strong); border: 1px solid var(--edge); border-radius: 2rem;
  backdrop-filter: blur(22px) saturate(1.35); -webkit-backdrop-filter: blur(22px) saturate(1.35);
  box-shadow: 0 26px 70px rgba(2,10,24,.55), inset 0 1px 0 rgba(255,255,255,.2),
    0 0 90px rgba(110,242,201,.10), 0 0 140px rgba(255,138,216,.08); }
.kicker { display: inline-block; font-size: .85rem; font-weight: 600; letter-spacing: .05em; color: var(--mint);
  border: 1px solid rgba(110,242,201,.45); background: rgba(110,242,201,.10); padding: 7px 18px;
  border-radius: 999px; margin-bottom: 24px; backdrop-filter: blur(10px);
  box-shadow: 0 0 24px rgba(110,242,201,.25), inset 0 0 14px rgba(110,242,201,.08); }
.hero h1 { font-size: clamp(1.9rem, 5vw, 3.2rem); font-weight: 700; line-height: 1.4; margin: 0 auto 14px; max-width: 860px;
  background: var(--aurora-grad); -webkit-background-clip: text; background-clip: text; color: transparent;
  filter: drop-shadow(0 0 26px rgba(88,224,255,.30)); }
.hero p.sub { color: var(--dim); font-size: clamp(1rem, 2.2vw, 1.18rem); max-width: 640px; margin: 0 auto 34px; }
.cta { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 44px; }
.btn { font: inherit; font-weight: 700; padding: 13px 30px; border-radius: var(--r2xl); cursor: pointer; font-size: 1.02rem;
  transition: transform .15s, box-shadow .2s; }
.btn.primary { background: var(--aurora-grad); color: #052430; border: none;
  box-shadow: 0 10px 34px rgba(88,224,255,.35), 0 0 24px rgba(110,242,201,.3); }
.btn.ghost { background: rgba(255,255,255,.08); color: var(--txt); border: 1px solid var(--edge);
  backdrop-filter: blur(12px); }
.btn:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(88,224,255,.45); }

/* floating glass chat demo */
.demo { max-width: 470px; margin: 0 auto; text-align: left; padding: 22px 20px 16px;
  background: rgba(4,18,34,.45); border: 1px solid var(--edge); border-radius: var(--r2xl);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 20px 50px rgba(2,10,24,.5), inset 0 1px 0 rgba(255,255,255,.16); }
.demo .bar { display: flex; gap: 6px; margin-bottom: 14px; }
.demo .dot { width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 8px currentColor; }
.demo .dot:nth-child(1) { background: var(--pink); color: var(--pink); }
.demo .dot:nth-child(2) { background: var(--mint); color: var(--mint); }
.demo .dot:nth-child(3) { background: var(--cyan); color: var(--cyan); }
.msg { opacity: 0; transform: translateY(14px); border-radius: 1.1rem; padding: 10px 15px;
  margin: 9px 0; font-size: .92rem; max-width: 88%;
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--edge-soft);
  animation: pop .5s var(--d, 0s) forwards, floaty 7s ease-in-out 4.2s infinite; }
.msg.user { --d: .4s; background: rgba(88,224,255,.14); border-color: rgba(88,224,255,.35); margin-left: auto;
  box-shadow: 0 0 22px rgba(88,224,255,.14); }
.msg.bot  { --d: 1.3s; background: rgba(110,242,201,.10); border-color: rgba(110,242,201,.3);
  box-shadow: 0 0 22px rgba(110,242,201,.12); }
.msg.user.m2 { --d: 2.4s; }
.msg.bot.m2  { --d: 3.4s; animation-delay: var(--d), 4.6s; }
@keyframes pop { to { opacity: 1; transform: translateY(0); } }
@keyframes floaty { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }

/* feature cards */
.features { padding: 30px 0 10px; }
.features h2 { text-align: center; font-size: 1.7rem; font-weight: 700; margin: 0 0 34px;
  background: var(--aurora-grad); -webkit-background-clip: text; background-clip: text; color: transparent; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 18px; }
.feat { background: var(--glass); border: 1px solid var(--edge-soft); border-radius: var(--r2xl); padding: 24px;
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  transition: transform .18s, border-color .18s, box-shadow .25s; }
.feat:hover { transform: translateY(-4px); border-color: rgba(110,242,201,.5);
  box-shadow: 0 16px 44px rgba(2,10,24,.5), 0 0 34px rgba(110,242,201,.18); }
.feat .ic { font-size: 1.9rem; filter: drop-shadow(0 0 12px rgba(88,224,255,.5)); }
.feat .t { font-weight: 700; margin: 10px 0 4px; color: var(--mint); }
.feat .d { color: var(--dim); font-size: .9rem; line-height: 1.75; }

/* ── reading area: sidebar + content ── */
.reader { display: grid; grid-template-columns: 290px minmax(0, 1fr); gap: 34px; padding: 56px 0 90px; align-items: start; }
aside.toc { position: sticky; top: 18px; max-height: calc(100vh - 36px); overflow-y: auto;
  background: var(--glass); border: 1px solid var(--edge); border-radius: var(--r2xl);
  padding: 18px 10px 18px 18px;
  backdrop-filter: blur(20px) saturate(1.3); -webkit-backdrop-filter: blur(20px) saturate(1.3);
  box-shadow: 0 18px 50px rgba(2,10,24,.45), inset 0 1px 0 rgba(255,255,255,.14); }
.toc .toc-title { font-weight: 700; font-size: .95rem; margin-bottom: 10px; color: var(--pink);
  text-shadow: 0 0 16px rgba(255,138,216,.4); }
.toc nav { display: none; }
.toc nav.active { display: block; }
.toc a { display: block; color: var(--dim); font-size: .88rem; padding: 7px 12px; border-radius: .9rem; line-height: 1.5;
  border: 1px solid transparent; transition: background .15s, color .15s; }
.toc a:hover { color: var(--txt); background: rgba(255,255,255,.07); text-shadow: none; }
.toc a.on { color: var(--mint); border-color: rgba(110,242,201,.4); background: rgba(110,242,201,.10);
  font-weight: 600; box-shadow: 0 0 18px rgba(110,242,201,.15), inset 0 0 12px rgba(110,242,201,.06); }
.tabs { display: flex; gap: 8px; margin-bottom: 14px; padding: 5px; border-radius: var(--r2xl);
  background: rgba(2,10,24,.35); border: 1px solid var(--edge-soft); }
.tab { flex: 1; font: inherit; font-size: .88rem; font-weight: 700; padding: 9px 6px; border-radius: 1.1rem; cursor: pointer;
  background: transparent; color: var(--dim); border: none; transition: .2s; }
.tab.active { background: var(--aurora-grad); color: #052430;
  box-shadow: 0 6px 20px rgba(88,224,255,.35), 0 0 18px rgba(110,242,201,.3); }

article { min-width: 0; padding: clamp(20px, 4vw, 44px);
  background: rgba(3,14,28,.40); border: 1px solid var(--edge-soft); border-radius: 2rem;
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 20px 60px rgba(2,10,24,.45), inset 0 1px 0 rgba(255,255,255,.10); }
article h1 { font-size: 1.65rem; line-height: 1.45; margin: 2.4em 0 .6em; font-weight: 700;
  background: var(--aurora-grad); -webkit-background-clip: text; background-clip: text; color: transparent; }
article h2 { font-size: 1.4rem; line-height: 1.45; margin: 2.5em 0 .6em; padding-top: .9em; font-weight: 700;
  border-top: 1px solid var(--edge-soft); color: var(--txt); }
article h2::before { content: ""; display: inline-block; width: 11px; height: 11px; border-radius: 999px;
  background: var(--aurora-grad); margin-right: 11px; box-shadow: 0 0 14px rgba(110,242,201,.6); }
article h3 { font-size: 1.12rem; margin: 1.8em 0 .5em; color: var(--cyan); font-weight: 600;
  text-shadow: 0 0 18px rgba(88,224,255,.3); }
article > :first-child { margin-top: 0; }
article p, article li { color: #d3ecef; }
article strong { color: #fff; }
article table { border-collapse: collapse; width: 100%; margin: 1.2em 0; font-size: .92rem; display: block; overflow-x: auto;
  border-radius: 1rem; }
article th { background: rgba(110,242,201,.12); color: #fff; }
article th, article td { border: 1px solid var(--edge-soft); padding: 9px 13px; text-align: left; vertical-align: top; }
article pre { background: rgba(2,8,20,.6); border: 1px solid rgba(88,224,255,.25); border-radius: var(--r2xl);
  padding: 38px 18px 16px; overflow-x: auto; font-size: .84rem; line-height: 1.65; position: relative;
  backdrop-filter: blur(10px); box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 0 26px rgba(88,224,255,.07); }
article pre::before { content: "✦ aurora ✦"; position: absolute; top: 10px; left: 16px; font-size: .62rem;
  letter-spacing: 3px; color: rgba(110,242,201,.55); }
article code { font-family: "SF Mono", Menlo, Consolas, monospace; color: #8ef0ff; }
article :not(pre) > code { background: rgba(88,224,255,.13); border: 1px solid rgba(88,224,255,.2);
  padding: 2px 8px; border-radius: .6rem; font-size: .85em; }
article blockquote { margin: 1.2em 0; padding: 14px 20px; background: rgba(255,138,216,.08);
  border: 1px solid rgba(255,138,216,.28); border-radius: var(--r2xl);
  backdrop-filter: blur(10px); box-shadow: 0 0 24px rgba(255,138,216,.08); }
article blockquote p { margin: .3em 0; color: #ffd9f0; }
article hr { border: none; border-top: 1px dashed var(--edge); margin: 2.5em 0; }
article img { max-width: 100%; border-radius: var(--r2xl); }

footer { margin-top: 20px; padding: 38px 24px 64px; text-align: center; color: var(--dim); font-size: .88rem;
  background: rgba(2,10,24,.35); border-top: 1px solid var(--edge-soft);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
footer a { color: var(--cyan); }

/* mobile */
.toc-fab { display: none; }
@media (max-width: 900px) {
  .reader { grid-template-columns: 1fr; }
  aside.toc { position: fixed; inset: auto 14px 88px 14px; top: auto; z-index: 50; max-height: 60vh;
    transform: translateY(20px); opacity: 0; pointer-events: none; transition: .22s;
    background: rgba(4,20,36,.92); backdrop-filter: blur(26px); -webkit-backdrop-filter: blur(26px); }
  aside.toc.open { transform: none; opacity: 1; pointer-events: auto; }
  .toc-fab { display: flex; position: fixed; bottom: 20px; right: 18px; z-index: 51; gap: 8px; align-items: center;
    font: inherit; font-weight: 700; background: var(--aurora-grad); color: #052430; border: none; border-radius: 999px;
    padding: 13px 22px; cursor: pointer;
    box-shadow: 0 12px 34px rgba(2,10,24,.6), 0 0 26px rgba(110,242,201,.4); }
}
</style>
</head>
<body>
<div class="sky"></div>
<div class="sky2"></div>

<section class="hero">
  <div class="wrap">
    <div class="hero-panel">
      <div class="kicker">🌌 Aurora Edition</div>
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
    <div class="toc-title">✨ สารบัญ — กดข้ามได้เลย</div>
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
  <p>🤖 เขียนโดย regulus (AI Commander) จาก Golf → regulus-oracle</p>
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

writeFileSync('aurora.html', html)
console.log('built aurora.html (Aurora Glass) — easy TOC:', easyP.toc.length, 'items, full TOC:', fullP.toc.length, 'items')
