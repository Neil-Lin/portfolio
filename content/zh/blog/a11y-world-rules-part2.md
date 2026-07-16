---
title: 全球網頁無障礙制度設計（二）：再擴八個法域，看見「主辦」與「認證」之間的灰色地帶
description: 上一篇盤點了十六個法域，原本想直接接著寫標章深度比較，但收集香港、卡達資料時發現——很多我以為的「政府標章」，其實是民間機構主辦、政府只是掛名協辦。於是決定先把版圖擴大到二十四個法域，把制度地基補完，再談標章。
date: 2026-07-17
tags:
  - Accessibility
  - A11Y
  - 無障礙網頁設計
  - 數位無障礙
  - 數位平權
  - 包容性設計
  - 無障礙網頁
  - 無障礙標章
draft: false
---

### 前言

上一篇[《全球網頁無障礙制度設計：各國法規、公私部門執行工具與驅動力比較》](https://accesserty.com/blog "另開新視窗"){target="_blank"} 結尾預告下一篇要直接切入標章比較。但實際動手收集香港、卡達的標章資料時，卻卡在一個更基本的問題上——這些標章到底是「誰」發的？

以香港 DARS 為例，我一開始以為是政府機構主辦的官方認證，查證後才發現：真正的主辦單位是香港互聯網註冊管理有限公司（HKIRC，一家非政府機構），香港數位政策辦公室（DPO）只是「協辦」，平等機會委員會（EOC）甚至只是「顧問」角色。卡達的 Mada 也類似——它自稱是 private institution for public benefit，不是政府機構，卻核發著市面上最完整的卡達網站無障礙認證清單。

這種「政府看起來有參與、但實際核發者是民間機構」的模糊地帶，如果不先弄清楚各國制度的地基，很容易在標章比較文裡把兩種完全不同性質的東西混為一談。於是這篇文章決定先把法域版圖再擴大八個——香港、義大利、卡達、挪威、丹麥、波蘭、愛爾蘭、芬蘭——把制度地基補完到二十四個法域，順便帶出這次意外發現的「主辦／協辦／顧問」分辨方法，再接標章比較。以下資料同樣可能有誤，歡迎專家指正。

### 一、延續同一套機制詞彙，但多一個提醒

沿用上一篇的六種制度工具：①強制認證制、②自我聲明＋政府監測制、③採購／供應鏈槓桿制、④市場監督＋罰鍰制、⑤反歧視訴訟驅動制、⑥軟法／努力義務制。

這批新增的八個法域裡，五個（義大利、丹麥、波蘭、愛爾蘭、芬蘭）延續上一篇「群組 C：歐盟雙指令型」的公式——公部門走 WAD（②自我聲明＋監測）、民間走 EAA（④市場監督＋罰鍰，2025/6/28 正式適用）；一個（挪威）延續「群組 D：非歐盟自成一套」；剩下兩個（香港、卡達）則是全新的類型——沒有專法、標準來自政策或民間機構，標章的核發者也不是政府本身。這正是本文額外要提醒的一點：**「政府協辦」不等於「政府認證」**，判斷一枚標章的公信力，要先看清楚主辦、協辦、顧問三個角色分別是誰。

### 二、各法域制度檢視（延續前文分組）

#### 群組 C 延伸：歐盟雙指令型（續五國）

這五國結構與上一篇的德、法、西、葡、奧、比、荷完全一致：公部門源自 WAD、走②自我聲明＋監測；民間源自 EAA、走④市場監督＋罰鍰，2025/6/28 起適用。差異一樣在監測牙齒與罰鍰金額，這次額外看到 EAA 上路後第一波實際執法分工資訊。

- **義大利**：母法 Legge 4/2004（Legge Stanca），WAD 以 D.Lgs. 106/2018 轉化、EAA 以 D.Lgs. 82/2022 轉化，DL 76/2020（conv. L. 120/2020）第 29 條把義務擴及年營業額逾 5 億歐元的私部門。標準 UNI CEI EN 301 549 → WCAG 2.1 AA（50 條 A/AA），2026/3/4 AgID 正式 Linee Guida（Determinazione n. 38）仍鎖 2.1，因協調標準 EN 301 549 v3.2.1 尚未經歐盟正式引用 2.2。無標章制度，產出是自我發布的無障礙聲明（用 AgID Allegato 1 官方模板，每年 9/23 截止）。監測分工比想像中細——**服務端**由 AgID 負責（簡化監測每季用 CNR 開發的 MAUVE++ 自動跑 50 條裡的 31 條、深入監測人工抽樣），**產品端**則另由 MIMIT（Ministero delle Imprese e del Made in Italy，2022 年由 MISE 更名）市場監督，上一篇沒提到這條產品／服務雙軌分工。EAA 罰則 €5,000–40,000，年營業額逾 5 億歐元者最高至營業額 5%。

- **丹麥**：《網站無障礙法》（webtilgængelighedsloven）轉置 WAD，原始版 LOV nr 692/2018、現行整合版 LOV nr 429/2021。標準 EN 301 549 v3.2.1。主管機關 Digitaliseringsstyrelsen 只做監測與監督，不發證，官方用語正是「簡化監測（forenklet monitorering，自動測 15 項 WCAG 2.1 相關要求）」與「深入監測（dybdegående monitorering，以完整 EN 301 549 v3.2.1 為準，App 僅人工評估）」。沒有罰鍰，機制是「命令」（påbud）——2024 年共發出 231 件命令、76 件建議，其中 140 件是聲明格式問題，未結案命令有公開列表。無障礙聲明須用官方 WAS-Tool 製作，且明文規定私人單位不得使用。丹麥民間端 EAA 轉置細節本次未深入查證，暫列待補。

- **波蘭**：兩部法——2019/4/4《公共實體網站與行動應用程式數位無障礙法》（2019/5/23 生效，2023/3/9 修法強化課責、取消不成比例負擔的豁免清單），與 2024/4/26 轉置 EAA 的《部分產品與服務無障礙要求法》（波蘭無障礙法，雖 2024 年公布，實際生效日是 2025/6/28）。標準 EU WAD／EN 301 549／WCAG 2.1 AA，主管機關為數位化部（Ministerstwo Cyfryzacji）。過去我以為波蘭沒有具體罰則，查證後發現其實有——2019 法對公部門連續未改善者，可處網站／App 問題最高 10,000 PLN、聲明缺失最高 5,000 PLN（部長裁處）；2024 EAA 法對經濟營運者最高可處平均薪資 10 倍（約 8–9 萬 PLN），且不超過年營業額 10%，但裁罰機關是 PFRON（國家身心障礙者復健基金）理事長，不是數位化部——公部門與民間端由兩個不同機關分別執法。

- **愛爾蘭**：《歐盟（公部門網站與行動應用無障礙）2020 年條例》（S.I. No. 358/2020，2020/9/23 生效，轉置 WAD）。《2005 年身心障礙者法》不是母法，而是無障礙聲明裡連結申訴／救濟管道時一併引用的法源（與《2000 年平等地位法》並列）。標準走 POUR 原則對應 EN 301 549，NDA 官方說明對應 WCAG 2.1 AA，聲明用 EU 2018/1523 官方模板。National Disability Authority（NDA）依條例第 8(1) 條是法定監測機關，直接向部長提交報告（不是主管部會提交），第 8(7) 條明文監測報告不需附上被監測名單，所以外界很難拿到官方清單。目前沒有找到官方標章或第三方檢測機構制度。民間端另有《2023 年歐盟（產品與服務無障礙要求）條例》轉置 EAA，同樣 2025/6/28 生效，執法權分散在 CCPC（市場監督主管機關）、ComReg、Coimisiún na Meán、愛爾蘭航空局、國家運輸局、愛爾蘭央行等六個機關依產品／服務類別分工，NDA 在這部分只是諮詢角色。罰則明確且偏重——即決審判最高 €5,000 罰金或 6 個月徒刑，起訴審判最高 €60,000 罰金或 18 個月徒刑，公司負責人可個別入罪，消費者與團體並被賦予向法院提告的私人訴權，是這批新增法域裡對民間罰則最重的一個。

- **芬蘭**：《數位服務提供法》306/2019（2019/4/1 生效，轉置 WAD）。標準依 Traficom 監督頁面採 EN 301 549＋WCAG 2.1。範圍除公部門外，也涵蓋接受 50% 以上公費資助的私部門數位服務，以及電子身分認證／支付、水電運輸郵政等特定私部門服務。EAA 轉置法正確編號是《部分產品無障礙要求法》102/2023，配套政令 179/2023，2023/2/20 生效、2025/6/28 起適用（網路上常見的「568/2023」是錯誤編號，這裡特別註明避免以訛傳訛）。主管機關現為 Traficom（芬蘭運輸通訊局）數位無障礙監督部門，但這個職權是 2025/1/1 才從南芬蘭區域行政局（AVI）整併移交過來的，上一篇沒抓到這段沿革。沒有官方標章制度；罰則也不是「不明確」，而是有明確的最後手段——行政指導無效後，Traficom 可依《條件罰款法》（Uhkasakkolaki）科處金額依個案而定的 uhkasakko（強制罰金），EAA 部分則另有禁止令、強制稽核等更嚴格裁罰權。

#### 群組 D 延伸：非歐盟／EEA 自成一套（續一國）

- **挪威**：以《平等與反歧視法》（2017 年 51 號法）搭配《ICT 通用設計規則》落實「universell utforming av IKT」概念，公部門適用 48 項要求、私部門適用 35 項要求，均為最低要求，且公私部門用同一套規則，不像歐盟那樣拆成 WAD／EAA 兩軌。主管機關 Tilsynet for universell utforming av ikt，隸屬 Digitaliseringsdirektoratet（Digdir）。沒有第三方檢測機構制度、也沒有官方標章，主管機關直接抽樣檢查（人工＋半自動＋自動）。罰則機制是 tvangsmulkt（按日計算的強制罰）——法源其實是母法本身的第 36 條，而非子法規則的 §6、§7；正確流程是先依子法第 18 條（通用設計義務）、第 19a 條（文件義務）發出矯正令（pålegg），逾期未改善才依母法第 36 條課予 tvangsmulkt，上一篇的條號需要修正。公部門網站聲明自 2023/2/1 起強制上 uustatus.no 這個 Digdir 中央化平台，App 聲明的強制期限則是 2026/2/1——以今天的時間點來看，剛剛才生效不久。挪威身為 EEA 成員，未來是否會走向 WAD／EAA 對齊的路線，值得後續追蹤。

#### 群組 E（新）：政策引導＋民間標章型（無專法）

這一組是本次真正的新發現——沒有一部像臺灣《身心障礙者權益保障法》第 52-2 條那樣「明文要求取得認證標章」的專法，網頁無障礙義務來自一般性反歧視法或政策文件；而市面上看得到的標章，核發者其實是民間或半官方機構，不是政府本身。

- **香港**：沒有網頁無障礙專法，法律基礎是《殘疾歧視條例》（Cap. 487）；政府網站與流動應用程式的 WCAG 2.0 AA 要求來自行政政策，不是立法，對民間也沒有強制力。主管機關是 2024/7/25 成立的數位政策辦公室（DPO，由原政府資訊科技總監辦公室 OGCIO 與效率促進辦公室合併而來），EOC 則負責執行《殘疾歧視條例》。真正值得修正的是 DARS（Digital Accessibility Recognition Scheme，前身「無障礙網頁嘉許計畫」WARS，2023/12/29 官方公告改名擴大範圍）表揚計畫的主辦架構——它不是「DPO 與 EOC 合辦」，官方原文寫的是 HKIRC（香港互聯網註冊管理有限公司）自 2018 年起主辦（organising）、DPO／前身 OGCIO 只是協辦（co-organised by）、EOC 僅為顧問（advised by）。分級也比原始資料更細：Bronze（10 項評審標準）→ Silver（17 項）→ Gold（27 項），連續三年拿到 Gold 才算 Triple Gold，另設 Friendly Website（4 項）與 Elderly-friendly Design Award（13 項），2024-2025 屆起新增 Designer Award 類別。政府網站不符政策要求沒有單獨法定罰則；民間不參加 DARS 也不罰，但若身心障礙者因網站無障礙問題被拒絕服務，仍可依《殘疾歧視條例》向 EOC 投訴或提告求償——這條路徑走的是⑤反歧視訴訟，跟 DARS 標章本身完全是兩套機制。

- **卡達**：原本以為卡達的母法狀態「未公開確認」，查證後發現這個描述已經過時——原本適用的 2004 年第 2 號身心障礙者權益法，已於 2025/10/5 由埃米爾簽署《2025 年第 22 號法律》廢止並取代，2025/11/19 生效，第 23(2) 條明文要求銀行與金融機構提供無障礙數位服務，違反可處 QAR 50,000 罰款，其他違反規定最高 QAR 100,000，情節嚴重致死者可達 QAR 500,000 及／或最高 5 年徒刑，執法機關是社會發展與家庭部（MSDF）——這是這批八國裡唯一一個 2025 年才新增法定罰則的案例，值得特別標記。至於發標章的 Mada Assistive Technology Center Qatar，明確是「private institution for public benefit」，不是政府機構，其網站無障礙認證分 Accredited Websites／Mobile Apps／Kiosks & ATMs 三類公開名單。標準這裡有兩條線需要拆開講：卡達政府自己的數位服務依 Government Website & e-Services Framework 要求用 WCAG 2.0；Mada 自己核發的認證則採 WCAG 2.1——原始資料只寫「以 WCAG 2.1 為主要標準線索」，其實少了政府政策標準這一條。

### 三、公私 × 機制定位矩陣（新增八法域）

延續上一篇的矩陣代碼：① 強制認證、② 自我聲明＋監測、③ 採購／供應鏈槓桿、④ 市場監督＋罰鍰、⑤ 反歧視訴訟、⑥ 軟法／努力義務。

| 法域 | 公部門機制 | 民間機制 |
|---|---|---|
| 香港 | ⑥ 政策要求（非立法） | ⑥ 自願標章（HKIRC 主辦）／⑤ 個案可循反歧視申訴 |
| 卡達 | ⑥ 政策要求（WCAG 2.0） | 民間自願認證（Mada）＋④ 金融業新興強制罰則（2025） |
| 義大利 | ② AgID 監測（服務）／MIMIT（產品） | ④ EAA（€5千–4萬，逾5億歐元營收最高罰營業額5%） |
| 挪威 | ②④ 同一套規則、Tilsynet 抽測＋tvangsmulkt 日罰 | ②④ 同左（公私部門合併規範） |
| 丹麥 | ② Digitaliseringsstyrelsen 監測（無罰鍰，僅命令） | 待補（EAA 細節本次未查證） |
| 波蘭 | ② 數位化部監測（最高 1萬 PLN） | ④ EAA（PFRON 裁罰，最高年營業額10%） |
| 愛爾蘭 | ② NDA 法定監測（無直接罰鍰） | ④⑤ EAA（六機關分工，最高18個月徒刑＋私人訴權） |
| 芬蘭 | ② Traficom 監督（2025 起，前身 AVI） | ④ EAA（uhkasakko 連續罰金＋禁止令） |

### 四、本次最大的認知落差：「主辦」不等於「認證」

上一篇的觀察四提到「有沒有官方標章 ≠ 制度強不強」，這次收集香港與卡達的資料後，想再往下補一層：**一枚標章看起來有政府背書，不代表核發者是政府**。

香港 DARS 的頁面上會看到 DPO 的名字，很容易誤以為是政府主辦的官方認證；但實際主辦方是 HKIRC，DPO 只是協辦、EOC 只是顧問。卡達 Mada 的認證同樣掛著看似官方的網域與品牌形象，但它的法律身分是「private institution for public benefit」。這跟臺灣《身心障礙者權益保障法》第 52-2 條「政府機關須依法取得認證標章」的強制認證，或韓國 MSIT 指定三家機構核發官方品質標章，是完全不同層級的公信力——不是說民間標章沒有價值，DARS、Mada 累積的評選機制和公開名單其實相當扎實，只是判斷標章效力時，第一步應該先分清楚「誰主辦、誰協辦、誰只是掛名顧問」，而不是看到政府單位的名字就直接當成法定認證。這也是下一篇要逐一拆解各國標章時，會優先確認的第一個欄位。

### 五、EAA 上路後的第一波市場監督樣本

2025/6/28 是 EAA 民間義務的正式適用日，這次收錄的義大利、波蘭、愛爾蘭、芬蘭剛好是上路後第一批能查到具體執法細節的法域，罰則落差同樣很大：波蘭最高看年營業額 10%、義大利逾 5 億歐元營收企業最高罰營業額 5%、愛爾蘭走的是刑事路線（最高 18 個月徒刑、公司負責人可個別入罪）、芬蘭則是不設金額上限的個案裁量式 uhkasakko。同一條 EAA 指令，四個國家轉出四種完全不同的「牙齒」，這點跟上一篇對德、法、西、荷、奧、比觀察到的落差一致——歐盟只統一了標準（EN 301 549 → WCAG 2.1 AA），沒有統一執法力度。

### 六、綜合觀察與趨勢更新

把新增的八個法域疊上前一篇的十六個，可以再補三點：

- **「沒有專法」不代表「沒有壓力」。** 香港、卡達都沒有網頁無障礙專法，但香港有《殘疾歧視條例》可提告求償、卡達 2025 年新法直接對金融業課以刑責與高額罰款——沒有標章制度，不等於沒有法律風險。
- **主辦者的性質，決定了標章的證明力層級。** 政府強制認證（臺、韓、印）＞政府政策要求＋民間自願標章（香港、卡達）＞單純民間自願標章（德、西、荷等國的 WACA、AENOR 等）。三者外觀都可能長得像「官方認可」，但法律效力天差地別。
- **EAA 2025/6/28 上路，第一批執法差異已經浮現。** 波蘭、義大利、愛爾蘭、芬蘭的罰則走了四種不同路線，說明「同一條歐盟指令」在二十七個成員國手上會長出至少四種以上的執法版本，這個落差可能會隨著更多國家的執法紀錄公開而繼續擴大。

### 下一篇預告：把每一枚標章拆開看

這篇把制度地圖擴大到二十四個法域，也順手練出了一套辨認標章可信度的方法——先看主辦、協辦、顧問是誰，再看標準版本，最後看有沒有公開可查的名單與效期。下一篇會正式回到當初的計畫：把 DARS、Mada、WACA、AnySurfer、AENOR、Ilunion、Access for all、Drempelvrij、Selo 這些標章逐一攤開，比對是強制關卡還是自願獎章、分幾級、有沒有有效期限、查不查得到完整名單、設計長什麼樣。

### Reference 列表

#### 香港

[Digital Policy Office established today（香港政府新聞公報）](https://www.info.gov.hk/gia/general/202407/25/P2024072400394.htm "另開新視窗"){target="_blank"}

[Digital Policy Office 官網 About Us](https://www.digitalpolicy.gov.hk/en/about_us/ "另開新視窗"){target="_blank"}

[HKIRC — Digital Accessibility Recognition Scheme 2024-2025 開放報名（含主辦/協辦/顧問角色原文）](https://www.hkirc.hk/en/news-insights/press-release/dars/ "另開新視窗"){target="_blank"}

[HKIRC — Digital Accessibility Recognition Scheme 官方介紹頁](https://www.hkirc.hk/en/public-mission/dars/dars/ "另開新視窗"){target="_blank"}

[DARS 2024-2025 Guide to Application（PDF，評審級別標準）](https://www.digital-accessibility.hk/wp-content/uploads/2024/01/DARS_Application_Guide-1.pdf "另開新視窗"){target="_blank"}

#### 卡達

[Mada Digital Accessibility Portal — Accredited Websites](https://ictaccess.mada.org.qa/en/accredited-websites/ "另開新視窗"){target="_blank"}

[Mada — Policy 頁面（政府 Framework 要求 WCAG 2.0）](https://mada.org.qa/policy-advocacy/ "另開新視窗"){target="_blank"}

[Crowell & Moring — Qatar Enacts Law No. (22) of 2025 on Persons with Disabilities](https://www.crowell.com/en/insights/client-alerts/qatar-enacts-law-no-22-of-2025-on-persons-with-disabilities "另開新視窗"){target="_blank"}

[MSDF — His Highness the Amir Issues Law No. (22) of 2025 on Persons with Disabilities](https://msdf.gov.qa/en/media-center/news-list/his-highness-amir-issues-law-no-22-2025-persons-disabilities "另開新視窗"){target="_blank"}

[Qatar National e-Accessibility Policy 2011（PDF，MCIT）](https://www.mcit.gov.qa/sites/default/files/qatar_eaccessibility_policy_en_v4.pdf "另開新視窗"){target="_blank"}

#### 義大利

[D.Lgs. 82/2022（EAA 轉化）](https://www.gazzettaufficiale.it/eli/id/2022/07/01/22G00089/SG "另開新視窗"){target="_blank"}

[D.Lgs. 106/2018（WAD 轉化）](https://www.gazzettaufficiale.it/eli/id/2018/09/11/18G00133/sg "另開新視窗"){target="_blank"}

[AgID Linee Guida accessibilità dei servizi（EAA，2026/3）](https://www.agid.gov.it/sites/agid/files/2026-03/Linee_Guida_accessibilit%C3%A0_dei_servizi_(EAA).pdf "另開新視窗"){target="_blank"}

[AgID — 無障礙聲明模板 Allegato 1](https://www.agid.gov.it/sites/agid/files/2025-04/Allegato%201%20-%20Modello_di_dichiarazione_accessibilit%C3%A0.pdf "另開新視窗"){target="_blank"}

[CNR — MAUVE 監測工具說明](https://www.cnr.it/it/news/11847/monitoraggio-nazionale-automatico-dell-accessibilita-dei-siti-web-delle-pubbliche-amministrazioni-con-mauve "另開新視窗"){target="_blank"}

[AgID 簡化監測平台](https://monitoraggio.accessibilita.agid.gov.it/monitoraggio-semplificato "另開新視窗"){target="_blank"}

[MIMIT — 產品安全與市場監督](https://www.mimit.gov.it/it/mercato-e-consumatori/sicurezza-prodotti "另開新視窗"){target="_blank"}

#### 挪威

[Likestillings- og diskrimineringsloven（母法全文，含 §36）](https://lovdata.no/dokument/NL/lov/2017-06-16-51 "另開新視窗"){target="_blank"}

[Forskrift om universell utforming av IKT-løsninger](https://lovdata.no/dokument/SF/forskrift/2013-06-21-732 "另開新視窗"){target="_blank"}

[uutilsynet.no — 官方監督機關網站](https://www.uutilsynet.no/ "另開新視窗"){target="_blank"}

[uutilsynet — 未提交聲明可能導致日罰說明](https://www.uutilsynet.no/tilgjengelighetserklaering/manglende-tilgjengelighetserklaering-kan-fore-til-dagmulkt/1673 "另開新視窗"){target="_blank"}

[uustatus.no — 無障礙聲明中央平台](https://uustatus.no/nb "另開新視窗"){target="_blank"}

#### 丹麥

[Digitaliseringsstyrelsen — 深入監測說明](https://digst.dk/tilsyn/webtilgaengelighed/monitorering-og-tilsyn/dybdegaaende-monitoreringer/ "另開新視窗"){target="_blank"}

[Digitaliseringsstyrelsen — 簡化監測說明](https://digst.dk/tilsyn/webtilgaengelighed/monitorering-og-tilsyn/forenklede-monitoreringer/ "另開新視窗"){target="_blank"}

[Digitaliseringsstyrelsen — 未結案命令列表](https://digst.dk/tilsyn/webtilgaengelighed/resultater/udestaaende-paabud/ "另開新視窗"){target="_blank"}

[LOV nr 429 af 16/03/2021（現行整合版）](https://www.retsinformation.dk/eli/lta/2021/429 "另開新視窗"){target="_blank"}

[WAS-Tool 官方入口](https://edit.was.digst.dk/da-DK "另開新視窗"){target="_blank"}

#### 波蘭

[Ustawa z dnia 4 kwietnia 2019 r.（ISAP 原文）](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20190000848 "另開新視窗"){target="_blank"}

[Ustawa z dnia 26 kwietnia 2024 r.（波蘭無障礙法／EAA 轉化，ISAP）](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240000731 "另開新視窗"){target="_blank"}

[PFRON — 無障礙法說明（EAA 裁罰機關）](https://www.pfron.org.pl/aktualnosci/szczegoly-aktualnosci/news/ustawa-o-dostepnosci/ "另開新視窗"){target="_blank"}

[波蘭數位化部 — 數位無障礙說明](https://www.gov.pl/web/cyfryzacja/dostepnosc-cyfrowa "另開新視窗"){target="_blank"}

#### 愛爾蘭

[S.I. No. 358/2020 原文](https://www.irishstatutebook.ie/eli/2020/si/358/made/en/print "另開新視窗"){target="_blank"}

[NDA — EU Web Accessibility Directive 監測說明](https://nda.ie/monitoring/eu-web-accessibility-directive "另開新視窗"){target="_blank"}

[Mason Hayes & Curran — European Accessibility Act 愛爾蘭轉化說明](https://www.mhc.ie/latest/insights/european-accessibility-act-implemented-into-irish-law "另開新視窗"){target="_blank"}

[DLA Piper — 愛爾蘭無障礙法規罰則細節](https://www.dlapiper.com/en-us/insights/publications/2025/10/navigating-the-irish-accessibility-regulations "另開新視窗"){target="_blank"}

#### 芬蘭

[Traficom — 監督機關任務說明（含 uhkasakko）](https://www.saavutettavuusvaatimukset.fi/en/tasks-supervisory-authority-0 "另開新視窗"){target="_blank"}

[Laki digitaalisten palvelujen tarjoamisesta 306/2019 說明](https://www.saavutettavuusvaatimukset.fi/en/requirements-act-provision-digital-services/requirements-act-provision-digital-services "另開新視窗"){target="_blank"}

[Finlex — 102/2023（EAA 芬蘭轉譯法正確文號）](https://finlex.fi/en/legislation/collection/2023/102 "另開新視窗"){target="_blank"}

[Traficom — 新無障礙要求說明](https://www.traficom.fi/en/traficom/accessibility/new-accessibility-requirements "另開新視窗"){target="_blank"}

--

本文資料整理截至 2026 年 7 月，可能有誤，歡迎指正。下一篇將把各國標章逐一拆解比較。
