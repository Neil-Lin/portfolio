/**
 * 在 <head> 加入外部 script；同一個 src 已經加過就不再加。
 * 部落格 demo 用來載入 Web Component（Accesserty UI Kit），只在瀏覽器端呼叫。
 */
export function loadScriptOnce(src: string): void {
  if (document.head.querySelector(`script[src="${CSS.escape(src)}"]`)) return;
  const script = document.createElement("script");
  script.src = src;
  document.head.append(script);
}
