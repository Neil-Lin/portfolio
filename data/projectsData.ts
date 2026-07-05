import type { Project } from "./types";

export const projectsData: Project[] = [
  {
    id: 1,
    slug: "kmwebmoa",
    clickable: false,
    name: {
      "zh-Hant-TW": "農業知識入口網",
      en: "Knowlwdge Management",
    },
    intro: {
      "zh-Hant-TW":
        "建置各項農產品生產技術、農田管理及其他產銷知識庫，結合資訊科技與農業生產、生活、生態、地方文化特色、行銷策略與農業生產科技等知識，發展農業核心知識之基礎應用",
      en: "stablish a knowledge base for agricultural production techniques, farmland management, and other production and marketing information. By integrating information technology with agricultural production, lifestyle, ecology, local cultural characteristics, marketing strategies, and agricultural technology, we aim to develop foundational applications for core agricultural knowledge.",
    },
    platform: ["web"],
    yearRange: { start: 2013, end: 2014 },
    roles: {
      "zh-Hant-TW": ["切版"],
      en: ["Layout"],
    },
  },
  {
    id: 2,
    slug: "1999taipei",
    clickable: true,
    link: "https://1999.gov.taipei/Front/main",
    heroImage: {
      "zh-Hant-TW": [
        {
          src: "/images/1999taipei-thumbnail.webp",
          figcaption: "陳情系統 1999 首頁示意圖",
        },
      ],
      en: [
        {
          src: "/images/1999taipei-thumbnail.webp",
          figcaption: "Taipei 1999 home page screenshot",
        },
      ],
    },
    name: {
      "zh-Hant-TW": "臺北市陳情系統 1999",
      en: "Taipei City Petition System",
    },
    intro: {
      "zh-Hant-TW": "同時打造 App 與 Web",
      en: "App and Web",
    },
    platform: ["web", "app"],
    yearRange: { start: 2015, end: 2018 },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 3,
    slug: "kmwebbsmi",
    clickable: false,
    name: {
      "zh-Hant-TW": "標準檢驗局知識入口網",
      en: "Knowlwdge Management",
    },
    intro: {
      "zh-Hant-TW": "內部知識入口網",
      en: "Knowlwdge Management",
    },
    platform: ["web"],
    yearRange: { start: 2018, end: 2018 },
    roles: {
      "zh-Hant-TW": ["切版"],
      en: ["Layout"],
    },
  },
  {
    id: 4,
    slug: "tfi",
    clickable: false,
    name: {
      "zh-Hant-TW": "國家電影中心藏品知識庫",
      en: "Digital Archive",
    },
    intro: {
      "zh-Hant-TW": "國家電影中心藏品知識庫",
      en: "Digital Archive",
    },
    platform: ["web"],
    yearRange: { start: 2018, end: 2018 },
    roles: {
      "zh-Hant-TW": ["UI", "UX", "切版"],
      en: ["UI", "UX", "Layout"],
    },
  },
  {
    id: 5,
    slug: "datagov",
    clickable: true,
    link: "https://data.gov.tw/",
    heroImage: {
      "zh-Hant-TW": [
        {
          src: "/images/data-gov-tw-thumbnail.webp",
          figcaption: "政府資料開放平臺",
        },
      ],
      en: [
        {
          src: "/images/data-gov-tw-thumbnail.webp",
          figcaption: "政府資料開放平臺",
        },
      ],
    },
    name: {
      "zh-Hant-TW": "政府資料開放平臺",
      en: "Data Gov",
    },
    intro: {
      "zh-Hant-TW": "政府資料開放平臺",
      en: "Open Data Gov",
    },
    platform: ["web"],
    yearRange: { start: 2019, end: null },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 6,
    slug: "mrt100",
    clickable: false,
    name: {
      "zh-Hant-TW": "捷運 100 億",
      en: "MRT 10 billion",
    },
    intro: {
      "zh-Hant-TW": "捷運 100 億運量活動網站",
      en: "MRT Activity Landing Page",
    },
    platform: ["web"],
    yearRange: { start: 2019, end: 2019 },
    roles: {
      "zh-Hant-TW": ["切版"],
      en: ["Layout"],
    },
  },
  {
    id: 7,
    slug: "taipeiod",
    clickable: false,
    name: {
      "zh-Hant-TW": "臺北市資料大平臺",
      en: "taipeiod",
    },
    intro: {
      "zh-Hant-TW": "臺北市的開放資料",
      en: "Open Data (Taipei)",
    },
    platform: ["web"],
    yearRange: { start: 2019, end: 2024 },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 8,
    slug: "storystudio",
    clickable: false,
    name: {
      "zh-Hant-TW": "故事",
      en: "StoryStudio",
    },
    intro: {
      "zh-Hant-TW": "使用 Wordpress 打造網站，並自行從頭到尾建置樣式範本",
      en: "Build a website using WordPress and create the style templates from scratch.",
    },
    platform: ["web"],
    yearRange: { start: 2019, end: 2019 },
    roles: {
      "zh-Hant-TW": ["切版"],
      en: ["Layout"],
    },
  },
  {
    id: 9,
    slug: "luodongarchives",
    clickable: true,
    link: "https://luodongarchives.forest.gov.tw/",
    heroImage: {
      "zh-Hant-TW": [
        {
          src: "/images/luodongarchives-thumbnail.webp",
          figcaption: "蘭陽地區林業文化歷史資料庫首頁示意圖",
        },
      ],
      en: [
        {
          src: "/images/luodongarchives-thumbnail.webp",
          figcaption: "home page screenshot",
        },
      ],
    },
    name: {
      "zh-Hant-TW": "蘭陽地區林業文化歷史資料庫",
      en: "luodongarchives",
    },
    intro: {
      "zh-Hant-TW": "數位典藏",
      en: "Digital Archives",
    },
    platform: ["web"],
    yearRange: { start: 2019, end: null },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 10,
    slug: "tpp",
    clickable: false,
    name: {
      "zh-Hant-TW": "台灣民眾黨官網",
      en: "TPP Official Website",
    },
    intro: {
      "zh-Hant-TW": "官方網站",
      en: "Official Website",
    },
    platform: ["web"],
    yearRange: { start: 2019, end: 2020 },
    roles: {
      "zh-Hant-TW": ["切版"],
      en: ["Layout"],
    },
  },
  {
    id: 11,
    slug: "KMtaipei",
    clickable: false,
    name: {
      "zh-Hant-TW": "臺北市知識大平臺",
      en: "KMTaipei",
    },
    intro: {
      "zh-Hant-TW": "後台管理",
      en: "Backstage",
    },
    platform: ["web"],
    yearRange: { start: 2019, end: 2019 },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 12,
    slug: "nhrm",
    clickable: false,
    name: {
      "zh-Hant-TW": "國家人權博物館檔案史料資訊系統",
      en: "NHRM Files System",
    },
    intro: {
      "zh-Hant-TW": "數位典藏",
      en: "Digital Archives",
    },
    platform: ["web"],
    yearRange: { start: 2019, end: 2020 },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 13,
    slug: "hccg",
    clickable: true,
    link: "http://140.112.105.19/workspace/culture_tmp/index.html",
    heroImage: {
      "zh-Hant-TW": [
        {
          src: "/images/zhuzhan-thumbnail.webp",
          figcaption: "竹塹面面觀主題特展首頁示意圖",
        },
      ],
      en: [
        {
          src: "/images/zhuzhan-thumbnail.webp",
          figcaption: "home page screenshot",
        },
      ],
    },
    name: {
      "zh-Hant-TW": "竹塹面面觀主題特展",
      en: "Zhuzhan Panorama: Thematic Exhibition",
    },
    intro: {
      "zh-Hant-TW": "數位典藏",
      en: "Digital Archives",
    },
    platform: ["web"],
    yearRange: { start: 2019, end: 2019 },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 14,
    slug: "228",
    clickable: true,
    link: "https://228.drnh.gov.tw/",
    heroImage: {
      "zh-Hant-TW": [
        {
          src: "/images/228-thumbnail.webp",
          figcaption: "228 事件檔案資料庫首頁示意圖",
        },
      ],
      en: [
        {
          src: "/images/228-thumbnail.webp",
          figcaption: "228 files",
        },
      ],
    },
    name: {
      "zh-Hant-TW": "228 事件檔案資料庫",
      en: "228 files",
    },
    intro: {
      "zh-Hant-TW": "數位典藏",
      en: "Digital Archives",
    },
    platform: ["web"],
    yearRange: { start: 2019, end: 2019 },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 15,
    slug: "nmth-portal",
    clickable: true,
    link: "https://taiwanindex.nmth.gov.tw/",
    heroImage: {
      "zh-Hant-TW": [
        {
          src: "/images/nmth-portal-thumbnail.webp",
          figcaption: "臺灣史數位資源整合入口網首頁示意圖",
        },
      ],
      en: [
        {
          src: "/images/nmth-portal-thumbnail.webp",
          figcaption: "home page screenshot",
        },
      ],
    },
    name: {
      "zh-Hant-TW": "臺灣史數位資源整合入口網",
      en: "Taiwan Index",
    },
    intro: {
      "zh-Hant-TW": "數位典藏",
      en: "Digital Archives",
    },
    platform: ["web"],
    yearRange: { start: 2019, end: null },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 16,
    slug: "schema",
    clickable: true,
    link: "https://schema.gov.tw/",
    heroImage: {
      "zh-Hant-TW": [
        {
          src: "/images/schema-thumbnail.webp",
          figcaption: "政府資料標準平台首頁示意圖",
        },
      ],
      en: [
        {
          src: "/images/schema-thumbnail.webp",
          figcaption: "home page screenshot",
        },
      ],
    },
    name: {
      "zh-Hant-TW": "政府資料標準平台",
      en: "Schema Gov",
    },
    intro: {
      "zh-Hant-TW":
        "包含戶政、地政、財稅、商工、公路監理、勞保、健保、衛福長照、共用性等領域之資料標準，供各機關建置資訊庫及資料交換時有所遵循。",
      en: "Includes data standards across various fields such as household registration, land administration, taxation, commerce and industry, highway supervision, labor insurance, health insurance, long-term care under the Ministry of Health and Welfare, and shared services. These standards serve as guidelines for government agencies in building information databases and facilitating data exchange.",
    },
    platform: ["web"],
    yearRange: { start: 2019, end: null },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 17,
    slug: "nmth-school",
    clickable: true,
    link: "https://school.nmth.gov.tw/",
    heroImage: {
      "zh-Hant-TW": [
        {
          src: "/images/nmth-school-thumbnail.webp",
          figcaption: "校園生活記憶庫首頁示意圖",
        },
      ],
      en: [
        {
          src: "/images/nmth-school-thumbnail.webp",
          figcaption: "home page screenshot",
        },
      ],
    },
    name: {
      "zh-Hant-TW": "校園生活記憶庫",
      en: "School Memory",
    },
    intro: {
      "zh-Hant-TW": "校園生活作為國民記憶，亦是構成臺灣成為共同體的重要基礎。",
      en: "Campus life serves as a part of the national memory and is also a fundamental pillar in shaping Taiwan as a community.",
    },
    platform: ["web"],
    yearRange: { start: 2020, end: null },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 18,
    slug: "nmth-foreign",
    clickable: false,
    name: {
      "zh-Hant-TW": "海外史料看台灣",
      en: "foreign",
    },
    intro: {
      "zh-Hant-TW": "外國人紀錄的有關臺灣歷史",
      en: "The history of Taiwan and foreigners.",
    },
    platform: ["web"],
    yearRange: { start: 2020, end: 2024 },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 19,
    slug: "moenv-opendata",
    clickable: true,
    link: "https://data.moenv.gov.tw/",
    heroImage: {
      "zh-Hant-TW": [
        {
          src: "/images/moenv-od-thumbnail.webp",
          figcaption: "環境部環境資料開放平臺首頁示意圖",
        },
      ],
      en: [
        {
          src: "/images/moenv-od-thumbnail.webp",
          figcaption: "home page screenshot",
        },
      ],
    },
    name: {
      "zh-Hant-TW": "環境部環境資料開放平臺",
      en: "Ministry of Environment Environmental Information Open Platform",
    },
    intro: {
      "zh-Hant-TW": "環境開放資料",
      en: "Open Data of Environment",
    },
    platform: ["web"],
    yearRange: { start: 2021, end: null },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 20,
    slug: "daxiculture",
    clickable: true,
    link: "https://daxiculture.tycg.gov.tw/",
    heroImage: {
      "zh-Hant-TW": [
        {
          src: "/images/daxiculture-thubnail.webp",
          figcaption: "大溪學文化資源網首頁示意圖",
        },
      ],
      en: [
        {
          src: "/images/daxiculture-thubnail.webp",
          figcaption: "home page screenshot",
        },
      ],
    },
    name: {
      "zh-Hant-TW": "大溪學文化資源網",
      en: "Daxi Culture",
    },
    intro: {
      "zh-Hant-TW": "數位典藏",
      en: "Digital Archives",
    },
    platform: ["web"],
    yearRange: { start: 2021, end: null },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 21,
    slug: "taipei-dashboard",
    clickable: false,
    link: "https://dashboard.gov.taipei/",
    heroImage: {
      "zh-Hant-TW": [
        {
          src: "/images/taipei-dashboard-thumbnail.webp",
          figcaption: "臺北市市民儀表板首頁示意圖",
        },
      ],
      en: [
        {
          src: "/images/taipei-dashboard-thumbnail.webp",
          figcaption: "home page screenshot",
        },
      ],
    },
    name: {
      "zh-Hant-TW": "臺北市市民儀表板",
      en: "Taipei Dashboard",
    },
    intro: {
      "zh-Hant-TW": "臺北市跟市民有關的儀表板總覽",
      en: "Taipei Dashboard",
    },
    platform: ["web"],
    yearRange: { start: 2022, end: 2025 },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 22,
    slug: "iofficeplus",
    clickable: true,
    link: "https://iofficeplus.land.gov.taipei/",
    heroImage: {
      "zh-Hant-TW": [
        {
          src: "/images/iofficeplus-thumbnail.webp",
          figcaption: "臺北地政總管+首頁示意圖",
        },
      ],
      en: [
        {
          src: "/images/iofficeplus-thumbnail.webp",
          figcaption: "home page screenshot",
        },
      ],
    },
    name: {
      "zh-Hant-TW": "臺北地政總管+",
      en: "iOffice of Taipei Land",
    },
    intro: {
      "zh-Hant-TW": "臺北市地政局查詢資料",
      en: "Search Data of land",
    },
    platform: ["web"],
    yearRange: { start: 2023, end: 2023 },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 23,
    slug: "taichung-od",
    clickable: true,
    link: "https://opendata.taichung.gov.tw/",
    heroImage: {
      "zh-Hant-TW": [
        {
          src: "/images/taichung-od-thumbnail.webp",
          figcaption: "臺中市資料開放平臺首頁示意圖",
        },
      ],
      en: [
        {
          src: "/images/taichung-od-thumbnail.webp",
          figcaption: "home page screenshot",
        },
      ],
    },
    name: {
      "zh-Hant-TW": "臺中市資料開放平臺",
      en: "Taichung Open Data",
    },
    intro: {
      "zh-Hant-TW": "臺中市政府資料開放平臺",
      en: "Taichung Open Data",
    },
    platform: ["web"],
    yearRange: { start: 2023, end: null },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 24,
    slug: "tycg-od",
    clickable: true,
    link: "https://opendata.tycg.gov.tw/",
    heroImage: {
      "zh-Hant-TW": [
        {
          src: "/images/tycg-od-thumbnail.webp",
          figcaption: "桃園市政府資料開放平臺",
        },
      ],
      en: [
        {
          src: "/images/tycg-od-thumbnail.webp",
          figcaption: "home page screenshot",
        },
      ],
    },
    name: {
      "zh-Hant-TW": "桃園市政府資料開放平臺",
      en: "TYCG Open Data",
    },
    intro: {
      "zh-Hant-TW": "桃園市政府資料開放",
      en: "TYCG Open Data",
    },
    platform: ["web"],
    yearRange: { start: 2024, end: null },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 25,
    slug: "ntl-exbook",
    clickable: true,
    link: "https://exbook.ntl.edu.tw/",
    heroImage: {
      "zh-Hant-TW": [
        {
          src: "/images/ntl-exbook-thumbnail.webp",
          figcaption: "首頁截圖",
        },
      ],
      en: [
        {
          src: "/images/ntl-exbook-thumbnail.webp",
          figcaption: "home page screenshot",
        },
      ],
    },
    name: {
      "zh-Hant-TW": "國立臺灣圖書館-臺灣人文學者珍藏圖書媒合平臺",
      en: "National Taiwan Library - Rare Books Matching Platform",
    },
    intro: {
      "zh-Hant-TW":
        "為避免年代久遠的圖書遺失，國立臺灣圖書館建置提供全國人文學者查核藏書是否為珍藏圖書，並且透過媒合，將珍貴資料轉典藏與流通。",
      en: "To prevent the loss of ancient books, the National Taiwan Library has established a platform for scholars across the country to verify whether their collections are rare books. Through matching, precious materials can be preserved and circulated.",
    },
    platform: ["web"],
    yearRange: { start: 2025, end: null },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 26,
    slug: "youth-taipei",
    clickable: true,
    link: "https://youth.gov.taipei/",
    heroImage: {
      "zh-Hant-TW": [
        {
          src: "/images/youth-taipei-thumbnail.webp",
          figcaption: "臺北市政府青年局首頁截圖",
        },
      ],
      en: [
        {
          src: "/images/youth-taipei-thumbnail.webp",
          figcaption: "youth of taipei - home page screenshot",
        },
      ],
    },
    name: {
      "zh-Hant-TW": "臺北市政府青年局",
      en: "Youth of Taipei",
    },
    intro: {
      "zh-Hant-TW":
        "臺北市政府青年局於 113 年 6 月 1 日成立以協助青年多元參與、職涯發展、國際接軌為目標，陪伴青年實現自我。",
      en: "Youth of Taipei was established on June 1, 2024, with the goal of assisting youth in diverse participation, career development, and international integration.",
    },
    platform: ["web"],
    yearRange: { start: 2025, end: null },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 27,
    slug: "wra-opendata",
    clickable: true,
    link: "https://opendata.wra.gov.tw/",
    heroImage: {
      "zh-Hant-TW": [
        {
          src: "/images/wra-opendata-tumbnail.webp",
          figcaption: "水利資料開放平臺截圖",
        },
      ],
      en: [
        {
          src: "/images/wra-opendata-tumbnail.webp",
          figcaption: "Water Resources Agency Open Data - home page screenshot",
        },
      ],
    },
    name: {
      "zh-Hant-TW": "水利資料開放平臺",
      en: "Water Resources Agency Open Data",
    },
    intro: {
      "zh-Hant-TW":
        "藉由本平臺(水利署水利資料開放平台)推動整合本署及所署各單位開放資料於單一入口網站，供民眾瀏覽及程式開發者加值應用(水利OpenAPI、水利開放資料)",
      en: "This platform (the Water Resources Agency's Open Data Platform) promotes the integration of open data from the Water Resources Agency and its subordinate units into a single portal.",
    },
    platform: ["web"],
    yearRange: { start: 2025, end: null },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 28,
    slug: "dpp",
    clickable: true,
    link: "https://dpp.moenv.gov.tw/",
    heroImage: {
      "zh-Hant-TW": [
        {
          src: "/images/dpp-thumbnail.webp",
          figcaption: "產品數位履歷",
        },
      ],
      en: [
        {
          src: "/images/dpp-thumbnail.webp",
          figcaption: "Digital Product Passport",
        },
      ],
    },
    name: {
      "zh-Hant-TW": "產品數位履歷",
      en: "Digital Product Passport",
    },
    intro: {
      "zh-Hant-TW":
        "產品的數位身分證，透過揭露產品資訊，促進二手再利用、維修或更有效益的回收。",
      en: "Digital Product Passport is a digital identity for products, disclosing product information to promote second-hand utilization, repair, or more beneficial recycling.",
    },
    platform: ["web"],
    yearRange: { start: 2023, end: null },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
  {
    id: 29,
    slug: "gctf",
    clickable: true,
    link: "https://gctftw.org/",
    heroImage: {
      "zh-Hant-TW": [
        {
          src: "/images/gctf-thumbnail.webp",
          figcaption: "GCTF 全球合作暨訓練架構",
        },
      ],
      en: [
        {
          src: "/images/gctf-thumbnail.webp",
          figcaption: "GCTF",
        },
      ],
    },
    name: {
      "zh-Hant-TW": "GCTF 全球合作暨訓練架構",
      en: "GCTF",
    },
    intro: {
      "zh-Hant-TW":
        "「全球合作暨訓練架構」，目的在發揮台灣的優勢及專業，針對雙方共同關切的議題合作舉辦訓練計畫，進一步拓展台灣國際空間",
      en: "The purpose is to leverage Taiwan's strengths and expertise to jointly organize training programs on issues of mutual concern, inviting officials and experts from Indo-Pacific countries to participate.",
    },
    platform: ["web"],
    yearRange: { start: 2025, end: null },
    roles: {
      "zh-Hant-TW": ["UI", "切版"],
      en: ["UI", "Layout"],
    },
  },
];
