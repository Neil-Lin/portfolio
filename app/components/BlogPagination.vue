<template>
  <nav class="blog-pagination" :aria-label="t('page.blog.pagination')">
    <ul>
      <li>
        <nuxt-link
          v-if="page > 1"
          :to="to(page - 1)"
          rel="prev"
          :aria-current="undefined"
        >
          <span aria-hidden="true">‹</span> {{ t("page.blog.prev") }}
        </nuxt-link>
      </li>
      <li v-for="item in items" :key="item.key">
        <span v-if="item.page === null" class="is-gap" aria-hidden="true"
          >…</span
        >
        <nuxt-link
          v-else
          :to="to(item.page)"
          :aria-current="item.page === page ? 'page' : undefined"
          :aria-label="t('page.blog.pageN', { page: item.page })"
        >
          {{ item.page }}
        </nuxt-link>
      </li>
      <li>
        <nuxt-link
          v-if="page < totalPages"
          :to="to(page + 1)"
          rel="next"
          :aria-current="undefined"
        >
          {{ t("page.blog.next") }} <span aria-hidden="true">›</span>
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

const props = defineProps<{
  page: number;
  totalPages: number;
  /** 產生某一頁的連結（保留目前的搜尋與分類） */
  to: (page: number) => RouteLocationRaw;
}>();

const { t } = useI18n();

// 注意：Vue Router 判斷「目前頁面」時不看網址參數，/blog?page=2 也算目前頁，
// 會自動加上 aria-current="page"。所以每個連結都明確指定 aria-current，蓋掉自動的值。

// 頁數不多時全部列出；多了就保留第一頁、最後一頁和目前頁前後各一頁，其餘用 … 代替
const items = computed(() => {
  const { page, totalPages } = props;
  const pages: number[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (
      totalPages <= 7 ||
      p === 1 ||
      p === totalPages ||
      Math.abs(p - page) <= 1
    ) {
      pages.push(p);
    }
  }
  const result: { key: string; page: number | null }[] = [];
  pages.forEach((p, i) => {
    const prev = pages[i - 1];
    if (prev !== undefined && p - prev > 1) {
      result.push({ key: `gap-${p}`, page: null });
    }
    result.push({ key: `page-${p}`, page: p });
  });
  return result;
});
</script>

<style scoped>
.blog-pagination {
  margin-top: 2rem;

  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    padding: 0;
    list-style: none;
  }

  li:empty {
    display: none;
  }

  a {
    /* 「上一頁 ‹」是文字加一個 span，用 grid 會被拆成兩列，改用 flex 排同一行 */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    min-width: 2.75rem;
    min-height: 2.75rem;
    padding: 0.25rem 0.75rem;
    border: 1px solid oklch(var(--border-color));
    border-radius: 2rem;
    background-color: oklch(var(--card-bg));
    color: inherit;
    text-decoration: none;
    white-space: nowrap;

    &:hover {
      border-color: oklch(var(--color-primary));
    }

    &[aria-current="page"] {
      border-color: oklch(var(--color-primary));
      background-color: oklch(var(--color-primary));
      color: oklch(var(--color-white));
      font-weight: 700;
    }
  }

  .is-gap {
    padding-inline: 0.25rem;
  }
}
</style>
