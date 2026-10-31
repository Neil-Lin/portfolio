---
title: "用 <usermedia> 做視訊會議的等候室：瀏覽器幫你處理權限，但這六件事要自己做"
description: "<usermedia> 把開相機的按鈕和權限流程交給瀏覽器，使用者封鎖過也能在頁面上直接恢復，報讀軟體也能操作權限視窗。但我在 Chrome 搭配 VoiceOver 實測後發現，lang=\"zh-Hant-TW\" 會讓按鈕變成簡體、開啟後沒有任何狀態、鍵盤使用者按太快會失敗。這篇用視訊會議的等候室當範例，整理要自己補的六件事。"
date: 2026-10-31
tags:
  - HTML
  - JavaScript
  - 前端開發
  - 無障礙
  - 瀏覽器支援
category: frontend
translationKey: html-usermedia
draft: false
---

> 話說在前頭：文中的行為我在 Chromium 153 上實測過，並在 macOS 的 Chrome 搭配 VoiceOver 確認。`<usermedia>` 目前只有 Chromium 支援，規格也還在調整，細節請以 caniuse、Chrome 官方文件為準。有講錯的地方歡迎指正。

## 前言

視訊會議開始前的「等候室」大家都看過：先預覽自己的畫面，按一個「開啟攝影機和麥克風」的按鈕，瀏覽器跳出權限詢問，按允許後才進會議。

以前這顆按鈕要自己做，點下去再呼叫 `getUserMedia()`。最大的問題是：**使用者只要按過一次「封鎖」，網頁就再也沒辦法重新詢問**。之後不管怎麼按按鈕，都會直接失敗，只能請使用者自己去瀏覽器設定裡改回來。很多人根本找不到在哪裡改，最後只好放棄。

Chrome 推出的 `<usermedia>` 元素，把「按鈕」和「權限流程」都交給瀏覽器處理。我實測之後發現，它真的解決了「封鎖後救不回來」的問題，報讀軟體也能操作權限視窗。不過有幾件事瀏覽器沒有做，要開發者自己補；其中一件，台灣的網站幾乎都會踩到。

先看一下你的瀏覽器支援度：

::feature-support{features="usermedia" notice="你的瀏覽器不支援 <usermedia>，下方範例會改用一般的按鈕，可以先看文章裡的實測結果。"}
::

## 一、寫法

一共有三個元素：

| 元素 | 用途 | 成功時的事件 |
|---|---|---|
| `<usermedia>` | 同時要相機和麥克風，例如視訊會議 | `stream`，從 `element.stream` 取得 `MediaStream` |
| `<camera>` | 只要相機 | `track`，從 `element.track` 取得影像軌道 |
| `<microphone>` | 只要麥克風 | `track`，從 `element.track` 取得聲音軌道 |

```html
<usermedia id="join"></usermedia>
<video id="preview" autoplay muted playsinline></video>

<script>
  const join = document.getElementById("join");
  const preview = document.getElementById("preview");

  // 取得串流成功：把畫面接到 <video> 預覽
  join.addEventListener("stream", () => {
    preview.srcObject = join.stream;
  });
</script>
```

按鈕的文字和圖示都由瀏覽器提供，**開發者不能改**。這是刻意的設計：使用者看到的永遠是瀏覽器保證的說明，網站沒辦法用誤導的文字騙人開相機。

另外還有兩個事件要處理：

- `cancel`：使用者關閉權限視窗，或選擇「繼續不允許存取」。
- `error`：其他原因失敗，例如找不到裝置，或按鈕目前不能用（後面會說明）。原因放在 `element.error`。

如果想指定解析度、回音消除等設定，用 `setConstraints()`：

```js
join.setConstraints({
  video: { width: 1280 },
  audio: { echoCancellation: true },
});
```

## 二、瀏覽器幫你做好的

先講好消息。這幾件事，用 `<usermedia>` 就不用自己處理：

1. **鍵盤和角色：** 它是一顆真正的按鈕，可以用 Tab 移過去，Enter 和空白鍵都能啟動。報讀軟體念出「使用麥克風和攝影機，按鈕」，不用自己寫 ARIA。
2. **封鎖後可以在頁面上恢復：** 使用者先前按過「封鎖」，再按一次按鈕時，瀏覽器會在畫面中央問「你先前不允許這個網站使用攝影機和麥克風」，可以選「繼續不允許存取」或「這次允許」。選「這次允許」就直接開啟，效果會維持到關閉視窗為止，重新整理頁面不用再問；開新視窗時，瀏覽器才會再問一次。不用再請使用者到瀏覽器設定裡找，這是這個元素最大的價值。
3. **報讀軟體可以操作權限視窗：** VoiceOver 會自動移進視窗，念出「目前位於，你先前不允許這個網站使用攝影機和麥克風，視窗」，再用 Tab 選擇。關閉視窗後，焦點回到原本的按鈕。
4. **高對比模式、深色模式都正常：** Windows 的高對比模式（forced-colors）會蓋掉網站的品牌色，按鈕仍然可以用。
5. **使用者調大字級不會壞：** 字級的上限會跟著使用者的預設字級放大，使用者把瀏覽器字級調大，按鈕不會因此失效。

## 三、要自己補的六件事

### 1. `lang="zh-Hant-TW"` 會顯示簡體中文

這是台灣網站最容易踩到的。按鈕文字的語言跟著 `lang` 屬性走，元素也會繼承外層的 `lang`。我把常見的寫法都測了一次：

| `lang` | 按鈕文字 |
|---|---|
| `zh-TW` | 使用麥克風和攝影機 ✅ |
| `zh-HK` | 使用麥克風和相機 ✅ |
| `zh-Hant-TW` | 使用麦克风和摄像头 ❌ |
| `zh-Hant` | 使用麦克风和摄像头 ❌ |
| `zh-Hant-HK`、`zh-MO`、`zh` | 使用麦克风和摄像头 ❌ |

`zh-Hant-TW` 是 W3C 建議的寫法，我這個網站也是這樣寫，結果按鈕變成簡體字，報讀軟體念出來的也是簡體的內容。Chromium 目前只認得 `zh-TW` 和 `zh-HK` 這兩個完整的字串。

在元素上直接指定就好，不用改整個網站：

```html
<!-- 頁面是 zh-Hant-TW，只有這個元素改成 zh-TW，按鈕才會是繁體 -->
<usermedia lang="zh-TW"></usermedia>
```

### 2. 開啟之後，沒有任何狀態

相機開了之後，按鈕的名稱還是「使用麥克風和攝影機」，沒有「已開啟」之類的狀態。我用 VoiceOver 確認，唯一的提示在瀏覽器的視窗標題：「… - 攝影機和麥克風正在錄影和錄音 - Google Chrome」。只有焦點剛好移動、讓 VoiceOver 重念視窗時才聽得到。

看不到畫面的使用者，不一定知道相機已經開了。開啟後要自己用狀態訊息告訴使用者：

```html
<p id="status" role="status"></p>
```

```js
join.addEventListener("stream", () => {
  preview.srcObject = join.stream;
  // role="status" 的內容改變時，報讀軟體會念出來
  status.textContent = "攝影機和麥克風已開啟，其他人看得到你、聽得到你。";
});
```

另外，規格寫著 `<camera>` 和 `<microphone>` 開啟後再按一次，會變成「關閉鏡頭／靜音」的切換。但我在 Chrome 實測，連續按了好幾次，文字都沒變，`track.enabled` 一直是 `true`。**關閉鏡頭、靜音的按鈕，目前還是要自己做。**

### 3. 失敗的時候，畫面上什麼都沒有

拒絕、找不到裝置、按鈕暫時不能用，都只會觸發事件，畫面上不會有任何訊息：

| 情況 | 事件 | `error.name` |
|---|---|---|
| 關閉權限視窗，或選「繼續不允許存取」 | `cancel` | `NotAllowedError` |
| 找不到攝影機或麥克風 | `error` | `NotFoundError` |
| 按鈕暫時不能用（見第 4、5 點） | `error` | `InvalidStateError` |

有兩點要注意：

- **「選繼續不允許」和「直接關掉視窗」收到的事件和訊息完全一樣**，開發者分不出來，所以提示要能涵蓋兩種情況。
- **成功之後，`error` 屬性不會清空**，還留著上一次失敗的錯誤。所以要用「觸發的是哪個事件」判斷結果，不要看 `error` 有沒有值。

```js
join.addEventListener("cancel", () => {
  status.textContent =
    "沒有開啟攝影機和麥克風。需要時，可以再按一次「使用麥克風和攝影機」。";
});

join.addEventListener("error", () => {
  status.textContent = errorMessage(join.error);
});

function errorMessage(error) {
  if (error?.name === "NotFoundError") {
    return "找不到攝影機或麥克風，請確認裝置已經連接。";
  }
  if (error?.name === "InvalidStateError") {
    // 通常是按鈕剛出現、剛捲進畫面，等一下再按就可以
    return "按鈕還沒準備好，請稍等一秒再按一次。";
  }
  return "無法開啟攝影機和麥克風，請稍後再試。";
}
```

### 4. 鍵盤使用者按太快會失敗

為了防止網站誘騙使用者點擊，瀏覽器規定按鈕**剛出現、剛捲進畫面、位置或樣式剛改變**時，有一小段時間不能按。

一般用滑鼠的人很難遇到，但鍵盤使用者會：按 Tab 移到畫面外的按鈕時，頁面會自動捲動，按鈕就算是「剛捲進畫面」。我實測按 Tab 後 **500 毫秒內按 Enter 都會失敗**，800 毫秒後才成功。熟悉鍵盤操作的人常常一移到按鈕就馬上按，結果按鈕沒反應，也沒有任何提示。我在 macOS 的 Chrome 也重現了一樣的結果。

這個限制開發者無法關掉，只能減少發生的機會：

- 把按鈕放在頁面一打開就看得到的位置，不需要捲動。
- 不要在使用者準備按的時候才把按鈕插進頁面，或讓它因為版面變動而移位。如果一定要動態插入，像下面的範例一樣，先顯示「按鈕準備中」。
- 一定要處理 `InvalidStateError`，告訴使用者「再按一次」（上面的程式碼已經處理）。

### 5. 按鈕可能「看起來正常，按了沒反應」

瀏覽器也會檢查按鈕的樣式，不符合規定時按鈕就會失效：

| 樣式 | 結果 |
|---|---|
| 文字和背景對比低於 3:1 | 失效 |
| 字級約 13px 以下 | 失效 |
| 字級超過使用者預設字級的約 3 倍 | 失效 |
| `opacity: .5`、`transform`、`clip-path` 裁掉一半 | 仍然可以用 |
| `outline: none` | 仍然可以用 |

失效的時候，按鈕外觀完全不變，無障礙樹裡也沒有 `disabled`。報讀軟體念出「按鈕」，使用者按了卻沒反應，只有程式收到 `InvalidStateError`。這通常是開發時就該發現的錯誤，所以**上線前一定要實際按按看**。另外，把顏色改回合格之後，也要等不到一秒才能按。

更要注意的是最後一列：瀏覽器檢查了對比和字級，**卻不保護焦點框**。拿掉 `outline` 之後，鍵盤使用者就看不到焦點在哪裡（WCAG 2.4.7）。自訂樣式時要記得保留：

```css
usermedia {
  /* 文字和背景的對比至少 3:1，否則按鈕會失效 */
  color: #fff;
  background-color: #5b2fb0;
  border: none;
  border-radius: 999px;
  /* 用 rem：使用者調大字級時一起變大，也不會超過瀏覽器的上限 */
  font-size: 1rem;
}

/* 瀏覽器不會幫你保護焦點框，要自己寫 */
usermedia:focus-visible {
  outline: 3px solid #5b2fb0;
  outline-offset: 3px;
}
```

### 6. 不要用 `aria-label` 改名稱

既然按鈕文字不能改，可能會想用 `aria-label` 改成自己想要的說法。實測 `aria-label` 會直接取代無障礙名稱：

```html
<!-- 畫面上寫「使用麥克風和攝影機」，報讀軟體卻念「開啟視訊鏡頭」 -->
<usermedia aria-label="開啟視訊鏡頭"></usermedia>
```

看得到的文字和念出來的名稱不一樣，使用語音控制的人說「按使用麥克風和攝影機」會找不到按鈕，這違反 WCAG 2.5.3（名稱要包含看得到的標籤）。

想補充說明的話，用 `aria-describedby`，報讀軟體會在名稱後面念出來：

```html
<usermedia lang="zh-TW" aria-describedby="join-hint"></usermedia>
<p id="join-hint">開啟後，會議中的其他人會看到你的畫面、聽到你的聲音。</p>
```

## 四、動手試試

下面是一個視訊會議的等候室。因為按下按鈕會真的開啟你的攝影機和麥克風，所以要先勾選同意，範例才會出現；取消勾選時，會關閉相機並收起範例。

勾選後瀏覽器還是會跳出自己的權限視窗，這兩層確認是刻意的：第一層是網站告知會發生什麼事，第二層才是瀏覽器授權。

範例可以切換 `lang`，看按鈕文字從簡體變成繁體；也可以把按鈕改成對比不足的淺灰色，看看「按了沒反應」是什麼情況。範例是勾選後才建立 `<usermedia>` 的，所以一開始會顯示「按鈕準備中」，正好示範第三節第 4 點的處理方式。

::usermedia-demo
::

## 五、建議寫法：完整的等候室

```html
<section class="lobby" aria-labelledby="lobby-title">
  <h2 id="lobby-title">加入會議前，先確認你的畫面</h2>

  <!-- muted：預覽時不要播出自己的聲音，避免回音 -->
  <video id="preview" autoplay muted playsinline aria-label="你的攝影機預覽"></video>

  <!--
    lang="zh-TW"：zh-Hant-TW 會讓按鈕變簡體
    aria-describedby：補充說明，不要用 aria-label 改名稱
    裡面的 <button>：不支援的瀏覽器會顯示它，支援的瀏覽器會忽略
  -->
  <usermedia id="join" lang="zh-TW" aria-describedby="join-hint">
    <button type="button" id="join-fallback">開啟攝影機和麥克風</button>
  </usermedia>
  <p id="join-hint">開啟後，會議中的其他人會看到你的畫面、聽到你的聲音。</p>

  <!-- 開啟、失敗的結果都寫在這裡，報讀軟體會念出來 -->
  <p id="status" role="status"></p>

  <!-- 關閉鏡頭要自己做：<camera>、<usermedia> 開啟後再按不會切換 -->
  <button type="button" id="camera-toggle" hidden>關閉鏡頭</button>
</section>
```

```js
const join = document.getElementById("join");
const preview = document.getElementById("preview");
const status = document.getElementById("status");
const cameraToggle = document.getElementById("camera-toggle");

function started(stream) {
  preview.srcObject = stream;
  status.textContent = "攝影機和麥克風已開啟，其他人看得到你、聽得到你。";
  cameraToggle.hidden = false;
}

if ("HTMLUserMediaElement" in window) {
  // 支援：交給瀏覽器處理按鈕和權限
  join.addEventListener("stream", () => started(join.stream));
  join.addEventListener("cancel", () => {
    status.textContent =
      "沒有開啟攝影機和麥克風。需要時，可以再按一次「使用麥克風和攝影機」。";
  });
  join.addEventListener("error", () => {
    status.textContent = errorMessage(join.error);
  });
} else {
  // 不支援：用裡面的一般按鈕，自己呼叫 getUserMedia()
  document.getElementById("join-fallback").addEventListener("click", async () => {
    try {
      started(await navigator.mediaDevices.getUserMedia({ video: true, audio: true }));
    } catch (error) {
      status.textContent = errorMessage(error);
    }
  });
}

// 關閉／開啟鏡頭：只關影像，聲音保留
cameraToggle.addEventListener("click", () => {
  const video = preview.srcObject?.getVideoTracks()[0];
  if (!video) return;
  video.enabled = !video.enabled;
  cameraToggle.textContent = video.enabled ? "關閉鏡頭" : "開啟鏡頭";
  status.textContent = video.enabled
    ? "鏡頭已開啟。"
    : "鏡頭已關閉，其他人看不到你的畫面。";
});
```

`errorMessage()` 跟第三節第 3 點的寫法一樣。

## 六、設計師要知道的限制

`<usermedia>` 的外觀能調整的範圍有限，設計稿要配合：

- **按鈕文字不能自訂，長度也不固定：** 中文是「使用麥克風和攝影機」，英文是「Use microphone and camera」。同樣的字級下，英文版寬了約三成。按鈕的位置要預留彈性寬度。
- **圖示由瀏覽器提供**，不能換成自己的圖示。
- **文字和背景的對比至少 3:1**（瀏覽器只檢查這兩個顏色，背景圖片不算），否則按鈕會失效。
- **字級約 13px 以上**，也不能大到超過使用者預設字級的 3 倍左右。
- **同一種元素，一頁最多 3 個。** 第 4 個起會失效。多人會議室的介面如果每個人都放一顆，要改成共用一顆。
- **權限視窗由瀏覽器決定**：我在 Chrome 看到的是畫面中央的對話框，設計不能控制它的樣子和位置。

另外有一點開發者也控制不了：在 macOS 上，如果使用者沒有開啟「系統設定 → 鍵盤 → 鍵盤導覽」，**只用鍵盤時進不了權限視窗**，選不了「允許」。用 VoiceOver 時則沒有這個問題。這是瀏覽器和系統的行為，但代表權限視窗不是每個鍵盤使用者都能操作。頁面上的說明最好也提到另一條路：從網址列左邊的「網站設定」開啟權限。

## 結論

- `<usermedia>`、`<camera>`、`<microphone>` 把開相機的按鈕和權限流程交給瀏覽器，鍵盤、角色、報讀軟體操作權限視窗都已經處理好。
- 最大的改進是**封鎖後可以在頁面上直接恢復**，不用再請使用者去瀏覽器設定裡找。
- 台灣的網站要在元素上加 `lang="zh-TW"`，`zh-Hant-TW` 會讓按鈕變成簡體。
- 開啟、失敗都沒有畫面上的提示，要自己用 `role="status"` 告訴使用者；關閉鏡頭、靜音也要自己做。
- 按鈕剛出現或剛捲進畫面時不能按，鍵盤使用者容易遇到，要處理 `InvalidStateError`。
- 不要用 `aria-label` 改名稱、不要拿掉焦點框；對比至少 3:1，一頁同一種元素最多 3 個。

## 延伸閱讀

- [現在的 dialog 要怎麼寫？從 showModal() 到 command、closedby 一次整理](/blog/dialog-modern-guide/)
- [讓報讀軟體開口說話：用 ariaNotify() 取代 aria-live](/blog/aria-notify/)
- [現代 CSS 與 HTML 技巧整理清單：115 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

## 相關連結

- [Chrome for Developers — `<usermedia>` 元素介紹](https://developer.chrome.com/blog/usermedia-html-element "另開新視窗"){target="_blank"}
- [W3C — Media capture HTML elements 規格](https://w3c.github.io/mediacapture-extensions/#media-capture-html-elements "另開新視窗"){target="_blank"}
- [W3C — Media Capture Elements 說明文件](https://github.com/w3c/mediacapture-extensions/blob/main/media-capture-elements-explainer.md "另開新視窗"){target="_blank"}
- [WCAG 2.2 — 2.5.3 名稱包含標籤](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name "另開新視窗"){target="_blank"}
- [Can I use（瀏覽器支援度查詢）](https://caniuse.com "另開新視窗"){target="_blank"}
