<template>
  <div class="page">
    <div :class="['page-aside', mobileMenuStatus ? 'page-aside--open' : '']">
      <button class="btn-close-mobile-menu" @click="handleCloseMobileMenuBtn">關閉選單</button>
      <theAside />
    </div>
    <main class="page-container">
      <button class="btn-open-mobile-menu" @click="handleToggleMobileMenuBtn">
        <span>選單</span>
      </button>
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const { mobileMenuStatus, handleToggleMobileMenuBtn, handleCloseMobileMenuBtn } = useMobileMenuBtn()
</script>
