export function useScrollToTop() {
  const { scrollDistance } = useDetectScrollY();

  const scrollToTop = () => {
    // 設定「減少動態效果」的使用者直接跳回頂端，不做平滑捲動
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return {
    scrollDistance,
    scrollToTop,
  };
}
