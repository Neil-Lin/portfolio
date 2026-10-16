---
title: "設計師畫得出來，工程師終於做得出來：用 corner-shape 做方圓角、優惠券、箭頭步驟和切角按鈕"
description: "App 圖示的方圓角、優惠券的半圓缺口、結帳流程的箭頭步驟、遊戲風格的切角按鈕，以前都要靠 clip-path 或 mask，結果焦點外框和邊框一起被切掉。這篇用互動範例比較以前的寫法和 corner-shape，附上完整程式碼與註解，並實測強制色彩模式、點擊範圍等無障礙細節。"
date: 2026-10-16
tags:
  - CSS
  - 前端開發
  - 無障礙
  - 瀏覽器支援
category: frontend
translationKey: css-corner-shape
draft: false
---

> 話說在前頭：文中的行為我在 Chromium 141 和 153 上實測過，兩版都支援 `corner-shape`，有差異的地方會特別標出來。其他瀏覽器的支援狀況請以 caniuse 為準。有講錯的地方歡迎指正。

## 前言

設計稿上常常出現這些東西：

- App 圖示那種比圓角更柔順的「方圓角」。
- 優惠券中間的半圓缺口和撕線。
- 結帳流程「購物車 → 填寫資料 → 付款」的箭頭步驟。
- 遊戲、科技感網站上斜斜切掉一角的按鈕。

設計師在 Figma 上幾秒鐘就畫好了，工程師拿到卻要繞一大圈：`clip-path`、`mask`、SVG、偽元素疊三角形。更麻煩的是，這些做法常常**把焦點外框和邊框一起切掉**，鍵盤使用者就看不到自己在哪裡。

[CSS 與 HTML 技巧清單](/blog/css-techniques-checklist)裡的 `corner-shape`，讓這些形狀回到 `border-radius` 的家族裡：邊框、外框、陰影都會跟著形狀畫。

先看一下你的瀏覽器支援度：

::feature-support{features="corner-shape" notice="你的瀏覽器不支援 corner-shape，下方範例的形狀會退回一般的圓角，「以前的寫法」仍然可以比較。"}
::

## 一、corner-shape 怎麼用

`corner-shape` 要搭配 `border-radius` 一起用：**`border-radius` 決定角有多大，`corner-shape` 決定角是什麼形狀**。只寫 `corner-shape`、沒有 `border-radius`，角還是直角，什麼都不會發生。

```css
.box {
  border-radius: 20px; /* 角的大小 */
  corner-shape: bevel; /* 角的形狀：斜角 */
}
```

可以用的形狀：

| 關鍵字 | 形狀 | 對應的 `superellipse()` |
|---|---|---|
| `round` | 一般圓角（預設值） | `superellipse(1)` |
| `squircle` | 方圓角，介於圓角和直角之間 | `superellipse(2)` |
| `square` | 直角 | `superellipse(infinity)` |
| `bevel` | 斜角，一條直線切過去 | `superellipse(0)` |
| `scoop` | 往內凹的圓弧 | `superellipse(-1)` |
| `notch` | 往內凹的直角缺口 | `superellipse(-infinity)` |

`superellipse()` 可以填任何數字，數字越大越接近直角，0 是斜角，負數是往內凹。

每個角可以分開指定，順序跟 `border-radius` 一樣是**左上、右上、右下、左下**：

```css
.ticket {
  border-radius: 12px;
  corner-shape: round scoop scoop round; /* 只有右邊兩個角往內凹 */
}
```

也可以用 `corner-top-left-shape` 這類單一角落的屬性。

**141 和 153 的差異**：用 `getComputedStyle()` 讀值時，141 會回傳關鍵字（例如 `scoop`），153 會換成 `superellipse(-1)`。如果你的 JavaScript 有讀這個值來判斷，要兩種都處理。

## 二、動手試試

下面四個都是常見的設計，可以切換「corner-shape」和「以前的寫法」比較。用 Tab 鍵移到每個按鈕和連結上，看看焦點外框：

::corner-shape-demo
::

可以試試看：

- 切到「以前的寫法」，再用 Tab 移過去：**焦點外框全部不見了**。
- 同樣在「以前的寫法」，看斜邊和缺口：**那一段沒有邊框**。
- 勾選「模擬強制色彩模式」：背景被移除之後，以前的寫法只剩斷掉的線，App 圖示的邊框也缺了角。

範例的「模擬強制色彩模式」只是把背景換成 `Canvas`、文字和邊框換成 `CanvasText`。我也用 Chromium 的開發者工具模擬強制色彩模式比對過，結果一樣。

## 三、四個設計的完整寫法

每個設計都分成三段：以前的寫法、`corner-shape` 的寫法，以及不支援時的備案。下面的顏色都可以換成你自己的設計。

為了比較焦點外框，範例裡的按鈕和連結統一用 `outline` 畫焦點框：

```css
.demo :focus-visible {
  outline: 3px solid oklch(83% 0.17 82); /* 黃色焦點框 */
  outline-offset: 3px; /* 跟元素留一點距離，看得出有沒有跟著形狀 */
}
```

### 1. App 圖示的方圓角

iOS 的 App 圖示不是一般的圓角，而是曲率連續變化的方圓角：角和直線的銜接更柔順，沒有一般圓角那個「轉折點」。

**以前的寫法**：大部分人直接用 `border-radius: 22%` 近似，形狀其實不對。要做到一模一樣，就得用 SVG 畫出路徑，再當成遮罩：

```css
.app-icon {
  /* 用 SVG 路徑當遮罩，路徑外的部分全部被切掉 */
  mask: url(squircle.svg) center / 100% 100% no-repeat;
}
```

`mask` 會把元素範圍外的東西都切掉，包含 `outline`。焦點外框畫在元素外面，所以整圈不見。

**corner-shape 的寫法**：

```css
.app-icon {
  inline-size: 6rem;
  block-size: 6rem;
  /* 透明邊框：平常看不到；強制色彩模式會把它變成文字色，
     圖示的形狀才不會跟著背景一起消失 */
  border: 2px solid transparent;
  border-radius: 22%; /* 不支援 corner-shape 時：一般圓角 */
  background: linear-gradient(oklch(62% 0.2 294), oklch(40% 0.2 294));
}

@supports (corner-shape: squircle) {
  .app-icon {
    border-radius: 50%; /* 角的大小拉到最大 */
    corner-shape: squircle; /* 整個變成方圓形 */
  }
}
```

注意 `border-radius` 的值：一般圓角用 `22%` 才像 App 圖示，但 `squircle` 的曲線比較「方」，要拉到 `50%` 才會是完整的方圓形。所以兩個值要分開寫在 `@supports` 裡外，不能共用。

**透明邊框**是我在測強制色彩模式時才注意到的：圖示沒有邊框時，強制色彩模式移除背景，整個圖示只剩一個「N」，形狀完全不見。加上透明邊框，平常看不出差別，強制色彩模式下就會畫出方圓形的輪廓。

### 2. 優惠券的半圓缺口

電商的優惠券：左邊是優惠內容，右邊是「領取」按鈕，中間有一條撕線，撕線上下各有一個半圓缺口。

**以前的寫法**：用 `radial-gradient` 當遮罩，在角落挖出透明的圓：

```css
.coupon-info {
  border-radius: 0.75rem 0 0 0.75rem;
  mask:
    /* 右上角挖一個半徑 0.75rem 的透明圓，只套用在上半部 */
    radial-gradient(circle 0.75rem at 100% 0, #0000 98%, #000) top / 100% 51% no-repeat,
    /* 右下角同樣挖一個，只套用在下半部 */
    radial-gradient(circle 0.75rem at 100% 100%, #0000 98%, #000) bottom / 100% 51% no-repeat;
}
/* 「領取」按鈕在左邊兩個角挖洞，寫法相同，位置改成 0 0 和 0 100% */
```

問題有兩個：缺口是「挖掉」的，**缺口的弧線上沒有邊框**；而且遮罩套在按鈕上，**按鈕的焦點外框也被切掉**。

**corner-shape 的寫法**：

```html
<div class="coupon">
  <p class="coupon-info">
    <strong>滿千折百</strong>
    <span>有效至 12/31</span>
  </p>
  <button type="button" class="coupon-btn">領取</button>
</div>
```

```css
.coupon {
  display: flex; /* 左右兩塊並排，中間沒有間距 */
}
.coupon > * {
  margin: 0;
  border: 2px solid oklch(50% 0.13 55);
  background-color: oklch(92% 0.1 90);
}
.coupon-info {
  border-right-style: dashed; /* 右邊框改成虛線，就是撕線 */
  border-radius: 0.75rem;
}
.coupon-btn {
  border-left: 0; /* 撕線已經由左邊那塊畫了 */
  border-radius: 0.75rem;
}

@supports (corner-shape: scoop) {
  /* 順序：左上、右上、右下、左下 */
  .coupon-info {
    corner-shape: round scoop scoop round; /* 右邊兩個角往內凹 */
  }
  .coupon-btn {
    corner-shape: scoop round round scoop; /* 左邊兩個角往內凹 */
  }
}
```

**半圓缺口是兩塊拼起來的**：左邊那塊的右上角凹四分之一圓，右邊按鈕的左上角也凹四分之一圓，兩個並排就是一個半圓。兩邊的 `border-radius` 要一樣大，缺口才會對齊。

邊框會沿著凹進去的弧線畫，按鈕的焦點外框也會跟著缺口走。不支援的瀏覽器會看到兩塊圓角的方塊並排，少了缺口，但內容和按鈕都正常。

### 3. 結帳流程的箭頭步驟

「購物車 → 填寫資料 → 付款」這種箭頭狀的步驟，每一步都是一個連結。

**以前的寫法**：用 `clip-path` 把右邊切成箭頭：

```css
.steps a {
  clip-path: polygon(
    0 0,                       /* 左上 */
    calc(100% - 1.25rem) 0,    /* 箭頭開始的地方（上） */
    100% 50%,                  /* 箭頭尖端 */
    calc(100% - 1.25rem) 100%, /* 箭頭開始的地方（下） */
    0 100%                     /* 左下 */
  );
}
```

`clip-path` 跟 `mask` 一樣，會把外框切掉；邊框也只剩上、下、左三段直線，**箭頭的兩條斜邊沒有邊框**。另一種做法是用 `::after` 疊一個三角形，但三角形要有邊框，就得再疊一層，焦點外框還是不會跟著箭頭走。

**corner-shape 的寫法**：

```html
<ol class="steps" aria-label="結帳步驟">
  <li><a href="/cart">購物車</a></li>
  <li><a href="/checkout" aria-current="step">填寫資料</a></li>
  <li><a href="/payment">付款</a></li>
</ol>
```

```css
.steps {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.steps a {
  display: block;
  /* 右邊多留一點內距，文字才不會跑進箭頭的斜角裡 */
  padding: 0.5rem 1.5rem 0.5rem 0.75rem;
  border: 2px solid oklch(46% 0.15 295);
  border-radius: 0 0.5rem 0.5rem 0; /* 不支援時：右邊圓角 */
}
/* 目前所在的步驟：用 aria-current 標示，報讀軟體會念出「目前步驟」 */
.steps [aria-current] {
  background-color: oklch(46% 0.15 295);
  color: white;
  font-weight: 700;
}

@supports (corner-shape: bevel) {
  .steps a {
    /* 斜線前面是水平半徑，後面是垂直半徑：
       右邊兩個角往左 1.25rem、往上下各 50%，
       兩個斜角剛好在右邊的正中間接起來，形成箭頭 */
    border-radius: 0 1.25rem 1.25rem 0 / 0 50% 50% 0;
    corner-shape: bevel;
  }
}
```

關鍵在 `border-radius` 的**垂直半徑設成 50%**：上下兩個角各佔一半的高度，切成斜角後就在中間接成一個尖端。不管文字多長、行高多少，箭頭都會自動對齊。

### 4. 遊戲風格的切角按鈕

遊戲、科技感網站常見的按鈕，左上和右下各斜切一角。

**以前的寫法**：

```css
.hud-btn {
  clip-path: polygon(
    0.875rem 0,                    /* 左上切角的右端 */
    100% 0,                        /* 右上 */
    100% calc(100% - 0.875rem),    /* 右下切角的上端 */
    calc(100% - 0.875rem) 100%,    /* 右下切角的左端 */
    0 100%,                        /* 左下 */
    0 0.875rem                     /* 左上切角的下端 */
  );
}
```

一樣的問題：焦點外框不見，兩個切角沒有邊框。這種按鈕的邊框通常是設計的重點，以前常見的補救是外面再包一層，用兩層 `clip-path` 疊出「假邊框」，焦點框再另外處理。

**corner-shape 的寫法**：

```css
.hud-btn {
  padding: 0.75rem 1.75rem;
  border: 2px solid oklch(80% 0.13 210);
  /* 兩個值：左上和右下 0.875rem，右上和左下 0 */
  border-radius: 0.875rem 0;
  background-color: oklch(22% 0.04 260);
  color: oklch(88% 0.12 200);
}

@supports (corner-shape: bevel) {
  .hud-btn {
    corner-shape: bevel; /* 有半徑的兩個角變成斜角，沒有半徑的維持直角 */
  }
}
```

只有一行。`border-radius` 只給左上和右下半徑，`bevel` 就只會切這兩個角；不支援的瀏覽器會看到左上、右下是圓角，風格不同但不會壞。

## 四、無障礙檢查重點

### 1. 焦點框用 outline，不要只用 box-shadow

`corner-shape` 讓 `outline`、`border`、`box-shadow` 都跟著形狀畫，三個我都實測過。但**強制色彩模式會把 `box-shadow` 移除**，只用 `box-shadow` 畫的焦點框會整個不見。焦點框還是要用 `outline`，或至少加一個透明的 `outline` 當備案。

另外，141 畫 `scoop`、`notch` 形狀的 `box-shadow` 時，接縫處會有破綻；153 正常。

### 2. 沒有邊框的元件，加上透明邊框

強制色彩模式會移除背景色和背景圖。只靠背景色撐出形狀的按鈕、圖示，在強制色彩模式下會只剩文字，看不出範圍。加一條 `border: 2px solid transparent`，平常看不到，強制色彩模式下就會變成文字色的輪廓。

### 3. 可以點的範圍跟著形狀變小

我實測 `bevel` 的按鈕，**點被切掉的角落點不到**，點擊範圍跟畫面上的形狀一致。這是好事，使用者點到看得見的地方就有反應。

但也代表實際可點的面積比外框的長方形小。WCAG 2.5.8 要求點擊區至少 24×24px，按鈕本身就很小的話，切角之後要再確認一次。`notch`、`scoop` 往內凹得比圓角多，影響也比較大。

### 4. 角落的內容要留內距

角被切掉或凹進去，原本在角落的文字就可能被切掉，或跑到形狀外面。`bevel`、`scoop`、`notch` 都比圓角吃掉更多空間，所以內距要比 `border-radius` 再多留一些。箭頭步驟的右邊內距特別加大，就是這個原因。

### 5. 半徑太大會變成奇怪的形狀

半徑設成高度的一半再用 `notch`，左右兩側會整個被切掉，變成一個窄窄的方塊。形狀太極端時，記得用最長和最短的文字都測一次。

## 五、不支援的時候

不支援的瀏覽器會忽略 `corner-shape`，只套用 `border-radius`，形狀會退回一般的圓角。內容、邊框、焦點外框都正常，只是形狀跟設計稿不一樣，算是很安全的漸進增強。

要注意的是 `border-radius` 的值：同一個值在圓角和其他形狀下的效果差很多（例如方圓角要 `50%`，一般圓角 `22%` 比較像），所以像範例這樣，把不支援時的半徑寫在外面，支援時的半徑寫進 `@supports`：

```css
.app-icon {
  border-radius: 22%; /* 不支援時 */
}
@supports (corner-shape: squircle) {
  .app-icon {
    border-radius: 50%; /* 支援時 */
    corner-shape: squircle;
  }
}
```

用 JavaScript 偵測：

```js
CSS.supports("corner-shape: bevel");
```

## 結論

整理成幾句話：

- `corner-shape` 搭配 `border-radius` 使用：`border-radius` 決定大小，`corner-shape` 決定形狀。
- App 圖示的方圓角、優惠券缺口、箭頭步驟、切角按鈕，以前要用 `clip-path`、`mask`、SVG，現在一兩行就好。
- 以前的做法會**把焦點外框和邊框一起切掉**；`corner-shape` 的邊框、外框、陰影都會跟著形狀畫。
- 焦點框用 `outline`，沒有邊框的元件加透明邊框，強制色彩模式下才看得到。
- 可點範圍會跟著形狀變小，角落的內容要多留內距。
- 不支援時退回圓角，不會壞，可以放心當漸進增強用。

設計師畫的形狀終於可以直接交給 CSS，而且這次，鍵盤使用者也看得到它的輪廓。

## 延伸閱讀

- [用 if() 和 @function 把無障礙寫進 CSS：減少動態、提高對比、最小點擊區](/blog/css-if-function/)
- [放大之後，置中的內容上半部不見了？用 safe center 讓它捲得到](/blog/css-safe-alignment/)
- [現代 CSS 與 HTML 技巧整理清單：115 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

## 相關連結

- [CSS Borders and Box Decorations Level 4（corner-shape）](https://drafts.csswg.org/css-borders-4/#corner-shaping "另開新視窗"){target="_blank"}
- [MDN — corner-shape](https://developer.mozilla.org/en-US/docs/Web/CSS/corner-shape "另開新視窗"){target="_blank"}
- [WCAG 2.2 — 2.4.7 焦點可見](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible "另開新視窗"){target="_blank"}
- [WCAG 2.2 — 2.5.8 目標尺寸（最小）](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum "另開新視窗"){target="_blank"}
- [Can I use（瀏覽器支援度查詢）](https://caniuse.com "另開新視窗"){target="_blank"}
