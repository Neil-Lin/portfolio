# Web Share API 研究紀錄與文章規劃

2026-11-25 整理。實測環境：本機 macOS 的 Google Chrome 158（headless，透過 DevTools protocol 模擬真的點擊）、Claude 桌面 App 內建瀏覽器（Electron，Chromium 156）。

文章：`content/zh|en/blog/web-share-a11y.md`（`translationKey: web-share`，草稿）。
範例：不另做範例元件，直接用全站的分享按鈕 `app/components/ThePageShare.vue`（放在 `app/layouts/default.vue`，每一頁頁尾上方）。

## 來源

- W3C Web Share API（Recommendation，2023-05-30），含「Accessibility considerations」一節：<https://www.w3.org/TR/web-share/>
- MDN：`Navigator.share()`、`Navigator.canShare()`，以及 browser-compat-data
- web.dev：Integrate with the OS sharing UI with the Web Share API
- Can I use：web-share
- Chromium 原始碼 `chrome/renderer/chrome_content_renderer_client.cc`：只在 Android、ChromeOS、Windows、Mac 開啟 WebShare，註解寫明刻意不給 Linux 與 WebView

## API 概要

- `navigator.share({ title, text, url, files })` 回傳 Promise；`navigator.canShare(data)` 回傳布林值。
- 條件：安全環境（HTTPS 或 localhost）、暫時性使用者啟用（transient activation，例如 click）、Permissions Policy `web-share`（預設 `'self'`，跨來源 iframe 要 `allow="web-share"`）。
- 網頁不知道有哪些分享目標、使用者選了哪一個（規格刻意避免 fingerprinting）。
- Promise 是 fire and forget：資料交給作業系統就 resolve。MDN：Windows 在分享視窗打開時就 resolve。
- `AbortError`：使用者取消，或沒有可用的分享目標。

## 支援度（MDN BCD，並用原始碼確認）

| 環境 | 支援 |
|---|---|
| Safari macOS / iOS | 12.1 / 12.2 |
| Chrome Android | 61 |
| Chrome 桌機 | 89 起 Windows、ChromeOS（部分）；128 起完整（含 macOS） |
| Chrome Linux | 不支援（原始碼刻意不開） |
| Android WebView | 不支援 → Android 上 LINE、Facebook 等 App 內瀏覽器推測沒有（未實測） |
| Firefox 桌機 | 只在旗標後 |
| Firefox Android | 79 |
| Electron（Chromium 156） | 沒有 `navigator.share`（實測），因為是在 Chrome 的 `chrome/` 層開啟 |

## 實測：API 行為（Chrome 158，macOS，headless）

| 情境 | 結果 |
|---|---|
| 沒有使用者啟用就呼叫 `share()` | 一律 `NotAllowedError`，連 `{}`、`file:` 網址都不會先丟 TypeError |
| 同一次點擊呼叫兩次 `share()` | 第二次 `NotAllowedError`（啟用已被第一次用掉） |
| 分享還沒結束時再呼叫 | `InvalidStateError` |
| 有啟用、傳 `{}` 或只有未知欄位 | `TypeError` |
| 有啟用、`url: "file:///…"` | `TypeError: Invalid URL` |
| `canShare({ url: "mailto:…" })`、`tel:` | `false` |
| `canShare({ files: [.exe] })`、`.html` | `true`，但 `share()` 分享 `.exe` 被拒絕：`NotAllowedError: Permission denied` |

→ `canShare()` 不能保證 `share()` 會成功；`share()` 失敗後，同一次點擊裡不能再分享一次。

## 實測：本站分享按鈕

Chrome 158 headless 把 `navigator.share` 換成記錄參數的假函式（headless 沒有真的分享選單），內建瀏覽器則是真實環境。

| 情境 | 結果 |
|---|---|
| 文章頁，網址帶 `?utm_source=x` | 顯示「分享這一頁」，分享 `https://neillin.com/blog/css-symbols/`，title 是 `document.title`，utm 拿掉 |
| 英文部落格列表 `?category=frontend&page=2&utm_source=x` | 保留 category、page，拿掉 utm |
| `share()` 丟 `AbortError` | 不顯示訊息，焦點留在按鈕 |
| `share()` 丟 `NotAllowedError` | 按鈕改成「複製這一頁的連結」並顯示「無法開啟分享選單，請改用複製連結」；再按一次就複製，剪貼簿內容正確 |
| 內建瀏覽器（沒有 `navigator.share`） | 顯示「複製這一頁的連結」；剪貼簿寫入被擋 → 顯示「無法自動複製，請手動複製網址：」加網址，焦點留在按鈕 |
| 320px 寬 | 沒有橫向捲軸，長網址會斷行 |
| 預渲染 HTML | 有 `.page-share` 佔位（同高度，`aria-hidden`）；404 頁沒有 |

`pnpm lint`、`typecheck`、`generate`、`test:smoke`（133 頁、136 個 HTML）都通過；smoke 已加上每頁都要有 `class="page-share"` 的檢查。

## 實作決定

| 規則（開發者要負責的部分） | 本站做法 | WCAG |
|---|---|---|
| 按鈕要有看得到的名稱 | 真正的 `<button>`，文字「分享這一頁」／「複製這一頁的連結」，不用圖示 | 1.1.1、2.5.3、4.1.2 |
| 不要出現按了沒反應的按鈕 | `<ClientOnly>`，預渲染只放同高度佔位；掛載後依 `navigator.share` 與 `canShare` 決定模式 | — |
| 告知結果 | 畫面上顯示狀態文字，並用 `useAnnounce`（ariaNotify，退回 live region）播報；狀態文字本身不設 live region，避免念兩次 | 4.1.3 |
| 取消不是錯誤 | `AbortError` 什麼都不做 | — |
| 不說「分享成功」 | resolve 時不顯示也不播報 | — |
| 失敗要有退路 | 其他錯誤 → 改成複製模式並說明，讓使用者再按一次；剪貼簿也失敗 → 顯示網址 | 3.3.1 |
| 焦點 | 分享結束後焦點若在 `body`，移回按鈕 | 2.4.3 |
| 分享正規網址 | `absoluteUrl(baseUrl, route.path)`，與 canonical 同源；部落格列表保留 `q`、`category`、`page` | — |
| 一致的位置與名稱 | 放在版型裡，每頁同一個位置、同一個名稱 | 3.2.3、3.2.4 |

## 實測：真的分享選單（macOS 27.2、Chrome 158）

2026-11-25。用另一個設定檔開有畫面的 Chrome 158（`--remote-debugging-port`），DevTools 協定送出真的點擊／Enter；分享選單用 macOS AX API 讀取（Swift `AXUIElementCreateApplication(pid)`，依 PID 指定，避免 System Events 把同名的 Chrome 混在一起）。按鍵用 System Events 送出，送出前先確認最前面的 App 是測試用的 Chrome。**沒有開 VoiceOver 實際聽。**

- 頁面按鈕：AX 角色「按鈕」，名稱「分享這一頁」。
- 滑鼠點擊、Tab 到按鈕後按 Enter，都能打開選單。
- 選單：`AXPopover`（identifier `ShareSheet.Popover`），掛在 Chrome 視窗裡；裡面是 `AXGroup/AXHostingView`。兩者都**沒有名稱**。
- 打開後系統焦點自動移進選單第一個項目；頁面收到按鈕 `focusout` 與 `window blur`，`document.activeElement` 仍是按鈕，`document.hasFocus()` 變成 `false`。
- 內容順序：`AXImage` desc「safari」（從 Chrome 分享，名稱卻是 safari）→ `AXStaticText` 頁面標題（`document.title`）→ 最近聯絡人建議 → 加入閱讀列表、AirDrop、郵件、訊息、備忘錄、無邊記、日誌、提醒事項、拷貝、編輯延伸功能⋯（都是有 desc 的 `AXButton`）。
- 鍵盤：Tab／Shift+Tab 移動；↓ 移動；→ 沒有移動；Esc 關閉。
- Esc 關閉：系統焦點回到「分享這一頁」按鈕；`share()` 以 `AbortError: Share canceled` reject；頁面沒有訊息。CDP 送的 Escape 也能關閉。
- 選了一個項目：`share()` 在選下去時 resolve（打開後約 10 秒），不是打開就 resolve。實測時誤觸了一個項目，Safari 被叫到最前面，推測是「加入閱讀列表」。
- `restoreFocus()` 在這個組合沒有作用（`activeElement` 一直是按鈕），保留當其他平台的保險。

## 實測：正式站（2026-11-25，維護者）

- `curl -sI -H "Sec-Fetch-Dest: document" -H "Sec-Fetch-Mode: navigate" https://neillin.com/ | grep -i permissions-policy`：沒有輸出 → Cloudflare 沒有擋 `web-share`。
- Safari、LINE App 內瀏覽器：都能叫出分享選單並成功分享（LINE 是在 iPhone 上測的）。
- macOS 分享選單沒有 LINE：`pluginkit -m -A -v -p com.apple.share-services` 顯示 `jp.naver.line.mac.ShareExt`（26.6.0）已註冊但前面沒有 `+`，也就是沒有啟用（書籍、捷徑同樣沒有 `+`，選單裡也沒有）。macOS 預設不啟用第三方分享延伸功能，要在選單的「編輯延伸功能⋯」或「系統設定 → 一般 → 登入項目與延伸功能 → 分享」勾選。維護者勾選後，LINE 出現在選單中，可以正常分享；感想是「可以用，只是不太習慣」。
- → 文章：選單內容由使用者決定，介面不要承諾「分享到 LINE」。

## 待實測（維護者）

- [x] macOS Chrome + VoiceOver（正式站，維護者）：按「分享這一頁」，在選單選 LINE，可以正常分享。
- [x] VoiceOver 開啟選單那一刻念什麼：「展開，彈出式選單」，不會說「分享」（選單沒有名稱，與 AX API 結果一致）。
- [x] macOS Safari + VoiceOver：按下後念「進入彈出式項目，n 個項目」，同樣不說「分享」。
- [ ] iOS Safari + VoiceOver、Android Chrome + TalkBack。
- [x] LINE App 內瀏覽器（iPhone）：顯示分享、能成功分享。
- [ ] LINE App 內瀏覽器（Android）：預期顯示「複製連結」。
- [ ] DevCheck 掃頁尾附近。
- [x] 上線後用帶 `Sec-Fetch-Dest: document`、`Sec-Fetch-Mode: navigate` 的 curl 確認回應沒有 `Permissions-Policy: web-share=()`。

實測後要同步更新文章的「報讀軟體實測」一節（目前標示尚未實測），再把 `draft` 改成 `false`。

## 發布時

- 技巧清單（zh、en）K-2 新增 Web Share 並打勾，更新 `updatedAt`。
