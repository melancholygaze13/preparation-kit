---
title: "Tuples: Interview Questions"
domain: "Swift"
topic: "Language Basics"
concept: "Tuples"
page_type: interview
levels:
  - senior
interview_priority: reference
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Tuples: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should you use a tuple?](#q1-when-should-you-use-a-tuple) | Senior | Local modeling |
| [When should a tuple become a struct?](#q2-when-should-a-tuple-become-a-struct) | Senior | API design |
| [Why can a comparable tuple not be a `Set` element?](#q3-why-can-a-comparable-tuple-not-be-a-set-element) | Senior | Operators and conformance |

---

<a id="q1-when-should-you-use-a-tuple"></a>
## Q1: When Should You Use a Tuple?

### Short Answer

Use a tuple for a small, temporary group of related values when a named domain
type would add little meaning.

### Expanded Answer

Common examples are a local intermediate result or a private function returning
two values. Labels can make the elements readable but do not create invariants.

---

<a id="q2-when-should-a-tuple-become-a-struct"></a>
## Q2: When Should a Tuple Become a Struct?

### Short Answer

Use a struct when the data has invariants, behavior, documentation, protocol
conformance, or a public contract that may evolve.

---

<a id="q3-why-can-a-comparable-tuple-not-be-a-set-element"></a>
## Q3: Why Can a Comparable Tuple Not Be a `Set` Element?

### Short Answer

Swift provides comparison operators for some tuples, but tuple types do not
conform to `Hashable`. `Set` requires an element type that conforms to `Hashable`.

### Expanded Answer

An available `==` operator is not the same as protocol conformance. Define a
small `Hashable` struct when the value must be used as a set element or key.
