# `<usermedia>` 研究紀錄與文章規劃

2026-10-31，在 Chromium 153（無頭模式、假的相機與麥克風裝置）實測，並在本機 macOS 的 Chrome + VoiceOver 確認。

文章：`content/zh|en/blog/html-usermedia.md`，範例 `app/components/content/UsermediaDemo.vue`。
本機測試頁（`public/labs/usermedia-test.html`）在文章完成後已移除，需要時可從 git 歷史（commit a3db168）取回。

## 元素概要

| 元素 | 用途 | 第二次點擊（規格） | 153 實測 |
|---|---|---|---|
| `<usermedia>` | 同時要相機和麥克風 | 不切換，只負責取得串流 | 只取得串流 |
| `<camera>` | 只要相機 | 切換關閉／開啟鏡頭 | 沒有切換，`track.enabled` 一直是 `true` |
| `<microphone>` | 只要麥克風 | 切換靜音 | 同上（待真實 Chrome 確認） |

- 事件：`stream`（`<usermedia>`）／`track`（`<camera>`、`<microphone>`）、`error`、`cancel`；屬性 `stream`／`track`、`error`；方法 `setConstraints()`。
- `HTMLGeolocationElement` 也在；`<permission>` 已不支援（`HTMLUnknownElement`）。
- 需要安全環境（https 或 localhost）。

## 實測結果

### 瀏覽器做好的

- 角色是 `button`，名稱由瀏覽器提供（例如「使用麥克風和攝影機」），可以 Tab 移到元素上，Enter、空白鍵都能啟動。
- 深色模式、高對比模式（forced-colors）都能正常使用；高對比模式會蓋掉品牌色。
- 字級上下限：下限約 13px（12px 失效、13.6px 正常）；上限約為使用者預設字級的 3 倍（預設 16px 時 48px 正常、64px 失效；預設 24px 時 72px 正常）。使用者調大預設字級不會讓元素失效，用 px 寫死的字級（14～18px）在預設字級 16～48px 下也都正常。
- 停止串流後再點，會重新取得串流。

### 要自己補的

1. **語言**：只有 `lang="zh-TW"`、`lang="zh-HK"` 顯示繁體；`zh`、`zh-Hant`、`zh-Hant-TW`、`zh-Hant-HK`、`zh-MO`、`zh-CN`、`zh-Hans` 都是簡體「使用麦克风和摄像头」。外層的 `lang` 會被繼承，本站 `<html lang="zh-Hant-TW">` 會讓按鈕變簡體。→ 在元素上加 `lang="zh-TW"`。
2. **失效時沒有任何提示**：對比低於 3:1（3.1:1 正常）或字級超出範圍時，點擊只觸發 `error`（`InvalidStateError: ... invalid style.`）。外觀不變，無障礙樹也沒有 `disabled`。
3. **開啟後沒有狀態**：串流開啟後名稱不變（仍是「使用攝影機」），沒有 `pressed` 等狀態。要自己用狀態訊息（live region）告訴使用者。
4. **`aria-label` 會蓋掉名稱**：畫面顯示瀏覽器的文字，報讀軟體念 `aria-label` 的內容 → 違反 WCAG 2.5.3。`aria-describedby` 可以正常加上補充說明。
5. **焦點框可以被拿掉**：`outline: none` 不會讓元素失效。`opacity: .5`、`transform: scale(.5)`、`clip-path` 裁掉一半也都不會失效。
6. **錯誤要自己處理**：使用者取消／拒絕 → `cancel`（`NotAllowedError: Permission dismissed`）；沒有裝置 → `error`（`NotFoundError: Requested device not found`）。
7. **後備內容**：支援的瀏覽器不顯示元素裡的內容（也不在無障礙樹裡），不支援的瀏覽器會顯示 → 可以放一般的 `<button>` 當退路。
8. **剛出現、剛捲進畫面時不能點**：元素剛加到頁面上，短時間內點擊會失敗（`being recently attached to layout tree`；實測 0.3 秒後點失敗、1.6 秒後點正常，確切門檻沒量）。用 Tab 讓畫面外的元素捲進來後，500ms 內按 Enter 會失敗（`intersection with viewport changed`），800ms 後才成功。熟練的鍵盤使用者可能遇到，而且同樣沒有任何提示。
9. **每頁數量上限**：同一種元素一頁最多 3 個，第 4 個起點擊會 `error: not registered in the browser process`。`<usermedia>`、`<camera>`、`<microphone>` 各自計算。

## 待本機（真實 Chrome）確認

- [x] 權限詢問視窗的位置、焦點是否自動移進視窗、能不能只用鍵盤完成、關閉後焦點回到哪裡。
  - 2026-10-31 本機（macOS、Chrome）：視窗出現在**畫面中央**。macOS 預設設定下，**鍵盤無法進入視窗**選「允許／不允許」；開啟「系統設定 → 鍵盤 → 鍵盤導覽」後，用 **Tab** 可以進入視窗操作。關閉視窗後焦點回到原本的按鈕。按鈕文字為繁體（頁面 `lang="zh-TW"`）。
- [x] 按「封鎖」後重新整理再點，是否出現頁面內的復原說明（這個元素最大的賣點）。
  - 2026-10-31 本機：封鎖後再點按鈕，瀏覽器會在畫面中央再問一次，每次點按鈕都會問。視窗文字：
    「你先前不允許這個網站使用攝影機和麥克風」，按鈕「**繼續不允許存取**」「**這次允許**」，右上角有關閉（×）。
  - 選「這次允許」後相機直接開啟，不用到瀏覽器設定裡改。效果維持到關閉視窗：**重新整理頁面不會再問、直接開啟；另開視窗才會再問**（本機實測）。
  - 選「繼續不允許存取」：權限維持 `denied`，觸發 `cancel`（`NotAllowedError: Permission dismissed`）。和直接關閉視窗是同一個事件、同一個訊息，開發者分不出使用者是「明確拒絕」還是「關掉視窗」。
- [x] VoiceOver／NVDA 念出的內容：角色、名稱、開啟後有沒有改變。
  - 2026-10-31 本機（macOS VoiceOver、Chrome，權限先前被封鎖）：
    - 按鈕：「使用麥克風和攝影機，按鈕」「使用攝影機，按鈕」「使用麥克風，按鈕」。
    - 按下後 **VoiceOver 自動移進權限視窗**：「目前位於，你先前不允許這個網站使用攝影機和麥克風，視窗」；`<camera>`、`<microphone>` 的視窗文字分別是「…使用攝影機」「…使用麥克風」。視窗裡 Tab 可到「繼續不允許存取，按鈕」「這次允許，按鈕」。（沒開 macOS 鍵盤導覽時，一般鍵盤使用者進不了視窗，但 VoiceOver 使用者可以。）
    - 關閉視窗後回到原本的按鈕：「目前位於，usermedia 實測頁 - Google Chrome，視窗，使用麥克風和攝影機，按鈕」。
    - 按「這次允許」後念出「Chrome，有新的，視窗」。
    - 相機開啟後，**按鈕名稱不變**（仍是「使用麥克風和攝影機，按鈕」，沒有狀態）。唯一的提示在 Chrome 視窗標題：「usermedia 實測頁 - 攝影機和麥克風正在錄影和錄音 - Google Chrome」，只有 VoiceOver 重念視窗時才聽得到。
- [x] `<camera>`、`<microphone>` 第二次點擊會不會切換。
  - 2026-10-31 本機（Chrome、VoiceOver）：允許後相機、麥克風都開啟，之後連續點擊多次，**按鈕文字仍是「使用攝影機」「使用麥克風」，`track.enabled` 一直是 `true`**，沒有切換成「關閉鏡頭／靜音」，與 sandbox 結果相同，也與規格說明不同。只開相機時，VoiceOver 念的視窗標題是「… - 攝影機正在錄影 - Google Chrome」。
  - → 文章：關閉鏡頭、靜音要自己做按鈕（例如 `aria-pressed` 的切換按鈕），不能靠 `<camera>`／`<microphone>`。
- [x] 第 8 點的時間差在真實環境是否一樣。
  - 2026-10-31 本機（Chrome）：從畫面上方按 Tab 移到畫面外的 `<usermedia>`（畫面自動捲動）後立刻按 Enter → `error: InvalidStateError: The permission element is disabled due to: intersection out of viewport or clipped, intersection with viewport changed.`，按鈕沒反應、畫面沒有任何提示。與 sandbox 結果相同。

## 文章規劃（暫定）

**標題**：用 `<usermedia>` 做視訊會議的等候室：瀏覽器幫你開相機，但台灣網站的 `lang` 會讓它說簡體中文

**範例**：視訊會議前的「等候室」——預覽畫面、`<usermedia>` 按鈕、狀態訊息（相機已開啟）、錯誤訊息。可切換 `lang`（`zh-Hant-TW`／`zh-TW`）、按鈕對比、`aria-label`／`aria-describedby`。會真的開啟讀者的相機：要說明畫面不會傳出去，並提供關閉按鈕。

**段落**：

1. 前言：自製按鈕 + `getUserMedia()`，被拒絕後救不回來。
2. 寫法：三個元素、事件、`setConstraints()`。
3. 瀏覽器做好的。
4. 要自己補的（上面 1～9），附實測數據與修正寫法。
5. 建議寫法：完整的等候室程式碼（含註解）。
6. 不支援時：元素內放一般 `<button>`。
7. 設計師要知道的限制：對比至少 3:1、字級範圍、文字不能自訂、每頁最多 3 個。

## 參考資料

- [Introducing the `<usermedia>` HTML element（Chrome for Developers）](https://developer.chrome.com/blog/usermedia-html-element)
- [Media Capture Elements 說明文件（W3C）](https://github.com/w3c/mediacapture-extensions/blob/main/media-capture-elements-explainer.md)
- [Media capture HTML elements 規格（W3C）](https://w3c.github.io/mediacapture-extensions/#media-capture-html-elements)
- [原始的 `<usermedia>` 說明文件（WICG）](https://github.com/WICG/PEPC/blob/main/usermedia_element.md)
- [Permission element 說明文件（WICG）](https://github.com/WICG/PEPC/blob/main/explainer.md)
- [Chrome Status](https://chromestatus.com/feature/5153829504024576)
