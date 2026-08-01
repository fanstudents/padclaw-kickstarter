# PadClaw OS — Theater Mode 平板顯示劇院

給 [padclaw-kickstarter](https://github.com/fanstudents/padclaw-kickstarter) 募資專案用的
**可互動裝置端 UI 展示**。整台平板（含外框、鏡頭、喇叭孔、機身按鍵、桌面陰影）都是
前端畫出來的，開啟 `index.html` 就能直接對著鏡頭或投影展示。

設計語言直接依循該 repo 的 `app-screens.html`「設計規範 · Design Tokens」：
瀏覽型畫面走 **Netflix / Apple tvOS**（billboard 大看板、shelf 卡列、焦點放大 110% ＋
白色高光邊、背景 ambient glow 隨焦點染色、毛玻璃 chrome），任務型畫面維持
深炭底、品牌綠 `#05CE78`、超大字級的 senior-friendly 單任務設計。

> ⚠️ 全部為 **示範資料（demo data）**，軟體為規劃中（planned software），非實際出貨版本。

---

## 快速開始

```bash
python3 -m http.server 4321
```

然後開 <http://localhost:4321>。純靜態、零建置、零相依套件——
也可以直接把整個資料夾丟進 GitHub Pages 或 padclaw-kickstarter repo 的子目錄。

## 五個分頁

| 分頁 | 內容 |
| --- | --- |
| **首頁 Home** | Billboard 輪播（4 則，11 秒換一則）＋ 三條卡列：你的頻道／接著上次繼續／即將推出 |
| **商城 Store** | 場景 Scenes・技能 Skills・應用 Apps 三個分頁，各含精選卡列與商品格狀清單 |
| **家庭 Family** | 6 位成員，選誰就顯示「他看得到什麼／永不分享什麼」與快速動作 |
| **場景 Channels** | 總覽 ＋ 六個全幅頻道：天氣・學習・命理・健康・在地新聞・股市，每個都有實拍封面與動態效果層（雨、星塵、呼吸光、晨霧、掃光） |
| **設定 Settings** | 使用額度（Kickstarter 創始特權：$500 贊助含 6 個月 AI 額度、創始機編號 0117/3,000、台灣製造）＋ 細節設定（AI 供應商切換：PadClaw 預設／OpenAI／Gemini／Claude／純本機、15 個開關、裝置資訊、資料刪除） |

## 語音

「念給我聽」「Read aloud」等按鈕會播放預先合成的高品質語音（`assets/audio/`，
OpenAI `gpt-4o-mini-tts` 的 nova 聲線，中英各一套）。展示現場不需網路、不需金鑰；
檔案缺失時自動退回系統 `speechSynthesis`。左下角會出現「播放中」膠囊，點一下即停。

## 操作方式

- **滑鼠**：移到哪，焦點就在哪；點擊進入
- **鍵盤（比照電視遙控器）**：`← → ↑ ↓` 移動焦點、`Enter` 選取、`Esc` 返回、`V` 叫出語音疊層
- **裝置外的遙控列**：`中文 / English` 切換介面語言、語音疊層、夜間模式、重播開機片頭

## 檔案結構

```
index.html                     裝置外框、系統 chrome、外部 HUD
assets/css/base.css            設計 token、平板外框、狀態列與 tab 列、片頭、共用元件
assets/css/views.css           五個分頁的版面
assets/js/art.js               程式繪製的 SVG 背景／海報／圖標／幾何頭像
assets/js/data.js              全部示範資料（雙語，L(en, zh)）
assets/js/app.js               路由、tvOS 焦點引擎、五類畫面的 render
assets/img/hero/*.jpg          頻道封面實拍圖（AI 生成）
assets/img/people/*.jpg        家庭成員生活感人像（AI 生成）
assets/img/logo-options/*.png  gpt-image-2 生成的 5 個 logo 提案（見 logo-options.html）
assets/audio/*.mp3             預先合成的示範語音（OpenAI TTS，雙語共 20 段）
assets/img/padclaw-mark.svg    品牌標（單色外框＋綠色掌印，20px 也讀得出來）
assets/img/padclaw-appicon.svg App icon 版本（綠色漸層底＋深色掌印）
```

### 圖像的雙層設計

每一張封面都是 **SVG 打底 + 實拍圖淡入覆蓋**（`artLayer()`）。
圖檔沒載到、離線展示、或之後要換圖，畫面都不會開天窗——會自動退回程式繪製的 SVG 版本。
人像同理（`face()`），退回幾何頭像。

## 品牌標

`Pad`（平板外框）＋`Claw`（掌印）。8pt 幾何、2.2 圓頭描邊，與系統圖標同一套語言。
- `padclaw-mark.svg`：外框吃 `currentColor`，掌印固定品牌綠 → 深色淺色底都能用
- `padclaw-appicon.svg`：綠色漸層底 ＋ 深色掌印 ＋ 頂部亮邊，用於開機片頭與商店上架

## 換掉示範資料

所有文案、成員、商品、額度數字都集中在 `assets/js/data.js`，
每一則都是 `L("English", "中文")`。改那一個檔案就好，不必動版面。

## 已知的刻意取捨

- 時間固定 **9:41 AM**（業界慣例的展示時間，也讓「晨間簡報」情境成立）
- 溫度一律 `°F`（依規範，美國市場）
- 商城的格狀清單只顯示前 4 項；卡列可橫向捲動
- 開關、勾選、簽到都是真的會動的狀態，但重新整理就回到初始值
