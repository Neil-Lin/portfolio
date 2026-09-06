// 整個 client 生命週期只註冊一次 scroll listener。
// 模組層旗標只在瀏覽器端有意義（onMounted 不會在 SSR 執行），
// 捲動值本身用 useState 保存，故不會有跨請求汙染。
let listenerAttached = false;

/**
 * 目前的垂直捲動距離（全站共享）。
 *
 * 先前每次呼叫都會建立各自的 ref 並註冊一個 scroll listener，
 * 而 layout（透過 useScrollToTop）與 theHeader 各呼叫一次 → 每頁兩個 listener 監聽同一件事。
 */
export function useDetectScrollY() {
  const scrollDistance = useState("scrollY", () => 0);

  onMounted(() => {
    if (listenerAttached) return;
    listenerAttached = true;
    const update = () => {
      scrollDistance.value = window.scrollY;
    };
    window.addEventListener("scroll", update, { passive: true });
    // 補上初始值：重新整理後停在頁面中段時，header 狀態才會正確
    update();
  });

  return {
    scrollDistance,
  };
}
