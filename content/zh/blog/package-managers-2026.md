---
title: "npm、pnpm、Yarn 2026 最新版比較"
description: "npm 12、pnpm 12、Yarn 4 的版本現況、安裝方式、安全預設值、node_modules 結構與設定檔對照。三者功能差不多，差在預設開了哪些防護，以及設定錯了會不會提醒你。"
date: 2026-11-04
tags:
  - npm
  - pnpm
  - Yarn
  - Node.js
  - 前端開發
  - 資訊安全
category: frontend
translationKey: package-managers-2026
draft: true
---

> 話說在前頭：這篇由 AI（Anthropic 的 Claude）協助收集資料與整理，我再閱讀確認。文中的版本與預設值，是 2026 年 11 月 4 日用 npm 11.21.1、npm 12.2.1、pnpm 12.16.1、Yarn 4.18.1 實際查詢或執行的結果；其餘說法以官方文件、官方變更紀錄與 npm registry 的發布資料為依據，連結放在文末。工具更新很快，請以官方最新文件為準，有講錯的地方歡迎指正。

三個工具的功能其實差不多，**差在預設開了哪些防護，以及設定錯了會不會提醒你**。日常指令與維護問題，見另一篇[npm 維護筆記](/blog/npm-maintenance-notes/)。

## 版本現況

| 工具 | 最新穩定版 | 備註 |
|---|---|---|
| npm | **12.2.1** | 12.0.0 於 2026 年 7 月發布，支援 Node `^22.22.2 \|\| ^24.15.0 \|\| >=26`。**Node 26 LTS（26.13.0）內建的是 npm 11.20.0**，要用 12 得自己升級 |
| pnpm | **12.16.1** | 12.0.0 於 2026 年 8 月發布，CLI 改用 Rust，各平台發布獨立執行檔。pnpm 11 仍在維護 |
| Yarn | **4.18.1** | 2026 年 9 月發布。Rust 重寫的 Yarn 6 仍是預覽版 |
| Yarn Classic | 1.22.22 | 2024 年 3 月後沒有新版本 |

## 安裝方式

**Node 25 起不再內建 Corepack**（Node.js 技術指導委員會投票決定），pnpm 和 Yarn 要自己裝：

| 工具 | 安裝與升級 |
|---|---|
| npm | 隨 Node 內建；升級用 `npm i -g npm@12` |
| pnpm | `npm i -g pnpm@12` 或官方安裝腳本；升級用 `pnpm self-update` |
| Yarn 4 | 官方做法：`npm i -g corepack` 後在專案裡使用 `yarn`；或 `pnpm add -g yarn@4` |

pnpm 12 能安裝其他套件管理工具，執行前會先驗證 npm 的簽章，例如 `pnx npm@11 ci` 可臨時用指定版本的 npm。

三者都建議用 `packageManager` 釘住版本，只接受完整版本號：

```json
"packageManager": "pnpm@12.16.1"
```

## 安全預設值

什麼都不設定時的行為：

| 防護 | npm 11.21 | npm 12.2 | pnpm 12.16 | Yarn 4.18 |
|---|---|---|---|---|
| 發布冷卻期 | `min-release-age`，**預設關閉** | 同左 | `minimumReleaseAge` **預設 1440 分鐘**（非嚴格） | `npmMinimalAgeGate` **預設 1440 分鐘** |
| 依賴的安裝腳本 | 未核准的**照跑**，只顯示提示 | 未核准的**擋下**並警告 | 未核准的**擋下** | `enableScripts` **預設關閉** |
| 從 git 安裝依賴 | `allow-git` 預設 `all` | 預設 `none` | `blockExoticSubdeps` 可擋間接依賴 | `approvedGitRepositories` 預設空白（全擋） |
| 從網址安裝 tarball | `allow-remote` 預設 `all` | 預設 `none` | 同上 | 未找到對應設定 |
| 信任等級下降 | 沒有 | 沒有 | `trustPolicy: no-downgrade`，要自己開 | 未找到對應設定 |
| SBOM | `npm sbom` | `npm sbom` | `pnpm sbom` | 未找到內建指令 |

**冷卻期的嚴格模式**
- pnpm 預設非嚴格：符合範圍的版本都未滿 24 小時，就退而安裝新版本。**在設定檔明確寫上 `minimumReleaseAge` 才會變嚴格**，找不到夠舊的版本直接失敗。
- npm 的 `min-release-age` 單位是天，一開就是嚴格。

**安裝腳本白名單**

| | 寫在哪裡 | 綁定 |
|---|---|---|
| npm | `package.json` 的 `allowScripts`（用 `npm install-scripts approve` 寫入） | 套件＋版本號，升級後要重新核准 |
| pnpm | `pnpm-workspace.yaml` 的 `allowBuilds` | 套件名稱 |
| Yarn | `package.json` 的 `dependenciesMeta` | 套件名稱 |

npm 加上 `strict-allow-scripts=true`，有未核准的腳本時安裝會直接失敗。

**設定寫錯時**
- npm：不認得的設定只顯示 `Unknown project config` 警告，**安裝照常進行**。CI 的 npm 版本較舊時，防護可能沒生效，只留下一行容易被忽略的警告。
- pnpm 12：`pnpm-workspace.yaml` 有不認得的設定會提示正確名稱；專案有釘 pnpm 版本時，指令直接失敗。

## node_modules 結構

| | npm | pnpm | Yarn 4 |
|---|---|---|---|
| 預設結構 | 扁平，盡量放在最上層 | 共用 store，用硬連結與符號連結組成 | **Plug'n'Play**，沒有 `node_modules` |
| 沒宣告就使用的套件 | 引用得到 | 報錯 | 報錯 |
| 跨專案重複的套件 | 各存一份 | 共用一份 | 共用快取 |

- Yarn 可用 `nodeLinker` 改成 `node-modules` 或 `pnpm`。
- pnpm 的嚴格結構偶爾讓工具找不到間接依賴，例如 Nuxt 開發時 Vite 找不到 `@nuxtjs/mdc`，用 `publicHoistPattern` 提升到根目錄即可。

## 設定檔

| | npm | pnpm 12 | Yarn 4 |
|---|---|---|---|
| 主要設定檔 | `.npmrc` | `pnpm-workspace.yaml`（單一專案也用） | `.yarnrc.yml` |
| 讀 `.npmrc` | 全部 | 實測：`registry` 會讀，`engine-strict`、`save-exact` 不讀 | 實測不讀 |
| 覆寫依賴版本 | `package.json` 的 `overrides` | `pnpm-workspace.yaml` 的 `overrides` | `package.json` 的 `resolutions` |
| 照 lockfile 安裝 | `npm ci` | `pnpm install --frozen-lockfile` | `yarn install --immutable` |
| 執行一次性工具 | `npx` | `pnpm dlx`／`pnx` | `yarn dlx` |

從 npm 換到 pnpm 時，`.npmrc` 的 `engine-strict=true` 要改寫成 `pnpm-workspace.yaml` 的 `engineStrict: true`，否則不會生效。

## 其他差異

- **pnpm 12 能管理 Node 版本**：在 `package.json` 的 `devEngines.runtime` 指定，pnpm 會下載並驗證官方簽章；沒指定時讀 `.nvmrc` 或 `.node-version`。
- **pnpm 12 的 lockfile 是固定的**：依賴有循環時用固定方式處理，同樣的依賴一定產生相同的 lockfile。
- **npm 不用另外安裝**：隨 Node 內建、零設定，仍是它最大的優勢。

## 怎麼選

| 情況 | 建議 |
|---|---|
| 想要預設就安全 | pnpm 12 |
| 團隊不想多裝工具 | npm 12，並打開 `min-release-age`、`strict-allow-scripts`，確認 CI 的 npm 版本支援 |
| 已在用 Yarn 4 | 不用換，預設已經很嚴格 |
| 還在用 Yarn 1 | 搬到 Yarn 4 或 pnpm |

## 延伸閱讀

- [npm 維護筆記：Node 版本、套件來源、lockfile 與常見問題](/blog/npm-maintenance-notes/)

## 相關連結

- [npm Docs — config](https://docs.npmjs.com/cli/using-npm/config "另開新視窗"){target="_blank"}
- [pnpm — 設定](https://pnpm.io/settings "另開新視窗"){target="_blank"}
- [pnpm — 安裝](https://pnpm.io/installation "另開新視窗"){target="_blank"}
- [Yarn — .yarnrc.yml 設定](https://yarnpkg.com/configuration/yarnrc "另開新視窗"){target="_blank"}
- [Node.js 24 文件 — Corepack（v25 起不再隨 Node 發布）](https://nodejs.org/docs/latest-v24.x/api/corepack.html "另開新視窗"){target="_blank"}
- [Node.js 各版本內建的 npm 版本（官方 index.json）](https://nodejs.org/dist/index.json "另開新視窗"){target="_blank"}
- [npm Docs — npm install-scripts](https://docs.npmjs.com/cli/commands/npm-install-scripts "另開新視窗"){target="_blank"}
- [pnpm 變更紀錄（GitHub Releases）](https://github.com/pnpm/pnpm/releases "另開新視窗"){target="_blank"}
- [Yarn — 安裝](https://yarnpkg.com/getting-started/install "另開新視窗"){target="_blank"}
- [Yarn 6 文件（預覽版）](https://v6.yarnpkg.com/concepts/yarn-6 "另開新視窗"){target="_blank"}
