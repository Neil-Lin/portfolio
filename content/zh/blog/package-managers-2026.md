---
title: "npm、pnpm、Yarn 2026 最新版比較：安全預設值差最多，速度反而是其次"
description: "npm 12、pnpm 12、Yarn 4 都在 2026 年加上了供應鏈防護，但預設開了哪些、怎麼開，三家差很多。我在 2026 年 11 月逐一實測三個工具的最新版，整理版本現況、安裝方式（Node 25 起不再內建 Corepack）、安全預設值、node_modules 結構與設定檔，最後說明我的網站為什麼換成 pnpm。"
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

> 話說在前頭：文中的版本與預設值，是我在 2026 年 11 月 4 日用 npm 11.21.1、npm 12.2.1、pnpm 11.28.10、pnpm 12.16.1、Yarn 4.18.1 實際查詢或執行的結果。這三個工具更新很快，數字請以各自的官方文件為準。有講錯的地方歡迎指正。

## 前言

最近有一篇「快從 npm 換到 pnpm」的文章流傳很廣，主要論點是 pnpm 11 的安全預設值，npm「完全沒有對應功能」。我拿去實測後發現，pnpm 的部分大致正確，但 npm 的描述已經過時：npm 早就有發布冷卻期、git 依賴限制、安裝腳本白名單和 SBOM，只是**預設沒開**。

這也是三個工具在 2026 年最大的差別：**功能其實差不多，差在預設開了哪些、沒開的時候會不會提醒你**。速度和硬碟空間反而是其次。

這篇整理三個工具的最新版本、安裝方式、安全預設值和結構差異。另一篇[前端套件管理的維護筆記](/blog/node-package-ecosystem/)則是日常會遇到的指令和問題。

## 版本現況

| 工具 | 最新穩定版 | 備註 |
|---|---|---|
| npm | **12.2.1** | 12.0.0 在 2026 年 7 月發布，支援 Node `^22.22.2 \|\| ^24.15.0 \|\| >=26`。Node 26 LTS 內建的是 **npm 11.20.0**，不是 12 |
| pnpm | **12.16.1** | 12.0.0 在 2026 年 8 月發布，CLI 改用 Rust 重寫，各平台發布獨立的執行檔。pnpm 11（11.28.10）仍在維護 |
| Yarn | **4.18.1** | 2026 年 9 月發布。用 Rust 重寫的 Yarn 6 還在預覽階段，尚未推出穩定版 |
| Yarn Classic | 1.22.22 | 1.x 已停止開發新功能，新專案不建議使用 |

要注意的是：**裝了最新的 Node，不等於用的是最新的 npm**。Node 26 內建 npm 11.20，要用 npm 12 得自己升級（`npm i -g npm@12`）。

## 安裝方式：Node 25 起沒有 Corepack 了

以前用 pnpm 或 Yarn，常見做法是開啟 Node 內建的 Corepack，它會依照 `package.json` 的 `packageManager` 欄位自動下載對應版本。但 Node.js 技術指導委員會投票決定，**從 Node 25 起不再隨 Node 發布 Corepack**。Node 24 以前還有，但仍標示為實驗功能。

現在的安裝方式：

| 工具 | 安裝方式 |
|---|---|
| npm | 隨 Node 內建；升級用 `npm i -g npm@12` |
| pnpm | `npm i -g pnpm@12`，或官方的獨立安裝腳本；之後用 `pnpm self-update` 升級 |
| Yarn 4 | 自己安裝 Corepack（`npm i -g corepack`）再 `corepack enable`；或用 pnpm 12 安裝（見下方） |

pnpm 12 有一個新功能：**可以幫你安裝其他套件管理工具**。`pnpm add -g yarn@4` 會裝 Yarn Berry；`pnx npm@11 ci` 可以臨時用指定版本的 npm 跑一次指令。它也會先用 npm 的簽章驗證套件，再執行。

不管用哪一個，都建議在 `package.json` 用 `packageManager` 釘住版本：

```json
"packageManager": "pnpm@12.16.1"
```

這個欄位只接受完整版本號，不能寫 `>=12`。釘死的好處是本機和 CI 用同一版，lockfile 的解析結果才會一致。

## 安全預設值比較

這是三者差最多的地方。表格是各工具「什麼都不設定」時的行為：

| 防護 | npm 11.21 | npm 12.2 | pnpm 12.16 | Yarn 4.18 |
|---|---|---|---|---|
| 發布冷卻期（新版本先等一段時間才安裝） | 有 `min-release-age`，**預設關閉** | 同左，**預設關閉** | `minimumReleaseAge` **預設 1440 分鐘**（非嚴格） | `npmMinimalAgeGate` **預設 1440 分鐘** |
| 依賴的安裝腳本 | 未核准的**照跑**，只顯示提示 | 未核准的**擋下**，顯示警告 | 未核准的**擋下** | `enableScripts` **預設關閉** |
| 從 git 安裝依賴 | `allow-git` 預設 `all`（不限制） | 預設 `none`（全擋） | `blockExoticSubdeps` 可擋間接依賴 | `approvedGitRepositories` 預設空白（全擋） |
| 從網址安裝 tarball | `allow-remote` 預設 `all` | 預設 `none` | 同上 | 未找到對應設定 |
| 信任等級下降（例如來源證明消失） | 沒有 | 沒有 | `trustPolicy: no-downgrade`（要自己開） | 未找到對應設定 |
| SBOM | `npm sbom` | `npm sbom` | `pnpm sbom` | 未找到內建指令 |

幾個細節：

**冷卻期的「嚴格」與「非嚴格」**
pnpm 的冷卻期預設是非嚴格：如果符合版本範圍的版本都未滿 24 小時，它會退而安裝新版本。**只有自己在設定檔明確寫上 `minimumReleaseAge`，才會變成嚴格模式**，沒有夠舊的版本就直接失敗。我在 pnpm 原始碼與變更紀錄都確認過這個行為。npm 的 `min-release-age` 單位是「天」，一開就是嚴格：找不到符合的版本就報錯。

**安裝腳本白名單的寫法不同**
- npm：寫在 `package.json` 的 `allowScripts`，**綁定版本號**（`"esbuild@0.28.1": true`），套件升級後要重新核准。用 `npm install-scripts approve <套件>` 寫入。
- pnpm：寫在 `pnpm-workspace.yaml` 的 `allowBuilds`，**只綁套件名稱**。
- Yarn：在 `package.json` 的 `dependenciesMeta` 逐一允許。

npm 的 `strict-allow-scripts=true` 可以讓「有未核准的腳本」直接讓安裝失敗，而不是只擋下來顯示警告。

**實測擋到的東西**
我把網站從 npm 換成 pnpm 12 時，這兩道防護都真的擋到了東西：
- `trustPolicy` 擋下一個間接依賴：同一位維護者先用 CI 發布了有來源證明的版本，30 分鐘後手動發布下一版，沒有來源證明。查證後是誤報，只排除那一個版本。
- 嚴格冷卻期擋下 `semver` 的一個新版本，因為它才發布 14 小時。等滿一天後再搬移，就沒有問題。

**npm 最大的風險：設定錯了不會提醒**
npm 碰到不認得的設定會直接忽略。如果 CI 上的 npm 版本比你本機舊，你在 `.npmrc` 加的防護可能完全沒作用，而你不會知道。pnpm 12 則相反：`pnpm-workspace.yaml` 裡有不認得的設定，會提示最接近的正確名稱；如果專案有釘 pnpm 版本，還會直接讓指令失敗。

## node_modules 的結構

| | npm | pnpm | Yarn 4 |
|---|---|---|---|
| 預設結構 | 扁平（hoisted）：所有套件盡量放在最上層 | 全部套件放在共用的 store，用硬連結和符號連結組成 `node_modules` | **Plug'n'Play**：沒有 `node_modules`，由一個對照檔告訴 Node 去哪裡找 |
| 沒宣告就使用的套件（幽靈依賴） | 引用得到 | 引用不到，直接報錯 | 引用不到 |
| 多個專案重複的套件 | 每個專案各存一份 | 共用同一份 | 共用快取 |

Yarn 的 `nodeLinker` 可以改成 `node-modules` 或 `pnpm`，相容性不好的專案常這樣做。

pnpm 嚴格的結構偶爾會讓工具找不到東西。我換成 pnpm 後，Nuxt 開發伺服器出現一個警告：Vite 找不到間接依賴 `@nuxtjs/mdc`。解法是在 `pnpm-workspace.yaml` 加上 `publicHoistPattern`，把它提升到根目錄。

## 設定檔放哪裡

| | npm | pnpm 12 | Yarn 4 |
|---|---|---|---|
| 主要設定檔 | `.npmrc` | `pnpm-workspace.yaml`（單一專案也用這個檔名） | `.yarnrc.yml` |
| `.npmrc` 讀哪些 | 全部 | 實測只讀 registry 相關設定；`engine-strict`、`save-exact` 都不讀 | 不讀 |
| 覆寫依賴版本 | `package.json` 的 `overrides` | `pnpm-workspace.yaml` 的 `overrides` | `package.json` 的 `resolutions` |
| 照 lockfile 安裝（CI 用） | `npm ci` | `pnpm install --frozen-lockfile` | `yarn install --immutable`（CI 上是預設） |

`.npmrc` 這點最容易踩到。我換成 pnpm 時忘了處理 `.npmrc` 裡的 `engine-strict=true`，結果它根本沒有作用：在 Node 22 上照樣能安裝，而專案要求的是 Node 26。改寫成 `pnpm-workspace.yaml` 的 `engineStrict: true` 才生效。

## 其他值得知道的

- **pnpm 12 能管理 Node 版本**：在 `package.json` 的 `devEngines.runtime` 指定 Node 版本，pnpm 會下載並驗證官方簽章，在專案裡打 `node` 就用那一版。沒指定時會讀 `.nvmrc` 或 `.node-version`。這等於取代了一部分 nvm 的工作。
- **pnpm 12 的鎖檔更穩定**：依賴有循環時，12 版會用固定方式處理，同樣的依賴一定產生一模一樣的 lockfile。
- **Yarn 6**：用 Rust 重寫，目前是預覽版，穩定版尚未推出。
- **npm 的優勢**：隨 Node 內建、零設定、所有教學都用它。對不想多裝工具的人，這仍然是最大的理由。

## 該選哪一個

- **個人專案、想要預設就安全**：pnpm 12。防護大多預設開啟，設定錯了會失敗而不是默默失效。
- **團隊不想多裝工具、或公司規定**：npm，但要升到 12，並在 `.npmrc` 打開 `min-release-age`、`strict-allow-scripts`。也要確認 CI 上的 npm 版本支援這些設定。
- **已經在用 Yarn Berry**：4.18 的冷卻期、安裝腳本、git 依賴預設都很嚴格，沒有換的必要。
- **還在用 Yarn 1**：該搬了，換到 Yarn 4 或 pnpm 都可以。

我的網站最後選了 pnpm 12。完整的搬移過程、遇到的問題和設定說明，記錄在 repo 的 `docs/package-manager.md`。

## 延伸閱讀

- [前端套件管理的維護筆記：Node 版本、registry、lockfile 與那些年踩過的坑](/blog/node-package-ecosystem/)

## 相關連結

- [npm Docs — config](https://docs.npmjs.com/cli/using-npm/config "另開新視窗"){target="_blank"}
- [npm Docs — npm ci](https://docs.npmjs.com/cli/commands/npm-ci "另開新視窗"){target="_blank"}
- [pnpm — 設定（pnpm-workspace.yaml）](https://pnpm.io/settings "另開新視窗"){target="_blank"}
- [pnpm — 安裝](https://pnpm.io/installation "另開新視窗"){target="_blank"}
- [Yarn — .yarnrc.yml 設定](https://yarnpkg.com/configuration/yarnrc "另開新視窗"){target="_blank"}
- [Node.js — Corepack 文件（v25 起不再隨 Node 發布）](https://nodejs.org/api/corepack.html "另開新視窗"){target="_blank"}
- [Socket — Node.js TSC 投票停止發布 Corepack](https://socket.dev/blog/node-js-tsc-votes-to-stop-distributing-corepack "另開新視窗"){target="_blank"}
