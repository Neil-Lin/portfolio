// 範例元件用的唯一 id：錨點名稱與 id 都要是合法的 CSS dashed-ident / HTML id
export function useDemoId(prefix: string) {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}
