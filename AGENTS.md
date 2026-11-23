# 給 coding agent 的專案說明

專案介紹、指令與結構見 `README.md`。這裡只寫 agent 容易做錯的事。

## 無障礙

改到頁面結構、內容或元件之前，先讀 `ACCESSIBILITY.md`：哪些結構不能拿掉、寫內容與元件的規則，以及什麼時候要更新無障礙聲明（`data/accessibility.ts`）。

## 線上網站 ≠ repo

Cloudflare 會在邊緣把 Google Tag Manager 與 Cloudflare Web Analytics 注入 HTML，repo 裡看不到。不要在程式裡加 GTM（ESLint 會擋），追蹤設定在 Cloudflare 後台。邊緣注入只在真實文件導覽時發生，驗證線上行為請用瀏覽器，或用帶 `Sec-Fetch-Dest: document`、`Sec-Fetch-Mode: navigate` 標頭的 curl。

## 工作方式

- 先實測再下結論，並說明用什麼方式取證。不要憑記憶或單一來源斷定「壞了」「沒作用」。
- 規劃好、經過同意才改檔案；交付時附上驗證結果（lint、typecheck、generate、`pnpm test:smoke`）。
- 不要 commit，也不要動 Cloudflare 後台設定，這兩件事由維護者自己做。
