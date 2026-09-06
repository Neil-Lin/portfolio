// 全站導航統一補尾斜線：對齊 Cloudflare Pages 對目錄式輸出的正規化（/foo → /foo/）。
// 內部連結（localePath / NuxtLink）產出的是無斜線路徑，client 端點擊時在此補上，
// 讓網址列與 canonical / sitemap 一致。
// SSR / prerender 的路由本就帶斜線（見 nuxt.config 的 prerender routes），故不受影響、不會迴圈。
export default defineNuxtRouteMiddleware((to) => {
  // withTrailingSlash 已處理「已有斜線」與「看起來像檔案」（/rss.xml、/favicon.ico）兩種略過情形
  const normalized = withTrailingSlash(to.path);
  if (normalized === to.path) return;
  return navigateTo(
    { path: normalized, query: to.query, hash: to.hash },
    { redirectCode: 308 },
  );
});
