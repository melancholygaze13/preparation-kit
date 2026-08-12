---
title: "Retain Cycles, Delegates, and Closure Lifetimes: Interview Questions"
domain: "UIKit"
topic: "Performance, Memory, and Diagnostics"
concept: "Retain Cycles, Delegates, and Closure Lifetimes"
page_type: interview
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-08-12
---

# Retain Cycles, Delegates, and Closure Lifetimes: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What causes a retain cycle in UIKit code?](#q1-retain-cycle-cause) | Senior | Ownership graph reasoning |
| [Why are delegates usually weak?](#q2-weak-delegates) | Senior | Callback ownership |
| [When should a closure capture `self` weakly?](#q3-closure-captures) | Senior | Closure lifetime |
| [How would you diagnose a leaking screen?](#q4-diagnose-leaking-screen) | Staff | Evidence-based debugging |

---

<a id="q1-retain-cycle-cause"></a>
## Q1: What causes a retain cycle in UIKit code?

### Short Answer

A retain cycle happens when two or more objects keep each other alive through
strong references, so ARC never sees the reference count drop to zero.

### Expanded Answer

In UIKit I first draw the ownership graph. A view controller may own a view
model, the view model may own a closure, and that closure may capture the
controller. If all of those edges are strong, popping the controller does not
release the graph.

The fix is to change the edge that should not own the other side. That might be
a weak delegate, a weak closure capture, invalidating a timer, cancelling a task,
or removing an observer token.

---

<a id="q2-weak-delegates"></a>
## Q2: Why are delegates usually weak?

### Short Answer

Delegates are usually weak because they are callback targets, not owned
children. The object sending callbacks should not keep its delegate alive.

### Expanded Answer

A common UIKit relationship is that a controller owns a child view or helper,
and that child calls back through a delegate. If the child also strongly retains
the delegate, the parent and child can retain each other.

I would declare delegate protocols class-bound with `AnyObject` and store the
delegate as `weak`. That makes the ownership rule explicit.

---

<a id="q3-closure-captures"></a>
## Q3: When should a closure capture `self` weakly?

### Short Answer

Capture `self` weakly when the closure may outlive the screen or object, and the
closure does not need to keep that object alive to be correct.

### Expanded Answer

Network callbacks, image-loading completions, timers, notification observers,
and stored tasks are common cases. If the user navigates away, the callback
should usually do nothing instead of extending the screen lifetime.

I would not use `[weak self]` blindly. If the closure is short-lived and owned
outside `self`, a strong capture can be correct. The decision depends on who
retains the closure and how long that owner lives.

---

<a id="q4-diagnose-leaking-screen"></a>
## Q4: How would you diagnose a leaking screen?

### Short Answer

I would reproduce the navigation path, confirm the controller or view model stays
alive after it should be released, then inspect the strong-reference path with
the memory graph debugger or Instruments.

### Expanded Answer

I start with a repeatable path such as push and pop the screen several times.
Then I check whether old instances accumulate. After that I look for the
retaining edge: a delegate, closure, timer, observer token, task, or cache.

The important part is to fix the ownership rule, not just silence the symptom.
For a larger codebase, I would add teardown tests or lightweight leak checks for
screen flows that have had repeated regressions.
