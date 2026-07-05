---
title: 無障礙網頁的服務對象在改變了嗎？
description: 前不久，Anthropic 工程師 Thariq 在「人類已不再手改程式」的前提下，提到 HTML 比 Markdown 更適合跟 AI 互動這件事。
date: 2026-05-13
tags:
  - Anthropic
  - 社會責任
  - 無障礙網頁
  - Accessibility
  - A11Y
  - AIAgent
  - LLM
  - 數位無障礙
  - 無障礙網頁設計
  - 數位平權
draft: false
---

前不久，Anthropic 工程師 Thariq[連結](https://x.com/trq212/status/2052809885763747935 "另開新視窗"){target="_blank"} 在「人類已不再手改程式」的前提下，提到 HTML 比 Markdown 更適合跟 AI [連結](https://www.bnext.com.tw/article/90893/when-humans-stop-editing-ai-outputs-why-anthropic-engineers-are-switching-from-markdown-to-html "另開新視窗"){target="_blank"} 互動這件事。

我就在想：如果 AI 讀取的是優質的無障礙網頁，它是不是會更容易「理解」這個網站，進而和人類互動，產出更好的結果？

### 先簡單看一下，無障礙網頁做得好有什麼優點？

這裡先引用臺灣「無障礙網路空間服務網」[連結](https://accessibility.moda.gov.tw/ "另開新視窗"){target="_blank"} 整理的幾個重點：

::figure
  ![網站導入無障礙設計 5 大好處](/images/blog/48.webp)
::

> 導入無障礙的五大好處  
> 法規遵循：符合國內法規要求，保障身心障礙者權益，是我們的責任與義務。  
> 擴大服務對象：觸及約 120 萬身心障礙者及高齡族群，提升服務涵蓋率。  
> 組織社會責任(CSR)：展現對社會共融的承諾，提升組織形象與公眾信任。  
> 提升使用者體驗：良好的無障礙設計能讓網站更易用，提升所有使用者的滿意度。  
> SEO 優化：結構清晰的無障礙網站對搜尋引擎更友善，有助於提升排名。  

第 1 點是基本保障，第 2、3、4 點主要都是在談「對人的服務」。但第 5 點，現在應該要變成「AXO優化」。

### 無障礙網頁如何讓 AI 更好跟網站互動？

AI Agent 操作網站時，最怕的其實不是畫面醜，而是它不知道：「這是什麼？」「這能不能點？」「點了之後會發生什麼事？」

以前我們幫一個 input 加上正確的 label，是為了讓螢幕閱讀器知道這個欄位是什麼。但現在，AI Agent 也可能靠這個 label 判斷：「這是不是搜尋欄？」「這個欄位要填姓名、Email，還是地址？」

很多東西，人類看一眼就知道是什麼，但 AI 不一定知道。

如果無障礙做得好，AI Agent 就能透過 Accessibility Tree 拿到更乾淨、更精簡，也更接近實際操作需求的資訊。LogRocket Blog[連結](https://blog.logrocket.com/exploring-agent-browser-ai-agents-web/ "另開新視窗"){target="_blank"} 也提到，這會讓 AI Agent 不必在一大堆 DOM 雜訊裡面硬猜。

以訂票為例，網站 A 還在讓 AI 解析一堆不清楚的元素時，網站 B 可能已經讓 AI 順利完成訂票了。對使用者來說，B 比較快；對 AI 服務商來說，B 也比較省資源。

### 這會帶來什麼改變？

No Hacks 在「[HOW AI AGENTS SEE YOUR WEBSITE (AND HOW TO BUILD FOR THEM)」](https://nohacks.co/blog/how-ai-agents-see-your-website "另開新視窗"){target="_blank"}:一文中提到：

Last year, before the European Accessibility Act took effect, I half-joked that it would be ironic if the thing that finally got people to care about accessibility was AI agents, not the people accessibility was designed for. That's no longer a joke.

這句話其實很有意思，因為它點出了一個現象：無障礙技術已經不只是服務人類，也開始幫助所有「非視覺型使用者」理解網站。

也因為如此，最大的改變，應該是會有更多企業開始重視無障礙。

只是誘因可能會從「符合法規」變成「商業利益」。

你沒做，可能就接不到那些透過 AI Agent 來完成任務的使用者，也就少了一些原本可能成交的機會。因為比起 SEO，AI Agent 更有機會直接帶來收益。

SEO 比較像是把人帶到目的地，接下來還要靠網站內容、流程和說服力慢慢轉換，但 AI Agent 可能直接幫使用者把事情做完。

這也會帶出第二個影響：網站分析可能會產生巨大改變，當 AI Agent 的使用比例越來越高，以前我們熟悉的「點擊率」、「停留時間」、「轉換率」，可能都需要重新定義。

這種誘因的改變，理論上會形成一種良性競爭，也可能讓整體無障礙網頁環境變好。

畢竟第一步，還是要先把符合無障礙規範的網站數量拉起來。

### 無障礙網頁的服務對象真的改變了嗎？

我認為沒有改變，而是擴大範圍，就像當年 SEO 那樣。

雖然現在無障礙的討論開始被 AI 帶起一波新的聲量，但最後還是會回到人類身上，因為一個網站不只是程式碼，也不只是 accessibility tree，它還包含流程安排、內容理解、情緒感受、信任建立，以及使用者在每一步操作中的真實體驗。

所以 AI 雖然會讓更多人重新重視無障礙，但無障礙真正的核心，還是在於讓人可以更順利、更容易地使用網站。
