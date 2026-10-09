// 部落格文章分類。每篇文章的 frontmatter 填一個 category。
// content.config.ts 的 schema 也引用這份清單，新增分類時兩邊會一起生效；
// 顯示名稱在 i18n 的 page.blog.categories。
export const BLOG_CATEGORIES = [
  "accessibility",
  "frontend",
  "design",
  "projects",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const isBlogCategory = (value: unknown): value is BlogCategory =>
  typeof value === "string" &&
  (BLOG_CATEGORIES as readonly string[]).includes(value);
