<template>
  <main class="page page--grid">
    <div class="page-container">
      <theBreadcrumbs :list="breadcrumbs" />
      <akContainer />
      <!-- 無選擇產品時，顯示完整列表 -->

      <h2>{{ pageTitle }}</h2>
      <!-- 🔽 篩選區塊 -->
      <div class="filters">
        <div>
          <label for="sortorder">{{ $t("words.sort") }}：</label>
          <select id="sortorder" v-model="sortorder">
            <option value="desc">{{ $t("words.newToOld") }}</option>
            <option value="asc">{{ $t("words.oldToNew") }}</option>
          </select>
        </div>
        <div>
          <label for="roleFilter">{{ $t("words.roles") }}：</label>
          <select id="roleFilter" v-model="selectedRole">
            <option value="">{{ $t("words.all") }}</option>
            <option v-for="role in uniqueRoles" :key="role" :value="role">
              {{ role }}
            </option>
          </select>
        </div>
        <div>
          <label for="platformFilter">{{ $t("words.platform") }}：</label>
          <select id="platformFilter" v-model="selectedPlatform">
            <option value="">{{ $t("words.all") }}</option>
            <option value="web">Web</option>
            <option value="app">App</option>
          </select>
        </div>
      </div>
      <!-- 分組後的產品列表 -->
      <div
        v-if="groupedlist.length > 0"
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
          v-for="group in groupedlist"
          :key="group.year"
          class="portfolio-area"
        >
          <ul class="portfolio-list">
            <li
              v-for="project in group.projects"
              :key="project.id"
              class="portfolio-item animation-fade-out"
            >
              <nuxt-link
                v-if="project.clickable && project.link"
                :to="project.link"
                :title="`${$t('action.openWindow')} ${$t('action.goTo')}${project.name![$i18n.locale]}`"
                target="_blank"
                class="portfolio-link"
              >
                <h3 class="portfolio-title">
                  {{ project.name[$i18n.locale] }}
                </h3>
                <div class="portfolio-content">
                  <img
                    v-if="
                      project.heroImage &&
                      project.heroImage[$i18n.locale].length > 0
                    "
                    :src="`${runtimeConfig.public.baseUrl}${project.heroImage[$i18n.locale]?.[0]?.src}`"
                    :alt="`${project.name[$i18n.locale]}`"
                    class="portfolio-img"
                  />
                  <div
                    v-if="project.intro![$i18n.locale]"
                    class="portfolio-intro"
                  >
                    <p>{{ project.intro![$i18n.locale] }}</p>
                  </div>
                </div>
                <div class="portfolio-footer">
                  <span class="visually-hidden">相關標籤：</span>
                  <span class="tag">
                    <span class="visually-hidden">執行起始時間：</span>
                    {{ formatYearRange(project.yearRange) }}
                  </span>
                  <span
                    v-if="
                      project.platform.includes('web') ||
                      project.platform.includes('app')
                    "
                    class="visually-hidden"
                  >
                    平臺種類：
                  </span>
                  <span v-if="project.platform.includes('web')" class="tag">
                    Web
                  </span>
                  <span v-if="project.platform.includes('app')" class="tag">
                    App
                  </span>
                  <span
                    v-if="project.roles[$i18n.locale].length > 0"
                    class="visually-hidden"
                  >
                    擔當角色：
                  </span>
                  <span
                    v-for="(item, index) in project.roles[$i18n.locale]"
                    :key="index"
                    class="tag"
                  >
                    {{ item }}
                  </span>
                </div>
              </nuxt-link>
              <div v-else class="portfolio-link portfolio-link--disabled">
                <h3 class="portfolio-title">
                  {{ project.name[$i18n.locale] }}
                </h3>
                <div class="portfolio-content">
                  <img
                    v-if="
                      project.heroImage &&
                      project.heroImage[$i18n.locale].length > 0
                    "
                    :src="`${runtimeConfig.public.baseUrl}${project.heroImage[$i18n.locale][0]!.src}`"
                    alt=""
                    class="portfolio-img"
                  />
                  <div
                    v-if="project.intro![$i18n.locale]"
                    class="portfolio-intro"
                  >
                    <p>{{ project.intro![$i18n.locale] }}</p>
                  </div>
                </div>
                <div class="portfolio-footer">
                  <span class="visually-hidden">相關標籤：</span>
                  <span class="tag">
                    <span class="visually-hidden">執行起始時間：</span>
                    {{ formatYearRange(project.yearRange) }}
                  </span>
                  <span
                    v-if="
                      project.platform.includes('web') ||
                      project.platform.includes('app')
                    "
                    class="visually-hidden"
                  >
                    平臺種類：
                  </span>
                  <span v-if="project.platform.includes('web')" class="tag">
                    Web
                  </span>
                  <span v-if="project.platform.includes('app')" class="tag">
                    App
                  </span>
                  <span
                    v-if="project.roles[$i18n.locale].length > 0"
                    class="visually-hidden"
                  >
                    擔當角色：
                  </span>
                  <span
                    v-for="(item, index) in project.roles[$i18n.locale]"
                    :key="index"
                    class="tag"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
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
    </div>
  </main>
</template>

<script setup lang="ts">
import projectsData from "~~/data/projectsData";
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { locale } = useI18n();
const projects = ref(projectsData);

definePageMeta({
  scrollToTop: false,
});

// 新增排序狀態，預設為新到舊 (desc)
const sortorder = ref(
  route.query.sortorder ? String(route.query.sortorder) : "desc"
);

// **從網址讀取篩選條件**
const selectedRole = ref(route.query.role ? String(route.query.role) : ""); // 單選角色
const selectedPlatform = ref(
  route.query.platform ? String(route.query.platform) : ""
); // 單選平台（web / app）

// 🔥 取得所有角色，生成篩選選單
const uniqueRoles = computed(() => {
  const roleSet = new Set();
  projects.value.forEach((p) => {
    p.roles[locale.value].forEach((role) => roleSet.add(role));
  });
  return Array.from(roleSet);
});

// 🔥 更新網址的 `query` 參數
const updateQueryParams = () => {
  router.replace({
    path: route.path,
    query: {
      role: selectedRole.value || undefined,
      platform: selectedPlatform.value || undefined,
      sortorder: sortorder.value || undefined,
    },
  });
};

// 🔥 監聽篩選條件變化，更新網址參數
watch([selectedRole, selectedPlatform, sortorder], updateQueryParams);

// 🔥 監聽網址 `query` 變化，當使用者修改網址時，自動更新篩選條件
watch(
  () => route.query,
  (query) => {
    selectedRole.value = query.role ? String(query.role) : "";
    selectedPlatform.value = query.platform ? String(query.platform) : "";
    sortorder.value = query.sortorder ? String(query.sortorder) : "desc";
  }
);

// 篩選產品 computed 屬性 (保留原有排序邏輯)
const filteredList = computed(() => {
  return projects.value
    .filter((p) => {
      const matchesRole =
        selectedRole.value === "" ||
        p.roles[locale.value].includes(selectedRole.value);
      const matchesPlatform =
        selectedPlatform.value === "" ||
        p.platform.includes(selectedPlatform.value);

      return matchesRole && matchesPlatform;
    })
    .sort((a, b) => {
      if (sortorder.value === "asc") {
        return a.yearRange.start - b.yearRange.start;
      } else {
        return b.yearRange.start - a.yearRange.start;
      }
    });
});

// 新增依據 yearRange.start 分組的 computed 屬性
const groupedlist = computed(() => {
  const groups: { projects: typeof projects.value }[] = [];

  filteredList.value.forEach((project) => {
    const year = project.yearRange.start;
    let group = groups.find((g) => g.year === year);
    if (!group) {
      group = { year, projects: [] };
      groups.push(group);
    }
    group.projects.push(project);
  });

  // 根據 sortorder 排序分組，若為 asc 則由小到大，否則由大到小
  groups.sort((a, b) => {
    if (sortorder.value === "asc") {
      return a.year - b.year;
    } else {
      return b.year - a.year;
    }
  });

  return groups;
});

// 🔥 轉換年份格式
const formatYearRange = (yearRange: { start: number; end: number | null }) => {
  return yearRange.end === null
    ? `${yearRange.start} - ` + t("words.present")
    : `${yearRange.start} - ${yearRange.end}`;
};

// SEO
const pageTitle = computed(() => t("words.projects"));
const pageDescription = computed(() => t("words.careerWorks"));
const runtimeConfig = useRuntimeConfig();

useHead({
  title: pageTitle,
  meta: [
    {
      hid: "description",
      name: "description",
      content: pageDescription.value,
    },
    {
      hid: "og:url",
      property: "og:url",
      content: runtimeConfig.public.baseUrl + route.path,
    },
    {
      hid: "og:title",
      property: "og:title",
      content: pageTitle.value + " - " + t("website.name"),
    },
    {
      hid: "og:description",
      property: "og:description",
      content: pageDescription.value,
    },
    {
      hid: "twitter:url",
      name: "twitter:url",
      content: runtimeConfig.public.baseUrl + route.path,
    },
    {
      hid: "twitter:title",
      name: "twitter:title",
      content: pageTitle.value + " - " + t("website.name"),
    },
    {
      hid: "twitter:description",
      name: "twitter:description",
      content: pageDescription.value,
    },
  ],
});

const breadcrumbs = computed(() => {
  if (route.params.name) {
    return [
      { link: "/", title: t("action.goToHomePage") },
      { link: "/projects", title: t("mainMenu.projects") },
      { title: route.params.name },
    ];
  } else {
    return [
      { link: "/", title: t("action.goToHomePage") },
      { link: "", title: t("mainMenu.projects") },
    ];
  }
});
</script>

<style scoped>
.page-container {
  grid-column: 4 / -4;
  @media screen and (width <= 1920px) {
    grid-column: 2 / -2;
  }
  @media screen and (width <= 768px) {
    grid-column: 1 / -1;
  }
}

.group-list {
  @media screen and (width <= 768px) {
    margin-left: 3rem;
  }
}

.btn--close-dialog {
  position: sticky;
  top: 0;
}
</style>
