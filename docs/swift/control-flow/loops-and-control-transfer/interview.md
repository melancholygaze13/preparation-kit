---
title: "Loops and Control Transfer: Interview Questions"
domain: "Swift"
topic: "Control Flow"
concept: "Loops and Control Transfer"
page_type: interview
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
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

### What It Evaluates

Whether the candidate chooses control flow from its semantic contract.

### Short Answer

Use `for`-`in` when traversing a sequence, `while` when repetition depends on a
condition that must be checked before any work, and `repeat`-`while` only when the
body is valid and required at least once. For every condition-driven loop, define
how state progresses, how it terminates, and how cancellation or errors exit.

### Detailed Answer

`for`-`in` delegates element production to the sequence's iterator and avoids
manual index boundaries. `while` supports zero executions, which is correct when
the initial state may already be complete or invalid. `repeat` performs one pass
before checking, so it suits “attempt once, then decide whether to repeat,” not
“check whether an attempt is allowed.”

Collection algorithms may be clearer for search or transformation, but an
explicit loop is appropriate for state machines, multiple exits, instrumentation,
or complex error handling.

### Engineering Trade-offs

- Direct loops expose control and instrumentation but can accumulate mutable
  state.
- Higher-order algorithms state intent but can obscure cost in complex pipelines.
- `repeat` removes duplicated initial work at the cost of unconditional first
  execution.

### Production Scenario

A client retries a request. It uses one explicit attempt followed by a bounded
condition checking retryability, deadline, cancellation, and attempt count.
Using an unconditional `repeat` without those constraints would overload an
already failing service.

### Follow-up Questions

- When is `values.indices` safer than `0..<values.count`?
- Can a while loop execute zero times?
- When would you prefer `first(where:)`?

### Strong Answer Signals

- States zero-pass versus one-pass behavior.
- Includes progress and termination, not only syntax.
- Selects algorithms based on intent and evaluation behavior.

### Weak Answer Signals

- Uses `repeat` merely because the code is shorter.
- Manually indexes every collection.
- Omits termination reasoning.

### Related Theory

- [for-in and Sequence Consumption](theory.md#for-in-and-sequence-consumption)
- [while and repeat-while](theory.md#while-and-repeat-while)

---

<a id="q2-sequence-consumption"></a>
## Q2: Can Every Sequence Be Iterated More Than Once?

### What It Evaluates

Knowledge of `Sequence` versus `Collection` guarantees.

### Short Answer

No. `Sequence` guarantees that it can produce an iterator, but it does not
guarantee nondestructive or repeatable traversal. A second loop may restart,
resume, be empty, or otherwise depend on the concrete sequence. Require
`Collection` when multiple passes are part of the algorithm, or materialize the
sequence once when the memory and lifetime trade-off is acceptable.

### Detailed Answer

Arrays and other collections support repeated traversal, which can hide this
generic distinction during testing. Stream-like and self-iterating sequences may
consume state. A function constrained only to `Sequence` should make one pass
unless its documentation and concrete type establish more.

Materializing into an Array creates a repeatable snapshot but can consume an
infinite sequence, allocate substantial memory, and delay processing. Strengthen
the generic constraint when repeatability—not ownership—is the real requirement.

### Engineering Trade-offs

- `Sequence` accepts streaming and lazy inputs with a weaker contract.
- `Collection` rejects single-pass inputs but enables repeated traversal.
- Materialization stabilizes data at memory and latency cost.

### Production Scenario

A validator first calls `contains` and then loops over an `AnySequence` to
process it. The first pass consumes network-decoded elements, so processing misses
them. The implementation folds validation and processing into one pass.

### Follow-up Questions

- Does type erasure make a sequence repeatable?
- When is Array materialization unsafe?
- What constraint expresses nondestructive traversal?

### Strong Answer Signals

- Explicitly denies a repeated-access guarantee for Sequence.
- Weighs streaming against snapshot costs.
- Avoids testing the generic algorithm only with Array.

### Weak Answer Signals

- Assumes every `for` loop starts from the beginning.
- Copies the sequence value and assumes iterator independence.
- Materializes potentially unbounded input without limits.

### Related Theory

- [for-in and Sequence Consumption](theory.md#for-in-and-sequence-consumption)

---

<a id="q3-control-transfer"></a>
## Q3: How Do break, continue, Labels, and fallthrough Differ?

### What It Evaluates

Precise understanding of control-transfer targets and switch execution.

### Short Answer

`continue` starts the next iteration of the targeted loop. `break` exits the
targeted loop or switch. Without a label they affect the nearest applicable
statement; a label targets an outer statement explicitly. `fallthrough` is
switch-only and executes the next case body without testing that case's pattern.
It is not a general-purpose way to share case logic.

### Detailed Answer

In a loop containing a switch, an unlabeled `break` inside the switch exits only
the switch. Use a labeled break to exit the outer loop, or extract a function and
return a result when that produces a clearer boundary.

Swift cases already stop after their body. Compound cases combine patterns with
one body. `fallthrough` instead depends on case order and bypasses the next
pattern, so bindings from that pattern are unavailable.

### Engineering Trade-offs

- Labels make nested intent explicit but can preserve an over-nested design.
- Function extraction provides a named boundary with call overhead usually
  irrelevant to clarity.
- `fallthrough` supports cumulative actions but tightly couples adjacent cases.

### Production Scenario

A parser's switch is inside a byte loop. `break` on a terminator exits only the
switch, so parsing continues past the frame. A labeled break or extracted parsing
function correctly ends the frame scan.

### Follow-up Questions

- Does fallthrough test the next pattern?
- What does break target inside a switch nested in a loop?
- When is a label a design smell?

### Strong Answer Signals

- Names the exact target behavior.
- States that Swift has no implicit case fallthrough.
- Offers compound cases or extraction for shared behavior.

### Weak Answer Signals

- Treats break as always exiting the function.
- Assumes fallthrough carries matched bindings.
- Adds labels without reducing complex nesting.

### Related Theory

- [continue, break, and Labels](theory.md#continue-break-and-labels)
- [fallthrough](theory.md#fallthrough)

---

<a id="q4-production-loops"></a>
## Q4: How Do You Make Retry and Polling Loops Production-Safe?

### What It Evaluates

Staff-level operational reasoning about repeated external work.

### Short Answer

Define a maximum attempt count or deadline, retryable error policy, exponential
backoff with jitter, cancellation behavior, idempotency, concurrency limit,
terminal result, and metrics. Each pass must make progress or wait deliberately.
Centralize the policy so features do not create inconsistent retry storms, and
roll out policy changes as operational changes.

### Detailed Answer

The loop should distinguish permanent failures from transient ones, honor server
retry guidance, and stop on task cancellation or exceeded budget. Backoff reduces
pressure; jitter prevents synchronized clients from retrying together. The
operation needs an idempotency strategy before automatic replay.

Observability should record attempts, delay, elapsed time, exit reason, and final
error. A circuit breaker or shared scheduler may be required when many callers
target the same dependency.

### Engineering Trade-offs

- More retries can mask transient faults but increase latency, energy, and load.
- Central policy improves safety but may need per-operation configuration.
- Persistence across launches improves delivery but expands ownership and
  idempotency requirements.

### Production Scenario

Thousands of devices poll a recovering endpoint every second. A shared policy
adds capped exponential backoff, jitter, cancellation, server-directed delays,
and rollout telemetry, preventing the clients from extending the outage.

### Follow-up Questions

- Which errors are retryable?
- How do you test timing deterministically?
- What makes a retried write safe?

### Strong Answer Signals

- Covers bounds, cancellation, backoff, jitter, and idempotency.
- Treats retry behavior as a system load policy.
- Includes metrics, rollout, and rollback.

### Weak Answer Signals

- Retries until success with a fixed short delay.
- Ignores cancellation and server feedback.
- Assumes every request can be replayed safely.

### Related Theory

- [Concurrency and Cancellation](theory.md#concurrency-and-cancellation)
- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
