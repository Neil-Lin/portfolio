<template>
  <div ref="root" class="filters">
    <span class="visually-hidden">{{ $t("words.changeByFilter") }}</span>
    <div>
      <label for="sortorder">{{ $t("words.sort") }}：</label>
      <select id="sortorder" v-model="sortorder">
        <option value="desc">{{ $t("words.newToOld") }}</option>
        <option value="asc">{{ $t("words.oldToNew") }}</option>
      </select>
    </div>
    <div>
      <label for="roleFilter">{{ $t("words.roles") }}：</label>
      <select id="roleFilter" v-model="role">
        <option value="">{{ $t("words.all") }}</option>
        <option v-for="roleItem in roles" :key="roleItem" :value="roleItem">
          {{ roleItem }}
        </option>
      </select>
    </div>
    <div>
      <label for="platformFilter">{{ $t("words.platform") }}：</label>
      <select id="platformFilter" v-model="platform">
        <option value="">{{ $t("words.all") }}</option>
        <option value="web">Web</option>
        <option value="app">App</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  roles: string[];
  /** 篩選後的項目數，變更條件後播報給報讀軟體 */
  count: number;
}>();

const sortorder = defineModel<string>("sortorder", { required: true });
const role = defineModel<string>("role", { required: true });
const platform = defineModel<string>("platform", { required: true });

const { t } = useI18n();
const root = ref<HTMLElement | null>(null);

onMounted(() => {
  if (root.value) prepareAnnouncer(root.value);
});

// 以前是把整個作品列表包在 aria-live 裡，一換條件報讀軟體可能整排卡片都唸一遍；
// 現在只播報一句「顯示 N 個項目」
watch([sortorder, role, platform], async () => {
  await nextTick();
  if (root.value) {
    announce(
      root.value,
      t("data.resultCount", props.count, { named: { count: props.count } }),
    );
  }
});
</script>
