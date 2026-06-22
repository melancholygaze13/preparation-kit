---
title: "Async Functions, Suspension, and Executors: Interview Questions"
domain: "Swift"
topic: "Concurrency"
concept: "Async Functions, Suspension, and Executors"
page_type: interview
interview_priority: core
estimated_read_minutes: 3
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
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

### Short Answer

Suspension parks the task state and releases its thread for other work. Blocking keeps
the thread occupied while it waits. `async` only permits suspension, `await` marks a
possible suspension, and neither promises a background thread or parallel execution.

### Expanded Answer

An executor schedules synchronous task segments between awaits. The task may resume on
a different thread. Two consecutive awaits remain sequential; independent structured
children are needed for overlap. CPU work does not become nonblocking merely because it
is inside an async function.

### Trade-offs

- Suspension scales waiting work without one thread per operation.
- Parallel tasks add overhead and resource pressure.
- Blocking can be valid at a narrow synchronous boundary but must not wait on future async work.

### Example

An async image loader downloads data, then decodes it synchronously on the main actor.
Networking suspends correctly, but decoding still stalls UI and needs an explicit CPU boundary.

---

<a id="q2-executor-inheritance"></a>
## Q2: How Do Executor Inheritance and @concurrent Affect Execution?

### Short Answer

With Swift 6.2 caller-actor execution enabled, a plain nonisolated async function stays
on the caller's actor by default. `@concurrent` explicitly moves eligible work to the
concurrent executor. `Task {}` also inherits actor context, so it is not an offload API.

### Expanded Answer

Execution behavior depends on module settings and language mode. Caller-actor execution
reduces unnecessary isolation transfer. Use `@concurrent` for substantial CPU-bound work
with safe inputs/results, not for ordinary I/O that already suspends in framework code.

### Trade-offs

- Caller-actor execution improves approachable safety but can expose long CPU regions.
- Concurrent execution protects actor responsiveness but adds transfer and scheduling cost.
- Per-module settings complicate cross-target reasoning.

### Example

An app target defaults to `MainActor`, while a library does not. A shared helper behaves
differently across boundaries; the team records settings and annotates the CPU API explicitly.
