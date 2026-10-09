---
title: Popover 的 auto、manual、hint 到底差在哪？做個可以玩的範例來看看
description: "同一個 popover 屬性，auto、manual、hint 三種值決定能不能點外面關閉、打開時會不會把別人關掉。這篇用可以直接操作的範例逐一比較，也整理了用 hint 做 tooltip 時要自己補的無障礙細節，以及不支援時的降級問題。"
date: 2026-10-09
tags:
  - HTML
  - CSS
  - 前端開發
  - 無障礙
  - 瀏覽器支援
translationKey: popover-auto-manual-hint
category: frontend
draft: false
---

2026/10/09 更新：範例與程式碼改用 Invoker Commands（`command` / `commandfor`），原本的 `popovertarget` 寫法仍然有效；另外新增「用 interestfor 取代觸發的 JavaScript」一節。

--

> 話說在前頭：這篇是我自己練習 `popover="hint"` 的筆記，瀏覽器支援度變動很快，寫的當下正確不代表之後也正確，有講錯的地方歡迎指正。

### 前言

在我的[現代 CSS 與 HTML 技巧整理清單](/blog/css-techniques-checklist)裡，`popover="hint"` 一直是那一格還沒打勾的。

看說明的時候我覺得自己懂了，不就是「給 tooltip 用的 popover」嘛，但真的要講清楚它跟 `auto`、`manual` 差在哪，我發現自己其實講不太出來。所以乾脆把三種值放在一起，每一段都做一個可以直接玩的範例，玩過一次比看十次說明有感。

開始之前，先看一下你的瀏覽器支援到哪裡，後面的範例會依這個結果運作：

::popover-support
::

### 三種值的差別

`popover` 屬性其實只決定兩件事：

1. **能不能點外面或按 Esc 關閉**（也就是 light dismiss）
2. **打開的時候，會不會把別的 popover 關掉**

| 值 | 點外面 / Esc 關閉 | 打開時會關掉誰 | 常見用途 |
|---|---|---|---|
| `auto`（預設） | 會 | 其他不相關的 `auto` 與所有 `hint` | 選單、下拉面板 |
| `manual` | 不會，要自己關 | 誰都不關 | toast 通知、常駐面板 |
| `hint` | 會 | 只關其他 `hint` | tooltip、欄位說明 |

光看表格應該還是有點抽象，下面一個一個來玩。

### `auto`：選單用的預設值

只寫 `popover` 不給值，就是 `auto`。同時只能開一個，點外面或按 Esc 就會關閉，很適合選單和下拉面板。

```html
<button commandfor="menu" command="toggle-popover">開啟選單</button>
<div id="menu" popover>…</div>
```

::popover-mode-demo{mode="auto"}
::

試試看：先開 A 再開 B，A 會自己關掉；再點頁面空白處或按 Esc，B 也關了。

按鈕用的是 Invoker Commands：`commandfor` 指定要控制誰，`command` 指定要做什麼。早期的寫法是 `popovertarget`，現在一樣有效，但它只能控制 popover；`command` 還能控制 `<dialog>`，所以我現在統一用 `command`。範例在不支援 Invoker Commands 的瀏覽器裡，會自動換回 `popovertarget`。

重點是，這整個過程一行 JavaScript 都不用寫。以前要做到「點外面關閉」，還要自己監聽 document 的點擊、判斷點的是不是選單內部，現在一個屬性就搞定了。

### `manual`：完全由你決定

`manual` 不會因為點外面或按 Esc 就關閉，也不會去關別人，所以可以同時開很多個。適合 toast 通知這種要一直留在畫面上的東西，但相對的，**關閉的方式要自己給**。

```html
<div id="panel" popover="manual">
  <button commandfor="panel" command="hide-popover">關閉</button>
</div>
```

::popover-mode-demo{mode="manual"}
::

試試看：A、B 都打開，兩個會同時存在；點外面、按 Esc 都沒反應，只能按面板裡的「關閉」。

### `hint`：終於有給 tooltip 用的值了

在 `hint` 出現之前，tooltip 要用 popover 做，只有兩個不太理想的選擇：

- **用 `auto`**：選單開著的時候，滑鼠移到選單項目上想看提示，提示一打開，**選單就被關掉了**，這根本沒辦法用。
- **用 `manual`**：不會互相干擾，但 Esc 關閉、點外面關閉、好幾個提示同時開著怎麼辦，這些全部都要自己處理。

`hint` 剛好補上中間那一格：它一樣可以點外面或按 Esc 關閉，但地位比 `auto` 低，打開時只會關掉其他 `hint`，不會去打擾正在開著的選單。

```html
<button aria-describedby="tip-save">儲存</button>
<div id="tip-save" popover="hint" role="tooltip">也可以按 Ctrl+S 儲存</div>
```

另外，tooltip 通常是滑鼠移過去或鍵盤聚焦時出現，而不是用點的。原本範例用了一段 JavaScript 在 `pointerenter`、`focus` 的時候呼叫 `showPopover()`，現在可以交給 `interestfor`，下一節會比較兩種寫法。

::popover-mode-demo{mode="hint"}
::

試試看：滑鼠移到按鈕上，或用 Tab 聚焦，提示就會出現；從「儲存」移到「匯出格式」，前一個提示會自動關掉；滑鼠也可以移到提示上面，提示不會消失。

### 再進一步：用 `interestfor` 取代觸發的 JavaScript

先釐清一件我自己一開始也搞混的事：`popover="hint"` 和 `interestfor` 不是二選一，而是兩個不同層次。

| | `popover="hint"` | `interestfor` |
|---|---|---|
| 決定的是 | 它是哪一種 popover：會不會點外面關閉、打開時會關掉誰 | 怎麼觸發它：滑鼠移入、鍵盤聚焦、觸控長按 |
| 取代的是 | 以前要自己管「提示互相關閉、不打擾選單」 | 以前要自己寫的 hover、focus 監聽和延遲關閉 |
| 支援度 | Chrome 133 起 | Chrome 142 起，Firefox 與 Safari 還沒有 |

所以它們本來就是設計來一起用的：`interestfor` 負責觸發，`hint` 負責行為。

**原本用 JavaScript 觸發**，光是觸發的部分就要處理移入、移出、聚焦、失焦，還有「離開按鈕後延遲一下、移到提示上就取消」這段 WCAG 要求的邏輯，範例裡大約寫了 60 行：

```js
trigger.addEventListener("pointerenter", () => show(tip));
trigger.addEventListener("pointerleave", () => hideSoon(tip));
trigger.addEventListener("focus", () => show(tip));
trigger.addEventListener("blur", () => hideSoon(tip));
tip.addEventListener("pointerenter", () => cancelHide(tip));
tip.addEventListener("pointerleave", () => hideSoon(tip));
// ……再加上延遲計時器、判斷滑鼠是不是還在提示上
```

**改用 `interestfor`**，就是一個屬性：

```html
<button interestfor="tip-save" aria-describedby="tip-save">儲存</button>
<div id="tip-save" popover="hint" role="tooltip">也可以按 Ctrl+S 儲存</div>
```

移入、聚焦、觸控長按、延遲、移到提示上不消失、按 Esc 取消，全部由瀏覽器處理。延遲時間也可以用 CSS 調整：

```css
button {
  interest-delay: 0.3s 0.5s; /* 進入延遲、離開延遲 */
}
```

對照前面 WCAG 1.4.13 的表格，原本要自己補的「可移入」也內建了。不過語意還是一樣：`role="tooltip"` 和 `aria-describedby` 我還是建議自己寫清楚。

上面的 hint 範例現在就是這樣做的：支援 `interestfor` 的瀏覽器走原生，不支援的才接上 JavaScript 後備。範例下方會顯示你的瀏覽器目前用的是哪一種，可以用 Chrome 和 Safari 分別打開看看差別。

### 綜合實驗：三種一起用

單獨看都還好理解，放在一起才看得出 `hint` 存在的意義。這個實驗有一個 `auto` 選單，每個項目都掛一個 `hint` 提示，再加一個 `manual` 的 toast 通知。下方的事件紀錄會即時列出每個 popover 的開關，誰把誰關掉一目瞭然。

::popover-lab
::

建議照這個順序玩：

1. 先按「顯示 toast」打開 `manual` 通知。
2. 按「檔案選單」打開 `auto` 選單。toast 不受影響，兩個會同時開著。
3. 滑鼠移到選單項目上，或用 Tab 聚焦。提示出現了，**而且選單沒有被關掉**。
4. 在項目之間移來移去。舊提示關閉、新提示打開，選單一直都在。
5. 按一次 Esc，先關掉提示；再按一次，關掉選單。toast 還是留著，要按它自己的「關閉」。

如果把選單項目上的提示換成 `auto`，第 3 步提示一打開，選單就會被關掉，這就是 `hint` 存在的原因。

順帶一提，做這個範例的時候才發現一個小眉角：選單開著的時候去按「顯示 toast」，選單會先被關掉。因為那一下點擊落在選單外面，觸發了 `auto` 的 light dismiss。行為完全正確，只是一開始沒想到，所以步驟才會變成「先開 toast，再開選單」。

### 再一個坑：幫 popover 寫了 `display`，要自己補回隱藏

這個坑是我在測範例時實際踩到的：選單關掉之後，滑鼠滑過選單原本的位置，tooltip 竟然跳出來了。

原因是我幫選單寫了 `display: grid` 來排版：

```css
.menu {
  display: grid;
}
```

瀏覽器對「關閉中的 popover」本來會套用 `display: none`，但這條是瀏覽器內建的樣式，優先權最低，只要作者自己寫了 `display`，就會被蓋掉。結果選單關閉後並沒有消失，只是因為其他樣式變成透明而已，元素其實還留在原位：

- 滑鼠經過看不見的項目，一樣會觸發 hover，所以 tooltip 跳出來了。
- 更糟的是，**鍵盤使用者按 Tab 會停在這些看不見的按鈕上**。我用自動測試確認過，修正前一路按 Tab，焦點會一個一個落在已經關閉的選單項目上。對鍵盤和報讀軟體使用者來說，這等於是在跟一個看不見的選單互動。

修正方式很簡單，自己把關閉時的隱藏補回來：

```css
.menu {
  display: grid;
}

.menu:not(:popover-open) {
  display: none;
}
```

如果你有做淡出動畫（`transition` 搭配 `display` 的 `allow-discrete`），在淡出的那一小段時間裡元素還是碰得到。範例裡另外加了一個保險：觸發按鈕所在的 popover 沒有開著，就不顯示 tooltip。

一句話記住：**只要幫 popover 寫了 `display`，就要記得補 `:not(:popover-open) { display: none; }`。**

### 用 `hint` 做 tooltip，無障礙還是要自己補

這裡是我覺得最需要注意的地方：`popover` 只負責「顯示和隱藏」，**不會自動幫你加任何語意**。

WCAG 1.4.13「滑鼠移入或聚焦時出現的內容」有三項要求，`hint` 只幫你做了一部分：

| 要求 | hint 有內建嗎 | 要自己補的 |
|---|---|---|
| 可關閉：不移動焦點就能關掉 | 有（Esc、點外面） | 不支援 hint 的瀏覽器要自己補 Esc |
| 可移入：滑鼠能移到提示上而不消失 | 沒有 | 離開按鈕後等一小段時間再關，移到提示上就取消 |
| 持續顯示：不會自己計時消失 | 有 | 不要寫計時關閉就好 |

另外還有兩點：

- **語意要自己加**：提示加上 `role="tooltip"`，按鈕用 `aria-describedby` 指向它，報讀軟體才會把提示當成描述唸出來。
- **提示裡面不要放可以互動的東西**：有連結或按鈕的內容就不算 tooltip 了，應該改用 `auto` 做成可以點開的小面板。

### 不支援的時候會怎樣？

這點跟之前研究的 [`hidden="until-found"`](/blog/hidden-until-found/) 不一樣，要特別小心。

`until-found` 在不支援的瀏覽器裡只是退回成一般的 `hidden`，頂多搜尋不到，不會壞掉；但瀏覽器遇到不認得的 popover 值，會把它當成 **`manual`**。也就是說，在不支援 `hint` 的瀏覽器裡，你的 tooltip **按 Esc 跟點外面都關不掉**，直接違反上面「可關閉」的要求。

偵測的方式不難：

```js
const probe = document.createElement("div");
probe.popover = "hint";
const supportsHint = probe.popover === "hint";
```

不支援的時候，可以退回用 `auto`，或像本文的範例一樣自己補上 Esc 關閉。`hint` 是從 Chrome 133 開始支援，其他瀏覽器的狀況變動很快，上線前還是以 [caniuse](https://caniuse.com "另開新視窗"){target="_blank"} 和 MDN 為準。

### 結論

整理成一句話：

- **選單、下拉面板**：用 `auto`。
- **通知、常駐面板**：用 `manual`，記得給關閉的方式。
- **tooltip**：用 `hint`，但語意、可移入、不支援時的 Esc 關閉，這三件事還是要自己補。

`hint` 解決的不是什麼大問題，就是 tooltip 跟選單「互相打架」這個小地方，但這種小地方剛好是以前最容易被草草帶過、最後變成無障礙問題的。能少寫一點程式、又少踩一個坑，我覺得很值得。

這樣清單裡又可以多打一個勾了。你在專案裡是怎麼做 tooltip 的呢？歡迎一起討論！

### 延伸閱讀

- [收合的內容，為什麼按 Ctrl+F 找不到？聊聊 hidden="until-found"](/blog/hidden-until-found/)
- [現代 CSS 與 HTML 技巧整理清單：102 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)
- [無障礙網頁設計學習與簡易要點](/blog/a11y-learning/)

### 相關連結

- [MDN — popover 全域屬性](https://developer.mozilla.org/zh-TW/docs/Web/HTML/Global_attributes/popover "另開新視窗"){target="_blank"}
- [W3C — WCAG 2.2 理解 1.4.13 滑鼠移入或聚焦時出現的內容](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus "另開新視窗"){target="_blank"}
- [Can I use（瀏覽器支援度查詢）](https://caniuse.com "另開新視窗"){target="_blank"}
