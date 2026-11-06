# HTML-in-Canvas 研究紀錄

2026-11-06 收集。實測環境：Chromium 157.0.8103.0（Chrome 157 分支點的快照）、Chromium 159.0.8145.0、Chromium 153（不支援，用來看退路），無頭模式。

## 來源

| 來源 | 類型 | 取得方式 |
|---|---|---|
| [WICG html-in-canvas README（說明文件）](https://github.com/WICG/html-in-canvas) | 提案說明文件 | GitHub 原始檔，全文讀過 |
| [Chrome for Developers：HTML-in-Canvas in Chrome 157](https://developer.chrome.com/blog/html-in-canvas)（2026-10-26） | 官方文章 | 使用者貼上全文（網站本身連不上） |
| Chromium 原始碼 `runtime_enabled_features.json5`、`html_attribute_names.json5` | 原始碼 | 依各版本快照的 commit 讀取 |
| [MDN browser-compat-data](https://github.com/mdn/browser-compat-data) `api/HTMLCanvasElement.json`、`api/CanvasRenderingContext2D.json` | 相容性資料 | GitHub 原始檔 |
| [WICG #174 破壞性變更公告](https://github.com/WICG/html-in-canvas/issues/174) | 提案議題 | 子代理讀取 |
| [WICG #134 無障礙：只能畫直接子元素](https://github.com/WICG/html-in-canvas/issues/134) | 提案議題 | 子代理讀取（後半段為摘要） |
| [whatwg/html#11588 Add HTML-in-Canvas APIs](https://github.com/whatwg/html/pull/11588) | 標準 PR | 子代理讀取 |
| [mozilla/standards-positions#1076](https://github.com/mozilla/standards-positions/issues/1076) | 標準立場 | 子代理讀取 |
| [WebKit/standards-positions#630](https://github.com/WebKit/standards-positions/issues/630) | 標準立場 | 子代理讀取 |

尚未讀到（網站連不上）：Chrome 的技術文件（concepts、2D、WebGL、WebGPU）、[Modern Web Guidance：Expose canvas content to browser features](https://developer.chrome.com/docs/modern-web-guidance/guides/visual-design/expose-canvas-content-to-browser-features)、blink-dev 的 Intent to Ship 討論串。

## 狀態

- **Chrome**：153～156 是實驗狀態（可用 origin trial 或 `chrome://flags/#canvas-draw-element`），**157 起正式開啟**（`CanvasDrawElement` 在 157 分支點為 `stable`）。
- **屬性名稱**：155、156 同時有 `layoutsubtree` 和 `drawable`；**157 起只剩 `content="drawable"`**（`layoutsubtree` 從屬性清單移除）。
- **MDN 相容性資料**：所有介面標 Chrome 157，Firefox、Safari 不支援；`experimental: true`、`standard_track: false`。MDN 說明文件頁尚未建立。
- **標準化**：whatwg/html#11588 仍開啟（2025-08-21 開始），實作者欄位只寫 Chromium；2026-11-05 仍有審查。
- **WebKit**：standards-positions#630，2026-08-03 smfr 表示「一週後若無異議將標為 support，API 形狀仍有討論」，抓取時頁面上還沒有 support 標籤；WebKit repo 裡有實作中的 PR（#76794、#77526），bug 316240。
- **Mozilla**：standards-positions#1076 仍開啟、無正式立場。負責人 nical 2025-12-09：「我們認為把文件畫進 Canvas2D 而不是 DOM，在多個層面上都是錯誤方向」；2026-03-11：「我們希望網頁平台**遠離**用 canvas 做豐富 UI」。

## API 概要（README）

1. `<canvas content="drawable">`：canvas 的子孫元素參與排版（預設 `fallback` 是備援內容）。
2. `drawable` 屬性：要畫的元素必須標記；可巢狀（不必是 canvas 的直接子元素，#134 之後的設計）。
3. `paint` 事件：DOM 變化時觸發，`changedElements` 列出有變化的元素；`requestPaint()` 要求下一次一定觸發。
4. `drawElementImage(element, x, y[, w, h])`（2D）、`texElementSubImage2D`（WebGL）、`drawElementImageToTexture`（WebGPU）。
5. `updateElementGeometry(element, { canvasTransform, canvasClip })`：讓 DOM 位置、點擊判定、無障礙的位置資訊跟畫出來的位置一致。2D 的 `drawElementImage` 會自動做；WebGL／WebGPU 要自己呼叫。
6. 其他：`captureElementImage()`（傳給 Worker 的 `ElementImage`）、`getElementTransform()`、`getElementImageDefaultSize()`、`clearElementGeometry()`、`elementgeometryupdate` 事件。

**破壞性變更（#174，2026-09-16 公告，11-05 關閉）**：`drawElementImage()` 改回傳 `undefined`（原本回傳 DOMMatrix）；新增必填的 `drawable`；WebGPU `copyElementImageToTexture` → `drawElementImageToTexture`；WebGL `texElementImage2D` → `texElementSubImage2D` 且不再自動配置貼圖空間。網路上較早的教學可能還是舊寫法。

**不會畫出來的敏感資訊（README）**：跨來源內容、系統色／主題／偏好、拼字與文法標記、已造訪連結、自動填入、次像素反鋸齒、字幕與影片控制列、輸入法視窗。**會畫出來**：頁內搜尋與文字片段標記、捲軸與表單外觀、游標閃爍、forced-colors。

## 實測結果（Chromium 157）

| 項目 | 結果 |
|---|---|
| 功能偵測 `canvas.content === "drawable"`（Chrome 文章的寫法） | ✅ 157、159 為 true，153 為 undefined |
| 畫出表單、輸入文字後重畫 | ✅ 打字會觸發 `paint` |
| 無障礙樹 | ✅ 表單、標籤、輸入框（名稱 Name）、按鈕、段落都在 |
| Tab、輸入、Enter | ✅ |
| 滑鼠點畫出來的按鈕 | ✅ `elementFromPoint` 回傳按鈕 |
| 旋轉 30 度後點擊 | ✅ `getBoundingClientRect()` 變成旋轉後的外框，點擊命中 |
| 焦點框 | ✅ `:focus-visible` 的外框會畫進 canvas |
| 頁內搜尋 `window.find()` | ✅ 找得到，反白也畫進 canvas |
| 滑鼠拖曳選取文字 | ✅ |
| 巢狀 `drawable`（在 `<figure>` 裡） | ✅ |
| 內部捲動區用滾輪捲動 | ✅ 會重畫 |
| CSS 動畫 | ✅ 每秒觸發 60 次 `paint`（效能要注意） |
| 畫沒有 `drawable` 的元素 | `InvalidStateError` |
| 深色模式（`color-scheme`、`Canvas`／`CanvasText`） | ✅ 畫出深色 |
| 跨來源圖片 | 沒畫出來（同來源的有畫），符合 README |
| 影片控制列、字幕 | **都有畫出來**，跟 README「不畫」的清單不同 |
| WebGL／WebGPU／OffscreenCanvas 介面 | 都存在 |

### 無障礙的坑（重點）

1. **標了 `drawable` 但沒畫出來的元素，仍然可以 Tab 進去**：焦點跑到看不見的地方。`aria-hidden="true"` 擋不住 Tab（還會造成「可聚焦但被隱藏」的違規），頁內搜尋也會找到看不見的文字。
2. **`inert` 在 canvas 裡不會從無障礙樹移除**：Tab、頁內搜尋都擋住了，但報讀軟體仍讀得到；同樣的 `inert` 放在 canvas 外面就會移除。
3. **`hidden` 最乾淨**：無障礙樹、Tab、頁內搜尋都移除。沒畫出來的內容用 `hidden`（或從 DOM 移除）。
4. **不支援的瀏覽器（Firefox、Safari 目前）**：canvas 的子元素是「備援內容」，看不到但**可以 Tab 進去**（153 實測）。要偵測支援，不支援時改成一般 HTML 顯示。
5. README 提醒：沒有更新位置資訊的元素，在無障礙樹裡沒有座標；沒用到的子元素要移除或隱藏。

### 待本機確認

- **瀏覽器縮放 200%**：畫出來的內容會不會跟著放大（WCAG 1.4.4）。沙箱的 `devicePixelContentBoxSize` 回報不正確，測不出來。README 的基本範例把 canvas 尺寸設成裝置像素、畫的位置用 canvas 像素，縮放時大小可能不對。
- **報讀軟體實際念法**（VoiceOver）。
- 拼字檢查紅線（README 說不畫）。

## Chrome 文章提到的生態（使用者貼上的官方文章）

Three.js `THREE.HTMLTexture`（實驗）、PlayCanvas `setSource()`、Babylon.js `BABYLON.HtmlTexture`、PixiJS v8.19.0 `HTMLSource`、CanvasUI。不支援時的退路：其他 UI、浮動 HTML 疊加層，或 three-html-render、html2canvas、dom-to-image。
