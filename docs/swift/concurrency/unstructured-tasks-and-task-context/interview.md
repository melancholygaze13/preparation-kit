---
title: "Unstructured Tasks and Task Context: Interview Questions"
domain: "Swift"
topic: "Concurrency"
concept: "Unstructured Tasks and Task Context"
page_type: interview
interview_priority: core
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
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

### Short Answer

Prefer structured work. At a necessary synchronous edge, `Task {}` inherits actor
isolation, priority, and task-local values. Use `Task.detached` only when deliberately
shedding that context is part of the contract; it requires sendable captures and explicit ownership.

### Expanded Answer

Neither primitive automatically means background execution. A main-actor `Task` stays
main-actor isolated. Detached tasks lose request metadata and cancellation relationships,
so `@concurrent` or a structured child usually expresses CPU offloading better.

### Trade-offs

- Inheritance preserves isolation and tracing but may retain a latency-sensitive executor.
- Detachment increases independence and proof burden.

### Example

A main-actor task performs image decoding and freezes UI. The fix is an explicit concurrent
CPU API, not detaching a closure that captures view-model state.

---

<a id="q2-task-lifetime-ownership"></a>
## Q2: Who Owns an Unstructured Task's Lifetime?

### Short Answer

A concrete component must store the handle, observe success or failure, cancel it when
superseded or torn down, and prevent stale completion from committing. If no component
can name that policy, the work should be structured or moved to a durable job system.

### Expanded Answer

Unstructured tasks do not inherit parent cancellation. Discarding a throwing handle can
discard its error. Weak capture may avoid one retain cycle but does not provide cancellation,
completion observation, or stale-result protection.

### Trade-offs

- Object-owned tasks fit UI lifetimes but need teardown and replacement policy.
- Process-wide services can own longer tasks but need shutdown and fault reporting.

### Example

Search stores one task, cancels the previous query, handles cancellation separately,
and accepts results only for the current request generation.
