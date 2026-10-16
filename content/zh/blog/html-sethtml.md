---
title: "setHTML() 很安全，但它把我的 ARIA 全部清掉了"
description: "Element.setHTML() 是安全版的 innerHTML，插入 HTML 時會清掉 script 和事件屬性。但我實測發現，它的預設設定也會把所有 aria-*、role、id，連同 button、img、input、label 整個拿掉，而且不會報錯。這篇用互動範例比較預設、空設定和自訂允許清單，整理怎麼在安全和無障礙之間取得平衡。"
date: 2026-10-16
tags:
  - HTML
  - JavaScript
  - 前端開發
  - 無障礙
  - 瀏覽器支援
category: frontend
translationKey: html-sethtml
draft: false
---

> 話說在前頭：文中的行為我在 Chromium 153 上實測過，141 還不支援。其他瀏覽器的支援狀況和細節請以 caniuse、MDN 為準。有講錯的地方歡迎指正。

## 前言

`innerHTML` 一直是 XSS 的大宗來源。只要插入的內容有一點點來自使用者，就可能被塞進 `<img onerror="…">` 這種東西。以前的解法是先用 DOMPurify 這類套件清過一遍，再交給 `innerHTML`。

[CSS 與 HTML 技巧清單](/blog/css-techniques-checklist)裡的 `Element.setHTML()`，是瀏覽器內建的版本：

```js
element.setHTML(html);
```

插入的同時，瀏覽器會先把危險的東西清掉。我原本以為它只會清 `<script>` 和 `onclick` 這類東西，實測之後才發現，**它的預設設定把我的無障礙屬性也全部清掉了**。

先看一下你的瀏覽器支援度：

::feature-support{features="set-html" notice="你的瀏覽器不支援 setHTML()，下方範例無法執行，可以先看文章裡的實測結果。"}
::

## 一、預設會清掉什麼？

我把一段包含常見無障礙寫法的 HTML 丟給 `setHTML()`，不加任何設定：

| 被清掉的 | 影響 |
|---|---|
| **所有 `aria-*` 屬性和 `role`** | `aria-expanded`、`aria-live`、`aria-label`、`role="status"` 全部不見，元件的狀態和語意都沒了 |
| `id` | `<label for>`、`aria-describedby`、`aria-controls` 這些用 id 建立的關聯全部斷掉 |
| `tabindex`、`hidden`、`class`、`style`、`data-*` | 刪除 |
| **`<button>`、`<img>`、`<input>`、`<label>`、`<details>`、`<dialog>`** | **整個元素連同裡面的文字一起消失**：按鈕的文字不見，圖片連 `alt` 一起不見 |
| `<a>` 的 `target`、`rel` | 刪除，只留 `href` |

會留下來的，是比較「靜態」的結構：

- 標題 `<h1>` 到 `<h6>`、段落、清單。
- 表格，而且 `th` 的 `scope`、`td` 的 `headers`、`<caption>` 都保留。
- `<abbr title>`、`<time datetime>`、`<kbd>`、`<mark>`。
- `title`、`lang`、`dir` 這三個屬性。

我也直接讀了瀏覽器內建的預設設定：允許清單裡有 121 個元素、58 個屬性，**沒有任何 `aria-*`，也沒有 `role`、`id`、`alt`、`button`、`img`**。

最麻煩的是，這一切**不會有任何錯誤或警告**。畫面上少了按鈕或許還看得出來，但 `aria-expanded`、`aria-live` 被清掉，畫面完全一樣，只有報讀軟體使用者會發現元件壞了。

## 二、動手試試

下面可以修改輸入的 HTML，切換三種設定，看看被清掉了哪些元素和屬性：

::set-html-demo
::

範例裡的 HTML 只用來比對，不會真的插入頁面，裡面的危險連結也不會執行。

## 三、三種設定怎麼選

**1. 預設：`setHTML(html)`**

只留文字和基本結構，最保守。適合留言、論壇這類完全由使用者輸入、本來就不該有互動元件的內容。

**2. 空設定：`setHTML(html, { sanitizer: {} })`**

這是我覺得最容易被誤會的一個。傳入空的設定，結果不是「什麼都不留」，而是**「除了會執行程式的東西，其他全部保留」**：

- 會清掉：`<script>`、`onclick` 這類事件屬性、`javascript:` 連結、`<iframe>`、`<object>`、`<embed>`、SVG 裡的 `<use>`。
- 會保留：所有 `aria-*`、`role`、`id`、`<button>`、`<img>`、`<input>`、`<label>`。
- **但也會保留**：`<style>`、`<link rel="stylesheet">`、`<form>`、`<meta http-equiv="refresh">`、`data:` 連結。

所以空設定只適合**自己系統產生、內容可以信任**的 HTML，例如 CMS 裡編輯寫好的內容、自己 API 回傳的元件片段。用在使用者輸入上，雖然不會被執行程式，但對方還是可以插入樣式蓋掉畫面，或是用 `meta refresh` 把人帶到別的網站。

**3. 預設加上允許清單**

在預設的基礎上，只加你需要的：

```js
const sanitizer = new Sanitizer();
sanitizer.allowElement("button");
sanitizer.allowElement("img");
sanitizer.allowAttribute("role");
sanitizer.allowAttribute("aria-label");
sanitizer.allowAttribute("aria-expanded");
sanitizer.allowAttribute("alt");

element.setHTML(html, { sanitizer });
```

這是使用者輸入又需要保留無障礙屬性時，最穩的做法。

**要注意的坑：**

- **直接傳 `{ elements: [...], attributes: [...] }`，會「取代」預設清單，不是加上去。** 我一開始只寫了 `button`、`img`，結果 `ul`、`li`、`p` 全部不見。要在預設上增加，就用 `new Sanitizer()` 再呼叫 `allowElement()`、`allowAttribute()`。
- **SVG 圖示會留下來，但名稱不見了。** `<svg>` 本身在預設清單裡，可是 `<svg role="img" aria-label="…">` 的 `role` 和 `aria-label` 會被清掉，有意義的圖示就變成沒有名稱的圖形。用 `allowAttribute("role")`、`allowAttribute("aria-label")` 加回來就好，我實測這樣就能保留。
- **`setHTML()` 永遠不會放行危險內容。** 我把 `onclick` 也列進允許清單，它照樣被清掉。真的需要時，要改用 `setHTMLUnsafe()`，這個名字就是在提醒你後果自負。

## 四、要清楚分辨的是「誰寫的內容」

整理下來，選哪一種設定，取決於 HTML 是誰寫的：

| 內容來源 | 建議 |
|---|---|
| 完全由使用者輸入（留言、論壇） | 預設 `setHTML(html)` |
| 使用者輸入，但編輯器會產生無障礙屬性（例如自訂的 rich text 編輯器） | 預設 ＋ 允許清單，只加需要的 `aria-*` 和元素 |
| 自己系統產生、可以信任的內容 | `{ sanitizer: {} }` |

不管哪一種，**插入之後都要用無障礙樹或報讀軟體檢查一次**。清掉 ARIA 不會讓畫面改變，只看畫面是發現不了的。

另外，`Document.parseHTML()` 這個把字串解析成整份文件的新方法，也用同一套預設設定，我實測 `aria-label` 一樣會被清掉。

## 五、不支援的時候

偵測方式：

```js
if ("setHTML" in Element.prototype) {
  element.setHTML(html, { sanitizer });
} else {
  // 退回原本的做法，例如 DOMPurify
  element.innerHTML = DOMPurify.sanitize(html);
}
```

要注意 DOMPurify 的預設設定**會保留** `aria-*` 和 `role`，跟 `setHTML()` 的預設不一樣。從 DOMPurify 換成 `setHTML()` 時，如果沒注意到這個差異，原本正常的元件會在換過去之後，無聲無息地失去無障礙屬性。

## 結論

整理成幾句話：

- `setHTML()` 是安全版的 `innerHTML`，永遠會清掉會執行程式的內容。
- **預設設定會把所有 `aria-*`、`role`、`id` 清掉**，`<button>`、`<img>`、`<input>`、`<label>` 甚至整個連文字一起消失，而且沒有任何警告。
- 空設定 `{ sanitizer: {} }` 會保留所有無障礙屬性，但也會保留樣式、表單和 `meta refresh`，只適合可以信任的內容。
- 使用者輸入又需要無障礙屬性時，用 `new Sanitizer()` 再 `allowAttribute()`、`allowElement()` 逐一加上。
- 從 DOMPurify 換過來時要特別注意，兩者對 ARIA 的預設處理不一樣。

安全和無障礙不應該是二選一。只是這次瀏覽器的預設值偏向了安全那一邊，要開發者自己把無障礙補回來。

## 延伸閱讀

- [Web Component 為什麼會閃一下？用宣告式 Shadow DOM 解決](/blog/declarative-shadow-dom/)
- [外面的 label 終於找得到 Shadow DOM 裡的 input：shadowrootreferencetarget](/blog/shadow-dom-reference-target/)
- [現代 CSS 與 HTML 技巧整理清單：115 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

## 相關連結

- [MDN — Element.setHTML()](https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTML "另開新視窗"){target="_blank"}
- [MDN — HTML Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API "另開新視窗"){target="_blank"}
- [WICG — HTML Sanitizer API 規格](https://wicg.github.io/sanitizer-api/ "另開新視窗"){target="_blank"}
- [DOMPurify](https://github.com/cure53/DOMPurify "另開新視窗"){target="_blank"}
- [Can I use（瀏覽器支援度查詢）](https://caniuse.com "另開新視窗"){target="_blank"}
