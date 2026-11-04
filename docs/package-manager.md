# 套件管理工具：從 npm 換到 pnpm 12

2026-11-04 決定，2026-11-03 在專案複本上實測後搬移。

## 結論

改用 **pnpm 12.16.1**，版本釘死在 `package.json` 的 `packageManager`；Cloudflare Pages 用環境變數 `PNPM_VERSION = 12.16.1`（正式與預覽環境都要設）。

## 為什麼不是 npm

起因是一篇「快從 npm 換到 pnpm」的文章，但查證後它對 npm 的描述有不少錯（npm 11 起有 `min-release-age`、`allow-git`、`allow-remote`、`allow-scripts` 白名單、`npm sbom`）。npm 加上 `.npmrc` 能補到大部分防護，選 pnpm 的實際理由是：

1. **設定錯了會失敗，不會默默失效**：npm 碰到不認得的設定會忽略；Cloudflare 上的 npm 版本不容易注意到，可能以為有保護其實沒有。pnpm 沒核准的安裝腳本、未滿冷卻期的版本都會讓安裝直接失敗。
2. **部署時會再檢查一次**：pnpm 會對 lockfile 裡的每個套件重新套用冷卻期與 `trustPolicy`。
3. **`trustPolicy: no-downgrade`**：npm 沒有對應設定（`npm audit signatures` 只檢查簽章，不比對前後版本）。
4. 嚴格的模組解析，能抓出沒宣告就使用的套件（這個專案沒有）。
5. 跟 Nuxt 生態一致，也是跟上新工具的練習。

## 設定（`pnpm-workspace.yaml`）

| 設定 | 用途 | 備註 |
|---|---|---|
| `minimumReleaseAge: 1440` | 發布未滿 24 小時的版本不安裝 | **一定要明確寫出來**：pnpm 只有在使用者自己設定時才把 `minimumReleaseAgeStrict` 設為 true；只靠預設值時，找不到夠舊的版本會退而安裝新版本 |
| `trustPolicy: no-downgrade` | 信任等級下降（例如原本有來源證明、新版沒有）就拒絕 | 預設不開啟 |
| `trustPolicyExclude` | 排除已確認的誤報 | 只排除確切版本，見下方 |
| `allowBuilds` | 允許執行安裝腳本的套件 | esbuild、unrs-resolver。`better-sqlite3`、`sharp` 附預先編譯檔，不需要 |
| `overrides` | 從 `package.json` 搬過來 | `vue-router: 5.4.0` |

`engineStrict: true` 原本是 `.npmrc` 的 `engine-strict=true`；pnpm 12 不讀這一行（實測：在 Node 22 照樣安裝；改寫在 `pnpm-workspace.yaml` 後就會擋下），所以搬到這裡並刪掉 `.npmrc`（另一行 `registry=` 是預設值）。

`blockExoticSubdeps`（擋掉從 git、網址安裝的間接依賴）在 pnpm 官方文件標示預設為 `true`，不用寫。

## 實測時擋下的東西

- **`trustPolicy` 擋下 `@trickfilm400/rollup-plugin-off-main-thread@3.0.0-pre1`**（經由 `@vite-pwa/nuxt` → `workbox-build`）。查 npm 紀錄：同一位維護者 2.5.0 由 CI 發布、有來源證明，30 分鐘後手動發布 3.0.0-pre1、沒有來源證明。判斷為誤報，只排除這個版本；`workbox-build` 換到新版後可以移除這條例外。
- **冷卻期擋下 `semver@6.3.2`**（`pnpm import` 重新解析時選到，發布未滿一天）。沒有加例外，等滿 24 小時後才正式搬移。

## 為什麼釘死 pnpm 版本

- 冷卻期與 `trustPolicy` 由 pnpm 本身執行，如果每次部署自動抓最新的 pnpm，pnpm 自己的新版本就不受任何冷卻期保護。
- 本機與 Cloudflare 用同一版 pnpm，lockfile 的解析結果才會一致。
- `packageManager` 欄位只接受完整版本號。

## 升級 pnpm 的步驟

1. 確認新版已發布超過幾天（`npm view pnpm time --json`）。
2. 改 `package.json` 的 `packageManager` 和 Cloudflare 的 `PNPM_VERSION`（正式、預覽兩組）。
3. 本機 `npm i -g pnpm@<版本>`，`pnpm install`、`pnpm generate`、`pnpm lint`、`pnpm typecheck` 都通過後再 push。

## 新增需要安裝腳本的套件時

安裝失敗並列出被擋的套件 → 確認那個套件真的需要腳本（很多只是檢查或下載預先編譯檔）→ 加進 `allowBuilds`，或設為 `false` 明確拒絕。
