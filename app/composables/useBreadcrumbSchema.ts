import type { MaybeRefOrGetter } from "vue";

export const useBreadcrumbSchema = (
  breadcrumbs: MaybeRefOrGetter<{ title: string; link?: string }[]>,
) => {
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();

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
            item: item.link
              ? `${runtimeConfig.public.baseUrl}${item.link}`
              : `${runtimeConfig.public.baseUrl}${route.fullPath}`,
          })),
        },
      ];
    }),
  );
};
