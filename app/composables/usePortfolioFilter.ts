import type { YearRange, I18nStringArray } from "~~/data/types";

interface FilterableItem {
  yearRange: YearRange;
  roles: I18nStringArray;
  platform: string[];
}

export function usePortfolioFilter<T extends FilterableItem>(items: T[]) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const route = useRoute();

  const sortorder = ref(
    route.query.sortorder ? String(route.query.sortorder) : "desc",
  );
  const selectedRole = ref(route.query.role ? String(route.query.role) : "");
  const selectedPlatform = ref(
    route.query.platform ? String(route.query.platform) : "",
  );

  const uniqueRoles = computed(() => {
    const roleSet = new Set<string>();
    items.forEach((p) => p.roles[locale.value].forEach((r) => roleSet.add(r)));
    return Array.from(roleSet);
  });

  const filteredList = computed(() =>
    items
      .filter((p) => {
        const matchesRole =
          selectedRole.value === "" ||
          p.roles[locale.value].includes(selectedRole.value);
        const matchesPlatform =
          selectedPlatform.value === "" ||
          p.platform.includes(selectedPlatform.value);
        return matchesRole && matchesPlatform;
      })
      .sort((a, b) =>
        sortorder.value === "asc"
          ? a.yearRange.start - b.yearRange.start
          : b.yearRange.start - a.yearRange.start,
      ),
  );

  const groupedList = computed(() => {
    const groups: { year: number; items: T[] }[] = [];
    filteredList.value.forEach((item) => {
      const year = item.yearRange.start;
      let group = groups.find((g) => g.year === year);
      if (!group) {
        group = { year, items: [] };
        groups.push(group);
      }
      group.items.push(item);
    });
    groups.sort((a, b) =>
      sortorder.value === "asc" ? a.year - b.year : b.year - a.year,
    );
    return groups;
  });

  const formatYearRange = (yearRange: YearRange) =>
    yearRange.end === null
      ? `${yearRange.start} - ${t("words.present")}`
      : `${yearRange.start} - ${yearRange.end}`;

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

  watch([selectedRole, selectedPlatform, sortorder], updateQueryParams);

  watch(
    () => route.query,
    (query) => {
      selectedRole.value = query.role ? String(query.role) : "";
      selectedPlatform.value = query.platform ? String(query.platform) : "";
      sortorder.value = query.sortorder ? String(query.sortorder) : "desc";
    },
  );

  return {
    sortorder,
    selectedRole,
    selectedPlatform,
    uniqueRoles,
    filteredList,
    groupedList,
    formatYearRange,
  };
}
