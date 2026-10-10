---
title: 不用再手刻 roving tabindex：用 focusgroup 做鍵盤方向鍵導覽
description: "工具列、頁籤、選單這類元件，WAI-ARIA 要求整組只佔一個 Tab 停留點、組內用方向鍵移動，以前都要自己寫 roving tabindex。focusgroup 讓 HTML 加一個屬性就做到。這篇在 Chromium 153 實測六種類型、修飾詞、自動加上的角色，以及頁籤入口和只寫 focusgroup 沒效果這兩個坑，也附上不支援時的後備寫法。"
date: 2026-10-10
tags:
  - HTML
  - 前端開發
  - 無障礙
  - 瀏覽器支援
category: frontend
translationKey: focusgroup
draft: false
---

> 話說在前頭：文中的行為我都在 Chromium 153 實測過。`focusgroup` 還很新，規格和實作都可能再變；報讀軟體實際怎麼唸，也請以你自己打開報讀軟體聽到的為準。有講錯的地方歡迎指正。

### 前言

做過無障礙元件的人，應該都寫過 roving tabindex。

WAI-ARIA 的鍵盤模式要求：工具列、頁籤、選單這類「一組按鈕」的元件，**整組只佔一個 Tab 停留點**，進到組裡之後用方向鍵移動。不然一個有 10 個按鈕的工具列，鍵盤使用者就要按 10 次 Tab 才能離開。

要做到這件事，以前只能自己寫 JavaScript：整組只留一個元素 `tabindex="0"`、其他設成 `-1`，再監聽方向鍵、Home、End，一邊移動焦點一邊搬 `tabindex`。我在自己的 [Accesserty UI Kit](https://github.com/Accesserty/UI-Kit "另開新視窗"){target="_blank"} 裡，頁籤、輪播、樹狀選單都各寫過一次。

`focusgroup` 讓這件事變成一個 HTML 屬性。它是 [CSS 與 HTML 技巧清單](/blog/css-techniques-checklist)裡我最期待的項目之一。

先看一下你的瀏覽器支援度：

::feature-support{features="focusgroup" notice="你的瀏覽器不支援 focusgroup，下方範例會自動改用 JavaScript 模擬，操作起來一樣，可以先感受一下行為。"}
::

### 一、第一個坑：只寫 `focusgroup` 沒有效果

網路上不少介紹（包括我自己清單上原本的範例）是這樣寫的：

```html
<div focusgroup>…</div>
```

我在 Chromium 153 實測，**這樣寫完全沒有作用**，按方向鍵焦點不會動，Tab 也還是一個一個停。

現在的寫法要給一個**行為類型**：

```html
<div focusgroup="toolbar" aria-label="文字格式">
  <button>粗體</button>
  <button>斜體</button>
  <button>底線</button>
</div>
```

這樣整組就只佔一個 Tab 停留點，左右方向鍵在按鈕之間移動，不需要任何 JavaScript。

### 二、動手試試

選一種類型，從「前面的按鈕」按 Tab 進去，再用方向鍵、Home、End 操作。下方的按鍵紀錄會列出每個按鍵讓焦點落在哪裡：

::focusgroup-lab
::

### 三、六種行為類型

我實測每一種的差別，整理如下：

| 類型 | 容器的角色 | 子項目的角色 | 可用的方向鍵 | 到頭尾會繞回 |
|---|---|---|---|---|
| `toolbar` | `toolbar` | 不變 | ← → | 不會 |
| `tablist` | `tablist` | `tab` | ← → | 會 |
| `radiogroup` | `radiogroup` | `radio` | ← → ↑ ↓ | 會 |
| `listbox` | `listbox` | 不變（我用 `button` 測） | ↑ ↓ | 不會 |
| `menu` | `menu` | `menuitem` | ↑ ↓ | 會 |
| `menubar` | `menubar` | `menuitem` | ← → | 會 |

所有類型都支援 Home、End 跳到第一個和最後一個。PageUp、PageDown 沒有作用。

可以看到，**類型不只決定鍵盤行為，還會自動幫你加上角色**。`focusgroup="tablist"` 的容器在無障礙樹裡就是 `tablist`，裡面的按鈕自動變成 `tab`。這點後面還會再談。

### 四、修飾詞：wrap、nomemory、block

類型後面可以加修飾詞，用空白隔開：

| 修飾詞 | 效果 | 實測 |
|---|---|---|
| `wrap` | 到頭尾時繞回 | `toolbar wrap`：在第一個按 ← 跳到最後一個 |
| `nowrap` | 不繞回 | `tablist nowrap`：頭尾停住 |
| `nomemory` | Tab 回來時不記得上次的位置 | 每次都從第一個開始 |
| `block` | 改用上下方向鍵 | `toolbar block`：變成直式工具列 |
| `inline` | 改用左右方向鍵 | — |

### 五、實測的細節

除了方向鍵之外，這些是我實測時特別注意的地方：

**Tab 的行為**

- **整組只佔一個 Tab 停留點**：從組裡按 Tab 直接離開，不會在組內一個一個停。
- **會記住上次的位置**：離開後再按 Shift+Tab 回來，焦點回到上次停的那一個，用滑鼠點過的也算。加上 `nomemory` 就每次都從第一個開始。
- **第一次進來停在第一個**：不管是 Tab 從前面進來，還是 Shift+Tab 從後面回來，第一次都是停在第一個。
- **`focusgroupstart` 可以指定入口**：在某個子項目加上 `focusgroupstart`，第一次進來就停在它上面。

**哪些項目會被跳過**

- `disabled` 的按鈕會被跳過。
- `aria-disabled="true"` 的按鈕**不會**被跳過，還是可以聚焦。這是好事：APG 建議停用的項目在工具列裡最好還是能被發現。
- `tabindex="-1"` 和本來就不能聚焦的元素（例如 `<span>`）會被跳過。

**其他**

- **輸入框裡方向鍵不會被搶走**：組裡有 `<input>` 時，方向鍵是用來移動游標的，焦點不會跳走，要用 Tab 離開。
- **從右到左的語言會反過來**：`dir="rtl"` 時，← 是往下一個。
- **連結也可以**：`<a href>` 一樣能當成項目。
- **局部排除**：在某個子元素加上 `focusgroup="none"`，它就不參與方向鍵導覽，變成獨立的 Tab 停留點。
- **巢狀的 focusgroup** 也會變成獨立的 Tab 停留點，外層的方向鍵不會跑進去。
- **不會改動你的 `tabindex`**：子項目的 `tabindex` 還是原本的 `0`，「只佔一個停留點」是瀏覽器在內部處理的。

### 六、角色是自動的，但狀態不是

前面提到，`focusgroup` 會自動加上角色。但我實測發現，**它只管角色，不管狀態**：

- `focusgroup="tablist"` 的子項目變成 `tab`，但沒有 `aria-selected`。哪個頁籤被選取、對應哪個面板，還是要自己寫。
- `focusgroup="radiogroup"` 的子項目變成 `radio`，但沒有 `aria-checked`。

另外，如果你自己寫了 `role`，會以你寫的為準。例如 `<div role="group" focusgroup="toolbar">`，容器就是 `group`。

所以我的建議是：**角色還是自己寫清楚**，連同 `aria-selected`、`aria-controls` 這些狀態一起管理。一來不支援的瀏覽器也有正確的語意，二來不用猜瀏覽器會幫你加什麼。

還有一個實際的理由：**檢測工具還不認得這些自動加上的角色**。我用 axe 檢查頁籤範例，原本只在容器寫 `focusgroup="tablist"`、沒寫 `role="tablist"`，結果每個 `tab` 都被回報「缺少 `tablist` 父層」，雖然瀏覽器的無障礙樹其實是對的。補上 `role="tablist"` 之後就沒問題了。

### 七、頁籤的坑：Tab 進來停在第一個，不是選取中的那個

APG 的頁籤模式是這樣規定的：從外面 Tab 進到頁籤列時，焦點要落在**目前選取的那個頁籤**上。

但 `focusgroup` 第一次進來永遠停在第一個。如果預設選取的是第二個頁籤，鍵盤使用者 Tab 進來會落在第一個；如果你的頁籤是「聚焦就切換」的寫法，選取還會被改掉。

下面的範例預設選取「規格」，可以先不勾選、按 Tab 進去看看，再勾選 `focusgroupstart` 比較：

::focusgroup-tabs
::

解法是讓 `focusgroupstart` 跟著選取中的頁籤走：

```html
<div focusgroup="tablist" aria-label="產品資訊">
  <button role="tab" aria-selected="false" aria-controls="p1">介紹</button>
  <button role="tab" aria-selected="true" aria-controls="p2" focusgroupstart>規格</button>
  <button role="tab" aria-selected="false" aria-controls="p3">評價</button>
</div>
```

切換頁籤時，記得把 `focusgroupstart` 一起搬到新選取的頁籤上。

也要注意，`focusgroup` 只負責**移動焦點**，「聚焦時要不要順便切換頁籤」、面板的顯示隱藏，還是要自己寫。我的 UI Kit 頁籤是「方向鍵移動就切換」的寫法，換成 `focusgroup` 之後，可以省掉的是方向鍵、Home、End、從右到左、繞回這些鍵盤處理，選取和面板的邏輯還是要留著。

### 八、不支援的時候怎麼辦？

不支援的瀏覽器會忽略這個屬性，元件退回成「每個按鈕一個 Tab 停留點」。還是用得了，只是不符合 APG 的鍵盤模式。

偵測方式：

```js
const supportsFocusgroup = "focusGroup" in HTMLElement.prototype;
```

注意 JavaScript 屬性名稱是駝峰式的 `focusGroup`。我一開始用 `"focusgroup" in HTMLElement.prototype` 偵測，結果明明支援卻回報不支援。

不支援的時候，就退回自己寫的 roving tabindex。這篇的範例就是這樣做的：支援時交給瀏覽器，不支援時用 JavaScript 模擬同樣的行為表，你可以用 Safari 或 Firefox 打開看看，操作起來應該一樣。核心邏輯大概是這樣：

```js
if (!("focusGroup" in HTMLElement.prototype)) {
  const items = [...toolbar.querySelectorAll("button")];
  items.forEach((el, i) => (el.tabIndex = i === 0 ? 0 : -1));
  toolbar.addEventListener("keydown", (e) => {
    const i = items.indexOf(e.target);
    let next = null;
    if (e.key === "ArrowRight") next = Math.min(i + 1, items.length - 1);
    if (e.key === "ArrowLeft") next = Math.max(i - 1, 0);
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = items.length - 1;
    if (next === null) return;
    e.preventDefault();
    items[i].tabIndex = -1;
    items[next].tabIndex = 0;
    items[next].focus();
  });
}
```

### 結論

整理成幾句話：

- `focusgroup` 讓「整組一個 Tab 停留點、組內用方向鍵移動」變成一個 HTML 屬性。
- 要寫成 `focusgroup="toolbar"` 這種「類型」的寫法，只寫 `focusgroup` 沒有效果。
- 六種類型決定方向鍵、繞回和自動加上的角色；`wrap`、`nomemory`、`block` 可以再調整。
- 角色會自動加，但 `aria-selected`、`aria-checked` 這些狀態還是要自己管；我建議角色也自己寫明。
- 頁籤要用 `focusgroupstart` 讓入口落在選取中的頁籤。
- 偵測用 `"focusGroup" in HTMLElement.prototype`，不支援時退回 roving tabindex。

寫了這麼多次 roving tabindex，看到它變成一個屬性，心情有點複雜，但更多的是開心：越多無障礙的基本功由瀏覽器內建，就越少人會因為「太麻煩」而跳過它。

你的專案裡有自己寫過 roving tabindex 嗎？歡迎一起討論！

### 延伸閱讀

- [只用 CSS 做輪播，無障礙夠嗎？拿我的 UI Kit 來對照](/blog/css-carousel-a11y/)
- [Popover 的 auto、manual、hint 到底差在哪？做個可以玩的範例來看看](/blog/popover-auto-manual-hint/)
- [現代 CSS 與 HTML 技巧整理清單：102 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

### 相關連結

- [Open UI — Scoped focusgroup 提案](https://open-ui.org/components/scoped-focusgroup.explainer/ "另開新視窗"){target="_blank"}
- [WAI-ARIA APG — 在複合元件內管理焦點（roving tabindex）](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex "另開新視窗"){target="_blank"}
- [WAI-ARIA APG — Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ "另開新視窗"){target="_blank"}
- [Accesserty UI Kit（GitHub）](https://github.com/Accesserty/UI-Kit "另開新視窗"){target="_blank"}
- [Can I use（瀏覽器支援度查詢）](https://caniuse.com "另開新視窗"){target="_blank"}
