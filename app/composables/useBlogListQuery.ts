// 部落格列表的搜尋、分類、分頁狀態，一律以網址參數為準：/blog/?q=popover&category=frontend&page=2
// 好處：可以分享、加書籤，上一頁／下一頁也會回到原本的條件。
import { isBlogCategory, type BlogCategory } from "~/utils/blogCategories";

export const BLOG_PAGE_SIZE = 10;

const firstString = (value: unknown) =>
  typeof value === "string"
    ? value
    : Array.isArray(value) && typeof value[0] === "string"
      ? value[0]
      : "";

export interface BlogListQuery {
  q: string;
  category: BlogCategory | "";
  page: number;
}

export function useBlogListQuery() {
  const route = useRoute();
  const router = useRouter();

  // 靜態產生的 HTML 一律是「沒有任何條件的第 1 頁」。
  // 水合（hydration）前如果就讀網址參數，畫面會跟伺服器輸出的 HTML 對不上，
  // 所以掛載之後才開始讀。
  const ready = ref(false);
  onMounted(() => {
    ready.value = true;
  });

  const keyword = computed(() =>
    ready.value ? firstString(route.query.q).trim() : "",
  );
  const category = computed<BlogCategory | "">(() => {
    const value = firstString(route.query.category);
    return ready.value && isBlogCategory(value) ? value : "";
  });
  const page = computed(() => {
    const value = Number.parseInt(firstString(route.query.page), 10);
    return ready.value && Number.isFinite(value) && value > 1 ? value : 1;
  });

  // 只輸出有意義的參數：空字串、第 1 頁都不放進網址
  function buildQuery(next: Partial<BlogListQuery> = {}) {
    const q = (next.q ?? keyword.value).trim();
    const c = next.category ?? category.value;
    const p = next.page ?? page.value;
    const query: Record<string, string> = {};
    if (q) query.q = q;
    if (c) query.category = c;
    if (p > 1) query.page = String(p);
    return query;
  }

  // 打字時用 replace，不然每個字都會塞一筆瀏覽紀錄；換分類、換頁用 push
  function setQuery(next: Partial<BlogListQuery>, mode: "push" | "replace") {
    return router[mode]({ query: buildQuery(next) });
  }

  return { ready, keyword, category, page, buildQuery, setQuery };
}

// 搜尋比對：不分大小寫、全形半形視為相同；多個關鍵字用空白隔開，全部都要符合
export function matchesKeyword(haystack: string, keyword: string) {
  const normalize = (value: string) => value.normalize("NFKC").toLowerCase();
  const text = normalize(haystack);
  return normalize(keyword)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => text.includes(term));
}
