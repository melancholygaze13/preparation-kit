---
title: "Value and Reference Semantics: Interview Questions"
domain: "Swift"
topic: "Classes and Structures"
concept: "Value and Reference Semantics"
page_type: interview
interview_priority: core
estimated_read_minutes: 5
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - value-semantics
  - reference-semantics
  - copy-on-write
  - performance
---

# Value and Reference Semantics: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What changes when assigning a struct versus a class?](#q1-assignment-semantics) | Senior | Observable copy and alias behavior |
| [What is copy-on-write, and what does it guarantee?](#q2-copy-on-write) | Senior | Semantics versus optimization |
| [Why can a value type still expose shared mutation?](#q3-reference-members) | Senior | Nested ownership |
| [How do you evaluate a large value type's performance?](#q4-large-value-performance) | Staff | Evidence-driven representation |

---

<a id="q1-assignment-semantics"></a>
## Q1: What Changes When Assigning a Struct Versus a Class?

### Short Answer

Assigning a struct produces another value whose later mutation is independently
observable. Assigning a class copies a reference, so both references can observe
mutation of one instance. The value operation need not eagerly copy all bytes, and
the class references can be constants while the instance remains mutable.

### Expanded Answer

The same distinction applies at normal parameter boundaries: a value parameter does
not let the callee mutate the caller's binding, while a class parameter can mutate
the shared instance. Nested class members remain references, so independence must be
evaluated across the graph.

### Trade-offs

- Values reduce alias reasoning and suit snapshots.
- References share resources cheaply but require ownership and synchronization.
- Implementation optimizations must preserve the observable contract.

### Example

A function receives a configuration struct and customizes its local copy safely.
The same pattern with a configuration class silently changes global behavior for
all aliases.

---

<a id="q2-copy-on-write"></a>
## Q2: What Is Copy-on-Write, and What Does It Guarantee?

### Short Answer

Copy-on-write lets value copies share backing storage until one mutates. Before
mutation, the implementation checks uniqueness and detaches when storage is shared,
so the other value remains unchanged. Swift standard collections use COW, but
arbitrary structs do not receive it automatically; it does not guarantee zero
copies, thread safety, or fixed performance.

### Expanded Answer

Correctness depends on encapsulation: mutable storage cannot escape and every
mutation path must detach when required. Concurrently mutating the same variable is
still a race; uniqueness checks are not locks.

### Trade-offs

- COW reduces copying for read-heavy values.
- Mutation adds uniqueness checks and possible full detachment.
- Reference storage increases implementation and profiling complexity.

### Example

A large document value is frequently copied for reads and rarely edited. COW reduces
peak work, but benchmarks also cover edit-heavy workloads where every branch detaches.

---

<a id="q3-reference-members"></a>
## Q3: Why Can a Value Type Still Expose Shared Mutation?

### Short Answer

A struct copies its stored fields according to their semantics. A class-typed field
is a reference, so two struct copies can point to one mutable object. Mutation
through that object is then visible from both. Use value-semantic members, immutable
shared storage, or correct COW detachment if independent values are promised.

### Expanded Answer

The declaration remains a value type, but the API may not provide the value behavior
callers infer. The distinction is especially important for snapshot, state, and
`Sendable` boundary types.

### Trade-offs

- Shared immutable storage can be efficient and safe.
- Shared mutable storage may be correct for an explicitly shared handle.
- Deep independence can require copy cost or redesigned ownership.

### Example

Two reducer states share a reference-backed metadata object. Editing historical
state changes current state. Converting metadata to a value restores time-travel
debugging and deterministic tests.

---

<a id="q4-large-value-performance"></a>
## Q4: How Do You Evaluate a Large Value Type's Performance?

### Short Answer

Profile optimized representative workloads before changing semantics. Measure
copied bytes, allocations, ARC traffic, mutation frequency, cache locality, and peak
memory. Compare direct value storage, COW, and a reference owner while preserving
the same observable behavior. Adopt added complexity only when evidence shows a
meaningful system-level improvement.

### Expanded Answer

Microbenchmarks must cover read-heavy, edit-heavy, branching, and concurrency use.
A class rewrite may reduce copying but add allocation, indirection, contention, and
alias bugs. A COW rewrite needs semantic stress tests and instrumentation around
detachment.

### Trade-offs

- Direct values are simple and often cache-friendly.
- COW benefits read-heavy copying but can spike on mutation.
- Shared references reduce copies while adding ownership costs.

### Example

An app blames large state structs for frame drops. Instruments instead shows image
decoding. The team avoids an unnecessary reference migration and optimizes the real
hot path.
