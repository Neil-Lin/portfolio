// 部落格互動範例共用：瀏覽器特性偵測清單。
// 只能在 onMounted 後呼叫（SSR 沒有 document）。新文章要偵測新特性時，在這裡加一筆。

export interface FeatureDetector {
  name: string;
  detect: () => boolean;
}

export const featureDetectors: Record<string, FeatureDetector> = {
  popover: {
    name: "Popover API",
    detect: () => "popover" in HTMLElement.prototype,
  },
  command: {
    name: "Invoker Commands",
    detect: () => "commandForElement" in HTMLButtonElement.prototype,
  },
  "popover-hint": {
    name: 'popover="hint"',
    detect: () => {
      if (!("popover" in HTMLElement.prototype)) return false;
      const probe = document.createElement("div");
      probe.popover = "hint";
      return probe.popover === "hint";
    },
  },
  anchor: {
    name: "Anchor Positioning",
    detect: () => CSS.supports("position-area: bottom"),
  },
  "position-try": {
    name: "position-try-fallbacks",
    detect: () => CSS.supports("position-try-fallbacks: flip-block"),
  },
  "text-autospace": {
    name: "text-autospace",
    detect: () => CSS.supports("text-autospace: normal"),
  },
  "scroll-marker": {
    name: "::scroll-marker / ::scroll-button()",
    detect: () =>
      CSS.supports("selector(::scroll-marker)") &&
      CSS.supports("selector(::scroll-button(inline-end))"),
  },
  "overflow-anchor": {
    name: "overflow-anchor",
    detect: () => CSS.supports("overflow-anchor: none"),
  },
  focusgroup: {
    name: "focusgroup",
    detect: () => "focusGroup" in HTMLElement.prototype,
  },
  interestfor: {
    name: "interestfor",
    detect: () => "interestForElement" in HTMLButtonElement.prototype,
  },
  "until-found": {
    // until-found 與 beforematch 事件同時推出，有事件處理器屬性即代表支援
    name: 'hidden="until-found"',
    detect: () => "onbeforematch" in HTMLElement.prototype,
  },
  "dialog-closedby": {
    name: "<dialog closedby>",
    detect: () =>
      typeof HTMLDialogElement !== "undefined" &&
      "closedBy" in HTMLDialogElement.prototype,
  },
  "dialog-requestclose": {
    name: "dialog.requestClose()",
    detect: () =>
      typeof HTMLDialogElement !== "undefined" &&
      "requestClose" in HTMLDialogElement.prototype,
  },
  "aria-notify": {
    name: "ariaNotify()",
    detect: () => "ariaNotify" in Element.prototype,
  },
  dsd: {
    name: "Declarative Shadow DOM",
    detect: () => "shadowRootMode" in HTMLTemplateElement.prototype,
  },
  "details-name": {
    name: "<details name>",
    detect: () =>
      typeof HTMLDetailsElement !== "undefined" &&
      "name" in HTMLDetailsElement.prototype,
  },
};

export function detectFeatures(keys: string[]) {
  return keys.map((key) => {
    const detector = featureDetectors[key];
    return {
      key,
      name: detector?.name ?? key,
      ok: detector ? detector.detect() : false,
    };
  });
}
