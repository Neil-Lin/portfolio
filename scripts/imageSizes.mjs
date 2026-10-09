// 產生 data/imageSizes.json：public/images 底下每張點陣圖的原始寬高。
// 圖片標籤寫上 width / height，瀏覽器載入前就能先佔好空間，不會在圖片晚到時把版面往下推（CLS）。
// 新增或替換圖片後執行：npm run images:sizes（build 時 scripts/checkData.ts 會檢查有沒有漏掉）。
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, extname } from "node:path";

const root = process.cwd();
const imagesDir = join(root, "public/images");
const output = join(root, "data/imageSizes.json");

function sizeOf(buf, ext) {
  if (ext === ".png") {
    return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
  }
  if (ext === ".gif") {
    return [buf.readUInt16LE(6), buf.readUInt16LE(8)];
  }
  if (ext === ".webp") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X") {
      return [buf.readUIntLE(24, 3) + 1, buf.readUIntLE(27, 3) + 1];
    }
    if (chunk === "VP8L") {
      const bits = buf.readUInt32LE(21);
      return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1];
    }
    if (chunk === "VP8 ") {
      return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
    }
  }
  if (ext === ".jpg" || ext === ".jpeg") {
    let i = 2;
    while (i < buf.length) {
      const marker = buf[i + 1];
      const length = buf.readUInt16BE(i + 2);
      // SOF0–SOF15（排除 DHT、JPG、DAC）記錄了圖片尺寸
      if (
        marker >= 0xc0 &&
        marker <= 0xcf &&
        ![0xc4, 0xc8, 0xcc].includes(marker)
      ) {
        return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
      }
      i += 2 + length;
    }
  }
  return null;
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const sizes = {};
for (const file of walk(imagesDir).sort()) {
  const ext = extname(file).toLowerCase();
  if (![".png", ".gif", ".webp", ".jpg", ".jpeg"].includes(ext)) continue;
  const size = sizeOf(readFileSync(file), ext);
  if (!size) {
    console.warn(`無法讀取尺寸：${file}`);
    continue;
  }
  sizes[`/${relative(join(root, "public"), file).split("\\").join("/")}`] =
    size;
}

writeFileSync(output, `${JSON.stringify(sizes, null, 2)}\n`);
console.log(
  `已寫入 ${Object.keys(sizes).length} 張圖片的尺寸到 data/imageSizes.json`,
);
