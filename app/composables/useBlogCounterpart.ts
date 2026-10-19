// 目前這篇部落格文章的「另一語言版本」網址；不在文章頁或沒有對照版時是 null。
//
// 直接從網址判斷是哪篇文章，不依賴文章頁傳值：SSR 時頁尾和頁首可能比文章頁先渲染，
// 由文章頁寫入共用狀態的話，靜態 HTML 裡的語言切換連結會是錯的。
// 文章頁、頁尾、頁首的語言選單都呼叫這個 composable，useAsyncData 的 key 相同，查詢只會執行一次。
//
// 對照版：優先用 frontmatter 的 translationKey；沒有的話，以「同 slug」為慣例。
export async function useBlogCounterpart() {
  const route = useRoute();
  const { locale } = useI18n();

  const articleSlug = computed(
    () => route.path.match(/^\/(?:en\/)?blog\/(.+?)\/?$/)?.[1] ?? null,
  );

  const { data } = await useAsyncData(
    () => `blog-counterpart-${locale.value}-${articleSlug.value ?? ""}`,
    async () => {
      const slug = articleSlug.value;
      if (!slug) return null;
      const isEn = locale.value === "en";
      const self = await queryCollection(isEn ? "blog_en" : "blog_zh")
        .path(`/${isEn ? "en" : "zh"}/blog/${slug}`)
        .select("translationKey")
        .first();
      const other = isEn ? "blog_zh" : "blog_en";
      const doc = self?.translationKey
        ? await queryCollection(other)
            .where("translationKey", "=", self.translationKey)
            .select("path", "stem")
            .first()
        : await queryCollection(other)
            .path(`/${isEn ? "zh" : "en"}/blog/${slug}`)
            .select("path", "stem")
            .first();
      const otherSlug = blogSlugOf(doc);
      if (!otherSlug) return null;
      return isEn ? `/blog/${otherSlug}/` : `/en/blog/${otherSlug}/`;
    },
    { watch: [articleSlug, locale], default: () => null },
  );

  return data;
}
