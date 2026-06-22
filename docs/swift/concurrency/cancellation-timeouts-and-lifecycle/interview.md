---
title: "Cancellation, Timeouts, and Lifecycle: Interview Questions"
domain: "Swift"
topic: "Concurrency"
concept: "Cancellation, Timeouts, and Lifecycle"
page_type: interview
interview_priority: core
estimated_read_minutes: 2
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Cancellation, Timeouts, and Lifecycle: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How does cooperative cancellation work?](#q1-cooperative-cancellation) | Senior | Checks and handlers |
| [How should timeouts and owner teardown be designed?](#q2-timeouts-and-teardown) | Staff | Deadlines and cleanup |

---

<a id="q1-cooperative-cancellation"></a>
## Q1: How Does Cooperative Cancellation Work?

### Short Answer

Cancellation sets task state. Structured children inherit the signal, but code stops
only when it checks with `Task.checkCancellation()`, reads `Task.isCancelled`, or calls
a cancellable API. A cancellation handler forwards the signal promptly; it does not kill the task.

### Expanded Answer

CPU loops need periodic checks at safe boundaries. Preserve `CancellationError` instead
of retrying it. Cancellation handlers can race operation setup, so the underlying handle
storage and cancel/start/complete transitions must be synchronized and idempotent.

### Trade-offs

- Frequent checks reduce latency with small overhead.
- Cleanup protects invariants but delays completion.
- Partial results can be useful but need an explicit contract.

### Example

A callback-based upload registers its token after cancellation has already arrived. The
bridge synchronizes token publication and immediately cancels if cancellation won the race.

---

<a id="q2-timeouts-and-teardown"></a>
## Q2: How Should Timeouts and Owner Teardown Be Designed?

### Short Answer

Represent a timeout as a deadline, race cooperative operation and clock sleep, cancel
the loser, and propagate the remaining budget downstream. Owners cancel stored task
handles during replacement or teardown and await/drain work where shutdown correctness requires it.

### Expanded Answer

A nominal timeout is not a hard bound if the operation ignores cancellation because a
structured group waits for children. Cleanup must be idempotent and leave consistent
state. Recreating a full timeout at every layer accidentally expands the end-to-end budget.

### Trade-offs

- Harder shutdown bounds may require dependency-level cancellation or process isolation.
- Awaiting cleanup improves consistency but increases teardown latency.

### Example

A request gets a ten-second deadline. Each service derives remaining duration; database
and network calls receive the same deadline, and telemetry records cancellation drain time.
