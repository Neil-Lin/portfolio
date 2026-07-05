<template>
  <main class="page page--narrow">
    <div class="page-container">
      <theBreadcrumbs :list="breadCrumbsList" />
      <akContainer />
      <h2>{{ pageTitle }}</h2>
      <p>{{ t("page.blog.hint") }}</p>
      <br />
      <ul v-if="posts.length" class="blog-list">
        <li
          v-for="post in posts"
          :key="post.path"
          class="blog-item animation-fade-out"
        >
          <h3>
            <nuxt-link
              :to="localePath(`/blog/${post.slug}`)"
              :title="`${$t('action.goTo')} ${post.title}`"
            >
              {{ post.title }}
            </nuxt-link>
          </h3>
          <p class="des">{{ post.description }}</p>
          <div class="blog-meta">
            <time :datetime="post.date">{{ formatDate(post.date) }}</time>
            <span v-for="tag in post.tags" :key="tag" class="tag">{{
              tag
            }}</span>
          </div>
        </li>
      </ul>
      <emptyBlock v-else>{{ $t("data.nodata") }}</emptyBlock>
    </div>
  </main>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const orgUrl = useOrgUrl();

const pageTitle = computed(() => t("mainMenu.blog"));
const pageDescription = computed(() => t("des.blog"));

usePageSeoMeta(pageTitle, pageDescription);

// RSS 自動探索
useHead(
  computed(() => ({
    link: [
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: `${t("website.name")} — ${pageTitle.value}`,
        href: locale.value === "en" ? "/en/rss.xml" : "/rss.xml",
      },
    ],
  })),
);

const { data: rawPosts } = await useAsyncData(
  () => `blog-list-${locale.value}`,
  () =>
    queryCollection(locale.value === "en" ? "blog_en" : "blog_zh")
      .where("draft", "=", false)
      .order("date", "DESC")
      .all(),
  { watch: [locale], default: () => [] },
);

const posts = computed(() =>
  (rawPosts.value ?? []).map((p) => ({
    path: p.path,
    slug: p.stem.split("/").pop() as string,
    title: p.title,
    description: p.description,
    date: p.date,
    tags: p.tags ?? [],
  })),
);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString(locale.value === "en" ? "en-GB" : "zh-TW", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const breadCrumbsList = computed(() => [
  { link: "/", title: t("action.goToHomePage") },
  { link: "", title: t("mainMenu.blog") },
]);

useSchemaOrg(
  computed(() => [
    {
      "@id": `${orgUrl.value}/blog#webpage`,
      "@type": "CollectionPage",
      name: pageTitle.value,
      description: pageDescription.value,
      url: orgUrl.value + route.path,
      inLanguage: locale.value === "zh-Hant-TW" ? "zh-Hant-TW" : "en",
      isPartOf: { "@id": `${orgUrl.value}/#website` },
      mainEntity: { "@id": `${orgUrl.value}/blog#blog` },
    },
    {
      "@id": `${orgUrl.value}/blog#blog`,
      "@type": "Blog",
      name: pageTitle.value,
      url: `${orgUrl.value}/blog`,
      inLanguage: locale.value === "zh-Hant-TW" ? "zh-Hant-TW" : "en",
      publisher: { "@id": `${orgUrl.value}/#person` },
      blogPost: posts.value.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        url: `${orgUrl.value}/blog/${post.slug}`,
        datePublished: post.date,
        author: { "@id": `${orgUrl.value}/#person` },
        publisher: { "@id": `${orgUrl.value}/#person` },
      })),
    },
  ]),
);

useBreadcrumbSchema(breadCrumbsList);

defineOgImage("CustomTemplate", {
  title: pageTitle.value + " - " + t("website.name"),
  description: pageDescription.value,
});
</script>

<style scoped>
.blog-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.blog-item {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: oklch(var(--card-bg));
  border-radius: 1.5rem;

  a {
    text-decoration: none;
    text-wrap: pretty;
  }

  .des {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    -webkit-box-orient: vertical;
  }

  .blog-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: oklch(var(--footer-color));
  }
}
</style>
