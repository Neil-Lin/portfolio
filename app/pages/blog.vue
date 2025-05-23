<template>
  <main class="page page--narrow">
    <div class="page-container">
      <theBreadcrumbs :list="breadCrumbsList" />
      <akContainer />
      <h2>{{ pageTitle }}</h2>
      <p>{{ t("page.blog.hint") }}</p>
      <br />
      <medium-posts username="neil-lin" />
      <br />
      <nuxt-link
        to="https://neil-lin.medium.com/"
        :title="`${$t('action.openWindow')} ${$t('action.goTo')} Medium`"
        target="_blank"
        class="btn"
      >
        {{ t("page.blog.forward") }}
      </nuxt-link>
    </div>
  </main>
</template>

<script setup lang="ts">
const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();
const pageTitle = ref(t("mainMenu.blog"));
const pageDescription = ref(t("des.blog"));
const route = useRoute();

useHead({
  title: pageTitle,
  meta: [
    {
      hid: "description",
      name: "description",
      content: pageDescription.value,
    },
    {
      hid: "og:url",
      property: "og:url",
      content: runtimeConfig.public.baseUrl + route.path,
    },
    {
      hid: "og:title",
      property: "og:title",
      content: pageTitle.value + " - " + t("website.name"),
    },
    {
      hid: "og:description",
      property: "og:description",
      content: pageDescription.value,
    },
    {
      hid: "twitter:url",
      name: "twitter:url",
      content: runtimeConfig.public.baseUrl + route.path,
    },
    {
      hid: "twitter:title",
      name: "twitter:title",
      content: pageTitle.value + " - " + t("website.name"),
    },
    {
      hid: "twitter:description",
      name: "twitter:description",
      content: pageDescription.value,
    },
  ],
});

const breadCrumbsList = computed(() => [
  {
    link: "/",
    title: t("action.goToHomePage"),
  },
  {
    link: "",
    title: t("mainMenu.blog"),
  },
]);
</script>
