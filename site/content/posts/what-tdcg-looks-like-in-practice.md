---
title: What TDCG Actually Looks Like in Practice
date: 2026-07-22
description: One real task, moving shared chart code between two apps, and three small decisions that tests alone could not make.
---

The task sounded simple: move two small chart functions from a web app into a shared package, so a mobile app could use them too. Later in the same session, a new mobile chart screen used that shared code and needed a small toggle button.

Every test passed the whole time. But the three decisions that mattered most had nothing to do with the tests.

## 1. Moving code into a shared package is not just moving code

Moving the two chart functions wasn't just about copying files. The real goal was creating one shared place both apps could depend on.

The change happened in small steps. First, the functions and their tests moved into the shared package. The tests failed, since the code wasn't there yet — then the code was added until they passed. Only after that was ready did the web app change: it started using the shared functions, the old copies were deleted, and the full test suite ran again.

Changing both apps at once would have been faster, but harder to review. Small, ordered steps made each part easy to check. The AI could write both sides of the change quickly. The real decision was the order — what moves first, and when.

## 2. One file, or two?

While moving the two functions, the AI copied the old structure exactly: two files, one function in each, each with its own test file.

That got changed during review. The final version used one file with both functions, and one test file. The two functions are small and closely related — they both do chart-axis math. Moving them didn't change that.

Two files wasn't really a decision. It was just the old structure, carried over without anyone asking if it still made sense. Keeping two files would add separation without adding value. This is KISS and YAGNI in one small example: keep it simple, and don't build structure for a future that isn't here yet.

## 3. Should this be its own component?

Later, the mobile chart needed a small toggle button, to show or hide one team's line. The first version put it directly inside the chart's own file.

During review, the question came up: should this be its own component? Looking at the web app helped answer that. It had already built the same button twice, once per chart — a sign that pulling it out could be worth it eventually. But on mobile, there was still only one place using it.

The decision: keep it where it is for now. A second chart that needs the same button is already planned — that's the right moment to pull it out.

## The actual pattern

None of these three moments were about whether the code worked. The tests passed every time, and the AI's code was correct every time.

The real decisions were about things tests can't answer:

- Where should the shared boundary be?
- How should the move happen, step by step?
- Does this really need a second file?
- Is this component reusable yet, or not?

Tests prove the behavior is correct. They don't tell you if the design is simple, necessary, or easy to maintain later.

That's where human judgment still matters. Checking the generated code carefully, every time, is still essential. The AI makes the work faster — it doesn't replace a careful look from a human.
