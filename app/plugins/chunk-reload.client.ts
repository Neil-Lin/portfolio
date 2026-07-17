// 部署後舊 Service Worker / 快取端出過期 HTML，指向的 JS chunk hash 對不上新版時，
// Nuxt 會丟出「Failed to fetch dynamically imported module」，並讓 error.vue 把錯誤
// 訊息寫進 <title>。這裡偵測到 chunk 載入失敗就自動重新載入，抓取新版 HTML＋chunk，
// 使用者無感自癒。用 sessionStorage 旗標確保只重載一次，避免真的壞掉時無限迴圈。
const RELOAD_FLAG = "chunk-reloaded";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:chunkError", () => {
    if (sessionStorage.getItem(RELOAD_FLAG)) return;
    sessionStorage.setItem(RELOAD_FLAG, "1");
    reloadNuxtApp({ persistState: false });
  });

  // 成功完成一次頁面導航即視為已恢復，清除旗標讓下次部署能再次自癒。
  nuxtApp.hook("page:finish", () => {
    sessionStorage.removeItem(RELOAD_FLAG);
  });
});
