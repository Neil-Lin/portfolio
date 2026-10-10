---
title: "Spaces Between Chinese and English? Let text-autospace Add Them for You"
description: "Whether to put spaces between Chinese characters and English words or numbers has been argued about for years. text-autospace lets the browser add a little space automatically, so you don't have to type it. With side-by-side demos, I tested how wide the gap is, whether it stacks with typed spaces, whether copied text changes, and what to watch for in code blocks. Then I turned it on for this site."
date: 2026-10-09
tags:
  - CSS
  - Front-End
  - Accessibility
  - Browser Support
translationKey: text-autospace
category: frontend
draft: false
---

> Up front: I tested the behavior in this post in Chromium. Details may differ in other browsers. If I've gotten something wrong, corrections welcome.

### Intro

Anyone writing technical posts in Chinese runs into this: "用Chrome測試" or "用 Chrome 測試"? That is, do you put a space between Chinese characters and an English word or a number?

People have argued about it for years. With spaces it's easier to read, since English words don't run into the Chinese text. But typing them by hand is easy to forget, and the spaces travel with the text wherever you copy it.

My habit is to type them, though I inevitably miss some. `text-autospace`, from my [CSS & HTML cheat sheet](/en/blog/css-techniques-checklist), handles exactly this: the browser adds a little space between Chinese and English letters or numbers automatically.

After testing it, I turned it on for this whole site too.

First, here's what your browser supports:

::feature-support{features="text-autospace" notice="Your browser doesn't support text-autospace, so the left and right sides of the demo below will look the same."}
::

### 1. See the effect

Below is the same Chinese sentence in four combinations: off on the left, on on the right; no typed spaces on the top row, spaces typed by hand on the bottom row. Under each box is the measured width of that line:

::text-autospace-compare
::

A few things stand out:

- **Top right**: no typed spaces, yet there's a little gap between the Chinese and the English and numbers, which reads much better than the top left.
- **Both bottom boxes are the same width**: where a space was already typed, the browser doesn't add another, so you don't get double-width gaps.
- **The automatic gap is narrower than a typed space**: top right is narrower than bottom right, so it looks a bit tighter.

### 2. The syntax

One line:

```css
html {
  text-autospace: normal;
}
```

`text-autospace` is inherited, so putting it on `html` covers the whole site. To switch it off for a section, use `no-autospace`.

The spec has finer-grained values too, such as `ideograph-alpha` (only between Chinese and letters) and `ideograph-numeric` (only between Chinese and numbers). In my tests, though, Chromium (both 141 and 153) only accepts `normal` and `no-autospace`; everything else is treated as invalid. Safari 27 adds an `insert` value, which I couldn't test.

### 3. Tested: how wide, and where?

**The gap is 1/8 of the font size.** I tested at 16px, 24px and 32px, and each gap was 2px, 3px and 4px, exactly 1/8 of the font size each time. A typed space in the font I tested is about 0.28 of the font size, so the automatic gap is a bit narrower than a typed one.

**Where it's added and where it isn't**, from my tests:

| Case | Example | Added? |
|---|---|---|
| Chinese next to English | 用Chrome | Yes |
| Chinese next to a number | 共8個 | Yes |
| Space already typed | 用 Chrome | Not added again |
| Across HTML tags | Around `<strong>`, links and `<code>` | Yes |
| Next to Chinese punctuation | Chrome，瀏覽 | No |
| Full-width letters and numbers | 共８個 | No |
| Symbols | 用#標籤 | No |
| At the start of a wrapped line | An English word that wraps to a new line | No (no extra gap at the line start) |

Working across tags is especially handy: posts often have a `<code>` snippet or a link right after Chinese text, and those get the gap too.

### 4. Copying and searching: the text itself doesn't change

This is the biggest difference from typed spaces: **it only affects rendering, not the text content.**

In my tests, selecting "用Chrome瀏覽" gives the string "用Chrome瀏覽", and `innerText` is the same, with no extra spaces. There's a hint under the demo; try copying it into a text editor yourself.

That means:

- **Copied text has no extra spaces**: pasted elsewhere, the text is exactly what was written.
- **Screen readers read the same content**: the gap is purely presentational and doesn't change the text a screen reader gets.
- **Search still matches the original text**: Ctrl+F compares the text content, not the visual gaps.

### 5. Things to watch for

**1. Turn it off in code blocks**

In my tests, the gap is added in monospace fonts too. If a code block has a Chinese comment like `// 註解abc`, the alignment shifts. So turn it off for code blocks:

```css
pre {
  text-autospace: no-autospace;
}
```

**2. Don't turn it off on inline `<code>`**

My first thought was "just switch it off for all code", but after setting `no-autospace` on `<code>`, **the gap between the `<code>` and the Chinese around it disappeared too**. The gap around inline code is exactly where you want it most, so only switch it off on `pre`.

**3. The automatic gap is narrower**

As mentioned, the automatic gap is 1/8 of the font size, narrower than a typed space. If your site mixes posts with and without typed spaces, a close look shows two different widths. I find that acceptable; it's far more readable than text running together.

### 6. Applying it to this site

This site uses the two snippets above: on for `html`, off for `pre`.

Most of my older posts already have typed spaces, and my tests show they don't get doubled, so there's no need to go back and edit them. I'll keep typing spaces in new posts, because posts also get copied to social media, read through RSS, or opened in browsers without support, and those only see the text itself. `text-autospace` is the safety net for the ones I miss.

Browsers without support simply stay as they are, without the gap, so no fallback is needed.

### Conclusion

In a few lines:

- `text-autospace: normal` has the browser add a gap of 1/8 of the font size between Chinese and English letters or numbers.
- It doesn't add a gap where a space is already typed, and it works across HTML tags.
- It only affects rendering; copied text, search and screen readers all get the original text.
- Switch it off for code blocks (`pre`), but not for inline `<code>`.
- For now, Chromium only supports `normal` and `no-autospace`.

One line of CSS makes mixed Chinese and English text easier to read across the whole site. It's the best return on effort in this whole series.

If you write in Chinese, do you put spaces between Chinese and English? I'd love to hear about it.

### Related reading

- [Tooltip Getting Cut Off? Let the Browser Find a Spot with @position-try](/en/blog/position-try/)
- [Why Can't Ctrl+F Find Collapsed Content? A Look at hidden="until-found"](/en/blog/hidden-until-found/)
- [Modern CSS & HTML Cheat Sheet: 102 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

### Related links

- [MDN — text-autospace](https://developer.mozilla.org/en-US/docs/Web/CSS/text-autospace "Open new window"){target="_blank"}
- [CSS Text Module Level 4 — text-autospace](https://drafts.csswg.org/css-text-4/#text-autospace-property "Open new window"){target="_blank"}
- [W3C — Requirements for Chinese Text Layout (clreq)](https://www.w3.org/TR/clreq/ "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
