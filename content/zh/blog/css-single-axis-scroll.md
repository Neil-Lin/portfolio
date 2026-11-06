---
title: "表頭黏在頁面頂端、第一欄黏在左邊：用單軸捲動容器做資料表，以及無障礙要補的三件事"
description: "很寬的資料表放進 overflow-x: auto 的外框後，表頭就沒辦法在頁面往下捲時固定在頂端。Chrome 156 起支援單軸捲動容器：外框寫 overflow: auto clip，表頭黏在頁面、第一欄黏在外框。我用互動範例實測，並整理無障礙要自己補的三件事：外框的角色與名稱、焦點不被固定的欄位蓋住、放大到 320px 寬時頁面不能橫向捲動。"
date: 2026-11-05
tags:
  - CSS
  - 前端開發
  - 無障礙
  - 瀏覽器支援
category: frontend
translationKey: css-single-axis-scroll
draft: false
---

> 話說在前頭：這篇由 AI（Anthropic 的 Claude）協助收集資料與整理，我再閱讀確認。文中的行為是在 Chromium 153 與 159 上實測的結果；規格、無障礙規範與支援度都以文末連結的 W3C 規格、WCAG 說明文件、MDN 與 Chromium 原始碼為依據。有講錯的地方歡迎指正。

## 以前的問題

很寬的資料表，常見的做法是包一層外框，讓表格在外框裡左右捲動：

```css
.table-wrap {
  overflow-x: auto;
}
```

接著想讓表頭在**頁面往下捲**時固定在頂端，第一欄在**表格往右捲**時固定在左邊：

```css
thead th {
  position: sticky;
  top: 0;
}
tbody th {
  position: sticky;
  left: 0;
}
```

第一欄可以，表頭卻不行。原因有兩個：

1. CSS Overflow 規格規定，一個方向設了可捲動的值（例如 `auto`），另一個方向的 `visible` 會被計算成 `auto`。所以外框其實**上下左右都是捲動容器**。
2. `position: sticky` 會黏在最近的捲動容器上。外框本身不會上下捲動，表頭黏在外框上，頁面往下捲時就跟著整個表格捲走了。

以前就算把上下方向寫成 `overflow-y: clip`，`clip` 也會被自動改成 `hidden`，還是捲動容器，結果一樣。

## 單軸捲動容器

Chrome 156 起，`clip` 可以和可捲動的值一起用，不再被改成 `hidden`：

```css
.table-wrap {
  overflow: auto clip; /* 左右 auto、上下 clip */
}
```

規格把這種只有一個方向可以捲動、另一個方向是 `clip` 的元素，稱為**單軸捲動容器**（single-axis scroll container）。

搭配的是 CSS Position 規格對 sticky 的定義：sticky 的上下、左右，會**各自**找「那個方向可以捲動」的最近容器。所以：

- 表頭的 `top: 0`：外框上下不能捲動，往上找到頁面本身，黏在**頁面頂端**。
- 第一欄的 `left: 0`：外框可以左右捲動，黏在**外框左邊**。

如果頁面本身也有固定在頂端的頁首，表頭的 `top: 0` 會和頁首疊在一起，`top` 要設成頁首的高度。這個網站的頁首往上捲時才會出現，我實測時表頭和頁首就互相遮住了，所以範例用 JavaScript 跟著頁首調整表頭的 `top`。

另外，`clip` 和 `hidden` 還有一個差別：設成 `hidden` 的方向，使用者捲不動，但程式還是可以捲動它；設成 `clip` 的方向，`scrollIntoView()`、`scrollBy()` 這類 API 也不會讓它離開 0。

## 互動範例

先看你的瀏覽器支援度：

::feature-support{features="single-axis-scroll" notice="你的瀏覽器不支援單軸捲動容器，下方範例的兩種寫法看起來會一樣：表頭不會黏在頁面頂端。"}
::

::single-axis-table-demo
::

## 實測：新舊寫法的差別

我把同一個表格（13 欄、40 列）放在兩種外框裡，捲動頁面與表格後量表頭、第一欄的位置：

| | Chromium 153 | Chromium 159 |
|---|---|---|
| `overflow-y: clip` 計算後的值 | `hidden` | `clip` |
| 頁面往下捲時，表頭 | 跟著捲走 | 黏在頁面頂端 |
| 表格往右捲時，第一欄 | 黏在外框左邊 | 黏在外框左邊 |

舊寫法（只有 `overflow-x: auto`）在兩個版本都一樣，表頭都會捲走。

## 無障礙要自己補的三件事

### 1. 外框要能用鍵盤操作，而且要有角色和名稱

鍵盤使用者要能捲動外框（WCAG 2.1.1「鍵盤」）。MDN 的建議是：可以取得焦點的捲動區，要加 `tabindex="0"`，而且**要有角色和可存取名稱**；如果內容不值得當成頁面的地標（landmark），用 `group` 角色。

```html
<div class="table-wrap" role="group" aria-labelledby="sales-caption" tabindex="0">
  <table>
    <caption id="sales-caption">2026 年各產品每月業績（萬元）</caption>
    …
  </table>
</div>
```

我在 Chromium 159 實測一個沒有連結、按鈕的表格：沒加 `tabindex` 時，Chrome 會自動讓外框可以用 Tab 取得焦點，左右鍵捲動表格、上下鍵捲動頁面，鍵盤沒有被困住。**但外框在無障礙樹裡沒有角色也沒有名稱**，焦點移過去時，報讀軟體不會念出這是什麼。所以 `role`、名稱、`tabindex` 還是要自己寫。

加上 `position: sticky` 不會破壞表格語意：無障礙樹裡的欄標題（13 個）、列標題（40 個）和儲存格都正確。

### 2. 焦點不能被固定的第一欄蓋住

第一欄固定在左邊，等於浮在表格上面。用 Tab 移動焦點時，瀏覽器會把那一格捲進外框，但它不知道左邊被第一欄擋住，常常把格子捲到第一欄底下，焦點就看不到了。

這違反 WCAG 2.4.11「焦點不被遮蔽（最低）」（AA）：取得焦點的元件不能被完全蓋住。

解法：外框加上 `scroll-padding-inline-start`，值設成第一欄的寬度，告訴瀏覽器「左邊這段被擋住，不算看得到」，它就會把格子捲到第一欄的右邊。

```css
.table-wrap {
  --first-col: 7.5rem;
  scroll-padding-inline-start: var(--first-col);
}
tbody th {
  min-inline-size: var(--first-col);
}
```

實測：每格都有連結的表格，Tab 和 Shift+Tab 各按 150 次（落在連結上的有 299 次）。

| | 焦點完全被蓋住 |
|---|---|
| 沒加 | **24 次** |
| 加上 | **0 次** |

### 3. 放大到 320px 寬時，頁面不能橫向捲動

WCAG 1.4.10「重排」要求畫面放大到 400%（大約 320 CSS 像素寬）時，不需要兩個方向捲動。說明文件也寫明，資料表的欄、列標題和資料之間是二維的關係，所以**資料表本身**是例外，可以左右捲動。

但例外只限表格。我把畫面設成 320px 寬實測：只有外框裡的表格左右捲動，頁面本身沒有出現橫向捲軸。外框不要設固定寬度，也不要讓表格撐開外框外面的版面。

## 支援度與漸進增強

- **Chrome**：Chromium 原始碼裡，這個功能在 153～155 是實驗狀態，**156 起正式開啟**。
- **Firefox、Safari**：撰寫時，MDN 的瀏覽器相容性資料還沒有這個功能的項目，我也沒有找到兩家已支援的官方資料。

不支援的瀏覽器會把 `clip` 當成 `hidden`，結果就是舊寫法：第一欄照常固定，表頭不會黏在頁面頂端，表格還是能正常使用。

要針對支援度寫不同的樣式，CSS Conditional 5 規格定義了 `named-feature()`：

```css
@supports named-feature(single-axis-scroll-container) {
  /* 支援單軸捲動容器時才套用 */
}
```

我實測 Chromium 159 會套用，Chromium 153 不會。

## 完整寫法

```html
<div class="table-wrap" role="group" aria-labelledby="sales-caption" tabindex="0">
  <table>
    <caption id="sales-caption">2026 年各產品每月業績（萬元）</caption>
    <thead>
      <tr>
        <th scope="col">產品</th>
        <th scope="col">1 月</th>
        <!-- … -->
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">產品 01</th>
        <td>412</td>
        <!-- … -->
      </tr>
    </tbody>
  </table>
</div>
```

```css
.table-wrap {
  --first-col: 7.5rem;
  overflow: auto clip; /* 左右捲動、上下交給頁面 */
  scroll-padding-inline-start: var(--first-col);
}

table {
  /* collapse 時，固定的格子的框線會留在原地 */
  border-collapse: separate;
  border-spacing: 0;
}

thead th {
  position: sticky;
  top: 0;
  z-index: 1;
}

tbody th {
  position: sticky;
  left: 0;
  min-inline-size: var(--first-col);
}

thead th:first-child {
  left: 0;
  z-index: 2; /* 左上角同時固定兩個方向，要在最上層 */
}

/* 固定的格子要有背景色，不然底下捲過去的內容會透出來 */
th {
  background-color: Canvas;
}
```

## 延伸閱讀

- [放大之後，置中的內容上半部不見了？用 safe center 讓它捲得到](/blog/css-safe-alignment/)
- [現代 CSS 與 HTML 技巧整理清單：116 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

## 相關連結

- [CSS Overflow Module Level 3 — 單軸捲動容器、overflow 的計算值](https://drafts.csswg.org/css-overflow-3/#overflow-control "另開新視窗"){target="_blank"}
- [CSS Positioned Layout Module Level 3 — sticky 依方向找捲動容器](https://drafts.csswg.org/css-position-3/#stickypos-insets "另開新視窗"){target="_blank"}
- [CSS Scroll Snap Module Level 1 — scroll-padding](https://drafts.csswg.org/css-scroll-snap-1/#scroll-padding "另開新視窗"){target="_blank"}
- [CSS Conditional Rules Module Level 5 — named-feature()](https://drafts.csswg.org/css-conditional-5/#support-definition-named-features "另開新視窗"){target="_blank"}
- [Single-Axis Scroll Containers 說明文件（Google）](https://github.com/explainers-by-googlers/single-axis-scroll-containers "另開新視窗"){target="_blank"}
- [Chromium 原始碼 — runtime_enabled_features.json5（SingleAxisScrollContainers）](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/platform/runtime_enabled_features.json5 "另開新視窗"){target="_blank"}
- [WCAG 2.2 說明文件 — 2.4.11 焦點不被遮蔽（最低）](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html "另開新視窗"){target="_blank"}
- [WCAG 2.2 說明文件 — 1.4.10 重排](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html "另開新視窗"){target="_blank"}
- [WCAG 2.2 說明文件 — 2.1.1 鍵盤](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html "另開新視窗"){target="_blank"}
- [MDN — ARIA group 角色：可捲動的內容區](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/group_role#scrollable_content_areas "另開新視窗"){target="_blank"}
- [Interop 提案 — Single-axis scroll containers（追蹤各瀏覽器進度）](https://github.com/web-platform-tests/interop/issues/1436 "另開新視窗"){target="_blank"}
