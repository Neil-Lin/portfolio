---
title: SEO 整理
description: "SEO（搜尋引擎最佳化）學習筆記總整理：從 HTML meta、載入速度、網站安全、提交索引、robots.txt 到 UX 與實用工具的完整重點。"
date: 2020-01-16
tags:
  - SEO
  - 搜尋引擎
draft: false
---

### 前言

中英文全名: Search Engine Optimisation，搜尋引擎最佳化。是一種透過了解搜尋引擎的運作規則來調整網站， 提高在搜尋引擎內排名。搜尋引擎演算法時常在變，2020 google 切換為 Mobile First

### 提高排名的好處

經過許多專業的 SEO 研究機構調查後發現， 當使用者利用搜尋引擎尋找資料、產品或服務時， 大部分人通常只會點擊搜尋結果當中，最前面出現的幾個連結。通常 4 ~ 6 個月才能看出明顯效益。

### 近三年台灣主要搜尋引擎(Desktop)：Google, Yahoo, Bing

::figure
  ![搜尋引擎三年數據比較](/images/blog/8.png)
  ::figcaption
    Google Chrome 獨霸市場
  ::
::

### 技術層面

#### HTML

```html
<meta charset="UTF-8">
<meta name="description" content="網頁簡短描述">
<meta name="keywords" content="網頁關鍵字">
<meta name="author" content="作者姓名">
<meta name="generator" content="編輯器名稱">
<meta name="copyright" content="網頁版權">
<meta name="distribution" content="網頁發佈地區">
<meta name="robots" content="index,follow"/>
<title>頁面標題</title>

<!-- Open Graph -->
<meta property="og:url" content="" />
<meta property="og:title" content="" />
<meta property="og:description" content="" />
<meta property="og:image" content="" />
<meta property="og:type" content="" />
<meta property="og:locale" content="" />
<meta property="og:site_name" content="" />
<meta property="article:published_time" content="" />
<meta property="article:modified_time" content="" />
<meta property="article:section" content="" />
<meta property="article:tag" content="" />
<meta property="fb:admins" content="" />
<meta property="fb:app_id" content="" />

<!-- Twitter -->
<meta name="twitter:card" content="">
<meta name="twitter:site" content="">
<meta name="twitter:title" content="">
<meta name="twitter:description" content="">
<meta name="twitter:creator" content="">
<meta name="twitter:image:src" content="">

<!-- Favicon -->
<link rel="shortcut icon" href="XXXX.png">
<link rel="apple-touch-icon" href="XXXX.png">
<link rel="apple-touch-icon-precomposed" sizes="57x57" href="XXXX.png">
<link rel="apple-touch-icon-precomposed" sizes="72x72" href="XXXX.png">
<link rel="apple-touch-icon-precomposed" sizes="114x114" href="XXXX.png">
<link rel="apple-touch-icon-precomposed" sizes="144x144" href="XXXX.png">

<!-- 還可以加上 -->
media="screen and (min-device-width:481px) and (max-device-width:1024px) and (orientation:landscape) and (-webkit-min-device-pixel-ratio: 2)">

<!-- 關於行動裝置主畫面 -->
<!-- 添加到主畫面的標題（iOS 6 新增） -->
<meta name="apple-mobile-web-app-title" content="標題">

<!-- 是否啟用 WebApp 全螢幕模式，刪除蘋果默認的工具欄和選單 -->
<meta name="apple-mobile-web-app-capable" content="yes"/>

<!-- 添加智能 App 廣告條（iOS 6+ Safari） -->
<meta name="apple-itunes-app" content="app-id=myAppStoreID, affiliate-data=myAffiliateData, app-argument=myURL">

<!-- 設置蘋果工具欄顏色 -->
<meta name="apple-mobile-web-app-status-bar-style" content="black"/>

<!-- 忽略頁面中的數字識別為電話，忽略email識別 -->
<meta name="format-detection" content="telphone=no, email=no"/>

<!-- iPad （直） 768 x 1004（標準解析度） -->
<link rel="apple-touch-startup-image" sizes="768x1004" href="/splash-screen-768x1004.png"/>

<!-- iPad （直） 1536x2008（Retina） -->
<link rel="apple-touch-startup-image" sizes="1536x2008" href="/splash-screen-1536x2008.png"/>

<!-- iPad (橫) 1024x748（標準解析度） -->
<link rel="apple-touch-startup-image" sizes="1024x748" href="/Default-Portrait-1024x748.png"/>

<!-- iPad (橫) 2048x1496（Retina）-->
<link rel="apple-touch-startup-image" sizes="2048x1496" href="/splash-screen-2048x1496.png"/>

<!-- iPhone/iPod Touch 豎屏 320x480 (標準解析度) -->
<link rel="apple-touch-startup-image" href="/splash-screen-320x480.png"/>

<!-- iPhone/iPod Touch 豎屏 640x960 (Retina) -->
<link rel="apple-touch-startup-image" sizes="640x960" href="/splash-screen-640x960.png"/>

<!-- iPhone 5/iPod Touch 5 豎屏 640x1136 (Retina)-->
<link rel="apple-touch-startup-image" sizes="640x1136" href="/splash-screen-640x1136.png"/>

<!-- RSS -->
<link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml"/>
```

除此之外：

- H1 — H5 至少要有一個，且按照層級出現，不可跳過。
- 資料類型請使用 table, 列表類型請使用 ol, ul。
- 內容太長可以使用錨點，例如 `<a href="#id"></a>`，增加關聯性。
- Html盡量符合語意，例如文章使用```<article>```，章節使用```<section>```。
- 如果可以，可增加影音類型有助提升 SEO。
- 可以增加輔助標示的要加上去。例如：
```html
<img alt="測試圖"/>
<a href="#" title="連結">連結文字</a>
```
- 語言
```html
<html lang="en">
```

#### Vue

因為目前專案大部分都使用 Vue ，但 Vue 要做每頁都不一樣的 meta 資訊比較麻煩，所以直接使用 Nuxt。
全域: 整個網站，寫在全域設定檔 nuxt.config.js
單頁: 套用單頁，寫在該頁面的 head 設定，例如：

```ts
export default {
  head: {
    title: ''
 }
}
```

#### 網頁載入速度

- 基本先依據 Google PageSpeed Insights改善。至少半秒載完畫面。
- 提供 next-gen 格式的圖片  
JPEG 2000、JPEG XR 和 WebP 等圖片格式的壓縮效果通常優於 PNG 或 JPEG，因此能提高下載速度並節省使用者的數據用量。
- 使用大小合適的圖片有助於節省行動數據用量並縮短載入時間。  
視瀏覽器支援狀況採用不同技術，若可支援最新，圖片可使用 `<picture>` 相關 RWD 方式。若不支援最新，使用 css media方式。
另外情境如果可以，使用 lazy loading。
- 排除禁止轉譯的資源。  
先載入必要之 js/css ，其他不重要的使用 lazy loading
- 視情況使用 Cache
- 將主要執行緒的工作降到最低 。
- 文字壓縮
- 避免耗用大量網路資源。
- 減少 JavaScript 執行時間
- 將關鍵要求層級降至最低 。優先載入必要資源
- 降低要求數量並減少傳輸大小
- 手機版跟桌機版

#### 網站安全性

- Https (申請 SSL)，Chrome79將逐步封鎖網頁中未SSL加密之內容
- 如果使用者輸入http，也要轉到 Https
- 監控流量、伺服器錯誤、駭客入侵等可使用 Google Search Console幫助
- 備份
- 防火牆與弱掃
- 軟體更新
- 其他，sesstion 存活時間、不連外網、blahblah…

#### 提交索引

- Google 在 2018/7/25 星期三宣布停止公開提交網址索引的服務。
- Bing 於 2018/9/18 公告停止公開提交網址索引服務
- [Google Search Console](https://search.google.com/search-console/about "另開新視窗"){target=_blank}
- [Bing網站管理工具](https://www.bing.com/toolbox/webmaster "另開新視窗"){target=_blank}

#### 域名

域名最好可以包含關鍵字或相關。
使用者不管有沒有打 www ，也要可以連線。
域名最好是符合性質。例如台灣使用.tw，開發使用.dev

#### Robot.txt

- 允許所有搜尋引擎檢索所有內容(通常建議使用)  
 User-agent: *  
 Disallow:  
- 拒絕所有搜尋引擎檢索所有內容(正式環境請避免使用)  
 User-agent: *  
 Disallow: /  
- 拒絕所有搜尋引擎檢索/members/底下所有內容。  
 User-agent: *  
 Disallow: /members/  
- 拒絕Google搜圖的爬蟲檢索/images/底下所有內容。  
 User-agent: Googlebot-image  
 Disallow:/images/  
- 萬用字元：拒絕所有搜尋引擎檢索網站內png為副檔名的圖檔。  
 User-agent: *  
 Disallow: *.png$  
- 萬用字元：拒絕Bing搜尋引擎檢索網站內/wp-admin目錄底下所有內容及網站內開頭為test的所有檔名。  
 User-agent: bingbot  
 Disallow: /wp-admin/  
 Disallow: ^test*  
- sitemap: http://www.XXXXXXXX.com/sitemap.xml  
- Crawl-deslay: XX — 告訴爬蟲，再次來訪的最短時間間隔為20秒。(百度公開表示不支援此語法)  
- Robot.txt檔案只能放在網站的根目錄底下  
- 有些東西要擋掉比較好  

#### 其他

- XML
- 可使用工具產生：XML-Sitemaps  
網址數量往往超過一個Sitemap檔案可以乘載的大小？  
單靠Sitemap製作工具依然會有許多網頁沒辦法被找到？  
每天都有大量新頁面產生，需要時時更新Sitemap內的內容？  
解決辦法：套件、模組、自行開發程式自行產生sitemap  
- Subdomain or SubFolder？  
建議 SubFolder

::figure
  ![Subdomain 與 SubFolder 比較圖表](/images/blog/9.png)
  ::figcaption
    SubFolder 表現較佳
  ::
::

#### UX

- 每頁至少要顯示關鍵字一次。
- 避免無意義的用關鍵字填滿內容，可使用同義詞 確保內容是高品質的。
- 內容定期更新，透露更新時間。
- 廣告不能影響主要內容閱讀，且可以是被辨別的。 提供外部連結與內部連結。
- supplementary content。例如:導航選單。
- 舊的 SEO 資訊要清理乾淨 。
- Copyright, Contact。
- 主要內容前 150 個字要有關鍵字。
- ```<title>```少於64個字符, 您最多可以包含12個單詞，這些單詞將被算作頁 面標題的一部分，並考慮在前8個單詞中使用重要的關鍵字。頁面標題 的其餘部分將被視為頁面上的普通文本。
- 別亂轉址。
- 太多 Landing Page 導到同一頁面。
- 頁面只以賺錢為目的，google 會視為垃圾。 廣告別亂放，蓋全頁面會被降低排名。
- 自動播放的影音廣告會降低排名 固定位置的大型廣告會降低排名 廣告在行動裝置大於30%高度會降低排名
- 全螢幕的廣告 動畫廣告
- [Sitelinks](https://www.searchenginewatch.com/2017/11/30/what-are-sitelinks-and-how-can-i-get-them/ "另開新視窗"){target="_blank"} and search box internal 語言沒設定好，也會影響。

::figure
  ![在搜尋結果出現站內搜尋框](/images/blog/10.webp)
  ::figcaption
    站內搜尋
  ::
::

- 語言
- 301 Redirects Are POWERFUL & WHITE HAT
- 注意使用者在你的網站上的發言內容

#### 工具整理

- [Google Search Console](https://search.google.com/search-console/about "另開新視窗"){target="_blank"}
- [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/?hl=zh-TW "另開新視窗"){target="_blank"}
- [Google Ads 關鍵字研究](https://ads.google.com/home/tools/keyword-planner/ "另開新視窗"){target="_blank"}
- [Google結構化資料測試工具](https://search.google.com/structured-data/testing-tool/ "另開新視窗"){target="_blank"}
- [Google Analytics](https://marketingplatform.google.com/about/analytics/ "另開新視窗"){target="_blank"}
- [Bing網站管理工具](https://www.bing.com/toolbox/webmaster "另開新視窗"){target="_blank"}
- [相關關鍵字檢索](https://keywordtool.io/ "另開新視窗"){target="_blank"}
- [相關關鍵字檢索＋查看其他有關的網站](https://app.kwfinder.com/ "另開新視窗"){target="_blank"}
- [XML-Sitemaps](https://www.xml-sitemaps.com/ "另開新視窗"){target="_blank"}
- [SEO Reporter](https://seositecheckup.com/ "另開新視窗"){target="_blank"}

#### 參考

- [搜尋引擎最佳化](https://zh.wikipedia.org/wiki/%E6%90%9C%E5%B0%8B%E5%BC%95%E6%93%8E%E6%9C%80%E4%BD%B3%E5%8C%96#%E5%BD%93%E4%BB%A3%E6%90%9C%E5%B0%8B%E5%BC%95%E6%93%8E "另開新視窗"){target="_blank"}
- [Google SEO Tutorial for Beginners | How To SEO A Website Step By Step (2020)](https://www.hobo-web.co.uk/seo-tutorial/?fbclid=IwAR0QKuD_RBGD-DdRr2vbj3brSjJ9H_50hqtLKE98_C4BfRvufcW0F0IvnJI#an-introduction-to-seo "另開新視窗"){target="_blank"}
- [On-Page SEO: Anatomy of a Perfectly Optimized Page (2019 Update)](https://backlinko.com/on-page-seo "另開新視窗"){target="_blank"}
- [結構化資料 SEO 與 meta 標籤](https://www.oxxostudio.tw/articles/201406/social-meta.html "另開新視窗"){target="_blank"}
- [01. Nuxt.js 小跑起步 - iT 邦幫忙::一起幫忙解決難題，拯救 IT 人的一天](https://ithelp.ithome.com.tw/articles/10201762 "另開新視窗"){target="_blank"}
- [08. Nuxt 客製《甜點電商》SEO 基本資訊 - iT 邦幫忙::一起幫忙解決難題，拯救 IT 人的一天](https://ithelp.ithome.com.tw/articles/10204248 "另開新視窗"){target="_blank"}
- [株式会社アンク：コピペ判定判定ソフト「コピペルナー」](http://www.ank.co.jp/works/products/copypelna/ "另開新視窗"){target="_blank"}
- [重複コンテンツ・ミラーサイト・類似ページ判定ツール](http://sujiko.jp/ "另開新視窗"){target="_blank"}
- [Mobile-Friendly Test - Google Search Console](https://search.google.com/test/mobile-friendly "另開新視窗"){target="_blank"}
- [SEOチェキ！無料で使えるSEOツール](http://seocheki.net/ "另開新視窗"){target="_blank"}
- [Google / Yahoo 關鍵字排名查詢 | 陪您航向未來的好夥伴 - Allstars 星辰網站建置與網頁設計](https://the-allstars.com/tools/keyword/search "另開新視窗"){target="_blank"}
- [Free Keyword Rank Checker Tool Online for Google, Yahoo, Bing](https://myrankaware.com/ "另開新視窗"){target="_blank"}