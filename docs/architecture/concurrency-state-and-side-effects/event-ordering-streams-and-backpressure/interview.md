---
title: "Event Ordering, Streams, and Backpressure: Interview Questions"
domain: "Architecture"
topic: "Concurrency, State, and Side Effects"
concept: "Event Ordering, Streams, and Backpressure"
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
  - async-sequence
  - event-ordering
  - backpressure
---

# Event Ordering, Streams, and Backpressure: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What must a stream contract define?](#q1-what-must-a-stream-contract-define) | Senior | Delivery contract |
| [How do you choose a buffering policy?](#q2-how-do-you-choose-a-buffering-policy) | Senior | Overflow policy |
| [Does AsyncStream provide backpressure?](#q3-does-asyncstream-provide-backpressure) | Senior | Producer control |

---

<a id="q1-what-must-a-stream-contract-define"></a>
## Q1: What must a stream contract define?

### Short Answer

It should define event identity, ordering scope, delivery expectations, capacity and
overflow behavior, failure, completion, and subscription cleanup. Saying only that an
API returns `AsyncSequence` leaves the important product guarantees unspecified.

### Expanded Answer

I also state whether the stream is hot or cold and how multiple subscribers behave. If
order matters, I identify the serial producer or sequence authority. Timestamps alone
are usually not a reliable cross-device order.

<a id="q2-how-do-you-choose-a-buffering-policy"></a>
## Q2: How do you choose a buffering policy?

### Short Answer

I choose from event meaning. For replaceable state, I keep the newest one or coalesce.
For short bursts, I use a measured bound. If every event matters, I use real flow control
or durable storage instead of dropping or buffering without limit.

### Expanded Answer

Capacity is part of the product contract. I estimate burst size and acceptable event age,
then define what a full buffer means. Telemetry should record drops or lag. When loss is
not acceptable, acknowledgement and durable replay replace an in-memory convenience
stream.

### Trade-offs

Keeping newest controls latency but loses intermediate events. Keeping oldest preserves
early events but can make the consumer stale. An unbounded buffer avoids immediate drops
at the cost of unbounded memory and growing event age.

<a id="q3-does-asyncstream-provide-backpressure"></a>
## Q3: Does AsyncStream provide backpressure?

### Short Answer

Not necessarily. `AsyncStream` presents async iteration to the consumer and can bound
its buffer, but a synchronous push producer can continue yielding while values are
dropped. Real backpressure requires a producer that can suspend, slow down, reject work,
or wait for demand.

### Expanded Answer

The continuation's `yield` result reports whether a value was enqueued, dropped, or the
stream had terminated, but it does not suspend the producer. The bridge must react to
that result and stop its source on termination. A truly demand-aware source needs a
protocol that can pause or await capacity.

### Example

A connectivity status stream can use `.bufferingNewest(1)`. A payment event stream
cannot silently drop when full; it needs durable records, acknowledgement, replay, and
operational visibility.
