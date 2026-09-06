import type { MaybeRefOrGetter } from "vue";

export const useBreadcrumbSchema = (
  breadcrumbs: MaybeRefOrGetter<{ title: string; link?: string }[]>,
) => {
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();
  const base = runtimeConfig.public.baseUrl as string;

  useSchemaOrg(
    computed(() => {
      const list = toValue(breadcrumbs);
      if (list.length === 0) return [];
      return [
        {
          "@type": "BreadcrumbList",
          itemListElement: list.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.title,
            // 用 route.path 而非 fullPath：fullPath 含 query string，
            // 會讓麵包屑指向帶參數的網址而非正規網址。
            // 這裡必須用 || 而非 ??：最後一層麵包屑慣例上寫成 link: ""（空字串），
            // 代表「就是當前頁」，要落回 route.path。用 ?? 的話空字串會被當成有效路徑，
            // 導致麵包屑指向網站首頁。
            item: absoluteUrl(base, item.link || route.path),
          })),
        },
      ];
    }),
  );
};
