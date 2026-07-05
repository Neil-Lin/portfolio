---
title: 為什麼我愛上了在設計與切版時使用 Emoji
description: "從無障礙設計的角度探討 icon 對網站視覺與體驗的影響，以及為什麼我在設計與切版時改用 Emoji——越少依賴，越不容易出問題，也更貼心。"
date: 2022-07-02
tags:
  - 無障礙網頁設計
  - 無障礙
  - icon
  - FontAwesome
  - Emoji
draft: false
---

越少依賴，就越不會出問題，且越貼心。

自從專注在無障礙網頁設計之後，始終有一個問題一直盤旋在我的腦海裡，那就是「要如何使用 icon 才能達成好的無障礙設計體驗？」，而在回答這個問題之前，則是要先理解什麼是 icon 以及 icon 會如何影響整個網站視覺。

### 什麼是 icon ?

根據[維基百科](https://zh.wikipedia.org/zh-tw/%E5%9C%96%E7%A4%BA "另開新視窗"){target="_blank"}定義：

> 圖示（icon，中國大陸、香港作圖標）：  
> 廣義上指所有「有指示作用」的標誌，  
> 在中文中，一般指電腦螢幕的桌面上，  
> 用來「指示」使用者執行各種操作的圖像，作為字元顯示的「重要輔助」。  

應該蠻好理解的，也就是「有指示、輔助作用的標誌」。但同時也點出了第一個問題：icon 很常被拿來純裝飾用，或單獨使用。

### icon 會如何影響整個網站視覺？

既然是輔助性質，那當然就是 icon 要去搭配主要視覺。

例如主視覺是可愛、活潑，通常都會搭配圓角、線條相較粗的 icon，如果主視覺偏向精明幹練、專業的話，通常會搭配直角、線條較細的 icon，來保持整個網站風格的一致性。

::figure
  ![icon 風格範例，線條外框類型，可愛圓潤](/images/blog/22.webp)
::

::figure
  ![icon 風格範例，線條外框類型，銳利幹練](/images/blog/23.webp)
::

一樣都是線條類型的icon，第一張圖呈現風格較為可愛圓潤(
  [連結](https://designmodo.com/linecons-free/ "另開新視窗"){target="_blank"} )、第二張圖則銳利幹練(
    [連結](https://docs.microsoft.com/en-us/windows/apps/design/style/icons "另開新視窗"){target="_blank"}
)

所以通常不建議使用兩種以上的 icon 系統，因爲會讓視覺上有怪異的地方，即使是相同系列的 icon，只要粗細不同，體驗就會差異相當大。這裡引出了第二個問題點：切版維護時 icon 不夠用，就會自建或拿別套 icon 來使用。

理解了前兩個問題後，回到了我們的核心問題，因為設計跟切版都會影響到，考量切版層面會碰到比較多問題，所以先從切版的角度切入，最後回頭影響設計實務上會比較合理一點。

先整理一下剛剛碰到的問題：

### 1. icon 很常被拿來純裝飾用，或單獨使用：
如果只是被拿來用成背景裝飾，那不太會有問題，因為就只是個裝飾，不需要去解釋，有問題的會是在單獨使用，在做無障礙網頁設計時，一般建議 icon 與文字一起使用，或是文字在畫面上隱藏，但在報讀軟體中會讀出來。

```html
<!-- icon 與 文字一起使用 -->
<button>
  <span>訂閱電子郵件</span>
  <i class="xxx"></i>
</button>

<!-- 文字在畫面上隱藏，但在報讀軟體中會讀出來 -->
<button>
  <span class="visually-hidden">訂閱電子郵件</span>
  <i class="xxx" aria-hidden="true"></i>
</button>
```

但實務上也會碰到這樣的情況：

```html
<!-- 文字在畫面上隱藏，但在報讀軟體中會讀出來 -->
<button>
  <span class="visually-hidden">訂閱電子郵件</span>
  <svg>
    ...
  </svg>
</button>
```

然後因為 freego 掃描時會去掃 ```<svg>```，會發現沒有 title，然後 svg 的 title 又要放在第一個子項目，所以又要改成：

```html
<!-- 文字在畫面上隱藏，但在報讀軟體中會讀出來 -->
<!-- 文字在畫面上隱藏，但在報讀軟體中會讀出來 -->
<button>
  <span class="visually-hidden">訂閱電子郵件</span>
  <svg>
    <title>email icon</title>
    ...
  </svg>
</button>
```

然後 svg title 又不希望被報讀出來，所以再改一次：

```html
<!-- 文字在畫面上隱藏，但在報讀軟體中會讀出來 -->
<button>
  <span class="visually-hidden">訂閱電子郵件</span>
  <svg aria-hidden="true">
    <title>email icon</title>
    ...
  </svg>
</button>
```

或是乾脆直接在 svg 使用 aria-labelledby：


```html
<!-- 文字在畫面上隱藏，但在報讀軟體中會讀出來 -->
<button>
  <svg aria-labelledby="abc">
    <title id="abc">email icon</title>
    ...
  </svg>
</button>
```

或是直接放棄，就還是維持 icon 搭配文字：

```html
<button>
  <span>訂閱電子郵件</span>
  <svg aria-hidden="true">
    <title>email icon</title>
    ...
  </svg>
</button>
```

相信到這裡你已經發現到，光是這樣一個簡單的情境，就可以使用很多種不同的方式寫出來，甚至還會被規則、掃描軟體所影響，逼得你不得不拐很多彎才能達成。可以參考一下光是無障礙設計，Font Awesome 就得花一大篇幅再寫注意事項。[Font Awesome文件](https://fontawesome.com/docs/web/dig-deeper/accessibility "另開新視窗"){target="_blank"}

### 2. 切版維護時 icon 不夠用，就會自建或拿別套 icon 來使用。

這是很難避免的一種情形，例如客製化的軟體、不講武德的客戶或是專有名詞但又想要有個 icon ，面臨到這種問題時，比較在乎的可能就會自己模擬 icon 風格，畫完送進去類似 icoMoon([連結](https://icomoon.io/ "另開新視窗"){target="_blank"}) 的工具產出 iconfont，再引入到檔案。
而不在乎、趕時間、或是原本使用 fontawesome 但本身 UI Framework 也有提供 icon的情況，就會直接去拿另一套 icon 來引入，就會造成風格混亂。

以上兩個問題，還只是從最源頭的問題發現的，接下來還有實作上的問題，
讓我們來一一釐清。

### 3. 引入一套 iconFont ，就會耗損工時

就拿最常見的 Font Awesome，最新版本還要先到後台設定才能開始引入：

::figure
  ![Font Awesome 6 要先進到設定裡面](/images/blog/24.webp)
::

要進到這裡來，你還得先經過註冊帳號的一系列流程，最後才能拿到手應用。再來，應用時，又有分 Html 、Vue 或是 React。

以 Vue 為例，可能還要先跟團隊決定是要用 component 形式的寫法，或是一樣使用平常比較習慣的寫法 ```<i class=”xxx”></i>```，然後寫程式的期間，後者還會碰到有時候沒轉成 svg 的情形（因為 watch 只有一開始偵測到才變成 svg）。

再來，import 的時候，可能還要專門弄一個 plugin 檔案（Nuxt 專案的話），接著，又可能會碰到 typescript 的問題跟其他問題，因為層層依賴，所以會有各式各樣的 bug 等著。

再再來，每次用的時候，都要把 Font Awesome官網開起來以便隨時查詢代碼、複製代碼或下載圖檔。

再再再來，如果客戶使用環境是不能對外連網，就得把整包載入。

再再再再來，客戶使用的是 IE 為大宗……….

以上這些，如果目前正在閱讀的你是前端設計師/前端工程師，可以回想看看，這些時間是不是都浪費掉了。

我踩過了這些坑，痛到不行。

所以後來團隊在開發 Piman ([連結](https://bpio.gitbook.io/piman/ "另開新視窗"){target="_blank"}) 無障礙 UI 框架和延伸的專案時，我們盡量直接使用 Emoji，為什麼呢？

- 符合使用者當下使用的作業系統、服務：emoji 會隨著不同環境而改變，這是最自然的方式。[查詢 emoji 是否可用](https://emojipedia.org/caniemoji/ "另開新視窗"){target="_blank"}
- 沒有依賴關係：因為是 Unicode。
- 不用需要前置作業：因為是 Unicode 。
- 不用考慮瀏覽器能不能用：因為是 Unicode。
- 不需要考量寫法或是怎麼通過無障礙設計規範：因為是 Unicode。
- 依然可以展現出想表達的意思：例如 page 404 就可以用個尷尬的笑臉，報讀軟體也會把這個「情緒」給表達出來。
- 現代人已經用的非常習慣，甚至取代貼圖了，辨識度佳。
- 可以無痛轉換風格，例如使用 Google Noto Emoji [連結](https://fonts.google.com/noto/specimen/Noto+Emoji "另開新視窗"){target="_blank"}，同樣的使用方式，轉換成不同的風格，不用改寫任何一個 html 內容，只需要引入 font 和寫 font-family。
- 可使用快捷鍵快速尋找。[連結](https://mrmad.com.tw/mac-emoji-shortcut "另開新視窗"){target="_blank"}

當然，缺點也是有的：

- 可能會喪失視覺風格一制性：雖然有這個疑慮，但我個人覺得還好，因為就是視為 emoji 就是個顏文字而已，不是「特別」使用的圖示，所以不太會破壞主視覺。
- 還是解決不了 icon 不夠用的情形，尤其是客製化的情形，而且 Emoji 會隨著環境變化，反而使這個問題更糟，例如在 IE 可能就是黑白，但客製化的 icon 卻是彩色的這種尷尬情況。
- Noto Emoji 載入完畢前，呈現會是系統的 emoji 樣式。
- 舊版本或不同服務可能會缺少某些 Emoji，所以不能挑太特別的使用。[參考資料](https://ccc.technews.tw/2018/07/10/why-emoji-look-different-on-every-platform/ "另開新視窗"){target="_blank"}
- 太多的表情符號會造成困擾，只能適時使用，必要時使用 aria-hidden。[參考資料](https://blog.easterseals.com/emojis-and-accessibility-the-dos-and-donts-of-including-emojis-in-texts-and-emails/ "另開新視窗"){target="_blank"}

結論
我個人還是看好在無障礙網頁設計上使用 Emoji ，總體來說利大於弊，而且能有效降低工時、減少依賴，可以把時間、資源留給優先度更高的事。而在無障礙網頁設計、web3 必定是未來趨勢的前提下，相信 Emoji 的發展會更蓬勃、更多元！

UI 設計師/前端設計師/前端工程師的你會怎麼想這議題呢？歡迎一起討論！