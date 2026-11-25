---
title: "Adding Zhuyin to Chinese Text on the Web: Ruby vs. Zhuyin Fonts, and Getting a Show-Zhuyin Toggle Right"
description: "There are two ways to annotate Chinese characters with Zhuyin (Bopomofo) on the web: HTML ruby writes the Zhuyin as text, while a Zhuyin font (bpmfvs) draws it inside the glyphs. This post tests how they differ in writing direction, screen reader output, in-page search and polyphonic characters, and covers how to build a press-to-show toggle and when to use which."
date: 2026-11-26
tags:
  - HTML
  - CSS
  - Front-End
  - Accessibility
  - Browser Support
  - Fonts
translationKey: zhuyin-ruby-font
category: accessibility
draft: false
---

> Up front: this post was researched, organized and tested with AI assistance, then reviewed by me. The behavior described was tested in Chrome 158 on macOS (headless), and I listened with VoiceOver in Chrome myself; specs, official statements and support data come from the W3C documents, MDN, WebKit Bugzilla and bpmfvs project pages linked at the end. I didn't test Firefox or Safari. If I've gotten something wrong, corrections welcome.

## What it solves

I want to build a story page: normally it shows only Chinese characters, and pressing a button makes Zhuyin (Bopomofo, the phonetic symbols children in Taiwan learn to read with) appear to the right of every character, so kids can read on their own. Textbooks and picture books could use the same approach.

There are currently two ways to add Zhuyin to Chinese text on the web:

- **HTML ruby**: the Zhuyin is written in the HTML inside `<rt>`, as text.
- **Zhuyin font**: the Zhuyin is drawn inside the font's glyphs, and the HTML contains only the characters. Polyphonic characters switch readings with an invisible "variation selector" placed after the character.

Both can do "press a button to show Zhuyin", but they behave differently for writing direction, screen readers, search and polyphonic characters.

## 1. HTML ruby: Zhuyin as text

```html
<ruby>兩<rt>ㄌㄧㄤˇ</rt></ruby><ruby>個<rt>˙ㄍㄜ</rt></ruby>
```

The spec's way to put Zhuyin vertically to the right of each character is `ruby-position: inter-character`, but you can't rely on it yet:

- MDN's compatibility data lists Chrome, Edge and Firefox as **not supported**; only Safari, from 18.2, is listed as partial.
- Safari 18.2's release notes said it was supported, but Richard Ishida (r12a) of the W3C reported in WebKit Bugzilla that while Zhuyin is placed to the right of the character, tone marks aren't put in their own column and are positioned wrongly.
- In my test in Chrome 158, `getComputedStyle()` still returns `over`: the browser doesn't recognize the value at all, and the Zhuyin stays above the character.

Here's your browser:

::feature-support{features="ruby-inter-character" notice="Your browser doesn't support ruby-position: inter-character, so ruby Zhuyin can only go above the characters."}
::

Tone marks are another problem: the second, third and fourth tones go to the right of the last Zhuyin symbol, and the neutral tone goes on top. Browser ruby layout follows Japanese kana conventions. In vertical text in Chrome 158, the third-tone [ˇ]{lang="zh-Hant-TW"} is rotated 90 degrees and placed below [ㄤ]{lang="zh-Hant-TW"}, and there's a large gap between the neutral-tone dot and the following symbol.

So getting textbook formatting means fixing it yourself with CSS and JS. There's a complete demo on CodePen (u00hyui's "[使用 ruby、rt 標注音符號]{lang="zh-Hant-TW"}"), which:

- Uses JS to wrap the trailing tone mark in each `<rt>` in `<span class="tone">`, with an extra class for the neutral tone.
- Vertical text: rotates the tone mark back and moves it into place with `transform`.
- Horizontal text with Zhuyin on the right: wraps every character in its own `<ruby>` and sets `<rt>` to `display: inline-block; width: 1em`, squeezing the Zhuyin into a vertical column to the right of the character.

The offsets are tuned for a specific font and size, so a different font means retuning them.

## 2. Zhuyin fonts: Zhuyin inside the glyphs

ButTaiwan's bpmfvs is a specification for Zhuyin fonts. Every character in the font already has its Zhuyin drawn in, and polyphonic characters pick a reading with Unicode IVS (ideographic variation sequences): put a variation selector after the character, and it switches to the glyph for another reading.

```html
<!-- 「行」 followed by U+E01E1 -->
<p style="font-family: 'Bpmf Huninn'">銀行&#xE01E1;</p>
```

I tested several selectors on [行]{lang="zh-Hant-TW"} with Fontsource's Bpmf Huninn (`@fontsource/bpmf-huninn` 5.3.1):

| Markup | Zhuyin shown |
|---|---|
| [行]{lang="zh-Hant-TW"} | [ㄒㄧㄥˊ]{lang="zh-Hant-TW"} (default reading) |
| [行]{lang="zh-Hant-TW"} + U+E01E0 | No Zhuyin |
| [行]{lang="zh-Hant-TW"} + U+E01E1 | [ㄏㄤˊ]{lang="zh-Hant-TW"} |
| [行]{lang="zh-Hant-TW"} + U+E01E2 | [ㄒㄧㄥˋ]{lang="zh-Hant-TW"} |
| [行]{lang="zh-Hant-TW"} + U+E01E3 | [ㄏㄤˋ]{lang="zh-Hant-TW"} |

The selector is itself text, so the reading survives copy and paste. In an ordinary font, the selector is invisible and only the character shows, as Unicode specifies for variation sequences: when unsupported, "the base character is displayed as usual, and the variation selector is invisible". In Chrome 158 with an ordinary font, the same text indeed showed only the characters.

Polyphonic characters need a tool: bpmfvs provides a "reading selection tool" ([讀音選擇工具]{lang="zh-Hant-TW"}). Paste your text in, it pre-selects readings automatically, you correct them by hand, then copy the result out.

Open-source fonts that support bpmfvs include [源泉注音圓體]{lang="zh-Hant-TW"}, [源樣注音明體]{lang="zh-Hant-TW"}, [源流注音明體]{lang="zh-Hant-TW"} and [黑體]{lang="zh-Hant-TW"}, [源雲注音明體]{lang="zh-Hant-TW"}, [源石注音黑體]{lang="zh-Hant-TW"}, plus [字嗨注音標楷]{lang="zh-Hant-TW"}, [宋體]{lang="zh-Hant-TW"} and [黑體]{lang="zh-Hant-TW"}.

## 3. Writing direction and Zhuyin position

| Situation | Zhuyin font | HTML ruby |
|---|---|---|
| Vertical, Zhuyin on the right | Built-in vertical features (`vert`, `vrt2`); in Chrome 158 the Zhuyin is on the right and correctly placed | Zhuyin goes on the right, but tone marks are rotated 90 degrees and misplaced; needs JS fixes |
| Horizontal, Zhuyin on the right (textbook style) | What the font is designed for | Wrap each character in `<ruby>`, force `<rt>` vertical, position tone marks by hand |
| Horizontal, Zhuyin above | Not possible | The browser default |

## 4. Live demo

Press "Show Zhuyin" and both approaches switch together. Ruby shows or hides `<rt>` with CSS; the Zhuyin font only swaps `font-family`, and the font isn't loaded until you first press the button.

::zhuyin-toggle-demo
::

The core code:

```html
<button type="button" aria-pressed="false">Show Zhuyin</button>
<p class="story ruby-story" lang="zh-Hant-TW">
  <ruby>銀<rt aria-hidden="true">ㄧㄣˊ</rt></ruby><ruby>行<rt aria-hidden="true">ㄏㄤˊ</rt></ruby>
</p>
<p class="story font-story" lang="zh-Hant-TW">銀行&#xE01E1;</p>
```

```css
/* Ruby: display: none when off */
.ruby-story rt { display: none; }
.zhuyin-on .ruby-story rt { display: revert; }

/* Zhuyin font: only swap font-family */
.zhuyin-on .font-story { font-family: "Bpmf Huninn", sans-serif; }
```

```js
let fontState = "idle";
btn.addEventListener("click", async () => {
  const on = btn.getAttribute("aria-pressed") !== "true";
  btn.setAttribute("aria-pressed", String(on));
  demo.classList.toggle("zhuyin-on", on);
  // Load the Zhuyin font only the first time it's turned on
  if (on && fontState === "idle") {
    fontState = "loading";
    const face = new FontFace("Bpmf Huninn", 'url(/fonts/bpmf-huninn.woff2) format("woff2")');
    document.fonts.add(await face.load());
    fontState = "loaded";
  }
});
```

The toggle uses `aria-pressed` for its on/off state, and its text stays the same. The demo's font is a subset I cut from the Fontsource version with fontTools, containing only the characters it uses, about 6 KB, hosted on my own site.

## 5. Testing: what screen readers get

The W3C's requirements document on reading ruby aloud notes that many implementations only read both the base text and the annotation: "Many implementations (screen readers, in particular) support only this strategy." So I looked at Chrome 158's accessibility tree.

It wasn't what I expected: Chrome doesn't put the Zhuyin between the characters. It removes `<rt>` from the accessibility tree and exposes it as the **description** of the whole `<ruby>` instead.

| Markup | Chrome 158 accessibility tree |
|---|---|
| One `<ruby>` wrapping the whole phrase, plain `<rt>` | Text "[一]{lang="zh-Hant-TW"}", "[行]{lang="zh-Hant-TW"}", "[白]{lang="zh-Hant-TW"}"; the `<ruby>` description is "[ㄧˋ]{lang="zh-Hant-TW"}", **only the first character's Zhuyin** |
| One `<ruby>` per character, plain `<rt>` | Each `<ruby>` has its own description: "[ㄧˋ]{lang="zh-Hant-TW"}", "[ㄏㄤˊ]{lang="zh-Hant-TW"}", "[ㄅㄞˊ]{lang="zh-Hant-TW"}" |
| `<rt aria-hidden="true">` | Characters only; empty description |
| `<rt>` hidden with `display: none` | Characters only; empty description |
| Zhuyin font (with selector) | "[一行白鷺]{lang="zh-Hant-TW"}"; the selector is in the text but invisible |

- Ruby Zhuyin reaches screen readers as a description. With one `<ruby>` around a whole phrase, only the first annotation survives; with one `<ruby>` per character, every character keeps its Zhuyin.
- A Zhuyin font's Zhuyin is part of the glyph, not text, so screen readers never get it. Listening with VoiceOver in Chrome, I heard only the characters, no Zhuyin.
- Even though the selector is in the text, VoiceOver didn't read anything odd.

## 6. Testing: in-page search

I searched for "[一行白]{lang="zh-Hant-TW"}" with Chrome 158's `window.find()`. `window.find()` isn't exactly the same as a user pressing Ctrl+F, so treat this as a reference only.

| Markup | Is "[一行白]{lang="zh-Hant-TW"}" found? |
|---|---|
| Zhuyin font (selector after [行]{lang="zh-Hant-TW"}) | Yes |
| Ruby, Zhuyin showing | No |
| Ruby, `<rt>` hidden with `display: none` | Yes |

While ruby Zhuyin is showing, the `<rt>` text sits between the characters, so a continuous phrase can't be found.

## 7. Web font gotchas

- **File size**: Fontsource's Bpmf Huninn Traditional Chinese woff2 is about 1.4 MB. The demo uses a subset of only the characters it needs, loaded on button press.
- **The default `index.css` splits the font into many pieces**: version 5.3.1's `index.css` has 106 `@font-face` rules, each limited by `unicode-range`, and none of the ranges include the selector code points (from U+E0100). In Chrome 158, with the default `index.css`, [行]{lang="zh-Hant-TW"} + U+E01E1 still correctly showed [ㄏㄤˊ]{lang="zh-Hant-TW"}. I didn't test Firefox or Safari; to be safe, use `chinese-traditional.css`, which is one file.
- **The Fontsource build keeps only IVS**: checking the 5.3.1 Traditional Chinese woff2 with fontTools, `cmap` has a format 14 subtable (used for IVS, with 6 selectors), but GSUB only has `vert` and `vrt2`, without the stylistic sets (ss01 onward) from the bpmfvs spec. So on the web you can only pick readings with IVS, not `font-feature-settings`.
- **When subsetting yourself**: make sure `cmap` format 14 survives, or every polyphonic character falls back to its default reading. When I cut the demo subset with `pyftsubset`, including the selector code points (U+E01E0–E01E5) in `--unicodes` kept format 14.

## 8. Polyphonic characters

Both approaches need you to decide each polyphonic character's reading first:

- **Zhuyin font**: use the bpmfvs reading selection tool, which pre-selects readings for you to confirm.
- **Ruby**: generate them in bulk with g2pW, a model published by researchers at E.SUN Financial Holding and National Kaohsiung Normal University (INTERSPEECH 2022). It decides readings from the whole sentence and outputs Zhuyin, e.g. [行]{lang="zh-Hant-TW"} in [銀行]{lang="zh-Hant-TW"} is `ㄏㄤ2` and in [行動]{lang="zh-Hant-TW"} is `ㄒㄧㄥ2`. Tones are digits, so you convert them to [ˊ]{lang="zh-Hant-TW"}, [ˇ]{lang="zh-Hant-TW"}, [ˋ]{lang="zh-Hant-TW"} and [˙]{lang="zh-Hant-TW"} yourself.
- g2pW's output can also be turned into IVS selectors for a Zhuyin font (you build the reading-to-selector mapping yourself).

## 9. Accessibility essentials

### 1. With ruby, add `aria-hidden="true"` to `<rt>`

While Zhuyin is showing, Chrome passes it to screen readers as a description. For screen reader users the characters already carry the meaning, and Zhuyin is a pronunciation aid; hearing "[ㄏ]{lang="zh-Hant-TW"}, [ㄤ]{lang="zh-Hant-TW"}, second tone" doesn't help much. The W3C requirements document on reading ruby aloud also notes that Chinese Zhuyin (Taiwan) and pinyin (mainland China) are usually pronunciation aids, and reading only the base text is usually enough.

- Add it only to `<rt>`, not `<ruby>`, or you'll hide the characters too.
- If you use `<rp>` parentheses, add it to those as well.
- When Zhuyin is off, `display: none` already removes it from the accessibility tree, and MDN says not to add `aria-hidden` in that case.

### 2. Zhuyin fonts need nothing extra

The Zhuyin isn't text, so screen readers only read the characters.

### 3. Screen readers won't use the reading you picked

Screen readers decide pronunciation with their own speech engines and most likely ignore the reading selected in the font (I haven't tested this).

### 4. The toggle button

- Use `<button>` with `aria-pressed`, and don't change the button text with the state; show the on state visually some other way (the demo uses a border and a check mark).
- Remember the user's choice so they don't have to press it again next time.
- When Zhuyin is on, increase the font size and line height too, so the Zhuyin is legible.

### 5. Page language

Use `<html lang="zh-Hant-TW">` so screen readers use a Chinese voice. For Chinese text on an English page, put `lang="zh-Hant-TW"` on that passage, as the demo does.

## When to use which

| Need | Recommendation | Why |
|---|---|---|
| Textbook-quality layout | Zhuyin font | Tone placement is designed into the font |
| Horizontal text, Zhuyin on the right | Zhuyin font | Ruby needs lots of manual positioning, and browsers differ |
| Zhuyin only on new or selected characters | Ruby | A Zhuyin font puts Zhuyin on every character |
| Separately styled Zhuyin (color, size, highlighting, tap to hear) | Ruby | Zhuyin is a DOM element you can control |
| Also annotating Taiwanese, Hakka or pinyin | Ruby | Fonts would need a separate project |
| A specific brand font | Ruby | Zhuyin fonts only come in bpmfvs-supporting typefaces |
| Page load speed matters | Ruby | A full Traditional Chinese Zhuyin font is about 1.4 MB (woff2), though fixed content can be subset |
| Lots of content, or editors working in a CMS | Zhuyin font | The content is plain text; editors don't write markup |
| Content gets copied into Word or slides | Zhuyin font | The selectors are text and survive copying |
| In-page search must work | Zhuyin font | With ruby showing, continuous phrases can't be found |

## Conclusion

For "press a button and Zhuyin appears to the right of each character", a Zhuyin font is the easiest: the toggle only swaps `font-family`, screen readers read only the characters, and search still works, at the cost of large font files and limited typeface choice. Use ruby when you need per-character control over the Zhuyin or your own brand font, and remember `aria-hidden="true"` on `<rt>`.

Both approaches still have untested parts: rendering in Firefox and Safari, what NVDA reads, and the results of copy and paste.

## Further reading

- [Spaces Between Chinese and English? Let text-autospace Add Them for You](/en/blog/text-autospace/)
- [Custom List Markers with symbols(): What Screen Readers Read Today, and Later, May Not Be What You Meant](/en/blog/css-symbols/)
- [One Share Button Instead of a Row of Social Icons: The Web Share API and Accessibility](/en/blog/web-share-a11y/)

## Related links

- [ButTaiwan — bpmfvs Bopomofo IVS font specification](https://github.com/ButTaiwan/bpmfvs "Open new window"){target="_blank"}
- [Fontsource — Bpmf Huninn](https://fontsource.org/fonts/bpmf-huninn/about "Open new window"){target="_blank"}
- CodePen — [使用 ruby、rt 標注音符號](https://codepen.io/u00hyui/pen/ZEXvrEZ "Open new window"){target="_blank" lang="zh-Hant-TW"} (u00hyui)
- [W3C — Bopomofo on the Web (r12a)](https://r12a.github.io/scripts/bopomofo/ontheweb "Open new window"){target="_blank"}
- [W3C — Ruby text-to-speech requirements](https://w3c.github.io/ruby-tts-req/ "Open new window"){target="_blank"}
- [MDN browser-compat-data — ruby-position](https://github.com/mdn/browser-compat-data/blob/main/css/properties/ruby-position.json "Open new window"){target="_blank"}
- [WebKit Bugzilla — ruby-position: inter-character doesn't support Bopomofo correctly](https://bugs.webkit.org/show_bug.cgi?id=285694 "Open new window"){target="_blank"}
- [Unicode — Variation Sequences FAQ (unsupported sequences show the base character)](https://unicode.org/faq/vs.html "Open new window"){target="_blank"}
- [MDN — aria-hidden](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-hidden "Open new window"){target="_blank"}
- [g2pW — Mandarin polyphone disambiguation model](https://github.com/GitYCC/g2pW "Open new window"){target="_blank"}
- [justfont blog — free Zhuyin fonts and the reading selection tool (Chinese)](https://blog.justfont.com/?p=17053 "Open new window"){target="_blank"}
