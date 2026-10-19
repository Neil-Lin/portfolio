# 待回頭處理的項目

升級、重構時暫時繞過或還不能做的事，記在這裡。處理完就從清單刪掉，並在 commit 訊息註明。

最後更新：2026-10-19（Nuxt 4.6.2、`future.compatibilityVersion: 5`）

## 等套件支援 Nuxt 5

- [ ] **拿掉 `experimental.nitroAutoImports: true`**（`nuxt.config.ts`）
  - 原因：`@nuxtjs/i18n` 10.6 的伺服器程式還從 `#imports` 匯入 `useRuntimeConfig`，關掉會 build 失敗。
  - 條件：i18n 發布支援 Nuxt 5 的版本。拿掉後跑一次 `nuxi generate` 確認。
- [ ] **拿掉 `experimental.typedPages: false`**（`nuxt.config.ts`）
  - 原因：i18n 的 `localePath()` 型別還不接受 `"/blog"` 這類路徑字串。
  - 條件：同上。開啟後 `route.params.name` 會變成依路由區分的型別，約 11 處要調整（大多在 `app/pages/products.vue`），`nuxi typecheck` 會列出來。
- [ ] **拿掉 `server/utils/rss.ts` 裡 `queryCollection` 的型別轉換**
  - 原因：`@nuxt/content` 3.16 的 `queryCollection(event, …)` 型別還是 h3 v1 的 event。
  - 條件：`@nuxt/content` 支援 Nuxt 5 / h3 v2。`server/api/__sitemap__/urls.ts` 的 `defineSitemapEventHandler` 也一起確認。
- [ ] **package.json 的 `overrides.vue-router: 5.4.0`**：上游各套件都改用 vue-router 5 後，確認還需不需要。

## 等上游更新

- [ ] **satori 升級到 0.47 以上**
  - 原因：`@nuxtjs/seo` 6 內建的 OG 圖片套件只支援到 satori 0.47，強制升級會讓 OG 圖片產生失敗。
  - 條件：OG 圖片套件宣告支援新版 satori。升級後要檢查中文 OG 圖片（字型、換行、浮水印位置）。
- [ ] **TypeScript 7**
  - 條件：`vue-tsc` 支援 TypeScript 7（Go 版編譯器）。在那之前維持 TypeScript 6。

## 已知、目前不處理

- [ ] **文章頁 Shiki `<style>` 的 hydration text mismatch**
  - 現象：有程式碼區塊的文章，console 會出現「Hydration completed but contains mismatches」。細節是 Shiki 產生的 `<style>`：伺服器端輸出是壓縮過的 CSS，客戶端渲染的是沒壓縮的版本，文字不一樣。
  - 影響：只有 console 警告，畫面與樣式相同（CSS 內容等價）。升級前的版本就有，不是這次造成的。
  - 檢查方式：在 `nuxt.config.ts` 暫時加 `vite: { define: { __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true" } }` 再 build，就能在 console 看到差異細節。檢查完要拿掉。
  - 可能的處理：等 `@nuxt/content` / Shiki 修正，或關掉 HTML 壓縮對 `<style>` 的處理。

## 部署後要確認

- [ ] 給 AI 讀的 `.md` 版本（例如 `/blog/html-sethtml.md`），回應的 `Content-Type` 有沒有帶 `charset=utf-8`，中文是否正常顯示。

## OG 分享圖

- [ ] **英文長標題的 OG 圖文字超出畫面**：例如 `/en/blog/css-corner-shape/`，標題加描述太長，上下都被裁掉。可以限制描述行數，或依字數縮小字級。

## 備註

- **OG 圖的中文字型靠 `fontless`**：nuxt-og-image 7 的 Satori 不能用 Google 提供的 Noto Sans TC 可變字型（woff2），要透過 `fontless` 另外下載靜態字型。`fontless` 是它的選用 peer dependency，**一定要裝在專案裡**，沒裝的話建置不會失敗，只會出現 `Satori renders "Noto Sans TC" text with the bundled Inter font` 警告，中文全部變成方框。升級 `@nuxtjs/seo` / `nuxt-og-image` 後要看建置紀錄有沒有這個警告。
- **OG 模板的 `font-weight` 要寫數字**（700），寫 `bold` 時 og-image 7 只會下載 400 字重，標題就不是粗體。
- **在 Claude 的 sandbox 驗證 OG 圖**：sandbox 擋了 `fonts.google.com`（字型清單 API）與 bunny、fontsource 等供應商，但 `fonts.googleapis.com`、`fonts.gstatic.com` 連得到。做法是用 `NODE_USE_ENV_PROXY=1` 讓 Node 走 proxy、用 `--import` 預載一支攔截 `fonts.google.com/metadata/fonts` 的腳本（回傳只有 Noto Sans TC 的清單），並暫時在 `fonts.providers` 關掉 Google 以外的供應商。這些都只在 sandbox 用，不要 commit。

- **`@nuxt/fonts` 的 `throwOnError`**：1.0 起預設為 `true`，正式建置時字型抓不到會讓建置失敗，Cloudflare 會保留上一版，不會默默部署沒有中文字型的網站。所以 repo 裡**不要**設定 `throwOnError: false`；只有在沒有網路的環境本機建置時才暫時加上。
- **範例元件的 `modeText`（偵測中／原生支援／後備）**：9 個範例有相似的寫法，但偵測時機和各自 `onMounted` 的量測流程綁在一起，抽成 composable 不會比較短或清楚，所以刻意保留現狀。
