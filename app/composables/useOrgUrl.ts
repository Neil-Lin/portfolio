export function useOrgUrl() {
  const { locale } = useI18n();
  const runtimeConfig = useRuntimeConfig();

  return computed(() =>
    locale.value === "en"
      ? `${runtimeConfig.public.baseUrl}/en`
      : `${runtimeConfig.public.baseUrl}`,
  );
}
