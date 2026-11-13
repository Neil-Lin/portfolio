---
title: "用 symbols() 自訂清單符號：報讀軟體現在念的和以後念的，可能都不是你想的"
description: "Chrome 155 起支援 symbols()，Firefox 更早就支援，一行 CSS 就能換掉清單符號。但我在 Chromium 讀無障礙樹發現：現在報讀軟體拿到的是符號原文；規格卻要求 cyclic 念成項目符號、沒寫類型時念成數字，用 ✓ 表示「完成」的意思會不見。這篇整理寫法、實測結果，以及什麼時候該把意思寫進文字。"
date: 2026-11-13
tags:
  - CSS
  - 前端開發
  - 無障礙
  - 瀏覽器支援
category: accessibility
translationKey: css-symbols
draft: true
---

> 話說在前頭：這篇由 AI（Anthropic 的 Claude）協助收集資料與整理，我再閱讀確認。文中的行為是在 Chromium 157、159 與 153 上實測的結果；規格、無障礙規範與支援度以文末連結的 W3C 規格與 WCAG 文件、MDN 與 Chromium 原始碼為依據。有講錯的地方歡迎指正。

## 它解決什麼

只換成一個符號的話，`list-style-type: "◆ "` 這種字串寫法就做得到。但想讓幾個符號輪流使用，以前要先用 `@counter-style` 定義一個樣式，再在 `list-style` 引用它的名稱。`symbols()` 讓你直接寫在屬性值裡：

```css
ul {
  list-style: symbols(cyclic "◆" "◇");
}
```

規格的說法是：`symbols()` 定義一個「匿名」的計數器樣式，給只用一次、不值得寫完整 `@counter-style` 的情況。

## 基本寫法

```css
symbols( 類型? 符號 符號 … )
```

類型有五種：`cyclic`、`numeric`、`alphabetic`、`symbolic`、`fixed`。

- **`cyclic`**：符號輪流使用（◆ ◇ ◆ ◇ …），最常拿來做項目符號。
- **沒寫類型時預設是 `symbolic`**，不是 `cyclic`。`symbolic` 的符號用完後會重複疊加：規格的例子是 `*`、`†`、`‡`、`§` 之後接著 `**`、`††`。
- `numeric`、`alphabetic` 至少要給兩個符號，否則整個函式無效。

`symbols()` 只提供 `@counter-style` 的部分功能，例如**不能設定 `speak-as`**（報讀軟體要怎麼念），規格固定為 `auto`。

## 支援度

| 瀏覽器 | `symbols()` | 依據 |
|---|---|---|
| Chrome | 155 | Chromium 原始碼：153、154 是實驗狀態，155 起預設開啟；MDN 相容性資料也標示 155 |
| Firefox | 35 | MDN 相容性資料 |
| Safari | 只在預覽版 | MDN 相容性資料 |

**不支援的瀏覽器會忽略整條宣告**：我在 Chromium 153 實測，`list-style: symbols(…)` 被丟掉，清單退回預設的圓點。

## 互動範例

先看你的瀏覽器支援度：

::feature-support{features="symbols" notice="你的瀏覽器不支援 symbols()，下方範例的清單會退回預設的圓點（用 @counter-style 的那一種除外）。"}
::

::symbols-demo
::

## 實測：報讀軟體拿到什麼

清單的符號會放進無障礙樹，交給報讀軟體。我在 Chromium 157、159 讀無障礙樹裡清單標記的文字：

| 寫法 | 現在無障礙樹裡的標記 |
|---|---|
| `list-style: disc`（預設） | `•` |
| `symbols(cyclic "◆" "◇")` | `◆` |
| `symbols("◆")`（沒寫類型） | `◆` |
| `symbols(cyclic "✓")` | `✓` |
| `symbols(numeric "〇" "一" "二" "三")` | `一`（`numeric` 從 0 開始，第一項是 1） |
| `list-style: none` | 沒有標記，但清單語意還在 |

也就是說，**現在 Chromium 把符號原文交給報讀軟體**，念成什麼要看報讀軟體自己的符號字典。

## 規格要求的念法不一樣

規格的 `speak-as: auto` 是這樣定義的：

- 系統是 `cyclic` 時，等同 `bullets`：用代表「無序清單項目」的說法或提示音。
- 系統是 `alphabetic` 時，逐字念出。
- 其他情況（包括沒寫類型時的 `symbolic`、`numeric`）等同 `numbers`：**念出項目的數字**。

`symbols()` 的 `speak-as` 固定是 `auto`，所以照規格：

| 寫法 | 規格要求的念法 |
|---|---|
| `symbols(cyclic "◆" "◇")` | 項目符號 |
| `symbols("◆")`（沒寫類型） | **數字：1、2、3** |
| `symbols(cyclic "✓")` | 項目符號，**✓ 的意思不見了** |

**Chromium 還沒照規格做**。原始碼裡，無障礙樹要使用 `speak-as` 的程式碼，被一個狀態是 `test` 的旗標（`CSSAtRuleCounterStyleSpeakAsDescriptor`）擋著，正式版沒有開啟。我用這個旗標啟動 Chromium 159，結果就變成上表的念法：`cyclic` 變成 `•`，沒寫類型時變成 `1`。

MDN 的相容性資料標示 Chrome 91 起支援 `speak-as`。實測 Chromium 有解析這個描述符（`CSSCounterStyleRule` 的 `speakAs` 讀得到值），但無障礙樹沒有用它。MDN 的 `speak-as` 頁面也提醒：輔助科技對它的支援非常有限，不要用它傳達理解頁面必要的資訊。

## 無障礙重點

### 1. 不要把意思放在清單符號上

用 ✓／✗ 表示「已完成／未完成」：

- 現在：報讀軟體拿到 `✓` 原文，念不念得出「打勾」要看報讀軟體。
- 照規格：`cyclic` 會被念成一般項目符號，意思直接消失。

兩種情況都不可靠。**狀態要寫在文字裡**，例如「蘋果（已買）」。這對應 WCAG 1.3.1「資訊與關係」：用外觀傳達的資訊，也要能被程式判讀。範例勾選「把『已買』寫進文字」就是這個做法。

### 2. 裝飾用的符號，寫 `cyclic`

只是想換個好看的符號時，記得寫 `cyclic`。沒寫類型會變成 `symbolic`，照規格會被念成數字，一份無序清單聽起來像有順序的清單。

### 3. 想控制念法，`@counter-style` 的 `speak-as` 是規格給的方向，但現在還不能依賴

```css
@counter-style diamond {
  system: cyclic;
  symbols: "◆";
  suffix: " ";
  speak-as: bullets;
}
ul {
  list-style: diamond;
}
```

`symbols()` 不能寫 `speak-as`，要指定念法只能改用 `@counter-style`。但 Chrome 目前還沒有把它用在無障礙樹，Safari 也不支援 `speak-as`（MDN 相容性資料）。

### 4. 不支援時會退回圓點

不支援 `symbols()` 的瀏覽器會忽略整條宣告，清單退回預設樣式，不會壞掉，也不需要另外處理。

## 結論

`symbols()` 讓換清單符號只要一行 CSS。但符號交給報讀軟體的方式還在變：現在是原文，規格要求的是項目符號或數字。所以**符號只拿來裝飾**，並寫上 `cyclic`；需要傳達的意思，一律寫在文字裡。

## 延伸閱讀

- [用 :playing、:paused 做自訂播放器：圖示跟著狀態換了，但報讀軟體不知道](/blog/css-media-state-pseudos/)
- [現代 CSS 與 HTML 技巧整理清單：116 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

## 相關連結

- [W3C — CSS Counter Styles Level 3：symbols()](https://drafts.csswg.org/css-counter-styles-3/#symbols-function "另開新視窗"){target="_blank"}
- [W3C — CSS Counter Styles Level 3：speak-as](https://drafts.csswg.org/css-counter-styles-3/#counter-style-speak-as "另開新視窗"){target="_blank"}
- [MDN — symbols()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/symbols "另開新視窗"){target="_blank"}
- [MDN — @counter-style 的 speak-as](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@counter-style/speak-as "另開新視窗"){target="_blank"}
- [MDN browser-compat-data — list-style-type](https://github.com/mdn/browser-compat-data/blob/main/css/properties/list-style-type.json "另開新視窗"){target="_blank"}
- [Chromium 原始碼 — runtime_enabled_features.json5（CSSCounterStyleSymbolsFunction、CSSAtRuleCounterStyleSpeakAsDescriptor）](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/platform/runtime_enabled_features.json5 "另開新視窗"){target="_blank"}
- [Chromium 原始碼 — ax_node_object.cc（清單標記與 speak-as）](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/modules/accessibility/ax_node_object.cc "另開新視窗"){target="_blank"}
- [WCAG 2.2 說明文件 — 1.3.1 資訊與關係](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html "另開新視窗"){target="_blank"}
