<template>
  <div
    v-if="groupedList.length > 0"
    :class="[
      'group-list',
      sortorder === 'desc'
        ? 'group-list--top-space'
        : 'group-list--bottom-space',
    ]"
    aria-live="polite"
  >
    <div class="group-year-present">{{ $t("words.today") }}</div>
    <div
      v-for="(group, groupIdx) in groupedList"
      :key="group.year"
      class="portfolio-area"
    >
      <ul class="portfolio-list">
        <li
          v-for="(item, idx) in group.items"
          :key="item.id"
          class="portfolio-item animation-fade-out"
        >
          <slot name="card" :item="item" :idx="globalIndex(groupIdx, idx)" />
        </li>
      </ul>
      <div
        :class="[
          'group-year',
          sortorder === 'desc' ? 'group-year--bottom' : 'group-year--top',
        ]"
      >
        {{ group.year }}
      </div>
    </div>
  </div>
  <emptyBlock v-else>{{ $t("data.nodata") }}</emptyBlock>
</template>

<script setup lang="ts" generic="T extends { id: number }">
const props = defineProps<{
  groupedList: { year: number; items: T[] }[];
  sortorder: string;
}>();

defineSlots<{
  card(props: { item: T; idx: number }): unknown;
}>();

// slot 的 idx 為跨群組的全頁索引，讓「只有全頁第一張圖 fetchpriority=high、
// 其餘 lazy」的判斷成立（群組內索引會讓每個年份的第一張都被標 high）
const globalIndex = (groupIdx: number, idx: number) =>
  props.groupedList
    .slice(0, groupIdx)
    .reduce((total, group) => total + group.items.length, 0) + idx;
</script>

<style scoped>
.group-list {
  @media screen and (width <= 768px) {
    margin-left: 3rem;
  }
}
</style>
