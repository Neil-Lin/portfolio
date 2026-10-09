import type { Ref } from "vue";

// 部落格 popover 互動範例共用邏輯（content/*/blog/popover-auto-manual-hint.md）。
// 只在 onMounted 後執行：SSR 沒有 document，預渲染出的 HTML 只含靜態按鈕。

export interface PopoverSupport {
  popover: boolean;
  hint: boolean;
  command: boolean;
  anchor: boolean;
  interest: boolean;
}

export function detectPopoverSupport(): PopoverSupport {
  const popover = "popover" in HTMLElement.prototype;
  let hint = false;
  if (popover) {
    // 不認得的值會被當成 manual，讀回來就不會是 "hint"
    const probe = document.createElement("div");
    probe.popover = "hint";
    hint = probe.popover === "hint";
  }
  return {
    popover,
    hint,
    command: "commandForElement" in HTMLButtonElement.prototype,
    anchor: CSS.supports("position-area: bottom"),
    interest: "interestForElement" in HTMLButtonElement.prototype,
  };
}

// CloseWatcher 還沒進 TypeScript 內建型別，只宣告用到的部分
interface CloseWatcherLike {
  onclose: (() => void) | null;
  destroy: () => void;
}
declare global {
  interface Window {
    CloseWatcher?: new () => CloseWatcherLike;
  }
}

// 離開觸發按鈕後延遲關閉，讓滑鼠能移到提示上（WCAG 1.4.13 可移入）
const HIDE_DELAY = 250;
const GAP = 8;

const isOpen = (el: HTMLElement) => el.matches(":popover-open");

export function usePopoverDemo(
  root: Ref<HTMLElement | null>,
  onToggle?: (pop: HTMLElement, open: boolean) => void,
) {
  const support = ref<PopoverSupport | null>(null);
  // tooltip 的觸發方式：原生 interestfor，或不支援時的 JavaScript 後備
  const tooltipMode = ref<"native" | "script" | null>(null);
  let controller: AbortController | null = null;

  // 不支援 Anchor Positioning 時，改用 JS 依 data-anchor 定位
  function place(pop: HTMLElement) {
    if (support.value?.anchor || !pop.dataset.anchor) return;
    const anchor = document.getElementById(pop.dataset.anchor);
    if (!anchor) return;
    const r = anchor.getBoundingClientRect();
    const w = pop.offsetWidth;
    const h = pop.offsetHeight;
    let top = pop.classList.contains("is-above")
      ? r.top - h - GAP
      : r.bottom + GAP;
    if (top < GAP) top = r.bottom + GAP;
    if (top + h > innerHeight - GAP) top = Math.max(GAP, r.top - h - GAP);
    const left = Math.min(Math.max(GAP, r.left), innerWidth - w - GAP);
    pop.style.top = `${top}px`;
    pop.style.left = `${left}px`;
  }

  function wireTooltips(
    el: HTMLElement,
    signal: AbortSignal,
    hasHint: boolean,
  ) {
    const timers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();

    const show = (tip: HTMLElement, trigger: HTMLElement) => {
      clearTimeout(timers.get(tip));
      // 觸發按鈕在關閉中（或淡出中）的 popover 裡，看不見就不顯示提示
      const hiddenHost = trigger.closest<HTMLElement>("[popover]");
      if (hiddenHost && !isOpen(hiddenHost)) return;
      if (!isOpen(tip)) tip.showPopover();
    };
    const hideSoon = (tip: HTMLElement, trigger: HTMLElement) => {
      clearTimeout(timers.get(tip));
      timers.set(
        tip,
        setTimeout(() => {
          const keep =
            tip.matches(":hover") ||
            trigger.matches(":hover") ||
            trigger === document.activeElement;
          if (!keep && isOpen(tip)) tip.hidePopover();
        }, HIDE_DELAY),
      );
    };

    el.querySelectorAll<HTMLElement>("[interestfor]").forEach((trigger) => {
      const tip = document.getElementById(
        trigger.getAttribute("interestfor") ?? "",
      );
      if (!tip) return;
      const opts = { signal };

      if (!hasHint) {
        // 不支援時瀏覽器會當成 manual；手動模擬「打開時只關其他 hint」
        tip.addEventListener(
          "beforetoggle",
          (e) => {
            if ((e as ToggleEvent).newState !== "open") return;
            document
              .querySelectorAll<HTMLElement>('[popover="hint"]')
              .forEach((other) => {
                if (other !== tip && isOpen(other)) other.hidePopover();
              });
          },
          opts,
        );
      }

      trigger.addEventListener(
        "pointerenter",
        (e) => {
          if (e.pointerType === "mouse") show(tip, trigger);
        },
        opts,
      );
      trigger.addEventListener(
        "pointerleave",
        () => hideSoon(tip, trigger),
        opts,
      );
      trigger.addEventListener("focus", () => show(tip, trigger), opts);
      trigger.addEventListener("blur", () => hideSoon(tip, trigger), opts);
      tip.addEventListener(
        "pointerenter",
        () => clearTimeout(timers.get(tip)),
        opts,
      );
      tip.addEventListener("pointerleave", () => hideSoon(tip, trigger), opts);
    });

    if (!hasHint) {
      // 補上 Esc 關閉，維持 WCAG 1.4.13 可關閉
      document.addEventListener(
        "keydown",
        (e) => {
          if (e.key !== "Escape") return;
          el.querySelectorAll<HTMLElement>('[popover="hint"]').forEach(
            (tip) => {
              if (isOpen(tip)) tip.hidePopover();
            },
          );
        },
        { signal, capture: true },
      );
    }
  }

  // Chrome 154 實測：interestfor 打開的提示，按一次 Esc 會先因「失去興趣」關掉提示，
  // 接著 popover 自己的 Esc 機制又關掉下一層的選單，焦點跑回選單按鈕。
  // keydown 的 preventDefault() 擋不住第二步；提示打開時建一個 CloseWatcher，
  // 第一次 Esc 就只會關提示（WCAG 1.4.13 不移動焦點即可關閉）。
  function guardTooltipEscape(el: HTMLElement, signal: AbortSignal) {
    if (typeof window.CloseWatcher !== "function") return;
    const watchers = new Map<HTMLElement, CloseWatcherLike>();
    el.querySelectorAll<HTMLElement>('[popover="hint"]').forEach((tip) => {
      tip.addEventListener(
        "toggle",
        (e) => {
          watchers.get(tip)?.destroy();
          watchers.delete(tip);
          if ((e as ToggleEvent).newState !== "open") return;
          const watcher = new window.CloseWatcher!();
          watcher.onclose = () => {
            if (isOpen(tip)) tip.hidePopover();
          };
          watchers.set(tip, watcher);
        },
        { signal },
      );
    });
    signal.addEventListener("abort", () => {
      watchers.forEach((watcher) => watcher.destroy());
    });
  }

  onMounted(() => {
    const el = root.value;
    support.value = detectPopoverSupport();
    if (!el || !support.value.popover) return;

    controller = new AbortController();
    const { signal } = controller;

    // 不支援 Invoker Commands（Safari 26.2、Firefox 144 以前）時，換回原生的 popovertarget。
    // 不自己用 JS 呼叫 togglePopover()：按鈕在 auto popover 外面，點擊會先觸發 light dismiss，
    // 接著又被 toggle 打開；popovertarget 有內建處理這個情況。
    if (!("commandForElement" in HTMLButtonElement.prototype)) {
      const actions: Record<string, string> = {
        "toggle-popover": "toggle",
        "show-popover": "show",
        "hide-popover": "hide",
      };
      el.querySelectorAll<HTMLButtonElement>("button[commandfor]").forEach(
        (btn) => {
          const action = actions[btn.getAttribute("command") ?? ""];
          if (!action) return;
          btn.setAttribute("popovertarget", btn.getAttribute("commandfor")!);
          btn.setAttribute("popovertargetaction", action);
          btn.removeAttribute("commandfor");
          btn.removeAttribute("command");
        },
      );
    }

    el.querySelectorAll<HTMLElement>("[popover]").forEach((pop) => {
      pop.addEventListener(
        "toggle",
        (e) => {
          const open = (e as ToggleEvent).newState === "open";
          if (open) place(pop);
          onToggle?.(pop, open);
        },
        { signal },
      );
    });

    // 支援 interestfor 時，移入、聚焦、長按、延遲與 Esc 全交給瀏覽器，不必再接 JS
    if (support.value.interest) {
      tooltipMode.value = "native";
      guardTooltipEscape(el, signal);
    } else {
      tooltipMode.value = "script";
      wireTooltips(el, signal, support.value.hint);
    }
  });

  onBeforeUnmount(() => controller?.abort());

  return { support, tooltipMode };
}

// 錨點名稱與 id 都要是合法的 CSS dashed-ident / HTML id
export function usePopoverDemoId(prefix: string) {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}
