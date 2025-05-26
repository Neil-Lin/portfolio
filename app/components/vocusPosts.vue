<template>
  <div>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <ul v-else class="blog-list">
      <li
        v-for="article in articles"
        :key="article.url"
        class="blog-item animation-fade-out"
      >
        <h3>
          <nuxt-link
            :to="article.url"
            :title="`${$t('action.openWindow')} ${$t('action.goTo')} ${article.title}`"
            target="_blank"
          >
            {{ article.title }}
          </nuxt-link>
        </h3>
        <p class="des">{{ article.abstract }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Article {
  title: string;
  abstract: string;
  url: string;
}

const { data, pending, error } = await useFetch<Article[]>(
  "https://neil-lin.github.io/portfolio/zh-blog.json",
  {
    server: false, // client only
  }
);

const articles = computed(() => data.value ?? []);
</script>

<style scoped>
.blog-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.blog-item {
  padding: 1.5rem;
  display: flex;
  background-color: oklch(var(--card-bg));
  border-radius: 1.5rem;
  flex-direction: column;

  @supports (animation-timeline: view()) {
    animation-name: fade-exit;
    animation-timing-function: ease-out;
    animation-duration: 1ms;
    animation-timeline: view();
    animation-fill-mode: both;
  }

  a {
    text-decoration: none;
    text-wrap: pretty;
  }

  .des {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
  }
}
</style>
