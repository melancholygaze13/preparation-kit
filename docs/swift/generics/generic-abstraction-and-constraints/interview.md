---
title: "Generic Abstraction and Constraints: Interview Questions"
domain: "Swift"
topic: "Generics"
concept: "Generic Abstraction and Constraints"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Generic Abstraction and Constraints: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How does a generic parameter differ from an existential?](#q1-generic-versus-existential) | Senior | Type relationships and runtime heterogeneity |
| [How should you choose constraints for a reusable algorithm?](#q2-constraint-selection) | Staff | Minimal capability and semantic laws |

---

<a id="q1-generic-versus-existential"></a>
## Q1: How Does a Generic Parameter Differ from an Existential?

### What It Evaluates

Whether the candidate can choose an abstraction boundary based on retained type information.

### Short Answer

A generic parameter represents one concrete type selected for a call and preserves
relationships involving that type. An existential stores some conforming value behind a
runtime abstraction and may erase relationships callers need. Use generics for static
composition and existentials for intentional runtime heterogeneity.

### Detailed Answer

`func copy<S: Sequence>(_ source: S) -> [S.Element]` retains the exact element relationship.
A value typed `any Sequence` hides its concrete sequence type and may require opening or
additional constraints for operations involving its element. The choice affects storage,
dispatch, API propagation, and substitution rather than being syntax preference.

### Engineering Trade-offs

- Generics enable stronger checking and optimization but spread types through callers.
- Existentials stabilize runtime boundaries but can erase useful equalities and add indirection.

### Production Scenario

A feature stores heterogeneous analytics exporters, so `[any Exporter]` is appropriate.
Its encoding helper remains generic because input and encoded output types must stay related.

### Follow-up Questions

- When would a closure erase enough type information without a protocol?
- Does generic code guarantee specialization?

### Strong Answer Signals

- Connects the choice to relationships and heterogeneity.
- Rejects blanket performance claims.

### Weak Answer Signals

- Says generics are compile-time existentials.
- Chooses solely based on shorter syntax.

### Related Theory

- [Mental Model](theory.md#mental-model)

---

<a id="q2-constraint-selection"></a>
## Q2: How Should You Choose Constraints for a Reusable Algorithm?

### What It Evaluates

Ability to define a minimal, semantically correct generic contract.

### Short Answer

Constrain only the capabilities needed to prove correctness, but include semantic
requirements the type checker cannot enforce in documentation and tests. Avoid concrete
or stronger protocol constraints added only for implementation convenience.

### Detailed Answer

Start from operations used by the body: iteration, equality, ordering, hashing, isolation,
or ownership. Decide whether each is part of the public contract or belongs in a private
adapter. Weak constraints expand valid callers; underconstraints make the body invalid;
overconstraints couple clients and make future generalization a migration problem.

### Engineering Trade-offs

- Narrow capability protocols improve reuse but add abstraction vocabulary.
- Concrete constraints simplify implementation but leak policy and reduce substitutability.

### Production Scenario

A deduplication utility initially requires `Comparable` to sort. If only uniqueness is the
contract, a `Hashable` implementation may be better—or an equality-based variant when
ordering and hashing should not be imposed.

### Follow-up Questions

- How would you test protocol laws?
- Where should `Sendable` be constrained?

### Strong Answer Signals

- Derives constraints from correctness and boundary ownership.
- Covers semantic laws and complexity.

### Weak Answer Signals

- Adds `Hashable`, `Comparable`, or `Sendable` reflexively.
- Treats successful compilation as proof of the full contract.

### Related Theory

- [Core Invariants](theory.md#core-invariants)
