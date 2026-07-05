<template>
  <main class="page page--index">
    <div class="page-container">
      <h2 class="visually-hidden">{{ pageTitle }}</h2>
      <div class="card animation-fade-out intro">
        <akContainer />
        <h3>{{ t("words.intro") }}</h3>
        <i18n-t keypath="page.about.p1" tag="p" scope="global"><br /></i18n-t>
        <i18n-t keypath="page.about.p2" tag="p" scope="global">
          <template #link>
            <nuxt-link
              to="https://github.com/Neil-Lin/neil-lin.github.io"
              :title="$t('action.goTo') + 'Github' + $t('action.openWindow')"
              target="_blank"
            >
              Github
            </nuxt-link>
          </template>
        </i18n-t>
      </div>
      <div class="card animation-fade-out programming">
        <h3>{{ t("words.programming") }}</h3>
        <ul>
          <li>HTML5</li>
          <li>CSS/SCSS</li>
          <li>Javascript/jQuery</li>
          <li>Vue/Nuxt</li>
          <li>Version Control</li>
        </ul>
      </div>
      <div class="card animation-fade-out promote">
        <h3>{{ t("words.promote") }}</h3>
        <ul>
          <li>
            <nuxt-link
              to="https://ithelp.ithome.com.tw/users/20152260/ironman/5614"
              :title="`${$t('action.goTo')} ${$t('des.ithomeA11y')} ${$t('action.openWindow')}`"
              target="_blank"
            >
              Accessibility
            </nuxt-link>
          </li>
          <li>Data visualization</li>
          <li>DesignOps/Design System</li>
          <li>OKR/OGSM</li>
          <li>Scrum</li>
          <li>SEO</li>
        </ul>
      </div>
      <div class="card animation-fade-out tools">
        <h3>{{ t("words.tools") }}</h3>
        <ul>
          <li>Figma</li>
          <li>VScode</li>
          <li>Sourcetree</li>
          <li>Wordpress</li>
        </ul>
      </div>
      <div class="card animation-fade-out experience">
        <h3>{{ t("words.experience") }}</h3>
        <ul>
          <li v-for="(item, index) in experienceList" :key="index">
            <div>
              {{ item.title }}
            </div>
            <div>
              <span v-if="item.current">{{ t("words.current") }}</span>
              &nbsp;
              <span>{{ item.years }} {{ t("words.years") }}</span>
            </div>
          </li>
        </ul>
      </div>
      <div
        v-if="latestPosts.length"
        class="card animation-fade-out news"
        aria-labelledby="latest-heading"
      >
        <h3 id="latest-heading">{{ t("words.latestPosts") }}</h3>
        <ul class="news-list">
          <li v-for="post in latestPosts" :key="post.slug">
            <nuxt-link
              :to="localePath(`/blog/${post.slug}`)"
              :title="`${$t('action.goTo')} ${post.title}`"
            >
              {{ post.title }}
            </nuxt-link>
            <time :datetime="post.date" class="news-date">
              {{ formatDate(post.date) }}
            </time>
          </li>
        </ul>
        <br />
        <nuxt-link
          :to="localePath('/blog')"
          :title="`${$t('action.goTo')} ${$t('mainMenu.blog')}`"
          class="btn"
        >
          {{ t("words.viewAllPosts") }} →
        </nuxt-link>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { MANAGER_START_YEAR, yearsSince } from "~~/data/career";

const { locale, t } = useI18n();
const localePath = useLocalePath();
const pageTitle = computed(() => t("words.home"));
const pageDescription = computed(() => t("intro.des3"));

usePageSeoMeta(pageTitle, pageDescription);

const orgUrl = useOrgUrl();

// 首頁列出最新文章：給「Google 唯一會爬的頁」一條直達文章的內部連結
const { data: latestRaw } = await useAsyncData(
  () => `home-latest-${locale.value}`,
  () =>
    queryCollection(locale.value === "en" ? "blog_en" : "blog_zh")
      .where("draft", "=", false)
      .order("date", "DESC")
      .limit(6)
      .select("title", "stem", "date")
      .all(),
  { watch: [locale], default: () => [] },
);
const latestPosts = computed(() =>
  (latestRaw.value ?? []).map((r) => ({
    slug: r.stem.split("/").pop() as string,
    title: r.title,
    date: r.date,
  })),
);
const formatDate = (d: string) =>
  new Date(d).toLocaleDateString(locale.value === "en" ? "en-GB" : "zh-TW", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

useSchemaOrg(
  computed(() => [
    {
      "@type": "ProfilePage",
      description: t("intro.des3"),
      // mainEntity 指向 layout 定義的 Person 節點（同一 @graph，靠 @id 解析）
      // ProfilePage rich result 規範要求此欄位
      mainEntity: { "@id": `${orgUrl.value}/#person` },
    },
  ]),
);

const experienceList = computed(() => [
  {
    title: t("jobTitle.manager"),
    current: true,
    years: String(yearsSince(MANAGER_START_YEAR)),
  },
  {
    title: t("jobTitle.supervisor"),
    current: false,
    years: "2",
  },
  {
    title: t("jobTitle.uiux"),
    current: false,
    years: "7",
  },
]);

defineOgImage("CustomTemplate", {
  title: pageTitle.value + " - " + t("website.name"),
  description: pageDescription.value,
});
</script>

<style scoped>
.page--index {
  @media screen and (width <= 768px) {
    padding: 0 0.5rem 1.5rem;
  }
}
.page-container {
  display: grid;
  gap: 1.5rem;
  grid-template:
    "l1 l1 r1 r2"
    "l1 l1 r3 r4"
    "l5 l5 l5 l5";
  @media screen and (width <= 1280px) {
    grid-template:
      "l1 l1 l1 l1"
      "r1 r1 r2 r2"
      "r3 r3 r4 r4"
      "l5 l5 l5 l5";
  }
  @media screen and (width <= 768px) {
    grid-template:
      "l1"
      "r1"
      "r2"
      "r3"
      "r4"
      "l5";
  }
}

#ak-container {
  position: absolute;
  top: 0;
  left: 0;
}

.card {
  background-color: oklch(var(--card-bg));
  border-radius: 1.5rem;
  padding: 3rem;
  position: relative;
  @media screen and (width <= 768px) {
    padding: 1.5rem;
  }
}

.intro {
  grid-area: l1;
}

.programming {
  grid-area: r1;
}

.promote {
  grid-area: r2;
}

.tools {
  grid-area: r3;
}

.experience {
  grid-area: r4;
  ul {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-left: 2rem;
  }
  li {
    display: flex;
    justify-content: space-between;
    position: relative;
    &:last-child {
      &:before {
        display: none;
      }
    }
    &:before {
      content: "";
      width: 1px;
      height: 100%;
      background-color: oklch(var(--border-color));
      position: absolute;
      top: 1.4rem;
      left: calc(-1.3725rem - 1px);
    }
    &:after {
      content: "";
      width: 0.75rem;
      height: 0.75rem;
      background-color: oklch(var(--color-primary));
      border-radius: 50%;
      position: absolute;
      top: 0.5rem;
      left: -1.75rem;
    }
  }
}

ul,
ol {
  color: oklch(var(--wrapper-color));
  list-style: inherit;
  padding-left: 20px;
}

.news {
  grid-area: l5;
}
.news-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
  li {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.5rem 1rem;
    justify-content: space-between;
  }
}
.news-date {
  color: oklch(var(--wrapper-color));
  font-size: 0.875rem;
  white-space: nowrap;
}
.news-more {
  display: inline-block;
  margin-top: 1.5rem;
}
</style>
