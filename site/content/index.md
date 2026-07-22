---
title: TDCG — Test-Driven Code Generation
description: A method for writing software and using AI tools without losing control. The loop, the reasoning behind it, and real case studies.
---

<div class="hero">

# Test-Driven Code Generation

**A method for writing software with AI without losing control.**

Test-Driven Code Generation (TDCG) is a software development method that combines AI-assisted development with established engineering practices.

It was developed while building production software and evolved through real implementation work, code reviews, testing cycles, and architectural decisions. The method applies the discipline of test-driven development to a workflow where tests and implementation can be generated, reviewed, refined, and committed in small, controlled increments.

The goal is not to change the fundamentals of software engineering, but to adapt them to a different way of building software.

</div>

## The idea

In classical TDD, the human writes both the test and the implementation.

In TDCG, **the AI generates both**. The human specifies the behavior, reviews the tests before any implementation starts, then reviews the implementation. Nothing moves forward without human approval at each step.

> The AI generates. The human decides what's right and what is not.

## The loop

```
1. SPECIFY  — define one behavior in plain language
2. RED      — AI generates failing tests; human reviews and approves them
3. PROMPT   — provide the approved tests, context, and reference patterns
4. GREEN    — AI generates the implementation; tests pass
5. REVIEW   — human reviews architecture, naming, design, and code quality
6. REFACTOR — human and/or AI improve the solution while keeping tests green
7. COMMIT   — one small, focused, tested commit
```
## Before the TDCG Cycle

A TDCG cycle starts only after the problem is understood.

Review the relevant parts of the codebase, identify existing patterns, and gather the context needed to make an informed change. For larger features or refactorings, create a plan that captures requirements, assumptions, constraints, and the proposed approach.

The outcome of this phase is an approved specification that clearly defines what needs to be built.

## The cycle, step by step

### 1. Specify

Define a single observable behavior to implement.

The specification should be concise, unambiguous, and small enough to complete in one cycle. If it describes multiple behaviors or requires multiple independent changes, split it into smaller increments.

This specification becomes the basis for the generated tests and the implementation that follows.


### 2. Red

The tests are generated based on the approved specification.

Each test should represent an observable behavior, not an implementation detail. The human reviews the generated tests, verifies that they describe the intended behavior, and adjusts them if necessary before any implementation is generated.

Once approved, run the tests. They should fail.

A failing test is the expected state at this stage: the behavior has been defined, but no implementation exists yet. The tests become the contract that guides the next step.

### 3. Prompt

Provide the approved specification, the failing tests, and the relevant context from the existing codebase.

A reference implementation or similar existing file is often the most valuable piece of context. It gives the AI a concrete pattern to follow: naming conventions, structure, dependencies, error handling, and architectural decisions already used by the project.

Without this context, the generated implementation may satisfy the tests while still introducing inconsistencies with the rest of the codebase.

### 4. Green

The AI generates the implementation based on the approved specification, tests, and project context.

Run the tests. They must pass without changing the expected behavior defined during the specification phase.

If something fails, investigate the cause. Refine the specification, improve the context provided to the AI, or adjust the implementation. Do not weaken tests or change the contract simply to achieve a green state.

The goal is not only to make the tests pass, but to produce an implementation that correctly satisfies the intended behavior within the existing codebase.

### 5. Review

Review the generated implementation against the specification, the tests, and the existing codebase.

The AI can produce code that satisfies the tests while still missing architectural expectations. Check responsibilities, naming, consistency with existing patterns, duplication, unnecessary complexity, and dead code.

The review is the final quality gate before the change becomes part of the codebase. It identifies what needs to change; the next step is where that change happens.

### 6. Refactor

Apply the improvements identified during review.

This may mean renaming, restructuring, removing duplication, simplifying logic, or extracting shared code. The AI can carry out a well-scoped refactor quickly, but the human still verifies that behavior hasn't changed and that the result fits the codebase's architecture.

Tests must remain green throughout. If a refactor breaks a test, the refactor is wrong, not the test.

### 7. Commit

Commit only after the implementation has been reviewed, refined, and verified.

Each commit should represent one small, focused, tested change. The commit message should explain the reason behind the change, not only describe the files or code that were modified.

A TDCG cycle ends with a clear, reviewable increment that can be understood independently.


## Why it works

**The test is the contract.** Writing the test before implementation forces the behavior and interface to be defined first. TDCG applies the same discipline as TDD while changing who produces the initial implementation.

**Small cycles reduce drift.** One behavior per cycle keeps the specification, generated code, and review scope small enough to understand. Short feedback loops make corrections cheaper.

**Review is the quality gate.** Generated code is evaluated against the specification, tests, and existing architecture before it becomes part of the codebase. The review step is a required part of the process, not an optional final check.

## When it works best

* Adding behavior to an existing component with established patterns
* Implementing changes that fit the current architecture and conventions
* Tasks where the expected behavior is clear but implementation effort is significant

## When to be careful

* Greenfield design without existing patterns or architectural direction
* Complex architectural decisions where the solution space is still undefined
* Performance-critical code where correctness depends on optimization beyond typical implementation patterns

## Real examples, not theory

This method was developed and refined while building a real production platform.

The articles here document decisions from that codebase: scope adjustments, design choices, naming decisions, refactorings, review findings, and cases where generated code required a different approach. Each example captures not only what changed, but the reasoning behind the decision.
