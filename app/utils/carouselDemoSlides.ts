// 輪播文章的兩個範例（原生 CSS 版、Accesserty UI Kit 版）共用同一份投影片內容，
// 對照時只差在實作方式。

export interface CarouselDemoSlide {
  key: string;
  title: string;
  body: string;
}

const slides = {
  "zh-Hant-TW": [
    {
      key: "kyoto",
      title: "京都",
      body: "清水寺、伏見稻荷、嵐山，三天兩夜剛好。",
    },
    { key: "osaka", title: "大阪", body: "道頓堀吃一輪，再去大阪城散步。" },
    { key: "nara", title: "奈良", body: "東大寺和奈良公園，鹿會跟你鞠躬。" },
    {
      key: "kobe",
      title: "神戶",
      body: "北野異人館、港區夜景，最後來份神戶牛。",
    },
  ],
  en: [
    {
      key: "kyoto",
      title: "Kyoto",
      body: "Kiyomizu-dera, Fushimi Inari and Arashiyama fit nicely into three days.",
    },
    {
      key: "osaka",
      title: "Osaka",
      body: "Eat your way down Dotonbori, then stroll around Osaka Castle.",
    },
    {
      key: "nara",
      title: "Nara",
      body: "Todai-ji and Nara Park, where the deer bow back at you.",
    },
    {
      key: "kobe",
      title: "Kobe",
      body: "Kitano's old foreign houses, the harbour at night, then Kobe beef.",
    },
  ],
} satisfies Record<string, CarouselDemoSlide[]>;

export const carouselDemoSlides = (locale: string): CarouselDemoSlide[] =>
  locale === "en" ? slides.en : slides["zh-Hant-TW"];
