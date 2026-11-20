// 站內頁面連結的唯一入口：回傳目前語系、帶尾斜線的路徑（/products → /products/、/en/products/）。
// 直接用 useLocalePath() 會產出無斜線路徑，每次點擊都要多轉址一次，預渲染時也會觸發 Nuxt 的連結警告。
export function usePagePath() {
  const localePath = useLocalePath();
  return (path: string) => withTrailingSlash(localePath(path));
}
