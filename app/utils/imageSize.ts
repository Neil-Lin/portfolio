// 依 data/imageSizes.json 回傳圖片原始寬高，寫進 <img> 的 width / height，
// 讓瀏覽器在圖片載入前就依比例佔好空間（避免版面位移）。
// 新增圖片後執行 npm run images:sizes 更新清單。
import sizes from "~~/data/imageSizes.json";

const table: Record<string, number[]> = sizes;

export function imageSize(src: string | undefined) {
  const size = src ? table[src] : undefined;
  return size?.length === 2 ? { width: size[0], height: size[1] } : {};
}
