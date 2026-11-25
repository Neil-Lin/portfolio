# 注音（ruby 與注音字型）研究紀錄

2026-11-25。初稿由維護者在另一台電腦用 Claude 整理，這裡記錄查證結果與本站版本的修改。

文章：`content/zh|en/blog/zhuyin-ruby-font.md`（`translationKey: zhuyin-ruby-font`，草稿）。
範例：`app/components/content/ZhuyinToggleDemo.vue`；字型子集 `public/vendor/bpmf-huninn/5.3.1/`（OFL-1.1，`OFL.txt` 一起放）。
特性偵測：`useFeatureSupport.ts` 的 `ruby-inter-character`。

## 查證方式

- 讀原文：bpmfvs、g2pW README，W3C ruby-tts-req，Unicode VS FAQ，MDN aria-hidden（mdn/content 原始檔），MDN BCD `css/properties/ruby-position.json`，WebKit bug 285694，justfont 文章，r12a〈Bopomofo on the Web〉，HTML Ruby Markup Extensions WD 2026-01-15。
- 字型：npm 下載 `@fontsource/bpmf-huninn` 5.3.1，用 fontTools 4.60 檢查。
- 瀏覽器：本機 Chrome 158 headless，DevTools 協定截圖、讀無障礙樹、`window.find()`。

## 初稿錯誤（已在本站版本修正）

| 初稿 | 查證 |
|---|---|
| caniuse 標示 Chrome、Edge 部分支援 `inter-character` | BCD：Chrome（含 Edge）`version_added: false`（crbug 40201012），Firefox 不支援，Safari 18.2 `partial_implementation`。Chrome 158 `getComputedStyle().rubyPosition` 回傳 `over`，不認得這個值 |
| 無障礙樹：ruby 未加屬性時是「一 ㄧˋ 行 ㄏㄤˊ 白 ㄅㄞˊ」 | Chrome 158：`<rt>` 被忽略，注音變成 `Ruby` 節點的 description。一個 `<ruby>` 包整句時只有第一個 `<rt>`（「ㄧˋ」）成為描述；逐字各包一個 `<ruby>`，每個都有自己的描述。`aria-hidden` 與 `display: none` 時描述為空 |
| g2pW「直接輸出注音」，「行」判成 ㄏㄤˊ | README 範例輸出 `'ㄏㄤ2'`，聲調是數字 |
| 範例「按下按鈕才載入字型」 | 初稿範例其實內嵌子集、延遲載入的程式碼被註解掉。本站範例改成第一次打開才用 `FontFace` 載入自架子集 |

## 確認正確

- `inter-character` 在 Chrome 158 橫書時注音仍在上方；直書 ruby 的 ˇ 被轉 90 度、排在 ㄤ 下方，輕聲點與後面注音之間有空隙（截圖）。
- 注音字型直書（`writing-mode: vertical-rl`）注音在右、位置正確。
- Bpmf Huninn「行」：預設 ㄒㄧㄥˊ；E01E0 無注音；E01E1 ㄏㄤˊ；E01E2 ㄒㄧㄥˋ；E01E3 ㄏㄤˋ（截圖；cmap14 對應 `uni884C.ss00`–`ss03`）。一般字型只顯示國字。
- Fontsource 5.3.1：繁中 woff2 1.4 MB；`index.css` 106 個 `@font-face`，`unicode-range` 都不含 U+E0xxx，Chrome 158 仍正確顯示 ㄏㄤˊ；`chinese-traditional.css` 只有 1 個 `@font-face`、沒有 `unicode-range`；cmap format 14 有 E01E0–E01E5 共 6 個選擇符；GSUB 只有 `vert`、`vrt2`。
- `window.find('一行白')`：注音字型找得到；ruby 顯示注音（含 `aria-hidden`）找不到；`display: none` 找得到。
- 引文：ruby-tts-req「Many implementations (screen readers, in particular) support only this strategy.」，以及中文注音／拼音通常是輔助發音；Unicode FAQ「the base character is displayed as usual, and the variation selector is invisible」；MDN：`display: none` 的元素不該加 `aria-hidden`。
- WebKit bug 285694 由 r12a 回報，內容是 Safari 18.2 的 `inter-character` 沒有正確處理注音調號。
- bpmfvs 字型清單與「讀音選擇工具」與 README 一致；justfont 文章說讀音選擇工具「可自動預測讀音」。
- g2pW 作者單位：搜尋結果為玉山金控（E.SUN Financial Holding）與高師大，沒有直接讀到論文的單位欄位。

## 沒有查證到（本站版本已刪除或保留原說法）

- 「原始 TTF 約 4.7 MB」：Fontsource 套件沒有 TTF，找不到出處 → 刪除。
- CodePen（u00hyui）的「2021 年底備註」「userAgent 判斷 Safari」：CodePen 擋自動抓取 → 刪除這兩句，保留做法說明。
- VoiceOver + Chrome 念注音字型只念國字：維護者在另一台電腦實測，保留。

## 範例字型子集

```bash
pyftsubset bpmf-huninn-chinese-traditional-400-normal.woff2 \
  --unicodes="<範例用字>,U+E01E0-E01E5" \
  --layout-features='vert,vrt2' --flavor=woff2 \
  --output-file=bpmf-huninn-demo-subset.woff2
```

範例用字：「小明走過銀行，看見很多行人。」（5,760 bytes）。cmap14 保留，「行」+E01E1 顯示 ㄏㄤˊ；GSUB 的 `vert`、`vrt2` 因為這些字沒有直排替代而被移除，範例只用橫書。範例裡每個字的注音字型讀音都和 ruby 的注音一致（截圖比對）。

`@nuxt/fonts` 會掃 CSS 裡的 `font-family` 並產生備用字型，直接在 CSS 寫 `"Bpmf Huninn Demo"` 會讓建置失敗（lightningcss「Invalid empty selector」），所以字型名稱由元件以 `--zhuyin-demo-font` 傳入。

## 待實測

- [ ] Firefox、Safari 的顯示（ruby、注音字型、`index.css` 切片時的 IVS）。
- [ ] VoiceOver 念 ruby（Chrome 的 description）實際聽到什麼；NVDA。
- [ ] 複製貼上到 Word：選擇符是否保留。
