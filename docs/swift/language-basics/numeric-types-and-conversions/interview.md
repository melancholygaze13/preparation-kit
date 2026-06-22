---
title: "Numeric Types and Conversions: Interview Questions"
domain: "Swift"
topic: "Language Basics"
concept: "Numeric Types and Conversions"
page_type: interview
levels:
  - senior
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Numeric Types and Conversions: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should you use `Int`, `UInt`, or a fixed-width integer?](#q1-which-integer-type-should-you-use) | Senior | Representation |
| [Why are numeric conversions explicit?](#q2-why-are-numeric-conversions-explicit) | Senior | Data loss |
| [How should floating-point values be compared?](#q3-how-should-floating-point-values-be-compared) | Senior | Precision |
| [What happens on integer overflow?](#q4-what-happens-on-integer-overflow) | Senior | Boundary safety |

---

<a id="q1-which-integer-type-should-you-use"></a>
## Q1: When Should You Use `Int`, `UInt`, or a Fixed-Width Integer?

### Short Answer

Use `Int` for ordinary app arithmetic. Use a fixed-width type when an external
format requires it. Use `UInt` for bit patterns or APIs that require it, not only
to describe a nonnegative value.

---

<a id="q2-why-are-numeric-conversions-explicit"></a>
## Q2: Why Are Numeric Conversions Explicit?

### Short Answer

Different numeric types have different ranges and precision. Explicit conversion
makes truncation, sign changes, and overflow risk visible.

### Expanded Answer

Validate untrusted input before narrowing. Use `T(exactly:)` when a lossy
conversion should fail instead of rounding or trapping.

---

<a id="q3-how-should-floating-point-values-be-compared"></a>
## Q3: How Should Floating-Point Values Be Compared?

### Short Answer

Choose a tolerance from the domain and value scale. There is no safe universal
epsilon. Handle `NaN` and infinity when inputs can contain them.

---

<a id="q4-what-happens-on-integer-overflow"></a>
## Q4: What Happens on Integer Overflow?

### Short Answer

Normal Swift integer arithmetic traps on overflow. `&+`, `&-`, and `&*` wrap
explicitly and should be used only when wrapping is intended.
