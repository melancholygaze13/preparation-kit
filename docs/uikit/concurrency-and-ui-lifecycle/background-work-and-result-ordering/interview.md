---
title: "Background Work and Result Ordering: Interview Questions"
domain: "UIKit"
topic: "Concurrency and UI Lifecycle"
concept: "Background Work and Result Ordering"
page_type: interview
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-08-12
---

# Background Work and Result Ordering: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why do async results need ordering protection?](#q1-ordering-protection) | Senior | Stale results |
| [How do you reject stale results?](#q2-reject-stale-results) | Senior | Generation and identity |
| [When would you use a task group?](#q3-task-groups) | Staff | Structured concurrency |
| [How do you prevent background work from hurting UI performance?](#q4-ui-performance) | Staff | Resource control |

---

<a id="q1-ordering-protection"></a>
## Q1: Why do async results need ordering protection?

### Short Answer

Async work may finish in a different order than the user started it. Without
ordering protection, an older result can overwrite newer screen state.

### Expanded Answer

A common example is search. The user types `"ap"` and then `"apple"`. If the
`"ap"` request finishes last and directly renders its result, the screen shows
old data. The UI should only accept results that still match current state.

---

<a id="q2-reject-stale-results"></a>
## Q2: How do you reject stale results?

### Short Answer

Give each refresh or request an identity. Before applying a result, check that
identity, the current query, item, or page cursor. Cancellation helps, but it is
not enough by itself.

### Expanded Answer

Cancellation is cooperative, and work may finish before it observes
cancellation. I still check whether the result belongs to the current screen or
model state before rendering. For lists, I build updates from accepted model
state instead of arbitrary callback order.

---

<a id="q3-task-groups"></a>
## Q3: When would you use a task group?

### Short Answer

I use a task group for a dynamic batch of related async work that should be
awaited and cancelled as a unit.

### Expanded Answer

For example, loading thumbnails for a set of visible models can use a throwing
task group. If one child throws and the operation should fail, the group can
cancel remaining work. If partial results are acceptable, each child can return
a `Result` and the parent can merge successes and failures.

### Trade-offs

Task groups can start many child tasks eagerly. For large batches, I would limit
concurrency instead of launching every request at once.

---

<a id="q4-ui-performance"></a>
## Q4: How do you prevent background work from hurting UI performance?

### Short Answer

Keep CPU and I/O work outside the main actor, limit concurrency, and publish
only accepted UI state back on the main actor.

### Expanded Answer

Async code can still hurt UI if it runs heavy synchronous work on the main actor
or floods the system with requests. I would move parsing, decoding, and merging
into non-UI services, cap concurrent work where needed, and render one coherent
state update.
