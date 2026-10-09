---
title: 讓報讀軟體開口說話：用 ariaNotify() 取代 aria-live
description: "以前要讓報讀軟體唸出「已加入購物車」，只能藏一個 aria-live 區塊再塞文字，而且常常不唸。ariaNotify() 讓你直接請報讀軟體說話。這篇從我自己網站的 aria-live 問題開始，整理寫法、元素版與語言、priority 的限制，以及不支援時退回 live region 的降級寫法。"
date: 2026-10-09
tags:
  - JavaScript
  - HTML
  - 前端開發
  - 無障礙
  - 瀏覽器支援
translationKey: aria-notify
category: frontend
draft: false
---

> 話說在前頭：`ariaNotify()` 的效果是「聲音」，畫面上看不到。文中的 API 行為我在 Chromium 上實測過，但報讀軟體實際怎麼唸、唸不唸，會因為瀏覽器和報讀軟體的組合而不同，最準的還是你自己打開報讀軟體聽一次。有講錯的地方歡迎指正。

### 前言

這篇的起因是我自己的網站。

我的[作品頁](/products)可以依角色、平台篩選和排序。當初為了讓報讀軟體使用者知道「內容變了」，我把整個作品列表包在 `aria-live="polite"` 裡。看起來很合理，但其實是個常見的反模式：條件一換，整個列表的內容都變了，報讀軟體可能會把一整排作品卡片從頭唸到尾。使用者真正需要知道的，只有一句「顯示 8 個項目」。

剛好 [CSS 與 HTML 技巧清單](/blog/css-techniques-checklist)裡的 `ariaNotify()` 就是在解決這件事，所以這次邊修自己的網站邊整理。

先看一下你的瀏覽器支援度：

::feature-support{features="aria-notify" notice="你的瀏覽器不支援 ariaNotify()，下方範例會自動退回 aria-live 的後備寫法。"}
::

### 一、以前的做法：aria-live 與它的坑

要讓報讀軟體唸出「已儲存」「找到 8 筆結果」這種狀態訊息，以前只能這樣：

```html
<div aria-live="polite" class="visually-hidden" id="status"></div>
```

```js
status.textContent = "已加入購物車";
```

這招大家都用，但也是出了名的不穩定：

| 坑 | 說明 |
|---|---|
| 區塊要先存在 | 動態插入的 live region，第一次放進去的內容常常不會被唸 |
| 不能真的藏起來 | 用 `display: none` 或 `hidden` 藏起來就失效，只能用 visually-hidden |
| 同樣的字不會重唸 | 連按兩次「加入購物車」，文字沒變，第二次可能就不唸了 |
| 被 modal 擋住 | 打開 modal 後背景是 inert，放在背景的 live region 就沒反應了 |
| 範圍太大會很吵 | 就是我網站的狀況，整個列表包起來，一更新就整段唸 |

### 二、ariaNotify() 的寫法

`ariaNotify()` 讓你直接請報讀軟體唸出一段話，不需要在頁面上放任何元素：

```js
document.ariaNotify("已儲存變更");
```

也可以從某個元素發出：

```js
saveButton.ariaNotify("已儲存變更");
```

還有一個 `priority` 選項：

```js
form.ariaNotify("付款失敗，請重新確認卡號", { priority: "high" });
```

| `priority` | 效果 | 大約對應 |
|---|---|---|
| `normal`（預設） | 等目前在唸的內容唸完再唸 | `aria-live="polite"` |
| `high` | 盡量插隊先唸 | `aria-live="assertive"` |

我在 Chromium 實測，`priority` 只接受這兩個值，寫錯會直接丟出錯誤，不會默默失敗。

### 三、動手試試

這個範例有四種情境：連續加入購物車、高優先的錯誤訊息、從 `lang="en"` 區塊發出的英文通知，以及在 modal 裡的通知。也可以勾選「強制改用 aria-live 後備」，比較兩種方式：

::aria-notify-demo
::

如果你看得到畫面，下方的通知紀錄會列出每次送出了什麼、走的是 `ariaNotify` 還是 live region。真正的效果還是要打開報讀軟體聽，Mac 按 ⌘+F5 就能開 VoiceOver。

### 四、元素版和 document 版：差在語言

這是我覺得最容易被忽略、但對雙語網站很重要的一點：

- `document.ariaNotify()`：用整頁的語言唸。
- `element.ariaNotify()`：用這個元素**最近一個祖先的 `lang`** 唸。

我的網站是中英雙語，如果在中文頁面的英文區塊裡發出英文通知，用元素版，報讀軟體才會切換成英文發音。範例裡的「Add to wishlist」按鈕外層就是 `lang="en"`。

所以我的習慣是**優先用元素版**，從觸發通知的那個按鈕或區塊發出，語言跟著內容走。

### 五、不支援的時候：降級寫法

`ariaNotify()` 從 Chrome 141、Firefox 150 開始支援；Safari 的資料我查到的互相矛盾，請以實測為準。不支援的瀏覽器還是要退回 live region，下面是我網站和範例實際在用的寫法：

```js
const REGION_ATTR = "data-announcer";

function getRegion(host, priority) {
  // modal 打開時背景是 inert，live region 要放進對話框裡才會被唸
  const container = host.closest("dialog[open]") ?? document.body;
  let region = container.querySelector(`:scope > [${REGION_ATTR}="${priority}"]`);
  if (!region) {
    region = document.createElement("div");
    region.setAttribute(REGION_ATTR, priority);
    region.setAttribute("aria-live", priority === "high" ? "assertive" : "polite");
    region.className = "visually-hidden";
    container.append(region);
  }
  return region;
}

function announce(host, message, priority = "normal") {
  if (typeof host.ariaNotify === "function") {
    host.ariaNotify(message, { priority });
    return;
  }
  const region = getRegion(host, priority);
  // 先清空再填：內容一樣時，報讀軟體才會再唸一次
  region.textContent = "";
  // 剛建立的 live region 立刻填內容常常不會被唸，等一下再填
  setTimeout(() => {
    region.textContent = message;
  }, 100);
}
```

這段後備把第一節的坑都處理了一遍：

- **區塊要先存在**：除了延遲填入，我也會在頁面載入時先呼叫一次 `getRegion()`，讓 live region 提早出現在頁面上。
- **同樣的字不會重唸**：先清空再填。
- **被 modal 擋住**：有打開的 `<dialog>` 時，live region 會放進對話框裡。
- **visually-hidden**：用 visually-hidden 而不是 `hidden`，報讀軟體才讀得到。

### 六、我網站的實際修改

回到開頭的作品頁。修改前，整個列表都是 live region：

```html
<div class="group-list" aria-live="polite">
  <!-- 所有作品卡片 -->
</div>
```

修改後，列表拿掉 `aria-live`，改成在篩選條件變更時，從篩選器發出一句通知：

```js
watch([sortorder, role, platform], async () => {
  await nextTick();
  announce(filtersEl, t("data.resultCount", count));
});
```

訊息會依數量變化：沒有結果時唸「沒有符合條件的項目」，有結果時唸「已更新，顯示 8 個項目」。報讀軟體使用者換一個條件，只會聽到一句話，而不是整排卡片。

另外，[dialog 那篇](/blog/dialog-modern-guide)的「編輯備註」範例也用了同一個 `announce()`：對話框關閉後，畫面上沒有任何「已儲存」的提示，就用它播報「已儲存備註」。

### 七、要注意的地方

- **不要拿來洗版**：`ariaNotify()` 不需要使用者互動就能發聲，很容易被濫用。只在使用者真的需要知道、畫面上又沒有其他提示的時候用。
- **`high` 不一定會插隊**：有一份 NVDA 的問題回報指出，在 Chrome 149 和 Firefox 155 實測，`high` 並沒有排到前面，而且規格也沒有強制規定順序。所以不要依賴 `high` 的排序來表達先後。
- **它不能取代焦點管理**：該移動焦點的時候還是要移，例如 dialog 打開時。`ariaNotify()` 只負責「告知」，不負責「帶路」。
- **嵌在 iframe 裡可能被擋**：`Permissions-Policy` 可以禁止 `aria-notify`，被擋下時會默默失敗。
- **瀏覽器支援，不代表報讀軟體會唸**：這點一定要實際用 VoiceOver、NVDA 測過。

### 結論

整理成幾句話：

- 狀態訊息（已儲存、已加入、找到幾筆）用 `ariaNotify()`，不用再藏 live region。
- 優先用元素版，語言會跟著 `lang` 走，雙語網站特別重要。
- `priority: "high"` 留給真的緊急的訊息，但別依賴它一定會插隊。
- 不支援的瀏覽器退回 live region，記得先清空再填、延遲填入、modal 裡要放進對話框。
- 範圍太大的 `aria-live` 會很吵，像我網站那樣整個列表包起來的寫法，可以改成一句話的通知。

做無障礙這麼久，`aria-live` 一直是我覺得最「玄」的東西，寫對了也不一定會唸，寫錯了也不一定會發現。`ariaNotify()` 讓這件事終於變得直接，但也正因為太直接，更要節制地用。

你的網站有哪些地方在用 `aria-live` 呢？歡迎一起討論！

### 延伸閱讀

- [現在的 dialog 要怎麼寫？從 showModal() 到 command、closedby 一次整理](/blog/dialog-modern-guide/)
- [收合的內容，為什麼按 Ctrl+F 找不到？聊聊 hidden="until-found"](/blog/hidden-until-found/)
- [Popover 的 auto、manual、hint 到底差在哪？做個可以玩的範例來看看](/blog/popover-auto-manual-hint/)

### 相關連結

- [MDN — Element.ariaNotify()](https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaNotify "另開新視窗"){target="_blank"}
- [MDN — Document.ariaNotify()](https://developer.mozilla.org/en-US/docs/Web/API/Document/ariaNotify "另開新視窗"){target="_blank"}
- [Microsoft Edge Blog — Creating a more accessible web with Aria Notify](https://blogs.windows.com/msedgedev/2025/05/05/creating-a-more-accessible-web-with-aria-notify/ "另開新視窗"){target="_blank"}
- [NVDA issue #20872 — priority "high" 沒有排到前面的回報](https://github.com/nvaccess/nvda/issues/20872 "另開新視窗"){target="_blank"}
- [Can I use（瀏覽器支援度查詢）](https://caniuse.com "另開新視窗"){target="_blank"}
