<template>
  <div class="dialog-demo__log">
    <div class="popover-lab__log-head">
      <p :id="titleId" class="popover-lab__log-title">{{ title }}</p>
      <button
        type="button"
        class="popover-demo__close"
        :disabled="!entries.length"
        @click="$emit('clear')"
      >
        {{ clearLabel }}
      </button>
    </div>
    <ol class="popover-lab__log" :aria-labelledby="titleId">
      <li v-if="!entries.length" class="is-empty">{{ emptyLabel }}</li>
      <li v-for="entry in entries" :key="entry.id">
        <span class="popover-lab__time">{{ entry.time }}</span>
        <span class="is-event">{{ entry.kind }}</span>
        <span>{{ entry.message }}</span>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
// 部落格 dialog 範例共用的事件紀錄列表
defineProps<{ entries: EventLogEntry[]; title: string }>();
defineEmits<{ clear: [] }>();

const { locale } = useI18n();
const titleId = usePopoverDemoId("dlog");
const clearLabel = computed(() =>
  locale.value === "en" ? "Clear log" : "清除紀錄",
);
const emptyLabel = computed(() =>
  locale.value === "en"
    ? "No events yet. Try the buttons above."
    : "還沒有事件。按上面的按鈕試試。",
);
</script>
