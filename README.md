# Neil's Portfolio

Neil Lin 的個人作品集（[neillin.com](https://neillin.com)）。
Nuxt 4 + Vue 3 + TypeScript，SSR + Prerender。
雙語（繁體中文 / 英文 `/en`），以無障礙（a11y）與 SEO 為核心。

## 開發

套件管理用 **pnpm 12**（版本釘在 `package.json` 的 `packageManager`），安全設定在 `pnpm-workspace.yaml`，選擇理由見 `docs/package-manager.md`。

```bash
npm i -g pnpm@12.16.1   # 第一次：安裝 pnpm（Node 26 不內建 corepack）
pnpm install
pnpm dev           # 開發伺服器 http://localhost:3000
pnpm lint          # ESLint 檢查
pnpm lint:fix      # ESLint 自動修復
pnpm format        # Prettier 格式化
```

環境變數請參考 `.env.example` 複製為 `.env`。

## 建置

```bash
pnpm generate      # 預渲染靜態輸出至 .output/public
pnpm test:smoke    # 冒煙測試：檢查靜態輸出沒壞掉（需先 generate）
python3 -m http.server 4173 --directory .output/public   # 本地預覽建置結果
```

`pnpm preview` 只適用伺服器輸出（`pnpm build`），靜態輸出沒有 server 入口，請用上面的靜態伺服器預覽。

## 自動檢查

PR 與 main 由 GitHub Actions（`.github/workflows/ci.yml`）依序執行 lint、typecheck、generate、冒煙測試。
專案的寫法規則寫在 `eslint.config.mjs` 的 `no-restricted-syntax`，違反時錯誤訊息會說明原因與替代寫法。

## 專案結構

- `app/` — Nuxt 4 srcDir（pages、components、composables、layouts、assets）
- `data/` — 內容資料（純 TS、具型別、一律 named export）
  - `data/products/` — 一檔一作品，由 `data/productsData.ts` 聚合
  - `data/career.ts` — 年資起算年份（文案中的年資自動計算，不會過期）
- `scripts/checkData.ts` — 內容資料驗證（slug 重複、媒體路徑存在性），由
  `nuxt.config.ts` 載入時自動執行，資料有誤時 build 直接失敗
- `i18n/` — 雙語字典（`zh-Hant-TW` 預設、`en`）
- `content/` — 自建部落格文章（Nuxt Content），見下方「部落格」
- `server/api/__sitemap__/` — 自訂 sitemap 來源（產品 + 文章，lastmod 取自真實更新時間）
- `server/routes/` — RSS feed（`/rss.xml`、`/en/rss.xml`）
- `public/f0c3fd55914c4ba9b6021d25692e138a.txt` — IndexNow 金鑰檔，**勿刪**

## 部落格（Nuxt Content）

文章自建於本站（不再連外部平台）。採「模型 B」：中英文各自獨立，不必互為翻譯。

- **新增文章**：在 `content/zh/blog/` 或 `content/en/blog/` 放 `.md`，檔名即 slug。
- **Frontmatter**：`title`、`description`、`date`（必填）；`updatedAt`、`tags`、`ogImage`、`translationKey`、`draft`（選填）。schema 由 `content.config.ts` 用 zod 驗證。
- **中英對照版**：只有當兩篇互為翻譯時，才在兩邊填**相同的 `translationKey`**——這會啟用 hreflang 互指與語言切換鈕的精確對應。
- **單語言文章**：不填 `translationKey` 即可。會輸出 self-canonical、**不發 hreflang**；切換語言時導向另一語言的 blog 首頁（Option A，邏輯在 `app/composables/useLocaleSwitch.ts`）。
- **draft**：`draft: true` 開發看得到、build 時排除（不預渲染、不進 sitemap）。
- 文章路由、SEO、`BlogPosting` schema、OG 圖、相關文章、Shiki 程式碼highlight 皆自動處理。
- 需要原生模組 `better-sqlite3`（Content 建置期用）。

## 技術備註

- `pnpm-workspace.yaml` 的 `overrides: { vue-router: 5.4.0 }` 為相依性釘版，
  升級 Nuxt 時請測試後再評估是否移除。
- robots.txt 含 `Content-Signal: ai-train=no, search=yes, ai-input=yes`
  （允許搜尋與 AI 輸入，拒絕模型訓練），由 `nuxt.config.ts` 的 `aiReady.contentSignal`（nuxt-ai-ready）寫入。
