<template>
  <main class="page page--narrow">
    <div class="page-container">
      <TheBreadcrumbs :list="breadCrumbsList" />
      <AkContainer />
      <article v-if="article" class="article">
        <h1>{{ article.title }}</h1>
        <div class="article-meta">
          <time :datetime="article.date">{{ formatDate(article.date) }}</time>
          <template v-if="showUpdatedAt">
            <span class="meta-sep" aria-hidden="true">·</span>
            <span class="updated">
              {{ t("words.updateDay") }}
              <time :datetime="article.updatedAt">{{
                formatDate(article.updatedAt as string)
              }}</time>
            </span>
          </template>
          <br />
          <div class="tags">
            <nuxt-link
              v-if="article.category"
              class="tag is-category"
              :to="{
                path: localePath('/blog'),
                query: { category: article.category },
              }"
              :title="
                t('page.blog.filterByCategory', {
                  category: t(`page.blog.categories.${article.category}`),
                })
              "
            >
              {{ t(`page.blog.categories.${article.category}`) }}
            </nuxt-link>
            <span v-for="tag in article.tags" :key="tag" class="tag">{{
              tag
            }}</span>
          </div>
        </div>
        <br />
        <ContentRenderer :value="article" class="article-body" />

        <nav v-if="related.length" class="related" aria-labelledby="related-h">
          <h2 id="related-h">{{ t("page.blog.related") }}</h2>
          <ul>
            <li v-for="post in related" :key="post.slug">
              <nuxt-link
                :to="localePath(`/blog/${post.slug}`)"
                :title="`${$t('action.goTo')} ${post.title}`"
              >
                {{ post.title }}
              </nuxt-link>
            </li>
          </ul>
        </nav>
      </article>
    </div>
  </main>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const runtimeConfig = useRuntimeConfig();
const orgUrl = useOrgUrl();

// 程式碼區塊依順序編號，可存取名稱才不會重複（見 components/content/ProsePre.vue）
provide("codeBlockCounter", { n: 0 });

// 文章頁自管 hreflang/canonical（layout 會略過全站自動版本）
definePageMeta({ customHreflang: true });

const langDir = computed(() => (locale.value === "en" ? "en" : "zh"));
const collection = computed(() =>
  locale.value === "en" ? "blog_en" : "blog_zh",
);
const slug = computed(() => {
  const s = route.params.slug;
  return Array.isArray(s) ? s.join("/") : (s ?? "");
});
const contentPath = computed(() => `/${langDir.value}/blog/${slug.value}`);

const { data: article } = await useAsyncData(
  () => `article-${contentPath.value}`,
  () => queryCollection(collection.value).path(contentPath.value).first(),
  { watch: [contentPath] },
);

if (!article.value) {
  throw createError({
    status: 404,
    statusText: "Article not found",
    fatal: true,
  });
}

// 另一語言版本的網址（頁尾、頁首的語言切換也用同一個查詢）
const counterpartPath = await useBlogCounterpart();

// 相關文章：同 tag、同語言、排除自己
const { data: rawRelated } = await useAsyncData(
  () => `article-related-${contentPath.value}`,
  () =>
    queryCollection(collection.value)
      .where("draft", "=", false)
      .order("date", "DESC")
      // 相關文章只顯示標題和連結：不取 body，payload 才不會把每篇文章的全文都帶進來
      .select("path", "stem", "title", "tags")
      .all(),
  { watch: [contentPath], default: () => [] },
);
const related = computed(() => {
  const tags = new Set(article.value?.tags ?? []);
  return (rawRelated.value ?? [])
    .filter(
      (p) =>
        p.path !== article.value?.path &&
        (p.tags ?? []).some((tg: string) => tags.has(tg)),
    )
    .slice(0, 3)
    .map((p) => ({ slug: blogSlugOf(p) ?? "", title: p.title }))
    .filter((p) => p.slug);
});

// 只在「有填 updatedAt 且與發布日不同」時才顯示更新日期，避免出現「發布 X · 更新 X」的冗贅。
// 與 schema.org 的 dateModified 用同一份資料，確保人看到的與機器讀到的一致。
const showUpdatedAt = computed(
  () =>
    !!article.value?.updatedAt &&
    article.value.updatedAt !== article.value.date,
);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString(locale.value === "en" ? "en-GB" : "zh-TW", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const pageTitle = computed(() => article.value?.title ?? "");
const pageDescription = computed(() => article.value?.description ?? "");
const ogImageUrl = computed(() =>
  article.value?.ogImage
    ? (runtimeConfig.public.baseUrl as string) + article.value.ogImage
    : "",
);
const canonicalUrl = computed(() =>
  absoluteUrl(runtimeConfig.public.baseUrl as string, route.path),
);

// 文章有自訂 ogImage 時優先使用，否則於下方產生
usePageSeoMeta(pageTitle, pageDescription, { ogImage: false });
useArticleSeo(counterpartPath);

useSeoMeta({
  ogType: "article",
  articlePublishedTime: () => article.value?.date,
  articleModifiedTime: () => article.value?.updatedAt ?? article.value?.date,
  // twitterImage 省略：X 會退回 og:image
  ...(ogImageUrl.value ? { ogImage: () => ogImageUrl.value } : {}),
});

if (!ogImageUrl.value) {
  defineOgImage("CustomTemplate", {
    title: pageTitle.value,
    description: pageDescription.value,
  });
}

useSchemaOrg(
  computed(() => [
    {
      "@type": "BlogPosting",
      headline: pageTitle.value,
      description: pageDescription.value,
      url: canonicalUrl.value,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl.value,
      },
      datePublished: article.value?.date,
      dateModified: article.value?.updatedAt ?? article.value?.date,
      author: { "@id": `${orgUrl.value}/#person` },
      publisher: { "@id": `${orgUrl.value}/#person` },
      inLanguage: locale.value,
      keywords: (article.value?.tags ?? []).join(", "),
      ...(ogImageUrl.value ? { image: ogImageUrl.value } : {}),
    },
  ]),
);

const breadCrumbsList = computed(() => [
  { link: "/", title: String(t("action.goToHomePage")) },
  { link: "/blog", title: String(t("mainMenu.blog")) },
  { title: pageTitle.value },
]);
useBreadcrumbSchema(breadCrumbsList);
</script>

<style>
/* 範例元件的樣式只有文章頁會用到，不放進全站 CSS；先宣告圖層順序，確保仍排在 ui 之後、utilities 之前 */
@layer reset, ui, components, utilities, print;
@import url("@/assets/css/demos.css") layer(components);
</style>
