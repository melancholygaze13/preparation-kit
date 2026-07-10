---
title: "Testing Presentation and View Model Logic: Interview Questions"
domain: "UIKit"
topic: "Testing UIKit Features"
concept: "Testing Presentation and View Model Logic"
page_type: interview
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-10
---

# Testing Presentation and View Model Logic: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What would you test outside a UIKit view controller?](#q1-test-boundary) | Senior | Test boundary |
| [How do you test an asynchronous view model reliably?](#q2-async-view-model) | Senior | Deterministic async tests |
| [When would you use a stub, spy, or fake?](#q3-test-doubles) | Senior | Test-double selection |
| [How would you add tests around a large legacy controller?](#q4-legacy-controller) | Staff | Incremental testability |

---

<a id="q1-test-boundary"></a>
## Q1: What would you test outside a UIKit view controller?

### Short Answer

I test validation, formatting, state transitions, request ordering, and routing
policy below UIKit. I keep controller tests for lifecycle wiring, rendering,
target-action, containment, and navigation integration.

### Expanded Answer

I choose the lowest boundary that proves the behavior. A validation table needs a
pure test, not a view hierarchy. A loading state belongs in a view-model test. A
focused controller test proves that a tap sends the command and that state reaches
the correct views. A UI test covers only the critical full journey.

This split gives faster failures and avoids coupling rule tests to UIKit setup.

---

<a id="q2-async-view-model"></a>
## Q2: How do you test an asynchronous view model reliably?

### Short Answer

I inject the async dependency, make the test choose its result and timing, await a
real completion point, and assert the final state. I avoid live services and sleeps.

### Expanded Answer

For success and failure, a closure or stub can return a known value or error. For
race behavior, I use a controllable dependency that suspends requests until the test
releases them. That lets me complete a newer request before an older one and prove
that stale data cannot overwrite current state.

I also test cancellation policy when screen lifetime matters. Cancellation and
stale-result rejection are separate contracts because a dependency may ignore
cancellation.

---

<a id="q3-test-doubles"></a>
## Q3: When would you use a stub, spy, or fake?

### Short Answer

A stub returns controlled values. A spy records an interaction that is part of the
contract. A fake provides a small working implementation, such as in-memory storage.

### Expanded Answer

I choose the simplest double that proves the behavior. A profile loader stub can
return success or failure. A router spy can record a typed route. An in-memory
repository can support several realistic operations without a database.

I avoid mocks that verify every private call in order. They make refactoring harder
without proving more user-visible behavior.

### Trade-offs

A fake gives more realistic integration but has more code and can diverge from the
real implementation. A narrow stub is easier to reason about but proves less about
the adapter contract.

---

<a id="q4-legacy-controller"></a>
## Q4: How would you add tests around a large legacy controller?

### Short Answer

I would protect the highest-risk behavior first, extract one controllable dependency
or presentation rule, and add focused tests without rewriting the whole screen.

### Expanded Answer

I start with bugs, frequently changed rules, and expensive regressions. A thin
characterization test can preserve current controller behavior. I then move one rule
or side effect behind a small boundary and add deterministic tests there.

The controller remains the UIKit adapter during migration. I track suite speed and
flake rate so new coverage stays trustworthy. Shared seams and fixtures should solve
repeated team problems, not impose a new architecture on every screen.

### Trade-offs

Characterization tests may preserve undesirable behavior, but they reduce migration
risk. Broad rewrites can improve structure faster, yet they combine behavior change
with architecture change and make regressions harder to isolate.
