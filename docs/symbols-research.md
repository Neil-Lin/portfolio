# symbols() 研究筆記（2026-11-13）

文章：`content/{zh,en}/blog/css-symbols.md`，範例：`app/components/content/SymbolsDemo.vue`。

## 支援度與依據

- Chrome 155：Chromium `runtime_enabled_features.json5` 的 `CSSCounterStyleSymbolsFunction` 在 153.0.8010.57、154.0.8037.154 為 experimental，155.0.8059.0 起 stable；MDN BCD 8.1.9 也是 155。
- Firefox 35：MDN Firefox 35 版本說明（bug 966168）；BCD 35。
- Safari：BCD preview。
- `@counter-style` 的 `speak-as`：BCD 寫 Chrome 91、Firefox 33、Safari 不支援。但 Chromium 的 `CSSAtRuleCounterStyleSpeakAsDescriptor` 是 `test`；`ax_node_object.cc`、`list_marker.cc`、`counter_style.cc` 都要這個旗標開啟才使用 speak-as。實測 `CSSCounterStyleRule.speakAs` 讀得到值（有解析），但無障礙樹不使用。
- MDN speak-as 頁面：「Assistive technology support is very limited for the speak-as property. Do not rely on it to convey information critical to understanding the page's purpose.」

## 規格（CSS Counter Styles 3）

- `symbols( <symbols-type>? [ <string> | <image> ]+ )`，類型 `cyclic | numeric | alphabetic | symbolic | fixed`，沒寫時為 `symbolic`。
- 匿名計數器樣式：prefix 空字串、suffix 空白、fallback decimal、**speak-as 固定 auto**。
- `numeric`、`alphabetic` 至少兩個符號，否則無效。
- `speak-as: auto`：alphabetic → spell-out；cyclic → bullets；extends 依被擴充的樣式；其他 → numbers。

## 實測（Chromium 157、159；153 對照）

| 寫法 | 無障礙樹標記（現在） | 開旗標後（規格行為，159） |
|---|---|---|
| `disc` | `•` | `•` |
| `symbols(cyclic "◆" "◇")` | `◆` | `•` |
| `symbols("◆")` | `◆` | `1` |
| `symbols(cyclic "✓")` | `✓` | `•` |
| `symbols(numeric "〇" "一" "二" "三")` | `一` | `1` |
| `symbols("*" "†" "‡" "§")` 第 5、6 項 | `**`、`††` | `5`、`6` |
| `symbols(alphabetic "甲" "乙")` | `甲`、`乙`、`甲甲`… | 同左（spell-out） |
| `@counter-style` + `speak-as: bullets` | `◆` | `•` |
| `@counter-style` + `speak-as: words`（✓） | `✓` | `✓` |
| `symbols(numeric "〇")`（只有一個） | 無效，退回 `•` | 同左 |
| `list-style: none` | 沒有標記，list 角色保留 | 同左 |
| `list-style-type: "◆ "` | `◆` | `◆` |

- Chromium 153：所有 `symbols()` 宣告被丟掉，退回 `•`；`@counter-style` 仍有效。
- 範例：`.demo ul { padding: 0 }` 權重較高，清單樣式要寫 `.sym-demo .sym-demo__list`。

## VoiceOver 實測（2026-11-14，使用者在正式機以 macOS VoiceOver + Chrome 測試）

| 寫法 | 念法 |
|---|---|
| `symbols(cyclic "◆" "◇")` | 念出「… diamond」，每一項都念 |
| `symbols("◆")` | 同上 |
| `symbols(cyclic "✓")` | 完全不念 |
| `@counter-style` + `speak-as: bullets` | 念出「… diamond」（speak-as 沒有作用，與原始碼一致） |

- 使用者另外測：✓ 寫在表單標籤文字裡，VoiceOver 也不念 → VoiceOver 本身不念這個符號。

## 尚未測試

- Firefox 是否套用 `speak-as`（MDN 標示支援）。
- Safari：退回預設圓點。
