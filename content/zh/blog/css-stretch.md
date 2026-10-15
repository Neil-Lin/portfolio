---
title: "width: 100% 為什麼會撐破容器？用 stretch 撐滿剛剛好"
description: "元素有 margin 的時候，width: 100% 會撐出容器，box-sizing 也救不了。width: stretch 是「撐滿剩下的空間」，會自動扣掉 margin，也是 -webkit-fill-available 的標準名稱。這篇用互動範例比較 100%、calc() 和 stretch，整理它在按鈕、輸入框、flex、grid 裡的行為，也用放大 400% 的寬度檢查了這個網站。"
date: 2026-10-14
tags:
  - CSS
  - 前端開發
  - 無障礙
  - 瀏覽器支援
category: frontend
translationKey: css-stretch
draft: false
---

> 話說在前頭：文中的行為我在 Chromium 141 和 153 上實測過，兩個版本結果一樣。其他瀏覽器的支援狀況請以 caniuse 為準。有講錯的地方歡迎指正。

## 前言

想讓一個元素撐滿容器，第一個想到的通常是 `width: 100%`。大部分時候它都沒問題，直到元素有了 margin：

```css
.card {
  width: 100%;
  margin: 0 1rem;
}
```

這張卡片會比容器寬，**往右溢出兩倍的 margin**。在寬螢幕上可能只是右邊多了一點點，但畫面放大到 400%、寬度只剩 320px 時，就變成整頁出現橫向捲軸。WCAG 1.4.10「重排」要求的，正是放大到這個寬度時不需要橫向捲動。

[CSS 與 HTML 技巧清單](/blog/css-techniques-checklist)裡的 `stretch` 尺寸關鍵字，就是在解決這件事。

先看一下你的瀏覽器支援度：

::feature-support{features="stretch" notice="你的瀏覽器不支援 width: stretch，下方範例選 stretch 時會退回 auto。"}
::

## 一、為什麼 100% 會撐破？

`width: 100%` 的意思是「寬度等於容器內容區的 100%」，**margin 不算在裡面**，會再額外加上去。

大家很熟的 `box-sizing: border-box`，只能把 padding 和邊框算進寬度裡，管不到 margin。我實測一個 400px 的容器，裡面放一個 `width: 100%`、左右 margin 各 20px 的元素：

| 寫法 | 元素寬度 | 結果 |
|---|---|---|
| `width: 100%`（content-box），加上 5px 邊框、10px padding | 430px | 溢出 69px |
| `width: 100%` 加 `box-sizing: border-box` | 400px | 還是溢出 40px，就是兩邊的 margin |
| `width: stretch` | 360px | 剛好塞滿 |

以前的補救方法是 `width: calc(100% - 2rem)`，自己把 margin 扣掉。但 margin 一改，`calc()` 就要跟著改，很容易忘記。

## 二、width: stretch：撐滿剩下的空間

```css
.card {
  width: stretch;
  margin: 0 1rem;
}
```

`stretch` 的意思是「讓 margin 外緣剛好貼齊容器」，也就是容器寬度扣掉 margin 之後剩下的空間。margin 改多少，它都會自動算好。

下面的範例可以切換元素和寫法，再拉動 margin 試試：

::stretch-demo
::

可以這樣玩：

1. `<div>` 選 `100%`：溢出的量剛好是兩邊 margin 的總和。
2. 換成 `calc(100% - 2rem)`：margin 剛好是 2rem 左右時會塞滿，但把 margin 拉大或拉小，就又溢出或留空了。
3. 換成 `stretch`：不管 margin 拉到多少，都剛好塞滿。
4. 選 `<button>` 或 `<input>`，再選 `auto`：它們預設不會撐滿，這就是以前要寫 `100%` 的原因。換成 `stretch` 一樣剛好塞滿。

## 三、按鈕和輸入框最常用到

`<div>` 這類區塊元素，`width: auto` 本來就會撐滿，而且會扣掉 margin，所以通常不用寫寬度。真正需要 `stretch` 的，是預設只有內容寬的元素：

- **按鈕**：手機版常見的「整排按鈕」。
- **輸入框**：表單欄位撐滿整欄。

我實測一個 `width: 100%`、`box-sizing: border-box`、左右 margin 各 20px 的 `<input>`，在 400px 的容器裡會溢出 40px；改成 `width: stretch` 就剛好 360px。

另外 `max-width: stretch` 也很好用：一個寫死 `width: 600px`、有 margin 的元素放進 400px 的容器，加上 `max-width: stretch` 之後被限制在 360px，不會撐破。以前常寫的 `max-width: 100%` 一樣會被 margin 推出去。

## 四、在不同排版裡的行為

| 情況 | 實測結果 |
|---|---|
| 容器有 padding | 撐滿容器的內容區，不會蓋到 padding |
| `height: stretch`，容器有固定高度 | 撐滿高度，扣掉上下 margin |
| `height: stretch`，容器高度是 auto | 跟 `auto` 一樣，由內容決定 |
| 絕對定位加 `width: stretch; height: stretch` | 撐滿定位的容器 |
| grid 項目，加了 `justify-self: start` | 還是撐滿格子 |
| flex 項目（橫排） | 先當作容器的寬度，再跟其他項目一起被壓縮，不是「剩下的空間」 |
| 圖片、表格、inline-block | 都會撐滿 |
| `<span>` 這類 inline 元素 | 沒有作用，inline 元素本來就不吃 width |

flex 那一列要特別注意：在橫排的 flex 裡想「吃掉剩下的空間」，還是要用 `flex: 1`，不是 `width: stretch`。

## 五、不支援的時候

`stretch` 是標準名稱，以前各家瀏覽器有自己的私有寫法：Chromium 和 Safari 是 `-webkit-fill-available`，Firefox 是 `-moz-available`。

```css
.button {
  width: 100%; /* 最後的備案 */
  width: -webkit-fill-available;
  width: -moz-available;
  width: stretch;
}
```

瀏覽器會用它看得懂的最後一行。我實測 Chromium 141 兩種寫法都支援，結果一樣是 360px；Firefox 的 `-moz-available` 我這邊沒辦法測。

## 六、檢查這個網站

我用 320×256 的視窗（模擬 1280×1024 的螢幕放大 400%），把這個網站的 83 個頁面跑過一次，找出會讓整頁出現橫向捲軸的元素。

- **`width: 100%` 加 margin 的問題：沒有找到。** 網站在 reset 裡已經設定了 `box-sizing: border-box`，padding 和邊框不會撐破；有 margin 又寫 `width: 100%` 的元素，實測都沒有超出容器。
- **找到一個別的問題**：英文版 [hidden="until-found" 那篇](/en/blog/hidden-until-found/)的範例裡，「Collapse all and try again」按鈕寫了 `white-space: nowrap`，英文字比較長，在 320px 寬時撐出畫面 30px。這跟 `stretch` 無關，我把 `nowrap` 拿掉，讓文字可以換行就修好了。

所以這次網站沒有需要改成 `stretch` 的地方。不過以後寫按鈕、輸入框要撐滿時，我會直接寫 `stretch`，不再寫 `100%` 加 `calc()`。

## 結論

整理成幾句話：

- `width: 100%` 不含 margin，有 margin 時一定會撐破容器；`box-sizing: border-box` 只管得到 padding 和邊框。
- `width: stretch` 撐滿容器扣掉 margin 後的空間，margin 怎麼改都會自動算好。
- 最常用在按鈕、輸入框這類預設不撐滿的元素；`max-width: stretch` 也能防止固定寬度的元素撐破。
- 橫排 flex 裡要吃剩下的空間，還是用 `flex: 1`。
- 不支援時，前面加上 `-webkit-fill-available`、`-moz-available` 當備案。

撐破容器的那幾十 px，在放大畫面的使用者眼中就是一條橫向捲軸。少寫一個 `calc()`，也少一個放大時出錯的機會。

## 延伸閱讀

- [放大之後，置中的內容上半部不見了？用 safe center 讓它捲得到](/blog/css-safe-alignment/)
- [收合的內容，為什麼按 Ctrl+F 找不到？聊聊 hidden="until-found"](/blog/hidden-until-found/)
- [現代 CSS 與 HTML 技巧整理清單：115 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

## 相關連結

- [MDN — width](https://developer.mozilla.org/en-US/docs/Web/CSS/width "另開新視窗"){target="_blank"}
- [CSS Box Sizing Module Level 4 — stretch](https://drafts.csswg.org/css-sizing-4/#sizing-values "另開新視窗"){target="_blank"}
- [WCAG 2.2 — 1.4.10 重排](https://www.w3.org/WAI/WCAG22/Understanding/reflow "另開新視窗"){target="_blank"}
- [Can I use（瀏覽器支援度查詢）](https://caniuse.com "另開新視窗"){target="_blank"}
