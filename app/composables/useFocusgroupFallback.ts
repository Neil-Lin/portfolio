// focusgroup 範例共用：偵測支援度，不支援時用 JavaScript 的 roving tabindex 模擬同樣的行為。
// 行為表是在 Chromium 153 實測原生 focusgroup 整理出來的（見 content/*/blog/focusgroup.md）。

export type FocusgroupType =
  "toolbar" | "tablist" | "radiogroup" | "listbox" | "menu" | "menubar";

interface Behavior {
  role: string; // 容器自動得到的角色
  itemRole: string | null; // 子項目自動得到的角色（null = 不變）
  inline: boolean; // 左右鍵可用
  block: boolean; // 上下鍵可用
  wrap: boolean; // 預設會不會繞回
}

export const FOCUSGROUP_BEHAVIORS: Record<FocusgroupType, Behavior> = {
  toolbar: {
    role: "toolbar",
    itemRole: null,
    inline: true,
    block: false,
    wrap: false,
  },
  tablist: {
    role: "tablist",
    itemRole: "tab",
    inline: true,
    block: false,
    wrap: true,
  },
  radiogroup: {
    role: "radiogroup",
    itemRole: "radio",
    inline: true,
    block: true,
    wrap: true,
  },
  listbox: {
    role: "listbox",
    itemRole: null,
    inline: false,
    block: true,
    wrap: false,
  },
  menu: {
    role: "menu",
    itemRole: "menuitem",
    inline: false,
    block: true,
    wrap: true,
  },
  menubar: {
    role: "menubar",
    itemRole: "menuitem",
    inline: true,
    block: false,
    wrap: true,
  },
};

export const supportsFocusgroup = () =>
  typeof HTMLElement !== "undefined" && "focusGroup" in HTMLElement.prototype;

export interface FocusgroupOptions {
  type: FocusgroupType;
  wrap?: boolean; // 不給就用該類型的預設
  memory?: boolean; // 預設 true：Tab 回來時停在上次的項目
  start?: () => HTMLElement | null; // 對應 focusgroupstart：第一次進來停在哪
}

// 不支援時的後備：整組只留一個 tabindex=0，方向鍵在項目之間移動
export function applyFocusgroupFallback(
  container: HTMLElement,
  options: FocusgroupOptions,
  signal: AbortSignal,
) {
  const behavior = FOCUSGROUP_BEHAVIORS[options.type];
  const wrap = options.wrap ?? behavior.wrap;
  const memory = options.memory ?? true;
  const items = () =>
    [...container.children].filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement && !el.matches(":disabled"),
    );

  if (!container.hasAttribute("role"))
    container.setAttribute("role", behavior.role);
  if (behavior.itemRole) {
    items().forEach((el) => {
      if (!el.hasAttribute("role")) el.setAttribute("role", behavior.itemRole!);
    });
  }

  let last: HTMLElement | null = null;
  const entry = () => options.start?.() ?? items()[0] ?? null;
  const setStop = (target: HTMLElement | null) => {
    items().forEach((el) => (el.tabIndex = el === target ? 0 : -1));
  };
  setStop(entry());

  container.addEventListener(
    "focusin",
    (e) => {
      const target = e.target as HTMLElement;
      if (items().includes(target)) {
        last = target;
        setStop(target);
      }
    },
    { signal },
  );
  container.addEventListener(
    "focusout",
    (e) => {
      if (container.contains(e.relatedTarget as Node)) return;
      // 離開整組後，下次 Tab 進來要停在哪
      setStop(memory && last ? last : entry());
    },
    { signal },
  );
  container.addEventListener(
    "keydown",
    (e) => {
      const list = items();
      const index = list.indexOf(e.target as HTMLElement);
      if (index < 0 || e.altKey || e.ctrlKey || e.metaKey) return;
      const rtl = getComputedStyle(container).direction === "rtl";
      let step = 0;
      if (behavior.inline && e.key === "ArrowRight") step = rtl ? -1 : 1;
      else if (behavior.inline && e.key === "ArrowLeft") step = rtl ? 1 : -1;
      else if (behavior.block && e.key === "ArrowDown") step = 1;
      else if (behavior.block && e.key === "ArrowUp") step = -1;
      let next: number | null = null;
      if (step) {
        next = index + step;
        if (next < 0) next = wrap ? list.length - 1 : 0;
        if (next >= list.length) next = wrap ? 0 : list.length - 1;
      } else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = list.length - 1;
      if (next === null) return;
      e.preventDefault();
      list[next]?.focus();
    },
    { signal },
  );
}
