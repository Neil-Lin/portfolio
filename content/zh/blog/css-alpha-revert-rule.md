---
title: "alpha() 一行調透明度，revert-rule 一行退回原樣：兩個 CSS 小工具實測"
description: "alpha() 讓存在變數裡的顏色直接調透明度，不管它原本是 hex、rgb、hsl 還是 oklch；revert-rule 讓屬性退回「這條規則不存在」時的值。這篇用互動範例比較各種色彩寫法經過 alpha() 之後的結果，實測半透明色在亮底、暗底的對比，也整理 revert-rule 和 revert、revert-layer 的差別。"
date: 2026-10-15
tags:
  - CSS
  - 前端開發
  - 無障礙
  - 瀏覽器支援
category: frontend
translationKey: css-alpha-revert-rule
draft: false
---

> 話說在前頭：`alpha()` 和 `revert-rule` 我只在 Chromium 153 上測得到，141 還不支援。其他瀏覽器的支援狀況請以 caniuse 為準。有講錯的地方歡迎指正。

## 前言

[CSS 與 HTML 技巧清單](/blog/css-techniques-checklist)裡有兩個 Baseline 2026 的小工具，這次一起練習：

- **`alpha()`**：只調整顏色的透明度。
- **`revert-rule`**：讓屬性退回「如果這條規則不存在」時的值。

先看一下你的瀏覽器支援度：

::feature-support{features="alpha-color,revert-rule" notice="你的瀏覽器不支援 alpha() 或 revert-rule，下方範例會改用相對色彩語法呈現。"}
::

## 一、alpha()：以前調透明度有多麻煩

半透明色到處都是：hover 的底色、邊框、陰影、遮罩。問題是顏色通常存在變數裡，而變數裡的顏色沒辦法直接加透明度：

```css
:root {
  --brand: #7c3aed;
}
.tag {
  background: var(--brand) / 20%; /* 沒有這種寫法 */
}
```

以前的做法有幾種，各有代價：

| 做法 | 寫法 | 代價 |
|---|---|---|
| 另外存一份半透明色 | `--brand-20: rgb(124 58 237 / 20%)` | 每種透明度都要多一個變數 |
| 變數只存色彩通道 | `--brand: 124 58 237` 搭配 `rgb(var(--brand) / 20%)` | 變數不是完整的顏色，不能直接拿來用 |
| 相對色彩語法 | `rgb(from var(--brand) r g b / 20%)` | 要知道原本是哪個色彩空間，通道要一個一個寫出來 |

我的網站用的是第二種：顏色變數存的是 oklch 的三個通道，用的時候寫 `oklch(var(--pd-c) / 40%)`。

`alpha()` 讓這件事變成一行：

```css
.tag {
  background: alpha(from var(--brand) / 20%);
}
```

不管 `--brand` 原本是 hex、rgb、hsl 還是 oklch，都一樣寫。

## 二、各種色彩寫法實測

下面的範例把同一個紫色（`#7c3aed`）換成各種寫法存進變數，再用 `alpha()` 調透明度。可以看到瀏覽器計算後的值，以及疊在白底、深色底時的對比。範例從 100% 開始，把透明度往下拉，看對比怎麼變：

::alpha-color-demo
::

我實測各種寫法經過 `alpha(from … / 50%)` 之後的計算值：

| 原本的寫法 | 計算後的值 |
|---|---|
| `#7c3aed` | `rgba(124, 58, 237, 0.5)` |
| `rebeccapurple` | `rgba(102, 51, 153, 0.5)` |
| `rgb(124 58 237)` | `rgba(124, 58, 237, 0.5)` |
| `hsl(262 83% 58%)` | `rgba(124, 59, 237, 0.5)` |
| `hwb(262 23% 7%)` | `rgba(124, 59, 237, 0.5)` |
| `oklch(54.1% 0.247 293)` | `oklch(0.541 0.247 293 / 0.5)` |
| `oklab(…)`、`lab(…)`、`lch(…)` | 維持原本的色彩空間，加上 `/ 0.5` |
| `color(display-p3 …)` | `color(display-p3 … / 0.5)` |
| `currentColor` | 先換成目前的文字顏色，再加上透明度 |
| `transparent` | `rgba(0, 0, 0, 0.5)`，**半透明的黑色** |

整理成幾個重點：

- **hex、具名色彩、rgb、hsl、hwb 都會變成 `rgba()`**。這幾種本來就都是 sRGB，瀏覽器統一用 `rgba()` 表示。hsl 換算時，綠色通道會有 1 的捨入差異。
- **oklch、oklab、lab、lch、display-p3 會維持原本的色彩空間**，不會被轉成 sRGB，廣色域的顏色不會被裁掉。
- **透明度是直接取代，不是相乘**：原本是 80% 透明度的 `#7c3aedcc` 或 `rgba(…, 0.8)`，寫 `/ 50%` 的結果是 50%，不是 40%。
- **不寫透明度就是原色**：`alpha(from red)` 還是紅色。
- **`transparent` 的陷阱**：`transparent` 其實是「全透明的黑色」，調成 50% 會變成半透明黑；調成 100% 甚至會變成純黑。

## 三、半透明色的對比要算合成後的顏色

這是範例裡我最想讓大家看到的部分。同一個紫色 `#7c3aed`，我實測的對比：

| 透明度 | 白色背景 | 深色背景（`#121212`） |
|---|---|---|
| 100% | 5.70:1，一般文字 ✓ | 3.29:1，一般文字 ✗、大字與元件 ✓ |
| 50% | 2.27:1，全部 ✗ | 1.66:1，全部 ✗ |

幾件事：

- **同一個顏色，換個背景對比就不一樣**。在白底能用的文字顏色，在深色模式可能就不夠。
- **半透明色的對比，取決於底下的背景**。要先把半透明色和背景合成成實際看到的顏色，再拿來算對比。範例就是這樣做的：在畫布上先塗背景、再塗半透明色，讀出實際的顏色後套用 WCAG 公式。
- **WCAG 1.4.3 和 1.4.11 都適用**：一般文字要 4.5:1，大字（約 24px，或粗體約 18.66px 以上）和元件、圖形要 3:1。半透明的邊框、圖示，一樣要達到 3:1。
- **檢查工具也是算合成後的顏色**：我用 axe 檢查範例調到 50% 的狀態，它算出的對比是 2.27:1 和 1.65:1，跟範例自己算的 2.27:1、1.66:1 只差在小數點後第二位的捨入。所以範例一開始是 100%，往下拉才會出現對比不足。

所以 `alpha()` 讓半透明色變得好寫，但寫好之後，還是要在每一種會出現的背景上檢查對比。

## 四、revert-rule：退回「這條規則不存在」時的值

CSS 已經有 `revert` 和 `revert-layer`，`revert-rule` 是同一家族的第三個。差別在「退回到哪裡」：

```css
@layer base, theme;
@layer base  { .t { color: green; } }
@layer theme { .t { color: blue; } }
.t { color: red; }

.t.a { color: revert; }       /* 實測：黑色 */
.t.b { color: revert-layer; } /* 實測：藍色 */
.t.c { color: revert-rule; }  /* 實測：紅色 */
```

| 關鍵字 | 退回到哪裡 | 上面的實測結果 |
|---|---|---|
| `revert` | 瀏覽器的預設樣式 | 黑色 |
| `revert-layer` | 上一個 `@layer` 的值。沒有分層的規則會整個略過，直接退到最後一層 | 藍色（`theme` 層） |
| `revert-rule` | 只略過自己這一條規則 | 紅色（前一條 `.t`） |

`revert-rule` 是範圍最小的一個，只把自己這條規則拿掉。

**要注意：是整條規則，不是單一宣告**

```css
.base { color: green; }
.y { color: blue; color: revert-rule; }
```

我原本以為結果會是藍色（退回同一條規則裡前面的 `blue`），實測卻是**綠色**：整條 `.y` 規則都被當作不存在，連前面的 `blue` 也一起略過了。

## 五、revert-rule 最好用的地方：搭配 if()

單獨寫一條 `color: revert-rule` 其實沒什麼意義，把那條規則刪掉就好。它真正好用的地方，是搭配 `if()` 寫條件：

```css
.btn {
  display: inline-flex;
}
.btn {
  display: if(style(--hidden: 1): none; else: revert-rule);
}
```

條件成立時隱藏，不成立時就「當作這條規則不存在」，用回原本的 `inline-flex`。我實測沒設定 `--hidden` 的按鈕是 `inline-flex`，設定 `--hidden: 1` 的是 `none`。

以前要寫 `else: inline-flex`，把原本的值再寫一次。原本的值一改，這裡就要跟著改，很容易漏。媒體查詢也可以：

```css
.card { padding: 16px; }
.card { padding: if(media(width < 600px): 8px; else: revert-rule); }
```

我實測寬螢幕是 16px，窄螢幕是 8px。

對無障礙來說，這種「條件不成立就照原本的樣式」的寫法，可以減少深色模式、強制色彩模式、放大畫面這些情境下漏改的地方。原本的樣式只寫一次，條件分支不用再抄一份。

## 六、不支援的時候

**alpha()**：可以先寫相對色彩語法當備案。我測的 Chromium 141 不支援 `alpha()`，但支援相對色彩語法：

```css
.tag {
  background: rgb(from var(--brand) r g b / 20%);
  background: alpha(from var(--brand) / 20%);
}
```

範例在不支援 `alpha()` 的瀏覽器上也是這樣做的。要注意相對色彩語法要指定色彩空間，用 `rgb(from …)` 會轉成 sRGB；原本是廣色域的顏色，要改用 `oklch(from var(--brand) l c h / 20%)`。

**revert-rule**：不支援的瀏覽器會把整條宣告當作無效、直接略過。我在 141 實測，寫在**另一條規則**裡的 `revert-rule`，結果剛好跟支援時一樣，都是退回前一條規則的值；但寫在**同一條規則**裡時就不一樣了：141 用了同一條規則裡前面的 `blue`，153 則是退回更前面的綠色。

## 結論

整理成幾句話：

- `alpha(from var(--c) / 50%)` 讓變數裡的顏色直接調透明度，不管原本是哪種寫法。
- hex、rgb、hsl 這些 sRGB 寫法會變成 `rgba()`；oklch、lab、display-p3 會保留原本的色彩空間。
- 透明度是取代不是相乘；`transparent` 調透明度會變成黑色。
- 半透明色的對比要用合成後的顏色算，而且每種背景都要檢查。
- `revert-rule` 只略過自己這一條規則，而且是整條；最適合搭配 `if()` 寫「條件不成立就照原樣」。

這兩個都是很小的語法，但都在減少重複：顏色不用存好幾份，預設值不用寫好幾次。

## 延伸閱讀

- [放大之後，置中的內容上半部不見了？用 safe center 讓它捲得到](/blog/css-safe-alignment/)
- [width: 100% 為什麼會撐破容器？用 stretch 撐滿剛剛好](/blog/css-stretch/)
- [現代 CSS 與 HTML 技巧整理清單：115 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

## 相關連結

- [CSS Color Module Level 5（alpha() 與相對色彩語法）](https://drafts.csswg.org/css-color-5/ "另開新視窗"){target="_blank"}
- [MDN — 相對色彩語法](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors "另開新視窗"){target="_blank"}
- [CSS Cascading and Inheritance（revert 系列關鍵字）](https://drafts.csswg.org/css-cascade/ "另開新視窗"){target="_blank"}
- [WCAG 2.2 — 1.4.3 對比（最低）](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum "另開新視窗"){target="_blank"}
- [WCAG 2.2 — 1.4.11 非文字對比](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast "另開新視窗"){target="_blank"}
- [Can I use（瀏覽器支援度查詢）](https://caniuse.com "另開新視窗"){target="_blank"}
