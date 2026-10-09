---
title: '收合的內容，為什麼按 Ctrl+F 找不到？聊聊 hidden="until-found"'
description: "FAQ、手風琴這類收合起來的內容，用 hidden 藏起來就搜尋不到。hidden=\"until-found\" 讓內容藏著也能被頁內搜尋與深層連結找到，找到時自動展開。這篇用可以直接操作的範例比較四種收合方式，也整理了實測時踩到的兩個坑。"
date: 2026-10-09
tags:
  - HTML
  - CSS
  - 前端開發
  - 無障礙
  - 瀏覽器支援
translationKey: hidden-until-found
draft: false
---

> 話說在前頭：這篇是我練習 `hidden="until-found"` 的筆記，文中的實測是在 Chromium 上做的，其他瀏覽器的支援狀況變動很快，有講錯的地方歡迎指正。

### 前言

在我的[現代 CSS 與 HTML 技巧整理清單](/blog/css-techniques-checklist)裡，`hidden="until-found"` 也是一格還沒打勾的。上一篇寫 [popover 的 auto、manual、hint](/blog/popover-auto-manual-hint) 時提到它，說它「降級比較安全」，這次就來好好驗證一下。

先講它要解決的問題。網站上收合起來的內容到處都是：常見問答、手風琴、長文裡的「展開更多」。使用者想找某個資訊時，很自然會按 Ctrl+F（Mac 是 ⌘+F）搜尋，結果瀏覽器告訴他「找不到」。

但內容明明就在頁面上，只是被收合了。對使用者來說，搜尋不到就等於這個資訊不存在。

先看一下你的瀏覽器支援度，後面的範例會用到：

::feature-support{features="until-found" notice="你的瀏覽器不支援 until-found，下方範例裡的 until-found 區塊會退回成一般的 hidden，搜尋找不到是正常的。"}
::

### 先動手：四種收合方式，哪個搜得到？

這次一樣先玩再說。下面四個區塊用四種不同的方式收合，每個區塊上方都標了一個要搜尋的關鍵字（關鍵字只藏在各自的區塊裡）。請按 Ctrl+F 一個一個搜尋看看：

::until-found-compare
::

預期你會看到：

| 收合方式 | 搜得到嗎 | 搜到之後 |
|---|---|---|
| `hidden` | 找不到 | — |
| `height: 0; overflow: hidden` | 找得到 | 瀏覽器說有一筆，但畫面上什麼都看不到，使用者會更困惑 |
| `hidden="until-found"` | 找得到 | **自動展開**，並捲到那段文字 |
| `until-found` ＋ 常見的 reset | 找不到 | reset 把它打回原形了，後面會講 |

如果你看到的結果不一樣，很可能是瀏覽器支援度的差異，也歡迎告訴我。

### 它是怎麼運作的？

寫法很單純，把 `hidden` 的值改成 `until-found` 就好：

```html
<div hidden="until-found">
  收合起來，但搜得到的內容
</div>
```

背後的機制是這樣：

1. 瀏覽器不是用 `display: none` 藏它，而是用 `content-visibility: hidden`。內容不顯示，但文字仍然參與頁內搜尋。
2. 搜尋命中、或是網址的 `#id` 指向裡面的元素時，瀏覽器會先觸發一個 **`beforematch` 事件**，接著**自己移除 `hidden` 屬性**，再捲到那個位置。
3. 收合中的內容不在無障礙樹裡，裡面的按鈕也 Tab 不到。我在 Chromium 實測過，這點跟一般的 `hidden` 一樣，不用擔心報讀軟體唸到看不見的東西。

也就是說，它只負責「被找到時展開」。使用者自己點按鈕展開、收合，還是要你寫。

### 常見問答範例：事件、深層連結與 aria-expanded

下面是一個用 `until-found` 做的常見問答。每個答案收合時都是 `hidden="until-found"`，事件紀錄會列出 `beforematch` 什麼時候觸發：

::until-found-faq
::

可以這樣玩：

1. 按 Ctrl+F 搜尋「免運費」。文章這裡也有這個詞，多按一次 Enter 跳到下一筆，第 3 題就會自己展開。
2. 按「全部收合」，再點範例裡的深層連結，一樣會展開並捲過去。這代表 FAQ 可以把單一問題的網址分享出去，對方打開就直接看到答案。
3. 取消勾選「同步 aria-expanded」，再搜尋一次。

第 3 步就是這次最想提醒的無障礙問題：**瀏覽器只會移除 `hidden`，不會幫你改按鈕的 `aria-expanded`**。內容已經展開了，按鈕卻還說自己是 `false`，報讀軟體的使用者聽到的就是錯的狀態。

所以一定要監聽 `beforematch`，把狀態同步回來：

```js
panel.addEventListener("beforematch", () => {
  button.setAttribute("aria-expanded", "true");
});
```

### 坑一：`el.hidden = !el.hidden` 會悄悄把它變回一般的 hidden

這個坑是我寫範例時實測出來的。很多人切換顯示的寫法是這樣：

```js
button.addEventListener("click", () => {
  panel.hidden = !panel.hidden;
});
```

問題在於，收合時 `panel.hidden` 讀出來是**字串 `"until-found"`**，不是 `true`。整個流程會變成：

1. 一開始是 `hidden="until-found"`，`!panel.hidden` 是 `false`，所以展開，沒問題。
2. 再按一次收合，`!panel.hidden` 是 `true`，屬性變成 `hidden=""`，**也就是一般的 hidden**。

點開再收合一次之後，這段內容就再也搜不到了，而且畫面上完全看不出差別。比較安全的寫法是用自己的狀態決定，收合時明確寫回 `until-found`：

```js
let open = false;

button.addEventListener("click", () => {
  open = !open;
  button.setAttribute("aria-expanded", String(open));
  if (open) {
    panel.removeAttribute("hidden");
  } else {
    panel.setAttribute("hidden", "until-found");
  }
});
```

### 坑二：CSS reset 裡的 `[hidden]` 會讓它失效

很多 CSS reset 或專案裡都有這一行，為了確保 `hidden` 一定藏得住：

```css
[hidden] {
  display: none !important;
}
```

但 `hidden="until-found"` 也符合 `[hidden]` 這個選擇器，於是被強制套上 `display: none`。沒有被渲染的內容，頁內搜尋就找不到了，也就是上面對照範例的最後一個區塊。

有趣的是，我實測發現 `#id` 的深層連結在這種情況下還是會展開，所以只測連結很容易以為沒問題。修正方式是把 `until-found` 排除掉：

```css
[hidden]:not([hidden="until-found" i]) {
  display: none !important;
}
```

順帶兩個小細節：

- **收合時盒子還在**：`content-visibility: hidden` 只是不畫內容，元素本身的 padding、邊框、背景都還在。面板如果有 padding，收合時記得拿掉，不然會留下一條空框。
- **Web Component 要注意 Shadow DOM**：`beforematch` 會冒泡，但不會穿出 Shadow DOM，監聽器要掛在 shadow root 裡面的元素上。

### 不支援的時候會怎樣？

這次的降級是安全的。不認得 `until-found` 的瀏覽器會把它當成一般的 `hidden`：內容一樣藏著，只是搜尋不到，什麼都不會壞。跟 `popover="hint"` 不支援時退化成 `manual`、連關都關不掉相比，可以放心地當成漸進增強來用。

偵測方式：

```js
const supportsUntilFound = "onbeforematch" in HTMLElement.prototype;
```

`until-found` 在 Chromium 系瀏覽器很早就支援了，Firefox 和 Safari 的狀況變動比較快，上線前請以 [caniuse](https://caniuse.com "另開新視窗"){target="_blank"} 為準。

### 那 `<details>` 呢？

如果只是單純的展開收合，原生的 `<details>` 其實也會在頁內搜尋命中時自動展開（Chromium 系瀏覽器支援），而且連按鈕和狀態都不用自己做。

我的選擇方式是：

- **單純的「展開更多」**：先考慮 `<details>`，最省事。
- **需要標題階層、自訂結構的手風琴**（例如標題包按鈕、控制 `aria-controls` 的寫法），或是不方便改成 `<details>` 的既有元件：用 `hidden="until-found"`。

### 結論

整理成幾句話：

- 收合不等於消失。用 `hidden` 藏起來的內容，對搜尋來說就是不存在。
- `hidden="until-found"` 讓內容藏著也找得到，找到時自動展開，深層連結也適用。
- 記得監聽 `beforematch` 同步 `aria-expanded`，切換時別用 `el.hidden = !el.hidden`，也檢查一下 CSS reset 有沒有把它蓋掉。
- 不支援時會退回一般的 `hidden`，降級安全，可以放心用。

這個屬性解決的，是使用者「明明知道有、卻找不到」的那種挫折感。做無障礙久了會發現，很多問題不是功能做不到，而是資訊被藏到使用者碰不到的地方，這就是一個很好的例子。

清單上又可以多打一個勾了。你的網站裡有多少收合起來的內容呢？歡迎一起討論！

### 延伸閱讀

- [Popover 的 auto、manual、hint 到底差在哪？做個可以玩的範例來看看](/blog/popover-auto-manual-hint/)
- [現代 CSS 與 HTML 技巧整理清單：102 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

### 相關連結

- [MDN — hidden 全域屬性](https://developer.mozilla.org/zh-TW/docs/Web/HTML/Global_attributes/hidden "另開新視窗"){target="_blank"}
- [MDN — beforematch 事件](https://developer.mozilla.org/en-US/docs/Web/API/Element/beforematch_event "另開新視窗"){target="_blank"}
- [Can I use（瀏覽器支援度查詢）](https://caniuse.com "另開新視窗"){target="_blank"}
