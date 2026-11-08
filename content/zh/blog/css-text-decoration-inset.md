---
title: "text-decoration-inset 做連結底線動畫：平常把底線藏起來，很容易違反 WCAG 1.4.1"
description: "Chrome 157、Firefox 146 起，text-decoration-inset 可以縮短或延長底線，做底線動畫不用再多包元素。但我實測，內縮到 50% 底線就整個消失；「平常藏起來、hover 才出現」的連結，如果和周圍文字的顏色對比不到 3:1，就是 WCAG 的失敗技術 F73。這篇整理寫法、實測結果，以及安全的動畫做法。"
date: 2026-11-08
tags:
  - CSS
  - 前端開發
  - 無障礙
  - 瀏覽器支援
category: accessibility
translationKey: css-text-decoration-inset
draft: false
---

> 話說在前頭：這篇由 AI（Anthropic 的 Claude）協助收集資料與整理，我再閱讀確認。文中的行為是在 Chromium 157、159 與 153 上實測的結果；規格、中文排版、無障礙規範與支援度以文末連結的 W3C 規格與 WCAG 文件、W3C《中文排版需求》、MDN 與 Chromium 原始碼為依據。有講錯的地方歡迎指正。

## 它解決什麼

`text-decoration` 本身沒辦法改變底線的長度。要做「底線變長」的動畫，只能另外畫一條線（例如 `::after` 或背景漸層），那就不是真的底線了。

`text-decoration-inset` 直接調整底線兩端的位置：

```css
a {
  text-decoration-inset: 0.3em;      /* 兩端各內縮 0.3em */
  text-decoration-inset: -0.15em;    /* 兩端各往外延伸 */
  text-decoration-inset: 1em -1em;   /* 第一個值是起點，第二個值是終點 */
  text-decoration-inset: 10%;        /* 百分比依元素的寬度計算 */
}
```

規格寫明：正值往內縮短、負值往外延伸；給兩個值時，第一個管起點、第二個管終點。百分比依元素的寬度計算，換行時由 `box-decoration-break` 決定用整體寬度還是每一行的寬度。它可以做過渡動畫。

## 支援度

| 瀏覽器 | 版本 | 依據 |
|---|---|---|
| Chrome | 157（2026 年 11 月 3 日推出） | Chromium 原始碼：154～156 是實驗狀態，157 起預設開啟；MDN 相容性資料也標示 157 |
| Firefox | 146 | MDN 的 Firefox 146 版本說明 |
| Safari | 只在預覽版 | MDN 相容性資料 |

## 互動範例

先看你的瀏覽器支援度：

::feature-support{features="text-decoration-inset" notice="你的瀏覽器不支援 text-decoration-inset，下方範例的底線會一律完整顯示。"}
::

::text-decoration-inset-demo
::

## 實測：底線實際有多長

我在 Chromium 157、159 用 40px 的字實測（連結寬 267px），從截圖量底線的像素：

| `text-decoration-inset` | 底線位置 |
|---|---|
| `0` | 跟文字一樣寬 |
| `0.5em` | 兩端各少 20px |
| `-0.5em` | 兩端各多 20px，超出文字 |
| `1em -1em` | 起點往內 40px、終點往外 40px，整條往後移 |
| `45%` | 只剩中間一小段 |
| **`50%` 以上** | **整條消失** |

- **百分比到 50% 底線就沒了**。「平常沒底線、hover 才從中間展開」的效果，就可以這樣寫。
- **強制色彩模式下也一樣看不到**：我用 Chromium 模擬強制色彩模式，`50%` 的底線一樣消失，瀏覽器不會幫你補回來。
- **不支援的瀏覽器會忽略這個屬性**：Chromium 153 上，上表每一種寫法的底線都是完整的。所以在不支援的瀏覽器上，底線反而不會被藏起來。

## 無障礙重點

### 1. 一般狀態就要能分出連結：hover 才出現不算

WCAG 1.4.1「色彩的使用」要求不能只靠顏色傳達資訊。連結和周圍文字只差在顏色時，W3C 的失敗技術 F73 寫得很直接：

> 「If the non-color cue only happens when the mouse hovers over the link or when the link receives focus, it is still a failure.」（非顏色的提示只在滑鼠移上去或取得焦點時才出現，仍然算失敗。）

也就是說，用 `text-decoration-inset: 50%` 把底線藏起來、hover 才展開，**一般狀態下連結就只剩顏色可以辨識**。

例外是 W3C 的技術 G183：連結和周圍文字的顏色對比至少 3:1 時，可以沒有底線。但 G183 也提醒，深色的情況下即使到 3:1 也不容易分辨，建議還是加上底線。我量了這個網站，連結和內文的顏色對比只有約 1:1，底線拿掉就完全分不出來。

範例的讀數會即時算這個對比，並判斷一般狀態有沒有底線。

**比較安全的動畫做法**：一般狀態保留看得到的底線，只做「變長」或「延伸」。

```css
a {
  text-decoration-inset: 0.3em;   /* 平常兩端稍微內縮，還是看得到 */
  transition: text-decoration-inset 300ms ease-out;
}
a:hover,
a:focus-visible {
  text-decoration-inset: 0;       /* 展開到完整 */
}
```

### 2. 鍵盤焦點也給一樣的效果

只寫 `:hover` 的話，用鍵盤的人看不到這個變化。我實測：只寫 `:hover` 時，Tab 移到連結上，`text-decoration-inset` 維持原值；加上 `:focus-visible` 才會跟著展開。焦點本身還是要有清楚的焦點框，底線變化只是輔助。

### 3. 尊重「減少動態」

使用者在系統設定減少動態時，用 `prefers-reduced-motion` 把過渡拿掉（W3C 的技術 C39）：

```css
@media (prefers-reduced-motion: reduce) {
  a {
    transition: none;
  }
}
```

底線一樣會改變，只是不播放動畫。範例的「模擬減少動態」就是這個效果。

## `auto`：相鄰的專名號要分開

規格另外定義了 `auto`：由瀏覽器決定內縮多少，讓兩個相鄰、都加了底線的元素，看起來不會像同一條線。規格特別說明，**這在中文很重要，因為中文裡底線是一種標點**，例子是兩個相鄰的人名。

這個標點就是專名號。W3C 的《中文排版需求》（clreq）寫明：專名號是「標示專有名詞——如人名、地名等——底端的符號」，「在二個專有名詞相鄰時，相鄰的那一側的專名號長度縮短（讓兩段專名號在視覺上分離，更容易辨別），而專名號的另一側長度不變」。

```css
u {
  text-decoration-inset: auto;
}
```

我實測 Chromium 157、159（字級 40px）：兩個相鄰的 `<u>`，預設是一條連續的線；加上 `auto` 後分成兩段。不過 Chromium 是**每段兩端都內縮約 2px**，連最外側也縮了，跟 clreq「另一側長度不變」的描述不同。範例下半部可以切換比較。Chromium 153 不支援，兩段仍然連在一起。

## 結論

`text-decoration-inset` 讓底線動畫回到真的底線，寫法簡單。但它能把底線縮到看不見，**一般狀態一定要留著看得到的底線**，動畫只做延伸；`:focus-visible` 給一樣的效果，並尊重減少動態的設定。不支援的瀏覽器會顯示完整底線，不需要另外處理。

## 延伸閱讀

- [現代 CSS 與 HTML 技巧整理清單：116 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)
- [iframe 高度自動跟著內容：frame-sizing 只在載入時量，使用者調整文字後要靠你](/blog/css-frame-sizing/)

## 相關連結

- [W3C — CSS Text Decoration Module Level 4：text-decoration-inset](https://drafts.csswg.org/css-text-decor-4/#text-decoration-inset-property "另開新視窗"){target="_blank"}
- [MDN — text-decoration-inset](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-decoration-inset "另開新視窗"){target="_blank"}
- [MDN — Firefox 146 版本說明](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/146 "另開新視窗"){target="_blank"}
- [MDN browser-compat-data — text-decoration-inset](https://github.com/mdn/browser-compat-data/blob/main/css/properties/text-decoration-inset.json "另開新視窗"){target="_blank"}
- [Chromium 原始碼 — runtime_enabled_features.json5（CSSTextDecorationInset）](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/platform/runtime_enabled_features.json5 "另開新視窗"){target="_blank"}
- [W3C — 中文排版需求（clreq）：專名號](https://www.w3.org/International/clreq/#id88 "另開新視窗"){target="_blank"}
- [WCAG 2.2 說明文件 — 1.4.1 色彩的使用](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html "另開新視窗"){target="_blank"}
- [WCAG 失敗技術 F73 — 連結在沒有色彩視覺時無法辨識](https://www.w3.org/WAI/WCAG22/Techniques/failures/F73 "另開新視窗"){target="_blank"}
- [WCAG 技術 G183 — 連結與周圍文字對比至少 3:1](https://www.w3.org/WAI/WCAG22/Techniques/general/G183 "另開新視窗"){target="_blank"}
- [WCAG 技術 C39 — 用 prefers-reduced-motion 避免動態](https://www.w3.org/WAI/WCAG22/Techniques/css/C39 "另開新視窗"){target="_blank"}
