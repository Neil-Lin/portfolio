---
title: "用 if() 和 @function 把無障礙寫進 CSS：減少動態、提高對比、最小點擊區"
description: "CSS 的 if() 讓一個屬性裡就能寫條件，@function 讓重複的計算變成自訂函式。這篇用互動範例把減少動態、提高對比的焦點外框、24px 最小點擊區寫成條件和函式，也整理我實測踩到的坑：if() 沒寫 else，焦點外框會整個消失。"
date: 2026-10-16
tags:
  - CSS
  - 前端開發
  - 無障礙
  - 瀏覽器支援
category: frontend
translationKey: css-if-function
draft: false
---

> 話說在前頭：文中的行為我在 Chromium 141 和 153 上實測過，兩版都支援 `if()` 和 `@function`，有差異的地方會特別標出來。其他瀏覽器的支援狀況請以 caniuse、MDN 為準。有講錯的地方歡迎指正。

## 前言

無障礙相關的 CSS，常常散落在各種 `@media` 區塊裡：減少動態寫一塊、提高對比寫一塊、強制色彩模式再寫一塊。同一個元件的樣式被拆到好幾個地方，改的時候很容易漏掉其中一個。

[CSS 與 HTML 技巧清單](/blog/css-techniques-checklist)裡的 `if()` 和 `@function`，可以把這些條件收回屬性本身：

- **`if()`**：在一個屬性的值裡面寫條件。
- **`@function`**：把重複的計算寫成自訂函式，像 Sass 的 `@function`，但是在瀏覽器裡執行。

這次的範例都跟無障礙有關。先看一下你的瀏覽器支援度：

::feature-support{features="css-if,css-function" notice="你的瀏覽器不支援 if() 或 @function，下方範例的按鈕會改用固定樣式。"}
::

## 一、if()：條件寫在屬性裡

以前要尊重使用者「減少動態」的設定，要另外寫一個 `@media` 區塊：

```css
.btn {
  transition-duration: 300ms;
}
@media (prefers-reduced-motion: reduce) {
  .btn {
    transition-duration: 0s;
  }
}
```

用 `if()` 可以寫成一行：

```css
.btn {
  transition-duration: if(
    media(prefers-reduced-motion: reduce): 0s;
    else: 300ms
  );
}
```

條件有三種：

| 條件 | 判斷什麼 | 例子 |
|---|---|---|
| `media()` | 媒體查詢 | `media(prefers-contrast: more)` |
| `supports()` | 瀏覽器支不支援某個寫法 | `supports(width: stretch)` |
| `style()` | 元素自己的自訂屬性 | `style(--size: small)` |

條件可以用 `and`、`or`、`not` 組合，也可以一次寫好幾個分支，由上往下找第一個成立的：

```css
padding-inline: if(
  style(--size: small): 0.5rem;
  style(--size: large): 1.5rem;
  else: 1rem
);
```

## 二、@function：把重複的計算收成函式

WCAG 2.5.8 要求點擊區至少 24×24px。元件一多，每個都要記得寫 `max(24px, …)`，很容易漏。寫成函式就只要寫一次：

```css
@function --target(--h) {
  result: max(24px, var(--h));
}

.icon-btn {
  min-block-size: --target(16px); /* 實測：24px */
}
```

函式名稱和參數都要用 `--` 開頭，`result` 是回傳值。我實測幾個寫法：

- **參數可以有預設值**：`@function --target(--h, --min: 24px)`，呼叫 `--target(16px, 44px)` 就變成至少 44px。
- **函式裡可以寫 `@media`**，條件成立時的 `result` 會蓋掉前面的：

```css
@function --ring() {
  result: 2px;
  @media (prefers-contrast: more) {
    result: 4px;
  }
}
```

- **函式裡可以用 `if()`**，也讀得到元素身上的自訂屬性。
- **參數可以指定型別**：`@function --target(--h <length>) returns <length>`。傳錯型別，整個屬性會變成無效。

## 三、動手試試

下面這顆按鈕的尺寸、轉場、焦點外框都是用 `if()` 和 `@function` 寫的。系統沒辦法讓網頁直接切換「減少動態」「提高對比」，所以範例用自訂屬性模擬；你的系統真的開啟這兩個設定時，也會套用：

::if-function-demo
::

可以試試看：

- 選 `small`，按鈕原本寫的是 16px 高，被 `--if-demo-target()` 拉到 24px。
- 勾選「減少動態」，轉場時間變成 0s，滑鼠移上去按鈕不會再放大。
- 勾選「提高對比」，用 Tab 移到按鈕上，焦點外框會變粗、改成文字色。
- 切到「if() 沒寫 else」，再取消「提高對比」，焦點外框就不見了。下一段會說明原因。

範例裡模擬偏好的寫法是：

```css
transition-duration: if(
  style(--sim-motion: reduce) or media(prefers-reduced-motion: reduce): 0s;
  else: 300ms
);
```

這個寫法本身就很實用。如果你的網站有自己的「減少動態」開關，把它設成自訂屬性，就能跟系統設定寫在同一個條件裡：使用者不管從哪裡開啟，都會生效。

## 四、要注意的坑

### 1. if() 沒寫 else，屬性會變回初始值

這是我這次實測最想提醒的一點：

```css
.btn:focus-visible {
  outline: 2px solid blue;
  outline: if(style(--hc: 1): 4px solid black);
}
```

我原本以為條件不成立時，會用前一行的 `2px solid blue`。實測結果是 **`outline-style: none`，焦點外框整個不見了**。

原因是 `if()` 沒有任何分支成立、又沒有 `else` 時，整個值會變成無效。這種無效是在計算時才發生的，那時候後面這行早就在層疊（cascade）裡贏過前一行了，瀏覽器不會再回頭用前一行，只能退回屬性的初始值。`outline-style` 的初始值是 `none`。

只寫 `outline-width` 時比較不明顯：初始值是 `medium`（3px），外框還在，只是粗細跟你寫的不一樣。

焦點外框不見，鍵盤使用者就不知道自己在哪裡（WCAG 2.4.7）。所以**跟無障礙有關的屬性，`if()` 一定要寫 `else`**。

### 2. 函式名稱打錯也一樣

```css
.box {
  min-height: 30px;
  min-height: --nope(10px); /* 沒有這個函式 */
}
```

實測 `min-height` 是 0px，不是 30px。支援 `@function` 的瀏覽器，解析時會接受任何 `--` 開頭的函式名稱，到計算時才發現函式不存在。我用 `CSS.supports("width: --whatever(1)")` 測，141 和 153 都回傳 `true`。

### 3. style() 比對的是字面，不是數值

```css
.a { --size: Small; }  /* 不等於 small */
.b { --gap: 8.0px; }   /* 不等於 8px */
```

沒有註冊的自訂屬性，`style()` 是逐字比對：大小寫不同、`8.0px` 和 `8px` 都算不一樣。前後的空白則會被忽略。

用 `@property` 註冊型別之後，比對的就是計算後的值，`8.0px`、`0.5rem`（根字級 16px 時）都等於 `8px`。

### 4. style() 看的是元素自己，但自訂屬性會繼承

`if()` 裡的 `style()` 判斷的是元素本身的自訂屬性。不過自訂屬性預設會繼承，所以父層設了 `--size: small`，裡面所有子元素的 `style(--size: small)` 都會成立。範例就是在外層設定，按鈕繼承。

### 5. 範圍比較要比較新的版本

`style(--n > 2)` 這種範圍比較，我實測 153 支援，141 不支援，會直接走 `else`。

## 五、不支援的時候

偵測方式：

```css
@supports (color: if(else: red)) {
  /* if() 的寫法 */
}
```

```js
CSS.supports("color: if(else: red)"); // if()
"CSSFunctionRule" in window;           // @function
```

CSS 的 `@supports at-rule(@function)` 也可以偵測 `@function`，但我實測 141 雖然支援 `@function`，卻不支援 `at-rule()` 這個寫法，會回傳 `false`，153 才是 `true`。

備案的寫法要特別注意 `var()`：

- **`if()` 裡沒有 `var()`**：不支援的瀏覽器在解析時就會丟掉這行，前一行的備案會生效。
- **`if()` 或函式呼叫裡有 `var()`**：只要值裡有 `var()`，瀏覽器在解析時都會先接受，到計算時才發現看不懂，結果跟第一個坑一樣，退回初始值。

我手邊沒有不支援的瀏覽器可以實測，第二點是依 `var()` 的規則推論的。保險起見，範例把所有 `if()` 的規則都包在 `@supports` 裡，外面寫固定的樣式當備案，焦點外框也一定會在。

## 結論

整理成幾句話：

- `if()` 把條件寫進屬性裡，減少動態、提高對比不用再拆成好幾個 `@media` 區塊。
- `@function` 把 `max(24px, …)` 這類重複的計算收成函式，最小點擊區只要寫一次。
- `style(--自訂屬性) or media(…)` 可以讓網站自己的偏好開關和系統設定寫在同一個條件裡。
- **`if()` 沒寫 `else`、函式名稱打錯，屬性都會退回初始值**，焦點外框可能整個消失。
- `style()` 比對未註冊的自訂屬性是逐字比對；要比數值，先用 `@property` 註冊。
- 值裡有 `var()` 時，備案要用 `@supports` 包起來，不能只靠前一行。

`if()` 和 `@function` 讓無障礙的樣式可以集中在一個地方。只是條件寫得越多，越要記得每一條路都有結果。

## 延伸閱讀

- [alpha() 一行調透明度，revert-rule 一行退回原樣：兩個 CSS 小工具實測](/blog/css-alpha-revert-rule/)
- [放大之後，置中的內容上半部不見了？用 safe center 讓它捲得到](/blog/css-safe-alignment/)
- [現代 CSS 與 HTML 技巧整理清單：115 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

## 相關連結

- [CSS Values and Units Level 5（if()）](https://drafts.csswg.org/css-values-5/#if-notation "另開新視窗"){target="_blank"}
- [CSS Functions and Mixins（@function）](https://drafts.csswg.org/css-mixins-1/ "另開新視窗"){target="_blank"}
- [MDN — if()](https://developer.mozilla.org/en-US/docs/Web/CSS/if "另開新視窗"){target="_blank"}
- [WCAG 2.2 — 2.3.3 互動動畫](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions "另開新視窗"){target="_blank"}
- [WCAG 2.2 — 2.4.7 焦點可見](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible "另開新視窗"){target="_blank"}
- [WCAG 2.2 — 2.5.8 目標尺寸（最小）](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum "另開新視窗"){target="_blank"}
- [Can I use（瀏覽器支援度查詢）](https://caniuse.com "另開新視窗"){target="_blank"}
