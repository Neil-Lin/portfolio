---
title: "Custom List Markers with symbols(): What Screen Readers Read Today, and Later, May Not Be What You Meant"
description: "Chrome 155 supports symbols() and Firefox has for years, so one line of CSS swaps your list markers. But reading Chromium's accessibility tree, I found that screen readers get the raw symbol today, while the spec says cyclic markers should be read as bullets and markers with no type as numbers, so a ✓ meaning “done” loses its meaning. This post covers the syntax, test results, and when to put the meaning in the text."
date: 2026-11-13
tags:
  - CSS
  - Front-End
  - Accessibility
  - Browser Support
category: accessibility
translationKey: css-symbols
draft: true
---

> Up front: this post was researched and drafted with help from AI (Anthropic's Claude), then read and checked by me. The behavior described was tested in Chromium 157, 159, and 153; specs, accessibility guidance, and support are based on the W3C specs and WCAG documents, MDN, and Chromium source linked at the end. If I've gotten something wrong, corrections welcome.

## What it solves

To use a single symbol, a string like `list-style-type: "◆ "` already works. But to alternate between several symbols, you used to define a style with `@counter-style` and then reference its name in `list-style`. `symbols()` lets you write it right in the property value:

```css
ul {
  list-style: symbols(cyclic "◆" "◇");
}
```

The spec describes `symbols()` as defining an “anonymous” counter style, for a style used only once where a full `@counter-style` rule would be overkill.

## The basics

```css
symbols( type? symbol symbol … )
```

There are five types: `cyclic`, `numeric`, `alphabetic`, `symbolic`, and `fixed`.

- **`cyclic`**: symbols take turns (◆ ◇ ◆ ◇ …); the usual choice for bullets.
- **With no type, the default is `symbolic`**, not `cyclic`. Once `symbolic` runs out of symbols it repeats them: the spec's example goes `*`, `†`, `‡`, `§`, then `**`, `††`.
- `numeric` and `alphabetic` need at least two symbols, or the whole function is invalid.

`symbols()` only offers part of what `@counter-style` does; for example, **it can't set `speak-as`** (how screen readers should read it), which the spec fixes at `auto`.

## Support

| Browser | `symbols()` | Source |
|---|---|---|
| Chrome | 155 | Chromium source: experimental in 153 and 154, enabled by default from 155; MDN compatibility data also says 155 |
| Firefox | 35 | MDN compatibility data |
| Safari | Preview only | MDN compatibility data |

**Unsupported browsers ignore the whole declaration**: in Chromium 153, `list-style: symbols(…)` was dropped and the list fell back to the default bullet.

## Live demo

First, check what your browser supports:

::feature-support{features="symbols" notice="Your browser doesn't support symbols(), so the lists in the demo below fall back to the default bullet (except the @counter-style one)."}
::

::symbols-demo
::

## Tested: what screen readers get

List markers go into the accessibility tree and on to screen readers. In Chromium 157 and 159, I read the text of the list markers in the accessibility tree:

| Style | Marker in the accessibility tree today |
|---|---|
| `list-style: disc` (default) | `•` |
| `symbols(cyclic "◆" "◇")` | `◆` |
| `symbols("◆")` (no type) | `◆` |
| `symbols(cyclic "✓")` | `✓` |
| `symbols(numeric "〇" "一" "二" "三")` | `一` (`numeric` starts at 0, so the first item is 1) |
| `list-style: none` | No marker, but the list semantics remain |

In other words, **Chromium currently passes the raw symbol to screen readers**, and what gets spoken depends on the screen reader's own symbol dictionary.

## The spec says something different

The spec defines `speak-as: auto` like this:

- For a `cyclic` system, it's the same as `bullets`: a phrase or audio cue for an unordered list item.
- For an `alphabetic` system, it spells the marker out.
- Otherwise (including `symbolic`, the default when no type is given, and `numeric`), it's the same as `numbers`: **the item's number is read**.

`speak-as` for `symbols()` is fixed at `auto`, so per the spec:

| Style | How the spec says to read it |
|---|---|
| `symbols(cyclic "◆" "◇")` | As a bullet |
| `symbols("◆")` (no type) | **As numbers: 1, 2, 3** |
| `symbols(cyclic "✓")` | As a bullet, **so the meaning of ✓ is lost** |

**Chromium doesn't follow the spec yet.** In its source, the code that would make the accessibility tree use `speak-as` sits behind a flag (`CSSAtRuleCounterStyleSpeakAsDescriptor`) whose status is `test`, so it's off in stable. Launching Chromium 159 with that flag, the results matched the table above: `cyclic` became `•`, and no type became `1`.

MDN's compatibility data says Chrome has supported `speak-as` since 91. In my tests, Chromium does parse the descriptor (`speakAs` on `CSSCounterStyleRule` returns the value), but the accessibility tree doesn't use it. MDN's `speak-as` page also warns that assistive technology support for it is very limited, and not to rely on it to convey information critical to understanding the page.

## Accessibility notes

### 1. Don't put meaning in list markers

Using ✓/✗ for “done/not done”:

- Today: the screen reader gets a raw `✓`, and whether it says “check mark” depends on the screen reader.
- Per the spec: `cyclic` is read as a plain bullet, and the meaning disappears.

Neither is reliable. **Put the status in the text**, such as “Apples (bought)”. This maps to WCAG 1.3.1 Info and Relationships: information conveyed through presentation must also be programmatically determinable. Checking “Put ‘bought’ in the text” in the demo shows this approach.

### 2. For decorative symbols, write `cyclic`

If you just want a nicer symbol, remember `cyclic`. With no type you get `symbolic`, which per the spec is read as numbers, so an unordered list sounds like an ordered one.

### 3. To control pronunciation, `speak-as` in `@counter-style` is where the spec points, but you can't rely on it yet

```css
@counter-style diamond {
  system: cyclic;
  symbols: "◆";
  suffix: " ";
  speak-as: bullets;
}
ul {
  list-style: diamond;
}
```

`symbols()` can't take `speak-as`, so to set pronunciation you have to use `@counter-style`. But Chrome doesn't apply it to the accessibility tree yet, and Safari doesn't support `speak-as` (MDN compatibility data).

### 4. Unsupported browsers fall back to bullets

Browsers without `symbols()` ignore the whole declaration and the list falls back to its default style. Nothing breaks, and there's nothing extra to handle.

## Takeaway

`symbols()` makes swapping list markers a one-liner. But how those markers reach screen readers is still changing: the raw symbol today, a bullet or number per the spec. So **use symbols only for decoration**, with `cyclic`; anything that carries meaning belongs in the text.

## Further reading

- [Building a Custom Player with :playing and :paused: the Icon Follows the State, but Screen Readers Don't Know](/en/blog/css-media-state-pseudos/)
- [Modern CSS & HTML Cheat Sheet: 116 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

## Related links

- [W3C — CSS Counter Styles Level 3: symbols()](https://drafts.csswg.org/css-counter-styles-3/#symbols-function "opens in new window"){target="_blank"}
- [W3C — CSS Counter Styles Level 3: speak-as](https://drafts.csswg.org/css-counter-styles-3/#counter-style-speak-as "opens in new window"){target="_blank"}
- [MDN — symbols()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/symbols "opens in new window"){target="_blank"}
- [MDN — speak-as for @counter-style](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@counter-style/speak-as "opens in new window"){target="_blank"}
- [MDN browser-compat-data — list-style-type](https://github.com/mdn/browser-compat-data/blob/main/css/properties/list-style-type.json "opens in new window"){target="_blank"}
- [Chromium source — runtime_enabled_features.json5 (CSSCounterStyleSymbolsFunction, CSSAtRuleCounterStyleSpeakAsDescriptor)](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/platform/runtime_enabled_features.json5 "opens in new window"){target="_blank"}
- [Chromium source — ax_node_object.cc (list markers and speak-as)](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/modules/accessibility/ax_node_object.cc "opens in new window"){target="_blank"}
- [Understanding WCAG 2.2 — 1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html "opens in new window"){target="_blank"}
