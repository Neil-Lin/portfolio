---
title: "iframe 高度自動跟著內容：frame-sizing 只在載入時量，使用者調整文字後要靠你"
description: "Chrome 154 起，iframe 加上 frame-sizing: content-height、內嵌頁面加上 meta 同意，高度就會等於內容高度，不用再寫 postMessage。但我在 Chromium 實測，高度只在載入時量：展開問答、套用文字間距、版面變窄之後，iframe 都不會跟著長高，要內嵌頁面自己呼叫 requestResize()。這篇整理寫法、實測結果，以及跟無障礙的關係。"
date: 2026-11-07
tags:
  - CSS
  - HTML
  - JavaScript
  - 前端開發
  - 無障礙
  - 瀏覽器支援
category: accessibility
translationKey: css-frame-sizing
draft: false
---

> 話說在前頭：這篇由 AI（Anthropic 的 Claude）協助收集資料與整理，我再閱讀確認。文中的行為是在 Chromium 159、157 與 153 上實測的結果；規格、無障礙規範與支援度以文末連結的 W3C 規格與說明文件、WPT 測試、MDN 與 Chromium 原始碼為依據。有講錯的地方歡迎指正。

## 它解決什麼

iframe 預設高度是 150px，內容比較長就會在框內出現捲軸。以前要讓 iframe 跟內容一樣高，得在內嵌頁面量高度，用 `postMessage` 傳給父頁，父頁再設定 `height`。

`frame-sizing` 讓瀏覽器直接做這件事。CSS 工作小組的說明文件把框內捲軸列為要解決的問題：內容放得下時，iframe 的捲軸對使用者是比較差的體驗。

## 基本寫法：兩邊都要同意

```css
/* 父頁 */
iframe {
  frame-sizing: content-height;
}
```

```html
<!-- 內嵌頁面：放在 <head>，要在 <body> 出現之前 -->
<meta name="responsive-embedded-sizing" content="allow-origins=https://parent.example">
```

- **父頁**用 `frame-sizing: content-height` 同意依內容決定高度（也有 `content-width`，以及依書寫方向的 `content-block-size`、`content-inline-size`）。
- **內嵌頁面**用 `<meta>` 同意把尺寸告訴父頁。內容的尺寸可能洩漏資訊，所以要兩邊都同意。
- **`content="allow-origins=..."` 一定要寫**。它列出哪些父頁可以拿到尺寸，可以寫完整網址、`*`（全部），或 `'self'`（只限和內嵌頁面同來源的父頁）。CSS 規格本文目前只寫了 `<meta name="responsive-embedded-sizing">`，但 CSS 工作小組的說明文件、WPT 測試和 Chromium 原始碼都用 `content="allow-origins=..."`。我實測**沒寫 `content` 就完全不會生效**，高度停在 150px。
- `<meta>` 要在 `<body>` 開始之前出現，之後才加進去就沒有效果。

我實測跨來源也能用：父頁和內嵌頁面在不同網域，`allow-origins` 寫父頁的網址或 `*`，iframe 會長高；寫 `'self'` 則不會（`'self'` 指的是內嵌頁面自己的來源）。

## 互動範例

先看你的瀏覽器支援度：

::feature-support{features="frame-sizing" notice="你的瀏覽器不支援 frame-sizing，下方範例選 content-height 時，會改用 JavaScript 讀內容高度、設定 iframe 高度。"}
::

::responsive-iframe-demo
::

## 實測：哪些情況會自動更新

規格寫明，尺寸在兩個時間點量：內嵌頁面觸發 `DOMContentLoaded` 之後的第一次排版，以及 `load`。**之後內容、樣式、版面的變化都不會自動影響 iframe**，要內嵌頁面呼叫 `window.requestResize()`。

我在 Chromium 159 實測（iframe 寬 400px）：

| 情況 | iframe 會自動長高嗎？ | 呼叫 `requestResize()` 後 |
|---|---|---|
| 載入完成 | 會 | — |
| 展開 `<details>` | **不會**，內容在框內捲動 | 跟著長高 |
| 套用 WCAG 1.4.12 的文字間距 | **不會** | 跟著長高 |
| iframe 寬度改成 200px | **不會**（內容有重新換行，但高度沒更新） | 跟著長高 |
| 內容變少（收合） | 不會縮回去 | 跟著縮回去 |

另外：

- **iframe 寫了 `height` 或 `max-height`，以它們為準**。`frame-sizing` 只決定 iframe 原本的大小，跟圖片的原始尺寸一樣，CSS 寫的尺寸會蓋過它。
- **內嵌頁面用 `ResizeObserver` 自動呼叫**，實測沒有無限迴圈，內容變多、變少都會跟著更新：

```js
// 內嵌頁面
new ResizeObserver(() => {
  window.requestResize();
}).observe(document.body);
```

- 沒有 `<meta>` 同意、或不是在 iframe 裡，呼叫 `requestResize()` 會丟出 `NotAllowedError`。

## 跟無障礙的關係

### 1. 使用者調整的，剛好都是「載入之後」的變化

會讓內容變高的操作，很多是輔助使用者會做的事：

- **調整文字間距**（WCAG 1.4.12）：行高、段落間距、字距、詞距調大，內容就變長。
- **放大頁面**（WCAG 1.4.4、1.4.10）：版面變窄、文字換行變多。WCAG 1.4.10 的說明文件寫明，320 CSS px 寬相當於 1280px 寬的畫面放大到 400%。
- **展開內容**：問答、手風琴、「顯示更多」。

這些都發生在載入之後。只靠 `frame-sizing`，iframe 停在原本的高度，多出來的內容被擠到框內捲動，等於又回到這個功能想解決的「框內捲軸」。範例勾選自動呼叫 `requestResize()` 之後，這三種情況都會跟著長高。

我用把 iframe 縮窄來模擬放大；瀏覽器實際放大時的表現，沙箱測不到，需要在本機確認。

### 2. 框內捲動不算內容消失，但不能把捲軸關掉

WCAG 1.4.12、1.4.4 要求的是「沒有內容或功能消失」。內容被擠到框內、還捲得到，不算消失。

但如果 iframe 加了 `scrolling="no"`，或內嵌頁面寫了 `overflow: hidden` 來隱藏捲軸，高度沒跟上時就捲不到了。我實測滑鼠滾輪捲不動；用 Tab 移到裡面的按鈕時，瀏覽器還是會捲過去，但多出來的純文字沒有焦點可以停，就看不到了，等於內容消失。用 `frame-sizing` 時，捲軸還是留著當安全網比較保險。

### 3. iframe 要有名稱

跟 `frame-sizing` 無關，但每次都要記得：用 `title` 屬性說明 iframe 的內容，報讀軟體才知道這個框是什麼（WCAG 4.1.2；W3C 的技術 H64）。

## 不支援的瀏覽器：保留舊的做法當備援

目前只有 Chrome 154 起支援。其他瀏覽器沿用 `postMessage`，只在不支援時才傳：

```js
// 內嵌頁面
new ResizeObserver(() => {
  if (typeof window.requestResize === "function") {
    window.requestResize();
  } else {
    parent.postMessage(
      {
        type: "height",
        // scrollHeight 不會小於 iframe 的高度，內容變少時縮不回去
        height: Math.ceil(document.documentElement.getBoundingClientRect().height),
      },
      "https://parent.example",
    );
  }
}).observe(document.body);
```

```js
// 父頁
window.addEventListener("message", (e) => {
  if (e.origin !== "https://child.example" || e.data?.type !== "height") return;
  // 內容高度再加上 iframe 的邊框
  iframe.style.height = `${e.data.height + iframe.offsetHeight - iframe.clientHeight}px`;
});
```

- 一定要檢查 `e.origin`，也要指定 `postMessage` 的目標網址，不要用 `*`。
- 支援的瀏覽器裡**不要再用 JavaScript 設定 `height`**：寫了 `height` 會蓋過 `frame-sizing`。上面的寫法在支援時只呼叫 `requestResize()`，不會送訊息。
- CSS 可以用 `@supports (frame-sizing: content-height) { … }` 判斷。

## 支援度與標準化狀況

- **Chrome**：Chromium 原始碼裡，153 是實驗狀態，**154 起正式開啟**。MDN 相容性資料也標示 Chrome 154。
- **Firefox、Safari**：MDN 相容性資料標示不支援，並標為實驗性。
- **WebKit**：標準立場議題（#653）目前沒有立場，也還沒有討論。
- **Mozilla**：標準立場議題（#1394）目前沒有立場。2026 年 10 月有參與者（GitHub 帳號 jakearchibald）提出質疑：「只在 DOMContentLoaded 和 load 時調整大小，看起來是很大的限制」（"It only resizing on domready + load seems like a huge limitation."）。
- **HTML 標準**：把 `<meta name="responsive-embedded-sizing">` 加進 HTML 標準的 PR（#12444）還沒合併，`allow-origins` 的寫法在討論中也改過。用之前最好再查一次最新寫法。

所以目前它是 Chrome 專屬、寫法還在變的功能。要用的話，內嵌頁面記得加上 `requestResize()`，也保留舊的做法當備援。

## 延伸閱讀

- [用 :playing、:paused 做自訂播放器：圖示跟著狀態換了，但報讀軟體不知道](/blog/css-media-state-pseudos/)
- [現代 CSS 與 HTML 技巧整理清單：116 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

## 相關連結

- [W3C — CSS Box Sizing Module Level 4：Responsively-sized iframes](https://drafts.csswg.org/css-sizing-4/#responsive-iframes "另開新視窗"){target="_blank"}
- [CSS 工作小組 — Responsively-sized iframes 說明文件](https://github.com/w3c/csswg-drafts/blob/main/css-sizing-4/responsive-iframes-explainer.md "另開新視窗"){target="_blank"}
- [WPT — responsive-iframe 測試（含 allow-origins）](https://github.com/web-platform-tests/wpt/tree/master/css/css-sizing/responsive-iframe "另開新視窗"){target="_blank"}
- [MDN — frame-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/frame-sizing "另開新視窗"){target="_blank"}
- [MDN — Window.requestResize()](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestResize "另開新視窗"){target="_blank"}
- [MDN browser-compat-data — frame-sizing](https://github.com/mdn/browser-compat-data/blob/main/css/properties/frame-sizing.json "另開新視窗"){target="_blank"}
- [Chromium 原始碼 — html_meta_element.cc（allow-origins 的檢查）](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/html/html_meta_element.cc "另開新視窗"){target="_blank"}
- [WHATWG HTML — Add `<meta name="responsive-embedded-sizing">`（#12444）](https://github.com/whatwg/html/pull/12444 "另開新視窗"){target="_blank"}
- [WebKit 標準立場 — Responsively-sized iframes（#653）](https://github.com/WebKit/standards-positions/issues/653 "另開新視窗"){target="_blank"}
- [Mozilla 標準立場 — Responsively-sized iframes（#1394）](https://github.com/mozilla/standards-positions/issues/1394 "另開新視窗"){target="_blank"}
- [WCAG 2.2 說明文件 — 1.4.10 重排](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html "另開新視窗"){target="_blank"}
- [WCAG 2.2 說明文件 — 1.4.12 文字間距](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html "另開新視窗"){target="_blank"}
- [WCAG 2.2 說明文件 — 1.4.4 調整文字大小](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html "另開新視窗"){target="_blank"}
- [WCAG 技術 H64 — 用 title 屬性為 iframe 命名](https://www.w3.org/WAI/WCAG22/Techniques/html/H64 "另開新視窗"){target="_blank"}
