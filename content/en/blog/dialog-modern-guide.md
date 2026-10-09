---
title: "How to Write a Dialog Today: From showModal() to command and closedby"
description: "You don't need to hand-roll modals out of divs anymore. This post rounds up how to write <dialog> in 2026: show() vs showModal(), opening and closing with zero JavaScript via Invoker Commands, choosing who can close it with closedby, catching unsaved changes with request-close, getting results out with form method=\"dialog\", plus accessibility and animation details. Every section has a demo you can try."
date: 2026-10-09
tags:
  - HTML
  - CSS
  - Front-End
  - Accessibility
  - Browser Support
translationKey: dialog-modern-guide
draft: false
---

> Up front: my tests for this post were run in Chromium. Newer features like `closedby` have uneven support across browsers, so what's true as I write this may not stay true. If I've gotten something wrong, corrections welcome.

### Intro

After writing about [popover](/en/blog/popover-auto-manual-hint) and [hidden="until-found"](/en/blog/hidden-until-found), the next thing I wanted to round up was `<dialog>`.

Dialogs are probably one of the components front-end developers hand-roll most often: a `<div>` in the middle of the screen with a dimmed layer behind it. It looks fine, but almost everything accessibility needs has to be added by hand: move focus in, keep Tab from escaping to the page, close on Escape, return focus to the original button afterward, stop screen readers from reading the background... Each one is a chunk of code, and each one is a place to get it wrong.

Native `<dialog>` has been usable for years, but the last two years added several new pieces: Invoker Commands for opening and closing without JavaScript, `closedby` to choose who can close it, and `request-close`, which can be intercepted. Many tutorials still stop at "`showModal()` plus a hand-built close button," so this post rounds up how to write it today.

First, here's what your browser supports:

::feature-support{features="command,dialog-closedby,dialog-requestclose" notice="If something isn't supported, that's fine. The demos fall back to JavaScript where needed, and the text explains the differences."}
::

### 1. Know the difference: `show()` and `showModal()` are very different

`<dialog>` can be opened two ways, and this is where most of the confusion starts:

::dialog-modal-compare
::

Open both, then press Tab and try the background button. The difference is obvious:

| | `show()` (non-modal) | `showModal()` (modal) |
|---|---|---|
| Can you use the background? | Yes | No, the whole background becomes inert |
| Does Tab escape? | Yes | No, it moves only between the dialog and the browser UI |
| Escape closes it | No | Yes |
| Dimmed `::backdrop` | No | Yes |
| Shown in the top layer | No | Yes, so `z-index` and `overflow` can't cover it |

In my Chromium tests, both move focus to the first focusable element in the dialog when opened, and when a modal closes, focus returns to the button that opened it automatically. You can see this in the event log.

Writing `<dialog open>` straight into the HTML is the same as `show()`: non-modal. **Whenever people must deal with the dialog before continuing, use a modal**, not just the `open` attribute.

### 2. Open and close with Invoker Commands, no JavaScript

Opening a modal used to require this:

```js
openButton.addEventListener("click", () => dialog.showModal());
```

Now [Invoker Commands](/en/blog/popover-auto-manual-hint) do it, the same mechanism popovers use:

```html
<button commandfor="confirm" command="show-modal">Delete file</button>

<dialog id="confirm" aria-labelledby="confirm-title">
  <h2 id="confirm-title">Delete this file?</h2>
  <button commandfor="confirm" command="close">Cancel</button>
</dialog>
```

There are three dialog commands:

| `command` | Effect |
|---|---|
| `show-modal` | Opens as a modal, same as `showModal()` |
| `close` | Closes immediately |
| `request-close` | "Requests" a close: fires a `cancel` event first, which you can intercept (section 4 uses this) |

Note that **there's no non-modal `show` command**, which is why the non-modal button in the comparison demo still uses JavaScript.

Invoker Commands are supported from Chrome 135, Firefox 144 and Safari 26.2, so they're Baseline. In browsers without them, the demos in this post add these three commands back with a little JavaScript.

### 3. `closedby`: deciding who can close it

"Close when clicking the backdrop" used to mean listening for clicks and checking whether they landed outside the dialog. Now there's the `closedby` attribute:

::dialog-closed-by
::

| `closedby` | Backdrop click | Escape | Close button |
|---|---|---|---|
| `any` | Closes | Closes | Closes |
| `closerequest` | No | Closes | Closes |
| `none` | No | No | Closes |

Without `closedby`, a modal behaves like `closerequest` and a non-modal like `none`.

One detail I found while testing: `closedby="none"` blocks close requests from *users*, **not from your own code**. Calling `requestClose()` or `close()` on a `none` dialog still closes it.

My recommendations:

- **Ordinary info or settings dialogs**: use `any`; closing on a backdrop click is the most intuitive.
- **Dialogs with forms or important actions**: keep the default `closerequest`, so an accidental backdrop click doesn't throw work away.
- **Avoid `none` where you can**: removing Escape removes the exit keyboard users know best. If you really need it, always provide a visible close button.

`closedby` is supported from Chrome 134 and Firefox 141. When I wrote this, the sources I found didn't show Safari support yet, so check [caniuse](https://caniuse.com "Open new window"){target="_blank"}. Browsers without it ignore the attribute and fall back to the defaults above, so nothing breaks.

### 4. `request-close`: ask before throwing away unsaved work

This is the new feature I find most useful. Someone types a lot into a dialog, accidentally hits Cancel or Escape, and it's all gone. Plenty of people have been there.

::dialog-editor
::

Try it: open it, type something, then press Cancel or Escape. Instead of closing, the dialog asks whether to discard your changes.

The trick is giving the Cancel button `request-close` instead of `close`:

```html
<button commandfor="editor" command="request-close">Cancel</button>
```

Like pressing Escape, `request-close` fires a `cancel` event first. In the handler, check for unsaved content and call `preventDefault()` to stop the close:

```js
editor.addEventListener("cancel", (e) => {
  if (hasUnsavedChanges()) {
    e.preventDefault();
    showConfirm(); // show the confirmation inside the dialog
  }
});
```

A few things I handled deliberately in the demo:

- **The confirmation lives inside the dialog** rather than using `window.confirm()`. The native confirm can't be styled, and it interrupts screen reader users.
- **Focus moves to the confirmation when it appears**, so screen readers announce "You have unsaved changes."
- **The `close` command doesn't fire `cancel`**, so the "Discard changes" button can use `close` to shut the dialog without being intercepted again.

### 5. `form method="dialog"`: getting the result out

The demo's Save button doesn't use any JavaScript to close the dialog. It relies on `<form method="dialog">`:

```html
<dialog id="editor">
  <form method="dialog">
    <textarea name="note"></textarea>
    <button type="submit" value="save">Save</button>
  </form>
</dialog>
```

Submitting this kind of form doesn't send a request. It closes the dialog and puts the pressed button's `value` into `dialog.returnValue`. Read it in the `close` event to know how the dialog was closed:

```js
editor.addEventListener("close", () => {
  if (editor.returnValue === "save") saveNote();
});
```

Native form validation (such as `required`) still applies; if validation fails, the dialog stays open.

### 6. Accessibility checklist

Native `<dialog>` handles a lot for you, but a few things are still yours to check:

- **Give the dialog a name**: point `aria-labelledby` at its heading, so screen readers announce what the dialog is when it opens.
- **Think about initial focus**: by default it goes to the first focusable element. If that's a dangerous button like "Delete," use `autofocus` to put focus somewhere safer, such as "Cancel" or the first input. The note field in the demo uses `autofocus`.
- **Focus returns to the original button automatically**: a perk of native modals, so you don't have to remember who opened it. But if that button is removed after closing, you have to decide where focus goes.
- **Always provide a visible way to close it**: Escape works, but not everyone knows that.
- **Don't use a modal where you don't need to interrupt people**: for supplementary info, a popover or an in-page disclosure is usually better.

### 7. Styling and enter/exit animation

Dialog enter and exit animations can now be done entirely in CSS. This is the code my own site uses, and the demo dialogs use it too:

```css
dialog {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
  transition:
    opacity 0.3s ease-out,
    transform 0.3s ease-out,
    overlay 0.3s allow-discrete,
    display 0.3s allow-discrete;

  &::backdrop {
    opacity: 0;
    background-color: rgb(0 0 0 / 50%);
    transition:
      opacity 0.3s ease-out,
      display 0.3s allow-discrete,
      overlay 0.3s allow-discrete;
  }

  &[open] {
    opacity: 1;
    transform: scale(1) translateY(0);

    @starting-style {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }

    &::backdrop {
      opacity: 1;

      @starting-style {
        opacity: 0;
      }
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  dialog,
  dialog::backdrop {
    transition: none;
  }
}
```

Three key points:

- `@starting-style` defines how it looks the moment it appears, giving the enter animation a starting point.
- `display` and `overlay` need `allow-discrete`, so on close the browser waits for the animation before hiding it and removing it from the top layer.
- **Remember the reduced-motion preference.** Honestly, I only noticed while writing this that my own site's dialog was missing that last block, so I've added it.

### 8. When do you still need JavaScript?

Declarative markup now covers most cases, but these still need code:

- **Non-modal dialogs**: there's no command for them, so use `show()`.
- **Flows that wait on the result**: such as "send the API request only after confirming," where you read `returnValue` in the `close` event.
- **Unsaved-changes prompts**: the check inside the `cancel` handler is yours to write.
- **Dialogs with dynamically loaded content.**
- **Supporting older browsers**: add the Invoker Commands fallback.

### Conclusion

In a few lines:

- **If people must deal with it first, use a modal**: `command="show-modal"` gives you focus handling, an inert background, Escape and focus return.
- **Choose who can close it with `closedby`**: `any` for most, the default for forms, and `none` rarely.
- **Give Cancel `request-close`**, and catch unsaved content in the `cancel` event.
- **Use `<form method="dialog">` to get the result**, and read `returnValue` in the `close` event.
- **Remember the name, initial focus, a visible close button, and the reduced-motion preference.**

Looking back over these three posts, they all point the same way: interactions that used to need a pile of JavaScript, and were easy to get wrong, are becoming a single HTML attribute one by one. Every piece of code you don't write is one fewer chance for a bug, and that matters especially for accessibility.

Do you still have hand-rolled modals in your projects? I'd love to hear about it.

### Related reading

- [Popover auto, manual and hint: What's Actually the Difference? I Built Demos to Find Out](/en/blog/popover-auto-manual-hint/)
- [Why Can't Ctrl+F Find Collapsed Content? A Look at hidden="until-found"](/en/blog/hidden-until-found/)
- [Modern CSS & HTML Cheat Sheet: 102 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

### Related links

- [MDN — `<dialog>`: The Dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog "Open new window"){target="_blank"}
- [MDN — HTMLDialogElement.closedBy](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy "Open new window"){target="_blank"}
- [MDN — Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API "Open new window"){target="_blank"}
- [W3C WAI-ARIA APG — Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
