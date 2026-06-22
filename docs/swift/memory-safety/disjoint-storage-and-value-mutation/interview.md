---
title: "Disjoint Storage and Value Mutation: Interview Questions"
domain: "Swift"
topic: "Memory Safety"
concept: "Disjoint Storage and Value Mutation"
page_type: interview
interview_priority: high
estimated_read_minutes: 3
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Disjoint Storage and Value Mutation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When can two properties be passed `inout` together?](#q1-disjoint-properties) | Senior | Static disjointness |
| [Why does a mutating method conflict with another access to self?](#q2-mutating-self) | Senior | Whole-value access |
| [How can a storage refactor break source behavior?](#q3-storage-refactor) | Staff | Evolution |

---

<a id="q1-disjoint-properties"></a>
## Q1: When Can Two Properties Be Passed `inout` Together?

### Short Answer

Swift can allow it when they are distinct stored instance properties of a local variable and that
variable is not captured, or is captured only by nonescaping closures. Globals, computed properties,
class-backed storage, and escaping captures do not provide the same static proof.

### Expanded Answer

The rule is about provable storage identity, not names. If the compiler cannot split the whole-value
access safely, use local snapshots, a returned result, or one aggregate mutation.

### Trade-offs

- Local projections support concise in-place algorithms.
- Aggregate APIs remain stable across representation changes.

### Example

A local tuple can be balanced with two `inout` fields. Shared application scores instead expose one
`rebalance()` transition on their state owner.

---

<a id="q2-mutating-self"></a>
## Q2: Why Does a Mutating Method Conflict with Another Access to Self?

### Short Answer

A mutating value-type method holds write access to the whole `self` for the call. Reading or passing
the same value through another path overlaps that access, even if the method visibly changes one field.

### Expanded Answer

This preserves value invariants and permits implementation changes. Compute external inputs before
the call or return a new aggregate rather than aliasing `self` into its own mutation.

### Trade-offs

- Whole-value access supports coherent value semantics.
- It restricts reentrant and projection-heavy APIs.

### Example

A state reducer mutates itself then calls a closure that reads the reducer. Notification moves after
the mutation using an immutable snapshot.

---

<a id="q3-storage-refactor"></a>
## Q3: How Can a Storage Refactor Break Source Behavior?

### Short Answer

Changing local/stored value storage to computed, global, captured, or reference-backed storage can
remove static disjointness, add accessor behavior, or introduce aliases. Existing `inout` call patterns
may stop compiling or trap dynamically.

### Expanded Answer

Public projection-based mutation couples callers to representation. Hide it behind domain methods,
compile clients during migration, and test observers/reentrancy when accessors are introduced.

### Trade-offs

- Public properties are flexible for simple models.
- Encapsulated transitions preserve evolution and invariants.

### Example

Two stored settings become computed views over shared storage. A helper taking both `inout` now conflicts,
so callers migrate to one transactional update API.
