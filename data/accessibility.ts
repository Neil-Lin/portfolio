import type { I18nString, LocaleKey } from "./types.ts";

// 無障礙聲明（/accessibility/）的內容，結構參考 W3C「Developing an Accessibility Statement」：
// 最低要求是承諾、採用的標準、聯絡方式；另外建議寫已知限制、採取的措施、測試環境、相關法規。
// 每次檢視過內容就更新 reviewedAt。超過 12 個月沒更新，冒煙測試會失敗（W3C：超過一年的聲明可能被視為沒有維護）。

export interface KnownLimitation {
  /** 哪個部分 */
  where: string;
  /** 用白話描述問題，不寫 WCAG 條號 */
  issue: string;
  /** 在問題解決前，使用者可以怎麼做 */
  meanwhile: string;
}

export interface MeasureItem {
  /** 文字裡的 {link} 會換成連結 */
  text: string;
  link?: { label: string; url: string };
}

export const accessibilityStatement = {
  /** 最後檢視日期（YYYY-MM-DD），不是 build date */
  reviewedAt: "2026-11-23",
  contactEmail: "unclea11yuncle@gmail.com",
  badgeUrl:
    "https://accessibility.moda.gov.tw/Applications/Detail?category=20250820134645",

  commitment: {
    "zh-Hant-TW":
      "我希望每個人都能順利使用這個網站，不論你用滑鼠、鍵盤、螢幕報讀軟體或其他輔助科技。網站從設計到切版都以通用設計為原則，並持續檢查與改善。",
    en: "I want everyone to be able to use this website, whether you use a mouse, a keyboard, a screen reader or other assistive technology. The site is designed and built with universal design in mind, and I keep checking and improving it.",
  } satisfies I18nString,

  standard: {
    "zh-Hant-TW":
      "本網站通過數位發展部的臺灣無障礙網頁標章 AA 等級檢測，檢測以 WCAG 2.1 為基礎。臺灣法規只要求政府機關與學校網站取得標章，這是個人網站，標章是我自願申請的。",
    en: "This website has passed the AA level check for Taiwan's web accessibility badge, issued by the Ministry of Digital Affairs. The check is based on WCAG 2.1. Taiwanese law only requires the badge for government and school websites; this is a personal site, and I applied for it voluntarily.",
  } satisfies I18nString,

  measures: {
    "zh-Hant-TW": [
      { text: "通過臺灣無障礙網頁標章 AA 等級的外部檢測。" },
      {
        text: "發布前用 {link} 在實際頁面上自我檢查，包含 axe-core 掃描、焦點路徑、可及名稱與情境模擬。",
        link: {
          label: "Accesserty DevCheck",
          url: "https://accesserty.com/devcheck/",
        },
      },
      {
        text: "上線後由 {link} 收集鍵盤與操作事件，作為回頭檢查頁面的線索。",
        link: {
          label: "Accesserty Pulse",
          url: "https://accesserty.com/pulse/",
        },
      },
      {
        text: "每次部署前自動檢查每一頁的語言標示、標題結構，以及「跳到主要內容」連結。",
      },
    ],
    en: [
      {
        text: "Passed the external check for Taiwan's web accessibility badge at AA level.",
      },
      {
        text: "Before publishing, I check the real pages with {link}: axe-core scans, focus order, accessible names and simulations.",
        link: {
          label: "Accesserty DevCheck",
          url: "https://accesserty.com/en/devcheck/",
        },
      },
      {
        text: "After launch, {link} collects keyboard and interaction events, which tell me which pages to go back and check.",
        link: {
          label: "Accesserty Pulse",
          url: "https://accesserty.com/en/pulse/",
        },
      },
      {
        text: "Before every deployment, each page is automatically checked for its language setting, heading structure and skip-to-content link.",
      },
    ],
  } satisfies Record<LocaleKey, MeasureItem[]>,

  testedWith: {
    "zh-Hant-TW":
      "以 macOS 上的 Chrome 搭配 VoiceOver 測試。網站使用 HTML、WAI-ARIA、CSS 與 JavaScript，部分功能需要開啟 JavaScript。",
    en: "Tested with Chrome and VoiceOver on macOS. The site uses HTML, WAI-ARIA, CSS and JavaScript, and some features need JavaScript turned on.",
  } satisfies I18nString,

  limitations: {
    "zh-Hant-TW": [
      {
        where: "MPOS 產品頁的操作影片",
        issue: "影片沒有聲音，頁面上也沒有文字說明影片裡操作了什麼。",
        meanwhile: "如果需要影片內容的文字說明，請來信，我會提供。",
      },
      {
        where: "部落格文章裡嵌入的第三方內容",
        issue:
          "例如 Whimsical 流程圖、CodePen 範例，這些內容由第三方提供，不一定能用鍵盤或螢幕報讀軟體操作；Accesserty 介紹文章裡的流程圖也沒有文字版。",
        meanwhile:
          "CodePen 範例可以從文章裡的連結另開頁面瀏覽；需要流程圖的文字版請來信。",
      },
      {
        where: "部落格的互動範例",
        issue:
          "部分範例在示範瀏覽器還在實驗中的功能，在不支援的瀏覽器上無法操作。",
        meanwhile:
          "大部分範例會顯示你的瀏覽器是否支援。看不到範例結果時，歡迎來信詢問。",
      },
    ],
    en: [
      {
        where: "Demo videos on the MPOS product page",
        issue:
          "The videos have no sound, and the page has no text describing what happens in them.",
        meanwhile:
          "If you need a text description of the videos, email me and I'll send one.",
      },
      {
        where: "Third-party content embedded in blog posts",
        issue:
          "Content such as Whimsical flowcharts and CodePen demos comes from third parties and may not work with a keyboard or screen reader. The flowchart in the post introducing Accesserty has no text version.",
        meanwhile:
          "CodePen demos can be opened on their own page from the link in the post. Email me if you need a text version of the flowchart.",
      },
      {
        where: "Interactive demos in the blog",
        issue:
          "Some demos show browser features that are still experimental, and they don't work in browsers that don't support them.",
        meanwhile:
          "Most demos show whether your browser supports the feature. If you can't see what a demo does, feel free to email me.",
      },
    ],
  } satisfies Record<LocaleKey, KnownLimitation[]>,
};
