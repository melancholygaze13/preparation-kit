---
title: "Testing Navigation, State, and Side Effects: Interview Questions"
domain: "Architecture"
topic: "Architecture Testing and Testability"
concept: "Testing Navigation, State, and Side Effects"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-11
tags:
  - navigation-testing
  - state-testing
  - side-effects
---

# Testing Navigation, State, and Side Effects: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you test navigation without relying on UI tests?](#q1-how-do-you-test-navigation-without-relying-on-ui-tests) | Senior | Route policy |
| [How do you test asynchronous state deterministically?](#q2-how-do-you-test-asynchronous-state-deterministically) | Senior | Controlled effects |
| [How do you test cancellation and stale results?](#q3-how-do-you-test-cancellation-and-stale-results) | Senior | Effect lifetime |

---

<a id="q1-how-do-you-test-navigation-without-relying-on-ui-tests"></a>
## Q1: How do you test navigation without relying on UI tests?

### Short Answer

I test route decisions as data or commands. State-driven navigation tests assert the
path or presented destination. An imperative coordinator test records commands at an
owned router boundary. I keep focused integration and UI tests for framework translation,
deep-link entry, back behavior, and critical journeys.

### Trade-offs

Pure route tests are fast and cover many cases, but they cannot prove UIKit or SwiftUI
presentation. UI tests provide that confidence at higher runtime and maintenance cost.

<a id="q2-how-do-you-test-asynchronous-state-deterministically"></a>
## Q2: How do you test asynchronous state deterministically?

### Short Answer

I inject the clock, IDs, randomness, and effect ports. The test starts an operation,
asserts the intermediate state, completes the controlled dependency, awaits the public
operation, and asserts the result. I never use a fixed sleep to wait for state.

### Expanded Answer

Async tests should await async production APIs directly. For callback or stream events,
I use an async probe or confirmation and ensure the observed work finishes before the
test scope ends. I also isolate fixtures per test and respect the model's actor boundary.

<a id="q3-how-do-you-test-cancellation-and-stale-results"></a>
## Q3: How do you test cancellation and stale results?

### Short Answer

For cancellation, I suspend the controlled dependency, trigger the public lifecycle
event that cancels work, and verify production code observes cancellation without
showing a normal error. For stale results, I start A then B, complete B before A, and
assert the final state follows the documented ordering policy.

### Expanded Answer

The test must control suspension and completion order. Cancelling a task only sets a
flag; the useful assertion is that the feature stops or ignores owned work correctly.
I also cover retry, duplicate requests, and stream termination when those risks exist.
