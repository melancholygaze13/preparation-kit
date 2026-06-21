---
title: "Disjoint Storage and Value Mutation: Interview Questions"
domain: "Swift"
topic: "Memory Safety"
concept: "Disjoint Storage and Value Mutation"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
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

### What It Evaluates

Knowledge of Swift's disjoint stored-property rule.

### Short Answer

Swift can allow it when they are distinct stored instance properties of a local variable and that
variable is not captured, or is captured only by nonescaping closures. Globals, computed properties,
class-backed storage, and escaping captures do not provide the same static proof.

### Detailed Answer

The rule is about provable storage identity, not names. If the compiler cannot split the whole-value
access safely, use local snapshots, a returned result, or one aggregate mutation.

### Engineering Trade-offs

- Local projections support concise in-place algorithms.
- Aggregate APIs remain stable across representation changes.

### Production Scenario

A local tuple can be balanced with two `inout` fields. Shared application scores instead expose one
`rebalance()` transition on their state owner.

### Follow-up Questions

- Why do computed properties differ?
- What changes when a closure captures the local?

### Strong Answer Signals

- States the local stored-property and nonescaping-capture conditions.

### Weak Answer Signals

- Assumes all struct fields are always independent.

### Related Theory

- [Constraints and Guarantees](theory.md#constraints-and-guarantees)

---

<a id="q2-mutating-self"></a>
## Q2: Why Does a Mutating Method Conflict with Another Access to Self?

### What It Evaluates

Whole-value mutation semantics.

### Short Answer

A mutating value-type method holds write access to the whole `self` for the call. Reading or passing
the same value through another path overlaps that access, even if the method visibly changes one field.

### Detailed Answer

This preserves value invariants and permits implementation changes. Compute external inputs before
the call or return a new aggregate rather than aliasing `self` into its own mutation.

### Engineering Trade-offs

- Whole-value access supports coherent value semantics.
- It restricts reentrant and projection-heavy APIs.

### Production Scenario

A state reducer mutates itself then calls a closure that reads the reducer. Notification moves after
the mutation using an immutable snapshot.

### Follow-up Questions

- Can a nonmutating method overlap?
- How does a class method differ?

### Strong Answer Signals

- Identifies whole-self long-term write access.

### Weak Answer Signals

- Reasons only from fields assigned in source.

### Related Theory

- [Core Invariants](theory.md#core-invariants)

---

<a id="q3-storage-refactor"></a>
## Q3: How Can a Storage Refactor Break Source Behavior?

### What It Evaluates

API evolution awareness.

### Short Answer

Changing local/stored value storage to computed, global, captured, or reference-backed storage can
remove static disjointness, add accessor behavior, or introduce aliases. Existing `inout` call patterns
may stop compiling or trap dynamically.

### Detailed Answer

Public projection-based mutation couples callers to representation. Hide it behind domain methods,
compile clients during migration, and test observers/reentrancy when accessors are introduced.

### Engineering Trade-offs

- Public properties are flexible for simple models.
- Encapsulated transitions preserve evolution and invariants.

### Production Scenario

Two stored settings become computed views over shared storage. A helper taking both `inout` now conflicts,
so callers migrate to one transactional update API.

### Follow-up Questions

- Which downstream fixtures would you compile?
- Can a copy-to-local fix change semantics?

### Strong Answer Signals

- Connects representation to exclusivity and behavior.

### Weak Answer Signals

- Treats stored-to-computed as invisible.

### Related Theory

- [Compatibility and Migration](theory.md#compatibility-and-migration)
