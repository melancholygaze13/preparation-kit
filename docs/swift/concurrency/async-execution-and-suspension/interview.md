---
title: "Async Execution and Suspension: Interview Questions"
domain: "Swift"
topic: "Concurrency"
concept: "Async Execution and Suspension"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Async Execution and Suspension: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Does async mean background execution?](#q1-async-execution) | Senior | Suspension and executors |
| [How should callback APIs be bridged?](#q2-bridging) | Senior | Continuation correctness |

---

<a id="q1-async-execution"></a>
## Q1: Does async Mean Background Execution?

### What It Evaluates

Accurate executor and suspension reasoning.

### Short Answer

No. `async` means a function may suspend. I/O can suspend without blocking a thread,
but synchronous CPU work still occupies the current executor. In Swift 6.2, plain
nonisolated async functions stay on the caller's actor by default; use `@concurrent`
only when CPU work intentionally belongs on the concurrent pool.

### Detailed Answer

Sequential awaits remain sequential. Use structured child tasks for independent work,
and never block an actor with semaphores while waiting for async completion.

### Engineering Trade-offs

- Caller-actor execution reduces unsafe transfers.
- Explicit offloading improves responsiveness for CPU work but adds transfer cost.
- Parallelism helps independent work only within capacity limits.

### Production Scenario

Image decoding inside a main-actor async method freezes UI despite awaits. The CPU
transform moves to an explicit concurrent boundary while UI mutation stays isolated.

### Follow-up Questions

- What does `await` permit?
- When are two awaits concurrent?
- Why is blocking an actor harmful?

### Strong Answer Signals

- Separates async, concurrency, and parallelism.
- Reasons in executors rather than threads.
- Offloads only intended CPU work.

### Weak Answer Signals

- Says every async call uses a background thread.
- Wraps work in detached tasks casually.
- Blocks with a semaphore.

### Related Theory

- [Mental Model](theory.md#mental-model)

---

<a id="q2-bridging"></a>
## Q2: How Should Callback APIs Be Bridged?

### What It Evaluates

Continuation lifecycle and cancellation correctness.

### Short Answer

Prefer a native async API. Otherwise wrap one-shot callbacks with checked continuations
and resume exactly once on every path; zero resumes hang and two trap. Bridge cancellation
to the underlying handle. Use an async sequence for multiple values and stop production
when the consumer terminates.

### Detailed Answer

Keep the bridge at one boundary and preserve actor guarantees in the type system.
Unsafe continuations require measured justification, not convenience.

### Engineering Trade-offs

- Checked continuations catch lifecycle bugs.
- Async streams model repeated events but need buffering/termination policy.
- Legacy cancellation bridges add synchronized handle ownership.

### Production Scenario

A callback omits completion after owner deallocation and hangs callers. The bridge
owns the operation, completes every path, and cancels it on task cancellation.

### Follow-up Questions

- What happens on double resume?
- When is AsyncStream appropriate?
- How should buffer overflow behave?

### Strong Answer Signals

- Audits every completion path.
- Covers cancellation and termination.
- Prefers checked APIs.

### Weak Answer Signals

- Uses unsafe continuations first.
- Ignores callback-never-fires paths.
- Leaks producers after consumers stop.

### Related Theory

- [Engineering Judgment](theory.md#engineering-judgment)
