---
title: "Operator Overloading and Compound Assignment: Interview Questions"
domain: "Swift"
topic: "Advanced Operators"
concept: "Operator Overloading and Compound Assignment"
page_type: interview
interview_priority: reference
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Operator Overloading and Compound Assignment: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When is operator overloading appropriate?](#q1-overload-choice) | Senior | Semantic fit |
| [How should `+=` relate to `+`?](#q2-compound-assignment) | Senior | Mutation consistency |

---

<a id="q1-overload-choice"></a>
## Q1: When Is Operator Overloading Appropriate?

### Short Answer

When a familiar symbol has conventional, unsurprising meaning for a value-like domain and its laws,
cost, mutation, and failure match caller expectations. Prefer named methods for side effects, policy,
lossy work, async operations, or meaning that needs labels.

### Expanded Answer

Operators are terse and globally discoverable by symbol, so ambiguity costs are high. Mathematical
vectors, measures, and option sets often fit; network calls and business transitions usually do not.

---

<a id="q2-compound-assignment"></a>
## Q2: How Should `+=` Relate to `+`?

### Short Answer

When both exist, `lhs += rhs` should normally produce the same semantic value as `lhs = lhs + rhs`,
while mutating lhs through `inout` and returning `Void`. Normalization, overflow, and failure policy
must agree.

### Expanded Answer

Implementation may optimize in place, but callers should not observe a different algebra. Test
equivalence and copy-on-write behavior without requiring address identity.
