<template>
  <div>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <ul v-else class="blog-list">
      <li
        v-for="post in posts"
        :key="post.link"
        class="blog-item animation-fade-out"
      >
        <h3>
          <nuxt-link
            :to="post.link"
            :title="`${$t('action.openWindow')} ${$t('action.goTo')} ${post.title}`"
            target="_blank"
          >
            {{ post.title }}
          </nuxt-link>
        </h3>
        <p>{{ post.description }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface MediumPost {
  title: string;
  link: string;
  description: string;
}

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
});

const { data, pending, error } = await useFetch(
  `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${props.username}`
);

const posts = computed<MediumPost[]>(() => {
  if (data.value && data.value.status === "ok") {
    return data.value.items
      .filter((item: { categories: string[] }) => item.categories.length > 0) // 排除非文章項目
      .map((item: { title: string; link: string; description: string }) => ({
        title: item.title,
        link: item.link,
        description:
          item.description.replace(/<[^>]+>/g, "").substring(0, 80) + "...", // 移除 HTML 標籤並截取前 80 個字元
      }));
  }
  return [];
});
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
  background-color: oklch(var(--color-white));
  border-radius: 1.5rem;
  flex-direction: column;
  @supports (animation-timeline: view()) {
    animation-name: fade-exit;
    animation-timing-function: ease-out;
    /* requires this to apply the animation */
    animation-duration: 1ms;
    animation-timeline: view();
    /* must have */
    animation-fill-mode: both;
  }
  a {
    text-decoration: none;
    text-wrap: pretty;
  }
}
</style>
