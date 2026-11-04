---
title: "前端套件管理的維護筆記：Node 版本、registry、lockfile 與那些年踩過的坑"
description: "現代前端專案開起來很快，但 Node 版本、套件來源、lockfile、版本範圍這些細節沒顧好，維護時才會發現事情大條。這篇是我多年筆記的 2026 年改寫版：nvm 與替代工具、registry 切換、依賴更新、快取與 lockfile 的正確處理、npm ci、audit、版本號規則與 overrides，並標出哪些舊做法已經不建議。"
date: 2026-11-04
tags:
  - npm
  - pnpm
  - Node.js
  - 前端開發
  - 資訊安全
category: frontend
translationKey: node-package-ecosystem
draft: true
---

> 這篇是我舊筆記的改寫版，原筆記有些出處當時沒留下，若你發現原始文章，歡迎告訴我補上。指令與預設值都對照 npm 12、pnpm 12 的官方文件或實際執行過。

現代前端開發入門很快，但 Node 版本、套件來源、lockfile、版本範圍這些細節沒顧好，維護時才會發現事情大條。npm、pnpm、Yarn 的比較見[另一篇](/blog/package-managers-2026/)。

## 1. 鎖定 Node 版本

專案的套件常常會綁 Node 版本，所以 Node 本身也要鎖。**不要直接從官網下載安裝檔**，裝了就只有一個版本，換專案時很難切換。

### nvm

最多人用的是 nvm（目前版本 v0.40.8）。macOS／Linux 安裝：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
```

安裝腳本會自動把載入 nvm 的設定加進 shell 設定檔（例如 `~/.zshrc`）。重開終端機後就能使用：

```bash
nvm install 26        # 安裝 Node 26 的最新版
nvm use 26            # 切換到 Node 26
nvm ls                # 列出已安裝的版本
nvm alias default 26  # 設定新開終端機時的預設版本
```

在專案根目錄放一個 `.nvmrc`（內容寫 `26`），進到專案資料夾後打 `nvm use` 就會切到正確版本。

### 其他選擇

| 工具 | 特色 |
|---|---|
| fnm | 用 Rust 寫的，速度快；讀 `.nvmrc` 和 `.node-version`，從 nvm 搬過來不用改檔案 |
| mise | 除了 Node，也能管理 Python、Ruby 等其他語言的版本 |
| pnpm 12 | 在 `package.json` 的 `devEngines.runtime` 指定 Node 版本，pnpm 會下載並驗證官方簽章；沒指定時讀 `.nvmrc` 或 `.node-version` |
| ~~Volta~~ | **已停止維護**，官方 repo 已標示，原本的使用者多半搬到 mise |

### 讓專案「拒絕」錯的版本

光是有 `.nvmrc`，別人不切版本也能照裝。要強制檢查，在 `package.json` 寫 `engines`：

```json
"engines": { "node": ">=26 <27" }
```

再打開嚴格檢查：npm 是 `.npmrc` 的 `engine-strict=true`；pnpm 要寫在 `pnpm-workspace.yaml` 的 `engineStrict: true`。**pnpm 不讀 `.npmrc` 裡的這一行**，我實測過：寫在 `.npmrc` 時，Node 22 照樣能安裝。

## 2. 鎖定套件管理工具的版本

Node 鎖了，npm／pnpm 本身也要鎖。在 `package.json` 寫：

```json
"packageManager": "pnpm@12.16.1"
```

以前 Node 內建的 Corepack 會讀這個欄位自動下載對應版本，但 **Node 25 起不再內建 Corepack**。需要的話要自己 `npm i -g corepack`；用 pnpm 的話，pnpm 自己也會讀這個欄位。

## 3. 切換套件來源（registry）

公司有私有套件庫，或某些套件要從其他來源下載時，需要切換 registry。

以前我會裝 [nrm](https://github.com/Pana/nrm) 來快速切換。但仔細想想，我們要的只是「換來源」，不一定要多裝一個工具。2023 年我就遇過 nrm 的依賴 `open` 升到 9.0.0 後出錯，只好安裝時手動指定 `open@8.4.2` 才能用。

現在我的做法是：**只有私有套件走私有來源，其他維持預設**。在專案的 `.npmrc`：

```ini
# 只有 @mycompany 開頭的套件從公司的套件庫下載
@mycompany:registry=https://npm.mycompany.com/
```

不用整個切換，就不會發生「忘了切回來，結果安裝到奇怪來源」的問題。也可以用指令設定：

```bash
npm config set registry https://registry.npmjs.org/                # 預設來源
npm config set @mycompany:registry https://npm.mycompany.com/      # 指定 scope
```

- **pnpm** 也讀 `.npmrc` 的 registry 設定，我實測過可以。
- **Yarn 4** 不讀 `.npmrc`，要寫在 `.yarnrc.yml` 的 `npmRegistryServer` 和 `npmScopes`。

## 4. 更新依賴套件

### 先看有哪些可以更新

```bash
npm outdated     # pnpm outdated 也一樣
```

會列出目前版本、版本範圍內最新的版本、以及所有版本中最新的版本，讓你自己判斷要不要更新。

### 一次全部升到最新（非常危險，慎用）

我有時候就是會腦筋一熱，直接把所有東西升到最新版，再回頭處理相容性問題。可以用 [npm-check-updates](https://github.com/raineorshine/npm-check-updates)：

```bash
npx npm-check-updates -i    # 互動模式，逐一選擇要升級哪些
```

pnpm 內建就有：`pnpm update -i --latest`；Yarn 4 則是 `yarn upgrade-interactive`。

**建議用互動模式，一次升一小批**，每批跑完測試再繼續。全部一起升，壞掉時很難知道是哪個套件造成的。

### 新版本先等一天

2026 年的供應鏈攻擊，常見手法是盜用維護者帳號、發布惡意新版本，趁還沒被發現時讓自動化流程安裝。所以現在三個工具都有「發布冷卻期」：新版本發布未滿一段時間，就先不安裝。pnpm 12 和 Yarn 4 預設就是 24 小時；npm 要自己在 `.npmrc` 打開（`min-release-age=1`，單位是天）。

## 5. 刪掉 node_modules 重裝還是錯？先別刪 lockfile

舊筆記裡寫：「刪掉 node_modules 再 `npm install` 還是錯，是因為有快取，所以要同時刪掉 node_modules 和 package-lock.json，再 `npm cache clean --force`。」

**現在我不建議這樣做**，原因有兩個。

**1. 快取幾乎不會是問題**
npm 官方文件寫得很清楚：快取會在寫入和讀出時都驗證完整性，資料壞掉會自動重新下載，所以**除了要釋放硬碟空間，沒有理由清快取**。想檢查快取，用：

```bash
npm cache verify
```

快取位置：macOS／Linux 在 `~/.npm`，Windows 在 `%LocalAppData%\npm-cache`。舊筆記寫的 `AppData\Roaming` 是錯的。

**2. 刪 lockfile 等於重新解析所有依賴**
lockfile 記錄的是「現在能動的這組版本」。刪掉後重裝，所有依賴（包括你沒碰過的間接依賴）都會跳到版本範圍內的最新版。原本的問題可能消失，但很可能多出一堆新問題，而且你不知道變了什麼。

比較好的順序：
1. 只刪 `node_modules`，用 `npm ci` 照 lockfile 重裝。
2. 還是不行，用 `npm ls <套件名稱>` 找出是哪個套件、哪個版本出問題。
3. 只更新那個套件（`npm install <套件>@<版本>`），讓 lockfile 只改這一部分。

舊筆記提到「lockfile 裡可能有奇怪的連結，例如本機的 192.168.X.X」：這是之前切到私有來源時安裝，lockfile 記下了那個來源的網址。解法是用上一節的 scope 設定，不要整個切換 registry。

## 6. npm ci 和 npm install 的差別

| | `npm install` | `npm ci` |
|---|---|---|
| 依據 | `package.json`，必要時更新 lockfile | **必須有** `package-lock.json` |
| lockfile 和 package.json 不一致時 | 更新 lockfile | 直接報錯結束，不改任何檔案 |
| 安裝單一套件 | 可以 | 不行，只能整個專案一次裝 |
| 已有 node_modules | 保留並更新 | 先整個刪掉再安裝 |
| 會不會寫入 package.json／lockfile | 會 | 絕對不會 |

**CI 和部署一律用 `npm ci`**：保證裝出來的版本跟 lockfile 一模一樣，不會因為某個套件剛發布新版就裝到不同的東西。

pnpm 對應的是 `pnpm install --frozen-lockfile`（在 CI 上是預設行為）；Yarn 4 是 `yarn install --immutable`。

## 7. 常用的 scripts（以 Nuxt 為例）

| 指令 | 用途 |
|---|---|
| `npm run dev` | 本機開發伺服器 |
| `npm run build` | 打包成有伺服器的版本（SSR），輸出到 `.output` |
| `npm run generate` | 打包成靜態網站（SSG），沒有伺服器端，適合個人網站、部落格 |
| `npm run preview` | 預覽打包後的結果，最接近正式環境 |

**`preview` 很重要**：開發模式和正式版的行為不完全一樣。無障礙檢查、`<ClientOnly>` 包住的內容，都建議用 `preview` 檢查。我自己就遇過開發模式滿是警告、正式版卻完全乾淨的情況。

pnpm 可以省略 `run`：`pnpm dev`、`pnpm build`。

## 8. npm audit：檢查已知漏洞

```bash
npm audit                       # 列出有已知漏洞的套件
npm audit --json                # 以 JSON 輸出
npm audit fix                   # 在版本範圍內自動升級到修正版
npm audit fix --dry-run --json  # 只顯示會做什麼，不實際修改
npm audit fix --package-lock-only  # 只改 lockfile，不動 node_modules
npm audit fix --omit=dev        # 不處理 devDependencies（舊寫法是 --only=prod）
npm audit signatures            # 檢查套件的 registry 簽章與來源證明
```

**`npm audit fix --force` 要非常小心**：它會為了修漏洞直接升級主版號（例如 2.x → 3.x），很可能讓專案壞掉。先用 `--dry-run` 看清楚再決定。

`npm audit` 回報的漏洞不一定都會影響你。例如只在開發工具裡、而且需要特殊輸入才會觸發的漏洞，對靜態網站可能沒有實際風險。看到警告先讀內容，不要反射性地 `--force`。

pnpm 是 `pnpm audit`；Yarn 4 是 `yarn npm audit`。

## 9. 用 npx 執行，不污染電腦環境

有些工具只想跑一次，或只想在某個專案用，不想全域安裝：

```bash
npx npm-check-updates     # 下載到暫存區執行，不會全域安裝
```

pnpm 是 `pnpm dlx`（pnpm 12 可簡寫成 `pnx`）；Yarn 4 是 `yarn dlx`。

要注意：npx 執行的是當下下載的版本，等於直接跑網路上的程式碼。不熟的套件名稱先查一下，避免打錯字裝到名稱相近的惡意套件。

## 10. Mac 上 node-gyp 安裝失敗

有些套件含有 C/C++ 原生程式碼，安裝時要用 node-gyp 編譯。在 Mac 上失敗，最常見的原因是沒裝 Xcode 命令列工具：

```bash
xcode-select --install
```

舊筆記寫的「修改 `~/.node-gyp/<版本>/include/node/common.gypi` 裡的 `MACOSX_DEPLOYMENT_TARGET`」是當年的特定問題，**現在不建議手動改 node-gyp 的檔案**。

好消息是，現在很多原生套件（例如 `better-sqlite3`、`sharp`）都附預先編譯好的檔案，大部分情況不需要在本機編譯。如果用 pnpm，記得這類套件可能要加進 `allowBuilds` 才會執行安裝腳本。

## 11. package.json 的版本號規則

版本號的格式是 `主版號.次版號.修訂號`（A.B.C）：

| 寫法 | 意思 | 例子 |
|---|---|---|
| `^1.2.2` | 鎖住第一個不是 0 的數字 | `>=1.2.2 <2.0.0` |
| `~1.2.2` | 鎖住次版號 | `>=1.2.2 <1.3.0` |
| `1.2.2` | 完全固定 | 只能是 1.2.2 |

**`^` 遇到 0 開頭的版本會變得更嚴格**，舊筆記沒寫到這點：

| 寫法 | 範圍 |
|---|---|
| `^0.2.3` | `>=0.2.3 <0.3.0`（等於 `~`） |
| `^0.0.3` | 只能是 0.0.3 |

因為 0.x 版本代表還不穩定，任何次版號更新都可能有破壞性變更。

預發布版本的排序：

```
1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-alpha.beta < 1.0.0-beta < 1.0.0-beta.2 < 1.0.0-beta.11 < 1.0.0-rc.1 < 1.0.0
```

**要不要用 `save-exact` 固定版本？**
`save-exact=true` 會讓 `npm install` 寫入固定版本（不加 `^`）。但真正鎖住版本的是 lockfile，只要有 commit lockfile、CI 用 `npm ci`，`^` 也不會裝到意外的版本。固定版本的缺點是每個小修正都要手動升級。我的看法：**應用程式靠 lockfile 就夠了；要發布給別人用的套件，更不該寫死，否則會造成使用者的依賴衝突**。

## 12. peerDependencies

`peerDependencies` 是在解決這個問題：「如果你要用我，你的專案裡最好也裝了 X、Y、Z。」例如 Vue 的元件套件會把 `vue` 寫在 peerDependencies：它需要 Vue，但不應該自己再裝一份。

npm 7 起會自動安裝 peerDependencies，版本衝突時直接報錯。看到錯誤時，網路上常見的解法是加 `--legacy-peer-deps`，但它是讓 npm **完全忽略** peerDependencies，回到 npm 3～6 的行為，只是把問題藏起來。先看清楚是哪兩個套件要求的版本衝突，再決定要升級哪一邊。

## 13. 用 overrides 強制指定間接依賴的版本

依賴的套件裡面，有一個它依賴的套件和我們衝突，或有已知漏洞但上游還沒修，可以在 `package.json` 強制指定版本：

```json
"overrides": {
  "套件名稱": "版本號"
}
```

這是臨時解法，**記得寫下原因、之後回來拿掉**。比較好的做法還是找出是哪個套件造成衝突，等上游修正或換套件。

| 工具 | 寫法 |
|---|---|
| npm | `package.json` 的 `overrides` |
| pnpm | `pnpm-workspace.yaml` 的 `overrides` |
| Yarn | `package.json` 的 `resolutions` |

## 14. .npmrc 範例（2026 年版）

舊筆記的範例是用 ChatGPT 產生的，這次逐項對照 npm 12 的文件重寫：

```ini
# --- 來源 ---
# 預設來源（本來就是這個，可以不寫）
registry=https://registry.npmjs.org/
# 只有公司的套件走私有來源
# @mycompany:registry=https://npm.mycompany.com/

# --- 驗證：token 一律用環境變數，絕對不要寫死在檔案裡 ---
# //npm.mycompany.com/:_authToken=${NPM_TOKEN}

# --- 環境限制 ---
# Node 版本不符合 package.json 的 engines 就拒絕安裝
engine-strict=true

# --- 供應鏈防護 ---
# 新版本發布未滿 1 天不安裝（單位是天）
min-release-age=1
# 不准從 git、網址安裝依賴（npm 12 預設就是 none）
allow-git=none
allow-remote=none
# 有未核准的安裝腳本時，安裝直接失敗（核准清單寫在 package.json 的 allowScripts）
strict-allow-scripts=true
```

跟舊版的差別：
- **拿掉 `save-exact=true`**：理由見第 11 節。
- **不建議 `ignore-scripts=true`**：它會擋掉所有安裝腳本，包括正常套件需要的，很容易弄壞專案。改用 `allowScripts` 白名單，只放行確認過的套件。
- **加上供應鏈防護**：但要確認 CI 上的 npm 版本支援這些設定。npm 碰到不認得的設定會直接忽略，**不會報錯**。

### 設定的優先順序

npm 讀設定的順序，由高到低（上面的會覆蓋下面的）：

1. 指令列參數（例如 `--registry=…`）
2. 環境變數（`npm_config_` 開頭，例如 `npm_config_registry`）
3. 專案設定檔：`專案目錄/.npmrc`，通常跟著 git 版控
4. 使用者設定檔：`~/.npmrc`（Windows 在 `C:\Users\使用者名稱\.npmrc`），放個人的 token
5. 全域設定檔：`$PREFIX/etc/npmrc`，很少用
6. npm 內建預設值

想知道現在實際套用了哪些設定：

```bash
npm config list      # 列出有改過的設定
npm config ls -l     # 列出全部設定，包含預設值
```

**pnpm 和 Yarn 不完全照這套規則**：pnpm 12 的主要設定在 `pnpm-workspace.yaml`，`.npmrc` 只讀 registry 這類設定；Yarn 4 只讀 `.yarnrc.yml`。

## 結語

這些細節平常不會出事，出事時通常都是在最忙的時候。我自己的原則濃縮成三句：

- **版本都要鎖**：Node、套件管理工具、依賴，全部鎖住，而且 lockfile 一定要 commit。
- **不要用刪除解決問題**：刪 lockfile、清快取、`--force`、`--legacy-peer-deps`，都是把問題藏起來，不是解決。
- **防護要確認有生效**：設定檔寫了不代表有作用，換工具或升級版本後，實際測一次。

## 延伸閱讀

- [npm、pnpm、Yarn 2026 最新版比較：安全預設值差最多，速度反而是其次](/blog/package-managers-2026/)

## 相關連結

- [npm Docs — config（設定與優先順序）](https://docs.npmjs.com/cli/using-npm/config "另開新視窗"){target="_blank"}
- [npm Docs — npm ci](https://docs.npmjs.com/cli/commands/npm-ci "另開新視窗"){target="_blank"}
- [npm Docs — npm cache](https://docs.npmjs.com/cli/commands/npm-cache "另開新視窗"){target="_blank"}
- [npm Docs — npm audit](https://docs.npmjs.com/cli/commands/npm-audit "另開新視窗"){target="_blank"}
- [npm Docs — package.json 的 overrides](https://docs.npmjs.com/cli/configuring-npm/package-json#overrides "另開新視窗"){target="_blank"}
- [semver 規格](https://semver.org/lang/zh-TW/ "另開新視窗"){target="_blank"}
- [nvm](https://github.com/nvm-sh/nvm "另開新視窗"){target="_blank"}
- [fnm](https://github.com/Schniz/fnm "另開新視窗"){target="_blank"}
- [npm-check-updates](https://github.com/raineorshine/npm-check-updates "另開新視窗"){target="_blank"}
- [pnpm — 設定](https://pnpm.io/settings "另開新視窗"){target="_blank"}
