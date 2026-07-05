import type { Product } from "../types";

export const mpos: Product = {
  id: 9,
  slug: "mpos",
  clickable: true,
  schemaImage: {
    "zh-Hant-TW": [
      {
        src: "/images/mpos-thumbnail.png",
        figcaption: "POS 系統示意圖",
      },
    ],
    en: [
      {
        src: "/images/mpos-thumbnail.png",
        figcaption: "POS System",
      },
    ],
  },
  heroImage: {
    "zh-Hant-TW": [
      {
        src: "/images/mpos-thumbnail.webp",
        figcaption: "POS 系統示意圖",
      },
    ],
    en: [
      {
        src: "/images/mpos-thumbnail.webp",
        figcaption: "POS System",
      },
    ],
  },
  name: {
    "zh-Hant-TW": "MPOS",
    en: "MPOS",
  },
  intro: {
    "zh-Hant-TW":
      "行動版餐飲 POS 系統，無論你人在哪裡，都能不受限的利用平板為顧客服務。",
    en: "A mobile restaurant POS system featuring multi-tablet order distribution, electronic invoice issuance, fast ordering, and customizable product content.",
  },
  keywords: {
    "zh-Hant-TW": ["餐飲 POS", "行動版 POS", "平板點餐"],
    en: ["Restaurant POS", "Mobile POS", "Tablet Ordering"],
  },
  summary: {
    "zh-Hant-TW":
      "一款行動版餐飲 POS 系統，擁有多台平板分流、開立電子發票、快速點餐與商品內容客製化等功能，無論你人在哪裡，都能不受限的利用平板為顧客服務，輕鬆提升服務水準，獲取顧客好評。",
    en: "A mobile restaurant POS system featuring multi-tablet order distribution, electronic invoice issuance, fast ordering, and customizable product content. No matter where you are, you can seamlessly serve customers using a tablet, effortlessly enhancing service quality and earning positive customer feedback.",
  },
  platform: ["app"],
  yearRange: { start: 2016, end: 2017 },
  target: {
    "zh-Hant-TW": [
      "2016 年製作新版 APP，提高餐飲業在前場有更好的使用、管理流程。",
      "快、快、快，第一線點餐要快！",
      "任何時間點都可以編輯訂單內容。",
      "快速取得會員資訊並回饋。",
    ],
    en: [
      "Developed a new version of the app in 2016 to enhance usability and management processes for the restaurant industry.",
      "Speed, speed, speed – frontline ordering must be fast!",
      "Order contents can be edited at any time.",
      "Quickly access member information and provide feedback.",
    ],
  },
  roles: {
    "zh-Hant-TW": ["UI", "UX"],
    en: ["UI", "UX"],
  },
  tools: {
    "zh-Hant-TW": [
      "Sketch app",
      "Zeplin",
      "Flinto",
      "Illustrator",
      "4ourth Mobile Touch Template",
    ],
    en: [
      "Sketch app",
      "Zeplin",
      "Flinto",
      "Illustrator",
      "4ourth Mobile Touch Template",
    ],
  },
  observe: {
    "zh-Hant-TW": [
      "在尖峰時刻點餐必須很快就處理完畢",
      "常常發生修改訂單的狀況。",
      "各種優惠方案、付費方式。",
      "查詢會員資訊。",
    ],
    en: [
      "Orders must be processed quickly during peak hours.",
      "Order modifications occur frequently.",
      "Various discount plans and payment methods.",
      "Retrieve member information.",
    ],
  },
  learn: {
    "zh-Hant-TW": [
      "什麼是 POS 系統？",
      "舊版 POS 系統的優缺點為何？",
      "與後台和 CRM 的關係又是為何？",
      "有哪些硬體設備？",
    ],
    en: [
      "What is a POS system?",
      "What are the pros and cons of the previous POS system?",
      "How does it relate to the backend and CRM?",
      "What hardware devices are involved?",
    ],
  },
  research: {
    "zh-Hant-TW": [
      "研究當時適合當餐飲業用的平板，作為日後設計版面之依據。",
      "跨公司、跨團隊遠端溝通，一步步解析尋找舊版未被提及的痛點",
      "因應新需求找出新操作模式，幫助使用者快速找出歷史紀錄",
      "使用 Zeplin 與工程師溝通並製作符合原生 APP 規範的圖片，避免無法正確傳達設計。",
      "使用 Flinto 製作動畫，輔助工程師理解操作行為緣由與過場。",
      "與視覺設計師合作，設計出即便是在前場混亂的情況，也要能即時掌握資訊。",
    ],
    en: [
      "Researched suitable tablets for the restaurant industry at the time to inform future layout design.",
      "Facilitated remote communication across companies and teams, systematically identifying pain points overlooked in the previous version.",
      "Developed new interaction models to meet updated requirements, helping users quickly retrieve historical records.",
      "Used Zeplin to communicate with engineers and create images that adhere to native app guidelines, ensuring accurate design implementation.",
      "Utilized Flinto to create animations, aiding engineers in understanding user interactions and transitions.",
      "Collaborated with visual designers to create a UI that enables real-time information management, even in a chaotic front-line environment.",
    ],
  },
  images: {
    "zh-Hant-TW": [
      {
        src: "/images/device-situation-tablet.webp",
        figcaption: "裝置與手勢",
      },
      {
        src: "/images/mpos-discuss.webp",
        figcaption: "發想新操作模式",
      },
      {
        src: "/images/mpos-wireframe.webp",
        figcaption: "藉由 Wireframe 密集討論，找出最符合情境、最有效率的方案。",
      },
      {
        src: "/images/mpos.webp",
        figcaption: "設計稿",
      },
      {
        src: "/images/mpos-all.webp",
        figcaption: "所有過程",
      },
    ],
    en: [
      {
        src: "/images/device-situation-tablet.webp",
        figcaption: "Device and gestures.",
      },
      {
        src: "/images/mpos-discuss.webp",
        figcaption: "Brainstorming new interaction models.",
      },
      {
        src: "/images/mpos-wireframe.webp",
        figcaption:
          "Intensive discussions through wireframes to identify the most contextually appropriate and efficient solutions.",
      },
      {
        src: "/images/mpos.webp",
        figcaption: "Final design mockups.",
      },
      {
        src: "/images/mpos-all.webp",
        figcaption: "Process",
      },
    ],
  },
  videos: {
    "zh-Hant-TW": [
      {
        src: "/video/mpos-login.mp4",
        title: "登入",
        thumbnail_loc: "https://neillin.com/images/mpos-thumbnail.png",
        description: "MPOS 登入畫面操作影片",
      },
      {
        src: "/video/mpos-main.mp4",
        title: "點餐系統",
        thumbnail_loc: "https://neillin.com/images/mpos-thumbnail.png",
        description: "MPOS 點餐系統操作影片",
      },
    ],
    en: [
      {
        src: "/video/mpos-login.mp4",
        title: "Login",
        thumbnail_loc: "https://neillin.com/images/mpos-thumbnail.png",
        description: "MPOS login screen operation video.",
      },
      {
        src: "/video/mpos-main.mp4",
        title: "Order",
        thumbnail_loc: "https://neillin.com/images/mpos-thumbnail.png",
        description: "MPOS ordering system operation video.",
      },
    ],
  },
  updatedAt: "2025-08-06T00:00:01.000Z",
};
