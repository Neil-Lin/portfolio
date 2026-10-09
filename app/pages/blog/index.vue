<template>
  <main class="page page--narrow">
    <div class="page-container">
      <TheBreadcrumbs :list="breadCrumbsList" />
      <AkContainer />
      <h2>{{ pageTitle }}</h2>
      <p>{{ t("page.blog.hint") }}</p>

      <BlogFilters
        v-model:keyword="keywordInput"
        :category="category"
        :categories="categoryOptions"
        @update:category="onCategoryChange"
        @submit="applyKeyword"
      />

      <!-- 換頁後焦點移到這裡，鍵盤與報讀軟體使用者才知道內容換了 -->
      <p ref="summaryEl" tabindex="-1" class="blog-summary">
        {{
          t("page.blog.summary", filtered.length, {
            named: { count: filtered.length },
          })
        }}
        <template v-if="totalPages > 1">
          <span aria-hidden="true">·</span>
          {{
            t("page.blog.pageInfo", { page: currentPage, total: totalPages })
          }}
        </template>
      </p>

      <ul v-if="pagedPosts.length" class="blog-list">
        <li
          v-for="post in pagedPosts"
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
            <nuxt-link
              v-if="post.category"
              class="tag is-category"
              :to="{
                query: buildQuery({ q: '', category: post.category, page: 1 }),
              }"
              :title="
                t('page.blog.filterByCategory', {
                  category: categoryLabel(post.category),
                })
              "
            >
              {{ categoryLabel(post.category) }}
            </nuxt-link>
            <span v-for="tag in post.tags" :key="tag" class="tag">{{
              tag
            }}</span>
          </div>
        </li>
      </ul>
      <EmptyBlock v-else>
        <p>{{ $t("data.nodata") }}</p>
        <button v-if="hasFilter" type="button" class="btn" @click="clearAll">
          {{ t("page.blog.clear") }}
        </button>
      </EmptyBlock>

      <BlogPagination
        v-if="totalPages > 1"
        :page="currentPage"
        :total-pages="totalPages"
        :to="pageTo"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { BLOG_CATEGORIES, type BlogCategory } from "~/utils/blogCategories";

const { t, locale } = useI18n();
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
  (rawPosts.value ?? [])
    .map((p) => {
      // 防禦：path / stem 任一可用即可取出 slug，異常文件跳過而非讓整頁 500
      const source = p.path ?? p.stem;
      const slug =
        typeof source === "string"
          ? source.split("/").filter(Boolean).pop()
          : undefined;
      return {
        path: p.path,
        slug: slug ?? "",
        title: p.title,
        description: p.description,
        date: p.date,
        tags: p.tags ?? [],
        category: p.category as BlogCategory | undefined,
      };
    })
    .filter((p) => p.slug),
);

// ── 搜尋、分類、分頁（狀態都在網址參數裡，見 useBlogListQuery）──
const { keyword, category, page, buildQuery, setQuery } = useBlogListQuery();
const summaryEl = ref<HTMLElement | null>(null);

const categoryLabel = (value: BlogCategory) =>
  t(`page.blog.categories.${value}`);

const categoryOptions = computed(() =>
  BLOG_CATEGORIES.map((value) => ({
    value,
    label: categoryLabel(value),
    count: posts.value.filter((p) => p.category === value).length,
  })),
);

const filtered = computed(() =>
  posts.value.filter((post) => {
    if (category.value && post.category !== category.value) return false;
    if (!keyword.value) return true;
    const haystack = [
      post.title,
      post.description,
      ...post.tags,
      post.category ? categoryLabel(post.category) : "",
    ].join(" ");
    return matchesKeyword(haystack, keyword.value);
  }),
);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / BLOG_PAGE_SIZE)),
);
// 網址上的頁數超過範圍（例如條件變少了）就停在最後一頁
const currentPage = computed(() => Math.min(page.value, totalPages.value));
const pagedPosts = computed(() =>
  filtered.value.slice(
    (currentPage.value - 1) * BLOG_PAGE_SIZE,
    currentPage.value * BLOG_PAGE_SIZE,
  ),
);
const pageTo = (p: number) => ({ query: buildQuery({ page: p }) });
const hasFilter = computed(() => !!keyword.value || !!category.value);

// 輸入框的值：打字時先留在這裡，停下來 400ms 才更新網址
const keywordInput = ref("");
let typingTimer: ReturnType<typeof setTimeout> | undefined;

function applyKeyword() {
  clearTimeout(typingTimer);
  if (keywordInput.value.trim() === keyword.value) return;
  setQuery({ q: keywordInput.value, page: 1 }, "replace");
}

watch(keywordInput, () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(applyKeyword, 400);
});

function onCategoryChange(value: BlogCategory | "") {
  setQuery({ category: value, page: 1 }, "push");
}

function clearAll() {
  keywordInput.value = "";
  clearTimeout(typingTimer);
  setQuery({ q: "", category: "", page: 1 }, "push");
}

onMounted(() => {
  if (summaryEl.value) prepareAnnouncer(summaryEl.value);

  // 上一頁／下一頁或點分類連結時，網址變了，輸入框跟著同步
  watch(
    keyword,
    (value) => {
      if (value !== keywordInput.value.trim()) keywordInput.value = value;
    },
    { immediate: true },
  );

  // 搜尋或換分類後，播報找到幾篇
  watch([keyword, category], async () => {
    await nextTick();
    if (summaryEl.value) {
      announce(
        summaryEl.value,
        t("page.blog.found", filtered.value.length, {
          named: { count: filtered.value.length },
        }),
      );
    }
  });

  // 換頁後把焦點移到結果摘要，畫面也會捲到列表開頭
  watch(currentPage, async () => {
    await nextTick();
    summaryEl.value?.focus();
  });
});
onBeforeUnmount(() => clearTimeout(typingTimer));

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
      url: `${orgUrl.value}/blog/`,
      inLanguage: locale.value === "zh-Hant-TW" ? "zh-Hant-TW" : "en",
      isPartOf: { "@id": `${orgUrl.value}/#website` },
      mainEntity: { "@id": `${orgUrl.value}/blog#blog` },
    },
    {
      "@id": `${orgUrl.value}/blog#blog`,
      "@type": "Blog",
      name: pageTitle.value,
      url: `${orgUrl.value}/blog/`,
      inLanguage: locale.value === "zh-Hant-TW" ? "zh-Hant-TW" : "en",
      publisher: { "@id": `${orgUrl.value}/#person` },
      blogPost: posts.value.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        url: `${orgUrl.value}/blog/${post.slug}/`,
        datePublished: post.date,
        author: { "@id": `${orgUrl.value}/#person` },
        publisher: { "@id": `${orgUrl.value}/#person` },
      })),
    },
  ]),
);

useBreadcrumbSchema(breadCrumbsList);
</script>

<style scoped>
.blog-summary {
  margin-bottom: 1rem;
  font-weight: 700;
  scroll-margin-top: 6rem;
  outline: none;
}

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
