---
title: "Async Functions, Suspension, and Executors: Interview Questions"
domain: "Swift"
topic: "Concurrency"
concept: "Async Functions, Suspension, and Executors"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Async Functions, Suspension, and Executors: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is the difference between suspension and blocking?](#q1-suspension-versus-blocking) | Senior | Task and thread use |
| [How do executor inheritance and @concurrent affect execution?](#q2-executor-inheritance) | Staff | Swift 6.2 placement |

---

<a id="q1-suspension-versus-blocking"></a>
## Q1: What Is the Difference Between Suspension and Blocking?

### What It Evaluates

Whether the candidate separates async syntax, thread use, and parallelism.

### Short Answer

Suspension parks the task state and releases its thread for other work. Blocking keeps
the thread occupied while it waits. `async` only permits suspension, `await` marks a
possible suspension, and neither promises a background thread or parallel execution.

### Detailed Answer

An executor schedules synchronous task segments between awaits. The task may resume on
a different thread. Two consecutive awaits remain sequential; independent structured
children are needed for overlap. CPU work does not become nonblocking merely because it
is inside an async function.

### Engineering Trade-offs

- Suspension scales waiting work without one thread per operation.
- Parallel tasks add overhead and resource pressure.
- Blocking can be valid at a narrow synchronous boundary but must not wait on future async work.

### Production Scenario

An async image loader downloads data, then decodes it synchronously on the main actor.
Networking suspends correctly, but decoding still stalls UI and needs an explicit CPU boundary.

### Follow-up Questions

- Can an awaited call complete without suspending?
- Why are thread-ID assertions unsuitable for actor correctness?

### Strong Answer Signals

- Distinguishes tasks, executors, and threads.
- Calls sequential awaits sequential.
- Identifies synchronous CPU regions.

### Weak Answer Signals

- Says async always runs in the background.
- Uses semaphores to bridge async back to sync.

### Related Theory

- [Mental Model](theory.md#mental-model)

---

<a id="q2-executor-inheritance"></a>
## Q2: How Do Executor Inheritance and @concurrent Affect Execution?

### What It Evaluates

Current Swift 6.2 execution semantics and migration awareness.

### Short Answer

With Swift 6.2 caller-actor execution enabled, a plain nonisolated async function stays
on the caller's actor by default. `@concurrent` explicitly moves eligible work to the
concurrent executor. `Task {}` also inherits actor context, so it is not an offload API.

### Detailed Answer

Execution behavior depends on module settings and language mode. Caller-actor execution
reduces unnecessary isolation transfer. Use `@concurrent` for substantial CPU-bound work
with safe inputs/results, not for ordinary I/O that already suspends in framework code.

### Engineering Trade-offs

- Caller-actor execution improves approachable safety but can expose long CPU regions.
- Concurrent execution protects actor responsiveness but adds transfer and scheduling cost.
- Per-module settings complicate cross-target reasoning.

### Production Scenario

An app target defaults to `MainActor`, while a library does not. A shared helper behaves
differently across boundaries; the team records settings and annotates the CPU API explicitly.

### Follow-up Questions

- Why does network I/O not require `@concurrent`?
- How would you migrate a public helper across module settings?

### Strong Answer Signals

- Treats build settings as semantics.
- Uses `@concurrent` selectively.
- Avoids detached tasks as a workaround.

### Weak Answer Signals

- Assumes all nonisolated async functions have identical behavior in every target.
- Equates actor isolation with a fixed thread.

### Related Theory

- [Constraints and Guarantees](theory.md#constraints-and-guarantees)
