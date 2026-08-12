---
title: "Cancellation, Stale Results, and Logical Races: Interview Questions"
domain: "Architecture"
topic: "Concurrency, State, and Side Effects"
concept: "Cancellation, Stale Results, and Logical Races"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
tags:
  - cancellation
  - logical-races
  - stale-results
---

# Cancellation, Stale Results, and Logical Races: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How does Swift task cancellation work?](#q1-how-does-swift-task-cancellation-work) | Senior | Cooperative cancellation |
| [How do you prevent stale async results?](#q2-how-do-you-prevent-stale-async-results) | Senior | Commit guards |
| [Why does actor isolation not solve ordering?](#q3-why-does-actor-isolation-not-solve-ordering) | Senior | Logical races |

---

<a id="q1-how-does-swift-task-cancellation-work"></a>
## Q1: How does Swift task cancellation work?

### Short Answer

Cancellation is cooperative. Calling `cancel()` marks the task; the task or an awaited
API must check and stop safely. Structured children receive parent cancellation, while
unstructured tasks need explicit handles. I usually treat `CancellationError` as normal
lifecycle control, not a user-facing failure.

### Expanded Answer

Throwing work uses `Task.checkCancellation()`. Non-throwing work can inspect
`Task.isCancelled`. CPU loops need explicit checks. A cancellation handler can notify a
legacy request handle, but its callback may run concurrently and does not roll back an
external effect that already committed.

<a id="q2-how-do-you-prevent-stale-async-results"></a>
## Q2: How do you prevent stale async results?

### Short Answer

For replaceable work, I cancel the previous task and assign the new attempt a request ID
or generation. Before committing, I check cancellation and confirm that identity still
matches current feature state. Cancellation saves work; the identity check provides
correctness.

### Expanded Answer

Dependencies may ignore cancellation or return just as replacement begins, so a task
handle alone is insufficient. The state owner records the current request identity and
checks it at the commit point on its isolation domain. Domain versions provide the same
protection when several writers can update one record.

### Example

If search B replaces search A, A may still return because its dependency ignored
cancellation. The main-actor model accepts only the result whose request ID is current,
so A cannot overwrite B.

<a id="q3-why-does-actor-isolation-not-solve-ordering"></a>
## Q3: Why does actor isolation not solve ordering?

### Short Answer

Actor isolation prevents simultaneous access to actor state, not incorrect completion
order. An actor method can suspend and allow another operation to run. The feature still
needs a rule such as latest request wins, deduplicate by key, or commit only to an exact
domain version.

### Expanded Answer

Every `await` is a reentrancy point. State read before suspension can be stale when the
method resumes, even though each individual access was serialized. Revalidate the
assumption, compare request or record identity, or store one in-flight operation that
other callers await.

### Trade-offs

Serializing everything may reduce races but can waste capacity and still choose the
wrong winner. Explicit identity allows safe concurrency while keeping the product rule
at the commit boundary.
