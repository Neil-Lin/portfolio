---
title: 全球網頁無障礙制度設計：各國法規、公私部門執行工具與驅動力比較
description: 最近我正在幫我的 Accesserty Signal 擴充標章功能。原本只是單純想收集各國的標章、法規與檢測項目，但收集到一半時發現——應該要先理解各國的「政策」才行
date: 2026-06-09
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

最近我正在幫我的 Accesserty Signal[連結](https://accesserty.com/signal "另開新視窗"){target="_blank"} 擴充標章功能。原本只是單純想收集各國的標章、法規與檢測項目，但收集到一半時發現——應該要先理解各國的「政策」才行，於是著手手動收集；然而要涵蓋的國家與細節實在太多，不得不借助 AI 協助整理與分析，也順便分享給大家閱讀。以下資料可能有誤，歡迎專家不吝指正。 預計下一篇將分析各國標章概況。

先把本文制度地基講清楚：
盤點 臺灣、美國、英國、澳洲、韓國、日本、印度，以及歐盟框架下的德國、法國、西班牙、葡萄牙、奧地利、比利時、荷蘭與非歐盟的瑞士，共十六個法域的網頁無障礙制度設計。重點不在「技術標準是 WCAG 幾點幾」（這幾乎全球趨同於 WCAG 2.1／2.2 AA），而在一個更根本的問題——到底是用什麼力量，讓網站願意做到無障礙？ 是政府發一張證書、派人定期抽查、開一張罰單，還是等身心障礙者上法院告？各國的答案，差異遠比想像中大。

### 一、分析框架：先分公部門與民間，再看用哪種工具

比較各國制度時，最常見的錯誤是把一個國家當成「一格」。事實上幾乎每個法域，對公部門與對民間都是兩套不同的法、不同的執行者、不同的後果：

- 歐盟用兩條不同指令——WAD（管公部門）與 EAA（管民間）；
- 德國公部門（BITV）無罰則、民間（BFSG）卻可罰 €10 萬；
- 臺灣對政府網站法律強制取得標章、對民間幾乎零要求。

所以本文採雙軸分析：先區分「公部門 / 民間」，再用一套共通的「機制詞彙」標定每個法域落在哪裡。

#### 六種制度工具（機制詞彙）

① 強制認證制：事前、政府或指定機構檢測、發證，法律要求特定對象取得  
② 自我聲明＋政府監測制：持續、受規範者自評並公布無障礙聲明，政府抽樣複查＋申訴  
③ 採購／供應鏈槓桿制：進場、「政府只買無障礙的東西／不合規喪失標案資格」  
④ 市場監督＋罰鍰制：事後、市場監督機關查核、命令改善、課罰鍰乃至下架  
⑤ 反歧視訴訟驅動制：事後、無事前認證，靠個案申訴、民事訴訟、行政救濟  
⑥ 軟法／努力義務制：--、無強制門檻與罰則，靠行政指導與聲譽壓力  

### 二、各法域制度檢視（依主導模式分組）

#### 群組 A：政府強制認證型（東亞＋印度）

這群共同點是——政府（或政府指定機構）扮演發證者，並把「取得認證」寫進法律或政策。

- 臺灣：母法《身心障礙者權益保障法》第 52 條之 2 明文要求政府機關、學校網站「應通過第一優先等級以上無障礙檢測，並取得認證標章」。數位發展部建平台，含自我、機器、人工（含身障者）檢測。標準以 WCAG 2.1 AA 為底、預計 2026 年底升 2.2。公部門強制、民間無規範。

- 韓國：以《禁止歧視身心障礙者法》第 21 條為核心，科學技術資訊通信部（MSIT）指定三家認證機構核發官方品質標章，標準 KWCAG 2.2。罰則相對硬——惡意歧視最高 3 年徒刑或 3,000 萬韓元罰金，另有行政罰鍰、喪失標案資格。公部門認證、民間靠反歧視法強制（分階段）。

- 印度：以《身心障礙者權利法》（RPwD 2016）為母法，MeitY 旗下 STQC 官方機構檢測、核發 CQW 認證（把無障礙、資安、易用性綁在一起），標準 GIGW 3.0（WCAG 2.1 AA）。罰則初犯 ₹1 萬、累犯最高 ₹5 lakh。2025 年 SEBI 通函首次把無障礙強制擴及金融業——印度正從公部門向民間擴張。

#### 群組 B：反歧視訴訟驅動型（普通法系＋日本）

這群不設政府事前認證，把無障礙定位為「反歧視／平等權」，靠申訴與訴訟推動。

- 美國：雙軌——ADA（反歧視，Title II 州/地方政府、Title III 民間）＋ Section 508（聯邦採購）。標準須分層：ADA Title II 2024 新規採 WCAG 2.1 AA、Section 508 仍是 WCAG 2.0 AA、Title III 無法定標準靠判例。著名的「訴訟驅動」國家，每年數千件網站官司。

- 英國：公部門《2018 公部門無障礙規範》（PSBAR，轉化 WAD），GDS 監測、EHRC 執法；民間《2010 平等法》要求「合理調整」，身障者可向郡法院求償。標準綁「WCAG as amended」（現行 2.2 AA）。脫歐後未轉化 EAA，民間僅靠平等法。

- 澳洲：《1992 身心障礙歧視法》（DDA）涵蓋公私，但無法定技術標準、無行政罰鍰；AHRC 受理申訴→調解→聯邦法院判賠並命改善（指標案 Maguire v SOCOG 2000）。聯邦政府另透過 DTA《Digital Service Standard 2.0》要求採最新 WCAG（現 2.2 AA）。

- 日本：《障害者差別解消法》第 7 條（政府）、第 8 條（民間），標準 JIS X 8341-3:2016（對應 WCAG 2.0，實務向 2.1）。2024/4/1 起民間「合理調整」從努力義務升為法定義務，但網頁無障礙仍偏努力目標、幾乎無直接罰則（唯一罰鍰 ¥20 萬針對拒絕政府調查/虛偽報告）。典型「軟法」。

#### 群組 C：歐盟雙指令型（WAD 公部門＋EAA 民間）

這群結構高度一致：公部門源自 WAD（2016/2102）、走自我聲明＋政府監測；民間源自 EAA（2019/882，2025/6/28 適用）、走市場監督＋罰鍰。差異在「監測的牙齒」與「罰鍰金額」。標準一律 EN 301 549 → WCAG 2.1 AA。

- 德國：三層——BGG（母法）＋BITV 2.0（公部門）＋BFSG（民間）。公部門無罰則，靠團體訴訟（Verbandsklage）；民間由各邦聯合市場監督機關（設於 Magdeburg）查處，最高罰 €10 萬。

- 法國：第 2005-102 號法第 47 條＋RGAA 4.1.2，DINUM 制定規範。特別之處：2023 年起 ARCOM 對公部門也有實質裁罰權——申報義務缺失 €25,000、無障礙不合規 €50,000，且持續未改正每年可重罰。民間（EAA）由 DGCCRF 統籌市場監督，罰金累計可達 €250,000。法國是少數讓公部門監測「長出牙齒」的歐盟國。

- 西班牙：公部門 RD 1112/2018＋無障礙觀測站（Observatorio）監測；民間 RDL 11/2023。罰鍰分體系——公部門監督約 €3,000–100,000，民間／EAA 級距最高可達 €100 萬（非常嚴重），是歐盟中上限最高者之一。無官方標章，AENOR、Ilunion 屬民間自願認證。

- 葡萄牙：公部門 DL 83/2018，AMA 監測並營運官方但自願的「易用性與無障礙標章 Selo」（金/銀/銅）；民間 DL 82/2022，由 ANACOM、ASAE 等多家部門別監理機關稽查，法人罰鍰最高約 €44,892。

- 奧地利：公部門 WZG，FFG（研究促進署）監測；民間 BaFG（2025），社會部服務處（Sozialministeriumservice）市場監督，最高罰 €8 萬。WACA 為民間自願標章。

- 比利時：聯邦制使法源分散——1 部聯邦法（2018/7/19）＋多個地區法令；BOSA 轄下的數位無障礙署監測協調。民間 EAA 由聯邦經濟部等執行。AnySurfer 為民間自願標章。

- 荷蘭：公部門《政府數位無障礙臨時法令》，採「遵循或解釋（comply-or-explain）」＋Logius 查核聲明＋公開 Dashboard，無罰鍰；民間《實施法》由消費者暨市場管理局（ACM）監督，最高罰 €9 萬並可禁止提供服務。Drempelvrij/Digital Inclusive 為民間自願標章。

#### 群組 D：非歐盟自成一套

- 瑞士：《身心障礙者平等法》（BehiG，2004）＋eCH-0059 標準（WCAG 2.1 AA），目前僅及於聯邦行政機關、無罰鍰、靠當事人主張權利。非歐盟、不適用 EAA。修法中，預計最快 2027/1/1 才把義務擴及民間線上服務。

### 三、公私 × 機制定位矩陣

把十六個法域同時放上「公部門」／「民間」兩軸。機制代碼沿用上一節：① 強制認證、② 自我聲明＋監測、③ 採購／供應鏈槓桿、④ 市場監督＋罰鍰、⑤ 反歧視訴訟、⑥ 軟法／努力義務。

| 法域 | 公部門機制 | 民間機制 |
|---|---|---|
| 臺灣 | ① 強制認證（母法要求取得標章） | ⑥ 無 |
| 韓國 | ① 政府指定機構認證（官方標章） | ⑤ 反歧視法（分階段強制＋刑/罰） |
| 印度 | ① STQC、CQW 強制認證 | ④⑤ RPwD＋SEBI(2025) 新興強制 |
| 美國 | ③ Section 508 採購＋⑤ ADA Title II | ⑤ ADA Title III 訴訟 |
| 英國 | ② PSBAR 自我聲明＋GDS 監測（EHRC 執法） | ⑤ 平等法訴訟 |
| 澳洲 | ⑤／⑥ DDA＋DSS（政府採 WCAG，靠申訴） | ⑤ DDA 訴訟 |
| 日本 | ⑥ 努力義務＋軟性引導 | ⑥ 軟法（2024 合理調整法定義務、無罰則） |
| 歐盟 | ② WAD | ④ EAA |
| 德國 | ② BITV（無罰則／團體訴訟） | ④ BFSG（市場監督＋€10萬） |
| 法國 | ②＋④ RGAA＋ARCOM（可罰 €5萬） | ④ EAA（DGCCRF，累計 €25萬） |
| 西班牙 | ② RD 1112＋Observatorio 監測 | ④ RDL 11/2023（最高 €100萬） |
| 葡萄牙 | ② DL 83/2018＋AMA 監測（＋自願 Selo） | ④ DL 82/2022（部門別監理） |
| 奧地利 | ② WZG＋FFG 監測 | ④ BaFG（€8萬） |
| 比利時 | ② 2018 法＋BOSA 監測 | ④ EAA（聯邦經濟部） |
| 荷蘭 | ② 臨時法＋Logius（comply-or-explain） | ④ EAA（ACM，€9萬） |
| 瑞士 | ②／⑥ BehiG 聯邦自我落實 | 無（2027 才擴及民間） |

#### 從矩陣讀出的四個結構性事實

- 公部門集中在「認證／監測」，民間則明顯分兩條路。 公部門欄不是①就是②；民間欄則裂成兩種法律傳統——普通法系（美、英、澳）＋東亞反歧視（日、韓）靠⑤訴訟，歐盟靠④市場監督＋罰鍰。
- 「民間」這一格長期最弱，2024–2025 才被補起來。 臺灣民間仍近乎空白、日本到 2024 才硬化、歐盟 EAA 與印度 SEBI 都在 2025 才上路、瑞士要等 2027。網頁無障礙的執法重心，正從公部門外溢到民間。
- 同一個②「監測」機制，但差很多。 多數歐盟國公部門無罰鍰（德、荷、比、奧、葡），靠透明與團體訴訟；法國比較不一樣，ARCOM 對公部門可罰 €5 萬並 name & shame；英國則無罰鍰但 EHRC 有調查與訴訟權。
- 罰鍰金額（民間/EAA）落差極大。 葡萄牙約 €4.5 萬、奧地利 €8 萬、荷蘭 €9 萬、德國 €10 萬、法國累計 €25 萬，西班牙最高 €100 萬。同一條 EAA，各國「定價」天差地別。

### 四、各機制優缺點分析（分公部門、民間兩組）

#### 甲、公部門常見機制

① 強制認證（臺、韓、印）  

標準統一、通過與否明確、可公開查核；對政府網站效力最強；天然產生「官方標章」可供信任

行政成本高、易僵化於發證當下、難規模化；認證後品質可能回落（一次性過關）

② 自我聲明＋監測（歐盟公部門、英）  

門檻低、可覆蓋海量網站；持續監測反映現況；不需龐大發證機器

自評可信度低、監測僅抽樣；罰則弱時流於形式（聲明漂亮、實際不無障礙）

③ 採購／供應鏈槓桿（美 Section 508）  

不必另立罰則即驅動大量供應商；示範效果強、責任鏈清楚

只及於與政府交易者；易被「自我宣告（VPAT）」灌水

> 公部門的共同弱點：力度雖強，邊界卻止於政府自己。臺、印的強制認證對民間無外溢力；歐盟監測制覆蓋廣卻深度不足，且多數國家對公部門根本沒有罰鍰（法國是少數例外）。  

#### 乙、民間常見機制

④ 市場監督＋罰鍰（歐盟民間、印 SEBI）  

經濟嚇阻力強、明確覆蓋民間、責任歸屬清楚；可下架/禁營運

事後性（傷害已發生）、執法量能有限；中小企業負擔重、易靠豁免規避；金額各國落差大、2025 才上路成效待觀察

⑤ 反歧視訴訟驅動（美、英、澳、韓）  

賦予當事人實權、判例能快速拉高標準、不需事前行政機器

高度不確定、標準由法院碎片化形成；訴訟成本轉嫁、易生「掠奪性訴訟」；弱勢者未必告得起

⑥ 軟法／努力義務（日、臺民間、瑞士民間至 2027）  

推行阻力小、易作過渡；可先建共識再硬化

幾乎無強制力、淪為宣示；改善高度依賴企業善意與聲譽壓力

> 民間的共同難題：要嘛事後（罰鍰、訴訟都在傷害發生後），要嘛無力（軟法）。沒有任何一國對民間採「事前強制認證」——這正說明為何官方標章幾乎只長在公部門。  

#### 跨組綜合觀察

- 沒有單一最佳解，成熟法域都是「疊加」。 美國＝採購(③)＋訴訟(⑤)；歐盟各國＝監測(②)＋市場監督(④)，再加個人訴訟。強的制度是多工具互相補位，而非單押一種。
- 罰鍰的「有無」與「高低」並不等於成效。 荷蘭公部門無罰鍰卻靠 comply-or-explain＋公開 Dashboard 維持透明壓力；西班牙民間罰到 €100 萬，但實際執法量能仍是問號。制度的真正差別在執行密度，不只在條文上的數字。

### 五、綜合觀察與趨勢

把十六個法域攤開，可以看到三個清楚的走向：

- 技術標準全球趨同、制度工具高度分歧。 大家都收斂到 EN 301 549 / WCAG 2.1（漸進 2.2）AA；真正的差異全在「誰來逼、怎麼逼」。
- 重心從「公部門軟法／事前認證」走向「民間市場監督＋基本權」。 2024–2025 是分水嶺：歐盟 EAA、日本合理調整義務化、印度最高法院 2025 判決與 SEBI 通函，都把無障礙從「努力目標」推向「可罰、可訴的權利」。瑞士 2027 將是下一棒。
- 「有沒有官方標章」≠「制度強不強」。 臺、韓、印有強制官方標章；但德、西、荷這些制度完整的國家刻意不設官方標章，改用自我聲明＋監測，把標章讓給民間自願市場；葡萄牙的 Selo 雖由政府營運，仍只是自願卓越獎而非合規門檻。

--

下一篇預告：當「標章」遇上不同制度
本文畫出了一張「公私 × 機制」的制度地圖。而在這張地圖上，「無障礙標章」其實落在很不一樣的位置：

- 在臺灣，標章是法律強制的守門員——政府網站沒拿到就不合規；
- 在韓國、印度，標章是政府或指定機構核發的官方憑證；
- 在德國、西班牙、荷蘭、奧地利、比利時、瑞士，官方根本不發標章，市面上的 WACA、AnySurfer、AENOR、Ilunion、Access for all、Drempelvrij 全是民間自願的信任標記——它是加分項，不是門檻；
- 而葡萄牙的 Selo 則卡在中間：政府營運，卻是自願的卓越獎。

也就是說，同樣叫「無障礙標章」，有的是「過不了就違法」的關卡，有的只是「做到了給你拍拍手」的獎章。下一篇，我會把各國的標章逐一攤開——誰發的、怎麼分級、有沒有有效期限、查不查得到名單、設計長什麼樣——並對照本文這張制度地圖，看看每一枚標章，到底站在哪個位置。

### Reference 列表

#### 國際／框架

[W3C WAI, Web Accessibility Laws & Policies](https://www.w3.org/WAI/policies/ "另開新視窗"){target="_blank"}

[EU Web Accessibility Directive 2016/2102](https://eur-lex.europa.eu/eli/dir/2016/2102/oj "另開新視窗"){target="_blank"}

[European Accessibility Act, Directive 2019/882](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/european-accessibility-act-eaa_en "另開新視窗"){target="_blank"}

[EN 301 549（Accessible EU Centre）](https://accessible-eu-centre.ec.europa.eu/ "另開新視窗"){target="_blank"}

#### 臺灣

[身心障礙者權益保障法第 52-2 條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?Pcode=D0050046&FLNO=52-2 "另開新視窗"){target="_blank"}

[數位發展部《網站無障礙規範》](https://accessibility.moda.gov.tw/ "另開新視窗"){target="_blank"}

#### 美國

[ADA](https://www.ada.gov/law-and-regs/ada/ "另開新視窗"){target="_blank"}

[Section 508](https://www.section508.gov/ "另開新視窗"){target="_blank"}

[ADA Title II 2024 規則 vs Section 508（WCAG 2.1/2.0 比較，Level Access）](https://www.levelaccess.com/blog/ada-vs-section-508-whats-the-difference/ "另開新視窗"){target="_blank"}

#### 英國

[PSBAR 2018](https://www.legislation.gov.uk/uksi/2018/952/contents "另開新視窗"){target="_blank"}

[Equality Act 2010](https://www.legislation.gov.uk/ukpga/2010/15/contents "另開新視窗"){target="_blank"}

[公部門無障礙要求（GOV.UK）](https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps "另開新視窗"){target="_blank"}

#### 澳洲

[Disability Discrimination Act 1992](https://www.legislation.gov.au/C2004A04426/latest "另開新視窗"){target="_blank"}

[AHRC, World Wide Web Access: DDA Advisory Notes](https://humanrights.gov.au/our-work/disability-rights/world-wide-web-access-disability-discrimination-act-advisory-notes-ver "另開新視窗"){target="_blank"}

#### 韓國

[Act on Prohibition of Discrimination against Persons with Disabilities（KLRI 英譯）](https://elaw.klri.re.kr/eng_mobile/viewer.do?hseq=55535&type=part&key=38 "另開新視窗"){target="_blank"}

[Seoul, Web Accessibility Quality Mark](https://english.seoul.go.kr/web-accessibility-quality-mark/ "另開新視窗"){target="_blank"}

#### 日本

[障害者差別解消法（內閣府）](https://www8.cao.go.jp/shougai/suishin/law_h25-65.html "另開新視窗"){target="_blank"}

[2024/4/1 合理調整義務化（Anderson Mōri & Tomotsune）](https://www.amt-law.com/asset/pdf/bulletins9_pdf/LELB63.pdf "另開新視窗"){target="_blank"}

#### 印度

[RPwD Act 2016](https://niepvd.nic.in/the-rights-of-persons-with-disabilities-rpwd-act-2016/ "另開新視窗"){target="_blank"}

[GIGW 3.0](https://guidelines.india.gov.in/ "另開新視窗"){target="_blank"}

[STQC CQW](https://www.stqc.gov.in/website-quality-certification-0 "另開新視窗"){target="_blank"}

[SEBI 2025 數位無障礙（Deque）](https://www.deque.com/blog/sebi-sets-a-new-standard-for-digital-accessibility-in-finance-in-india/ "另開新視窗"){target="_blank"}

#### 德國

[BGG / BITV 2.0 / BFSG](https://www.gesetze-im-internet.de/bfsg/ "另開新視窗"){target="_blank"}

[各邦市場監督機關（Magdeburg）](https://ms.sachsen-anhalt.de/themen/menschen-mit-behinderungen/aktuelles/marktueberwachungsstelle-der-laender-fuer-die-barrierefreiheit-von-produkten-und-dienstleistungen "另開新視窗"){target="_blank"}

#### 法國

[Loi 2005-102, art. 47](https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000037388867/ "另開新視窗"){target="_blank"}

[RGAA 4.1](https://accessibilite.numerique.gouv.fr/ "另開新視窗"){target="_blank"}

[ARCOM 無障礙監管](https://www.arcom.fr/nous-connaitre/nos-missions/garantir-le-pluralisme-et-la-cohesion-sociale/les-droits-des-personnes-handicapees/accessibilite-des-sites-et-des-services-numeriques "另開新視窗"){target="_blank"}

#### 西班牙

[RD 1112/2018](https://www.boe.es/buscar/act.php?id=BOE-A-2018-12699 "另開新視窗"){target="_blank"}

[RDL 11/2023](https://www.boe.es/buscar/act.php?id=BOE-A-2023-11022 "另開新視窗"){target="_blank"}

#### 葡萄牙

[DL 83/2018](https://www.acessibilidade.gov.pt/mudanca/dl-n-o-83-2018/ "另開新視窗"){target="_blank"}

[DL 82/2022（EAA 轉化）AMA / acessibilidade.gov.pt](https://www.acessibilidade.gov.pt/ "另開新視窗"){target="_blank"}

#### 奧地利

[WZG（RIS）](https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20010727 "另開新視窗"){target="_blank"}

[FFG 監測暨申訴處](https://ffg.at/barrierefreiheit/WZG-Anwendbarkeit "另開新視窗"){target="_blank"}

[Digital Barrierefrei](https://www.digitalbarrierefrei.at/en/ "另開新視窗"){target="_blank"}

#### 比利時

[Loi du 19 juillet 2018（BOSA）](https://bosa.belgium.be/fr/regulations/loi-du-19-juillet-2018-accessibilite "另開新視窗"){target="_blank"}

[Belgian Web Accessibility（監測與申訴）](https://accessibility.belgium.be/fr/missions-et-plaintes "另開新視窗"){target="_blank"}

#### 荷蘭

[DigiToegankelijk（政策）](https://www.digitoegankelijk.nl/wetgeving/beleid-nederland-en-europa "另開新視窗"){target="_blank"}

[Netherlands Digital Accessibility Laws（Level Access）](https://www.levelaccess.com/wp-content/uploads/2025/06/Netherlands-Digital-Accessibility-Laws.pdf "另開新視窗"){target="_blank"}

#### 瑞士

[BehiG / 聯邦行政無障礙（bit.admin.ch）](https://www.bit.admin.ch/en/accessibility-in-the-federal-administration "另開新視窗"){target="_blank"}

[BehiG 修法草案（2027，Härting）](https://haerting.ch/en/insights/accessible-websites-and-apps-new-obligations-under-the-draft-of-the-new-swiss-disability-discrimination-act-behig/ "另開新視窗"){target="_blank"}

--

本文資料整理截至 2026 年 6 月，可能有誤，歡迎指正。下一篇將分析各國標章概況。
