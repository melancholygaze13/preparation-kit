---
title: "Deinitializer Semantics and Lifetime: Interview Questions"
domain: "Swift"
topic: "Deinitialization"
concept: "Deinitializer Semantics and Lifetime"
page_type: interview
interview_priority: situational
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Deinitializer Semantics and Lifetime: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What does deinit guarantee?](#q1-deinit-guarantees) | Senior | Lifetime and superclass cleanup |
| [How does actor isolation affect deinitialization?](#q2-isolated-deinit) | Staff | Swift 6.2 isolation |

---

<a id="q1-deinit-guarantees"></a>
## Q1: What Does deinit Guarantee?

### Short Answer

For a class instance, `deinit` runs automatically immediately before its storage is
deallocated after the last strong ownership is released. It is synchronous, cannot be
called manually, and superclass deinitializers run automatically after subclass cleanup.
It does not guarantee when business work finishes or that retain cycles will break.

### Expanded Answer

The instance remains accessible during teardown but must not escape. Unrelated object
deallocation order is unsuitable for coordination, and async cleanup cannot be awaited.

### Trade-offs

- Deinit provides a final synchronous release hook.
- Explicit lifecycle gives observable completion and error handling.
- Weak ownership can break cycles but must match domain lifetime.

### Example

A subscription is retained by its callback and never deinitializes. Explicit cancellation
plus corrected capture ownership makes release testable.

---

<a id="q2-isolated-deinit"></a>
## Q2: How Does Actor Isolation Affect Deinitialization?

### Short Answer

A normal deinitializer is nonisolated even on an actor-isolated class, so it cannot
access isolated state. Swift supports `isolated deinit` to schedule teardown on the
class's actor when such access is required. It remains synchronous; use an explicit
async shutdown method for work that must suspend.

### Expanded Answer

Isolation fixes executor access, not lifecycle observability. The system should await
shutdown before dropping its final reference rather than relying on isolated teardown.

### Trade-offs

- Isolated deinit safely accesses protected state.
- Scheduling teardown can delay reclamation.
- Explicit async close supports cancellation, errors, and completion.

### Example

A main-actor session must clear actor-owned bookkeeping. Its explicit shutdown performs
business cleanup; isolated deinit provides bounded defensive cleanup.
