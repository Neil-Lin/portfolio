---
title: 現在的 dialog 要怎麼寫？從 showModal() 到 command、closedby 一次整理
description: "對話框不用再自己用 div 刻了。這篇整理 2026 年寫 <dialog> 的方式：show() 和 showModal() 的差別、用 Invoker Commands 零 JavaScript 開關、closedby 決定誰能關閉、request-close 攔下未儲存的修改、form method=\"dialog\" 的回傳值，以及無障礙與動畫要注意的地方，每一段都有可以操作的範例。"
date: 2026-10-09
tags:
  - HTML
  - CSS
  - 前端開發
  - 無障礙
  - 瀏覽器支援
translationKey: dialog-modern-guide
category: frontend
draft: false
---

2026/10/09 更新：「編輯備註」範例在儲存、放棄修改後，會用 `ariaNotify()` 通知報讀軟體，說明寫在第五節。

--

> 話說在前頭：這篇的實測是在 Chromium 上做的，`closedby` 這類比較新的功能各瀏覽器支援狀況不一，寫的當下正確不代表之後也正確，有講錯的地方歡迎指正。

### 前言

寫完 [popover](/blog/popover-auto-manual-hint) 和 [hidden="until-found"](/blog/hidden-until-found) 之後，下一個想整理的就是 `<dialog>`。

對話框大概是前端最常被自己「刻」的元件之一：一個 `<div>` 蓋在畫面中間，再加一層半透明背景。看起來沒問題，但無障礙該有的東西幾乎都要自己補：焦點要移進去、Tab 不能跑到後面、按 Esc 要能關、關掉之後焦點要回到原本的按鈕、報讀軟體不能讀到背景的內容……每一項都是一段程式碼，也都是一個可能出錯的地方。

原生的 `<dialog>` 其實很早就能用了，只是這兩年又多了好幾個新東西：可以不寫 JavaScript 開關的 Invoker Commands、決定誰能關閉的 `closedby`、可以被攔下的 `request-close`。很多教學還停在「`showModal()` 加手刻關閉按鈕」的階段，所以這篇把現在的寫法一次整理起來。

先看一下你的瀏覽器支援度：

::feature-support{features="command,dialog-closedby,dialog-requestclose" notice="有項目不支援也沒關係，範例裡對應的地方會改用 JavaScript 後備，或在文中說明差異。"}
::

### 一、先分清楚：`show()` 跟 `showModal()` 差很多

`<dialog>` 有兩種打開方式，這是最多人搞混的地方：

::dialog-modal-compare
::

兩個都打開試試看，再按 Tab、點背景的按鈕，差別很明顯：

| | `show()`（非 modal） | `showModal()`（modal） |
|---|---|---|
| 背景能不能操作 | 可以 | 不行，整個背景變成 inert |
| Tab 會不會跑出去 | 會 | 不會，只在對話框和瀏覽器介面之間移動 |
| 按 Esc 關閉 | 不行 | 可以 |
| 半透明背景 `::backdrop` | 沒有 | 有 |
| 顯示在最上層（top layer） | 不是 | 是，不會被 `z-index` 或 `overflow` 蓋住 |

我在 Chromium 實測，兩種打開時焦點都會移到對話框裡第一個可以聚焦的元素；modal 關閉後，焦點會自動回到打開它的按鈕，這點在事件紀錄裡可以看到。

另外，直接在 HTML 寫 `<dialog open>` 等同 `show()`，是非 modal。**需要使用者先處理完才能繼續的情況，一律用 modal**，不要只加 `open` 屬性。

### 二、用 Invoker Commands 開關，不寫 JavaScript

以前要打開 modal，一定要寫這段：

```js
openButton.addEventListener("click", () => dialog.showModal());
```

現在用 [Invoker Commands](/blog/popover-auto-manual-hint) 就可以了，跟 popover 用的是同一套：

```html
<button commandfor="confirm" command="show-modal">刪除檔案</button>

<dialog id="confirm" aria-labelledby="confirm-title">
  <h2 id="confirm-title">確定要刪除嗎？</h2>
  <button commandfor="confirm" command="close">取消</button>
</dialog>
```

跟 dialog 有關的指令有三個：

| `command` | 效果 |
|---|---|
| `show-modal` | 用 modal 打開，等同 `showModal()` |
| `close` | 直接關閉 |
| `request-close` | 「請求」關閉：會先觸發 `cancel` 事件，可以在事件裡攔下，第四節會用到 |

要注意的是，**沒有非 modal 的 `show` 指令**，所以上面的對照範例裡，非 modal 那顆按鈕還是用了 JavaScript。

Invoker Commands 從 Chrome 135、Firefox 144、Safari 26.2 開始支援，已經是 Baseline。這篇的範例在不支援的瀏覽器裡，會用一小段 JavaScript 補上這三個指令。

### 三、`closedby`：決定誰能關掉它

以前想做「點背景就關閉」，要自己監聽點擊、判斷點的是不是對話框外面。現在用 `closedby` 屬性就可以：

::dialog-closed-by
::

| `closedby` | 點背景 | 按 Esc | 關閉按鈕 |
|---|---|---|---|
| `any` | 會關 | 會關 | 會關 |
| `closerequest` | 不會 | 會關 | 會關 |
| `none` | 不會 | 不會 | 會關 |

沒寫 `closedby` 的時候，modal 的預設行為等同 `closerequest`，非 modal 等同 `none`。

我實測時發現一個細節：`closedby="none"` 擋的是「使用者」的關閉請求，**擋不住你自己的程式**。在 `none` 的狀態下呼叫 `requestClose()` 或 `close()`，對話框一樣會關掉。

選擇上我的建議是：

- **一般的資訊、設定類對話框**：用 `any`，點背景就關最直覺。
- **有表單或重要操作的**：用預設的 `closerequest`，避免使用者不小心點到背景就關掉。
- **`none` 盡量少用**：拿掉 Esc 等於拿掉鍵盤使用者最熟悉的離開方式，真的要用時，一定要有明顯的關閉按鈕。

`closedby` 從 Chrome 134、Firefox 141 開始支援，Safari 在我寫這篇時查到的資料還沒有，請以 [caniuse](https://caniuse.com "另開新視窗"){target="_blank"} 為準。不支援的瀏覽器會忽略這個屬性，退回上面說的預設行為，不會壞掉。

### 四、`request-close`：表單還沒存，先問一下

這是我覺得最實用的新功能。使用者在對話框裡打了一堆字，手滑按到取消或 Esc，內容就全部不見了，這種事應該很多人都遇過。

::dialog-editor
::

試試看：打開後輸入一些文字，再按「取消」或 Esc。對話框不會直接關掉，而是出現「確定要放棄嗎？」。

做法是讓取消按鈕用 `request-close`，而不是 `close`：

```html
<button commandfor="editor" command="request-close">取消</button>
```

`request-close` 跟按 Esc 一樣，會先觸發 `cancel` 事件。在事件裡判斷有沒有未儲存的內容，有的話就 `preventDefault()` 攔下來：

```js
editor.addEventListener("cancel", (e) => {
  if (hasUnsavedChanges()) {
    e.preventDefault();
    showConfirm(); // 在對話框裡顯示確認訊息
  }
});
```

幾個我在範例裡特別處理的地方：

- **確認訊息直接放在對話框裡**，不用 `window.confirm()`。原生的 confirm 樣式改不了，也會打斷報讀軟體的閱讀。
- **確認訊息出現時，把焦點移過去**，報讀軟體才會唸出「還有沒儲存的修改」。
- **`close` 指令不會觸發 `cancel`**，所以「放棄修改」那顆按鈕用 `close` 就能直接關掉，不會又被攔一次。

### 五、`form method="dialog"`：把結果帶出來

範例裡的「儲存」按鈕沒有寫任何 JavaScript 來關閉對話框，靠的是 `<form method="dialog">`：

```html
<dialog id="editor">
  <form method="dialog">
    <textarea name="note"></textarea>
    <button type="submit" value="save">儲存</button>
  </form>
</dialog>
```

這種表單送出時不會發出請求，而是關閉對話框，並把按下的按鈕 `value` 放進 `dialog.returnValue`。在 `close` 事件裡讀它，就知道使用者是按了什麼關掉的：

```js
editor.addEventListener("close", () => {
  if (editor.returnValue === "save") saveNote();
});
```

表單原生的驗證（例如 `required`）也照樣有效，驗證不過就不會關閉。

不過對話框一關，畫面上就沒有任何「已儲存」的提示了。看得到畫面的人知道對話框消失代表存好了，但報讀軟體的使用者只會聽到焦點回到「編輯備註」按鈕，不確定到底有沒有存成功。

所以範例在關閉之後，會用 `ariaNotify()` 播報「已儲存備註」或「已放棄修改」，事件紀錄裡也看得到：

```js
editor.addEventListener("close", () => {
  if (editor.returnValue === "save") {
    saveNote();
    openButton.ariaNotify("已儲存備註");
  }
});
```

`ariaNotify()` 是讓報讀軟體直接唸出一段訊息的新 API，用來取代藏一個 `aria-live` 區塊的舊做法。它的用法、支援度和不支援時的降級寫法，我另外整理在〈[讓報讀軟體開口說話：用 ariaNotify() 取代 aria-live](/blog/aria-notify/)〉。

### 六、無障礙要注意的地方

原生 `<dialog>` 幫你做掉了很多事，但還有幾件要自己確認：

- **給對話框一個名稱**：用 `aria-labelledby` 指向對話框的標題，報讀軟體打開時才會唸出「這是什麼對話框」。
- **想清楚初始焦點**：預設會移到第一個可聚焦的元素。如果第一個是「刪除」這種危險按鈕，用 `autofocus` 把焦點放到比較安全的地方，例如「取消」或第一個輸入框。範例裡的備註欄就是用 `autofocus`。
- **焦點會自動回到原本的按鈕**：這是原生 modal 的好處，不用自己記住「是誰打開的」。但如果打開它的按鈕在關閉後被移除了，就要自己決定焦點要去哪裡。
- **一定要有看得到的關閉方式**：就算可以按 Esc，也不是每個人都知道。
- **不要把 modal 用在不需要打斷使用者的地方**：只是補充說明的話，popover 或頁面內的展開區塊通常更好。

### 七、樣式與進出場動畫

對話框的進出場動畫，現在可以完全用 CSS 做。這段是我網站本身在用的寫法，範例裡的對話框也是套用它：

```css
dialog {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
  transition:
    opacity 0.3s ease-out,
    transform 0.3s ease-out,
    overlay 0.3s allow-discrete,
    display 0.3s allow-discrete;

  &::backdrop {
    opacity: 0;
    background-color: rgb(0 0 0 / 50%);
    transition:
      opacity 0.3s ease-out,
      display 0.3s allow-discrete,
      overlay 0.3s allow-discrete;
  }

  &[open] {
    opacity: 1;
    transform: scale(1) translateY(0);

    @starting-style {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }

    &::backdrop {
      opacity: 1;

      @starting-style {
        opacity: 0;
      }
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  dialog,
  dialog::backdrop {
    transition: none;
  }
}
```

重點有三個：

- `@starting-style` 定義「剛出現時」的樣子，進場動畫才有起點。
- `display` 和 `overlay` 要加 `allow-discrete`，關閉時瀏覽器才會等動畫跑完再把它藏起來、移出最上層。
- **記得加減少動態偏好**。老實說，寫這篇時才發現我自己網站的 dialog 漏了最後這段，已經順手補上了。

### 八、什麼時候還是需要 JavaScript？

整理下來，宣告式的寫法已經能涵蓋大部分情況，但這幾種還是要寫程式：

- **非 modal 的對話框**：沒有對應的指令，要用 `show()`。
- **需要等待結果的流程**：例如「確認後才送出 API」，要在 `close` 事件裡讀 `returnValue` 再處理。
- **未儲存提醒**：`cancel` 事件裡的判斷要自己寫。
- **內容需要動態載入的對話框**。
- **要支援比較舊的瀏覽器**：補上 Invoker Commands 的後備。

### 結論

整理成幾句話：

- **需要使用者先處理完的，用 modal**：`command="show-modal"`，焦點、背景、Esc、焦點歸還全都有。
- **用 `closedby` 決定誰能關**：一般用 `any`，有表單用預設，`none` 少用。
- **取消按鈕用 `request-close`**，在 `cancel` 事件裡攔下未儲存的內容。
- **用 `<form method="dialog">` 帶出結果**，在 `close` 事件裡讀 `returnValue`。
- **記得名稱、初始焦點、看得到的關閉按鈕，還有減少動態偏好**。

寫完這三篇，回頭看會發現同一個方向：以前要寫一堆 JavaScript 才做得到、也很容易做錯的互動，正一個一個變成 HTML 的一個屬性。少寫的每一段程式，都是少一個出錯的機會，這對無障礙來說特別重要。

你的專案裡還有自己刻的 modal 嗎？歡迎一起討論！

### 延伸閱讀

- [讓報讀軟體開口說話：用 ariaNotify() 取代 aria-live](/blog/aria-notify/)
- [Popover 的 auto、manual、hint 到底差在哪？做個可以玩的範例來看看](/blog/popover-auto-manual-hint/)
- [收合的內容，為什麼按 Ctrl+F 找不到？聊聊 hidden="until-found"](/blog/hidden-until-found/)
- [現代 CSS 與 HTML 技巧整理清單：102 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

### 相關連結

- [MDN — `<dialog>` 對話框元素](https://developer.mozilla.org/zh-TW/docs/Web/HTML/Element/dialog "另開新視窗"){target="_blank"}
- [MDN — HTMLDialogElement.closedBy](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy "另開新視窗"){target="_blank"}
- [MDN — Invoker Commands API](https://developer.mozilla.org/zh-TW/docs/Web/API/Invoker_Commands_API "另開新視窗"){target="_blank"}
- [W3C WAI-ARIA APG — Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ "另開新視窗"){target="_blank"}
- [Can I use（瀏覽器支援度查詢）](https://caniuse.com "另開新視窗"){target="_blank"}
