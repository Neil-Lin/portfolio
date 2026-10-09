<template>
  <form role="search" class="blog-filters" @submit.prevent="emit('submit')">
    <div class="blog-filters__field is-search">
      <label :for="`${uid}-q`">{{ t("page.blog.searchLabel") }}</label>
      <div class="blog-filters__search">
        <!-- 快速鍵 Alt+S：游標直接移到搜尋框（說明在網站導覽頁） -->
        <input
          :id="`${uid}-q`"
          v-model="keyword"
          type="search"
          name="q"
          enterkeyhint="search"
          autocomplete="off"
          :placeholder="t('page.blog.searchPlaceholder')"
          accesskey="S"
        />
        <button type="submit" class="btn">
          {{ t("page.blog.searchSubmit") }}
        </button>
      </div>
    </div>
    <div class="blog-filters__field">
      <label :for="`${uid}-category`">{{ t("page.blog.categoryLabel") }}</label>
      <select :id="`${uid}-category`" v-model="category" name="category">
        <option value="">{{ t("page.blog.allCategories") }}</option>
        <option
          v-for="item in categories"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}（{{ item.count }}）
        </option>
      </select>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { BlogCategory } from "~/utils/blogCategories";

defineProps<{
  categories: { value: BlogCategory; label: string; count: number }[];
}>();

const keyword = defineModel<string>("keyword", { required: true });
const category = defineModel<BlogCategory | "">("category", {
  required: true,
});

const emit = defineEmits<{ submit: [] }>();

const { t } = useI18n();
const uid = useId();
</script>

<style scoped>
.blog-filters {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 1rem;
  margin-block: 1rem 1.5rem;

  @media (width <= 40rem) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.blog-filters__field {
  display: grid;
  gap: 0.375rem;

  label {
    font-weight: 700;
  }

  select {
    min-height: 2.75rem;
    width: 100%;
  }
}

.blog-filters__search {
  display: flex;
  gap: 0.5rem;

  input {
    flex: 1;
    min-width: 0;
    min-height: 2.75rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid oklch(var(--border-color));
    border-radius: 0.25rem;
    background-color: oklch(var(--input-bg));
    color: inherit;
    font: inherit;
    outline: none;

    &:focus-visible {
      box-shadow: 0 0 0 4px oklch(var(--outline-color));
    }
  }

  button {
    flex: none;
    min-height: 2.75rem;
    padding-block: 0.5rem;
  }
}
</style>
