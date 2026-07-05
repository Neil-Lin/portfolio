---
title: LLM Chat Accessibility
description: 因為很好奇，所以想檢測一下主流 LLM Chat 工具在無障礙上的支援程度
date: 2025-04-16
updatedAt: 2025-05-26
tags:
  - 無障礙網頁設計
  - 無障礙
  - A11Y
  - Accessibility
  - LLM
draft: false
---

因為很好奇，所以想檢測一下主流 LLM Chat 工具在無障礙上的支援程度

隨著歐盟的無障礙法規到來，我實在是很好奇最近幾年新出現的 LLM Chatbot 是否能通過無障礙，於是就隨意挑選三個 LLM 記錄一下 2025 目前的狀況。（如果過不了還能在歐盟的國家使用嗎？真是疑惑。）

### 機器掃描

#### 1. 選擇當作基準的測試工具

本來是想簡單一點用 Chrome Devtool 的 Lighthouse ，但會被 Grok 一直擋在機器人檢測的頁面，所以本次選擇 [IBM Equal Access Accessibility Checker](https://chromewebstore.google.com/detail/ibm-equal-access-accessib/lkcagbfjnkomcinoddgooolagloogehp "另開新視窗"){target="_blank"} 的 Chrome Extension 來測試，會選擇的原因是此款擴充程式一來持續在更新，再者可以根據需求選擇檢測規則。

::figure
  ![共有五種選擇，其中三種為 WCAG 2.0, 2.1, 2.2 的 A 與 AA 級，其他兩種為 2.1 和 2.2 各自加上IBM 的額外補充。](/images/blog/35.webp)
::

#### 2. 在未登入的情況下進行測試

因為登入之後可能會因為資料的不同造成差異，所以要以未登入的狀態開始。

::figure
  ![Gork](/images/blog/36.png)
::

::figure
  ![ChatGPT](/images/blog/37.png)
::

::figure
  ![Gemini](/images/blog/38.png)
::

雖然三者首頁有不盡相同，但在聊天的主要視窗大致上是一樣的

### 3. 機器檢測簡易結果

報告明細會區分三種等級，而每個等級又分成：

- Violation：明確的違規
- Needs review：需要人工近一步檢視
- Recommendation：工具建議的做法

::figure
  ![左起 ChatGPT、Gemini、Grok，以簡單的數字來看，Gemini 表現相較優異。](/images/blog/39.png)
::

可以看到在總數上三者並無太大差別，但是在 Violation 方面，Gemini 就相較優異，至少有明顯在程式上處理無障礙，其中 Violation 的部分看起來都是 ```<svg>``` 沒有標記描述之類的。

當然，這樣的機器檢測並不能代表什麼，因為在有些情況下，原本可以使用機器掃描辨別的，可能會因為使用的技術太新或其他原因，導致無法辨別。(例如背景與前景顏色的對比)

所以應該說，連這個都不能通過的話，那就也不需要進一步人工檢測了。

此階段個人認為 Gemini > ChatGPT = Grok

### 人工檢測

開啟作業系統報讀軟體做看看人工檢測以下任務：

- 在首頁輸入問題至聽到回覆結果，並觀察網頁回饋的行為
- 鍵盤遊走
- accesskey
- 標題規則檢測
- 人工顏色檢測
- Landmark
- 跳至主要內容按鈕
- ```<noscript>```
- 其他問題

::figure
  ![三者人工檢測檢核表](/images/blog/39.png)
::

在人工檢測的部分，三者在顏色方面都差不多，保持著簡單的黑色簡單的介面，可惜的是都沒有設定 accesskey，不確定是不需要還是沒有設定。Landmark 也因為是簡單的介面，所以基本都只有 main 而已，感覺應該可以再拆分得更細緻一點。

禁用 js 的情況下，只有 ChatGPT 有顯示畫面，其他兩者都是空白，但即便是有顯示畫面，但是沒有提示使用者可能無法操作，可能會造成更多困擾。

在實際操作 AI 對話的方面，我個人更喜歡 ChatGPT，雖然在鍵盤遊走的部分會有順序不一致的問題，但因為很多動作做完都是回去 Focus 在輸入框，所以倒還好。另外我覺得 Gemini 優於 Grok，因為畢竟是 chatbot ，個人覺得「回覆的狀態」還是最重要的，即便是沒有直接報讀回覆的內容。

### 結論

三者在機器掃描的結果上，Gemini 勝出，但在人工檢測上， ChatGPT 勝出。如果硬要分勝負，我個人覺得 ChatGPT 整體是比較好的，畢竟在主要功能的操作上是非常順暢的，這才是最重要的。

但三者應該都達不到歐盟的標準，所以我很期待之後會有什麼樣的發展。