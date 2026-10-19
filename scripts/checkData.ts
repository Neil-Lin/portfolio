import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { productsData } from "../data/productsData.ts";
import { projectsData } from "../data/projectsData.ts";
import type { LocaleKey } from "../data/types.ts";

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

  // 產品頁的圖片會寫上 width / height（見 app/utils/imageSize.ts），尺寸清單要涵蓋它們
  const sizesFile = join(rootDir, "data/imageSizes.json");
  const sizes: Record<string, unknown> = existsSync(sizesFile)
    ? JSON.parse(readFileSync(sizesFile, "utf8"))
    : {};
  // 卡片與產品頁的圖片會寫 srcset（見 app/utils/imageSrcset.ts），比最小版本寬的圖都要有縮小版本
  const variantsFile = join(rootDir, "data/imageVariants.json");
  const variants: Record<string, number[]> = existsSync(variantsFile)
    ? JSON.parse(readFileSync(variantsFile, "utf8"))
    : {};
  for (const [src, widths] of Object.entries(variants)) {
    const stem = src.replace(/^\/images\//, "").replace(/\.[^.]+$/, "");
    for (const w of widths) {
      const file = `/image-variants/${stem}-${w}.webp`;
      if (!existsSync(join(publicDir, file))) {
        errors.push(
          `data/imageVariants.json: public${file} 檔案不存在，請執行 npm run images:variants`,
        );
      }
    }
  }
  const checkVariants = (src: string | undefined, context: string) => {
    if (!src || !src.startsWith("/images/") || src.endsWith(".svg")) return;
    const width = (sizes[src] as number[] | undefined)?.[0] ?? 0;
    if (width > 480 && !variants[src]) {
      errors.push(
        `${context}: ${src} 沒有縮小版本，請執行 npm run images:variants`,
      );
    }
  };

  const checkSize = (src: string | undefined, context: string) => {
    if (!src || !src.startsWith("/") || src.endsWith(".svg")) return;
    if (!sizes[src]) {
      errors.push(
        `${context}: ${src} 不在 data/imageSizes.json，請執行 npm run images:sizes`,
      );
    }
    checkVariants(src, context);
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
      p.heroImage[loc]?.forEach((m, i) => {
        checkPath(m.src, `products/${p.slug} heroImage[${loc}][${i}]`);
        checkSize(m.src, `products/${p.slug} heroImage[${loc}][${i}]`);
      });
      p.images?.[loc]?.forEach((m, i) => {
        checkPath(m.src, `products/${p.slug} images[${loc}][${i}]`);
        checkSize(m.src, `products/${p.slug} images[${loc}][${i}]`);
      });
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
      p.heroImage?.[loc]?.forEach((m, i) => {
        checkPath(m.src, `projects/${p.slug} heroImage[${loc}][${i}]`);
        checkVariants(m.src, `projects/${p.slug} heroImage[${loc}][${i}]`);
      });
    }
  }

  // 部落格文章的 frontmatter：沒加引號的值裡如果有「: 」，YAML 會整個解析失敗，
  // 文章不會 build 失敗，但標題會變成 [object Object]、日期變成 1970 年
  for (const lang of ["zh", "en"]) {
    const dir = join(rootDir, "content", lang, "blog");
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (!name.endsWith(".md")) continue;
      const frontmatter =
        readFileSync(join(dir, name), "utf8").split(/^---$/m)[1] ?? "";
      for (const line of frontmatter.split("\n")) {
        const m = line.match(/^(\w+):\s+(.*)$/);
        if (!m || /^["'|>]/.test(m[2]!)) continue;
        if (/:\s/.test(m[2]!)) {
          errors.push(
            `content/${lang}/blog/${name}: ${m[1]} 的值含有「: 」，請用引號包起來`,
          );
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `[checkData] 內容資料驗證失敗（${errors.length} 項）：\n` +
        errors.map((e) => `  - ${e}`).join("\n"),
    );
  }
}
