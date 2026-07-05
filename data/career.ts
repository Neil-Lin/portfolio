// 年資以年份計算，build 時自動更新，避免文案中的數字過期
export const CAREER_START_YEAR = 2013;
export const MANAGER_START_YEAR = 2022;

export const yearsSince = (startYear: number) =>
  new Date().getFullYear() - startYear;
