// ===== State =====
let currentVersion = null;
let currentLang = 'en';
let highlightEnabled = true;

// UI labels for language switching
const UI_LABELS = {
  en: {
    nav_explore: 'Explore', nav_start: 'Start a project', nav_search: 'Search projects', nav_login: 'Log in',
    bc_cat: 'Technology', bc_sub: 'Hardware',
    ph_video: 'Campaign video — pending from design team',
    ph_concept: 'Product concept render — pending from design team',
    ph_agents: 'Agent UI showcase — pending from design team',
    ph_hardware: 'Hardware photos / exploded view — pending from design team',
    ph_exploded: 'Exploded view diagram — pending from design team',
    ph_team: 'Team photo / factory visit — pending from design team',
    creator_by: 'By', badge_first: 'First created',
    tab_story: 'Story', tab_faq: 'FAQ',
    stat_goal: 'pledged of $100,000 goal', stat_backers: 'backers', stat_days: 'days to go',
    btn_back: 'Back this project', btn_remind: 'Remind me', btn_select: 'Select this reward',
    includes_label: 'Includes', free_ship: 'Free shipping',
    badge_limited: 'Limited', badge_popular: 'Most popular',
    r_case: 'Protective case × 1', r_cable: 'USB-C charging cable × 1',
    r_stand: 'Magnetic desktop stand × 1', r_sub: '1-year AI agent access included',
    r1_delivery: 'Est. delivery: Mar 2026', r1_backers: '24 backers',
    r2_save: 'Save $400 — 40% off', r2_delivery: 'Est. delivery: Jul 2026', r2_limit: 'Limited — 200 of 200 remaining', r2_backers: '0 backers',
    r3_save: 'Save $300 — 30% off', r3_delivery: 'Est. delivery: Jul 2026', r3_limit: 'Limited — 500 of 500 remaining', r3_backers: '0 backers',
    r4_save: 'Save $200 — 20% off', r4_delivery: 'Est. delivery: Jul 2026', r4_backers: '0 backers',
    r5_save: 'Save $699', r5_delivery: 'Est. delivery: Jul 2026', r5_backers: '0 backers',
    r6_delivery: 'Est. delivery: Aug 2026', r6_limit: 'Limited — 50 remaining', r6_backers: '0 backers',
    empty_updates: 'No updates yet', empty_comments: 'No comments yet',
    spec_display: 'Display', spec_cpu: 'Processor', spec_ram: 'Memory', spec_storage: 'Storage',
    spec_os: 'OS', spec_conn: 'Connectivity', spec_batt: 'Battery', spec_audio: 'Audio', spec_other: 'Other',
    tl1: 'Kickstarter campaign launch', tl2: 'Engineering Validation Test (EVT)',
    tl3: 'Design Validation Test (DVT) + software beta', tl4: 'Production Validation Test (PVT)',
    tl5: 'First units ship to backers',
    ft_about: 'About', ft_support: 'Support', ft_more: 'More', ft_connect: 'Connect',
  },
  zh: {
    nav_explore: '探索', nav_start: '發起專案', nav_search: '搜尋專案', nav_login: '登入',
    bc_cat: '科技', bc_sub: '硬體',
    ph_video: '影片區塊（待設計師處理）',
    ph_concept: '產品概念圖（待設計師處理）',
    ph_agents: 'Agent 介面展示（待設計師處理）',
    ph_hardware: '硬體實拍照 / 爆炸圖（待設計師處理）',
    ph_exploded: '爆炸圖（待設計師處理）',
    ph_team: '團隊照片 / 工廠參訪（待設計師處理）',
    creator_by: '由', badge_first: '首次發起',
    tab_story: '專案內容', tab_faq: '常見問題',
    stat_goal: '已募集（目標 $100,000）', stat_backers: '贊助者', stat_days: '剩餘天數',
    btn_back: '贊助這個專案', btn_remind: '儲存專案', btn_select: '選擇此方案',
    includes_label: '包含', free_ship: '免運',
    badge_limited: '限量', badge_popular: '最受歡迎',
    r_case: '保護殼 × 1', r_cable: 'USB-C 充電線 × 1',
    r_stand: '磁吸立架 × 1', r_sub: '一年 AI 助手使用權',
    r1_delivery: '預計出貨：2026 年 3 月', r1_backers: '24 位贊助者',
    r2_save: '省 $400 — 6 折', r2_delivery: '預計出貨：2026 年 7 月', r2_limit: '限量 200 組', r2_backers: '0 位贊助者',
    r3_save: '省 $300 — 7 折', r3_delivery: '預計出貨：2026 年 7 月', r3_limit: '限量 500 組', r3_backers: '0 位贊助者',
    r4_save: '省 $200 — 8 折', r4_delivery: '預計出貨：2026 年 7 月', r4_backers: '0 位贊助者',
    r5_save: '省 $699', r5_delivery: '預計出貨：2026 年 7 月', r5_backers: '0 位贊助者',
    r6_delivery: '預計出貨：2026 年 8 月', r6_limit: '限量 50 組', r6_backers: '0 位贊助者',
    empty_updates: '尚無更新', empty_comments: '尚無留言',
    spec_display: '螢幕', spec_cpu: '處理器', spec_ram: '記憶體', spec_storage: '儲存空間',
    spec_os: '作業系統', spec_conn: '連線', spec_batt: '電池', spec_audio: '音效', spec_other: '其他',
    tl1: 'Kickstarter 募資啟動', tl2: 'EVT 工程驗證',
    tl3: 'DVT 設計驗證 + 軟體 Beta', tl4: 'PVT 量產驗證',
    tl5: '首批出貨',
    ft_about: '關於', ft_support: '支援', ft_more: '更多', ft_connect: '社群',
  },
};

// ===== Version Switcher =====
function initVersionSwitcher() {
  const container = document.getElementById('vs-buttons');
  const collapseBtn = document.getElementById('vs-collapse');
  const body = document.getElementById('vs-body');
  const highlightCb = document.getElementById('vs-highlight');

  // Build version buttons
  VERSIONS.forEach((v, i) => {
    const btn = document.createElement('button');
    btn.className = 'vs-btn' + (i === 0 ? ' active' : '');
    btn.dataset.version = v.id;
    btn.textContent = v.label[currentLang] || v.label.en;
    btn.addEventListener('click', () => switchVersion(v.id));
    container.appendChild(btn);
  });

  // Language toggle
  document.querySelectorAll('.vs-lang').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang === currentLang) return;
      currentLang = lang;
      document.querySelectorAll('.vs-lang').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
      // Update button labels
      document.querySelectorAll('.vs-btn').forEach(b => {
        const v = VERSIONS.find(ver => ver.id === b.dataset.version);
        if (v) b.textContent = v.label[lang] || v.label.en;
      });
      // Re-apply current version in new language
      applyVersion(currentVersion, false);
      applyUILabels();
    });
  });

  // Collapse
  let collapsed = false;
  collapseBtn.addEventListener('click', () => {
    collapsed = !collapsed;
    body.style.display = collapsed ? 'none' : '';
    collapseBtn.innerHTML = collapsed ? '&#x25B2;' : '&#x25BC;';
  });

  // Highlight toggle
  highlightCb.addEventListener('change', (e) => {
    highlightEnabled = e.target.checked;
    if (!highlightEnabled) {
      document.querySelectorAll('.copy-changed').forEach(el => el.classList.remove('copy-changed'));
    }
  });

  // Apply version A on load
  switchVersion('a', true);
}

function switchVersion(versionId, isInit = false) {
  const version = VERSIONS.find(v => v.id === versionId);
  if (!version) return;

  const prevVersion = currentVersion;
  currentVersion = version;

  // Update button states
  document.querySelectorAll('.vs-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.version === versionId);
  });

  // Update description
  const desc = version.description[currentLang] || version.description.en;
  document.getElementById('vs-desc').textContent = desc;

  applyVersion(version, isInit, prevVersion);

  if (!isInit) {
    document.getElementById('project-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function applyVersion(version, isInit = false, prevVersion = null) {
  if (!version) return;
  const lang = currentLang;
  const copy = version.copy[lang] || version.copy.en;
  const prevCopy = prevVersion ? (prevVersion.copy[lang] || prevVersion.copy.en) : null;

  // Update description
  const desc = version.description[lang] || version.description.en;
  document.getElementById('vs-desc').textContent = desc;

  document.querySelectorAll('[data-copy]').forEach(el => {
    const key = el.dataset.copy;
    const newContent = copy[key];
    if (newContent === undefined) return;

    const newTrimmed = newContent.trim();
    const changed = !isInit && prevCopy && prevCopy[key] !== undefined
      && prevCopy[key].trim() !== newTrimmed;

    el.innerHTML = newTrimmed;

    if (changed && highlightEnabled) {
      el.classList.remove('copy-changed');
      void el.offsetWidth; // force reflow for re-animation
      el.classList.add('copy-changed');
      setTimeout(() => el.classList.remove('copy-changed'), 2200);
    }
  });
}

function applyUILabels() {
  const labels = UI_LABELS[currentLang] || UI_LABELS.en;
  document.querySelectorAll('[data-ui]').forEach(el => {
    const key = el.dataset.ui;
    if (labels[key] !== undefined) {
      if (el.tagName === 'INPUT') {
        el.placeholder = labels[key];
      } else {
        el.textContent = labels[key];
      }
    }
  });
}

// ===== Main init =====
document.addEventListener('DOMContentLoaded', () => {
  initVersionSwitcher();
  initCompare();
  applyUILabels();

  // Tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${target}`).classList.add('active');
    });
  });

  // FAQ
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  animateFunding();

  document.querySelectorAll('.btn-reward').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = currentLang === 'zh'
        ? '感謝您的關注！這是示範頁面，贊助功能尚未開通。'
        : 'Thanks for your interest! This is a demo page — pledging is not yet available.';
      alert(msg);
    });
  });

  document.getElementById('btn-back').addEventListener('click', () => {
    const msg = currentLang === 'zh'
      ? '感謝您的關注！這是示範頁面，贊助功能尚未開通。'
      : 'Thanks for your interest! This is a demo page — pledging is not yet available.';
    alert(msg);
  });

  document.getElementById('btn-remind').addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const label = currentLang === 'zh' ? '已儲存' : 'Saved';
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--ks-green)" stroke="var(--ks-green)" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg> ${label}`;
    btn.style.borderColor = 'var(--ks-green)';
    btn.style.color = 'var(--ks-green-dark)';
  });
});

// ===== Funding animation =====
function animateFunding() {
  const targetPledged = 61240;
  const targetBackers = 299;
  const goalAmount = 100000;
  const pledgedEl = document.getElementById('stat-pledged');
  const backersEl = document.getElementById('stat-backers');
  const progressEl = document.getElementById('progress-fill');
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const currentPledged = Math.floor(targetPledged * ease);
    const currentBackers = Math.floor(targetBackers * ease);
    pledgedEl.textContent = `$${currentPledged.toLocaleString()}`;
    backersEl.textContent = currentBackers.toLocaleString();
    progressEl.style.width = `${(currentPledged / goalAmount) * 100}%`;
    if (progress < 1) requestAnimationFrame(step);
  }

  setTimeout(() => requestAnimationFrame(step), 300);
}

// ===== COMPARE OVERLAY =====
const COMPARE_SECTIONS = [
  { key: 'title', label: 'Title', group: 'Hero' },
  { key: 'subtitle', label: 'Subtitle', group: 'Hero' },
  { key: 's1_heading', label: 'Section 1 Heading', group: 'Opening' },
  { key: 's1_body', label: 'Section 1 Body', group: 'Opening', isHTML: true },
  { key: 's2_heading', label: 'Section 2 Heading', group: 'Why PadClaw' },
  { key: 's2_body', label: 'Section 2 Body', group: 'Why PadClaw', isHTML: true },
  { key: 's2_features', label: 'Feature Bullets', group: 'Why PadClaw', isHTML: true },
  { key: 's3_heading', label: 'Agents Section Heading', group: 'AI Agents' },
  { key: 's3_intro', label: 'Agents Intro', group: 'AI Agents' },
  { key: 'agent1_title', label: 'Agent 1 — Title', group: 'AI Agents', isAgent: true, agentNum: 1 },
  { key: 'agent1_desc', label: 'Agent 1 — Description', group: 'AI Agents', isAgent: true, agentNum: 1 },
  { key: 'agent2_title', label: 'Agent 2 — Title', group: 'AI Agents', isAgent: true, agentNum: 2 },
  { key: 'agent2_desc', label: 'Agent 2 — Description', group: 'AI Agents', isAgent: true, agentNum: 2 },
  { key: 'agent3_title', label: 'Agent 3 — Title', group: 'AI Agents', isAgent: true, agentNum: 3 },
  { key: 'agent3_desc', label: 'Agent 3 — Description', group: 'AI Agents', isAgent: true, agentNum: 3 },
  { key: 'agent4_title', label: 'Agent 4 — Title', group: 'AI Agents', isAgent: true, agentNum: 4 },
  { key: 'agent4_desc', label: 'Agent 4 — Description', group: 'AI Agents', isAgent: true, agentNum: 4 },
  { key: 's5_heading', label: 'What\'s in the Box', group: 'Box Contents' },
  { key: 's5_body', label: 'Box Contents', group: 'Box Contents', isHTML: true },
  { key: 's7_heading', label: 'Trust Heading', group: 'Trust' },
  { key: 's7_body', label: 'Trust Body', group: 'Trust', isHTML: true },
  { key: 's9_heading', label: 'Shipping Heading', group: 'Shipping' },
  { key: 's9_body', label: 'Shipping Body', group: 'Shipping', isHTML: true },
  { key: 's10_heading', label: 'Risks Heading', group: 'Risks' },
  { key: 's10_body', label: 'Risks Body', group: 'Risks', isHTML: true },
  { key: 'r2_title', label: 'Super Early Bird Title', group: 'Rewards' },
  { key: 'r2_desc', label: 'Super Early Bird Desc', group: 'Rewards' },
  { key: 'r3_title', label: 'Early Bird Title', group: 'Rewards' },
  { key: 'r3_desc', label: 'Early Bird Desc', group: 'Rewards' },
  { key: 'faq1_q', label: 'FAQ 1 — Question', group: 'FAQ' },
  { key: 'faq1_a', label: 'FAQ 1 — Answer', group: 'FAQ' },
  { key: 'faq2_q', label: 'FAQ 2 — Question', group: 'FAQ' },
  { key: 'faq2_a', label: 'FAQ 2 — Answer', group: 'FAQ' },
];

let compareLang = 'en';
let compareSelections = {};

function updateCompareCount() {
  const countEl = document.getElementById('compare-count');
  if (countEl) {
    const n = Object.keys(compareSelections).length;
    countEl.textContent = n;
  }
}

function handleCellSelect(sectionKey, versionId) {
  if (compareSelections[sectionKey] === versionId) {
    delete compareSelections[sectionKey];
  } else {
    compareSelections[sectionKey] = versionId;
  }
  // Update UI for this row
  document.querySelectorAll(`.compare-cell[data-key="${sectionKey}"]`).forEach(cell => {
    const circle = cell.querySelector('.compare-cell-select');
    const isSelected = compareSelections[sectionKey] === cell.dataset.vid;
    cell.classList.toggle('is-selected', isSelected);
    if (circle) circle.classList.toggle('selected', isSelected);
  });
  updateCompareCount();
}

function renderCompare() {
  const headersEl = document.getElementById('compare-headers');
  const grid = document.getElementById('compare-grid');
  headersEl.innerHTML = '';
  grid.innerHTML = '';

  // Use only the first 3 versions (A, B, C) for comparing
  const versionsToCompare = VERSIONS.slice(0, 3);

  // ── Column headers ──
  versionsToCompare.forEach(version => {
    const header = document.createElement('div');
    header.className = 'compare-col-header';

    const badge = document.createElement('div');
    badge.className = 'compare-col-badge';
    badge.textContent = `Version ${version.id.toUpperCase()}`;

    const title = document.createElement('div');
    title.className = 'compare-col-title';
    title.textContent = version.label[compareLang] || version.label.en;

    const desc = document.createElement('div');
    desc.className = 'compare-col-desc';
    desc.textContent = version.description[compareLang] || version.description.en;

    header.appendChild(badge);
    header.appendChild(title);
    header.appendChild(desc);
    headersEl.appendChild(header);
  });

  // ── Content rows grouped by section group ──
  let lastGroup = null;

  COMPARE_SECTIONS.forEach(sec => {
    // Group label row
    if (sec.group && sec.group !== lastGroup) {
      lastGroup = sec.group;
      const groupRow = document.createElement('div');
      groupRow.className = 'compare-row';
      const groupLabel = document.createElement('div');
      groupLabel.className = 'compare-row-label';
      groupLabel.textContent = sec.group;
      groupRow.appendChild(groupLabel);
      grid.appendChild(groupRow);
    }

    // Section row with 3 cells
    const row = document.createElement('div');
    row.className = 'compare-row';

    versionsToCompare.forEach(version => {
      const copy = version.copy[compareLang] || version.copy.en;
      const val = copy[sec.key];

      const cell = document.createElement('div');
      cell.className = 'compare-cell';
      cell.dataset.vid = version.id;
      cell.dataset.key = sec.key;

      // Restore selection state
      if (compareSelections[sec.key] === version.id) {
        cell.classList.add('is-selected');
      }

      // Selection circle
      const circle = document.createElement('div');
      circle.className = 'compare-cell-select' +
        (compareSelections[sec.key] === version.id ? ' selected' : '');
      circle.addEventListener('click', (e) => {
        e.stopPropagation();
        handleCellSelect(sec.key, version.id);
      });
      cell.appendChild(circle);

      // Version badge
      const badge = document.createElement('div');
      badge.className = 'compare-cell-version';
      badge.textContent = version.id.toUpperCase();
      cell.appendChild(badge);

      if (val === undefined) {
        const empty = document.createElement('div');
        empty.className = 'compare-cell-body';
        empty.textContent = '—';
        cell.appendChild(empty);
      } else if (sec.isHTML) {
        const body = document.createElement('div');
        body.className = 'compare-cell-body';
        body.innerHTML = val;
        cell.appendChild(body);
      } else if (val.length < 80 && !val.includes('<')) {
        const t = document.createElement('div');
        t.className = 'compare-cell-title';
        t.textContent = val;
        cell.appendChild(t);
      } else {
        const body = document.createElement('div');
        body.className = 'compare-cell-body';
        body.textContent = val;
        cell.appendChild(body);
      }

      // Clicking anywhere on the cell also selects it
      cell.addEventListener('click', () => {
        handleCellSelect(sec.key, version.id);
      });

      row.appendChild(cell);
    });

    grid.appendChild(row);
  });
}

function generateVersionD() {
  const selectionCount = Object.keys(compareSelections).length;
  if (selectionCount === 0) return;

  // Build Version D copy by cherry-picking from selections, fallback to Version A
  const versionA = VERSIONS.find(v => v.id === 'a');
  const baseCopyEn = { ...(versionA.copy.en || {}) };
  const baseCopyZh = { ...(versionA.copy.zh || {}) };

  // Agent-related keys: when selecting an agent key, also copy label + tags
  const AGENT_RELATED_SUFFIXES = ['_label', '_tags'];

  Object.entries(compareSelections).forEach(([sectionKey, versionId]) => {
    const srcVersion = VERSIONS.find(v => v.id === versionId);
    if (!srcVersion) return;

    const srcEn = srcVersion.copy.en || {};
    const srcZh = srcVersion.copy.zh || {};

    // Copy the selected key
    if (srcEn[sectionKey] !== undefined) baseCopyEn[sectionKey] = srcEn[sectionKey];
    if (srcZh[sectionKey] !== undefined) baseCopyZh[sectionKey] = srcZh[sectionKey];

    // For agent keys, also copy related keys (label, tags)
    const sec = COMPARE_SECTIONS.find(s => s.key === sectionKey);
    if (sec && sec.isAgent) {
      const prefix = `agent${sec.agentNum}`;
      AGENT_RELATED_SUFFIXES.forEach(suffix => {
        const relatedKey = prefix + suffix;
        if (srcEn[relatedKey] !== undefined) baseCopyEn[relatedKey] = srcEn[relatedKey];
        if (srcZh[relatedKey] !== undefined) baseCopyZh[relatedKey] = srcZh[relatedKey];
      });
    }
  });

  // Check if Version D already exists, update it; otherwise push new
  let versionD = VERSIONS.find(v => v.id === 'd');
  if (versionD) {
    versionD.copy.en = baseCopyEn;
    versionD.copy.zh = baseCopyZh;
    versionD.description.en = `Custom mix: ${selectionCount} section(s) cherry-picked from A/B/C.`;
    versionD.description.zh = `自訂組合：從 A/B/C 挑選了 ${selectionCount} 個段落。`;
  } else {
    versionD = {
      id: 'd',
      label: { en: 'D — Custom Mix', zh: 'D — 自訂組合' },
      description: {
        en: `Custom mix: ${selectionCount} section(s) cherry-picked from A/B/C.`,
        zh: `自訂組合：從 A/B/C 挑選了 ${selectionCount} 個段落。`,
      },
      copy: { en: baseCopyEn, zh: baseCopyZh },
    };
    VERSIONS.push(versionD);

    // Add switcher button
    const container = document.getElementById('vs-buttons');
    const btn = document.createElement('button');
    btn.className = 'vs-btn';
    btn.dataset.version = 'd';
    btn.textContent = versionD.label[currentLang] || versionD.label.en;
    btn.addEventListener('click', () => switchVersion('d'));
    container.appendChild(btn);
  }

  // Close overlay and switch to Version D
  const overlay = document.getElementById('compare-overlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  switchVersion('d');
}

function initCompare() {
  const overlay = document.getElementById('compare-overlay');
  const openBtn = document.getElementById('vs-compare-btn');
  const closeBtn = document.getElementById('compare-close');
  const generateBtn = document.getElementById('compare-generate');

  openBtn.addEventListener('click', () => {
    compareLang = currentLang;
    // Sync lang buttons
    document.querySelectorAll('.compare-lang').forEach(b => {
      b.classList.toggle('active', b.dataset.clang === compareLang);
    });
    renderCompare();
    updateCompareCount();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  });

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Language switch inside compare
  document.querySelectorAll('.compare-lang').forEach(btn => {
    btn.addEventListener('click', () => {
      compareLang = btn.dataset.clang;
      document.querySelectorAll('.compare-lang').forEach(b => {
        b.classList.toggle('active', b.dataset.clang === compareLang);
      });
      renderCompare();
    });
  });

  // Generate Version D
  if (generateBtn) {
    generateBtn.addEventListener('click', generateVersionD);
  }
}

