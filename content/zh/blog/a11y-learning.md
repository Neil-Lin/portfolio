---
title: 無障礙網頁設計學習與簡易要點
description: "整理無障礙網頁設計的學習筆記與簡易要點，含公司內部教育訓練文件與完整系列文章，適合想入門數位無障礙的人參考。"
date: 2022-06-07
updatedAt: 2024-07-23
tags:
  - 無障礙網頁設計
  - 無障礙
  - A11Y
  - Accessibility
draft: false
---

2024/07/23：  
製作了公司內[教育訓練文件](https://bpio.gitbook.io/docs/edu-a11y "另開新視窗"){target="_blank"}，覺得自己整理的蠻用心的，所以分享出來。

2023/07/01：完整系列：  
[無障礙網頁設計大叔日記 :: 2022 iThome 鐵人賽](https://ithelp.ithome.com.tw/users/20152260/ironman/5614 "另開新視窗"){target="_blank"}


### 顏色對比
AA：一般大小 4.5:1，大文字或圖 3:1
AAA： 一般大小 7:1，大文字或圖 4.5:1 
(大文字定義： 24px 或是 粗體 19px ）

### 字級
請用相對單位，如 %、em、rem

### 需要有定位點 ::: 和 accesskey
定位點不用太多，主要使用在版面各主要區塊即可。

快捷鍵 accesskey [連結](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey "另開新視窗"){target="_blank"}

### ```<h1>``` 到 ```<h6>```

- 通常網站 Logo 會使用 ```<h1>``` 包起來
- 頁面標題使用 ```<h2>```
- ```<h1>``` 和 ```<h2>``` 一個頁面只能出現一次
- ```<h1>``` 到 ```<h6>``` 需要按順序使用
- ```<h3>``` 到 ```<h6>``` 可以重複

每個網站的用法都不一樣，而我們的建議是：

- 因為 ```<h1>``` 只能出現一次，很適合用在網站 logo 上，輔以整個網站的名稱作為描述。
- 頁面標題使用 ```<h2>```，整個頁面的重點，所以只出現一次就好。
- 章節依序使用 ```<h3>``` 至 ```<h6>```

### 跳至主要區塊

需要製作「跳至主要區塊」 按鈕，方便跳過每頁都會重複出現的區域。

### 回頂端

要注意焦點是否有跟著跳回去。

### ```<noscript>```

如果瀏覽器關閉了 javascript，最好使用 ```<noscript>```content```</noscript>``` 顯示內容。因為現代網站幾乎都有 javascript， 目前已經沒有此項規定，但建議還是可以順手做，至少真的關閉時，還有一些提示。

### SEO

- 頁籤標題
- 頁面描述
- favicon
- 社群分享圖片

### title=””

```<a>``` ```<iframe>``` 必要時需要有 title=”” ，如果 ```<a>``` 是另開視窗，則要使用
target=”_blank” 並且加入 rel=”noreferrer noopener” 和 “另開視窗” 文字。

```<svg>``` 標題要寫在接續在```<svg>```之後，如：

```html
<svg>
  <title></title>
  …
</svg>
```

若 svg 僅僅是圖示，可以使用 ```aria-hidden=”true”``` ```focusable=”false”``` 但因為還是要描述，所以可以再之後補上```<span class=”visually-hidden”>description</span> ```補充。

### alt=””
```<img>``` 需要有 alt=”” 屬性。 如果是裝飾性質的圖片（沒有實質意義），還是要寫但沒有值， ```alt=”” ```。

alt 屬性文字內容主要可以根據圖片以及其上下文內容而決定，一般建議最多 150 個字以下，但這沒有任何根據。[參考資料](https://css-tricks.com/just-how-long-should-alt-text-be/ "另開新視窗"){target="_blank"}

### ```<label for=”id”>```

在表單內，使用 label 時，for 屬性必須對應到內容的 id。

### visually-hidden
```<button>``` 必須要有內容，設計時可善加利用 visually-hidden 以及 
aria-hidden。

### ```<th>```

```<table>``` 的 ```<th>``` 需要標註是欄或列： ```<th scope=”row/col”>```。

### download

下載的檔案不可依賴特定文書商用軟體，且在連結裡要使用 title 寫出完整檔名，例如：```<a title=”操作手冊.pdf”>```

### focus 狀態

focus 狀態都要很明顯，焦點提示區域與其相鄰的顏色需具有 3：1 的對比度，且大於選單4.5:1，若無，另外還有至少 2px 厚。

### 非文字圖示

非文字對比需大於 3:1

### 網站導覽

若網站有「網站導覽」頁面連結，建議進入網站後，擺在 3 個步驟內就可以把注目焦點放在「網站導覽」頁面連結上。

### 放大

確保畫面放大或「只放大文字」200% 畫面都不會破版（firefox 有此設定）

### Font Awesome

[使用說明](https://fontawesome.com/how-to-use/on-the-web/other-topics/accessibility "另開新視窗"){target="_blank"}

常用icon：Font Awesome 關於無障礙的使用方式 )

### 這些文字設定之下，仍保有外觀完整性

- line-height 1.5 以上
- letter-spacing 0.14rem 以上
- word-spacing 0.16rem 以上
- 段落間距 font-size*2

以上 此為英文，中文也可先根據此距離斟酌使用。

### 驗證機制

根據 W3C ，目前仍然沒有完美的方式，但有以下建議：

如果業主可以不用使用輸入框，推薦使用 google recaptcha v3
若業主想要使用輸入框形式，則根據[參考資料](https://accessibility.ncc.gov.tw/Questions/Detail/100?Category=21 "另開新視窗"){target="_blank"}，有 3 種方式選擇：

- 需要有驗證圖形與聲音提示
- 寄送 email，如 [hcaptcha](https://www.hcaptcha.com/accessibility "另開新視窗"){target="_blank"}
- 撥打客服電話取得驗證碼

### 色盲

建議至少針對紅綠色盲做設計。

### 行動裝置方向

除非是有其必要性，否則不可以鎖定行動裝置方向，例如學習鋼琴 app，就是有其橫向的必要性。

### autocomplete

善用 autocomplete 屬性，方便使用者快速填入過去常使用的值。
密碼請使用 autocomplete=”new-password”，避免意外填寫現在的密碼。

### 聲音

非語音的聲音 < 語音音訊 20 分貝

### 連結

非連結盡量不要用底線。

### 影片

不要自動播放、可以加上字幕。

### 必要時使用多種提示引導

避免只使用單一種方式，例如圖表除了顏色外，可以加上圖樣來區別。