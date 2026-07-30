---
title: The Plan Said It Was Broken. It Wasn't.
date: 2026-07-30
description: Three moments from a real production cutover, each one mapped to a specific step in the TDCG loop and a specific principle — not just "check the code."
---

I was open-sourcing a production platform: five repositories, a rebrand, a domain cutover, DNS, TLS, a lot of configuration changes.

The migration plan had been researched and written the day before. It was good. It was also wrong about one thing, and silently right about another that nobody had re-checked. Each moment below sits at a specific point in the TDCG loop — SPECIFY, RED, REFACTOR — and each one is really a named principle showing up in a place that isn't a code review comment.

## SPECIFY: verify the symptom before you design the fix (YAGNI, the other direction)

The plan said the sitemap was broken: `robots.txt` pointed at `/sitemap.xml`, and the file at that path was leftover image-processing junk, not XML. True, when someone found it. The task looked like "build a sitemap generator" — new SPECIFY, new RED, a real cycle.

Before writing that cycle's tests, I checked the build script instead of the bug report. There already was a generator — collecting every route, league, team, and player, producing valid XML, running automatically at the end of every production build. The "broken sitemap" was a second, unrelated stale file sitting next to a generator that had been working the whole time.

YAGNI usually means *don't build speculative generality nobody asked for*. This is the same principle from the other side: **don't build the thing a report implies you need before confirming the system doesn't already have it.** That confirmation is what SPECIFY is actually for — before a single test gets written, know precisely what's true right now, not what a document from earlier said was true. The fix was two lines: a hostname constant and a `rm`, once the real mechanism was in view.

## SPECIFY's boundary has to survive PROMPT and GREEN — and REFACTOR is how you make that structural, not remembered

The day before, I'd drawn a boundary during SPECIFY: brand-name text was safe to change immediately; anything that's a *live* production value — an API host default, a sitemap URL, a Docker build argument — had to wait for the actual domain cutover.

Mid-sweep across dozens of files, five of them got the domain string changed anyway, exactly the category that boundary was drawn to protect. The reason wasn't carelessness — it's that a single string, `futballero.com`, was doing two jobs at once: brand identity in a sentence, and a runtime value something dereferences. A text search sees one string and matches both jobs identically. That's a Single Responsibility problem wearing a bug's clothes: one literal, two responsibilities, no way to tell them apart from the outside.

The actual fix for *this class of mistake* isn't reading more carefully next time — it showed up a cycle later, as a REFACTOR: pull the domain into one named `SITE_DOMAIN` constant, and point every real reference at the constant instead of the literal. That's DRY doing real work, not decoration. Once the distinction is structural — *does this file import the constant, or does it hardcode a literal* — it's a fact a tool can check, not a rule that only exists in whoever wrote the plan's memory. The boundary SPECIFY draws is only as durable as the structure REFACTOR gives it afterward.

## RED exists to establish a contract — when there's no new contract, that's a decision, not a shortcut (KISS)

Later the same day: strip an old brand name out of dozens of files of SEO metadata, locale strings, and page copy. I skipped RED — no new tests — and reran the existing 832-test suite afterward instead.

RED's job in TDCG is to pin down a contract *before* an implementation exists, precisely because the implementation doesn't exist yet and the tests are the only spec. Here, the implementation already existed, already had a contract, and nothing about its behavior was changing — only which literal string it displayed. Writing new tests would have meant re-asserting the same contract in different words. KISS says don't build structure — including test structure — that doesn't earn its place. The four conditions that made this safe are worth naming, because they're the actual criteria, not a feeling: mechanical change, no new logic, existing coverage already exercises the touched paths, and a full rerun is cheap enough to actually do. Change any one of those and the same shortcut stops being a shortcut.

## What the loop actually protects

None of this is "AI wrote code, then a human checked it." SPECIFY is where over-building (YAGNI) and under-checking both get caught, if you actually use it that way instead of treating it as a formality. REFACTOR is where a rule that only lived in someone's head becomes a structure a tool can verify — DRY as a fix for ambiguity, not just for repetition. RED is a deliberate contract-first step, which means *deliberately not invoking it* is also a real decision, governed by real conditions, not a default.

A plan's job is capturing why a decision was made. The loop's job is making sure that decision still holds once the code changes. Neither one replaces checking the code itself — that's still the only source of truth about what's actually there.
