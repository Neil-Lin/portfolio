# 媒體狀態偽類研究筆記（2026-11-07）

文章：`content/{zh,en}/blog/css-media-state-pseudos.md`，範例：`app/components/content/MediaStateDemo.vue`。

## 支援度與依據

| 瀏覽器 | 版本 | 依據（兩個以上獨立來源） |
|---|---|---|
| Chrome | 158 | Chromium `runtime_enabled_features.json5` 的 `CSSMediaElementPseudos`：154.0.8037.154～157.0.8103.73 為 experimental，158.0.8104.0 仍 experimental、158.0.8127.0（分支點）起 stable；MDN BCD 也是 158；實測 157 snapshot 不支援、159 支援 |
| Firefox | 150 | MDN Firefox 150 版本說明（bug 2020775）；MDN BCD 150 |
| Safari | 15.4 | MDN BCD 15.4；WebKit 原始碼 `SelectorPseudoClassAndCompatibilityElementMap.in`：`Safari-612.4.9.3.1` 標籤沒有這七個、`Safari-613.1.17` 標籤有（`#if ENABLE(VIDEO)`，沒有執行期旗標）。Apple 的 Safari 15.4 版本說明沒有提到 |

- web-features 的 `media-pseudos` 仍是 `baseline: false`，dist 檔裡還沒有 Chrome（資料落後）。
- 整理清單原本寫「Chrome 156 Beta 加入、Firefox 尚未」，已更正。

## 規格重點（原文已讀）

- Selectors 4 §resource-pseudos：`:buffering`、`:stalled` 時也符合 `:playing`。
- HTML（`source` 檔 pseudo-classes 段）：`:playing`／`:paused` 看 `paused`；`:buffering` = paused false + `NETWORK_LOADING` + readyState ≤ `HAVE_CURRENT_DATA`；`:stalled` = `:buffering` + is currently stalled；stall timeout 建議約 3 秒。
- HTML：muted（muted state、`muted` 屬性、倒放、極端 playbackRate）和 volume 分開；播完（沒有 loop、正向）把 `paused` 設 true，先觸發 `pause` 再觸發 `ended`。
- Selectors 4：不支援的偽類必須當成 invalid；含 invalid 的選擇器清單整個 invalid；`:is()`、`:where()` 用 forgiving selector list。
- APG 按鈕模式：toggle 按鈕的名稱不能隨狀態改；要改名稱（Mute ⇄ Unmute）就不用 `aria-pressed`。
- WCAG F87（CSS 產生內容）已標為 obsolete，文章不引用。

## 實測（Chromium 159，另以 157、153 對照）

| 情境 | 結果 |
|---|---|
| 載入完成 | `:paused` |
| 播放 | `:playing` |
| 靜音 | `:playing :muted` |
| 音量 0、未靜音 | `:playing`（沒有 `:muted`） |
| 播完 | `:paused`，`ended` true |
| 有 `loop` 播到結尾 | 仍 `:playing`（`paused` false） |
| 播放中改 `currentTime` | `:playing :seeking`，seeked 後消失 |
| 慢速伺服器（只送 0.5 秒資料後停住） | 1.5 秒：`:playing :buffering`；5.5 秒：再加 `:stalled` |
| `@supports selector(:playing)`、`CSS.supports(...)` | 159 true；157、153 false |
| 選擇器清單 `.a:has(audio:playing), .a.on` | 153、157 整條規則失效；`:is()` 版本保留 `.on` |
| `::before` 的 `content` 隨 `:playing` 改字 | 159 無障礙名稱跟著變；153 停在「播放」 |
| 解析時有 `<audio muted>` | 符合 `:muted`；之後才 `setAttribute("muted")` 在 Chromium 159 不會靜音（跟 HTML 標準目前的寫法不同，文章沒寫） |

## 待本機確認

- VoiceOver：播放鍵名稱改變時、靜音鍵 `aria-pressed` 的念法。
- Safari、Firefox 實際行為（沙箱只有 Chromium）。
