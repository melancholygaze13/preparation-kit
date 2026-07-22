---
title: "Assignment, Arithmetic, and Comparison: Interview Questions"
domain: "Swift"
topic: "Basic Operators"
concept: "Assignment, Arithmetic, and Comparison"
page_type: interview
levels:
  - senior
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-22
---

# Assignment, Arithmetic, and Comparison: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What happens during assignment?](#q1-what-happens-during-assignment) | Senior | Value and reference semantics |
| [How does Swift handle integer overflow and division?](#q2-how-does-swift-handle-integer-overflow-and-division) | Senior | Numeric safety |
| [What is the difference between `==` and `===`?](#q3-what-is-the-difference-between-equality-and-identity) | Senior | Equality and identity |
| [What can make custom equality unsafe?](#q4-what-can-make-custom-equality-unsafe) | Senior | Collection correctness |

---

<a id="q1-what-happens-during-assignment"></a>
## Q1: What Happens During Assignment?

### Short Answer

Assignment copies a value type's stored value. For a class, it copies the
reference, so both variables point to the same instance. Copying a value type
does not deep-copy class references stored inside it.

### Expanded Answer

After assigning an array or struct with true value-semantic state, changing one
outer value does not change the other. Copy-on-write may delay the buffer copy.
Class elements remain shared unless the type defines an explicit deep copy.
Assignment does not provide thread safety.

---

<a id="q2-how-does-swift-handle-integer-overflow-and-division"></a>
## Q2: How Does Swift Handle Integer Overflow and Division?

### Short Answer

Normal integer overflow traps. `&+`, `&-`, and `&*` wrap explicitly. Integer
division truncates toward zero, division by zero traps, and `%` returns a
remainder that may be negative.

### Expanded Answer

Wrapping is correct only when the algorithm defines wrapping behavior. Business
values and offsets usually need validation or checked arithmetic. `%` is not a
mathematical modulo operation for negative inputs, so normalize it when the
result must be nonnegative.

---

<a id="q3-what-is-the-difference-between-equality-and-identity"></a>
## Q3: What Is the Difference Between `==` and `===`?

### Short Answer

`==` compares values through `Equatable`. `===` checks whether two class
references point to the same instance.

### Expanded Answer

Two separate objects can be equal without being identical. Choose `==` for
domain meaning and `===` only when the exact object instance matters.

---

<a id="q4-what-can-make-custom-equality-unsafe"></a>
## Q4: What Can Make Custom Equality Unsafe?

### Short Answer

Equality is unsafe when it is inconsistent or depends on mutable state used for
hashing. Equal values must also have equal hashes during one execution.

### Expanded Answer

If a reference-type key's equality or hash changes while it is stored in a set
or dictionary, lookup can fail. Base identity and hashing on stable fields. Test
reflexivity, symmetry, transitivity, and equal-hash behavior for domain types.
