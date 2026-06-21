---
title: "Unstructured Tasks and Task Context: Interview Questions"
domain: "Swift"
topic: "Concurrency"
concept: "Unstructured Tasks and Task Context"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Unstructured Tasks and Task Context: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should you use Task versus Task.detached?](#q1-task-versus-detached) | Senior | Context inheritance |
| [Who owns an unstructured task's lifetime?](#q2-task-lifetime-ownership) | Staff | Handles and teardown |

---

<a id="q1-task-versus-detached"></a>
## Q1: When Should You Use Task Versus Task.detached?

### What It Evaluates

Understanding inherited task context and appropriate escape hatches.

### Short Answer

Prefer structured work. At a necessary synchronous edge, `Task {}` inherits actor
isolation, priority, and task-local values. Use `Task.detached` only when deliberately
shedding that context is part of the contract; it requires sendable captures and explicit ownership.

### Detailed Answer

Neither primitive automatically means background execution. A main-actor `Task` stays
main-actor isolated. Detached tasks lose request metadata and cancellation relationships,
so `@concurrent` or a structured child usually expresses CPU offloading better.

### Engineering Trade-offs

- Inheritance preserves isolation and tracing but may retain a latency-sensitive executor.
- Detachment increases independence and proof burden.

### Production Scenario

A main-actor task performs image decoding and freezes UI. The fix is an explicit concurrent
CPU API, not detaching a closure that captures view-model state.

### Follow-up Questions

- Which task-local values reach a detached task?
- When are immediate-start APIs useful?

### Strong Answer Signals

- Calls detached rare.
- Separates execution placement from lifetime.

### Weak Answer Signals

- Uses detached as the standard background queue.
- Captures non-sendable mutable objects.

### Related Theory

- [How It Works](theory.md#how-it-works)

---

<a id="q2-task-lifetime-ownership"></a>
## Q2: Who Owns an Unstructured Task's Lifetime?

### What It Evaluates

Application-level ownership and error observation.

### Short Answer

A concrete component must store the handle, observe success or failure, cancel it when
superseded or torn down, and prevent stale completion from committing. If no component
can name that policy, the work should be structured or moved to a durable job system.

### Detailed Answer

Unstructured tasks do not inherit parent cancellation. Discarding a throwing handle can
discard its error. Weak capture may avoid one retain cycle but does not provide cancellation,
completion observation, or stale-result protection.

### Engineering Trade-offs

- Object-owned tasks fit UI lifetimes but need teardown and replacement policy.
- Process-wide services can own longer tasks but need shutdown and fault reporting.

### Production Scenario

Search stores one task, cancels the previous query, handles cancellation separately,
and accepts results only for the current request generation.

### Follow-up Questions

- What should happen to a task during deinit?
- How do you expose completion to a test?

### Strong Answer Signals

- Names handle, error, cancellation, and commit owners.
- Distinguishes in-memory work from durable jobs.

### Weak Answer Signals

- Calls fire-and-forget a lifetime policy.
- Relies only on weak captures.

### Related Theory

- [Core Invariants](theory.md#core-invariants)
