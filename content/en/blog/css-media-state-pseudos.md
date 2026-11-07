---
title: "Building a Custom Player with :playing and :paused: the Icon Follows the State, but Screen Readers Don't Know"
description: "The media state pseudo-classes let CSS style <video> and <audio> by whether they're playing, paused, or muted, Safari and Firefox already support them, and with Chrome 158 (due November 17, 2026) all three major browsers will. After testing in Chromium, I cover a few things that are easy to get wrong (volume 0 doesn't match :muted, and the element becomes :paused when it ends) and the part CSS can't reach: button names and states still have to be synced from media events with JavaScript."
date: 2026-11-07
tags:
  - CSS
  - JavaScript
  - Front-End
  - Accessibility
  - Browser Support
category: accessibility
translationKey: css-media-state-pseudos
draft: false
---

> Up front: this post was researched and drafted with help from AI (Anthropic's Claude), then read and checked by me. The behavior described was tested in Chromium 159, 157, and 153; specs, accessibility guidance, and support are based on the W3C, WHATWG, MDN, and Chromium source linked at the end. If I've gotten something wrong, corrections welcome.

## What it solves

To switch icons by state in a custom player, you used to listen for `play` and `pause` events and toggle a class with JavaScript. Now CSS can select the media element's state directly:

| Pseudo-class | When it matches (HTML Standard) |
|---|---|
| `:playing` | `paused` is false |
| `:paused` | `paused` is true |
| `:seeking` | `seeking` is true (jumping to another time) |
| `:buffering` | Playing, but there isn't enough data yet and it's still downloading |
| `:stalled` | Matches `:buffering`, and no data has arrived for a while |
| `:muted` | The element is muted |
| `:volume-locked` | The browser or user has locked the volume, so the page can't change it |

## Support

| Browser | Version | Source |
|---|---|---|
| Chrome | 158 (due November 17, 2026) | Chromium source: experimental in 154–157, enabled by default from 158 |
| Firefox | 150 | MDN's Firefox 150 release notes |
| Safari | 15.4 | MDN compatibility data |

In my tests, Chromium 157 doesn't support them and 159 does. Chrome 157 shipped on November 3, 2026, so **the current stable Chrome doesn't support them yet**; that comes with 158 (release dates from the browser release data in MDN's compatibility data).

## The basics

```css
/* Show the play icon by default */
.icon-pause { display: none; }

/* While playing: switch to the pause icon */
.player:has(video:playing) .icon-play { display: none; }
.player:has(video:playing) .icon-pause { display: block; }
```

The pseudo-class is on the `<video>`, but what you want to change is the button next to it, so select from the wrapper with `:has()`.

## Live demo

First, check what your browser supports:

::feature-support{features="media-pseudos" notice="Your browser doesn't support the media state pseudo-classes, so the demo below switches its icons with data attributes set by JavaScript instead."}
::

::media-state-demo
::

## Tested: things that are easy to get wrong

Tested in Chromium 159:

| Action | Matching pseudo-classes |
|---|---|
| Loaded, not playing yet | `:paused` |
| Playing | `:playing` |
| Mute while playing | `:playing` `:muted` |
| Unmute, then drag volume to 0 | `:playing` (**no `:muted`**) |
| Played to the end | `:paused` |
| Change `currentTime` to jump elsewhere | Adds `:seeking`, gone once the jump finishes |
| Slow network, data never arrives (while playing) | At 1.5 s: `:playing` `:buffering`; at 5.5 s: `:stalled` is added |

- **Volume 0 doesn't match `:muted`**: in the HTML Standard, muting (`muted`) and volume (`volume`) are separate settings; at volume 0 there's no sound, but `muted` is still false. If you switch the mute icon with `:muted`, dragging the volume to 0 still shows the sound-on icon. To cover both, check `volume === 0` with JavaScript.
- **It becomes `:paused` when it ends**: the HTML Standard says that when playback reaches the end (without `loop`), `paused` is set to true. Selectors doesn't define an `:ended` pseudo-class, so to tell “paused” from “ended” you still need the `ended` property.
- **`:buffering` and `:stalled` also match `:playing`**: the Selectors spec says both still count as “playing”. How long before `:stalled` is up to the browser; the HTML Standard suggests about three seconds.

## CSS only handles the look: accessibility is still up to you

### 1. The button name has to follow the state

For an icon-only button, screen readers announce its `aria-label`. CSS switching the icon doesn't change the `aria-label`: while playing, the button looks like “Pause”, but screen readers still announce “Play”.

The button pattern in the WAI-ARIA Authoring Practices Guide (APG) gives two options:

- **Change the name**: “Play” ⇄ “Pause”, and in that case **don't** add `aria-pressed`.
- **Keep the name fixed and show the state with `aria-pressed`**: for example a “Mute” button with `aria-pressed="true"` while muted, which a screen reader announces as something like “Mute toggle button pressed”. The APG stresses that with `aria-pressed`, the name must not change with the state.

The demo uses the first for the play button and the second for the mute button. This maps to WCAG 4.1.2 Name, Role, Value: the state must be available to assistive technology, and changes must be notified.

### 2. Sync from media events, not just on click

The state isn't always changed by your button: playback pauses on its own at the end, and other code on the page may call `pause()`. If you only update the name on click, it gets stuck on the old state in these cases. In the demo, choose “Updated when the button is pressed”, then press “Pause from elsewhere” or let it play to the end, and you'll see the name go wrong.

```js
const video = document.querySelector("video");
const playBtn = document.querySelector(".play");
const muteBtn = document.querySelector(".mute");

function sync() {
  playBtn.setAttribute("aria-label", video.paused ? "Play" : "Pause");
  muteBtn.setAttribute("aria-pressed", String(video.muted));
}
for (const type of ["play", "pause", "volumechange"]) {
  video.addEventListener(type, sync);
}
```

You need to listen for these events anyway. What the pseudo-classes save you is the class-toggling step, not the JavaScript itself.

### 3. Using CSS `content` as the name?

Text from `::before` `content` counts toward the button's name. In Chromium 159, when `content` changed from “Play” to “Pause” via `:playing`, the button's name changed too. But in Chromium 153, which doesn't support it, the whole rule containing `:playing` was dropped and the name stayed “Play”. I didn't test whether screen readers announce the new name while focus stays on the button. I'd still set the name with an HTML attribute or text.

### 4. Autoplay needs a way to stop it

A pseudo-class only changes the look; it isn't a “mechanism”. Autoplaying content still needs real controls:

- **WCAG 1.4.2 Audio Control**: audio that plays automatically for more than 3 seconds needs a way to pause or stop it, or to control its volume independently.
- **WCAG 2.2.2 Pause, Stop, Hide**: moving content that starts automatically, lasts more than 5 seconds, and is shown alongside other content (such as a background video) needs a way to pause, stop, or hide it (unless the movement is essential).

## Unsupported browsers: don't share a selector list

The Selectors spec says browsers must treat pseudo-classes they don't support as invalid, and a selector list with one invalid selector is **entirely invalid, so the whole rule doesn't apply**:

```css
/* Browsers without :playing drop .is-playing too */
.player:has(video:playing),
.player.is-playing { … }
```

Write them separately, or wrap them in `:is()`. `:is()` takes a “forgiving” selector list and skips the parts it doesn't recognize:

```css
.player:is(:has(video:playing), .is-playing) { … }
```

In my test in Chromium 153, which doesn't support them, the first version dropped the whole rule; the `:is()` version kept `.is-playing`.

To check support in JavaScript:

```js
CSS.supports("selector(:playing)");
```

In CSS, use `@supports selector(:playing) { … }`.

## Takeaway

The media state pseudo-classes mean you no longer toggle classes just for the look, which is much cleaner. But the name and state that screen readers announce live in HTML attributes, which CSS can't change; and getting those attributes right means listening for media events anyway. So in practice: **let pseudo-classes handle the look, and events handle the name and `aria-pressed`**, and use the same events to set a class or data attribute as the fallback for older browsers.

## Further reading

- [Testing HTML-in-Canvas for Accessibility: Screen Readers Can Read It Now, but You Still Need to Handle Four Things](/en/blog/html-in-canvas-a11y/)
- [Modern CSS & HTML Cheat Sheet: 116 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

## Related links

- [W3C — Selectors Level 4: resource state pseudo-classes](https://drafts.csswg.org/selectors-4/#resource-pseudos "opens in new window"){target="_blank"}
- [W3C — Selectors Level 4: forgiving selector list](https://drafts.csswg.org/selectors-4/#forgiving-selector "opens in new window"){target="_blank"}
- [WHATWG HTML — pseudo-classes for media elements](https://html.spec.whatwg.org/multipage/semantics-other.html#pseudo-classes "opens in new window"){target="_blank"}
- [WHATWG HTML — what “muted” means for a media element](https://html.spec.whatwg.org/multipage/media.html#concept-media-muted "opens in new window"){target="_blank"}
- [MDN — Firefox 150 release notes](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/150 "opens in new window"){target="_blank"}
- [MDN browser-compat-data — Chrome release dates](https://github.com/mdn/browser-compat-data/blob/main/browsers/chrome.json "opens in new window"){target="_blank"}
- [MDN browser-compat-data — :playing](https://github.com/mdn/browser-compat-data/blob/main/css/selectors/playing.json "opens in new window"){target="_blank"}
- [Chromium source — runtime_enabled_features.json5 (CSSMediaElementPseudos)](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/platform/runtime_enabled_features.json5 "opens in new window"){target="_blank"}
- [WAI-ARIA Authoring Practices Guide — Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/ "opens in new window"){target="_blank"}
- [Understanding WCAG 2.2 — 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html "opens in new window"){target="_blank"}
- [Understanding WCAG 2.2 — 1.4.2 Audio Control](https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html "opens in new window"){target="_blank"}
- [Understanding WCAG 2.2 — 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html "opens in new window"){target="_blank"}
