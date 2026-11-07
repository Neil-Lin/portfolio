# 整理清單支援度總檢查（2026-11-07）

對象：`content/{zh,en}/blog/css-techniques-checklist.md` 的 116 列。

## 方法

- 每列對應 MDN browser-compat-data 8.1.8（2026-11-02）的相容性鍵值，比對文字裡的版本號、「尚未支援」等說法和支援標記。
- 有寫 Chrome 版本的，再用 Chromium 原始碼（`runtime_enabled_features.json5`、`css_properties.json5`）在各版本標籤確認。
- 版本推出日期用 BCD `browsers/*.json` 的 `release_date`：Chrome 156（10/20）、157（11/3）、158（11/17，尚未推出）；Firefox 159（10/27）；Safari 27.2（10/26）。
- 支援標記規則：三大瀏覽器或兩個以上支援 → 🟡（較新）以上；只有一個或要開旗標 → 🟠。

## 修正（23 處）

- 媒體狀態偽類：Chrome 158 尚未推出（預計 11/17），文章也一併更正。
- `alpha()` Chrome 151 → 152；`text-decoration-inset` Chrome 154 → 157，加 Firefox 146；`text-box-trim` Firefox 154 已支援；`font-width` 不是 Baseline（Chrome 不支援）；`at-rule()` 加 Chrome 148；`symbols()` Firefox 35 就支援；`progress()` 的 `no-clamp` Safari 只在預覽版；`corner` 簡寫在 Chromium 158 仍是 experimental；`background-clip: border-area` 加 Safari 18.2；JPEG XL 加 Firefox 158；`ariaNotify()` Safari 27。
- 🟠 → 🟡：Anchor Positioning、`@position-try`、捲動驅動動畫、`margin-trim`、`random()`、`attr()`、`setHTML()`、`text-decoration-inset`、`symbols()`、`border-area`、JPEG XL。
- 過時用詞：`text-decoration-skip-spaces`、`scroll-snap-type: pair` 的「Beta」；`line-clamp` 無前綴版只在預覽版；`<model>` 補 Safari 27。

## 無法用 BCD 核對（維持原本查證過的寫法）

`image-animation`、`<selectlist>`、字型平滑、`@when`、Declarative Partial Updates、`<persistentwidget>`。
