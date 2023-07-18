export default function () {
  const mobileMenuStatus = ref(false);
  const handleToggleMobileMenuBtn = () => {
    mobileMenuStatus.value = !mobileMenuStatus.value;
  };
  const handleCloseMobileMenuBtn = () => {
    mobileMenuStatus.value = false;
  };
  return {
    mobileMenuStatus,
    handleToggleMobileMenuBtn,
    handleCloseMobileMenuBtn,
  };
}
