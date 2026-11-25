---
title: "One Share Button Instead of a Row of Social Icons: The Web Share API and Accessibility"
description: "navigator.share() opens the operating system's share sheet, which follows the user's screen reader, text size and contrast settings, and is friendlier than a homemade row of social icons. But not every environment supports it, and the button itself and what happens after a click are still the developer's job. This post covers support, the errors I hit while testing, and how I added a share button to every page of this site."
date: 2026-11-25
tags:
  - JavaScript
  - Front-End
  - Accessibility
  - Browser Support
  - A11Y
translationKey: web-share
category: accessibility
draft: true
---

> Up front: these notes were researched and tested with AI assistance, then rewritten by me. I tested the API in Chrome 158 on macOS (with real clicks simulated through DevTools) and in Electron (Chromium 156). I read the real share sheet on macOS through the system accessibility API, but **I haven't actually listened to it with VoiceOver or tested on phones yet**; I'll add that once I have. If I've gotten something wrong, corrections welcome.

## Intro

Lots of sites put a row of social icons under each post: Facebook, X, LINE, email, copy link… Each one is an icon-only button that needs its own name, and some load third-party scripts or iframes. For screen reader users that's a row of "button, button, button" to listen through one by one; for everyone, the app they actually use often isn't in it.

The Web Share API takes a different approach: the page has **one** button, and pressing it opens the operating system's own share sheet, listing the apps installed on that phone or computer.

This time I didn't build a separate demo. Instead I added a share button to **every page** of this site, just above the footer. When you reach the end, you can try it.

First, here's what your browser supports:

::feature-support{features="web-share" notice="Your browser doesn't support the Web Share API, so the button at the bottom of this page will say \"Copy link to this page\". That's exactly the fallback this post is about."}
::

## 1. The basics

```js
button.addEventListener("click", async () => {
  try {
    await navigator.share({
      title: document.title,
      url: "https://example.com/article/",
    });
  } catch (err) {
    // The user cancelled, or sharing failed
  }
});
```

The fields you can share are `title`, `text`, `url` and `files`, and you need at least one. There's also `navigator.canShare(data)` to check up front whether some data can be shared.

There are three requirements:

| Requirement | Details |
|---|---|
| Secure context | HTTPS (or localhost) only |
| User activation | Must be called from a user action such as a click |
| iframes | Cross-origin iframes need `allow="web-share"` |

And two things the page **can't** do, by design:

- The page can't tell which apps are available, or which one the user picked (to prevent fingerprinting).
- The promise resolving only means "the data was handed to the OS", not that the user actually sent anything. According to MDN, on Windows it resolves **as soon as** the share window opens.

## 2. Support: patchier than you'd think

Web Share became a W3C Recommendation in 2023 and mobile browsers have had it for years, but once you lay it out, the gaps are in very common environments:

| Environment | Support |
|---|---|
| Safari (macOS / iOS) | 12.1 / 12.2+ |
| Chrome Android | 61+ |
| Chrome desktop | Windows, ChromeOS 89+; macOS 128+ |
| **Chrome Linux** | **No** |
| **Android WebView** | **No** |
| **Firefox desktop** | **No** (behind an experimental flag only) |
| Firefox Android | 79+ |
| **Electron** | **No** `navigator.share` (I tested Chromium 156) |

Chrome on Linux and WebView aren't "not done yet"; they're deliberately off. The Chromium source only enables the feature on Android, ChromeOS, Windows and Mac, with a comment saying it stays off Linux and WebView.

The WebView gap matters a lot in Taiwan: on Android, opening a link from LINE or Facebook uses the app's in-app WebView, which **most likely doesn't have this API** (inferred from the compatibility data and source; I haven't tested LINE yet).

So a fallback isn't optional. It's required.

## 3. Testing: how errors come back

I simulated real clicks through DevTools in Chrome 158 and tried a range of cases:

| Case | Result |
|---|---|
| Calling `share()` without user activation | Always `NotAllowedError`, even when the data itself is invalid |
| Calling `share()` twice in one click | The second gets `NotAllowedError` |
| Calling again while the share sheet is still open | `InvalidStateError` |
| User closes the share sheet | `AbortError` |
| `canShare({ url: "mailto:…" })` | `false`; only http and https are accepted |
| `canShare()` on an `.exe` file | `true`, but the actual `share()` is rejected with `NotAllowedError` |

Three things to remember when writing the code:

1. **`canShare()` returning `true` doesn't guarantee `share()` will succeed.** Always handle failure after `share()`.
2. **One click allows one share attempt.** The first call uses up the user activation, so when `share()` fails, you can't "try again" in the same click.
3. **`AbortError` isn't an error.** The user just changed their mind.

## 4. Accessibility: what you gain

- **Native UI**: the share sheet comes from the operating system, so VoiceOver, TalkBack, Switch Control, system text size and high contrast all follow the user's own settings. The spec's accessibility section is addressed to browsers and OS vendors, asking them to get this UI right.
- **One button instead of a row of icons**: no row of icon buttons to listen through, often with poor names; the sheet lists apps the user already knows, which is easier cognitively too.
- **No third-party scripts**: better for privacy and performance, and no pile of iframes that are hard to make accessible.

## 5. Accessibility: what the developer still owns

The OS takes care of the sheet, but the button and what happens after a click are still the page's job:

| What to do | Why | WCAG |
|---|---|---|
| Use a real `<button>` with visible text | The iOS and Android share icons look different, so an icon alone isn't familiar to everyone | 1.1.1, 2.5.3, 4.1.2 |
| Never show a button that does nothing | Unsupported environments need a fallback (copy link), not a button that silently fails | — |
| Report the result | Copying a link changes nothing on screen, so screen readers need to hear "Link copied" too | 4.1.3 |
| Cancelling isn't an error | Don't show an error message on `AbortError` | — |
| Don't say "Shared successfully" | The promise resolving doesn't mean the user actually sent anything | — |
| Give a next step when it fails | You can't share again in the same click, so tell the user what they can do instead | 3.3.1 |
| Share the canonical URL | Don't pass along the tracking or session parameters in `location.href` | — |

## 6. How I did it on this site

The button lives in the layout, in the same place with the same name on every page (WCAG 3.2.3 Consistent Navigation, 3.2.4 Consistent Identification). Error pages don't get one.

### Falling back to "Copy link"

The pages are prerendered static HTML, so at build time there's no way to know whether a reader's browser supports Web Share. The prerendered page only has an **empty placeholder of the same height**, and the decision happens after load:

- Web Share supported: show "Share this page".
- Not supported: show "Copy link to this page".

That way there's no jump from a share button to a copy button, and no button that does nothing when JavaScript is off.

### The key code

This is a simplified version; the real component is Vue (`ThePageShare.vue`):

```js
let mode = typeof navigator.share === "function"
  && navigator.canShare?.({ url: shareUrl() }) !== false
  ? "share" : "copy";

async function share() {
  try {
    await navigator.share({ title: document.title, url: shareUrl() });
    // No message on success: resolving only means the OS has the data, not that the user sent it
  } catch (err) {
    // Cancelling is a normal action
    if (err instanceof DOMException && err.name === "AbortError") return;
    // You can't share again in the same click, so switch to copy link and let the user press again
    mode = "copy";
    report("Couldn't open the share menu. Use copy link instead.");
  } finally {
    // If focus fell to <body> when the sheet closed, move it back to the button
    if (document.activeElement === document.body) button.focus();
  }
}

async function copy() {
  const url = shareUrl();
  try {
    await navigator.clipboard.writeText(url);
    report("Link copied");
  } catch {
    // Even the clipboard is unavailable: show the URL so the user can copy it themselves
    report("Couldn't copy automatically. Copy the URL yourself: ", url);
  }
}
```

`report()` does two things: shows the text below the button, and announces it with the `announce()` helper from my [ariaNotify() post](/en/blog/aria-notify/). The on-screen text is **not** a live region, otherwise screen readers would read it twice.

### Which URL gets shared

- Most pages: the canonical URL, from the same source as `<link rel="canonical">`, with parameters like `utm_source` removed.
- The blog list: search, category and page number are in the URL precisely so they can be shared, so `q`, `category` and `page` are kept and everything else is dropped.

### What I tested

| Case | Result |
|---|---|
| Article URL with `?utm_source=x` | The shared URL has no utm |
| Blog list with `?category=frontend&page=2&utm_source=x` | Category and page kept, utm dropped |
| User cancels | No message, focus stays on the button |
| Sharing fails | The button becomes "Copy link to this page" with an explanation; pressing again copies successfully |
| No Web Share and clipboard blocked (Electron) | Shows the URL for the user to copy, focus stays on the button |
| 320px-wide screen | Long URLs wrap, no horizontal scrolling |

## 7. Testing the share sheet: macOS Chrome

What VoiceOver speaks comes from the operating system's accessibility API (on macOS, the AX API). So I opened a real Chrome 158 on macOS, pressed the share button to bring up the system share sheet, and read the AX API directly to see what's in the sheet and where focus is. That isn't quite the same as listening to VoiceOver, but the role, name and focus information screen readers rely on is all there.

### Opening the sheet

- The button on the page: role "button", name "Share this page".
- Either a mouse click, or tabbing to the button and pressing Enter, opens the sheet.
- The sheet is a popover attached to the Chrome window, and **focus moves into it automatically**, landing on the first item.
- On the page side, the button gets `focusout` and the window gets `blur`, but `document.activeElement` is still the button.

### What's in the sheet

In order:

1. An icon named "safari" (even though it was shared from Chrome)
2. The page title text, i.e. the `title` passed to `navigator.share()`
3. A recent contact suggestion
4. Add to Reading List, AirDrop, Mail, Messages, Notes, Freeform, Journal, Reminders, Copy, Edit Extensions…

Every item is a named button. That's the payoff of handing this to the OS: I didn't write a line of code, yet every button has a name, including "Copy".

There are two small issues, though: the sheet itself and its outer group **have no name**, so a screen reader may not say "Share" first and just read the first item; and the icon's name is wrong. How much these matter needs a real listen with VoiceOver, and both are up to the browser and OS. The page can't fix them.

### Keyboard

| Key | Result |
|---|---|
| Tab / Shift+Tab | Move forward and back between items |
| ↓ | Move to the item in the next row |
| → | No movement |
| Esc | Close the sheet |

### After closing

- After closing with Esc, **system focus returns to the "Share this page" button**, `share()` gets `AbortError: Share canceled`, and the page shows no message, as expected.
- After picking an item in the sheet, `share()` resolved only then (about 10 seconds after opening, i.e. when the item was chosen), not as soon as the sheet opened. MDN says Windows resolves as soon as it opens, so the timing differs by platform, and the "don't say shared successfully" rule still holds.
- In this combination `document.activeElement` stayed on the button throughout, so the "move focus back if it fell to body" step from section 6 never kicked in. I'm keeping it as a safety net for other platforms.

<!-- TODO (after testing): listen with VoiceOver (macOS Chrome, Safari), iOS Safari + VoiceOver, Android Chrome + TalkBack; which mode the LINE in-app browser shows. -->

### Not tested yet

- Actually listening with VoiceOver: what's announced the moment the unnamed sheet opens.
- macOS Safari and iOS Safari with VoiceOver, Android Chrome with TalkBack.
- Which button the LINE in-app browser shows on Android and on iOS.

## Conclusion

- Web Share hands the share sheet to the operating system, so accessibility support follows the system, and one button can replace a whole row of social icons.
- Support has many gaps: Firefox desktop, Chrome on Linux and Android WebView (including in-app browsers) don't have it, so you need a fallback.
- `canShare()` doesn't guarantee success, one click allows one share attempt, and `AbortError` isn't an error.
- Give the button visible text, report results, don't claim "shared successfully", and offer a next step when it fails.

Scroll to the bottom of this page and try "Share this page", or open it in an unsupported browser and see what it turns into. Is your site still using a row of social icons? Let's talk about it!

## Further reading

- [Make Screen Readers Speak: Replacing aria-live with ariaNotify()](/en/blog/aria-notify/)
- [How to Write a Dialog Today: From showModal() to command and closedby](/en/blog/dialog-modern-guide/)

## Related links

- [W3C — Web Share API](https://www.w3.org/TR/web-share/ "Open new window"){target="_blank"}
- [MDN — Navigator.share()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share "Open new window"){target="_blank"}
- [MDN — Navigator.canShare()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare "Open new window"){target="_blank"}
- [web.dev — Integrate with the OS sharing UI with the Web Share API](https://web.dev/articles/web-share "Open new window"){target="_blank"}
- [Can I use — Web Share API](https://caniuse.com/web-share "Open new window"){target="_blank"}
- [Chromium source — chrome_content_renderer_client.cc](https://chromium.googlesource.com/chromium/src/+/main/chrome/renderer/chrome_content_renderer_client.cc "Open new window"){target="_blank"}
