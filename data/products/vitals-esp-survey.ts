import type { Product } from "../types";

export const vitalsEspSurvey: Product = {
  id: 7,
  slug: "vitals-esp-survey",
  clickable: true,
  schemaImage: {
    "zh-Hant-TW": [
      {
        src: "/images/vitalsespsurvey-thumbnail.png",
        figcaption: "Vitals ESP 問卷模組",
      },
    ],
    en: [
      {
        src: "/images/vitalsespsurvey-thumbnail.png",
        figcaption: "Vitals ESP Survey",
      },
    ],
  },
  heroImage: {
    "zh-Hant-TW": [
      {
        src: "/images/vitalsespsurvey-thumbnail.webp",
        figcaption: "Vitals ESP 問卷模組",
      },
    ],
    en: [
      {
        src: "/images/vitalsespsurvey-thumbnail.webp",
        figcaption: "Vitals ESP Survey",
      },
    ],
  },
  name: {
    "zh-Hant-TW": "Vitals ESP Survey",
    en: "Vitals ESP Survey",
  },
  intro: {
    "zh-Hant-TW":
      "提供多樣化、有效率的線上問卷調查工具，提供內部滿意度、課後問卷、意見徵求，以及外部活動滿意度調查問卷。",
    en: "Provide a diverse and efficient online survey tool for internal satisfaction assessments, post-course evaluations, feedback collection, and external event satisfaction surveys.",
  },
  keywords: {
    "zh-Hant-TW": ["問卷系統", "資料視覺化", "問卷統計結果"],
    en: ["Survey System", "Data Visualization", "Survey Statistics"],
  },
  summary: {
    "zh-Hant-TW":
      "提供多樣化、有效率的線上問卷調查工具，提供內部滿意度、課後問卷、意見徵求，以及外部活動滿意度調查問卷，並且可將分析結果回存 Vitals ESP，作為組織知識保存與分享。可製作不同型式問卷，包含單選、多選、詳答、矩陣、跳題以及題組方式，此外亦支援行動裝置填寫問卷與查看問卷結果。",
    en: "Provide a diverse and efficient online survey tool for internal satisfaction assessments, post-course evaluations, feedback collection, and external event satisfaction surveys. The analyzed results can be saved back to Vitals ESP for organizational knowledge preservation and sharing. The tool supports various questionnaire formats, including single choice, multiple choice, open-ended, matrix, skip logic, and grouped questions. Additionally, it is mobile-friendly, allowing users to fill out surveys and view results on their devices.",
  },
  platform: ["web"],
  yearRange: { start: 2017, end: 2018 },
  target: {
    "zh-Hant-TW": ["問卷系統", "資料視覺化問卷統計結果", "所見即所得"],
    en: [
      "Survey system",
      "Data visualization of survey statistics",
      "WYSIWYG (What You See Is What You Get) interface",
    ],
  },
  roles: {
    "zh-Hant-TW": ["UX"],
    en: ["UX"],
  },
  tools: {
    "zh-Hant-TW": ["Sketch app"],
    en: ["Sketch app"],
  },
  observe: {
    "zh-Hant-TW": [
      "Google Form",
      "SurveyMonkey",
      "Typeform",
      "Jotform",
      "SoGoSurvey",
      "Zoho Survey",
    ],
    en: [
      "Google Form",
      "SurveyMonkey",
      "Typeform",
      "Jotform",
      "SoGoSurvey",
      "Zoho Survey",
    ],
  },
  learn: {
    "zh-Hant-TW": [
      "什麼是問卷系統？",
      "有什麼競品？",
      "企業內部與一般外部使用者有何不同？",
      "學術用與商業用問卷有何不同？",
      "目前使用痛點",
    ],
    en: [
      "What is a survey system?",
      "What are the competing products?",
      "How do enterprise users differ from general external users?",
      "What are the differences between academic and commercial surveys?",
      "Current user pain points",
    ],
  },
  research: {
    "zh-Hant-TW": [
      "研究各大競品「製作」操作原理",
      "研究回收問卷後需要做什麼行為",
      "觀察各大競品操作痛點",
      "研究如何專業又易用",
      "資料視覺化原理與應用",
      "如何管理問卷",
    ],
    en: [
      "Studying the operational principles of leading survey creation tools.",
      "Understanding post-survey data processing workflows.",
      "Identifying usability pain points in competitor products.",
      "Balancing professional features with ease of use.",
      "Exploring principles and applications of data visualization.",
      "Learning best practices for survey management.",
    ],
  },
  images: {
    "zh-Hant-TW": [
      {
        src: "/images/vitalsespsurvey-wireframe-dashboard.webp",
        figcaption:
          "Vitals ESP Survey Dashboard，設計重點：不同身份登入者，會看到不同資料。",
      },
      {
        src: "/images/vitalsespsurvey-wireframe-edit.webp",
        figcaption:
          "Vitals ESP Survey 問卷編輯，設計重點：符合大多數人使用習慣，兼且具備跳題、必填、相片、各種類型、題組、多國語言、預覽、設定以及自動產生錨點快捷等專業功能。",
      },
      {
        src: "/images/vitalsespsurvey-wireframe-list1.webp",
        figcaption: "Vitals ESP Survey 格狀瀏覽",
      },
      {
        src: "/images/vitalsespsurvey-wireframe-list2.webp",
        figcaption: "Vitals ESP Survey 列表瀏覽",
      },
      {
        src: "/images/vitalsespsurvey-wireframe-result1.webp",
        figcaption: "Vitals ESP Survey 資料視覺化總覽",
      },
      {
        src: "/images/vitalsespsurvey-wireframe-result2.webp",
        figcaption: "Vitals ESP Survey 資料視覺化問卷細部統計",
      },
    ],
    en: [
      {
        src: "/images/vitalsespsurvey-wireframe-dashboard.webp",
        figcaption:
          "Vitals ESP Survey Dashboard – Design Focus: Different users see different data based on their login credentials.",
      },
      {
        src: "/images/vitalsespsurvey-wireframe-edit.webp",
        figcaption:
          "Vitals ESP Survey Questionnaire Editor – Design Focus: User-friendly interface with professional features such as skip logic, required fields, image uploads, various question types, grouped questions, multilingual support, preview, settings, and automatically generated anchor shortcuts.",
      },
      {
        src: "/images/vitalsespsurvey-wireframe-list1.webp",
        figcaption: "Vitals ESP Survey – Grid View",
      },
      {
        src: "/images/vitalsespsurvey-wireframe-list2.webp",
        figcaption: "Vitals ESP Survey – List View",
      },
      {
        src: "/images/vitalsespsurvey-wireframe-result1.webp",
        figcaption: "Vitals ESP Survey – Data Visualization Overview",
      },
      {
        src: "/images/vitalsespsurvey-wireframe-result2.webp",
        figcaption: "Vitals ESP Survey – Detailed Survey Data Visualization",
      },
    ],
  },
  relatedLinks: {
    "zh-Hant-TW": [
      {
        title: "Vitals ESP Survey",
        link: "https://www.vitalsesp.com/survey.html",
      },
    ],
    en: [
      {
        title: "Vitals ESP Survey",
        link: "https://www.vitalsesp.com/survey.html",
      },
    ],
  },
  updatedAt: "2025-08-06T00:00:01.000Z",
};
