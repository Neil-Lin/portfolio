// 冒煙測試：檢查 `pnpm generate` 的靜態輸出「沒壞掉」，不檢查功能是否正確。
// 只用 Node 內建模組，不需額外套件。用法：pnpm generate && pnpm test:smoke
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = ".output/public";
const errors = [];
const fail = (msg) => errors.push(msg);

if (!existsSync(OUT)) {
  console.error(`找不到 ${OUT}，請先執行 pnpm generate`);
  process.exit(1);
}

const read = (p) => readFileSync(join(OUT, p), "utf8");
const count = (html, re) => (html.match(re) ?? []).length;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const htmlFiles = walk(OUT)
  .filter((f) => f.endsWith(".html"))
  .map((f) => relative(OUT, f).split(sep).join("/"));

// 1. 必要檔案
for (const file of [
  "index.html",
  "en/index.html",
  "products/index.html",
  "en/products/index.html",
  "projects/index.html",
  "en/projects/index.html",
  "blog/index.html",
  "en/blog/index.html",
  "sitemap/index.html",
  "en/sitemap/index.html",
  "404.html",
  "rss.xml",
  "en/rss.xml",
  "sitemap.xml",
  "robots.txt",
  "sw.js",
  "manifest.webmanifest",
]) {
  if (!existsSync(join(OUT, file))) fail(`缺少檔案：${file}`);
}

// 2. 每一頁的共同結構
// 這篇文章的 demo 本身就在示範巢狀 <h1>，<h1> 數量不適用
const MULTI_H1_OK = new Set([
  "blog/html-nested-h1/index.html",
  "en/blog/html-nested-h1/index.html",
]);
const pages = htmlFiles.filter(
  (f) =>
    f.endsWith("index.html") && !f.startsWith("_") && !f.startsWith("codepen/"),
);
for (const page of pages) {
  const html = read(page);
  const lang = page.startsWith("en/") ? "en-US" : "zh-Hant-TW";
  if (!new RegExp(`<html[^>]*\\slang="${lang}"`).test(html))
    fail(`${page}：<html lang> 不是 ${lang}`);
  if (!MULTI_H1_OK.has(page) && count(html, /<h1[\s>]/g) !== 1)
    fail(`${page}：<h1> 數量不是 1`);
  if (!html.includes('id="ak-jump"')) fail(`${page}：缺少「跳到主要內容」連結`);
  if (!html.includes("application/ld+json")) fail(`${page}：缺少結構化資料`);
}

// 3. 各功能頁的關鍵元素
const expect = (page, re, min, what) => {
  if (!existsSync(join(OUT, page))) return;
  const n = count(read(page), re);
  if (n < min) fail(`${page}：${what} 只有 ${n} 個（至少要 ${min}）`);
};
for (const p of ["", "en/"]) {
  expect(
    `${p}index.html`,
    /href="[^"]*\/blog\/[^"/]+\/?"/g,
    6,
    "首頁最新文章連結",
  );
  expect(`${p}products/index.html`, /class="portfolio-title"/g, 10, "產品卡片");
  expect(`${p}projects/index.html`, /class="portfolio-title"/g, 10, "專案卡片");
  expect(`${p}blog/index.html`, /role="search"/g, 1, "部落格搜尋表單");
  expect(
    `${p}blog/index.html`,
    /<select[^>]*name="category"/g,
    1,
    "部落格分類選單",
  );
  expect(`${p}blog/index.html`, /class="blog-pagination"/g, 1, "部落格分頁");
  expect(`${p}rss.xml`, /<item>/g, 10, "RSS 文章");
}

// 4. 每篇非草稿文章都有產出頁面
for (const [dir, prefix] of [
  ["content/zh/blog", "blog"],
  ["content/en/blog", "en/blog"],
]) {
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    if (/^draft:\s*true\s*$/m.test(readFileSync(join(dir, file), "utf8")))
      continue;
    const page = `${prefix}/${file.replace(/\.md$/, "")}/index.html`;
    if (!existsSync(join(OUT, page))) fail(`文章沒有產出頁面：${page}`);
  }
}

// 5. 站內連結都指向存在的檔案（忽略結尾斜線差異，那是 generate 警告另外處理）
const resolves = (path) => {
  const clean = decodeURIComponent(path.replace(/[?#].*$/, "")).replace(
    /^\//,
    "",
  );
  if (clean === "") return true;
  if (/\.[a-z0-9]+$/i.test(clean)) return existsSync(join(OUT, clean));
  return existsSync(join(OUT, clean.replace(/\/$/, ""), "index.html"));
};
const broken = new Map();
for (const page of pages) {
  for (const [, href] of read(page).matchAll(
    /<a[^>]*\shref="(\/[^"/][^"]*|\/)"/g,
  )) {
    if (!resolves(href)) broken.set(href, page);
  }
}
for (const [href, page] of broken)
  fail(`站內連結失效：${href}（例如在 ${page}）`);

if (errors.length) {
  console.error(`冒煙測試失敗，共 ${errors.length} 項：`);
  for (const e of errors) console.error(`  ✖ ${e}`);
  process.exit(1);
}
console.log(`冒煙測試通過：${pages.length} 頁、${htmlFiles.length} 個 HTML 檔`);
