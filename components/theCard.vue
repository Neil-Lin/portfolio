<template>
  <nuxt-link
    class="card"
    :to="cardLink"
    :title="'觀看 ' + `${cardTitle}`"
    v-if="cardDisabled != true"
  >
    <div class="card-hero">
      <img :src="cardHeroImagePath" :alt="cardHeroImageAlt" />
    </div>
    <div class="card-title">{{ cardTitle }}</div>
    <div class="card-des">{{ cardDes }}</div>
    <ul v-if="cardTags.length != 0" class="tag-list">
      <li v-for="(item, idx) in cardTags" :key="idx">
        <span class="tag">{{ item }}</span>
      </li>
    </ul>
  </nuxt-link>

  <div class="card card--disabled" v-else>
    <div class="card-hero">
      <img :src="cardHeroImagePath" :alt="cardHeroImageAlt" />
    </div>
    <div class="card-title">{{ cardTitle }}</div>
    <div class="card-des">{{ cardDes }}</div>
    <ul v-if="cardTags.length != 0" class="tag-list">
      <li v-for="(item, idx) in cardTags" :key="idx">
        <span class="tag">{{ item }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
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

<style scoped>
.card {
  display: block;
  padding: 1rem;
  border: 1px solid oklch(var(--border-color));
  border-radius: 0.25rem;
  background-color: oklch(var(--color-white));
  text-decoration: none;
  &[aria-current='page'] {
    position: relative;
    box-shadow: 0 0 0 0.25rem oklch(var(--color-primary));
    &:before {
      content: '正在觀看';
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      font-size: 0.75rem;
      padding: 0.25rem 1rem;
      border-radius: 1.25rem;
      color: oklch(var(--color-white));
      /* background: linear-gradient(
        90deg,
        oklch(var(--color-primary)),
        oklch(var(--color-primary) / 20%),
        oklch(var(--color-primary))
      ); */
      background-color: oklch(var(--color-primary));
      background-size: 200% 200%;
      animation: now-wating-badge 5000ms ease infinite;
    }
  }
  .card-hero {
    & img {
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 9;
      max-height: 300px;
      object-fit: cover;
      border-radius: 0.25rem;
      object-position: center top;
    }
  }
  .card-title {
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-size: 1.125rem;
    font-weight: bold;
    color: oklch(var(--color-black));
  }
  .card-des {
    color: gray;
  }
  &.card--disabled {
    opacity: 0.5;
    background-color: oklch(var(--color-black) / 15%);
    pointer-events: none;
  }
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    padding-top: 1rem;
    & > li {
      margin-right: 0.5rem;
    }
  }
}
</style>
