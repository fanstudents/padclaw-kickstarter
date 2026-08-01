/* ══════════════════════════════════════════════════════════════
   PadClaw OS — art.js
   全部背景／海報／頭像皆為程式繪製的 inline SVG，
   不依賴任何外部圖檔，隨螢幕尺寸縮放都保持銳利。
   ══════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";

  let uid = 0;
  const nid = (p) => `${p}${(++uid).toString(36)}`;

  /* 決定性亂數：同一顆種子永遠畫出同一張圖 */
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }
  const hash = (str) => {
    let h = 2166136261;
    for (let i = 0; i < String(str).length; i++) {
      h ^= String(str).charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };

  const wrap = (inner, w, h) =>
    `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;

  /* 星點場：夜空、學習頁共用 */
  function starfield(seed, w, h, n, maxR, color, op) {
    const r = rng(seed);
    let out = "";
    for (let i = 0; i < n; i++) {
      const x = (r() * w).toFixed(1);
      const y = (r() * h).toFixed(1);
      const rad = (0.4 + r() * maxR).toFixed(2);
      const o = (op * (0.25 + r() * 0.75)).toFixed(2);
      const dur = (2 + r() * 4).toFixed(1);
      out +=
        `<circle cx="${x}" cy="${y}" r="${rad}" fill="${color}" opacity="${o}">` +
        `<animate attributeName="opacity" values="${o};${(o * 0.25).toFixed(2)};${o}" dur="${dur}s" repeatCount="indefinite"/></circle>`;
    }
    return out;
  }

  /* ─────────────────────────────────────────────
     天氣：西雅圖雨雲天際線（Weather 頻道 billboard）
     ───────────────────────────────────────────── */
  function weather(w = 1280, h = 720) {
    const g = nid("wx"), r = rng(7);
    let rain = "";
    for (let layer = 0; layer < 3; layer++) {
      const count = [46, 34, 22][layer];
      const op = [0.16, 0.26, 0.4][layer];
      const len = [16, 26, 40][layer];
      const dur = [1.15, 0.8, 0.55][layer];
      let lines = "";
      for (let i = 0; i < count; i++) {
        const x = (r() * (w + 240) - 120).toFixed(0);
        const y = (r() * h).toFixed(0);
        lines += `<line x1="${x}" y1="${y}" x2="${x - len * 0.34}" y2="${+y + len}" stroke="#CFE3FA" stroke-width="${1 + layer * 0.4}" stroke-linecap="round" opacity="${op}"/>`;
      }
      rain +=
        `<g>${lines}<animateTransform attributeName="transform" type="translate" ` +
        `values="0 -${h * 0.5};-${h * 0.17} ${h * 0.5}" dur="${dur}s" repeatCount="indefinite"/></g>`;
    }

    // 天際線：三層景深剪影
    const sky = (seedX, base, top, fill, blur) => {
      const rr = rng(seedX);
      let d = `M0 ${h} L0 ${base}`;
      let x = 0;
      while (x < w) {
        const bw = 34 + rr() * 78;
        const bh = top + rr() * (base - top) * 0.92;
        d += ` L${x} ${base - bh} L${(x + bw).toFixed(0)} ${base - bh}`;
        x += bw + 4 + rr() * 10;
      }
      d += ` L${w} ${base} L${w} ${h} Z`;
      return `<path d="${d}" fill="${fill}"${blur ? ` filter="url(#${g}blur)"` : ""}/>`;
    };

    return wrap(
      `<defs>
        <linearGradient id="${g}sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#131B27"/><stop offset=".42" stop-color="#25384F"/>
          <stop offset=".72" stop-color="#3D5C7E"/><stop offset="1" stop-color="#54789C"/>
        </linearGradient>
        <radialGradient id="${g}sun" cx=".68" cy=".62" r=".42">
          <stop offset="0" stop-color="#EEDCC0" stop-opacity=".5"/><stop offset="1" stop-color="#EEDCC0" stop-opacity="0"/>
        </radialGradient>
        <filter id="${g}blur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter>
        <filter id="${g}soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="26"/></filter>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#${g}sky)"/>
      <rect width="${w}" height="${h}" fill="url(#${g}sun)"/>
      <g filter="url(#${g}soft)" opacity=".5">
        <ellipse cx="${w * 0.24}" cy="${h * 0.2}" rx="300" ry="88" fill="#0F1720"/>
        <ellipse cx="${w * 0.66}" cy="${h * 0.12}" rx="360" ry="76" fill="#16202C"/>
        <ellipse cx="${w * 0.9}" cy="${h * 0.3}" rx="230" ry="64" fill="#0D141C"/>
      </g>
      ${sky(3, h * 0.94, h * 0.2, "#22323F", true)}
      ${sky(11, h * 0.98, h * 0.24, "#16222D", false)}
      <g fill="#101923">
        <path d="M${w * 0.79} ${h} L${w * 0.79} ${h * 0.46} L${w * 0.8} ${h * 0.4} L${w * 0.815} ${h * 0.4} L${w * 0.825} ${h * 0.46} L${w * 0.825} ${h} Z"/>
        <ellipse cx="${w * 0.807}" cy="${h * 0.4}" rx="52" ry="13"/>
        <path d="M${w * 0.807} ${h * 0.4} l0 -46" stroke="#101923" stroke-width="4"/>
      </g>
      ${sky(29, h * 1.02, h * 0.32, "#0B1219", false)}
      ${rain}
      <g opacity=".5">${starfield(5, w, h * 0.4, 30, 0.7, "#DCEBFF", 0.4)}</g>
      <rect width="${w}" height="${h}" fill="url(#${g}vig)"/>
      <defs><radialGradient id="${g}vig" cx=".5" cy=".45" r=".78">
        <stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/>
      </radialGradient></defs>`,
      w, h
    );
  }

  /* ─────────────────────────────────────────────
     命理：金線星盤（Horoscope 頻道 billboard）
     ───────────────────────────────────────────── */
  function horoscope(w = 1280, h = 720) {
    const g = nid("ho");
    const cx = w * 0.34, cy = h * 0.5, R = Math.min(w, h) * 0.42;

    let ticks = "";
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      const long = i % 6 === 0;
      const r1 = R * (long ? 0.9 : 0.945), r2 = R;
      ticks += `<line x1="${(cx + Math.cos(a) * r1).toFixed(1)}" y1="${(cy + Math.sin(a) * r1).toFixed(1)}" x2="${(cx + Math.cos(a) * r2).toFixed(1)}" y2="${(cy + Math.sin(a) * r2).toFixed(1)}" stroke="#E0A94B" stroke-width="${long ? 1.5 : 0.8}" opacity="${long ? 0.75 : 0.35}"/>`;
    }
    // 十二宮分隔線
    let spokes = "";
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      spokes += `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * R * 0.88).toFixed(1)}" y2="${(cy + Math.sin(a) * R * 0.88).toFixed(1)}" stroke="#E0A94B" stroke-width=".7" opacity=".18"/>`;
    }
    // 獅子座連線
    const leo = [[0.52,0.3],[0.6,0.24],[0.68,0.28],[0.72,0.38],[0.66,0.47],[0.57,0.5],[0.49,0.44],[0.52,0.3]]
      .map(([x, y]) => [w * x, h * y]);
    let leoPath = `M${leo[0][0].toFixed(0)} ${leo[0][1].toFixed(0)}` + leo.slice(1).map(([x, y]) => ` L${x.toFixed(0)} ${y.toFixed(0)}`).join("");
    let leoDots = leo.map(([x, y], i) =>
      `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${i % 3 === 0 ? 5 : 3.2}" fill="#FFE6B0">
         <animate attributeName="opacity" values="1;.45;1" dur="${(2.4 + i * 0.4).toFixed(1)}s" repeatCount="indefinite"/></circle>`).join("");

    return wrap(
      `<defs>
        <radialGradient id="${g}bg" cx=".38" cy=".46" r=".85">
          <stop offset="0" stop-color="#182144"/><stop offset=".45" stop-color="#0C1026"/><stop offset="1" stop-color="#05060C"/>
        </radialGradient>
        <radialGradient id="${g}glow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stop-color="#E0A94B" stop-opacity=".34"/><stop offset="1" stop-color="#E0A94B" stop-opacity="0"/>
        </radialGradient>
        <filter id="${g}f" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="9"/></filter>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#${g}bg)"/>
      ${starfield(23, w, h, 190, 1.5, "#FFFFFF", 0.85)}
      <circle cx="${cx}" cy="${cy}" r="${R * 1.5}" fill="url(#${g}glow)"/>
      <g opacity=".9">
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#E0A94B" stroke-width="1.4" opacity=".55"/>
        <circle cx="${cx}" cy="${cy}" r="${R * 0.88}" fill="none" stroke="#E0A94B" stroke-width=".8" opacity=".3"/>
        <circle cx="${cx}" cy="${cy}" r="${R * 0.52}" fill="none" stroke="#E0A94B" stroke-width=".8" opacity=".24"/>
        ${ticks}${spokes}
        <animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="240s" repeatCount="indefinite"/>
      </g>
      <g filter="url(#${g}f)" opacity=".55"><path d="${leoPath}" fill="none" stroke="#FFD98A" stroke-width="5"/></g>
      <path d="${leoPath}" fill="none" stroke="#FFE6B0" stroke-width="1.3" opacity=".8"/>
      ${leoDots}`,
      w, h
    );
  }

  /* ─────────────────────────────────────────────
     學習：吉祥物與幾何（Learning 頻道 billboard）
     ───────────────────────────────────────────── */
  function learning(w = 1280, h = 720) {
    const g = nid("le"), r = rng(41);
    let shapes = "";
    const cols = ["#F2B33D", "#5FD3F3", "#FF8FA3", "#8DE28D", "#B47CF0"];
    for (let i = 0; i < 16; i++) {
      const x = r() * w, y = r() * h, s = 14 + r() * 40, c = cols[(r() * cols.length) | 0], o = (0.1 + r() * 0.22).toFixed(2);
      const dur = (7 + r() * 9).toFixed(1);
      const kind = (r() * 3) | 0;
      const shape =
        kind === 0 ? `<circle cx="0" cy="0" r="${(s / 2).toFixed(0)}" fill="${c}" opacity="${o}"/>`
        : kind === 1 ? `<rect x="${(-s / 2).toFixed(0)}" y="${(-s / 2).toFixed(0)}" width="${s.toFixed(0)}" height="${s.toFixed(0)}" rx="${(s * 0.26).toFixed(0)}" fill="${c}" opacity="${o}"/>`
        : `<path d="M0 ${(-s / 2).toFixed(0)} L${(s / 2).toFixed(0)} ${(s / 2).toFixed(0)} L${(-s / 2).toFixed(0)} ${(s / 2).toFixed(0)} Z" fill="${c}" opacity="${o}"/>`;
      shapes += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})">${shape}
        <animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -22;0 0" dur="${dur}s" repeatCount="indefinite"/></g>`;
    }

    // 星星吉祥物
    const sx = w * 0.72, sy = h * 0.46, S = 118;
    const star = (rad) => {
      let p = "";
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const rr = i % 2 ? rad * 0.48 : rad;
        p += `${i ? "L" : "M"}${(sx + Math.cos(a) * rr).toFixed(1)} ${(sy + Math.sin(a) * rr).toFixed(1)}`;
      }
      return p + "Z";
    };

    return wrap(
      `<defs>
        <linearGradient id="${g}bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#241640"/><stop offset=".5" stop-color="#3A1F5C"/><stop offset="1" stop-color="#4C2A55"/>
        </linearGradient>
        <radialGradient id="${g}warm" cx=".72" cy=".46" r=".46">
          <stop offset="0" stop-color="#FFC46B" stop-opacity=".38"/><stop offset="1" stop-color="#FFC46B" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="${g}star" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#FFDC84"/><stop offset="1" stop-color="#F5A83C"/>
        </linearGradient>
        <filter id="${g}f" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="18"/></filter>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#${g}bg)"/>
      <rect width="${w}" height="${h}" fill="url(#${g}warm)"/>
      ${shapes}
      <g><g filter="url(#${g}f)" opacity=".6"><path d="${star(S * 1.06)}" fill="#FFC46B"/></g>
        <path d="${star(S)}" fill="url(#${g}star)"/>
        <circle cx="${sx - 30}" cy="${sy - 12}" r="8.5" fill="#3A1F5C"/>
        <circle cx="${sx + 30}" cy="${sy - 12}" r="8.5" fill="#3A1F5C"/>
        <path d="M${sx - 24} ${sy + 22} q24 22 48 0" fill="none" stroke="#3A1F5C" stroke-width="6" stroke-linecap="round"/>
        <ellipse cx="${sx - 52}" cy="${sy + 16}" rx="13" ry="8" fill="#FF9DAE" opacity=".55"/>
        <ellipse cx="${sx + 52}" cy="${sy + 16}" rx="13" ry="8" fill="#FF9DAE" opacity=".55"/>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -14;0 0" dur="4.6s" repeatCount="indefinite"/>
      </g>`,
      w, h
    );
  }

  /* ─────────────────────────────────────────────
     健康：清晨光線（Health 頻道 billboard）
     ───────────────────────────────────────────── */
  function health(w = 1280, h = 720) {
    const g = nid("he");
    const hill = (y, fill, op) =>
      `<path d="M0 ${h} L0 ${y} C${w * 0.22} ${y - 70},${w * 0.42} ${y + 52},${w * 0.62} ${y - 18} C${w * 0.82} ${y - 74},${w * 0.93} ${y - 4},${w} ${y - 40} L${w} ${h} Z" fill="${fill}" opacity="${op}"/>`;
    return wrap(
      `<defs>
        <linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#0A1A17"/><stop offset=".42" stop-color="#123028"/>
          <stop offset=".74" stop-color="#2C4432"/><stop offset="1" stop-color="#4C4A2C"/>
        </linearGradient>
        <radialGradient id="${g}sun" cx=".78" cy=".68" r=".4">
          <stop offset="0" stop-color="#FFE0A0" stop-opacity=".62"/><stop offset=".5" stop-color="#FFC46B" stop-opacity=".2"/>
          <stop offset="1" stop-color="#FFC46B" stop-opacity="0"/>
        </radialGradient>
        <filter id="${g}f" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="30"/></filter>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#${g}bg)"/>
      <rect width="${w}" height="${h}" fill="url(#${g}sun)"/>
      <circle cx="${w * 0.78}" cy="${h * 0.68}" r="70" fill="#FFE7B8" opacity=".8" filter="url(#${g}f)"/>
      <circle cx="${w * 0.78}" cy="${h * 0.68}" r="46" fill="#FFF1D2" opacity=".55"/>
      <g opacity=".22" stroke="#9FF0C6" fill="none" stroke-width="1.4">
        <path d="M0 ${h * 0.34} C${w * 0.3} ${h * 0.24},${w * 0.7} ${h * 0.46},${w} ${h * 0.3}"/>
        <path d="M0 ${h * 0.46} C${w * 0.32} ${h * 0.34},${w * 0.68} ${h * 0.56},${w} ${h * 0.42}"/>
      </g>
      ${starfield(61, w, h * 0.5, 44, 0.9, "#CFF6E2", 0.35)}
      ${hill(h * 0.78, "#14342A", 0.95)}
      ${hill(h * 0.9, "#0C241D", 1)}
      <g opacity=".5">
        <path d="M${w * 0.14} ${h * 0.9} l0 -70 M${w * 0.14} ${h * 0.86} q-30 -16 -34 -46 M${w * 0.14} ${h * 0.8} q30 -14 34 -44"
          stroke="#1E4A38" stroke-width="7" stroke-linecap="round" fill="none"/>
      </g>`,
      w, h
    );
  }

  /* ─────────────────────────────────────────────
     家庭：暖色室內光（Family 頁 billboard）
     ───────────────────────────────────────────── */
  function family(w = 1280, h = 720) {
    const g = nid("fa");
    return wrap(
      `<defs>
        <linearGradient id="${g}bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#1A1410"/><stop offset=".55" stop-color="#2A1E15"/><stop offset="1" stop-color="#40301E"/>
        </linearGradient>
        <linearGradient id="${g}shaft" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#FFD9A0" stop-opacity=".26"/><stop offset="1" stop-color="#FFD9A0" stop-opacity="0"/>
        </linearGradient>
        <filter id="${g}f" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="34"/></filter>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#${g}bg)"/>
      <ellipse cx="${w * 0.76}" cy="${h * 0.24}" rx="300" ry="220" fill="#FFC97A" opacity=".22" filter="url(#${g}f)"/>
      <g>
        <path d="M${w * 0.52} 0 L${w * 0.74} 0 L${w * 0.34} ${h} L${w * 0.1} ${h} Z" fill="url(#${g}shaft)"/>
        <path d="M${w * 0.78} 0 L${w * 0.9} 0 L${w * 0.58} ${h} L${w * 0.44} ${h} Z" fill="url(#${g}shaft)" opacity=".6"/>
      </g>
      <g fill="#120D09" opacity=".85">
        <rect x="${w * 0.02}" y="${h * 0.62}" width="${w * 0.2}" height="14" rx="6"/>
        <rect x="${w * 0.05}" y="${h * 0.34}" width="${w * 0.14}" height="12" rx="5"/>
        <rect x="${w * 0.06}" y="${h * 0.24}" width="16" height="102" rx="4"/>
        <rect x="${w * 0.09}" y="${h * 0.27}" width="14" height="84" rx="4"/>
        <rect x="${w * 0.115}" y="${h * 0.25}" width="18" height="96" rx="4"/>
        <path d="M${w * 0.88} ${h} l0 -140 q-46 -16 -52 -78 q40 22 52 52 q10 -46 52 -66 q-6 66 -52 92 l0 140 Z"/>
      </g>
      ${starfield(97, w, h, 34, 1.1, "#FFDFAE", 0.4)}`,
      w, h
    );
  }

  /* ─────────────────────────────────────────────
     商城／技能海報：依種子產生的抽象構圖
     ───────────────────────────────────────────── */
  const PALETTES = {
    green: ["#062B1C", "#0B5C38", "#05CE78"],
    blue: ["#0A1B2E", "#134068", "#4A8FD4"],
    violet: ["#1E1234", "#3E2168", "#B47CF0"],
    amber: ["#2A1D08", "#6B4715", "#E0A94B"],
    rose: ["#2C1018", "#6B1F35", "#F0728F"],
    teal: ["#06231F", "#0C4E48", "#3ED0BE"],
    slate: ["#14181F", "#232B36", "#7B8B9E"],
  };

  function poster(seed, palette, w = 640, h = 360) {
    const g = nid("po"), r = rng(hash(seed));
    const p = PALETTES[palette] || PALETTES.slate;
    const kind = (r() * 4) | 0;
    let motif = "";

    if (kind === 0) {
      // 同心圓波紋
      for (let i = 7; i >= 1; i--)
        motif += `<circle cx="${(w * 0.74).toFixed(0)}" cy="${(h * 0.5).toFixed(0)}" r="${(i * h * 0.09).toFixed(0)}" fill="none" stroke="${p[2]}" stroke-width="${(0.6 + i * 0.22).toFixed(1)}" opacity="${(0.06 + i * 0.045).toFixed(2)}"/>`;
    } else if (kind === 1) {
      // 斜線陣列
      for (let i = 0; i < 22; i++) {
        const x = (i / 22) * w * 1.4 - w * 0.2;
        motif += `<line x1="${x.toFixed(0)}" y1="0" x2="${(x - h * 0.5).toFixed(0)}" y2="${h}" stroke="${p[2]}" stroke-width="${(1 + r() * 5).toFixed(1)}" opacity="${(0.05 + r() * 0.16).toFixed(2)}"/>`;
      }
    } else if (kind === 2) {
      // 圓點網格
      for (let y = 0; y < 7; y++)
        for (let x = 0; x < 13; x++) {
          const d = Math.hypot(x - 9, y - 3) / 8;
          motif += `<circle cx="${(x * w / 12).toFixed(0)}" cy="${(y * h / 6).toFixed(0)}" r="${(2 + (1 - d) * 8).toFixed(1)}" fill="${p[2]}" opacity="${Math.max(0.04, 0.34 - d * 0.3).toFixed(2)}"/>`;
        }
    } else {
      // 折線圖 / 波形
      let d = `M0 ${(h * 0.7).toFixed(0)}`;
      for (let i = 1; i <= 12; i++) d += ` L${((i * w) / 12).toFixed(0)} ${(h * (0.28 + r() * 0.52)).toFixed(0)}`;
      motif =
        `<path d="${d}" fill="none" stroke="${p[2]}" stroke-width="3" opacity=".5" stroke-linejoin="round"/>` +
        `<path d="${d} L${w} ${h} L0 ${h} Z" fill="${p[2]}" opacity=".12"/>`;
    }

    return wrap(
      `<defs><linearGradient id="${g}b" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[1]}"/>
       </linearGradient>
       <radialGradient id="${g}h" cx=".78" cy=".28" r=".7">
         <stop offset="0" stop-color="${p[2]}" stop-opacity=".3"/><stop offset="1" stop-color="${p[2]}" stop-opacity="0"/>
       </radialGradient></defs>
       <rect width="${w}" height="${h}" fill="url(#${g}b)"/>${motif}
       <rect width="${w}" height="${h}" fill="url(#${g}h)"/>`,
      w, h
    );
  }

  /* ─────────────────────────────────────────────
     科目卡（直式）
     ───────────────────────────────────────────── */
  function subject(kind, w = 360, h = 480) {
    const g = nid("su");
    const map = {
      math: ["#1B2A52", "#33529E", "#7FA9F0", "1 2 3"],
      reading: ["#33221A", "#6B4526", "#F0B87C", "A B C"],
      science: ["#0C2A2A", "#155252", "#54D6C8", "⚗"],
      spanish: ["#331726", "#6E2544", "#F0728F", "Hola"],
    }[kind] || ["#1A1F27", "#2A313C", "#98A2B3", "?"];
    const r = rng(hash(kind));
    let deco = "";
    for (let i = 0; i < 9; i++)
      deco += `<circle cx="${(r() * w).toFixed(0)}" cy="${(r() * h).toFixed(0)}" r="${(8 + r() * 40).toFixed(0)}" fill="${map[2]}" opacity="${(0.05 + r() * 0.1).toFixed(2)}"/>`;
    return wrap(
      `<defs><linearGradient id="${g}b" x1="0" y1="0" x2=".6" y2="1">
        <stop offset="0" stop-color="${map[1]}"/><stop offset="1" stop-color="${map[0]}"/></linearGradient></defs>
       <rect width="${w}" height="${h}" fill="url(#${g}b)"/>${deco}
       <text x="${w / 2}" y="${h * 0.42}" text-anchor="middle" font-family="Inter,system-ui,sans-serif"
         font-size="${w * 0.24}" font-weight="700" fill="${map[2]}" opacity=".9">${map[3]}</text>`,
      w, h
    );
  }

  /* ─────────────────────────────────────────────
     頭像：幾何人物肖像（不使用真實照片）
     ───────────────────────────────────────────── */
  const SKIN = ["#E8BE9C", "#C98F6B", "#8D5A3B", "#F0CDAE", "#A96F4C", "#6B4430"];
  const HAIR = ["#2A2118", "#4A3421", "#8C6A3F", "#B8B3AE", "#1C1C22", "#6B3A2A"];

  /* opts 可覆寫：skin / hair / bg([暗,亮]) / style(0-3 髮型) / glasses / scale(頭部大小，小孩偏大) */
  function avatar(seed, w = 200, h = 200, opts = {}) {
    const g = nid("av"), r = rng(hash(seed));
    const skin = opts.skin || SKIN[(r() * SKIN.length) | 0];
    const hair = opts.hair || HAIR[(r() * HAIR.length) | 0];
    const bgs = [["#0F1C2E", "#1F3A5F"], ["#1B2A1F", "#2E5C3E"], ["#2A1B33", "#4E2E63"], ["#33261B", "#6B4A2A"], ["#1B2833", "#2E4A63"]];
    const bg = opts.bg || bgs[(r() * bgs.length) | 0];
    const style = opts.style != null ? opts.style : (r() * 4) | 0;
    const glasses = opts.glasses != null ? opts.glasses : r() > 0.62;

    const cx = w / 2, cy = h * 0.44, headR = w * 0.2 * (opts.scale || 1);
    let hairShape = "";
    if (style === 0) hairShape = `<path d="M${cx - headR * 1.12} ${cy} a${headR * 1.12} ${headR * 1.16} 0 0 1 ${headR * 2.24} 0 q-${headR * 0.3} -${headR * 0.5} -${headR * 1.12} -${headR * 0.44} q-${headR * 0.8} -0.06 -${headR * 1.12} ${headR * 0.44} Z" fill="${hair}"/>`;
    else if (style === 1) hairShape = `<path d="M${cx - headR * 1.2} ${cy + headR * 0.9} q-${headR * 0.16} -${headR * 2.1} ${headR * 1.2} -${headR * 2.05} q${headR * 1.36} -0.05 ${headR * 1.2} ${headR * 2.05} q-${headR * 0.3} -${headR * 0.9} -${headR * 1.2} -${headR * 0.86} q-${headR * 0.9} -0.04 -${headR * 1.2} ${headR * 0.86} Z" fill="${hair}"/>`;
    else if (style === 2) hairShape = `<circle cx="${cx}" cy="${cy - headR * 0.22}" r="${headR * 1.1}" fill="${hair}"/><circle cx="${cx}" cy="${cy + headR * 0.24}" r="${headR * 0.96}" fill="${skin}"/>`;
    else hairShape = `<path d="M${cx - headR} ${cy - headR * 0.25} q${headR * 0.3} -${headR * 1.1} ${headR} -${headR * 1.05} q${headR * 0.7} -0.05 ${headR} ${headR * 1.05} q-${headR * 0.5} -${headR * 0.44} -${headR} -${headR * 0.4} q-${headR * 0.5} -0.04 -${headR} ${headR * 0.4} Z" fill="${hair}"/>`;

    return wrap(
      `<defs><linearGradient id="${g}b" x1="0" y1="0" x2=".4" y2="1">
         <stop offset="0" stop-color="${bg[1]}"/><stop offset="1" stop-color="${bg[0]}"/></linearGradient></defs>
       <rect width="${w}" height="${h}" fill="url(#${g}b)"/>
       <circle cx="${cx}" cy="${h * 1.02}" r="${w * 0.4}" fill="#0B0E12" opacity=".55"/>
       <path d="M${cx - w * 0.34} ${h} q0 -${h * 0.3} ${w * 0.34} -${h * 0.3} q${w * 0.34} 0 ${w * 0.34} ${h * 0.3} Z" fill="${["#2C3A4A","#3A2C4A","#2C4A3A","#4A3A2C"][(r()*4)|0]}"/>
       <circle cx="${cx}" cy="${cy}" r="${headR}" fill="${skin}"/>
       ${hairShape}
       <circle cx="${cx - headR * 0.36}" cy="${cy + headR * 0.06}" r="${headR * 0.088}" fill="#1A1A20"/>
       <circle cx="${cx + headR * 0.36}" cy="${cy + headR * 0.06}" r="${headR * 0.088}" fill="#1A1A20"/>
       <path d="M${cx - headR * 0.3} ${cy + headR * 0.5} q${headR * 0.3} ${headR * 0.24} ${headR * 0.6} 0" fill="none" stroke="#1A1A20" stroke-width="${headR * 0.07}" stroke-linecap="round" opacity=".7"/>
       ${glasses ? `<g fill="none" stroke="#E8EDF2" stroke-width="${headR * 0.06}" opacity=".85">
          <circle cx="${cx - headR * 0.36}" cy="${cy + headR * 0.06}" r="${headR * 0.26}"/>
          <circle cx="${cx + headR * 0.36}" cy="${cy + headR * 0.06}" r="${headR * 0.26}"/>
          <path d="M${cx - headR * 0.1} ${cy + headR * 0.06} h${headR * 0.2}"/></g>` : ""}`,
      w, h
    );
  }

  /* 圖示：24px 網格 · 2px 圓頭描邊 · 幾何線性（規範禁用 emoji） */
  const ICONS = {
    play: '<path d="M8 5.5 19 12 8 18.5z" fill="currentColor"/>',
    umbrella: '<path d="M12 4v15a2.5 2.5 0 0 0 5 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 11a9 9 0 0 1 18 0z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    check: '<path d="M4.5 12.5 9.5 17.5 19.5 6.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
    speak: '<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    ask: '<path d="M12 3c-5 0-9 3.4-9 7.6 0 2.4 1.4 4.6 3.5 6L6 21l4.4-2.2c.5.1 1 .1 1.6.1 5 0 9-3.4 9-7.6S17 3 12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    eye: '<path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2.8" fill="currentColor"/>',
    eyeOff: '<path d="M4 4l16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9.6 6.5A9.6 9.6 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3 3.6M6.2 8.5A16.5 16.5 0 0 0 2.5 12S6 18 12 18a9.7 9.7 0 0 0 3-.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    clock: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8.2a4.1 4.1 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    star: '<path d="m12 3.5 2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.9l6.1-.8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    sun: '<circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    cloudRain: '<path d="M7 15.5a4 4 0 0 1 .5-8 5.5 5.5 0 0 1 10.4 1.6A3.7 3.7 0 0 1 17.5 15.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 18.5l-1 2.5M13 18.5l-1 2.5M17 18.5l-1 2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    shirt: '<path d="M8.5 3 12 5.5 15.5 3 21 6l-2.5 4-2 -1V21h-9V9l-2 1L3 6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    car: '<path d="M4 16v-3l2-5h12l2 5v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M4 13h16" stroke="currentColor" stroke-width="2"/><circle cx="7.5" cy="16.5" r="1.8" fill="currentColor"/><circle cx="16.5" cy="16.5" r="1.8" fill="currentColor"/>',
    pill: '<rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-40 12 12)" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 6.5 15 17" stroke="currentColor" stroke-width="2"/>',
    shield: '<path d="M12 3 19.5 6v6c0 4.4-3.2 7.6-7.5 9-4.3-1.4-7.5-4.6-7.5-9V6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" stroke-width="2"/>',
    plus: '<path d="M12 5.5v13M5.5 12h13" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
    sparkle: '<path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9z" fill="currentColor"/><path d="M18.5 15.5l.7 2.2 2.2.7-2.2.7-.7 2.2-.7-2.2-2.2-.7 2.2-.7z" fill="currentColor" opacity=".7"/>',
    moon: '<path d="M20 14.2A8.4 8.4 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>',
    home: '<path d="M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    people: '<circle cx="9" cy="8.5" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 6.2a3.2 3.2 0 0 1 0 6M17.5 14.9c2 .6 3.5 2.4 3.5 4.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    bag: '<path d="M5 8h14l-1 12H6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8.8 8V6.4a3.2 3.2 0 0 1 6.4 0V8" fill="none" stroke="currentColor" stroke-width="2"/>',
    globe: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.4 3.6 8.5s-1.2 6.1-3.6 8.5c-2.4-2.4-3.6-5.4-3.6-8.5S9.6 5.9 12 3.5z" fill="none" stroke="currentColor" stroke-width="2"/>',
    bell: '<path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 4 1.5 5.5 1.5 5.5H5S6.5 14 6.5 10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10 18.5a2.2 2.2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    calendar: '<rect x="3.5" y="5.5" width="17" height="15" rx="2.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3.5 10h17M8 3v4.5M16 3v4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    music: '<path d="M9 18V6l10-2v12" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16.5" cy="16" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/>',
    camera: '<rect x="3" y="7" width="18" height="13" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="13.5" r="3.6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.5 7l1.4-2.5h4.2L15.5 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  };
  const icon = (name, size = 24, cls = "") =>
    `<svg viewBox="0 0 24 24" width="${size}" height="${size}" class="${cls}" aria-hidden="true">${ICONS[name] || ICONS.grid}</svg>`;

  global.Art = { weather, horoscope, learning, health, family, poster, subject, avatar, icon, ICONS };
})(window);

/* ══════════════════════════════════════════════════════════════
   頻道動態層 fx()：疊在實拍圖之上、scrim 之下。
   純 SVG + SMIL/CSS，不吃 JS 主執行緒，reduced-motion 會自動停。
   ══════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  const A = global.Art;
  let n = 0;
  const uid = (p) => `${p}${(++n).toString(36)}`;
  function rnd(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  const svg = (inner) =>
    `<svg class="fx__svg" viewBox="0 0 1280 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;

  /* 天氣：三層視差雨 + 玻璃上緩慢滑下的水珠 + 偶爾一道遠方閃電 */
  function fxWeather() {
    const g = uid("fw"), r = rnd(19);
    let rain = "";
    for (let L = 0; L < 3; L++) {
      const count = [40, 28, 16][L];
      const op = [0.13, 0.2, 0.3][L];
      const len = [20, 34, 54][L];
      const dur = [1.25, 0.85, 0.58][L];
      let lines = "";
      for (let i = 0; i < count; i++) {
        const x = (r() * 1560 - 140).toFixed(0), y = (r() * 800).toFixed(0);
        lines += `<line x1="${x}" y1="${y}" x2="${(+x - len * 0.3).toFixed(0)}" y2="${(+y + len).toFixed(0)}"
                   stroke="#DCEBFF" stroke-width="${(0.9 + L * 0.5).toFixed(1)}" stroke-linecap="round" opacity="${op}"/>`;
      }
      rain += `<g>${lines}<animateTransform attributeName="transform" type="translate"
                values="0 -400;-120 400" dur="${dur}s" repeatCount="indefinite"/></g>`;
    }
    // 玻璃水珠：慢慢往下滑，拖一條細細的水痕
    let drops = "";
    for (let i = 0; i < 9; i++) {
      const x = (60 + r() * 1160).toFixed(0);
      const delay = (r() * 9).toFixed(1), dur = (7 + r() * 7).toFixed(1);
      const rr = (1.6 + r() * 2.6).toFixed(1);
      drops += `<g opacity="0">
        <line x1="${x}" y1="-30" x2="${x}" y2="6" stroke="#CFE3FA" stroke-width="1" opacity=".35"/>
        <ellipse cx="${x}" cy="0" rx="${rr}" ry="${(rr * 1.5).toFixed(1)}" fill="#E8F3FF" opacity=".55"/>
        <animateTransform attributeName="transform" type="translate" values="0 -40;0 860"
          dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.85;1"
          dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
      </g>`;
    }
    return svg(
      `<defs><linearGradient id="${g}f" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
       </linearGradient></defs>
       <rect width="1280" height="800" fill="url(#${g}f)" opacity="0">
         <animate attributeName="opacity" values="0;0;.9;0;.5;0;0" keyTimes="0;.72;.745;.775;.79;.815;1"
                  dur="17s" repeatCount="indefinite"/></rect>
       ${rain}${drops}`);
  }

  /* 命理：星塵飄移 + 金色連線呼吸 + 偶爾一顆流星 */
  function fxHoroscope() {
    const r = rnd(53);
    let dust = "";
    for (let i = 0; i < 90; i++) {
      const x = (r() * 1280).toFixed(0), y = (r() * 800).toFixed(0);
      const rad = (0.5 + r() * 1.7).toFixed(2);
      const dur = (3 + r() * 6).toFixed(1), rise = (18 + r() * 34).toFixed(0);
      dust += `<circle cx="${x}" cy="${y}" r="${rad}" fill="#FFE6B0" opacity="${(0.2 + r() * 0.6).toFixed(2)}">
        <animate attributeName="opacity" values=".1;.85;.1" dur="${dur}s" repeatCount="indefinite"/>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -${rise};0 0"
          dur="${(dur * 3).toFixed(1)}s" repeatCount="indefinite"/></circle>`;
    }
    let meteors = "";
    for (let i = 0; i < 3; i++) {
      const x = (300 + r() * 700).toFixed(0), y = (60 + r() * 200).toFixed(0);
      const begin = (4 + i * 9 + r() * 5).toFixed(1);
      meteors += `<g opacity="0">
        <line x1="${x}" y1="${y}" x2="${(+x - 130).toFixed(0)}" y2="${(+y + 78).toFixed(0)}"
              stroke="#FFF3D4" stroke-width="2" stroke-linecap="round"/>
        <animate attributeName="opacity" values="0;1;0" dur="1.1s" begin="${begin}s" repeatCount="indefinite"/>
        <animateTransform attributeName="transform" type="translate" values="120 -70;-120 70"
          dur="1.1s" begin="${begin}s" repeatCount="indefinite"/></g>`;
    }
    return svg(`${dust}${meteors}`);
  }

  /* 健康：清晨的呼吸光暈 + 緩緩上浮的光點（配合「深呼吸」的節奏，4 秒一次） */
  function fxHealth() {
    const g = uid("fh"), r = rnd(71);
    let motes = "";
    for (let i = 0; i < 26; i++) {
      const x = (r() * 1280).toFixed(0);
      const dur = (11 + r() * 13).toFixed(1), delay = (r() * 12).toFixed(1);
      const rad = (1.4 + r() * 3).toFixed(1);
      motes += `<circle cx="${x}" cy="860" r="${rad}" fill="#BFF6DA" opacity="0">
        <animateTransform attributeName="transform" type="translate" values="0 0;${(r() * 90 - 45).toFixed(0)} -900"
          dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;.55;.45;0" keyTimes="0;.15;.7;1"
          dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/></circle>`;
    }
    return svg(
      `<defs><radialGradient id="${g}b" cx=".5" cy=".62" r=".5">
         <stop offset="0" stop-color="#05CE78" stop-opacity=".26"/><stop offset="1" stop-color="#05CE78" stop-opacity="0"/>
       </radialGradient></defs>
       <ellipse cx="640" cy="500" rx="620" ry="380" fill="url(#${g}b)">
         <animate attributeName="rx" values="560;660;560" dur="8s" repeatCount="indefinite"/>
         <animate attributeName="ry" values="340;410;340" dur="8s" repeatCount="indefinite"/>
         <animate attributeName="opacity" values=".55;1;.55" dur="8s" repeatCount="indefinite"/>
       </ellipse>${motes}`);
  }

  /* 學習：緩慢上浮的幾何色塊，像教具在光裡飄 */
  function fxLearning() {
    const r = rnd(89);
    const cols = ["#F2B33D", "#5FD3F3", "#FF8FA3", "#8DE28D", "#B47CF0"];
    let out = "";
    for (let i = 0; i < 18; i++) {
      const x = (r() * 1280).toFixed(0), y = (r() * 800).toFixed(0);
      const s = (10 + r() * 26).toFixed(0), c = cols[(r() * cols.length) | 0];
      const op = (0.12 + r() * 0.2).toFixed(2), dur = (9 + r() * 11).toFixed(1);
      const k = (r() * 3) | 0;
      const shape = k === 0
        ? `<circle r="${(s / 2)}" fill="${c}" opacity="${op}"/>`
        : k === 1
        ? `<rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" rx="${(s * 0.28).toFixed(0)}" fill="${c}" opacity="${op}"/>`
        : `<path d="M0 ${-s / 2} L${s / 2} ${s / 2} L${-s / 2} ${s / 2} Z" fill="${c}" opacity="${op}"/>`;
      out += `<g transform="translate(${x} ${y})">${shape}
        <animateTransform attributeName="transform" type="translate" additive="sum"
          values="0 0;${(r() * 30 - 15).toFixed(0)} -34;0 0" dur="${dur}s" repeatCount="indefinite"/>
        <animateTransform attributeName="transform" type="rotate" additive="sum"
          values="0;${(r() * 60 - 30).toFixed(0)};0" dur="${(+dur * 1.4).toFixed(1)}s" repeatCount="indefinite"/></g>`;
    }
    return svg(out);
  }

  const FX = { weather: fxWeather, horoscope: fxHoroscope, health: fxHealth, learning: fxLearning };
  A.fx = (id) => (FX[id] ? `<div class="fx">${FX[id]()}</div>` : "");
})(window);

/* 在地新聞：SVG 打底（清晨小鎮街景）＋ 動態層（晨霧與遠處車燈） */
(function (global) {
  "use strict";
  const A = global.Art;
  let n = 0;
  const uid = (p) => `${p}n${(++n).toString(36)}`;
  function rnd(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

  A.news = function (w = 1280, h = 720) {
    const g = uid("nw"), r = rnd(131);
    let win = "";
    for (let i = 0; i < 26; i++) {
      const x = (r() * w).toFixed(0), y = (h * 0.5 + r() * h * 0.28).toFixed(0);
      const bw = (10 + r() * 16).toFixed(0), bh = (12 + r() * 20).toFixed(0);
      win += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="2" fill="#FFD9A0" opacity="${(0.12 + r() * 0.4).toFixed(2)}"/>`;
    }
    let front = `M0 ${h} L0 ${h * 0.58}`;
    let x = 0;
    while (x < w) {
      const bw = 70 + r() * 110, bh = h * (0.16 + r() * 0.2);
      front += ` L${x.toFixed(0)} ${(h * 0.74 - bh).toFixed(0)} L${(x + bw).toFixed(0)} ${(h * 0.74 - bh).toFixed(0)}`;
      x += bw + 6;
    }
    front += ` L${w} ${h * 0.6} L${w} ${h} Z`;
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="${g}s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1B2334"/><stop offset=".45" stop-color="#3A3B47"/>
          <stop offset=".7" stop-color="#7A5C43"/><stop offset="1" stop-color="#3A2A20"/>
        </linearGradient>
        <radialGradient id="${g}u" cx=".5" cy=".72" r=".42">
          <stop offset="0" stop-color="#FFC98A" stop-opacity=".62"/><stop offset="1" stop-color="#FFC98A" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#${g}s)"/>
      <rect width="${w}" height="${h}" fill="url(#${g}u)"/>
      <path d="${front}" fill="#181B23"/>${win}
      <rect y="${h * 0.86}" width="${w}" height="${h * 0.14}" fill="#0E1116" opacity=".7"/>`
      + `</svg>`;
  };

  A.fxNews = function () {
    const r = rnd(151);
    let mist = "";
    for (let i = 0; i < 5; i++) {
      const y = (300 + r() * 380).toFixed(0), ry = (28 + r() * 46).toFixed(0);
      const dur = (34 + r() * 26).toFixed(0);
      mist += `<ellipse cx="-300" cy="${y}" rx="420" ry="${ry}" fill="#CFDCEA" opacity="${(0.05 + r() * 0.06).toFixed(2)}">
        <animateTransform attributeName="transform" type="translate" values="0 0;1900 0" dur="${dur}s"
          begin="${(r() * 20).toFixed(0)}s" repeatCount="indefinite"/></ellipse>`;
    }
    return `<div class="fx"><svg class="fx__svg" viewBox="0 0 1280 800" preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${mist}</svg></div>`;
  };
})(window);

/* 讓 fx() 認得 news */
(function (global) {
  const A = global.Art, prev = A.fx;
  A.fx = (id) => (id === "news" ? A.fxNews() : prev(id));
})(window);

/* ══════════════════════════════════════════════════════════════
   AI 供應商識別標（示範用的簡化幾何近似，非官方素材）
   正式上線前請換成各家授權的官方 logo。
   ══════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  const A = global.Art;
  const BRANDS = {
    padclaw: { bg: "#0B1420", fg: "#18DFA6", svg:
      '<rect x="3.2" y="3.2" width="25.6" height="25.6" rx="8.2" fill="none" stroke="currentColor" stroke-width="2"/>' +
      '<ellipse cx="11" cy="13.8" rx="1.9" ry="2.5" transform="rotate(-20 11 13.8)"/>' +
      '<ellipse cx="16" cy="12.5" rx="2" ry="2.65"/>' +
      '<ellipse cx="21" cy="13.8" rx="1.9" ry="2.5" transform="rotate(20 21 13.8)"/>' +
      '<path d="M16 17.6c3.9 0 6.3 2.3 6.3 4.6 0 1.85-1.75 2.75-3.47 2.25-1.8-.54-3.83-.54-5.63 0-1.72.5-3.47-.4-3.47-2.25 0-2.3 2.38-4.6 6.27-4.6Z"/>' },
    /* OpenAI：六摺結的簡化幾何 */
    openai: { bg: "#0B1512", fg: "#10A37F", svg:
      '<g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round">' +
      '<path d="M16 5.6 24.2 10.3v9.4L16 24.4 7.8 19.7v-9.4z"/>' +
      '<path d="M16 5.6v9.4l8.2 4.7M16 15v9.4M16 15 7.8 19.7"/></g>' },
    /* Gemini：四芒星 */
    gemini: { bg: "#0C1424", fg: "#5B8DEF", svg:
      '<path d="M16 3.4c1.1 6.3 3.1 8.3 9.4 9.4-6.3 1.1-8.3 3.1-9.4 9.4-1.1-6.3-3.1-8.3-9.4-9.4 6.3-1.1 8.3-3.1 9.4-9.4Z" transform="translate(0 3.2)"/>' +
      '<path d="M25.6 21.4c.5 2.6 1.3 3.4 3.9 3.9-2.6.5-3.4 1.3-3.9 3.9-.5-2.6-1.3-3.4-3.9-3.9 2.6-.5 3.4-1.3 3.9-3.9Z" opacity=".7"/>' },
    /* Claude：放射狀星芒 */
    claude: { bg: "#241610", fg: "#D97757", svg:
      '<g stroke="currentColor" stroke-width="2.4" stroke-linecap="round">' +
      [0,1,2,3,4,5,6,7,8,9,10].map(i=>{
        const a=(i/11)*Math.PI*2-Math.PI/2;
        const x1=(16+Math.cos(a)*3.4).toFixed(1), y1=(16+Math.sin(a)*3.4).toFixed(1);
        const x2=(16+Math.cos(a)*11.4).toFixed(1), y2=(16+Math.sin(a)*11.4).toFixed(1);
        return `<path d="M${x1} ${y1}L${x2} ${y2}"/>`;
      }).join("") + '</g>' },
    /* 只在本機：晶片 */
    local: { bg: "#151A21", fg: "#98A2B3", svg:
      '<g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round">' +
      '<rect x="9" y="9" width="14" height="14" rx="3.4"/><rect x="13.4" y="13.4" width="5.2" height="5.2" rx="1.4"/>' +
      '<path d="M13 9V5.4M19 9V5.4M13 26.6V23M19 26.6V23M9 13H5.4M9 19H5.4M26.6 13H23M26.6 19H23"/></g>' },
  };

  A.brand = (id, size = 28) => {
    const b = BRANDS[id] || BRANDS.local;
    return `<span class="brand" style="background:${b.bg};color:${b.fg}">
      <svg viewBox="0 0 32 32" width="${size}" height="${size}" fill="currentColor" aria-hidden="true">${b.svg}</svg></span>`;
  };
  A.BRANDS = BRANDS;
})(window);

/* 股市：SVG 打底（清晨書桌）＋ 動態層（緩慢掃過的光）＋ 會自己畫出來的走勢線 */
(function (global) {
  "use strict";
  const A = global.Art;
  let n = 0;
  const uid = (p) => `${p}m${(++n).toString(36)}`;

  A.market = function (w = 1280, h = 720) {
    const g = uid("mk");
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="${g}b" x1="0" y1="0" x2=".4" y2="1">
          <stop offset="0" stop-color="#141A20"/><stop offset=".55" stop-color="#20272E"/><stop offset="1" stop-color="#2E241A"/>
        </linearGradient>
        <radialGradient id="${g}l" cx=".82" cy=".22" r=".55">
          <stop offset="0" stop-color="#FFD9A0" stop-opacity=".34"/><stop offset="1" stop-color="#FFD9A0" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#${g}b)"/>
      <rect width="${w}" height="${h}" fill="url(#${g}l)"/>
      <rect y="${h * 0.66}" width="${w}" height="${h * 0.34}" fill="#120F0B" opacity=".55"/>
      <ellipse cx="${w * 0.34}" cy="${h * 0.78}" rx="${w * 0.3}" ry="42" fill="#000" opacity=".35"/>
    </svg>`;
  };

  A.fxMarket = function () {
    const g = uid("fm");
    return `<div class="fx"><svg class="fx__svg" viewBox="0 0 1280 800" preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs><linearGradient id="${g}s" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#FFE7BE" stop-opacity="0"/>
        <stop offset=".5" stop-color="#FFE7BE" stop-opacity=".1"/>
        <stop offset="1" stop-color="#FFE7BE" stop-opacity="0"/></linearGradient></defs>
      <rect x="-520" y="0" width="520" height="800" fill="url(#${g}s)">
        <animateTransform attributeName="transform" type="translate" values="0 0;1900 0"
          dur="13s" repeatCount="indefinite"/></rect>
    </svg></div>`;
  };

  /* 走勢線：載入時自己畫出來（stroke-dash 動畫），漲綠跌紅 */
  A.spark = function (pts, up, w = 260, h = 64) {
    const g = uid("sp");
    const min = Math.min(...pts), max = Math.max(...pts), rng = max - min || 1;
    const d = pts.map((v, i) =>
      `${i ? "L" : "M"}${((i / (pts.length - 1)) * w).toFixed(1)} ${(h - ((v - min) / rng) * (h - 8) - 4).toFixed(1)}`
    ).join(" ");
    const c = up ? "#05CE78" : "#F0728F";
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs><linearGradient id="${g}f" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${c}" stop-opacity=".3"/><stop offset="1" stop-color="${c}" stop-opacity="0"/>
      </linearGradient></defs>
      <path d="${d} L${w} ${h} L0 ${h} Z" fill="url(#${g}f)" opacity="0">
        <animate attributeName="opacity" values="0;1" dur=".7s" begin=".65s" fill="freeze"/></path>
      <path d="${d}" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"
            pathLength="1" stroke-dasharray="1" stroke-dashoffset="1">
        <animate attributeName="stroke-dashoffset" values="1;0" dur="1.1s" fill="freeze"/></path>
    </svg>`;
  };
})(window);

(function (global) {
  const A = global.Art, prev = A.fx;
  A.fx = (id) => (id === "market" ? A.fxMarket() : prev(id));
})(window);
