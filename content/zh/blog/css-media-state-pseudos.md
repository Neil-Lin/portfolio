---
title: "用 :playing、:paused 做自訂播放器：圖示跟著狀態換了，但報讀軟體不知道"
description: "媒體狀態偽類讓 CSS 直接依 <video>、<audio> 的播放、暫停、靜音狀態切換外觀，Safari、Firefox 已經支援，Chrome 158（預計 2026 年 11 月 17 日推出）之後三大瀏覽器就到齊了。我在 Chromium 實測後整理了幾個容易誤會的地方（音量 0 不會符合 :muted、播完會變 :paused），以及 CSS 管不到的部分：按鈕名稱和狀態，還是要用 JavaScript 從媒體事件同步。"
date: 2026-11-07
tags:
  - CSS
  - JavaScript
  - 前端開發
  - 無障礙
  - 瀏覽器支援
category: accessibility
translationKey: css-media-state-pseudos
draft: false
---

> 話說在前頭：這篇由 AI（Anthropic 的 Claude）協助收集資料與整理，我再閱讀確認。文中的行為是在 Chromium 159、157 與 153 上實測的結果；規格、無障礙規範與支援度以文末連結的 W3C、WHATWG、MDN 與 Chromium 原始碼為依據。有講錯的地方歡迎指正。

## 它解決什麼

自訂播放器要依狀態換圖示，以前得監聽 `play`、`pause` 事件，再用 JavaScript 切換 class。現在 CSS 可以直接選取媒體元素的狀態：

| 偽類 | 什麼時候符合（HTML 標準） |
|---|---|
| `:playing` | `paused` 為 false |
| `:paused` | `paused` 為 true |
| `:seeking` | `seeking` 為 true（正在跳到某個時間點） |
| `:buffering` | 正在播放，但資料不夠、還在下載 |
| `:stalled` | 符合 `:buffering`，而且一段時間沒收到資料 |
| `:muted` | 元素被靜音 |
| `:volume-locked` | 瀏覽器或使用者鎖定音量，網頁改不了 |

## 支援度

| 瀏覽器 | 版本 | 依據 |
|---|---|---|
| Chrome | 158（預計 2026 年 11 月 17 日推出） | Chromium 原始碼：154～157 是實驗狀態，158 起預設開啟 |
| Firefox | 150 | MDN 的 Firefox 150 版本說明 |
| Safari | 15.4 | MDN 相容性資料 |

我實測 Chromium 157 不支援，159 支援。Chrome 157 在 2026 年 11 月 3 日推出，所以**目前的正式版 Chrome 還不支援**，要等 158（推出日期依 MDN 相容性資料的瀏覽器版本資料）。

## 基本寫法

```css
/* 預設顯示播放圖示 */
.icon-pause { display: none; }

/* 播放中：換成暫停圖示 */
.player:has(video:playing) .icon-play { display: none; }
.player:has(video:playing) .icon-pause { display: block; }
```

偽類寫在 `<video>` 上，要改的是旁邊的按鈕，所以用 `:has()` 從外層選。

## 互動範例

先看你的瀏覽器支援度：

::feature-support{features="media-pseudos" notice="你的瀏覽器不支援媒體狀態偽類，下方範例的圖示會改用 JavaScript 設定的 data 屬性切換。"}
::

::media-state-demo
::

## 實測：容易誤會的地方

我在 Chromium 159 實測：

| 操作 | 符合的偽類 |
|---|---|
| 載入完成，還沒播放 | `:paused` |
| 播放中 | `:playing` |
| 播放中按靜音 | `:playing` `:muted` |
| 取消靜音，音量拉到 0 | `:playing`（**沒有 `:muted`**） |
| 播完 | `:paused` |
| 改 `currentTime` 跳到其他時間點 | 加上 `:seeking`，跳完就消失 |
| 網路很慢，資料一直沒來（播放中） | 1.5 秒時：`:playing` `:buffering`；5.5 秒時：再加上 `:stalled` |

- **音量 0 不會符合 `:muted`**：HTML 標準裡，靜音（`muted`）和音量（`volume`）是兩個分開的設定；音量 0 雖然沒有聲音，`muted` 仍是 false。用 `:muted` 切換靜音圖示的話，使用者把音量拉到 0，圖示還是顯示有聲音。要一起處理，得用 JavaScript 判斷 `volume === 0`。
- **播完會變 `:paused`**：HTML 標準規定，播放到結尾時（沒有設定 `loop`）把 `paused` 設成 true。Selectors 規範沒有 `:ended` 這個偽類，要區分「暫停」和「播完」，還是要看 `ended` 屬性。
- **`:buffering`、`:stalled` 時也符合 `:playing`**：Selectors 規範寫明，這兩種狀態仍算「播放中」。`:stalled` 的等待時間由瀏覽器決定，HTML 標準建議約 3 秒。

## CSS 只管外觀：無障礙的部分要自己補

### 1. 按鈕名稱要跟著狀態

只有圖示的按鈕，報讀軟體念的是 `aria-label`。CSS 換了圖示，`aria-label` 不會跟著變：播放中，按鈕看起來是「暫停」，報讀軟體念的還是「播放」。

WAI-ARIA 編寫實務指南（APG）的按鈕模式，給了兩種寫法：

- **名稱跟著變**：「播放」⇄「暫停」，這時**不要**加 `aria-pressed`。
- **名稱固定，用 `aria-pressed` 表示狀態**：例如「靜音」按鈕，靜音時 `aria-pressed="true"`，報讀軟體會念成類似「靜音，切換按鈕，已按下」。APG 特別強調，用 `aria-pressed` 時名稱不能跟著狀態改。

範例的播放鍵用第一種，靜音鍵用第二種。這對應 WCAG 4.1.2「名稱、角色、值」：狀態要能被輔助科技讀到，狀態改變時也要通知得到。

### 2. 從媒體事件同步，不要只在點擊時同步

狀態不一定是按鈕改的：播完會自己暫停，頁面上其他程式也可能呼叫 `pause()`。只在點擊時更新名稱，這些情況名稱就會停在舊的狀態。在範例選「按下按鈕時更新」，再按「從其他地方暫停」或等它播完，就看得到名稱不符。

```js
const video = document.querySelector("video");
const playBtn = document.querySelector(".play");
const muteBtn = document.querySelector(".mute");

function sync() {
  playBtn.setAttribute("aria-label", video.paused ? "播放" : "暫停");
  muteBtn.setAttribute("aria-pressed", String(video.muted));
}
for (const type of ["play", "pause", "volumechange"]) {
  video.addEventListener(type, sync);
}
```

這些事件本來就要監聽，偽類省下的是「切換 class」這一步，不是 JavaScript 本身。

### 3. 用 CSS 的 `content` 當名稱？

`::before` 的 `content` 文字會算進按鈕名稱。我在 Chromium 159 實測，`content` 隨 `:playing` 從「播放」改成「暫停」時，按鈕名稱也跟著變了。但在不支援的 Chromium 153，含 `:playing` 的規則整條失效，名稱永遠是「播放」。焦點停在按鈕上時，報讀軟體會不會念出新名稱，我沒有實測。名稱還是建議用 HTML 屬性或文字設定。

### 4. 自動播放要給使用者停下來的方法

偽類只是外觀，不算「控制方式」。自動播放的內容還是要有真的按鈕：

- **WCAG 1.4.2「音訊控制」**：自動播放超過 3 秒的聲音，要能暫停、停止，或單獨調整音量。
- **WCAG 2.2.2「暫停、停止、隱藏」**：自動開始、超過 5 秒、和其他內容同時出現的動態內容（例如背景影片），要能暫停、停止或隱藏（動態是必要的除外）。

## 不支援的瀏覽器：別寫在同一個選擇器清單

Selectors 規範規定，瀏覽器不支援的偽類要當成無效；選擇器清單裡只要有一個無效，**整個清單都無效，整條規則都不會套用**：

```css
/* 不支援 :playing 的瀏覽器：連 .is-playing 也一起失效 */
.player:has(video:playing),
.player.is-playing { … }
```

分開寫，或包在 `:is()` 裡。`:is()` 用的是「寬容」的選擇器清單，會略過不認得的部分：

```css
.player:is(:has(video:playing), .is-playing) { … }
```

我在不支援的 Chromium 153 實測：第一種整條規則失效；`:is()` 的寫法保留了 `.is-playing`。

要用 JavaScript 判斷支援，可以這樣寫：

```js
CSS.supports("selector(:playing)");
```

CSS 則是 `@supports selector(:playing) { … }`。

## 結論

媒體狀態偽類讓「看起來」的部分不用再切 class，寫法乾淨很多。但報讀軟體聽到的名稱和狀態在 HTML 屬性上，CSS 改不到；而這些屬性要正確，本來就得監聽媒體事件。所以實務上：**外觀交給偽類，名稱和 `aria-pressed` 交給事件**，舊瀏覽器再用同一批事件設定 class 或 data 屬性當備援。

## 延伸閱讀

- [HTML-in-Canvas 的無障礙實測：報讀軟體讀得到了，但這四件事要自己補](/blog/html-in-canvas-a11y/)
- [現代 CSS 與 HTML 技巧整理清單：116 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

## 相關連結

- [W3C — Selectors Level 4：資源狀態偽類](https://drafts.csswg.org/selectors-4/#resource-pseudos "另開新視窗"){target="_blank"}
- [W3C — Selectors Level 4：寬容的選擇器清單](https://drafts.csswg.org/selectors-4/#forgiving-selector "另開新視窗"){target="_blank"}
- [WHATWG HTML — 媒體元素的偽類定義](https://html.spec.whatwg.org/multipage/semantics-other.html#pseudo-classes "另開新視窗"){target="_blank"}
- [WHATWG HTML — 媒體元素的靜音定義](https://html.spec.whatwg.org/multipage/media.html#concept-media-muted "另開新視窗"){target="_blank"}
- [MDN — Firefox 150 版本說明](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/150 "另開新視窗"){target="_blank"}
- [MDN browser-compat-data — Chrome 各版本推出日期](https://github.com/mdn/browser-compat-data/blob/main/browsers/chrome.json "另開新視窗"){target="_blank"}
- [MDN browser-compat-data — :playing](https://github.com/mdn/browser-compat-data/blob/main/css/selectors/playing.json "另開新視窗"){target="_blank"}
- [Chromium 原始碼 — runtime_enabled_features.json5（CSSMediaElementPseudos）](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/platform/runtime_enabled_features.json5 "另開新視窗"){target="_blank"}
- [WAI-ARIA 編寫實務指南 — 按鈕模式](https://www.w3.org/WAI/ARIA/apg/patterns/button/ "另開新視窗"){target="_blank"}
- [WCAG 2.2 說明文件 — 4.1.2 名稱、角色、值](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html "另開新視窗"){target="_blank"}
- [WCAG 2.2 說明文件 — 1.4.2 音訊控制](https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html "另開新視窗"){target="_blank"}
- [WCAG 2.2 說明文件 — 2.2.2 暫停、停止、隱藏](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html "另開新視窗"){target="_blank"}
