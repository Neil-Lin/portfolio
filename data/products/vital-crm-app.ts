import type { Product } from "../types";

export const vitalCrmApp: Product = {
  id: 10,
  slug: "vital-crm-app",
  clickable: true,
  schemaImage: {
    "zh-Hant-TW": [
      {
        src: "/images/vitalcrm-app-thumbnail.png",
        figcaption: "Vital CRM 客戶關係管理系統 App",
      },
    ],
    en: [
      {
        src: "/images/vitalcrm-app-thumbnail.png",
        figcaption: "Vital CRM App",
      },
    ],
  },
  heroImage: {
    "zh-Hant-TW": [
      {
        src: "/images/vitalcrm-app-thumbnail.webp",
        figcaption: "Vital CRM 客戶關係管理系統 App",
      },
    ],
    en: [
      {
        src: "/images/vitalcrm-app-thumbnail.webp",
        figcaption: "Vital CRM App",
      },
    ],
  },
  name: {
    "zh-Hant-TW": "Vital CRM App",
    en: "Vitals CRM App",
  },
  intro: {
    "zh-Hant-TW": "業績提升、增加回購率及熟客經營最佳首選。",
    en: "The best choice for boosting sales, increasing repurchase rates, and managing loyal customers.",
  },
  keywords: {
    "zh-Hant-TW": ["CRM", "客戶關係管理系統"],
    en: ["CRM", "Customer Relationship Management"],
  },
  summary: {
    "zh-Hant-TW":
      "Vital CRM 是一款專為中小企業量身打造的雲端顧客關係管理系統。2014 年推出新版 App，設計首重於使用者在戶外跑業務時，如何迅速找到客戶、記錄拜訪重點、行事曆管理以及處理後續任務。",
    en: "Vital CRM is a cloud-based customer relationship management system tailored for small and medium-sized enterprises. In 2014, a new version of the app was launched, with a primary focus on helping users efficiently locate clients, record key visit details, manage calendars, and handle follow-up tasks while working in the field.",
  },
  platform: ["app"],
  yearRange: { start: 2014, end: 2018 },
  target: {
    "zh-Hant-TW": [
      "改善舊版使用套件預設的 UI 樣式導致產品沒有個性、操作不符合內容類型以及適逢各行動裝置尺寸的興起。",
      "增進主管管理、業務外出使用的便利性。",
      "引進設計流程。",
    ],
    en: [
      "Improve the outdated default UI styles from previous versions, which resulted in a lack of product identity, inconsistent user interactions, and poor adaptability to the rise of various mobile device sizes.",
      "Enhance convenience for managers and sales representatives working in the field.",
      "Introduce a structured design process.",
    ],
  },
  roles: {
    "zh-Hant-TW": ["UI", "UX", "切版"],
    en: ["UI", "UX", "Layout"],
  },
  tools: {
    "zh-Hant-TW": [
      "紙與筆",
      "Illustrator",
      "Sketch app",
      "4ourth Mobile Touch Template",
    ],
    en: [
      "pen adn pepper",
      "Illustrator",
      "Sketch app",
      "4ourth Mobile Touch Template",
    ],
  },
  research: {
    "zh-Hant-TW": [
      "快速且輕易地尋找目標人物。",
      "要比舊版更好的填寫紀錄。",
      "新增任務系統。",
      "新增分享系統(地點、留言、任務/約會與會議)。",
      "研究當時各種行動裝置尺寸、使用者操作模式以及可觸及範圍，作為日後設計版面之依據。",
      "Functional Map、UI Flow 以及 Wireframe",
      "既要符合現有產品的視覺規範與個性，且還要盡量遵循 iOS 與 Android Guideline",
      "使用者經常在外奔波，操作範圍要大且符合情境操作，例如機/汽車、單/雙手、點/握/拿...等。",
      "資訊量龐大，不作無謂裝飾，聚焦於資訊呈現簡單易懂。",
    ],
    en: [
      "Quickly and easily find target individuals.",
      "Improve the record-filling process compared to the previous version.",
      "Introduce a task management system.",
      "Add a sharing system (locations, comments, tasks/appointments, and meetings).",
      "Research various mobile device sizes, user interaction patterns, and touch accessibility to inform future layout design.",
      "Functional Map, UI Flow, and Wireframe.",
      "Ensure alignment with the existing product's visual guidelines and identity while adhering to iOS and Android guidelines as much as possible.",
      "Users are often on the move, so the interface must be large and contextually appropriate for various scenarios, such as operating in a car, using one or both hands, tapping, holding, or gripping.",
      "Given the large amount of information, avoid unnecessary decorations and focus on presenting data in a clear and easily understandable way.",
    ],
  },
  images: {
    "zh-Hant-TW": [
      {
        src: "/images/vitalcrm-app-wireframe.webp",
        figcaption: "functional map 和 wireframe",
      },
      {
        src: "/images/vitalcrm-design-mobile.webp",
        figcaption:
          "Vital CRM APP 重點截圖，使用手機通常使用單手/握，所以重要操作置於中央與下方（列表、功能按鈕以及快捷按鈕），次要操作（搜尋、選單以及修改）放置於較上方，且均符合當時作業系統版本的 Guideline。針對左右手操作距離都相等，只有快捷按鈕偏右側（但符合作業系統 Guideline）。",
      },
      {
        src: "/images/vitalcrm-design-tablet.webp",
        figcaption:
          "Vital CRM APP (Tablet) 重點截圖，平板打橫可操作範圍較直式的區域廣。另外，因為中央區域會變得比較難按到，所以會把需要專注且較花時間的操作，放在靠近中央區域（因為此時操作情境偏向較常使用單手/點/放置平穩的模式），例如：編輯客戶資料。如果只是瀏覽資訊，情境會變成雙手/握/拇指滑動，會盡量靠近兩側可滑動區域。",
      },
    ],
    en: [
      {
        src: "/images/vitalcrm-app-wireframe.webp",
        figcaption: "Functional map and wireframe.",
      },
      {
        src: "/images/vitalcrm-design-mobile.webp",
        figcaption:
          "Key screenshots of the Vital CRM App. Since mobile users typically operate with one hand or by gripping the device, primary actions are positioned centrally and at the bottom (lists, function buttons, and quick actions), while secondary actions (search, menu, and editing) are placed towards the top. The layout adheres to the OS version guidelines at the time. The interface is designed to be equally accessible for both left- and right-handed users, with the quick action button slightly biased to the right, in alignment with system guidelines.",
      },
      {
        src: "/images/vitalcrm-design-tablet.webp",
        figcaption:
          "Key screenshots of the Vital CRM App (Tablet). In landscape mode, tablets offer a broader operational range compared to portrait mode. Since the central area becomes harder to reach, tasks requiring focus and extended interaction, such as editing customer details, are placed near the center (as the user is more likely to operate with one hand, tapping, or in a stable resting position). For information browsing, the scenario shifts to a two-handed grip with thumb scrolling, so scrollable areas are positioned closer to the edges for better accessibility.",
      },
    ],
  },
  relatedLinks: {
    "zh-Hant-TW": [
      {
        title: "Apple Store",
        link: "https://apps.apple.com/us/app/vital-crm/id932283661",
      },
      {
        title: "Google Play",
        link: "https://play.google.com/store/apps/details?id=com.gss.videgreeapp2&hl=zh_TW&gl=US",
      },
      {
        title: "Vital CRM",
        link: "https://www.gsscloud.com/tw/vital/crm",
      },
    ],
    en: [
      {
        title: "Apple Store",
        link: "https://apps.apple.com/us/app/vital-crm/id932283661",
      },
      {
        title: "Google Play",
        link: "https://play.google.com/store/apps/details?id=com.gss.videgreeapp2&hl=zh_TW&gl=US",
      },
      {
        title: "Vital CRM",
        link: "https://www.gsscloud.com/tw/vital/crm",
      },
    ],
  },
  updatedAt: "2025-08-06T00:00:01.000Z",
};
