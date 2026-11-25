---
title: 幫網頁上的國字加注音：ruby 和注音字型怎麼選，按一下就出現注音要注意什麼
description: "網頁上標注音有兩種做法：HTML ruby 把注音寫成文字，注音字型（bpmfvs）把注音畫在字型裡。這篇實測書寫方向、報讀軟體、頁內搜尋與破音字的差異，整理「按一下才出現注音」的做法，以及什麼情況該用哪一種。"
date: 2026-11-26
tags:
  - HTML
  - CSS
  - 前端開發
  - 無障礙
  - 瀏覽器支援
  - 字型
translationKey: zhuyin-ruby-font
category: accessibility
draft: false
---

> 話說在前頭：這篇由 AI 協助收集資料、整理與實測，我再閱讀確認。文中的行為是在 macOS 的 Chrome 158（headless）實測的，VoiceOver 搭配 Chrome 由我自己實際聽；規格、官方說法與支援度以文末連結的 W3C 文件、MDN、WebKit Bugzilla 與 bpmfvs 專案說明為依據。Firefox 與 Safari 我沒有實測。有講錯的地方歡迎指正。

## 它解決什麼

我想做故事網頁：平常只有國字，按一下按鈕，每個字的右邊就出現注音，這樣小孩也能自己讀。課本、繪本也可以用同一套做法。

網頁上幫國字標注音，目前有兩條路：

- **HTML ruby**：注音用 `<rt>` 寫在 HTML 裡，是文字。
- **注音字型**：注音畫在字型的字形裡，HTML 只有國字。破音字靠字後面一個看不見的「異體字選擇符」切換讀音。

兩條路都做得到「按一下出現注音」，但書寫方向、報讀軟體、搜尋、破音字的表現都不一樣。

## 一、HTML ruby：注音是文字

```html
<ruby>兩<rt>ㄌㄧㄤˇ</rt></ruby><ruby>個<rt>˙ㄍㄜ</rt></ruby>
```

規格上讓注音直排在字右側的寫法是 `ruby-position: inter-character`，但目前不能依賴：

- MDN 的相容性資料標示 Chrome、Edge、Firefox 都**不支援**，只有 Safari 18.2 起標示為部分支援。
- Safari 18.2 的發布說明寫支援了，但 W3C 的 Richard Ishida（r12a）在 WebKit Bugzilla 回報：注音會排在字的右側，但調號沒有放進另一欄，位置也不對。
- 我在 Chrome 158 實測：`getComputedStyle()` 拿到的還是 `over`，瀏覽器根本不認得這個值，注音仍然在字的上方。

先看一下你的瀏覽器：

::feature-support{features="ruby-inter-character" notice="你的瀏覽器不支援 ruby-position: inter-character，ruby 的注音只能排在字的上方。"}
::

注音的聲調位置也是麻煩：二、三、四聲要在最後一個注音符號的右側，輕聲要在最上方。瀏覽器的 ruby 排版是照日文假名的習慣設計的，我在 Chrome 158 實測直書：三聲 ˇ 被轉了 90 度、排在 ㄤ 的下面，輕聲的點和後面的注音之間也空了一大段。

所以要做到課本格式，實務上要自己寫 CSS 和 JS 修。CodePen 上有一份完整的示範（u00hyui 的〈使用 ruby、rt 標注音符號〉），做法是：

- 用 JS 把每個 `<rt>` 最後的調號包成 `<span class="tone">`，輕聲另外加 class。
- 直書：把調號轉回來、再用 `transform` 移到正確位置。
- 橫書、注音在右：每個字各包一個 `<ruby>`，把 `<rt>` 改成 `display: inline-block; width: 1em`，注音就被擠成直排、排到字的右邊。

這套做法的位移數值是照特定字型和字級調出來的，換字型就要重調。

## 二、注音字型：注音畫在字型裡

字嗨（ButTaiwan）的 bpmfvs 是一份注音字型規格。字型裡每個字已經畫好注音，破音字用 Unicode 的 IVS（異體字選擇符）選讀音：在字的後面接一個選擇符，就換成另一個讀音的字形。

```html
<!-- 「行」後面接 U+E01E1 -->
<p style="font-family: 'Bpmf Huninn'">銀行&#xE01E1;</p>
```

我用 Fontsource 的 Bpmf Huninn（`@fontsource/bpmf-huninn` 5.3.1）實測「行」的幾個選擇符：

| 寫法 | 顯示的注音 |
|---|---|
| 行 | ㄒㄧㄥˊ（預設讀音） |
| 行 + U+E01E0 | 沒有注音 |
| 行 + U+E01E1 | ㄏㄤˊ |
| 行 + U+E01E2 | ㄒㄧㄥˋ |
| 行 + U+E01E3 | ㄏㄤˋ |

選擇符本身是文字，所以複製貼上時讀音不會掉。用一般字型顯示時，選擇符看不見、只顯示國字，這是 Unicode 對變體序列的規定：不支援時「the base character is displayed as usual, and the variation selector is invisible」。我在 Chrome 158 用一般字型顯示同一段文字，畫面確實只有國字。

破音字要靠工具：bpmfvs 提供「讀音選擇工具」，把文章貼進去，它會自動預選讀音，再讓人手動修正，完成後複製出來使用。

支援 bpmfvs 的開源字型有源泉注音圓體、源樣注音明體、源流注音明體與黑體、源雲注音明體、源石注音黑體，以及字嗨注音標楷、宋體、黑體。

## 三、書寫方向與注音位置

| 情境 | 注音字型 | HTML ruby |
|---|---|---|
| 直書，注音在右 | 字型內建直排功能（`vert`、`vrt2`），我在 Chrome 158 實測注音在右、位置正確 | 注音會在右側，但調號被轉 90 度、位置不對，要用 JS 修 |
| 橫書，注音在右（課本格式） | 字型本來就是這樣設計 | 要逐字包 `<ruby>`、強制 `<rt>` 直排、手動定位調號 |
| 橫書，注音在上方 | 做不到 | 瀏覽器預設就是這樣 |

## 四、互動範例

按「顯示注音」，兩種做法同時切換。ruby 用 CSS 把 `<rt>` 顯示或藏起來；注音字型只換 `font-family`，而且字型等第一次按下按鈕才載入。

::zhuyin-toggle-demo
::

核心寫法：

```html
<button type="button" aria-pressed="false">顯示注音</button>
<p class="story ruby-story">
  <ruby>銀<rt aria-hidden="true">ㄧㄣˊ</rt></ruby><ruby>行<rt aria-hidden="true">ㄏㄤˊ</rt></ruby>
</p>
<p class="story font-story">銀行&#xE01E1;</p>
```

```css
/* ruby：關閉時 display: none */
.ruby-story rt { display: none; }
.zhuyin-on .ruby-story rt { display: revert; }

/* 注音字型：只換 font-family */
.zhuyin-on .font-story { font-family: "Bpmf Huninn", sans-serif; }
```

```js
let fontState = "idle";
btn.addEventListener("click", async () => {
  const on = btn.getAttribute("aria-pressed") !== "true";
  btn.setAttribute("aria-pressed", String(on));
  demo.classList.toggle("zhuyin-on", on);
  // 第一次打開才載入注音字型
  if (on && fontState === "idle") {
    fontState = "loading";
    const face = new FontFace("Bpmf Huninn", 'url(/fonts/bpmf-huninn.woff2) format("woff2")');
    document.fonts.add(await face.load());
    fontState = "loaded";
  }
});
```

切換按鈕用 `aria-pressed` 表示開關狀態，按鈕文字保持不變。範例裡的字型是我用 fontTools 從 Fontsource 版本裁出來、只含用到的字的子集，約 6 KB，放在自己的網站上。

## 五、實測：報讀軟體拿到什麼

W3C 的 ruby 朗讀需求文件寫，很多實作（特別是報讀軟體）只支援國字和注音都念：「Many implementations (screen readers, in particular) support only this strategy.」所以我看了 Chrome 158 的無障礙樹。

結果跟我原本以為的不一樣：Chrome 不會把注音夾在國字中間，而是把 `<rt>` 從無障礙樹拿掉，改成整個 `<ruby>` 的**描述（description）**。

| 寫法 | Chrome 158 無障礙樹 |
|---|---|
| 一個 `<ruby>` 包整句，`<rt>` 沒加屬性 | 文字是「一」「行」「白」，`<ruby>` 的描述是「ㄧˋ」，**只有第一個字的注音** |
| 每個字各包一個 `<ruby>`，`<rt>` 沒加屬性 | 每個 `<ruby>` 各有自己的描述：「ㄧˋ」「ㄏㄤˊ」「ㄅㄞˊ」 |
| `<rt aria-hidden="true">` | 只有國字，描述是空的 |
| `<rt>` 被 `display: none` 藏起來 | 只有國字，描述是空的 |
| 注音字型（含選擇符） | 「一行白鷺」，選擇符也在文字裡，但看不見 |

- ruby 的注音會以描述的形式交給報讀軟體。整句包一個 `<ruby>` 時只剩第一個注音；逐字各包一個 `<ruby>`，每個字的注音才都在。
- 注音字型的注音是字形，不是文字，報讀軟體拿不到。我用 VoiceOver 搭配 Chrome 實際聽，只念國字，沒有念注音。
- 選擇符雖然在文字裡，VoiceOver 沒有念出任何奇怪的東西。

## 六、實測：頁內搜尋

我用 Chrome 158 的 `window.find()` 找「一行白」。`window.find()` 不完全等於使用者按 Ctrl+F，這裡只當參考。

| 寫法 | 找得到「一行白」嗎 |
|---|---|
| 注音字型（「行」後面有選擇符） | 找得到 |
| ruby，注音顯示中 | 找不到 |
| ruby，`<rt>` 用 `display: none` 藏起來 | 找得到 |

ruby 在注音顯示時，`<rt>` 的文字夾在字中間，連續的詞就搜尋不到。

## 七、網頁字型要注意的地方

- **檔案大小**：Fontsource 的 Bpmf Huninn 繁體中文整包 woff2 約 1.4 MB。範例裡是只含用到的字的子集，而且等按下按鈕才載入。
- **預設的 `index.css` 會把字型切成很多份**：5.3.1 版的 `index.css` 有 106 個 `@font-face`，每份用 `unicode-range` 限定字元，範圍裡沒有選擇符的碼位（U+E0100 起）。我在 Chrome 158 實測，用預設 `index.css`，「行 + U+E01E1」仍然正確顯示 ㄏㄤˊ。Firefox、Safari 沒有實測，保險起見可以改用 `chinese-traditional.css`，整包一個檔案。
- **Fontsource 的版本只保留 IVS**：我用 fontTools 檢查 5.3.1 版的繁體中文 woff2，`cmap` 裡有 format 14（IVS 用的表，6 個選擇符），但 GSUB 只剩 `vert`、`vrt2`，沒有 bpmfvs 規格裡的文體集（ss01 起）。所以在網頁上只能用 IVS 選讀音，不能用 `font-feature-settings`。
- **自己裁切字型時**：要確認 `cmap` format 14 有保留，不然破音字會全部變回預設讀音。我用 `pyftsubset` 裁範例的子集時，把選擇符的碼位（U+E01E0–E01E5）一起放進 `--unicodes`，format 14 就有保留下來。

## 八、破音字

兩種做法都要先決定每個破音字的讀音：

- **注音字型**：用 bpmfvs 的讀音選擇工具，它會自動預選，再人工確認。
- **ruby**：可以用 g2pW 批次產生。g2pW 是玉山金控與高師大研究者發表的模型（INTERSPEECH 2022），會依整句上下文判斷讀音，輸出注音，例如「銀行」的「行」是 `ㄏㄤ2`、「行動」是 `ㄒㄧㄥ2`。聲調是數字，要自己轉成 ˊ、ˇ、ˋ、˙。
- g2pW 的結果也可以轉成 IVS 選擇符，給注音字型用（要自己建讀音與選擇符的對照表）。

## 九、無障礙重點

### 1. 用 ruby 時，`<rt>` 加 `aria-hidden="true"`

注音顯示時，Chrome 會把注音交給報讀軟體當描述。對報讀軟體使用者來說，國字已經傳達意思，注音是輔助發音；念出「ㄏ、ㄤ、二聲」幫助不大。W3C 的 ruby 朗讀需求文件也提到，中文的注音（臺灣）和拼音（中國）通常是輔助發音用的，只念國字通常就夠了。

- 只加在 `<rt>`，不要加在 `<ruby>`，不然連國字都藏掉了。
- 有用 `<rp>` 括號的話，也一起加。
- 注音關閉時用 `display: none` 就已經離開無障礙樹，MDN 也說這時不該再加 `aria-hidden`。

### 2. 用注音字型時不需要額外處理

注音不是文字，報讀軟體只會念國字。

### 3. 報讀軟體念破音字，不會照你選的讀音

報讀軟體用自己的語音引擎判斷讀音，應該不會參考字型裡選定的注音（這點我沒有實測）。

### 4. 開關按鈕

- 用 `<button>` 搭配 `aria-pressed`，按鈕文字不要跟著狀態換；看得到的開啟狀態要另外用樣式表示（範例用外框和勾號）。
- 記住使用者的選擇，下次進來不用再按一次。
- 打開注音時，字級和行高也要跟著放大，注音才看得清楚。

### 5. 頁面語言

`<html lang="zh-Hant-TW">`，報讀軟體才會用中文語音念。英文頁面裡的中文故事，要在那一段加上 `lang="zh-Hant-TW"`。

## 什麼時候用哪一種

| 需求 | 建議 | 原因 |
|---|---|---|
| 排版品質要接近課本 | 注音字型 | 聲調位置由字型設計好 |
| 橫書、注音在右 | 注音字型 | ruby 要大量手動定位，各瀏覽器結果不同 |
| 只幫生字或部分字標注音 | ruby | 字型一套用，每個字都會有注音 |
| 注音要另外設計（顏色、大小、高亮、點了發音） | ruby | 注音是 DOM 元素，可以單獨控制 |
| 同時標台語、客語或拼音 | ruby | 字型要另外找對應的專案 |
| 要用指定的品牌字型 | ruby | 注音字型只能用支援 bpmfvs 的字型 |
| 在意頁面載入速度 | ruby | 注音字型繁中整包約 1.4 MB（woff2），不過內容固定時可以裁成子集 |
| 內容量大，或給 CMS 編輯 | 注音字型 | 內容是純文字，編輯不用寫標記 |
| 內容要複製到 Word 或簡報 | 注音字型 | 選擇符是文字，複製不會掉 |
| 頁內搜尋要找得到 | 注音字型 | ruby 在注音顯示時搜尋不到連續的詞 |

## 結論

要做到「按一下出現注音、注音在字右邊」，注音字型最省事：開關只要換 `font-family`，報讀軟體只念國字，搜尋也找得到，代價是字型檔大、字型選擇少。需要逐字控制注音，或要用自己的品牌字型時，再用 ruby，記得在 `<rt>` 加 `aria-hidden="true"`。

兩種做法都還有沒實測的部分：Firefox 與 Safari 的顯示、NVDA 的念法、複製貼上的結果。

## 延伸閱讀

- [中英文之間要不要打空白？text-autospace 讓瀏覽器自動補間距](/blog/text-autospace/)
- [用 symbols() 自訂清單符號：報讀軟體現在念的和以後念的，可能都不是你想的](/blog/css-symbols/)
- [一顆分享按鈕取代一整排社群圖示：Web Share API 與無障礙](/blog/web-share-a11y/)

## 相關連結

- [ButTaiwan — bpmfvs 注音 IVS 字型規格](https://github.com/ButTaiwan/bpmfvs "另開新視窗"){target="_blank"}
- [Fontsource — Bpmf Huninn](https://fontsource.org/fonts/bpmf-huninn/about "另開新視窗"){target="_blank"}
- [CodePen — 使用 ruby、rt 標注音符號（u00hyui）](https://codepen.io/u00hyui/pen/ZEXvrEZ "另開新視窗"){target="_blank"}
- [W3C — Bopomofo on the Web（r12a）](https://r12a.github.io/scripts/bopomofo/ontheweb "另開新視窗"){target="_blank"}
- [W3C — ruby 朗讀（text-to-speech）需求文件](https://w3c.github.io/ruby-tts-req/ "另開新視窗"){target="_blank"}
- [MDN browser-compat-data — ruby-position](https://github.com/mdn/browser-compat-data/blob/main/css/properties/ruby-position.json "另開新視窗"){target="_blank"}
- [WebKit Bugzilla — ruby-position: inter-character 沒有正確支援注音](https://bugs.webkit.org/show_bug.cgi?id=285694 "另開新視窗"){target="_blank"}
- [Unicode — Variation Sequences FAQ（不支援時顯示原字）](https://unicode.org/faq/vs.html "另開新視窗"){target="_blank"}
- [MDN — aria-hidden](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-hidden "另開新視窗"){target="_blank"}
- [g2pW — 中文破音字判讀模型](https://github.com/GitYCC/g2pW "另開新視窗"){target="_blank"}
- [justfont blog — 免費注音字型教學與讀音選擇工具](https://blog.justfont.com/?p=17053 "另開新視窗"){target="_blank"}
