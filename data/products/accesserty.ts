import type { Product } from "../types";

export const accesserty: Product = {
  id: 11,
  slug: "accesserty",
  clickable: true,
  schemaImage: {
    "zh-Hant-TW": [
      {
        src: "/images/accesserty-thumbnail.png",
        figcaption: "Accesserty 無障礙網頁解決方案",
      },
    ],
    en: [
      {
        src: "/images/accesserty-thumbnail.png",
        figcaption: "Accesserty website a11y solutions",
      },
    ],
  },
  heroImage: {
    "zh-Hant-TW": [
      {
        src: "/images/accesserty-thumbnail.webp",
        figcaption: "Accesserty 無障礙網頁解決方案",
      },
    ],
    en: [
      {
        src: "/images/accesserty-thumbnail.webp",
        figcaption: "Accesserty website a11y solutions",
      },
    ],
  },
  name: {
    "zh-Hant-TW": "[Side Project] Accesserty",
    en: "[Side Project] Accesserty",
  },
  intro: {
    "zh-Hant-TW": "讓每個人都能容易且自由地取得網頁資訊",
    en: "Enable everyone to access information freely.",
  },
  keywords: {
    "zh-Hant-TW": [
      "無障礙網頁",
      "Chrome 擴充功能",
      "網頁體驗透明化",
      "Web Components",
    ],
    en: [
      "Web Accessibility",
      "Chrome Extension",
      "Web Experience Transparency",
      "Web Components",
    ],
  },
  summary: {
    "zh-Hant-TW":
      "Accesserty 是一個為資訊公平性設計的網頁體驗透明化層。它讓使用者在日常的搜尋與瀏覽過程中，清楚看見哪些網站願意傾聽、準備改進、並積極採取行動。",
    en: "Making information experiences transparent, participatory, and improvable. Accesserty is a web experience transparency layer for information equity. It enables users—through their everyday searching and browsing—to clearly see which websites are willing to listen, ready to improve, and actively taking action.",
  },
  platform: ["web"],
  yearRange: { start: 2025, end: null },
  target: {
    "zh-Hant-TW": [
      "使每個人都能自由獲取訊息，不受技術、失能或設計的排斥。",
      "Accesserty 致力於創建一個以資訊公平為基礎的網路空間，讓用戶體驗的差異能夠被看到並得到改善。",
    ],
    en: [
      "Enable everyone to access information freely, without being excluded by technology, disability, or design.",
      "Accesserty is committed to creating a web space rooted in information equity, where differences in user experience are seen — and improved.",
    ],
  },
  roles: {
    "zh-Hant-TW": ["UI", "UX", "切版", "專案管理"],
    en: ["UI", "UX", "Layout", "PM"],
  },
  tools: {
    "zh-Hant-TW": ["ChatGPT", "Chrome Extension", "Whimsical", "Github"],
    en: ["ChatGPT", "Chrome Extension", "Whimsical", "Github"],
  },
  research: {
    "zh-Hant-TW": [
      "拆解無障礙網頁在瀏覽與開發的流程",
      "找出使用者、開發者在流程上所遭遇的各種痛點",
      "如何使用 ChatGPT 產出一致的結果",
    ],
    en: [
      "Breaking Down Web Accessibility in Browsing and Development Processes",
      "Identifying Various Pain Points Faced by Users and Developers in the Process",
      "How to Use ChatGPT to Generate Consistent Results",
    ],
  },
  images: {
    "zh-Hant-TW": [
      {
        src: "/images/accesserty-flow.webp",
        figcaption:
          "在瀏覽網頁之前到開發者修復的過程，Accesserty 都能提供幫助，打造永續改善無障礙的良好循環。",
      },
      {
        src: "/images/accesserty-signal.webp",
        figcaption:
          "Accesserty Signal 是一款輕量級 Chrome 擴充功能，可幫助使用者辨識哪些網站正積極提升其使用者體驗——從 Google 搜尋結果頁面就能看出端倪。它不對網站進行排名、評分或評判，而是透過在搜尋結果旁顯示一個微妙的標記（徽章），指示該網站是否參與了持續透明化與改進的計畫。這不是關於「通過」或「失敗」，而是關於誰正在努力改進。",
      },
      {
        src: "/images/accesserty-devcheck.webp",
        figcaption:
          "Accesserty DevCheck 是一款輕量級的無障礙輔助工具，專為開發者與設計師設計。它能幫助你模擬真實使用者的限制，並在開發初期或審核過程中及早識別可及性問題——即使你並非 WCAG 標準的專家。DevCheck 不僅關注合規性，還致力於彌合抽象規範與具體使用體驗之間的落差，讓你能夠親眼見證使用者在實際操作網站時所遇到的困難。",
      },
      {
        src: "/images/accesserty-ui-kit.webp",
        figcaption:
          "Accesserty UI Kit 是一個以 Web Components 技術構建的網頁元件庫，內建無障礙語意、結構及互動支持，確保可及性為標準配置。即使不了解 WCAG 的技術細節，它依然能幫助你打造符合資訊公平性原則的介面，讓更多使用者能順利使用你的網站。",
      },
    ],
    en: [
      {
        src: "/images/accesserty-flow.webp",
        figcaption:
          "Accesserty supports users throughout the entire process—from browsing websites to developers making improvements—creating a sustainable cycle of accessibility enhancement.",
      },
      {
        src: "/images/accesserty-signal.webp",
        figcaption:
          "Accesserty Signal is a lightweight Chrome Extension that helps users identify which websites are actively working to improve their user experience — starting directly from the Google Search results page. It doesn't rank, score, or judge websites. Instead, it subtly displays a signal (badge) next to search results, indicating whether the website is part of an ongoing transparency and improvement initiative. It’s not about who passed or failed. It’s about who’s trying.",
      },
      {
        src: "/images/accesserty-devcheck.webp",
        figcaption:
          "Accesserty DevCheck is a lightweight accessibility assistant for developers and designers. It helps you simulate real user limitations and identify accessibility issues early in development or during audits — all without needing to be an expert in WCAG. DevCheck bridges the gap between abstract compliance and tangible user experience by showing you how people actually struggle to use your site.",
      },
      {
        src: "/images/accesserty-ui-kit.webp",
        figcaption:
          "Accesserty UI Kit is a library of web components built with Web Components technology, designed with built-in accessibility semantics, structure, and interaction support by default. It helps you build interfaces aligned with the principles of information equity, even without knowing the technical details of WCAG.",
      },
    ],
  },
  relatedLinks: {
    "zh-Hant-TW": [
      {
        title: "Accesserty Website",
        link: "https://accesserty.com/",
      },
      {
        title: "Accesserty Signal",
        link: "https://chromewebstore.google.com/detail/accesserty-signal/jabgpbgdmhdmibhogmcjfinnkcngcelc",
      },
      {
        title: "Accesserty DevCheck",
        link: "https://chromewebstore.google.com/detail/accesserty-devcheck/ompbhahmipenipgiiiehbkiibkonoeec",
      },
      {
        title: "Accesserty UI KIT",
        link: "https://accesserty.com/uikit",
      },
      {
        title: "Accesserty Product Hunt",
        link: "https://www.producthunt.com/posts/accesserty",
      },
    ],
    en: [
      {
        title: "Accesserty Website",
        link: "https://accesserty.com/en",
      },
      {
        title: "Accesserty Signal",
        link: "https://chromewebstore.google.com/detail/accesserty-signal/jabgpbgdmhdmibhogmcjfinnkcngcelc",
      },
      {
        title: "Accesserty DevCheck",
        link: "https://chromewebstore.google.com/detail/accesserty-devcheck/ompbhahmipenipgiiiehbkiibkonoeec",
      },
      {
        title: "Accesserty UI KIT",
        link: "https://accesserty.com/en/uikit",
      },
      {
        title: "Accesserty Product Hunt",
        link: "https://www.producthunt.com/posts/accesserty",
      },
    ],
  },
  updatedAt: "2025-08-06T00:00:01.000Z",
};
