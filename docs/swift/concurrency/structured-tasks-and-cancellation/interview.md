---
title: "Structured Tasks and Cancellation: Interview Questions"
domain: "Swift"
topic: "Concurrency"
concept: "Structured Tasks and Cancellation"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Structured Tasks and Cancellation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should you use async let or a task group?](#q1-structured-choice) | Senior | Fixed versus dynamic work |
| [How does cancellation work?](#q2-cooperative-cancellation) | Senior | Ownership and cooperation |

---

<a id="q1-structured-choice"></a>
## Q1: When Should You Use async let or a Task Group?

### What It Evaluates

Structured task selection and capacity judgment.

### Short Answer

Use `async let` for a fixed small set of independent results, often of different types.
Use a task group for a dynamic collection of same-result work, completion-order processing,
or explicit concurrency limits. Both keep child lifetime, errors, and cancellation scoped.

### Detailed Answer

Do not create `Task {}` in a loop. Groups start children eagerly, so bound concurrency
when downstream connections, memory, or rate limits are finite.

### Engineering Trade-offs

- Async let is concise for fixed topology.
- Groups support dynamic fan-out and partial-result policy.
- Limits reduce peak throughput but protect system capacity.

### Production Scenario

Downloading ten thousand images uses a group capped at eight, adding one item as each
completes rather than creating ten thousand tasks at once.

### Follow-up Questions

- What happens when one child throws?
- How do you retain partial results?
- Why avoid unstructured loops?

### Strong Answer Signals

- Chooses by topology.
- Includes capacity limits.
- Defines fail-fast versus partial policy.

### Weak Answer Signals

- Launches unbounded tasks.
- Discards task handles.
- Assumes cancellation stops children immediately.

### Related Theory

- [How It Works](theory.md#how-it-works)

---

<a id="q2-cooperative-cancellation"></a>
## Q2: How Does Cancellation Work?

### What It Evaluates

Understanding of cooperative cancellation and task ownership.

### Short Answer

Cancellation sets a flag and propagates through structured child tasks; code must
cooperate by checking or calling cancellable APIs. Throwing loops use
`Task.checkCancellation()`. Preserve `CancellationError`, clean up at safe points,
and explicitly cancel owned unstructured task handles.

### Detailed Answer

An await does not guarantee cancellation is checked by the callee. CPU loops need
periodic checks. Cancellation is normally lifecycle control, not an alert or retry.

### Engineering Trade-offs

- Frequent checks improve responsiveness but add small overhead.
- Cleanup preserves consistency while delaying exit.
- Unstructured lifetime can be valid but requires explicit ownership.

### Production Scenario

A cancelled search continues a CPU ranking loop. Periodic checks stop it, while the
owner cancels the previous task before starting a new query.

### Follow-up Questions

- Does cancellation terminate a task?
- How is legacy cancellation bridged?
- When is cleanup required before exit?

### Strong Answer Signals

- Calls cancellation cooperative.
- Distinguishes structured propagation and unstructured ownership.
- Handles cancellation separately from failure.

### Weak Answer Signals

- Assumes automatic termination.
- Retries CancellationError.
- Never checks CPU-bound work.

### Related Theory

- [Core Invariants](theory.md#core-invariants)
