<template>
  <div class="reference-target-demo demo">
    <p class="demo__label">
      {{ kind === "label" ? text.labelLabel : text.kitLabel }}
    </p>

    <div v-if="kind === 'label'" class="reference-target-demo__grid">
      <figure
        v-for="side in sides"
        :key="side.key"
        class="reference-target-demo__cell"
      >
        <figcaption>
          <code>{{
            side.on ? 'shadowrootreferencetarget="inp"' : text.noTarget
          }}</code>
        </figcaption>
        <label :for="`${uid}-${side.key}`" @click="check(side.key)">{{
          text.email
        }}</label>
        <!-- 元件的外框：Shadow DOM 在 onMounted 時建立，裡面才是真正的 input -->
        <div
          :id="`${uid}-${side.key}`"
          :ref="(el) => setHost(side.key, el)"
          class="reference-target-demo__host"
        ></div>
        <p class="reference-target-demo__result" :class="resultClass(side.key)">
          {{ resultText(side.key) }}
        </p>
      </figure>
    </div>

    <template v-else>
      <label class="demo__option">
        <input v-model="kitTarget" type="checkbox" />
        <span>{{ text.kitToggle }}</span>
      </label>
      <div class="reference-target-demo__cell">
        <label :for="`${uid}-kit`" @click="check('kit')">{{
          text.email
        }}</label>
        <au-input :id="`${uid}-kit`" ref="kitHost" type="email"></au-input>
        <p class="reference-target-demo__result" :class="resultClass('kit')">
          {{ resultText("kit") }}
        </p>
      </div>
    </template>

    <p class="demo__status">{{ modeText }}</p>
    <p class="demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：外面的 <label for> 指向 Shadow DOM 元件時，有沒有 reference target 的差別
// 用法：::reference-target-demo{kind="label"} 或 ::reference-target-demo{kind="kit"}
// kit 模式載入 Accesserty UI Kit 的 <au-input>，勾選後在「這個範例的元件」上設定 referenceTarget，不改 UI Kit 本身
type Key = "off" | "on" | "kit";

const props = defineProps<{ kind: "label" | "kit" }>();

const AU_INPUT_SRC = "/vendor/accesserty-ui-kit/2.0.8/input.js";

const uid = useDemoId("rtd");
const supported = ref<boolean | null>(null);
const kitTarget = ref(false);
const kitHost = ref<HTMLElement | null>(null);
const hosts = new Map<Key, HTMLElement>();
// 點 label 之後實際量到的焦點位置
const results = ref<Partial<Record<Key, "inside" | "outside">>>({});

const sides = [
  { key: "off" as const, on: false },
  { key: "on" as const, on: true },
];

function setHost(key: Key, el: unknown) {
  if (el instanceof HTMLElement) hosts.set(key, el);
}

const messages = {
  "zh-Hant-TW": {
    labelLabel:
      "互動範例：兩邊都是外面的 <label for> 指向元件，點「電子郵件」看看焦點會不會進到元件裡的 input",
    kitLabel:
      "互動範例：Accesserty UI Kit 的 <au-input>，點「電子郵件」看看焦點會不會進到 input",
    noTarget: "沒有設定 reference target",
    email: "電子郵件",
    kitToggle:
      "在這個範例的元件上設定 referenceTarget（模擬，不是 UI Kit 目前的行為）",
    pending: "點上方的「電子郵件」試試看",
    inside: "焦點進到元件裡的 input 了",
    outside: "焦點沒有進到 input",
    native: "你的瀏覽器支援 reference target",
    fallback:
      "你的瀏覽器不支援 reference target，兩種寫法的結果會一樣：外面的 label 接不到元件裡的 input",
    kitFallback: "你的瀏覽器不支援 reference target，勾選不會有作用",
    detecting: "偵測中（需要 JavaScript）",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    labelLabel:
      'Live demo: on both sides an outside <label for> points at the component. Click "Email" and see whether focus reaches the input inside it',
    kitLabel:
      'Live demo: Accesserty UI Kit\'s <au-input>. Click "Email" and see whether focus reaches the input',
    noTarget: "No reference target",
    email: "Email",
    kitToggle:
      "Set referenceTarget on this demo's component (a simulation, not the UI Kit's current behavior)",
    pending: 'Click "Email" above to try it',
    inside: "Focus moved to the input inside the component",
    outside: "Focus didn't reach the input",
    native: "Your browser supports reference target",
    fallback:
      "Your browser doesn't support reference target, so both give the same result: the outside label can't reach the input inside the component",
    kitFallback:
      "Your browser doesn't support reference target, so the checkbox has no effect",
    detecting: "Detecting (requires JavaScript)",
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = useDemoText(messages);

const modeText = computed(() =>
  supported.value === null
    ? text.value.detecting
    : supported.value
      ? text.value.native
      : props.kind === "kit"
        ? text.value.kitFallback
        : text.value.fallback,
);

function resultText(key: Key) {
  const r = results.value[key];
  return r === "inside"
    ? text.value.inside
    : r === "outside"
      ? text.value.outside
      : text.value.pending;
}
function resultClass(key: Key) {
  const r = results.value[key];
  return r ? `is-${r}` : undefined;
}

function hostOf(key: Key) {
  return key === "kit" ? kitHost.value : hosts.get(key);
}

// 點 label 後，等瀏覽器處理完 label 的預設行為，再看焦點落在哪裡
function check(key: Key) {
  setTimeout(() => {
    const host = hostOf(key);
    const inner = host?.shadowRoot?.activeElement;
    results.value = {
      ...results.value,
      [key]:
        document.activeElement === host && inner?.tagName === "INPUT"
          ? "inside"
          : "outside",
    };
  }, 50);
}

function buildLabelHosts() {
  for (const side of sides) {
    const host = hosts.get(side.key);
    if (!host || host.shadowRoot) continue;
    const root = host.attachShadow({ mode: "open" });
    root.innerHTML = `<style>
      input { box-sizing: border-box; font: inherit; inline-size: 100%; min-block-size: 2.5rem; padding: 0.25rem 0.5rem;
        border: 1px solid currentColor; border-radius: 0.375rem; background: transparent; color: inherit; }
      input:focus-visible { outline: 3px solid var(--rtd-outline); outline-offset: 2px; }
    </style><input id="inp" type="email" autocomplete="off">`;
    if (side.on && supported.value) {
      (
        root as ShadowRoot & { referenceTarget: string | null }
      ).referenceTarget = "inp";
    }
  }
}

function applyKitTarget() {
  const host = kitHost.value;
  const root = host?.shadowRoot as
    (ShadowRoot & { referenceTarget: string | null }) | null;
  if (!host || !root || !supported.value) return;
  // <au-input> 內部的 input 和外框用同一個 id
  root.referenceTarget = kitTarget.value
    ? (root.querySelector("input")?.id ?? null)
    : null;
  results.value = { ...results.value, kit: undefined };
}

watch(kitTarget, applyKitTarget);

onMounted(async () => {
  supported.value = "referenceTarget" in ShadowRoot.prototype;
  if (props.kind === "label") {
    buildLabelHosts();
    return;
  }
  if (!customElements.get("au-input")) {
    if (!document.querySelector(`script[src="${AU_INPUT_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = AU_INPUT_SRC;
      document.head.append(script);
    }
    await customElements.whenDefined("au-input");
  }
  applyKitTarget();
});
</script>
