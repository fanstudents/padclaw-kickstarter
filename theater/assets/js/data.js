/* ══════════════════════════════════════════════════════════════
   PadClaw OS — data.js
   全部為示範資料（demo data）。介面雙語：L(en, zh)
   ══════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  const L = (en, zh) => ({ en, zh });

  /* ── 主導覽 ── */
  const TABS = [
    { id: "home", label: L("Home", "首頁") },
    { id: "store", label: L("Store", "商城") },
    { id: "family", label: L("Family", "家庭") },
    { id: "channels", label: L("Channels", "場景") },
    { id: "settings", label: L("Settings", "設定") },
  ];

  /* ── 設定：使用額度 + 細節設定 ── */
  const SETTINGS = {
    plan: {
      name: L("PadClaw Care — Family", "PadClaw Care — 家庭方案"),
      price: L("$14 / month · 5 people", "每月 $14 · 5 人"),
      renew: L("Renews June 24", "6 月 24 日續約"),
      badge: L("Founding backer — locked for life", "創始贊助者 · 終身鎖定原價"),
    },
    /* 額度：私有雲推論以「請求」計費，本機推論不計費（這是產品的賣點） */
    quota: {
      label: L("Private-cloud requests", "自有機房請求數"),
      used: 2176, total: 5000,
      note: L("Resets in 9 days. On-device requests are unlimited and always free.",
              "9 天後重置。本機處理的請求無上限，而且永遠免費。"),
      split: [
        { k: L("On device", "本機處理"), v: 78, c: "#05CE78",
          s: L("Wake word, reminders, check-ins, timers", "喚醒詞、提醒、簽到、計時") },
        { k: L("PadClaw private cloud", "PadClaw 自有機房"), v: 22, c: "#4A8FD4",
          s: L("Long reasoning, chart maths, translation", "長推理、星盤運算、翻譯") },
        { k: L("Third-party AI", "第三方 AI"), v: 0, c: "#5B6472",
          s: L("Never — no data leaves to outside models", "從不使用 — 資料不會流向外部模型") },
      ],
      byChannel: [
        { k: L("Horoscope", "命理"), v: 720, c: "#E0A94B" },
        { k: L("Learning", "學習"), v: 610, c: "#B47CF0" },
        { k: L("Weather", "天氣"), v: 330, c: "#4A8FD4" },
        { k: L("Local News", "在地新聞"), v: 240, c: "#D98E5A" },
        { k: L("Health", "健康"), v: 180, c: "#05CE78" },
        { k: L("Markets", "股市"), v: 96, c: "#5BC0BE" },
      ],
      recent: [
        { t: "9:38", c: L("Horoscope", "命理"), col: "#E0A94B", w: L("Computed today's chart for Leo", "運算今日獅子座星盤"), where: L("Private cloud", "自有機房") },
        { t: "8:15", c: L("Health", "健康"), col: "#05CE78", w: L("Marked Metformin as taken", "標記 Metformin 已服用"), where: L("On device", "本機") },
        { t: "8:02", c: L("Weather", "天氣"), col: "#4A8FD4", w: L("Turned the forecast into a leave-by time", "把預報換算成出門時間"), where: L("Private cloud", "自有機房") },
        { t: "7:44", c: L("Learning", "學習"), col: "#B47CF0", w: L("Re-taught 7×8 a different way", "換一種講法重教 7×8"), where: L("Private cloud", "自有機房") },
      ],
      meters: [
        { k: L("Device storage", "裝置儲存"), used: L("41 GB", "41 GB"), total: L("128 GB", "128 GB"), pct: 32 },
        { k: L("Voice minutes", "語音時數"), used: L("3 h 12 m", "3 小時 12 分"), total: L("Unlimited", "無上限"), pct: 18 },
        { k: L("Family seats", "家庭席次"), used: L("5", "5"), total: L("5", "5"), pct: 100 },
      ],
    },
    /* Kickstarter 創始贊助者特權 */
    founder: {
      badge: L("Kickstarter founding backer", "Kickstarter 創始贊助者"),
      unit: L("Founding unit No. 0117 of 3,000", "創始機 No. 0117 / 3,000"),
      origin: L("Designed for your home · Made in Taiwan", "為你的家而設計 · 台灣製造"),
      title: L("6 months of PadClaw Care, on us", "PadClaw Care 六個月，我們請客"),
      body: L("Your $500 pledge includes six months of the Family plan — all five seats, unlimited " +
              "on-device AI, and up to 5,000 private-cloud requests each month. Nothing is charged " +
              "until it ends, and the device keeps working forever either way.",
              "你 $500 的贊助包含六個月的家庭方案——五個席次、本機 AI 無上限、每月最多 5,000 次自有機房請求。" +
              "到期前不會扣任何款，而且無論你續不續約，這台裝置都能一直用下去。"),
      used: 1, total: 6,
      until: L("Free through November 24, 2026", "免費至 2026 年 11 月 24 日"),
      perks: [
        L("Founding price locked for life — $14/mo if you ever renew", "創始價終身鎖定——日後續約也是每月 $14"),
        L("Every new channel free, forever, over the air", "未來所有新頻道終身免費，OTA 直接更新"),
        L("Backer-only: vote on which channel we build next", "贊助者專屬：投票決定我們下一個做哪個頻道"),
      ],
      note: L("No auto-renew. We'll ask you 14 days before it ends.", "不自動續約。到期前 14 天我們會先問你。"),
    },

    /* 自訂 AI 串接：預設走 PadClaw，也可以自己接 */
    providers: {
      title: L("Which AI does the thinking", "由誰來做推理"),
      sub: L("PadClaw AI is the default and needs no setup. If you'd rather use your own account, " +
             "bring your key — sensitive tasks still stay on PadClaw unless you turn that off.",
             "預設就是 PadClaw AI，不用設定。如果你想用自己的帳號，把金鑰帶進來就好——" +
             "除非你另外關掉，敏感任務仍然一律留在 PadClaw。"),
      list: [
        { id: "padclaw", brand: "padclaw", name: L("PadClaw AI", "PadClaw AI"),
          s: L("Our own racks in Oregon. Included in your plan.", "我們在奧勒岡的自有機房。方案已包含。"),
          state: "default", meta: L("No key needed", "不需要金鑰") },
        { id: "openai", brand: "openai", name: L("OpenAI", "OpenAI"),
          s: L("GPT models via your own API key.", "用你自己的 API 金鑰接 GPT 模型。"),
          state: "byok", meta: L("sk-…", "sk-…") },
        { id: "gemini", brand: "gemini", name: L("Google Gemini", "Google Gemini"),
          s: L("Gemini models via Google AI Studio.", "透過 Google AI Studio 接 Gemini。"),
          state: "byok", meta: L("AIza…", "AIza…") },
        { id: "claude", brand: "claude", name: L("Anthropic Claude", "Anthropic Claude"),
          s: L("Claude models via your Anthropic key.", "用你的 Anthropic 金鑰接 Claude。"),
          state: "byok", meta: L("sk-ant-…", "sk-ant-…") },
        { id: "local", brand: "local", name: L("On this device only", "只用這台裝置"),
          s: L("Slower, smaller, but nothing ever leaves the room.", "比較慢、比較小，但什麼都不會離開這個房間。"),
          state: "offline", meta: L("No network", "不連網") },
      ],
      keyLabel: L("API key", "API 金鑰"),
      keyPlaceholder: L("Paste your key — stored in the secure element, never sent to us",
                        "貼上你的金鑰——存進安全晶片，永遠不會送到我們這裡"),
      save: L("Connect", "連接"),
      demoNote: L("Demo only — this field is not wired to anything and stores nothing.",
                  "純示範——這個欄位沒有接任何東西，也不會儲存任何內容。"),
      guard: L("Sensitive tasks still use PadClaw AI", "敏感任務仍然走 PadClaw AI"),
      guardS: L("Health, money and family messages never go to a third-party model.",
                "健康、金錢與家人訊息，永遠不會送到第三方模型。"),
    },

    groups: [
      {
        title: L("Privacy & routing", "隱私與路由"), icon: "shield",
        rows: [
          { t: L("Sensitive tasks only use PadClaw AI", "敏感任務一律走 PadClaw AI"),
            s: L("Health, money, family messages. On by default.", "健康、金錢、家人訊息。預設開啟。"), on: true, lock: true },
          { t: L("Ask before every outward action", "每個對外動作都先問過我"),
            s: L("Ordering, sending, booking, posting", "下單、寄送、預約、發文"), on: true },
          { t: L("Keep a log of everything it did", "保留所有動作的完整紀錄"),
            s: L("Stored on device · 90 days", "存在本機 · 保留 90 天"), on: true },
          { t: L("Share anonymous diagnostics", "分享匿名診斷資料"),
            s: L("Helps us fix crashes. Off by default.", "幫助我們修 bug。預設關閉。"), on: false },
        ],
      },
      {
        title: L("The screen", "螢幕"), icon: "sun",
        rows: [
          { t: L("Night mode after sunset", "日落後自動夜間模式"),
            s: L("Dims to 30%, warms the whites", "降到 30% 亮度，白色轉暖"), on: true },
          { t: L("Larger text everywhere", "全系統放大字級"),
            s: L("Body text 24pt · readable from the doorway", "本文 24pt · 站在玄關也讀得到"), on: true },
          { t: L("Photo screensaver when idle", "待機時顯示照片"),
            s: L("Local album only", "只讀本機相簿"), on: true },
          { t: L("Show the tab bar", "顯示頂部分頁列"),
            s: L("Off makes it a single-purpose display", "關閉後就是一台單一用途的顯示器"), on: true },
        ],
      },
      {
        title: L("Voice & reminders", "語音與提醒"), icon: "bell",
        rows: [
          { t: L("Cross-room listening", "跨房間收音"),
            s: L("Tuned for speech from 4 m away", "為 4 公尺外的說話聲調校"), on: true },
          { t: L("Speak reminders out loud", "用語音念出提醒"),
            s: L("Twice, gently, before telling anyone", "溫和地提醒兩次，才會通知別人"), on: true },
          { t: L("Quiet hours 9:30 PM – 7:00 AM", "安靜時段 21:30 – 07:00"),
            s: L("Nothing speaks unless you ask", "除非你開口，否則不出聲"), on: true },
          { t: L("Wake word", "喚醒詞"), s: L("“Hey PadClaw” · processed on device", "「Hey PadClaw」· 在本機辨識"), on: true },
        ],
      },
      {
        title: L("Updates & device", "更新與裝置"), icon: "grid",
        rows: [
          { t: L("Free over-the-air channel updates", "OTA 免費頻道更新"),
            s: L("New channels arrive without new hardware", "新頻道不必換機"), on: true },
          { t: L("Install updates overnight", "夜間自動安裝更新"),
            s: L("Only while charging and idle", "只在充電且閒置時"), on: true },
          { t: L("Android app compatibility", "Android App 相容"),
            s: L("It is also a full Android tablet", "它同時是一台完整的 Android 平板"), on: true },
        ],
      },
    ],
    device: [
      { k: L("Model", "型號"), v: "PadClaw One · 12.4”" },
      { k: L("Software", "系統版本"), v: "PadClaw OS 1.4.2" },
      { k: L("Secure element", "安全晶片"), v: L("Active · keys never leave", "運作中 · 金鑰永不離開") },
      { k: L("Made in", "產地"), v: L("Taiwan 🇹🇼 · Batch 1 of 3,000", "台灣 🇹🇼 · 首批 3,000 台") },
      { k: L("Serial", "序號"), v: "PC1-8842-0117" },
    ],
    danger: {
      t: L("Delete all my data", "刪除我的所有資料"),
      s: L("Wipes this device and our servers at the same time. Cannot be undone.",
           "同時清除本機與伺服器上的資料。此動作無法復原。"),
      btn: L("Delete everything", "全部刪除"),
    },
  };

  /* ── 四大場景頻道 ── */
  const CHANNELS = [
    {
      id: "weather", art: "weather", color: "#4A8FD4", icon: "cloudRain",
      hero: "assets/img/hero/weather.jpg", heroPos: "center 48%", clip: "wx-brief",
      name: L("Weather", "天氣"),
      title: L("Morning Briefing", "晨間簡報"),
      tagline: L("Not the forecast. The decision.", "不給你數字，給你決定"),
      desc: L("Rain at 8 AM — take an umbrella. Leave by 8:10.",
              "早上 8 點會下雨——記得帶傘，8:10 前出門。"),
      meta: L("Seattle, WA · Updated 2 min ago", "西雅圖 · 2 分鐘前更新"),
    },
    {
      id: "learning", art: "learning", color: "#B47CF0", icon: "book",
      hero: "assets/img/hero/learning.jpg", heroPos: "center 55%", clip: "le-continue",
      name: L("Learning", "學習"),
      title: L("Family Learning", "家庭學堂"),
      tagline: L("Ten minutes. Then it says goodbye.", "十分鐘一節，做完就說再見"),
      desc: L("Chloe is 72% through Multiplication — Level 3.",
              "Chloe 的乘法 Level 3 已完成 72%。"),
      meta: L("2 learners · Parent view on", "2 位學習者 · 家長報表已開啟"),
    },
    {
      id: "horoscope", art: "horoscope", color: "#E0A94B", icon: "sparkle",
      hero: "assets/img/hero/horoscope.jpg", heroPos: "center 58%", heroFlip: true, clip: "ho-today",
      name: L("Horoscope", "命理"),
      title: L("Today for Leo", "今日 · 獅子座"),
      tagline: L("Computed from your real birth chart.", "以真實本命盤運算，不是罐頭運勢"),
      desc: L("A good day to negotiate. Say the number first.",
              "適合談判的一天——先開口說出數字。"),
      meta: L("May 24 · Leo season · 2 min read", "5 月 24 日 · 獅子座節氣 · 2 分鐘"),
    },
    {
      id: "health", art: "health", color: "#05CE78", icon: "heart",
      hero: "assets/img/hero/health.jpg", heroPos: "center 55%", clip: "he-done",
      name: L("Health", "健康"),
      title: L("Family Health", "家庭健康"),
      tagline: L("One button. Your daughter stops worrying.", "按一下，女兒就放心了"),
      desc: L("3 medications this morning · Check-in not done yet.",
              "今早 3 項用藥 · 今日尚未簽到。"),
      meta: L("Reminders only · Not a medical device", "僅提供提醒 · 非醫療器材"),
    },
    {
      id: "news", art: "news", color: "#D98E5A", icon: "book",
      hero: "assets/img/hero/news.jpg", heroPos: "center 52%", clip: "nw-brief",
      name: L("Local News", "在地新聞"),
      title: L("Near You Today", "今天，你家附近"),
      tagline: L("Three things on your street. Then it stops.", "只講你這條街上的三件事，講完就停"),
      desc: L("Fremont Bridge closed till noon · Market moves indoors Saturday.",
              "Fremont 大橋中午前封閉 · 週六市集改到室內。"),
      meta: L("Seattle · 3 stories · 90 seconds", "西雅圖 · 3 則 · 90 秒"),
    },
    {
      id: "market", art: "market", color: "#5BC0BE", icon: "chart",
      hero: "assets/img/hero/market.jpg", heroPos: "center 55%", clip: "mk-brief",
      name: L("Markets", "股市"),
      title: L("Markets Today", "今日行情"),
      tagline: L("A glance, not a habit.", "看一眼就好，別養成習慣"),
      desc: L("S&P +0.4% · Your account +$61 today.", "標普 +0.4% · 你的帳戶今天 +$61。"),
      meta: L("Closed 4:00 PM ET · Delayed 15 min", "美東 16:00 收盤 · 延遲 15 分鐘"),
    },
  ];

  /* ── 首頁 Billboard 輪播 ── */
  const BILLBOARDS = [
    {
      channel: "weather", label: L("Featured now", "此刻推薦"),
      title: L("Rain at 8 AM.\nTake an umbrella.", "早上 8 點會下雨\n記得帶傘"),
      desc: L("54° and grey in Seattle. Your 9:30 across town means leaving by 8:10 — the bridge is slow in rain.",
              "西雅圖 54 度、陰雨。9:30 的行程在城另一邊，8:10 前出門——下雨天橋上會塞。"),
      meta: [L("Weather", "天氣"), L("Updated 2 min ago", "2 分鐘前更新"), L("1 min", "1 分鐘")],
      cta: L("Open briefing", "打開簡報"), cta2: L("Read aloud", "念給我聽"),
    },
    {
      channel: "horoscope", label: L("Today for you", "今日為你"),
      title: L("Leo, say the\nnumber first.", "獅子座\n今天先開口"),
      desc: L("Mercury clears your 3rd house at noon. Career reads strong; the conversation you've been putting off goes better than you think.",
              "水星正午行經你的第三宮。事業運強；那個一直拖著的對話，會比你想的順利。"),
      meta: [L("Horoscope", "命理"), L("May 24 · Leo season", "5 月 24 日 · 獅子座節氣"), L("2 min read", "2 分鐘")],
      cta: L("Read today", "閱讀今日"), cta2: L("Ask a question", "問一個問題"),
    },
    {
      channel: "health", label: L("Continue", "繼續"),
      title: L("Good morning,\nBarbara.", "早安\nBarbara"),
      desc: L("Three medications this morning, then one button. Emily will see you're OK — that's the whole thing.",
              "今早三項用藥，然後按一顆按鈕。Emily 就知道你一切都好——就這麼簡單。"),
      meta: [L("Family Health", "家庭健康"), L("3 items", "3 個項目"), L("Not a medical device", "非醫療器材")],
      cta: L("Start check-in", "開始簽到"), cta2: L("Not now", "待會兒"),
    },
    {
      channel: "learning", label: L("Continue learning", "繼續學習"),
      title: L("Chloe left off at\nMultiplication, L3.", "Chloe 上次停在\n乘法 Level 3"),
      desc: L("Ten questions, then it says goodbye. No ads, no autoplay, no algorithm deciding what comes next.",
              "十題做完就說再見。沒有廣告、沒有自動續播、沒有演算法幫她決定下一步。"),
      meta: [L("Learning", "學習"), L("72% complete", "已完成 72%"), L("10 min", "10 分鐘")],
      cta: L("Continue", "繼續"), cta2: L("Parent view", "家長報表"),
    },
  ];

  /* ── 首頁卡列 ── */
  const CONTINUE = [
    { id: "c1", channel: "learning", pal: "violet", title: L("Multiplication · L3", "乘法 · Level 3"), sub: L("Chloe · 7 of 10", "Chloe · 第 7 / 10 題"), progress: 72, cap: L("Ten questions a session. Adaptive difficulty.", "一節十題，難度自動調整。") },
    { id: "c2", channel: "horoscope", pal: "amber", title: L("Your birth chart", "你的本命盤"), sub: L("Barbara · Leo rising", "Barbara · 獅子上升"), progress: 100, cap: L("Entered once. Used every morning.", "填一次，之後每天早上都用得到。") },
    { id: "c3", channel: "health", pal: "green", title: L("Weekly report", "每週報表"), sub: L("Shared with Emily", "已分享給 Emily"), progress: 100, cap: L("Six days of check-ins, ready for the doctor.", "六天的簽到紀錄，回診時可直接拿出來。") },
    { id: "c4", channel: "weather", pal: "blue", title: L("Tomorrow at a glance", "明天一張卡看完"), sub: L("Night mode · 9:30 PM", "夜間模式 · 晚上 9:30"), progress: 40, cap: L("Weather, first appointment, one thing to remember.", "天氣、第一個行程、要記得的一件事。") },
    { id: "c5", channel: "learning", pal: "rose", title: L("Spanish · Greetings", "西班牙文 · 問候"), sub: L("Marcus · 4 day streak", "Marcus · 連續 4 天"), progress: 55, cap: L("Speak it out loud — that's the hard part.", "開口說出來——那才是難的部分。") },
  ];

  const SOON = [
    { id: "s1", pal: "teal", title: L("Recipe Coach", "食譜教練"), sub: L("Cook along, hands free", "免動手，跟著做"), cap: L("Free OTA update · Fall 2026", "OTA 免費更新 · 2026 秋") },
    { id: "s2", pal: "slate", title: L("Home Guardian", "居家守護"), sub: L("Doors, lights, quiet hours", "門窗、燈光、安靜時段"), cap: L("Free OTA update · Winter 2026", "OTA 免費更新 · 2026 冬") },
    { id: "s3", pal: "rose", title: L("Memory Lane", "回憶長廊"), sub: L("Photos that ask questions", "會提問的老照片"), cap: L("In research · voted #1 by backers", "研究中 · 贊助者票選第一") },
    { id: "s4", pal: "amber", title: L("Faith & Reflection", "信仰與省思"), sub: L("A quiet page each morning", "每天早晨安靜的一頁"), cap: L("Free OTA update · 2027", "OTA 免費更新 · 2027") },
    { id: "s5", pal: "blue", title: L("Travel Day", "出遊日"), sub: L("Gate, weather, what to pack", "登機門、天氣、要帶什麼"), cap: L("Free OTA update · 2027", "OTA 免費更新 · 2027") },
  ];

  /* ── 商城 ── */
  const STORE_TABS = [
    { id: "scenes", label: L("Scenes", "場景"), sub: L("Whole experiences that take over the screen — a morning, an evening, a ritual.", "接管整個畫面的完整體驗——一個早晨、一個夜晚、一段儀式。") },
    { id: "skills", label: L("Skills", "技能"), sub: L("Things your assistant learns to do. Every outward action still asks you first.", "讓助理學會做的事。每個對外動作，都會先問過你。") },
    { id: "apps", label: L("Apps", "應用"), sub: L("It is also a full Android tablet. Your usual apps, sized for the room.", "它同時是一台完整的 Android 平板。你熟悉的 App，放大到整個房間看得見。") },
  ];

  const STORE = {
    scenes: [
      { id: "sc1", pal: "blue", icon: "cloudRain", hero: "assets/img/hero/weather.jpg", t: L("Morning Briefing", "晨間簡報"), d: L("Weather translated into what to wear and when to leave.", "把預報翻譯成穿什麼、幾點出門。"), m: L("PadClaw · 12 MB", "PadClaw · 12 MB"), price: "own", r: 4.9 },
      { id: "sc2", pal: "green", icon: "heart", hero: "assets/img/hero/health.jpg", t: L("Family Health", "家庭健康"), d: L("Medication reminders, one-button check-in, weekly report.", "用藥提醒、一鍵簽到、每週報表。"), m: L("PadClaw · 18 MB", "PadClaw · 18 MB"), price: "own", r: 4.8 },
      { id: "sc3", pal: "amber", icon: "sparkle", hero: "assets/img/hero/horoscope.jpg", t: L("Horoscope", "命理"), d: L("A real chart, computed daily. Ask it why.", "真實星盤每日運算，還能追問為什麼。"), m: L("PadClaw · 9 MB", "PadClaw · 9 MB"), price: "own", r: 4.7 },
      { id: "sc4", pal: "violet", icon: "book", hero: "assets/img/hero/learning.jpg", t: L("Learning", "學習"), d: L("Ten-minute sessions with a transparent parent report.", "十分鐘一節，家長報表全透明。"), m: L("PadClaw · 24 MB", "PadClaw · 24 MB"), price: "own", r: 4.9 },
      { id: "sc5", pal: "teal", icon: "sun", hero: "assets/img/hero/evening.jpg", t: L("Evening Wind-down", "夜晚收尾"), d: L("Tomorrow on one card, then the screen goes dark.", "明天一張卡看完，然後螢幕自動全暗。"), m: L("PadClaw · 7 MB", "PadClaw · 7 MB"), price: "free", r: 4.6 },
      { id: "sc6", pal: "rose", icon: "music", hero: "assets/img/hero/radio.jpg", t: L("Kitchen Radio", "廚房電台"), d: L("Big buttons, three stations, nothing else on screen.", "大按鈕、三個電台，畫面上再無其他。"), m: L("Lumen Labs · 15 MB", "Lumen Labs · 15 MB"), price: "free", r: 4.4 },
      { id: "sc7", pal: "slate", icon: "shield", hero: "assets/img/hero/guardian.jpg", t: L("Quiet Guardian", "安靜守護"), d: L("Checks the doors at night. Says nothing unless it matters.", "夜裡巡一次門窗；沒事就不出聲。"), m: L("Northgate · 22 MB", "Northgate · 22 MB"), price: "$4.99", r: 4.5 },
      { id: "sc8", pal: "blue", icon: "globe", t: L("Sunday Call", "週日通話"), d: L("The family video call, started by saying hello.", "說一聲哈囉就開始的家庭視訊。"), m: L("PadClaw · 11 MB", "PadClaw · 11 MB"), price: "free", r: 4.8 },
    ],
    skills: [
      { id: "sk1", pal: "green", icon: "bag", t: L("Grocery Ordering", "生鮮下單"), d: L("Builds the cart. You approve before anything is bought.", "幫你把購物車備好；下單前一定先問過你。"), m: L("Approval required", "需經同意閘門"), price: "own", r: 4.7 },
      { id: "sk2", pal: "blue", icon: "calendar", t: L("Appointment Booking", "預約掛號"), d: L("Calls, waits on hold, hands you the time slots.", "幫你打電話、等待轉接，把時段拿回來給你選。"), m: L("Approval required", "需經同意閘門"), price: "$2.99", r: 4.6 },
      { id: "sk3", pal: "teal", icon: "pill", t: L("Prescription Refill", "處方續領"), d: L("Notices you're running low, drafts the refill.", "發現快吃完了，先把續領單擬好。"), m: L("Approval required", "需經同意閘門"), price: "free", r: 4.8 },
      { id: "sk4", pal: "rose", icon: "speak", t: L("Language Tutor", "語言家教"), d: L("Conversation practice. It waits while you find the word.", "對話練習——你在想單字時，它會等你。"), m: L("On-device speech", "語音在本機處理"), price: "own", r: 4.9 },
      { id: "sk5", pal: "violet", icon: "moon", t: L("Bedtime Stories", "睡前故事"), d: L("Reads aloud with the grandkids' names in it.", "念故事給孫子聽，故事裡有他們的名字。"), m: L("Lumen Labs", "Lumen Labs"), price: "$3.99", r: 4.9 },
      { id: "sk6", pal: "amber", icon: "bell", t: L("Missed Check-in Alert", "簽到未完成提醒"), d: L("Reminds you twice by voice before telling family.", "先用語音提醒你兩次，仍無回應才通知家人。"), m: L("PadClaw", "PadClaw"), price: "own", r: 4.7 },
      { id: "sk7", pal: "slate", icon: "chart", t: L("Bill Watch", "帳單看守"), d: L("Flags a bill that jumped. Never pays anything itself.", "帳單忽然變高會提醒你；它自己從不付款。"), m: L("Read-only access", "唯讀存取"), price: "free", r: 4.5 },
      { id: "sk8", pal: "green", icon: "camera", t: L("Photo Slideshow", "照片輪播"), d: L("Turns the idle screen into the family album.", "待機時把螢幕變成家庭相簿。"), m: L("Local photos only", "僅讀取本機照片"), price: "free", r: 4.6 },
    ],
    apps: [
      { id: "ap1", pal: "blue", icon: "camera", t: L("Video Call", "視訊通話"), d: L("Answer by saying hello. No passwords, no app switching.", "說哈囉就接通。不用密碼、不用切換 App。"), m: L("PadClaw · 40 MB", "PadClaw · 40 MB"), price: "own", r: 4.8 },
      { id: "ap2", pal: "rose", icon: "music", t: L("Music", "音樂"), d: L("Three playlists, one giant play button.", "三個播放清單，一顆超大播放鍵。"), m: L("Android · 62 MB", "Android · 62 MB"), price: "free", r: 4.5 },
      { id: "ap3", pal: "amber", icon: "star", t: L("Photos", "照片"), d: L("Everything stays on the device unless you share it.", "除非你分享，照片永遠留在裝置上。"), m: L("Android · 55 MB", "Android · 55 MB"), price: "own", r: 4.7 },
      { id: "ap4", pal: "slate", icon: "book", t: L("News Digest", "新聞摘要"), d: L("Six headlines a day. It stops when it's done.", "一天六則標題，講完就停。"), m: L("Northgate · 18 MB", "Northgate · 18 MB"), price: "free", r: 4.3 },
      { id: "ap5", pal: "teal", icon: "grid", t: L("Recipes", "食譜"), d: L("Step by step, read aloud, hands stay floury.", "一步一步念給你聽，手上沾麵粉也沒關係。"), m: L("Lumen Labs · 30 MB", "Lumen Labs · 30 MB"), price: "$1.99", r: 4.6 },
      { id: "ap6", pal: "green", icon: "calendar", t: L("Calendar", "行事曆"), d: L("Today in letters you can read from the doorway.", "站在玄關就看得清楚的今日行程。"), m: L("Android · 24 MB", "Android · 24 MB"), price: "own", r: 4.7 },
      { id: "ap7", pal: "violet", icon: "book", t: L("Notes", "備忘"), d: L("Say it, it writes it. The list is on the fridge screen.", "說出口它就寫下來，清單就在冰箱旁的螢幕上。"), m: L("Android · 12 MB", "Android · 12 MB"), price: "free", r: 4.4 },
      { id: "ap8", pal: "blue", icon: "globe", t: L("Browser", "瀏覽器"), d: L("A full browser, when you really need one.", "真的需要時，這裡有一個完整的瀏覽器。"), m: L("Android · 88 MB", "Android · 88 MB"), price: "own", r: 4.2 },
    ],
  };

  /* 商城詳情頁:各分類的標準能力清單 */
  const STORE_FEAT = {
    scenes: [
      L("Takes over the whole screen — one scene, one purpose", "接管整個螢幕——一個場景，只做一件事"),
      L("Voice-first: everything can be asked out loud", "語音優先：所有內容都能用說的"),
      L("Leaves quietly when it's done — no feeds, no autoplay", "做完就安靜退場——沒有動態、不自動續播"),
    ],
    skills: [
      L("Drafts the work, then asks before anything leaves the device", "先把事情擬好，任何東西要離開裝置前都先問你"),
      L("Every action is logged on this device for 90 days", "每個動作都記錄在本機，保留 90 天"),
      L("Can be turned off any time with one switch", "隨時一個開關就能整個關掉"),
    ],
    apps: [
      L("Big-type interface tuned for across-the-room reading", "大字介面，隔著房間也讀得到"),
      L("Runs as a standard Android app in a safe frame", "以標準 Android App 在安全框架中執行"),
      L("No ads, no tracking, no account required", "沒有廣告、不追蹤、不需要帳號"),
    ],
  };

  const STORE_SPOTLIGHT = {
    scenes: ["sc5", "sc7", "sc6"],
    skills: ["sk5", "sk3", "sk2"],
    apps: ["ap5", "ap4", "ap2"],
  };

  /* ── 家庭成員 ── */
  const PEOPLE = [
    {
      id: "barbara", seed: "barbara-2", photo: "assets/img/people/barbara.jpg", owner: true, online: true,
      av: { hair: "#B8B3AE", skin: "#F0CDAE", style: 3, glasses: true, bg: ["#1B2833", "#33506E"] },
      name: L("Barbara", "Barbara"), role: L("This device · 68", "本機使用者 · 68 歲"),
      line: L("Checked in 6 days in a row. Morning meds done at 8:12.",
              "已連續簽到 6 天。今早 8:12 完成用藥。"),
      sees: [
        { on: true, t: L("Her own channels and settings", "自己的頻道與設定") },
        { on: true, t: L("Everything on this device", "本機上的一切") },
      ],
      acts: [L("Open her channels", "打開她的頻道"), L("Change reminder times", "調整提醒時間"), L("Night mode at 9:30 PM", "晚上 9:30 進入夜間模式")],
    },
    {
      id: "emily", seed: "emily-7", photo: "assets/img/people/emily.jpg", owner: false, online: true,
      av: { hair: "#4A3421", skin: "#E8BE9C", style: 1, glasses: false, bg: ["#1B2A1F", "#2E5C3E"] },
      name: L("Emily", "Emily"), role: L("Daughter · Portland", "女兒 · 波特蘭"),
      line: L("Gets a quiet notification only if a check-in is missed twice.",
              "只有連續兩次未簽到，才會收到一則安靜的通知。"),
      sees: [
        { on: true, t: L("Daily check-in: done / not yet", "每日簽到：已完成 / 尚未") },
        { on: true, t: L("Medication reminders marked done", "用藥提醒是否已完成") },
        { on: false, t: L("Conversations, photos, browsing", "對話、照片、瀏覽紀錄") },
        { on: false, t: L("Location", "位置") },
      ],
      acts: [L("Stop sharing with Emily", "停止與 Emily 分享"), L("Send her this week's report", "把本週報表寄給她"), L("Start a video call", "開始視訊通話")],
    },
    {
      id: "marcus", seed: "marcus-3", photo: "assets/img/people/marcus.jpg", owner: false, online: false,
      av: { hair: "#1C1C22", skin: "#8D5A3B", style: 0, glasses: true, bg: ["#0F1C2E", "#25405F"] },
      name: L("Marcus", "Marcus"), role: L("Son-in-law · Portland", "女婿 · 波特蘭"),
      line: L("Uses the Spanish tutor on Tuesday nights. 4 day streak.",
              "每週二晚上練西班牙文。目前連續 4 天。"),
      sees: [
        { on: true, t: L("Shared family calendar", "共用家庭行事曆") },
        { on: false, t: L("Health check-ins", "健康簽到") },
        { on: false, t: L("Conversations", "對話") },
      ],
      acts: [L("Add to Sunday call", "加入週日通話"), L("Share the grocery list", "分享採買清單")],
    },
    {
      id: "chloe", seed: "chloe-11", photo: "assets/img/people/chloe.jpg", owner: false, online: true,
      av: { hair: "#6B3A2A", skin: "#F0CDAE", style: 1, glasses: false, scale: 1.12, bg: ["#2A1B33", "#5A3570"] },
      name: L("Chloe", "Chloe"), role: L("Granddaughter · 9", "孫女 · 9 歲"),
      line: L("Multiplication L3, 72%. Streak kept at 11 days.",
              "乘法 Level 3 完成 72%，連續 11 天。"),
      sees: [
        { on: true, t: L("Her own learning progress", "自己的學習進度") },
        { on: false, t: L("Anything belonging to adults", "任何屬於大人的內容") },
      ],
      acts: [L("Open parent report", "打開家長報表"), L("Set a 10-minute limit", "設定 10 分鐘上限"), L("Turn off streak reminders", "關閉連續天數提醒")],
    },
    {
      id: "noah", seed: "noah-5", photo: "assets/img/people/noah.jpg", owner: false, online: false,
      av: { hair: "#2A2118", skin: "#E8BE9C", style: 0, glasses: false, scale: 1.14, bg: ["#33261B", "#6B4A2A"] },
      name: L("Noah", "Noah"), role: L("Grandson · 6", "孫子 · 6 歲"),
      line: L("Bedtime story with his name in it, three nights this week.",
              "本週有三個晚上聽了有他名字的睡前故事。"),
      sees: [
        { on: true, t: L("Stories and drawing", "故事與畫圖") },
        { on: false, t: L("Anything belonging to adults", "任何屬於大人的內容") },
      ],
      acts: [L("Pick tonight's story", "選今晚的故事"), L("Record grandma's voice", "錄一段奶奶的聲音")],
    },
    {
      id: "dr", seed: "dr-9", photo: "assets/img/people/alvarez.jpg", owner: false, online: false,
      av: { hair: "#241E1A", skin: "#A96F4C", style: 2, glasses: true, bg: ["#141A22", "#2B3844"] },
      name: L("Dr. Alvarez", "Alvarez 醫師"), role: L("Care team · read only", "照護團隊 · 唯讀"),
      line: L("Receives the printed weekly summary only when Barbara sends it.",
              "只有 Barbara 主動寄出時，才會收到每週摘要。"),
      sees: [
        { on: true, t: L("Weekly summary Barbara sends", "Barbara 主動寄出的每週摘要") },
        { on: false, t: L("Live status", "即時狀態") },
        { on: false, t: L("Anything else, ever", "其他一切，永遠不分享") },
      ],
      acts: [L("Send this week's summary", "寄出本週摘要"), L("Revoke access", "撤銷存取權")],
    },
  ];

  /* ── 天氣頻道 ── */
  const WEATHER = {
    temp: 54, place: L("Seattle, WA", "西雅圖"),
    cond: L("Grey and wet until noon", "陰雨，午前不停"),
    meta: L("H 58° · L 47° · Rain 80%", "最高 58° · 最低 47° · 降雨 80%"),
    act: { icon: "umbrella", t: L("Rain at 8 AM", "早上 8 點會下雨"), s: L("Take an umbrella — the big one by the door.", "帶傘出門——門邊那把大的。") },
    side: [
      { icon: "car", k: L("Commute", "通勤"), v: L("Leave by 8:10", "8:10 前出門"), s: L("Bridge is slow in rain. 9:30 across town.", "下雨天橋上會塞。9:30 在城另一邊。") },
      { icon: "shirt", k: L("What to wear", "穿什麼"), v: L("Light jacket", "薄外套"), s: L("Not the wool one. It won't dry by evening.", "別穿羊毛那件，傍晚前乾不了。") },
    ],
    chips: [
      { i: "sun", k: L("Sunrise", "日出"), v: L("5:42 AM", "上午 5:42") },
      { i: "moon", k: L("Sunset", "日落"), v: L("8:47 PM", "晚上 8:47") },
      { i: "shield", k: L("Air quality", "空氣品質"), v: L("42 · Good", "42 · 良好") },
      { i: "sparkle", k: L("Pollen", "花粉"), v: L("Low", "低") },
    ],
    hours: [
      { t: L("7 AM", "7 時"), i: "cloudRain", v: 52 },
      { t: L("8 AM", "8 時"), i: "cloudRain", v: 53, now: true },
      { t: L("9 AM", "9 時"), i: "cloudRain", v: 54 },
      { t: L("10 AM", "10 時"), i: "cloudRain", v: 55 },
      { t: L("11 AM", "11 時"), i: "sun", v: 57 },
      { t: L("12 PM", "12 時"), i: "sun", v: 58 },
      { t: L("1 PM", "13 時"), i: "sun", v: 58 },
      { t: L("2 PM", "14 時"), i: "sun", v: 57 },
    ],
  };

  /* ── 命理頻道 ── */
  const HOROSCOPE = {
    meta: L("May 24 · ☉ Leo season · 2 min", "5 月 24 日 · ☉ 獅子座節氣 · 2 分鐘"),
    title: L("Today for Leo", "今日 · 獅子座"),
    lucky: [
      { i: "moon", v: L("Waxing gibbous", "盈凸月") },
      { i: "sparkle", v: L("Lucky colour · Emerald", "幸運色 · 祖母綠") },
      { i: "star", v: L("Lucky number · 7", "幸運數字 · 7") },
      { i: "clock", v: L("Best window · 10–12 AM", "黃金時段 · 上午 10–12") },
    ],
    cards: [
      { k: L("Career", "事業"), v: L("Say the number first. Mercury clears your 3rd house at noon — the conversation you've been putting off goes better than you expect.", "先開口說出數字。水星正午行經第三宮，那個一直拖著的對話會比你預期順利。"), e: 5, more: L("Mercury sits beside the Sun in your house of conversations until mid-June, which is why words land easier than usual. The window is the late morning — after that, let the other side talk.", "水星與太陽同守你的溝通宮直到六月中，所以這陣子開口特別順。黃金時段在接近中午前——之後就換對方說。") },
      { k: L("Love", "感情"), v: L("Someone is waiting for you to ask, not to guess. Keep the evening simple.", "有人在等你開口問，而不是等你猜。今晚別安排太滿。"), e: 3, more: L("Venus squares your Moon tonight — that is not tension, just honesty wanting out. Ask the small question directly instead of circling it.", "金星今晚與你的月亮呈刑相——那不是衝突，是誠實想被說出口。與其繞圈，不如直接問那個小問題。") },
      { k: L("Energy", "能量"), v: L("Strong until about 4 PM, then plan nothing. The nap is not laziness today.", "下午 4 點前狀態很好，之後別再排事。今天的午睡不是偷懶。"), e: 4, more: L("Mars is finishing its pass through your sixth house, so the body asks for rest earlier than the mind does. Honour the 4 PM dip; the evening is for slippers, not plans.", "火星正走完你的第六宮，所以身體會比腦子更早喊累。尊重下午四點的低潮；晚上留給拖鞋，不留給行程。") },
    ],
  };

  /* ── 學習頻道 ── */
  const LEARNING = {
    streak: L("11 day streak", "連續 11 天"),
    parent: L("Parent view", "家長報表"),
    cont: {
      label: L("Continue learning", "繼續學習"),
      title: L("Multiplication · Level 3", "乘法 · Level 3"),
      desc: L("Question 7 of 10. Chloe got the last four right — Level 4 unlocks after this one.",
              "第 7 / 10 題。Chloe 最近四題都答對——這節做完就解鎖 Level 4。"),
      pct: 72,
    },
    remList: [
      { icon: "pill", t: L("Morning medications", "早晨用藥"), s: L("Every day · 8:00 AM · speaks twice, then tells Emily", "每天 · 上午 8:00 · 語音提醒兩次後通知 Emily") },
      { icon: "heart", t: L("Blood pressure", "量血壓"), s: L("Mon & Thu · 9:00 AM · logged for Dr. Alvarez", "週一、四 · 上午 9:00 · 記錄給 Alvarez 醫師") },
      { icon: "sun", t: L("Afternoon walk", "下午散步"), s: L("Every day · 4:00 PM · only when it isn't raining", "每天 · 下午 4:00 · 下雨天自動略過") },
    ],
    histList: [
      { d: L("Sat", "週六"), t: L("All meds · check-in 8:44 AM · BP 122/78", "用藥完成 · 8:44 簽到 · 血壓 122/78") },
      { d: L("Fri", "週五"), t: L("All meds · check-in 8:31 AM · 24 min walk", "用藥完成 · 8:31 簽到 · 散步 24 分鐘") },
      { d: L("Thu", "週四"), t: L("All meds · check-in 9:02 AM · BP 125/80", "用藥完成 · 9:02 簽到 · 血壓 125/80") },
      { d: L("Wed", "週三"), t: L("All meds · check-in 8:12 AM", "用藥完成 · 8:12 簽到") },
    ],
    week: {
      label: L("Parent report · this week", "家長週報 · 本週"),
      stats: [
        { v: "5", k: L("sessions", "節") },
        { v: "48", k: L("minutes", "分鐘") },
        { v: "86%", k: L("correct", "正確率") },
      ],
      days: [L("M","一"), L("T","二"), L("W","三"), L("T","四"), L("F","五"), L("S","六"), L("S","日")],
      bars: [8, 10, 0, 12, 9, 6, 3],
      insight: L("Multiplication clicked. Try Level 4 next week.", "乘法開竅了，下週試 Level 4。"),
    },
    subjects: [
      { id: "math", t: L("Math", "數學"), p: 72, n: L("Level 3 · 7/10", "Level 3 · 7/10") },
      { id: "reading", t: L("Reading", "閱讀"), p: 45, n: L("Level 2 · 9/20", "Level 2 · 9/20") },
      { id: "science", t: L("Science", "自然"), p: 18, n: L("Just started", "剛開始") },
      { id: "spanish", t: L("Spanish", "西班牙文"), p: 55, n: L("Marcus · 4 day streak", "Marcus · 連續 4 天") },
    ],
  };

  /* ── 學習:練習題（每科一題示範,點答案有即時回饋） ── */
  const QUIZ = {
    math: {
      title: L("Multiplication · Level 3", "乘法 · Level 3"),
      no: L("Question 7 of 10", "第 7 / 10 題"),
      q: "7 × 8 = ?",
      opts: ["54", "56", "63", "48"], correct: 1,
      explain: L("7 × 8 is 56 — think 7 × 4 = 28, then double it.", "7 × 8 是 56——先想 7 × 4 = 28，再乘兩倍。"),
      retry: L("Close! Let's try it a different way.", "差一點！我們換個方法想。"),
    },
    reading: {
      title: L("Reading · Level 2", "閱讀 · Level 2"),
      no: L("Question 10 of 20", "第 10 / 20 題"),
      q: L("Which word rhymes with “light”?", "哪個字和 light 押韻？"),
      opts: ["kite", "lamp", "lion", "leaf"], correct: 0,
      explain: L("kite and light share the same “-ite” sound.", "kite 和 light 都有一樣的 -ite 音。"),
      retry: L("Say them out loud — which one sounds the same?", "念出聲音看看——哪個聽起來一樣？"),
    },
    science: {
      title: L("Science · Level 1", "自然 · Level 1"),
      no: L("Question 2 of 10", "第 2 / 10 題"),
      q: L("Which planet is closest to the Sun?", "哪顆行星離太陽最近？"),
      opts: [L("Venus", "金星"), L("Mercury", "水星"), L("Earth", "地球"), L("Mars", "火星")], correct: 1,
      explain: L("Mercury orbits closest — a year there is just 88 days.", "水星最靠近太陽——它的一年只有 88 天。"),
      retry: L("Think of the smallest, fastest one.", "想想最小、跑最快的那顆。"),
    },
    spanish: {
      title: L("Spanish · Greetings", "西班牙文 · 問候"),
      no: L("Question 3 of 10", "第 3 / 10 題"),
      q: L("How do you say “good morning”?", "「早安」的西班牙文是？"),
      opts: ["Buenas noches", "Hola", "Buenos días", "Adiós"], correct: 2,
      explain: L("Buenos días — literally “good days”.", "Buenos días——字面意思是「美好的日子」。"),
      retry: L("Noches is night. Try again!", "noches 是晚上喔，再試一次！"),
    },
    doneT: L("That's the spirit!", "就是這樣！"),
    doneS: L("The real session keeps going on the device — ten questions, then it says goodbye.",
             "實機上的課程會繼續——十題做完，就說再見。"),
    back: L("Back to Learning", "回到學習頻道"),
  };

  /* ── 健康頻道 ── */
  const HEALTH = {
    tabs: [L("Today", "今天"), L("Reminders", "提醒"), L("History", "歷史")],
    meds: [
      { id: "m1", t: L("Lisinopril", "Lisinopril"), d: L("10 mg · with breakfast", "10 mg · 隨早餐"), time: L("8:00 AM", "上午 8:00"), done: true },
      { id: "m2", t: L("Metformin", "Metformin"), d: L("500 mg · after food", "500 mg · 飯後"), time: L("8:15 AM", "上午 8:15"), done: true },
      { id: "m3", t: L("Vitamin D", "維他命 D"), d: L("1000 IU · any time", "1000 IU · 隨時"), time: L("9:00 AM", "上午 9:00"), done: false },
    ],
    next: { icon: "clock", k: L("Coming up", "接下來"), items: [
      { t: L("Blood pressure at 9:00", "9:00 量血壓"), s: L("The cuff is in the drawer under the phone.", "壓脈帶在電話下面那個抽屜。") },
      { t: L("Dr. Alvarez · Tue June 3, 10:30", "Alvarez 醫師 · 6/3（二）10:30"), s: L("This week's summary is ready to bring along.", "本週摘要已備好，可以直接帶去。") },
    ] },
    checkin: {
      note: L("Emily will see this", "Emily 會看到這個"),
      btn: L("I'm OK today", "我今天很好"),
      done: L("All done, Barbara", "都完成了，Barbara"),
      doneNote: L("Emily can see you're OK", "Emily 已經知道你一切都好"),
      sub: L("I need help", "我需要幫忙"),
    },
    remList: [
      { icon: "pill", t: L("Morning medications", "早晨用藥"), s: L("Every day · 8:00 AM · speaks twice, then tells Emily", "每天 · 上午 8:00 · 語音提醒兩次後通知 Emily") },
      { icon: "heart", t: L("Blood pressure", "量血壓"), s: L("Mon & Thu · 9:00 AM · logged for Dr. Alvarez", "週一、四 · 上午 9:00 · 記錄給 Alvarez 醫師") },
      { icon: "sun", t: L("Afternoon walk", "下午散步"), s: L("Every day · 4:00 PM · only when it isn't raining", "每天 · 下午 4:00 · 下雨天自動略過") },
    ],
    histList: [
      { d: L("Sat", "週六"), t: L("All meds · check-in 8:44 AM · BP 122/78", "用藥完成 · 8:44 簽到 · 血壓 122/78") },
      { d: L("Fri", "週五"), t: L("All meds · check-in 8:31 AM · 24 min walk", "用藥完成 · 8:31 簽到 · 散步 24 分鐘") },
      { d: L("Thu", "週四"), t: L("All meds · check-in 9:02 AM · BP 125/80", "用藥完成 · 9:02 簽到 · 血壓 125/80") },
      { d: L("Wed", "週三"), t: L("All meds · check-in 8:12 AM", "用藥完成 · 8:12 簽到") },
    ],
    week: {
      label: L("This week", "這一週"),
      note: L("6 days in a row. Emily hasn't had to call once.", "連續 6 天。Emily 一通電話都不用打。"),
      days: [
        { d: L("Mon", "一"), ok: true }, { d: L("Tue", "二"), ok: true },
        { d: L("Wed", "三"), ok: true }, { d: L("Thu", "四"), ok: true },
        { d: L("Fri", "五"), ok: true }, { d: L("Sat", "六"), ok: true },
        { d: L("Sun", "日"), ok: false, today: true },
      ],
    },
    disclaimer: L("Reminders and general information only. Not a medical device.", "僅提供提醒與一般資訊，非醫療器材。"),
  };


  /* ── 在地新聞頻道 ── */
  const NEWS = {
    place: L("Seattle · Wallingford", "西雅圖 · Wallingford"),
    stamp: L("Updated 6:00 AM · 3 stories · 90 seconds", "上午 6:00 更新 · 3 則 · 90 秒"),
    lede: L("Near You Today", "今天，你家附近"),
    why: L("Only what's within a few blocks — no national politics, no outrage, no infinite feed.",
           "只有你家附近幾條街的事——沒有政治口水、沒有情緒、沒有滑不完的動態。"),
    quick: [
      { i: "bell", v: L("Trash & recycling: tomorrow morning", "垃圾與回收：明天早上") },
      { i: "car", v: L("Bus 44: running on time", "44 路公車：準點") },
      { i: "chart", v: L("Gas on 45th: $3.89", "45 街油價：$3.89") },
    ],
    items: [
      { tag: L("Getting around", "交通"), col: "#4A8FD4", icon: "car",
        t: L("Fremont Bridge closed until noon", "Fremont 大橋中午前封閉"),
        s: L("Deck repairs. Take Aurora instead — about 6 minutes longer.",
             "橋面維修。改走 Aurora，大約多 6 分鐘。"),
        src: L("Seattle DOT · 5:40 AM", "西雅圖交通局 · 上午 5:40"),
        body: [
          L("Crews found worn expansion joints during last week's inspection, so the deck is getting same-day repairs while the weather holds. Both directions reopen at noon.", "上週檢查時發現伸縮縫磨損，趁天候允許今天當日修復。中午雙向恢復通行。"),
          L("PadClaw checked your calendar — your 9:30 across town is the only trip affected. Leaving by 8:10 via Aurora keeps you on time.", "PadClaw 對過你的行事曆——只有 9:30 那趟會受影響。8:10 前改走 Aurora 就不會遲到。"),
        ] },
      { tag: L("This weekend", "這個週末"), col: "#05CE78", icon: "calendar",
        t: L("Farmers market moves indoors Saturday", "週六農夫市集改到室內"),
        s: L("Rain forecast, so it's at the community center on 45th, same hours.",
             "因為預報有雨，改到 45 街的社區中心，時間不變。"),
        src: L("Wallingford Chamber · 6:00 AM", "Wallingford 商會 · 上午 6:00"),
        body: [
          L("The forecast calls for steady rain through Saturday afternoon, so the market moves inside for the first time this season.", "預報週六下午前都有雨，市集本季第一次移到室內。"),
          L("Same vendors, same hours, 10 to 2 — just indoors at the community center on 45th. The flower stand Barbara likes will be by the main door.", "攤商、時間都不變，10 點到 2 點——只是改在 45 街社區中心。Barbara 喜歡的花攤就在大門旁。"),
        ] },
      { tag: L("Worth knowing", "值得知道"), col: "#E0A94B", icon: "book",
        t: L("Free tax help at the library through April", "圖書館免費報稅諮詢，到四月為止"),
        s: L("Walk-in desk, Tuesdays and Thursdays, 10 to 2. No appointment.",
             "現場排隊，每週二、四上午 10 點到下午 2 點，不用預約。"),
        src: L("Seattle Public Library · Yesterday", "西雅圖公立圖書館 · 昨天"),
        body: [
          L("AARP volunteers staff the walk-in desk on the second floor — they handle federal and state returns for free, no income limit.", "AARP 志工駐點在二樓櫃檯——聯邦與州報稅都免費協助，沒有收入限制。"),
          L("Bring last year's return and a photo ID. Barbara's Tuesday morning is free this week, and the 44 bus stops right outside.", "帶去年的報稅單和證件就好。Barbara 這週二上午有空，44 路公車就停在門口。"),
        ] },
    ],
    foot: L("Sources are named on every story. Nothing is written by AI — it only summarises and reads aloud.",
            "每一則都標明出處。內容不是 AI 寫的，AI 只負責摘要與念出來。"),
  };


  /* ── 股市頻道 ── */
  const MARKET = {
    stamp: L("Closed 4:00 PM ET · Prices delayed 15 minutes", "美東 16:00 收盤 · 報價延遲 15 分鐘"),
    headline: L("Markets Today", "今日行情"),
    calm: L("Nothing here needs you to do anything today.", "今天這裡沒有任何一件事需要你做決定。"),
    indices: [
      { k: "S&P 500", v: "5,431.60", d: +0.41, spark: [38,41,39,44,42,47,45,52,49,55,58,54,61,66] },
      { k: "Dow", v: "38,905.66", d: +0.25, spark: [44,42,45,43,47,46,49,48,52,50,54,53,56,58] },
      { k: "Nasdaq", v: "17,192.53", d: -0.12, spark: [58,60,57,59,55,57,54,52,55,51,49,52,48,50] },
    ],
    why: { i: "ask", t: L("Why it moved", "為什麼會動"),
      s: L("The Fed held rates steady at lunch — most of today's gain came in the hour after.",
           "聯準會中午宣布利率不變——今天的漲幅大多出現在那之後的一小時。") },
    holdLabel: L("Your watchlist", "你的追蹤清單"),
    holdings: [
      { s: "AAPL", n: L("Apple", "蘋果"), p: "212.49", d: +1.21, sh: L("40 shares", "40 股"), pos: "$8,499.60", day: "211.20 · 210.15 – 213.40", spark: [40,42,41,45,44,48,47,51,50,54,57,55,60,63], why: L("Rose with the rest of big tech after the Fed held rates steady.", "聯準會利率不變後，跟著大型科技股一起上漲。") },
      { s: "KO", n: L("Coca-Cola", "可口可樂"), p: "63.18", d: +0.34, sh: L("120 shares", "120 股"), pos: "$7,581.60", day: "62.95 · 62.80 – 63.30", spark: [50,51,49,52,51,53,52,54,53,55,54,56,55,57], why: L("Steady — dividend stocks liked the rate pause.", "走勢平穩——升息暫停對配息股是好消息。") },
      { s: "JNJ", n: L("Johnson & Johnson", "嬌生"), p: "146.02", d: +0.08, sh: L("60 shares", "60 股"), pos: "$8,761.20", day: "145.90 · 145.30 – 146.60", spark: [52,53,52,54,53,52,54,53,55,54,53,55,54,55], why: L("Flat ahead of Thursday's earnings call.", "週四財報前觀望，變動不大。") },
      { s: "T", n: L("AT&T", "AT&T"), p: "18.77", d: -0.42, sh: L("300 shares", "300 股"), pos: "$5,631.00", day: "18.85 · 18.70 – 18.92", spark: [58,57,58,56,57,55,56,54,55,53,54,52,53,51], why: L("Slipped after an analyst downgrade this morning.", "今早遭分析師調降評等後小跌。") },
    ],
    account: {
      label: L("Retirement account", "退休帳戶"),
      today: L("+$61 today", "今天 +$61"),
      ytd: L("+4.2% this year", "今年至今 +4.2%"),
      note: L("Barbara only. Emily never sees this.", "只有 Barbara 看得到。Emily 永遠看不到。"),
      spark: [30,33,31,36,34,39,37,42,40,46,44,50,53,49,56,60,58,64],
    },
    disclaimer: L("Prices for information only. PadClaw does not give investment advice and cannot trade.",
                  "報價僅供參考。PadClaw 不提供投資建議，也無法下單交易。"),
  };

  /* ── 語音疊層示範 ── */
  const VOICE = [
    { clip: "v-wear", q: L("What should I wear today?", "我今天該穿什麼？"), a: L("Light jacket — rain at 8.", "薄外套——8 點會下雨。") },
    { clip: "v-chloe", q: L("Did Chloe finish her math?", "Chloe 的數學做完了嗎？"), a: L("Seven of ten. She's still going.", "十題做了七題，還在進行中。") },
    { clip: "v-call", q: L("Call Emily.", "打給 Emily。"), a: L("Calling Emily on video.", "正在撥打 Emily 的視訊。") },
  ];

  /* ── 同意閘門示範 ── */
  const GATE = {
    clip: "gate-ask",
    label: L("Approval needed", "需要你的同意"),
    title: L("Order this week's groceries?", "要下單這週的生鮮嗎？"),
    rows: [
      { k: L("What", "要做什麼"), v: L("Place a $84.20 order — 14 items", "下一筆 $84.20 的訂單 · 14 項商品") },
      { k: L("Which AI", "用哪個模型"), v: L("PadClaw AI — your private cloud", "PadClaw AI — 你的自有機房") },
      { k: L("Where data goes", "資料去哪"), v: L("Your grocery store only", "只送到你的生鮮商店") },
    ],
    note: L("Your login stays on this device", "你的帳密始終留在這台裝置上"),
    yes: L("Approve", "同意"), no: L("Not now", "先不要"),
  };

  global.DATA = { L, TABS, SETTINGS, CHANNELS, NEWS, MARKET, QUIZ, STORE_FEAT, BILLBOARDS, CONTINUE, SOON, STORE_TABS, STORE, STORE_SPOTLIGHT, PEOPLE, WEATHER, HOROSCOPE, LEARNING, HEALTH, VOICE, GATE };
})(window);
