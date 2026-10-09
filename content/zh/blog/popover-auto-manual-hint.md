---
title: Popover 的三種值：auto、manual 與 hint，附可互動範例
description: "同一個 popover 屬性，auto、manual、hint 三種值決定能不能點外面關閉、打開時會不會關掉別人。本文用可直接操作的範例逐一比較，並說明用 hint 做 tooltip 時的無障礙要點與降級處理。"
date: 2026-10-09
tags:
  - HTML
  - CSS
  - 前端開發
  - 無障礙
  - 瀏覽器支援
translationKey: popover-auto-manual-hint
draft: true
---

### 前言

在我的[現代 CSS 與 HTML 技巧整理清單](/blog/css-techniques-checklist)裡，`popover="hint"` 一直是還沒打勾的項目。這篇把它和另外兩個值 `auto`、`manual` 放在一起比較，每一段都附上可以直接操作的範例。

先看你的瀏覽器支援到哪裡，後面的範例會依這個結果運作：

::popover-support
::

### 三種值的差別

`popover` 屬性決定兩件事：**能不能點外面或按 Esc 關閉**（light dismiss），以及**打開時會不會把別的 popover 關掉**。

| 值 | 點外面 / Esc 關閉 | 打開時會關掉誰 | 典型用途 |
|---|---|---|---|
| `auto`（預設） | 會 | 其他不相關的 `auto` 與所有 `hint` | 選單、下拉面板 |
| `manual` | 不會，要自己關 | 誰都不關 | toast 通知、常駐面板 |
| `hint` | 會 | 只關其他 `hint` | tooltip、欄位說明 |

### auto：選單用的預設值

只寫 `popover` 不給值，就是 `auto`。同時只能開一個，點外面或按 Esc 就會關閉，最適合選單和下拉面板。

```html
<button popovertarget="menu">開啟選單</button>
<div id="menu" popover>…</div>
```

::popover-mode-demo{mode="auto"}
::

試試看：先開 A 再開 B，A 會自動關閉；再點頁面空白處或按 Esc，B 也會關閉。整個過程不需要任何 JavaScript。

### manual：完全由你控制

`manual` 不會因為點外面或按 Esc 關閉，也不會關掉別人，可以同時開很多個。適合 toast 通知這類要停留在畫面上的內容，但關閉的方式要自己提供。

```html
<div id="panel" popover="manual">
  <button popovertarget="panel" popovertargetaction="hide">關閉</button>
</div>
```

::popover-mode-demo{mode="manual"}
::

試試看：A、B 都打開，兩個會同時存在；點外面、按 Esc 都沒有反應，只能按面板裡的「關閉」。

### hint：專給 tooltip 的新值

在 `hint` 出現之前，tooltip 只有兩個不理想的選擇：

- 用 `auto`：選單開著時，滑鼠移到選單項目上想看提示，提示一打開，**選單就被關掉了**。
- 用 `manual`：不會互相干擾，但 Esc 關閉、點外面關閉、多個提示同時開著的問題，全都要自己處理。

`hint` 補上了中間那一格：有 light dismiss，但地位比 `auto` 低，打開時只會關掉其他 `hint`，不會打擾正在開著的選單。

```html
<button aria-describedby="tip-save">儲存</button>
<div id="tip-save" popover="hint" role="tooltip">也可以按 Ctrl+S 儲存</div>
```

tooltip 通常在滑鼠移入或鍵盤聚焦時出現，而不是點擊，所以範例用少量 JavaScript 在 `pointerenter`、`focus` 時呼叫 `showPopover()`。未來也可以改用宣告式的 Interest Invokers（`interestfor` 屬性），完全不寫 JavaScript。

::popover-mode-demo{mode="hint"}
::

試試看：滑鼠移到按鈕上，或用 Tab 聚焦，提示就會出現；從「儲存」移到「匯出格式」，前一個提示會自動關閉；滑鼠也可以移到提示上，提示不會消失。

### 綜合實驗：三種一起用

這個實驗把三種值放在一起：一個 `auto` 選單，每個項目掛一個 `hint` 提示，再加一個 `manual` 的 toast 通知。下方的事件紀錄會即時列出每個 popover 的開關，可以看清楚誰把誰關掉了。

::popover-lab
::

建議照這個順序操作：

1. 先按「顯示 toast」打開 `manual` 通知。
2. 按「檔案選單」打開 `auto` 選單。toast 不受影響，兩個同時開著。
3. 滑鼠移到選單項目上，或用 Tab 聚焦。提示出現，**選單沒有被關掉**。
4. 在項目之間移動。舊提示關閉、新提示打開，選單一直開著。
5. 按一次 Esc，先關掉提示；再按一次，關掉選單。toast 一直留著，要按它的「關閉」。

反過來試也很有意思：選單開著時去按「顯示 toast」，選單會先關掉。因為這一下點擊落在選單外面，觸發了 `auto` 的 light dismiss。

如果把選單項目上的提示改成 `auto`，第 3 步提示一打開，選單就會被關掉，這就是 `hint` 存在的原因。

### 用 hint 做 tooltip 的無障礙要點

`popover` 只負責顯示行為，**不會自動加任何語意**。WCAG 1.4.13「滑鼠移入或聚焦時出現的內容」有三項要求，`hint` 只幫你做了一部分：

| 要求 | hint 內建 | 要自己補的 |
|---|---|---|
| 可關閉：不移動焦點就能關掉 | 有（Esc、點外面） | 不支援 hint 時補上 Esc 處理 |
| 可移入：滑鼠能移到提示上而不消失 | 沒有 | 離開按鈕後延遲一小段時間才關，移到提示上就取消 |
| 持續顯示：不會自己計時消失 | 有 | 不要寫計時關閉 |

另外還有兩點：

- **語意要自己加**：提示加上 `role="tooltip"`，觸發按鈕用 `aria-describedby` 指向它，螢幕閱讀器才會把提示當成描述唸出來。
- **提示裡不要放可互動的元素**：有連結或按鈕的內容就不算 tooltip，應該改用 `auto` 做成可點開的小面板。

### 不支援時會發生什麼

這一點和 `hidden="until-found"` 不同，需要特別注意：瀏覽器遇到不認得的 popover 值，會把它當成 **`manual`**。也就是說，在不支援 `hint` 的瀏覽器裡，tooltip **按 Esc 和點外面都關不掉**，直接違反上面「可關閉」的要求。

可以這樣偵測：

```js
const probe = document.createElement("div");
probe.popover = "hint";
const supportsHint = probe.popover === "hint";
```

不支援時，可以退回 `auto`，或像本文的範例一樣自己補上 Esc 關閉。`hint` 在 Chrome 133 開始支援；其他瀏覽器的狀況變動很快，上線前請以 [caniuse](https://caniuse.com "另開新視窗"){target="_blank"} 與 MDN 為準。

### 小結

- **選單、下拉面板**：用 `auto`。
- **通知、常駐面板**：用 `manual`，記得提供關閉方式。
- **tooltip**：用 `hint`，但語意、可移入與不支援時的 Esc 關閉都要自己補。

### 相關連結

- [MDN — popover 全域屬性](https://developer.mozilla.org/zh-TW/docs/Web/HTML/Global_attributes/popover "另開新視窗"){target="_blank"}
- [W3C — WCAG 2.2 理解 1.4.13 滑鼠移入或聚焦時出現的內容](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus "另開新視窗"){target="_blank"}
- [Can I use（瀏覽器支援度查詢）](https://caniuse.com "另開新視窗"){target="_blank"}
