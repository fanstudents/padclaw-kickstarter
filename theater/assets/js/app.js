/* ══════════════════════════════════════════════════════════════
   PadClaw OS — app.js
   路由 · tvOS 焦點引擎 · 四類畫面（首頁／商城／家庭／場景）
   ══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const D = window.DATA, A = window.Art;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ── 狀態 ── */
  const S = {
    lang: "en",
    tab: "home",
    channel: "overview",
    storeTab: "scenes",
    setTab: "usage",
    provider: "padclaw",
    switches: {},
    person: "emily",
    bb: 0,
    night: false,
    installed: new Set(["sc5", "sk3", "ap2", "ap7"]),
    meds: { m1: true, m2: true, m3: false },
    checkedIn: false,
    focus: null,          // data-fid
  };

  const t = (v) => (v && typeof v === "object" && "en" in v ? v[S.lang] : v);
  /* 人像：有實拍照就用照片，沒有就退回幾何頭像（離線也不會開天窗） */
  const face = (p, w, h, pos) =>
    p.photo
      ? `<img class="face" src="${p.photo}" alt="" width="${w}" height="${h}" loading="lazy"
             style="object-position:center ${pos || "22%"}"
             onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'face-fb',innerHTML:Art.avatar('${p.seed}',${w},${h})}))">`
      : A.avatar(p.seed, w, h, p.av);
  const chan = (id) => D.CHANNELS.find((c) => c.id === id);

  /* 藝術圖層：SVG 打底 + 實拍圖淡入覆蓋。圖檔缺失時自動退回 SVG，不會開天窗 */
  const artLayer = (hero, svg, pos, flip) =>
    `<div class="art"><div class="art__svg">${svg}</div>` +
    (hero ? `<img class="art__img" src="${hero}" alt="" loading="lazy"
              style="object-position:${pos || "center"}${flip ? ";transform:scaleX(-1)" : ""}"
              onload="this.classList.add('is-on')">` : "") +
    `</div>`;



  /* ══════════════════════ 語音播放 ══════════════════════
     示範台詞已用 OpenAI TTS 預先合成成 mp3 隨專案出貨——
     展示時是真的高品質人聲，而且前端不需要任何金鑰。
     檔案缺失或瀏覽器擋自動播放時，退回系統 speechSynthesis。 */
  let audio = null, speakingClip = null;

  function stopSpeak() {
    if (audio) { audio.pause(); audio.currentTime = 0; audio = null; }
    try { speechSynthesis.cancel(); } catch (e) {}
    speakingClip = null;
    document.body.classList.remove("is-speaking");
    renderNowPlaying();
  }

  function speak(clip, fallbackText, label) {
    if (speakingClip === clip) return stopSpeak();   // 再按一次＝停止
    stopSpeak();
    if (!clip) return;
    speakingClip = clip;
    document.body.classList.add("is-speaking");
    renderNowPlaying(label);

    audio = new Audio(`assets/audio/${clip}-${S.lang}.mp3`);
    audio.addEventListener("ended", stopSpeak);
    audio.addEventListener("error", () => sysSpeak(fallbackText));
    audio.play().catch(() => sysSpeak(fallbackText));
  }

  function sysSpeak(text) {
    if (!text || !("speechSynthesis" in window)) return stopSpeak();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = S.lang === "en" ? "en-US" : "zh-TW";
    u.rate = 0.94;
    u.onend = stopSpeak;
    try { speechSynthesis.speak(u); } catch (e) { stopSpeak(); }
  }

  /* 播放中的常駐提示：真的在響的時候才會出現，按一下就停 */
  function renderNowPlaying(label) {
    const host = $("#nowPlaying");
    if (!host) return;
    if (!speakingClip) { host.innerHTML = ""; return; }
    host.innerHTML = `
      <button class="np" type="button" data-act="stopSpeak">
        <span class="np__wave">${Array.from({ length: 5 }, (_, i) =>
          `<i style="animation-delay:${(i * 0.11).toFixed(2)}s"></i>`).join("")}</span>
        <span class="np__t">${label || (S.lang === "en" ? "Reading aloud" : "正在念給你聽")}</span>
        <span class="np__x">${A.icon("plus", 14)}</span>
      </button>`;
  }

  let fidSeq = 0;
  /* 產生一個 focusable 的屬性字串：row = 焦點列、cap = 焦點說明、color = ambient */
  const F = (row, opts = {}) => {
    const fid = opts.fid || `f${++fidSeq}`;
    return `data-focusable data-fid="${fid}" data-row="${row}"` +
      (opts.cap ? ` data-cap="${String(opts.cap).replace(/"/g, "&quot;")}"` : "") +
      (opts.color ? ` data-color="${opts.color}"` : "") +
      (opts.cls ? "" : "");
  };

  /* ══════════════════════ 畫面：首頁 ══════════════════════ */
  function billboardInner(i) {
    const b = D.BILLBOARDS[i], c = chan(b.channel);
    return `
      <div class="billboard__art">${artLayer(c.hero, A[c.art](1280, 720), c.heroPos, c.heroFlip)}</div>
      ${A.fx(c.id)}
      <div class="billboard__scrim"></div>
      <div class="billboard__body">
        <div class="billboard__label">
          <span class="chip chip--accent">${A.icon(c.icon, 15)}${t(c.name)}</span>
          <span class="micro">${t(b.label)}</span>
          <span class="billboard__meta"><i></i>${b.meta.slice(1).map(t).join(' <i></i> ')}</span>
        </div>
        <h1 class="billboard__title">${t(b.title).replace(/\n/g, "<br>")}</h1>
        <p class="billboard__desc">${t(b.desc)}</p>
        <div class="billboard__actions">
          <button class="btn btn--primary focusable" ${F("bb", { fid: "bb-cta", color: c.color })}
                  data-act="channel" data-id="${c.id}">${A.icon("play", 20)}${t(b.cta)}</button>
          <button class="btn btn--ghost focusable" ${F("bb", { fid: "bb-cta2", color: c.color })}
                  data-act="read" data-id="${c.id}">${A.icon("speak", 19)}${t(b.cta2)}</button>
        </div>
      </div>
      <div class="billboard__dots">
        ${D.BILLBOARDS.map((_, k) => `<span class="bdot ${k === i ? "is-on" : ""}"></span>`).join("")}
      </div>`;
  }

  function channelCard(c) {
    return `
      <div class="card card--wide focusable" ${F("ch", { fid: "ch-" + c.id, cap: `${t(c.title)} — ${t(c.tagline)}`, color: c.color })}
           data-act="channel" data-id="${c.id}">
        <div class="card__art">${artLayer(c.hero, A[c.art](540, 304), c.heroPos, c.heroFlip)}</div>
        <div class="card__scrim"></div>
        <span class="card__pill">${t(c.name)}</span>
        <div class="card__body">
          <p class="card__title">${t(c.title)}</p>
          <p class="card__sub">${t(c.desc)}</p>
        </div>
      </div>`;
  }

  function viewHome() {
    return `
      <div class="view__inner">
        <div class="billboard" id="billboard">${billboardInner(S.bb)}</div>
        <div class="shelves">
          <section class="shelf">
            <div class="shelf__label"><span class="micro">${S.lang === "en" ? "Your channels" : "你的頻道"}</span>
              <span class="shelf__more">${S.lang === "en" ? `${D.CHANNELS.length} installed` : `已安裝 ${D.CHANNELS.length} 個`}</span></div>
            <div class="shelf__track" data-shelf="ch">${D.CHANNELS.map(channelCard).join("")}</div>
            <div class="shelf__caption" data-caption="ch"></div>
          </section>

          <section class="shelf">
            <div class="shelf__label"><span class="micro">${S.lang === "en" ? "Pick up where you left off" : "接著上次繼續"}</span></div>
            <div class="shelf__track" data-shelf="cont">
              ${D.CONTINUE.map((x) => {
                const c = chan(x.channel);
                return `<div class="card card--wide focusable" ${F("cont", { fid: "co-" + x.id, cap: t(x.cap), color: c.color })}
                             data-act="channel" data-id="${x.channel}">
                  <div class="card__art">${artLayer(c.hero, A.poster(x.id + x.title.en, x.pal, 540, 304), c.heroPos, c.heroFlip)}</div>
                  <div class="card__scrim"></div>
                  <span class="card__pill card__pill--live">${t(c.name)}</span>
                  <div class="card__body">
                    <p class="card__title">${t(x.title)}</p>
                    <p class="card__sub">${t(x.sub)}</p>
                  </div>
                  <div class="card__bar"><div class="bar" style="height:4px"><i style="width:${x.progress}%"></i></div></div>
                </div>`;
              }).join("")}
            </div>
            <div class="shelf__caption" data-caption="cont"></div>
          </section>

          <section class="shelf">
            <div class="shelf__label"><span class="micro">${S.lang === "en" ? "Coming soon" : "即將推出"}</span>
              <span class="shelf__more">${S.lang === "en" ? "Free over-the-air — no new hardware" : "OTA 免費更新 · 不必換機"}</span></div>
            <div class="shelf__track" data-shelf="soon">
              ${D.SOON.map((x) => `
                <div class="card card--wide card--locked focusable" ${F("soon", { fid: "so-" + x.id, cap: t(x.cap), color: "#7B8B9E" })}
                     data-act="soon">
                  <div class="card__art">${A.poster(x.id + x.title.en, x.pal, 540, 304)}</div>
                  <div class="card__scrim"></div>
                  <span class="card__pill">${A.icon("lock", 11)}</span>
                  <div class="card__body">
                    <p class="card__title">${t(x.title)}</p>
                    <p class="card__sub">${t(x.sub)}</p>
                  </div>
                </div>`).join("")}
            </div>
            <div class="shelf__caption" data-caption="soon"></div>
          </section>
        </div>
      </div>`;
  }

  /* ══════════════════════ 畫面：商城 ══════════════════════ */
  function priceBtn(it) {
    const owned = it.price === "own" || S.installed.has(it.id);
    if (owned) return `<span class="get get--owned">${S.lang === "en" ? "Open" : "打開"}</span>`;
    if (it.price === "free") return `<span class="get get--free">${S.lang === "en" ? "Get" : "取得"}</span>`;
    return `<span class="get">${it.price}</span>`;
  }
  const stars = (r) =>
    `<span class="stars">${[0, 1, 2, 3, 4].map((i) => A.icon("star", 11)).slice(0, Math.round(r)).join("")}</span>
     <span>${r.toFixed(1)}</span>`;

  function viewStore() {
    const tab = D.STORE_TABS.find((x) => x.id === S.storeTab);
    const items = D.STORE[S.storeTab];
    const spot = D.STORE_SPOTLIGHT[S.storeTab].map((id) => items.find((i) => i.id === id));
    return `
      <div class="view__inner">
        <div class="page">
          <div class="page__head">
            <div>
              <h1 class="h1">${S.lang === "en" ? "Store" : "商城"}</h1>
              <p class="sub">${t(tab.sub)}</p>
            </div>
            <div class="seg">
              ${D.STORE_TABS.map((x) => `<button class="seg__btn ${x.id === S.storeTab ? "is-active" : ""}"
                ${F("seg", { fid: "seg-" + x.id })} data-act="storetab" data-id="${x.id}">${t(x.label)}</button>`).join("")}
            </div>
          </div>
        </div>

        <div class="store__body">
          <section class="shelf">
            <div class="shelf__label"><span class="micro">${S.lang === "en" ? "Spotlight" : "本週精選"}</span></div>
            <div class="shelf__track" data-shelf="spot">
              ${spot.map((it) => `
                <div class="card card--wideL focusable" ${F("spot", { fid: "sp-" + it.id, cap: t(it.d), color: paletteColor(it.pal) })}
                     data-act="item" data-id="${it.id}">
                  <div class="card__art">${artLayer(it.hero, A.poster(it.id + it.t.en, it.pal, 752, 424))}</div>
                  <div class="card__scrim"></div>
                  <span class="card__pill">${t(tab.label)}</span>
                  <div class="card__body">
                    <p class="card__title" style="font-size:22px">${t(it.t)}</p>
                    <p class="card__sub">${t(it.d)}</p>
                  </div>
                </div>`).join("")}
            </div>
            <div class="shelf__caption" data-caption="spot"></div>
          </section>

          <div class="shelf__label" style="margin-top:2px">
            <span class="micro">${S.lang === "en" ? "All " + tab.label.en : "全部" + tab.label.zh}</span>
            <span class="shelf__more">${items.length} ${S.lang === "en" ? "titles" : "個項目"}</span>
          </div>
          <div class="grid grid--dim">
            ${items.map((it) => storeItem(it)).join("")}
          </div>
        </div>
      </div>`;
  }

  function storeItem(it) {
    return `
      <article class="item focusable" ${F("grid", { fid: "it-" + it.id, color: paletteColor(it.pal) })}
               data-act="item" data-id="${it.id}">
        <div class="item__art">${artLayer(it.hero, A.poster(it.id + it.t.en, it.pal, 560, 264))}
          <span class="item__ico" style="color:${paletteColor(it.pal)}">${A.icon(it.icon, 26)}</span>
        </div>
        <div class="item__body">
          <h3 class="item__title">${t(it.t)}</h3>
          <p class="item__desc">${t(it.d)}</p>
          <p class="item__meta" style="margin-top:7px">${t(it.m)}</p>
          <div class="item__foot">
            <span class="item__meta">${stars(it.r)}</span>
            ${priceBtn(it)}
          </div>
        </div>
      </article>`;
  }

  const PAL_C = { green: "#05CE78", blue: "#4A8FD4", violet: "#B47CF0", amber: "#E0A94B", rose: "#F0728F", teal: "#3ED0BE", slate: "#7B8B9E" };
  const paletteColor = (p) => PAL_C[p] || "#7B8B9E";

  /* ══════════════════════ 畫面：家庭成員 ══════════════════════ */
  function viewFamily() {
    const p = D.PEOPLE.find((x) => x.id === S.person) || D.PEOPLE[0];
    return `
      <div class="view__inner">
        <div class="billboard" style="height:404px">
          <div class="billboard__art">${artLayer("assets/img/hero/family.jpg", A.family(1280, 720), "center 62%")}</div>
          <div class="billboard__scrim" style="background:
            linear-gradient(90deg,rgba(14,17,22,.82) 0%,rgba(14,17,22,.4) 40%,transparent 66%),
            linear-gradient(180deg,rgba(14,17,22,.55) 0%,rgba(14,17,22,.18) 30%,rgba(14,17,22,.72) 62%,rgba(14,17,22,.97) 88%,var(--bg-a) 100%)"></div>
        </div>
        <div class="page" style="padding-top:118px">
          <div class="page__head">
            <div>
              <h1 class="h1">${S.lang === "en" ? "Family" : "家庭"}</h1>
              <p class="sub">${S.lang === "en"
                ? "Everyone who is connected to this device — and exactly what each of them can see."
                : "所有與這台裝置連結的人——以及他們各自看得到什麼。"}</p>
            </div>
            <span class="chip">${A.icon("shield", 15)}${S.lang === "en" ? "Sharing is always visible here" : "分享狀態一律在此公開"}</span>
          </div>
        </div>

        <div style="position:absolute;left:0;right:0;top:268px">
          <div class="people" data-shelf="ppl">
            ${D.PEOPLE.map((x) => `
              <div class="person focusable ${x.id === S.person ? "is-on" : ""}"
                   ${F("ppl", { fid: "pp-" + x.id, cap: t(x.line), color: x.online ? "#05CE78" : "#7B8B9E" })}
                   data-act="person" data-id="${x.id}">
                <div class="person__art">${face(x, 344, 428, "20%")}</div>
                <div class="person__scrim"></div>
                <div class="person__dot">${x.online ? '<span class="dot"></span>' : ""}
                  ${x.owner ? `<span class="chip" style="height:24px;font-size:11px;padding:0 9px">${S.lang === "en" ? "Owner" : "本機"}</span>` : ""}</div>
                <div class="person__body">
                  <p class="person__name">${t(x.name)}</p>
                  <p class="person__role">${t(x.role)}</p>
                </div>
              </div>`).join("")}
          </div>
          <div class="shelf__caption" data-caption="ppl"></div>

          <div class="detail" key="${p.id}">
            <div class="detail__col">
              <div class="detail__who">
                <span class="detail__ava">${face(p, 128, 128, "18%")}</span>
                <span>
                  <span class="detail__name">${t(p.name)}</span>
                  <span class="detail__role">${t(p.role)}</span>
                </span>
              </div>
              <p class="detail__line">${t(p.line)}</p>
            </div>
            <div class="detail__col">
              <span class="micro">${S.lang === "en" ? `What ${p.name.en} can see` : `${t(p.name)} 看得到什麼`}</span>
              <ul class="seelist">
                ${p.sees.map((s) => `<li class="${s.on ? "" : "no"}" style="color:${s.on ? "" : "var(--text-3)"}">
                  <span style="color:${s.on ? "var(--accent)" : "var(--text-3)"}">${A.icon(s.on ? "eye" : "eyeOff", 19)}</span>
                  ${t(s.t)}${s.on ? "" : ` — <b style="font-weight:600">${S.lang === "en" ? "Never shared" : "永不分享"}</b>`}
                </li>`).join("")}
              </ul>
            </div>
            <div class="detail__col">
              <span class="micro">${S.lang === "en" ? "Quick actions" : "快速動作"}</span>
              <div class="detail__acts">
                ${p.acts.map((a, i) => `<button class="mini" ${F("acts", { fid: `ac-${p.id}-${i}` })} data-act="gate">
                  ${t(a)}<span style="color:var(--text-3)">${A.icon("plus", 15)}</span></button>`).join("")}
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  /* ══════════════════════ 畫面：設定（額度 + 細節） ══════════════════════ */
  const SET_TABS = [
    { id: "usage", label: { en: "Usage", zh: "使用額度" } },
    { id: "detail", label: { en: "Settings", zh: "細節設定" } },
  ];

  function viewSettings() {
    const G = D.SETTINGS;
    return `
      <div class="view__inner">
        <div class="page">
          <div class="page__head">
            <div>
              <h1 class="h1">${S.lang === "en" ? "Settings" : "設定"}</h1>
              <p class="sub">${S.lang === "en"
                ? "What it used, what it cost, and every switch — in plain language."
                : "它用掉了什麼、花了多少、每一個開關——全部用你看得懂的話寫。"}</p>
            </div>
            <div class="seg">
              ${SET_TABS.map((x) => `<button class="seg__btn ${x.id === S.setTab ? "is-active" : ""}"
                ${F("seg", { fid: "st-" + x.id })} data-act="settab" data-id="${x.id}">${t(x.label)}</button>`).join("")}
            </div>
          </div>
        </div>
        <div class="set">${S.setTab === "usage" ? setUsage(G) : setDetail(G)}</div>
      </div>`;
  }

  function founderCard(F0) {
    const pct = Math.round(((F0.total - F0.used) / F0.total) * 100);
    return `
      <div class="founder">
        <div class="founder__top">
          <span class="chip chip--accent">${A.icon("sparkle", 14)}${t(F0.badge)}</span>
          <span class="founder__until">${t(F0.until)}</span>
        </div>
        <p class="founder__unit"><b>${t(F0.unit)}</b><span>${t(F0.origin)}</span></p>
        <h3 class="founder__title">${t(F0.title)}</h3>
        <p class="founder__body">${t(F0.body)}</p>
        <div class="founder__months">
          ${Array.from({ length: F0.total }, (_, i) => `
            <span class="mo ${i < F0.used ? "is-used" : ""}">
              <i></i><span>${i + 1}</span>
            </span>`).join("")}
        </div>
        <p class="founder__left">
          <b>${F0.total - F0.used}</b> ${S.lang === "en" ? "of 6 months left" : "／ 6 個月剩餘"}
          <span class="founder__bar"><i style="width:${pct}%"></i></span>
        </p>
        <ul class="founder__perks">
          ${F0.perks.map((x) => `<li><span>${A.icon("check", 16)}</span>${t(x)}</li>`).join("")}
        </ul>
        <p class="founder__note">${t(F0.note)}</p>
      </div>`;
  }

  function setUsage(G) {
    const q = G.quota;
    const pct = Math.round((q.used / q.total) * 100);
    const maxCh = Math.max(...q.byChannel.map((c) => c.v));
    return `
      <div class="set__cols">
        <div class="setcard setcard--hero">
          ${founderCard(G.founder)}
          <div class="plan">
            <div>
              <span class="micro">${S.lang === "en" ? "Your plan" : "你的方案"}</span>
              <p class="plan__name">${t(G.plan.name)}</p>
              <p class="plan__price">${t(G.plan.price)} · ${t(G.plan.renew)}</p>
            </div>
            <span class="chip chip--accent">${A.icon("sparkle", 14)}${t(G.plan.badge)}</span>
          </div>

          <div class="quota">
            <div class="quota__head">
              <span class="micro">${t(q.label)}</span>
              <span class="quota__n"><b>${q.used.toLocaleString()}</b> / ${q.total.toLocaleString()}</span>
            </div>
            <div class="bar" style="height:12px"><i style="width:${pct}%"></i></div>
            <p class="quota__note">${t(q.note)}</p>
          </div>

          <div class="split">
            <span class="micro">${S.lang === "en" ? "Where the thinking happened" : "推理實際在哪裡發生"}</span>
            <div class="split__bar">
              ${q.split.filter((s) => s.v > 0).map((s) =>
                `<i style="width:${s.v}%;background:${s.c}" title="${t(s.k)}"></i>`).join("")}
            </div>
            <ul class="split__key">
              ${q.split.map((s) => `<li>
                <span class="split__dot" style="background:${s.c}"></span>
                <span class="split__k"><b>${t(s.k)}</b><span>${t(s.s)}</span></span>
                <span class="split__v">${s.v}%</span>
              </li>`).join("")}
            </ul>
          </div>

          <div class="recent">
            <span class="micro">${S.lang === "en" ? "Recent requests" : "最近的請求"}</span>
            <ul class="recent__list">
              ${q.recent.map((r) => `<li>
                <span class="recent__t">${r.t}</span>
                <span class="recent__c" style="background:${r.col}"></span>
                <span class="recent__w">${t(r.w)}</span>
                <span class="recent__where ${t(r.where) === (S.lang === "en" ? "On device" : "本機") ? "is-local" : ""}">${t(r.where)}</span>
              </li>`).join("")}
            </ul>
          </div>
        </div>

        <div class="set__side">
          <div class="setcard">
            <span class="micro">${S.lang === "en" ? "By channel, this month" : "本月各頻道用量"}</span>
            <ul class="bych">
              ${q.byChannel.map((c) => `<li>
                <span class="bych__k">${t(c.k)}</span>
                <span class="bych__bar"><i style="width:${Math.round((c.v / maxCh) * 100)}%;background:${c.c}"></i></span>
                <span class="bych__v">${c.v}</span>
              </li>`).join("")}
            </ul>
          </div>
          <div class="setcard">
            ${q.meters.map((m) => `
              <div class="meter">
                <div class="meter__row"><span>${t(m.k)}</span><span class="meter__v">${t(m.used)} / ${t(m.total)}</span></div>
                <div class="bar"><i style="width:${m.pct}%"></i></div>
              </div>`).join("")}
          </div>
        </div>
      </div>`;
  }

  function providerCard(P) {
    const cur = S.provider;
    return `
      <section class="setcard setcard--wide">
        <div class="setcard__head">
          <span class="setcard__ico">${A.icon("globe", 20)}</span>
          <h3>${t(P.title)}</h3>
        </div>
        <p class="prov__sub">${t(P.sub)}</p>
        <div class="prov__list">
          ${P.list.map((p) => `
            <button class="prov ${p.id === cur ? "is-on" : ""} focusable"
                    ${F("prov", { fid: "pv-" + p.id })} data-act="provider" data-id="${p.id}">
              ${A.brand(p.brand, 26)}
              <span class="prov__k">
                <b>${t(p.name)}${p.state === "default" ? `<em>${S.lang === "en" ? "Default" : "預設"}</em>` : ""}</b>
                <span>${t(p.s)}</span>
              </span>
              <span class="prov__meta">${t(p.meta)}</span>
              <span class="radio${p.id === cur ? " is-on" : ""}"></span>
            </button>`).join("")}
        </div>

        ${P.list.find((p) => p.id === cur && p.state === "byok") ? `
          <div class="prov__key">
            <label class="micro">${t(P.keyLabel)}</label>
            <div class="prov__row">
              <input class="keyin" type="password" autocomplete="off" spellcheck="false"
                     placeholder="${t(P.keyPlaceholder)}" aria-label="${t(P.keyLabel)}">
              <button class="btn btn--primary btn--sm focusable" ${F("prov", { fid: "pv-save" })} data-act="none">
                ${t(P.save)}</button>
            </div>
            <p class="prov__demo">${A.icon("lock", 13)} ${t(P.demoNote)}</p>
          </div>` : ""}

        <div class="prov__guard">
          <span>${A.icon("shield", 20)}</span>
          <span class="row__k"><b>${t(P.guard)}</b><span>${t(P.guardS)}</span></span>
          <span class="sw is-on"><i></i></span>
        </div>
      </section>`;
  }

  function setDetail(G) {
    return `
      <div class="set__scroll" data-scroll>
        ${providerCard(G.providers)}
        <div class="set__grid">
          ${G.groups.map((grp) => `
            <section class="setcard">
              <div class="setcard__head">
                <span class="setcard__ico">${A.icon(grp.icon, 20)}</span>
                <h3>${t(grp.title)}</h3>
              </div>
              <ul class="rows">
                ${grp.rows.map((r, i) => {
                  const id = `sw-${t(grp.title)}-${i}`.replace(/\s+/g, "");
                  const on = S.switches[id] != null ? S.switches[id] : r.on;
                  return `<li class="row ${r.lock ? "is-lock" : ""} focusable"
                    ${F("set-" + t(grp.title), { fid: id })} data-act="switch" data-id="${id}">
                    <span class="row__k"><b>${t(r.t)}</b><span>${t(r.s)}</span></span>
                    ${r.lock ? `<span class="row__lock">${A.icon("lock", 16)}</span>` : ""}
                    <span class="sw ${on ? "is-on" : ""}"><i></i></span>
                  </li>`;
                }).join("")}
              </ul>
            </section>`).join("")}

          <section class="setcard">
            <div class="setcard__head"><span class="setcard__ico">${A.icon("shield", 20)}</span>
              <h3>${S.lang === "en" ? "This device" : "這台裝置"}</h3></div>
            <ul class="rows rows--plain">
              ${G.device.map((d) => `<li class="row row--info"><span class="row__k"><b>${t(d.k)}</b></span>
                <span class="row__v">${t(d.v)}</span></li>`).join("")}
            </ul>
            <button class="danger focusable" ${F("danger", { fid: "danger" })} data-act="gate">
              <span class="row__k"><b>${t(G.danger.t)}</b><span>${t(G.danger.s)}</span></span>
              <span class="danger__btn">${t(G.danger.btn)}</span>
            </button>
          </section>
        </div>
      </div>`;
  }

  /* ══════════════════════ 畫面：場景頻道 ══════════════════════ */
  function subrail() {
    const items = [{ id: "overview", name: { en: "Overview", zh: "總覽" } }].concat(D.CHANNELS);
    return `<div class="subrail">
      ${items.map((c) => `<button class="subrail__btn ${c.id === S.channel ? "is-active" : ""}"
        ${F("subrail", { fid: "sr-" + c.id, color: c.color || "#7B8B9E" })}
        data-act="channel" data-id="${c.id}">${t(c.name)}</button>`).join("")}
    </div>`;
  }

  function viewChannels() {
    if (S.channel === "overview") return wrapChan(chanOverview(), null);
    if (S.channel === "weather") return wrapChan(chanWeather(), chan("weather"));
    if (S.channel === "horoscope") return wrapChan(chanHoroscope(), chan("horoscope"));
    if (S.channel === "learning") return wrapChan(chanLearning(), chan("learning"));
    if (S.channel === "news") return wrapChan(chanNews(), chan("news"));
    if (S.channel === "market") return wrapChan(chanMarket(), chan("market"));
    return wrapChan(chanHealth(), chan("health"));
  }

  function wrapChan(inner, c) {
    const art = c
      ? `<div class="chan__art">${artLayer(c.hero, A[c.art](1280, 720), c.heroPos, c.heroFlip)}</div>${A.fx(c.id)}`
      : "";
    // 命理頁自己帶右側黑幕，背景只需薄薄一層；其餘頻道用左重右輕的 scrim 撐住文字
    const SCRIM = {
      horoscope: `linear-gradient(180deg,rgba(14,17,22,.66) 0%,transparent 22%,transparent 74%,rgba(14,17,22,.72) 100%)`,
      _: `linear-gradient(180deg,rgba(14,17,22,.74) 0%,rgba(14,17,22,.16) 26%,rgba(14,17,22,.34) 60%,rgba(14,17,22,.88) 100%),
          linear-gradient(90deg,rgba(14,17,22,.82) 0%,rgba(14,17,22,.22) 48%,transparent 74%)`,
    };
    const scrim = c ? `<div class="chan__scrim" style="background:${SCRIM[c.id] || SCRIM._}"></div>` : "";
    return `<div class="view__inner"><div class="chan">${art}${scrim}${subrail()}${inner}</div></div>`;
  }

  function chanOverview() {
    return `<div class="ovw">
      <h1 class="h1">${S.lang === "en" ? "Channels" : "場景頻道"}</h1>
      <p class="sub">${S.lang === "en"
        ? `${["","","","","","","Six"][D.CHANNELS.length] || D.CHANNELS.length} channels ship on day one. Each one takes over the whole screen and does exactly one thing well.`
        : `首批出貨內建${["","","","","","","六"][D.CHANNELS.length] || D.CHANNELS.length}個頻道。每一個都接管整個螢幕，只把一件事做好。`}</p>
      <div class="ovw__grid">
        ${D.CHANNELS.map((c) => `
          <div class="ovcard focusable" ${F("ovw", { fid: "ov-" + c.id, cap: t(c.tagline), color: c.color })}
               data-act="channel" data-id="${c.id}">
            <div class="ovcard__art">${artLayer(c.hero, A[c.art](900, 300), c.heroPos, c.heroFlip)}</div>
            <div class="ovcard__scrim"></div>
            <span class="card__pill" style="color:${c.color}">${t(c.name)}</span>
            <div class="ovcard__body">
              <h3>${t(c.title)}</h3>
              <p>${t(c.tagline)}</p>
            </div>
          </div>`).join("")}
      </div>
    </div>`;
  }

  /* ── 天氣 ── */
  function chanWeather() {
    const W = D.WEATHER;
    return `<div class="wx">
      <p class="wx__temp">${W.temp}<sup>°F</sup></p>
      <p class="wx__place">${t(W.place)}</p>
      <p class="wx__meta">${t(W.cond)} · ${t(W.meta)}</p>
      <div class="wx__chips">${W.chips.map((c) => `
        <span class="chip">${A.icon(c.i, 13)}<b>${t(c.k)}</b>${t(c.v)}</span>`).join("")}</div>
      <div class="wx__act glass focusable" ${F("wxa", { fid: "wx-act", color: "#4A8FD4" })} data-act="read" data-id="weather">
        <span style="color:var(--accent)">${A.icon(W.act.icon, 40)}</span>
        <span><b>${t(W.act.t)}</b><span>${t(W.act.s)}</span></span>
      </div>
      <div class="wx__side">
        ${W.side.map((s, i) => `
          <div class="wx__mini glass focusable" ${F("wxa", { fid: "wx-s" + i, color: "#4A8FD4" })} data-act="voice">
            <span class="micro">${A.icon(s.icon, 14)} ${t(s.k)}</span>
            <b>${t(s.v)}</b><span>${t(s.s)}</span>
          </div>`).join("")}
      </div>
      <div class="wx__hours glass">
        ${W.hours.map((hh, i) => `
          <div class="hour ${hh.now ? "is-now" : ""} focusable" ${F("wxh", { fid: "wx-h" + i, color: "#4A8FD4" })} data-act="none">
            <p class="hour__t">${t(hh.t)}</p>
            <span class="hour__i" style="color:${hh.i === "sun" ? "#E0A94B" : "#9FC4EC"};display:flex;justify-content:center">${A.icon(hh.i, 26)}</span>
            <p class="hour__v">${hh.v}°</p>
          </div>`).join("")}
      </div>
    </div>`;
  }

  /* ── 命理 ── */
  function chanHoroscope() {
    const H = D.HOROSCOPE;
    return `<div class="ho"><div class="ho__panel">
      <p class="ho__meta">${t(H.meta)}</p>
      <h1 class="ho__title">${t(H.title)}</h1>
      <div class="ho__lucky">${H.lucky.map((x) => `
        <span class="chip">${A.icon(x.i, 13)}${t(x.v)}</span>`).join("")}</div>
      <div class="ho__cards">
        ${H.cards.map((c, i) => `
          <div class="hocard glass focusable" ${F("hoc", { fid: "ho-" + i, color: "#E0A94B" })} data-act="voice">
            <span class="hocard__k"><b>${t(c.k)}</b><span>${t(c.v)}</span></span>
            <span class="energy">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= c.e ? "on" : ""}"></i>`).join("")}</span>
          </div>`).join("")}
      </div>
      <div class="ho__actions">
        <button class="btn btn--primary btn--sm focusable" ${F("hoa", { fid: "ho-read", color: "#E0A94B" })}
                data-act="read" data-id="horoscope">
          ${A.icon("speak", 18)}${S.lang === "en" ? "Read aloud" : "念給我聽"}</button>
        <button class="btn btn--ghost btn--sm focusable" ${F("hoa", { fid: "ho-ask", color: "#E0A94B" })} data-act="voice">
          ${A.icon("ask", 18)}${S.lang === "en" ? "Ask a question" : "問一個問題"}</button>
      </div>
    </div></div>`;
  }

  /* ── 學習 ── */
  function chanLearning() {
    const LE = D.LEARNING;
    return `<div class="le">
      <div class="le__top">
        <span class="chip chip--accent">${A.icon("sparkle", 15)}${t(LE.streak)}</span>
        <button class="chip focusable" ${F("let", { fid: "le-parent", color: "#B47CF0" })} data-act="gate">
          ${A.icon("chart", 15)}${t(LE.parent)}</button>
      </div>
      <div class="le__cont">
        <span class="micro">${t(LE.cont.label)}</span>
        <h3>${t(LE.cont.title)}</h3>
        <p>${t(LE.cont.desc)}</p>
        <div class="le__prog"><div class="bar"><i style="width:${LE.cont.pct}%"></i></div><span>${LE.cont.pct}%</span></div>
        <div class="le__actions">
          <button class="btn btn--primary focusable" ${F("lea", { fid: "le-go", color: "#B47CF0" })}
                  data-act="read" data-id="learning">
            ${A.icon("play", 20)}${S.lang === "en" ? "Continue" : "繼續"}</button>
          <button class="btn btn--ghost focusable" ${F("lea", { fid: "le-restart", color: "#B47CF0" })} data-act="none">
            ${S.lang === "en" ? "Start over" : "重新開始"}</button>
        </div>
      </div>
      <div class="le__report glass">
        <span class="micro">${A.icon("chart", 13)} ${t(LE.week.label)}</span>
        <div class="rep__stats">${LE.week.stats.map((x) => `
          <span class="rep__stat"><b>${x.v}</b><span>${t(x.k)}</span></span>`).join("")}</div>
        <div class="rep__bars">${LE.week.bars.map((v, i) => `
          <span class="rep__col"><i style="height:${Math.max(6, v * 7)}%${v === 0 ? ";background:var(--track)" : ""}"></i>
          <span>${t(LE.week.days[i])}</span></span>`).join("")}</div>
        <p class="rep__insight">${A.icon("sparkle", 13)} ${t(LE.week.insight)}</p>
      </div>
      <div class="le__shelf">
        <div class="shelf__label"><span class="micro">${S.lang === "en" ? "Subjects" : "科目"}</span></div>
        <div class="shelf__track" data-shelf="subj">
          ${LE.subjects.map((s) => `
            <div class="subj focusable" ${F("subj", { fid: "su-" + s.id, cap: t(s.n), color: "#B47CF0" })} data-act="none">
              <div class="subj__art">${A.subject(s.id, 356, 472)}</div>
              <div class="subj__scrim"></div>
              <div class="subj__body">
                <b>${t(s.t)}</b>
                <div class="bar"><i style="width:${s.p}%"></i></div>
                <span>${t(s.n)}</span>
              </div>
            </div>`).join("")}
        </div>
        <div class="shelf__caption" data-caption="subj"></div>
      </div>
    </div>`;
  }


  /* ── 在地新聞：三則就停 ── */
  function chanNews() {
    const N = D.NEWS;
    return `<div class="nw">
      <div class="nw__head">
        <div>
          <span class="micro">${A.icon("globe", 14)} ${t(N.place)}</span>
          <h1 class="nw__title">${t(N.lede)}</h1>
          <p class="nw__why">${t(N.why)}</p>
        </div>
        <button class="btn btn--primary btn--sm focusable" ${F("nwa", { fid: "nw-read", color: "#D98E5A" })}
                data-act="read" data-id="news">${A.icon("speak", 18)}${S.lang === "en" ? "Read all three" : "三則都念給我聽"}</button>
      </div>
      <div class="nw__quick">${N.quick.map((q) => `
        <span class="chip">${A.icon(q.i, 13)}${t(q.v)}</span>`).join("")}</div>
      <div class="nw__list">
        ${N.items.map((it, i) => `
          <article class="nwcard glass focusable" ${F("nwi", { fid: "nw-" + i, color: it.col })} data-act="read" data-id="news">
            <span class="nwcard__n">${i + 1}</span>
            <span class="nwcard__k">
              <span class="nwcard__tag" style="color:${it.col};background:${it.col}1f;border-color:${it.col}44">
                ${A.icon(it.icon, 13)}${t(it.tag)}</span>
              <b>${t(it.t)}</b>
              <span class="nwcard__s">${t(it.s)}</span>
              <span class="nwcard__src">${t(it.src)}</span>
            </span>
          </article>`).join("")}
      </div>
      <p class="nw__foot">${A.icon("shield", 14)} ${t(N.foot)}</p>
    </div>`;
  }


  /* ── 股市：看一眼就好 ── */
  const pct = (d) => `${d > 0 ? "+" : ""}${d.toFixed(2)}%`;

  function chanMarket() {
    const M = D.MARKET;
    return `<div class="mk">
      <div class="mk__head">
        <div>
          <span class="micro">${A.icon("clock", 14)} ${t(M.stamp)}</span>
          <h1 class="mk__title">${t(M.headline)}</h1>
          <p class="mk__calm">${A.icon("check", 16)} ${t(M.calm)}</p>
        </div>
        <button class="btn btn--primary btn--sm focusable" ${F("mka", { fid: "mk-read", color: "#5BC0BE" })}
                data-act="read" data-id="market">${A.icon("speak", 18)}${S.lang === "en" ? "Read the summary" : "念摘要給我聽"}</button>
      </div>

      <div class="mk__idx">
        ${M.indices.map((x, i) => `
          <div class="idx glass focusable ${x.d >= 0 ? "up" : "dn"}" ${F("mki", { fid: "mk-i" + i, color: "#5BC0BE" })} data-act="none">
            <span class="idx__k">${x.k}</span>
            <span class="idx__v">${x.v}</span>
            <span class="idx__d">${pct(x.d)}</span>
            ${A.spark(x.spark, x.d >= 0, 260, 52)}
          </div>`).join("")}
      </div>

      <div class="mk__why glass">
        <span class="mk__why-ico">${A.icon(M.why.i, 18)}</span>
        <span><b>${t(M.why.t)}</b> — ${t(M.why.s)}</span>
      </div>
      <div class="mk__body">
        <div class="mk__hold">
          <span class="micro">${t(M.holdLabel)}</span>
          <ul class="hold">
            ${M.holdings.map((h, i) => `
              <li class="holdrow focusable ${h.d >= 0 ? "up" : "dn"}" ${F("mkh", { fid: "mk-h" + i, color: "#5BC0BE" })} data-act="none">
                <span class="hold__s">${h.s}</span>
                <span class="hold__n">${t(h.n)}<em>${t(h.sh)}</em></span>
                <span class="hold__p">$${h.p}</span>
                <span class="hold__d">${pct(h.d)}</span>
              </li>`).join("")}
          </ul>
        </div>

        <div class="mk__acct glass">
          <span class="micro">${A.icon("lock", 13)} ${t(M.account.label)}</span>
          <b class="acct__today">${t(M.account.today)}</b>
          <span class="acct__ytd">${t(M.account.ytd)}</span>
          ${A.spark(M.account.spark, true, 300, 92)}
          <span class="acct__note">${A.icon("eyeOff", 14)} ${t(M.account.note)}</span>
        </div>
      </div>

      <p class="mk__foot">${A.icon("shield", 14)} ${t(M.disclaimer)}</p>
    </div>`;
  }

  /* ── 健康 ── */
  function chanHealth() {
    const HE = D.HEALTH;
    const done = S.checkedIn;
    return `<div class="he">
      <div>
        <div class="he__tabs">
          ${HE.tabs.map((x, i) => `<button class="subrail__btn ${i === 0 ? "is-active" : ""}"
            ${F("het", { fid: "he-t" + i, color: "#05CE78" })} data-act="none">${t(x)}</button>`).join("")}
        </div>
        <div class="he__list">
          ${HE.meds.map((m) => `
            <div class="med ${S.meds[m.id] ? "is-done" : ""} focusable" ${F("hem", { fid: "he-" + m.id, color: "#05CE78" })}
                 data-act="med" data-id="${m.id}">
              <span class="box">${A.icon("check", 30)}</span>
              <span class="med__k"><b>${t(m.t)}</b><span>${t(m.d)}</span></span>
              <span class="med__t">${t(m.time)}</span>
            </div>`).join("")}
        </div>
        <div class="week">
          <div class="week__head">
            <span class="micro">${t(HE.week.label)}</span>
            <span class="week__note">${t(HE.week.note)}</span>
          </div>
          <div class="week__days">
            ${HE.week.days.map((d) => `
              <div class="day ${d.ok || (S.checkedIn && d.today) ? "is-ok" : ""} ${d.today ? "is-today" : ""}">
                <span class="day__mark">${d.ok || (S.checkedIn && d.today) ? A.icon("check", 22) : ""}</span>
                <span class="day__d">${t(d.d)}</span>
              </div>`).join("")}
          </div>
        </div>
        <p class="item__meta" style="margin-top:16px">${A.icon("shield", 14)} ${t(HE.disclaimer)}</p>
      </div>

      <div class="he__side">
        <div class="checkin">
          <p class="checkin__note">${done ? t(HE.checkin.doneNote) : t(HE.checkin.note)}</p>
          <button class="checkin__btn ${done ? "is-done" : ""} focusable" ${F("hec", { fid: "he-in", color: "#05CE78" })} data-act="checkin">
            ${done ? t(HE.checkin.done) : t(HE.checkin.btn)}
          </button>
          <p class="checkin__sub">${t(HE.checkin.sub)}</p>
        </div>
        <div class="nextup">
          <span class="micro">${A.icon(HE.next.icon, 14)} ${t(HE.next.k)}</span>
          ${HE.next.items.map((it) => `
            <div class="next__it"><b>${t(it.t)}</b><span>${t(it.s)}</span></div>`).join("")}
        </div>
      </div>
    </div>`;
  }

  /* ══════════════════════ 疊層 ══════════════════════ */
  let voiceTimer = null, voiceIdx = 0;
  function openVoice() {
    const v = D.VOICE[voiceIdx++ % D.VOICE.length];
    const q = t(v.q), a = t(v.a);
    $("#layer").innerHTML = `
      <div class="scrim-full" data-act="closeLayer">
        <div class="voice">
          <p class="voice__label">${S.lang === "en" ? "Listening" : "正在聽"}</p>
          <p class="voice__text" id="vtext"></p>
          <div class="voice__wave">${Array.from({ length: 13 }, (_, i) =>
            `<i style="animation-delay:${(i * 0.075).toFixed(2)}s"></i>`).join("")}</div>
          <p class="voice__hint" id="vhint"></p>
        </div>
      </div>`;
    const el = $("#vtext"), hint = $("#vhint");
    let i = 0;
    clearInterval(voiceTimer);
    voiceTimer = setInterval(() => {
      i++;
      el.innerHTML = `${q.slice(0, i)}<span class="voice__caret"></span>`;
      if (i >= q.length) {
        clearInterval(voiceTimer);
        el.innerHTML = q;
        setTimeout(() => {
          if (!hint.isConnected) return;
          hint.textContent = a;
          speak(v.clip, a, S.lang === "en" ? "Answering" : "回答中");
        }, 420);
        setTimeout(closeLayer, 4200);
      }
    }, 42);
  }

  function openGate() {
    const G = D.GATE;
    speak(G.clip, t(G.title), t(G.label));
    $("#layer").innerHTML = `
      <div class="scrim-full">
        <div class="gate">
          <p class="gate__label">${t(G.label)}</p>
          <h2 class="gate__title">${t(G.title)}</h2>
          <div class="gate__rows">
            ${G.rows.map((r) => `<div class="gate__row"><b>${t(r.k)}</b><span>${t(r.v)}</span></div>`).join("")}
          </div>
          <p class="gate__note">${A.icon("lock", 19)}${t(G.note)}</p>
          <div class="gate__actions">
            <button class="btn btn--primary" data-act="closeLayer">${A.icon("check", 19)}${t(G.yes)}</button>
            <button class="btn btn--ghost" data-act="closeLayer">${t(G.no)}</button>
          </div>
        </div>
      </div>`;
  }

  function closeLayer() { clearInterval(voiceTimer); stopSpeak(); $("#layer").innerHTML = ""; }

  /* ══════════════════════ 焦點引擎（tvOS） ══════════════════════ */
  let items = [], rows = [];

  function hydrateArt() {
    // 快取命中的圖片不會觸發 onload，這裡補判斷，避免卡片隨機退回 SVG
    $$(".art__img, .face").forEach((im) => {
      if (im.complete && im.naturalWidth) im.classList.add("is-on");
    });
  }

  function indexFocus() {
    items = $$("[data-focusable]").filter((el) => el.offsetParent !== null);
    items.forEach((el) => el.classList.add("focusable"));
    rows = [];
    let last = null;
    items.forEach((el) => {
      const r = el.dataset.row;
      if (r !== last) { rows.push([]); last = r; }
      rows[rows.length - 1].push(el);
    });
    const keep = items.find((el) => el.dataset.fid === S.focus);
    setFocus(keep || items[0], false);
  }

  function setFocus(el, scroll = true) {
    items.forEach((x) => x.classList.remove("is-focused"));
    if (!el) return;
    el.classList.add("is-focused");
    S.focus = el.dataset.fid;
    if (el.dataset.color) document.documentElement.style.setProperty("--ambient", el.dataset.color);
    // 焦點卡下方浮現 metadata
    const shelf = el.closest("[data-shelf]");
    $$("[data-caption]").forEach((c) => { if (!shelf || c.dataset.caption !== shelf.dataset.shelf) c.innerHTML = ""; });
    if (shelf) {
      const cap = $(`[data-caption="${shelf.dataset.shelf}"]`);
      if (cap) cap.innerHTML = el.dataset.cap ? `<s></s><b>${el.dataset.cap}</b>` : "";
    }
    if (scroll) ensureVisible(el);
  }

  function ensureVisible(el) {
    // 橫向：卡列
    const track = el.closest(".shelf__track, .people");
    if (track && track.scrollWidth > track.clientWidth + 4) {
      const pad = 64;
      const l = el.offsetLeft - pad, r = el.offsetLeft + el.offsetWidth + pad;
      if (l < track.scrollLeft) track.scrollLeft = l;
      else if (r > track.scrollLeft + track.clientWidth) track.scrollLeft = r - track.clientWidth;
    }
    // 縱向：卡列區或設定長頁
    const col = el.closest(".shelves, .set__scroll, .store__body");
    if (col && col.scrollHeight > col.clientHeight + 4) {
      const unit = el.closest(".shelf") || el;
      const y = unit.getBoundingClientRect().top - col.getBoundingClientRect().top + col.scrollTop;
      const top = y - 24, bot = y + unit.offsetHeight + 24;
      if (top < col.scrollTop) col.scrollTop = top;
      else if (bot > col.scrollTop + col.clientHeight) col.scrollTop = bot - col.clientHeight;
    }
  }

  function move(dx, dy) {
    const cur = items.find((el) => el.classList.contains("is-focused"));
    if (!cur) return setFocus(items[0]);
    const ri = rows.findIndex((r) => r.includes(cur));
    if (dx) {
      const row = rows[ri], i = row.indexOf(cur);
      const next = row[i + dx];
      if (next) return setFocus(next);
      return;
    }
    const target = rows[ri + dy];
    if (!target) return;
    const cx = cur.getBoundingClientRect().left + cur.getBoundingClientRect().width / 2;
    let best = target[0], bd = Infinity;
    target.forEach((el) => {
      const b = el.getBoundingClientRect();
      const d = Math.abs(b.left + b.width / 2 - cx);
      if (d < bd) { bd = d; best = el; }
    });
    setFocus(best);
  }

  /* ══════════════════════ 路由與渲染 ══════════════════════ */
  function renderTabs() {
    $("#tabbarItems").innerHTML = D.TABS.map((x) => `
      <button class="tab ${x.id === S.tab ? "is-active" : ""}" ${F("nav", { fid: "tab-" + x.id })}
              data-act="tab" data-id="${x.id}">${t(x.label)}</button>`).join("");
    const me = D.PEOPLE[0];
    $("#tabAvatar").innerHTML = face(me, 80, 80, "16%");
  }

  function render(keepFocus) {
    if (!keepFocus) S.focus = null;
    renderNowPlaying();
    renderTabs();
    const v = $("#view");
    v.innerHTML =
      S.tab === "home" ? viewHome()
      : S.tab === "store" ? viewStore()
      : S.tab === "family" ? viewFamily()
      : S.tab === "settings" ? viewSettings()
      : viewChannels();
    indexFocus();
    hydrateArt();
  }

  /* ── Billboard 自動輪播（只換 billboard，不重繪整頁） ── */
  let bbTimer = null;
  function startBillboard() {
    clearInterval(bbTimer);
    bbTimer = setInterval(() => {
      if (S.tab !== "home" || $("#layer").children.length) return;
      S.bb = (S.bb + 1) % D.BILLBOARDS.length;
      const node = $("#billboard");
      if (!node) return;
      node.style.transition = "opacity .5s";
      node.style.opacity = "0";
      setTimeout(() => {
        node.innerHTML = billboardInner(S.bb);
        node.style.opacity = "1";
        indexFocus();
        hydrateArt();
      }, 460);
    }, 11000);
  }

  /* ══════════════════════ 事件 ══════════════════════ */
  document.addEventListener("click", (e) => {
    const hit = e.target.closest("[data-act]");
    if (!hit) return;
    const act = hit.dataset.act, id = hit.dataset.id;

    if (act === "closeLayer") return closeLayer();
    if (act === "stopSpeak") return stopSpeak();
    if (act === "voice") return openVoice();
    if (act === "read") {
      const c = chan(id);
      return speak(c && c.clip, c && t(c.desc), c && t(c.title));
    }
    if (act === "gate" || act === "soon") return openGate();
    if (act === "none") { setFocus(hit); return; }

    if (act === "tab") { S.tab = id; if (id === "channels") S.channel = "overview"; S.focus = "tab-" + id; return render(true); }
    if (act === "channel") {
      S.tab = "channels"; S.channel = id;
      const c = chan(id);
      if (c) document.documentElement.style.setProperty("--ambient", c.color);
      S.focus = "sr-" + id;                 // 焦點跟著落在該頻道的子導覽上
      return render(true);
    }
    if (act === "storetab") { S.storeTab = id; S.focus = "seg-" + id; return render(true); }
    if (act === "settab") { S.setTab = id; S.focus = "st-" + id; return render(true); }
    if (act === "provider") { S.provider = id; S.focus = "pv-" + id; return render(true); }
    if (act === "switch") {
      const cur = hit.querySelector(".sw").classList.contains("is-on");
      S.switches[id] = !cur; S.focus = id; return render(true);
    }
    if (act === "person") { S.person = id; S.focus = "pp-" + id; return render(true); }
    if (act === "item") { setFocus(hit); return openGate(); }
    if (act === "med") { S.meds[id] = !S.meds[id]; S.focus = "he-" + id; return render(true); }
    if (act === "checkin") {
      S.checkedIn = !S.checkedIn; S.focus = "he-in";
      render(true);
      if (S.checkedIn) speak("he-done", t(D.HEALTH.checkin.doneNote), t(D.HEALTH.checkin.done));
      return;
    }
  });

  document.addEventListener("mouseover", (e) => {
    const el = e.target.closest("[data-focusable]");
    if (el && items.includes(el)) setFocus(el, false);
  });

  document.addEventListener("keydown", (e) => {
    if ($("#layer").children.length) {
      if (e.key === "Escape") { e.preventDefault(); closeLayer(); }
      return;
    }
    const K = e.key;
    if (K === "ArrowRight") { e.preventDefault(); move(1, 0); }
    else if (K === "ArrowLeft") { e.preventDefault(); move(-1, 0); }
    else if (K === "ArrowDown") { e.preventDefault(); move(0, 1); }
    else if (K === "ArrowUp") { e.preventDefault(); move(0, -1); }
    else if (K === "Enter" || K === " ") {
      const cur = items.find((el) => el.classList.contains("is-focused"));
      if (cur) { e.preventDefault(); cur.click(); }
    } else if (K === "Escape") {
      e.preventDefault();
      if (S.tab === "channels" && S.channel !== "overview") { S.channel = "overview"; render(); }
      else if (S.tab !== "home") { S.tab = "home"; render(); }
    } else if (K.toLowerCase() === "v") openVoice();
  });

  /* ── 外框 HUD ── */
  $("#btnLang").addEventListener("click", () => {
    S.lang = S.lang === "en" ? "zh" : "en";
    $("#btnLang").querySelector(".remote__key").textContent = S.lang === "en" ? "EN" : "中";
    render(true);
  });
  $("#btnVoice").addEventListener("click", openVoice);
  $("#btnNight").addEventListener("click", () => {
    S.night = !S.night;
    document.body.classList.toggle("is-night", S.night);
    $("#btnNight").setAttribute("aria-pressed", String(S.night));
  });
  $("#btnReplay").addEventListener("click", playBoot);
  $("#tabAvatar").addEventListener("click", () => { S.tab = "family"; render(); });

  /* ── 開機片頭 ── */
  function playBoot() {
    const b = $("#boot");
    b.classList.remove("is-off");
    // 片頭:光暈醒來 → 掌印逐一亮起 → 字標收攏 + 光帶掃過 → 淡出
    b.innerHTML = `
      <div class="boot2__glow"></div>
      <svg class="boot2__mark" viewBox="0 0 128 128" width="132" height="132" aria-hidden="true">
        <defs>
          <linearGradient id="bt-paw" x1="0" y1="0" x2=".3" y2="1">
            <stop offset="0" stop-color="#0FF598"/><stop offset=".55" stop-color="#05CE78"/><stop offset="1" stop-color="#04A05E"/>
          </linearGradient>
        </defs>
        <rect class="bt-tile" x="7" y="7" width="114" height="114" rx="26" fill="none"
              stroke="rgba(255,255,255,.32)" stroke-width="2" pathLength="1"/>
        <g fill="url(#bt-paw)">
          <ellipse class="bt-p bt-p1" cx="44.2" cy="50.8" rx="8.2" ry="11.1" transform="rotate(-18 44.2 50.8)"/>
          <ellipse class="bt-p bt-p2" cx="64" cy="45.8" rx="8.7" ry="11.7"/>
          <ellipse class="bt-p bt-p3" cx="83.8" cy="50.8" rx="8.2" ry="11.1" transform="rotate(18 83.8 50.8)"/>
          <path class="bt-p bt-p4" d="M64 68.4c17.2 0 27.8 10.4 27.8 20.5 0 8.1-7.8 12.1-15.4 9.9-8-2.3-16.8-2.3-24.8 0-7.6 2.2-15.4-1.8-15.4-9.9 0-10.1 10.6-20.5 27.8-20.5Z"/>
        </g>
      </svg>
      <div class="boot2__word"><span>Pad</span><b>Claw</b><i class="boot2__sheen"></i></div>
      <p class="boot2__sub">${S.lang === "en" ? "Your assistant is ready" : "你的助理準備好了"}</p>
      <p class="boot__skip">${S.lang === "en" ? "Tap anywhere to begin" : "點擊任意處開始"}</p>`;
    b.style.animation = "none";
    void b.offsetWidth;
    b.style.animation = "";
    clearTimeout(playBoot._t);
    playBoot._t = setTimeout(() => b.classList.add("is-off"), 4700);
    b.onclick = () => { clearTimeout(playBoot._t); b.classList.add("is-off"); };
  }

  /* ── 依視窗縮放整台平板 ── */
  function fit() {
    const stage = $("#stage"), dev = $("#device");
    const dw = dev.offsetWidth, dh = dev.offsetHeight;
    if (!dw || !dh) return;
    const s = Math.min((stage.clientWidth - 24) / dw, (stage.clientHeight - 56) / dh);
    document.documentElement.style.setProperty("--scale", Math.min(s, 1).toFixed(4));
  }

  /* ── 啟動 ── */
  document.documentElement.style.setProperty("--ambient", "#4A8FD4");
  render();
  startBillboard();
  playBoot();
  fit();
  window.addEventListener("resize", fit);
  setTimeout(fit, 120);
})();
