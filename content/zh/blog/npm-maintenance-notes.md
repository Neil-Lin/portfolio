---
title: "npm 維護筆記：Node 版本、套件來源、lockfile 與常見問題"
description: "前端專案開起來很快，但 Node 版本、套件來源、lockfile、版本範圍沒顧好，維護時才會出問題。整理 npm 專案從環境設定到日常維護會用到的做法：鎖定 Node 與 npm 版本、私有套件來源、更新依賴、安裝出錯時的處理順序、npm ci、scripts、audit、版本號規則、overrides 與 .npmrc。"
date: 2026-11-04
tags:
  - npm
  - Node.js
  - 前端開發
  - 資訊安全
category: frontend
translationKey: npm-maintenance-notes
draft: true
---

> 指令與預設值對照 npm 12 的官方文件，並實際執行過。

前端專案開起來很快，但 Node 版本、套件來源、lockfile、版本範圍這些細節沒顧好，維護時才會發現事情大條。npm、pnpm、Yarn 的比較見[另一篇](/blog/package-managers-2026/)。

## 1. 鎖定 Node 版本

套件常常會綁 Node 版本，所以 Node 本身也要鎖。**不要從官網下載安裝檔**，裝了就只有一個版本，換專案時很難切換。用 nvm 管理（目前版本 v0.40.8）：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
```

安裝腳本會把載入設定加進 shell 設定檔（例如 `~/.zshrc`），重開終端機後：

```bash
nvm install 26        # 安裝 Node 26 的最新版
nvm use 26            # 切換到 Node 26
nvm ls                # 列出已安裝的版本
nvm alias default 26  # 新開終端機時的預設版本
```

在專案根目錄放 `.nvmrc`（內容寫 `26`），進到專案後打 `nvm use` 就會切到正確版本。

`.nvmrc` 只是提示，別人沒切版本也能照裝。要強制檢查，在 `package.json` 寫 `engines`，再於 `.npmrc` 打開 `engine-strict=true`：

```json
"engines": { "node": ">=26 <27" }
```

## 2. 鎖定 npm 版本

npm 隨 Node 內建，但**裝了最新的 Node 不等於用最新的 npm**：Node 26 內建的是 npm 11.20，最新版是 npm 12。要升級：

```bash
npm i -g npm@12
```

`package.json` 的 `devEngines` 可以在執行 `install`、`ci`、`run` 前檢查 Node 和 npm 的版本，不符合就停止：

```json
"devEngines": {
  "runtime": { "name": "node", "version": ">=26", "onFail": "error" },
  "packageManager": { "name": "npm", "version": ">=12", "onFail": "error" }
}
```

`engines` 是檢查「使用這個套件的人」的環境，`devEngines` 是檢查「開發這個專案的人」的環境。

## 3. 私有套件來源

公司有私有套件庫時，**只讓私有套件走私有來源，其他維持預設**，在專案的 `.npmrc`：

```ini
@mycompany:registry=https://npm.mycompany.com/
//npm.mycompany.com/:_authToken=${NPM_TOKEN}
```

- 以 `@mycompany/` 開頭的套件從公司下載，其他照常從 npm 官方下載。不用整個切換 registry，就不會忘了切回來。
- token 一律用環境變數，不要寫死在檔案裡。

也可以用指令設定：

```bash
npm config set @mycompany:registry https://npm.mycompany.com/
```

如果整個切換過 registry 又在那時安裝套件，`package-lock.json` 會記下那個來源的網址（例如內網的 `192.168.x.x`），換個環境就裝不起來。這也是不要整個切換的原因。

## 4. 更新依賴

先看有哪些可以更新：

```bash
npm outdated
```

會列出目前版本（Current）、版本範圍內的最新版（Wanted）與所有版本中的最新版（Latest）。

- **只升到版本範圍內的最新版**：`npm update`。
- **升到最新的主版號**：用 [npm-check-updates](https://github.com/raineorshine/npm-check-updates) 的互動模式，逐一選擇：

  ```bash
  npx npm-check-updates -i
  ```

**一次升一小批，每批跑完測試再繼續。** 全部一起升，壞掉時很難知道是哪個套件造成的。

**新版本先等一天**：供應鏈攻擊常見的手法是盜用維護者帳號、發布惡意新版本，趁還沒被發現時被自動安裝。在 `.npmrc` 設定 `min-release-age=1`（單位是天），發布未滿一天的版本就不安裝。

## 5. 安裝出錯時的處理順序

**不要一出錯就刪 `package-lock.json`。** lockfile 記錄的是「現在能動的這組版本」，刪掉後重裝，所有依賴（包括沒碰過的間接依賴）都會跳到版本範圍內的最新版，原本的問題可能消失，但會多出新問題，而且不知道變了什麼。

建議的順序：

1. 用 `npm ci` 照 lockfile 重裝（它會先刪掉 `node_modules`）。
2. 還是不行，用 `npm ls <套件名稱>` 找出是哪個套件、哪個版本出問題。
3. 只更新那個套件：`npm install <套件>@<版本>`，lockfile 只會改這一部分。

**快取幾乎不會是問題。** npm 的快取在寫入和讀出時都會驗證完整性，資料壞掉會自動重新下載。官方文件寫明：除了要釋放硬碟空間，沒有理由清快取。要檢查快取，用：

```bash
npm cache verify
```

快取位置：macOS／Linux 在 `~/.npm`，Windows 在 `%LocalAppData%\npm-cache`。

## 6. npm ci 與 npm install

| | `npm install` | `npm ci` |
|---|---|---|
| 依據 | `package.json`，必要時更新 lockfile | **必須有** `package-lock.json` |
| lockfile 和 package.json 不一致 | 更新 lockfile | 報錯結束，不改任何檔案 |
| 安裝單一套件 | 可以 | 不行，只能整個專案一次裝 |
| 已有 `node_modules` | 保留並更新 | 先整個刪掉 |
| 會寫入 package.json／lockfile | 會 | 不會 |

**CI 與部署一律用 `npm ci`**，保證裝出來的版本跟 lockfile 完全一樣。

## 7. scripts：自訂指令

`package.json` 的 `scripts` 是自己定義的指令，名稱和內容都可以自訂：

```json
"scripts": {
  "dev": "nuxt dev",
  "build": "nuxt build",
  "lint": "eslint .",
  "check": "npm run lint && npm run test"
}
```

- `npm run <名稱>` 執行；只打 `npm run` 會列出所有可用的 scripts。
- 執行時，`node_modules/.bin` 會加進 PATH，所以可以直接寫 `nuxt`、`eslint`，不用寫完整路徑，也不用全域安裝。
- 要傳參數給指令，加在 `--` 後面：`npm run lint -- --fix`。
- `test`、`start` 可以省略 `run`：`npm test`、`npm start`。
- 名稱前加 `pre`、`post` 會在前後自動執行：定義了 `prebuild`，執行 `npm run build` 時會先跑它。

要注意 `install` 相關的生命週期 scripts（`preinstall`、`install`、`postinstall`）：**依賴套件的這些 scripts 會在你安裝時自動執行**，這正是惡意套件最常用的手法。npm 12 預設會擋下沒核准的，核准清單寫在 `package.json` 的 `allowScripts`：

```bash
npm install-scripts approve esbuild   # 核准後寫入 allowScripts
```

## 8. npm audit：檢查已知漏洞

```bash
npm audit                          # 列出有已知漏洞的套件
npm audit --json                   # 以 JSON 輸出
npm audit fix                      # 在版本範圍內升級到修正版
npm audit fix --dry-run            # 只顯示會做什麼，不實際修改
npm audit fix --package-lock-only  # 只改 lockfile，不動 node_modules
npm audit fix --omit=dev           # 不處理 devDependencies
npm audit signatures               # 檢查套件的 registry 簽章與來源證明
```

**`npm audit fix --force` 要非常小心**：它會為了修漏洞直接升級主版號，很可能讓專案壞掉。先用 `--dry-run` 看清楚。

回報的漏洞不一定會影響你。例如只出現在開發工具裡、需要特殊輸入才會觸發的漏洞，對靜態網站可能沒有實際風險。先讀內容再決定。

## 9. npx：執行一次性工具

只想跑一次、不想全域安裝的工具，用 npx：

```bash
npx npm-check-updates
```

npx 會先找專案 `node_modules/.bin` 裡有沒有，沒有才下載到暫存區執行。下載執行等於直接跑網路上的程式碼，**套件名稱要打對**，避免裝到名稱相近的惡意套件。

## 10. 原生模組編譯失敗

含有 C/C++ 原生程式碼的套件，安裝時要用 node-gyp 編譯。在 Mac 上失敗，最常見的原因是沒裝 Xcode 命令列工具：

```bash
xcode-select --install
```

現在很多原生套件（例如 `better-sqlite3`、`sharp`）都附預先編譯好的檔案，大多不需要在本機編譯。

## 11. 版本號規則

版本號的格式是 `主版號.次版號.修訂號`：

| 寫法 | 範圍 |
|---|---|
| `^1.2.2` | `>=1.2.2 <2.0.0`（鎖住第一個不是 0 的數字） |
| `~1.2.2` | `>=1.2.2 <1.3.0`（鎖住次版號） |
| `1.2.2` | 只能是 1.2.2 |
| `^0.2.3` | `>=0.2.3 <0.3.0`（0 開頭時 `^` 會更嚴格） |
| `^0.0.3` | 只能是 0.0.3 |

0.x 代表還不穩定，任何次版號更新都可能有破壞性變更，所以 `^` 會鎖得更緊。

預發布版本的排序：

```
1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-alpha.beta < 1.0.0-beta < 1.0.0-beta.2 < 1.0.0-beta.11 < 1.0.0-rc.1 < 1.0.0
```

**真正鎖住版本的是 lockfile。** 只要 commit 了 `package-lock.json`、CI 用 `npm ci`，`^` 也不會裝到意外的版本。`save-exact=true`（安裝時寫入固定版本）的代價是每個小修正都要手動升級；要發布給別人用的套件更不該寫死，會造成使用者的依賴衝突。

## 12. peerDependencies

`peerDependencies` 的意思是：「要用我，你的專案裡也要裝 X。」例如 Vue 元件套件把 `vue` 寫在 peerDependencies：它需要 Vue，但不該自己再裝一份。

npm 會自動安裝 peerDependencies，版本衝突時直接報錯。網路上常見的解法 `--legacy-peer-deps`，是讓 npm **完全忽略** peerDependencies，只是把問題藏起來。先看清楚是哪兩個套件要求的版本衝突，再決定升級哪一邊。

## 13. overrides：強制指定間接依賴的版本

依賴的套件裡，有某個間接依賴和專案衝突，或有已知漏洞但上游還沒修，可以在 `package.json` 強制指定版本：

```json
"overrides": {
  "套件名稱": "版本號"
}
```

- 只有專案根目錄的 `package.json` 有效。
- 這是臨時解法，**寫下原因、之後回來拿掉**。根本的做法是找出造成衝突的套件，等上游修正或換套件。

## 14. .npmrc 範例

```ini
# --- 套件來源 ---
# 只有公司的套件走私有來源，token 用環境變數
# @mycompany:registry=https://npm.mycompany.com/
# //npm.mycompany.com/:_authToken=${NPM_TOKEN}

# --- 環境 ---
# Node 版本不符合 package.json 的 engines 就拒絕安裝
engine-strict=true

# --- 供應鏈防護 ---
# 新版本發布未滿 1 天不安裝（單位是天）
min-release-age=1
# 不准從 git、網址安裝依賴（npm 12 預設就是 none）
allow-git=none
allow-remote=none
# 有未核准的安裝腳本時，安裝直接失敗
strict-allow-scripts=true
```

- **不建議 `ignore-scripts=true`**：它會擋掉所有安裝腳本，包括正常套件需要的。用 `allowScripts` 白名單只放行確認過的套件。
- **確認 npm 版本支援這些設定**：npm 碰到不認得的設定會直接忽略，**不會報錯**。CI 上的 npm 版本比本機舊時，防護可能根本沒生效。

### 設定的優先順序

由高到低，上面的會覆蓋下面的：

1. 指令列參數（例如 `--registry=…`）
2. 環境變數（`npm_config_` 開頭，例如 `npm_config_registry`）
3. 專案設定檔：`專案目錄/.npmrc`，通常跟著 git 版控
4. 使用者設定檔：`~/.npmrc`（Windows 在 `C:\Users\使用者名稱\.npmrc`），放個人的 token
5. 全域設定檔：`$PREFIX/etc/npmrc`
6. npm 內建預設值

查看目前套用的設定：

```bash
npm config list      # 有改過的設定
npm config ls -l     # 全部設定，包含預設值
```

## 延伸閱讀

- [npm、pnpm、Yarn 2026 最新版比較](/blog/package-managers-2026/)

## 相關連結

- [npm Docs — config（設定與優先順序）](https://docs.npmjs.com/cli/using-npm/config "另開新視窗"){target="_blank"}
- [npm Docs — npm ci](https://docs.npmjs.com/cli/commands/npm-ci "另開新視窗"){target="_blank"}
- [npm Docs — scripts](https://docs.npmjs.com/cli/using-npm/scripts "另開新視窗"){target="_blank"}
- [npm Docs — npm cache](https://docs.npmjs.com/cli/commands/npm-cache "另開新視窗"){target="_blank"}
- [npm Docs — npm audit](https://docs.npmjs.com/cli/commands/npm-audit "另開新視窗"){target="_blank"}
- [npm Docs — package.json（devEngines、overrides）](https://docs.npmjs.com/cli/configuring-npm/package-json "另開新視窗"){target="_blank"}
- [semver 規格](https://semver.org/lang/zh-TW/ "另開新視窗"){target="_blank"}
- [nvm](https://github.com/nvm-sh/nvm "另開新視窗"){target="_blank"}
- [npm-check-updates](https://github.com/raineorshine/npm-check-updates "另開新視窗"){target="_blank"}
