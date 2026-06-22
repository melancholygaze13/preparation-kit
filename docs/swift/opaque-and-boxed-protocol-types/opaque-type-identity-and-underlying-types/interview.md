---
title: "Opaque Type Identity and Underlying Types: Interview Questions"
domain: "Swift"
topic: "Opaque and Boxed Protocol Types"
concept: "Opaque Type Identity and Underlying Types"
page_type: interview
interview_priority: situational
estimated_read_minutes: 3
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Opaque Type Identity and Underlying Types: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Who chooses the type represented by `some P`?](#q1-who-chooses) | Senior | Opaque versus generic direction |
| [Why must opaque return branches have one underlying type?](#q2-one-underlying-type) | Senior | Static identity |
| [When is opaque parameter syntax insufficient?](#q3-opaque-parameter-limits) | Staff | Signature relationships |

---

<a id="q1-who-chooses"></a>
## Q1: Who Chooses the Type Represented by `some P`?

### Short Answer

For `-> some P`, the implementation chooses one hidden concrete type and the caller uses
only `P`. For a declaration parameter `value: some P`, the caller chooses the concrete type;
that spelling is shorthand for an unnamed generic parameter.

### Expanded Answer

Opaque results hide an implementation-owned type while preserving its static identity.
Opaque parameters generalize inputs like ordinary generics. The same keyword is used because
both hide a concrete name, but ownership of the choice follows producer and consumer position.

### Trade-offs

- Result opacity preserves implementation freedom without existential erasure.
- Parameter shorthand is concise but cannot name relationships elsewhere in the signature.

### Example

A UI factory returns one hidden composition using `some View`; an analytics function accepts
`some Encodable` because every caller may provide a different concrete payload.

---

<a id="q2-one-underlying-type"></a>
## Q2: Why Must Opaque Return Branches Have One Underlying Type?

### Short Answer

The caller cannot name the type, but the compiler still tracks one identity so values from
the declaration compose consistently. Different branch types would make that identity depend
on runtime control flow, which is existential rather than opaque semantics.

### Expanded Answer

Branches may return different values of the same concrete type. If implementations differ,
normalize them into one wrapper/composition type or return `any P` when runtime variation is
the actual contract.

### Trade-offs

- One underlying type enables static relationships and optimization opportunities.
- Existential fallback enables runtime variation but erases those relationships.

### Example

A feature-flagged formatter cannot return two formatter structs as `some Formatter`. The team
uses a single enum-backed adapter to preserve opacity or `any Formatter` for plugin replacement.

---

<a id="q3-opaque-parameter-limits"></a>
## Q3: When Is Opaque Parameter Syntax Insufficient?

### Short Answer

Use explicit generic syntax when the same type must appear in multiple parameters, the return
type, a `where` clause, or nested relationships. Separate `some P` parameter occurrences are
independent anonymous generic parameters.

### Expanded Answer

`func compare(_ a: some P, _ b: some P)` does not require `a` and `b` to have the same type.
`func compare<T: P>(_ a: T, _ b: T)` does. Naming `T` makes the relationship part of the API.

### Trade-offs

- Opaque parameters reduce syntax for local one-position constraints.
- Named parameters make relationships and diagnostics explicit.

### Example

A diff function initially uses two opaque parameters and accepts unrelated model types. It is
corrected to one named `T: Diffable` because the algorithm compares same-type identities.
