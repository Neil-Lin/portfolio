<template>
  <nav aria-label="breadcrumb" class="breadcrumb">
    <ul>
      <li>
        <nuxt-link :to="localePath('/')" :title="$t('action.goToHomePage')">
          {{ $t("name.home") }}
        </nuxt-link>
      </li>
      <li>
        <nuxt-link
          :to="localePath(pageLink)"
          :title="$t('action.goTo') + pageTitle"
        >
          {{ pageTitle }}
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
defineProps({
  pageTitle: {
    type: String,
    required: true,
  },
  pageLink: {
    type: String,
    required: true,
  },
});
</script>
