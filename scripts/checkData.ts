import { existsSync } from "node:fs";
import { join } from "node:path";
import { productsData } from "../data/productsData";
import { projectsData } from "../data/projectsData";
import type { LocaleKey } from "../data/types";

const LOCALES: LocaleKey[] = ["zh-Hant-TW", "en"];

/**
 * 驗證 data/*.ts 的內容資料：
 * - slug 不可重複
 * - 所有站內媒體路徑（圖片/影片）必須存在於 public/
 * 由 nuxt.config.ts 載入時執行，資料有誤時 build 直接失敗。
 */
export function validateContentData(rootDir: string = process.cwd()) {
  const publicDir = join(rootDir, "public");
  const errors: string[] = [];

  const checkPath = (src: string | undefined, context: string) => {
    if (!src) return;
    if (!src.startsWith("/")) return; // 外部 URL 不檢查
    if (!existsSync(join(publicDir, src))) {
      errors.push(`${context}: public${src} 檔案不存在`);
    }
  };

  const productSlugs = new Set<string>();
  for (const p of productsData) {
    if (productSlugs.has(p.slug)) {
      errors.push(`products: slug "${p.slug}" 重複`);
    }
    productSlugs.add(p.slug);

    for (const loc of LOCALES) {
      p.schemaImage[loc]?.forEach((m, i) =>
        checkPath(m.src, `products/${p.slug} schemaImage[${loc}][${i}]`),
      );
      p.heroImage[loc]?.forEach((m, i) =>
        checkPath(m.src, `products/${p.slug} heroImage[${loc}][${i}]`),
      );
      p.images?.[loc]?.forEach((m, i) =>
        checkPath(m.src, `products/${p.slug} images[${loc}][${i}]`),
      );
      p.videos?.[loc]?.forEach((v, i) => {
        checkPath(v.src, `products/${p.slug} videos[${loc}][${i}].src`);
        checkPath(
          v.thumbnail_loc,
          `products/${p.slug} videos[${loc}][${i}].thumbnail_loc`,
        );
      });
    }
  }

  const projectSlugs = new Set<string>();
  for (const p of projectsData) {
    if (projectSlugs.has(p.slug)) {
      errors.push(`projects: slug "${p.slug}" 重複`);
    }
    projectSlugs.add(p.slug);

    for (const loc of LOCALES) {
      p.heroImage?.[loc]?.forEach((m, i) =>
        checkPath(m.src, `projects/${p.slug} heroImage[${loc}][${i}]`),
      );
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `[checkData] 內容資料驗證失敗（${errors.length} 項）：\n` +
        errors.map((e) => `  - ${e}`).join("\n"),
    );
  }
}
