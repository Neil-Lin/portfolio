export default function useDetectScrollY() {
  const scrollDistance = ref(0);

  const updateScroll = () => {
    scrollDistance.value = window.scrollY;
  };

  onMounted(() => {
    window.addEventListener("scroll", updateScroll, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", updateScroll);
  });

  return {
    scrollDistance,
  };
}
