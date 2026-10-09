// 部落格互動範例共用：最新在最上面的事件紀錄（用於 Dialog 系列範例）
export interface EventLogEntry {
  id: number;
  time: string;
  kind: string;
  message: string;
}

const MAX_ENTRIES = 30;

export function useEventLog() {
  const { locale } = useI18n();
  const entries = ref<EventLogEntry[]>([]);
  let nextId = 0;

  function add(kind: string, message: string) {
    const time = new Date().toLocaleTimeString(
      locale.value === "en" ? "en-US" : "zh-TW",
      { hour12: false },
    );
    entries.value = [
      { id: nextId++, time, kind, message },
      ...entries.value,
    ].slice(0, MAX_ENTRIES);
  }

  function clear() {
    entries.value = [];
  }

  return { entries, add, clear };
}

// 把目前的焦點元素描述成「button「關閉」」這種短字串，給事件紀錄用
export function describeFocus(el: Element | null, english = false) {
  if (!(el instanceof HTMLElement) || el === document.body) return "body";
  const label = (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 24);
  const tag = el.tagName.toLowerCase();
  if (!label) return tag;
  return english ? `${tag} "${label}"` : `${tag}「${label}」`;
}
