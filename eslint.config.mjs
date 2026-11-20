import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import withNuxt from "./.nuxt/eslint.config.mjs";

// ── 專案規則 ────────────────────────────────────────────────
// 每條規則對應一種已清掉的寫法，訊息寫明：禁止什麼、為什麼、改用什麼。
// no-restricted-syntax 在多個設定區塊間是「後者覆蓋前者」，所以每個區塊都要帶完整清單。

/** 全專案 */
const NO_NEXTTICK_IN_WATCH = ["watch", "watchEffect"].map((name) => ({
  selector: `CallExpression[callee.name='${name}'] :function CallExpression[callee.name='nextTick']`,
  message: `禁止在 ${name} 回呼裡呼叫 nextTick() 等畫面更新：時序藏在回呼裡，容易漏掉或重複等待。請改用 ${name}(來源, 回呼, { flush: "post" })。`,
}));

const NO_AS_RECORD = {
  selector: "TSAsExpression[typeAnnotation.typeName.name='Record']",
  message:
    "禁止用 as Record<K, V> 斷言物件：少了某個 key 也不會報錯。請改用 satisfies Record<K, V>。",
};

const NO_GTM = ["Literal", "TemplateElement"].map((node) => ({
  selector: `${node}[${node === "Literal" ? "value" : "value.raw"}=/google[t]agmanager|GTM-[A-Z0-9]{4,}/]`,
  message:
    "禁止在程式中載入 Google Tag Manager：GTM 由 Cloudflare Google Tag Gateway 在邊緣注入，程式再載一次會讓事件重複計算。要調整請到 Cloudflare 與 GTM 後台。",
}));

const NO_ADHOC_TRAILING_SLASH = {
  selector:
    "CallExpression[callee.property.name='endsWith'][arguments.0.value='/']",
  message:
    "禁止自行用 endsWith('/') 判斷尾斜線：各處自己寫曾漏掉一處，讓英文首頁被誤判為內頁。請改用 app/utils/url.ts 的 withTrailingSlash()、isHomePath()。",
};

/** app/ 底下 */
const NO_RAW_LOCALE_PATH = [
  ["useLocalePath", "usePagePath()"],
  ["useSwitchLocalePath", "useLocaleSwitch() 的 resolve()"],
  ["useLocaleRoute", "usePagePath()"],
].map(([name, instead]) => ({
  selector: `CallExpression[callee.name='${name}']`,
  message: `禁止直接使用 ${name}()：產出的路徑沒有尾斜線，每次點擊多一次轉址，預渲染也會出現連結警告。請改用 ${instead}。`,
}));

/** 元件與頁面 */
const NO_DOCUMENT_QUERY = {
  selector:
    "MemberExpression[object.name='document'][property.name=/^(getElementById|querySelector|querySelectorAll|getElementsBy\\w+)$/]",
  message:
    "禁止在元件或頁面用 document 查詢元素：改了 id 或同一頁有多個實例時會悄悄失效。請改用 template ref 或模板事件（@toggle、@beforematch）；載入外部 script 用 loadScriptOnce()。",
};

const GLOBAL = [
  ...NO_NEXTTICK_IN_WATCH,
  NO_AS_RECORD,
  ...NO_GTM,
  NO_ADHOC_TRAILING_SLASH,
];
const APP = [...GLOBAL, ...NO_RAW_LOCALE_PATH];
const without = (list, ...drop) => list.filter((r) => !drop.includes(r));
const rule = (list) => ({ "no-restricted-syntax": ["error", ...list] });

export default withNuxt([
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...eslintConfigPrettier.rules,
      ...eslintPluginPrettierRecommended.rules,
    },
  },
  { name: "project/global", rules: rule(GLOBAL) },
  { name: "project/app", files: ["app/**"], rules: rule(APP) },
  {
    name: "project/components-pages",
    files: ["app/components/**", "app/pages/**", "app/layouts/**"],
    rules: rule([...APP, NO_DOCUMENT_QUERY]),
  },
  // 例外：封裝本身
  {
    name: "project/url-utils",
    files: ["app/utils/url.ts"],
    rules: rule(without(APP, NO_ADHOC_TRAILING_SLASH)),
  },
  {
    name: "project/locale-path-wrappers",
    files: [
      "app/composables/usePagePath.ts",
      "app/composables/useLocaleSwitch.ts",
    ],
    rules: rule(GLOBAL),
  },
]);
