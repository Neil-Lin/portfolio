// 讓固定在頁面頂端的表頭避開網站頁首。
// 網站頁首（TheHeader）往上捲時會固定在頂端、往下捲時藏起來，表頭的 top: 0 會跟它疊在一起。
// 這個 composable 在 target 元素上設定 CSS 變數（預設 --sticky-top），值是頁首目前露出的高度；
// CSS 裡寫 top: var(--sticky-top, 0) 即可。
export function useSiteHeaderOffset(
  target: Ref<HTMLElement | null>,
  variable = "--sticky-top",
) {
  let frame = 0;
  let header: HTMLElement | null = null;

  function sync() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      let offset = 0;
      if (header && getComputedStyle(header).position === "sticky") {
        offset = Math.max(0, Math.round(header.getBoundingClientRect().bottom));
      }
      target.value?.style.setProperty(variable, `${offset}px`);
    });
  }

  onMounted(() => {
    header = document.querySelector("header");
    window.addEventListener("scroll", sync, { passive: true });
    // 頁首用 transform 滑進滑出，動畫結束後再量一次
    header?.addEventListener("transitionend", sync);
    sync();
  });

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", sync);
    header?.removeEventListener("transitionend", sync);
    cancelAnimationFrame(frame);
  });

  return { sync };
}
