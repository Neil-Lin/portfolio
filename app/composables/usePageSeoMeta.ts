export function usePageSeoMeta(
  title: Ref<string> | ComputedRef<string>,
  description: Ref<string> | ComputedRef<string>,
  url?: Ref<string> | ComputedRef<string>,
) {
  const { t } = useI18n();
  const runtimeConfig = useRuntimeConfig();
  const route = useRoute();

  const resolvedUrl =
    url ??
    computed(() => {
      const path = route.path === "/" ? "" : route.path;
      return runtimeConfig.public.baseUrl + path;
    });

  useHead(
    computed(() => ({
      title: title.value,
      meta: [
        { name: "description", content: description.value },
        { property: "og:url", content: resolvedUrl.value },
        {
          property: "og:title",
          content: `${title.value} - ${t("website.name")}`,
        },
        {
          property: "og:description",
          content: description.value,
        },
        { name: "twitter:url", content: resolvedUrl.value },
        {
          name: "twitter:title",
          content: `${title.value} - ${t("website.name")}`,
        },
        {
          name: "twitter:description",
          content: description.value,
        },
      ],
    })),
  );
}
