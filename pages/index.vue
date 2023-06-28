<template>
  <main class="page page--index">
    <div class="page-aside">
      <thePortfolioList />
    </div>
    <nuxt-link
      id="ak-container"
      to="#ak-container"
      title="中央內容區塊"
      accesskey="C"
      name="ak-container"
      class="visually-hidden"
    >
      :::
    </nuxt-link>
    <h2 class="visually-hidden">{{ pageTitle }}</h2>
  </main>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const pageTitle = ref('首頁')

useHead({
  title: pageTitle,
  meta: [
    {
      hid: 'og:title',
      property: 'og:title',
      content: pageTitle.value + ' - ' + runtimeConfig.public.websiteName
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: pageTitle.value + ' - ' + runtimeConfig.public.websiteName
    }
  ]
})
</script>
