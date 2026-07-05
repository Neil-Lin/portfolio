import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * 掃描 content/{zh,en}/blog/*.md，產生要預渲染的文章路由。
 * 排除 frontmatter draft: true 的文章。中文無前綴、英文加 /en。
 */
function readBlogSlugs(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .filter((f) => {
      const raw = readFileSync(join(dir, f), "utf-8");
      const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      const isDraft = fm ? /^\s*draft:\s*true\s*$/m.test(fm[1]) : false;
      return !isDraft;
    })
    .map((f) => f.replace(/\.md$/, ""));
}

export function getBlogRoutes(rootDir: string = process.cwd()): string[] {
  const zh = readBlogSlugs(join(rootDir, "content/zh/blog")).map(
    (slug) => `/blog/${slug}`,
  );
  const en = readBlogSlugs(join(rootDir, "content/en/blog")).map(
    (slug) => `/en/blog/${slug}`,
  );
  return [...zh, ...en];
}
