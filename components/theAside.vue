<template>
  <div class="card-list-block">
    <TheHeader />
    <AkContainer v-if="route.path === '/' || route.path === '/en'" />
    <nav
      :aria-label="$t('mainMenu.mainMenu')"
      class="card-list"
      v-if="workList?.length != 0"
    >
      <ul>
        <li
          v-for="(item, idx) in workList"
          :key="idx"
          class="card-item"
          @click="store.handleCloseMobileMenuBtn"
        >
          <TheCard
            :cardLink="item.link"
            :cardTitle="item.name"
            :cardDes="item.overview"
            :cardHeroImagePath="item.image.path"
            :cardHeroImageAlt="item.image.alt"
            :cardTags="item.tags"
            :cardDisabled="item.disabled"
          />
        </li>
      </ul>
    </nav>
    <TheEmptyContent v-else>{{ $t("des.noData") }}</TheEmptyContent>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { locale } = useI18n();
const store = useMobileMenuStore();
const apiPath = locale.value === "en" ? "/api/works/enUS" : "/api/works/";
const { data } = await useFetch(apiPath);
const workList = ref(data);
</script>
