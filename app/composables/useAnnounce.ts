// 讓報讀軟體唸出狀態訊息：優先用 ariaNotify()，不支援時退回 live region。
// 說明文章：content/*/blog/aria-notify.md

export type AnnouncePriority = "normal" | "high";

type NotifyElement = Element & {
  ariaNotify?: (
    message: string,
    options?: { priority?: AnnouncePriority },
  ) => void;
};

const REGION_ATTR = "data-announcer";
// 剛建立或剛清空的 live region 立刻填內容，報讀軟體常常不會唸，等一下再填
const FILL_DELAY = 100;

export const supportsAriaNotify = () =>
  typeof (document.body as NotifyElement).ariaNotify === "function";

function getRegion(host: Element, priority: AnnouncePriority) {
  // modal 打開時背景是 inert，放在 body 的 live region 會失效，要放進對話框裡
  const container = host.closest("dialog[open]") ?? document.body;
  let region = container.querySelector<HTMLElement>(
    `:scope > [${REGION_ATTR}="${priority}"]`,
  );
  if (!region) {
    region = document.createElement("div");
    region.setAttribute(REGION_ATTR, priority);
    region.setAttribute(
      "aria-live",
      priority === "high" ? "assertive" : "polite",
    );
    region.className = "visually-hidden";
    container.append(region);
  }
  return region;
}

// 不支援 ariaNotify 時，提早把 live region 放進頁面，第一則訊息才不會漏掉
export function prepareAnnouncer(host: Element) {
  if (!supportsAriaNotify()) getRegion(host, "normal");
}

export function announce(
  host: Element,
  message: string,
  priority: AnnouncePriority = "normal",
): "ariaNotify" | "live-region" {
  const el = host as NotifyElement;
  if (typeof el.ariaNotify === "function") {
    // 元素版會用最近祖先的 lang 決定發音語言
    el.ariaNotify(message, { priority });
    return "ariaNotify";
  }
  const region = getRegion(host, priority);
  // 先清空再填：內容一樣時，報讀軟體才會再唸一次
  region.textContent = "";
  setTimeout(() => {
    region.textContent = message;
  }, FILL_DELAY);
  return "live-region";
}
