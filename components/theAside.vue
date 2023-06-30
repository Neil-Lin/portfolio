<template>
  <div class="port-list-blcok">
    <theHeader />
    <akContainer v-if="route.path === '/'" />
    <nav aria-label="主要選單" class="card-list" v-if="workList.length != 0">
      <ul>
        <li v-for="(item, idx) in workList" :key="idx" @click="$emit('closeMobileMenu')">
          <theCard
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
    <theEmptyContent v-else>目前沒有作品</theEmptyContent>
    <theFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { workList } = useWorkList()
</script>
