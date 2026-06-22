---
title: "Type Design and Initialization: Interview Questions"
domain: "Swift"
topic: "Classes and Structures"
concept: "Type Design and Initialization"
page_type: interview
interview_priority: core
estimated_read_minutes: 5
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - classes
  - structures
  - initialization
  - api-design
---

# Type Design and Initialization: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you choose between a struct and a class?](#q1-struct-or-class) | Senior | Domain semantics and ownership |
| [Why should a public struct not rely on its memberwise initializer?](#q2-memberwise-api) | Senior | Invariants and API resilience |
| [Does a struct guarantee a deep immutable snapshot?](#q3-snapshot-boundary) | Senior | Reference members and observable behavior |
| [How would you migrate a widely used class to a struct?](#q4-semantic-migration) | Staff | System impact and rollout |

---

<a id="q1-struct-or-class"></a>
## Q1: How Do You Choose Between a Struct and a Class?

### Short Answer

Use a struct when the type is an independent value or snapshot and copies should
mutate independently. Use a class when stable instance identity, intentional
sharing, inheritance, or one coordinated lifecycle is part of the model. Prefer the
simpler value model when both are correct, but measure performance rather than
assuming either representation is cheaper.

### Expanded Answer

Ask what assignment must mean, whether two equal instances can still be distinct,
who owns mutation, and whether a resource must be shared. Also inspect members: a
struct containing a mutable class reference may violate snapshot expectations.
Protocol conformance and behavior reuse do not by themselves require a class.

### Trade-offs

- Values localize mutation but may need storage optimization for large workloads.
- References model shared resources directly but introduce alias and lifetime reasoning.
- Actors are a stronger starting point when coordinated concurrent mutation is central.

### Example

A request configuration should remain stable while callers customize copies, so it
is a struct. A network session owns one connection pool and cancellation lifecycle,
so it is a class or actor-backed owner.

---

<a id="q2-memberwise-api"></a>
## Q2: Why Should a Public Struct Not Rely on Its Memberwise Initializer?

### Short Answer

A synthesized memberwise initializer mirrors stored representation, is subject to
access-control and synthesis rules, and does not automatically become a public API.
Even when accessible, making it the contract couples callers to property names and
permits representation-shaped construction. Export explicit initializers or
factories that express intent and validate invariants.

### Expanded Answer

Adding a stored property or initializer can change the synthesized entry point.
An explicit `Percentage(_:)` or `Request.authenticated(...)` remains meaningful when
storage changes and can reject invalid values. Synthesis remains useful for private
implementation types and tests where representation coupling is deliberate.

### Trade-offs

- Synthesis removes boilerplate for local models.
- Explicit construction adds maintenance but stabilizes semantics and validation.
- Factories can hide representation but should not obscure simple valid construction.

### Example

A public retry policy exposes all stored fields. A later backoff representation
change breaks every client. An intent-shaped initializer preserves the contract and
maps old parameters into new storage.

---

<a id="q3-snapshot-boundary"></a>
## Q3: Does a Struct Guarantee a Deep Immutable Snapshot?

### Short Answer

No. Copying a struct copies each field according to that field's semantics. If a
field is a class reference, both structs can refer to the same mutable instance.
`let` prevents mutating the struct through that binding, but it does not transitively
freeze referenced objects. Use value-semantic members, immutable references, or
correct copy-on-write detachment when a real snapshot is required.

### Expanded Answer

The outer declaration does not erase inner reference semantics. This can be a safe
optimization if storage never escapes and every mutation checks uniqueness. Without
that discipline, the type should document sharing rather than promise a snapshot.

### Trade-offs

- Deep independent values simplify reasoning but may copy more data.
- Immutable shared storage can preserve snapshot behavior efficiently.
- Mutable shared storage is suitable only when sharing is intentional and owned.

### Example

A struct state object contains a mutable image cache. Tests copy the state, mutate
the cache, and unexpectedly change both snapshots. Moving the cache behind a separate
owner restores truthful value snapshots.

---

<a id="q4-semantic-migration"></a>
## Q4: How Would You Migrate a Widely Used Class to a Struct?

### Short Answer

First inventory identity, aliasing, observation, mutation, lifecycle, cache, and
concurrency dependencies. Define the intended value contract and stable domain IDs,
introduce a new value boundary or adapter, migrate consumers incrementally, and run
semantic and performance checks in both models. Do not replace the keyword in place;
copies that once shared updates will diverge.

### Expanded Answer

Move authoritative mutation into an owner and publish snapshots. Replace object
identity keys with domain IDs, adapt observation to snapshot publication, and define
how old and new consumers coexist and roll back. Remove the class only after telemetry
and tests show that no caller depends on aliasing or deallocation behavior.

### Trade-offs

- An adapter extends migration time but limits simultaneous breakage.
- Dual models consume memory and demand consistency checks.
- A clean cutover is simpler only when the dependency surface is proven small.

### Example

A shared session model is copied into reducers. The migration first centralizes
writes in a store, emits value snapshots, changes caches to stable IDs, then removes
direct mutation handles feature by feature.
