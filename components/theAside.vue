<template>
  <div class="card-list-block">
    <theHeader />
    <akContainer v-if="route.path === '/' || route.path === '/en'" />
    <nav :aria-label="$t('mainMenu.mainMenu')" class="card-list" v-if="workList.length != 0">
      <ul>
        <li v-for="(item, idx) in workList" :key="idx" class="card-item" @click="$emit('closeMobileMenu')">
          <theCard
            :cardLink="item.link"
            :cardTitle="item.name"
            :cardDes="item.overview"
            :cardHeroImagePath="item.image.path"
            :cardHeroImageAlt="item.image.alt"
            :cardTags="item.tags"
            :cardTime="item.time"
            :cardDisabled="item.disabled"
          />
        </li>
      </ul>
    </nav>
    <theEmptyContent v-else>{{ $t('des.noData') }}</theEmptyContent>
    <theFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { workList } = useWorkList()
</script>
