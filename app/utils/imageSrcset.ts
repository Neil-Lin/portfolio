// 依 data/imageVariants.json 組出 <img> 的 srcset：各個縮小版本加上原圖，
// 搭配 sizes="auto"（lazy 的圖）或手寫的 sizes（首屏的圖），讓瀏覽器挑剛好夠用的檔案。
// 新增圖片後執行 npm run images:variants 產生縮小版本。
import variants from "~~/data/imageVariants.json";
import sizes from "~~/data/imageSizes.json";

const variantTable: Record<string, number[]> = variants;
const sizeTable: Record<string, number[]> = sizes;

export function imageSrcset(src: string | undefined) {
  if (!src) return undefined;
  const widths = variantTable[src];
  const original = sizeTable[src]?.[0];
  if (!widths?.length || !original) return undefined;
  const stem = src.replace(/^\/images\//, "").replace(/\.[^.]+$/, "");
  return [
    ...widths.map((w) => `/image-variants/${stem}-${w}.webp ${w}w`),
    `${src} ${original}w`,
  ].join(", ");
}
