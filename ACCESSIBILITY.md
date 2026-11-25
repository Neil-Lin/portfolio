# 無障礙

給使用者看的**無障礙聲明**在網站上：<https://neillin.com/accessibility/>（英文 <https://neillin.com/en/accessibility/>），內容包括採用的標準、已知限制和回報方式。這份檔案寫的是**維護這個 repo 時的規則**，不重複聲明的內容。

聲明的內容在 [`data/accessibility.ts`](data/accessibility.ts)。

## 會擋下改動的檢查

`scripts/smoke.mjs`（`pnpm generate && pnpm test:smoke`，CI 每個 PR 都會跑）逐頁檢查以下幾項，任何一項不符合，CI 就會失敗：

1. `<html lang>` 符合語系：中文 `zh-Hant-TW`、英文 `en-US`
2. `<h1>` 恰好一個（例外：`html-nested-h1` 文章本身在示範巢狀 h1）
3. 有「跳到主要內容」連結 `#ak-jump`
4. 無障礙聲明頁有回報信箱，且最後檢視日期（`reviewedAt`）不超過 12 個月

## 人工檢查（不會擋 build）

- 發布前用 [Accesserty DevCheck](https://accesserty.com/devcheck/) 在實際頁面上檢查（axe-core 掃描、焦點路徑、可及名稱與情境模擬）
- 用 macOS 上的 Chrome 搭配 VoiceOver 實際操作
- 上線後由 [Accesserty Pulse](https://accesserty.com/pulse/) 收集鍵盤與操作事件，作為回頭檢查頁面的線索

## 改這個 repo 時的規則（人與 agent 都適用）

**不要拿掉的結構**

- 跳到主要內容連結 `#ak-jump`，以及區塊錨點 `#ak-header`、`#ak-container`、`#ak-footer`
- 快速鍵 `accesskey`：U（上方）、C（中央內容）、Z（下方）、S（部落格搜尋）。改動時要同步更新網站導覽頁的說明

**寫內容時**

- 圖片 alt 要寫出圖片傳達的意思，不寫「圖片1」。機器只能檢查有沒有 alt，內容要人判斷
- 影片要有文字替代：有聲音的影片要有字幕，無聲的影片要用文字說明畫面內容
- 另開視窗的連結用 `target="_blank"`，`title` 加上「(另開視窗)」；↗ 符號由 CSS 自動加上
- 示範實驗性功能的部落格範例，要加 `::feature-support` 顯示讀者的瀏覽器是否支援
- 外文的句子和標題要標語言（WCAG 3.1.2）：中文頁的英文引文、介面文字、英文文件標題標 `lang="en"`；英文頁的中文與注音標 `lang="zh-Hant-TW"`（簡體 `zh-Hans`）。專有名詞、產品名、技術名詞、程式碼不用標
  - 文章裡的寫法：`[English sentence.]{lang="en"}`；整個連結都是外文時寫在連結後面 `{target="_blank" lang="en"}`；一整段用 `::div{lang="en"}`
  - 連結文字裡不能只標一部分（輸出會掉 `lang`）：把外文標題當連結文字，中文說明移到連結外面
  - `pnpm check:lang` 會列出可能漏標的地方（只提醒、不擋 build）

**寫元件時**

- 新增互動元件先參考 [Accesserty UI Kit](https://github.com/Accesserty/UI-Kit) 的寫法
- 交付前說明用什麼方式驗證過（DevCheck、VoiceOver、鍵盤操作）

**維護聲明**

- 發現或修好限制時，更新 `data/accessibility.ts` 的 `limitations`
- 每次檢視過聲明，就更新 `reviewedAt`
