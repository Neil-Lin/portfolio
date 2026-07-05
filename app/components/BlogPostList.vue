<template>
  <ul v-if="posts.length" class="blog-list">
    <li
      v-for="post in posts"
      :key="post.url"
      class="blog-item animation-fade-out"
    >
      <h3>
        <nuxt-link
          :to="post.url"
          :title="`${$t('action.openWindow')} ${$t('action.goTo')} ${post.title}`"
          target="_blank"
        >
          {{ post.title }}
        </nuxt-link>
      </h3>
      <p class="des">{{ post.description }}</p>
    </li>
  </ul>
  <div v-else>{{ emptyText }}</div>
</template>

<script setup lang="ts">
defineProps<{
  posts: { title: string; url: string; description: string }[];
  emptyText?: string;
}>();
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
