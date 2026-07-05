export default function useScrollToTop() {
  const { scrollDistance } = useDetectScrollY();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return {
    scrollDistance,
    scrollToTop,
  };
}
