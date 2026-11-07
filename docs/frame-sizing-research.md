# 響應式 iframe（frame-sizing）研究筆記（2026-11-07）

文章：`content/{zh,en}/blog/css-frame-sizing.md`，範例：`app/components/content/ResponsiveIframeDemo.vue`。

## 支援度與依據

- Chromium `runtime_enabled_features.json5` 的 `ResponsiveIframes`：153.0.8010.57、154.0.8011.0 為 experimental，154.0.8037.0（154 分支點）起 stable。MDN BCD：Chrome 154、Firefox／Safari 不支援、experimental。實測 157、159 支援，153 不支援。
- **`allow-origins`**：Chromium `html_meta_element.cc` 的 `IsAllowOrigins()` 要求 `content` 以 `allow-origins=` 開頭，後面是 CSP 來源清單，並用父頁來源比對（154.0.8037.154～159.0.8147.1 都一樣）。CSS Sizing 4 規格本文沒提；CSS 工作小組的說明文件（`css-sizing-4/responsive-iframes-explainer.md`）範例和 WPT（`css/css-sizing/responsive-iframe/`，含 `responsive-iframe-allow-origins.html` 的各種變體）都用 `content="allow-origins=..."`。MDN 頁面也沒提。
- 寫法演變：whatwg/html#12444（仍開啟）中，kojiishi 2026-07-13 提到安全團隊要求加上類似 `frame-ancestors` 的允許來源；WPT 提交訊息顯示名稱改過（`allowed-origins` → `alloworigins`）。目前 WPT 與 Chromium 都是 `content="allow-origins=..."`。
- 標準立場：WebKit #653 開啟、沒有 position 標籤、0 則留言；Mozilla #1394 開啟、沒有標籤，jakearchibald 2026-10-16：「It only resizing on domready + load seems like a huge limitation.」（兩次獨立抓取核對過）。
- CSSWG #13589：2026-03-31 決議同源導覽保留尺寸、新頁面沒同意就清除；2026-07-09 kojiishi 表示跨來源導覽會重設尺寸。

## 規格重點（CSS Sizing 4 §responsive-iframes）

- `frame-sizing: auto | content-width | content-height | content-block-size | content-inline-size`，邏輯方向依 iframe 元素的書寫模式。
- 內嵌文件的 responsive embedded sizing flag：解析時遇到 meta 設 true，`<body>` 開始時設 false，之後不變。
- 尺寸在 `DOMContentLoaded` 後第一次排版與 `load` 時設定；之後要 `requestResize()`。
- `requestResize()`：不是子 navigable、宿主不是 iframe、或 flag 不是 true 時丟 `NotAllowedError`。
- 說明文件（較舊）寫的是只在 load 時量一次，並把 JS API 列為未來擴充；以規格為準。

## 實測（Chromium 159，另以 157、153 對照）

| 情境 | 結果 |
|---|---|
| meta 沒有 `content` | 150px，`requestResize()` 丟 `NotAllowedError` |
| `allow-origins='self'`／`*`／父頁網址（同源） | 長高 |
| 跨來源（a.test 父頁、b.test 子頁）：`*`、父頁網址 | 長高；`'self'` 不會 |
| `srcdoc` + `'self'` | 長高（範例用這個） |
| meta 放在 `<body>` 裡 | 不生效 |
| 展開 details、文字間距、寬度變窄 | 不會自動更新；`requestResize()` 後更新 |
| 收合（內容變少） | 不會自動縮；`requestResize()` 後縮 |
| iframe 寫 `height`／`max-height` | 以它們為準 |
| `ResizeObserver` 自動呼叫 | 沒有迴圈，變多變少都跟著 |
| 頂層頁面呼叫 `requestResize()` | `NotAllowedError` |
| `scrolling="no"`、子頁 `overflow: hidden` | 滾輪捲不動；Tab 到按鈕時仍會捲過去 |
| 文章的 postMessage 備援程式碼（153） | 展開、收合都跟著；量 `<html>` 的高度才縮得回去，`scrollHeight` 縮不回去 |

- 注意：沙箱用 `127.0.0.1` 當跨來源網址時不會長高，改用 `--host-resolver-rules` 對應的網域名稱才正常（推測是測試環境的問題，WPT 也預期跨來源可用）。

## 待本機確認

- 瀏覽器實際放大 200%、400% 時，範例 iframe 的表現。
- 跨來源的實際網站（不同網域）是否長高。
