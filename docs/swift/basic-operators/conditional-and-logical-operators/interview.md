---
title: "Conditional and Logical Operators: Interview Questions"
domain: "Swift"
topic: "Basic Operators"
concept: "Conditional and Logical Operators"
page_type: interview
levels:
  - senior
interview_priority: reference
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Conditional and Logical Operators: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do `&&` and `||` short-circuit?](#q1-how-do-and-or-short-circuit) | Senior | Evaluation order |
| [When should you avoid a ternary expression?](#q2-when-should-you-avoid-a-ternary-expression) | Senior | Readability |

---

<a id="q1-how-do-and-or-short-circuit"></a>
## Q1: How Do `&&` and `||` Short-Circuit?

### Short Answer

`&&` skips its right operand when the left operand is `false`. `||` skips its
right operand when the left operand is `true`.

### Expanded Answer

Operand order affects which work runs. Put a required safety check before the
operation it protects. Avoid important side effects in the right operand because
that expression may not run. Short-circuiting does not make shared state atomic
or thread-safe.

---

<a id="q2-when-should-you-avoid-a-ternary-expression"></a>
## Q2: When Should You Avoid a Ternary Expression?

### Short Answer

Avoid it when either branch has several steps, when ternaries become nested, or
when the condition needs explanation. Use `if` or `switch` instead.

### Expanded Answer

A ternary is useful for one small value choice. Dense conditional expressions
save lines but increase review time and make breakpoints harder to place.
