---
title: 讓 ARIA 當唯一的真相：用 CSS attr() 直接讀 aria-valuenow
description: "CSS 的 attr() 以前只能用在 content，現在可以帶型別、用在任何屬性。這篇用無障礙的角度實測它：進度條、評分、樹狀選單的長度和縮排直接讀 ARIA 屬性，讓「看到的」和「報讀軟體讀到的」只有一個來源，不會不同步。也整理了子元素讀不到父層屬性、輸入框的 value 等實測時踩到的坑。"
date: 2026-10-13
tags:
  - CSS
  - 前端開發
  - 無障礙
  - 瀏覽器支援
category: frontend
translationKey: css-attr
draft: false
---

> 話說在前頭：文中的行為我在 Chromium 141 和 153 上實測過。Safari 的支援狀況我寫這篇時沒有查到確定的資料，上線前請以 caniuse 為準。有講錯的地方歡迎指正。

### 前言

做無障礙元件有一個很好用的習慣：**用 ARIA 屬性當樣式的依據**。

例如手風琴展開時，不另外加一個 `.is-open` class，而是直接寫：

```css
[aria-expanded="true"] + .panel {
  display: block;
}
```

這樣「畫面上展開了」和「報讀軟體聽到的展開狀態」只有一個來源。只要 `aria-expanded` 改了，畫面就跟著變；忘了改 `aria-expanded`，畫面也不會動，開發時馬上就會發現。

但這招只適用於「開／關」這種狀態。遇到**數值**就沒辦法了：進度條的 `aria-valuenow="40"`，CSS 沒辦法把 40 變成寬度，只好用 JavaScript 同時更新 `style.width` 和 `aria-valuenow`。兩個地方都要改，就有漏改的可能：畫面上進度是 70%，報讀軟體聽到的卻還是 40%。

`attr()` 補上了這一塊。它是 [CSS 與 HTML 技巧清單](/blog/css-techniques-checklist)裡「`attr()` 用在任何屬性」這一項。

先看一下你的瀏覽器支援度：

::feature-support{features="attr-typed" notice="你的瀏覽器不支援帶型別的 attr()，下方範例會改用 JavaScript 把數值複製到 CSS 變數，效果一樣。"}
::

### 一、以前的 attr()：只能放進 content

`attr()` 其實很早就有了，但只能用在 `content`，而且讀到的一律是字串：

```css
a::after {
  content: " (" attr(href) ")";
}
```

想拿它當寬度、顏色、間距，都沒有作用。

### 二、新寫法：帶型別，用在任何屬性

現在可以告訴瀏覽器「這個屬性的值要當成什麼型別」，再給一個讀不到時的預設值：

```css
.bar {
  width: attr(data-width type(<length>), 0px);
  color: attr(data-color type(<color>), black);
}
```

| 寫法 | 意思 | 實測 |
|---|---|---|
| `attr(data-n type(<number>), 0)` | 當成數字 | `data-n="40"` 讀到 40 |
| `attr(data-w type(<length>), 0px)` | 當成長度 | 要寫 `data-w="50px"`，只寫 `50` 會退回預設值 |
| `attr(data-w px, 5px)` | 數字加上單位 | `data-w="50"` 讀到 50px |
| `attr(data-n em, 1em)` | 換其他單位也可以 | `data-n="5"` 讀到 5em |
| `attr(data-c type(<color>), black)` | 當成顏色 | `data-c="tomato"` 讀到番茄紅 |
| `attr(aria-level type(<integer>), 1)` | 當成整數 | 適合 `aria-level` 這類層級 |

最重要的是，**它可以讀 ARIA 屬性**。

### 三、例子一：進度條的長度直接讀 aria-valuenow

```html
<div class="progress" role="progressbar" aria-label="上傳進度"
     aria-valuemin="0" aria-valuemax="100" aria-valuenow="40">
  <span class="progress__fill"></span>
</div>
```

```css
.progress {
  --now: attr(aria-valuenow type(<number>), 0);
}
.progress__fill {
  width: calc(var(--now) * 1%);
}
```

JavaScript 只要更新一件事：

```js
progress.setAttribute("aria-valuenow", 70);
```

寬度會自動跟著變。我實測用 `setAttribute` 改值，畫面會立刻重新計算，不需要其他程式。

下面的範例可以切換新舊兩種寫法，再勾選「模擬程式漏改了 aria-valuenow」，看舊寫法怎麼出錯：

::attr-aria-demo{kind="progress"}
::

新寫法下，根本沒有「漏改」的機會：畫面上的長度就是從 `aria-valuenow` 讀出來的，只要長度對了，報讀軟體讀到的也一定對。

如果最小值不是 0，可以把 `aria-valuemin`、`aria-valuemax` 也一起讀進來計算：

```css
.progress {
  --now: attr(aria-valuenow type(<number>), 0);
  --min: attr(aria-valuemin type(<number>), 0);
  --max: attr(aria-valuemax type(<number>), 100);
}
.progress__fill {
  width: calc((var(--now) - var(--min)) / (var(--max) - var(--min)) * 100%);
}
```

我實測 `aria-valuemin="10"`、`aria-valuemax="60"`、`aria-valuenow="35"`，寬度剛好是 50%。

### 四、第一個坑：子元素讀不到父層的屬性

仔細看上面的寫法，`--now` 是寫在外層 `.progress` 上，不是直接寫在 `.progress__fill`。

這是我實測時踩到的坑。我一開始是這樣寫的：

```css
/* 不會動 */
.progress__fill {
  width: calc(attr(aria-valuenow type(<number>), 0) * 1%);
}
```

結果寬度永遠是 0。因為 **`attr()` 只讀「這條宣告所在的元素自己」的屬性**。`aria-valuenow` 在外層的 `.progress` 上，`.progress__fill` 自己沒有這個屬性，所以拿到的是預設值 0。

解法就是在有屬性的那一層，把值讀成 CSS 變數，子元素和偽元素再透過繼承拿到：

```css
.progress { --now: attr(aria-valuenow type(<number>), 0); }  /* 在有屬性的這一層讀 */
.progress__fill { width: calc(var(--now) * 1%); }             /* 子元素用繼承來的變數 */
```

### 五、例子二：評分的星星長度

評分顯示也是同一個模式。用 `role="meter"` 搭配 `aria-valuenow`，星星長度直接讀它：

```html
<span class="rating" role="meter" aria-label="京都的評分"
      aria-valuemin="0" aria-valuemax="5" aria-valuenow="4.5"
      aria-valuetext="4.5 顆星，滿分 5 顆"></span>
```

```css
.rating {
  --now: attr(aria-valuenow type(<number>), 0);
}
.rating::before { content: "★★★★★" / ""; }
.rating::after {
  content: "★★★★★" / "";
  width: calc(var(--now) / 5 * 100%);
  overflow: hidden;
}
```

::attr-aria-demo{kind="rating"}
::

兩個無障礙細節：

- **星星是裝飾**：`content` 斜線後面給空字串，報讀軟體就不會唸出五個星號。評分的名稱和數值由 `aria-label`、`aria-valuetext` 提供。
- **`aria-valuetext` 給人聽的版本**：`aria-valuenow` 是給程式和 CSS 用的數字，`aria-valuetext` 則是報讀軟體實際唸的句子，例如「4.5 顆星，滿分 5 顆」。

### 六、例子三：樹狀選單的縮排讀 aria-level

樹狀選單的每一層，本來就要用 `aria-level` 告訴報讀軟體它在第幾層。畫面上的縮排，可以直接讀同一個值：

```css
[role="treeitem"] {
  padding-inline-start: calc((attr(aria-level type(<integer>), 1) - 1) * 1.5rem);
}
```

我實測 `aria-level` 是 1、2、4 的項目，縮排分別是 0、24px、72px。這裡 `attr()` 寫在 `treeitem` 自己身上，屬性也在它身上，所以不用透過變數轉手。

以後調整樹狀結構時，只要改 `aria-level`，縮排就會跟著對；反過來說，如果縮排看起來不對，問題一定出在 `aria-level`，報讀軟體使用者也會受影響，開發時就能一起發現。

### 七、其他實測的細節

- **值不合法時會退回預設值**：`aria-valuenow="abc"`、`aria-level="x"` 都會用逗號後面的預設值，不會讓版面壞掉。所以**預設值一定要給**。
- **它讀的是屬性，不是元素的即時狀態**：`<input type="range" value="30">` 拖動之後，`input.value` 變了，但 HTML 上的 `value` 屬性還是 30，`attr(value)` 也還是讀到 30。表單元件的即時值，還是要用 JavaScript 處理。
- **不能用在網址裡**：`background-image: url(attr(data-img))` 不會有作用，`type(<url>)` 也讀不到。這是為了安全刻意禁止的，避免頁面上的屬性被拿來載入外部資源。

### 八、不支援的時候怎麼辦？

偵測方式：

```css
@supports (width: attr(data-x type(<length>))) {
  .progress {
    --now: attr(aria-valuenow type(<number>), 0);
  }
}
```

不支援時，就退回用 JavaScript 把值複製到 CSS 變數，這篇的範例就是這樣做的：

```js
if (!CSS.supports("width: attr(data-x type(<length>))")) {
  progress.style.setProperty("--now", progress.getAttribute("aria-valuenow"));
}
```

這樣 CSS 的部分只要寫一次：支援時讀屬性，不支援時讀 JavaScript 寫進來的變數。

### 結論

整理成幾句話：

- `attr()` 現在可以帶型別、用在任何屬性，例如 `attr(aria-valuenow type(<number>), 0)`。
- 用它讀 ARIA 屬性，讓「看到的」和「報讀軟體讀到的」只有一個來源，像進度條、評分、樹狀縮排。
- `attr()` 只讀自己身上的屬性，子元素要用的話，在有屬性的那一層讀成 CSS 變數再繼承。
- 一定要給預設值；它讀的是屬性不是即時狀態；不能用在 `url()` 裡。
- 不支援時，用 JavaScript 把值複製到 CSS 變數。

「讓 ARIA 當唯一的真相」以前只能用在開關狀態，現在連數值也做得到了。少一個需要同步的地方，就少一個會出錯的地方。

你的專案裡，有哪些地方是 JavaScript 同時在改樣式和 ARIA 的？歡迎一起討論！

### 延伸閱讀

- [不用再手刻 roving tabindex：用 focusgroup 做鍵盤方向鍵導覽](/blog/focusgroup/)
- [讓報讀軟體開口說話：用 ariaNotify() 取代 aria-live](/blog/aria-notify/)
- [現代 CSS 與 HTML 技巧整理清單：115 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

### 相關連結

- [MDN — attr()](https://developer.mozilla.org/en-US/docs/Web/CSS/attr "另開新視窗"){target="_blank"}
- [Chrome for Developers — CSS attr() gets an upgrade](https://developer.chrome.com/blog/advanced-attr "另開新視窗"){target="_blank"}
- [WAI-ARIA APG — Meter Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/meter/ "另開新視窗"){target="_blank"}
- [Can I use（瀏覽器支援度查詢）](https://caniuse.com "另開新視窗"){target="_blank"}
