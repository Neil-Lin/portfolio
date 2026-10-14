// 產生響應式圖片用的縮小版本：public/images 第一層的每張圖，輸出成數個寬度的 webp，
// 放在 public/image-variants/，並把每張圖有哪些寬度寫進 data/imageVariants.json。
// <img> 的 srcset 由 app/utils/imageSrcset.ts 依這份清單組出來，再搭配 sizes="auto" 讓瀏覽器自己挑。
// 新增或替換圖片後執行：npm run images:sizes 和 npm run images:variants（build 時 scripts/checkData.ts 會檢查有沒有漏掉）。
// 產出的檔案會 commit 進 repo，部署時不需要再產生。
import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imagesDir = join(root, "public/images");
const outDir = join(root, "public/image-variants");
const output = join(root, "data/imageVariants.json");

// 依網站實際的版面寬度挑的：手機卡片約 214px、桌機最寬約 1380px，再乘上螢幕倍率
const WIDTHS = [480, 960, 1440, 1920];
const EXTS = [".webp", ".png", ".jpg", ".jpeg"];

mkdirSync(outDir, { recursive: true });

const names = readdirSync(imagesDir).sort();
const variants = {};
let created = 0;
for (const name of names) {
  const file = join(imagesDir, name);
  const ext = extname(name).toLowerCase();
  if (!statSync(file).isFile() || !EXTS.includes(ext)) continue;
  // 同一張圖同時有 webp 和 png／jpg 時，縮小版本檔名會一樣，只用 webp 那張產生
  if (
    ext !== ".webp" &&
    names.includes(`${basename(name, extname(name))}.webp`)
  )
    continue;

  const { width } = await sharp(file).metadata();
  const stem = basename(name, extname(name));
  const widths = [];
  for (const w of WIDTHS) {
    // 只產生比原圖小的版本；原圖本身會當作最大的候選
    if (w >= width) break;
    const target = join(outDir, `${stem}-${w}.webp`);
    // 原圖沒有比較新就不重做，重跑很快
    if (
      !existsSync(target) ||
      statSync(target).mtimeMs < statSync(file).mtimeMs
    ) {
      await sharp(file)
        .resize({ width: w })
        .webp({ quality: 80 })
        .toFile(target);
      created++;
    }
    widths.push(w);
  }
  if (widths.length) variants[`/images/${name}`] = widths;
}

writeFileSync(output, `${JSON.stringify(variants, null, 2)}\n`);
console.log(
  `已寫入 ${Object.keys(variants).length} 張圖片的縮小版本清單到 data/imageVariants.json（這次新產生 ${created} 個檔案）`,
);
