---
title: "MainActor and UI State: Interview Questions"
domain: "SwiftUI"
topic: "Concurrency and View Lifecycle"
concept: "MainActor and UI State"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-06-23
tags:
  - main-actor
  - actor-isolation
  - observable
---

# MainActor and UI State: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why isolate a SwiftUI model to MainActor?](#q1-why-isolate-a-swiftui-model-to-mainactor) | Senior | UI state ownership |
| [Does await move work off the main actor?](#q2-does-await-move-work-off-the-main-actor) | Senior | Suspension and execution |
| [Can actor-isolated UI code still have races?](#q3-can-actor-isolated-ui-code-still-have-races) | Senior | Reentrancy and stale state |
| [How would you migrate a large app to strict concurrency?](#q4-how-would-you-migrate-a-large-app-to-strict-concurrency) | Staff | Boundaries and rollout |

---

<a id="q1-why-isolate-a-swiftui-model-to-mainactor"></a>
## Q1: Why isolate a SwiftUI model to MainActor?

### Short Answer

UI-facing mutable state has one serialized owner and SwiftUI accesses it from the
main actor. Marking the model `@MainActor`, unless the target supplies that default,
lets the compiler enforce legal access and makes state transitions predictable.

### Expanded Answer

Isolation is stronger than remembering to dispatch individual assignments. The
whole state machine—loading, success, empty, and failure—has one boundary. Async I/O
can suspend without blocking the actor, then the model validates and commits the
result.

It does not mean every dependency should be main-actor isolated. Shared caches may
use actors, and immutable services may need no actor.

<a id="q2-does-await-move-work-off-the-main-actor"></a>
## Q2: Does await move work off the main actor?

### Short Answer

No. `await` marks a possible suspension. It allows other work to run while the
operation waits, but it does not promise a background thread. Heavy synchronous
work still blocks its executor and must be moved deliberately.

### Expanded Answer

Network I/O normally suspends, so wrapping it in a detached task is unnecessary.
Parsing or image processing may be CPU-heavy. In Swift 6.2, I can design a
nonisolated `@concurrent` function for that work and return a `Sendable` value.

I measure first. Offloading tiny transforms adds isolation crossings without a user
benefit.

<a id="q3-can-actor-isolated-ui-code-still-have-races"></a>
## Q3: Can actor-isolated UI code still have races?

### Short Answer

It prevents memory data races on isolated state, but not logical races. While a
method is suspended, another actor-isolated call can change selection or start a
new request. The first method must revalidate assumptions after `await`.

### Expanded Answer

If search A starts, search B starts, then A finishes last, every assignment can be
main-actor safe while the UI shows the wrong results. I compare the requested query,
use a generation token, or cancel and validate before commit.

I capture inputs before suspension and perform a small atomic state transition on
return rather than spreading partial mutation across several awaits.

### Example

After `let results = await client.search(query)`, guard that `query == currentQuery`
before assigning `self.results`.

<a id="q4-how-would-you-migrate-a-large-app-to-strict-concurrency"></a>
## Q4: How would you migrate a large app to strict concurrency?

### Short Answer

I inventory module build settings and mutable ownership, define isolation at public
boundaries, make transferred models `Sendable`, then migrate feature slices with
tests and diagnostics. I do not use unchecked conformance as a general escape hatch.

### Expanded Answer

UI models move to main-actor isolation, shared mutable services get an explicit
actor or synchronization strategy, and stateless dependencies remain simple. I align
default actor isolation across targets or document deliberate differences.

I track temporary compatibility annotations with owners and removal dates. Runtime
profiling accompanies compiler cleanup because isolation correctness does not detect
main-actor stalls or stale-result logic.

### Trade-offs

A flag-day migration gives consistency but creates large review and release risk.
Incremental migration is safer, but mixed boundaries require clear adapters and can
leave warnings normalized unless progress is measured.
