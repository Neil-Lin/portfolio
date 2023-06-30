<template>
  <nav aria-label="主要選單" class="card-list">
    <ul>
      <li v-for="(item, idx) in workList" :key="idx">
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
</template>

<script setup lang="ts">
const { workList } = useWorkList()
</script>
