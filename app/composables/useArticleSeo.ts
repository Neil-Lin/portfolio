import type { Ref } from "vue";

/**
 * 文章頁的 canonical + 條件式 hreflang。
 * 文章頁用 definePageMeta({ customHreflang: true }) 讓 layout 略過全站自動 hreflang，
 * 改由本 composable 控制：
 * - 有對照版（counterpartPath 不為 null）→ 發中/英 hreflang 互指 + x-default
 * - 無對照版 → 只發 self-canonical，不發任何 alternate
 */
export function useArticleSeo(counterpartPath: Ref<string | null>) {
  const { locale } = useI18n();
  const runtimeConfig = useRuntimeConfig();
  const route = useRoute();
  const base = runtimeConfig.public.baseUrl as string;

  useHead(
    computed(() => {
      const selfHref = base + route.path;
      const link: Record<string, string>[] = [
        { rel: "canonical", href: selfHref, key: "i18n-can" },
      ];

      if (counterpartPath.value) {
        const isEn = locale.value === "en";
        const zhHref = isEn ? base + counterpartPath.value : selfHref;
        const enHref = isEn ? selfHref : base + counterpartPath.value;
        link.push(
          {
            rel: "alternate",
            hreflang: "zh-Hant-TW",
            href: zhHref,
            key: "i18n-alt-zh-Hant-TW",
          },
          {
            rel: "alternate",
            hreflang: "en",
            href: enHref,
            key: "i18n-alt-en",
          },
          {
            rel: "alternate",
            hreflang: "x-default",
            href: zhHref,
            key: "i18n-xd",
          },
        );
      }

      return { link };
    }),
  );
}
