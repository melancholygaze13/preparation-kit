---
title: "Async Work, Lifecycle, and Cancellation: Interview Questions"
domain: "Architecture"
topic: "MVVM"
concept: "Async Work, Lifecycle, and Cancellation"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-08-12
tags:
  - mvvm
  - concurrency
  - cancellation
---

# Async Work, Lifecycle, and Cancellation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Who should own async work in MVVM?](#q1-who-should-own-async-work-in-mvvm) | Senior | Lifetime ownership |
| [How do you prevent stale async results?](#q2-how-do-you-prevent-stale-async-results) | Senior | Cancellation and ordering |
| [Should a view model be `@MainActor`?](#q3-should-a-view-model-be-mainactor) | Senior | Isolation |
| [How do you test async view-model behavior?](#q4-how-do-you-test-async-view-model-behavior) | Senior | Determinism |

---

<a id="q1-who-should-own-async-work-in-mvvm"></a>
## Q1: Who should own async work in MVVM?

### Short Answer

The owner should match the required lifetime. A view model can own screen-scoped load
or search behavior. Work that must survive navigation, be shared, or resume after
termination belongs in a repository, flow owner, or durable operation service. The
view model can observe and present that work.

### Expanded Answer

For SwiftUI, `.task` is a good bridge for work tied to view presence. If the view
model creates a task, it retains the handle and defines replacement and teardown.
Keeping a view model alive only so an upload can finish is a lifetime smell.

<a id="q2-how-do-you-prevent-stale-async-results"></a>
## Q2: How do you prevent stale async results?

### Short Answer

I cancel obsolete work and also guard result acceptance with request identity or the
current input. Cancellation is cooperative, so an old request may still finish. Only
the result matching current user intent may update presentation state.

### Expanded Answer

A main-actor view model still has logical races because each `await` allows other work
to run. Search A can resume after search B. I use `.task(id:)`, a replaceable task, or
an effect owner, then compare an identifier before applying a result.

Cancellation is expected control flow, so I do not display it as an error or let an
old cancellation path clear newer state.

<a id="q3-should-a-view-model-be-mainactor"></a>
## Q3: Should a view model be `@MainActor`?

### Short Answer

Usually yes for a view model that owns observable presentation state. Main-actor
isolation gives state one safe concurrency domain. Async dependencies can perform
their own non-main work; an `await` does not mean all underlying work runs on the
main actor.

### Expanded Answer

I avoid manually dispatching every property update. The type-level annotation makes
the contract compiler-checked. CPU-heavy synchronous work must still move to a
separate concurrent function or actor because blocking main-actor code blocks UI.

Isolation prevents data races, not stale results or invalid transitions. Those still
need state and ordering rules.

<a id="q4-how-do-you-test-async-view-model-behavior"></a>
## Q4: How do you test async view-model behavior?

### Short Answer

I inject async dependencies and control when they complete. Tests drive inputs and
assert state transitions, cancellation, and result ordering without real sleeps or
network calls. If delay is policy, I inject a clock.

### Expanded Answer

I explicitly test an older request completing after a newer one, cancellation near a
suspension point, error versus cancellation, and repeated appearance. Continuations,
fake services, or test clocks let the test choose event order.

For work that outlives the view model, I test the durable owner separately and verify
that a recreated view model can observe current operation state.
