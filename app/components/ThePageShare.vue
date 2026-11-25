<template>
  <!-- 每一頁同一個位置、同一個名稱（WCAG 3.2.3、3.2.4）；錯誤頁不需要分享 -->
  <div v-if="!error" class="page-share">
    <!-- 沒有 JavaScript 時兩種做法都不能用，與其放一個按了沒反應的按鈕，不如先佔位（同高度，掛載後才不會跳動） -->
    <ClientOnly>
      <button
        ref="button"
        type="button"
        class="btn page-share__btn"
        @click="onClick"
      >
        {{ mode === "share" ? t("share.share") : t("share.copy") }}
      </button>
      <!-- 看得到的結果文字；報讀軟體由 announce() 播報，這裡不再設 live region，避免念兩次 -->
      <p v-if="status" class="page-share__status">
        {{ status }}
        <span v-if="manualUrl" class="page-share__url">{{ manualUrl }}</span>
      </p>
      <template #fallback>
        <span class="page-share__placeholder" aria-hidden="true" />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
// 全站分享按鈕：支援 Web Share API 時叫出作業系統的分享選單，不支援時改成複製連結。
// 做法與理由見 docs/web-share-research.md。
const { t } = useI18n();
const route = useRoute();
const error = useError();
const pagePath = usePagePath();
const runtimeConfig = useRuntimeConfig();

const button = useTemplateRef<HTMLButtonElement>("button");
const mode = ref<"share" | "copy">("copy");
const status = ref("");
const manualUrl = ref("");

// 部落格列表的搜尋、分類、分頁放在網址就是為了能分享（見 useBlogListQuery.ts），要保留；
// 其他頁面分享正規網址，與 canonical、og:url 同一個來源，不帶追蹤參數。
const BLOG_LIST_PARAMS = ["q", "category", "page"];
function shareUrl() {
  const url = absoluteUrl(runtimeConfig.public.baseUrl as string, route.path);
  if (withTrailingSlash(route.path) !== pagePath("/blog")) return url;
  const params = new URLSearchParams();
  for (const key of BLOG_LIST_PARAMS) {
    const value = route.query[key];
    if (typeof value === "string" && value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `${url}?${query}` : url;
}

function detectMode() {
  mode.value =
    typeof navigator.share === "function" &&
    navigator.canShare?.({ url: shareUrl() }) !== false
      ? "share"
      : "copy";
}

onMounted(() => {
  detectMode();
  if (button.value) prepareAnnouncer(button.value);
});

// 換頁時清掉上一頁的結果，分享失敗而改成複製連結的狀態也重新判斷
watch(
  () => route.fullPath,
  () => {
    status.value = "";
    manualUrl.value = "";
    if (import.meta.client) detectMode();
  },
);

function report(message: string, url = "") {
  status.value = message;
  manualUrl.value = url;
  if (button.value) announce(button.value, url ? `${message}${url}` : message);
}

// 分享選單關閉後，焦點如果掉到 body，移回按鈕，鍵盤與報讀軟體使用者才不用從頭找起
function restoreFocus() {
  const active = document.activeElement;
  if (!active || active === document.body) button.value?.focus();
}

async function share() {
  try {
    await navigator.share({ title: document.title, url: shareUrl() });
    // 成功不顯示訊息：資料交給作業系統就算完成（Windows 是選單打開時），使用者不一定真的送出了
  } catch (err) {
    // 使用者取消是正常操作，不是錯誤
    if (err instanceof DOMException && err.name === "AbortError") return;
    // 同一次點擊不能再分享一次（使用者操作已被用掉），改成複製連結，讓使用者再按一次
    mode.value = "copy";
    report(t("share.shareFailed"));
  } finally {
    restoreFocus();
  }
}

async function copy() {
  const url = shareUrl();
  try {
    await navigator.clipboard.writeText(url);
    report(t("share.copied"));
  } catch {
    // 沒有剪貼簿權限：把網址顯示出來，讓使用者自己複製
    report(t("share.copyFailed"), url);
  }
}

function onClick() {
  status.value = "";
  manualUrl.value = "";
  return mode.value === "share" ? share() : copy();
}
</script>
