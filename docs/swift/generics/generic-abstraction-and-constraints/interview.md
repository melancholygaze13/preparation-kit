---
title: "Generic Abstraction and Constraints: Interview Questions"
domain: "Swift"
topic: "Generics"
concept: "Generic Abstraction and Constraints"
page_type: interview
interview_priority: high
estimated_read_minutes: 3
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-07-12
---

# Generic Abstraction and Constraints: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How does a generic parameter differ from an existential?](#q1-generic-versus-existential) | Senior | Type relationships and mixed runtime types |
| [How should you choose constraints for a reusable algorithm?](#q2-constraint-selection) | Staff | Minimal capability and behavior rules |

---

<a id="q1-generic-versus-existential"></a>
## Q1: How Does a Generic Parameter Differ from an Existential?

### Short Answer

A generic parameter represents one concrete type selected for a call and preserves
relationships involving that type. An existential stores some conforming value behind a
runtime abstraction and may hide relationships callers need. Use generics for compile-time
composition and existentials when an API must store mixed concrete types at runtime.

### Expanded Answer

`func copy<S: Sequence>(_ source: S) -> [S.Element]` retains the exact element relationship.
A value typed `any Sequence` hides its concrete sequence type and may require opening or
additional constraints for operations involving its element. The choice affects storage,
dispatch, how types spread through the API, and which values can be substituted. It is
not only a syntax preference.

### Trade-offs

- Generics enable stronger checking and optimization but spread types through callers.
- Existentials stabilize runtime boundaries but can erase useful equalities and add indirection.

### Example

A feature stores mixed-type analytics exporters, so `[any Exporter]` is appropriate.
Its encoding helper remains generic because input and encoded output types must stay related.

---

<a id="q2-constraint-selection"></a>
## Q2: How Should You Choose Constraints for a Reusable Algorithm?

### Short Answer

Require only the capabilities needed for correctness. Document and test behavior
requirements that the type checker cannot enforce. Avoid concrete
or stronger protocol constraints added only for implementation convenience.

### Expanded Answer

Start from operations used by the body: iteration, equality, ordering, hashing, isolation,
or ownership. Decide whether each is part of the public contract or belongs in a private
adapter. Weak constraints allow more callers. Missing constraints make the body invalid.
Overly strong constraints couple clients and make later generalization harder.

### Trade-offs

- Narrow capability protocols improve reuse but add abstraction vocabulary.
- Concrete constraints simplify implementation but leak policy and allow fewer substitutes.

### Example

A deduplication utility initially requires `Comparable` to sort. If only uniqueness is the
contract, a `Hashable` implementation may be better—or an equality-based variant when
ordering and hashing should not be imposed.
