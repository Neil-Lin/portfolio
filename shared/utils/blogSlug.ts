// 從 Nuxt Content 文件取出文章 slug（路徑最後一段）。
// path / stem 任一可用即可；兩者都不是字串時回傳 undefined，
// 讓呼叫端跳過這篇，而不是讓整個列表、RSS 或 sitemap 失敗。
// 放在 shared/：app 端和 server 端都會自動匯入。
export function blogSlugOf(
  doc: { path?: string | null; stem?: string | null } | null | undefined,
): string | undefined {
  const source = doc?.path ?? doc?.stem;
  return typeof source === "string"
    ? source.split("/").filter(Boolean).pop()
    : undefined;
}
