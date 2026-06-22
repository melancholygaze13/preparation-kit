---
title: "Bitwise and Overflow Arithmetic: Interview Questions"
domain: "Swift"
topic: "Advanced Operators"
concept: "Bitwise and Overflow Arithmetic"
page_type: interview
interview_priority: reference
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Bitwise and Overflow Arithmetic: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When are overflow operators appropriate?](#q1-wrapping-policy) | Senior | Modular arithmetic |
| [How would you decode a bit field safely?](#q2-bit-field) | Senior | Representation validation |

---

<a id="q1-wrapping-policy"></a>
## Q1: When Are Overflow Operators Appropriate?

### Short Answer

Use `&+`, `&-`, and `&*` only when arithmetic is intentionally modulo the fixed width, such as a
specified hash/checksum or wrapping counter. Use ordinary checked arithmetic, validation, or
reporting-overflow for sizes, money, indexes, and untrusted input.

### Expanded Answer

Wrapping preserves low bits and discards overflow, producing a valid-looking value. It must be part
of the algorithm, not a crash-avoidance patch.

---

<a id="q2-bit-field"></a>
## Q2: How Would You Decode a Bit Field Safely?

### Short Answer

Define width, byte order, masks, signedness, valid combinations, and reserved/unknown-bit policy;
validate length and conversions first; extract with typed masks; then return a nominal validated type.

### Expanded Answer

Golden vectors across implementations catch endianness and shift mistakes. Preserve unknown bits only
when forward compatibility requires round trips; otherwise reject unsupported flags explicitly.
