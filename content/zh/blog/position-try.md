---
title: 提示框被切掉了？用 @position-try 讓瀏覽器自己找位置
description: "tooltip、選單靠近畫面邊緣就被切掉，以前要靠 JavaScript 計算翻面。position-try-fallbacks 和 @position-try 讓 CSS 自己處理：空間不夠就換位置。這篇用可以拖動錨點的互動範例，整理三種寫法、margin 會跟著翻、瀏覽器會記住位置、position-try-order，以及都放不下時會怎樣。"
date: 2026-10-09
tags:
  - CSS
  - 前端開發
  - 無障礙
  - 瀏覽器支援
translationKey: position-try
category: frontend
draft: false
---

> 話說在前頭：文中的行為我都在 Chromium 上實測過，其他瀏覽器的細節可能不同，有講錯的地方歡迎指正。

### 前言

在 [popover 那篇](/blog/popover-auto-manual-hint/)裡，tooltip 和選單是用錨點定位（Anchor Positioning）貼在按鈕旁邊的。當時我順手加了一行 `position-try-fallbacks: flip-block`，但沒有多解釋。

這一行解決的是一個老問題：提示框、下拉選單一靠近畫面邊緣，就會被切掉一半。以前的做法是用 JavaScript 量位置、算空間，不夠就翻到另一邊，Floating UI 這類套件的 `flip` 就是在做這件事。

這件事對無障礙也很重要。使用者把畫面放大到 200%、400% 的時候，可用的空間變得很小，提示框被切掉的機率也跟著變高。

`@position-try` 是 [CSS 與 HTML 技巧清單](/blog/css-techniques-checklist)裡錨點定位的下一步，這次把它拆開來好好看。

先看一下你的瀏覽器支援度：

::feature-support{features="anchor,position-try" notice="你的瀏覽器不支援錨點定位或 position-try-fallbacks，下方範例無法運作，可以先看文字說明和程式碼。"}
::

### 一、動手試試

下面的虛線框就是畫面範圍。用滑桿移動「錨點」，提示框預設在錨點上方：

::position-try-demo
::

可以這樣玩：

1. 先選「不設定」，把錨點拉到最上面：提示框還是放在上方，直接被切掉。
2. 換成 `flip-block`，再把錨點拉到最上面：提示框翻到下方了。
3. 接著把錨點拉回中間：提示框**還是留在下方**，沒有翻回去。再按「重新顯示提示框」，它才回到上方。這不是 bug，第四節會解釋。
4. 換成自訂 `@position-try`，把錨點拉到最上面：這次提示框會先跑到右邊。
5. 換回 `flip-block`，勾選 `position-try-order`，把錨點放在中間偏上一點（垂直位置大約 35）：上方明明放得下，提示框卻跑到下方。第五節會解釋。

### 二、三種寫法

`position-try-fallbacks` 是一個清單，瀏覽器會先用原本的位置，放不下就依序往後試，用第一個放得下的。清單裡可以放三種東西。

**1. flip 關鍵字：把原本的位置翻過去**

```css
.tip {
  position-area: top;
  position-try-fallbacks: flip-block;
}
```

| 關鍵字 | 效果 | 實測（原本 → 翻面後） |
|---|---|---|
| `flip-block` | 上下翻 | 上方 → 下方 |
| `flip-inline` | 左右翻 | 右邊 → 左邊 |
| `flip-start` | 沿對角線翻，上下和左右對調 | 上方 → 左邊 |

也可以組合，例如 `flip-block flip-inline` 代表上下、左右一起翻，適合放在角落的選單。

**2. 直接寫 `position-area` 的值**

```css
.tip {
  position-area: top;
  position-try-fallbacks: bottom, right;
}
```

上方放不下就試下方，再不行就試右邊。簡單的情況這樣寫最直覺。

**3. 用 `@position-try` 自訂**

需要連 margin、尺寸一起換的時候，就用 `@position-try` 定義一組備案：

```css
@position-try --right {
  position-area: right;
  margin: 0 0 0 8px;
  width: 12rem;
}

.tip {
  position-area: top;
  margin-bottom: 8px;
  position-try-fallbacks: --right, flip-block;
}
```

`@position-try` 裡只能寫跟位置有關的屬性：

| 可以寫的屬性 | 例子 |
|---|---|
| 錨點 | `position-anchor`、`position-area` |
| 定位 | `top`、`left`、`inset` 這類 |
| 外距 | `margin` 系列 |
| 尺寸 | `width`、`height`、`min-*`、`max-*` |
| 對齊 | `align-self`、`justify-self` |

我實測在 `@position-try` 裡寫 `background`，會直接被忽略，不會報錯，也不會套用。所以「翻到下方時換個顏色」這種需求，`@position-try` 做不到。

### 三、margin 會跟著翻

用 `flip-block` 的時候，不用擔心間距。我實測原本寫 `margin-bottom: 8px` 的提示框，翻到下方之後，瀏覽器會自動變成 `margin-top: 8px`，提示框和錨點之間一樣保持 8px，不會黏在一起。

所以 margin 只要寫在「面對錨點的那一邊」就好，翻面的時候會一起處理。自訂 `@position-try` 就不會自動翻了，要像上面的範例一樣自己寫 margin。

### 四、瀏覽器會記住上一次的位置

這是我實測時最意外的地方，也就是範例第 3 步看到的狀況。

提示框翻到下方之後，就算錨點移回中間、上方又放得下了，提示框**還是會留在下方**。要等到下方也放不下（例如把錨點拉到最下面），才會再翻回上方。

規格裡把這叫做記住「上一次成功的位置」。這樣設計是有道理的：如果使用者正在捲動頁面，提示框一下在上、一下在下來回跳，會很難閱讀，對認知障礙或容易分心的使用者更是困擾。

這個記憶什麼時候會清掉？我實測，元素被隱藏再顯示（`display: none` 再改回來）就會清掉，重新挑一次位置。popover 也一樣：關掉再打開，就會依當下的空間重新決定。範例裡的「重新顯示提示框」按鈕就是在模擬這件事。

所以對 popover 來說，每次打開都是重新開始；會用到這個記憶的，是打開之後還會跟著捲動、拖動的情況。知道有這回事，測試時才不會以為是 bug。

### 五、position-try-order：挑空間最大的

預設的規則是「原本的位置放得下就用」。但有時候你想要的是「哪邊空間大就放哪邊」，例如很長的下拉選單：

```css
.menu {
  position-area: top;
  position-try-fallbacks: flip-block;
  position-try-order: most-height;
}
```

我實測，錨點在中間偏上、上方其實放得下的時候，加了 `most-height` 的選單會選擇空間比較大的下方。可以用的值有 `most-height`、`most-width`、`most-block-size`、`most-inline-size`。

要注意的是，它只在「重新挑位置」的時候才排序。我實測對一個已經顯示在上方、而且上方還放得下的元素加上 `most-height`，它不會動，要隱藏再顯示才會換到下方。這跟上一節的記憶是同一件事：已經放好的位置，只要還放得下就不會換。

也可以用簡寫 `position-try` 一次寫完：

```css
.menu {
  position-try: most-height flip-block;
}
```

### 六、全部都放不下時

如果原本的位置和所有備案都放不下，瀏覽器會**退回原本的位置**，就算會被切掉也一樣。我另外做了一個很矮的範圍來測，提示框確實留在上方被切掉。

所以原本的位置，要設成「最常見、最合理」的那個。備案只是備案，不保證一定有地方放。

### 七、跟 popover 搭配

實務上最常用的組合，就是 popover 加上錨點定位。popover 開啟時會進入 top layer，這時候判斷「放不放得下」的範圍是整個視窗，正好就是我們要的：

```html
<button popovertarget="menu" style="anchor-name: --menu-btn">更多</button>
<div id="menu" popover>…</div>
```

```css
#menu {
  position-anchor: --menu-btn;
  position-area: bottom span-right;
  margin: 8px 0 0;
  position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;
}
```

往下放不下就往上，往右放不下就往左，角落就兩個一起翻。這幾行就取代了以前整段的 JavaScript 定位邏輯。

不支援的瀏覽器怎麼辦？我的做法是用 `@supports (position-area: bottom)` 包起來，不支援時再用 JavaScript 定位，[popover 那篇](/blog/popover-auto-manual-hint/)的範例就是這樣做的。

### 無障礙上要注意的事

- **只換畫面上的位置**：翻面不會改變 DOM 順序，報讀軟體唸的順序、鍵盤 Tab 的順序都不受影響。
- **提示框本身的規則還是要顧**：WCAG 1.4.13「滑鼠移入或聚焦時出現的內容」要求提示框可以關閉、滑鼠移上去不會消失、不會自己突然不見。位置放對了，這些還是要自己處理。
- **放大時更需要它**：畫面放大後空間變小，有沒有備案，差別會比平常更明顯。測試時記得把畫面放大到 200%、400% 看看。

### 結論

整理成幾句話：

- `position-try-fallbacks` 讓錨點定位的元素在空間不夠時，依序嘗試備案位置。
- 備案可以用 flip 關鍵字、`position-area` 的值，或是 `@position-try` 自訂。
- `flip-block` 會連 margin 一起翻；`@position-try` 只能寫位置相關的屬性。
- 翻過去之後會記住位置，不會來回跳；隱藏再顯示（例如 popover 重新打開）才會重新挑。
- 想要「哪邊空間大放哪邊」，加上 `position-try-order: most-height`。
- 全部放不下時，會退回原本的位置。

以前要引入一個套件、寫一堆事件監聽才做得到的事，現在幾行 CSS 就解決了。而且這件事對放大畫面的使用者特別有感，算是很實在的無障礙改善。

你的專案裡，提示框和選單還是用 JavaScript 定位的嗎？歡迎一起討論！

### 延伸閱讀

- [Popover 的 auto、manual、hint 到底差在哪？做個可以玩的範例來看看](/blog/popover-auto-manual-hint/)
- [現在的 dialog 要怎麼寫？從 showModal() 到 command、closedby 一次整理](/blog/dialog-modern-guide/)
- [現代 CSS 與 HTML 技巧整理清單：102 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

### 相關連結

- [MDN — position-try-fallbacks](https://developer.mozilla.org/en-US/docs/Web/CSS/position-try-fallbacks "另開新視窗"){target="_blank"}
- [MDN — @position-try](https://developer.mozilla.org/en-US/docs/Web/CSS/@position-try "另開新視窗"){target="_blank"}
- [MDN — 錨點定位的備案與條件隱藏](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning/Try_options_hiding "另開新視窗"){target="_blank"}
- [WCAG 2.2 — 1.4.13 滑鼠移入或聚焦時出現的內容](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus "另開新視窗"){target="_blank"}
- [Can I use（瀏覽器支援度查詢）](https://caniuse.com "另開新視窗"){target="_blank"}
