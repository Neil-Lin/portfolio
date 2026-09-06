interface PageSeoOptions {
  /** 覆寫正規網址；預設由目前路由推導（帶尾斜線）。 */
  url?: Ref<string> | ComputedRef<string>;
  /**
   * 是否自動產生 OG 圖（CustomTemplate）。預設 true。
   * 自行處理 OG 圖的頁面（文章頁、產品詳情頁）傳 false。
   * 於 setup 期求值，與先前各頁自己寫 if 判斷的時機相同。
   */
  ogImage?: boolean;
}

export function usePageSeoMeta(
  title: Ref<string> | ComputedRef<string>,
  description: Ref<string> | ComputedRef<string>,
  options: PageSeoOptions = {},
) {
  const { t } = useI18n();
  const runtimeConfig = useRuntimeConfig();
  const route = useRoute();

  const resolvedUrl =
    options.url ??
    computed(() =>
      absoluteUrl(runtimeConfig.public.baseUrl as string, route.path),
    );

  const socialTitle = computed(() => `${title.value} - ${t("website.name")}`);

  useHead(
    computed(() => ({
      title: title.value,
      meta: [
        { name: "description", content: description.value },
        { property: "og:url", content: resolvedUrl.value },
        { property: "og:title", content: socialTitle.value },
        { property: "og:description", content: description.value },
        { name: "twitter:url", content: resolvedUrl.value },
        { name: "twitter:title", content: socialTitle.value },
        { name: "twitter:description", content: description.value },
      ],
    })),
  );

  // OG 圖：先前五個頁面各自寫了一模一樣的一段，集中在這裡。
  if (options.ogImage !== false) {
    defineOgImage("CustomTemplate", {
      title: socialTitle.value,
      description: description.value,
    });
  }
}
