import { defineContentConfig, defineCollection, z } from "@nuxt/content";
import { BLOG_CATEGORIES } from "./app/utils/blogCategories";

// 模型 B：中英各自獨立的部落格。兩個 collection 各管一個語言資料夾。
const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(), // ISO 日期字串 → BlogPosting.datePublished
  updatedAt: z.string().optional(), // → dateModified + sitemap lastmod
  tags: z.array(z.string()).default([]),
  category: z.enum(BLOG_CATEGORIES).optional(), // 部落格列表的分類下拉選單用
  ogImage: z.string().optional(), // 不給就用 satori 自動生成
  translationKey: z.string().optional(), // 只有存在中英對照版才填，用來連 hreflang / 切換鈕
  draft: z.boolean().default(false),
});

export default defineContentConfig({
  collections: {
    blog_zh: defineCollection({
      type: "page",
      source: "zh/blog/**/*.md",
      schema: blogSchema,
    }),
    blog_en: defineCollection({
      type: "page",
      source: "en/blog/**/*.md",
      schema: blogSchema,
    }),
  },
});
