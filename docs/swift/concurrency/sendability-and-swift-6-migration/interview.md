---
title: "Sendability and Swift 6 Migration: Interview Questions"
domain: "Swift"
topic: "Concurrency"
concept: "Sendability and Swift 6 Migration"
page_type: interview
interview_priority: core
estimated_read_minutes: 3
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Sendability and Swift 6 Migration: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What do Sendable and @Sendable guarantee?](#q1-sendable-and-sendable-closures) | Senior | Transfer and captures |
| [How do region-based isolation and sending change transfer?](#q2-regions-and-sending) | Staff | Ownership transfer |
| [How would you migrate a large codebase to Swift 6 concurrency?](#q3-strict-concurrency-migration) | Principal | Staged rollout |

---

<a id="q1-sendable-and-sendable-closures"></a>
## Q1: What Do Sendable and @Sendable Guarantee?

### Short Answer

`Sendable` promises a value can cross isolation domains without unsafe shared mutation.
`@Sendable` applies that requirement to a closure and its captures. Neither makes compound
operations atomic or turns an arbitrary mutable reference into thread-safe state.

### Expanded Answer

A struct's complete stored graph must be safe. Immutable final classes may qualify under
the language rules, while mutable reference state needs actor isolation or audited
synchronization. `@unchecked Sendable` is a manual proof, never a diagnostic silencer.

### Trade-offs

- Immutable values simplify reasoning but may copy or require schema evolution.
- Isolated owners add async access.
- Locked unchecked references retain sync APIs with high audit cost.

### Example

A sendable closure captures a mutable cache class. The cache moves behind an actor and
the closure captures an immutable request value.

---

<a id="q2-regions-and-sending"></a>
## Q2: How Do Region-Based Isolation and sending Change Transfer?

### Short Answer

Region-based isolation tracks connected value graphs and can allow a non-sendable value
to cross when it is disconnected from other aliases. A `sending` parameter or result
states that ownership transfers, so the source domain cannot safely keep using aliases afterward.

### Expanded Answer

This is flow-sensitive proof, not blanket sendability. If the value remains connected to
other source state, transfer is rejected. `sending` is appropriate when one-owner handoff
is the API contract; reusable shared references still need sendability and synchronization.

### Trade-offs

- Transfer supports legacy/non-sendable graphs without unchecked promises.
- Callers lose continued access and diagnostics can depend on surrounding alias flow.

### Example

A parser builds a mutable non-sendable graph in one task and sends exclusive ownership
to an actor. The producer retains no aliases after the transfer.

---

<a id="q3-strict-concurrency-migration"></a>
## Q3: How Would You Migrate a Large Codebase to Swift 6 Concurrency?

### Short Answer

Inventory settings and diagnostics for each target. Enable complete checking before
Swift 6 mode. Fix ownership from leaf modules outward, isolate global state, and
add adapters for legacy concurrency boundaries.

### Expanded Answer

Classify diagnostics by real owner rather than applying annotations mechanically. Record
default isolation per module. Use `@preconcurrency` only at audited temporary boundaries,
and require proof plus an expiry for unchecked conformances. Roll out target by target
with compiled client fixtures, TSan/stress lanes, and diagnostic budgets.

### Trade-offs

- Leaf-first rollout reduces downstream churn but may be blocked by dependencies.
- App-first isolation can unlock UI code but leaves adapters at library boundaries.
- Temporary suppressions preserve delivery but accumulate safety debt.

### Example

A mixed app has Swift 5 libraries, a main-actor-default app target, and Combine pipelines.
The migration map records each setting and assigns boundary adapters to module owners.
