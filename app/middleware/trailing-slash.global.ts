// 全站導航統一補尾斜線：對齊 Cloudflare Pages 對目錄式輸出的正規化（/foo → /foo/）。
// 內部連結（localePath / NuxtLink）產出的是無斜線路徑，client 端點擊時在此補上，
// 讓網址列與 canonical / sitemap 一致。
// SSR / prerender 的路由本就帶斜線（見 nuxt.config 的 prerender routes），故不受影響、不會迴圈。
export default defineNuxtRouteMiddleware((to) => {
  const path = to.path;
  if (path === "/" || path.endsWith("/")) return;
  // 略過看起來像檔案的路徑（含副檔名，如 /rss.xml、/favicon.ico、/_og/*.png）
  if (/\.[^/]+$/.test(path)) return;
  return navigateTo(
    { path: `${path}/`, query: to.query, hash: to.hash },
    { redirectCode: 308 },
  );
});
