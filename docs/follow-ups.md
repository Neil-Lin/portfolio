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

## 部署後要確認

- [ ] 給 AI 讀的 `.md` 版本（例如 `/blog/html-sethtml.md`），回應的 `Content-Type` 有沒有帶 `charset=utf-8`，中文是否正常顯示。

## 內容待確認

- [ ] **兩個作品的英文名稱是我翻的**（`data/projectsData.ts`）：原本英文欄位填的是代稱（`luodongarchives`、`foreign`），改成 `Lanyang Forestry Culture and History Archives`（蘭陽地區林業文化歷史資料庫）、`Taiwan in Overseas Historical Records`（海外史料看台灣）。若網站有官方英文名稱請換掉。

## 備註

- **`seo.minify` 關閉**（`nuxt.config.ts`）：nuxt-seo-utils 9 預設會在預渲染時再壓縮一次 HTML 裡的 `<style>`，它的壓縮器把冒號當標點，會刪掉 `.article :is(h1)` 這類後代選擇器中的空白（變成 `.article:is(h1)`），連文章程式碼範例裡的 `<style>` 都會被改掉，也造成 Shiki `<style>` 的 hydration mismatch。CSS 在 build 時已由 lightningcss 壓縮，關掉只多 0.3% HTML。升級 `@nuxtjs/seo` 後若想重新開啟，要先確認這個問題已修。
- **標題的 `text-transform: capitalize`**（`ui.css`）：全站標題預設 capitalize，給語系檔裡的小寫短標籤用；文章標題與內文、文章列表、作品與產品名稱排除在外，照原文顯示。語系檔或資料裡新增會顯示在這些地方的英文名稱，要自己寫好大小寫。

- **OG 圖的中文字型靠 `fontless`**：nuxt-og-image 7 的 Satori 不能用 Google 提供的 Noto Sans TC 可變字型（woff2），要透過 `fontless` 另外下載靜態字型。`fontless` 是它的選用 peer dependency，**一定要裝在專案裡**，沒裝的話建置不會失敗，只會出現 `Satori renders "Noto Sans TC" text with the bundled Inter font` 警告，中文全部變成方框。升級 `@nuxtjs/seo` / `nuxt-og-image` 後要看建置紀錄有沒有這個警告。
- **OG 模板會依標題長度調整字級與行數**（`CustomTemplate.satori.vue` 的 `TITLE_LAYOUTS`）：64、56、48px 最多 3 行，再長用 44px 最多 4 行；描述依標題佔的行數顯示 2～4 行，超出以「…」截斷。字寬是估算值，改字型或版面時要重新看一遍所有 OG 圖。
- **OG 模板的 `font-weight` 要寫數字**（700），寫 `bold` 時 og-image 7 只會下載 400 字重，標題就不是粗體。
- **在 Claude 的 sandbox 驗證 OG 圖**：sandbox 擋了 `fonts.google.com`（字型清單 API）與 bunny、fontsource 等供應商，但 `fonts.googleapis.com`、`fonts.gstatic.com` 連得到。做法是用 `NODE_USE_ENV_PROXY=1` 讓 Node 走 proxy、用 `--import` 預載一支攔截 `fonts.google.com/metadata/fonts` 的腳本（回傳只有 Noto Sans TC 的清單），並暫時在 `fonts.providers` 關掉 Google 以外的供應商。這些都只在 sandbox 用，不要 commit。

- **`@nuxt/fonts` 的 `throwOnError`**：1.0 起預設為 `true`，正式建置時字型抓不到會讓建置失敗，Cloudflare 會保留上一版，不會默默部署沒有中文字型的網站。所以 repo 裡**不要**設定 `throwOnError: false`；只有在沒有網路的環境本機建置時才暫時加上。
- **範例元件的 `modeText`（偵測中／原生支援／後備）**：9 個範例有相似的寫法，但偵測時機和各自 `onMounted` 的量測流程綁在一起，抽成 composable 不會比較短或清楚，所以刻意保留現狀。
