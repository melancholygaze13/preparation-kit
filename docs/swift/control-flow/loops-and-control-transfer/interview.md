---
title: "Loops and Control Transfer: Interview Questions"
domain: "Swift"
topic: "Control Flow"
concept: "Loops and Control Transfer"
page_type: interview
interview_priority: high
estimated_read_minutes: 6
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - loops
  - sequences
  - control-transfer
---

# Loops and Control Transfer: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you choose between for-in, while, and repeat-while?](#q1-loop-selection) | Senior | Traversal and first-pass semantics |
| [Can every Sequence be iterated more than once?](#q2-sequence-consumption) | Senior | Generic iteration contracts |
| [How do break, continue, labels, and fallthrough differ?](#q3-control-transfer) | Senior | Targeted exits and case behavior |
| [How do you make retry and polling loops production-safe?](#q4-production-loops) | Staff | Bounds, cancellation, and operations |

---

<a id="q1-loop-selection"></a>
## Q1: How Do You Choose Between for-in, while, and repeat-while?

### Short Answer

Use `for`-`in` when traversing a sequence, `while` when repetition depends on a
condition that must be checked before any work, and `repeat`-`while` only when the
body is valid and required at least once. For every condition-driven loop, define
how state progresses, how it terminates, and how cancellation or errors exit.

### Expanded Answer

`for`-`in` delegates element production to the sequence's iterator and avoids
manual index boundaries. `while` supports zero executions, which is correct when
the initial state may already be complete or invalid. `repeat` performs one pass
before checking, so it suits “attempt once, then decide whether to repeat,” not
“check whether an attempt is allowed.”

Collection algorithms may be clearer for search or transformation, but an
explicit loop is appropriate for state machines, multiple exits, instrumentation,
or complex error handling.

### Trade-offs

- Direct loops expose control and instrumentation but can accumulate mutable
  state.
- Higher-order algorithms state intent but can obscure cost in complex pipelines.
- `repeat` removes duplicated initial work at the cost of unconditional first
  execution.

### Example

A client retries a request. It uses one explicit attempt followed by a bounded
condition checking retryability, deadline, cancellation, and attempt count.
Using an unconditional `repeat` without those constraints would overload an
already failing service.

---

<a id="q2-sequence-consumption"></a>
## Q2: Can Every Sequence Be Iterated More Than Once?

### Short Answer

No. `Sequence` guarantees that it can produce an iterator, but it does not
guarantee nondestructive or repeatable traversal. A second loop may restart,
resume, be empty, or otherwise depend on the concrete sequence. Require
`Collection` when multiple passes are part of the algorithm, or materialize the
sequence once when the memory and lifetime trade-off is acceptable.

### Expanded Answer

Arrays and other collections support repeated traversal, which can hide this
generic distinction during testing. Stream-like and self-iterating sequences may
consume state. A function constrained only to `Sequence` should make one pass
unless its documentation and concrete type establish more.

Materializing into an Array creates a repeatable snapshot but can consume an
infinite sequence, allocate substantial memory, and delay processing. Strengthen
the generic constraint when repeatability—not ownership—is the real requirement.

### Trade-offs

- `Sequence` accepts streaming and lazy inputs with a weaker contract.
- `Collection` rejects single-pass inputs but enables repeated traversal.
- Materialization stabilizes data at memory and latency cost.

### Example

A validator first calls `contains` and then loops over an `AnySequence` to
process it. The first pass consumes network-decoded elements, so processing misses
them. The implementation folds validation and processing into one pass.

---

<a id="q3-control-transfer"></a>
## Q3: How Do break, continue, Labels, and fallthrough Differ?

### Short Answer

`continue` starts the next iteration of the targeted loop. `break` exits the
targeted loop or switch. Without a label they affect the nearest applicable
statement; a label targets an outer statement explicitly. `fallthrough` is
switch-only and executes the next case body without testing that case's pattern.
It is not a general-purpose way to share case logic.

### Expanded Answer

In a loop containing a switch, an unlabeled `break` inside the switch exits only
the switch. Use a labeled break to exit the outer loop, or extract a function and
return a result when that produces a clearer boundary.

Swift cases already stop after their body. Compound cases combine patterns with
one body. `fallthrough` instead depends on case order and bypasses the next
pattern, so bindings from that pattern are unavailable.

### Trade-offs

- Labels make nested intent explicit but can preserve an over-nested design.
- Function extraction provides a named boundary with call overhead usually
  irrelevant to clarity.
- `fallthrough` supports cumulative actions but tightly couples adjacent cases.

### Example

A parser's switch is inside a byte loop. `break` on a terminator exits only the
switch, so parsing continues past the frame. A labeled break or extracted parsing
function correctly ends the frame scan.

---

<a id="q4-production-loops"></a>
## Q4: How Do You Make Retry and Polling Loops Production-Safe?

### Short Answer

Define a maximum attempt count or deadline, retryable error policy, exponential
backoff with jitter, cancellation behavior, idempotency, concurrency limit,
terminal result, and metrics. Each pass must make progress or wait deliberately.
Centralize the policy so features do not create inconsistent retry storms, and
roll out policy changes as operational changes.

### Expanded Answer

The loop should distinguish permanent failures from transient ones, honor server
retry guidance, and stop on task cancellation or exceeded budget. Backoff reduces
pressure; jitter prevents synchronized clients from retrying together. The
operation needs an idempotency strategy before automatic replay.

Observability should record attempts, delay, elapsed time, exit reason, and final
error. A circuit breaker or shared scheduler may be required when many callers
target the same dependency.

### Trade-offs

- More retries can mask transient faults but increase latency, energy, and load.
- Central policy improves safety but may need per-operation configuration.
- Persistence across launches improves delivery but expands ownership and
  idempotency requirements.

### Example

Thousands of devices poll a recovering endpoint every second. A shared policy
adds capped exponential backoff, jitter, cancellation, server-directed delays,
and rollout telemetry, preventing the clients from extending the outage.
