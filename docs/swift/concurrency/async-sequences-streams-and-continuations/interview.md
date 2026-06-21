---
title: "Async Sequences, Streams, and Continuations: Interview Questions"
domain: "Swift"
topic: "Concurrency"
concept: "Async Sequences, Streams, and Continuations"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Async Sequences, Streams, and Continuations: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How should an async stream define buffering and termination?](#q1-buffering-and-termination) | Staff | Backpressure and cleanup |
| [What invariants apply to checked continuations?](#q2-checked-continuations) | Senior | Exactly-once bridging |

---

<a id="q1-buffering-and-termination"></a>
## Q1: How Should an Async Stream Define Buffering and Termination?

### What It Evaluates

Whether the candidate treats stream lifecycle as an API contract.

### Short Answer

Choose bounded or unbounded buffering from loss and memory requirements, inspect each
`yield` result, and stop the producer idempotently from `onTermination`. Consumer
cancellation is only a signal; iterator and producer behavior must implement cleanup.

### Detailed Answer

`AsyncSequence` does not guarantee producer cancellation. A bounded newest buffer suits
state updates where old values can coalesce; lossless events need actual producer
backpressure or durable storage. `AsyncStream` should not be advertised as implicit broadcast.

### Engineering Trade-offs

- Unbounded buffers preserve bursts but risk memory growth.
- Bounded buffers cap memory but require a drop/coalesce contract.
- Per-subscriber buffers enable broadcast but multiply resource cost.

### Production Scenario

A delegate emits sensor updates faster than UI consumes them. The bridge keeps the newest
sample, records drops, and unregisters the delegate when iteration ends.

### Follow-up Questions

- What does `.terminated` from `yield` mean for the producer?
- How would you implement multicast?

### Strong Answer Signals

- Covers yield results, cleanup races, and consumer cardinality.
- Distinguishes buffering from backpressure.

### Weak Answer Signals

- Claims cancellation is automatic.
- Uses unbounded buffering without a capacity argument.

### Related Theory

- [Core Invariants](theory.md#core-invariants)

---

<a id="q2-checked-continuations"></a>
## Q2: What Invariants Apply to Checked Continuations?

### What It Evaluates

Correct one-shot callback bridging.

### Short Answer

A checked continuation must resume exactly once on every terminal path. Zero resumes
hang the caller; multiple resumes are misuse. Cancellation is not bridged automatically,
so continuation state and the legacy operation handle must resolve races without double resume.

### Detailed Answer

Use throwing continuations when the callback can fail. Prefer a native async API. For
delegates or multiple values, use an async sequence. Unsafe continuations remove diagnostics
and require measured justification; they do not make an incorrect lifecycle correct.

### Engineering Trade-offs

- Checked continuations add misuse diagnostics with negligible relevance at most boundaries.
- Cancellation bridging adds synchronized state but prevents leaked underlying work.

### Production Scenario

A callback may arrive after cancellation. One state machine atomically chooses callback
or cancellation as the single terminal event and ignores the loser after cleanup.

### Follow-up Questions

- What if an API can call back synchronously?
- Why is a continuation wrong for repeated values?

### Strong Answer Signals

- Audits every path and race.
- Keeps bridging at one boundary.

### Weak Answer Signals

- Uses unsafe continuation by default.
- Assumes task cancellation resumes the continuation.

### Related Theory

- [How It Works](theory.md#how-it-works)
