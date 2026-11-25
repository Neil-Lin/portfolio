// 局部語言提醒（WCAG 3.1.2）：找出文章裡可能沒標 lang 的外文句子與連結標題。
// 規則是啟發式的（名稱、術語也可能被列出），只提醒、不讓指令失敗。用法：pnpm check:lang
// 寫法與判斷規則見 ACCESSIBILITY.md「寫內容時」。
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// 英文句子才常見的虛詞：用來排除單純的名稱、術語
const FUNCTION_WORDS =
  /\b(the|and|of|to|is|are|in|for|with|on|that|it|be|not|only|when|this|you|your|was|has|have|can|if|but|or|as)\b/i;
const CJK = /[\u3100-\u312F\u3400-\u9FFF\uF900-\uFAFF]/;
const CJK_RUN =
  /[\u3100-\u312F\u3400-\u9FFF\uF900-\uFAFF\u02C7\u02CA\u02CB\u02D9][\u3100-\u312F\u3400-\u9FFF\uF900-\uFAFF\u3000-\u303F\uFF00-\uFFEF\u02C7\u02CA\u02CB\u02D9]*/g;
const EN_SENTENCE =
  /[A-Za-z][A-Za-z'’,.:;!?()-]*(?:\s+[A-Za-z][A-Za-z'’,.:;!?()-]*){5,}/g;
const LINK = /(?<!!)\[([^\]]+)\]\(((?:[^()]|\([^()]*\))*)\)(\{[^}]*\})?/g;
const LANG_SPAN = /\[[^\]]*\]\{[^}]*lang=[^}]*\}/g;

function lines(file) {
  const out = [];
  let frontmatter = false;
  let code = false;
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (i === 0 && line === "---") return (frontmatter = true);
      if (frontmatter) {
        if (line === "---") frontmatter = false;
        return;
      }
      const t = line.trimStart();
      if (t.startsWith("```")) return (code = !code);
      if (code || t.startsWith("::") || t.startsWith("<")) return;
      out.push([i + 1, line.replace(/`[^`]*`/g, " ")]);
    });
  return out;
}

const warnings = [];
for (const [lang, other] of [
  ["zh", "en"],
  ["en", "zh-Hant-TW"],
]) {
  const dir = `content/${lang}/blog`;
  for (const name of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    for (const [n, line] of lines(join(dir, name))) {
      // 已經標好的 [..]{lang} 與連結先拿掉，再看剩下的文字
      let rest = line.replace(LANG_SPAN, " ");
      for (const [, text, url, attrs = ""] of line.matchAll(LINK)) {
        if (!/^https?:/.test(url) || attrs.includes("lang=")) continue;
        const isForeign =
          lang === "zh"
            ? !CJK.test(text) &&
              FUNCTION_WORDS.test(text) &&
              text.split(/\s+/).length >= 4
            : CJK.test(text);
        if (isForeign)
          warnings.push(
            `${dir}/${name}:${n} 連結標題可能要加 {lang="${other}"}：${text}`,
          );
      }
      rest = rest.replace(LINK, " ");
      if (lang === "zh") {
        for (const m of rest.matchAll(EN_SENTENCE))
          if (FUNCTION_WORDS.test(m[0]))
            warnings.push(
              `${dir}/${name}:${n} 英文句子可能要加 {lang="en"}：${m[0].slice(0, 80)}`,
            );
      } else {
        for (const m of rest.matchAll(CJK_RUN))
          warnings.push(
            `${dir}/${name}:${n} 中文可能要加 {lang="zh-Hant-TW"}：${m[0]}`,
          );
      }
    }
  }
}

if (warnings.length) {
  console.log(
    `局部語言提醒：${warnings.length} 處可能沒標 lang（名稱、術語、程式碼不用標）`,
  );
  for (const w of warnings) console.log(`  · ${w}`);
} else {
  console.log("局部語言提醒：沒有發現沒標 lang 的外文句子");
}
