import type { Ref } from "vue";

// 部落格 dialog 範例用：不支援 Invoker Commands（Safari 26.2、Firefox 144 以前）時，
// 用 JavaScript 補上 dialog 相關指令。dialog 是 modal，不會有 popover 那種
// 「點按鈕先觸發 light dismiss」的問題，所以可以直接呼叫對應的方法。
export function useDialogCommandFallback(root: Ref<HTMLElement | null>) {
  let controller: AbortController | null = null;

  onMounted(() => {
    const el = root.value;
    if (!el || "commandForElement" in HTMLButtonElement.prototype) return;
    controller = new AbortController();

    el.querySelectorAll<HTMLButtonElement>("button[commandfor]").forEach(
      (btn) => {
        btn.addEventListener(
          "click",
          () => {
            const target = document.getElementById(
              btn.getAttribute("commandfor") ?? "",
            );
            if (!(target instanceof HTMLDialogElement)) return;
            const command = btn.getAttribute("command");
            if (command === "show-modal" && !target.open) target.showModal();
            if (command === "close") target.close(btn.value || undefined);
            if (command === "request-close") {
              const dialog: HTMLDialogElement = target;
              if (typeof dialog.requestClose === "function") {
                dialog.requestClose();
              } else {
                // 連 requestClose() 都沒有的瀏覽器：自己派發可取消的 cancel 事件
                const event = new Event("cancel", { cancelable: true });
                if (dialog.dispatchEvent(event)) dialog.close();
              }
            }
          },
          { signal: controller!.signal },
        );
      },
    );
  });

  onBeforeUnmount(() => controller?.abort());
}
