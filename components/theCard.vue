<template>
  <div
    class="card"
    v-if="cardDisabled != true"
  >
    <div class="card-text">
      <nuxt-link
        class="card-title"
        :to="localePath(cardLink)"
        :title=" $t('action.goTo') + `${cardTitle}`"
      >
        {{ cardTitle }}
      </nuxt-link>
      <div class="card-des">{{ cardDes }}</div>
      <ul v-if="cardTags.length != 0" class="tag-list" :aria-label="$t('name.tag')">
        <li v-for="(item, idx) in cardTags" :key="idx">
          <span class="tag">{{ item }}</span>
        </li>
      </ul>
    </div>
    <div class="card-hero">
      <img :src="cardHeroImagePath" alt="" loading="lazy" />
    </div>
  </div>

  <div class="card card--disabled" v-else>
    <div class="card-text">
      <div class="card-title">{{ cardTitle }}</div>
      <div class="card-des">{{ cardDes }}</div>
      <ul v-if="cardTags.length != 0" class="tag-list">
        <li v-for="(item, idx) in cardTags" :key="idx">
          <span class="tag">{{ item }}</span>
        </li>
      </ul>
    </div>
    <div class="card-hero">
      <img :src="cardHeroImagePath" alt="" loading="lazy" />
    </div>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const props = defineProps({
  cardHeroImagePath: {
    type: String,
    required: true
  },
  cardHeroImageAlt: {
    type: String,
    required: true
  },
  cardTitle: {
    type: String,
    required: true
  },
  cardLink: {
    type: String,
    required: true
  },
  cardDes: {
    type: String,
    required: true
  },
  cardTags: {
    type: Array,
    required: true
  },
  cardDisabled: {
    type: Boolean
  }
})
</script>
