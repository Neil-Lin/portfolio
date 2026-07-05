---
title: 打造 Accesserty — 從搜尋到開發的無障礙網頁之體驗
description: "分享我花約一個月打造的品牌 Accesserty：一套從搜尋體驗到開發測試的無障礙工具生態，用溫和而理性的方式，讓無障礙網頁被看見、被理解、被改善。"
date: 2025-05-23
updatedAt: 2026-01-13
tags:
  - 無障礙網頁設計
  - 無障礙
  - A11Y
  - Accessibility
  - ChromeExtension
draft: false
---

今天想分享我花了一個月左右打造的新品牌：Accesserty

這是一個專注於提升無障礙網頁體驗的小型工具生態，從搜尋體驗到開發測試，試圖用一套溫和、理性的方式，讓這件事被看見、被理解、被改善。

### 起點：對於 Chrome Extension 的好奇

在 2023 年時，我出於對 Chrome Extension 的好奇，製作了名為 Report Website Issues 的擴充程式，並分享[開發過程](/blog/report-website-issue)。

到了 2025 年，隨著大型語言模型（LLM）的普及，我開始思考能否用它來輔助開發更多可實際解決問題的工具，並設法用 LLM 拆分出角色，幫助我在短時間內建構出一個有邏輯又能運作的產品系統。

### 發現問題與痛點

#### 1. 搜尋後，使用者其實不知道該點哪個連結

搜尋引擎雖然會綜合 SEO、速度、內容等因素排序網頁，但這些排序結果並不代表網站「好用」或「易於瀏覽」。
許多網站看似在技術層面表現良好，實際上卻充斥著鍵盤操作困難、結構不明、廣告覆蓋等問題，特別是對使用輔助科技的使用者而言。

我開始思考：能不能在搜尋時就直接看到這個網站的可及性狀況？避免來回點選、浪費時間與耐心，讓瀏覽過程更順暢。

#### 2. 使用者想回報問題，卻「無門可報」

即使使用者發現網站有困難，也常因為找不到聯絡方式、或無法準確描述問題而選擇放棄。

更常見的是客服和使用者之間「認知不同」，像是這個我在之前文章中提到的例子：

例如使用者說「我的鍵盤沒辦法瀏覽你們的網頁」，但客服卻說「我的可以喔，麻煩您再試試」，然後差不多就鬼打牆，兩邊都覺得對方很爛，因為前者是談鍵盤焦點，後者可能只是按向下鍵捲動畫面。

因此我認為需要有一個「中介層」：讓使用者能輕鬆描述問題，讓開發者收到後是可解讀、可處理的資訊。

目前 LLM 雖然可以協助，但仍難以精確理解這類回報或是成本太高。

#### 3. 對開發者而言，無障礙是高成本嗎？

近年因應歐盟無障礙相關法規，各大 UI 框架陸續強化了可及性元件，的確減少了開發成本。
但僅靠機器掃描是否合規遠遠不夠 — — 因為「合規」≠「可用」。

舉例來說：一張圖片是否有 alt 屬性，機器可以檢查；但這個 alt 的內容是否正確傳達圖片意義？還是只有寫「圖片1」？這仍需要人來判斷。

目前即使 LLM 可以做初步描述，也需要 API 費用與極高 prompt 精度，而且幻覺仍是風險。

所以更務實的方式是 — — 在開發過程就提供人工判斷的機會與工具。

這就延伸出一個核心概念：

> 越早期處理可及性問題，成本越低。  
> 從規劃階段讓分析師、設計師、工程師一起考慮無障礙，而不是事後補強。

::figure
  ![67％的無障礙問題來自於設計階段](/images/blog/41.webp)
  ::figcaption
    [參考來源：Is Closing the Web Accessibility Design/Development Gap a Bridge Too Far?](https://www.deque.com/blog/is-closing-the-web-accessibility-design-development-gap-a-bridge-too-far/ "另開新視窗"){target="_blank"}
  ::
::

### 解法開始成形：模擬、檢查、回報

基於上述問題，我開始構思一個流程圖，來整理使用者、開發者、合作方之間的互動關係：
  
:embed{src="https://whimsical.com/embed/NDhUK17ebjwRtaH4kLoMU4" type="application/pdf" width="100%" height="480px"}

從網頁瀏覽者至網頁開發者流程與 Accesserty 產品關係。

我將整體劃分為「預防」與「治療」兩大塊，並嘗試建立一套工具組合，來落實這個想法，完成良好的循環過程達成 Win-Win 的結果。

### 建立 Accesserty 品牌與產品結構

很多 a11y 工具會在電子報宣傳「某公司被罰了多少錢」，我覺得那會讓開發者只想「應付一下」，而不是真的想理解與改善。
所以我與「我的產品經理」（ChatGPT 😎）對話後，確立了品牌核心：

::figure
  ![品牌語氣表](/images/blog/42.png)
  ::figcaption
    品牌語氣：冷靜、理性、透明、參與感強；不做的事：不標籤化、不威脅、不灌分、不做障礙者專屬版本；做的事：對齊通用設計、鼓勵主動改善、打造正向反饋機制
  ::
::

::figure
  ![ChatGPT 專案](/images/blog/43.webp)
  ::figcaption
    我發現 ChatGPT 現在可以幫我建立「專案資料夾」的模式。  我可以先給它一份專案的背景說明，然後針對不同專業角色，分別開啟對話，例如設計師、工程師、開發者。  像我就會把流程圖截圖放進專案中，再從這個共同檔案延伸出多個角色視角。
  ::
::

等到跟「產品經理」確定各種細節之後，便開啟其他三個專家：AppSheet、Chrome Extension、Web Component，利用 Vibe Coding 的方式，將產品產生出來。架構如下：

- Accesserty Signal — 讓 Google 搜尋結果顯示網頁可及性狀態  
[簡介](https://accesserty.com/signal/ "另開新視窗"){target="_blank"}  
[下載 Chrome 擴充程式](https://chromewebstore.google.com/detail/accesserty-signal/jabgpbgdmhdmibhogmcjfinnkcngcelc "另開新視窗"){target="_blank"}  
- Accesserty DevCheck — 模擬無障礙情境與自動檢查問題（如色盲模擬、Axe-core devtool 等）  
[簡介](https://accesserty.com/devcheck/ "另開新視窗"){target="_blank"}  
[下載 Chrome 擴充程式](https://chromewebstore.google.com/detail/accesserty-devcheck/ompbhahmipenipgiiiehbkiibkonoeec "另開新視窗"){target="_blank"}  
- Accesserty UI Kit — 提供通過可及性設計的 Web Component 元件  
[簡介](https://accesserty.com/uikit "另開新視窗"){target="_blank"}  
[Github](https://github.com/Accesserty/UI-Kit "另開新視窗"){target="_blank"}  
[CSS 模擬器](https://accesserty.com/uikit/playground "另開新視窗"){target="_blank"}  
- Accesserty Pulse — 專注於捕捉使用者『操作挫折』的服務。  
[簡介](https://accesserty.com/pulse "另開新視窗"){target="_blank"}  

整體系統皆由我一人開發，搭配 ChatGPT 輔助，以最低維運成本打造。

### 發佈與展望

今年的 GAAD（Global Accessibility Awareness Day）這天(每年五月的第三個星期四)，在 Product Hunt 上發佈了：

[Accesserty on Product Hunt](https://www.producthunt.com/posts/accesserty "另開新視窗"){target="_blank"}

希望讓更多人知道，改善無障礙，不一定需要複雜的團隊與大量預算。
只要設計得當、工具使用得當，從搜尋、開發到回報，其實都可以是透明且正向的。
如果你也是在意這個議題，或者你在瀏覽網站時也曾有過「不知道要點哪個」的猶豫，歡迎看看 Accesserty [連結](https://accesserty.com "另開新視窗"){target="_blank"}。

如果你也曾在使用網站時感到困擾，希望這套產品能帶來一些幫助。歡迎在 Accesserty 留言告訴我你的想法，也很期待未來合作或改進的可能！

### 參考

- [GAAD](https://accessibility.day/ "另開新視窗"){target="_blank"}
