---
title: "HTML-in-Canvas 的無障礙實測：報讀軟體讀得到了，但這四件事要自己補"
description: "Chrome 157 起，HTML 可以直接畫進 <canvas>，畫出來的表單、按鈕仍然在無障礙樹裡，鍵盤、頁內搜尋都能用。我在 Chromium 157 逐項實測後發現，官方說的大多屬實，但沒畫出來的內容、不支援的瀏覽器、畫面縮放和 3D 位置同步，都要自己處理。"
date: 2026-11-06
tags:
  - HTML
  - JavaScript
  - 前端開發
  - 無障礙
  - 瀏覽器支援
category: accessibility
translationKey: html-in-canvas-a11y
draft: false
---

> 話說在前頭：這篇由 AI（Anthropic 的 Claude）協助收集資料與整理，我再閱讀確認。文中的行為是在 Chromium 157（Chrome 157 分支點的版本）、159 與 153 上實測的結果；規格、官方說法與支援度以文末連結的 WICG 說明文件、Chrome 官方文件、MDN、W3C 規範與 Chromium 原始碼為依據。有講錯的地方歡迎指正。

## 它解決什麼

以前畫在 `<canvas>` 上的東西只是一張點陣圖。報讀軟體讀不到、鍵盤操作不到、頁內搜尋找不到。要讓 canvas 做出來的介面可以存取，只能另外做一份隱藏的 HTML，手動跟畫面保持同步。

HTML-in-Canvas 讓你把**真正的 HTML** 畫進 canvas。畫出來的表單、按鈕仍然是 DOM，仍然在無障礙樹裡。Chrome 157 起正式支援。

## 基本寫法

```html
<canvas id="canvas" content="drawable">
  <form id="card" drawable>
    <label for="email">電子郵件</label>
    <input id="email" type="email">
    <button>訂閱</button>
  </form>
</canvas>
```

```js
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const card = document.getElementById("card");

// 卡片有變化（輸入文字、焦點移動）時，瀏覽器會觸發 paint
canvas.onpaint = () => {
  ctx.reset();
  ctx.drawElementImage(card, 0, 0);
};
```

- `<canvas>` 加上 `content="drawable"`，裡面的 HTML 才會排版。
- 要畫的元素加上 `drawable`，再用 `drawElementImage()` 畫。
- Chrome 157 以前的屬性是 `layoutsubtree`，157 起只剩 `content="drawable"`；2026 年 9 月也有幾個寫法改名。網路上較早的教學可能還是舊寫法。

## 互動範例

先看你的瀏覽器支援度：

::feature-support{features="html-in-canvas" notice="你的瀏覽器不支援 HTML-in-Canvas，下方範例會改用一般 HTML 顯示，看不到「沒畫出來的內容」的比較。"}
::

::html-in-canvas-demo
::

## 官方說的，實測屬實

我在 Chromium 157 用一張畫進 canvas 的表單（標籤、輸入框、按鈕、一段文字）逐項測試：

| 項目 | 結果 |
|---|---|
| 無障礙樹 | 表單、標籤、輸入框（名稱「電子郵件」）、按鈕、文字都在 |
| 鍵盤 | Tab 移動、輸入文字、Enter 送出都正常 |
| 焦點框 | `:focus-visible` 的外框會畫進 canvas |
| 滑鼠點擊 | 點畫出來的按鈕，命中的就是那個按鈕；卡片旋轉 30 度後也一樣 |
| 頁內搜尋 | 找得到，反白也會畫進 canvas |
| 選取文字 | 可以用滑鼠拖曳選取 |
| 深色模式 | 依頁面的 `color-scheme` 畫出深色 |

**旋轉後還點得準，是因為用 2D 的 `drawElementImage()` 時，瀏覽器會自動把元素的位置更新成畫出來的位置。** Chrome 文件寫明，這個位置資訊除了點擊判定，也會回報給放大鏡這類輔助技術。

## 要自己補的四件事

### 1. 沒畫出來的內容：用 `hidden`

canvas 裡常會放還沒輪到顯示的內容，例如另一個畫面。這些元素標了 `drawable` 卻沒有畫，**看不到，但鍵盤還是進得去**：焦點會停在一個看不見的地方。看得見的鍵盤使用者，會不知道自己在哪裡（WCAG 2.4.7「焦點可見」）。

Chrome 文件說，沒畫出來的元素仍在無障礙樹裡，讓報讀軟體讀得到；可以用 `aria-hidden="true"` 或 `inert` 隱藏。我實測三種隱藏方式：

| 隱藏方式 | 報讀軟體讀得到 | Tab 進得去 | 頁內搜尋找得到 |
|---|---|---|---|
| 不處理 | 是 | **是** | 是 |
| `aria-hidden="true"` | 否（焦點移進去後會讀到，見下方） | **是** | 是 |
| `inert` | **是** | 否 | 否 |
| `hidden` | 否 | 否 | 否 |

- **`aria-hidden` 擋不住 Tab**。W3C〈ARIA in HTML〉規格寫明，`aria-hidden` 不能用在可聚焦的元素上。Chrome 在焦點移進去時會忽略 `aria-hidden`，並在主控台警告「Blocked aria-hidden on an element because its descendant retained focus」，所以報讀軟體最後還是會讀到，等於沒隱藏。
- **`inert` 在 canvas 裡沒有從無障礙樹移除**：同樣的 `inert` 放在 canvas 外面就會移除。這跟 Chrome 文件的說法不同，可能是 Chrome 的問題。
- **`hidden` 最乾淨**，三項都擋住。沒畫的內容用 `hidden`，或直接從 DOM 移除。
- **但 `hidden` 會被 CSS 蓋掉**：`hidden` 靠的是瀏覽器預設的 `display: none`，元素只要寫了 `display: grid` 之類的樣式，`hidden` 就失效，Tab 還是進得去。我做範例時就踩到了，要補上 `[hidden] { display: none; }`。在 canvas 裡更難發現，因為元素本來就看不到。

`clearElementGeometry()`（讓元素不再被點擊判定）也一樣：實測之後點不到了，但 Tab 還是進得去。

### 2. 不支援的瀏覽器：先偵測，退回一般 HTML

目前只有 Chrome 支援。在不支援的瀏覽器，`<canvas>` 裡的元素是「備援內容」：**畫面上看不到，但 Tab 進得去**。我在不支援的 Chromium 153 實測，焦點可以移到看不見的輸入框和按鈕上。

所以不能直接把內容丟進 canvas 就好。先偵測，不支援時改用一般 HTML 顯示（範例就是這樣做的）：

```js
if ("content" in HTMLCanvasElement.prototype) {
  // 支援：放進 <canvas content="drawable">
} else {
  // 不支援：同樣的內容用一般 HTML 顯示
}
```

這是 Chrome 官方指南的偵測寫法。我實測 Chromium 153 是否、157 和 159 是是。

### 3. 畫面縮放：canvas 格線要跟著裝置像素

`drawElementImage()` 的位置和大小用的是 canvas 的格線像素，不是 CSS 像素。Chrome 文件建議用 `ResizeObserver` 讀 `devicePixelContentBoxSize`，讓 canvas 格線對齊裝置像素，否則畫出來的文字會模糊；文件也提到，**使用者縮放頁面時格線會改變**，所以不能寫死。

```js
let scale = 1; // 每個 CSS 像素對應幾個 canvas 格線像素

new ResizeObserver(([entry]) => {
  const dpc = entry.devicePixelContentBoxSize?.[0];
  canvas.width = dpc ? dpc.inlineSize : Math.round(entry.contentRect.width * devicePixelRatio);
  canvas.height = dpc ? dpc.blockSize : Math.round(entry.contentRect.height * devicePixelRatio);
  scale = canvas.width / entry.contentRect.width;
  canvas.requestPaint();
}).observe(canvas, { box: "device-pixel-content-box" });
```

用 CSS 像素量到的尺寸（例如 `offsetWidth`），要乘上 `scale` 再傳給 `drawElementImage()`。

### 4. 3D（WebGL、WebGPU）：位置要自己同步

2D 會自動更新位置；WebGL、WebGPU 不會，因為瀏覽器不知道貼圖被畫到 3D 場景的哪裡。要自己算出轉換矩陣，呼叫 `canvas.updateElementGeometry()`。Chrome 文件寫明，沒有同步時，點擊會落在元素原本的位置；這個位置也是報讀軟體的焦點框、放大鏡用來定位的依據。

## 其他跟無障礙有關的限制

WICG 說明文件列出一些**不會畫進 canvas** 的資訊，避免網頁讀出使用者的隱私，其中幾項跟無障礙有關（前兩項我沒有實測，依說明文件）：

- **拼字、文法檢查的紅線**：依賴拼字檢查的使用者，在 canvas 裡的輸入框看不到提示。
- **已造訪連結的顏色**：canvas 裡的連結不會顯示已造訪的樣式。
- **跨來源內容**：其他網域的圖片不會畫出來。我實測跨來源圖片確實是空白。

說明文件也把字幕和影片控制列列為不畫的項目，但我在 Chromium 157 實測，**兩個都畫出來了**。

## 支援度與爭議

- **Chrome**：Chromium 原始碼裡，153～156 是實驗狀態（要開 `chrome://flags/#canvas-draw-element` 或申請 origin trial），**157 起正式開啟**。
- **Firefox、Safari**：MDN 的相容性資料標示不支援，並標為實驗性、非標準軌道。
- **WebKit**：標準立場議題中，WebKit 的工程師（GitHub 帳號 smfr）在 2026 年 8 月初表示「一週後若無異議將標為支持，API 的部分形狀仍在討論」。到 11 月 6 日，議題上仍沒有掛上支持的標籤。
- **Mozilla**：還沒有正式立場。負責的工程師（GitHub 帳號 nical）在議題中寫道：「我們認為把文件畫進 Canvas2D 而不是 DOM，在多個層面上都是錯誤的做法」，以及「我們希望網頁平台的發展，遠離用 canvas 做豐富 UI」。
- **標準化**：把它加進 HTML 標準的 PR 還沒合併。

所以它目前是 Chrome 專屬的功能。能用一般 HTML 做的介面，還是用一般 HTML；真的需要 canvas 時（遊戲、圖表、3D），它比「另外做一份隱藏的 HTML」好得多，但上面四件事要記得補。

## 延伸閱讀

- [用 `<usermedia>` 做視訊會議的等候室：瀏覽器幫你處理權限，但這六件事要自己做](/blog/html-usermedia/)
- [現代 CSS 與 HTML 技巧整理清單：116 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

## 相關連結

- [WICG — HTML-in-Canvas 說明文件](https://github.com/WICG/html-in-canvas "另開新視窗"){target="_blank"}
- [Chrome for Developers — Chrome 157 的 HTML-in-Canvas](https://developer.chrome.com/blog/html-in-canvas?hl=zh-tw "另開新視窗"){target="_blank"}
- [Chrome for Developers — HTML-in-Canvas 技術概念](https://developer.chrome.com/docs/web-platform/html-in-canvas/concepts?hl=zh-tw "另開新視窗"){target="_blank"}
- [Chrome for Developers — 將 HTML 算繪至 2D 畫布](https://developer.chrome.com/docs/web-platform/html-in-canvas/2d?hl=zh-tw "另開新視窗"){target="_blank"}
- [Modern Web Guidance — Expose canvas content to browser features](https://developer.chrome.com/docs/modern-web-guidance/guides/visual-design/expose-canvas-content-to-browser-features "另開新視窗"){target="_blank"}
- [WICG — 破壞性變更公告（#174）](https://github.com/WICG/html-in-canvas/issues/174 "另開新視窗"){target="_blank"}
- [W3C — ARIA in HTML（aria-hidden 不能用在可聚焦元素）](https://www.w3.org/TR/html-aria/ "另開新視窗"){target="_blank"}
- [WCAG 2.2 說明文件 — 2.4.7 焦點可見](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html "另開新視窗"){target="_blank"}
- [MDN browser-compat-data — HTMLCanvasElement](https://github.com/mdn/browser-compat-data/blob/main/api/HTMLCanvasElement.json "另開新視窗"){target="_blank"}
- [WebKit 標準立場 — html-in-canvas（#630）](https://github.com/WebKit/standards-positions/issues/630 "另開新視窗"){target="_blank"}
- [Mozilla 標準立場 — HTML-in-Canvas（#1076）](https://github.com/mozilla/standards-positions/issues/1076 "另開新視窗"){target="_blank"}
- [WHATWG HTML — Add HTML-in-Canvas APIs（#11588）](https://github.com/whatwg/html/pull/11588 "另開新視窗"){target="_blank"}
