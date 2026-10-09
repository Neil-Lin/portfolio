---
title: 只用 CSS 做輪播，無障礙夠嗎？拿我的 UI Kit 來對照
description: "::scroll-marker 和 ::scroll-button() 讓 CSS 不寫 JavaScript 就能做出輪播的導覽點和上一張／下一張按鈕。但輪播一直是無障礙的重災區，原生版本到底夠不夠？這篇用同樣的內容，把原生 CSS 輪播和我在 Accesserty UI Kit 裡實作的 <au-carousel> 並排，實測無障礙樹和鍵盤操作。"
date: 2026-10-09
tags:
  - CSS
  - 前端開發
  - 無障礙
  - Web Components
  - 瀏覽器支援
category: frontend
translationKey: css-carousel-a11y
draft: false
---

> 話說在前頭：文中的行為都是我在 Chromium 141 上實測的，無障礙樹是從瀏覽器的無障礙 API 讀出來的；報讀軟體實際怎麼唸，還是要以你自己打開報讀軟體聽到的為準。有講錯的地方歡迎指正。

### 前言

輪播（carousel）大概是無障礙最常出問題的元件：導覽點沒有名稱、按鈕只有一個箭頭符號、焦點不知道跑去哪裡、自己一直轉不停。

CSS 現在多了 `::scroll-marker` 和 `::scroll-button()`，不寫 JavaScript 就能做出導覽點和上一張／下一張按鈕。它是 [CSS 與 HTML 技巧清單](/blog/css-techniques-checklist)裡我很好奇的一項：瀏覽器原生做的，無障礙會不會比較好？

剛好我在 [Accesserty UI Kit](https://github.com/Accesserty/UI-Kit "另開新視窗"){target="_blank"} 裡實作過一個無障礙輪播 `<au-carousel>`，所以這次就把兩個放在一起，用一模一樣的內容來對照。

先看一下你的瀏覽器支援度：

::feature-support{features="scroll-marker" notice="你的瀏覽器不支援 ::scroll-marker，下方第一個範例只會是一排可以左右捲動的卡片；第二個 UI Kit 範例不受影響。"}
::

### 一、原生 CSS 輪播怎麼寫

先把內容做成一排可以左右捲動、會自動對齊的清單，這部分用的是 `scroll-snap`，已經很成熟了：

```css
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.carousel > li {
  flex: 0 0 100%;
  scroll-snap-align: start;
}
```

接著加上這次的主角：

```css
/* 導覽點：每個 li 產生一個，集中放在輪播後面 */
.carousel {
  scroll-marker-group: after;
}
.carousel > li::scroll-marker {
  content: "" / attr(data-title); /* 畫面上是圓點，斜線後面是給報讀軟體的名稱 */
}
.carousel > li::scroll-marker:target-current {
  /* 目前這張的導覽點 */
}

/* 上一張／下一張按鈕 */
.carousel::scroll-button(inline-start) {
  content: "‹" / attr(data-prev);
}
.carousel::scroll-button(inline-end) {
  content: "›" / attr(data-next);
}
```

```html
<ul class="carousel" aria-label="旅遊行程" data-prev="上一張" data-next="下一張">
  <li data-title="京都">…</li>
  <li data-title="大阪">…</li>
</ul>
```

`content` 斜線後面的是替代文字，也就是報讀軟體會唸的名稱。我實測替代文字裡可以用 `attr()`，所以名稱可以從 HTML 的 `data-*` 讀進來，做多語系就方便多了。

實際效果：

::carousel-native-demo
::

做範例時踩到一個坑：`::scroll-marker-group` 是一整列的區塊，如果把上一張／下一張按鈕定位到同一列的左右兩邊，按鈕會被這一列蓋住，滑鼠點不到（鍵盤還是可以操作）。替按鈕加上 `z-index` 就好了：

```css
.carousel::scroll-button(*) {
  position: absolute;
  z-index: 1;
}
```

### 二、在無障礙樹裡變成什麼？

我把上面這個範例的無障礙樹讀出來，整理如下：

| 畫面上的東西 | 無障礙樹裡的角色 | 名稱 | 狀態 |
|---|---|---|---|
| 上一張／下一張 | `button` | 替代文字（「上一張」） | 到頭尾時是 `disabled` |
| 導覽點這一組 | `tablist` | **沒有名稱** | — |
| 每個導覽點 | `tab` | 替代文字（「京都」） | 目前這張是 `selected` |
| 每張投影片 | 維持原本的 `listitem` | — | — |

有兩件事值得注意：

- **導覽點用的是頁籤語意**：導覽點變成 `tab`，但投影片並沒有變成對應的 `tabpanel`，還是原本的清單項目。報讀軟體使用者聽到「頁籤」，會預期它在切換面板。
- **`tablist` 沒有名稱**：一個頁面上有兩個輪播，就會有兩個沒有名稱的頁籤清單，分不出來。

### 三、鍵盤實測

我用鍵盤從輪播前面的按鈕開始按 Tab，結果如下：

1. **導覽點這一組只佔一個停留點**，焦點落在目前這張的導覽點上。
2. **在導覽點上按左右方向鍵**可以切換，到第一張再按左，會繞回最後一張。
3. **再按 Tab 到「下一張」按鈕**。一開始的「上一張」是 `disabled`，直接被跳過。
4. **接著是每一張投影片裡的按鈕**，不只目前這張，所有投影片的都在 Tab 順序裡。

順序上有個意外：我把導覽點放在輪播後面（`scroll-marker-group: after`），也試了放在前面（`before`），Tab 順序都是「導覽點 → 下一張 → 內容」，跟畫面上的位置不一致。

最大的問題在最後一張：

- 一直按「下一張」到最後一張時，按鈕變成 `disabled`，**焦點還停在這個已經不能用的按鈕上**，焦點框也跟著變淡。
- 這時再按 Tab，焦點跳到**第一張**投影片的按鈕，**輪播整個捲回第一張**。

也就是說，鍵盤使用者按到最後一張之後，下一步就被帶回開頭了。

另外，原生版本**沒有任何播報**。按「下一張」換了投影片，報讀軟體不會被告知現在是哪一張。

### 四、我在 UI Kit 裡怎麼做

下面是同樣的內容，換成 Accesserty UI Kit 的 `<au-carousel>`：

::carousel-au-demo
::

用起來很像，但這幾個地方是我刻意設計的：

- **整個輪播有名稱和角色描述**：外層是 `role="group"`，名稱是「旅遊行程」，`aria-roledescription` 是「輪播」，報讀軟體就知道這一整塊是什麼。
- **導覽點是真正的按鈕，而且有位置**：名稱是「京都，第 1 張，共 4 張」，目前這張標 `aria-current`，不用頁籤語意。
- **導覽點這一組也有名稱和操作說明**：「選擇投影片」，並用 `aria-describedby` 補上「用方向鍵在投影片之間移動」。
- **導覽點放在內容前面**：先知道一共有幾張，再看內容；上一張／下一張放在內容後面。
- **從導覽點按 Tab，直接進到目前這張**：不是第一張，也不是畫面上最左邊那張。
- **到頭尾時用 `aria-disabled`，不用 `disabled`**：按鈕還能聚焦，焦點不會掉，也不會被帶回開頭。
- **換投影片時用 live region 播報**：例如「奈良，第 3 張，共 4 張」；焦點在導覽點上時就不唸，因為導覽點的名稱已經唸過了。
- **沒有自動播放**：直接避開 WCAG 2.2.2「暫停、停止、隱藏」的問題。
- **其他細節**：`prefers-reduced-motion` 時不做平滑捲動、高對比模式（`forced-colors`）有對應的樣式、導覽點和按鈕的點擊範圍至少 24px。

我實測它的無障礙樹：外層是有名稱的 `group`，導覽點群組是名稱為「選擇投影片」的 `group`，每個導覽點都是 `button`。按到最後一張時，焦點停在「下一張」上，live region 唸出最後一張的名稱。

### 五、並排對照

| 項目 | 原生 CSS | `<au-carousel>` |
|---|---|---|
| 需要 JavaScript | 不需要 | 需要 |
| 支援的瀏覽器 | 目前只有 Chromium | 不限 Chromium（一般 Web Component） |
| 輪播本身的名稱 | 自己在容器加 `aria-label` | 有，還有角色描述 |
| 導覽點的語意 | `tablist`／`tab` | 一般按鈕 + `aria-current` |
| 導覽點群組的名稱 | 沒有 | 有，還有操作說明 |
| 導覽點的名稱 | 替代文字 | 標題 + 第幾張、共幾張 |
| 方向鍵 | 可以，頭尾會繞回 | 可以，頭尾停住，支援 Home／End |
| 進入內容 | 照 DOM 順序，從第一張開始 | 直接到目前這張 |
| 頭尾的按鈕 | `disabled`，焦點會掉 | `aria-disabled`，焦點留著 |
| 換投影片的播報 | 沒有 | 有 |

### 六、原生版本能補什麼？

原生版本最大的限制是：**導覽點和按鈕都是偽元素**，沒辦法加 HTML 屬性。所以：

**補不了的：**

- 沒辦法替 `tablist` 加名稱。
- 沒辦法把 `disabled` 換成 `aria-disabled`。
- 沒辦法把頁籤語意換成按鈕。
- 沒辦法改 Tab 順序，也沒辦法讓焦點直接進到目前這張。

**補得了的：播報。** 瀏覽器有一個 `scrollsnapchange` 事件，捲動對齊到新的投影片時會觸發，我實測按按鈕或捲動都會觸發。可以搭配 [ariaNotify() 那篇](/blog/aria-notify/)的寫法來播報：

```js
carousel.addEventListener("scrollsnapchange", (event) => {
  const slide = event.snapTargetInline;
  if (slide) announce(carousel, slide.dataset.title);
});
```

但補到這裡，就已經在寫 JavaScript 了，而且最重要的焦點問題還是沒解決。

### 結論

整理成幾句話：

- `::scroll-marker`、`::scroll-button()` 讓 CSS 不寫 JavaScript 就能做出完整的輪播操作介面。
- 替代文字可以用 `attr()`，按鈕和導覽點的名稱可以從 HTML 讀進來。
- 但在無障礙上還有幾個硬傷：導覽點群組沒有名稱、用的是頁籤語意、到頭尾時焦點會掉而且會被帶回第一張、沒有播報。
- 這些大多是偽元素本身的限制，用 JavaScript 也補不了。

所以我目前的結論是：**原生 CSS 輪播還不能取代一個認真做的無障礙輪播元件**。但它背後的版面技術，例如 `scroll-snap`、container query，本來就很好用，我的 `<au-carousel>` 也是用它們來排版的。等規範讓這些偽元素可以調整語意、或是把頭尾的按鈕改成不會讓焦點掉的做法，我會很樂意回來改寫這篇。

最後還是老話一句：輪播能不用就不用，要用的話，至少不要自動播放。

你的專案裡有輪播嗎？是自己做的還是用套件？歡迎一起討論！

### 延伸閱讀

- [讓報讀軟體開口說話：用 ariaNotify() 取代 aria-live](/blog/aria-notify/)
- [提示框被切掉了？用 @position-try 讓瀏覽器自己找位置](/blog/position-try/)
- [現代 CSS 與 HTML 技巧整理清單：102 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

### 相關連結

- [Accesserty UI Kit（GitHub）](https://github.com/Accesserty/UI-Kit "另開新視窗"){target="_blank"}
- [MDN — ::scroll-marker](https://developer.mozilla.org/en-US/docs/Web/CSS/::scroll-marker "另開新視窗"){target="_blank"}
- [MDN — ::scroll-button()](https://developer.mozilla.org/en-US/docs/Web/CSS/::scroll-button "另開新視窗"){target="_blank"}
- [Chrome for Developers — Carousels with CSS](https://developer.chrome.com/blog/carousels-with-css "另開新視窗"){target="_blank"}
- [WAI-ARIA APG — Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/ "另開新視窗"){target="_blank"}
- [Can I use（瀏覽器支援度查詢）](https://caniuse.com "另開新視窗"){target="_blank"}
