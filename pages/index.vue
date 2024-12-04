<template>
  <main class="page page--index">
    <h2 class="visually-hidden">{{ pageTitle }}</h2>
    <div class="page-aside">
      <theAside />
    </div>
  </main>
</template>

<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();
const store = useMobileMenuStore();
const { locale } = useI18n();
const workList = ref<any[]>([]); // 初始化為空陣列
const runtimeConfig = useRuntimeConfig();

onMounted(() => {
  nextTick(async () => {
    const apiPath =
      locale.value === "en" ? "/data/enUS.json" : "/data/enZhHantTW.json";
    const { data, error } = await useFetch(apiPath);

    if (error.value) {
      console.error("Fetch error:", error.value);
    } else {
      workList.value = (data.value as any[]) || [];
    }
  });
});

const pageTitle = ref(t("name.home"));

const structuredData = computed(() => ({
  "@context": "https://schema.org",
  "@graph": workList.value.map((work: any) => ({
    "@type": "CreativeWork",
    name: work.name,
    description: work.overview,
    url: runtimeConfig.public.baseUrl,
    thumbnailUrl: work.image.path,
  })),
}));

watch(workList, (newVal) => {
  if (newVal && newVal.length > 0) {
    useHead({
      script: [
        {
          type: "application/ld+json",
          children: JSON.stringify(structuredData.value),
        },
      ],
    });
  }
});
</script>
