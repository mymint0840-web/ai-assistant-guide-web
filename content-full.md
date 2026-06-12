# สร้างผู้ช่วย AI ส่วนตัวบน Discord — ฟังเสียง พูดได้ สั่งงานได้ 🎙️🤖

> คู่มือฉบับเจาะลึกจากการ**สร้างจริงใน 1 คืน** — ผู้ช่วย AI ที่อยู่ใน Discord ของคุณเอง:
> พิมพ์คุยได้, เข้าห้องเสียงมานั่งฟัง, ถอดเสียงพูดภาษาไทยเป็นข้อความ, **พูดตอบกลับด้วยเสียง**,
> ตอบคำถามได้เองใน ~10 วินาที และส่งงานใหญ่ต่อให้ AI ตัวหลักทำ
>
> เขียนให้ **คนทำตามได้** และ **ก๊อปให้ AI (เช่น Claude Code) สร้างให้ทั้งระบบได้** — ท้ายเอกสารมี Mega-Prompt สำเร็จรูป

---

## ภาพรวมระบบ

```
คุณพูดในห้องเสียง Discord
        │
        ▼
[หู] บอทนั่งอยู่ในห้องเสียง รับเสียงแยกรายคน
        │  (ตัดท่อนเมื่อเงียบ 0.3 วิ + รวมท่อนที่พูดต่อเนื่องเป็นประโยคเดียว)
        ▼
[ถอดเสียง] Whisper รันในเครื่องคุณเอง (เสียงไม่ออกไปไหน)
        │
        ▼
[สมองเร็ว] AI ตัวเล็ก ตอบใน ~5-10 วิ ──── งานใหญ่? ──► [สมองหลัก] AI ตัวเต็ม (Claude Code)
        │                                                    ลงมือทำจริง แล้วรายงานกลับ
        ▼
[ปาก] แปลงคำตอบเป็นเสียงพูด เล่นกลับเข้าห้องเสียง + โพสต์ข้อความในแชท
```

**หลักการสำคัญที่สุดของระบบนี้** (ได้มาจากแผลจริง):
- 🧠 สมองเร็วมีหน้าที่ "คุย" เท่านั้น — **ไม่มีมือ ห้ามทำงานเอง ห้ามเคลมว่าทำแล้ว**
- 👑 งานที่ต้องลงมือจริงทุกอย่าง ส่งต่อให้สมองหลักตัวเดียว
- 🔍 เชื่อผลลัพธ์ที่ตรวจสอบได้เท่านั้น (ไฟล์มีจริง, process รันจริง) — belief ≠ evidence

---

## สิ่งที่ต้องมี

| อย่าง | ใช้ทำอะไร | หมายเหตุ |
|---|---|---|
| เครื่องที่เปิดทิ้งไว้ได้ **อะไรก็ได้** | รันบอท | ดูตาราง "เลือกบ้านให้บอท" ด้านล่าง |
| บัญชี Discord + เซิร์ฟเวอร์ของตัวเอง | บ้านของบอท | ฟรี |
| Discord Bot Token | ตัวตนของบอท | สร้างฟรีที่ developer portal |
| Node.js 20+ | รันตัวบอท | mac: `brew install node` / ubuntu: `apt install nodejs npm` หรือ nvm |
| ffmpeg + whisper.cpp | แปลง+ถอดเสียง | mac: `brew install ffmpeg whisper-cpp` / ubuntu: `apt install ffmpeg` + build whisper.cpp จาก github (5 นาที) |
| Python 3 | เสียงพูด (edge-tts) | มากับเครื่องอยู่แล้ว |
| AI CLI **ค่ายไหนก็ได้** | สมองเร็ว+สมองหลัก | ดูตารางเลือกสมองด้านล่าง |

### เลือกบ้านให้บอท — เครื่องไหนก็ได้ ไม่จำกัดค่าย

ข้อเท็จจริงสำคัญ: **บอทไม่แตะไมค์/ลำโพงของเครื่องที่มันรันเลย** — เสียงเข้า-ออกทั้งหมดวิ่งผ่านเครือข่าย Discord
ดังนั้นเครื่อง headless อย่าง VPS ก็รันได้เต็มรูปแบบ:

| บ้าน | ข้อดี | ข้อควรรู้ |
|---|---|---|
| คอม/โน้ตบุ๊คเก่าที่บ้าน | ฟรี ใช้ของที่มี ข้อมูลอยู่กับเรา | กินไฟกว่ามินิพีซี, ต้องเปิดทิ้งไว้ |
| มินิพีซี / Mac mini / NUC | เงียบ ประหยัดไฟ ตั้งลืม | มีค่าเครื่องเริ่มต้น |
| **VPS / เซิร์ฟเวอร์เช่า** | ไม่ต้องเปิดเครื่องที่บ้าน, เน็ตนิ่ง, เริ่มหลักร้อย/เดือน | เลือกสเปคตามหู: whisper turbo ต้องการ RAM ~4GB+ — CPU อ่อนให้ใช้โมเดล medium/small หรือ cloud STT แทน; เสียงถูกถอดบนเครื่องเช่า (ใครซีเรียส privacy ให้ชั่งใจ) |
| เซิร์ฟเวอร์ที่มี GPU | ถอดเสียงเร็วสุด รันสมอง Ollama ตัวใหญ่ได้ | เกินจำเป็นสำหรับใช้คนเดียว |

คำสั่งในคู่มือนี้เขียนแบบ mac (`brew`) เป็นหลักเพราะเป็นเครื่องที่เราใช้ตอนสร้าง —
สาย Ubuntu/Debian แทนด้วย `apt` ได้แทบทุกจุด และทุกชิ้นส่วน (node, ffmpeg, whisper.cpp, edge-tts) มีครบทุก OS

---

## เลือกสมองได้ตามใจ — ไม่ผูกกับค่ายไหน

หัวใจของระบบคือ "สมองเร็ว" เป็นแค่**การเรียก CLI หนึ่งบรรทัด**: ส่งข้อความเข้า → ได้ข้อความออก
จะใช้ AI ค่ายไหนก็แค่เปลี่ยนบรรทัดเดียว:

| สมอง | คำสั่งที่ใช้แทนกัน | จุดเด่น | ค่าใช้จ่าย |
|---|---|---|---|
| **Claude Code** | `claude -p "<prompt>" --model claude-haiku-4-5 --tools ""` | ฉลาด ตอบไทยดี มี flag ตัดมือ | ตาม subscription/API |
| **OpenAI Codex CLI** | `codex exec "<prompt>"` | คนใช้ ChatGPT อยู่แล้วสะดวก | ตาม subscription |
| **Gemini CLI** | `gemini -p "<prompt>"` | มี free tier ใจป้ำ | ฟรี/ตาม quota |
| **Ollama (ในเครื่อง)** | `ollama run llama3.2 "<prompt>"` | **ฟรี 100% + ออฟไลน์ + ข้อมูลไม่ออกจากเครื่อง** | ฟรี |
| **API ตรง** | `curl` ไป endpoint ของค่ายที่ใช้ | ควบคุมได้ละเอียดสุด | ตาม token |

ในโค้ด แค่ทำให้คำสั่งสมองเป็นค่า config:

```js
// env BRAIN_CMD เช่น:
//   claude -p {PROMPT} --model claude-haiku-4-5 --tools ""
//   ollama run llama3.2 {PROMPT}
//   gemini -p {PROMPT}
const BRAIN_CMD = process.env.BRAIN_CMD || 'claude -p {PROMPT} --model claude-haiku-4-5 --tools ""'
```

> ⚠️ ข้อเดียวที่**ไม่ยืดหยุ่น**: ไม่ว่าใช้สมองค่ายไหน ต้องบังคับ 2 อย่างเสมอ —
> (1) สมองเร็วห้ามมีเครื่องมือ/ห้ามแตะระบบ (2) ใน prompt ต้องห้ามเคลมว่า "ทำแล้ว"
> นี่ไม่ใช่เรื่องรสนิยม แต่เป็นแผลจริง: สมองที่มีมือเคยแอบเปิดหน้าต่างมั่ว 4 อัน
> แล้วรายงานว่า "เปิดแท็บที่ 18 ให้แล้วครับ" ทั้งที่ไม่มีแท็บ 18 อยู่จริง 😅

ส่วน**หู (ถอดเสียง)** กับ**ปาก (เสียงพูด)** ก็เลือกได้:

| ชิ้น | ตัวเลือก | เหมาะกับ |
|---|---|---|
| หู | whisper.cpp (คู่มือนี้) | ทุกคน — ฟรี ในเครื่อง |
| หู | mlx-whisper + โมเดลจูนไทย | เครื่อง Apple + เน้นไทยแม่นสุด |
| หู | faster-whisper (Python) | สาย Python / มี GPU NVIDIA |
| หู | Cloud STT (OpenAI/Google) | ไม่อยากดูแลโมเดลเอง (เสียง*ออกนอกเครื่อง*) |
| ปาก | edge-tts (คู่มือนี้) | ฟรี เสียงไทยธรรมชาติ |
| ปาก | `say` (macOS) / `espeak-ng` (Linux) | ออฟไลน์ล้วน (เสียงหุ่นยนต์หน่อย) |
| ปาก | ElevenLabs / OpenAI TTS | เสียงเหมือนคนจริงสุด (เสียเงิน) |

---

## Part 1 — สร้างตัวบอท Discord

### 1.1 สร้าง Application + Bot

1. ไปที่ https://discord.com/developers/applications → **New Application** ตั้งชื่อผู้ช่วยของคุณ
2. เมนู **Bot** → Reset Token → **เก็บ token ไว้** (เห็นครั้งเดียว!)
3. เปิด **Privileged Gateway Intents** ให้ครบ: `MESSAGE CONTENT INTENT` (และ `SERVER MEMBERS` ถ้าจะใช้ชื่อเล่น)
4. เมนู **OAuth2 → URL Generator**: เลือก scope `bot` + สิทธิ์ `View Channels, Send Messages, Connect, Speak`
5. เปิด URL ที่ได้ → เชิญบอทเข้าเซิร์ฟเวอร์ของคุณ

### 1.2 เก็บ token แบบปลอดภัย

```bash
mkdir -p ~/.config/my-assistant
cat > ~/.config/my-assistant/.env << 'EOF'
DISCORD_BOT_TOKEN=วาง_token_ตรงนี้
EOF
chmod 600 ~/.config/my-assistant/.env
```

⚠️ **ห้าม commit token ลง git เด็ดขาด** — ใส่ `.env` ใน `.gitignore` เสมอ

### 1.3 หา ID ของห้อง

เปิด Discord → Settings → Advanced → เปิด **Developer Mode** → คลิกขวาที่ห้องเสียง/ห้องแชท → **Copy Channel ID** เก็บไว้ทั้งสองห้อง

---

## Part 2 — โปรเจคและโค้ดหลัก

### 2.1 ตั้งโปรเจค

```bash
mkdir -p ~/my-assistant/voice && cd ~/my-assistant/voice
npm init -y && npm pkg set type=module
npm install discord.js @discordjs/voice@^0.19.2 @snazzah/davey @discordjs/opus prism-media libsodium-wrappers
```

> ⚠️ **กับดักที่ใหญ่ที่สุดของปี**: Discord บังคับเข้ารหัสเสียงแบบใหม่ (DAVE E2EE) แล้ว
> ถ้าใช้ `@discordjs/voice` ต่ำกว่า 0.19 หรือลืมลง `@snazzah/davey`
> บอทจะต่อห้องเสียงไม่ติด — อาการคือวน `signalling → connecting` แล้ว timeout 30 วิ
> โดยไม่บอกสาเหตุเลย (เราเสียเวลาหาอยู่นาน)

### 2.2 โหลดโมเดลถอดเสียง

```bash
mkdir -p ~/models/whisper
# ตัวหลัก — เร็ว แม่นมาก รองรับไทย (1.6GB)
curl -L -o ~/models/whisper/ggml-large-v3-turbo.bin \
  https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo.bin
# ตัวกรองเสียงเงียบ/เสียงรบกวน (VAD — 1MB)
curl -L -o ~/models/whisper/ggml-silero-v5.1.2.bin \
  https://huggingface.co/ggml-org/whisper-vad/resolve/main/ggml-silero-v5.1.2.bin
```

> 💡 ถ้าเน้นภาษาไทยล้วนและมีชิป Apple: ลอง **Thonburian Whisper เวอร์ชัน MLX**
> (`pip install mlx-whisper` + โมเดล `tawankri/distill-thonburian-whisper-large-v3-mlx`)
> ถอดไทยแม่นกว่า โดยเฉพาะประโยคพูดเร็ว — แต่ turbo ก็เพียงพอสำหรับเริ่มต้น

### 2.3 เสียงพูด (ปาก)

```bash
python3 -m venv ~/my-assistant/tts-venv
~/my-assistant/tts-venv/bin/pip install edge-tts
# ทดสอบ — เสียงไทยธรรมชาติจาก Microsoft (ชาย Niwat / หญิง Premwadee)
~/my-assistant/tts-venv/bin/edge-tts --voice th-TH-NiwatNeural \
  --text "สวัสดีครับ ผมคือผู้ช่วยของคุณ" --write-media /tmp/test.mp3
```

> หมายเหตุความเป็นส่วนตัว: edge-tts ส่ง "ข้อความที่บอทจะพูด" ไปสร้างเสียงที่ Microsoft
> แต่**เสียงของคุณถูกถอดในเครื่อง 100%** ไม่ออกไปไหน — ถ้าต้องการ offline ล้วน: macOS ใช้ `say -v Kanya`, Linux ใช้ `espeak-ng -v th` หรือ TTS ในเครื่องตัวอื่น (เสียงหุ่นยนต์กว่า)

### 2.4 โค้ดหลัก `listen-voice.mjs`

โค้ดเต็มยาว — หัวใจสำคัญแต่ละท่อน (ให้ AI ประกอบเต็มจาก Mega-Prompt ท้ายเอกสารได้เลย):

```js
// ── เข้าห้องเสียง ──
const connection = joinVoiceChannel({
  channelId: voiceChannel.id,
  guildId: voiceChannel.guild.id,
  adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  selfDeaf: false,   // หูเปิด
  selfMute: false,   // ปากเปิด (ไว้พูดตอบ)
})

// ── จับเสียงรายคน — ตัดเมื่อเงียบ 0.3 วิ ──
const opusStream = connection.receiver.subscribe(userId, {
  end: { behavior: EndBehaviorType.AfterSilence, duration: 300 },
})
// opus → PCM → ffmpeg (ดันเสียงเบา+ตัด noise) → WAV 16kHz mono → whisper

// ── ตัวรวมท่อน (สำคัญมาก!) ──
// ตัดเสียงไว = ตอบไว แต่ประโยคขาดเป็นท่อน ๆ
// แก้โดย: ท่อนที่ตามมาภายใน 1 วิ ถูก "ต่อ" เป็นข้อความเดียวก่อนค่อยส่งให้สมองตอบ
// โบนัส: ระหว่างรอท่อนถัดไป whisper ถอดท่อนแรกขนานไปเลย — ได้ทั้งเร็วและครบ

// ── สมองเร็ว — ห้ามมีมือ! ──
const { stdout } = await execFileP('claude',
  ['-p', prompt, '--model', 'claude-haiku-4-5', '--tools', ''],  // --tools "" = ตัดมือ
  { timeout: 60_000 })
// ใน prompt สั่งชัด: "คุณไม่มีมือ ทำอะไรเองไม่ได้ ห้ามอ้างว่าทำแล้ว
//   งานที่ต้องลงมือ → ตอบรับสั้น ๆ แล้วเขียน FORWARD บรรทัดสุดท้าย"
// ถ้าเจอ FORWARD → ส่งข้อความต่อให้ AI ตัวหลัก (tmux pane / session อื่น) ลงมือทำจริง

// ── ปาก ──
await execFileP(EDGE_TTS, ['--voice', 'th-TH-NiwatNeural', '--text', reply, '--write-media', f])
player.play(createAudioResource(f))   // เล่นเข้าห้องเสียง
```

### 2.5 ตัวดูแล (supervisor) — ระบบฟื้นตัวเอง

```bash
cat > run-voice.sh << 'EOF'
#!/bin/zsh
cd "$(dirname "$0")"
while true; do
  node listen-voice.mjs "$1" "$2" 2>&1 | tee -a /tmp/assistant-voice.log
  echo "[supervisor] restarting in 3s" | tee -a /tmp/assistant-voice.log
  sleep 3
done
EOF
chmod +x run-voice.sh
./run-voice.sh <VOICE_CHANNEL_ID> <TEXT_CHANNEL_ID>
```

ในโค้ด ให้ตรวจจับ "ต่อสายเสียงใหม่" (reconnect) แล้ว `process.exit(86)` —
supervisor จะต่อกลับให้สดใหม่ใน 3 วิ

---

## Part 3 — พิมพ์คุย/สั่งงานด้วยข้อความ (บอทตัวเดียวกัน ไม่ต้องแยก!)

ข่าวดี: **ไม่ต้องสร้างบอทใหม่** — บอทตัวเดียวกันที่อยู่ในห้องเสียง รับข้อความพิมพ์ได้ด้วย
แค่เพิ่ม event `messageCreate` เข้าไปในไฟล์เดิม แล้วส่งเข้า**สมองเดียวกัน ประวัติแชทเดียวกัน** —
พิมพ์ถามต่อจากที่พูดไว้ก็ได้ พูดต่อจากที่พิมพ์ไว้ก็ได้ เป็นผู้ช่วยคนเดียวกันจริง ๆ

### 3.1 เพิ่ม intent

ตอนสร้าง client ให้เพิ่ม intent สำหรับข้อความ (และต้องเปิด MESSAGE CONTENT INTENT ใน dev portal ตาม Part 1.1):

```js
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,    // ← เพิ่ม
    GatewayIntentBits.MessageContent,   // ← เพิ่ม
  ],
})
```

### 3.2 รับข้อความ → สมองเดียวกัน

```js
const ALLOWED_USERS = new Set((process.env.ALLOWED_USERS || '').split(','))

client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return                          // กันบอทคุยกับตัวเอง (ลูปนรก!)
  if (msg.channel.id !== textChannelId) return        // ฟังเฉพาะห้องที่กำหนด
  if (!ALLOWED_USERS.has(msg.author.id)) return       // allowlist — ใครสั่งบอทได้

  const member = msg.author.globalName || msg.author.username
  // เข้าสมองเร็วตัวเดิม ประวัติเดียวกัน — respondQuick จะตอบ + FORWARD งานใหญ่เหมือนเสียงทุกอย่าง
  respondQuick(member, msg.content).catch(console.error)
})
```

แค่นี้จบ — เพราะเราออกแบบให้ `respondQuick()` เป็นทางเข้ากลาง: เสียงก็เรียกมัน ข้อความก็เรียกมัน

### 3.3 ลูกเล่นเพิ่มเติมฝั่งข้อความ

```js
// ตอบเป็นเสียงด้วยถ้าคนพิมพ์กำลังอยู่ในห้องเสียง (เนียนมาก)
const inVoice = msg.member?.voice?.channelId === voiceChannelId
if (inVoice) ttsQueue.push({ text: reply, voice: EDGE_VOICE })

// รับไฟล์แนบ (รูป/เอกสาร) — โหลดมาให้สมองหลักใช้ต่อ
if (msg.attachments.size) {
  for (const att of msg.attachments.values()) {
    // att.url โหลดได้เลย — ส่ง path/url ต่อใน FORWARD
  }
}

// สั่งเฉพาะเมื่อ mention (สำหรับห้องที่คนเยอะ)
if (!msg.mentions.has(client.user)) return
```

### เสียง vs ข้อความ — ใช้อะไรตอนไหน

| | 🎙️ เสียง | ⌨️ ข้อความ |
|---|---|---|
| เหมาะกับ | สั่งงานเร็ว ๆ มือไม่ว่าง คุยเล่น | คำสั่งยาว/ซับซ้อน, วาง code/ลิงก์, สั่งจากมือถือเงียบ ๆ |
| ความแม่น | ขึ้นกับไมค์+การถอดเสียง | 100% ตามที่พิมพ์ |
| หลักฐานย้อนดู | transcript ที่บอทโพสต์ | ตัวข้อความเองอยู่แล้ว |

ของจริงที่เราใช้: สลับไปมาตลอด — พูดตอนเทสระบบ/สั่งสั้น ๆ, พิมพ์ตอนสั่งงานละเอียดหรือส่งลิงก์/รูป

---

## กับดักจริงที่เจอมา (จ่ายค่าเทอมแทนคุณแล้ว 😅)

| # | อาการ | สาเหตุ | ทางแก้ |
|---|---|---|---|
| 1 | ต่อห้องเสียงไม่ติด วน connecting | Discord บังคับ DAVE E2EE | `@discordjs/voice` ≥0.19 + `@snazzah/davey` |
| 2 | เช้ามาบอทหูหนวก ทั้งที่ process ยังอยู่ | voice reconnect กลางคืน ทำ receiver ตายเงียบ | ตรวจ reconnect → restart ตัวเอง + supervisor |
| 3 | ถอดเสียงออกมาเป็นคำซ้ำวน ("ลอ ลอ ลอ") | whisper หลอนกับเสียงเบา/สั้น | VAD + ffmpeg loudnorm + `--max-context 0` + ตัวกรองคำซ้ำ |
| 4 | ประโยคยาวโดนหั่นเป็นท่อน | จังหวะหยุดหายใจ > ค่า silence | **ตัวรวมท่อน** (อย่าแก้ด้วยการเพิ่ม silence อย่างเดียว — จะช้า) |
| 5 | สมองเร็วโกหกว่า "ทำแล้ว/เปิดแท็บแล้ว" | LLM มี tools + ไม่ได้ห้ามเคลม | `--tools ""` + persona ห้ามเคลม + FORWARD เท่านั้น |
| 6 | ประโยคที่พูดระหว่างบอทกำลังถอดเสียง หายไป | หูปิดระหว่างประมวลผล | ปล่อยหูกลับไปฟังทันทีที่จบการอัด (ถอดเสียงเป็น async) |
| 7 | restart วนไม่หยุด | นับ `ready→ready` เป็น reconnect | นับเฉพาะ non-ready → ready จริง |
| 8 | สั่ง curl ไป localhost แล้วค้าง | proxy ในเครื่องดักจับ | `curl --noproxy '*'` (Node fetch ไม่โดน) |

---

## ค่าเริ่มต้นที่เราใช้ — จุดตั้งต้น **ไม่ใช่กฎ**

ค่าพวกนี้มาจากการเทสจริงกับจังหวะการพูดของ*เรา* — จังหวะพูด ความเงียบของห้อง และความใจร้อนของแต่ละคนไม่เท่ากัน ให้ถือเป็นจุดเริ่มแล้วจูนเป็นของตัวเอง:

| ค่า | เราใช้ | ความหมาย | จูนยังไง |
|---|---|---|---|
| `SILENCE_MS` | 300 | เงียบกี่ ms ถือว่าจบท่อน | พูดมีจังหวะคิดเยอะ → เพิ่ม / อยากไวสุด → ลด |
| `MERGE_MS` | 300–1000 | รอท่อนถัดไปก่อนตอบ | ข้อความชอบขาดเป็น 2 ก้อน → เพิ่ม |
| whisper model | large-v3-turbo | สมดุลเร็ว/แม่น | เครื่องแรง+เน้นแม่น → large-v3 เต็ม / เครื่องเบา → medium |
| whisper flags | `-bs 5 --max-context 0 --vad` | กันหลอน+แม่นขึ้น | เริ่มจากชุดนี้ก่อน |
| เสียงพูด | th-TH-NiwatNeural | ชายไทยธรรมชาติ | หญิง: Premwadee / สลับได้ runtime |
| สมองเร็ว | haiku + `--tools ""` | ตอบ ~5 วิ ไม่มีมือ | ค่ายอื่นดูตาราง "เลือกสมอง" |

**วิธีหาค่าของตัวเองให้เร็วที่สุด** (วิธีที่เราใช้จริง): ลองค่าสุดขั้วสองฝั่งก่อน — ตั้งสั้นมาก (0.3) แล้วพูดยาว ๆ ดูว่าขาดยังไง, ตั้งยาวมาก (3.0) แล้วดูว่าหงุดหงิดแค่ไหน — แล้วค่อยขยับเข้าหากลาง จะได้ค่าที่ "ใช่" ของตัวเองใน 10 นาที และถ้าเจอ trade-off ที่ปรับยังไงก็ไม่ลงตัว ให้สงสัยว่าตัวแปรเดียวกำลังแบกสองหน้าที่ — แยกมันออก (นั่นคือที่มาของตัวรวมท่อน)

---

## 🚀 Mega-Prompt: ก๊อปวางให้ AI สร้างทั้งระบบ

วางข้อความนี้ใน Claude Code (หรือ AI coding agent อื่น) แล้วแก้ค่าในวงเล็บเหลี่ยม:

```text
สร้างระบบผู้ช่วย AI เสียงบน Discord ให้ผม ตามสเปคนี้:

ข้อมูลของผม:
- Bot token อยู่ที่: [path ไฟล์ .env ของคุณ] (ตัวแปร DISCORD_BOT_TOKEN)
- ห้องเสียง ID: [VOICE_CHANNEL_ID]
- ห้องแชทสำหรับโพสต์ transcript/คำตอบ ID: [TEXT_CHANNEL_ID]
- เครื่อง: [macOS / Linux ที่บ้าน / VPS Ubuntu — ระบุของคุณ], มี node 20+, ตัวจัดการแพ็กเกจ [brew/apt]
- สมองเร็วที่จะใช้: [เช่น claude haiku / ollama llama3.2 / gemini — ถ้าไม่ใช่ claude ให้ดัดแปลงคำสั่งเรียกสมองตามตัวที่เลือก โดยคงกฎ "ไม่มีเครื่องมือ + ห้ามเคลมว่าทำแล้ว" ไว้เสมอ]
- user id ของผมใน Discord: [YOUR_USER_ID] (ทำ allowlist — บอทตอบ/ทำตามเฉพาะคนในลิสต์นี้)

สิ่งที่ต้องสร้าง (โฟลเดอร์ ~/my-assistant/voice):
1. listen-voice.mjs — discord.js + @discordjs/voice@^0.19 + @snazzah/davey + @discordjs/opus + prism-media
   - เข้าห้องเสียง (selfDeaf:false, selfMute:false) แล้วอยู่ถาวร
   - รับเสียงรายคน: subscribe ด้วย EndBehaviorType.AfterSilence duration จาก env SILENCE_MS (default 300)
   - opus→PCM 48k stereo→เขียนไฟล์ →ffmpeg แปลง 16kHz mono พร้อม filter "highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11"
   - ข้ามคลิปสั้นกว่า 0.6 วิ
   - ถอดเสียงด้วย whisper-cli: -m ~/models/whisper/ggml-large-v3-turbo.bin -l th --no-timestamps -bs 5 --max-context 0 --vad --vad-model ~/models/whisper/ggml-silero-v5.1.2.bin
   - ตัวกรองขยะ: ถ้าคำเดียวซ้ำติดกัน ≥4 ครั้ง หรือคำไม่ซ้ำ <40% → ทิ้ง
   - ตัวรวมท่อน: เก็บ buffer ต่อ user, นับงานที่กำลังอัด/ถอดอยู่ (inflight นับตั้งแต่เริ่มอัด),
     flush เมื่อ inflight=0 และไม่มีข้อความใหม่มานาน MERGE_MS (env, default 1000)
     แล้วค่อยโพสต์ "🎙️ ได้ยิน <ชื่อ>: <ข้อความรวม>" ลงห้องแชท + ส่งให้สมองเร็ว
   - สมองเร็ว: เรียก `claude -p "<persona+history+ข้อความ>" --model claude-haiku-4-5 --tools ""`
     persona: ตอบไทยสั้น 1-3 ประโยค / คุณไม่มีมือ ทำอะไรเองไม่ได้ / ห้ามอ้างว่าทำแล้ว-เปิดแล้ว-แก้แล้วเด็ดขาด /
     งานที่ต้องลงมือ → ตอบ "รับเรื่องครับ ส่งให้ตัวหลักทำแล้ว" + เขียน FORWARD บรรทัดสุดท้าย
     เก็บประวัติ 16 บรรทัดล่าสุดใน /tmp/assistant-chat.log เพื่อคุยต่อเนื่อง
     ถ้าเจอ FORWARD → [วิธีส่งให้ AI ตัวหลักของคุณ เช่น tmux send-keys ไป pane ที่รัน Claude Code]
   - ปาก: HTTP server ที่ 127.0.0.1:47992 รับ POST /speak {"text","voice"} →
     edge-tts (default th-TH-NiwatNeural, fallback `say` ถ้าออฟไลน์) → mp3 → เล่นผ่าน createAudioResource + AudioPlayer (มีคิว เล่นทีละอัน)
     คำตอบของสมองเร็วให้ทั้งพูดและโพสต์ "👑 <คำตอบ>" ในห้องแชท
   - ความเสถียร: ตรวจ stateChange ถ้าข้ามจาก non-ready → ready เป็นครั้งที่ 2 ขึ้นไป (reconnect จริง ไม่นับ ready→ready)
     → log แล้ว process.exit(86) ใน 5 วิ
   - endpoint /send-image (port เดียวกับ /speak): POST {"path","caption"} → statSync ตรวจไฟล์มีจริงก่อน → textChannel.send({content, files:[path]}) — สำหรับให้ AI ตัวหลักส่งรูป/ไฟล์ที่เจนเสร็จเข้าแชท
   - อ่านค่าตั้งทั้งหมดจาก .env: ALLOWED_USERS, SILENCE_MS, MERGE_MS, WHISPER_MODEL, BRAIN_CMD, EDGE_VOICE, SPEAK_PORT
   - รับข้อความพิมพ์ด้วย (บอทเดียวกัน): intent GuildMessages+MessageContent, event messageCreate —
     กรอง msg.author.bot ทิ้ง, เฉพาะห้อง TEXT_CHANNEL, เฉพาะ user ใน allowlist →
     ส่งเข้า respondQuick ตัวเดียวกับเสียง (ประวัติแชทร่วมกัน) และถ้าคนพิมพ์อยู่ในห้องเสียงให้พูดคำตอบด้วย
2. run-voice.sh — supervisor: while true loop รัน node แล้ว restart ทุกครั้งที่ตาย เว้น 3 วิ, log ลง /tmp/assistant-voice.log
2.5 ส่วนเสริม (สร้างเฉพาะที่ผมเลือก): [โหมดจดประชุม / cron งานตามเวลา / launchd-systemd เกิดเองหลังบูต / ฐานความรู้จากโฟลเดอร์ knowledge / ความจำถาวรข้ามวัน — ดูสเปคแต่ละตัวใน Part 4 ของคู่มือนี้]
3. ติดตั้ง dependency ทั้งหมด, โหลดโมเดล whisper ถ้ายังไม่มี, ทดสอบ:
   - syntax check ผ่าน
   - เปิดระบบแล้วบอทต้องอยู่ในห้องเสียงจริง (ตรวจผ่าน Discord API GET /guilds/<id>/voice-states/@me)
   - ยิง /speak ทดสอบ 1 ประโยคต้องได้ยินในห้อง
ห้ามบอกว่าเสร็จจนกว่าทุกข้อจะผ่านจริงและแสดงหลักฐาน (output คำสั่ง) ให้ดู
```

---

## เซ็ตติ้งแนะนำ — รวมไว้ที่เดียว ⚙️

### ฝั่ง Discord Developer Portal (เช็คลิสต์)

- [ ] **Bot → Privileged Gateway Intents**: เปิด `MESSAGE CONTENT INTENT` (จำเป็น) + `SERVER MEMBERS INTENT` (ถ้าอยากได้ชื่อเล่นสมาชิก)
- [ ] **Bot → Public Bot**: ปิด ❌ — กันคนอื่นเชิญบอทคุณเข้าเซิร์ฟเวอร์เขา
- [ ] **OAuth2 สิทธิ์ขั้นต่ำ**: `View Channels, Send Messages, Attach Files, Connect, Speak` — อย่าให้ Administrator ถ้าไม่จำเป็น

### ฝั่งเซิร์ฟเวอร์ Discord (โครงห้องที่แนะนำ)

```
📁 เซิร์ฟเวอร์ของคุณ
 ├─ #คุย-กับ-บอท     ← TEXT_CHANNEL (transcript + คำตอบ + สั่งงานพิมพ์)
 ├─ 🔊 ห้องเสียง      ← VOICE_CHANNEL (บอทนั่งฟัง+พูดที่นี่)
 └─ #ทั่วไป           ← ห้องคน บอทไม่ยุ่ง (อย่าให้บอทฟังทุกห้อง — ทั้งรกทั้งเสี่ยง)
```

### ไฟล์ตั้งค่า `.env` ฉบับเต็ม (ทุกปุ่มที่จูนได้)

```bash
# ── ตัวตน ──
DISCORD_BOT_TOKEN=xxx          # ห้าม commit!
ALLOWED_USERS=123,456          # user id ที่สั่งบอทได้ (คั่น comma)

# ── ห้อง ──
VOICE_CHANNEL_ID=xxx
TEXT_CHANNEL_ID=xxx

# ── หู ──
SILENCE_MS=300                 # เงียบกี่ ms = จบท่อน
MERGE_MS=1000                  # รอรวมท่อนก่อนตอบ
WHISPER_MODEL=$HOME/models/whisper/ggml-large-v3-turbo.bin

# ── สมอง ──
BRAIN_CMD=claude -p {PROMPT} --model claude-haiku-4-5 --tools ""
HISTORY_LINES=16               # จำบทสนทนาล่าสุดกี่บรรทัด

# ── ปาก ──
EDGE_VOICE=th-TH-NiwatNeural   # หญิง: th-TH-PremwadeeNeural
SPEAK_PORT=47992               # endpoint ให้ตัวอื่นสั่งพูด
```

> 💡 หลักการตั้งค่า: **อะไรที่คุณอยากลองเปลี่ยน ให้เป็น env ตั้งแต่แรก** — เราเสีย restart ไปหลายรอบกว่าจะเรียนรู้ว่าการจูนคือวงจร ลอง→ฟัง→ปรับ ยิ่งเปลี่ยนค่าง่าย ยิ่งเจอค่าที่ใช่เร็ว

---

## ให้ AI เจนรูปแล้วส่งเข้า Discord 🎨

สั่งปากเปล่า "เจนรูปสิงโตยืนบนหินตอนรุ่งสาง" แล้วรูปเด้งเข้าแชท — ทำแบบนี้:

### ตัวเลือกเครื่องเจนรูป

| ตัว | วิธีเรียก | ค่าใช้จ่าย |
|---|---|---|
| OpenAI (gpt-image-1) | API / ผ่าน Codex CLI | คิดต่อรูป |
| Gemini (Imagen) | API / Gemini CLI | มี free tier |
| Stable Diffusion ในเครื่อง | ComfyUI/sd-webui + API local | ฟรี (ต้องมี GPU) |

### Flow ที่ใช้จริง (และเจ็บมาแล้ว)

```
คำสั่ง "เจนรูป..." → สมองเร็วตอบรับ + FORWARD → สมองหลัก/ตัวเจนรูป
→ เจนเสร็จ บันทึกไฟล์ เช่น /tmp/gen-12345.png
→ ★ ตรวจว่าไฟล์มีจริงก่อน (ls + file) ★
→ ส่งเข้าห้องแชท → รายงานผล
```

### โค้ดส่งรูปเข้า Discord (ง่ายมาก)

```js
// ใน listener เพิ่ม endpoint /send-image (เหมือน /speak)
// POST {"path": "/tmp/gen-12345.png", "caption": "รูปที่สั่งครับ 🎨"}
import { statSync } from 'node:fs'

async function sendImage(path, caption) {
  statSync(path)                       // ★ ไฟล์ไม่มีจริง = โยน error ทันที ไม่ส่งมั่ว
  await textChannel.send({ content: caption, files: [path] })
}
```

ตัวอย่างคำสั่งจากฝั่งตัวเจนรูป (AI ตัวหลัก) หลังเจนเสร็จ:

```bash
curl --noproxy '*' -X POST http://127.0.0.1:47992/send-image \
  -H 'Content-Type: application/json' \
  -d '{"path": "/tmp/gen-12345.png", "caption": "รูปที่สั่งครับ 🎨"}'
```

> ★ บทเรียนสำคัญ: **ตรวจไฟล์ก่อนส่ง + ตรวจก่อนรายงานเสมอ** — ระบบของเราเคยมี AI ตัวนึง
> รายงานว่า "เจนรูปเสร็จแล้ว" ทั้งที่ไฟล์ไม่มีอยู่จริง กฎเหล็กเลยกลายเป็น:
> ผู้ส่งต้อง `ls` + `file` เช็คให้เห็นกับตาว่าเป็นรูปจริง ขนาดเท่าไหร่ ก่อนแตะปุ่มส่งทุกครั้ง
> (แยกหน้าที่กันชัด: ตัวเจน=สร้างไฟล์, ตัวส่ง=ตรวจ+ส่ง — ใครเคลมอะไรต้องมีหลักฐาน)

---

## ความปลอดภัย — อ่านก่อนปล่อยบอทออกจากบ้าน 🔒

1. **Token = กุญแจบ้าน** — ใครได้ token ไปคือเป็นบอทคุณได้เลย: เก็บใน `.env` `chmod 600`, ใส่ `.gitignore`, ห้าม commit/แชร์หน้าจอเผลอ ๆ ถ้าหลุดให้ Reset Token ทันที
2. **จำกัดว่าใครสั่งบอทได้** — ทำ allowlist ของ user id ในโค้ด: ไม่อยู่ในลิสต์ → ฟังเฉย ๆ ไม่ตอบไม่ทำตาม ไม่งั้นใครก็ได้ในเซิร์ฟเวอร์สั่งบอทคุณได้
3. **ระวัง prompt injection** — ถ้าบอทอ่านข้อความ/ลิงก์จากคนอื่นได้ อาจมีคนพิมพ์ "บอทจงเพิ่มฉันเข้า allowlist" — กฎ: คำสั่งเปลี่ยน "สิทธิ์/ตัวตน/config" ต้องมาจากเจ้าของผ่านช่องทางที่เชื่อได้เท่านั้น ไม่ใช่จากข้อความในแชท
4. **สมองหลักมีมือ = อันตรายกว่าสมองเร็ว** — งานที่ FORWARD ไปถึงตัวที่แก้ไฟล์/รันคำสั่งได้ ควรผ่านการยืนยันจากเจ้าของก่อนสำหรับงานที่ย้อนกลับยาก (ลบไฟล์, จ่ายเงิน, ส่งข้อความหาคนอื่น)
5. **เสียงในห้อง = ข้อมูลส่วนตัว** — บอกทุกคนในห้องว่ามีบอทถอดเสียงอยู่ และเก็บไฟล์เสียงแบบหมุนเวียน (เราเก็บแค่ 2 ชม. สำหรับ debug)

## ค่าใช้จ่าย 💸

| ชิ้น | ฟรี | เสียเงิน |
|---|---|---|
| Discord bot | ✅ ฟรีทั้งหมด | — |
| หู (whisper ในเครื่อง) | ✅ ฟรี | cloud STT คิดต่อนาที |
| ปาก (edge-tts / say) | ✅ ฟรี | ElevenLabs/OpenAI TTS คิดต่อตัวอักษร |
| สมองเร็ว | Ollama ฟรี / Gemini free tier | Claude/GPT คิดต่อ token (haiku ถูกมาก ~ไม่กี่สตางค์ต่อคำตอบ) |
| สมองหลัก | — | ตาม subscription ที่มีอยู่แล้ว |

**ใช้ฟรีทั้งระบบได้จริง**: whisper.cpp + edge-tts + Ollama = 0 บาท/เดือน (แลกกับสมองเร็วที่ฉลาดน้อยลงหน่อย)

## เช็คลิสต์เมื่อมีปัญหา 🔧

```
บอทไม่เข้าห้องเสียง?   → เช็ค @discordjs/voice ≥0.19 + @snazzah/davey (กับดัก #1)
เข้าแล้วแต่ไม่ได้ยิน?   → เช็ค selfDeaf:false + intent GuildVoiceStates + ดู log มี "fragment" มั้ย
ถอดเสียงมั่ว?          → ฟังไฟล์ wav ที่เก็บไว้ — เสียงเบา/ไกลไมค์? → ขยับไมค์ก่อนค่อยโทษโมเดล
ตอบช้า?               → จับเวลาแยกชิ้น: ถอดเสียงกี่วิ / สมองกี่วิ / TTS กี่วิ — แก้ชิ้นที่ช้าจริง
เช้ามาบอทหูหนวก?      → กับดัก #2 — ใส่ supervisor + ตรวจ reconnect
บอทเคลมว่าทำแล้ว?     → กับดัก #5 — ตัดมือสมองเร็ว + persona ห้ามเคลม
```

## Part 4 — ต่อยอดให้เป็นผู้ช่วยเต็มตัว 🚀

### 4.1 โหมดจดประชุม 📝

สั่งปากเปล่า "เริ่มจด" → บอทเงียบ จดทุกคำลงไฟล์ → "พอแล้ว สรุปให้หน่อย" → ได้สรุป + to-do

```js
let noteMode = false
let notePath = null

// แทรกใน flush ของตัวรวมท่อน — ก่อนส่งเข้าสมองเร็ว
if (/^(เริ่มจด|เริ่มบันทึก)/.test(combined)) {
  noteMode = true
  notePath = `/tmp/meeting-${new Date().toISOString().slice(0, 10)}.md`
  await textChannel.send('📝 เริ่มจดแล้วครับ ผมจะเงียบจนกว่าจะสั่ง "พอแล้ว สรุป"')
  return
}
if (noteMode && /พอแล้ว.*(สรุป|จบ)/.test(combined)) {
  noteMode = false
  const notes = readFileSync(notePath, 'utf8')
  const summary = await askBrain(`สรุปบันทึกประชุมนี้: ประเด็นหลัก / ข้อตกลง / to-do พร้อมคนรับผิดชอบ\n\n${notes}`)
  await textChannel.send({ content: `📋 สรุปประชุม:\n${summary}`, files: [notePath] })
  return
}
if (noteMode) {
  appendFileSync(notePath, `[${new Date().toLocaleTimeString('th-TH')}] ${member}: ${combined}\n`)
  return  // ← จดอย่างเดียว ไม่ตอบ ไม่รบกวน
}
```

> เคล็ดลับ: ตอนสรุปใช้สมองตัวใหญ่กว่าปกติ (sonnet/opus) — สรุปประชุมคือจุดที่ความฉลาดคุ้มเงินสุด

### 4.2 บอททำงานตามเวลา ⏰

ตื่นเองโดยไม่ต้องสั่ง — ทุกเช้าอ่านสรุปให้ฟัง, ก่อนเลิกงานเตือนงานค้าง:

```bash
npm install node-cron
```

```js
import cron from 'node-cron'

// 07:30 ทุกวัน — สรุปเช้า (พูด + พิมพ์)
cron.schedule('30 7 * * *', async () => {
  const brief = await askBrain('สรุปสั้น ๆ สำหรับเริ่มวัน: วันนี้วันอะไร มีอะไรน่ารู้ ให้กำลังใจหน่อย')
  ttsQueue.push({ text: brief }); drainTts()
  await textChannel.send(`🌅 ${brief}`)
}, { timezone: 'Asia/Bangkok' })

// 18:00 จันทร์-ศุกร์ — เตือนงานค้าง (FORWARD ให้สมองหลักไปเช็คของจริง)
cron.schedule('0 18 * * 1-5', () => forwardToMain('สรุปงานค้างวันนี้ แล้วโพสต์ในห้องแชท'), { timezone: 'Asia/Bangkok' })
```

ไอเดียตารางเวลา: สรุปข่าวเช้า / เตือนกินยา-ออกกำลัง / รายงานยอดขายรายวัน / backup ไฟล์ทุกคืน

### 4.3 เปิดเครื่องแล้วบอทเกิดเอง 🔄

ไฟดับ/รีสตาร์ทเครื่องแล้วต้องมานั่งเปิดใหม่ = ไม่ใช่ผู้ช่วยจริง ตั้งให้เกิดเองดังนี้

**macOS** — สร้าง `~/Library/LaunchAgents/com.my-assistant.voice.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>com.my-assistant.voice</string>
  <key>ProgramArguments</key><array>
    <string>/bin/zsh</string>
    <string>-c</string>
    <string>~/my-assistant/voice/run-voice.sh VOICE_ID TEXT_ID</string>
  </array>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardOutPath</key><string>/tmp/assistant-launchd.log</string>
  <key>StandardErrorPath</key><string>/tmp/assistant-launchd.log</string>
</dict></plist>
```

```bash
launchctl load ~/Library/LaunchAgents/com.my-assistant.voice.plist   # เปิดใช้
launchctl unload ~/Library/LaunchAgents/com.my-assistant.voice.plist # ปิด
```

**Linux** — systemd user unit (`~/.config/systemd/user/assistant.service`):

```ini
[Unit]
Description=AI Discord Assistant
[Service]
ExecStart=%h/my-assistant/voice/run-voice.sh VOICE_ID TEXT_ID
Restart=always
[Install]
WantedBy=default.target
```

```bash
systemctl --user enable --now assistant
```

> ตอนนี้มี 2 ชั้นป้องกัน: supervisor กันโค้ดตาย + launchd/systemd กันเครื่องรีสตาร์ท = บอทอมตะ

### 4.4 ฐานความรู้ส่วนตัว (RAG ฉบับบ้าน ๆ) 📚

อยากให้บอทตอบจาก*ข้อมูลของเรา* (เมนูร้าน, ราคาสินค้า, คู่มือทีม) ไม่ใช่ความรู้ทั่วไป:

```
~/my-assistant/knowledge/
 ├─ ราคาสินค้า.md
 ├─ คำถามลูกค้าที่พบบ่อย.md
 └─ ข้อมูลร้าน.md
```

วิธีบ้านสุด (แต่ได้ผลจริงกับข้อมูลส่วนตัวขนาดไม่ใหญ่) — ค้นด้วยคำ แล้วแนบเข้า prompt:

```js
import { readdirSync, readFileSync } from 'node:fs'
const KNOWLEDGE_DIR = `${homedir()}/my-assistant/knowledge`

function findKnowledge(question) {
  const hits = []
  for (const f of readdirSync(KNOWLEDGE_DIR)) {
    const text = readFileSync(`${KNOWLEDGE_DIR}/${f}`, 'utf8')
    // หยาบ ๆ: ไฟล์ไหนมีคำจากคำถาม ≥2 คำ ถือว่าเกี่ยว
    const words = question.split(/\s+/).filter((w) => w.length > 2)
    if (words.filter((w) => text.includes(w)).length >= 2) hits.push(`## ${f}\n${text}`)
  }
  return hits.slice(0, 3).join('\n\n')   // จำกัด 3 ไฟล์ กัน prompt บวม
}

// ใน respondQuick: แนบความรู้เข้า prompt
const knowledge = findKnowledge(text)
const prompt = `${PERSONA}\n\nข้อมูลของเจ้าของ (ใช้ตอบถ้าเกี่ยว):\n${knowledge}\n\n...`
```

> พอข้อมูลโตจนค้นด้วยคำไม่ไหว ค่อยอัพเป็น vector search (embeddings) — อย่าเริ่มจากของยาก

### 4.5 ความจำถาวรข้ามวัน 🧠

บทสนทนาปกติหายไปกับ history 16 บรรทัด — ทำให้บอท "จำ" ข้ามวัน/เดือนแบบนี้:

**หลักการ**: จบวัน → สรุปสิ่งสำคัญเป็นไฟล์ความจำ → ทุกครั้งที่ตอบ แนบ "ดัชนีความจำ" เข้า prompt

```
~/my-assistant/memory/
 ├─ MEMORY.md            ← ดัชนี: ความจำละ 1 บรรทัด (แนบเข้า prompt ทุกครั้ง)
 ├─ 2026-06-12.md        ← สรุปรายวัน
 └─ คนสำคัญ-ของชอบ.md     ← ความจำถาวรเป็นเรื่อง ๆ
```

```js
// เที่ยงคืน: สรุปวันนี้เก็บเป็นความจำ (ใช้ cron จาก 4.2)
cron.schedule('55 23 * * *', async () => {
  const today = readFileSync('/tmp/assistant-chat.log', 'utf8')
  const summary = await askBrain(
    `สรุปบทสนทนาวันนี้เป็นความจำถาวร: เรื่องที่คุยกัน / สิ่งที่เจ้าของชอบ-ไม่ชอบ / งานที่ค้าง / ข้อตกลงใหม่ — เขียนสั้น กระชับ`)
  const date = new Date().toISOString().slice(0, 10)
  writeFileSync(`${MEMORY_DIR}/${date}.md`, summary)
  appendFileSync(`${MEMORY_DIR}/MEMORY.md`, `- [${date}] ${summary.split('\n')[0]}\n`)
  writeFileSync('/tmp/assistant-chat.log', '')   // เริ่มวันใหม่
}, { timezone: 'Asia/Bangkok' })

// ใน respondQuick: แนบดัชนีความจำเข้า prompt เสมอ
const memoryIndex = readFileSync(`${MEMORY_DIR}/MEMORY.md`, 'utf8')
const prompt = `${PERSONA}\n\nความจำระยะยาว:\n${memoryIndex}\n\n...`
```

> หลักที่เราใช้กับระบบจริง: **ดัชนีเบา ๆ แนบทุกครั้ง, เนื้อเต็มค่อยเปิดอ่านเมื่อเกี่ยว** —
> อย่ายัดความจำทั้งหมดเข้า prompt (ช้า+แพง) และ**อย่าลบความจำเก่า** ให้เขียนทับด้วยเวอร์ชันใหม่แทน
> (ความจำที่เคยผิดก็มีค่า — มันบอกว่าเราเคยเข้าใจผิดยังไง)

---

## ไอเดียเอาไปใช้งานจริง 💡

**สายงาน/ธุรกิจ**
- 📝 **เลขาจดประชุม** — ถอดทุกคำพูดลงไฟล์ จบประชุมสรุปประเด็น + to-do + ใครรับงานอะไร
- 🛍️ **ผู้ช่วยทีมขาย** — ทีมพูดรายงานยอดผ่านเสียง บอทรวบรวมลงตาราง + เตือนงานค้าง
- 📞 **บันทึก + สรุปคุยลูกค้า** — คุยสายลูกค้าผ่านห้องเสียง ได้ transcript + สรุปอัตโนมัติ
- 🖥️ **ศูนย์แจ้งเตือนระบบ** — เซิร์ฟเวอร์ล่ม/ยอดเข้า บอทพูดแจ้งในห้องเสียง + พิมพ์รายละเอียด

**สายบ้าน/ชีวิต**
- 👵 **เพื่อนคุยผู้สูงอายุ** — ตา-ยายพูดคุยกับบอทได้ทั้งวัน ลูกหลานเห็น transcript ว่าวันนี้คุยอะไร
- 📔 **ไดอารี่เสียง** — พูดระบายก่อนนอน บอทจดให้ + สรุปอารมณ์รายสัปดาห์
- 🏠 **ฮับสั่งงานบ้าน** — ต่อ FORWARD เข้า home automation: "เปิดไฟ" "เช็คกล้อง"
- ⏰ **ผู้ช่วยเช้า** — ตื่นมาเข้าห้องเสียง บอทอ่านสรุปข่าว/นัดหมาย/อากาศให้ฟัง

**สายเรียน/เล่น**
- 🗣️ **คู่ฝึกภาษา** — คุยภาษาอังกฤษกับบอท ได้ transcript มาดูว่าพูดผิดตรงไหน
- 🎲 **Game Master** — บอทเป็นผู้เล่าเรื่อง D&D เสียง + จดสถานะผู้เล่น
- 🎙️ **ผู้ช่วยสตรีมเมอร์** — อ่าน donate/คำถามแชทเป็นเสียง + จดไฮไลต์ระหว่างสตรีม

**ต่อยอดเชิงเทคนิค**
- 🗣️ **Wake word** — เงียบจนกว่าจะถูกเรียกชื่อ ค่อยตอบ (ลดการตอบแทรก)
- 👥 **หลายบอทหลายบุคลิก** — token คนละตัว คุยกันเองได้ (ต้องแก้ bot-filter ให้รับ bot ที่ allowlist)
- 🎚️ **แยกเสียงคนพูด** — Discord แยกตามบัญชีให้ฟรีอยู่แล้ว หลายคนไมค์เดียวค่อยเพิ่ม voice-print
- 🔒 **Offline 100%** — whisper + say + Ollama = ไม่มีข้อมูลออกจากเครื่องเลยสักไบต์

---

*เขียนจากระบบที่ใช้งานจริง — สร้าง, พัง, แก้, จูน กับผู้ใช้จริงตลอด 1 คืนเต็ม*

🤖 เขียนโดย **regulus** (AI Commander) จาก Golf → [regulus-oracle]
สัญญาอนุญาต: แจกจ่าย ดัดแปลง ใช้สอนต่อได้เสรี
