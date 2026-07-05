export default defineEventHandler((event) =>
  buildBlogRss(event, "blog_zh", {
    pathPrefix: "",
    title: "Neil 的作品集 — 部落格",
    description: "前端、設計與無障礙的開發筆記。",
    language: "zh-Hant-TW",
  }),
);
