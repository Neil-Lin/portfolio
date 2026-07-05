<template>
  <div class="filters">
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
defineProps<{
  roles: string[];
}>();

const sortorder = defineModel<string>("sortorder", { required: true });
const role = defineModel<string>("role", { required: true });
const platform = defineModel<string>("platform", { required: true });
</script>
