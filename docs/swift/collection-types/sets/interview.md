---
title: "Sets: Interview Questions"
domain: "Swift"
topic: "Collection Types"
concept: "Sets"
page_type: interview
levels:
  - senior
interview_priority: high
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Sets: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [Why does `Set` require `Hashable`?](#q1-why-does-set-require-hashable) | Senior | Lookup mechanics |
| [What contract must equality and hashing satisfy?](#q2-what-contract-must-equality-and-hashing-satisfy) | Senior | Correctness |
| [Why is mutable hash state dangerous?](#q3-why-is-mutable-hash-state-dangerous) | Senior | Stable identity |
| [When should you use a set instead of an array?](#q4-when-should-you-use-a-set-instead-of-an-array) | Senior | Collection choice |

---

<a id="q1-why-does-set-require-hashable"></a>
## Q1: Why Does `Set` Require `Hashable`?

### Short Answer

The hash locates candidate storage efficiently. Equality then confirms whether a
candidate is the same element because different values can share a hash.

---

<a id="q2-what-contract-must-equality-and-hashing-satisfy"></a>
## Q2: What Contract Must Equality and Hashing Satisfy?

### Short Answer

Equal values must have equal hashes during one execution. Equality should also be
reflexive, symmetric, and transitive. Hash collisions between unequal values are valid.

---

<a id="q3-why-is-mutable-hash-state-dangerous"></a>
## Q3: Why Is Mutable Hash State Dangerous?

### Short Answer

If an element's hash changes while stored, the set may search the wrong bucket
and fail to find or remove that element.

---

<a id="q4-when-should-you-use-a-set-instead-of-an-array"></a>
## Q4: When Should You Use a Set Instead of an Array?

### Short Answer

Use a set when uniqueness, membership tests, or set algebra matter more than
order and duplicates. Use an array when order is part of the model.
