---
title: "Building a Video Call Waiting Room with <usermedia>: The Browser Handles Permissions, but Six Things Are Still on You"
description: "<usermedia> hands the camera button and the permission flow to the browser: people who blocked access can recover right on the page, and screen readers can operate the permission dialog. But testing in Chrome with VoiceOver, I found that lang=\"zh-Hant-TW\" turns the button text into Simplified Chinese, there's no state once the camera is on, and keyboard users who press too quickly get a silent failure. Using a video call waiting room as the example, this post covers the six things you still need to handle."
date: 2026-10-31
tags:
  - HTML
  - JavaScript
  - Front-End
  - Accessibility
  - Browser Support
category: frontend
translationKey: html-usermedia
draft: false
---

> Up front: I tested the behavior in this post in Chromium 153 and confirmed it in Chrome on macOS with VoiceOver. Only Chromium supports `<usermedia>` so far, and the spec is still changing, so check caniuse and Chrome's documentation for the details. If I've gotten something wrong, corrections welcome.

## Intro

Everyone has seen a video call's "waiting room": you preview yourself, press a "turn on camera and microphone" button, the browser asks for permission, and you join once you allow it.

That button used to be something you built yourself, calling `getUserMedia()` on click. The biggest problem: **once someone pressed "Block", the page could never ask again**. Every press after that failed immediately, and the only fix was asking people to change it in the browser's settings. Many couldn't find where, and gave up.

Chrome's `<usermedia>` element hands both the button and the permission flow to the browser. In my tests it really does fix "blocked means stuck", and screen readers can operate the permission dialog. But there are things the browser doesn't do, which developers still need to handle, and one of them catches almost every Taiwanese site.

First, check your browser's support:

::feature-support{features="usermedia" notice="Your browser doesn't support <usermedia>, so the demo below falls back to a regular button; the test results in the post still apply."}
::

## 1. Syntax

There are three elements:

| Element | Use | Event on success |
|---|---|---|
| `<usermedia>` | Camera and microphone together, e.g. video calls | `stream`; get the `MediaStream` from `element.stream` |
| `<camera>` | Camera only | `track`; get the video track from `element.track` |
| `<microphone>` | Microphone only | `track`; get the audio track from `element.track` |

```html
<usermedia id="join"></usermedia>
<video id="preview" autoplay muted playsinline></video>

<script>
  const join = document.getElementById("join");
  const preview = document.getElementById("preview");

  // The stream is ready: show it in the <video> preview
  join.addEventListener("stream", () => {
    preview.srcObject = join.stream;
  });
</script>
```

The button's text and icon come from the browser, and **developers can't change them**. That's deliberate: people always see a description the browser vouches for, so a site can't trick them into turning on their camera with misleading text.

There are two more events to handle:

- `cancel`: the person closed the permission dialog, or chose to keep blocking access.
- `error`: it failed for another reason, such as no device found, or the button can't be used right now (more on that below). The reason is in `element.error`.

To set resolution, echo cancellation and so on, use `setConstraints()`:

```js
join.setConstraints({
  video: { width: 1280 },
  audio: { echoCancellation: true },
});
```

## 2. What the browser handles for you

The good news first. With `<usermedia>`, you don't have to handle these yourself:

1. **Keyboard and role:** it's a real button. You can Tab to it, and Enter and Space both activate it. Screen readers announce "Use microphone and camera, button", with no ARIA needed.
2. **Recovering after a block, right on the page:** if someone blocked access before, pressing the button again makes the browser show a dialog in the middle of the screen, explaining that they previously didn't allow this site to use the camera and microphone, with two choices: keep blocking, or allow it this time. Allowing turns them on immediately, and lasts until the window is closed: reloading the page doesn't ask again, while a new window does. (I tested in a Traditional Chinese Chrome, so I'm describing the dialog rather than quoting its English wording.) No more sending people to dig through browser settings. This is the element's biggest win.
3. **Screen readers can operate the permission dialog:** VoiceOver moves into the dialog automatically and announces it, and you can Tab to the choices. After it closes, focus goes back to the button.
4. **High contrast and dark mode work:** Windows high contrast mode (forced-colors) overrides the site's brand colors, and the button still works.
5. **Larger text doesn't break it:** the font size limit scales with the user's default font size, so raising the browser's text size doesn't disable the button.

## 3. Six things you still need to handle

### 1. `lang="zh-Hant-TW"` shows Simplified Chinese

This is the one Taiwanese sites are most likely to hit. The button's text follows the `lang` attribute, and the element inherits `lang` from its ancestors. I tested the common values:

| `lang` | Button text |
|---|---|
| `zh-TW` | 使用麥克風和攝影機 ✅ (Traditional) |
| `zh-HK` | 使用麥克風和相機 ✅ (Traditional) |
| `zh-Hant-TW` | 使用麦克风和摄像头 ❌ (Simplified) |
| `zh-Hant` | 使用麦克风和摄像头 ❌ |
| `zh-Hant-HK`, `zh-MO`, `zh` | 使用麦克风和摄像头 ❌ |

`zh-Hant-TW` is the form W3C recommends, and it's what this site uses, yet the button comes out in Simplified Chinese, and that's what screen readers announce too. Chromium currently only recognizes the exact strings `zh-TW` and `zh-HK`.

Set it on the element itself; there's no need to change the whole site:

```html
<!-- The page is zh-Hant-TW; only this element uses zh-TW, so the button shows Traditional Chinese -->
<usermedia lang="zh-TW"></usermedia>
```

### 2. No state once it's on

After the camera turns on, the button is still named "Use microphone and camera", with no "on" state of any kind. Testing with VoiceOver, the only hint was in the browser's window title, which gains a note that the camera and microphone are recording. You only hear it if focus happens to move and VoiceOver rereads the window.

People who can't see the screen may not know the camera is on. Tell them yourself with a status message once it starts:

```html
<p id="status" role="status"></p>
```

```js
join.addEventListener("stream", () => {
  preview.srcObject = join.stream;
  // Screen readers announce changes to a role="status" element
  status.textContent = "Your camera and microphone are on. Others can see and hear you.";
});
```

Also, the spec says that pressing `<camera>` or `<microphone>` again after they're on toggles "turn off camera / mute". In Chrome, I pressed several times in a row: the text never changed, and `track.enabled` stayed `true`. **For now, turning off the camera and muting are still buttons you build yourself.**

### 3. Failures show nothing on screen

Being denied, finding no device and the button being temporarily unusable all just fire events; nothing appears on screen:

| Situation | Event | `error.name` |
|---|---|---|
| The permission dialog was closed, or the person chose to keep blocking | `cancel` | `NotAllowedError` |
| No camera or microphone found | `error` | `NotFoundError` |
| The button is temporarily unusable (see 4 and 5) | `error` | `InvalidStateError` |

Two things to watch for:

- **Choosing to keep blocking and simply closing the dialog give you exactly the same event and message**, so you can't tell them apart; your message has to cover both.
- **After a success, the `error` property isn't cleared**; it still holds the last failure. Decide the outcome by which event fired, not by whether `error` has a value.

```js
join.addEventListener("cancel", () => {
  status.textContent =
    "Your camera and microphone weren't turned on. Press the button again whenever you're ready.";
});

join.addEventListener("error", () => {
  status.textContent = errorMessage(join.error);
});

function errorMessage(error) {
  if (error?.name === "NotFoundError") {
    return "No camera or microphone found. Check that your devices are connected.";
  }
  if (error?.name === "InvalidStateError") {
    // Usually the button just appeared or just scrolled into view; pressing again a moment later works
    return "The button wasn't ready yet. Wait a second and press it again.";
  }
  return "Couldn't turn on your camera and microphone. Please try again later.";
}
```

### 4. Keyboard users who press too quickly get a failure

To stop sites from tricking people into clicking, the browser won't accept presses for a short time after the button **appears, scrolls into view, or changes position or style**.

Mouse users rarely hit this, but keyboard users do: tabbing to a button that's off screen scrolls the page, which counts as the button "just scrolling into view". In my tests, **pressing Enter within 500 ms of Tab always failed**, and it worked after 800 ms. Experienced keyboard users often press as soon as they land on a button, and get no response and no message. I reproduced the same result in Chrome on macOS.

Developers can't turn this off; they can only make it less likely:

- Put the button where it's visible as soon as the page opens, without scrolling.
- Don't insert the button right when people are about to press it, or let layout changes move it. If you have to insert it dynamically, show "Getting the button ready" first, as the demo below does.
- Always handle `InvalidStateError` and tell people to press again (the code above does).

### 5. The button can "look fine but do nothing"

The browser also checks the button's styles, and disables it when they don't comply:

| Style | Result |
|---|---|
| Text-to-background contrast below 3:1 | Disabled |
| Font size below about 13px | Disabled |
| Font size above about 3× the user's default | Disabled |
| `opacity: .5`, `transform`, `clip-path` cutting off half | Still works |
| `outline: none` | Still works |

When it's disabled, the button looks exactly the same, and the accessibility tree has no `disabled` either. Screen readers announce "button", people press it and nothing happens, and only the code gets an `InvalidStateError`. This is usually a bug you should catch during development, so **actually press the button before you ship**. And after fixing the colors, it also takes a little under a second before the button works again.

The last row matters most: the browser checks contrast and font size, **but doesn't protect the focus indicator**. Remove the `outline` and keyboard users can't see where focus is (WCAG 2.4.7). Keep it when you customize the styles:

```css
usermedia {
  /* Text and background contrast must be at least 3:1, or the button is disabled */
  color: #fff;
  background-color: #5b2fb0;
  border: none;
  border-radius: 999px;
  /* rem: grows with the user's font size and stays under the browser's limit */
  font-size: 1rem;
}

/* The browser won't protect the focus indicator for you */
usermedia:focus-visible {
  outline: 3px solid #5b2fb0;
  outline-offset: 3px;
}
```

### 6. Don't rename it with `aria-label`

Since you can't change the button text, it's tempting to use `aria-label` to word it your way. In my tests, `aria-label` replaces the accessible name outright:

```html
<!-- The screen shows "Use microphone and camera", but screen readers say "Start video" -->
<usermedia aria-label="Start video"></usermedia>
```

When the visible text and the announced name differ, someone using voice control who says "click Use microphone and camera" can't find the button. That fails WCAG 2.5.3 Label in Name.

To add context, use `aria-describedby`; screen readers read it after the name:

```html
<usermedia aria-describedby="join-hint"></usermedia>
<p id="join-hint">Once on, others in the call can see and hear you.</p>
```

## 4. Try it

Below is a video call waiting room. Pressing its button really turns on your camera and microphone, so you have to tick a consent box before the demo appears; unticking it turns the camera off and hides the demo.

The browser still shows its own permission dialog after you tick the box. The two steps are deliberate: first the site tells you what will happen, then the browser grants access.

You can switch `lang` to see the button text change between Simplified and Traditional Chinese, or switch the button to a low-contrast light gray to see what "press and nothing happens" looks like. The demo creates `<usermedia>` only after you tick the box, so it starts by showing "Getting the button ready", which is the handling described in point 4 of section 3.

::usermedia-demo
::

## 5. What I recommend: a complete waiting room

```html
<section class="lobby" aria-labelledby="lobby-title">
  <h2 id="lobby-title">Check your video before joining</h2>

  <!-- muted: don't play your own audio back in the preview, to avoid echo -->
  <video id="preview" autoplay muted playsinline aria-label="Your camera preview"></video>

  <!--
    aria-describedby: adds context; don't rename it with aria-label
    The <button> inside: shown by browsers without support, ignored by browsers with it
    (On a zh-Hant-TW page, also add lang="zh-TW" so the button text is Traditional Chinese)
  -->
  <usermedia id="join" aria-describedby="join-hint">
    <button type="button" id="join-fallback">Turn on camera and microphone</button>
  </usermedia>
  <p id="join-hint">Once on, others in the call can see and hear you.</p>

  <!-- Success and failure messages go here, and screen readers announce them -->
  <p id="status" role="status"></p>

  <!-- Build your own camera toggle: <camera> and <usermedia> don't toggle when pressed again -->
  <button type="button" id="camera-toggle" hidden>Turn off camera</button>
</section>
```

```js
const join = document.getElementById("join");
const preview = document.getElementById("preview");
const status = document.getElementById("status");
const cameraToggle = document.getElementById("camera-toggle");

function started(stream) {
  preview.srcObject = stream;
  status.textContent = "Your camera and microphone are on. Others can see and hear you.";
  cameraToggle.hidden = false;
}

if ("HTMLUserMediaElement" in window) {
  // Supported: let the browser handle the button and permissions
  join.addEventListener("stream", () => started(join.stream));
  join.addEventListener("cancel", () => {
    status.textContent =
      "Your camera and microphone weren't turned on. Press the button again whenever you're ready.";
  });
  join.addEventListener("error", () => {
    status.textContent = errorMessage(join.error);
  });
} else {
  // Not supported: use the regular button inside and call getUserMedia() yourself
  document.getElementById("join-fallback").addEventListener("click", async () => {
    try {
      started(await navigator.mediaDevices.getUserMedia({ video: true, audio: true }));
    } catch (error) {
      status.textContent = errorMessage(error);
    }
  });
}

// Turn the camera off and on: video only, audio stays on
cameraToggle.addEventListener("click", () => {
  const video = preview.srcObject?.getVideoTracks()[0];
  if (!video) return;
  video.enabled = !video.enabled;
  cameraToggle.textContent = video.enabled ? "Turn off camera" : "Turn on camera";
  status.textContent = video.enabled
    ? "Your camera is on."
    : "Your camera is off. Others can't see you.";
});
```

`errorMessage()` is the same as in point 3 of section 3.

## 6. Limits designers should know

You can't change much about how `<usermedia>` looks, so designs have to work around it:

- **The button text can't be customized, and its length varies:** "Use microphone and camera" in English, "使用麥克風和攝影機" in Chinese. At the same font size, the English version is about 30% wider. Leave room for the button's width to vary.
- **The icon comes from the browser**, and you can't swap in your own.
- **Text-to-background contrast must be at least 3:1** (the browser only checks those two colors; background images don't count), or the button is disabled.
- **The font size must be about 13px or more**, and no more than about 3× the user's default font size.
- **At most 3 of each element per page.** From the 4th on, they're disabled. A multi-person call UI with one button per person needs to share a single button instead.
- **The browser decides the permission dialog**: in Chrome I saw a dialog in the middle of the screen, and the design can't control how it looks or where it appears.

One more thing developers can't control: on macOS, unless the user has turned on "System Settings → Keyboard → Keyboard navigation", **keyboard-only users can't get into the permission dialog** to allow access. VoiceOver users don't have this problem. It's browser and OS behavior, but it means not every keyboard user can operate the dialog. Your page's instructions should also mention the other route: turning permissions on from "Site settings" at the left of the address bar.

## Conclusion

- `<usermedia>`, `<camera>` and `<microphone>` hand the camera button and permission flow to the browser; keyboard support, the role, and screen reader access to the permission dialog are all taken care of.
- The biggest improvement is **recovering after a block right on the page**, instead of sending people to browser settings.
- Taiwanese sites should add `lang="zh-TW"` to the element; `zh-Hant-TW` turns the button text into Simplified Chinese.
- Nothing appears on screen when it turns on or fails, so announce it yourself with `role="status"`; you also have to build the camera and mute toggles.
- The button can't be pressed right after it appears or scrolls into view, which keyboard users easily hit, so handle `InvalidStateError`.
- Don't rename it with `aria-label` or remove the focus indicator; keep contrast at 3:1 or more, and use at most 3 of each element per page.

## Related reading

- [How to Write a Dialog Today: From showModal() to command and closedby](/en/blog/dialog-modern-guide/)
- [Make Screen Readers Speak: Replacing aria-live with ariaNotify()](/en/blog/aria-notify/)
- [Modern CSS & HTML Cheat Sheet: 115 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

## Related links

- [Chrome for Developers — Introducing the `<usermedia>` HTML element](https://developer.chrome.com/blog/usermedia-html-element "Open new window"){target="_blank"}
- [W3C — Media capture HTML elements specification](https://w3c.github.io/mediacapture-extensions/#media-capture-html-elements "Open new window"){target="_blank"}
- [W3C — Media Capture Elements explainer](https://github.com/w3c/mediacapture-extensions/blob/main/media-capture-elements-explainer.md "Open new window"){target="_blank"}
- [WCAG 2.2 — Understanding 2.5.3 Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
