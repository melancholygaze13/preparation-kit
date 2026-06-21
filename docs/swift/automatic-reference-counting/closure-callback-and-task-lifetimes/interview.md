---
title: "Closure, Callback, and Task Lifetimes: Interview Questions"
domain: "Swift"
topic: "Automatic Reference Counting"
concept: "Closure, Callback, and Task Lifetimes"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Closure, Callback, and Task Lifetimes: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When does a closure capture create a cycle?](#q1-closure-cycle) | Senior | Ownership graph |
| [Why should one-shot callbacks clear storage before invocation?](#q2-one-shot-release) | Senior | Reentrancy and release |
| [How can an unstructured task retain an owner indefinitely?](#q3-task-retention) | Staff | Cancellation and suspension |

---

<a id="q1-closure-cycle"></a>
## Q1: When Does a Closure Capture Create a Cycle?

### What It Evaluates

Graph reasoning rather than blanket capture rules.

### Short Answer

A cycle exists when an object strongly owns an escaping closure, that closure strongly captures the
object, and no terminal action removes either edge. A strong capture without the return edge may
correctly extend lifetime but is not itself a cycle.

### Detailed Answer

Inspect who stores the closure and for how long. One-shot completion can own strongly if storage is
cleared reliably. Multi-shot registrations need cancellation. Capture only needed values or choose
weak/unowned when their lifetime contracts are correct.

### Engineering Trade-offs

- Strong capture guarantees dependency availability.
- Weak capture avoids ownership but permits disappearance.

### Production Scenario

A loader retains its completion; the completion captures a controller. The loader clears completion
on success, failure, and cancellation, making strong capture bounded rather than permanent.

### Follow-up Questions

- Can a closure capture a large graph without a cycle?
- What if a framework owns the callback?

### Strong Answer Signals

- Requires a closed strong path.
- Checks all terminal states.

### Weak Answer Signals

- Calls every strong capture a leak.

### Related Theory

- [Mental Model](theory.md#mental-model)

---

<a id="q2-one-shot-release"></a>
## Q2: Why Should One-Shot Callbacks Clear Storage Before Invocation?

### What It Evaluates

Ownership and reentrancy in callback consumption.

### Short Answer

Move the callback to a strong local, clear stored ownership, then invoke. This breaks possible cycles
at the terminal transition, keeps the callback alive during execution, and defines what reentrant
registration observes.

### Detailed Answer

The transition must be isolated or synchronized. Clearing afterward leaves the old callback stored
during reentrancy and can overwrite a newly registered callback. Clearing without a local may release
captures before invocation.

### Engineering Trade-offs

- Pre-clearing provides precise one-shot semantics.
- It requires an explicit policy for reentrant registration and concurrent callers.

### Production Scenario

A completion registers the next request synchronously. Pre-clearing ensures the new callback remains
stored instead of being erased by cleanup after the old callback returns.

### Follow-up Questions

- How would an actor protect this transition?
- What happens when cancellation races with finish?

### Strong Answer Signals

- Mentions the strong local, isolation, and reentrancy.

### Weak Answer Signals

- Sets the callback to nil after invocation without analyzing reentrancy.

### Related Theory

- [How It Works](theory.md#how-it-works)

---

<a id="q3-task-retention"></a>
## Q3: How Can an Unstructured Task Retain an Owner Indefinitely?

### What It Evaluates

Interaction between closure ownership, async suspension, and cancellation.

### Short Answer

The task retains its operation closure and captures until it completes. A strong owner capture—or
a weak capture promoted before a long loop—can keep the owner alive across suspension. If the task
is unbounded or ignores cancellation, `deinit`-based cancellation may never run.

### Detailed Answer

Give the task an explicit lifecycle owner, retain a handle where cancellation is initiated, make the
loop cancellation-aware, and avoid promoting weak self for a wider scope than needed. Move required
work out of transient UI owners.

### Engineering Trade-offs

- Strong task capture preserves work.
- Weak observation allows UI release but cannot own required completion.

### Production Scenario

A screen starts an infinite event-stream task and expects `deinit` to cancel it. The task retains the
screen, so deinit never runs. A coordinator owns the task; the screen observes weakly and unregisters.

### Follow-up Questions

- Does calling `cancel()` immediately release captures?
- How should stream termination be observed?

### Strong Answer Signals

- Explains cooperative cancellation and promotion scope.
- Identifies a durable owner.

### Weak Answer Signals

- Assumes dropping a task handle always stops the task.

### Related Theory

- [Failure Modes](theory.md#failure-modes)
