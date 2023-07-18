import { defineStore } from "pinia";
export const useMobileMenuStore = defineStore("mobileMenuStore", () => {
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
});
