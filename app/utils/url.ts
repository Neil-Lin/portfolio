/**
 * 全站網址正規化的單一真相來源。
 *
 * 本站對外一律使用「帶尾斜線」的網址（見 nuxt.config 的 site.trailingSlash），
 * 對齊 Cloudflare Pages 對目錄式輸出的正規化（/foo → /foo/）。
 * 內部連結（localePath / NuxtLink）產出的是無斜線路徑，由 middleware 於 client 端補上。
 *
 * ⚠️ 需要比對或組合路徑時請一律使用這裡的函式，不要各自寫 `endsWith("/")`。
 * 過去散落各處的重複實作曾漏掉一處，導致英文首頁被誤判為內頁。
 */

/**
 * 補上尾斜線。路徑與絕對網址皆可。
 * 看起來像檔案的路徑（/rss.xml、/favicon.ico）維持原樣。
 */
export function withTrailingSlash(urlOrPath: string): string {
  if (!urlOrPath || urlOrPath.endsWith("/")) return urlOrPath;
  // 只用「路徑部分」判斷是否像檔案，否則 https://neillin.com 的 .com 會被當成副檔名
  const pathPart = urlOrPath.replace(/^[a-z]+:\/\/[^/]+/i, "");
  if (pathPart && /\.[^/]+$/.test(pathPart)) return urlOrPath;
  return `${urlOrPath}/`;
}

/** 以站台 baseUrl 組出帶尾斜線的絕對網址。 */
export function absoluteUrl(baseUrl: string, path: string): string {
  return withTrailingSlash(baseUrl + path);
}

/**
 * 是否為各語言的首頁。
 * 尾斜線有無都要能正確判斷——這正是先前 `route.path === "/en"` 失效的原因。
 */
export function isHomePath(path: string): boolean {
  const normalized = withTrailingSlash(path);
  return normalized === "/" || normalized === "/en/";
}
