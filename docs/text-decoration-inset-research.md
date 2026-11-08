# text-decoration-inset 研究筆記（2026-11-08）

文章：`content/{zh,en}/blog/css-text-decoration-inset.md`，範例：`app/components/content/TextDecorationInsetDemo.vue`。

## 支援度與依據

- Chrome 157：Chromium `runtime_enabled_features.json5` 的 `CSSTextDecorationInset` 在 154、155、156 是 experimental，157.0.8103.73 起 stable；MDN BCD 也是 157；BCD 瀏覽器資料：Chrome 157 於 2026-11-03 推出。
- Firefox 146：MDN Firefox 146 版本說明（bug 1979915 等）；BCD 146。
- Safari：BCD 標示 preview。
- 實測用的 Chromium：最新快照（159）與 157 時期的快照（revision 1717330，用 REVISIONS 檔對到 `chrome/VERSION` 的 MAJOR=157 找到）；153 為內建 Playwright 瀏覽器。

## 規格（CSS Text Decoration 4 §text-decoration-inset）

- 值：`<length-percentage>{1,2} | auto`，初始值 0，可動畫（by computed value）。
- 正值內縮、負值外延；兩個值時第一個是起點、第二個是終點。
- 百分比依 `box-decoration-break`：slice 用整個裝飾盒的寬度，clone 用每個片段的寬度。
- `auto`：讓相鄰兩個加底線的元素看起來不是同一條線；規格說明這在中文很重要（底線是標點），例子是兩個相鄰人名。
- MDN 的說明一致，並連到 W3C clreq 的專名號（#id88）。clreq：相鄰時「相鄰的那一側」縮短，「另一側長度不變」。

## 實測（Chromium 157、159；153 對照）

| 情境 | 結果 |
|---|---|
| 40px 字、連結寬 267px：`0.5em` | 兩端各少 20px |
| `-0.5em` | 兩端各多 20px |
| `1em -1em` | 起點 +40px、終點 +40px（整條往後移） |
| `45%` | 剩中間一小段 |
| `50%`、`60%` | 底線完全消失 |
| `auto`，兩個相鄰 `<u>`（80px、120px 寬） | 分成兩段 [102,178]、[182,298]：每段兩端都內縮約 2px，外側也縮（和 clreq 不同） |
| 153 | 所有值都被忽略，底線完整 |
| 50% → hover 0 的過渡 | 中途為 25% 左右，結束 0px |
| 模擬強制色彩模式 | 50% 一樣看不到 |
| 只寫 `:hover`，用 Tab 取得焦點 | 維持 50% |
| 加 `:focus-visible` | 焦點時變 0 |
| `reducedMotion: reduce` + 文章的 `@media` | 直接變 0，沒有過渡 |

## 無障礙依據

- WCAG 1.4.1；失敗技術 F73：「If the non-color cue only happens when the mouse hovers over the link or when the link receives focus, it is still a failure.」
- G183：只靠顏色區分時，連結與周圍文字對比至少 3:1；並提醒深色時 3:1 也不易分辨，建議仍加底線。
- 本站連結與內文對比：淺色 1.01:1、深色 1.16:1（建置後的頁面實測）。
- C39：用 `prefers-reduced-motion` 拿掉互動造成的動態。

## 另外發現（未處理，使用者決定先不改）

- 全站 `a:hover { opacity: 0.6 }`：淺色模式 hover 時連結對比降到 2.89:1（一般 7.23:1）；深色 5.87:1。可改用底線變化取代變淡。
- 教育部《重訂標點符號手冊》網站在沙箱連不上，專名號以 W3C clreq 為依據。
