# 局部語言（lang）盤點與修正計劃

2026-11-26 盤點；同日依本計劃完成修改，結果見文末「執行結果」。目標：一次補齊全站「不同語言片段」的 `lang`（WCAG 3.1.2 局部語言，AA），並加上以後寫文章的規則，避免再漏。

## 判斷規則

**要標**：讀者要用另一種語言念才對的整句、整段或標題。

- 中文頁裡：英文引文、英文介面文字（按鈕、錯誤訊息）、英文文件或文章的標題 → `lang="en"`
- 英文頁裡：中文句子、中文名稱與標題、注音符號 → `lang="zh-Hant-TW"`；簡體字串 → `lang="zh-Hans"`

**不用標**（WCAG 3.1.2 例外）：專有名詞與產品名（VoiceOver、Chrome、EN 301 549）、技術名詞（single-axis scroll container）、程式碼（行內 code、程式碼區塊）、已融入中文的詞（App、Email）。

## 寫法（已在本 repo 實測，`pnpm generate` 後檢查輸出）

| 位置 | 寫法 | 輸出 |
|---|---|---|
| 段落、引言、清單、表格、標題、粗體裡 | `[Plain English sentence.]{lang="en"}` | `<span lang="en">` ✅ |
| 整個連結都是外文 | `[English title](url "另開新視窗"){target="_blank" lang="en"}` | `<a … lang="en">` ✅ |
| 一整段外文 | `::div{lang="en"}` … `::` | `<div lang="en">` ✅ |
| 連結文字裡只標一部分 | `[:span[English]{lang="en"}（中文）](url)` | ❌ `lang` 不見 |
| 連結文字裡用巢狀 span | `[[English]{lang="en"}（中文）](url)` | ❌ 原樣輸出成文字 |

→ 中英混合的連結，改成「外文標題當連結文字、中文說明移到連結後面」：
`[W3C — Media capture HTML elements](url){target="_blank" lang="en"} 規格`

## A. 中文文章裡的英文句子（要標，約 15 處）

| 檔案 | 行 | 內容 | 位置 |
|---|---|---|---|
| 2026-04-a11y-opinion.md | 25 | "Much of the hiring activity is concentrated…" | 引言 |
| a11y-tree-for-who.md | 57 | Last year, before the European Accessibility Act took effect… | 段落（整段英文） |
| ai-sugar.md | 32 | No ARIA is better than Bad ARIA | 引文 |
| css-frame-sizing.md | 148 | It only resizing on domready / load seems like a huge limitation. | 引文 |
| css-stretch.md | 120 | Collapse all and try again | 介面文字 |
| css-text-decoration-inset.md | 75 | If the non-color cue only happens when the mouse hovers… | 引言 |
| html-in-canvas-a11y.md | 93 | Blocked aria-hidden on an element because its descendant retained focus | 主控台訊息 |
| html-usermedia.md | 315 | Use microphone and camera | 介面文字 |
| seo.md | 252 | …and search box internal（連結後面的英文殘句，需要順便改寫） | 清單 |
| zhuyin-ruby-font.md | 76 | the base character is displayed as usual, and the variation selector is invisible | 引文 |
| zhuyin-ruby-font.md | 136 | Many implementations (screen readers, in particular) support only this strategy. | 引文 |

**掃到但屬於例外、不標**：a11y-world-rules、a11y-world-rules-part2 的法規、標準、機構與獎項名稱（ADA Title II、JIS X 8341-3、Ministero delle Imprese…、Tilsynet for universell utforming av ikt、Digital Accessibility Recognition Scheme…）、Global Accessibility Awareness Day、Natural Language Processing、single-axis scroll container、form-associated custom element、Chrome Web Store Developer。seo.md 204 的 `User-agent: Googlebot-image` 應該改成行內 code。

## B. 中文文章裡的英文連結標題（39 篇、203 個）

大多在「相關連結」，少數在內文。全英文 109 個直接加 `lang="en"`；中英混合 94 個要把中文說明移到連結外面再加。完整清單在文末附錄。

## C. 英文文章裡的中文與注音（6 篇，約 60 處）

| 檔案 | 內容 | 標記 |
|---|---|---|
| zhuyin-ruby-font.md | 範例字「行」「一行白鷺」、注音（ㄏㄤˊ…）、字型名稱、「讀音選擇工具」、CodePen 中文標題 | `zh-Hant-TW` |
| web-share-a11y.md | VoiceOver 念的「展開，彈出式選單」「進入彈出式項目，n 個項目」 | `zh-Hant-TW` |
| html-usermedia.md | 按鈕文字對照表：繁體「使用麥克風和攝影機」 | `zh-Hant-TW` |
| html-usermedia.md | 同一張表的簡體「使用麦克风和摄像头」 | `zh-Hans` |
| text-autospace.md | 中英混排的範例句（「用Chrome測試」等） | `zh-Hant-TW`，改完要確認範例的間距呈現沒變 |
| css-text-fit.md | 範例標語「週年慶全館五折」 | `zh-Hant-TW` |
| a11y-world-rules.md | 連結裡的「（EAA 轉化…」 | `zh-Hant-TW`（或移到連結外） |

## D. 網站本身（不在文章裡）

| 位置 | 問題 | 修正 |
|---|---|---|
| `TheFooter.vue` 語言切換連結 | 中文頁的「English」、英文頁的「繁體中文」沒有 `lang`（也沒有 `hreflang`） | 名稱外面包 `lang`，連結加 `hreflang` |
| `TheLangSwitcher.vue` 下拉選單 | 各語言的 `<option>` 沒有 `lang` | `<option :lang="…">` |
| `products/[name].vue` 影片後備文字 | 「您的瀏覽器沒有支援 / Your browser does not support…」中英寫在一起 | 改用 i18n，各語系只放自己的文字 |

`data/*.ts` 的英文欄位、`i18n/lang/en-US.ts` 都沒有中文，不用改。互動範例元件裡需要的 `lang` 已經有了（AriaNotifyDemo、TextAutospaceCompare、TextFitDemo、ZhuyinToggleDemo）。

## E. 防止再漏

1. `ACCESSIBILITY.md`「寫內容時」加一條：上面的判斷規則與寫法（含連結的限制）。
2. 新增不擋 build 的檢查 `scripts/check-lang.mjs`（`pnpm check:lang`）：用這次盤點的規則掃文章，列出「沒標 `lang` 的外文句子與連結標題」當提醒。規則是啟發式的，所以只警告、不讓 CI 失敗。

## 執行順序與驗證

1. D（元件，3 個檔案）→ A、C（手改，約 75 處）→ B（連結，用腳本改，再人工看混合的 94 個）→ E。
2. 每一步後 `pnpm lint`、`pnpm typecheck`、`pnpm generate`、`pnpm test:smoke`。
3. 在 `.output/public` 用 grep 確認 `lang=` 數量與預期一致；抽幾篇用 Chrome 看無障礙樹。
4. text-autospace 英文版的範例截圖比對，確認加 `lang` 後間距沒變。
5. 建議你用 VoiceOver 抽聽 zhuyin-ruby-font 的 W3C 引文，比較加與不加的差別（我沒有實測報讀軟體會不會自己切換語言）。

改的文章建議不加 `updatedAt`：只是補標記，讀者看到的內容沒變。

## 執行結果（2026-11-26）

- D：頁尾語言連結加 `hreflang` 與語言名稱的 `lang`；下拉選單 `<option lang>`；產品頁影片後備文字改用 i18n（`words.videoNotSupported`）。
- A：11 處英文句子加 `[…]{lang="en"}`。seo.md 的 robots.txt 範例行視為程式碼，沒有改。
- C：英文文章 5 篇的中文與注音用腳本標記（簡體 3 處用 `zh-Hans`）；兩個中英混合連結手動處理（CodePen 改成中文標題當連結文字；a11y-world-rules 的「EAA 轉化」是漏翻，改成 EAA transposition）。
- B：中文文章連結：全英文 58 個加 `lang="en"`，中英混合 36 個把英文標題留在連結裡、中文說明移到外面。非英文（義、挪、丹、波、法、芬、葡）的法規與機構名稱、來源名稱（Chrome for Developers、MDN — 屬性名）不標。
- E：`ACCESSIBILITY.md` 加寫作規則；新增 `pnpm check:lang`，目前剩 2 個提醒（義大利文、挪威文的機構名稱，屬例外）。
- 驗證：lint、typecheck、generate、smoke 通過；輸出 HTML 有 149 個 `lang="en"`（中文文章）、英文文章 `zh-Hant-TW` span 109 個、`zh-Hans` 3 個。text-autospace 英文版加 `lang` 後 `text-autospace` 仍是 `normal`，部分範例寬度差 2px 左右，原因是中文改用繁中字型的字形。

## 附錄：中文文章裡的英文連結標題（盤點時的清單）

共 203 個連結，39 篇；全英文 109、中英混合 94

| 檔案 | 行 | 類型 | 連結文字 |
|---|---|---|---|
| a11y-tree-for-who.md | 55 | 全英文 | HOW AI AGENTS SEE YOUR WEBSITE (AND HOW TO BUILD FOR THEM)」 |
| a11y-world-rules-part2.md | 101 | 混合 | Digital Policy Office established today（香港政府新聞公報） |
| a11y-world-rules-part2.md | 103 | 混合 | Digital Policy Office 官網 About Us |
| a11y-world-rules-part2.md | 105 | 混合 | HKIRC — Digital Accessibility Recognition Scheme 2024-2025 開放報名（含主辦/協辦/顧問角色原文） |
| a11y-world-rules-part2.md | 107 | 混合 | HKIRC — Digital Accessibility Recognition Scheme 官方介紹頁 |
| a11y-world-rules-part2.md | 109 | 混合 | DARS 2024-2025 Guide to Application（PDF，評審級別標準） |
| a11y-world-rules-part2.md | 113 | 全英文 | Mada Digital Accessibility Portal — Accredited Websites |
| a11y-world-rules-part2.md | 115 | 混合 | Mada — Policy 頁面（政府 Framework 要求 WCAG 2.0） |
| a11y-world-rules-part2.md | 117 | 全英文 | Crowell & Moring — Qatar Enacts Law No. (22) of 2025 on Persons with Disabilities |
| a11y-world-rules-part2.md | 119 | 全英文 | MSDF — His Highness the Amir Issues Law No. (22) of 2025 on Persons with Disabilities |
| a11y-world-rules-part2.md | 121 | 全英文 | Qatar National e-Accessibility Policy 2011（PDF，MCIT） |
| a11y-world-rules-part2.md | 129 | 全英文 | AgID Linee Guida accessibilità dei servizi（EAA，2026/3） |
| a11y-world-rules-part2.md | 141 | 混合 | Likestillings- og diskrimineringsloven（母法全文，含 §36） |
| a11y-world-rules-part2.md | 143 | 全英文 | Forskrift om universell utforming av IKT-løsninger |
| a11y-world-rules-part2.md | 159 | 混合 | LOV nr 429 af 16/03/2021（現行整合版） |
| a11y-world-rules-part2.md | 165 | 混合 | Ustawa z dnia 4 kwietnia 2019 r.（ISAP 原文） |
| a11y-world-rules-part2.md | 167 | 混合 | Ustawa z dnia 26 kwietnia 2024 r.（波蘭無障礙法／EAA 轉化，ISAP） |
| a11y-world-rules-part2.md | 177 | 混合 | NDA — EU Web Accessibility Directive 監測說明 |
| a11y-world-rules-part2.md | 179 | 混合 | Mason Hayes & Curran — European Accessibility Act 愛爾蘭轉化說明 |
| a11y-world-rules-part2.md | 187 | 混合 | Laki digitaalisten palvelujen tarjoamisesta 306/2019 說明 |
| a11y-world-rules.md | 195 | 全英文 | W3C WAI, Web Accessibility Laws & Policies |
| a11y-world-rules.md | 197 | 全英文 | EU Web Accessibility Directive 2016/2102 |
| a11y-world-rules.md | 199 | 全英文 | European Accessibility Act, Directive 2019/882 |
| a11y-world-rules.md | 201 | 全英文 | EN 301 549（Accessible EU Centre） |
| a11y-world-rules.md | 215 | 混合 | ADA Title II 2024 規則 vs Section 508（WCAG 2.1/2.0 比較，Level Access） |
| a11y-world-rules.md | 227 | 全英文 | Disability Discrimination Act 1992 |
| a11y-world-rules.md | 229 | 全英文 | AHRC, World Wide Web Access: DDA Advisory Notes |
| a11y-world-rules.md | 233 | 混合 | Act on Prohibition of Discrimination against Persons with Disabilities（KLRI 英譯） |
| a11y-world-rules.md | 235 | 全英文 | Seoul, Web Accessibility Quality Mark |
| a11y-world-rules.md | 241 | 混合 | 2024/4/1 合理調整義務化（Anderson Mōri & Tomotsune） |
| a11y-world-rules.md | 255 | 全英文 | BGG / BITV 2.0 / BFSG |
| a11y-world-rules.md | 277 | 混合 | DL 82/2022（EAA 轉化）AMA / acessibilidade.gov.pt |
| a11y-world-rules.md | 289 | 全英文 | Loi du 19 juillet 2018（BOSA） |
| a11y-world-rules.md | 291 | 混合 | Belgian Web Accessibility（監測與申訴） |
| a11y-world-rules.md | 297 | 全英文 | Netherlands Digital Accessibility Laws（Level Access） |
| a11y-world-rules.md | 301 | 混合 | BehiG / 聯邦行政無障礙（bit.admin.ch） |
| accesserty-eco.md | 66 | 混合 | 參考來源：Is Closing the Web Accessibility Design/Development Gap a Bridge Too Far? |
| accesserty-eco.md | 120 | 全英文 | Accesserty on Product Hunt |
| aria-notify.md | 196 | 全英文 | MDN — Element.ariaNotify() |
| aria-notify.md | 197 | 全英文 | MDN — Document.ariaNotify() |
| aria-notify.md | 198 | 全英文 | Microsoft Edge Blog — Creating a more accessible web with Aria Notify |
| aria-notify.md | 199 | 混合 | NVDA issue #20872 — priority "high" 沒有排到前面的回報 |
| css-alpha-revert-rule.md | 203 | 混合 | CSS Color Module Level 5（alpha() 與相對色彩語法） |
| css-alpha-revert-rule.md | 205 | 混合 | CSS Cascading and Inheritance（revert 系列關鍵字） |
| css-attr.md | 248 | 全英文 | Chrome for Developers — CSS attr() gets an upgrade |
| css-attr.md | 249 | 全英文 | WAI-ARIA APG — Meter Pattern |
| css-carousel-a11y.md | 26 | 全英文 | Accesserty UI Kit |
| css-carousel-a11y.md | 212 | 全英文 | Accesserty UI Kit（GitHub） |
| css-carousel-a11y.md | 213 | 全英文 | MDN — ::scroll-marker |
| css-carousel-a11y.md | 214 | 全英文 | MDN — ::scroll-button() |
| css-carousel-a11y.md | 215 | 全英文 | Chrome for Developers — Carousels with CSS |
| css-carousel-a11y.md | 216 | 全英文 | WAI-ARIA APG — Carousel Pattern |
| css-corner-shape.md | 384 | 全英文 | CSS Borders and Box Decorations Level 4（corner-shape） |
| css-corner-shape.md | 385 | 全英文 | MDN — corner-shape |
| css-frame-sizing.md | 160 | 全英文 | W3C — CSS Box Sizing Module Level 4：Responsively-sized iframes |
| css-frame-sizing.md | 161 | 混合 | CSS 工作小組 — Responsively-sized iframes 說明文件 |
| css-frame-sizing.md | 162 | 混合 | WPT — responsive-iframe 測試（含 allow-origins） |
| css-frame-sizing.md | 163 | 全英文 | MDN — frame-sizing |
| css-frame-sizing.md | 164 | 全英文 | MDN — Window.requestResize() |
| css-frame-sizing.md | 165 | 全英文 | MDN browser-compat-data — frame-sizing |
| css-frame-sizing.md | 166 | 混合 | Chromium 原始碼 — html_meta_element.cc（allow-origins 的檢查） |
| css-frame-sizing.md | 167 | 全英文 | WHATWG HTML — Add `<meta name="responsive-embedded-sizing">`（#12444） |
| css-frame-sizing.md | 168 | 混合 | WebKit 標準立場 — Responsively-sized iframes（#653） |
| css-frame-sizing.md | 169 | 混合 | Mozilla 標準立場 — Responsively-sized iframes（#1394） |
| css-frame-sizing.md | 173 | 混合 | WCAG 技術 H64 — 用 title 屬性為 iframe 命名 |
| css-if-function.md | 372 | 全英文 | CSS Values and Units Level 5（if()） |
| css-if-function.md | 373 | 全英文 | CSS Functions and Mixins（@function） |
| css-media-state-pseudos.md | 169 | 混合 | MDN browser-compat-data — Chrome 各版本推出日期 |
| css-media-state-pseudos.md | 170 | 全英文 | MDN browser-compat-data — :playing |
| css-media-state-pseudos.md | 171 | 混合 | Chromium 原始碼 — runtime_enabled_features.json5（CSSMediaElementPseudos） |
| css-safe-alignment.md | 186 | 混合 | MDN — align-items 的 safe 與 unsafe |
| css-safe-alignment.md | 187 | 混合 | CSS Box Alignment Module Level 3 — 溢位對齊 |
| css-single-axis-scroll.md | 224 | 混合 | CSS Overflow Module Level 3 — 單軸捲動容器、overflow 的計算值 |
| css-single-axis-scroll.md | 225 | 混合 | CSS Positioned Layout Module Level 3 — sticky 依方向找捲動容器 |
| css-single-axis-scroll.md | 226 | 全英文 | CSS Scroll Snap Module Level 1 — scroll-padding |
| css-single-axis-scroll.md | 227 | 全英文 | CSS Conditional Rules Module Level 5 — named-feature() |
| css-single-axis-scroll.md | 228 | 混合 | Single-Axis Scroll Containers 說明文件（Google） |
| css-single-axis-scroll.md | 229 | 混合 | Chromium 原始碼 — runtime_enabled_features.json5（SingleAxisScrollContainers） |
| css-single-axis-scroll.md | 233 | 混合 | MDN — ARIA group 角色：可捲動的內容區 |
| css-single-axis-scroll.md | 234 | 混合 | Interop 提案 — Single-axis scroll containers（追蹤各瀏覽器進度） |
| css-stretch.md | 145 | 全英文 | CSS Box Sizing Module Level 4 — stretch |
| css-symbols.md | 156 | 全英文 | W3C — CSS Counter Styles Level 3：symbols() |
| css-symbols.md | 157 | 全英文 | W3C — CSS Counter Styles Level 3：speak-as |
| css-symbols.md | 159 | 混合 | MDN — @counter-style 的 speak-as |
| css-symbols.md | 160 | 全英文 | MDN browser-compat-data — list-style-type |
| css-symbols.md | 161 | 混合 | Chromium 原始碼 — runtime_enabled_features.json5（CSSCounterStyleSymbolsFunction、CSSAtRuleCounterStyleSpeakAsDescriptor） |
| css-symbols.md | 162 | 混合 | Chromium 原始碼 — ax_node_object.cc（清單標記與 speak-as） |
| css-techniques-checklist.md | 237 | 全英文 | MDN Web Docs — CSS |
| css-techniques-checklist.md | 238 | 全英文 | web.dev — Learn CSS |
| css-techniques-checklist.md | 239 | 全英文 | Chrome for Developers — CSS |
| css-techniques-checklist.md | 240 | 全英文 | New in Chrome 150（`text-fit`、`background-clip: border-area`、`focusgroup`） |
| css-techniques-checklist.md | 241 | 全英文 | CSS Gap Decorations Now Available（`row-rule`／`column-rule`／`rule`，CSS-Tricks） |
| css-techniques-checklist.md | 242 | 混合 | New Things You Should Know About HTML Here in Mid 2026（本次 K 區新增項目的來源） |
| css-techniques-checklist.md | 243 | 混合 | Chrome for Developers — `<geolocation>` 元素 |
| css-techniques-checklist.md | 244 | 混合 | Chrome for Developers — `<usermedia>` 元素 |
| css-techniques-checklist.md | 245 | 混合 | Chrome for Developers — `<install>` 元素（origin trial） |
| css-techniques-checklist.md | 246 | 混合 | Apple WWDC26 — HTML Model 元素 |
| css-techniques-checklist.md | 247 | 混合 | web.dev — New to the web platform in September 2026（本次 10 月更新的依據） |
| css-techniques-checklist.md | 248 | 混合 | Safari 27 Release Notes（Apple，本次燈號更新依據之一） |
| css-techniques-checklist.md | 249 | 混合 | Web platform features explorer（Baseline 狀態查詢） |
| css-techniques-checklist.md | 251 | 混合 | WebKit Features for Safari 27.2（`::field-content`、`fit-tolerance`、`safe` 對齊） |
| css-techniques-checklist.md | 252 | 混合 | Chrome 157 的 HTML-in-Canvas（Chrome for Developers） |
| css-techniques-checklist.md | 253 | 全英文 | Useful @custom-media Presets（blog.master.dev） |
| css-text-decoration-inset.md | 139 | 全英文 | W3C — CSS Text Decoration Module Level 4：text-decoration-inset |
| css-text-decoration-inset.md | 140 | 全英文 | MDN — text-decoration-inset |
| css-text-decoration-inset.md | 142 | 全英文 | MDN browser-compat-data — text-decoration-inset |
| css-text-decoration-inset.md | 143 | 混合 | Chromium 原始碼 — runtime_enabled_features.json5（CSSTextDecorationInset） |
| css-text-decoration-inset.md | 148 | 混合 | WCAG 技術 C39 — 用 prefers-reduced-motion 避免動態 |
| css-text-fit.md | 245 | 全英文 | MDN — text-fit |
| css-text-fit.md | 246 | 混合 | CSS fit-width text 說明文件（Google） |
| cui-change-style.md | 88 | 全英文 | Generative UI and Outcome-Oriented Design |
| cui-change-style.md | 121 | 全英文 | Conversational user interface |
| declarative-shadow-dom.md | 191 | 混合 | web.dev — 宣告式 Shadow DOM |
| declarative-shadow-dom.md | 192 | 全英文 | MDN — HTMLTemplateElement.shadowRootMode |
| declarative-shadow-dom.md | 193 | 全英文 | Nuxt — Lifecycle Hooks（render:html） |
| dialog-modern-guide.md | 282 | 全英文 | MDN — HTMLDialogElement.closedBy |
| dialog-modern-guide.md | 283 | 全英文 | MDN — Invoker Commands API |
| dialog-modern-guide.md | 284 | 全英文 | W3C WAI-ARIA APG — Dialog (Modal) Pattern |
| focusgroup.md | 23 | 全英文 | Accesserty UI Kit |
| focusgroup.md | 211 | 混合 | Open UI — Scoped focusgroup 提案 |
| focusgroup.md | 212 | 混合 | WAI-ARIA APG — 在複合元件內管理焦點（roving tabindex） |
| focusgroup.md | 213 | 全英文 | WAI-ARIA APG — Tabs Pattern |
| focusgroup.md | 214 | 全英文 | Accesserty UI Kit（GitHub） |
| html-in-canvas-a11y.md | 165 | 混合 | WICG — HTML-in-Canvas 說明文件 |
| html-in-canvas-a11y.md | 166 | 混合 | Chrome for Developers — Chrome 157 的 HTML-in-Canvas |
| html-in-canvas-a11y.md | 167 | 混合 | Chrome for Developers — HTML-in-Canvas 技術概念 |
| html-in-canvas-a11y.md | 168 | 混合 | Chrome for Developers — 將 HTML 算繪至 2D 畫布 |
| html-in-canvas-a11y.md | 169 | 全英文 | Modern Web Guidance — Expose canvas content to browser features |
| html-in-canvas-a11y.md | 171 | 混合 | W3C — ARIA in HTML（aria-hidden 不能用在可聚焦元素） |
| html-in-canvas-a11y.md | 173 | 全英文 | MDN browser-compat-data — HTMLCanvasElement |
| html-in-canvas-a11y.md | 174 | 混合 | WebKit 標準立場 — html-in-canvas（#630） |
| html-in-canvas-a11y.md | 175 | 混合 | Mozilla 標準立場 — HTML-in-Canvas（#1076） |
| html-in-canvas-a11y.md | 176 | 全英文 | WHATWG HTML — Add HTML-in-Canvas APIs（#11588） |
| html-nested-h1.md | 132 | 混合 | HTML Living Standard — 標題與大綱 |
| html-sethtml.md | 157 | 全英文 | MDN — Element.setHTML() |
| html-sethtml.md | 158 | 全英文 | MDN — HTML Sanitizer API |
| html-sethtml.md | 159 | 混合 | WICG — HTML Sanitizer API 規格 |
| html-sizes-auto.md | 177 | 混合 | MDN — `<img>` 的 sizes 屬性 |
| html-sizes-auto.md | 179 | 混合 | HTML Living Standard — sizes 屬性 |
| html-usermedia.md | 341 | 混合 | Chrome for Developers — `<usermedia>` 元素介紹 |
| html-usermedia.md | 342 | 混合 | W3C — Media capture HTML elements 規格 |
| html-usermedia.md | 343 | 混合 | W3C — Media Capture Elements 說明文件 |
| llm-chat-a11y.md | 24 | 全英文 | IBM Equal Access Accessibility Checker |
| npm-maintenance-notes.md | 94 | 全英文 | npm-check-updates |
| npm-maintenance-notes.md | 285 | 混合 | npm Docs — config（設定與優先順序） |
| npm-maintenance-notes.md | 286 | 全英文 | npm Docs — npm ci |
| npm-maintenance-notes.md | 287 | 全英文 | npm Docs — scripts |
| npm-maintenance-notes.md | 288 | 全英文 | npm Docs — npm cache |
| npm-maintenance-notes.md | 289 | 全英文 | npm Docs — npm audit |
| npm-maintenance-notes.md | 290 | 全英文 | npm Docs — package.json（devEngines、overrides） |
| npm-maintenance-notes.md | 292 | 全英文 | npm Docs — npm install-scripts |
| npm-maintenance-notes.md | 293 | 全英文 | npm Docs — npm outdated |
| npm-maintenance-notes.md | 294 | 全英文 | npm Docs — npm exec（npx） |
| npm-maintenance-notes.md | 295 | 混合 | Node.js 各版本內建的 npm 版本（官方 index.json） |
| npm-maintenance-notes.md | 296 | 混合 | node-gyp — 安裝需求（macOS 需要 Xcode Command Line Tools） |
| npm-maintenance-notes.md | 298 | 全英文 | npm-check-updates |
| package-managers-2026.md | 128 | 全英文 | npm Docs — config |
| package-managers-2026.md | 130 | 混合 | pnpm — 依賴解析設定（minimumReleaseAge、trustPolicy、blockExoticSubdeps） |
| package-managers-2026.md | 132 | 混合 | pnpm — 為什麼用 pnpm（store 與非扁平的 node_modules） |
| package-managers-2026.md | 134 | 混合 | Yarn — .yarnrc.yml 設定 |
| package-managers-2026.md | 135 | 混合 | Node.js 24 文件 — Corepack（v25 起不再隨 Node 發布） |
| package-managers-2026.md | 136 | 混合 | Node.js 各版本內建的 npm 版本（官方 index.json） |
| package-managers-2026.md | 137 | 全英文 | npm Docs — npm install-scripts |
| package-managers-2026.md | 138 | 混合 | pnpm 變更紀錄（GitHub Releases） |
| position-try.md | 210 | 全英文 | MDN — position-try-fallbacks |
| position-try.md | 211 | 全英文 | MDN — @position-try |
| report-website-issue.md | 69 | 混合 | 你知道這是什麼嗎？ Chrome Extension MV3 With Vite |
| report-website-issue.md | 71 | 混合 | Chrome Extension API 筆記 |
| scroll-anchoring.md | 189 | 全英文 | MDN — overflow-anchor |
| scroll-anchoring.md | 190 | 全英文 | MDN — Guide to scroll anchoring |
| scroll-anchoring.md | 191 | 全英文 | web.dev — Cumulative Layout Shift（CLS） |
| seo.md | 183 | 全英文 | Google Search Console |
| seo.md | 267 | 全英文 | Google Search Console |
| seo.md | 268 | 全英文 | Google PageSpeed Insights |
| seo.md | 281 | 全英文 | Google SEO Tutorial for Beginners \| How To SEO A Website Step By Step (2020) |
| seo.md | 282 | 全英文 | On-Page SEO: Anatomy of a Perfectly Optimized Page (2019 Update) |
| seo.md | 284 | 混合 | 01. Nuxt.js 小跑起步 - iT 邦幫忙::一起幫忙解決難題，拯救 IT 人的一天 |
| seo.md | 285 | 混合 | 08. Nuxt 客製《甜點電商》SEO 基本資訊 - iT 邦幫忙::一起幫忙解決難題，拯救 IT 人的一天 |
| seo.md | 288 | 全英文 | Mobile-Friendly Test - Google Search Console |
| seo.md | 290 | 混合 | Google / Yahoo 關鍵字排名查詢 \| 陪您航向未來的好夥伴 - Allstars 星辰網站建置與網頁設計 |
| seo.md | 291 | 全英文 | Free Keyword Rank Checker Tool Online for Google, Yahoo, Bing |
| shadow-dom-reference-target.md | 152 | 全英文 | Accesserty UI Kit |
| shadow-dom-reference-target.md | 213 | 全英文 | Eric Meyer — Targeting by Reference in the Shadow DOM |
| shadow-dom-reference-target.md | 214 | 全英文 | Nolan Lawson — Shadow DOM and accessibility: the trouble with ARIA |
| text-autospace.md | 140 | 全英文 | MDN — text-autospace |
| text-autospace.md | 141 | 全英文 | CSS Text Module Level 4 — text-autospace |
| web-share-a11y.md | 333 | 全英文 | W3C — Web Share API |
| web-share-a11y.md | 334 | 全英文 | MDN — Navigator.share() |
| web-share-a11y.md | 335 | 全英文 | MDN — Navigator.canShare() |
| web-share-a11y.md | 336 | 全英文 | web.dev — Integrate with the OS sharing UI with the Web Share API |
| web-share-a11y.md | 337 | 全英文 | Can I use — Web Share API |
| web-share-a11y.md | 338 | 混合 | WebKit 原始碼 — WKShareSheet.mm |
| web-share-a11y.md | 339 | 混合 | Chromium 原始碼 — render_widget_host_ns_view_bridge.mm |
| web-share-a11y.md | 340 | 混合 | Chromium 原始碼 — chrome_content_renderer_client.cc |
| zhuyin-ruby-font.md | 236 | 混合 | ButTaiwan — bpmfvs 注音 IVS 字型規格 |
| zhuyin-ruby-font.md | 237 | 全英文 | Fontsource — Bpmf Huninn |
| zhuyin-ruby-font.md | 238 | 混合 | CodePen — 使用 ruby、rt 標注音符號（u00hyui） |
| zhuyin-ruby-font.md | 239 | 全英文 | W3C — Bopomofo on the Web（r12a） |
| zhuyin-ruby-font.md | 240 | 混合 | W3C — ruby 朗讀（text-to-speech）需求文件 |
| zhuyin-ruby-font.md | 241 | 全英文 | MDN browser-compat-data — ruby-position |
| zhuyin-ruby-font.md | 242 | 混合 | WebKit Bugzilla — ruby-position: inter-character 沒有正確支援注音 |
| zhuyin-ruby-font.md | 243 | 混合 | Unicode — Variation Sequences FAQ（不支援時顯示原字） |
| zhuyin-ruby-font.md | 244 | 全英文 | MDN — aria-hidden |
