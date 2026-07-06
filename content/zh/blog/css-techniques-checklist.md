---
title: 現代 CSS 技巧整理清單：60+ 特性、支援度與實驗優先序
description: "一份可快速掃描的現代 CSS 技巧清單，依版面、選擇器、色彩、文字、動畫等分類，整理每個特性的用途、範例與瀏覽器支援度，並標出值得優先實驗的項目。"
date: 2026-07-06
tags:
  - CSS
  - 前端開發
  - 網頁設計
  - 響應式設計
  - 無障礙
  - 瀏覽器支援
translationKey: css-techniques-checklist
draft: false
---

### 前言

這是我自己在追蹤的現代 CSS 特性清單——用來快速掃描、決定接下來要補實驗哪些技巧。依用途分成版面、選擇器、色彩、文字排版、動畫、表單、響應式、封裝效能、函式數學等類別，每一條列出用途、範例與瀏覽器支援度，並標記我是否已經實驗過。

### 圖例說明

**已實驗**

- ✅ = 我已實驗過
- ⬜ = 尚未實驗

**支援狀態**（截至 2026 年初，🟠 / 🔴 者變動快，上線前請再查 [caniuse](https://caniuse.com "另開新視窗"){target="_blank"} / MDN）

- 🟢 穩定 — 主流瀏覽器普遍可用，可放心進 production
- 🟡 較新 — 多數瀏覽器已支援，建議加 fallback
- 🟠 實驗性 — 僅部分瀏覽器 / 需開旗標 / 剛上 Chrome
- 🔴 提案中 — 目前無法在瀏覽器使用，或根本不是真的屬性 / 選擇器

### A. 版面配置（Layout）

| 屬性 / 功能 | 主要用途與使用時機 | 範例 | 支援 | 已實驗 |
|---|---|---|---|---|
| `grid-template-rows: masonry` | 磚牆式（瀑布流）排版，不用 JS。WebKit 另提「grid-lanes」對案，規格仍在拉鋸 | `grid-template-rows: masonry;` | 🟠 | ✅ |
| `subgrid` | 讓子網格繼承外層 grid 的軌道與 gap，對齊點變成外層基準；卡片內元素跨卡對齊超好用 | `grid-template-columns: subgrid;` | 🟢 | ✅ |
| Container Queries | 依「容器」大小做 RWD（而非螢幕），元件化的關鍵 | `container-type: inline-size;` + `@container (width > 400px){}` | 🟢 | ✅ |
| Anchor Positioning | 讓元素錨定到另一元素定位（tooltip / popover / 選單），取代大量 JS 計算 | `anchor-name: --a;` + `top: anchor(--a bottom);` | 🟠 | ✅ |
| `@position-try` | 錨定定位的 fallback：空間不足時自動翻面 | `position-try-fallbacks: flip-block;` | 🟠 | ⬜ |
| `reading-flow` / `reading-order` | flex/grid 視覺順序被反轉時，修正鍵盤與報讀的閱讀順序（無障礙關鍵） | `reading-flow: flex-visual;` / `reading-order: 1;` | 🟠 | ✅ |
| Gap Decorations / 可樣式化 gap | 在 grid/flex 的 gap 畫分隔線、控制樣式 | `column-rule: 1px solid;`（套用到 gap） | 🟠 | ⬜ |
| `margin-inline` | 邏輯屬性，一次設定行向左右邊距（常用 `auto` 置中） | `margin-inline: auto;` | 🟢 | ⬜ |

### B. 選擇器（Selectors）

| 屬性 / 功能 | 主要用途與使用時機 | 範例 | 支援 | 已實驗 |
|---|---|---|---|---|
| `:has()` | 「父選擇器」／依後代或相鄰狀態選取，邏輯判斷神器 | `.card:has(img){}` | 🟢 | ✅ |
| `::part()` | 從外部樣式化 Web Component 內部指定元素（需懂 Shadow DOM） | `my-el::part(label){}` | 🟢 | ✅ |
| `:is()` / `:where()` | 群組化選擇器；`:where()` 權重為 0（比 inline 還低），`:is()` 取最高權重成員 | `:is(h1,h2) :where(.x){}` | 🟢 | ✅ |
| `nth-of` 語法 | `:nth-child(An+B of S)`，在符合條件的子集內數第幾個 | `:nth-child(2 of .active){}` | 🟢 | ⬜ |
| `:placeholder-shown` | placeholder 還在顯示時才套樣式（浮動標籤效果） | `input:placeholder-shown{}` | 🟢 | ✅ |
| `:in-range` / `:out-of-range` | 表單數值在 min/max 範圍內外時的樣式 | `input:out-of-range{}` | 🟢 | ✅ |
| `:user-valid` / `:user-invalid` | 「使用者互動後」才顯示驗證狀態，不會一載入就爆紅 | `input:user-invalid{}` | 🟡 | ✅ |
| `sibling-index()` / `sibling-count()` | 取得元素在同層中的索引與總數，可做交錯動畫、動態寬度 | `--i: sibling-index();` | 🟠 | ✅ |
| `:snapped` | 想選「目前吸附」的 scroll-snap 項目；目前非真選擇器，多以 scroll-driven 動畫模擬 | （模擬，非正式） | 🔴 | ⬜ |
| `nth-letter` | 想選第 n 個字母；無此選擇器，css-tricks 以技巧偽造 | （偽造，非正式） | 🔴 | ⬜ |
| `:heading` | 一次選取所有標題；目前仍為提案 | `:heading{}` | 🔴 | ⬜ |
| Carousel 選擇器組 | `::scroll-marker` / `scroll-marker-group` / `:target-current` 做原生輪播與 Scrollspy | `:target-current{}` | 🟠 | ⬜ |

### C. 色彩（Color）

| 屬性 / 功能 | 主要用途與使用時機 | 範例 | 支援 | 已實驗 |
|---|---|---|---|---|
| 新色彩函式（`oklch` 為主） | `hwb/lab/lch/color()` 等更廣色域；我已選定 `oklch`，支援 `oklch(from …)` 相對語法 | `color: oklch(0.7 0.15 200 / 50%);` | 🟢 | ✅ |
| `color-mix()` | 混合兩色（建議在 `oklch` 空間混），做 hover 變體、透明疊色 | `color-mix(in oklch, red 40%, blue);` | 🟢 | ✅ |
| `contrast-color()` | 依背景自動產生可讀的前景色（合規／可讀性） | `color: contrast-color(var(--bg));` | 🟠 | ⬜ |
| `accent-color` | 一行改掉 checkbox/radio/range 等系統元件主題色 | `accent-color: rebeccapurple;` | 🟢 | ✅ |
| `light-dark()` | 同一屬性同時給亮／暗兩值，搭配 `color-scheme` 免寫 media query | `color: light-dark(#000, #fff);` | 🟢 | ✅ |
| `font-palette` / `@font-palette-values` | 彩色字型（COLR）可自訂調色盤 | `@font-palette-values --p{...}` + `font-palette: --p;` | 🟡 | ✅ |
| 漸層指定內插色彩空間 | `linear-gradient(in oklch …)` 讓漸層過渡更均勻不灰濁 | `background: linear-gradient(in oklch, #4ba3f7, #9d2398);` | 🟢 | ⬜ |

### D. 文字排版（Typography）

| 屬性 / 功能 | 主要用途與使用時機 | 範例 | 支援 | 已實驗 |
|---|---|---|---|---|
| `text-wrap: balance` / `pretty` | `balance` 平衡標題各行寬度；`pretty` 避免內文孤字（pretty 較新） | `text-wrap: balance;` | 🟡 | ✅ |
| `text-decoration-skip-ink` | 底線遇到字母下伸部（g、y）時斷開，更好看 | `text-decoration-skip-ink: auto;` | 🟢 | ✅ |
| `text-combine-upright` | 直排文中把數字／英文橫置（「縱中橫」），中日文長文常用 | `text-combine-upright: all;` | 🟡 | ✅ |
| `text-emphasis` | 文字強調點／圈（跟著字中心），中日文標註常用 | `text-emphasis: dot;` | 🟢 | ✅ |
| `ruby-align` | 注音／拼音等 ruby 註記的對齊方式 | `ruby-align: center;` | 🟡 | ✅ |
| `paint-order` | 控制文字填色與外框繪製順序（做描邊字） | `paint-order: stroke fill;` | 🟢 | ✅ |
| `box-decoration-break: clone` | 斷行／換頁時每段各自套用邊框圓角背景，連結 focus 特別有感 | `box-decoration-break: clone;` | 🟡 | ✅ |
| `text-box-trim` | 裁掉字體上下的多餘留白，做精準垂直對齊 | `text-box: trim-both cap alphabetic;` | 🟠 | ✅ |
| `line-clamp`（`-webkit-line-clamp`） | 限制幾行後顯示「…」；新標準 `line-clamp` 逐步取代 webkit 寫法 | `-webkit-line-clamp: 3;`（需 `-webkit-box`） | 🟢 | ✅ |
| `hanging-punctuation` | 行首／行尾標點懸掛到邊界外，對齊更整齊（Safari 為主） | `hanging-punctuation: first last;` | 🟠 | ⬜ |
| `font-variant-numeric: tabular-nums` | 等寬數字，計時器／價格／百分比等會跳動的數字必備（字型需支援） | `font-variant-numeric: tabular-nums;` | 🟢 | ⬜ |
| `lh` 單位 | 以行高為單位設 margin／間距，跟著字級縮放 | `margin-bottom: 1.5lh;` | 🟡 | ⬜ |
| `margin-trim` | 剪掉容器內首尾子元素的外距，免除 `:first/:last-child` 歸零（Safari 為主） | `margin-trim: block;` | 🟠 | ⬜ |

### E. 動畫與過渡（Animation & Transition）

| 屬性 / 功能 | 主要用途與使用時機 | 範例 | 支援 | 已實驗 |
|---|---|---|---|---|
| 捲動驅動動畫（原「@scroll-timeline」） | 以捲動進度而非時間驅動動畫；規格已改為 `animation-timeline: scroll()/view()` | `animation-timeline: scroll();` | 🟠 | ✅ |
| `@view-transition` / `transition-behavior` | 頁面／狀態切換的過場動畫；`allow-discrete` 讓 `display` 等離散屬性可過渡 | `transition-behavior: allow-discrete;` | 🟡 | ✅ |
| `@starting-style` | 定義元素「首次出現」的起始樣式，可做 `display:none → 顯示` 的進場動畫 | `@starting-style{ opacity:0; }` | 🟡 | ✅ |
| `backface-visibility` | 3D 翻轉時是否顯示背面（翻卡效果） | `backface-visibility: hidden;` | 🟢 | ✅ |
| `prefers-reduced-motion` | 偵測「減少動態」偏好，無障礙必備；可搭配 `prefers-color-scheme` 偵測深淺色 | `@media (prefers-reduced-motion: reduce){}` | 🟢 | ✅ |

### F. 表單與元件（Forms & Components）

| 屬性 / 功能 | 主要用途與使用時機 | 範例 | 支援 | 已實驗 |
|---|---|---|---|---|
| `field-sizing: content` | 讓 input／textarea 依內容自動增長 | `field-sizing: content;` | 🟠 | ✅ |
| 可自訂 `<select>`（`appearance: base-select`） | 原生下拉可完全自訂樣式，選項可放圖示／HTML | `select{ appearance: base-select; }` | 🟠 | ✅ |
| `<selectlist>`（原 `<selectmenu>`） | 可高度自訂的下拉元件；已改名並整併進「可自訂 select」路線 | `<selectlist>…</selectlist>` | 🟠 | ✅ |
| `::backdrop` | `dialog.showModal()` 或全螢幕時的背後遮罩層樣式 | `dialog::backdrop{}` | 🟢 | ✅ |

### G. 響應式與使用者偏好（Responsive & Preferences）

| 屬性 / 功能 | 主要用途與使用時機 | 範例 | 支援 | 已實驗 |
|---|---|---|---|---|
| Media Query 範圍語法 | 用 `<=`／`>=` 寫斷點，免去 `min-width` 要配 `320.01px` 的痛 | `@media (width >= 320px){}` | 🟢 | ✅ |
| `prefers-color-scheme` | 偵測深／淺色主題偏好 | `@media (prefers-color-scheme: dark){}` | 🟢 | ✅ |
| `prefers-contrast` | 偵測使用者要更高／更低對比 | `@media (prefers-contrast: more){}` | 🟡 | ⬜ |
| `forced-colors` | 高對比／強制色彩模式（Windows 高對比）下的調整 | `@media (forced-colors: active){}` | 🟢 | ⬜ |
| `resolution` media | 依輸出裝置像素密度切換（如 Retina） | `@media (resolution >= 2dppx){}` | 🟢 | ✅ |
| Style Queries `@container style()` | 依容器的自訂屬性值套樣式（如主題），元件變體超好用 | `@container style(--theme: dark){}` | 🟡 | ✅ |
| Scroll-State Queries | 依容器捲動狀態（如 `stuck`、`snapped`）套樣式；可偵測 sticky 是否黏住 | `@container scroll-state(stuck: top){}` | 🟠 | ✅ |

### H. 封裝與效能（Encapsulation & Performance）

| 屬性 / 功能 | 主要用途與使用時機 | 範例 | 支援 | 已實驗 |
|---|---|---|---|---|
| Cascade Layers `@layer` | 用圖層管理權重優先序，馴服大型專案的 specificity | `@layer base, components, utilities;` | 🟢 | ✅ |
| `@scope` | 樣式作用域限制在某區塊、可設下界，類似 CSS Modules 的作用域 | `@scope (.card) to (.content){}` | 🟡 | ⬜ |
| `contain` | 宣告內部排版／樣式獨立，隔離重排範圍以提升效能 | `contain: layout style;` | 🟢 | ✅ |
| `contain-intrinsic-size` | 搭配 `content-visibility: auto`，先給預估尺寸避免捲動跳動，有 cache 後轉 auto | `contain-intrinsic-size: auto 100px;` | 🟢 | ✅ |
| `scrollbar-gutter: stable` | 預留捲軸槽，避免捲軸出現時內容位移 | `scrollbar-gutter: stable;` | 🟡 | ⬜ |
| `scrollbar-color` / `scrollbar-width` | 自訂捲軸顏色與粗細 | `scrollbar-color: #888 #eee;` | 🟡 | ✅ |
| `@supports` | 特性偵測，做漸進增強與 fallback | `@supports (display: grid){}` | 🟢 | ✅ |

### I. 函式與數學（Functions & Math）

| 屬性 / 功能 | 主要用途與使用時機 | 範例 | 支援 | 已實驗 |
|---|---|---|---|---|
| `round()` / `mod()` / `rem()` | CSS 內做進位取整、取餘，對齊網格／節奏 | `width: round(down, 15.5px, 4px);` | 🟡 | ⬜ |
| 三角函式 `sin/cos/tan` | 圓形排列、波形、角度計算 | `width: calc(sin(30deg) * 100px);` | 🟢 | ⬜ |
| `calc-size()` / `interpolate-size` | 對 `auto`／`min-content` 等關鍵字做動畫過渡，如未知高度的 accordion 展開 | `interpolate-size: allow-keywords;` | 🟠 | ✅ |
| `random()` | CSS 原生隨機值（散布、抖動效果） | `rotate: random(-5deg, 5deg);` | 🟠 | ✅ |
| `if()` | 在屬性值中做條件判斷 | `display: if(style(--open: 1): block; else: none);` | 🟠 | ⬜ |
| `@function` | 自訂 CSS 函式與 mixin 概念，可帶參數回傳值 | `@function --double(--x){ result: calc(var(--x)*2); }` | 🟠 | ⬜ |

### J. 其他實用屬性（Misc）

| 屬性 / 功能 | 主要用途與使用時機 | 範例 | 支援 | 已實驗 |
|---|---|---|---|---|
| 原生巢狀（Native Nesting） | 類 Sass/SCSS 的巢狀寫法，免預處理器 | `.card{ & .title{} }` | 🟢 | ✅ |
| `<img loading="lazy">` | 圖片延遲載入，改善首屏效能 | `<img loading="lazy">` | 🟢 | ✅ |
| `overscroll-behavior: contain` | 區塊捲到底不再帶動外層捲軸（彈窗／側欄常用） | `overscroll-behavior: contain;` | 🟢 | ✅ |
| `object-view-box` | 直接在 CSS 擷取圖片的局部區域，免另存裁切檔 | `object-view-box: inset(10% 10% 10% 10%);` | 🟠 | ✅ |
| 獨立 transform 屬性 | `translate`／`rotate`／`scale` 各自成屬性，好分開做動畫 | `rotate: 45deg; scale: 1.2;` | 🟢 | ⬜ |
| `border-image` | 用切片圖做複雜邊框，省去傳統切版煩惱 | `border-image: url(frame.png) 30 round;` | 🟢 | ⬜ |
| `corner-shape` | 超越 `border-radius` 的圓角形狀（squircle／切角等），搭配 `border-radius` 使用 | `corner-shape: squircle; border-radius: 30px;` | 🟠 | ⬜ |
| 字型平滑（`-webkit-font-smoothing`） | 深色模式讓文字不刺眼的關鍵：macOS 上淺色文字在深底會因次像素抗鋸齒而變粗發光，改用 grayscale 抗鋸齒後變細、不刺眼；非標準，僅特定平台有效 | `-webkit-font-smoothing: antialiased;`（+ `-moz-osx-font-smoothing: grayscale;`） | 🟡 | ✅ |
| `@when` / `@else` | CSS 的 if/else 條件塊；仍為提案，瀏覽器皆不可用 | `@when supports(...){} @else{}` | 🔴 | ✅ |

### 建議優先補實驗的清單

以下這些我還沒打勾、但屬於「穩定可用 🟢 且投報率高」的，適合排在前面補上：

1. `margin-inline` 與獨立 transform 屬性（`translate`／`rotate`／`scale`）——日常寫法直接升級。
2. `nth-of` 語法（`:nth-child(… of …)`）——挑選子集的利器。
3. `font-variant-numeric: tabular-nums`——任何會跳動的數字都該加。
4. 漸層指定 `in oklch`——一行讓所有漸層變乾淨。
5. `forced-colors` 與 `prefers-contrast`——補齊無障礙偵測（我已做過 reduced-motion／color-scheme）。
6. 三角函式、`round()`／`mod()`——想做圓形排列或對齊節奏時很省事。
7. `@scope`、`scrollbar-gutter: stable`——大型專案的樣式作用域與捲軸位移問題。

> **提醒**：標為 🟠 / 🔴 的多為 2025–2026 才進 Chrome 或仍在提案的特性，支援度每季都在變。實際導入 production 前，請以 [caniuse.com](https://caniuse.com "另開新視窗"){target="_blank"} 與 MDN 的最新資料為準，並記得為新特性加 `@supports` fallback。

### 相關連結

- [Can I use（瀏覽器支援度查詢）](https://caniuse.com "另開新視窗"){target="_blank"}
- [MDN Web Docs — CSS](https://developer.mozilla.org/zh-TW/docs/Web/CSS "另開新視窗"){target="_blank"}
- [web.dev — Learn CSS](https://web.dev/learn/css "另開新視窗"){target="_blank"}
- [Chrome for Developers — CSS](https://developer.chrome.com/tag/css "另開新視窗"){target="_blank"}
- [CSS-Tricks](https://css-tricks.com "另開新視窗"){target="_blank"}
