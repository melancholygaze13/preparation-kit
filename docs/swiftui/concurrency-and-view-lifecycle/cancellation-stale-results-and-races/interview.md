---
title: "Cancellation, Stale Results, and Races: Interview Questions"
domain: "SwiftUI"
topic: "Concurrency and View Lifecycle"
concept: "Cancellation, Stale Results, and Races"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-06-23
tags:
  - cancellation
  - stale-results
  - logical-races
---

# Cancellation, Stale Results, and Races: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What happens when a Swift task is canceled?](#q1-what-happens-when-a-swift-task-is-canceled) | Senior | Cooperative cancellation |
| [How do you prevent stale search results?](#q2-how-do-you-prevent-stale-search-results) | Senior | Relevance and ordering |
| [How should cancellation interact with side effects?](#q3-how-should-cancellation-interact-with-side-effects) | Senior | Commit boundaries |
| [How would you test a race without sleeps?](#q4-how-would-you-test-a-race-without-sleeps) | Staff | Deterministic concurrency tests |

---

<a id="q1-what-happens-when-a-swift-task-is-canceled"></a>
## Q1: What happens when a Swift task is canceled?

### Short Answer

Cancellation sets a flag, runs registered cancellation handlers, and propagates to
structured children. It does not forcibly stop arbitrary code. The operation must
check cancellation or call a cancellation-aware API and then return or throw.

### Expanded Answer

I use `Task.checkCancellation()` at meaningful boundaries in custom work and bridge
legacy cancellation with `withTaskCancellationHandler`. I treat
`CancellationError` as normal control flow, not a user-visible network failure.

Before committing a result I check cancellation and relevance, because cancellation
can arrive after the dependency already completed.

<a id="q2-how-do-you-prevent-stale-search-results"></a>
## Q2: How do you prevent stale search results?

### Short Answer

I cancel the previous request when the query changes and validate the query or a
generation token immediately before committing. Cancellation saves work; the
relevance check guarantees an older response cannot overwrite newer intent.

### Expanded Answer

`.task(id: query)` handles view-scoped replacement well. A model can increment a
generation for every request and commit only when the captured generation remains
current. Cancellation errors leave existing content alone; real errors appear only
if their request is still current.

Debouncing can reduce traffic, but it does not replace the ordering guard. Actor
isolation also does not solve this because the incorrect assignments can be fully
serialized.

### Example

In a test, start A and B, complete B, then complete A. The final phase must still
contain B.

<a id="q3-how-should-cancellation-interact-with-side-effects"></a>
## Q3: How should cancellation interact with side effects?

### Short Answer

Define a commit point. Before it, cancellation can abandon preparation. After an
irreversible operation is accepted, a durable owner may need to finish and reconcile
even if the view disappears. Cancellation does not imply rollback.

### Expanded Answer

For payments, sends, and uploads, I use idempotency and query authoritative state
after uncertain failures. The screen observes the operation but does not necessarily
own its lifetime. Repeating a request after cancellation must not duplicate effects.

For a read-only screen load, cancellation can simply discard the response. The
difference follows product semantics, not the API shape.

### Trade-offs

Letting operations survive navigation preserves user intent but needs durable
progress and recovery. Canceling aggressively saves resources but is wrong after a
commit boundary.

<a id="q4-how-would-you-test-a-race-without-sleeps"></a>
## Q4: How would you test a race without sleeps?

### Short Answer

I inject a controllable dependency whose calls suspend until the test resumes them.
The test chooses completion order, cancels at a known suspension point, and awaits
the actual task. No wall-clock timing is involved.

### Expanded Answer

For stale results, capture continuations or use an async test channel for requests A
and B. Resume B first and assert its value commits; resume A and assert it is
discarded. For cancellation, cancel the production task while the dependency is
suspended and verify no failure or stale state commits.

I also test duplicate calls and shared in-flight work. Tests should observe public
model state or repository events rather than expose actor internals only for tests.

### Trade-offs

Controllable fakes take more setup than sleeps, but they are deterministic, faster,
and can reproduce rare orderings reliably in CI.
