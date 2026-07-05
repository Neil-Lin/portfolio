<template>
  <Html :lang="head.htmlAttrs?.lang" :dir="head.htmlAttrs?.dir">
    <Meta charset="utf-8" />
    <Meta name="viewport" content="width=device-width, initial-scale=1" />
    <Meta
      name="keywords"
      :content="
        $t('words.a11y') +
        ', ' +
        $t('words.designManagement') +
        ', ' +
        $t('words.dataVisualization') +
        ', ' +
        $t('words.ui') +
        ', ' +
        $t('words.ux') +
        ', ' +
        $t('words.webLayout')
      "
    />
    <Meta name="author" content="Neil" />
    <Meta name="copyright" content="Neil" />
    <Meta name="format-detection" content="telephone=no" />
    <Meta name="description" :content="$t('intro.des2')" />
    <Meta property="og:title" :content="$t('website.name')" />
    <Meta property="og:description" :content="$t('intro.des2')" />
    <Meta name="twitter:card" content="summary_large_image" />
    <Meta name="twitter:title" :content="$t('website.name')" />
    <Meta name="twitter:description" :content="$t('intro.des2')" />
    <Meta name="mobile-web-app-capable" content="yes" />
    <Meta name="apple-mobile-web-app-capable" content="yes" />
    <Meta name="apple-touch-fullscreen" content="yes" />
    <Meta name="apple-mobile-web-app-title" :content="$t('website.name')" />
    <Meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <!-- 瀏覽器 / PWA 工具列顏色：網站主色紫 -->
    <Meta name="theme-color" content="#6042a0" />
    <Link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
    <!-- iOS 主畫面 app 圖示（無此標籤 iOS 會用網頁截圖當圖示） -->
    <Link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png" />
    <Link rel="apple-touch-icon" sizes="167x167" href="/favicon-167.png" />
    <Link rel="apple-touch-icon" sizes="152x152" href="/favicon-152.png" />

    <!-- https://github.com/nuxt/nuxt/issues/19752 -->
    <!-- Nuxt3  I don't think there's anything Nuxt can action related to this issue -->

    <Body class="wrapper">
      <div class="layout">
        <!-- <noscript class="noscript">
          {{ $t("words.noscript") }}
        </noscript> -->
        <TheHeader />
        <slot />
        <TheFooter />
      </div>
      <button
        v-show="scrollDistance > 300"
        type="button"
        class="btn-back-to-top"
        @click="scrollToTop"
      >
        <span class="visually-hidden">{{ $t("action.backToTop") }}</span>
        <span aria-hidden="true">🔝</span>
      </button>
    </Body>
  </Html>
</template>

<script setup lang="ts">
const { t } = useI18n();
const head = useLocaleHead();
const orgUrl = useOrgUrl();
const route = useRoute();

useHead(
  computed(() => ({
    titleTemplate: (pageTitle) =>
      pageTitle ? `${pageTitle} - ${t("website.name")}` : t("website.name"),
    // 文章頁（customHreflang）自管 canonical/hreflang，略過全站自動產生的版本，
    // 避免單語言文章被標上指向 404 的 alternate
    link: route.meta.customHreflang ? [] : [...(head.value.link || [])],
    meta: [...(head.value.meta || [])],
  })),
);

const { scrollToTop, scrollDistance } = useScrollToTop();

useSchemaOrg(
  computed(() => [
    {
      "@id": `${orgUrl.value}/#website`,
      "@type": "WebSite",
      name: t("website.name"),
      url: orgUrl.value,
    },
    {
      "@id": `${orgUrl.value}/#person`,
      "@type": "Person",
      name: "Neil Lin",
      url: orgUrl.value,
      jobTitle: t("jobTitle.uiux"),
      sameAs: ["https://github.com/Neil-Lin"],
    },
  ]),
);
</script>

<style>
@import url("@/assets/css/style.css");
</style>
