---
title: "Protocol API Evolution and Isolation: Interview Questions"
domain: "Swift"
topic: "Protocols"
concept: "Protocol API Evolution and Isolation"
page_type: interview
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
---

# Protocol API Evolution and Isolation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you evolve a public protocol safely?](#q1-protocol-evolution) | Staff | External conformers and clients |
| [How should protocol requirements express actor isolation?](#q2-protocol-isolation) | Principal | Swift 6 boundaries |

---

<a id="q1-protocol-evolution"></a>
## Q1: How Do You Evolve a Public Protocol Safely?

### What It Evaluates

Distributed ownership and compatibility reasoning.

### Short Answer

Inventory conformers and generic clients, define semantic and binary constraints, and
prefer a refinement/versioned capability for additive behavior. A defaulted requirement
can reduce source breakage but still changes dispatch, performance, and semantics.

### Detailed Answer

Compile external conformer fixtures across supported toolchains. Stage adoption, deprecate
old capabilities, and track synthesized/conditional/retroactive conformances. Do not turn
a protocol into a coordinated release train by continuously adding unrelated requirements.

### Engineering Trade-offs

- Refinements create more types but isolate migration.
- Direct additions simplify surface but couple all conformers.

### Production Scenario

A storage protocol needs transactions. A refined `TransactionalStorage` capability allows
incremental adoption instead of giving every existing backend a misleading default.

### Follow-up Questions

- When is a default genuinely compatibility-safe?
- How do resilient binary clients change the plan?

### Strong Answer Signals

- Includes conformers, clients, semantics, rollout, and retirement.
- Uses capability refinement deliberately.

### Weak Answer Signals

- Adds defaults until builds pass.
- Tests only the defining module.

### Related Theory

- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)

---

<a id="q2-protocol-isolation"></a>
## Q2: How Should Protocol Requirements Express Actor Isolation?

### What It Evaluates

Concurrency-correct protocol design and migration.

### Short Answer

Requirement isolation must match how witnesses are safely called. A main-actor witness
cannot satisfy a nonisolated synchronous requirement using isolated state. Make the
protocol actor-aware, redesign the call, provide a truthful nonisolated witness, or use
a supported isolated conformance when use is intentionally actor-bound.

### Detailed Answer

`nonisolated`, `@preconcurrency`, and `@unchecked Sendable` are not generic fixes.
Modules can use different default isolation settings, so compile representative cross-module
clients under strict concurrency and record settings as part of the contract.

### Engineering Trade-offs

- Actor-isolated protocols provide safety but restrict callers.
- Nonisolated requirements maximize reach but cannot depend on protected mutable state.
- Isolated conformances preserve actor-bound semantics with limited generic usability.

### Production Scenario

A `@MainActor` model cannot satisfy a nonisolated equality witness over mutable UI state.
The conformance becomes explicitly main-actor isolated and call sites remain on that actor.

### Follow-up Questions

- What does `@preconcurrency` actually change?
- When should a requirement itself be async?

### Strong Answer Signals

- Treats isolation as API semantics.
- Covers per-module settings and migration.

### Weak Answer Signals

- Adds `nonisolated` only to silence diagnostics.
- Assumes `Sendable` provides synchronization.

### Related Theory

- [Core Invariants](theory.md#core-invariants)
