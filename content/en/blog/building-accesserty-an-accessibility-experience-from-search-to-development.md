---
title: Building Accesserty — An Accessibility Experience from Search to Development
description: A small product ecosystem I built in about a month, aimed at improving the accessible web experience.
date: 2025-05-23
tags:
  - Accessibility
  - Chrome Extension
  - ProductHunt
  - Solo Founder
draft: false
---

Today, I’d like to share the story behind Accesserty, a small product ecosystem I built in about a month, aimed at improving the accessible web experience. From the moment users search to the moment developers build, I wanted to offer a calm, practical set of tools to make accessibility visible, understandable, and actionable.

### Origin: Curiosity about Chrome Extensions

Back in 2023, I created my first Chrome extension — Report Website Issues — simply out of curiosity.

Now in 2025, with the rise of large language models (LLMs), I began thinking about how AI might help me build tools that address real-world accessibility challenges.

I experimented with assigning LLMs different “roles” — product manager, frontend dev, accessibility analyst — and used them to speed up system design and implementation.

### Identifying the Problems

#### 1. After searching, users still don’t know which link to click

Search engines consider SEO, performance, and content, but that doesn’t mean the top results are easy to use — especially for people who rely on keyboard navigation or screen readers.

Sites may appear technically sound but be visually cluttered, hard to navigate, or inaccessible by design.
So I started wondering:

What if I could see how accessible a site is — right from the search result list?

It would save time, reduce frustration, and help everyone make more informed choices.

#### 2. Users often have no way to report issues

Even if a user encounters a serious accessibility problem, it’s often unclear how to report it — or if it will even be taken seriously.

Worse, communication gaps happen. Like in a case I mentioned in an earlier post:

> A user says: “I can’t browse your site using the keyboard.”  
> A support rep replies: “It works fine for me — maybe try again?”  
> But they’re talking about different things. One refers to keyboard focus logic; the other is just pressing the down arrow key. They both get frustrated.  

So I realized there needs to be a “bridge” — someone or something that helps users explain issues clearly and helps developers receive usable feedback.
Right now, LLMs might help with summarization, but the cost and accuracy are still limiting.

**3. Is accessibility really expensive for developers?**
With recent EU regulations, many UI frameworks now include more accessible components — that’s progress.
But passing machine audits isn’t enough.

Compliance ≠ usability.

Take text, for instance. A machine can check if it’s there —
but only a human can tell if it actually describes the image meaningfully in context.alt

Even if LLMs could generate decent descriptions, that still involves API costs, image parsing, and prompt design — not to mention hallucination risks.

That led me to a fundamental insight:

The earlier you address accessibility, the lower the cost.

From planning to design to engineering, everyone needs to be aligned early.
This diagram sums it up well:

### Solutions: Simulate, Detect, Report

Based on these observations, I created a journey map to visualize the pain points across users, developers, and site owners.  
  
:embed{src="https://whimsical.com/embed/NDhUK17ebjwRtaH4kLoMU4" type="application/pdf" width="100%" height="480px"}
  
I divided the process into two phases:

Prevention — Help build accessibility in early  
Remediation — Identify and fix real-world issues through feedback  

The goal: a sustainable feedback loop where everyone benefits.

### Building the Accesserty Brand

Many a11y tools try to scare developers into action — with stories of lawsuits or million-dollar fines.

I didn’t want to do that.
Instead, I wanted to design something that felt rational, respectful, and constructive.

So with help from my “product manager” (aka ChatGPT 😎), I defined Accesserty’s brand principles:

We aim to be…Calm, clear, transparent, inclusive

And we avoid…Fear-driven messaging, tokenism, accessibility as an afterthought

::figure
  ![ChatGPT UI: project folder and chat](/images/blog/1.webp)
  ::figcaption
    I even used ChatGPT’s new project folder mode to keep a shared background doc, flowcharts, and multiple conversations — as if working with a real team.
  ::
::

With the structure aligned, I started coding the actual tools — one by one — with the help of Chrome Extension, Web Components, AppSheet, and some Vibe Coding.

### The Accesserty Ecosystem

- Accesserty Signal
  See accessibility status directly in Google Search  
  [Introduction](http://accesserty.com/en/signal "Open New Window"){target="_blank"}  
  [Chrome Extension](https://chromewebstore.google.com/detail/accesserty-signal/jabgpbgdmhdmibhogmcjfinnkcngcelc "Open New Window"){target="_blank"}
- Accesserty DevCheck
  Simulate vision impairments, detect violations (e.g., color blindness, alt text, heading issues)  
  [Introduction](http://accesserty.com/en/devcheck "Open New Window"){target="_blank"}  
  [Chrome Extension](https://chromewebstore.google.com/detail/accesserty-devcheck/ompbhahmipenipgiiiehbkiibkonoeec "Open New Window"){target="_blank"}
- Accesserty UI Kit
  Build with accessible Web Components from day one
  [Introduction](https://accesserty.com/en/uikit "Open New Window"){target="_blank"}  
  [Github](https://github.com/Accesserty/UI-Kit "Open New Window"){target="_blank"}  
  [Playground](https://accesserty.com/en/uikit/playground "Open New Window"){target="_blank"}  
- Accesserty Pulse.  
  [Pulse](https://accesserty.com/en/pulse "Open New Window"){target="_blank"} — A service dedicated to capturing user frustration.  
  Introduction  
  Built solo, with AI as a thought partner, and designed for low-maintenance sustainability.

### Launched on GAAD 🎉

I chose to launch Accesserty on Global Accessibility Awareness Day (GAAD) —
the third Thursday of May, every year.

You can find it on [Product Hunt](https://www.producthunt.com/products/report-website-issues?launch=accesserty "Open New Window"){target="_blank"}

### My hope is that this helps show:

You don’t need a big team or budget to make the web more accessible.
With the right mindset and tools, transparency and improvement can happen — at scale, and with care.

If you’ve ever felt unsure which site to trust when searching, or if you’ve ever hit an accessibility wall and had nowhere to report it —
Accesserty was built for you.

I’d love to hear your thoughts, feedback, or even ideas for collaboration.

### Related Links

- [GAAD Website](https://accessibility.day "Open New Window"){target="_blank"}
