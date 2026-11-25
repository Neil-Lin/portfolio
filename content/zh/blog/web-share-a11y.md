---
title: 一顆分享按鈕取代一整排社群圖示：Web Share API 與無障礙
description: "navigator.share() 會叫出作業系統的分享選單，報讀軟體、字級、高對比都跟著系統設定走，比自己刻一排社群圖示友善。但不是每個環境都支援，按鈕本身和按下去之後發生的事，還是開發者的責任。這篇整理支援度、實測時遇到的錯誤，以及我在這個網站每一頁加上分享按鈕的做法。"
date: 2026-11-25
tags:
  - JavaScript
  - 前端開發
  - 無障礙
  - 瀏覽器支援
  - A11Y
translationKey: web-share
category: accessibility
draft: true
---

> 話說在前頭：這篇是 AI 協助整理研究與實測後，我再改寫的筆記。API 行為是在 macOS 的 Chrome 158（用 DevTools 模擬真的點擊）與 Electron（Chromium 156）實測的；真的分享選單是在 macOS 上用系統無障礙 API 讀出來的，另外在正式站用 Safari 和 iPhone 上 LINE 的 App 內瀏覽器實際分享過；**還沒有用 VoiceOver 實際聽過**，會在實測後補上。有講錯的地方歡迎指正。

## 前言

很多網站的文章下面都有一排社群圖示：Facebook、X、LINE、Email、複製連結……每一個都是只有圖示的按鈕，每一個都要另外取名稱，有些還會載入第三方的 script 或 iframe。對報讀軟體使用者來說，這是一排要一個一個聽過去的「按鈕、按鈕、按鈕」；對所有人來說，裡面常常沒有自己平常在用的那個 App。

Web Share API 換了一個思路：網頁只放**一個**按鈕，按下去叫出作業系統自己的分享選單，裡面就是使用者手機或電腦上裝的 App。

這次我沒有另外做範例，而是直接在這個網站的**每一頁**都加上分享按鈕，就在頁尾上方。讀到最後時，可以直接按按看。

先看一下你的瀏覽器支援度：

::feature-support{features="web-share" notice="你的瀏覽器不支援 Web Share API，所以頁面下方的按鈕會是「複製這一頁的連結」。這正是這篇要講的退路。"}
::

## 一、基本寫法

```js
button.addEventListener("click", async () => {
  try {
    await navigator.share({
      title: document.title,
      url: "https://example.com/article/",
    });
  } catch (err) {
    // 使用者取消，或分享失敗
  }
});
```

可以分享的欄位有 `title`、`text`、`url`、`files`，至少要有一個。另外有一個 `navigator.canShare(data)`，可以先檢查資料能不能分享。

使用條件有三個：

| 條件 | 說明 |
|---|---|
| 安全環境 | 只能在 HTTPS（或 localhost）使用 |
| 使用者操作 | 一定要在點擊這類使用者操作裡呼叫 |
| iframe | 跨來源的 iframe 要加 `allow="web-share"` |

還有兩件網頁**做不到**的事，是規格刻意的設計：

- 網頁不知道使用者有哪些 App 可以分享，也不知道最後選了哪一個（避免被拿來辨識使用者）。
- Promise 完成只代表「資料交給作業系統了」，不代表使用者真的送出。依 MDN 的說明，Windows 上分享視窗**一打開**就算完成。

## 二、支援度：比想像中破碎

Web Share 在 2023 年就成為 W3C 正式標準，手機瀏覽器也早就支援，但整理下來會發現，空白的地方都是很常見的環境：

| 環境 | 支援 |
|---|---|
| Safari（macOS / iOS） | 12.1 / 12.2 起 |
| Chrome Android | 61 起 |
| Chrome 桌機 | Windows、ChromeOS 89 起；macOS 128 起 |
| **Chrome Linux** | **不支援** |
| **Android WebView** | **不支援** |
| **Firefox 桌機** | **不支援**（只在實驗旗標後面） |
| Firefox Android | 79 起 |
| **Electron** | **沒有** `navigator.share`（我實測 Chromium 156） |

Chrome Linux 和 WebView 不是「還沒做」，而是刻意不開：Chromium 原始碼裡只在 Android、ChromeOS、Windows、Mac 打開這個功能，註解寫明不給 Linux 和 WebView。

WebView 這一項對台灣特別重要：在 Android 上從 LINE、Facebook 點開連結，用的就是 App 內的 WebView，**很可能沒有這個 API**（這是從相容性資料和原始碼推論的，Android 上的 LINE 我還沒實測；iPhone 上的 LINE 用的是 iOS 的 WebKit，實測可以分享）。

所以退路不是選配，是必要的。

## 三、實測：錯誤是怎麼回來的

我在 Chrome 158 用 DevTools 模擬真的點擊，試了各種情況：

| 情境 | 結果 |
|---|---|
| 沒有使用者操作就呼叫 `share()` | 一律 `NotAllowedError`，就算資料本身是錯的也一樣 |
| 同一次點擊呼叫兩次 `share()` | 第二次 `NotAllowedError` |
| 分享選單還開著時再呼叫 | `InvalidStateError` |
| 使用者關掉分享選單 | `AbortError` |
| `canShare({ url: "mailto:…" })` | `false`，只接受 http、https |
| `canShare()` 檢查 `.exe` 檔 | `true`，但真的 `share()` 卻被拒絕：`NotAllowedError` |

從這張表可以得到三個寫程式時要記得的事：

1. **`canShare()` 回傳 `true`，不保證 `share()` 會成功**。`share()` 之後一定要處理失敗。
2. **一次點擊只能分享一次**。使用者操作會被第一次呼叫用掉，所以 `share()` 失敗後，不能在同一個點擊裡「再試一次」。
3. **`AbortError` 不是錯誤**，是使用者改變主意。

## 四、無障礙：得到什麼

- **原生介面**：分享選單是作業系統提供的，VoiceOver、TalkBack、切換控制、系統字級、高對比都跟著使用者自己的設定走。規格的無障礙段落是寫給瀏覽器和作業系統的，要求他們把這個介面做好。
- **一個按鈕取代一排圖示**：少了一排要一個一個聽過去、名稱常常沒取好的圖示按鈕；選單裡是使用者自己熟悉的 App，認知負擔也比較小。
- **不用載入第三方程式**：隱私、效能都比較好，也少了一堆很難顧到無障礙的 iframe。

## 五、無障礙：開發者還是要負責的部分

作業系統顧好了選單，但「按鈕」和「按下去之後」還是網頁的事：

| 要做的事 | 為什麼 | WCAG |
|---|---|---|
| 用真正的 `<button>`，寫上看得到的文字 | iOS 和 Android 的分享圖示長得不一樣，只放圖示不見得每個人都認得 | 1.1.1、2.5.3、4.1.2 |
| 不要出現按了沒反應的按鈕 | 不支援的環境要給退路（複製連結），而不是一個按了沒事的按鈕 | — |
| 告知結果 | 複製連結後畫面上沒有其他變化，要讓報讀軟體也知道「已複製連結」 | 4.1.3 |
| 取消不是錯誤 | `AbortError` 時不要跳錯誤訊息 | — |
| 不要說「分享成功」 | Promise 完成不代表使用者真的送出 | — |
| 失敗要有下一步 | 同一次點擊不能再分享，要讓使用者知道還能怎麼做 | 3.3.1 |
| 分享正規網址 | 不要把 `location.href` 帶的追蹤參數、session 也分享出去 | — |

## 六、我在這個網站怎麼做

按鈕放在版型裡，每一頁同一個位置、同一個名稱（WCAG 3.2.3 一致的導覽、3.2.4 一致的識別），錯誤頁不放。

### 不支援就換成「複製連結」

頁面是預先產生的靜態 HTML，產生的當下不知道讀者的瀏覽器支不支援。所以預渲染時只放一個**同高度的空白佔位**，載入後才判斷：

- 支援 Web Share：顯示「分享這一頁」。
- 不支援：顯示「複製這一頁的連結」。

這樣不會有「先出現分享按鈕、再變成複製連結」的跳動，也不會在沒有 JavaScript 時出現一個按了沒反應的按鈕。

### 重點程式碼

這是簡化過的版本，實際元件是 Vue（`ThePageShare.vue`）：

```js
let mode = typeof navigator.share === "function"
  && navigator.canShare?.({ url: shareUrl() }) !== false
  ? "share" : "copy";

async function share() {
  try {
    await navigator.share({ title: document.title, url: shareUrl() });
    // 成功不顯示訊息：資料交給作業系統就算完成，使用者不一定真的送出了
  } catch (err) {
    // 使用者取消是正常操作
    if (err instanceof DOMException && err.name === "AbortError") return;
    // 同一次點擊不能再分享一次，改成複製連結，讓使用者再按一次
    mode = "copy";
    report("無法開啟分享選單，請改用複製連結");
  } finally {
    // 分享選單關閉後，焦點如果掉到 body，移回按鈕
    if (document.activeElement === document.body) button.focus();
  }
}

async function copy() {
  const url = shareUrl();
  try {
    await navigator.clipboard.writeText(url);
    report("已複製連結");
  } catch {
    // 連剪貼簿都不能用：把網址顯示出來，讓使用者自己複製
    report("無法自動複製，請手動複製網址：", url);
  }
}
```

`report()` 做兩件事：在按鈕下方顯示文字，並用 [ariaNotify() 那篇](/blog/aria-notify/)的 `announce()` 播報給報讀軟體。畫面上的文字本身**沒有**設 live region，不然報讀軟體會念兩次。

### 分享哪個網址

- 一般頁面：分享正規網址，和 `<link rel="canonical">` 同一個來源，網址上的 `utm_source` 這類參數會拿掉。
- 部落格列表：搜尋、分類、頁碼放在網址上本來就是為了能分享，所以保留 `q`、`category`、`page`，其他參數一樣拿掉。

### 我測過的情況

| 情境 | 結果 |
|---|---|
| 文章頁網址帶 `?utm_source=x` | 分享的網址沒有 utm |
| 部落格列表 `?category=frontend&page=2&utm_source=x` | 保留分類和頁碼，拿掉 utm |
| 使用者取消 | 不顯示任何訊息，焦點留在按鈕 |
| 分享失敗 | 按鈕變成「複製這一頁的連結」並說明原因，再按一次就複製成功 |
| 不支援 Web Share、剪貼簿也被擋（Electron） | 顯示網址讓使用者自己複製，焦點留在按鈕 |
| 320px 寬的螢幕 | 長網址會換行，不會出現橫向捲軸 |

## 七、分享選單實測

### macOS Chrome：讀無障礙 API

VoiceOver 念的內容，來自作業系統的無障礙 API（macOS 是 AX API）。所以我在 macOS 上開了一個真的 Chrome 158，按下分享按鈕叫出系統的分享選單，再直接讀 AX API 看選單裡有什麼、焦點在哪裡。這和實際聽 VoiceOver 不完全一樣，但角色、名稱、焦點這些報讀軟體依據的資訊都看得到。

#### 打開選單

- 頁面上的按鈕：角色「按鈕」，名稱「分享這一頁」。
- 用滑鼠點，或用鍵盤 Tab 到按鈕按 Enter，都能打開選單。
- 選單是一個掛在 Chrome 視窗上的彈出式項目，**焦點會自動移進選單**，停在第一個項目上。
- 頁面這邊會收到按鈕的 `focusout` 和視窗的 `blur`，但 `document.activeElement` 仍然是按鈕。

#### 選單裡有什麼

依序是：

1. 一個圖示，名稱是「safari」（明明是從 Chrome 分享的）
2. 頁面標題文字，也就是 `navigator.share()` 收到的 `title`
3. 一個最近聯絡人的建議
4. 加入閱讀列表、AirDrop、郵件、訊息、備忘錄、無邊記、日誌、提醒事項、拷貝、編輯延伸功能⋯

每個項目都是有名稱的按鈕，這就是交給作業系統的好處：我一行程式都沒寫，裡面的每個按鈕都有名稱，連「拷貝」都有。

但也有兩個小地方：選單本身和外層的群組**沒有名稱**，報讀軟體可能不會先說「分享」，而是直接念第一個項目；圖示的名稱也是錯的。這兩點要實際用 VoiceOver 聽過才知道影響多大，而且都是瀏覽器和作業系統的事，網頁改不了。

#### 鍵盤操作

| 按鍵 | 結果 |
|---|---|
| Tab / Shift+Tab | 在項目之間前後移動 |
| ↓ | 移到下一排的項目 |
| → | 沒有移動 |
| Esc | 關閉選單 |

#### 關閉之後

- 按 Esc 關閉後，**系統焦點回到「分享這一頁」按鈕**，`share()` 收到 `AbortError: Share canceled`，頁面沒有顯示任何訊息，跟預期一樣。
- 選了選單裡的項目後，`share()` 才 resolve（大約在打開選單 10 秒後，也就是選下去的時候），不是一打開就 resolve。MDN 說 Windows 是一打開就 resolve，所以不同平台的時間點不一樣，「不要說分享成功」這條規則還是成立。
- 在這個組合裡，`document.activeElement` 從頭到尾都是按鈕，所以第六節的「焦點掉到 body 就移回按鈕」沒有派上用場。我還是留著它，當作其他平台的保險。

### 正式站：Safari 與 LINE

按鈕上線後，我在正式站實際用了一次：

- 用 Safari，和在 iPhone 上從 LINE 點開連結的 App 內瀏覽器，都能叫出分享選單，也真的分享出去了。
- 用帶 `Sec-Fetch-Dest: document` 標頭的 curl 檢查正式站，Cloudflare 沒有加上會擋掉分享的 `Permissions-Policy: web-share=()`。

### Mac 的分享選單裡，為什麼沒有 LINE？

實測時我發現一件事：我的 Mac 明明有裝 LINE，分享選單裡卻沒有 LINE。

查了系統登記的分享延伸功能（`pluginkit -m -p com.apple.share-services`）才知道：LINE for Mac 有提供分享延伸功能，但**預設沒有啟用**。macOS 預設只打開系統內建的項目，第三方 App 要自己打開：

- 在分享選單最下面按「編輯延伸功能⋯」，勾選 LINE。
- 或是到「系統設定 → 一般 → 登入項目與延伸功能 → 分享」勾選。

打開之後，LINE 就出現在選單裡，可以直接分享。

這件事剛好說明了 Web Share 的本質：**選單裡有哪些 App，由使用者的系統和設定決定，網頁不能控制，也不會知道。**

- 好處是選單裡只會有使用者真的有在用、自己選擇打開的 App。
- 代價是不習慣。習慣在網頁上看到 LINE 圖示的人，第一次在選單裡找不到 LINE，可能以為「不能分享到 LINE」。我自己就是這樣。

所以介面上不要寫「分享到 LINE」這種網頁保證不了的文字。另外，選單裡一定有「拷貝」，找不到想要的 App 時，至少還能複製連結。

<!-- TODO(實測後補上)：實際用 VoiceOver 聽（macOS Chrome、Safari、iOS Safari）、Android Chrome + TalkBack；Android 上 LINE App 內瀏覽器顯示哪一種按鈕。 -->

### 還沒測的

- 實際打開 VoiceOver 聽：選單沒有名稱時，開啟的那一刻念了什麼。
- Android Chrome 搭配 TalkBack。
- Android 上 LINE 的 App 內瀏覽器。iPhone 上已確認可以分享；依相容性資料推論，Android 的 WebView 沒有這個 API，應該會顯示「複製這一頁的連結」。

## 結論

- Web Share 把分享選單交給作業系統，無障礙支援跟著系統走，一個按鈕就能取代一整排社群圖示。
- 支援度有很多空白：Firefox 桌機、Chrome Linux、Android WebView（包括 App 內瀏覽器）都沒有，一定要準備退路。
- `canShare()` 不保證成功、一次點擊只能分享一次、`AbortError` 不是錯誤。
- 按鈕要有看得到的文字、結果要告知、不要說「分享成功」、失敗要給下一步。
- 選單裡有哪些 App 是使用者的事：Mac 上的 LINE 要自己到設定裡打開，網頁不能保證「分享到 LINE」。

捲到頁面下方，按按看「分享這一頁」，或是在不支援的瀏覽器裡看看它變成什麼。你的網站還在用一整排社群圖示嗎？歡迎一起討論！

## 延伸閱讀

- [讓報讀軟體開口說話：用 ariaNotify() 取代 aria-live](/blog/aria-notify/)
- [現在的 dialog 要怎麼寫？從 showModal() 到 command、closedby 一次整理](/blog/dialog-modern-guide/)

## 相關連結

- [W3C — Web Share API](https://www.w3.org/TR/web-share/ "另開新視窗"){target="_blank"}
- [MDN — Navigator.share()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share "另開新視窗"){target="_blank"}
- [MDN — Navigator.canShare()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare "另開新視窗"){target="_blank"}
- [web.dev — Integrate with the OS sharing UI with the Web Share API](https://web.dev/articles/web-share "另開新視窗"){target="_blank"}
- [Can I use — Web Share API](https://caniuse.com/web-share "另開新視窗"){target="_blank"}
- [Chromium 原始碼 — chrome_content_renderer_client.cc](https://chromium.googlesource.com/chromium/src/+/main/chrome/renderer/chrome_content_renderer_client.cc "另開新視窗"){target="_blank"}
