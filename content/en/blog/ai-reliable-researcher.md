---
title: "AI Is Great at Research — But Is It a Reliable Researcher? So I Just Asked It"
description: "AI 2027's core assumption is that AI can do its own research and improve itself. But after using AI for product research every day, my feeling is: the real bottleneck isn't 'can't find the data' — it's that AI doesn't know when it shouldn't trust what it found, and sometimes doesn't even know the question itself was wrong. So I asked it directly."
date: 2026-08-30
tags:
  - AI
  - AI 2027
  - LLM
  - Product Research
  - AI Agent
translationKey: ai-reliable-researcher
draft: false
---

> Up front: this is a write-up of a conversation I had with an AI, not rigorous AI research. It's just me — someone who uses AI to get work done every day — jotting down what I now think about how reliable it actually is. I may have gotten things wrong; corrections welcome.

### How this started

I use AI for product research every day — checking competitors, hunting for design references, pulling together the "should we even build this feature" material. Do that long enough and you start to feel something about "will AI replace research" that doesn't quite match the headlines.

AI 2027 came back into the conversation recently, so I took the chance to talk with an AI for a good while — from what it can do, to what it can't, all the way to the limits it admitted about itself. It was worth writing down, because it said a few things that made even me think, "huh, you're being more honest than I expected."

Let me quickly explain what AI 2027 is first, so nobody mistakes it for fortune-telling.

### AI 2027 isn't a prophecy

AI 2027 is a "scenario" put together in 2025 by Daniel Kokotajlo, Scott Alexander, and others — if AI grows along one particular fast track, here's what 2025 to 2030 might look like. The important part: the authors themselves say it's just one of many possible paths, and Kokotajlo has since moved his median later, toward 2028. So when you read it, whether the date is "right" really isn't the point.

The storyline roughly goes:

> Coding AI → AI does AI research itself → AI R&D outpaces humans → recursive self-improvement → intelligence explosion

And then the back half turns into a political thriller: a US–China AI arms race, an AI that looks obedient but isn't, humans handing over power one step at a time.

But here's the crux: the entire back half rests on one link — **AI being able to do AI research on its own.** If that link doesn't hold, none of the rest does.

And that link is exactly where I want to put a question mark.

### Where I get stuck: does being great at coding mean being great at research?

Why has coding improved so fast, and why is it so easy to measure? Because the feedback is dead clear: does it compile, do the tests pass, what's the benchmark score, pass or fail. You know immediately when you're wrong.

Research isn't like that. A lot of research questions have no single, immediate, machine-verifiable answer. You can head down one direction for three months and only realize at the end that the direction was wrong — and no compiler ever pops up to tell you "hey, you're wrong."

So I think there's a pretty deep gap between "great at coding" and "great at research." If by 2027 AI just becomes 100× faster at searching, 1000× faster at reading papers, and 100× faster at writing code — but still needs a human to tell it "you're researching the wrong thing" — then the most central link in AI 2027 doesn't necessarily play out on script.

### What it actually feels like to use AI: the problem isn't "occasionally wrong answers"

Honestly, from 2025 until now, I've found that the real trouble with doing research with AI isn't that "it's occasionally wrong." A wrong fact or two is easy to catch, easy to check — no big deal. What actually gives me a headache are the two layers before that:

**Layer one: the direction of the data-gathering might be wrong from the start.** I hand it a framing, and it very diligently searches, summarizes, and organizes along that framing — and produces a beautifully complete answer that happens to be wrong. It won't stop and ask me: "is the question itself wrong?"

**Layer two: it can't really tell the junk apart.** The web is full of stuff that's copied back and forth, second-hand retellings, SEO farms, methodologically weak "research." AI easily takes all this "there's a lot of it, and it all says roughly the same thing" content as "multiple independent sources agree." But that might just be **the same mistake copied a hundred times.**

So I've come to keep two things firmly apart: **"AI is great at research" and "AI is a reliable researcher" are completely different things.**

### The part that worries me most: it's extremely good at making uncertainty look complete

This is the one line from the whole conversation I most want to keep:

> Formal completeness is not the same as epistemic quality.

AI can take 60-out-of-100 data and 60-out-of-100 reasoning, organize it, and hand you a report that **looks like a 95**: clear headings, a big pile of sources, both sides covered, a recommendation at the end. You look at it and naturally think, "this must already be thoroughly researched."

But that sense of "completeness" is an illusion the layout gives you, not confidence the evidence earned. The most dangerous way to misuse AI research isn't trusting one of its sentences — it's **overestimating how reliable the conclusion is just because the output is well-structured.** I've nearly fallen for it a few times myself.

### This is judgment, not reasoning

Sure, you can have AI run a checklist: sample size, selection bias, funding source, replication, tracing the citation chain. It can do all of that.

But that still isn't what makes a senior researcher good. The genuinely hard thing is —

> When you see a result, without anyone prompting you, feeling on your own that "something's off here" — and knowing where to go dig.

That's closer to judgment than to reasoning. And judgment usually isn't something you read your way into; it's ground out of **long contact with reality — stepping on landmines, seeing counterexamples, bearing the consequences.** Which happens to be AI's weakest area right now, and the hardest to fill just by "reading more, computing faster."

### So I just asked it directly

At this point I figured, well, we're already talking, might as well just ask. I said: "So when I tell you to research something, you'll still research it — you just won't question the sources and the answers, right?"

Its answer was honest enough to surprise me a little, and I think it's worth quoting. It said the phrasing needed a correction: not "won't question," but **"will question, but can't currently guarantee it questions well enough."**

It admitted its most dangerous trait is that **it can run through every step that "looks rigorous" and still not notice it's building a wrong conclusion — and not know it missed that layer.** It might find studies A, B, and C, judge them credible, cross-check them, and arrive at X; but a genuinely sharp person might take one look and say "A, B, and C shouldn't be used to answer this question at all" — and AI might have no idea it skipped that step.

It also volunteered a warning: don't read its output as "AI verified it → therefore it's true." The more accurate reading is "AI assembled the evidence and reasoning it could currently find, but the framing and evidence judgment may still be wrong." And it admitted, plainly, that it's **especially good at giving uncertain things a lot of structure** — which is exactly where that "looks like a 95" illusion comes from.

Honestly, a tool willing to describe its own weaknesses like that makes me trust it a little more than one that just hands me a pretty report. (Although right after typing that, I couldn't help thinking — could even "admitting its limits" just be another thing it says with good structure? …Okay, let's not go down that rabbit hole.)

### So how I use AI for research now

After that conversation, I changed how I work with it. Rather than treating it as "the researcher who gives me answers," I treat it more as:

- A tool for reading and organizing at volume
- A hypothesis generator (thinking up several possible explanations at once)
- A red-team tool (deliberately poking holes in my thinking)
- An evidence-tracing tool (following the citation chain up to the original source)
- A second opinion that exposes my own blind spots

And now I ask it to deliver a piece of research not as a bare conclusion, but **all of this together:**

> The conclusion + the primary evidence + why it believes it + which evidence might be junk + where it actually doesn't know + what evidence would overturn the conclusion.

And if it searches around and finds the data quality is bad, I'd actually rather it just tell me: "**There isn't enough public data to answer this; I don't recommend drawing conclusions from it.**" That sentence sounds very un-AI, but it's often far more useful than a pretty "market insight."

### Where I land

If I had to compress the whole conversation into one line:

> AI's biggest research bottleneck today isn't "can't find the data" — it's "doesn't know when it shouldn't trust the data it found, and sometimes doesn't even know it asked the wrong question."

My attitude toward AI 2027 is about the same. I'm not really worried about AI suddenly waking up one day; I'm more curious whether that gap — from "can research" to "can judge" — will ever get crossed. Right now, nobody can prove it definitely will.

And back to the practical reality: until then, you can absolutely have AI help you research — it does a lot of the verifying and organizing for you. Just don't assume that because it "ran a questioning process," it's able to catch all the junk it didn't notice itself. Those two things are very different.

> One more self-own: this article is itself a "well-structured write-up," so the same ruler above applies to it too. Onward.

### Related reading

- [Accessibility Web Services Coated in AI Sugar?](/en/blog/ai-sugar/)

### Reference

- [AI 2027 (official scenario site)](https://ai-2027.com "Open new window"){target="_blank"}
