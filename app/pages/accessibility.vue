<template>
  <main class="page page--narrow">
    <div class="page-container">
      <TheBreadcrumbs :list="breadCrumbsList" />
      <AkContainer />
      <article>
        <h1>{{ pageTitle }}</h1>
        <p>{{ s.commitment[lc] }}</p>

        <section>
          <h2>{{ t("page.accessibility.standard") }}</h2>
          <p>{{ s.standard[lc] }}</p>
          <p>
            <nuxt-link
              :to="s.badgeUrl"
              :title="`${t('page.accessibility.badgeLink')} ${t('action.openWindow')}`"
              target="_blank"
            >
              {{ t("page.accessibility.badgeLink") }}
            </nuxt-link>
          </p>
        </section>

        <section>
          <h2>{{ t("page.accessibility.measures") }}</h2>
          <ul>
            <li v-for="(item, i) in s.measures[lc]" :key="i">{{ item }}</li>
          </ul>
          <i18n-t keypath="page.accessibility.shortcuts" tag="p" scope="global">
            <template #link>
              <nuxt-link :to="pagePath('/sitemap')">
                {{ t("mainMenu.sitemap") }}
              </nuxt-link>
            </template>
          </i18n-t>
        </section>

        <section>
          <h2>{{ t("page.accessibility.tested") }}</h2>
          <p>{{ s.testedWith[lc] }}</p>
        </section>

        <section>
          <h2>{{ t("page.accessibility.limitations") }}</h2>
          <p>{{ t("page.accessibility.limitationsIntro") }}</p>
          <div
            v-for="(item, i) in s.limitations[lc]"
            :key="i"
            class="a11y-limitation"
          >
            <h3>{{ item.where }}</h3>
            <p>{{ item.issue }}</p>
            <p>
              <strong>{{ t("page.accessibility.meanwhile") }}</strong>
              {{ item.meanwhile }}
            </p>
          </div>
        </section>

        <section>
          <h2>{{ t("page.accessibility.feedback") }}</h2>
          <p>{{ t("page.accessibility.feedbackP1") }}</p>
          <p>
            {{ t("page.accessibility.emailLabel")
            }}<a :href="`mailto:${s.contactEmail}`">{{ s.contactEmail }}</a>
          </p>
          <p>{{ t("page.accessibility.feedbackP2") }}</p>
        </section>

        <p>
          {{ t("page.accessibility.reviewedAt") }}
          <time :datetime="s.reviewedAt">{{ reviewedAtText }}</time>
        </p>
      </article>
    </div>
  </main>
</template>

<script setup lang="ts">
import { accessibilityStatement as s } from "~~/data/accessibility";
import type { LocaleKey } from "~~/data/types";

const { t, locale } = useI18n();
const pagePath = usePagePath();
const lc = computed(() => locale.value as LocaleKey);

const pageTitle = computed(() => t("words.accessibilityStatement"));
const pageDescription = computed(() => t("des.accessibility"));

usePageSeoMeta(pageTitle, pageDescription);

// W3C 建議日期寫出月份，避免 11/12 這類看不出月日的寫法。固定用 UTC，伺服器與瀏覽器輸出才一致。
const reviewedAtText = computed(() =>
  new Date(`${s.reviewedAt}T00:00:00Z`).toLocaleDateString(
    lc.value === "en" ? "en-GB" : "zh-TW",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" },
  ),
);

const breadCrumbsList = computed(() => [
  { link: "/", title: t("action.goToHomePage") },
  { link: "", title: t("words.accessibilityStatement") },
]);

useBreadcrumbSchema(breadCrumbsList);
</script>

<style scoped>
.a11y-limitation {
  margin-block: 1.5rem;
}
</style>
