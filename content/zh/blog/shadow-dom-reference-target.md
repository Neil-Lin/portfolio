---
title: 外面的 label 終於找得到 Shadow DOM 裡的 input：shadowrootreferencetarget
description: "Web Component 長年的無障礙難題：外面的 <label for>、aria-labelledby、aria-describedby 都指不到 Shadow DOM 裡的元素。shadowrootreferencetarget 讓元件指定「別人指向我的時候，其實是指向裡面的誰」。這篇用互動範例實測它能做什麼、做不到什麼、測試工具會誤報的地方，也拿我自己的 UI Kit 來看看可以怎麼用。"
date: 2026-10-14
tags:
  - HTML
  - Web Components
  - 前端開發
  - 無障礙
  - 瀏覽器支援
category: frontend
translationKey: shadow-dom-reference-target
draft: false
---

> 話說在前頭：文中的行為我在 Chromium 153 上實測過，141 還不支援。依照 Chrome 152 的版本資訊，這個功能是在 152 正式推出的；Firefox 和 Safari 的狀況我寫這篇時沒辦法確認，上線前請以 caniuse 為準。有講錯的地方歡迎指正。

## 前言

用 Shadow DOM 做表單元件的人，應該都遇過這個問題：

```html
<label for="email">電子郵件</label>
<my-input id="email"></my-input>
```

`<my-input>` 的 Shadow DOM 裡有一個真正的 `<input>`。看起來 label 有指向元件，但報讀軟體聽到的 input **沒有名稱**，點 label 焦點也不會進到 input 裡。

原因是 **id 不會穿過 Shadow DOM 的邊界**。`for="email"` 找到的是外面的 `<my-input>`，它不是表單元件，label 不知道要把名稱交給誰；而 Shadow DOM 裡的 input，外面的 id 也指不到。`aria-labelledby`、`aria-describedby` 這些用 id 互相參照的屬性，全都有一樣的問題。

[CSS 與 HTML 技巧清單](/blog/css-techniques-checklist)裡的 `shadowrootreferencetarget`，就是在解決這件事。

先看一下你的瀏覽器支援度：

::feature-support{features="reference-target" notice="你的瀏覽器不支援 reference target，下方範例左右兩邊的結果會一樣。"}
::

## 一、以前的解法

在 reference target 出現之前，常見的做法有三種，各有代價：

| 做法 | 代價 |
|---|---|
| 把 label 也放進元件裡（例如用屬性傳文字進去） | 版面和文字都被元件綁住，外面不能自由排版 |
| 用 JavaScript 把外面的文字複製成內部 input 的 `aria-label` | 外面的文字改了要記得同步，而且只有名稱，沒有點 label 會 focus 的行為 |
| 讓外框元件自己扮演 input（加 `role`、`tabindex`） | 鍵盤、輸入、表單行為全部要自己補，很容易漏 |

## 二、寫法：告訴瀏覽器「指向我，其實是指向裡面的誰」

在 Shadow root 上指定一個內部元素的 id，外面用 id 指向這個元件時，瀏覽器就會改成指向那個元素。

宣告式的寫法，加在 `<template>` 上：

```html
<label for="email">電子郵件</label>
<my-input id="email">
  <template shadowrootmode="open" shadowrootreferencetarget="inp">
    <input id="inp" type="email">
  </template>
</my-input>
```

`<template shadowrootmode>` 的寫法在[宣告式 Shadow DOM 那篇](/blog/declarative-shadow-dom/)有介紹過。

用 JavaScript 建立 Shadow DOM 時，寫在 `attachShadow()` 裡，之後也可以改：

```js
const root = this.attachShadow({ mode: "open", referenceTarget: "inp" });
root.referenceTarget = "inp";
```

## 三、動手試試

下面兩邊都是外面的 `<label for>` 指向一個 Shadow DOM 元件，差別只在右邊有設定 reference target。點「電子郵件」看看焦點會不會進到 input：

::reference-target-demo{kind="label"}
::

> 提醒：左邊範例裡的 input 是刻意沒有名稱的，用來示範這個問題。用報讀軟體閱讀這篇時，會聽到一個沒有名稱的編輯欄位，直接略過就好；用 axe 這類工具檢查這一頁，也會回報它。

我在 Chromium 153 的無障礙樹裡看到的結果：

- **左邊**：input 沒有名稱，點 label 焦點也不會動。
- **右邊**：input 的名稱是「電子郵件」，點 label 會 focus 到 input，就像一般的 `<label>` 和 `<input>` 一樣。

## 四、不只 label

所有「用 id 指向別人」的屬性，指到設定了 reference target 的元件時，都會轉給裡面的元素。我實測過的：

| 外面的屬性 | 結果 |
|---|---|
| `<label for>` | 名稱接上，點 label 會 focus |
| `aria-labelledby`、`aria-describedby` | 可以用元件裡的文字當名稱或說明 |
| `commandfor`、`popovertarget` | 按鈕可以打開元件裡的 `<dialog>`、popover |
| `aria-controls`、`aria-activedescendant` | 可以指到元件裡的元素 |
| 元件裡再包元件 | 外層指向內層元件、內層再指向 input，會一路傳到最裡面 |

例如一個專門顯示提示訊息的元件，外面的 input 用 `aria-describedby` 指向它，報讀軟體就會唸出元件裡那段提示：

```html
<input aria-label="手機號碼" aria-describedby="phone-hint">
<form-hint id="phone-hint">
  <template shadowrootmode="open" shadowrootreferencetarget="msg">
    <p id="msg">格式：0912-345-678</p>
  </template>
</form-hint>
```

我實測這個 input 的說明就是「格式：0912-345-678」。

按鈕打開元件裡的 dialog 也一樣，[dialog 那篇](/blog/dialog-modern-guide/)介紹的 `commandfor` 可以直接指向元件：

```html
<button commandfor="settings" command="show-modal">設定</button>
<settings-panel id="settings">
  <template shadowrootmode="open" shadowrootreferencetarget="dlg">
    <dialog id="dlg">…</dialog>
  </template>
</settings-panel>
```

## 五、做不到的事

實測時也發現幾件它不管的事：

| 情況 | 結果 |
|---|---|
| **反方向**：元件裡的 input 寫 `aria-describedby="外面的 id"` | 沒有作用。reference target 只處理「外面指進來」 |
| 寫在元件外框上的 `aria-label` | 不會轉給裡面，只有用 id 參照的屬性會轉 |
| 指定的 id 在元件裡不存在 | 默默失效，不會有任何錯誤訊息 |
| 一個元件只能指定一個目標 | 想讓 `aria-activedescendant` 在選項之間移動，就得一直改 `referenceTarget`，不太實際 |
| 表單送出 | 元件裡的 input 不會跟著外面的 `<form>` 送出，還是要用 form-associated custom element（ElementInternals） |
| `label.control` | 回傳的是元件外框，不是裡面的 input |

反方向的需求，要改用 ARIA 的元素參照屬性，直接把外面的元素交給裡面的 input。我實測這樣可以接上：

```js
input.ariaDescribedByElements = [document.getElementById("outside-hint")];
```

## 六、測試工具會誤報

我用 axe-core 4.10.2 檢查第三節右邊那種寫法，它會回報「表單元素沒有標籤」。但實際的無障礙樹裡，input 的名稱是對的。

所以用了 reference target 的元件，**不能只看自動化工具的結果**。要用開發者工具的無障礙面板，或直接開報讀軟體確認。新版的測試工具之後可能會支援，到時候再重測。

## 七、實際例子：我的 UI Kit

我的 [Accesserty UI Kit](https://github.com/Accesserty/UI-Kit "另開新視窗"){target="_blank"} 是用 Shadow DOM 做的 Web Components，剛好可以拿來看看這個功能能幫上什麼。

以 2.0.8 版的 `<au-input>` 為例，為了讓外面的 label 和說明接得上，它現在做了不少事：

- 用 MutationObserver 監看整頁，外面的 `aria-labelledby`、`aria-describedby` 有變動就重新同步。
- 支援 `ariaLabelledByElements` 的瀏覽器，把外面的元素直接交給裡面的 input；不支援的，把文字複製成 `aria-label`。說明則是複製到 Shadow DOM 裡一個隱藏的元素。
- 外面的 `<label for>`，透過 form-associated custom element 的 `internals.labels` 取得。

我在 Chromium 153 實測，名稱、說明、表單送出都正常。但有一個小缺口：**點外面的 `<label>`，焦點不會進到 input 裡**。滑鼠使用者習慣點 label 來聚焦欄位，這個行為少了。

下面是真的 `<au-input>`。勾選後，範例會在這個元件上設定 `referenceTarget`，模擬加上這個功能的效果（UI Kit 本身沒有改）：

::reference-target-demo{kind="kit"}
::

加上 reference target 之後：

- **可以解決的**：點 label 會 focus 到 input；label 和說明不用再靠 JavaScript 同步，瀏覽器原生就會接上。
- **還是要保留的**：`list` 屬性指向外面的 `<datalist>`，是「從裡面指到外面」，reference target 管不到，還是要複製；表單送出還是要靠 ElementInternals；不支援的瀏覽器還很多，現有的同步程式要留著當備案。

所以短期內不是「刪掉一堆程式」，而是**支援的瀏覽器走原生，不支援的走原本的路**。

## 八、不支援的時候怎麼辦？

偵測方式：

```js
const supported = "referenceTarget" in ShadowRoot.prototype;
```

不支援的瀏覽器，`shadowrootreferencetarget` 屬性會被忽略，結果就跟沒寫一樣，不會壞掉，只是 label 接不上。所以可以先寫上，再用偵測決定要不要執行原本的同步程式：

```js
if (!("referenceTarget" in ShadowRoot.prototype)) {
  // 原本的做法：把外面的文字複製成內部 input 的 aria-label
  syncLabelFallback();
}
```

## 結論

整理成幾句話：

- id 不會穿過 Shadow DOM 的邊界，所以外面的 `<label for>`、`aria-*` 指不到元件裡的元素。
- `shadowrootreferencetarget`（或 `attachShadow` 的 `referenceTarget`）讓元件指定「指向我，其實是指向裡面的誰」。
- 它適用所有用 id 參照的屬性：`for`、`aria-labelledby`、`aria-describedby`、`commandfor`、`popovertarget` 等。
- 它只管「外面指進來」；反方向要用 `ariaDescribedByElements` 這類屬性，表單送出還是要靠 ElementInternals。
- 自動化測試工具可能誤報，要用無障礙樹或報讀軟體確認。

這是 Web Components 無障礙最大的一塊缺口，終於有原生的解法了。你的元件裡，有多少程式是在幫 label 和 ARIA 搬文字？

## 延伸閱讀

- [Web Component 為什麼會閃一下？用宣告式 Shadow DOM 解決](/blog/declarative-shadow-dom/)
- [現在的 dialog 要怎麼寫？從 showModal() 到 command、closedby 一次整理](/blog/dialog-modern-guide/)
- [現代 CSS 與 HTML 技巧整理清單：115 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

## 相關連結

- [MDN — ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot "另開新視窗"){target="_blank"}
- [Chrome 152 版本資訊](https://developer.chrome.com/release-notes/152 "另開新視窗"){target="_blank"}
- [Eric Meyer — Targeting by Reference in the Shadow DOM](https://meyerweb.com/eric/thoughts/2025/12/19/targeting-by-reference-in-the-shadow-dom/ "另開新視窗"){target="_blank"}
- [Nolan Lawson — Shadow DOM and accessibility: the trouble with ARIA](https://nolanlawson.com/2022/11/28/shadow-dom-and-accessibility-the-trouble-with-aria/ "另開新視窗"){target="_blank"}
- [Can I use（瀏覽器支援度查詢）](https://caniuse.com "另開新視窗"){target="_blank"}
