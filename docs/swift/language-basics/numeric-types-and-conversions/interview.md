---
title: "Numeric Types and Conversions: Interview Questions"
domain: "Swift"
topic: "Language Basics"
concept: "Numeric Types and Conversions"
page_type: interview
levels:
  - senior
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
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
| [What must you check before converting floating point to an integer?](#q5-floating-point-to-integer) | Senior | Conversion safety |

---

<a id="q1-which-integer-type-should-you-use"></a>
## Q1: When Should You Use `Int`, `UInt`, or a Fixed-Width Integer?

### Short Answer

Use `Int` for ordinary app arithmetic. Use a fixed-width type when an external
format requires it. Use `UInt` for bit patterns or APIs that require it, not only
to describe a nonnegative value.

### Expanded Answer

`Int` matches the platform's native word size and interoperates naturally with Swift
collection indices. Fixed-width integers make an encoded width explicit. Choosing
`UInt` for counts often adds conversions without preventing an invalid negative value
from entering earlier in the system.

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

### Expanded Answer

Binary floating point cannot represent many decimal fractions exactly. Compare using an
absolute tolerance near zero or a relative tolerance for larger magnitudes, chosen from
the product's acceptable error. Exact equality is still correct for sentinels or values
that are known to be produced identically.

---

<a id="q4-what-happens-on-integer-overflow"></a>
## Q4: What Happens on Integer Overflow?

### Short Answer

Normal Swift integer arithmetic traps on overflow. `&+`, `&-`, and `&*` wrap
explicitly and should be used only when wrapping is intended.

### Expanded Answer

Trapping prevents an invalid result from silently becoming a different number. Use
reporting-overflow APIs when the caller should handle the condition. Wrapping operators
belong in algorithms whose contract is modular arithmetic, such as controlled bit work.

---

<a id="q5-floating-point-to-integer"></a>
## Q5: What Must You Check Before Converting Floating Point to an Integer?

### Short Answer

Check that the value is finite and within the destination integer's range. The
conversion truncates toward zero, and it traps when the value cannot be
represented.

### Expanded Answer

Reject `NaN`, infinity, and out-of-range input before calling the initializer. Decide
whether truncation is the intended domain rule; otherwise round explicitly first. The
check and conversion should happen at the boundary where invalid input can be reported.
