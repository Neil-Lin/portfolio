---
title: 放大之後，置中的內容上半部不見了？用 safe center 讓它捲得到
description: "align-items: center 是最常寫的 CSS 之一，但內容比容器大的時候，會往兩邊溢出，跑到上方和左邊的部分捲不到。使用者把畫面放大到 400% 時特別容易發生，鍵盤 Tab 過去也看不到焦點。這篇用互動範例實測 safe center，整理哪些置中寫法會出事、哪些預設就安全，最後也檢查了這個網站。"
date: 2026-10-13
tags:
  - CSS
  - 前端開發
  - 無障礙
  - 瀏覽器支援
category: frontend
translationKey: css-safe-alignment
draft: false
---

> 話說在前頭：文中的行為我在 Chromium 141 和 153 上實測過，兩個版本結果一樣。其他瀏覽器的細節可能不同，上線前請以 caniuse 為準。有講錯的地方歡迎指正。

### 前言

置中大概是寫 CSS 最常做的事之一：

```css
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

登入頁、空狀態、對話框，到處都是這幾行。平常看起來都沒問題，但只要**內容比容器大**，就會出事：置中會讓內容往上下（或左右）兩邊平均溢出，**跑到上方和左邊的那一半，捲不到**。

什麼時候內容會比容器大？最常見的就是使用者把畫面放大。WCAG 1.4.10「重排」要求畫面放大到 400%（大約等於 320 CSS 像素寬）時，內容還是要能完整使用；1.4.4「調整文字大小」也要求文字放大到 200% 時不能遺失內容。放大之後，原本放得下的卡片就放不下了。

這篇的主角是 [CSS 與 HTML 技巧清單](/blog/css-techniques-checklist)裡的「溢位對齊 `safe` / `unsafe`」。

先看一下你的瀏覽器支援度：

::feature-support{features="safe-align" notice="你的瀏覽器不支援 safe 關鍵字，下方範例選 safe center 時不會有作用。"}
::

### 一、問題長什麼樣子

下面的虛線框是一個固定高度的畫面，裡面有一張置中的登入卡片。範例一開始就是放大 200% 的狀態：

::safe-align-demo{kind="card"}
::

可以這樣玩：

1. 選 `center`，試著把虛線框往上捲：卡片的上半部（「返回」按鈕和標題）捲不到。
2. 按 Tab 移到「返回」按鈕：焦點確實到了，但按鈕在畫面外，看不到。
3. 換成 `safe center`：卡片改成從頂端開始排，所有內容都捲得到。
4. 把放大倍率調回 100%：放得下的時候，`center` 和 `safe center` 看起來一模一樣，都是置中。

### 二、為什麼捲不到？

捲動容器只能往「結束」的方向捲：往下、往右。內容溢出到「起點」那一側（上方、左邊），就落在可以捲動的範圍外面了。

我的實測：寬 200px 的捲動容器，放一個寬 300px 的元素，用 `justify-content: center`：

- 元素的左邊緣在容器外 50px 的地方。
- 容器的 `scrollWidth` 只有 250px，不是 300px。

也就是說，左邊那 50px 從來就不在捲動範圍裡，捲軸拉到最左邊也看不到。

### 三、寫法：在 center 前面加上 safe

```css
.page {
  min-height: 100vh;
  display: flex;
  align-items: safe center;
  justify-content: safe center;
}
```

`safe` 的意思是：**放得下就置中，放不下就改成從起點對齊**。溢出的部分只會往結束那一側跑，所以一定捲得到。

| 關鍵字 | 放不下的時候 |
|---|---|
| `safe center` | 改成靠起點對齊，溢出的部分都捲得到 |
| `unsafe center` | 堅持置中，兩邊平均溢出，起點那一側捲不到 |
| 只寫 `center` | 依情況不同，見第六節的實測 |

`safe` 和 `unsafe` 可以用在所有對齊屬性上：`align-items`、`justify-content`、`align-content`、`align-self`、`justify-self`、`justify-items`，以及 `place-*` 簡寫。也可以搭配 `center` 以外的值，例如 `safe end`。

不支援 `safe` 的瀏覽器，會把整條宣告當成無效。為了保險，可以寫兩行，讓不支援的瀏覽器用前一行：

```css
.page {
  align-items: center;
  align-items: safe center;
}
```

### 四、對鍵盤使用者的影響

範例第 2 步看到的狀況，我另外用整頁來測：視窗設成 320×256（模擬 1280×1024 的螢幕放大 400%），`body` 用 flex 置中一個比畫面高的登入表單。

- **用 `center`**：表單最上面的連結在畫面外 89px 的地方。按 Tab 會 focus 到它，但畫面不會捲過去，因為那裡根本不在捲動範圍內。我連 `scrollIntoView()` 都試了，一樣捲不過去。
- **用 `safe center`**：連結就在畫面最上方，Tab 過去看得到。

對鍵盤使用者來說，這等於焦點消失了，不知道自己現在在哪裡，違反 WCAG 2.4.7「焦點可見」。對放大畫面的使用者來說，表單的標題和說明直接不見，也不會知道上面還有東西。

### 五、橫向也一樣：可以捲動的標籤列

橫向的例子也很常見：一排可以左右捲動的標籤，想讓它在寬螢幕上置中，就寫了 `justify-content: center`：

::safe-align-demo{kind="chips"}
::

我實測寬 300px 的容器放 8 個標籤，用 `center` 時，第一個標籤在容器外 198px 的地方，前面兩三個標籤完全捲不到。用 Tab 移到第一個標籤，焦點一樣在畫面外。

換成 `safe center`，寬螢幕放得下時一樣置中，窄螢幕放不下時就從第一個開始排，可以正常往右捲。

### 六、實測：哪些寫法會出事，哪些預設就安全？

只寫 `center` 時，不同的排版方式結果不一樣。我把容器設成固定大小，放一個比容器大的元素，結果整理如下：

| 寫法 | 只寫 `center` 時 |
|---|---|
| flex 的 `justify-content: center` | 起點被切掉 |
| flex 固定高度的 `align-items: center` | 上方被切掉 |
| 整頁 `body` 用 flex 置中 | 上方被切掉 |
| grid 的 `place-content: center` | 起點被切掉 |
| grid 的 `place-items: center`，欄寬固定 | 起點被切掉 |
| grid 的 `place-items: center`，欄寬自動 | 欄寬會跟著內容變大，溢出只往結束那一側，捲得到 |
| 一般區塊的 `align-content: center` | 預設就安全，要寫 `unsafe` 才會被切掉 |
| `position: absolute` 加 `inset: 0` 和 `justify-self: center` | 預設就安全，要寫 `unsafe` 才會被切掉 |
| `position: absolute` 加 `inset: 0; margin: auto` | 安全 |
| flex 子元素用 `margin: auto` 置中 | 安全 |
| `left: 50%; transform: translateX(-50%)` | 起點被切掉 |

幾個重點：

- **flex 和 grid 只寫 `center` 就是 unsafe**，這是最需要注意的。
- **`margin: auto` 本來就是安全的**：自動外距最小是 0，不會變成負的，放不下時內容只會往結束那一側溢出。所以如果要支援很舊的瀏覽器，flex 子元素用 `margin: auto` 置中，效果跟 `safe center` 一樣。
- **`translate(-50%)` 這招是 unsafe 的**：以前常用的絕對定位置中技巧，放不下時一樣會被切掉。

### 七、什麼時候該加 safe？

不是每個 `center` 都需要加。內容會溢出，前提是**容器的大小是固定的**：

- 容器有固定的高度，例如 `height: 100vh`、`block-size: 20rem`。
- 容器不換行，例如 `flex-wrap: nowrap` 的橫向列表。
- 容器是捲動容器，例如 `overflow: auto` 的標籤列。

容器會跟著內容長高、或是有 `flex-wrap: wrap` 會換行的，內容放不下時容器就變大或換行了，不會溢出。像按鈕和圖示並排的 `align-items: center`，這一行的高度本來就是最高的那個元素撐出來的，也不會溢出。

我的建議是：**容器大小固定的置中，一律寫 `safe center`**。放得下的時候效果完全一樣，沒有任何損失。

### 八、檢查這個網站

我用 Playwright 把這個網站的 52 個頁面，用 320×256 的視窗（放大 400%）跑過一次，找出所有用 flex 或 grid 置中、而且內容溢出到起點那一側的元素。

結果沒有找到需要修的地方：這個網站的按鈕列、分頁、標籤篩選都有 `flex-wrap: wrap`，容器也沒有固定高度，放大之後是換行和長高，不會溢出。唯一被抓到的是頁首的 accesskey 錨點（`:::`），它是絕對定位、刻意放在角落的，不是溢出。

另外有兩個地方我特別看了：

- **載入中的畫面**：全螢幕固定高度、上下左右置中，是典型會出事的寫法。但裡面只有一個 6rem 的轉圈圈，放大 400% 也放得下，所以沒有改。
- **輪播的導覽點**：[輪播那篇](/blog/css-carousel-a11y/)的 `::scroll-marker-group` 是不換行的 `justify-content: center`。現在只有 4 張投影片放得下，但這段 CSS 是給讀者參考的，投影片一多、畫面一窄，前面幾個導覽點就會捲不到。所以我加上了 `safe center`。

### 結論

整理成幾句話：

- 置中的內容放不下時，會往兩邊溢出，跑到上方和左邊的部分捲不到。
- 放大畫面的使用者會看不到內容；鍵盤使用者 Tab 過去，焦點會在畫面外。
- 寫成 `safe center`：放得下就置中，放不下就從起點排。
- flex 和 grid 只寫 `center` 就是 unsafe；`margin: auto` 和一般區塊的 `align-content` 本來就安全；`translate(-50%)` 是 unsafe。
- 容器大小固定的置中，一律加 `safe`；不支援的瀏覽器，前面再寫一行 `center` 當備案。

只要多打一個字，就能避免一整塊內容在放大時消失，是投資報酬率很高的一個小習慣。

你的專案裡，有沒有全螢幕置中的登入頁或對話框？放大到 400% 看看，說不定上面也少了一塊。

### 延伸閱讀

- [提示框被切掉了？用 @position-try 讓瀏覽器自己找位置](/blog/position-try/)
- [讀到一半畫面突然跳走？聊聊捲動錨定 overflow-anchor](/blog/scroll-anchoring/)
- [現代 CSS 與 HTML 技巧整理清單：115 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

### 相關連結

- [MDN — align-items 的 safe 與 unsafe](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items#safe "另開新視窗"){target="_blank"}
- [CSS Box Alignment Module Level 3 — 溢位對齊](https://drafts.csswg.org/css-align-3/#overflow-values "另開新視窗"){target="_blank"}
- [WCAG 2.2 — 1.4.10 重排](https://www.w3.org/WAI/WCAG22/Understanding/reflow "另開新視窗"){target="_blank"}
- [WCAG 2.2 — 2.4.7 焦點可見](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible "另開新視窗"){target="_blank"}
- [Can I use（瀏覽器支援度查詢）](https://caniuse.com "另開新視窗"){target="_blank"}
