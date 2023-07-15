<template>
  <div class="page">
    <div :class="['page-aside', mobileMenuStatus ? 'page-aside--open' : '']">
      <button type="button" class="btn-close-mobile-menu" @click="handleCloseMobileMenuBtn">{{ $t('action.closeMenu') }}</button>
      <theAside @closeMobileMenu="mobileMenuStatus = false"/>
    </div>
    <main class="page-container">
      <button type="button" class="btn-open-mobile-menu" @click="handleToggleMobileMenuBtn">
        <span>{{ $t('name.menu') }}</span>
      </button>
      <NuxtPage :key="$route.fullPath"/>
    </main>
  </div>
</template>

<script setup lang="ts">
const { mobileMenuStatus, handleToggleMobileMenuBtn, handleCloseMobileMenuBtn } = useMobileMenuBtn()
</script>
