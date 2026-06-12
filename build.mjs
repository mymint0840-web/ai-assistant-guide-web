// Build 3 themed variants of the AI Discord Assistant guide site.
import { readFileSync, writeFileSync } from 'node:fs'

const easy = readFileSync('easy-body.html', 'utf8')
const full = readFileSync('full-body.html', 'utf8')
const GIST = 'https://gist.github.com/mymint0840-web/26285feaee428de0f12c0482127a73ff'

const switcherJs = `
function show(which) {
  document.getElementById('easy').style.display = which === 'easy' ? 'block' : 'none'
  document.getElementById('full').style.display = which === 'full' ? 'block' : 'none'
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.t === which))
  window.scrollTo({ top: 0 })
}
`

function page({ title, css, font, badge }) {
  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>สร้างผู้ช่วย AI ส่วนตัวบน Discord — ${title}</title>
<meta name="description" content="คู่มือภาษาไทย สร้างผู้ช่วย AI ที่ฟังเสียง พูดได้ สั่งงานได้ บน Discord — จากการสร้างจริง">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=${font}&display=swap" rel="stylesheet">
<style>${css}</style>
</head>
<body>
<header>
  <div class="wrap">
    <div class="badge">${badge}</div>
    <h1 class="site-title">สร้างผู้ช่วย AI ส่วนตัวบน Discord</h1>
    <p class="subtitle">ฟังเสียง · พูดได้ · สั่งงานได้ — คู่มือภาษาไทยจากการสร้างจริงใน 1 คืน 🎙️🤖</p>
    <nav class="tabs">
      <button class="tab active" data-t="easy" onclick="show('easy')">📖 ฉบับอ่านง่าย</button>
      <button class="tab" data-t="full" onclick="show('full')">🔧 ฉบับเต็ม (ลงมือทำ)</button>
    </nav>
    <p class="links"><a href="index.html">← เลือกดีไซน์อื่น</a> · <a href="${GIST}" target="_blank">ดูบน GitHub Gist</a></p>
  </div>
</header>
<main class="wrap">
  <article id="easy">${easy}</article>
  <article id="full" style="display:none">${full}</article>
</main>
<footer class="wrap">
  <p>🤖 เขียนโดย <strong>regulus</strong> (AI Commander) จาก Golf → regulus-oracle · CC BY 4.0 แจกจ่าย-ดัดแปลงได้เสรี</p>
</footer>
<script>${switcherJs}</script>
</body>
</html>`
}

const baseCss = `
* { box-sizing: border-box; }
body { margin: 0; line-height: 1.85; -webkit-font-smoothing: antialiased; }
.wrap { max-width: 860px; margin: 0 auto; padding: 0 24px; }
header { padding: 56px 0 8px; }
.site-title { font-size: 2.1rem; margin: 12px 0 4px; line-height: 1.3; }
.subtitle { margin: 0 0 20px; opacity: .8; }
.badge { display: inline-block; font-size: .8rem; padding: 4px 12px; border-radius: 999px; }
.tabs { display: flex; gap: 10px; margin: 18px 0 6px; flex-wrap: wrap; }
.tab { font: inherit; font-size: 1rem; padding: 10px 22px; border-radius: 12px; cursor: pointer; border: 2px solid transparent; }
.links { font-size: .9rem; margin: 10px 0 0; }
main { padding: 24px 24px 40px; }
article h1 { font-size: 1.7rem; margin-top: 2.2em; line-height: 1.4; }
article h2 { font-size: 1.35rem; margin-top: 2em; line-height: 1.4; }
article h3 { font-size: 1.1rem; margin-top: 1.6em; }
article img { max-width: 100%; }
table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: .95rem; display: block; overflow-x: auto; }
th, td { padding: 8px 12px; text-align: left; vertical-align: top; }
pre { padding: 16px; border-radius: 12px; overflow-x: auto; font-size: .85rem; line-height: 1.6; }
code { font-family: "SF Mono", Menlo, Consolas, monospace; }
blockquote { margin: 1em 0; padding: 12px 18px; border-radius: 0 10px 10px 0; }
footer { padding: 30px 24px 50px; font-size: .85rem; opacity: .75; }
@media (max-width: 600px) { .site-title { font-size: 1.5rem; } header { padding-top: 32px; } }
`

// ── Variant A: Docs (clean light) ──
const docsCss = baseCss + `
body { font-family: 'IBM Plex Sans Thai', sans-serif; background: #fafaf8; color: #1a1a1a; }
header { border-bottom: 1px solid #e5e3dd; background: #fff; }
.badge { background: #eef4ff; color: #2456c4; }
.tab { background: #f0efe9; color: #444; }
.tab.active { background: #2456c4; color: #fff; }
a { color: #2456c4; }
th { background: #f0efe9; } td, th { border: 1px solid #e3e1d9; }
pre { background: #2b2b33; color: #e8e8f0; }
code { background: #efede5; padding: 1px 5px; border-radius: 4px; }
pre code { background: none; padding: 0; }
blockquote { background: #fff8e6; border-left: 4px solid #e8b931; }
`

// ── Variant B: Night (dark modern) ──
const nightCss = baseCss + `
body { font-family: 'Noto Sans Thai', sans-serif; background: #0d1117; color: #d8dee8; }
header { background: linear-gradient(135deg, #131a2b 0%, #1d1330 100%); border-bottom: 1px solid #232c42; }
.badge { background: #1f2a44; color: #7da6ff; }
.site-title { background: linear-gradient(90deg, #7da6ff, #c792ea); -webkit-background-clip: text; background-clip: text; color: transparent; }
.tab { background: #1b2233; color: #aab4c8; }
.tab.active { background: linear-gradient(90deg, #3b5bdb, #7048e8); color: #fff; }
a { color: #7da6ff; }
th { background: #1b2233; } td, th { border: 1px solid #2a3550; }
pre { background: #161d2e; color: #d8e2f8; border: 1px solid #232c42; }
code { background: #1f2738; padding: 1px 5px; border-radius: 4px; color: #9ecbff; }
pre code { background: none; padding: 0; }
blockquote { background: #16213a; border-left: 4px solid #7048e8; }
`

// ── Variant C: Story (warm paper) ──
const storyCss = baseCss + `
body { font-family: 'Mitr', 'Noto Sans Thai', sans-serif; background: #fdf6ec; color: #41342a; }
header { background: #f7e8d3; border-bottom: 3px dashed #e0c9a8; }
.badge { background: #ffe3b3; color: #8a5a14; }
.site-title { color: #6b441f; }
.tab { background: #efe0cb; color: #6e5a44; border-radius: 999px; }
.tab.active { background: #e8923c; color: #fff; }
a { color: #c2611d; }
th { background: #f3e5cf; } td, th { border: 1px solid #e6d3b5; }
pre { background: #3d3329; color: #f3e9da; }
code { background: #f0e2cb; padding: 1px 5px; border-radius: 4px; }
pre code { background: none; padding: 0; }
blockquote { background: #fff3dc; border-left: 4px solid #e8923c; }
article { font-size: 1.05rem; }
`

writeFileSync('docs.html', page({ title: 'สไตล์เอกสาร', css: docsCss, font: 'IBM+Plex+Sans+Thai:wght@400;600;700', badge: '📄 Docs Edition' }))
writeFileSync('night.html', page({ title: 'สไตล์ Night', css: nightCss, font: 'Noto+Sans+Thai:wght@400;600;700', badge: '🌙 Night Edition' }))
writeFileSync('story.html', page({ title: 'สไตล์เล่าเรื่อง', css: storyCss, font: 'Mitr:wght@300;400;600', badge: '📖 Story Edition' }))

// ── Index chooser ──
writeFileSync('index.html', `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>สร้างผู้ช่วย AI ส่วนตัวบน Discord — เลือกสไตล์การอ่าน</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;600;800&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; }
body { font-family: 'Noto Sans Thai', sans-serif; margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(160deg, #10162b 0%, #251238 60%, #3b1a2e 100%); color: #fff; padding: 24px; }
.box { max-width: 720px; text-align: center; }
h1 { font-size: 2rem; line-height: 1.4; margin: 0 0 8px; }
p.sub { opacity: .8; margin: 0 0 36px; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
a.card { display: block; padding: 28px 18px; border-radius: 18px; text-decoration: none; color: inherit;
  background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.14); transition: transform .15s, background .15s; }
a.card:hover { transform: translateY(-4px); background: rgba(255,255,255,.13); }
.emoji { font-size: 2.4rem; }
.name { font-weight: 800; font-size: 1.1rem; margin: 10px 0 4px; }
.desc { font-size: .85rem; opacity: .75; line-height: 1.6; }
footer { margin-top: 40px; font-size: .8rem; opacity: .6; }
footer a { color: #9db4ff; }
</style>
</head>
<body>
<div class="box">
  <h1>สร้างผู้ช่วย AI ส่วนตัวบน Discord 🎙️🤖</h1>
  <p class="sub">ฟังเสียง · พูดได้ · สั่งงานได้ — คู่มือภาษาไทยจากการสร้างจริง · เลือกสไตล์ที่ชอบ</p>
  <div class="cards">
    <a class="card" href="docs.html"><div class="emoji">📄</div><div class="name">Docs</div><div class="desc">ขาวสะอาด อ่านสบาย เหมือนเอกสารมืออาชีพ</div></a>
    <a class="card" href="night.html"><div class="emoji">🌙</div><div class="name">Night</div><div class="desc">โหมดมืดสายเทค ถนอมสายตา อ่านตอนดึก</div></a>
    <a class="card" href="story.html"><div class="emoji">📖</div><div class="name">Story</div><div class="desc">โทนอุ่นเหมือนหนังสือนิทาน เหมาะกับฉบับอ่านง่าย</div></a>
  </div>
  <footer>ทุกสไตล์มีครบทั้ง 2 เวอร์ชัน (อ่านง่าย/ฉบับเต็ม) · <a href="${GIST}" target="_blank">ต้นฉบับบน GitHub Gist</a><br>
  🤖 เขียนโดย regulus จาก Golf → regulus-oracle · CC BY 4.0</footer>
</div>
</body>
</html>`)

console.log('built: index.html docs.html night.html story.html')
