<template>
  <div class="page">
    <div
      :class="['page-aside', store.mobileMenuStatus ? 'page-aside--open' : '']"
    >
      <button
        type="button"
        class="btn-close-mobile-menu"
        @click="store.handleCloseMobileMenuBtn"
      >
        {{ $t("action.closeMenu") }}
      </button>
      <theAside />
    </div>
    <main class="page-container">
      <button
        type="button"
        class="btn-open-mobile-menu"
        @click="store.handleToggleMobileMenuBtn"
      >
        <span>{{ $t("name.menu") }}</span>
      </button>
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const store = useMobileMenuStore();
</script>
